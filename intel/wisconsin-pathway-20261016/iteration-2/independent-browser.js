'use strict';
// Synthetic local-only review of the new welcome and disclosure surfaces.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),crypto=require('node:crypto'),{spawn}=require('node:child_process');
const root='/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops';
const helper=fs.readFileSync(path.join(root,'scripts/privacy-network-regression.js'),'utf8');
const h=new Function('fs','path','os','spawn',helper.slice(helper.indexOf('function findChrome()'),helper.indexOf('const PROBE_SCRIPT ='))+'\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs,path,os,spawn);
const html=fs.readFileSync(path.join(root,'index.html')),hash=crypto.createHash('sha256').update(html).digest('hex');
const server=http.createServer((req,res)=>{const name=req.url.split('?')[0],p=path.join(root,name==='/'?'index.html':name);if(!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript':p.endsWith('.html')?'text/html':'application/octet-stream');res.end(name==='/'?html:fs.readFileSync(p));});
(async()=>{let chrome;const errors=[],posts=[],screens=[];try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;chrome=await h.launchChrome(h.findChrome(),12);const c=chrome.client;
 await c.send('Page.enable');await c.send('Runtime.enable');c.on('Runtime.exceptionThrown',e=>errors.push(e.exceptionDetails.text));await c.send('Fetch.enable',{patterns:[{urlPattern:'*'}]});c.on('Fetch.requestPaused',async e=>{if(e.request.method==='POST')posts.push(e.request.url);const local=e.request.url.startsWith(base)&&!e.request.url.includes('/.netlify/');try{await c.send(local?'Fetch.continueRequest':'Fetch.failRequest',local?{requestId:e.requestId}:{requestId:e.requestId,errorReason:'BlockedByClient'});}catch{}});
 const ev=x=>h.evaluate(c,x,true),frames=()=>ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))'),wait=x=>h.waitForExpression(c,x,x,12000);
 const load=async q=>{const done=new Promise(r=>c.on('Page.loadEventFired',r));await c.send('Page.navigate',{url:base+'/?tool='+q});await done;await wait('!!document.getElementById("tops-main-content")');await frames();};
 const disk=()=>ev('JSON.stringify(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))');
 const choose=async(id,value)=>{await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});n.value=${JSON.stringify(value)};n.dispatchEvent(new Event('change',{bubbles:true}))})()`);await frames();};
 const nativeOpen=async id=>{await ev(`document.querySelector(${JSON.stringify('#'+id+' > summary')}).focus()`);await c.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',unmodifiedText:'\r',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});await c.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});await frames();assert.equal(await ev(`document.getElementById(${JSON.stringify(id)}).open`),true);};
 for(const theme of ['professional','tactical'])for(const width of [320,375]){
  await c.send('Emulation.setDeviceMetricsOverride',{width,height:667,deviceScaleFactor:1,mobile:true});await load('dashboard');await ev(`(()=>{localStorage.clear();localStorage.setItem('tops_onboarded','1');localStorage.setItem('tops_user_status','separated');localStorage.setItem('tops_theme',${JSON.stringify(theme)});})()`);await load('resources&view=state-help&area=wi&situation=browse&need=work');
  const initial=await disk();assert.equal(await ev('document.querySelectorAll("#tops-wisconsin-next-chapter details[open]").length'),0);
  const geometry=await ev(`(()=>{const b=document.querySelector('#tops-state-help article > a').getBoundingClientRect(),nav=document.querySelector('[aria-label="Primary"]').getBoundingClientRect();return {width:innerWidth,height:innerHeight,action:{top:b.top,bottom:b.bottom,width:b.width,height:b.height},navTop:nav.top,scrollWidth:document.documentElement.scrollWidth,heading:document.querySelector('#tops-state-help-heading').textContent}})()`);
  assert(geometry.scrollWidth<=geometry.width+1,'horizontal overflow');assert(geometry.action.height>=44&&geometry.action.width>=44,'primary target size');
  screens.push({theme,width,...geometry});
  await nativeOpen('tops-wisconsin-skillbridge');assert.equal(await ev('document.querySelectorAll("#tops-wisconsin-skillbridge ol").length'),0,'implied numbered funding ladder');
  await nativeOpen('tops-wisconsin-employer-help');await nativeOpen('tops-wisconsin-cohort');
  const links=await ev('[...document.querySelectorAll("#tops-wisconsin-cohort a")].map(a=>({href:a.href,text:a.textContent,rel:a.rel,target:a.target,referrerPolicy:a.referrerPolicy}))');
  for(const expected of ['https://airtechhtg.com/careers/','https://www.wisconsinmanagement.com/careers','https://krietetrucks.com/careers/'])assert(links.some(l=>l.href===expected),'missing resolved official identity '+expected);
  assert(links[0].href.includes('skillbridge.mil'),'official SkillBridge route must precede company examples');
  assert(links.every(l=>l.href.startsWith('https://')&&l.target==='_blank'&&l.rel.includes('noopener')&&l.rel.includes('noreferrer')&&l.referrerPolicy==='no-referrer'));
  assert.equal(await disk(),initial,'browsing new content writes saved data');
  await choose('tops-state-help-area','national');assert.equal(await ev('!!document.getElementById("tops-wisconsin-next-chapter")'),false);assert.equal(await ev('document.getElementById("tops-state-help-heading").textContent'),'State and local help');assert.equal(await disk(),initial);
 }
 assert.deepEqual(errors,[]);assert.deepEqual(posts,[]);
 const layoutPassed=screens.filter(s=>s.width===375).every(s=>s.action.top>=0&&s.action.bottom<=Math.min(s.height,s.navTop));
 const result={checked:'2026-10-16',index_sha256:hash,environment:'Isolated headless Google Chrome, synthetic local loopback, 320/375 × 667, both themes; all external/function requests blocked',result:layoutPassed?'PASS':'FAIL_LAYOUT',checks:['375 primary action visible above bottom navigation','320/375 reflow and primary target size','all new disclosures initially collapsed','native Enter expands member/employer/cohort content','no numbered funding ladder','official SkillBridge route precedes resolved company websites','external link safety','browsing does not change local storage','All states removes Wisconsin welcome/content','zero uncaught exceptions or POST attempts'],screens};
 fs.writeFileSync(__dirname+'/independent-browser.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
 assert(layoutPassed,'primary action below first usable 375px viewport; see receipt');
 }finally{if(chrome)await h.stopChrome(chrome);await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
