"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),http=require("node:http"),os=require("node:os"),{spawn}=require("node:child_process");
const root=path.resolve(__dirname,".."),utility=fs.readFileSync(path.join(__dirname,"privacy-network-regression.js"),"utf8");
const h=new Function("fs","path","os","spawn",utility.slice(utility.indexOf("function findChrome()"),utility.indexOf("const PROBE_SCRIPT ="))+"\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};")(fs,path,os,spawn);
const server=http.createServer((req,res)=>{const route=req.url.split("?")[0],p=path.join(root,route==="/"?"index.html":route);if(!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);return res.end();}res.setHeader("Content-Type",p.endsWith(".js")?"text/javascript":p.endsWith(".html")?"text/html":"application/octet-stream");res.end(fs.readFileSync(p));});
(async()=>{let chrome;const requests=[],errors=[],nav=[];try{
 await new Promise(r=>server.listen(0,"127.0.0.1",r));const url="http://127.0.0.1:"+server.address().port;
 chrome=await h.launchChrome(h.findChrome(),12);const c=chrome.client;
 await c.send("Fetch.enable",{patterns:[{urlPattern:"*"}]});c.on("Fetch.requestPaused",async e=>{
  requests.push(e.request.url+" "+(e.request.postData||""));
  if(e.request.url.includes("/.netlify/functions/navigator")){nav.push(JSON.parse(e.request.postData));await c.send("Fetch.fulfillRequest",{requestId:e.requestId,responseCode:200,responseHeaders:[{name:"Content-Type",value:"application/json"}],body:Buffer.from(JSON.stringify({reply:"SYNTHETIC GUIDE RESPONSE"})).toString("base64")});}
  else await c.send(e.request.url.startsWith(url)?"Fetch.continueRequest":"Fetch.failRequest",e.request.url.startsWith(url)?{requestId:e.requestId}:{requestId:e.requestId,errorReason:"BlockedByClient"});
 });
 await c.send("Runtime.enable");c.on("Runtime.exceptionThrown",e=>errors.push(e.exceptionDetails.text));await c.send("Page.enable");
 const ev=x=>h.evaluate(c,x,true),wait=(x,label)=>h.waitForExpression(c,x,label,7000);
 const click=text=>ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==='+JSON.stringify(text)+').click()');
 const input=(id,value)=>ev('var n=document.getElementById('+JSON.stringify(id)+');Object.getOwnPropertyDescriptor(n.tagName==="SELECT"?HTMLSelectElement.prototype:HTMLInputElement.prototype,"value").set.call(n,'+JSON.stringify(value)+');n.dispatchEvent(new Event(n.tagName==="SELECT"?"change":"input",{bubbles:true}));');
 const home=async()=>{await c.send("Page.navigate",{url:url+"/?tool=pathway"});await wait('!!document.getElementById("tops-guide-heading")','guide loaded');await ev('document.getElementById("tops-career-guide").open=true');};
 await home();await ev('localStorage.clear();localStorage.setItem("tops_onboarded","1");localStorage.setItem("tops_user_status","separated");localStorage.setItem("unrelated_guide_sentinel","retain");');await home();
 for(const pathway of ["transition","skills","change"]){
  await input("tops-guide-pathway",pathway);assert.equal(await ev('document.getElementById("tops-guide-pathway").closest("details").id'),'tops-career-guide');await ev('document.getElementById("tops-guide-details").open=true');await input("tops-guide-targetRole","SYNTHETIC_GUIDE_TARGET");await input("tops-guide-currentRole","SYNTHETIC_PRIVATE_ROLE");
  assert.equal(await ev('document.querySelectorAll("[id^=tops-guide-action-]").length'),3);assert.equal(await ev('localStorage.getItem("tops_personal_guide_v1")'),null);assert.equal(nav.length,0);
  assert.equal(await ev('Array.from(document.querySelectorAll("[id^=tops-guide-action-]")).filter(n=>!n.closest("details:not([open])")).length'),1);assert.equal(await ev('document.getElementById("tops-guide-other-steps").open'),false);
 }
 await click("Save guide details");await home();assert.equal(await ev('document.getElementById("tops-guide-targetRole").value'),"SYNTHETIC_GUIDE_TARGET");assert.equal(await ev('localStorage.getItem("tops_sep_date")'),null);
 // Empty worksheet transfer is explicit, session-only, and focuses the target.
 assert.equal(await ev('localStorage.getItem("tops_career_gap_v1")'),null);
 await click("Use this target in my worksheet");await wait('!!document.getElementById("career-gap-target")','empty target handoff');await wait('document.activeElement.id==="career-gap-target"','handoff focus');assert.equal(await ev('document.getElementById("career-gap-target").value'),"SYNTHETIC_GUIDE_TARGET");assert.equal(await ev('localStorage.getItem("tops_career_gap_v1")'),null);assert.ok(await ev('document.body.innerText.includes("Target added to this worksheet")'));assert.ok(!await ev('document.body.innerText.includes("Existing notes and counselor preparation are unchanged and may refer to another role")'));
 // A populated saved worksheet is never overwritten by editing/opening the guide.
 const prior={version:2,target:"SYNTHETIC_OLD_ROLE",rows:[{have:"SYNTHETIC evidence",requirement:"SYNTHETIC requirement",next:"SYNTHETIC_OLD_NEXT",source:"SYNTHETIC source"},...Array.from({length:2},()=>({have:"",requirement:"",next:"",source:""}))],prep:{opportunity:"",source:"",questions:"SYNTHETIC counselor questions",office:"",reference:"",followup:"",status:""}};const priorRaw=JSON.stringify(prior);
 await ev('localStorage.setItem("tops_career_gap_v1",'+JSON.stringify(priorRaw)+')');await home();
 assert.equal(await ev('document.getElementById("tops-guide-target-review").open'),false);await click("Continue my existing worksheet");await wait('!!document.getElementById("career-gap-target")','continue old target');assert.equal(await ev('document.getElementById("career-gap-target").value'),prior.target);assert.equal(await ev('localStorage.getItem("tops_career_gap_v1")'),priorRaw);
 await click("Back to career guide");await wait('!!document.getElementById("tops-guide-heading")','return to guide');await ev('document.getElementById("tops-guide-target-review").open=true');assert.ok(await ev('document.getElementById("tops-guide-target-review").textContent.includes("SYNTHETIC_OLD_ROLE")'));await click("Replace worksheet target");await wait('!!document.getElementById("career-gap-target")','replace target');assert.equal(await ev('document.getElementById("career-gap-target").value'),"SYNTHETIC_GUIDE_TARGET");assert.equal(await ev('document.getElementById("career-gap-0-next").value'),"SYNTHETIC_OLD_NEXT");assert.equal(await ev('document.getElementById("career-prep-questions").value'),prior.prep.questions);assert.equal(await ev('localStorage.getItem("tops_career_gap_v1")'),priorRaw);
 await click("Back to career guide");await wait('!!document.getElementById("tops-guide-heading")','return after replacement');assert.ok(!await ev('document.querySelector("section[aria-labelledby=tops-guide-heading]").textContent.includes("SYNTHETIC_OLD_NEXT")'));
 await ev('document.getElementById("tops-guide-details").open=true');
 await c.send("Emulation.setDeviceMetricsOverride",{width:320,height:900,deviceScaleFactor:1,mobile:true});
 // Native keyboard opens/closes the guide disclosure and moves to its labelled select.
 // Let the scheduled worksheet-to-Home return-focus frame finish before this independent keyboard scenario.
 await ev('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
 await ev('document.querySelector("#tops-guide-details > summary").focus()');
 console.log("KEYBOARD BEFORE",await ev('({active:document.activeElement.outerHTML,open:document.getElementById("tops-guide-details").open,dialogs:Array.from(document.querySelectorAll("[role=dialog]")).map(n=>n.textContent.slice(0,80))})'));
 await c.send("Input.dispatchKeyEvent",{type:"keyDown",key:"Enter",code:"Enter",text:"\r",unmodifiedText:"\r",windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});await c.send("Input.dispatchKeyEvent",{type:"keyUp",key:"Enter",code:"Enter",windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});
 await wait('document.getElementById("tops-guide-details").open===false','keyboard closes details');
 await c.send("Input.dispatchKeyEvent",{type:"keyDown",key:"Enter",code:"Enter",text:"\r",unmodifiedText:"\r",windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});await c.send("Input.dispatchKeyEvent",{type:"keyUp",key:"Enter",code:"Enter",windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});
 await wait('document.getElementById("tops-guide-details").open===true','keyboard opens details');
 await c.send("Input.dispatchKeyEvent",{type:"keyDown",key:"Tab",code:"Tab",windowsVirtualKeyCode:9});await c.send("Input.dispatchKeyEvent",{type:"keyUp",key:"Tab",code:"Tab",windowsVirtualKeyCode:9});await wait('document.activeElement.id==="tops-guide-currentRole"','keyboard reaches labelled optional details');
 for(const width of [320,375]){await c.send("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:true});assert.ok(await ev('document.documentElement.scrollWidth<=window.innerWidth'));}
 await ev('Array.from(document.querySelectorAll("summary")).find(n=>n.textContent==="Review details for Navigator").parentElement.open=true');
 assert.equal(await ev('document.querySelectorAll("section[aria-labelledby=tops-guide-heading] input[type=checkbox]:checked").length'),0);
 assert.ok(await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==="Send selected details to Navigator").disabled'));
 await ev('Array.from(document.querySelectorAll("section[aria-labelledby=tops-guide-heading] label")).find(n=>n.textContent==="My target role or field").querySelector("input").click()');
 assert.equal(await ev('Array.from(document.querySelectorAll("[aria-label]")).find(n=>n.getAttribute("aria-label")==="Selected guide details").textContent'),"My target role or field: SYNTHETIC_GUIDE_TARGET");
 await click("Send selected details to Navigator");await wait('document.body.innerText.includes("SYNTHETIC GUIDE RESPONSE")','stubbed response');assert.equal(nav.length,1);assert.deepEqual(nav[0].guideContext,{targetRole:"SYNTHETIC_GUIDE_TARGET"});assert.equal(nav[0].context,"");assert.equal(nav[0].daysOut,null);assert.equal(JSON.stringify(nav[0]).includes("SYNTHETIC_PRIVATE_ROLE"),false);
 await home();await ev('Array.from(document.querySelectorAll("summary")).find(n=>n.textContent==="Clear saved guide").parentElement.open=true');await click("Confirm clear saved guide");assert.equal(await ev('localStorage.getItem("tops_personal_guide_v1")'),null);assert.equal(await ev('localStorage.getItem("unrelated_guide_sentinel")'),"retain");assert.equal(await ev('document.getElementById("tops-guide-targetRole").value'),"");
 await ev('localStorage.setItem("tops_personal_guide_v1","{broken");');await home();assert.ok(await ev('document.getElementById("tops-guide-status").textContent.includes("could not be read")'));
 await ev('document.getElementById("tops-guide-details").open=true');await input("tops-guide-pathway","skills");
 await ev('window.__originalGuideSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error("blocked")};');await click("Save guide details");assert.ok(await ev('document.getElementById("tops-guide-status").textContent.includes("could not be saved")'));await ev('Storage.prototype.setItem=window.__originalGuideSet');
 await c.send("Network.enable");await c.send("Network.emulateNetworkConditions",{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});await input("tops-guide-pathway","change");assert.equal(await ev('document.querySelectorAll("[id^=tops-guide-action-]").length'),3);
 // Home contains neither setup panel; both remain reachable through primary navigation.
 await click("Home");await wait('Array.from(document.querySelectorAll("input")).some(n=>n.getAttribute("aria-label")==="Search Transition OPS")','Home search');
 assert.equal(await ev('!!document.getElementById("tops-guide-heading")'),false);
 assert.equal(await ev('!!document.getElementById("tops-plan-backup")'),false);
 if(process.env.TOPS_HOME_SCREENSHOT_DIR){
  fs.mkdirSync(process.env.TOPS_HOME_SCREENSHOT_DIR,{recursive:true});
  for(const width of [375,1280]){
   await c.send("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:width<600});
   await ev('window.scrollTo(0,0);new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
   const shot=await c.send("Page.captureScreenshot",{format:"png"});
   fs.writeFileSync(path.join(process.env.TOPS_HOME_SCREENSHOT_DIR,"home-"+width+".png"),Buffer.from(shot.data,"base64"));
  }
  await ev('Array.from(document.querySelectorAll("button")).find(n=>n.getAttribute("aria-label")==="Switch to dark theme").click()');
  await c.send("Emulation.setDeviceMetricsOverride",{width:375,height:900,deviceScaleFactor:1,mobile:true});
  await ev('window.scrollTo(0,0);new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
  const darkShot=await c.send("Page.captureScreenshot",{format:"png"});
  fs.writeFileSync(path.join(process.env.TOPS_HOME_SCREENSHOT_DIR,"home-dark-375.png"),Buffer.from(darkShot.data,"base64"));
 }
 await click("My Plan");await wait('!!document.getElementById("tops-plan-backup")','backup in My Plan');
 await click("Career");await wait('!!document.getElementById("tops-career-guide")','guide in Career');
 assert.equal(await ev('document.getElementById("tops-career-guide").open'),false);
 await ev('document.querySelector("#tops-career-guide > summary").click()');
 await click("Open my career plan");await wait('document.activeElement.id==="career-gap-heading"','explicit plan focus');
 assert.equal(await ev('document.getElementById("tops-career-guide").open'),false);
 await click("Back to career guide");await wait('document.activeElement.id==="tops-guide-open-plan"','guide return focus');
 assert.equal(await ev('document.getElementById("tops-career-guide").open'),true);
 // Cross-app task navigation must preserve data and move focus to usable destinations.
 await click("Career plan");await wait('document.activeElement.id==="career-gap-heading"','career shortcut focus');
 await click("Resume drafter");await wait('document.activeElement.id==="tops-resume-drafter-panel"','resume shortcut focus');
 await click("Career guide");await wait('document.activeElement.id==="tops-guide-heading"','guide shortcut focus');
 assert.equal(nav.length,1);
 await click("Home");await wait('!!document.getElementById("tops-home-search")','search ready');
 assert.equal(await ev('document.getElementById("tops-home-date").open'),false);
 for(const pair of [["resume","Career"],["VA math","VA rating calculator"],["DD214","DD214 and service records"]]){
  await input("tops-home-search",pair[0]);
  await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent.startsWith('+JSON.stringify("TOOL"+pair[1])+')).click()');
  await wait('document.getElementById("tops-page-title")?.textContent==='+JSON.stringify(pair[1]),'search destination');
  assert.equal(await ev('Array.from(document.querySelectorAll("button")).some(n=>n.getAttribute("aria-label")==="Go to home screen")'),true);
  await ev('Array.from(document.querySelectorAll("button")).find(n=>n.getAttribute("aria-label")==="Go to home screen").click()');
  await wait('!!document.getElementById("tops-home-search")','return Home');
 }
 await input("tops-home-search","zzzz-no-match");await click("Browse all tools");
 await wait('!!document.querySelector("[role=dialog]")','tool dialog');
 await c.send("Input.dispatchKeyEvent",{type:"keyDown",key:"Escape",code:"Escape",windowsVirtualKeyCode:27});
 await wait('!document.querySelector("[role=dialog]")','escape closes tools');
 await click("Clear search");assert.equal(await ev('document.activeElement.id'),"tops-home-search");
 assert.equal(await ev('document.getElementById("tops-continue-title").textContent'),"Start your transition checklist");
 await click("Find benefits, services & support");
 await wait('document.getElementById("tops-resource-topic")?.value==="directory"','Home opens all resources');
 assert.equal(await ev('document.getElementById("tops-resource-topic").options.length'),10);
 for(const topic of ["vsos","tap","mindset","leadership","spouse","perks","skillbridge","healthcare","documents","directory"]){
  await input("tops-resource-topic",topic);
  assert.equal(await ev('document.getElementById("tops-resource-topic").value'),topic);
  for(const width of [320,375]){
   await c.send("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:true});
   assert.ok(await ev('document.documentElement.scrollWidth<=window.innerWidth'),'resource topic reflow: '+topic);
  }
 }
 if(process.env.TOPS_HOME_SCREENSHOT_DIR){
  await ev('window.scrollTo(0,0);new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
  const resourceShot=await c.send("Page.captureScreenshot",{format:"png"});
  fs.writeFileSync(path.join(process.env.TOPS_HOME_SCREENSHOT_DIR,"resources-375.png"),Buffer.from(resourceShot.data,"base64"));
 }
 await click("Home");await wait('!!document.getElementById("tops-continue-documents")','Home document shortcut');
 await ev('document.getElementById("tops-continue-documents").click()');
 await wait('document.activeElement.id==="tops-plan-documents"','document shortcut focus');
 assert.equal(await ev('document.getElementById("tops-resource-topic").value'),"documents");
 await click("Home");await wait('!!document.getElementById("tops-home-search")','Home after resources');
 for(const width of [320,375,1280]){
  await c.send("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:width<600});
  assert.ok(await ev('document.documentElement.scrollWidth<=window.innerWidth'));
 }
 assert.equal(requests.filter(r=>r.includes("SYNTHETIC_PRIVATE_ROLE")).length,0);assert.equal(errors.length,0);
 console.log("GUIDE BROWSER PASS: Chrome; three separated-veteran pathways without date; optional save/reload; keyboard disclosure/select; 320/375 reflow; unchecked consent; labelled preview equals selected payload; stubbed send only; scoped clear; corrupt and denied storage; offline planning; no private-role transfer; zero JS errors");
 } finally {if(chrome)await h.stopChrome(chrome);await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
