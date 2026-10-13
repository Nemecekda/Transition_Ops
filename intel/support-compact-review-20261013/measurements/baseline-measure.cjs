'use strict';
// Synthetic local regression. No official resource, model, or member-data request is allowed.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http'), os = require('node:os'), { spawn } = require('node:child_process');
const baseline=require('child_process').execFileSync('git',['show','ec6506a:index.html'],{cwd:'/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops',maxBuffer:16*1024*1024});
const root = '/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops', utility = fs.readFileSync(path.join(root, 'scripts/privacy-network-regression.js'), 'utf8');
const step = 'Ask a Wisconsin Job Center about eligibility and approval before paying for tools or training.';
const expectedQuestion = 'I am exploring work or training in Wisconsin and may need help with tools, work gear or training costs. Which office can assess my eligibility, what documents should I prepare, and what approval is needed before I spend anything?';
const h = new Function('fs', 'path', 'os', 'spawn', utility.slice(utility.indexOf('function findChrome()'), utility.indexOf('const PROBE_SCRIPT =')) + '\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs, path, os, spawn);
const server = http.createServer((req, res) => {
  const file = path.join(root, req.url.split('?')[0] === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream'); res.end(file===path.join(root,'index.html')?baseline:fs.readFileSync(file));
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

    await load('dashboard');
    await c.send('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:true});
    const observations=[];
    for(const direction of ['support','change']){
      await seed(direction);await set('tops-support-outcome','documents');await wait('document.activeElement.id==="tops-support-review-heading"');
      observations.push(await ev(`(()=>{const ids=['tops-support-review-heading','tops-support-unsaved','tops-support-current','tops-support-focus','tops-support-text','tops-support-help','tops-support-date','tops-support-date-help','tops-support-save','tops-support-cancel'];return {direction:${JSON.stringify(direction)},viewport:{width:innerWidth,height:innerHeight},boxes:ids.map(id=>{const n=document.getElementById(id);if(!n)return{id,absent:true};const r=n.getBoundingClientRect();return{id,top:r.top,bottom:r.bottom,height:r.height,width:r.width}}),sectionHeight:document.getElementById('tops-support-review-heading').parentElement.getBoundingClientRect().height,cardHeight:document.querySelector('.tops-next-move').getBoundingClientRect().height};})()`));
    }
    console.log(JSON.stringify({index:require('crypto').createHash('sha256').update(baseline).digest('hex'),observations},null,2));
  }finally{if(chrome){await h.stopChrome(chrome);chrome.child.stderr?.destroy();}await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
