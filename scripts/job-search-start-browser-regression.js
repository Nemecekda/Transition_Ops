'use strict';
// Synthetic fixtures only; no external requests or live job/provider queries.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'), utility=fs.readFileSync(path.join(__dirname,'privacy-network-regression.js'),'utf8');
const h=new Function('fs','path','os','spawn',utility.slice(utility.indexOf('function findChrome()'),utility.indexOf('const PROBE_SCRIPT ='))+'\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs,path,os,spawn);
const posts=[],errors=[],external=[]; let mode='success', releaseResponse, releaseConfig, configAvailable=true;
const job={id:'123',title:'SYNTHETIC Logistics Specialist',agency:'Example agency',location:'Anywhere in the U.S. (remote job)',salary:'$30 Per Hour',closingDate:'2099-12-31',whoMayApply:'See official announcement',qualifications:'Plan supply schedules.',url:'https://www.usajobs.gov/job/123'};
const server=http.createServer(async(req,res)=>{
 if(req.url.startsWith('/.netlify/functions/federal-jobs')){
  res.setHeader('Content-Type','application/json');
  if(req.method==='GET'){if(mode==='config-hold'){await new Promise(resolve=>{releaseConfig=resolve;});return res.end(JSON.stringify({available:configAvailable,provider:'USAJOBS'}));}return res.end(JSON.stringify({available:mode!=='unavailable',provider:'USAJOBS'}));}
  let body='';for await(const part of req)body+=part;posts.push(JSON.parse(body));
  if(mode==='error'){res.writeHead(503);return res.end('{}');}
  if(mode==='hold')await new Promise(resolve=>{releaseResponse=resolve;});
  return res.end(JSON.stringify({source:'USAJOBS',scope:'public',retrievedAt:'2026-11-15T12:00:00Z',jobs:mode==='zero'?[]:[job]}));
 }
 const filename=path.join(root,new URL(req.url,'http://localhost').pathname==='/'?'index.html':new URL(req.url,'http://localhost').pathname);
 if(!fs.existsSync(filename)||!fs.statSync(filename).isFile()){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',filename.endsWith('.js')?'text/javascript':filename.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(filename));
});
(async()=>{let chrome;try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 chrome=await h.launchChrome(h.findChrome(),12);const c=chrome.client;await c.send('Page.enable');await c.send('Runtime.enable');
 c.on('Runtime.exceptionThrown',e=>errors.push(e.exceptionDetails.text));await c.send('Fetch.enable',{patterns:[{urlPattern:'*'}]});
 c.on('Fetch.requestPaused',async e=>{const local=e.request.url.startsWith(origin);if(!local)external.push(e.request.url);try{await c.send(local?'Fetch.continueRequest':'Fetch.failRequest',local?{requestId:e.requestId}:{requestId:e.requestId,errorReason:'BlockedByClient'});}catch{}});
 const ev=s=>h.evaluate(c,s,true),wait=s=>h.waitForExpression(c,s,s,12000),frames=()=>ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
 const load=async route=>{await c.send('Page.navigate',{url:origin+route});await wait('!!document.getElementById("tops-main-content")||!!document.getElementById("tops-first-visit")');await frames();};
 const seed=async(theme,role='logistics',area='53202')=>{await load('/');await ev(`localStorage.clear();sessionStorage.clear();localStorage.setItem('tops_onboarded','1');localStorage.setItem('tops_theme',${JSON.stringify(theme==='dark'?'tactical':'professional')});sessionStorage.setItem('synthetic-private','DO NOT SHARE PRIVATE EXPERIENCE')`);await load('/?tool=pathway&view=jobs&role='+encodeURIComponent(role)+'&location='+encodeURIComponent(area));await wait('!!document.getElementById("tops-job-area")');};
 const input=async(id,value)=>{await ev(`(()=>{let n=document.getElementById(${JSON.stringify(id)});Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(n,${JSON.stringify(value)});n.dispatchEvent(new Event('input',{bubbles:true}));})()`);await frames();};
 const click=async id=>{await ev(`document.getElementById(${JSON.stringify(id)}).click()`);await frames();};
 const key=async(key,code,n)=>{await c.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:n,...(key==='Enter'?{text:'\r',unmodifiedText:'\r'}:{})});await c.send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:n});await frames();};
 const disk=()=>ev('JSON.stringify([Object.entries(localStorage).sort(),Object.entries(sessionStorage).sort()])');
 const geometry=()=>ev(`(()=>{const h=document.getElementById('tops-jobs-skills-heading'),a=document.getElementById('tops-job-careeronestop'),b=document.getElementById('tops-job-explore-learning');return{width:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth,top:h.getBoundingClientRect().top,bottom:b.getBoundingClientRect().bottom,height:innerHeight,linkCount:document.querySelectorAll('#tops-job-careeronestop').length,learningCount:document.querySelectorAll('#tops-search-learning').length,order:!!(a.compareDocumentPosition(document.getElementById('tops-federal-search'))&Node.DOCUMENT_POSITION_FOLLOWING)};})()`);
 const checkLinks=async(role,area)=>{const x=await ev(`(()=>{const a=document.getElementById('tops-job-careeronestop');return{href:a.href,target:a.target,rel:a.rel};})()`),u=new URL(x.href);assert.equal(u.origin,'https://www.careeronestop.org');assert.equal(u.searchParams.get('keyword'),role);assert.equal(u.searchParams.get('location'),area);assert.equal(x.target,'_blank');assert.match(x.rel,/noopener/);assert.equal(u.searchParams.size,2);assert.doesNotMatch(x.href,/PRIVATE|EXPERIENCE/);};
 for(const width of[320,375])for(const theme of['light','dark']){
  await c.send('Emulation.setDeviceMetricsOverride',{width,height:812,deviceScaleFactor:1,mobile:true});mode='success';await seed(theme);const before=await disk(),count=posts.length;
  await wait('!document.getElementById("tops-federal-search").disabled');await ev('document.getElementById("tops-job-area").focus()');await key('Enter','Enter',13);
  await wait('document.activeElement.id==="tops-jobs-skills-heading"');assert.equal(posts.length,count+1);assert.deepEqual(posts.at(-1),{keyword:'logistics',location:'53202'});
  assert.equal(await ev('document.getElementById("tops-jobs-skills-heading").textContent'),'Jobs and skills for logistics · 53202');
  const g=await geometry();assert.equal(g.width,width);assert.equal(await ev('document.documentElement.getAttribute("data-tops-theme")'),theme==='dark'?'tactical':'professional');assert.ok(g.overflow<=1);assert.equal(g.linkCount,1);assert.equal(g.learningCount,1);assert.equal(g.order,true);assert.ok(g.top>=0&&g.top<220,JSON.stringify(g));assert.ok(g.bottom<g.height,JSON.stringify(g));await checkLinks('logistics','53202');
  await key('Tab','Tab',9);assert.equal(await ev('document.activeElement.id'),'tops-job-careeronestop');await key('Tab','Tab',9);assert.equal(await ev('document.activeElement.id'),'tops-job-explore-learning');await key('Enter','Enter',13);
  assert.equal(await ev('document.activeElement.id'),'tops-search-learning-heading');await key('Tab','Tab',9);assert.equal(await ev('document.activeElement.id'),'tops-learning-return-search');await key('Enter','Enter',13);assert.equal(await ev('document.activeElement.id'),'tops-jobs-skills-heading');
  assert.equal(posts.length,count+1,'learning and return must not repeat the search');assert.equal(await disk(),before);assert.equal(await ev('document.getElementById("tops-job-role").value'),'logistics');assert.equal(await ev('document.getElementById("tops-job-area").value'),'53202');
  if(process.env.TOPS_SEARCH_START_EVIDENCE){fs.mkdirSync(process.env.TOPS_SEARCH_START_EVIDENCE,{recursive:true});const image=await c.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(process.env.TOPS_SEARCH_START_EVIDENCE,`start-${width}-${theme}.png`),Buffer.from(image.data,'base64'));}
  console.log(`PASS ${width}px ${theme}: keyboard search -> shared source header -> learning -> exact return, source safety and unchanged state`);
 }
 // ZIP-only results, zero results, and provider errors preserve broad search and learning.
 for(const next of['zero','error','unavailable']){
  mode=next;await seed('light','','54211');const before=posts.length;
  await wait('document.getElementById("tops-federal-status").textContent.includes("not connected")||!document.getElementById("tops-federal-search").disabled');
  if(next!=='unavailable'){await click('tops-federal-search');await wait('document.activeElement.id==="tops-jobs-skills-heading"');assert.equal(posts.length,before+1);}else assert.equal(posts.length,before);
  assert.equal(await ev('document.getElementById("tops-jobs-skills-heading").textContent'),'Jobs and skills in 54211');await checkLinks('','54211');await click('tops-job-explore-learning');assert.equal(await ev('document.activeElement.id'),'tops-search-learning-heading');assert.match(await ev('document.activeElement.textContent'),/Skills useful across careers/);await click('tops-learning-return-search');assert.equal(await ev('document.activeElement.id'),'tops-jobs-skills-heading');
  assert.doesNotMatch(await ev('document.getElementById("tops-federal-status").textContent'),/no local jobs/i);
 }
 console.log('PASS blank-role ZIP, zero results, unavailable and failed federal search retain source and learning actions');
 // Config may still be loading when a first visitor deliberately opens learning.
 for(const configured of[true,false]){
  mode='success';await seed('light');mode='config-hold';configAvailable=configured;releaseConfig=null;await load('/?tool=pathway');await wait('document.getElementById("tops-career-search-area")?.checkVisibility()');await input('tops-career-search-area','53202');await click('tops-career-search-start');await wait('!!document.getElementById("tops-job-explore-learning")');
  await click('tops-job-explore-learning');assert.equal(await ev('document.activeElement.id'),'tops-search-learning-heading');assert.equal(typeof releaseConfig,'function');releaseConfig();
  await wait(configured?'!!document.getElementById("tops-federal-results")':'document.getElementById("tops-federal-status").textContent.includes("not connected")');await frames();assert.equal(await ev('document.activeElement.id'),'tops-search-learning-heading');await click('tops-learning-return-search');assert.equal(await ev('document.activeElement.id'),'tops-jobs-skills-heading');
 }
 console.log('PASS delayed config available/unavailable preserves the earlier learning choice and explicit return');
 // A delayed response must not pull the member away from learning they deliberately opened.
 mode='hold';await seed('light');await wait('!document.getElementById("tops-federal-search").disabled');await click('tops-federal-search');await wait('document.getElementById("tops-federal-search").disabled');await click('tops-job-explore-learning');assert.equal(await ev('document.activeElement.id'),'tops-search-learning-heading');releaseResponse();await wait('!!document.getElementById("tops-federal-results")');await frames();assert.equal(await ev('document.activeElement.id'),'tops-search-learning-heading');
 // Hold the next animation frame, edit a still-valid query, then release the old completion.
 mode='success';await seed('light');await wait('!document.getElementById("tops-federal-search").disabled');
 await ev('window.savedRAF=requestAnimationFrame;window.heldRAF=[];window.requestAnimationFrame=fn=>{heldRAF.push(fn);return heldRAF.length};document.getElementById("tops-federal-search").click()');await wait('!!document.getElementById("tops-federal-results")&&heldRAF.length>0');
 await ev(`(()=>{const n=document.getElementById('tops-job-role');n.focus();Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(n,'SYNTHETIC changed query');n.dispatchEvent(new Event('input',{bubbles:true}));})()`);
 await wait('!document.getElementById("tops-federal-results")');await ev('window.requestAnimationFrame=window.savedRAF;window.heldRAF.splice(0).forEach(fn=>fn(performance.now()))');await frames();assert.equal(await ev('document.activeElement.id'),'tops-job-role');assert.equal(await ev('document.getElementById("tops-job-role").value'),'SYNTHETIC changed query');
 console.log('PASS pending-search learning intent and changed-query queued-focus race');
 // Edited invalid location/markup must remove the outbound action until corrected.
 mode='success';await seed('light','SYNTHETIC custom role','53202');await wait('!document.getElementById("tops-federal-search").disabled');const count=posts.length;
 await input('tops-job-area','542');assert.equal(await ev('!!document.getElementById("tops-job-careeronestop")'),false);await click('tops-federal-search');assert.equal(posts.length,count);assert.equal(await ev('document.activeElement.id'),'tops-job-area');
 await input('tops-job-area','Milwaukee, WI');await checkLinks('SYNTHETIC custom role','Milwaukee, WI');await input('tops-job-role','<script>');assert.equal(await ev('!!document.getElementById("tops-job-careeronestop")'),false);await click('tops-federal-search');assert.equal(posts.length,count);assert.equal(await ev('document.activeElement.id'),'tops-job-role');
 assert.deepEqual(errors,[]);assert.equal(external.some(u=>/api\.openai|anthropic|onesignal|careeronestop/i.test(u)),false);
 console.log('PASS edited queries, invalid inputs, no external provider/source requests, and no JavaScript exceptions');
 }finally{if(chrome)await h.stopChrome(chrome);await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
