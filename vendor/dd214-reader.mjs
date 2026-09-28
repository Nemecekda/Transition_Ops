// Local document reader. Pinned PDF.js 6.3.289 and Tesseract.js/core 7.0.0.
// Own the OCR worker from creation so cancellation also stops initialization.
const BASE = new URL('./', import.meta.url);
const asset = path => new URL(path, BASE).href;
const fail = code => Object.assign(new Error(code), { code });
export function careerPageLayout(lines, width, height) {
  const result = { lines: [], uncertain: false, width, height };
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0 || !Array.isArray(lines)) return { ...result, uncertain:true };
  let count = 0;
  for (const line of lines) {
    if (line.skewed) result.uncertain = true;
    const words = [];
    for (const word of line.words || []) {
      if (count >= 3000) { result.uncertain = true; break; }
      const b = word.bbox;
      count++;
      if (typeof word.text !== 'string' || !b || ![b.x0,b.y0,b.x1,b.y1].every(Number.isFinite) || b.x0 < 0 || b.y0 < 0 || b.x1 > width + 2 || b.y1 > height + 2 || b.x1 <= b.x0 || b.y1 <= b.y0) { result.uncertain = true; continue; }
      words.push({ text: word.text, bbox: { ...b }, confidence: Number.isFinite(word.confidence) ? word.confidence : null });
    }
    words.sort((a,b) => a.bbox.x0 - b.bbox.x0);
    if (words.some((w,i) => i && w.bbox.x0 < words[i-1].bbox.x1 - 2)) result.uncertain = true;
    if (words.length) result.lines.push({ words });
    if (count >= 3000) { result.uncertain = true; break; }
  }
  if (!result.lines.length) result.uncertain = true;
  return result;
}
function ocrLayout(result, width, height) {
  const lines = (result.blocks || []).flatMap(b => (b.paragraphs || []).flatMap(p => p.lines || []));
  return careerPageLayout(lines.map(line => ({ words: line.words, skewed: !!line.baseline && Math.abs(line.baseline.y1-line.baseline.y0) > Math.max(3, Math.abs(line.baseline.x1-line.baseline.x0)*0.08) })), width, height);
}
function pdfLayout(items, width, height) {
  const lines = [];
  for (const item of items) {
    if (typeof item.str !== 'string' || !item.str.trim()) continue;
    const t = item.transform, h = Math.abs(item.height || t[3]);
    const word = { text: item.str, bbox: { x0:t[4], y0:height-t[5]-h, x1:t[4]+item.width, y1:height-t[5] }, confidence:null };
    let line = lines.find(l => Math.abs(l.y-word.bbox.y0) < Math.max(2,h*0.4));
    if (!line) { line={ y:word.bbox.y0, words:[], skewed:false }; lines.push(line); }
    line.words.push(word); if (Math.abs(t[1]) > 0.1 || Math.abs(t[2]) > 0.1) line.skewed=true;
  }
  return careerPageLayout(lines, width, height);
}
function imageDimensions(bytes, png) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (png && bytes.length >= 24) return [view.getUint32(16), view.getUint32(20)];
  let p = 2;
  while (!png && p + 8 < bytes.length) {
    if (bytes[p++] !== 255) break;
    while (bytes[p] === 255) p++;
    const marker = bytes[p++];
    if (marker === 217 || marker === 218) break;
    const length = view.getUint16(p);
    if (length < 2 || p + length > bytes.length) break;
    if ([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)) return [view.getUint16(p + 5), view.getUint16(p + 3)];
    p += length;
  }
  throw fail('IMAGE_INVALID');
}
export async function readCareerDocument(file, { signal, onProgress } = {}) {
  if (!(file instanceof File) || !file.size) throw fail('INVALID_FILE');
  if (file.size > 5 * 1024 * 1024) throw fail('FILE_TOO_LARGE');
  if (signal?.aborted) throw fail('CANCELLED');
  let worker, loading, render, bitmap, canvas, timer, rejectStop, stopped = false, stopCode = '', sequence = 0, total = 0;
  const pending = new Map();
  const pages = [], warnings = [];
  const stopPromise = new Promise((_, reject) => { rejectStop = reject; });
  // Prevent an unhandled rejection when cancellation arrives between awaits.
  stopPromise.catch(() => {});
  const cleanup = () => {
    worker?.terminate(); worker = null;
    render?.cancel(); render = null;
    bitmap?.close(); bitmap = null;
    if (canvas) { canvas.width = 0; canvas.height = 0; canvas = null; }
    if (loading) { loading.destroy().catch(() => {}); loading = null; }
  };
  const stop = code => { if (!stopped) { stopped = true; stopCode = code; cleanup(); rejectStop(fail(code)); } };
  const abort = () => stop('CANCELLED');
  const wait = promise => { if (stopped) throw fail(signal?.aborted ? 'CANCELLED' : 'TIMEOUT'); return Promise.race([promise, stopPromise]); };
  const progress = value => { if (!stopped && typeof onProgress === 'function') { try { onProgress(value); } catch {} } };
  const append = (number, text, method, confidence, layout) => {
    text = text.replace(/\u0000/g, '').trim();
    total += text.length;
    if (text.length > 15000 || total > 40000) throw fail('TEXT_TOO_LONG');
    pages.push({ number, text, method, confidence, layout });
    if (layout?.uncertain) warnings.push('LAYOUT_UNCERTAIN:' + number);
    if (!text) warnings.push('PAGE_NO_TEXT:' + number);
    if (method === 'ocr' && (confidence === null || confidence < 70)) warnings.push('LOW_OCR_CONFIDENCE:' + number);
  };
  const job = (action, payload) => wait(new Promise((resolve, reject) => {
    const jobId = String(++sequence);
    pending.set(jobId, { resolve, reject });
    worker.postMessage({ workerId: 'local-career-reader', jobId, action, payload });
  }));
  const ocr = async bytes => {
    if (!worker) {
      worker = new Worker(asset('tesseract/worker.min.js'));
      worker.onerror = () => { for (const item of pending.values()) item.reject(fail('OCR_FAILED')); pending.clear(); };
      worker.onmessage = ({ data }) => {
        if (data.status === 'progress') { progress({ phase: 'ocr', progress: Number(data.data?.progress) || 0 }); return; }
        const item = pending.get(data.jobId); if (!item) return;
        pending.delete(data.jobId);
        if (data.status === 'resolve') item.resolve(data.data); else item.reject(fail('OCR_FAILED'));
      };
      await job('load', { options: { lstmOnly: true, corePath: asset('tesseract/'), logging: false } });
      await job('loadLanguage', { langs: 'eng', options: { langPath: asset('tesseract/'), cacheMethod: 'none', gzip: true, lstmOnly: true } });
      await job('initialize', { langs: 'eng', oem: 1, config: {} });
    }
    return job('recognize', { image: bytes, options: {}, output: { text: true, blocks: true } });
  };
  const canvasBytes = async () => {
    const blob = await wait(new Promise(resolve => canvas.toBlob(resolve, 'image/png')));
    if (!blob) throw fail('IMAGE_INVALID');
    return new Uint8Array(await wait(blob.arrayBuffer()));
  };
  signal?.addEventListener('abort', abort, { once: true });
  timer = setTimeout(() => stop('TIMEOUT'), 180000);
  try {
    const bytes = new Uint8Array(await wait(file.arrayBuffer()));
    const pdf = bytes[0] === 37 && bytes[1] === 80 && bytes[2] === 68 && bytes[3] === 70 && bytes[4] === 45;
    const png = bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71;
    const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    if (!pdf && !png && !jpeg) throw fail('UNSUPPORTED_FILE');
    if (pdf) {
      warnings.push('PDF_EXTRACTION_MAY_BE_INCOMPLETE');
      const lib = await wait(import('./pdfjs/pdf.min.mjs'));
      lib.GlobalWorkerOptions.workerSrc = asset('pdfjs/pdf.worker.min.mjs');
      loading = lib.getDocument({ data: bytes, stopAtErrors: true, isEvalSupported: false, enableXfa: false, disableAutoFetch: true, disableStream: true, disableRange: true, useSystemFonts: true, standardFontDataUrl: asset('pdfjs/standard_fonts/'), wasmUrl: asset('pdfjs/wasm/'), verbosity: 0, maxImageSize: 12000000, canvasMaxAreaInBytes: 12000000 });
      loading.onPassword = () => stop('PASSWORD_PROTECTED');
      const doc = await wait(loading.promise);
      if (doc.numPages > 4) throw fail('TOO_MANY_PAGES');
      for (let number = 1; number <= doc.numPages; number++) {
        progress({ phase: 'reading', page: number, pages: doc.numPages });
        const page = await wait(doc.getPage(number));
        const content = await wait(page.getTextContent());
        let text = content.items.map(item => typeof item.str === 'string' ? item.str + (item.hasEOL ? '\n' : ' ') : '').join('');
        if (text.length > 15000) throw fail('TEXT_TOO_LONG');
        const ops = await wait(page.getOperatorList());
        const hasImages = ops.fnArray.some(fn => [lib.OPS.paintImageXObject, lib.OPS.paintInlineImageXObject, lib.OPS.paintImageMaskXObject, lib.OPS.paintImageXObjectRepeat].includes(fn));
        // A partial text layer/header must never hide a scanned body.
        const natural = page.getViewport({ scale: 1 });
        if (!hasImages && (text.match(/[A-Za-z0-9]/g) || []).length >= 40) append(number, text, 'text', null, pdfLayout(content.items, natural.width, natural.height));
        else {
          const scale = Math.min(2.5, Math.sqrt(3000000 / (natural.width * natural.height)));
          const viewport = page.getViewport({ scale });
          canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.floor(viewport.width)); canvas.height = Math.max(1, Math.floor(viewport.height));
          render = page.render({ canvasContext: canvas.getContext('2d'), viewport, annotationMode: lib.AnnotationMode.DISABLE });
          await wait(render.promise); render = null;
          const result = await ocr(await canvasBytes());
          append(number, result.text || '', 'ocr', Number.isFinite(result.confidence) ? result.confidence : null, ocrLayout(result, canvas.width, canvas.height));
          warnings.push('VERIFY_OCR_PAGE:' + number);
          canvas.width = 0; canvas.height = 0; canvas = null;
        }
        page.cleanup();
      }
    } else {
      const [width, height] = imageDimensions(bytes, png);
      if (!width || !height || width * height > 12000000 || width > 12000 || height > 12000) throw fail('IMAGE_TOO_LARGE');
      bitmap = await wait(createImageBitmap(new Blob([bytes], { type: png ? 'image/png' : 'image/jpeg' })).then(value => { if (stopped) { value.close(); throw fail(stopCode); } return value; }));
      if (bitmap.width * bitmap.height > 12000000) throw fail('IMAGE_TOO_LARGE');
      canvas = document.createElement('canvas');
      const scale = Math.min(1, Math.sqrt(3000000 / (bitmap.width * bitmap.height)));
      canvas.width = Math.max(1, Math.floor(bitmap.width * scale)); canvas.height = Math.max(1, Math.floor(bitmap.height * scale));
      canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close(); bitmap = null;
      const result = await ocr(await canvasBytes());
      append(1, result.text || '', 'ocr', Number.isFinite(result.confidence) ? result.confidence : null, ocrLayout(result, canvas.width, canvas.height));
    }
    return { pages, warnings };
  } catch (error) {
    if (stopped) throw fail(stopCode);
    if (error?.code) throw error;
    throw fail('DOCUMENT_READ_FAILED');
  } finally {
    clearTimeout(timer); signal?.removeEventListener('abort', abort); cleanup(); pending.clear();
  }
}
