'use strict';
// Synthetic Wisconsin welcome, SkillBridge coordination and company referrals. No external services or member data.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),utility=fs.readFileSync(path.join(root,'scripts/privacy-network-regression.js'),'utf8');
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
 const load=async query=>{const loaded=new Promise(r=>c.on('Page.loadEventFired',r));await c.send('Page.navigate',{url:url+'/?tool='+query});await loaded;await wait('!!document.getElementById("tops-main-content")');await frames();};
 const reload=async()=>{const loaded=new Promise(r=>c.on('Page.loadEventFired',r));await c.send('Page.reload');await loaded;await wait('!!document.getElementById("tops-main-content")');await frames();};
 const disk=()=>ev('JSON.stringify(["tops_personal_guide_v1","tops_career_action_v1","tops_career_gap_v1","tops_sep_date","etsDate","tops_readiness","taskProgress","tops_member_jobs_v1"].map(k=>localStorage.getItem(k)))');
 const seed=async(profile,pathway,theme='professional')=>{await load('dashboard');await ev(`(()=>{localStorage.clear();localStorage.setItem('tops_onboarded','1');localStorage.setItem('tops_user_status',${JSON.stringify(profile)});localStorage.setItem('tops_theme',${JSON.stringify(theme)});localStorage.setItem('tops_sep_date','2021-04-12');localStorage.setItem('etsDate','2021-04-12');if(${JSON.stringify(pathway)}){const guide={version:1,pathway:${JSON.stringify(pathway)},currentRole:'SYNTHETIC current role',targetRole:'SYNTHETIC HR',goal:'SYNTHETIC chosen goal'};localStorage.setItem('tops_personal_guide_v1',JSON.stringify(guide));localStorage.setItem('tops_career_action_v1',JSON.stringify({version:1,text:'SYNTHETIC preserve my chosen step',date:'2027-10-20',done:false,context:guide}));const gap=topsEmptyGap();gap.target=guide.targetRole;gap.rows[0].have='SYNTHETIC reviewed experience';localStorage.setItem('tops_career_gap_v1',JSON.stringify(gap));}})()`);await load('dashboard');};
 const traverse=async method=>{await ev(`new Promise(resolve=>{addEventListener('popstate',()=>requestAnimationFrame(()=>requestAnimationFrame(resolve)),{once:true});history.${method}()})`);await frames();};

 const help=async(area='wi',need='work')=>{await load('resources&view=state-help&area='+area+'&situation=browse&need='+need);await wait('!!document.getElementById("tops-state-help-next")');};
 const allDisk=()=>ev('JSON.stringify(Object.entries(localStorage).sort())');
 const key=async(key,code=key)=>{await c.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,text:key==='Enter'?'\r':' ',unmodifiedText:key==='Enter'?'\r':' ',windowsVirtualKeyCode:key==='Enter'?13:32,nativeVirtualKeyCode:key==='Enter'?13:32});await c.send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:key==='Enter'?13:32,nativeVirtualKeyCode:key==='Enter'?13:32});await frames();};
 const expand=async id=>{await ev('document.querySelector("#'+id+' > summary").focus()');await key('Enter');assert.equal(await ev('document.getElementById("'+id+'").open'),true);};


 await seed('guard','change');const original=await allDisk();await help('wi','start');
 await ev('(()=>{Object.defineProperty(navigator,"share",{configurable:true,value:undefined});Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async()=>{throw new Error("denied");}}});})()');
 await ev('document.getElementById("tops-wisconsin-share-button").focus()');await key('Enter');
 assert.equal(await ev('document.getElementById("tops-wisconsin-share-status").textContent'),'Select and copy the guide link below.');
 await c.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await c.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await frames();
 assert.equal(await ev('document.activeElement.id'),'tops-wisconsin-share-url');
 assert.equal(await ev('document.activeElement.value'),'https://transitionops.org/wisconsin');
 assert.equal(await ev('document.activeElement.selectionEnd-document.activeElement.selectionStart'),'https://transitionops.org/wisconsin'.length);
 for(const width of [320,375,1280]) {
  await c.send('Emulation.setDeviceMetricsOverride',{width,height:812,deviceScaleFactor:1,mobile:width<500});await frames();
  assert.equal(await ev('document.documentElement.scrollWidth<=innerWidth+1'),true);
  assert.equal(await ev('(()=>{const r=document.getElementById("tops-wisconsin-share-button").getBoundingClientRect();return r.height>=44&&r.width>=44;})()'),true);
 }
 await c.send('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:true});await ev('document.getElementById("tops-wisconsin-share-button").scrollIntoView({block:"center"})');await frames();
 const shot=await c.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(os.tmpdir(),'wisconsin-share-integrated-375.png'),Buffer.from(shot.data,'base64'));
 await help('national','start');assert.equal(await ev('!!document.getElementById("tops-wisconsin-share")'),false);await help('wi','work');assert.equal(await ev('!!document.getElementById("tops-wisconsin-share")'),false);
 assert.equal(await allDisk(),original);assert.deepEqual(errors,[]);assert.deepEqual(posts,[]);console.log('WISCONSIN SHARE BROWSER PASS: keyboard activation, clipboard-denied selectable clean URL, Tab/select-all,320/375/1280 reflow,44px target, hidden outside WI/start, unchanged saved plan, zero exceptions/provider POSTs.');
}finally{if(chrome)await h.stopChrome(chrome);await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
