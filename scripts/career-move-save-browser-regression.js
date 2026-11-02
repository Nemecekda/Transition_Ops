'use strict';
// Synthetic, explicit browser-only comparison saves; provider and contact traffic is blocked.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),utility=fs.readFileSync(path.join(__dirname,'privacy-network-regression.js'),'utf8');
const h=new Function('fs','path','os','spawn',utility.slice(utility.indexOf('function findChrome()'),utility.indexOf('const PROBE_SCRIPT ='))+'\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression,CdpClient};')(fs,path,os,spawn);
const KEY='tops_move_comparison_v1',requests=[],errors=[],evidence=path.join(root,'intel/move-save-20261102/focused');
const server=http.createServer((req,res)=>{
  if(req.url.startsWith('/.netlify/functions/federal-jobs')&&req.method==='GET'){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify({available:false,provider:'USAJOBS'}));}
  const pathname=new URL(req.url,'http://localhost').pathname,file=path.join(root,pathname==='/'?'index.html':pathname);
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(file));
});
const probe=`
  window.__fault=new URLSearchParams(location.search).get('fault')||'';window.__storageOps=[];window.__downloads=[];
  window.__nativeStorage={};for(const method of ['getItem','setItem','removeItem']){__nativeStorage[method]=Storage.prototype[method];Storage.prototype[method]=function(...args){if(args[0]==='${KEY}'){__storageOps.push([method,...args]);if(__fault===method)throw new DOMException('Synthetic storage failure','QuotaExceededError');}return __nativeStorage[method].apply(this,args);};}
  URL.createObjectURL=blob=>{__downloads.push(blob);return 'blob:synthetic-backup';};URL.revokeObjectURL=()=>{};
  document.addEventListener('click',event=>{const a=event.target.closest('a');if(a&&(a.download||!a.href.startsWith(location.origin)))event.preventDefault();},true);
`;
(async()=>{let chrome,second;try{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port;
  chrome=await h.launchChrome(h.findChrome(),12);
  const session=async c=>{
    const ev=expression=>h.evaluate(c,expression,true),wait=expression=>h.waitForExpression(c,expression,expression,12000);
    await c.send('Page.enable');await c.send('Runtime.enable');c.on('Runtime.exceptionThrown',event=>errors.push(event.exceptionDetails.text));
    await c.send('Page.addScriptToEvaluateOnNewDocument',{source:probe});
    await c.send('Fetch.enable',{patterns:[{urlPattern:'*'}]});c.on('Fetch.requestPaused',async event=>{
      requests.push({url:event.request.url,method:event.request.method,body:event.request.postData||''});
      const local=event.request.url.startsWith(origin)&&(!event.request.url.includes('/.netlify/')||event.request.method==='GET'&&event.request.url.includes('/.netlify/functions/federal-jobs'));
      try{if(event.request.url===origin+'/.netlify/functions/navigator')await c.send('Fetch.fulfillRequest',{requestId:event.requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:'application/json'}],body:Buffer.from(JSON.stringify({reply:'SYNTHETIC privacy check response'})).toString('base64')});else await c.send(local?'Fetch.continueRequest':'Fetch.failRequest',local?{requestId:event.requestId}:{requestId:event.requestId,errorReason:'BlockedByClient'});}catch{}
    });
    const frames=async()=>{await c.send('Page.bringToFront');await ev('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');};
    const load=async route=>{await c.send('Page.navigate',{url:origin+route});await wait('!!document.getElementById("tops-main-content")');await frames();};
    const reveal=async id=>{await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});if(!n)throw Error('Missing '+${JSON.stringify(id)});const ds=[];for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS'&&!p.open)ds.unshift(p);for(const d of ds)d.querySelector(':scope>summary').click();if(!n.checkVisibility())throw Error('Hidden '+${JSON.stringify(id)});})()`);await frames();};
    const tap=async id=>{await reveal(id);await ev(`document.getElementById(${JSON.stringify(id)}).click()`);await frames();};
    const input=async(id,value)=>{await reveal(id);await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(n,${JSON.stringify(value)});n.dispatchEvent(new Event('input',{bubbles:true}));})()`);await frames();};
    const nav=async label=>{await ev(`[...document.querySelectorAll('[aria-label=Primary] button')].find(n=>n.textContent===${JSON.stringify(label)}).click()`);await frames();};
    const raw=()=>ev(`__nativeStorage.getItem.call(localStorage,'${KEY}')`),other=()=>ev(`JSON.stringify([localStorage,sessionStorage].map(s=>Object.keys(s).filter(k=>k!=='${KEY}').sort().map(k=>[k,s.getItem(k)])))`);
    const value=id=>ev(`document.getElementById(${JSON.stringify(id)}).value`),text=id=>ev(`document.getElementById(${JSON.stringify(id)})?.textContent||''`);
    const open=async()=>{await tap('tops-career-move');await wait('document.activeElement.id==="tops-move-heading"');};
    return {c,ev,wait,frames,load,reveal,tap,input,nav,raw,other,value,text,open};
  };
  const a=await session(chrome.client);await a.c.send('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:true});
  const homeOrder=async()=>{await a.ev('window.scrollTo(0,0)');await a.frames();const position=await a.ev('(()=>{const row=document.getElementById("tops-home-move"),hero=document.getElementById("tops-loop-title"),button=document.getElementById("tops-home-move-resume"),r=button.getBoundingClientRect();return {before:!!hero&&!!(row.compareDocumentPosition(hero)&Node.DOCUMENT_POSITION_FOLLOWING),top:r.top,bottom:r.bottom,height:innerHeight};})()');assert.equal(position.before,true,'saved comparison return precedes the large planning card');assert.ok(position.top>=0&&position.bottom<=position.height,'Resume comparison is reachable in the first phone screen');};
  await a.load('/?tool=pathway');await a.open();
  assert.equal(await a.ev('!!document.getElementById("tops-move-save")&&document.getElementById("tops-move-save").checkVisibility()'),true,'fresh Career users can explicitly save a comparison without onboarding or a profile');
  assert.equal(await a.ev('localStorage.getItem("tops_onboarded")'),null);assert.equal(await a.ev('localStorage.getItem("tops_user_status")'),null);
  await a.ev('localStorage.setItem("synthetic_unrelated","retain");sessionStorage.setItem("synthetic_session","retain")');const unrelated=await a.other();assert.equal(await a.raw(),null);
  await a.input('tops-move-cash','0');assert.equal(await a.raw(),null,'typing never saves');await a.tap('tops-move-save');
  const partial=await a.raw();assert.ok(partial,'a partial estimate with explicit zero can be saved');
  const partialJSON=JSON.parse(partial);assert.equal(partialJSON.version,1);assert.ok(!/selected|balance|runway|timestamp|date|role|location/i.test(partial),'saved data contains raw comparison fields, not UI position, derived results or unrelated context');assert.equal(await a.other(),unrelated);
  await a.nav('Home');await a.wait('document.getElementById("tops-home-move-resume")?.checkVisibility()');await homeOrder();
  const homeRow=await a.ev('document.getElementById("tops-home-move-resume").closest("section").textContent');assert.ok(!/\$|SYNTHETIC_MOVE_SAVE/.test(homeRow),'compact Home return omits financial amounts and option labels');
  await a.load('/');await a.wait('document.getElementById("tops-home-move-resume")?.checkVisibility()');assert.equal(await a.ev('!!document.querySelector(".tops-welcome-page")'),false,'saved comparison alone bypasses Welcome on Home reload');
  await a.tap('tops-home-move-resume');await a.wait('document.activeElement.id==="tops-move-heading"');assert.equal(await a.value('tops-move-cash'),'0');
  for(const [key,value] of Object.entries({cash:'5000.00',label:'SYNTHETIC_MOVE_SAVE_A',income:'3500.25',expenses:'3000.10',moving:'1000',savings:'750.15'}))await a.input('tops-move-'+key,value);
  for(const [key,value] of Object.entries({housing:'1000.10',transport:'200',health:'0',other:'1800'}))await a.input('tops-move-cost-'+key,value);
  await a.input('tops-move-service','300.05');await a.tap('tops-move-include-service');
  await a.tap('tops-move-option-1');for(const [key,value] of Object.entries({label:'SYNTHETIC_MOVE_SAVE_B',income:'0',expenses:'',moving:'12.50',savings:'0'}))await a.input('tops-move-'+key,value);
  assert.equal(await a.raw(),partial);await a.tap('tops-move-save');const full=await a.raw();assert.notEqual(full,partial);assert.equal(await a.other(),unrelated);
  assert.deepEqual(Object.keys(JSON.parse(full)).sort(),['comparison','version']);assert.deepEqual(Object.keys(JSON.parse(full).comparison).sort(),['cash','options']);
  await a.tap('tops-move-option-0');assert.match(await a.text('tops-move-storage-status'),/^Saved on this browser/,'switching the edited option does not mark the comparison dirty');assert.equal(await a.raw(),full);
  await a.input('tops-move-savings','999.99');assert.equal(await a.raw(),full);assert.match(await a.text('tops-move-storage-status'),/unsaved|not saved/i);
  await a.nav('Home');await a.nav('Career');await a.reveal('tops-move-savings');assert.equal(await a.value('tops-move-savings'),'999.99','visit edits survive navigation');
  await a.load('/');await a.tap('tops-home-move-resume');assert.equal(await a.value('tops-move-savings'),'750.15','reload restores the explicitly saved snapshot');
  for(const [key,value] of Object.entries({cash:'5000.00',label:'SYNTHETIC_MOVE_SAVE_A',income:'3500.25',expenses:'3000.10',moving:'1000',savings:'750.15',service:'300.05','cost-housing':'1000.10','cost-health':'0'}))assert.equal(await a.value('tops-move-'+key),value,'raw field restored: '+key);
  assert.equal(await a.ev('document.getElementById("tops-move-include-service").checked'),true);await a.tap('tops-move-option-1');assert.equal(await a.value('tops-move-income'),'0');assert.equal(await a.value('tops-move-expenses'),'');assert.equal(await a.value('tops-move-savings'),'0');
  await a.tap('tops-move-clear');assert.equal(await a.value('tops-move-cash'),'');assert.equal(await a.raw(),full,'Clear current entries keeps the saved comparison');
  await a.tap('tops-move-recover');await a.wait('document.activeElement.id==="tops-move-storage-status"');assert.equal(await a.value('tops-move-cash'),'5000.00');assert.equal(await a.raw(),full);
  await a.tap('tops-move-delete');await a.tap('tops-move-delete-cancel');assert.equal(await a.raw(),full);assert.equal(await a.value('tops-move-cash'),'5000.00');
  await a.tap('tops-move-delete');await a.tap('tops-move-delete-confirm');assert.equal(await a.raw(),null);assert.equal(await a.value('tops-move-cash'),'','deleting an unchanged saved comparison clears the matching current draft');assert.equal(await a.other(),unrelated);
  console.log('PASS explicit partial/raw save, fresh Home return, focus, unsaved edits, option selection, clear/recover, delete cancel and matching-draft clear');
  // Home deletion retains a modified current draft; neither Cancel nor option changes delete data.
  await a.ev(`__nativeStorage.setItem.call(localStorage,'${KEY}',${JSON.stringify(full)})`);await a.load('/?tool=pathway');await a.open();await a.input('tops-move-savings','987.65');await a.nav('Home');
  await a.tap('tops-home-move-delete');await a.tap('tops-home-move-delete-cancel');await a.wait('document.activeElement.id==="tops-home-move-delete"');assert.equal(await a.raw(),full);
  await a.tap('tops-home-move-delete');await a.tap('tops-home-move-delete-confirm');assert.equal(await a.raw(),null);await a.wait('document.activeElement.id==="tops-home-move-status"');await a.nav('Career');await a.reveal('tops-move-savings');assert.equal(await a.value('tops-move-savings'),'987.65');assert.equal(await a.other(),unrelated);
  // Failed writes/deletes and reads preserve the saved bytes and the member's current entries.
  await a.ev('__fault="setItem"');await a.tap('tops-move-save');assert.equal(await a.raw(),null);assert.match(await a.text('tops-move-storage-status'),/could not be confirmed|blocked|full/i);assert.equal(await a.value('tops-move-savings'),'987.65');
  await a.ev('__fault=""');await a.tap('tops-move-recover');assert.equal(await a.value('tops-move-savings'),'987.65','recovering an absent saved copy retains the current draft');await a.tap('tops-move-save');let valid=await a.raw();
  await a.ev('__fault="removeItem"');await a.tap('tops-move-delete');await a.tap('tops-move-delete-confirm');assert.equal(await a.raw(),valid);assert.match(await a.text('tops-move-storage-status'),/could not be confirmed/i);assert.equal(await a.value('tops-move-savings'),'987.65');
  await a.ev('__fault=""');await a.tap('tops-move-recover');await a.load('/?tool=pathway&fault=getItem');await a.open();await a.input('tops-move-cash','123.45');await a.tap('tops-move-save');assert.equal(await a.raw(),valid);assert.match(await a.text('tops-move-storage-status'),/could not be checked/i);assert.equal(await a.value('tops-move-cash'),'123.45');
  await a.ev('__fault=""');await a.tap('tops-move-recover');assert.equal(await a.value('tops-move-cash'),'5000.00');assert.equal(await a.value('tops-move-savings'),'987.65');assert.equal(await a.other(),unrelated);
  // Validation focuses the actual bad field, including one in the other option's closed helper.
  await a.tap('tops-move-option-1');await a.input('tops-move-cost-health','-1');await a.tap('tops-move-option-0');await a.tap('tops-move-save');await a.wait('document.activeElement.id==="tops-move-cost-health"');assert.equal(await a.value('tops-move-cost-health'),'-1');assert.equal(await a.raw(),valid);await a.input('tops-move-cost-health','');
  console.log('PASS Home delete and modified-draft retention; quota/read/delete failures with explicit recovery; invalid hidden-option save focus; unrelated keys unchanged');
  // Real second tab, shared storage: stale Save and stale Delete confirmation must fail closed.
  const port=fs.readFileSync(path.join(chrome.profile,'DevToolsActivePort'),'utf8').split(/\r?\n/)[0];
  const target=await (await fetch('http://127.0.0.1:'+port+'/json/new?about:blank',{method:'PUT'})).json();second=new h.CdpClient(target.webSocketDebuggerUrl);const b=await session(second);
  await a.load('/?tool=pathway');await a.open();await b.load('/?tool=pathway');await b.open();await a.input('tops-move-cash','11111.11');await b.input('tops-move-cash','22222.22');await b.tap('tops-move-save');const tabB=await b.raw();
  await a.tap('tops-move-save');assert.equal(await a.raw(),tabB);assert.equal(await a.value('tops-move-cash'),'11111.11');assert.match(await a.text('tops-move-storage-status'),/saved copy changed|another tab/i);await a.tap('tops-move-recover');assert.equal(await a.value('tops-move-cash'),'22222.22');
  await a.tap('tops-move-delete');await b.input('tops-move-cash','33333.33');await b.tap('tops-move-save');valid=await b.raw();await a.tap('tops-move-delete-confirm');assert.equal(await a.raw(),valid);assert.equal(await a.value('tops-move-cash'),'22222.22');assert.match(await a.text('tops-move-storage-status'),/saved copy changed|another tab/i);await a.tap('tops-move-recover');assert.equal(await a.value('tops-move-cash'),'33333.33');assert.equal(await a.other(),unrelated);
  console.log('PASS real two-tab stale Save and stale Delete confirmation, preserved drafts, explicit load of newer saved copy');
  // Strict actual reader rejects malformed, extra, mistyped and out-of-bound fields without writing.
  const malformed=['{',JSON.stringify({...JSON.parse(full),version:2}),JSON.stringify({...JSON.parse(full),selected:0})];
  for(const mutate of [v=>delete v.comparison.options[0].income,v=>v.comparison.options.push(v.comparison.options[0]),v=>v.comparison.cash=100,v=>v.comparison.options[0].includeService='true',v=>v.comparison.options[0].monthlySavings='1000000.01',v=>v.comparison.options[0].label='bad\u0000label',v=>v.comparison.options[0].costs.extra='1']){const v=JSON.parse(full);mutate(v);malformed.push(JSON.stringify(v));}
  malformed.push(' '.repeat(4097));
  for(const raw of malformed){const read=await a.ev(`(()=>{__nativeStorage.setItem.call(localStorage,'${KEY}',${JSON.stringify(raw)});const before=__storageOps.length;const r=topsReadMoveSaved();return {ready:r.ready,value:r.value,raw:r.raw,writes:__storageOps.slice(before).filter(x=>x[0]!=='getItem')};})()`);assert.equal(read.ready,true);assert.equal(read.value,null);assert.equal(read.raw,raw);assert.deepEqual(read.writes,[]);}
  await a.ev(`__nativeStorage.setItem.call(localStorage,'${KEY}','{')`);await a.load('/?tool=pathway');await a.open();await a.input('tops-move-cash','456.78');await a.tap('tops-move-save');assert.equal(await a.raw(),'{');assert.match(await a.text('tops-move-storage-status'),/cannot be read/i);assert.equal(await a.value('tops-move-cash'),'456.78');
  await a.tap('tops-move-delete');await a.tap('tops-move-delete-cancel');assert.equal(await a.raw(),'{');await a.tap('tops-move-delete');await a.tap('tops-move-delete-confirm');assert.equal(await a.raw(),null);assert.equal(await a.value('tops-move-cash'),'456.78');assert.equal(await a.other(),unrelated);
  // Embedding must not read, write or delete the comparison key, even when a saved copy exists.
  await a.ev(`__nativeStorage.setItem.call(localStorage,'${KEY}',${JSON.stringify(full)});const f=document.createElement('iframe');f.id='synthetic-frame';f.src='/?tool=pathway';document.body.appendChild(f);`);
  await a.wait('!!document.getElementById("synthetic-frame").contentDocument.getElementById("tops-career-move")');
  await a.ev('document.getElementById("synthetic-frame").contentDocument.getElementById("tops-career-move").click()');await a.wait('!!document.getElementById("synthetic-frame").contentDocument.getElementById("tops-move-save")');
  const embedded=await a.ev(`(()=>{const w=document.getElementById('synthetic-frame').contentWindow;const n=w.document.getElementById('tops-move-cash');Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype,'value').set.call(n,'654.32');n.dispatchEvent(new w.Event('input',{bubbles:true}));return new Promise(resolve=>w.requestAnimationFrame(()=>{w.document.getElementById('tops-move-save').click();w.requestAnimationFrame(()=>resolve({value:n.value,ops:w.__storageOps,status:w.document.getElementById('tops-move-storage-status').textContent}));}));})()`);
  assert.equal(embedded.value,'654.32');assert.deepEqual(embedded.ops,[]);assert.match(embedded.status,/embedded|unavailable/i);assert.equal(await a.raw(),full);await a.ev('document.getElementById("synthetic-frame").remove()');
  console.log('PASS strict versioned reader, corrupted-copy refusal and explicit deletion, embedded visit-only use with zero comparison-key reads/writes');
  await a.load('/');await a.tap('tops-home-move-resume');
  fs.mkdirSync(evidence,{recursive:true});
  const screenshot=async(id,name)=>{const clip=await a.ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});n.scrollIntoView({block:'start'});const r=n.getBoundingClientRect();return {x:0,y:r.top+scrollY,width:innerWidth,height:r.height+8,scale:1};})()`);await a.frames();const shot=await a.c.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip});fs.writeFileSync(path.join(evidence,name),Buffer.from(shot.data,'base64'));};
  for(const width of [320,375]){await a.c.send('Emulation.setDeviceMetricsOverride',{width,height:812,deviceScaleFactor:1,mobile:true});await a.frames();assert.ok(await a.ev('document.documentElement.scrollWidth<=innerWidth+1'));for(const id of ['tops-move-save','tops-move-delete'])assert.ok(await a.ev(`(()=>{const r=document.getElementById('${id}').getBoundingClientRect();return r.width>=44&&r.height>=44;})()`));}
  await a.ev('document.getElementById("tops-move-save-notice").closest("section").id="synthetic-save-controls"');await screenshot('synthetic-save-controls','375-save-controls.png');await a.nav('Home');await screenshot('tops-home-move','375-home-return.png');await homeOrder();const topShot=await a.c.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(evidence,'375-home-top.png'),Buffer.from(topShot.data,'base64'));
  for(const width of [320,375]){await a.c.send('Emulation.setDeviceMetricsOverride',{width,height:812,deviceScaleFactor:1,mobile:true});await a.frames();await homeOrder();assert.ok(await a.ev('document.documentElement.scrollWidth<=innerWidth+1'));for(const id of ['tops-home-move-resume','tops-home-move-delete'])assert.ok(await a.ev(`(()=>{const r=document.getElementById('${id}').getBoundingClientRect();return r.width>=44&&r.height>=44;})()`));}
  await a.nav('My Plan');await a.reveal('tops-backup-file');await a.ev('[...document.querySelectorAll("#tops-plan-backup button")].find(n=>n.textContent==="Download my plan").click()');await a.frames();const backup=await a.ev('__downloads.at(-1).text()');assert.equal(Object.keys(JSON.parse(backup).sections).length,9);assert.ok(!/move_comparison|monthlySavings|SYNTHETIC_MOVE_SAVE|750\.15|3500\.25/.test(backup));
  await a.nav('Career');await a.tap('tops-career-find-jobs');await a.input('tops-job-role','Data Analyst');await a.input('tops-job-area','54211');await a.reveal('tops-talent-email');assert.deepEqual(await a.ev('["email","roles","location","note"].map(k=>document.getElementById("tops-talent-"+k).value)'),['','','','']);assert.equal(await a.other(),unrelated);assert.equal(await a.raw(),full);
  await a.load('/?tool=navigator');await a.ev(`(()=>{const n=document.querySelector('[aria-label="Ask the Transition Navigator"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(n,'SYNTHETIC neutral next-step question');n.dispatchEvent(new Event('input',{bubbles:true}));})()`);await a.frames();await a.ev(`document.querySelector('[aria-label="Send Navigator question"]').click()`);await a.wait('document.body.textContent.includes("SYNTHETIC privacy check response")');
  assert.equal(requests.filter(r=>r.method==='POST').length,1,'only the explicit synthetic Navigator request is made');assert.ok(!requests.some(r=>/tops_move_comparison|monthlySavings|SYNTHETIC_MOVE_SAVE|750\.15|3500\.25|987\.65|11111\.11|22222\.22|33333\.33/.test(r.url+r.body)));assert.equal(await a.raw(),full);assert.deepEqual(errors,[]);
  console.log('MOVE SAVE PASS: explicit strict raw save; fresh Home return and focus; unsaved/dirty/clear behavior; exact-key deletion; real cross-tab conflicts; blocked/quota/corrupt/iframe recovery; actual backup and synthetic Navigator exclusion; blank contact fields; no URL leakage; 320/375 controls and reflow.');
}finally{if(second)second.close();if(chrome){await h.stopChrome(chrome);chrome.child.stderr?.destroy();}await new Promise(resolve=>server.close(resolve));}})().catch(error=>{console.error(error.stack);process.exitCode=1;});
