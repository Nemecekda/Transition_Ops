'use strict';
// Synthetic local regression. No official resource, model, or member-data request is allowed.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http'), os = require('node:os'), { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..'), utility = fs.readFileSync(path.join(__dirname, 'privacy-network-regression.js'), 'utf8');
const step = 'Ask a Wisconsin Job Center about eligibility and approval before paying for tools or training.';
const expectedQuestion = 'I am exploring work or training in Wisconsin and may need help with tools, work gear or training costs. Which office can assess my eligibility, what documents should I prepare, and what approval is needed before I spend anything?';
const h = new Function('fs', 'path', 'os', 'spawn', utility.slice(utility.indexOf('function findChrome()'), utility.indexOf('const PROBE_SCRIPT =')) + '\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs, path, os, spawn);
const server = http.createServer((req, res) => {
  const file = path.join(root, req.url.split('?')[0] === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream'); res.end(fs.readFileSync(file));
});
(async () => {
  let chrome;
  const errors = [], blocked = [];
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const url = 'http://127.0.0.1:' + server.address().port;
    chrome = await h.launchChrome(h.findChrome(), 12);
    const c = chrome.client, ev = expression => h.evaluate(c, expression, true), wait = expression => h.waitForExpression(c, expression, expression, 12000);
    await c.send('Page.enable'); await c.send('Runtime.enable');
    c.on('Runtime.exceptionThrown', event => errors.push(event.exceptionDetails.text));
    await c.send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
    c.on('Fetch.requestPaused', async event => {
      const local = event.request.url.startsWith(url) && !event.request.url.includes('/.netlify/');
      if (!local) blocked.push(event.request);
      try { await c.send(local ? 'Fetch.continueRequest' : 'Fetch.failRequest', local ? { requestId: event.requestId } : { requestId: event.requestId, errorReason: 'BlockedByClient' }); } catch {}
    });
    const input = (id, value) => ev(`(() => { const n = document.getElementById(${JSON.stringify(id)}); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(n,${JSON.stringify(value)}); n.dispatchEvent(new Event('input',{bubbles:true})); })()`);
    const click = text => ev(`(() => { const n = Array.from(document.querySelectorAll('button')).find(n => n.textContent === ${JSON.stringify(text)} && n.checkVisibility()); if (!n) throw Error('Missing button: '+${JSON.stringify(text)}); n.click(); })()`);
    const reveal = id => ev(`(() => { const n=document.getElementById(${JSON.stringify(id)}); const parents=[]; for(let p=n.parentElement;p;p=p.parentElement) if(p.tagName==='DETAILS'&&!p.open) parents.unshift(p); for(const p of parents)p.querySelector(':scope > summary').click(); })()`);
    const disk = () => ev('JSON.stringify(Object.entries(localStorage).sort())');
    const load = async tool => { await c.send('Page.navigate', {url:url+'/?tool='+tool}); await wait('!!document.querySelector(".bottom-nav")'); };
    const home = async () => { await ev('Array.from(document.querySelectorAll(".bottom-nav button")).find(n=>n.querySelector(".nav-label").textContent==="Home").click()'); await wait('!!document.getElementById("tops-home-search")'); };


    const tap = id => ev(`document.getElementById(${JSON.stringify(id)}).click()`);
    const set = (id,value) => ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)}),proto=n.tagName==='SELECT'?HTMLSelectElement.prototype:n.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(n,${JSON.stringify(value)});n.dispatchEvent(new Event(n.tagName==='SELECT'?'change':'input',{bubbles:true}));})()`);
    const seed = async (pathway='change',done=false,text=step) => {
      await ev(`localStorage.clear();localStorage.setItem('tops_onboarded','1');localStorage.setItem('tops_user_status','guard');const g={version:1,pathway:${JSON.stringify(pathway)},currentRole:'Synthetic maintainer',targetRole:'Synthetic technician',goal:'Preserve my goal'};const a={version:1,text:${JSON.stringify(text)},date:'2027-01-12',done:${done},context:g};const gap=topsEmptyGap();gap.target='Synthetic technician';gap.rows[0].have='SYNTHETIC PRIVATE WORKSHEET';localStorage.setItem("tops_personal_guide_v1",JSON.stringify(g));localStorage.setItem("tops_career_action_v1",JSON.stringify(a));localStorage.setItem("tops_career_gap_v1",JSON.stringify(gap));`);
      await load('dashboard'); await wait('!!document.getElementById("tops-loop-title")');
    };
    const plan = () => ev('JSON.stringify(["tops_personal_guide_v1","tops_career_action_v1","tops_career_gap_v1"].map(k=>localStorage.getItem(k)))');

    const navigate=async label=>{await ev(`Array.from(document.querySelectorAll('.bottom-nav button')).find(n=>n.querySelector('.nav-label').textContent===${JSON.stringify(label)}).click()`);await wait('!!document.getElementById("tops-loop-title")');};
    const proposal=()=>ev('JSON.stringify([document.getElementById("tops-support-outcome-label").dataset.outcome,document.getElementById("tops-support-text").value,document.getElementById("tops-support-date").value])');
    const reference=async()=>{await reveal('tops-support-wisconsin-reference');await tap('tops-support-wisconsin-reference');await wait('!!document.getElementById("tops-wi-work-support-resources-heading")');};
    await load('dashboard');await seed();
    await c.send('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:true});
    const saved=await plan();
    await set('tops-support-outcome','documents');await wait('document.activeElement.id==="tops-support-review-heading"');
    await set('tops-support-text','Ask which work tools to discuss at my appointment.');await set('tops-support-date','2027-04-12');
    const draft=await proposal();
    await reference();await home();assert.equal(await proposal(),draft);assert.equal(await plan(),saved);
    assert.equal(await ev('document.getElementById("tops-support-status").textContent'),'Your unfinished support update is still here.');
    assert.match(await ev('document.getElementById("tops-support-unsaved").textContent'),/Save before refreshing/);
    await navigate('My Plan');assert.equal(await proposal(),draft);
    await set('tops-support-text','Ask about tools and bring my questions to the appointment.');const changed=await proposal();
    await home();assert.equal(await proposal(),changed);assert.equal(await plan(),saved);
    await tap('tops-support-cancel');await wait('document.activeElement.id==="tops-support-outcome"');
    await navigate('My Plan');assert.equal(await ev('!!document.getElementById("tops-support-text")'),false);assert.equal(await plan(),saved);
    console.log('PASS reference/Home/My Plan share exactly one unsaved text/date/outcome draft; cancel clears both and preserves saved bytes');
    await home();await tap('tops-support-update-current');await wait('document.activeElement.id==="tops-support-text"');await tap('tops-support-cancel');await wait('document.activeElement.id==="tops-support-update-current"');
    await tap('tops-loop-date-review');await wait('document.activeElement.id==="tops-support-date"');await tap('tops-support-cancel');await wait('document.activeElement.id==="tops-loop-date-review"');
    console.log('PASS outcome starts at review heading; direct update and target-date cancellation return to their actual invokers');
    await set('tops-support-outcome','waiting');await set('tops-support-text','My unfinished waiting draft.');await reference();
    await ev('localStorage.setItem("tops_career_action_v1","newer-tab-copy")');const newer=await plan();await home();
    assert.match(await ev('document.getElementById("tops-support-unsaved").textContent'),/changed/);
    for(const id of ['tops-support-save','tops-support-visit']){await tap(id);assert.equal(await plan(),newer);assert.equal(await ev('document.getElementById("tops-support-text").value'),'My unfinished waiting draft.');assert.match(await ev('document.getElementById("tops-support-status").textContent'),/changed/);}
    await tap('tops-support-cancel');
    console.log('PASS original snapshot survives navigation; changed disk rejects save and visit while keeping recoverable text');
    await seed();await set('tops-support-outcome','documents');await set('tops-support-text','Unaccepted note intentionally lost on reload.');await load('dashboard');assert.equal(await ev('!!document.getElementById("tops-support-text")'),false);
    await set('tops-support-outcome','waiting');await set('tops-support-text','Accepted only for this visit.');const visitDisk=await plan();await tap('tops-support-visit');await navigate('My Plan');assert.equal(await ev('!!document.getElementById("tops-support-text")'),false);assert.equal(await plan(),visitDisk);await tap('tops-loop-support-open');assert.equal(await ev('document.getElementById("tops-support-text").value'),'Accepted only for this visit.');await tap('tops-support-cancel');
    await set('tops-support-outcome','documents');await set('tops-support-text','Saved exact follow-up.');await set('tops-support-date','2027-05-12');await tap('tops-support-save');await home();assert.equal(await ev('!!document.getElementById("tops-support-text")'),false);await load('dashboard');await tap('tops-loop-support-open');assert.equal(await ev('document.getElementById("tops-support-text").value'),'Saved exact follow-up.');assert.equal(await ev('document.getElementById("tops-support-date").value'),'2027-05-12');
    console.log('PASS pending reload reset is explicit; accepted visit/save clear pending state with correct persistence and exact reopen');
    for(const width of [320,375]){await c.send('Emulation.setDeviceMetricsOverride',{width,height:812,deviceScaleFactor:1,mobile:true});assert.ok(await ev('document.documentElement.scrollWidth<=innerWidth+1'));}
    assert.deepEqual(errors,[]);assert.equal(blocked.some(r=>r.method!=='GET'||r.postData||r.url.includes('SYNTHETIC')||r.url.includes('/.netlify/')),false);
    console.log('SUPPORT REVIEW CONTINUITY: LOCAL AUTOMATION PASS. No provider calls. Native phone/AT and hosted checks remain pending.');
  } finally { if(chrome){await h.stopChrome(chrome);chrome.child.stderr?.destroy();} await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
