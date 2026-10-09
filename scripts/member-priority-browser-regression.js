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

const priority=label=>ev('document.getElementById("tops-priority-choices").open=true;document.querySelector('+JSON.stringify('#tops-member-starts button[aria-label="'+label+'"]')+').click()');
await home();await ev('localStorage.clear();localStorage.setItem("tops_onboarded","1")');await home();
for(const [label,action,destination] of [['Find work soon','Search jobs by area','tops-live-jobs-panel'],['Explore a different career','Explore career options','career-starter-resume'],['Grow in my current career','Prepare a growth conversation','career-starter-resume'],['Prepare to leave service','Review my transition checklist','tops-plan-readiness']]){
 // Independent fresh-entry cases; protected conflicting drafts are covered by career-intent-browser-regression.
 await home();
 await priority(label); await wait('document.activeElement.id==="tops-loop-title"','priority focus');
 for(const key of ['tops_personal_guide_v1','tops_career_action_v1','tops_sep_date'])assert.equal(await ev('localStorage.getItem('+JSON.stringify(key)+')'),null);
 assert.equal(await ev('!!document.getElementById("tops-loop-completion")'),false);
 await click(action); await wait('!!document.getElementById('+JSON.stringify(destination)+')','direct optional route');
 await click('Home');await wait('!!document.getElementById("tops-loop-title")','Home after route');
 assert.equal(await ev('document.querySelector("#tops-member-starts button[aria-pressed=true]").getAttribute("aria-label")'),label);
}
await click('Clear priority');await wait('document.activeElement.id==="tops-loop-title"','clear priority focus');assert.equal(await ev('document.querySelectorAll("#tops-member-starts button[aria-pressed=true]").length'),0);
await priority('Find work soon');await ev('document.getElementById("tops-loop-checkin").open=true');await input('tops-loop-blocker','time');await input('tops-loop-minutes','10');
assert.ok((await ev('document.querySelector("[aria-label=\\"Alternative next step\\"]").textContent')).includes('10'));
await input('tops-loop-blocker','person');await click('Prepare for career help');await wait('document.activeElement.id==="tops-prepare-introduction"','direct human help focus');
await click('Prepare my introduction');await wait('!!document.getElementById("tops-specialist-introduction")','intro available without intake');
const intro=await ev('document.getElementById("tops-specialist-introduction").value');
await click('Home');await wait('!!document.getElementById("tops-loop-title")','return with introduction');await ev('document.getElementById("tops-loop-checkin").open=true');await input('tops-loop-blocker','person');await click('Prepare for career help');await wait('document.activeElement.id==="tops-specialist-introduction"','resume introduction focus');assert.equal(await ev('document.getElementById("tops-specialist-introduction").value'),intro);
await click('Home');await wait('!!document.getElementById("tops-loop-title")','return for action');
await click('Review this as my next step');await wait('!!document.getElementById("tops-action-text")','explicit draft review');assert.equal(await ev('localStorage.getItem("tops_career_action_v1")'),null);await input('tops-action-text','SYNTHETIC custom next step');await click('Save step');
const original=await ev('localStorage.getItem("tops_career_action_v1")');
await ev('document.getElementById("tops-loop-checkin").open=true');await input('tops-loop-blocker','person');await ev('document.querySelector("#tops-loop-checkin input[type=checkbox]").click()');
await input('tops-action-text','SYNTHETIC edited draft');await wait('document.getElementById("tops-loop-blocker").value===""','action change resets check-in consent');await input('tops-loop-blocker','person');assert.equal(await ev('document.querySelector("#tops-loop-checkin input[type=checkbox]").checked'),false);
await ev('document.querySelector("#tops-loop-checkin input[type=checkbox]").click()');await priority('Prepare to leave service');await wait('document.getElementById("tops-loop-blocker").value===""','priority change resets check-in consent');await input('tops-loop-blocker','person');assert.equal(await ev('document.querySelector("#tops-loop-checkin input[type=checkbox]").checked'),false);
await input('tops-action-text','SYNTHETIC custom next step');await click('Close step editor');assert.ok((await ev('document.getElementById("tops-loop-title").closest("section").textContent')).includes('SYNTHETIC custom next step'));assert.equal(await ev('localStorage.getItem("tops_career_action_v1")'),original);
await click('Mark step complete');await wait('!!document.getElementById("tops-loop-reflection")','reflection follows completion');assert.equal(await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==="Choose this next step").disabled'),true);await input('tops-loop-reflection','help');assert.equal(await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==="Choose this next step").disabled'),false);
for(const width of [320,375,1024]){await c.send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});await ev('document.getElementById("tops-priority-choices").open=true');assert.equal(await ev('document.documentElement.scrollWidth<=innerWidth'),true);assert.equal(await ev('Array.from(document.querySelectorAll("#tops-member-starts button")).every(n=>n.getBoundingClientRect().height>=44)'),true);}
await home();assert.equal(await ev('document.querySelectorAll("#tops-member-starts button[aria-pressed=true]").length'),0);
// A new priority changes draft context only after explicit review, never on selection.
const transitionGuide={version:1,pathway:'transition',targetRole:'Data Analyst',currentRole:'',goal:''};
await ev('localStorage.removeItem("tops_career_action_v1");localStorage.setItem("tops_personal_guide_v1",'+JSON.stringify(JSON.stringify(transitionGuide))+')');await home();
await priority('Grow in my current career');assert.equal(await ev('JSON.parse(localStorage.getItem("tops_personal_guide_v1")).pathway'),'transition');
await click('Review this as my next step');await wait('!!document.getElementById("tops-action-text")','growth context review');await click('Save step');assert.equal(await ev('JSON.parse(localStorage.getItem("tops_career_action_v1")).context.pathway'),'skills');assert.equal(await ev('JSON.parse(localStorage.getItem("tops_personal_guide_v1")).pathway'),'transition');
await home();assert.ok((await ev('document.getElementById("tops-loop-title").closest("section").textContent')).includes('Your direction changed'));assert.equal(await ev('!!document.getElementById("tops-loop-completion")'),false);
for(const [label,pathway,action,destination] of [['Find work soon','change','Search jobs by area','tops-live-jobs-panel'],['Grow in my current career','skills','Prepare a growth conversation','career-starter-resume']]){
 const g={...transitionGuide,pathway};await ev('localStorage.removeItem("tops_career_action_v1");localStorage.setItem("tops_personal_guide_v1",'+JSON.stringify(JSON.stringify(g))+')');await home();await priority(label);await click('Review this as my next step');await wait('!!document.getElementById("tops-action-text")','generated action review');await click('Save step');await home();await click(action);await wait('!!document.getElementById('+JSON.stringify(destination)+')','saved generated action destination');await click('Home');await wait('!!document.getElementById("tops-loop-title")','return after generated action');
 assert.equal(await ev('Array.from(document.getElementById("tops-loop-title").closest("section").querySelectorAll("button")).some(n=>n.textContent==="Continue my career work")'),false);
 assert.equal(await ev('topsMemberPriorityContinuation({...JSON.parse(localStorage.getItem("tops_career_action_v1")),text:"Custom action"},JSON.parse(localStorage.getItem("tops_personal_guide_v1")))'),null);
}
assert.equal(await ev('sessionStorage.length'),0);assert.deepEqual(errors,[]);assert.equal(requests.some(request=>request.includes('/.netlify/functions/')),false);
console.log('PASS adaptive priorities: immediate no-profile routes, visit continuity/reload clear, smaller step, human help/introduction resume, custom action protection, completion/reflection and mobile reflow');
}finally{if(chrome)await h.stopChrome(chrome);await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exit(1);});
