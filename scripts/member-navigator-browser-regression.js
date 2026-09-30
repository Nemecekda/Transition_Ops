"use strict";
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),utility=fs.readFileSync(path.join(__dirname,'privacy-network-regression.js'),'utf8');
const h=new Function('fs','path','os','spawn',utility.slice(utility.indexOf('function findChrome()'),utility.indexOf('const PROBE_SCRIPT ='))+'\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs,path,os,spawn);
const server=http.createServer((req,res)=>{const p=path.join(root,req.url.split('?')[0]==='/'?'index.html':req.url.split('?')[0]);if(!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript':p.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(p));});
(async()=>{let chrome;const calls=[],errors=[];let failure=false;try{
await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;chrome=await h.launchChrome(h.findChrome(),12);const c=chrome.client;
await c.send('Fetch.enable',{patterns:[{urlPattern:'*'}]});c.on('Fetch.requestPaused',async e=>{
 if(e.request.url===url+'/.netlify/functions/navigator'){
  calls.push(JSON.parse(e.request.postData));
  await c.send('Fetch.fulfillRequest',{requestId:e.requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:'application/json'}],body:Buffer.from(JSON.stringify(failure?{error:'SYNTHETIC service unavailable'}:{reply:'SYNTHETIC answer: choose one small action. [RESOURCES]'})).toString('base64')});return;
 }
 await c.send(e.request.url.startsWith(url)?'Fetch.continueRequest':'Fetch.failRequest',e.request.url.startsWith(url)?{requestId:e.requestId}:{requestId:e.requestId,errorReason:'BlockedByClient'});
});
await c.send('Runtime.enable');c.on('Runtime.exceptionThrown',e=>errors.push(e.exceptionDetails.text));await c.send('Page.enable');
const ev=x=>h.evaluate(c,x,true),wait=(x,label)=>h.waitForExpression(c,x,label,7000),click=text=>ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==='+JSON.stringify(text)+').click()');
const input=(selector,value)=>ev('var n=document.querySelector('+JSON.stringify(selector)+');Object.getOwnPropertyDescriptor(n.tagName==="TEXTAREA"?HTMLTextAreaElement.prototype:HTMLInputElement.prototype,"value").set.call(n,'+JSON.stringify(value)+');n.dispatchEvent(new Event("input",{bubbles:true}));');
await c.send('Page.navigate',{url:url+'/?tool=dashboard'});await wait('!!document.getElementById("tops-loop-title")','Home');
await ev('localStorage.clear();localStorage.setItem("tops_onboarded","1");localStorage.setItem("tops_user_status","guard");localStorage.setItem("tops_status","SYNTHETIC_PRIVATE_STATUS");localStorage.setItem("tops_sep_date","2027-08-01");localStorage.setItem("tops_personal_guide_v1",JSON.stringify({version:1,pathway:"change",targetRole:"SYNTHETIC_TARGET",currentRole:"SYNTHETIC_PRIVATE_ROLE",goal:"SYNTHETIC_PRIVATE_GOAL"}));');
await c.send('Page.navigate',{url:url+'/?tool=navigator'});await wait('!!document.querySelector("input[aria-label=\\\"Ask the Transition Navigator\\\"]")','existing Navigator');
await input('input[aria-label="Ask the Transition Navigator"]','SYNTHETIC_EXISTING_CHAT');await ev('document.querySelector("button[aria-label=\\\"Send Navigator question\\\"]").click()');await wait('document.body.textContent.includes("SYNTHETIC answer")','existing chat reply');
await input('input[aria-label="Ask the Transition Navigator"]','SYNTHETIC_UNSENT');
await click('Home');await wait('!!document.getElementById("tops-loop-help")','Home help');
await ev('document.querySelector("#tops-loop-help summary").click()');
assert.equal(await ev('document.querySelectorAll("#tops-loop-help input:checked").length'),0);
await ev('Array.from(document.querySelectorAll("#tops-loop-help label")).find(n=>n.textContent.startsWith("Role or field:")).querySelector("input").click()');
const before=calls.length;const pilot=await ev('localStorage.getItem("tops_nav_pilot")');
await click('Open draft in Navigator');await wait('document.activeElement.id==="tops-plan-question"','draft focus');
assert.equal(calls.length,before);assert.equal(await ev('localStorage.getItem("tops_nav_pilot")'),pilot);
const draft=await ev('document.getElementById("tops-plan-question").value');assert.ok(draft.includes('SYNTHETIC_TARGET'));assert.ok(!draft.includes('PRIVATE'));
await input('#tops-plan-question',draft+'\nSYNTHETIC_EDIT');
for(const width of [320,375,1280]){await c.send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:true});assert.ok(await ev('document.documentElement.scrollWidth<=window.innerWidth'));}
await c.send('Emulation.setDeviceMetricsOverride',{width:375,height:900,deviceScaleFactor:1,mobile:true});
await ev('document.getElementById("tops-plan-question-title").scrollIntoView();new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
const shot=await c.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('/tmp/tops-member-navigator-mobile.png',Buffer.from(shot.data,'base64'));
await click('Send this question');await wait('document.querySelector("#tops-plan-question-title").closest("section").textContent.includes("SYNTHETIC answer")','isolated answer');
assert.ok(await ev('Array.from(document.querySelectorAll("button")).some(n=>n.textContent.includes("[RESOURCES")&&n.getBoundingClientRect().height>=44)'));

assert.equal(calls.length,before+1);const sent=calls.at(-1);assert.equal(sent.messages.length,1);assert.equal(sent.messages[0].content,draft+'\nSYNTHETIC_EDIT');assert.equal(sent.context,'');assert.equal(sent.daysOut,null);assert.equal(sent.guideContext,undefined);assert.ok(!JSON.stringify(sent).includes('PRIVATE'));assert.ok(!JSON.stringify(sent).includes('EXISTING_CHAT'));assert.equal(await ev('localStorage.getItem("tops_career_action_v1")'),null);
await click('Return to existing Navigator chat');await wait('!!document.querySelector("input[aria-label=\\\"Ask the Transition Navigator\\\"]")','existing chat restored');
assert.equal(await ev('document.querySelector("input[aria-label=\\\"Ask the Transition Navigator\\\"]").value'),'SYNTHETIC_UNSENT');assert.ok(await ev('document.body.textContent.includes("SYNTHETIC_EXISTING_CHAT")'));
await click('Home');await wait('!!document.getElementById("tops-loop-help")','Home again');await ev('document.querySelector("#tops-loop-help summary").click()');await click('Resume my Navigator draft');await wait('!!document.getElementById("tops-plan-question")','resume');assert.equal(await ev('document.getElementById("tops-plan-question").value'),draft+'\nSYNTHETIC_EDIT');
failure=true;await click('Send this question');await wait('document.querySelector("#tops-plan-question-title").closest("section").textContent.includes("SYNTHETIC service unavailable")','failed request visible');assert.equal(await ev('document.getElementById("tops-plan-question").value'),draft+'\nSYNTHETIC_EDIT');
const limitCalls=calls.length;await ev('localStorage.setItem("tops_nav_pilot",JSON.stringify({d:new Date().toISOString().slice(0,10),n:20}))');await click('Send this question');await wait('document.querySelector("#tops-plan-question-title").closest("section").textContent.includes("daily limit reached")','limit shown in plan panel');assert.equal(calls.length,limitCalls);
await click('Return to my next move');await wait('document.activeElement.id==="tops-loop-title"','Home focus restored');
await ev('document.querySelector("#tops-loop-help summary").click()');await click('Resume my Navigator draft');await wait('!!document.getElementById("tops-plan-question")','resume for discard');await click('Discard this draft and answer');await wait('!!document.getElementById("tops-loop-help")','discard returns Home');await ev('document.querySelector("#tops-loop-help summary").click()');assert.ok(await ev('document.getElementById("tops-loop-help").textContent.includes("Open draft in Navigator")'));assert.equal(await ev('document.querySelectorAll("#tops-loop-help input:checked").length'),0);
assert.deepEqual(errors,[]);console.log('MEMBER NAVIGATOR PASS: opt-in context, zero-call drafting, exact isolated payload, preserved chat/unsent text, editable retry, limit denial, resume/discard, return focus, 320/375/1280. All endpoint replies stubbed; no live model calls.');
}finally{if(chrome)await h.stopChrome(chrome);await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e.stack);process.exitCode=1;});
