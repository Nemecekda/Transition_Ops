'use strict';
// Synthetic first-use tasks. Every external request is blocked; no model is called.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),utility=fs.readFileSync(path.join(__dirname,'privacy-network-regression.js'),'utf8');
const h=new Function('fs','path','os','spawn',utility.slice(utility.indexOf('function findChrome()'),utility.indexOf('const PROBE_SCRIPT ='))+'\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs,path,os,spawn);
const posts=[],errors=[],externalPosts=[];let mode='success';
const fixture={id:'123',title:'SYNTHETIC Logistics Specialist',agency:'Example organization',location:'Milwaukee, WI',salary:'Not supplied',closingDate:'2099-12-31',whoMayApply:'Check the announcement',qualifications:'Coordinate inventory and explain delivery requirements to the team.',url:'https://www.usajobs.gov/job/123'};
const server=http.createServer(async(req,res)=>{
 if(req.url.startsWith('/.netlify/functions/federal-jobs')){
  res.setHeader('Content-Type','application/json');
  if(req.method==='GET')return res.end(JSON.stringify({available:mode!=='unavailable',provider:'USAJOBS'}));
  let raw='';for await(const chunk of req)raw+=chunk;posts.push(JSON.parse(raw));
  if(mode==='error'){res.writeHead(503);return res.end('{}');}
  return res.end(JSON.stringify({source:'USAJOBS',scope:'public',retrievedAt:'2026-11-16T12:00:00Z',jobs:mode==='zero'?[]:[fixture]}));
 }
 const p=new URL(req.url,'http://localhost').pathname,f=path.join(root,p==='/'?'index.html':p);
 if(!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(f));
});
(async()=>{let chrome;try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 chrome=await h.launchChrome(h.findChrome(),12);const c=chrome.client;await c.send('Page.enable');await c.send('Runtime.enable');
 c.on('Runtime.exceptionThrown',e=>errors.push(e.exceptionDetails.text));await c.send('Fetch.enable',{patterns:[{urlPattern:'*'}]});
 c.on('Fetch.requestPaused',async e=>{const local=e.request.url.startsWith(origin);if(e.request.method==='POST'&&!e.request.url.startsWith(origin+'/.netlify/functions/federal-jobs'))externalPosts.push(e.request.url);try{await c.send(local?'Fetch.continueRequest':'Fetch.failRequest',local?{requestId:e.requestId}:{requestId:e.requestId,errorReason:'BlockedByClient'});}catch{}});
 const ev=s=>h.evaluate(c,s,true),wait=s=>h.waitForExpression(c,s,s,12000),frames=()=>ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
 const load=async(route='/')=>{const epoch=await ev("performance.timeOrigin");await c.send('Page.navigate',{url:origin+route});await wait(`performance.timeOrigin!==${epoch}&&(!!document.getElementById("tops-first-visit")||!!document.getElementById("tops-main-content"))`);await frames();};
 const reload=async condition=>{const epoch=await ev("performance.timeOrigin");await c.send("Page.reload");try{await wait(`performance.timeOrigin!==${epoch}&&(${condition})`);}catch(error){console.error("RELOAD DIAGNOSTIC",await ev("JSON.stringify({url:location.href,state:history.state,body:document.body.innerText.slice(0,900)})"));throw error;}await frames();};
 const click=async id=>{await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});if(!n||!n.checkVisibility()||n.disabled)throw Error('Unavailable '+${JSON.stringify(id)});n.click()})()`);await frames();};
 const input=async(id,value)=>{await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(n,${JSON.stringify(value)});n.dispatchEvent(new Event('input',{bubbles:true}));})()`);await frames();};
 const enter=async()=>{await c.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',unmodifiedText:'\r',windowsVirtualKeyCode:13});await c.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await frames();};
 const protectedDisk=()=>ev('JSON.stringify(["tops_user_status","tops_user_branch","tops_sep_date","etsDate","tops_personal_guide_v1","tops_career_action_v1","tops_career_gap_v1","tops_my_jobs_v1","taskProgress","docProgress","tops_readiness_answers"].map(k=>localStorage.getItem(k)))');
 const fresh=async(theme='professional')=>{await load('/?tool=dashboard');await ev(`localStorage.clear();localStorage.setItem('tops_theme',${JSON.stringify(theme)});sessionStorage.clear()`);await load('/');await wait('!!document.getElementById("tops-first-visit")');};
 for(const width of [320,375])for(const theme of ['professional','tactical']){
  mode='success';await c.send('Emulation.setDeviceMetricsOverride',{width,height:812,deviceScaleFactor:1,mobile:true});await fresh(theme);const disk=await protectedDisk(),before=posts.length,historyBefore=await ev('history.length');
  assert.equal(await ev('innerWidth'),width);assert.equal(await ev('document.documentElement.dataset.topsTheme'),theme);
  assert.equal(await ev('document.documentElement.scrollWidth<=innerWidth'),true);
  assert.equal(await ev('document.querySelectorAll("#tops-career-search-start-form").length'),1);
  assert.equal(await ev('document.querySelector("#tops-career-search-start-form input").id'),'tops-career-search-area');
  assert.equal(await ev('document.getElementById("tops-career-search-role").required'),false);
  assert.equal(await ev('document.getElementById("tops-career-search-role").placeholder'),'Any role, or try Logistics');
  assert.equal(await ev('document.getElementById("tops-welcome-service-paths").open'),false);
  const geometry=await ev('(()=>{const b=document.getElementById("tops-first-benefits").getBoundingClientRect();return{bottom:b.bottom,height:innerHeight,primary:document.getElementById("tops-career-search-start").getBoundingClientRect().bottom}})()');
  assert.ok(geometry.primary<geometry.height,JSON.stringify(geometry));if(width===375)assert.ok(geometry.bottom<geometry.height,JSON.stringify(geometry));
  assert.match(await ev('document.getElementById("tops-career-search-notice").textContent'),/Sends this search to USAJOBS through Transition OPS when connected/);
  assert.equal(await ev('[...document.querySelectorAll("#tops-first-visit button,#tops-first-visit input,#tops-first-visit summary")].filter(n=>n.checkVisibility()).every(n=>n.getBoundingClientRect().height>=44)'),true);
  if(process.env.TOPS_PREMIUM_ENTRY_EVIDENCE){fs.mkdirSync(process.env.TOPS_PREMIUM_ENTRY_EVIDENCE,{recursive:true});const shot=await c.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(process.env.TOPS_PREMIUM_ENTRY_EVIDENCE,`welcome-${width}-${theme}.png`),Buffer.from(shot.data,'base64'));}
  await click('tops-career-search-start');assert.equal(await ev('document.activeElement.id'),'tops-career-search-area');assert.equal(await ev('!!document.getElementById("tops-first-visit")'),true);assert.equal(await ev('localStorage.getItem("tops_onboarded")'),null);assert.equal(posts.length,before);
  await input('tops-career-search-area','532');await click('tops-career-search-start');assert.equal(await ev('document.activeElement.id'),'tops-career-search-area');assert.equal(posts.length,before);
  await input('tops-career-search-area','53202');assert.equal(posts.length,before);assert.equal(await protectedDisk(),disk);
  await ev('document.getElementById("tops-career-search-role").focus()');await enter();await wait('document.activeElement.id==="tops-jobs-skills-heading"');
  assert.equal(posts.length,before+1);assert.deepEqual(posts.at(-1),{keyword:'',location:'53202'});assert.equal(await ev('!!document.getElementById("tops-first-visit")'),false);
  assert.equal(await ev('document.getElementById("tops-job-area").value'),'53202');assert.equal(await ev('document.getElementById("tops-job-role").value'),'');assert.equal(await protectedDisk(),disk);
  assert.equal(await ev('document.getElementById("tops-jobs-skills-heading").textContent'),'Jobs and skills in 53202');assert.ok(await ev('document.getElementById("tops-job-careeronestop").checkVisibility()'));
  await frames();assert.equal(posts.length,before+1,'rendering and focus must not repeat the search');
  assert.equal(await ev('history.length'),historyBefore+1,'one task visit, not an unvisited intermediate form');
  await ev('history.back()');await wait('document.activeElement.id==="tops-first-visit-heading"');assert.equal(await ev('document.getElementById("tops-career-search-area").value'),'53202');assert.equal(await ev('document.getElementById("tops-career-search-role").value'),'');assert.equal(posts.length,before+1);
  await input("tops-career-search-role","SYNTHETIC unsubmitted edit");await input("tops-career-search-area","53703");await ev('history.forward()');await wait('document.activeElement.id==="tops-jobs-skills-heading"');assert.equal(await ev('document.getElementById("tops-job-area").value'),'53202');assert.equal(await ev('document.getElementById("tops-job-role").value'),"");await frames();assert.equal(posts.length,before+1,'Forward restores the query, never repeats a search');assert.equal(await ev('document.querySelectorAll("#tops-federal-results article").length'),0);
  await ev('history.back()');await wait('!!document.getElementById("tops-first-visit")');await reload('!!document.getElementById("tops-first-visit")');assert.equal(await ev('document.getElementById("tops-career-search-area").value'),'53202');
  await ev('history.forward()');await wait('document.activeElement.id==="tops-jobs-skills-heading"');console.log("BEFORE RESULTS REFRESH",await ev("JSON.stringify({url:location.href,state:history.state,query:topsReadJobSearchURL(location.href)})"));await reload('!!document.getElementById("tops-job-area")');assert.equal(await ev('!!document.getElementById("tops-first-visit")'),false);assert.equal(await ev('document.getElementById("tops-job-area").value'),'53202');assert.equal(posts.length,before+1);
  await ev('[...document.querySelectorAll("[aria-label=Primary] button")].find(n=>n.textContent==="Home").click()');await wait('!!document.getElementById("tops-loop-title")');await frames();assert.equal(await ev('history.state.tops||0'),0);assert.equal(await ev('!!history.state.welcomeStart'),false);assert.equal(await ev('!!history.state.welcomeEntryBase'),false);assert.equal(await protectedDisk(),disk);
  await ev("history.forward()");await wait('document.activeElement.id==="tops-jobs-skills-heading"');assert.equal(posts.length,before+1);await ev('[...document.querySelectorAll("[aria-label=Primary] button")].find(n=>n.textContent==="Home").click()');await wait('!!document.getElementById("tops-loop-title")');await frames();await ev('history.back()');await wait('!!document.getElementById("tops-main-content")');await frames();assert.equal(new URL(await ev('location.href')).origin,origin);assert.equal(await ev('!!document.getElementById("tops-first-visit")'),false);assert.equal(posts.length,before+1);
  console.log(`PASS ${width}px ${theme}: visible useful form, area first, exact ZIP-only keyboard handoff, one request and unchanged profile/plan`);
 }
 // Existing route choices do not guess service status, location eligibility or completion.
 for(const task of ['plan','benefits']){
  await fresh();const disk=await protectedDisk(),before=posts.length;await click('tops-first-'+task);
  const heading=task==='plan'?'tops-plan-readiness':'tops-state-help-heading';await wait(`document.activeElement.id===${JSON.stringify(heading)}`);assert.equal(await protectedDisk(),disk);assert.equal(posts.length,before);
  if(task==='benefits'){assert.equal(await ev('document.getElementById("tops-state-help-area").value'),'national');assert.ok(await ev('location.search.includes("need=benefits")'));}
 }
 await fresh();await ev('document.querySelector("#tops-welcome-service-paths>summary").focus()');await enter();assert.equal(await ev('document.getElementById("tops-welcome-service-paths").open'),true);assert.equal(await ev('[...document.querySelectorAll(".tops-welcome-choice")].every(n=>n.checkVisibility())'),true);await click('tops-first-serve');await wait('document.activeElement.id==="tops-career-start-heading"');assert.equal(await ev('localStorage.getItem("tops_user_status")'),null);
 await click('tops-first-change');await wait('document.activeElement.id==="tops-first-visit-heading"');await click('tops-first-skip');await wait('document.activeElement.id==="tops-home-tools-title"');
 console.log('PASS direct checklist/benefits, retained guided routes, keyboard disclosure and all-tools escape without profile inference');
 // Unavailable, empty and failed federal responses still expose honest broader search and learning.
 for(const next of ['zero','error','unavailable']){
  mode=next;await fresh();const before=posts.length;await input('tops-career-search-area','Madison, WI');await input('tops-career-search-role','logistics');await click('tops-career-search-start');await wait('document.activeElement.id==="tops-jobs-skills-heading"');
  assert.equal(posts.length,before+(next==='unavailable'?0:1));if(next!=='unavailable')assert.deepEqual(posts.at(-1),{keyword:'logistics',location:'Madison, WI'});
  const href=await ev('document.getElementById("tops-job-careeronestop").href'),u=new URL(href);assert.equal(u.searchParams.get('keyword'),'logistics');assert.equal(u.searchParams.get('location'),'Madison, WI');assert.doesNotMatch(await ev('document.getElementById("tops-federal-status").textContent'),/no local jobs/i);
  await click('tops-job-explore-learning');await wait('document.activeElement.id==="tops-search-learning-heading"');assert.equal(posts.length,before+(next==='unavailable'?0:1));
 }
 // Existing saved work and valid public links bypass welcome; no schema or profile write is introduced.
 mode='success';await fresh();await ev(`localStorage.removeItem('tops_onboarded');const g={version:1,pathway:'support',currentRole:'SYNTHETIC',targetRole:'',goal:'Preserve this plan'};localStorage.setItem('tops_personal_guide_v1',JSON.stringify(g));localStorage.setItem('tops_career_action_v1',JSON.stringify({version:1,text:'SYNTHETIC exact saved action',date:'',done:false,context:g}));`);const disk=await protectedDisk();await load('/');assert.equal(await ev('!!document.getElementById("tops-first-visit")'),false);assert.match(await ev('document.getElementById("tops-loop-title").closest("section").textContent'),/SYNTHETIC exact saved action/);assert.equal(await protectedDisk(),disk);
 await fresh();await load('/?tool=resources&view=state-help&area=wi&situation=serving&need=benefits');await wait('!!document.getElementById("tops-state-help")');assert.equal(await ev('!!document.getElementById("tops-first-visit")'),false);assert.equal(await ev('document.getElementById("tops-state-help-area").value'),'wi');assert.equal(await ev('localStorage.getItem("tops_user_status")'),null);
 assert.deepEqual(errors,[]);assert.deepEqual(externalPosts,[]);console.log('PREMIUM FIRST VISIT PASS: exact 320/375 themes, one-request immediate result, alternatives, source failures, saved-work/deep-link protection; zero model/provider POSTs beyond synthetic federal fixture.');
}finally{if(chrome)await h.stopChrome(chrome);await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
