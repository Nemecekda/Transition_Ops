'use strict';
// Synthetic state-guide entry/navigation tests. The HTTP redirect server below is a local
// simulation of the checked _redirects rule, not evidence of Netlify CDN behavior.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const http = require('node:http'), os = require('node:os'), { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'scripts/privacy-network-regression.js'), 'utf8');
const h = new Function('fs', 'path', 'os', 'spawn', source.slice(source.indexOf('function findChrome()'), source.indexOf('const PROBE_SCRIPT =')) + '\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs, path, os, spawn);
const rules = fs.readFileSync(path.join(root, '_redirects'), 'utf8').split('\n').filter(line => line.trim() && !line.trim().startsWith('#')).map(line => line.trim().split(/\s+/));
const aliases = rules.filter(row => row[0].startsWith('/wisconsin'));
const destination = '/?tool=resources&view=state-help&area=wi&situation=browse&need=start';
assert.deepEqual(aliases, [['/wisconsin', destination, '302']], 'one exact temporary alias, no wildcard or new routing authority');
const simulatedRedirects = [];
const server = http.createServer((req, res) => {
  const request = new URL(req.url, 'http://localhost');
  if (['/wisconsin', '/wisconsin/'].includes(request.pathname)) {
    simulatedRedirects.push({ from: req.url, to: destination, status: 302 });
    res.writeHead(302, { Location: destination }); return res.end();
  }
  const file = path.join(root, request.pathname === '/' ? 'index.html' : request.pathname);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream');
  res.end(fs.readFileSync(file));
});
(async () => { let chrome; const errors = [], posts = []; try {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  chrome = await h.launchChrome(h.findChrome(), 12); const c = chrome.client;
  await c.send('Page.enable'); await c.send('Runtime.enable');
  c.on('Runtime.exceptionThrown', event => errors.push(event.exceptionDetails.text));
  await c.send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
  c.on('Fetch.requestPaused', async event => {
    if (event.request.method === 'POST') posts.push(event.request.url);
    const local = event.request.url.startsWith(origin) && !event.request.url.includes('/.netlify/');
    try { await c.send(local ? 'Fetch.continueRequest' : 'Fetch.failRequest', local ? { requestId: event.requestId } : { requestId: event.requestId, errorReason: 'BlockedByClient' }); } catch {}
  });
  const ev = code => h.evaluate(c, code, true);
  const wait = code => h.waitForExpression(c, code, code, 12000);
  const frames = () => ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
  const load = async route => { const loaded = new Promise(r => c.on('Page.loadEventFired', r)); await c.send('Page.navigate', { url: origin + route }); await loaded; await wait('!!document.getElementById("tops-main-content")'); await frames(); };
  const reload = async () => { const loaded = new Promise(r => c.on('Page.loadEventFired', r)); await c.send('Page.reload'); await loaded; await wait('!!document.getElementById("tops-main-content")'); await frames(); };
  const disk = () => ev('JSON.stringify(["tops_personal_guide_v1","tops_career_action_v1","tops_career_gap_v1","tops_user_status","tops_sep_date","taskProgress","docProgress","tops_member_jobs_v1"].map(k=>localStorage.getItem(k)))');
  const click = async id => { await ev(`document.getElementById(${JSON.stringify(id)}).click()`); await frames(); };
  const nav = async label => { await ev(`[...document.querySelectorAll('[aria-label="Primary"] button')].find(n=>n.textContent===${JSON.stringify(label)}).click()`); await frames(); };
  const change = async (id, value) => { await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});n.value=${JSON.stringify(value)};n.dispatchEvent(new Event('change',{bubbles:true}));})()`); await frames(); };
  const enter = async () => { await c.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 }); await c.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 }); await frames(); };
  const traverse = async method => { await ev(`new Promise(r=>{addEventListener('popstate',()=>requestAnimationFrame(()=>requestAnimationFrame(r)),{once:true});history.${method}()})`); await frames(); };
  for (const width of [320, 375]) for (const theme of ['professional', 'tactical']) {
    console.log("CASE",width,theme); await c.send('Emulation.setDeviceMetricsOverride', { width, height: 812, deviceScaleFactor: 1, mobile: true });
    await load('/?tool=dashboard');
    await ev(`(()=>{localStorage.clear();localStorage.setItem('tops_onboarded','1');localStorage.setItem('tops_theme',${JSON.stringify(theme)});localStorage.setItem('tops_user_status','guard');const guide={version:1,pathway:'support',currentRole:'SYNTHETIC current role',targetRole:'SYNTHETIC target',goal:'SYNTHETIC preserve goal'};localStorage.setItem('tops_personal_guide_v1',JSON.stringify(guide));localStorage.setItem('tops_career_action_v1',JSON.stringify({version:1,text:'SYNTHETIC preserve next step',date:'2027-01-05',done:false,context:guide}));localStorage.setItem('tops_career_gap_v1',JSON.stringify(topsEmptyGap()));localStorage.setItem('docProgress',JSON.stringify({dd214:true}));})()`);
    await load('/?tool=dashboard'); const before = await disk();
    for (const menu of ['Benefits', 'More']) {
      console.log('MENU',menu); await nav(menu);
      assert.equal(await ev('document.querySelectorAll("#tops-menu-state-help").length'), 1);
      if (menu === 'Benefits') assert.equal(await ev('document.querySelector(".more-overlay .tops-more-tool").id'), 'tops-menu-state-help');
      await ev('document.getElementById("tops-menu-state-help").focus()'); await enter();
      await wait('document.activeElement.id==="tops-state-help-heading"');
      assert.equal(await ev('document.getElementById("tops-state-help-area").value'), 'national');
      assert.equal(await disk(), before);
    }
    for (const route of ['/wisconsin', '/wisconsin/']) {
      console.log('ROUTE',route); await load(route); await wait('!!document.getElementById("tops-state-help")');
      assert.equal(await ev('location.pathname+location.search'), destination);
      assert.equal(await ev('document.getElementById("tops-state-help-heading").textContent'), 'Coming home to Wisconsin?');
      assert.match(await ev('document.getElementById("tops-state-help-welcome").textContent'), /serving in the Guard or Reserve/);
      assert.match(await ev('document.getElementById("tops-state-help-welcome").textContent'), /Veterans and families welcome/);
      assert.equal(await ev('document.querySelector("label[for=tops-state-help-area]").textContent'), 'Choose your state');
      assert.deepEqual(await ev('[...document.getElementById("tops-state-help-area").options].map(n=>n.text)'), ['All states', 'Wisconsin']);
      assert.equal(await ev('document.getElementById("tops-state-help-situation").value'), 'browse');
      assert.equal(await ev('document.getElementById("tops-state-help-need").value'), 'start');
      await reload(); assert.equal(await disk(), before);
    }
    console.log('CONTEXT'); await change('tops-state-help-need', 'education');
    await ev('document.getElementById("tops-state-help-situation").closest("details").open=true');
    await change('tops-state-help-situation', 'guard');
    await reload(); assert.match(await ev('document.getElementById("tops-state-help-next").textContent'), /Wisconsin Guard tuition/);
    const contextURL = await ev('location.href');
    console.log('DOCUMENTS/BACK'); await ev('document.getElementById("tops-state-help-documents").closest("details").open=true'); await click('tops-state-help-documents'); await wait('!!document.getElementById("tops-plan-documents")'); await traverse('back'); await wait('!!document.getElementById("tops-state-help-next")');
    assert.equal(await ev('location.href'), contextURL);
    assert.equal(await ev('document.getElementById("tops-state-help-situation").value'), 'guard');
    await click('tops-state-help-plan'); assert.equal(await ev('document.getElementById("tops-state-help-save").disabled'), true);
    await ev('[...document.querySelectorAll("button")].find(n=>n.textContent==="Keep my current step").click()'); await frames();
    assert.equal(await disk(), before);
    await change('tops-state-help-area', 'national');
    assert.equal(await ev('document.querySelector("#tops-state-help-welcome h2").textContent'), 'State and local help');
    assert.equal(await ev('document.querySelector("#tops-wisconsin-skillbridge,#tops-wisconsin-cohort,#tops-wisconsin-local-help")'), null);
    assert.match(await ev('document.getElementById("tops-state-help-area-hint").textContent'), /National resources are available for every state/);
    assert.match(await ev('document.getElementById("tops-state-help-area-hint").textContent'), /does not establish residence or eligibility/);
    assert.equal(await ev('document.documentElement.scrollWidth<=innerWidth+1'), true);
    assert.equal(await ev('[...document.querySelectorAll("#tops-state-help button,#tops-state-help select,#tops-state-help a,#tops-state-help summary")].filter(n=>n.checkVisibility()).every(n=>n.getBoundingClientRect().height>=44)'), true);
    assert.equal(await disk(), before);
    console.log('PASS menu/native Enter, alias simulation, reload, Back, state context, replacement guard, national fallback and saved bytes', { width, theme });
  }
  assert.equal((await fetch(origin + '/wisconsin-other')).status, 404);
  assert.equal((await fetch(origin + '/unknown/member-route')).status, 404);
  assert.equal(simulatedRedirects.length, 8);
  assert.deepEqual(errors, []); assert.deepEqual(posts, []);
  console.log('STATE GUIDE ENTRY PASS: four mobile/theme journeys, eight local simulated302 requests, zero provider POSTs. Actual Netlify/CDN redirect remains untested.');
} finally { if (chrome) await h.stopChrome(chrome); await new Promise(r => server.close(r)); } })().catch(error => { console.error(error); process.exitCode = 1; });
