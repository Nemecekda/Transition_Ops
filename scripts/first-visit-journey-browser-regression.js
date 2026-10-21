'use strict';
// Synthetic first-visit journeys only. All nonlocal requests are blocked.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'scripts/privacy-network-regression.js'),'utf8');
const h=new Function('fs','path','os','spawn',source.slice(source.indexOf('function findChrome()'),source.indexOf('const PROBE_SCRIPT ='))+'\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs,path,os,spawn);
const server=http.createServer((req,res)=>{const p=new URL(req.url,'http://localhost').pathname,f=path.join(root,p==='/'?'index.html':p);if(!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(f));});
(async()=>{let chrome;const errors=[],posts=[];try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 chrome=await h.launchChrome(h.findChrome(),12);const c=chrome.client;await c.send('Page.enable');await c.send('Runtime.enable');
 c.on('Runtime.exceptionThrown',e=>errors.push(e.exceptionDetails.text));await c.send('Fetch.enable',{patterns:[{urlPattern:'*'}]});
 c.on('Fetch.requestPaused',async e=>{if(e.request.method==='POST')posts.push(e.request.url);const local=e.request.url.startsWith(origin)&&!e.request.url.includes('/.netlify/');try{await c.send(local?'Fetch.continueRequest':'Fetch.failRequest',local?{requestId:e.requestId}:{requestId:e.requestId,errorReason:'BlockedByClient'});}catch{}});
 const ev=s=>h.evaluate(c,s,true),wait=s=>h.waitForExpression(c,s,s,12000),frames=()=>ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
 const load=async(route='/')=>{await c.send('Page.navigate',{url:origin+route});await wait('!!document.getElementById("tops-first-visit")||!!document.getElementById("tops-main-content")');await frames();};
 const click=async id=>{await ev(`document.getElementById(${JSON.stringify(id)}).click()`);await frames();};
 const textClick=async text=>{await ev(`[...document.querySelectorAll('button')].find(n=>n.checkVisibility()&&n.textContent===${JSON.stringify(text)}).click()`);await frames();};
 const change=async(id,value)=>{await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});n.value=${JSON.stringify(value)};n.dispatchEvent(new Event('change',{bubbles:true}));})()`);await frames();};
 const disk=()=>ev('JSON.stringify(["tops_personal_guide_v1","tops_career_action_v1","tops_career_gap_v1","tops_user_status","tops_sep_date","taskProgress","docProgress"].map(k=>localStorage.getItem(k)))');
 const fresh=async theme=>{await load('/?tool=dashboard');await ev(`localStorage.clear();localStorage.setItem('tops_theme',${JSON.stringify(theme)});`);await load('/');await wait('!!document.getElementById("tops-first-visit")');};
 for(const width of [320,375])for(const theme of ['professional','tactical'])for(const kind of ['leave','serve','veteran']){
  await c.send('Emulation.setDeviceMetricsOverride',{width,height:812,deviceScaleFactor:1,mobile:true});await fresh(theme);const before=await disk();
  assert.equal(await ev('!!document.getElementById("tops-first-continue")||!!document.getElementById("tops-first-area")'),false);
  assert.equal(await ev('document.getElementById("tops-first-visit-heading").textContent'),'Your service. Your next move.');
  assert.equal(await ev('document.documentElement.scrollWidth<=innerWidth+1'),true);
  assert.equal(await ev('[...document.querySelectorAll("#tops-first-visit button,#tops-first-visit select")].every(n=>n.getBoundingClientRect().height>=44)'),true);
  await ev(`document.getElementById('tops-first-${kind}').focus()`);await c.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',unmodifiedText:'\r',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});await c.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});await frames();
  const heading=kind==='leave'?'tops-plan-readiness':'tops-career-start-heading';await wait(`!!document.getElementById(${JSON.stringify(heading)})`);
  assert.equal(await ev('document.activeElement.id'),heading);assert.equal(await disk(),before);
  if(kind!=='leave'){assert.equal(await ev('document.getElementById("tops-career-start-heading").textContent'),'Start with your experience');await textClick('Continue without a resume');await wait('!!document.getElementById("tops-career-role-choices")');assert.match(await ev('document.getElementById("tops-career-start-heading").textContent'),/Choose a role/);}
  await click('tops-first-local-help');await wait('!!document.getElementById("tops-state-help")');assert.equal(await ev('document.getElementById("tops-state-help-area").value'),'national');await change('tops-state-help-area','wi');
  await ev('[...document.querySelectorAll("[aria-label=Primary] button")].find(n=>n.textContent==="Career").click()');await frames();await click('tops-first-change');await wait('document.activeElement.id==="tops-first-visit-heading"');
  await click('tops-first-'+kind);await wait(`!!document.getElementById(${JSON.stringify(heading)})`);await click('tops-first-local-help');await wait('!!document.getElementById("tops-state-help")');assert.equal(await ev('document.getElementById("tops-state-help-area").value'),'wi');assert.equal(await ev('document.getElementById("tops-state-help-situation").value'),kind==='serve'?'serving':kind==='veteran'?'veteran':'browse');assert.equal(await disk(),before);
  await c.send('Page.reload');await wait('!!document.getElementById("tops-state-help")');assert.equal(await ev('document.getElementById("tops-state-help-area").value'),'wi');assert.equal(await disk(),before);
  console.log('PASS first visit, native Enter, no-resume result, change, local context/reload, saved-byte protection',width,theme,kind);
 }
 // General/family skip and saved data with missing onboarding flag.
 await fresh('professional');await click('tops-first-skip');await wait('document.activeElement.id==="tops-home-tools-title"');assert.equal(await ev('!!document.getElementById("tops-first-visit")'),false);
 await ev(`localStorage.removeItem('tops_onboarded');const g={version:1,pathway:'support',currentRole:'SYNTHETIC',targetRole:'',goal:'SYNTHETIC preserve'};localStorage.setItem('tops_personal_guide_v1',JSON.stringify(g));localStorage.setItem('tops_career_action_v1',JSON.stringify({version:1,text:'SYNTHETIC exact return step',date:'',done:false,context:g}));const tasks=topsRestoreMilestones();tasks[0].tasks[0].done=true;localStorage.setItem("taskProgress",JSON.stringify(tasks));const docs=topsRestoreDocuments();docs[0].obtained=true;localStorage.setItem("docProgress",JSON.stringify(docs));`);const saved=await disk();await load('/');assert.equal(await ev('!!document.getElementById("tops-first-visit")'),false);assert.match(await ev('document.getElementById("tops-loop-title").closest("section").textContent'),/SYNTHETIC exact return step/);assert.equal(await disk(),saved);
 await load('/?tool=resources&view=state-help&area=wi&situation=browse&need=education');assert.equal(await ev('!!document.getElementById("tops-state-help")'),true);assert.equal(await disk(),saved);
 // A new Home intent must acknowledge conflicting in-tab work, preserving its notes.
 await fresh('professional');await click('tops-first-veteran');await click('tops-career-back');
 await ev('document.getElementById("tops-career-goals").open=true');await ev('[...document.querySelectorAll(".tops-career-goal")].find(n=>n.textContent.startsWith("Grow in my current career")).click()');await frames();
 await ev('(()=>{const n=document.getElementById("career-starter-resume");Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value").set.call(n,"SYNTHETIC coordinated inventory and trained a team.");n.dispatchEvent(new Event("input",{bubbles:true}));})()');await frames();
 const empty=await disk();
 const home=async()=>{await ev('[...document.querySelectorAll("[aria-label=Primary] button")].find(n=>n.textContent==="Home").click()');await frames();};
 const explore=async()=>{await home();await ev('document.getElementById("tops-priority-choices").open=true');await ev('[...document.querySelectorAll("button")].find(n=>n.getAttribute("aria-label")==="Explore a different career").click()');await frames();await textClick('Explore career options');await wait('!!document.getElementById("tops-entry-goal-heading")');};
 await explore();await click('tops-entry-keep');assert.equal(await ev('document.getElementById("tops-career-start-heading").textContent'),'Build on what you already do');assert.match(await ev('document.getElementById("career-starter-resume").value'),/SYNTHETIC coordinated/);
 await explore();await click('tops-entry-use-goal');assert.equal(await ev('document.getElementById("tops-career-start-heading").textContent'),'Start with your experience');assert.match(await ev('document.getElementById("career-starter-resume").value'),/SYNTHETIC coordinated/);assert.equal(await disk(),empty);
 await home();await ev('[...document.querySelectorAll("[aria-label=Primary] button")].find(n=>n.textContent==="Career").click()');await frames();assert.match(await ev('document.getElementById("career-starter-resume").value'),/SYNTHETIC coordinated/);
 await ev('history.back()');await frames();await wait('!!document.getElementById("tops-loop-title")');assert.equal(await disk(),empty);
 console.log('PASS explicit conflicting intent keep/use, ordinary draft return, browser Back and unchanged saved work');
 assert.deepEqual(errors,[]);assert.deepEqual(posts,[]);console.log('FIRST VISIT PASS:12 mobile/theme/situation journeys, general skip, returning saved work, direct links, intent conflict/Back;0 provider POSTs.');
 }finally{if(chrome)await h.stopChrome(chrome);await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
