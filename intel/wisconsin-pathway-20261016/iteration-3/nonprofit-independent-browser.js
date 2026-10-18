'use strict';
// Bounded synthetic review of iteration-3 nonprofit routing. No external requests.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),crypto=require('node:crypto'),{spawn}=require('node:child_process');
const root='/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops';
const helper=fs.readFileSync(path.join(root,'scripts/privacy-network-regression.js'),'utf8');
const h=new Function('fs','path','os','spawn',helper.slice(helper.indexOf('function findChrome()'),helper.indexOf('const PROBE_SCRIPT ='))+'\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs,path,os,spawn);
const html=fs.readFileSync(path.join(root,'index.html')),hash=crypto.createHash('sha256').update(html).digest('hex');
const expected=process.env.WI_REVIEW_HASH;if(expected)assert.equal(hash,expected,'candidate changed before review');
const server=http.createServer((req,res)=>{const name=req.url.split('?')[0],p=path.join(root,name==='/'?'index.html':name);if(!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript':p.endsWith('.html')?'text/html':'application/octet-stream');res.end(name==='/'?html:fs.readFileSync(p));});
(async()=>{let chrome;const errors=[],posts=[],cases=[];try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;chrome=await h.launchChrome(h.findChrome(),12);const c=chrome.client;
 await c.send('Page.enable');await c.send('Runtime.enable');c.on('Runtime.exceptionThrown',e=>errors.push(e.exceptionDetails.text));await c.send('Fetch.enable',{patterns:[{urlPattern:'*'}]});c.on('Fetch.requestPaused',async e=>{if(e.request.method==='POST')posts.push(e.request.url);const local=e.request.url.startsWith(base)&&!e.request.url.includes('/.netlify/');try{await c.send(local?'Fetch.continueRequest':'Fetch.failRequest',local?{requestId:e.requestId}:{requestId:e.requestId,errorReason:'BlockedByClient'});}catch{}});
 const ev=x=>h.evaluate(c,x,true),frames=()=>ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))'),wait=x=>h.waitForExpression(c,x,x,12000);
 const load=async q=>{const done=new Promise(r=>c.on('Page.loadEventFired',r));await c.send('Page.navigate',{url:base+'/?tool='+q});await done;await wait('!!document.getElementById("tops-main-content")');await frames();};
 const disk=()=>ev('JSON.stringify(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))');
 const choose=async(id,value)=>{await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});n.value=${JSON.stringify(value)};n.dispatchEvent(new Event('change',{bubbles:true}))})()`);await frames();};
 const nativeOpen=async id=>{await ev(`document.querySelector(${JSON.stringify('#'+id+' > summary')}).focus()`);await c.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',unmodifiedText:'\r',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});await c.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});await frames();assert.equal(await ev(`document.getElementById(${JSON.stringify(id)}).open`),true);};
 const scenarios=[['start','active',375],['service','guard',320],['service','reserve',375],['moving','family',375],['moving','veteran',320],['health','veteran',375],['benefits','veteran',320],['work','orders',375],['education','serving',320]];
 for(const theme of ['professional','tactical']){
  await c.send('Emulation.setDeviceMetricsOverride',{width:375,height:667,deviceScaleFactor:1,mobile:true});await load('dashboard');await ev(`(()=>{localStorage.clear();localStorage.setItem('tops_onboarded','1');localStorage.setItem('tops_user_status','separated');localStorage.setItem('tops_theme',${JSON.stringify(theme)});})()`);
  for(const [need,situation,width] of scenarios){
   await c.send('Emulation.setDeviceMetricsOverride',{width,height:667,deviceScaleFactor:1,mobile:true});await load(`resources&view=state-help&area=wi&situation=${situation}&need=${need}`);const before=await disk();
   assert.equal(await ev('document.querySelectorAll("#tops-wisconsin-next-chapter details[open]").length'),0,'disclosures must start collapsed');await nativeOpen('tops-wisconsin-local-help');
   const data=await ev(`(()=>{const s=document.getElementById('tops-wisconsin-local-help');return {text:s.innerText,rows:[...s.querySelectorAll('[data-help-id]')].map(n=>({id:n.dataset.helpId,text:n.innerText})),links:[...s.querySelectorAll('a')].map(a=>({href:a.href,text:a.textContent,target:a.target,rel:a.rel,referrerPolicy:a.referrerPolicy,onclick:a.getAttribute('onclick')})),width:innerWidth,scrollWidth:document.documentElement.scrollWidth}})()`);
   assert(data.rows.length>=1&&data.rows.length<=3,'local help must stay bounded');assert(data.scrollWidth<=data.width+1,'horizontal overflow');assert(!data.text.includes('Dryhootch'),'held nonprofit leaked');
   assert(data.links.every(a=>a.href.startsWith('https://')&&a.target==='_blank'&&a.rel.includes('noopener')&&a.rel.includes('noreferrer')&&a.referrerPolicy==='no-referrer'&&!a.onclick),'external referral must not have completion handler');
   const ids=data.rows.map(r=>r.id);
   if(['start','service'].includes(need)){assert(ids.includes('WI3-NP-20261016-VETSNET'));assert(data.text.includes('separate service from Transition OPS'));assert(data.text.includes('Wisconsin'));}
   else assert(!ids.includes('WI3-NP-20261016-VETSNET'),'irrelevant VetsNet duplication');
   if(need==='moving'){assert(ids.includes('WI3-NP-20261016-CVI-SSVF'));assert(ids.includes('WI3-NP-20261016-VOW-MARKET'));assert(data.text.includes('Participating Wisconsin counties'));assert(data.text.includes('surviving spouses'));assert(data.text.includes('Racine'));assert(data.text.includes('in-person'));assert(data.text.includes('does not guarantee funding'));}
   else assert(!ids.some(id=>id.includes('CVI-SSVF')||id.includes('VOW-MARKET')),'housing helpers outside selected need');
   assert.equal(await disk(),before,'browsing must not change plan, completion or storage');
   cases.push({theme,need,situation,width,ids,overflow:data.scrollWidth>data.width+1});
  }
  const before=await disk();await choose('tops-state-help-area','national');assert.equal(await ev('!!document.getElementById("tops-wisconsin-next-chapter")'),false);assert.equal(await disk(),before);
 }
 assert.deepEqual(errors,[]);assert.deepEqual(posts,[]);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'index.html'))).digest('hex'),hash,'candidate changed during review');
 const result={checked:'2026-10-16',index_sha256:hash,result:'PASS',environment:'Isolated headless Chrome; loopback only; external/functions blocked; 320/375 × 667; two themes; synthetic contexts. Not a field usability or service-availability test.',checks:['three cleared nonprofit IDs only','2–3 or fewer need-matched options','exact geography visible','surviving-spouse audience','Onward Ops distinct from Transition OPS','Guard/Reserve/family contexts do not broaden eligibility','native Enter opens local help','collapsed first view','no horizontal overflow','external links no completion handler','storage unchanged by browsing','All states hides Wisconsin helpers','zero runtime errors or POST attempts'],cases};fs.writeFileSync(__dirname+'/nonprofit-independent-browser.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
 }finally{if(chrome)await h.stopChrome(chrome);await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
