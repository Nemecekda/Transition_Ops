'use strict';
// Rendered adverse geometry and real Tab navigation; fixtures remain frozen.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const crypto = require('node:crypto'), Module = require('node:module'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const out = process.env.TOPS_OBSTRUCTION_OUT;
assert(out, 'Set TOPS_OBSTRUCTION_OUT to a new evidence directory');
fs.mkdirSync(out, { recursive: true });
const baseline = process.argv.includes('--baseline');
const runtimeBytes = file => baseline && ['index.html', 'pwa-sw.js'].includes(file)
  ? require('node:child_process').execFileSync('git', ['show', '1b3d270588475fbcb882447b707a2902527ab629:' + file], { cwd: root, maxBuffer: 4 * 1024 * 1024 })
  : fs.readFileSync(path.join(root, file));
const indexBytes = runtimeBytes('index.html'), workerBytes = runtimeBytes('pwa-sw.js');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const fixtureBytes = fs.readFileSync(path.join(root, 'scratchpad/member-return-loop-2026-09-08/fixtures-v1.json'));
assert.equal(sha(fixtureBytes), '59e94221f93c56ba8186de3cf162e018bbf65712f1a912f57433642a8944b9dc');
const fixture = JSON.parse(fixtureBytes);
const helperPath = path.join(root, 'scripts/accessibility-release-regression.js');
const source = fs.readFileSync(helperPath, 'utf8'), tail = source.lastIndexOf('\nrun().catch(');
assert(tail > 0);
const mod = new Module(helperPath, module); mod.filename = helperPath; mod.paths = module.paths;
mod._compile(source.slice(0, tail) + '\nmodule.exports={createBlockingProxy,listen,closeServer,findChrome,launchChrome,stopChrome,evaluate,waitForExpression,delay,dispatchKey};', helperPath);
const h = mod.exports, json = JSON.stringify;
// Each viewport gets a disposable browser, so focus and history cannot leak between cases.
if (!process.env.TOPS_DIAGNOSTIC_WIDTH) {
  const { spawnSync } = require('node:child_process');
  const runs = [375, 320, 812, 640, 901, 1024, 1201].map(width => {
    const childOut = path.join(out, String(width));
    const run = spawnSync(process.execPath, [__filename, ...(baseline ? ['--baseline'] : [])], {
      env: { ...process.env, TOPS_DIAGNOSTIC_WIDTH: String(width), TOPS_OBSTRUCTION_OUT: childOut }, stdio: 'inherit'
    });
    return { width, exit: run.status, evidence: path.join(childOut, 'geometry.json') };
  });
  fs.writeFileSync(path.join(out, 'matrix.json'), json({ runs, pass: runs.every(r => r.exit === 0) }, null, 2) + '\n');
  process.exit(runs.every(r => r.exit === 0) ? 0 : 1);
}
const result = { baseline, started: new Date().toISOString(), fixtureSha256: sha(fixtureBytes), indexSha256: sha(indexBytes), workerSha256: sha(workerBytes), rows: [], externalAttempts: [], functionAttempts: [] };
const app = http.createServer((req, res) => {
  const p = new URL(req.url, 'http://localhost').pathname;
  if (p.startsWith('/.netlify/')) { result.functionAttempts.push(p); return res.writeHead(503).end(); }
  const file = path.resolve(root, '.' + (p === '/' ? '/index.html' : p));
  if (!file.startsWith(root + '/')) return res.writeHead(403).end();
  try { const bytes = file === path.join(root, 'index.html') ? indexBytes : file === path.join(root, 'pwa-sw.js') ? workerBytes : fs.readFileSync(file); res.writeHead(200, { 'Content-Type': { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png' }[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); res.end(bytes); }
  catch (_) { res.writeHead(404).end(); }
});
let chrome, client, origin;
const ev = s => h.evaluate(client, s, true);
const key = async (k, modifiers = 0) => { await h.dispatchKey(client, k, modifiers); await h.delay(70); };
async function viewport(width, height) { await client.send('Emulation.setDeviceMetricsOverride', { width, height, mobile: true, deviceScaleFactor: 1 }); await h.delay(120); }
async function load() {
  const token = crypto.randomUUID();
  const seed = await client.send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__obstructionFixture=${json(token)};localStorage.clear();for(const [k,v] of Object.entries(${json(fixture.cases[0].storage)}))localStorage.setItem(k,v);` });
  await client.send('Page.navigate', { url: origin + '/?tool=dashboard' });
  await h.waitForExpression(client, `window.__obstructionFixture===${json(token)}&&document.readyState==='complete'&&!!document.querySelector('#tops-continue-milestone')`, 'Home', 12000);
  await h.delay(180); await client.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: seed.identifier });
}
async function tabTo(selector) {
  for (let i = 0; i < 180; i++) {
    if (await ev(`document.activeElement.matches(${json(selector)})`)) return i;
    await key('Tab');
  }
  throw Error('Tab target unreachable: ' + selector);
}
// Rect intersections detect even partial label obstruction; nine hit points catch paint overlays.
async function geometry(selector) {
  return ev(`(()=>{const e=document.querySelector(${json(selector)});if(!e)return {missing:true};const r=e.getBoundingClientRect();const rect=x=>({x:x.x,y:x.y,width:x.width,height:x.height,bottom:x.bottom,right:x.right});const blockers=Array.from(document.querySelectorAll('button,[role="button"],.bottom-nav')).filter(b=>b!==e&&!b.contains(e)&&!e.contains(b)&&getComputedStyle(b).position==='fixed').map(b=>({name:b.innerText,rect:b.getBoundingClientRect()})).filter(b=>b.rect.width&&b.rect.height&&Math.min(r.right,b.rect.right)>Math.max(r.left,b.rect.left)&&Math.min(r.bottom,b.rect.bottom)>Math.max(r.top,b.rect.top)).map(b=>({name:b.name,rect:rect(b.rect)}));const points=[.25,.5,.75].flatMap(x=>[.25,.5,.75].map(y=>({x:r.left+x*r.width,y:r.top+y*r.height})));return {rect:rect(r),focused:document.activeElement===e,text:e.innerText,blockers,hits:points.map(p=>{const hit=document.elementFromPoint(p.x,p.y);return { ...p,pass:!!hit&&(hit===e||e.contains(hit)),hit:hit?.innerText?.slice(0,90)};}),nav:rect(document.querySelector('.bottom-nav').getBoundingClientRect()),viewport:{width:innerWidth,height:innerHeight},scrollY,overflow:document.documentElement.scrollWidth>innerWidth};})()`);
}
async function record(name, selector, requireFocus = false) {
  if (requireFocus) await h.waitForExpression(client, `document.activeElement.matches(${json(selector)})`, name + ' focus', 2500).catch(() => {});
  await h.delay(100);
  const g = await geometry(selector);
  g.activeElement = await ev('document.activeElement.outerHTML.slice(0,600)');
  const pass = !g.missing && !g.overflow && !g.blockers.length && g.hits.every(p => p.pass) && (!requireFocus || g.focused);
  result.rows.push({ name, selector, pass, ...g });
  console.log((pass ? 'PASS ' : 'FAIL ') + name);
  fs.writeFileSync(path.join(out, 'geometry.json'), json(result, null, 2) + '\n');
  if (!pass) await screenshot(name.replace(/[^a-z0-9]+/gi, '-'));
}
async function screenshot(name) { const shot = await client.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(out, name + '.png'), Buffer.from(shot.data, 'base64')); }
(async () => {
  const proxy = h.createBlockingProxy();
  try {
    origin = 'http://127.0.0.1:' + await h.listen(app);
    chrome = await h.launchChrome(h.findChrome(), await h.listen(proxy.server)); client = chrome.client;
    client.on('Fetch.requestPaused', e => { const allowed = e.request.url.startsWith(origin + '/') && !e.request.url.includes('/.netlify/') || /^(about|data|blob):/.test(e.request.url); if (!allowed) result.externalAttempts.push(e.request.url); client.send(allowed ? 'Fetch.continueRequest' : 'Fetch.failRequest', allowed ? { requestId: e.requestId } : { requestId: e.requestId, errorReason: 'BlockedByClient' }).catch(() => {}); });
    await Promise.all([client.send('Page.enable'), client.send('Runtime.enable'), client.send('Network.enable'), client.send('Fetch.enable', { patterns: [{ urlPattern: '*' }] })]);
    result.browser = await client.send('Browser.getVersion');
    await client.send('Emulation.setTimezoneOverride', { timezoneId: fixture.timezone });
    await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await client.send('Page.addScriptToEvaluateOnNewDocument', { source: `const OriginalDate=Date;window.Date=class extends OriginalDate{constructor(...a){super(...(a.length?a:[${Date.parse(fixture.clock)}]));}static now(){return ${Date.parse(fixture.clock)};}};` });
    for (const [width, height] of [[375,812],[320,812],[812,375],[640,320],[901,812],[1024,812],[1201,812]].filter(v => !process.env.TOPS_DIAGNOSTIC_WIDTH || v[0] === Number(process.env.TOPS_DIAGNOSTIC_WIDTH))) {
      const label = width + 'x' + height;
      await viewport(1280, 1000); await load();
      await tabTo('#tops-continue-milestone'); await key('Enter');
      await record(label + ' timeline destination', '#tops-plan-milestone', true);
      await tabTo('.bottom-nav button:first-child'); await key('Enter');
      await viewport(width, height);
      await record(label + ' return then resize focus', '#tops-continue-milestone', true);
      await screenshot(label + '-return');
      // Exact adverse vertical position from the hosted report, while preserving responsive width.
      await ev(`document.activeElement.blur();const control=document.querySelector('#tops-continue-milestone').getBoundingClientRect();const navTop=document.querySelector('.bottom-nav').getBoundingClientRect().top;window.scrollBy(0,control.top-${width === 375 ? "706.07" : "Math.min(" + (height - 106) + ",navTop-control.height-8)"});`);
      await h.delay(100);
      await record(label + ' reported scroll geometry', '#tops-continue-milestone');
      await screenshot(label + '-geometry');
      if (width >= 375) await record(label + ' second button reported geometry', '#tops-continue-documents');
      // Restart at this viewport, and reach both controls using ordinary Tab (no forced focus/scroll).
      await load(); await tabTo('#tops-continue-milestone');
      await record(label + ' ordinary Tab milestone', '#tops-continue-milestone', true);
      await key('Tab'); await record(label + ' ordinary Tab documents', '#tops-continue-documents', true);
      await key('Enter'); await record(label + ' documents destination', '#tops-plan-documents', true);
      await tabTo('.bottom-nav button:first-child'); await key('Enter');
      await record(label + ' documents return', '#tops-continue-documents', true);
      await key('Tab', 8); await record(label + ' reverse Tab milestone', '#tops-continue-milestone', true);
      await load(); await tabTo('[title="Send feedback to Dean"]');
      await record(label + ' Feedback keyboard availability', '[title="Send feedback to Dean"]', true);
      await key('Enter');
      result.rows.push({ name: label + ' Feedback opens', pass: await ev("document.body.innerText.includes('SEND FEEDBACK')||!!document.querySelector('[role=dialog]')") });
      await key('Escape');
      // What's New is a real fixed overlay nested inside main: exercise the ancestor guard.
      await load();
      await ev(`(()=>{const control=Array.from(document.querySelectorAll('[role="button"]')).find(e=>e.innerText.includes("WHAT'S NEW"));if(!control)throw Error('Release notes control missing');control.click();})()`);
      await h.waitForExpression(client, `!!document.querySelector('main button[aria-label="Close"]')`, 'Release notes overlay', 2500);
      const dialogBefore = await ev(`(()=>{const control=document.querySelector('main button[aria-label="Close"]');let parent=control,hasFixedAncestor=false;while(parent){if(getComputedStyle(parent).position==='fixed')hasFixedAncestor=true;parent=parent.parentElement;}window.__dialogScrollCalls=[];window.__originalScrollBy=window.scrollBy;window.scrollBy=function(...args){window.__dialogScrollCalls.push(args);return window.__originalScrollBy.apply(this,args);};control.blur();const before=scrollY;control.focus({preventScroll:true});return {hasFixedAncestor,inMain:!!control.closest('main'),before};})()`);
      await h.delay(180);
      const dialogAfter = await ev(`(()=>{const result={after:scrollY,calls:window.__dialogScrollCalls,focused:document.activeElement===document.querySelector('main button[aria-label="Close"]')};window.scrollBy=window.__originalScrollBy;return result;})()`);
      result.rows.push({name:label+' fixed-ancestor dialog leaves page scroll alone',pass:dialogBefore.hasFixedAncestor&&dialogBefore.inMain&&dialogAfter.focused&&dialogBefore.before===dialogAfter.after&&dialogAfter.calls.length===0,...dialogBefore,...dialogAfter});
      await load(); await tabTo('[role="button"]');
      // ASK is found by its user-visible exact name, independent of the layout implementation.
      const askSelector = await ev(`(()=>{const a=Array.from(document.querySelectorAll('[role="button"],button')).find(e=>e.innerText.trim()==='✦ ASK');if(!a)throw Error('ASK missing');a.setAttribute('data-test-ask','');return '[data-test-ask]';})()`);
      await tabTo(askSelector); await record(label + ' ASK keyboard availability', askSelector, true); await key('Enter');
      result.rows.push({ name: label + ' ASK opens', pass: await ev("!!document.querySelector('[aria-label=\"Ask the Transition Navigator\"]')") });
    }
    result.failures = result.rows.filter(r => !r.pass).length;
    result.finished = new Date().toISOString();
    fs.writeFileSync(path.join(out, 'geometry.json'), json(result, null, 2) + '\n');
    assert.equal(result.functionAttempts.length, 0);
    if (baseline) assert(result.failures > 0, 'Negative control must reproduce obstruction');
    else assert.equal(result.failures, 0, 'Obstruction regressions');
  } finally { await h.stopChrome(chrome); await Promise.all([h.closeServer(app), h.closeServer(proxy.server)]); }
})().catch(e => { console.error(e); process.exitCode = 1; });
