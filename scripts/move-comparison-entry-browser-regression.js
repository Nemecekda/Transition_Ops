'use strict';
// Synthetic visit-only budgets. All provider/contact traffic is blocked.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http'), os = require('node:os'), { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..'), source = fs.readFileSync(path.join(__dirname, 'privacy-network-regression.js'), 'utf8');
const h = new Function('fs', 'path', 'os', 'spawn', source.slice(source.indexOf('function findChrome()'), source.indexOf('const PROBE_SCRIPT =')) + '\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs, path, os, spawn);
const requests = [];
const server = http.createServer((req, res) => {
  if (req.url.startsWith('/.netlify/functions/federal-jobs') && req.method === 'GET') { res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ available: false, provider: 'USAJOBS' })); }
  const pathname = new URL(req.url, 'http://localhost').pathname, file = path.join(root, pathname === '/' ? 'index.html' : pathname);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream'); res.end(fs.readFileSync(file));
});
(async () => {
  let chrome;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = 'http://127.0.0.1:' + server.address().port;
    chrome = await h.launchChrome(h.findChrome(), 12);
    const c = chrome.client, ev = expression => h.evaluate(c, expression, true), wait = expression => h.waitForExpression(c, expression, expression, 12000), errors = [];
    const frames = () => ev('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
    await c.send('Page.enable'); await c.send('Runtime.enable');
    c.on('Runtime.exceptionThrown', event => errors.push(event.exceptionDetails.text));
    await c.send('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('tops_onboarded','1');localStorage.setItem('tops_user_status','guard');}catch{}" });
    await c.send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
    c.on('Fetch.requestPaused', async event => {
      requests.push({ url: event.request.url, method: event.request.method, body: event.request.postData || '' });
      const local = event.request.url.startsWith(origin) && (!event.request.url.includes('/.netlify/') || event.request.method === 'GET' && event.request.url.includes('/.netlify/functions/federal-jobs'));
      try { await c.send(local ? 'Fetch.continueRequest' : 'Fetch.failRequest', local ? { requestId: event.requestId } : { requestId: event.requestId, errorReason: 'BlockedByClient' }); } catch {}
    });
    const load = async url => { await c.send('Page.navigate', { url }); await wait('!!document.getElementById("tops-main-content")'); await frames(); };
    const reveal = async id => { await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});if(!n)throw Error('Missing '+${JSON.stringify(id)});const parents=[];for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS'&&!p.open)parents.unshift(p);for(const p of parents)p.querySelector(':scope>summary').click();if(!n.checkVisibility())throw Error('Hidden '+${JSON.stringify(id)});})()`); await frames(); };
    const tap = async id => { await reveal(id); await ev(`document.getElementById(${JSON.stringify(id)}).click()`); await frames(); };
    const input = async (id, value) => { await reveal(id); await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(n,${JSON.stringify(value)});n.dispatchEvent(new Event('input',{bubbles:true}));})()`); await frames(); };
    const nav = async text => { await ev(`[...document.querySelectorAll('[aria-label=Primary] button')].find(n=>n.textContent===${JSON.stringify(text)}).click()`); await frames(); };
    const disk = () => ev('JSON.stringify(Object.keys(localStorage).sort().map(key=>[key,localStorage.getItem(key)]))');
    const values = () => ev('JSON.stringify([...document.querySelectorAll("#tops-move-comparison input")].map(n=>[n.id,n.type==="checkbox"?n.checked:n.value]))');
    const noIntake = async () => assert.equal(await ev('["career-starter-resume","career-gap-target"].some(id=>document.getElementById(id)?.checkVisibility())'), false, 'comparison entry does not require resume or gap intake');
    const oneComparison = async () => { assert.equal(await ev('document.querySelectorAll("#tops-move-comparison").length'), 1); assert.equal(await ev('document.getElementById("tops-move-comparison").checkVisibility()'), true); };
    const openComparison = async entry => {
      if (entry) { await tap(entry); await wait('document.activeElement.id==="tops-move-heading"'); }
      await oneComparison(); await noIntake();
      if (!await ev('document.getElementById("tops-move-comparison").open')) {
        await ev('document.querySelector("#tops-move-comparison>summary").focus()');
        await c.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 });
        await c.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 }); await frames();
      }
      assert.equal(await ev('document.getElementById("tops-move-comparison").open'), true);
    };
    const needed = number => ev(`document.getElementById('tops-move-needed-${number}')?.textContent||''`);
    const searchURL = origin + '/?tool=pathway&view=jobs&role=Data+Analyst&location=53202';
    await load(searchURL);
    for (const width of [320, 375]) for (const theme of ['professional', 'tactical']) {
      await c.send('Emulation.setDeviceMetricsOverride', { width, height: 812, deviceScaleFactor: 1, mobile: true });
      const jobId = await ev(`(()=>{localStorage.clear();localStorage.setItem('tops_onboarded','1');localStorage.setItem('tops_user_status','guard');localStorage.setItem('tops_theme',${JSON.stringify(theme)});const job=topsNewJob();job.role='SYNTHETIC SAVED JOB';job.employer='SYNTHETIC Employer';job.location='Madison, WI';localStorage.setItem('tops_my_jobs_v1',JSON.stringify({version:1,jobs:[job]}));return job.id;})()`);
      await load(searchURL); await wait('document.getElementById("tops-job-role")?.value==="Data Analyst"');
      const before = await disk();
      await ev('window.__moveWrites=[];const priorSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(this===localStorage)__moveWrites.push([k,v]);return priorSet.call(this,k,v);};');
      // First functional assertion provides the negative control: no career intake was completed.
      assert.equal(await ev('!!document.getElementById("tops-job-move")&&document.getElementById("tops-job-move").checkVisibility()'), true, 'job-search users can directly reach the comparison');
      await openComparison('tops-job-move');
      assert.match(await ev('document.getElementById("tops-move-comparison").textContent'), /Data Analyst.*53202/);
      assert.deepEqual(await ev('(()=>{const a=document.getElementById("tops-move-hud");return [a.href,a.target,a.rel,a.referrerPolicy];})()'), ['https://www.huduser.gov/portal/datasets/fmr/smallarea/index.html', '_blank', 'noopener noreferrer', 'no-referrer']);
      assert.equal(await ev('document.getElementById("tops-move-label").value'), '', 'search terms do not silently become budget labels');
      assert.equal(await ev('document.getElementById("tops-move-income").value'), '');
      assert.ok(!(await needed(0)).includes('$0.00'), 'unknown expenses do not become a zero take-home requirement');
      await input('tops-move-expenses', '3500.11');
      assert.match(await needed(0), /\$3,500\.11/); assert.match(await needed(0), /take-home/i);
      assert.match(await ev('document.getElementById("tops-move-results").textContent'), /Add take-home pay/);
      for (const [key, value] of Object.entries({ cash: '5000', label: 'SYNTHETIC-MOVE A', income: '3000.10', moving: '1000' })) await input('tops-move-' + key, value);
      await input('tops-move-service', '600'); await tap('tops-move-include-service');
      assert.match(await needed(0), /\$3,500\.11/); // Optional income never reduces the entered expense amount to cover.
      const optionA = await values();
      await tap('tops-move-option-1'); await input('tops-move-expenses', '0'); assert.match(await needed(1), /\$0\.00/);
      await input('tops-move-expenses', '-1'); assert.ok(!(await needed(1)).includes('$0.00')); assert.ok(!(await needed(1)).includes('$-1'));
      for (const [key, value] of Object.entries({ label: 'SYNTHETIC-MOVE B', income: '4000', expenses: '3000', moving: '6000' })) await input('tops-move-' + key, value);
      const optionB = await values(); assert.match(await needed(1), /\$3,000\.00/);
      assert.match(await needed(1), /take-home needed to cover entered expenses/i);
      assert.match(await ev('document.getElementById("tops-move-income-hint").textContent'), /After taxes and payroll deductions, not a job's advertised salary/, 'the labelled take-home input distinguishes its amount from advertised salary');
      await input('tops-job-role', 'Project Manager'); await input('tops-job-area', 'Chicago, IL');
      assert.equal(await values(), optionB, 'editing the search cannot rebind or reset budget values');
      await tap('tops-my-jobs-open'); await wait('document.getElementById("tops-my-jobs-heading")?.checkVisibility()');
      await ev('document.querySelector("[data-job-review]>summary").click()'); await frames();
      await openComparison('tops-my-job-move-' + jobId); assert.equal(await values(), optionB, 'saved-job review shares the same visit comparison');
      assert.match(await ev('document.getElementById("tops-move-comparison").textContent'), /SYNTHETIC SAVED JOB.*Madison, WI/);
      assert.equal(await ev('document.getElementById("tops-my-jobs-heading").checkVisibility()'), true, 'opening comparison retains the saved-job task');
      await tap('tops-move-option-0'); assert.equal(await values(), optionA);
      assert.equal(await disk(), before);
      await nav('Home'); await nav('Career'); await openComparison(); assert.equal(await values(), optionA);
      await tap('tops-career-find-jobs'); await wait('document.getElementById("tops-job-role")?.checkVisibility()'); await openComparison('tops-job-move');
      await reveal('tops-talent-email');
      assert.deepEqual(await ev('["email","roles","location","note"].map(key=>document.getElementById("tops-talent-"+key).value)'), ['', '', '', '']);
      assert.equal(await ev('document.documentElement.scrollWidth<=innerWidth+1'), true);
      assert.equal(await ev('[...document.querySelectorAll("#tops-move-comparison input")].every(n=>n.labels.length>0)'), true);
      await tap('tops-move-clear'); await wait('document.activeElement.id==="tops-move-cash"');
      assert.equal(await ev('[...document.querySelectorAll("#tops-move-comparison input")].every(n=>n.type==="checkbox"?!n.checked:!n.value)'), true);
      assert.deepEqual(await ev('__moveWrites'), []); assert.equal(await disk(), before);
      await input('tops-move-cash', '1234.56'); await load(searchURL); await openComparison('tops-job-move');
      assert.equal(await ev('document.getElementById("tops-move-cash").value'), ''); assert.equal(await disk(), before);
      assert.equal(await ev('location.href.includes("SYNTHETIC-MOVE")'), false);
      await load(origin + '/?tool=pathway'); await wait('document.getElementById("tops-career-move")?.checkVisibility()');
      assert.equal(await ev('document.getElementById("tops-career-search-role").value'), '', 'initial comparison needs no chosen role');
      await openComparison('tops-career-move');
      assert.equal(await ev('!!document.getElementById("tops-move-context")&&document.getElementById("tops-move-context").checkVisibility()'), false, 'neutral entry does not invent a source context');
      assert.equal(await ev('document.getElementById("tops-move-cash").value'), ''); assert.equal(await disk(), before);
      console.log('PASS entry phone/theme', width, theme, 'search, saved job, shared options, take-home floor, navigation, clear/reload and privacy');
    }
    assert.deepEqual(errors, []); assert.equal(requests.some(request => request.method === 'POST'), false);
    assert.equal(requests.some(request => /SYNTHETIC-MOVE|3500\.11|3000\.10|1234\.56/.test(request.url + request.body)), false);
    console.log('MOVE COMPARISON ENTRY PASS: direct search and saved-job access without intake; one shared visit-only comparison; explicit take-home amount; no budget/contact/storage transfer.');
  } finally {
    if (chrome) { await h.stopChrome(chrome); chrome.child.stderr?.destroy(); }
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error.stack); process.exitCode = 1; });
