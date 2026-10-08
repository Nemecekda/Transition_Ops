"use strict";
// Synthetic saved actions. External and function traffic is blocked.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),utility=fs.readFileSync(path.join(__dirname,'privacy-network-regression.js'),'utf8');
const h=new Function('fs','path','os','spawn',utility.slice(utility.indexOf('function findChrome()'),utility.indexOf('const PROBE_SCRIPT ='))+'\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs,path,os,spawn);
const server=http.createServer((req,res)=>{const p=path.join(root,req.url.split('?')[0]==='/'?'index.html':req.url.split('?')[0]);if(!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript':p.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(p));});
(async()=>{let chrome;const errors=[],requests=[];try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;chrome=await h.launchChrome(h.findChrome(),12);const c=chrome.client;
 await c.send('Page.enable');await c.send('Runtime.enable');c.on('Runtime.exceptionThrown',e=>errors.push(e.exceptionDetails.text));await c.send('Fetch.enable',{patterns:[{urlPattern:'*'}]});c.on('Fetch.requestPaused',async e=>{requests.push(e.request.url);const local=e.request.url.startsWith(url)&&!e.request.url.includes('/.netlify/');try{await c.send(local?'Fetch.continueRequest':'Fetch.failRequest',local?{requestId:e.requestId}:{requestId:e.requestId,errorReason:'BlockedByClient'});}catch{}});
 const ev=x=>h.evaluate(c,x,true),wait=x=>h.waitForExpression(c,x,x,12000),click=t=>ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==='+JSON.stringify(t)+').click()');
 const load=async()=>{await c.send('Page.navigate',{url:url+'/?tool=dashboard'});await wait('!!document.getElementById("tops-loop-title")');};
 await load();await ev('localStorage.clear();localStorage.setItem("tops_onboarded","1")');
 const title='SYNTHETIC Review reporting requirements for the operations analyst role, compare them with my inventory and team training experience, and prepare two concrete examples to discuss with a career specialist before choosing a training course.';
 for(const pathway of ['change','transition']){
  const guide={version:1,pathway,targetRole:'SYNTHETIC Operations Analyst',currentRole:'',goal:'Keep my full goal visible while planning around current work and family commitments.'},action={version:1,text:title,date:'2026-12-15',done:false,context:guide};
  await ev('localStorage.setItem("tops_personal_guide_v1",'+JSON.stringify(JSON.stringify(guide))+');localStorage.setItem("tops_career_action_v1",'+JSON.stringify(JSON.stringify(action))+')');await load();
  const before=await ev('localStorage.getItem("tops_career_action_v1")'),primary=pathway==='transition'?'Open transition checklist':'Continue my career work';
  assert.equal(await ev('document.querySelector(".tops-next-move-heading").textContent'),title);
  assert.equal(await ev('document.querySelector(".tops-next-move-actions .tops-move-primary").textContent'),primary);
  assert.ok(await ev('(()=>{const p=document.querySelector(".tops-next-move-actions .tops-move-primary"),u=Array.from(document.querySelectorAll(".tops-next-move-actions button")).find(n=>n.textContent==="Update this step"),h=document.querySelector(".tops-next-move-heading"),x=document.querySelector(".tops-next-move-context"),d=document.getElementById("tops-loop-timing"),done=document.getElementById("tops-loop-completion");return [h.compareDocumentPosition(p),p.compareDocumentPosition(u),u.compareDocumentPosition(x),x.compareDocumentPosition(d),d.compareDocumentPosition(done)].every(v=>v&Node.DOCUMENT_POSITION_FOLLOWING)})()'));
  assert.ok(await ev('document.querySelector(".tops-next-move-context").textContent.includes('+JSON.stringify(guide.goal)+')'));
  for(const width of [320,375,1024]){
   await c.send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});
   assert.ok(await ev('document.documentElement.scrollWidth<=innerWidth+1'));
   assert.ok(await ev('(()=>{const h=document.querySelector(".tops-next-move-heading"),p=document.querySelector(".tops-next-move-actions .tops-move-primary"),s=getComputedStyle(h);return h.scrollHeight<=h.clientHeight+1&&s.textOverflow!=="ellipsis"&&p.getBoundingClientRect().height>=44&&parseFloat(s.fontSize)<=32})()'));
  }
  await ev('document.querySelector(".tops-next-move-actions .tops-move-primary").focus()');await c.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await c.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});assert.equal(await ev('document.activeElement.textContent'),'Update this step');assert.equal(await ev('localStorage.getItem("tops_career_action_v1")'),before);
  await click(primary);await wait(pathway==='transition'?'!!document.getElementById("tops-plan-readiness")':'!!document.getElementById("tops-career-start-heading")');assert.equal(await ev('localStorage.getItem("tops_career_action_v1")'),before);await click('Home');await wait('!!document.getElementById("tops-loop-completion")');
  await click('Mark step complete');await wait('!!document.getElementById("tops-loop-reflection")');assert.deepEqual(await ev('JSON.parse(localStorage.getItem("tops_career_action_v1"))'),{...action,done:true});
  assert.ok(await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==="Choose this next step").disabled'));await click('Reopen completed step');await wait('!!document.querySelector(".tops-next-move-actions .tops-move-primary")');assert.deepEqual(await ev('JSON.parse(localStorage.getItem("tops_career_action_v1"))'),action);
 }
 assert.deepEqual(errors,[]);assert.equal(requests.some(x=>x.includes('/.netlify/')||x.includes('SYNTHETIC')),false);
 console.log('ACTION HIERARCHY PASS: exact long action and context preserved, primary before edit/date/completion in DOM and keyboard order, 320/375/1024 reflow, routing unchanged, completion/reflection/reopen retains text/date/context; no provider calls.');
 }finally{if(chrome){await h.stopChrome(chrome);chrome.child.stderr?.destroy();}await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e.stack);process.exitCode=1});
