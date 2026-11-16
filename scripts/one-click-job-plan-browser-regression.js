'use strict';
// Synthetic fixtures only. Every external request is blocked; no model API is called.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http'), os = require('node:os'), { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..'), utility = fs.readFileSync(path.join(__dirname, 'privacy-network-regression.js'), 'utf8');
const h = new Function('fs', 'path', 'os', 'spawn', utility.slice(utility.indexOf('function findChrome()'), utility.indexOf('const PROBE_SCRIPT =')) + '\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs, path, os, spawn);
const posts = [], requests = [], errors = [];
let fixture = { id: '123', title: 'SYNTHETIC Data Analyst', agency: 'Example employer', location: 'Milwaukee, WI', salary: '$30 Per Hour', closingDate: '2099-12-31', whoMayApply: 'Open to the public', qualifications: 'Analyze data and explain findings to project teams.', url: 'https://www.usajobs.gov/job/123' };
const server = http.createServer(async (req, res) => {
  requests.push(req.url);
  if (req.url.startsWith('/.netlify/functions/federal-jobs')) {
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'GET') return res.end(JSON.stringify({ available: true, provider: 'USAJOBS' }));
    let raw = ''; for await (const part of req) raw += part; posts.push(JSON.parse(raw));
    return res.end(JSON.stringify({ source: 'USAJOBS', scope: 'public', retrievedAt: '2026-11-15T12:00:00Z', jobs: [fixture] }));
  }
  const f = path.join(root, new URL(req.url, 'http://localhost').pathname === '/' ? 'index.html' : new URL(req.url, 'http://localhost').pathname);
  if (!fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', f.endsWith('.js') ? 'text/javascript' : f.endsWith('.html') ? 'text/html' : 'application/octet-stream'); res.end(fs.readFileSync(f));
});
(async () => {
  let chrome;
  try {
    await new Promise(r => server.listen(0, '127.0.0.1', r));
    const origin = 'http://127.0.0.1:' + server.address().port;
    chrome = await h.launchChrome(h.findChrome(), 12); const c = chrome.client;
    await c.send('Page.enable'); await c.send('Runtime.enable');
    c.on('Runtime.exceptionThrown', e => errors.push(e.exceptionDetails.text));
    await c.send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
    c.on('Fetch.requestPaused', async e => { const local = e.request.url.startsWith(origin); try { await c.send(local ? 'Fetch.continueRequest' : 'Fetch.failRequest', local ? { requestId: e.requestId } : { requestId: e.requestId, errorReason: 'BlockedByClient' }); } catch {} });
    const ev = s => h.evaluate(c, s, true), wait = s => h.waitForExpression(c, s, s, 12000), frames = () => ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
    const load = async (route = '/?tool=dashboard') => { await c.send('Page.navigate', { url: origin + route }); await wait('!!document.getElementById("tops-main-content")||!!document.getElementById("tops-first-visit")'); await frames(); };
    const click = async id => { await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});if(n){const parents=[];for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS'&&!p.open)parents.push(p);parents.reverse().forEach(p=>p.querySelector(':scope>summary').click())}if(!n||!n.checkVisibility()||n.disabled)throw Error('Unavailable '+${JSON.stringify(id)});n.click()})()`); await frames(); };
    const textClick = async text => { await ev(`(()=>{const n=[...document.querySelectorAll('button')].find(n=>n.checkVisibility()&&n.textContent===${JSON.stringify(text)});if(!n)throw Error('Missing '+${JSON.stringify(text)});n.click()})()`); await frames(); };
    const input = async (id, value) => { await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(n,${JSON.stringify(value)});n.dispatchEvent(new Event('input',{bubbles:true}));})()`); await frames(); };
    const seed = async (data, route) => { await load(); await ev(`localStorage.clear();localStorage.setItem('tops_onboarded','1');Object.entries(${JSON.stringify(data)}).forEach(([k,v])=>localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v)))`); await load(route); };
    const date = days => ev(`(()=>{const d=new Date();d.setDate(d.getDate()+${days});return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')})()`);
    const home = async () => { await ev(`[...document.querySelectorAll('[aria-label="Primary"] button')].find(n=>n.textContent==='Home').click()`); await frames(); };
    const snapshot = () => ev(`JSON.stringify(['tops_personal_guide_v1','tops_career_action_v1','tops_career_gap_v1','tops_my_jobs_v1'].map(k=>localStorage.getItem(k)))`);
    const cleanFixture = { ...fixture }, route = '/?tool=pathway&view=jobs&role=&location=53202';
    const rawJobs = () => ev('localStorage.getItem("tops_my_jobs_v1")');
    const companions = () => ev('JSON.stringify(["tops_personal_guide_v1","tops_career_action_v1","tops_career_gap_v1"].map(k=>localStorage.getItem(k)))');
    const ready = async data => { await seed(data || {}, route); await wait('!!document.getElementById("tops-federal-search")&&!document.getElementById("tops-federal-search").disabled'); await click('tops-federal-search'); await wait('[...document.querySelectorAll("button")].some(n=>n.checkVisibility()&&n.textContent==="Save job and see next step")'); await frames(); };
    const watch = () => ev(`window.__jobWrites=0;window.__originalSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='tops_my_jobs_v1')window.__jobWrites++;return window.__originalSet.call(this,k,v)}`);
    const save = async () => { await textClick('Save job and see next step'); await wait('document.getElementById("tops-my-jobs-status").textContent.length>0'); await frames(); };
    const restoredJob = async () => JSON.parse(await rawJobs()).jobs[0];
    let saved;
    for (const theme of ['professional','tactical']) for (const width of [320,375]) {
      fixture={...cleanFixture}; await c.send('Emulation.setDeviceMetricsOverride',{width,height:812,deviceScaleFactor:1,mobile:true}); await ready({tops_theme:theme});
      assert.equal(await ev('innerWidth'),width);assert.equal(await ev('document.documentElement.dataset.topsTheme'),theme);assert.equal(await ev('document.documentElement.scrollWidth<=innerWidth'),true);
      const notice=await ev(`(()=>{const b=[...document.querySelectorAll('button')].find(n=>n.checkVisibility()&&n.textContent==='Save job and see next step');const p=document.getElementById(b.getAttribute('aria-describedby'));return {text:p.textContent,before:!!(p.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING),gap:b.getBoundingClientRect().top-p.getBoundingClientRect().bottom}})()`);
      assert.match(notice.text,/this browser and includes it in plan backups/);assert.match(notice.text,/No application is sent/);assert.equal(notice.before,true);assert.ok(notice.gap>=0&&notice.gap<=16);
      const before=await companions(),calls=posts.length;await watch();
      await ev(`[...document.querySelectorAll('button')].find(n=>n.checkVisibility()&&n.textContent==='Save job and see next step').focus()`);
      await c.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',unmodifiedText:'\r',windowsVirtualKeyCode:13});await c.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
      await wait('!!localStorage.getItem("tops_my_jobs_v1")');saved=await restoredJob();await wait(`document.activeElement.id==='tops-saved-job-${saved.id}'`);await frames();
      assert.equal(await ev('document.activeElement.id'),'tops-saved-job-'+saved.id);assert.equal(await ev('!!document.getElementById("tops-my-job-role")'),false);assert.equal(await ev('window.__jobWrites'),1);assert.equal(posts.length,calls);assert.equal(await companions(),before);
      assert.equal(saved.status,'considering');assert.equal(saved.nextAction,'skills');assert.equal(saved.actionDate,'');assert.equal(saved.role,fixture.title);assert.equal(saved.qualifications,fixture.qualifications);assert.equal(saved.retrievedAt,'2026-11-15T12:00:00Z');assert.equal(saved.closingDate,fixture.closingDate);
      assert.match(await ev(`document.querySelector('[data-opportunity-plan="${saved.id}"]').textContent`),/Suggested starting step/);
      const g=await ev(`(()=>{const a=document.getElementById('tops-saved-job-${saved.id}'),t=a.querySelector('h3').getBoundingClientRect(),b=a.querySelector('[data-job-review-next]').getBoundingClientRect();return {title:t.top,button:b.bottom,height:innerHeight}})()`);assert.ok(g.title>=0&&g.button<g.height,JSON.stringify(g));
      if(process.env.TOPS_QUICK_SAVE_EVIDENCE){fs.mkdirSync(process.env.TOPS_QUICK_SAVE_EVIDENCE,{recursive:true});const shot=await c.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(process.env.TOPS_QUICK_SAVE_EVIDENCE,`saved-${width}-${theme}.png`),Buffer.from(shot.data,'base64'));}
      await load('/?tool=pathway');await click('tops-my-jobs-open');assert.equal((await restoredJob()).id,saved.id);console.log(`PASS ${width}px ${theme}: one keyboard action saves once, labels default, preserves exact source, shows title/next step, reload keeps job`);
    }
    // Duplicate and repeated clicks preserve all saved fields; even an oversized refreshed excerpt cannot overwrite one.
    const duplicate={...saved,status:'closed',nextAction:'followup',actionDate:'2099-06-15',employer:'SYNTHETIC retained employer'};
    fixture={...cleanFixture,qualifications:'S'.repeat(3001)};await ready({tops_my_jobs_v1:{version:1,jobs:[duplicate]}});const dupRaw=await rawJobs();await watch();await save();await wait(`document.activeElement.id==='tops-saved-job-${duplicate.id}'`);await frames();assert.equal(await rawJobs(),dupRaw);assert.equal(await ev('window.__jobWrites'),0);assert.equal(await ev('!!document.getElementById("tops-saved-result-tools")'),false);assert.match(await ev('document.getElementById("tops-my-jobs-status").textContent'),/Already in My jobs/);assert.equal(await ev(`!!document.querySelector('[data-opportunity-plan="${duplicate.id}"]')`),false);
    fixture={...cleanFixture};await ready();await watch();await ev(`(()=>{const b=[...document.querySelectorAll('button')].find(n=>n.checkVisibility()&&n.textContent==='Save job and see next step');b.click();b.click()})()`);await wait('!!localStorage.getItem("tops_my_jobs_v1")');await frames();assert.equal(JSON.parse(await rawJobs()).jobs.length,1);assert.equal(await ev('window.__jobWrites'),1);
    console.log('PASS duplicate URL and repeated click: no duplicate record, no overwrite, closed progress/date/action preserved');
    // An unfinished manual editor has precedence over a new result.
    await ready();await click('tops-my-jobs-open');await click('tops-my-jobs-add');await input('tops-my-job-role','SYNTHETIC unfinished manual edit');await textClick('Back to Career');await click('tops-career-find-jobs');await wait('[...document.querySelectorAll("button")].some(n=>n.checkVisibility()&&n.textContent==="Save job and see next step")');await watch();await save();assert.equal(await rawJobs(),null);assert.equal(await ev('document.getElementById("tops-my-job-role").value'),'SYNTHETIC unfinished manual edit');assert.equal(await ev('window.__jobWrites'),0);assert.match(await ev('document.getElementById("tops-my-jobs-status").textContent'),/Finish or cancel/);
    // Changed/corrupt storage never becomes an empty list. Recovery keeps the selected draft without autosaving.
    await ready({tops_my_jobs_v1:{version:1,jobs:[]}});await ev(`localStorage.setItem('tops_my_jobs_v1',localStorage.getItem('tops_my_jobs_v1')+' ')`);const changed=await rawJobs();await watch();await save();assert.equal(await rawJobs(),changed);assert.equal(await ev('window.__jobWrites'),0);assert.match(await ev('document.getElementById("tops-my-jobs-status").textContent'),/Saved jobs changed/);assert.equal(await ev('document.getElementById("tops-my-job-role").value'),cleanFixture.title);
    await ready({tops_my_jobs_v1:'{broken'});await watch();await save();assert.equal(await rawJobs(),'{broken');assert.equal(await ev('window.__jobWrites'),0);await wait('document.activeElement.id==="tops-my-jobs-status"');assert.match(await ev('document.getElementById("tops-my-jobs-status").textContent'),/kept for this visit/);await ev('localStorage.removeItem("tops_my_jobs_v1")');await textClick('Try reading My jobs again');await wait('!!document.getElementById("tops-my-job-role")');assert.equal(await ev('document.getElementById("tops-my-job-role").value'),cleanFixture.title);assert.equal(await rawJobs(),null);await click('tops-my-job-save');assert.equal((await restoredJob()).role,cleanFixture.title);
    console.log('PASS unfinished editor, stale raw data and unreadable-storage recovery retain work without automatic writes');
    // Capacity and snapshot bounds are enforced without truncation or replacement.
    const ten=Array.from({length:10},(_,i)=>({...saved,id:`11111111-1111-4111-8111-${String(i+1).padStart(12,'0')}`,sourceId:String(900+i),url:'https://www.usajobs.gov/job/'+(900+i)}));
    await ready({tops_my_jobs_v1:{version:1,jobs:ten}});const full=await rawJobs();await watch();await save();assert.equal(await rawJobs(),full);assert.equal(await ev('window.__jobWrites'),0);assert.match(await ev('document.getElementById("tops-my-jobs-status").textContent'),/full|limit/);assert.equal(await ev('document.getElementById("tops-my-job-role").value'),cleanFixture.title);
    fixture={...cleanFixture,qualifications:'S'.repeat(3001)};await ready();await watch();await save();assert.equal(await rawJobs(),null);assert.equal(await ev('window.__jobWrites'),0);assert.match(await ev('document.getElementById("tops-my-jobs-status").textContent'),/too large or incomplete/);await wait('document.activeElement.id==="tops-my-jobs-status"');
    const bulk=ten.slice(0,6).map(j=>({...j,qualifications:'"'.repeat(3000)}));fixture={...cleanFixture,qualifications:'"'.repeat(3000)};await ready({tops_my_jobs_v1:{version:1,jobs:bulk}});assert.equal(await ev('!!topsValidateJobs(JSON.parse(localStorage.getItem("tops_my_jobs_v1")))'),true);const bulkRaw=await rawJobs();await watch();await save();assert.equal(await rawJobs(),bulkRaw);assert.equal(await ev('window.__jobWrites'),0);assert.match(await ev('document.getElementById("tops-my-jobs-status").textContent'),/limit/);
    console.log('PASS 10-job, 42000-character and individual snapshot limits without replacement or truncation');
    // Quota and readback failures retain a real editor draft, and never show save-success utilities.
    for(const mode of ['quota','readback']){fixture={...cleanFixture};await ready();await ev(`window.__nativeSet=Storage.prototype.setItem;window.__nativeGet=Storage.prototype.getItem;window.__written=false;Storage.prototype.setItem=function(k,v){if(k==='tops_my_jobs_v1'){${mode==='quota'?'throw Error("synthetic quota")':'window.__written=true'}}return window.__nativeSet.call(this,k,v)};Storage.prototype.getItem=function(k){if(k==='tops_my_jobs_v1'&&window.__written)return 'synthetic mismatch';return window.__nativeGet.call(this,k)}`);await save();assert.match(await ev('document.getElementById("tops-my-jobs-status").textContent'),/Saving failed/);assert.equal(await ev('!!document.getElementById("tops-saved-result-tools")'),false);assert.equal(await ev('document.getElementById("tops-my-job-role").value'),cleanFixture.title);assert.equal(await ev('window.__nativeGet.call(localStorage,"tops_my_jobs_v1")'),null);await ev('Storage.prototype.setItem=window.__nativeSet;Storage.prototype.getItem=window.__nativeGet');await click('tops-my-job-save');assert.equal((await restoredJob()).role,cleanFixture.title);}
    assert.equal(requests.some(url=>/\/(resume|navigator|account-plan)(?:\?|$)/.test(url)),false);assert.deepEqual(errors,[]);console.log('PASS quota/readback recovery, exact source retention, no automatic application/provider/other-plan writes. Synthetic search requests only.');
  } finally { if (chrome) await h.stopChrome(chrome); await new Promise(r=>server.close(r)); }
})().catch(error=>{console.error(error.stack);process.exitCode=1});
