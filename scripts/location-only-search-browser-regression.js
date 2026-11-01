'use strict';
// Synthetic local searches only. Every provider/contact request is blocked outside the local fixture.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http'), os = require('node:os'), { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..'), utility = fs.readFileSync(path.join(__dirname, 'privacy-network-regression.js'), 'utf8');
const h = new Function('fs', 'path', 'os', 'spawn', utility.slice(utility.indexOf('function findChrome()'), utility.indexOf('const PROBE_SCRIPT =')) + '\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs, path, os, spawn);
const calls = [], requests = [], blocked = [];
const held = []; let holdResponse = false;
const job = { id: '987654321', title: 'SYNTHETIC Public Opening', agency: 'SYNTHETIC Agency', location: 'Wisconsin', salary: 'Not supplied', closingDate: '2099-12-01', whoMayApply: 'Check official source', qualifications: 'SYNTHETIC excerpt', url: 'https://www.usajobs.gov/job/987654321' };
const server = http.createServer(async (req, res) => {
  requests.push({ method: req.method, url: req.url });
  if (req.url.startsWith('/.netlify/functions/federal-jobs')) {
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'GET') return res.end(JSON.stringify({ available: true, provider: 'USAJOBS' }));
    let raw = ''; for await (const chunk of req) raw += chunk;
    calls.push(JSON.parse(raw));
    const finish = () => res.end(JSON.stringify({ source: 'USAJOBS', scope: 'public', retrievedAt: '2026-11-01T12:00:00Z', jobs: [job] }));
    if (holdResponse) { held.push(finish); return; } return finish();
  }
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
    await c.send('Page.addScriptToEvaluateOnNewDocument', { source: `
      try{localStorage.setItem('tops_onboarded','1');}catch{}
      window.__copies=[];window.__downloads=[];window.__externalClicks=[];
      Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>__copies.push(value)}});
      URL.createObjectURL=blob=>{__downloads.push(blob);return 'blob:synthetic-location-search';};URL.revokeObjectURL=()=>{};
      document.addEventListener('click',event=>{const link=event.target.closest('a');if(link&&(link.download||!link.href.startsWith(location.origin))){event.preventDefault();__externalClicks.push({href:link.href,download:link.download||''});}},true);
    ` });
    await c.send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
    c.on('Fetch.requestPaused', async event => {
      const local = event.request.url.startsWith(origin) && (!event.request.url.includes('/.netlify/') || event.request.url.includes('/.netlify/functions/federal-jobs'));
      if (!local) blocked.push({ url: event.request.url, body: event.request.postData || '' });
      try { await c.send(local ? 'Fetch.continueRequest' : 'Fetch.failRequest', local ? { requestId: event.requestId } : { requestId: event.requestId, errorReason: 'BlockedByClient' }); } catch {}
    });
    const load = async url => { await c.send('Page.navigate', { url }); await wait('!!document.getElementById("tops-main-content")'); await frames(); };
    const reveal = async id => { await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});if(!n)throw Error('Missing '+${JSON.stringify(id)});const parents=[];for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS'&&!p.open)parents.unshift(p);for(const p of parents)p.querySelector(':scope>summary').click();if(!n.checkVisibility())throw Error('Hidden '+${JSON.stringify(id)});})()`); await frames(); };
    const tap = async id => { await reveal(id); await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});if(n.disabled)throw Error('Disabled '+${JSON.stringify(id)});n.click();})()`); await frames(); };
    const input = async (id, value) => { await reveal(id); await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(n,${JSON.stringify(value)});n.dispatchEvent(new Event('input',{bubbles:true}));})()`); await frames(); };
    const enter = async id => { await reveal(id); await ev(`document.getElementById(${JSON.stringify(id)}).focus()`); await c.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', windowsVirtualKeyCode: 13 }); await c.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }); await frames(); };
    const plan = () => ev('JSON.stringify(["tops_personal_guide_v1","tops_career_action_v1","tops_career_gap_v1","tops_my_jobs_v1"].map(key=>localStorage.getItem(key)))');
    const showResults = async expected => { await wait('!!document.getElementById("tops-federal-results")'); assert.deepEqual(calls.at(-1), expected); assert.match(await ev('document.getElementById("tops-federal-results").parentElement.textContent'), /SYNTHETIC Public Opening/); };
    const validation = async (fieldId, buttonId, errorId, bad) => {
      const beforeCalls = calls.length; await input(fieldId, bad);
      assert.equal(await ev(`document.getElementById(${JSON.stringify(buttonId)}).disabled`), false, 'invalid input still has an operable submit');
      await tap(buttonId); await wait(`document.activeElement.id===${JSON.stringify(fieldId)}`);
      assert.deepEqual(await ev(`(()=>{const field=document.getElementById(${JSON.stringify(fieldId)}),error=document.getElementById(${JSON.stringify(errorId)});return {visible:!!error&&error.checkVisibility(),role:error?.getAttribute('role'),invalid:field.getAttribute('aria-invalid'),associated:(field.getAttribute('aria-describedby')||'').split(' ').includes(${JSON.stringify(errorId)}),text:!!error?.textContent.trim()};})()`), { visible: true, role: 'alert', invalid: 'true', associated: true, text: true });
      assert.equal(calls.length, beforeCalls, 'invalid submission makes no search request');
    };
    await c.send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
    await load(origin + '/?tool=pathway');
    await ev("(()=>{localStorage.clear();localStorage.setItem('tops_onboarded','1');const guide=topsEmptyGuide();guide.currentRole='SYNTHETIC_PRIVATE_PROFILE';const gap=topsEmptyGap();gap.rows[0].have='SYNTHETIC_PRIVATE_RESUME';localStorage.setItem('tops_personal_guide_v1',JSON.stringify(guide));localStorage.setItem('tops_career_gap_v1',JSON.stringify(gap));localStorage.setItem('tops_career_action_v1',JSON.stringify(topsEmptyAction()));localStorage.setItem('tops_my_jobs_v1',JSON.stringify(topsEmptyJobs()));})()");
    const entryURL = origin + '/?tool=pathway&test_context=unchanged%20encoding';
    await load(entryURL); const before = await plan();
    assert.equal(await ev('location.href'), entryURL);
    await input('tops-career-search-area', '54211');
    assert.equal(await ev('document.getElementById("tops-career-search-role").value'), '');
    // Baseline negative control: a real ZIP-only search must be submittable without inventing a role.
    assert.equal(await ev('document.getElementById("tops-career-search-start").disabled'), false, 'ZIP-only search with blank role can submit');
    assert.equal(calls.length, 0, 'typing alone does not search');
    await enter('tops-career-search-area'); await showResults({ keyword: '', location: '54211' });
    assert.equal(calls.length, 1); assert.equal(await plan(), before);
    assert.match(await ev('document.getElementById("tops-federal-results").textContent'), /54211/);
    const areaResults = await ev('document.getElementById("tops-federal-results").parentElement.textContent');
    assert.ok(!areaResults.includes('No returned title contains your role keywords'));
    assert.match(areaResults, /Up to 10 returned federal openings/);
    assert.equal(await ev('document.getElementById("tops-job-role").value'), '');
    assert.equal(await ev('document.getElementById("tops-job-area").value'), '54211');
    assert.equal(await ev('[...document.querySelectorAll("[id^=tops-learning-search-add-]")].some(n=>n.checkVisibility()&&!n.disabled)'), false, 'a location-only search cannot create an invented role-bound learning step');
    const generalCards = await ev('(()=>{const resources=topsCareerLearningMatches("",[]).map(option=>option.resource);return [...document.querySelectorAll("#tops-search-learning [data-learning-id]")].map(node=>({id:node.dataset.learningId,general:resources.find(resource=>resource.id===node.dataset.learningId)?.general===true}));})()');
    assert.ok(generalCards.length>0&&generalCards.every(card=>card.general), 'blank-role recommendations are actual general catalogue resources');
    const external = await ev('[...document.querySelectorAll("#tops-live-jobs-panel a")].filter(a=>a.href.includes("linkedin.com/jobs/search")||a.href.includes("usajobs.gov/Search/Results")).map(a=>a.href)');
    assert.equal(external.length, 2);
    for (const href of external) { const url = new URL(href); assert.equal(url.searchParams.get(url.hostname.includes('linkedin') ? 'location' : 'l'), '54211'); assert.equal(url.searchParams.has(url.hostname.includes('linkedin') ? 'keywords' : 'k'), false, 'location-only external search omits the keyword key'); }

    // Public-query sharing preserves the empty keyword and does not restore or send private state.
    assert.equal(await ev('!!document.getElementById("tops-job-share-url")'), false); await tap('tops-job-share-prepare');
    const sharedURL = await ev('document.getElementById("tops-job-share-url").value'), shared = new URL(sharedURL);
    assert.deepEqual(Object.fromEntries(shared.searchParams), { tool: 'pathway', view: 'jobs', role: '', location: '54211' }); assert.equal(shared.hash, '');
    await tap('tops-job-share-copy'); assert.equal(await ev('__copies.at(-1)'), sharedURL);
    await tap('tops-job-share-download'); assert.ok((await ev('__downloads[0].text()')).includes(sharedURL));
    const countBeforeReload = calls.length; await load(sharedURL); await wait('document.getElementById("tops-job-area")?.value==="54211"');
    await wait('document.getElementById("tops-federal-search")?.disabled===false');
    assert.equal(await ev('document.getElementById("tops-job-role").value'), ''); assert.equal(calls.length, countBeforeReload, 'opening a shared query does not submit it');
    assert.equal(await plan(), before); assert.equal(await ev('!!document.getElementById("tops-federal-results")'), false);
    holdResponse = true; await enter('tops-job-area'); await wait('document.getElementById("tops-federal-search").disabled');
    assert.equal(calls.length, countBeforeReload + 1);
    await enter('tops-job-area'); await enter('tops-job-area');
    assert.equal(calls.length, countBeforeReload + 1, 'repeated Enter during a held search cannot submit duplicate requests');
    assert.equal(held.length, 1); holdResponse = false; held.shift()(); await showResults({ keyword: '', location: '54211' });

    // City-only initial entry and ordinary keyword+ZIP search retain the same request contract.
    await load(origin + '/?tool=pathway'); await input('tops-career-search-area', 'Green Bay, WI');
    const beforeCity = calls.length; await tap('tops-career-search-start'); await showResults({ keyword: '', location: 'Green Bay, WI' }); assert.equal(calls.length, beforeCity + 1);
    await input('tops-job-role', 'Data Analyst'); await input('tops-job-area', '54211');
    const beforeRole = calls.length; await tap('tops-federal-search'); await showResults({ keyword: 'Data Analyst', location: '54211' }); assert.equal(calls.length, beforeRole + 1);
    assert.equal(await plan(), before);

    // Both entry points explain invalid input instead of presenting a disabled dead end.
    for (const bad of ['', '   ', '!!!', '5421', '542111', '<script>']) await validation('tops-job-area', 'tops-federal-search', 'tops-job-search-error', bad);
    await input('tops-job-area', '54211'); await validation('tops-job-role', 'tops-federal-search', 'tops-job-search-error', '<script>');
    await load(origin + '/?tool=pathway');
    for (const bad of ['', '   ', '!!!', '5421', '542111', '<script>']) await validation('tops-career-search-area', 'tops-career-search-start', 'tops-career-search-error', bad);
    await input('tops-career-search-area', '54211'); await validation('tops-career-search-role', 'tops-career-search-start', 'tops-career-search-error', '<script>');
    await input('tops-career-search-role', ''); await input('tops-career-search-area', '54211-1234');
    assert.equal(await ev('document.getElementById("tops-career-search-area").getAttribute("aria-invalid")'), null);
    const beforeExtended = calls.length; await enter('tops-career-search-area'); await showResults({ keyword: '', location: '54211-1234' }); assert.equal(calls.length, beforeExtended + 1);
    assert.equal(await plan(), before);
    for (const width of [320, 375]) { await c.send('Emulation.setDeviceMetricsOverride', { width, height: 812, deviceScaleFactor: 1, mobile: true }); await frames(); assert.ok(await ev('document.documentElement.scrollWidth<=innerWidth+1')); }
    // Closed query boundaries still reject malformed share URLs and non-string input.
    assert.deepEqual(await ev(`topsReadJobSearchURL(${JSON.stringify(sharedURL)})`), { keyword: '', state: '54211' });
    assert.equal(await ev(`topsReadJobSearchURL(${JSON.stringify(sharedURL + '&email=SYNTHETIC_PRIVATE_EMAIL')})`), null);
    assert.equal(await ev(`topsReadJobSearchURL(${JSON.stringify(sharedURL + '&role=other')})`), null);
    assert.equal(await ev('topsJobSearchQuery([],"54211")'), null);
    assert.equal(await ev('topsJobSearchQuery("", "5421")'), null);
    // A saved career direction must not silently fill a deliberately empty search role on reopen.
    await ev("(()=>{const guide=JSON.parse(localStorage.getItem('tops_personal_guide_v1'));guide.pathway='skills';guide.targetRole='SYNTHETIC Saved Direction A';localStorage.setItem('tops_personal_guide_v1',JSON.stringify(guide));localStorage.setItem('tops_career_action_v1',JSON.stringify({version:1,text:'SYNTHETIC_PRIVATE_SAVED_STEP',date:'',done:false,context:guide}));})()");
    const savedPlan = await plan(), beforeReopen = calls.length;
    await load(sharedURL); await wait('document.getElementById("tops-job-area")?.value==="54211"');
    await tap('tops-career-screen-back'); await tap('tops-career-find-jobs');
    await wait('document.getElementById("tops-job-role")?.checkVisibility()');
    assert.equal(await ev('document.getElementById("tops-job-role").value'), '', 'reopening keeps the deliberate empty keyword instead of the saved target');
    assert.equal(await ev('document.getElementById("tops-job-area").value'), '54211');
    assert.equal(calls.length, beforeReopen); assert.equal(await plan(), savedPlan);
    assert.ok(!JSON.stringify(calls).includes('PRIVATE_')); assert.ok(!sharedURL.includes('PRIVATE_'));
    assert.equal(blocked.some(request => /PRIVATE_|usajobs|linkedin|mailto:|openai/.test(request.url + request.body)), false);
    assert.equal(requests.filter(request=>request.method==='POST').length, calls.length);
    assert.deepEqual(errors, []);
    console.log('LOCATION ONLY SEARCH PASS: ZIP/city without role, native Enter, ordinary role+ZIP, associated focused errors on both entry points, empty-keyword share roundtrip without autosubmit, preserved private plan, mobile reflow and zero provider/contact calls.');
  } finally { held.splice(0).forEach(finish=>finish()); if (chrome) { await h.stopChrome(chrome); chrome.child.stderr?.destroy(); } await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
