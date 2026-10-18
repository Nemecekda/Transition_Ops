'use strict';
// Bounded synthetic review of iteration-4 education/county routing. No external requests.
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
 const scenarios=[['education','browse',375],['education','active',320],['education','veteran',375],['education','guard',320],['education','reserve',375],['education','serving',320],['education','orders',375],['education','family',320],['moving','family',375],['moving','reserve',320]];
 for(const theme of ['professional','tactical']){
  await c.send('Emulation.setDeviceMetricsOverride',{width:375,height:667,deviceScaleFactor:1,mobile:true});await load('dashboard');await ev(`(()=>{localStorage.clear();localStorage.setItem('tops_onboarded','1');localStorage.setItem('tops_user_status','separated');localStorage.setItem('tops_theme',${JSON.stringify(theme)});})()`);
  for(const [need,situation,width] of scenarios){
   await c.send('Emulation.setDeviceMetricsOverride',{width,height:667,deviceScaleFactor:1,mobile:true});const route=`resources&view=state-help&area=wi&situation=${situation}&need=${need}`;await load(route);const before=await disk();
   assert.equal(await ev('document.querySelectorAll("#tops-wisconsin-next-chapter details[open]").length'),0,'details start collapsed');
   const primary=await ev('document.getElementById("tops-state-help-next").textContent');
   assert.equal(primary,need==='moving'?'Plan your Wisconsin move':situation==='guard'?'Wisconsin Guard tuition':'Pay for school','primary context changed');
   let ids=[];
   if(need==='education'){
    await nativeOpen('tops-wisconsin-education');
    const d=await ev(`(()=>{const n=document.getElementById('tops-wisconsin-education');return {text:n.innerText,ids:[...n.querySelectorAll('[data-education-id]')].map(x=>x.dataset.educationId),links:[...n.querySelectorAll('a')].map(a=>({url:a.href,target:a.target,rel:a.rel,ref:a.referrerPolicy,click:a.getAttribute('onclick')}))}})()`);
    ids=d.ids;assert(ids.includes('WI4-20261016-FEDERAL-EDUCATION'));assert(ids.includes('WI4-20261016-PRIVATE-EDUCATION'));assert(ids.includes('WI4-20261016-VETED-REVIEW'));
    assert.equal(ids.includes('WI4-20261016-SELECTED-RESERVE'),['serving','guard','reserve','orders'].includes(situation));
    assert(d.text.includes('residency for tuition'));assert(d.text.includes('paid to the school'));assert(d.text.includes('not automatic extra funding'));assert(d.text.includes('family history'));assert(!/three consecutive|five consecutive|3 years|5 years/.test(d.text),'conflicted eligibility leaked');
    assert(d.links.every(a=>a.url.startsWith('https://')&&a.target==='_blank'&&a.rel.includes('noopener')&&a.rel.includes('noreferrer')&&a.ref==='no-referrer'&&!a.click));
    assert(d.links.some(a=>a.url==='https://heab.state.wi.us/features/vets.html'));assert(d.links.some(a=>a.url==='https://www.benefits.va.gov/gibill/contact_us.asp'));
   }else{
    assert.equal(await ev('!!document.getElementById("tops-wisconsin-education")'),false);
    await ev(`(()=>{const a=[...document.querySelectorAll('#tops-state-help a')].find(a=>a.href.includes('/veterans-outreach-and-recovery/'));const d=a.closest('details');if(d)d.open=true;})()`);await frames();
    const text=await ev('document.getElementById("tops-state-help").innerText');assert(text.includes("county's")||text.includes('county map'));assert(text.includes('listed supervisor'));assert(text.includes('not guaranteed'));
    await nativeOpen('tops-wisconsin-local-help');const d=await ev(`(()=>{const n=document.getElementById('tops-wisconsin-local-help');return {text:n.innerText,count:n.querySelectorAll('[data-help-id]').length}})()`);assert.equal(d.count,3);assert(d.text.includes('household'));assert(d.text.includes('surviving spouses'));assert(d.text.includes('Racine'));
   }
   const geometry=await ev('({w:innerWidth,sw:document.documentElement.scrollWidth})');assert(geometry.sw<=geometry.w+1,'horizontal overflow');assert.equal(await disk(),before,'browsing wrote storage');
   await load(route);assert.equal(await ev('document.getElementById("tops-state-help-need").value'),need);assert.equal(await ev('document.getElementById("tops-state-help-situation").value'),situation);assert.equal(await disk(),before,'reload changed saved work');
   cases.push({theme,need,situation,width,primary,educationIds:ids,overflow:false});
  }
  const before=await disk();await choose('tops-state-help-area','national');assert.equal(await ev('!!document.getElementById("tops-wisconsin-next-chapter")'),false);assert.equal(await disk(),before);
 }
 assert.deepEqual(errors,[]);assert.deepEqual(posts,[]);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'index.html'))).digest('hex'),hash,'candidate changed during review');
 const result={checked:'2026-10-16',index_sha256:hash,result:'PASS',environment:'Isolated headless Chrome; loopback only; external/functions blocked; 320/375 ×667; two themes; synthetic contexts. Not a field usability or service-availability test.',checks:['education only and collapsed first view','primary matrix preserved incl moving DOR and explicit Guard','Selected Reserve context matching','agency/school and tuition/cash distinction','no conflicted residency rule','family and federal route retained','county map and vacancy supervisor fallback','three household helper rows retained','native keyboard disclosure','safe external links','no horizontal overflow','unchanged storage by browsing/reload','All states hides Wisconsin details','zero runtime exceptions or POST attempts'],cases};fs.writeFileSync(__dirname+'/independent-education-browser.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
 }finally{if(chrome)await h.stopChrome(chrome);await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
