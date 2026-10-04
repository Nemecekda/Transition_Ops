"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),http=require("node:http"),os=require("node:os"),{spawn}=require("node:child_process");
const root=path.resolve(__dirname,".."),utility=fs.readFileSync(path.join(__dirname,"privacy-network-regression.js"),"utf8");
const h=new Function("fs","path","os","spawn",utility.slice(utility.indexOf("function findChrome()"),utility.indexOf("const PROBE_SCRIPT ="))+"\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};")(fs,path,os,spawn);
const server=http.createServer((req,res)=>{const route=req.url.split("?")[0],p=path.join(root,route==="/"?"index.html":route);if(!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);return res.end();}res.setHeader("Content-Type",p.endsWith(".js")?"text/javascript":p.endsWith(".html")?"text/html":"application/octet-stream");res.end(fs.readFileSync(p));});
(async()=>{let chrome;const requests=[],errors=[];try{
await new Promise(r=>server.listen(0,"127.0.0.1",r));const url="http://127.0.0.1:"+server.address().port;chrome=await h.launchChrome(h.findChrome(),12);const c=chrome.client;
await c.send("Fetch.enable",{patterns:[{urlPattern:"*"}]});c.on("Fetch.requestPaused",async e=>{requests.push(e.request.url+" "+(e.request.postData||""));await c.send(e.request.url.startsWith(url)?"Fetch.continueRequest":"Fetch.failRequest",e.request.url.startsWith(url)?{requestId:e.requestId}:{requestId:e.requestId,errorReason:"BlockedByClient"});});await c.send("Runtime.enable");c.on("Runtime.exceptionThrown",e=>errors.push(e.exceptionDetails.text));
const ev=x=>h.evaluate(c,x,true),wait=(x,label)=>h.waitForExpression(c,x,label,7000),click=async text=>ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==='+JSON.stringify(text)+').click()');
await c.send("Page.enable");
await c.send("Page.addScriptToEvaluateOnNewDocument",{source:'localStorage.setItem("tops_onboarded","1");localStorage.setItem("tops_user_status","guard");localStorage.setItem("tops_user_branch","army");'});
await c.send("Page.navigate",{url});await wait('!!document.getElementById("guard-career-heading")','Guard Home');assert.equal(await ev('document.querySelector("#guard-support-area").value'),"national");
// Explicit employer entry with no target occupation; no auto-fill or persistence.
await ev('Array.from(document.querySelectorAll("summary")).find(n=>n.textContent==="Employers that pledged support").click()');
await click("Plan my next career move");await wait('document.activeElement.id==="career-prep-opportunity"','opportunity entry focus');assert.equal(await ev('document.getElementById("career-prep-details").open'),true);assert.equal(await ev('localStorage.getItem("tops_career_gap_v1")'),null);
for(const [id,value] of [["opportunity","SYNTHETIC_GUARD_TARGET training program"],["source","<img src=x onerror=alert(1)>"],["followup","Ask the education office about prerequisites"]]){await ev('document.getElementById('+JSON.stringify("career-prep-"+id)+').focus()');await c.send("Input.insertText",{text:value});}
await click("Save on this browser");const employerRaw=await ev('localStorage.getItem("tops_career_gap_v1")');await click("Back to Home");await wait('!!document.getElementById("guard-career-heading")','return Guard');assert.ok(await ev('document.body.textContent.includes("Ask the education office about prerequisites")'));assert.ok(await ev('document.body.textContent.includes("SYNTHETIC_GUARD_TARGET training program")'));await c.send("Page.reload");await wait('!!document.getElementById("guard-career-heading")','employer reload');await click("Continue my career plan");await wait('document.activeElement.id==="career-prep-opportunity"','continue opportunity focus');assert.equal(await ev('document.getElementById("career-gap-target").value'),"");assert.equal(await ev('localStorage.getItem("tops_career_gap_v1")'),employerRaw);assert.equal(await ev('document.getElementById("career-prep-source").value'),"<img src=x onerror=alert(1)>");
await click("Clear worksheet");await click("Back to Home");await wait('!!document.getElementById("guard-career-heading")','cleared return');assert.ok(!await ev('document.body.textContent.includes("Ask the education office about prerequisites")'));
await click("Work on my career plan");await wait('document.activeElement.id==="career-gap-heading"','Gap focus');
await ev('document.getElementById("career-gap-target").focus()');await c.send("Input.insertText",{text:"SYNTHETIC_GUARD_TARGET"});await click("Save on this browser");await c.send("Page.reload");await wait('!!document.getElementById("guard-career-heading")','reload Guard');assert.ok(await ev('document.body.textContent.includes("SYNTHETIC_GUARD_TARGET")'));
await ev('Array.from(document.querySelectorAll("summary")).find(n=>n.textContent==="Find career and family support").click()');
await ev('const s=document.getElementById("guard-support-area");Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value").set.call(s,"wi");s.dispatchEvent(new Event("change",{bubbles:true}));');await wait('document.body.textContent.includes("Wisconsin Service Member Support")','WI selection');const raw=await ev('localStorage.getItem("tops_career_gap_v1")');
await ev('Array.from(document.querySelectorAll("button")).find(n=>n.getAttribute("aria-label")==="Prepare my question for Wisconsin Service Member Support").click()');await wait('document.activeElement.id==="career-gap-heading"','office Gap focus');assert.equal(await ev('localStorage.getItem("tops_career_gap_v1")'),raw);
await click("Use this public office reference");await wait('!Array.from(document.querySelectorAll("aside")).some(n=>n.getAttribute("aria-label")==="Selected public office")','offer consumed');assert.equal(await ev('document.getElementById("career-prep-reference").value'),"https://dma.wi.gov/service-member-support-division/");assert.equal(await ev('document.getElementById("career-prep-status").value'),"");assert.equal(await ev('localStorage.getItem("tops_career_gap_v1")'),raw);
await click("Save on this browser");await click("Review conversation summary");await wait('document.activeElement.id==="career-prep-summary-heading"','summary focus');assert.ok(await ev('document.body.textContent.includes("https://dma.wi.gov/service-member-support-division/")'));
for(const width of [320,375]){await c.send("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:true});assert.ok(await ev('document.documentElement.scrollWidth<=window.innerWidth'),"summary no overflow");}
await click("Back to edit worksheet");await wait('document.activeElement.id==="career-gap-heading"','back focus');await click("Clear worksheet");assert.equal(await ev('localStorage.getItem("tops_career_gap_v1")'),null);assert.equal(await ev('localStorage.getItem("tops_user_status")'),"guard");
await c.send("Page.reload");await wait('!!document.getElementById("guard-career-heading")','clean Guard');
await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent.includes("Open transition timeline")).focus()');await c.send("Input.dispatchKeyEvent",{type:"keyDown",key:"Enter",code:"Enter",text:"\r",unmodifiedText:"\r",nativeVirtualKeyCode:13,windowsVirtualKeyCode:13});await c.send("Input.dispatchKeyEvent",{type:"keyUp",key:"Enter",code:"Enter",windowsVirtualKeyCode:13});await wait('!!document.getElementById("tops-plan-timeline")','Timeline');assert.equal(await ev('localStorage.getItem("tops_user_status")'),"guard");
assert.ok(!requests.some(r=>r.includes("SYNTHETIC_GUARD_TARGET")));assert.equal(errors.length,0,JSON.stringify(errors));console.log("GUARD BROWSER PASS: employer/training blank-target continuity; explicit route focus; source plaintext; Save/reload/Home/clear; full app Guard->GAP focus; save/reload; WI; offer no write; explicit reference use/save/summary; unknown contact status; 320/375 no overflow; clear isolation; keyboard Guard-preserving Timeline; zero synthetic text transfer; zero JS errors");
const input=(id,value)=>ev('var n=document.getElementById('+JSON.stringify(id)+');Object.getOwnPropertyDescriptor(n.tagName==="SELECT"?HTMLSelectElement.prototype:HTMLTextAreaElement.prototype,"value").set.call(n,'+JSON.stringify(value)+');n.dispatchEvent(new Event(n.tagName==="SELECT"?"change":"input",{bubbles:true}));');
const home=async()=>{await c.send('Page.navigate',{url:url+'/?tool=dashboard'});await wait('!!document.getElementById("tops-loop-title")','Home');};
const openConversation=async moment=>{await click('Plan around my service commitments');await input('tops-loop-service-moment',moment);await click('Prepare this conversation');await wait('document.activeElement.id==="career-service-prep-heading"','conversation heading focus');};
const guide={version:1,pathway:'change',targetRole:'SYNTHETIC_ROLE',currentRole:'',goal:''};
await ev('localStorage.setItem("tops_personal_guide_v1",'+JSON.stringify(JSON.stringify(guide))+');');
for(const moment of ['away','return']){
 await home();await openConversation(moment);
 assert.equal(await ev('document.getElementById("career-prep-details").open'),true);
 await input('career-prep-questions','SYNTHETIC existing question');await click('Save on this browser');
 const savedBefore=await ev('localStorage.getItem("tops_career_gap_v1")');
 await click('Add starter questions to my notes');await wait('document.activeElement.id==="career-prep-questions"','combined notes focus');
 const combined=await ev('document.getElementById("career-prep-questions").value');
 assert.ok(combined.startsWith('SYNTHETIC existing question\n\n'));
 assert.ok(combined.includes(moment==='away'?'handoff':'priorities or processes'));
 assert.equal(await ev('localStorage.getItem("tops_career_gap_v1")'),savedBefore);
 assert.equal(await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==="Add starter questions to my notes").disabled'),true);
 await click('Save on this browser');await click('Review conversation summary');
 assert.ok(await ev('document.body.textContent.includes('+JSON.stringify(combined)+')'));
 await home();await openConversation(moment);assert.equal(await ev('document.getElementById("career-prep-questions").value'),combined);
 await input('career-prep-questions','x'.repeat(590));await click('Save on this browser');
 assert.equal(await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==="Add starter questions to my notes").disabled'),true);
 assert.ok(await ev('document.getElementById("career-service-prep-help").textContent.includes("will not fit")'));
 assert.equal(await ev('document.getElementById("career-prep-questions").value.length'),590);
 await input('career-prep-questions','');
 assert.equal(await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==="Add starter questions to my notes").disabled'),false);
 await click('Clear worksheet');
}
await click('Back to Home');await wait('!!document.getElementById("guard-career-heading")','return after conversation');
await click('Work on my career plan');await wait('!!document.getElementById("career-gap-heading")','normal worksheet');
assert.equal(await ev('!!document.getElementById("career-service-prep-heading")'),false);
assert.equal(await ev('topsServiceConversation("constructor")'),null);
for(const theme of ['professional','tactical'])for(const width of [320,375]){
 await ev('localStorage.setItem("tops_theme",'+JSON.stringify(theme)+')');
 await c.send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:true});
 await home();await openConversation('return');
 assert.equal(await ev('document.documentElement.scrollWidth<=innerWidth'),true);
 assert.equal(await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==="Add starter questions to my notes").getBoundingClientRect().height>=44'),true);
 if(process.env.TOPS_CONVERSATION_SCREENSHOT_DIR && width===375){fs.mkdirSync(process.env.TOPS_CONVERSATION_SCREENSHOT_DIR,{recursive:true});const shot=await c.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(process.env.TOPS_CONVERSATION_SCREENSHOT_DIR,theme+'.png'),Buffer.from(shot.data,'base64'));}
}
assert.equal(errors.length,0,JSON.stringify(errors));assert.equal(requests.some(r=>r.includes('SYNTHETIC existing question')||r.includes('/.netlify/functions/')),false);
console.log('GUARD CONVERSATION PASS: two situations; direct route and heading focus; preserve existing notes; explicit append/save/reload; duplicate and capacity guards; summary; both themes at 320/375; no model or synthetic-text request');
}catch(e){if(chrome)console.error(await h.evaluate(chrome.client,'({url:location.href,text:document.body.innerText.slice(0,1500)})',true));console.error(JSON.stringify({requests,errors}));throw e;}finally{if(chrome)await h.stopChrome(chrome);await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e.stack);process.exitCode=1;});
