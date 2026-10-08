"use strict";
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),utility=fs.readFileSync(path.join(__dirname,'privacy-network-regression.js'),'utf8');
const h=new Function('fs','path','os','spawn',utility.slice(utility.indexOf('function findChrome()'),utility.indexOf('const PROBE_SCRIPT ='))+'\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs,path,os,spawn);
const server=http.createServer((req,res)=>{const p=path.join(root,req.url.split('?')[0]==='/'?'index.html':req.url.split('?')[0]);if(!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript':p.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(p));});
(async()=>{let chrome;const requests=[],errors=[];try{
await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;chrome=await h.launchChrome(h.findChrome(),12);const c=chrome.client;
await c.send('Fetch.enable',{patterns:[{urlPattern:'*'}]});c.on('Fetch.requestPaused',async e=>{requests.push(e.request.url+' '+(e.request.postData||''));await c.send(e.request.url.startsWith(url)?'Fetch.continueRequest':'Fetch.failRequest',e.request.url.startsWith(url)?{requestId:e.requestId}:{requestId:e.requestId,errorReason:'BlockedByClient'});});
await c.send('Runtime.enable');c.on('Runtime.exceptionThrown',e=>errors.push(e.exceptionDetails.text));await c.send('Page.enable');
const ev=x=>h.evaluate(c,x,true),wait=(x,label)=>h.waitForExpression(c,x,label,7000),click=text=>ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==='+JSON.stringify(text)+').click()');
const input=(id,value)=>ev('var n=document.getElementById('+JSON.stringify(id)+');Object.getOwnPropertyDescriptor(n.tagName==="SELECT"?HTMLSelectElement.prototype:HTMLInputElement.prototype,"value").set.call(n,'+JSON.stringify(value)+');n.dispatchEvent(new Event(n.tagName==="SELECT"?"change":"input",{bubbles:true}));');
const home=async()=>{await c.send('Page.navigate',{url:url+'/?tool=dashboard'});await wait('!!document.getElementById("tops-loop-title")','member loop Home');};
await home();
await ev('localStorage.clear()');await c.send('Page.navigate',{url:url+'/'});await wait('!!document.querySelector(".onboard-cta-primary")','first visit welcome');
assert.equal(await ev('document.querySelector(".onboard-cta-primary").textContent'),'FIND MY STARTING POINT');
await click('PERSONALIZE MY VIEW (OPTIONAL)');await wait('document.body.textContent.includes("STEP 1 OF 4")','optional setup still reachable');
assert.equal(await ev('localStorage.getItem("tops_user_status")'),null);
for(const status of ['ACTIVE DUTY','ALREADY SEPARATED','RETIRED','MILITARY SPOUSE']){
 await ev('localStorage.clear()');await c.send('Page.navigate',{url:url+'/'});await wait('!!document.querySelector(".onboard-cta-primary")','optional setup welcome');
 await click('PERSONALIZE MY VIEW (OPTIONAL)');
 await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent.includes('+JSON.stringify(status)+')).click()');
 assert.equal(await ev('document.querySelectorAll("button[aria-pressed=true]").length'),1);
 await click('CONTINUE \u2192');await click('ARMY');await click('CONTINUE \u2192');
 await wait('!!document.getElementById("tops-onboard-date")','optional date');
 await input('tops-onboard-date','2027-06-01');await input('tops-onboard-date','');
 await click('CONTINUE WITHOUT A DATE');
 await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent.includes("JUST GETTING STARTED")).click()');
 await click('LAUNCH TRANSITION OPS \u2192');await wait('!!document.getElementById("tops-loop-title")','optional setup reaches Home');
 assert.equal(await ev('localStorage.getItem("tops_sep_date")'),null);
 assert.equal(await ev('localStorage.getItem("etsDate")'),null);
}
await ev('localStorage.clear()');
await c.send('Page.navigate',{url:url+'/'});await wait('!!document.querySelector(".onboard-cta-primary")','welcome again');
await click('FIND MY STARTING POINT');await wait('document.activeElement.id==="tops-loop-title"','welcome routes and focuses starting points');
assert.equal(await ev('document.querySelectorAll("#tops-member-starts button").length'),4);
for(const key of ['tops_user_status','tops_personal_guide_v1','tops_career_action_v1','tops_sep_date'])assert.equal(await ev('localStorage.getItem('+JSON.stringify(key)+')'),null);
const selection=await ev('(()=>{const g={version:1,pathway:"change",targetRole:"SYNTHETIC_TARGET",currentRole:"",goal:""},a=topsEmptyAction();const gap={target:"SYNTHETIC_TARGET",rows:[{next:"SYNTHETIC_MEMBER_NEXT"}]};return {matching:topsMemberMove(g,a,gap,"guard"),mismatch:topsMemberMove(g,a,{...gap,target:"OLD_TARGET"},"guard")};})()');
assert.equal(selection.matching.title,'SYNTHETIC_MEMBER_NEXT');assert.notEqual(selection.mismatch.title,'SYNTHETIC_MEMBER_NEXT');
const unsetTargets=await ev('(()=>{const g={version:1,pathway:"change",targetRole:"",currentRole:"",goal:"Explore a different field"},gap={target:"SYNTHETIC_OLD_ROLE",rows:[{next:"SYNTHETIC_OLD_STEP"}]};return ["active","guard","separated","retired"].map(profile=>topsMemberMove(g,topsEmptyAction(),gap,profile));})()');
for(const move of unsetTargets){assert.equal(move.kind,'suggest');assert.equal(move.title,'Choose one role or skill to explore');assert.ok(!JSON.stringify(move).includes('SYNTHETIC_OLD'));}
const timingCases=await ev('(()=>{const g={version:1,pathway:"change",targetRole:"ROLE",currentRole:"",goal:""},a={version:1,text:"STEP",date:"2026-09-30",done:false,context:g};return {today:topsMemberTiming(g,a,"2026-09-30"),past:topsMemberTiming(g,a,"2026-10-01"),future:topsMemberTiming(g,a,"2026-09-29"),done:topsMemberTiming(g,{...a,done:true},"2026-10-01"),stale:topsMemberTiming({...g,targetRole:"NEW"},a,"2026-10-01"),missing:topsMemberTiming(g,{...a,date:""},"2026-10-01"),bad:topsMemberTiming(g,{...a,date:"2026-02-30"},"2026-10-01")};})()');
assert.equal(timingCases.today.kind,'today');assert.equal(timingCases.past.kind,'past');assert.equal(timingCases.future.kind,'upcoming');for(const key of ['done','stale','missing','bad'])assert.equal(timingCases[key],null);
await c.send('Emulation.setTimezoneOverride',{timezoneId:'Pacific/Honolulu'});assert.equal(await ev('topsMemberLocalDay(new Date("2026-09-30T00:30:00Z"))'),'2026-09-29');
await c.send('Emulation.setTimezoneOverride',{timezoneId:'Europe/Berlin'});assert.equal(await ev('topsMemberLocalDay(new Date("2026-09-30T00:30:00Z"))'),'2026-09-30');
await c.send('Emulation.setTimezoneOverride',{timezoneId:'America/Chicago'});
// Guard/Reserve service changes shape suggestions without overwriting the saved step.
const serviceGuide={version:1,pathway:'change',targetRole:'SYNTHETIC_ROLE',currentRole:'',goal:''};
const serviceAction={version:1,text:'SYNTHETIC_EXISTING_STEP',date:'2027-01-15',done:false,context:serviceGuide};
await ev('localStorage.clear();localStorage.setItem("tops_onboarded","1");localStorage.setItem("tops_user_status","guard");localStorage.setItem("tops_personal_guide_v1",'+JSON.stringify(JSON.stringify(serviceGuide))+');localStorage.setItem("tops_career_action_v1",'+JSON.stringify(JSON.stringify(serviceAction))+');');
await home();await click('Plan around my service commitments');
await wait('document.activeElement.id==="tops-loop-service-moment"','service check-in focused');
assert.equal(await ev('document.getElementById("tops-loop-checkin").open'),true);
assert.equal(await ev(`!!document.querySelector('[aria-label="Alternative next step"]')`),false);
for(const [moment,phrase] of [['balance','realistic career work session'],['away','work handoff'],['return','return-to-work conversation']]){
 await input('tops-loop-service-moment',moment);
 assert.ok((await ev(`document.querySelector('[aria-label="Alternative next step"]').textContent`)).includes(phrase));
 assert.equal(await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==="Review this as my next step").disabled'),true);
 assert.equal(await ev('localStorage.getItem("tops_career_action_v1")'),JSON.stringify(serviceAction));
}
await ev(`document.querySelector('[aria-label="Alternative next step"] input[type=checkbox]').click()`);
await input('tops-loop-service-moment','away');
assert.equal(await ev(`document.querySelector('[aria-label="Alternative next step"] input[type=checkbox]').checked`),false);
await ev(`document.querySelector('[aria-label="Alternative next step"] input[type=checkbox]').click()`);
await click('Review this as my next step');await wait('document.activeElement.id==="tops-action-heading"','service step editor');
assert.equal(await ev('localStorage.getItem("tops_career_action_v1")'),JSON.stringify(serviceAction));
await click('Save career step');
assert.ok(JSON.parse(await ev('localStorage.getItem("tops_career_action_v1")')).text.includes('work handoff'));
await home();assert.ok((await ev('document.getElementById("tops-loop-title").parentElement.textContent')).includes('work handoff'));
assert.equal(await ev('document.getElementById("tops-loop-blocker").value'),'');
assert.equal(await ev('topsMemberAdjustment("service",'+JSON.stringify(serviceGuide)+',"active","","away")'),null);
await ev('localStorage.setItem("tops_user_status","separated")');await home();
assert.equal(await ev('Array.from(document.querySelectorAll("button")).some(n=>n.textContent==="Plan around my service commitments")'),false);
assert.equal(await ev('!!document.querySelector("#tops-loop-blocker option[value=service]")'),false);
console.log('PASS Guard/Reserve service situations, replacement consent reset, explicit save, reload, focus and profile isolation');
await ev('localStorage.setItem("tops_user_status","guard")');
for(const theme of ['professional','tactical'])for(const width of [320,375,900]){
 await ev('localStorage.setItem("tops_theme",'+JSON.stringify(theme)+')');
 await c.send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});
 await home();await click('Plan around my service commitments');await input('tops-loop-service-moment','return');
 assert.equal(await ev('document.documentElement.scrollWidth<=innerWidth'),true);
 assert.equal(await ev('document.getElementById("tops-loop-service-moment").getBoundingClientRect().height>=44'),true);
 assert.equal(await ev('document.querySelectorAll("label[for=tops-loop-service-moment]").length'),1);
 if(process.env.TOPS_SERVICE_SCREENSHOT_DIR && width===375){fs.mkdirSync(process.env.TOPS_SERVICE_SCREENSHOT_DIR,{recursive:true});const shot=await c.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(process.env.TOPS_SERVICE_SCREENSHOT_DIR,theme+'.png'),Buffer.from(shot.data,'base64'));}
 console.log('PASS service check-in reflow and select target '+theme+' '+width);
}
await c.send('Emulation.clearDeviceMetricsOverride');
for(const [profile,pathway] of [['','change'],['active','transition'],['separated','change'],['retired','change'],['guard','change'],['guard','skills'],['spouse','change']]){
 await ev('localStorage.clear();localStorage.setItem("tops_onboarded","1");localStorage.setItem("tops_user_status",'+JSON.stringify(profile)+');');await home();
 const starts=await ev('topsMemberStarts()');
 assert.deepEqual(starts.map(item=>item.id),['work','explore','grow','leave']);
 for(const start of starts){
  assert.equal(await ev('document.querySelectorAll("#tops-member-starts button").length'),4);
  await ev('document.querySelector('+JSON.stringify('#tops-member-starts button[aria-label="'+start.title+'"]')+').click()');
  await wait('document.activeElement.id==="tops-loop-title"','starting point focus');
  assert.equal(await ev('localStorage.getItem("tops_personal_guide_v1")'),null);
  assert.equal(await ev('localStorage.getItem("tops_career_action_v1")'),null);
  assert.equal(await ev('localStorage.getItem("tops_sep_date")'),null);
  assert.ok(await ev('document.getElementById("tops-loop-title").closest("section").textContent.includes("Review this as my next step")'));
  assert.ok(await ev('document.getElementById("tops-home-tools-title").closest("section").textContent.includes("All tools")'));
  await home();
 }
 if(profile==='guard'&&process.env.TOPS_LOOP_SCREENSHOT_DIR){
  fs.mkdirSync(process.env.TOPS_LOOP_SCREENSHOT_DIR,{recursive:true});await c.send('Emulation.setDeviceMetricsOverride',{width:375,height:900,deviceScaleFactor:1,mobile:true});
  const startShot=await c.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(process.env.TOPS_LOOP_SCREENSHOT_DIR,'starting-points.png'),Buffer.from(startShot.data,'base64'));
 }
 assert.equal(await ev('document.getElementById("tops-loop-direction").open'),false);
 await ev('document.querySelector("#tops-loop-direction summary").click()');
 await input('tops-loop-path',pathway);
 await input('tops-loop-target','SYNTHETIC_LOOP_ROLE');await input('tops-loop-goal','SYNTHETIC_LOOP_GOAL');
 await click('Save my direction');await wait('document.activeElement.id==="tops-loop-title"','direction returns focus');
 assert.equal(await ev('localStorage.getItem("tops_sep_date")'),null);
 await home();
 assert.ok(await ev('document.getElementById("tops-loop-title").closest("section").textContent.includes("SYNTHETIC_LOOP_ROLE")'));
 if(profile==='guard')assert.ok(await ev('document.getElementById("tops-loop-title").closest("section").textContent.includes("alongside service")'));
 if(['separated','retired'].includes(profile))assert.ok(await ev('document.getElementById("tops-loop-title").closest("section").textContent.includes("no separation date is needed")'));
 await click('Choose this next step');await wait('!!document.getElementById("tops-action-text")','step editor');
 await wait('document.activeElement.id==="tops-action-heading"','suggested step focuses editor heading');
 assert.equal(await ev('document.getElementById("tops-action-heading").getBoundingClientRect().top>=document.querySelector(".tops-app-header").getBoundingClientRect().bottom'),true);
 assert.equal(await ev('localStorage.getItem("tops_career_action_v1")'),null);
 await input('tops-action-text','SYNTHETIC_LOOP_STEP for '+profile);await input('tops-action-date','2026-10-20');await click('Save career step');
 await home();assert.ok(await ev('document.getElementById("tops-loop-title").closest("section").textContent.includes("SYNTHETIC_LOOP_STEP")'));
 assert.ok(await ev('document.getElementById("tops-loop-timing").textContent.includes("not a benefits deadline")'));
 const savedStep=await ev('JSON.parse(localStorage.getItem("tops_career_action_v1"))');
 if(profile===''){
  await ev('window.__completionSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error("blocked")};');
  await click('Mark step complete');
  assert.ok(await ev('document.getElementById("tops-loop-title").closest("section").textContent.includes("Completion was not saved")'));
  assert.deepEqual(await ev('JSON.parse(localStorage.getItem("tops_career_action_v1"))'),savedStep);
  await ev('Storage.prototype.setItem=window.__completionSet');
  await ev('localStorage.setItem("tops_career_action_v1",JSON.stringify({...JSON.parse(localStorage.getItem("tops_career_action_v1")),text:"ANOTHER_TAB_STEP"}))');
  await click('Mark step complete');
  assert.equal(await ev('JSON.parse(localStorage.getItem("tops_career_action_v1")).text'),'ANOTHER_TAB_STEP');
  assert.ok(await ev('document.getElementById("tops-loop-title").closest("section").textContent.includes("Your saved step changed")'));
  await ev('localStorage.setItem("tops_career_action_v1",'+JSON.stringify(JSON.stringify(savedStep))+')');
  await home();
 }
 await click('Mark step complete');await wait('document.activeElement.id==="tops-loop-title"','completion focus');
 assert.deepEqual(await ev('JSON.parse(localStorage.getItem("tops_career_action_v1"))'),{...savedStep,done:true});
 await home();assert.ok(await ev('!!document.getElementById("tops-loop-completion")'));
 assert.equal(await ev('document.getElementById("tops-loop-timing")'),null);
 const completedCopy=await ev('localStorage.getItem("tops_career_action_v1")');
 assert.equal(await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==="Choose this next step").disabled'),true);
 for(const outcome of ['ready','gap','rethink','help']){
  await input('tops-loop-reflection',outcome);
  const reflectionTitle=await ev('document.getElementById("tops-loop-title").closest("section").querySelector("h3").textContent');
  const expected=outcome==='help'?'adviser':outcome==='rethink'?(pathway==='transition'?'priorities':'two possible roles'):outcome==='gap'?(pathway==='transition'?'transition gap':'missing skill'):pathway==='transition'?'unfinished transition task':pathway==='skills'?'small project':'two questions';
  assert.ok(reflectionTitle.includes(expected),profile+' '+pathway+' '+outcome);
  assert.equal(await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==="Choose this next step").disabled'),false);
  assert.equal(await ev('localStorage.getItem("tops_career_action_v1")'),completedCopy);
 }
 await input('tops-loop-reflection','ready');
 await click('Choose this next step');await wait('document.activeElement.id==="tops-action-heading"','reflected next step opens for review');
 assert.equal(await ev('localStorage.getItem("tops_career_action_v1")'),completedCopy);
 assert.equal(await ev('document.getElementById("tops-loop-reflection")'),null);
 await home();
 assert.equal(await ev('document.getElementById("tops-loop-reflection").value'),'');
 await click('Reopen completed step');await home();
 assert.deepEqual(await ev('JSON.parse(localStorage.getItem("tops_career_action_v1"))'),savedStep);
 await click('Review my target date');await wait('document.activeElement.id==="tops-action-date"','date shortcut keeps field focus');
 await click('Close step editor');
 await click('Update this step');await wait('document.activeElement.id==="tops-action-heading"','update focuses editor heading');await input('tops-action-text','UNSAVED_COMPLETION_DRAFT');
 assert.equal(await ev('document.getElementById("tops-loop-completion")'),null);
 await click('Close step editor');assert.equal(await ev('document.getElementById("tops-loop-completion")'),null);
 assert.deepEqual(await ev('JSON.parse(localStorage.getItem("tops_career_action_v1"))'),savedStep);
 await home();
 const beforeDate=await ev('localStorage.getItem("tops_career_action_v1")');
 await click('Review my target date');await wait('document.activeElement.id==="tops-action-date"','target-date focus');
 await input('tops-action-date',await ev('topsMemberLocalDay()'));assert.equal(await ev('localStorage.getItem("tops_career_action_v1")'),beforeDate);
 await click('Save career step');await home();assert.ok(await ev('document.getElementById("tops-loop-timing").textContent.includes("planned this step for today")'));
 await click('Review my target date');await input('tops-action-date','2000-01-01');await click('Save career step');await home();assert.ok(await ev('document.getElementById("tops-loop-timing").textContent.includes("target date has passed")'));
 if(process.env.TOPS_LOOP_SCREENSHOT_DIR){
  fs.mkdirSync(process.env.TOPS_LOOP_SCREENSHOT_DIR,{recursive:true});
  await c.send('Emulation.setDeviceMetricsOverride',{width:375,height:900,deviceScaleFactor:1,mobile:true});
  await ev('window.scrollTo(0,0);new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
  const shot=await c.send('Page.captureScreenshot',{format:'png'});
  fs.writeFileSync(path.join(process.env.TOPS_LOOP_SCREENSHOT_DIR,profile+'.png'),Buffer.from(shot.data,'base64'));
 }
 await click(profile==='active'?'Open readiness check':'Continue my career work');
 await wait('document.activeElement.id==='+JSON.stringify(profile==='active'?'tops-plan-readiness':'tops-career-start-heading'),'loop tool destination focus');
 await click('Home');await wait('!!document.getElementById("tops-loop-title")','return to loop');
 const unchanged=await ev('localStorage.getItem("tops_career_action_v1")');
 await ev('document.querySelector("#tops-loop-checkin summary").click()');
 for(const blocker of ['direction','skills','time','person']){
  await input('tops-loop-blocker',blocker);
  assert.ok(await ev('Array.from(document.querySelectorAll("[role=region]")).some(n=>n.getAttribute("aria-label")==="Alternative next step")'));
  assert.equal(await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==="Review this as my next step").disabled'),true);
  assert.equal(await ev('localStorage.getItem("tops_career_action_v1")'),unchanged);
  if(blocker==='time'){
   for(const minutes of ['10','30','60']){
    await input('tops-loop-minutes',minutes);
    assert.ok(await ev('document.querySelector("#tops-loop-checkin [role=region] h3").textContent.startsWith('+JSON.stringify(minutes+'-minute session: ')+')'));
    const detail=await ev('document.querySelector("#tops-loop-checkin [role=region]").textContent');
    assert.ok(detail.includes('not a promise to finish'));
    if(profile==='guard')assert.ok(detail.includes('service commitments'));
    assert.equal(await ev('localStorage.getItem("tops_career_action_v1")'),unchanged);
    assert.equal(await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==="Review this as my next step").disabled'),true);
    await ev('document.querySelector("#tops-loop-checkin input[type=checkbox]").click()');
   }
   await input('tops-loop-minutes','');
   assert.ok(await ev('document.querySelector("#tops-loop-checkin [role=region] h3").textContent.includes("one small part")'));
  }
  if(blocker==='time' && profile==='guard' && process.env.TOPS_LOOP_SCREENSHOT_DIR){
   await ev('document.getElementById("tops-loop-checkin").scrollIntoView({block:"start"});new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
   const shot=await c.send('Page.captureScreenshot',{format:'png'});
   fs.writeFileSync(path.join(process.env.TOPS_LOOP_SCREENSHOT_DIR,'guard-time-checkin.png'),Buffer.from(shot.data,'base64'));
  }
 }
 await input('tops-loop-blocker','skills');await click('Browse training options');
 await wait('document.getElementById("tops-resource-topic")?.value==="directory"','training opens directory, not documents');
 await click('Home');await wait('!!document.getElementById("tops-loop-title")','Home after training');
 await click('Update this step');await click('Mark done');
 assert.equal(await ev('JSON.parse(localStorage.getItem("tops_career_action_v1")).done'),false);
 await click('Save career step');await home();
 assert.ok(await ev('document.getElementById("tops-loop-title").closest("section").textContent.includes("You marked this step done")'));
 assert.equal(await ev('document.getElementById("tops-loop-timing")'),null);
 // Changing direction preserves the earlier step and demands an explicit review.
 await ev('document.querySelector("#tops-loop-direction summary").click()');await input('tops-loop-target','SYNTHETIC_CHANGED_ROLE');await click('Save my direction');
 assert.ok(await ev('document.getElementById("tops-loop-title").closest("section").textContent.includes("Your direction changed")'));
 await click('Review earlier step');assert.ok(await ev('document.getElementById("tops-career-action").textContent.includes("SYNTHETIC_LOOP_ROLE")'));
 assert.equal(await ev('JSON.parse(localStorage.getItem("tops_career_action_v1")).context.targetRole'),'SYNTHETIC_LOOP_ROLE');
 for(const width of [320,375]){await c.send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:true});assert.ok(await ev('document.documentElement.scrollWidth<=window.innerWidth'));}
 console.log('MEMBER LOOP PROFILE PASS',profile,pathway);
}
// Recover an action whose guide was not saved, without silently adopting it.
await ev('localStorage.removeItem("tops_personal_guide_v1")');await home();await click('Review saved direction');
assert.equal(await ev('document.getElementById("tops-loop-target").value'),'SYNTHETIC_LOOP_ROLE');
assert.equal(await ev('localStorage.getItem("tops_personal_guide_v1")'),null);
await click('Use for this visit');assert.equal(await ev('localStorage.getItem("tops_personal_guide_v1")'),null);
// A denied save neither changes the current direction nor claims success.
await ev('document.querySelector("#tops-loop-direction summary").click();window.__oldSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error("blocked")};');
await input('tops-loop-target','SYNTHETIC_DENIED');await click('Save my direction');
assert.ok(await ev('document.getElementById("tops-loop-title").closest("section").textContent.includes("could not be saved")'));
await ev('Storage.prototype.setItem=window.__oldSet');
assert.equal(await ev('localStorage.getItem("tops_personal_guide_v1")'),null);
await ev('document.querySelector("#tops-loop-checkin summary").click()');await input('tops-loop-blocker','time');
const beforeAlternative=await ev('localStorage.getItem("tops_career_action_v1")');
await ev('document.querySelector("#tops-loop-checkin input[type=checkbox]").click()');
await click('Review this as my next step');
await wait('document.activeElement.id==="tops-action-heading"','alternative focuses editor even when already open');
assert.equal(await ev('localStorage.getItem("tops_career_action_v1")'),beforeAlternative);
assert.ok(await ev('document.getElementById("tops-action-text").value.includes("one small part")'));
await click('Save career step');
assert.notEqual(await ev('localStorage.getItem("tops_career_action_v1")'),beforeAlternative);
await ev('document.getElementById("tops-loop-direction").open=true');await click('Save my direction');
await input('tops-loop-blocker','time');await input('tops-loop-minutes','10');
await ev('document.querySelector("#tops-loop-checkin input[type=checkbox]").click()');
await click('Review this as my next step');
assert.ok(await ev('document.getElementById("tops-action-text").value.startsWith("10-minute session:")'));
await click('Save career step');await home();
assert.ok(await ev('document.getElementById("tops-loop-title").closest("section").textContent.includes("10-minute session:")'));
await ev('document.querySelector("#tops-loop-checkin summary").click()');await input('tops-loop-blocker','time');
assert.equal(await ev('document.getElementById("tops-loop-minutes").value'),'');
await click('Mark step complete');await input('tops-loop-reflection','ready');
await click('Choose this next step');
const nextAfterReflection=await ev('document.getElementById("tops-action-text").value');
await click('Save career step');await home();
assert.ok(await ev('document.getElementById("tops-loop-title").closest("section").textContent.includes('+JSON.stringify(nextAfterReflection)+')'));
assert.equal(await ev('JSON.parse(localStorage.getItem("tops_career_action_v1")).done'),false);
// No loop member text is sent, and no AI endpoint is requested.
assert.equal(requests.filter(r=>r.includes('SYNTHETIC_')||r.includes('/.netlify/functions/')).length,0);
assert.deepEqual(errors,[]);
console.log('MEMBER LOOP PASS: seven visitor/path scenarios; all four visible priorities without storage; explicit direction save; no date requirement; choose/edit/save/reload; completion/reflection; goal drift review; orphan-step recovery; save denial; 320/375; zero model calls/member-text requests/errors');
}finally{if(chrome)await h.stopChrome(chrome);await new Promise(r=>{server.close(r);server.closeAllConnections();});}})().catch(e=>{console.error(e.stack);process.exitCode=1;});
