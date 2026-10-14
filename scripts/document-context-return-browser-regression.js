'use strict';
// Synthetic context-aware Documents return boundaries. No external services or member data.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),utility=fs.readFileSync(path.join(__dirname,'privacy-network-regression.js'),'utf8');
const h=new Function('fs','path','os','spawn',utility.slice(utility.indexOf('function findChrome()'),utility.indexOf('const PROBE_SCRIPT ='))+'\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs,path,os,spawn);
const server=http.createServer((req,res)=>{const p=path.join(root,req.url.split('?')[0]==='/'?'index.html':req.url.split('?')[0]);if(!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript':p.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(p.endsWith('index.html')&&process.env.TOPS_REVIEW_HTML?process.env.TOPS_REVIEW_HTML:p));});
(async()=>{let chrome;const errors=[],posts=[];try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;chrome=await h.launchChrome(h.findChrome(),12);const c=chrome.client;
 await c.send('Page.enable');await c.send('Runtime.enable');c.on('Runtime.exceptionThrown',e=>errors.push(e.exceptionDetails.text));await c.send('Fetch.enable',{patterns:[{urlPattern:'*'}]});c.on('Fetch.requestPaused',async e=>{if(e.request.method==='POST')posts.push(e.request.url);const local=e.request.url.startsWith(url)&&!e.request.url.includes('/.netlify/');try{await c.send(local?'Fetch.continueRequest':'Fetch.failRequest',local?{requestId:e.requestId}:{requestId:e.requestId,errorReason:'BlockedByClient'});}catch{}});
 const ev=x=>h.evaluate(c,x,true),wait=x=>h.waitForExpression(c,x,x,12000),frames=()=>ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
 const visible=id=>ev(`!!document.getElementById(${JSON.stringify(id)})?.checkVisibility()`);
 const click=async id=>{await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});if(!n?.checkVisibility()||n.disabled)throw Error('hidden or disabled '+${JSON.stringify(id)});n.click()})()`);await frames();};
 const text=async label=>{await ev(`(()=>{const n=[...document.querySelectorAll('button')].find(n=>n.checkVisibility()&&n.textContent===${JSON.stringify(label)});if(!n)throw Error('missing '+${JSON.stringify(label)});n.click()})()`);await frames();};
 const nav=async label=>{await ev(`(()=>{const n=[...document.querySelectorAll('[aria-label="Primary"] button')].find(n=>n.textContent===${JSON.stringify(label)});n.click()})()`);await frames();};
 const load=async query=>{const loaded=new Promise(r=>c.on('Page.loadEventFired',r));await c.send('Page.navigate',{url:url+'/?tool='+query});await loaded;await wait('!!document.getElementById("tops-page-title")');await frames();};
 const reload=async()=>{const loaded=new Promise(r=>c.on('Page.loadEventFired',r));await c.send('Page.reload');await loaded;await wait('!!document.getElementById("tops-page-title")');await frames();};
 const disk=()=>ev('JSON.stringify(["tops_personal_guide_v1","tops_career_action_v1","tops_career_gap_v1","tops_sep_date","etsDate","tops_readiness","taskProgress","tops_member_jobs_v1"].map(k=>localStorage.getItem(k)))');
 const seed=async(profile,pathway,theme='professional')=>{await load('dashboard');await ev(`(()=>{localStorage.clear();localStorage.setItem('tops_onboarded','1');localStorage.setItem('tops_user_status',${JSON.stringify(profile)});localStorage.setItem('tops_theme',${JSON.stringify(theme)});localStorage.setItem('tops_sep_date','2021-04-12');localStorage.setItem('etsDate','2021-04-12');if(${JSON.stringify(pathway)}){const guide={version:1,pathway:${JSON.stringify(pathway)},currentRole:'SYNTHETIC current role',targetRole:'SYNTHETIC HR',goal:'SYNTHETIC chosen goal'};localStorage.setItem('tops_personal_guide_v1',JSON.stringify(guide));localStorage.setItem('tops_career_action_v1',JSON.stringify({version:1,text:'SYNTHETIC preserve my chosen step',date:'2027-10-20',done:false,context:guide}));const gap=topsEmptyGap();gap.target=guide.targetRole;gap.rows[0].have='SYNTHETIC reviewed experience';localStorage.setItem('tops_career_gap_v1',JSON.stringify(gap));}})()`);await load('dashboard');};
 const traverse=async method=>{await ev(`new Promise(resolve=>{addEventListener('popstate',()=>requestAnimationFrame(()=>requestAnimationFrame(resolve)),{once:true});history.${method}()})`);await frames();};

 const topic=async value=>{await ev(`(()=>{const n=document.getElementById('tops-resource-topic');n.focus();n.value=${JSON.stringify(value)};n.dispatchEvent(new Event('change',{bubbles:true}))})()`);await frames();};
 const expectDocs=async label=>{await wait('document.activeElement?.id==="tops-plan-documents"');assert.equal(await ev('document.getElementById("tops-documents-back").textContent'),label);assert.equal(await ev('new URL(location.href).searchParams.get("view")'),'documents');};
 const expectTopic=async value=>{await wait(`document.getElementById('tops-resource-topic')?.value===${JSON.stringify(value)}`);await wait('document.activeElement?.id==="tops-resource-topic"');assert.equal(await ev('new URL(location.href).searchParams.has("view")'),false);};
 await seed('veteran','change');await ev('localStorage.setItem("docProgress",JSON.stringify([{id:"d1",obtained:true}]))');await load('dashboard');const saved=await disk(),docs=await ev('localStorage.getItem("docProgress")');
 const topics={healthcare:'Back to Healthcare',directory:'Back to all resources',vsos:'Back to claims help and veteran organizations',tap:'Back to transition assistance programs',mindset:'Back to mindset and adjustment',leadership:'Back to leadership and communication',spouse:'Back to military spouse resources',perks:'Back to veteran discounts and perks',skillbridge:'Back to SkillBridge'};
 for(const [parent,label] of Object.entries(topics)){
   await load('resources');await topic(parent);await topic('documents');await expectDocs(label);
   assert.equal(await ev('history.state.documentReturn'),parent);
   await click('tops-documents-back');await expectTopic(parent);
   assert.equal(await ev('Object.prototype.hasOwnProperty.call(history.state,"documentReturn")'),false);
 }
 console.log('PASS: all nine resource topics return in one click with destination label and selector focus; descriptor absent outside Documents.');
 await load('resources');await topic('healthcare');await topic('documents');await expectDocs(topics.healthcare);
 const historyLength=(await c.send('Page.getNavigationHistory')).entries.length;
 await reload();await expectDocs(topics.healthcare);assert.equal((await c.send('Page.getNavigationHistory')).entries.length,historyLength);
 await click('tops-documents-back');await expectTopic('healthcare');await traverse('forward');await expectDocs(topics.healthcare);await traverse('back');await wait('document.getElementById("tops-resource-topic")?.value==="healthcare"');await traverse('forward');await expectDocs(topics.healthcare);
 console.log('PASS: Healthcare visible return survives reload and native Back/Forward without duplicate entries.');
 await click('tops-documents-back');await expectTopic('healthcare');await topic('directory');await text('FREE');
 const freeBefore=await ev('Array.from(document.querySelectorAll("a")).filter(a=>a.checkVisibility()).map(a=>[a.href,a.textContent])');
 await topic('documents');await expectDocs(topics.directory);await click('tops-documents-back');await expectTopic('directory');
 assert.deepEqual(await ev('Array.from(document.querySelectorAll("a")).filter(a=>a.checkVisibility()).map(a=>[a.href,a.textContent])'),freeBefore);
 console.log('PASS: all-resources return preserves the existing in-memory cost filter and rendered results.');
 await load('resources&guide=wisconsin-work-support');await wait('document.activeElement?.id==="tops-wi-work-support-resources-heading"');await topic('documents');await expectDocs('Back to Wisconsin guide');await reload();await expectDocs('Back to Wisconsin guide');await click('tops-documents-back');await wait('document.activeElement?.id==="tops-wi-work-support-resources-heading"');assert.equal(await ev('new URL(location.href).searchParams.get("guide")'),'wisconsin-work-support');assert.equal(await ev('document.getElementById("tops-wi-work-support-resources-heading").closest("details").open'),true);
 console.log('PASS: fixed Wisconsin guide origin returns to its expanded heading, including after reload.');
 await topic('healthcare');await topic('documents');await expectDocs(topics.healthcare);await click('tops-documents-back');await expectTopic('healthcare');
 console.log('PASS: Wisconsin guide followed by Healthcare captures the actual Healthcare origin.');
 await nav('My Plan');await click('tops-plan-shortcut-resources');await expectDocs('Back to My Plan');await reload();await expectDocs('Back to My Plan');await click('tops-documents-back');await wait('document.activeElement?.id==="tops-plan-shortcut-resources"');
 await nav('Home');await ev('Array.from(document.querySelectorAll("[role=button]")).find(n=>n.textContent.includes("MORE TOOLS & INTEL")).click()');await click('tops-home-documents');await expectDocs('Back to Home');await reload();await expectDocs('Back to Home');await click('tops-documents-back');await wait('document.activeElement?.id==="tops-home-documents"');assert.equal(await visible('tops-home-documents'),true);
 console.log('PASS: My Plan preserves its shortcut focus; Home tile is revealed and focused even after a Documents reload.');
 await load('resources&view=documents');await expectDocs('Open My Plan');await click('tops-documents-back');await wait('document.activeElement?.id==="tops-plan-shortcut-resources"');
 for(const bad of ['unknown','constructor','__proto__','https://example.test/?member=PRIVATE',{topic:'healthcare'},['healthcare'],2,null]){
   await load('resources&view=documents');await ev(`history.replaceState(Object.assign({},history.state,{documentReturn:${JSON.stringify(bad)}}),'')`);await reload();await expectDocs('Open My Plan');assert.equal(await ev('Object.prototype.hasOwnProperty.call(history.state,"documentReturn")'),false);await click('tops-documents-back');await wait('!!document.getElementById("tops-plan-hub")');
 }
 console.log('PASS: direct or malformed origin safely opens My Plan; arbitrary values never become labels or navigation targets.');
 await load('readiness');await click('tops-readiness-category-admin');await click('tops-readiness-tool-a6');await wait('document.activeElement?.id==="tops-plan-documents"');assert.equal(await visible('tops-documents-back'),false);assert.equal(await ev('document.getElementById("tops-readiness-return").textContent'),'Back to transition checklist');await click('tops-readiness-return');await wait('document.activeElement?.id==="tops-readiness-tool-a6"');
 console.log('PASS: existing Readiness return takes precedence with its exact checklist item focus.');
 for(const width of [320,375])for(const theme of ['professional','tactical']){
   await load('resources');await topic('vsos');await topic('documents');await expectDocs(topics.vsos);await c.send('Emulation.setDeviceMetricsOverride',{width,height:812,deviceScaleFactor:1,mobile:true});
   if(await ev('document.documentElement.getAttribute("data-tops-theme")')!==theme)await ev('Array.from(document.querySelectorAll("button")).find(n=>n.getAttribute("aria-label")==='+JSON.stringify('Switch to '+(theme==='tactical'?'dark':'light')+' theme')+').click()');await frames();
   assert.equal(await ev('document.documentElement.scrollWidth<=innerWidth+1'),true);assert.equal(await ev('document.getElementById("tops-documents-back").getBoundingClientRect().height>=44'),true);await ev('document.getElementById("tops-documents-back").focus()');
   await c.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',unmodifiedText:'\r',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});await c.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});await expectTopic('vsos');
 }
 assert.equal(await disk(),saved);assert.equal(await ev('localStorage.getItem("docProgress")'),docs);assert.equal(await ev('JSON.stringify(history.state).includes("SYNTHETIC")||location.href.includes("SYNTHETIC")'),false);assert.deepEqual(errors,[]);assert.deepEqual(posts,[]);
 console.log('DOCUMENT CONTEXT RETURN PASS: exact saved bytes, both themes320/375, native Enter, wrapping44px controls and zero provider POST.');
 }finally{if(chrome)await h.stopChrome(chrome);await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
