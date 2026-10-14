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
    await load('dashboard'); await seed();
    const before=await plan();
    const drafts=[];
    for(const kind of ['waiting','documents','option','ready']) {
      await set('tops-support-outcome',kind);await wait('!!document.getElementById("tops-support-text")');
      drafts.push(await ev('document.getElementById("tops-support-text").value'));
      assert.equal(await ev('document.getElementById("tops-support-date").value'),'');
      assert.equal(await plan(),before);assert.match(await ev('document.getElementById("tops-support-focus").textContent'),/Focus changes from.*Get work or training support/);
      await tap('tops-support-cancel');await wait('document.activeElement.id === "tops-support-outcome"');assert.equal(await plan(),before);
    }
    assert.equal(new Set(drafts).size,4);
    console.log('PASS four distinct outcome drafts, no inherited date, direction review, no completion/persistence before explicit acceptance');
    await set('tops-support-outcome','documents');await set('tops-support-text','Confirm how to provide the requested training estimate through the provider channel.');await set('tops-support-date','2027-02-12');await tap('tops-support-save');
    await wait('document.getElementById("tops-support-status").textContent.includes("Saved on this browser")');
    const after=JSON.parse(await plan()).map(JSON.parse),prior=JSON.parse(before).map(JSON.parse);
    assert.deepEqual(after[0],{...prior[0],pathway:'support'});assert.deepEqual(after[2],prior[2]);assert.equal(after[1].done,false);assert.equal(after[1].date,'2027-02-12');assert.equal(after[1].text,'Confirm how to provide the requested training estimate through the provider channel.');assert.deepEqual(after[1].context,after[0]);
    await load('dashboard');await tap('tops-loop-support-open');await wait('!!document.getElementById("tops-support-text")');assert.equal(await ev('document.getElementById("tops-support-text").value'),after[1].text);assert.equal(await ev('document.getElementById("tops-support-date").value'),after[1].date);
    assert.equal(await ev('document.getElementById("tops-career-action")===null'),true);
    assert.equal(await ev('document.getElementById("tops-loop-date-review")===null && document.getElementById("tops-support-date").checkVisibility()'),true);assert.equal(await ev('document.getElementById("tops-support-text").value'),after[1].text);
    const roundtrip=await ev(`(()=>{const g=JSON.parse(localStorage.getItem("tops_personal_guide_v1")),a=JSON.parse(localStorage.getItem("tops_career_action_v1")),gap=JSON.parse(localStorage.getItem("tops_career_gap_v1"));const data=topsCreatePlanBackup({guide:g,careerAction:a,careerWorksheet:gap,taskProgress:[],documentProgress:[],followupProgress:{},completedReminders:{}});return topsParsePlanBackup(JSON.stringify(data)).sections;})()`);
    assert.deepEqual(roundtrip.careerAction,after[1]);assert.deepEqual(roundtrip.careerWorksheet,after[2]);
    console.log('PASS edited documents/date survives saved reload and exact editor return; roles/goal/worksheet and backup preserved; one date editor');
    await tap('tops-support-cancel');await set('tops-support-outcome','waiting');await set('tops-support-text','Synthetic waiting action');const diskBeforeVisit=await plan();await tap('tops-support-visit');assert.equal(await plan(),diskBeforeVisit);await tap('tops-loop-support-open');assert.equal(await ev('document.getElementById("tops-support-text").value'),'Synthetic waiting action');await load('dashboard');await tap('tops-loop-support-open');assert.equal(await ev('document.getElementById("tops-support-text").value'),after[1].text);
    console.log('PASS visit-only step is usable in this visit and saved step returns after reload');
    await seed('change',true);assert.equal(await ev('!!document.getElementById("tops-support-outcome")'),true);assert.equal(await ev('!!document.getElementById("tops-loop-reflection")'),false);assert.doesNotMatch(await ev('document.querySelector(".tops-next-move").textContent'),/Compare requirements with your experience/);const completed=await plan();await set('tops-support-outcome','ready');await tap('tops-support-cancel');assert.equal(await plan(),completed);
    await seed('change',false,'Ask another Wisconsin person about tools.');assert.equal(await ev('!!document.getElementById("tops-support-outcome")'),false);
    await seed('change');await set('tops-support-outcome','waiting');await ev('localStorage.setItem("tops_career_action_v1","newer-copy")');const changed=await plan();await tap('tops-support-save');assert.equal(await plan(),changed);assert.match(await ev('document.getElementById("tops-support-status").textContent'),/changed/);assert.equal(await ev('document.getElementById("tops-support-text").value'),drafts[0]);
    console.log('PASS completed support updates, exact WI recognition only, stale disk rejection with draft retained');
    await seed('support');await set('tops-support-outcome','documents');const failedBefore=await plan();await ev(`window.originalSet=Storage.prototype.setItem;window.failOnce=true;Storage.prototype.setItem=function(k,v){if(k==="tops_career_action_v1"&&window.failOnce){window.failOnce=false;throw Error('synthetic failure')}return originalSet.call(this,k,v)}`);await tap('tops-support-save');assert.equal(await plan(),failedBefore);assert.match(await ev('document.getElementById("tops-support-status").textContent'),/Not saved/);await ev('Storage.prototype.setItem=window.originalSet');
    for(const width of [320,375]){await c.send('Emulation.setDeviceMetricsOverride',{width,height:812,deviceScaleFactor:1,mobile:true});assert.ok(await ev('document.documentElement.scrollWidth<=innerWidth+1'));const sizes=await ev('Array.from(document.querySelectorAll("#tops-support-follow-through button,#tops-support-follow-through select,#tops-support-follow-through input,#tops-support-follow-through summary")).filter(n=>n.checkVisibility()).map(n=>[n.getBoundingClientRect().width,n.getBoundingClientRect().height])');for(const [w,h]of sizes)assert.ok(w>=44&&h>=44);}
    assert.deepEqual(errors,[]);assert.equal(blocked.some(r=>r.method!=='GET'||r.postData||r.url.includes('SYNTHETIC')||r.url.includes('/.netlify/')),false);
    console.log('PASS failed atomic save rolls back, 320/375 reflow and44px controls, no provider/member-data request');
    console.log('SUPPORT OUTCOME: LOCAL AUTOMATION PASS. Manual AT and hosted checks remain pending.');
  } finally { if(chrome){await h.stopChrome(chrome);chrome.child.stderr?.destroy();} await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
