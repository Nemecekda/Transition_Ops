'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),{spawn}=require('node:child_process');
const root='/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops';
const utility=fs.readFileSync(path.join(root,'scripts/privacy-network-regression.js'),'utf8');
const h=new Function('fs','path','os','spawn',utility.slice(utility.indexOf('function findChrome()'),utility.indexOf('const PROBE_SCRIPT ='))+'\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs,path,os,spawn);
const server=http.createServer((req,res)=>{const name=req.url.split('?')[0];const file=path.join(root,name==='/'?'index.html':name);if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(file));});
(async()=>{let chrome;const errors=[],blocked=[];try{
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;chrome=await h.launchChrome(h.findChrome(),12);const c=chrome.client;
await c.send('Page.enable');await c.send('Runtime.enable');c.on('Runtime.exceptionThrown',e=>errors.push(e.exceptionDetails.text));await c.send('Fetch.enable',{patterns:[{urlPattern:'*'}]});c.on('Fetch.requestPaused',async e=>{const local=e.request.url.startsWith(origin)&&!e.request.url.includes('/.netlify/');if(!local)blocked.push(e.request);try{await c.send(local?'Fetch.continueRequest':'Fetch.failRequest',local?{requestId:e.requestId}:{requestId:e.requestId,errorReason:'BlockedByClient'});}catch{}});
const ev=x=>h.evaluate(c,x,true),wait=x=>h.waitForExpression(c,x,x,10000);
const home=async()=>{await c.send('Page.navigate',{url:origin+'/?tool=dashboard'});await wait('!!document.getElementById("tops-loop-title")');};
const reveal=id=>ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});if(!n)throw Error('missing '+${JSON.stringify(id)});const parents=[];for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS'&&!p.open)parents.unshift(p);for(const p of parents)p.querySelector(':scope > summary').click();})()`);
const click=async id=>{await reveal(id);await ev(`document.getElementById(${JSON.stringify(id)}).click()`);};
const edit=async(id,value)=>{await reveal(id);await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});const proto=n.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:n.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(n,${JSON.stringify(value)});n.dispatchEvent(new Event(n.tagName==='SELECT'?'change':'input',{bubbles:true}));})()`);};
const disk=()=>ev('JSON.stringify(["tops_personal_guide_v1","tops_career_action_v1","tops_career_gap_v1"].map(k=>localStorage.getItem(k)))');
const guide={version:1,pathway:'change',currentRole:'Synthetic equipment technician',targetRole:'Synthetic supervisor',goal:'Keep my planned goal'};
const WI='Ask a Wisconsin Job Center about eligibility and approval before paying for tools or training.';
const seed=async(done=false,text=WI,pathway='change')=>{await ev(`localStorage.clear();localStorage.setItem('tops_onboarded','1');localStorage.setItem('tops_user_status','separated');const g=${JSON.stringify(guide)};g.pathway=${JSON.stringify(pathway)};const a={version:1,text:${JSON.stringify(text)},date:'2027-01-10',done:${done},context:g};const gap=topsEmptyGap();gap.target='Earlier worksheet target';gap.rows[0].have='SYNTHETIC_SOURCE_NEVER_SEND';localStorage.setItem('tops_personal_guide_v1',JSON.stringify(g));localStorage.setItem('tops_career_action_v1',JSON.stringify(a));localStorage.setItem('tops_career_gap_v1',JSON.stringify(gap));`);await home();};
await home();

const results=[];
for(const theme of ['professional','tactical']){
 await c.send('Emulation.setDeviceMetricsOverride',{width:320,height:812,deviceScaleFactor:1,mobile:true});
 await seed(false,WI,'support');await ev(`localStorage.setItem('tops_theme',${JSON.stringify(theme)})`);await home();const before=await disk();
 await edit('tops-support-outcome','documents');await wait('document.activeElement?.id==="tops-support-review-heading"');
 const state=await ev(`(()=>{const n=document.getElementById('tops-support-date'),s=getComputedStyle(n),p=getComputedStyle(n,'::-webkit-calendar-picker-indicator');return{theme:document.documentElement.dataset.theme,scheme:s.colorScheme,filter:p.filter,background:s.backgroundColor,color:s.color,width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height,scrollWidth:document.documentElement.scrollWidth,innerWidth}})()`);
 assert.equal(state.scheme,theme==='professional'?'light':'dark');assert.equal(state.filter,'none');assert.ok(state.width>=44&&state.height>=44);assert.ok(state.scrollWidth<=state.innerWidth+1);assert.equal(await disk(),before);
 await ev('document.getElementById("tops-support-date").scrollIntoView({block:"center"})');
 const shot=await c.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('/tmp/tops-support-review-layout-20261013/final-picker-'+theme+'-320.png',Buffer.from(shot.data,'base64'));
 results.push({theme,...state});await click('tops-support-cancel');await wait('document.activeElement?.id==="tops-support-outcome"');assert.equal(await disk(),before);
}
assert.deepEqual(errors,[]);assert.equal(blocked.some(r=>r.method!=='GET'||r.postData||/SYNTHETIC/.test(r.url)),false);
fs.writeFileSync('/tmp/tops-support-review-layout-20261013/final-picker-observations.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2));console.log('PASS final CSS-only delta: inherited light/dark native scheme, no picker inversion,320px reflow/target/focus/cancel unchanged; no external requests admitted');
}finally{if(chrome){await h.stopChrome(chrome);chrome.child.stderr?.destroy();}await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e.stack);process.exitCode=1;});
