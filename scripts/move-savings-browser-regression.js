'use strict';
// Synthetic savings estimates only; all provider/contact traffic is blocked.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),vm=require('node:vm'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),index=fs.readFileSync(path.join(root,'index.html'),'utf8'),utility=fs.readFileSync(path.join(__dirname,'privacy-network-regression.js'),'utf8');
const h=new Function('fs','path','os','spawn',utility.slice(utility.indexOf('function findChrome()'),utility.indexOf('const PROBE_SCRIPT ='))+'\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs,path,os,spawn);
const pure={};vm.createContext(pure);vm.runInContext(index.slice(index.indexOf('function topsMoveCents'),index.indexOf('function CareerMoveComparison')),pure);
const option={income:'3500.25',expenses:'3000.10',moving:'1000',service:'300.05',includeService:false,monthlySavings:'750.15'};
let r=pure.topsMoveResult(option,'5000');
// The baseline negative control checks the new arithmetic, before any new UI selectors.
assert.equal(r.monthlyTarget,375025,'monthly target includes the optional savings amount exactly');
assert.equal(r.savingsTarget,75015);assert.equal(r.targetBalance,-25000);assert.equal(r.whatIfTargetBalance,null);
assert.equal(r.balance,50015);assert.equal(r.cash,400000);assert.equal(r.runway,null);
r=pure.topsMoveResult({...option,includeService:true},'5000');assert.equal(r.whatIfTargetBalance,5005);assert.equal(r.targetBalance,-25000);assert.equal(r.whatIf,80020);
const oldKeys=['balance','cash','runway','whatIf','whatIfRunway'];
const oldResults=value=>oldKeys.map(key=>value[key]);
const expenseGap={income:'3000.10',expenses:'3500.11',moving:'1000',service:'600',includeService:true};
const expenseOnly=pure.topsMoveResult(expenseGap,'5000');
assert.deepEqual(oldResults(expenseOnly),[-50001,400000,7.9,9999,null]);
for(const monthlySavings of ['', '0', '100.23', '1000000'])assert.deepEqual(oldResults(pure.topsMoveResult({...expenseGap,monthlySavings},'5000')),oldResults(expenseOnly),'savings does not alter cash, expense balances or either expense-gap runway');
for(const monthlySavings of [undefined,'',' ','-1','1e3','NaN','Infinity','1,000','0.001','1000000.01',NaN,null]){
  const invalid=pure.topsMoveResult({...option,monthlySavings,includeService:true},'5000');
  for(const key of ['savingsTarget','monthlyTarget','targetBalance','whatIfTargetBalance'])assert.equal(invalid[key],null,'unset/invalid savings withholds '+key);
  assert.deepEqual(oldResults(invalid),oldResults(pure.topsMoveResult({...option,monthlySavings:'',includeService:true},'5000')));
}
r=pure.topsMoveResult({...option,monthlySavings:'0'},'5000');assert.equal(r.savingsTarget,0);assert.equal(r.monthlyTarget,300010);assert.equal(r.targetBalance,50015);
r=pure.topsMoveResult({...option,income:'0.30',expenses:'0.10',monthlySavings:'0.20'},'5000');assert.equal(r.monthlyTarget,30);assert.equal(r.targetBalance,0);
r=pure.topsMoveResult({...option,income:'1000000',expenses:'1000000',monthlySavings:'1000000'},'5000');assert.equal(r.monthlyTarget,200000000);assert.equal(r.targetBalance,-100000000);
r=pure.topsMoveResult({...option,income:''},'5000');assert.equal(r.monthlyTarget,375025);assert.equal(r.targetBalance,null);
r=pure.topsMoveResult({...option,expenses:''},'5000');assert.equal(r.savingsTarget,75015);assert.equal(r.monthlyTarget,null);assert.equal(r.targetBalance,null);
r=pure.topsMoveResult({...option,service:'',includeService:true},'5000');assert.equal(r.whatIfTargetBalance,null);assert.equal(r.targetBalance,-25000);
const blank=pure.topsMoveBlank();assert.equal(blank.options[0].monthlySavings,'');assert.equal(blank.options[1].monthlySavings,'');blank.options[0].monthlySavings='123.45';assert.equal(blank.options[1].monthlySavings,'');
console.log('PASS actual savings helper: decimal math, expense-covered savings shortfall, blank/zero/invalid, two independent options, separate service what-if, individual bounds and unchanged cash/expense runway');
const requests=[];
const server=http.createServer((req,res)=>{
  if(req.url.startsWith('/.netlify/functions/federal-jobs')&&req.method==='GET'){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify({available:false,provider:'USAJOBS'}));}
  const pathname=new URL(req.url,'http://localhost').pathname,file=path.join(root,pathname==='/'?'index.html':pathname);
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(file));
});
(async()=>{let chrome;try{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port;
  chrome=await h.launchChrome(h.findChrome(),12);const c=chrome.client,ev=expression=>h.evaluate(c,expression,true),wait=expression=>h.waitForExpression(c,expression,expression,12000),errors=[];
  const frames=()=>ev('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
  await c.send('Page.enable');await c.send('Runtime.enable');c.on('Runtime.exceptionThrown',event=>errors.push(event.exceptionDetails.text));
  await c.send('Page.addScriptToEvaluateOnNewDocument',{source:`
    try{localStorage.setItem('tops_onboarded','1');localStorage.setItem('tops_user_status','guard');}catch{}
    window.__downloads=[];window.__externalClicks=[];
    URL.createObjectURL=blob=>{__downloads.push(blob);return 'blob:synthetic-plan';};URL.revokeObjectURL=()=>{};
    document.addEventListener('click',event=>{const link=event.target.closest('a');if(link&&(link.download||!link.href.startsWith(location.origin))){event.preventDefault();__externalClicks.push({href:link.href,download:link.download||''});}},true);
  `});
  await c.send('Fetch.enable',{patterns:[{urlPattern:'*'}]});c.on('Fetch.requestPaused',async event=>{
    requests.push({url:event.request.url,method:event.request.method,body:event.request.postData||''});
    const local=event.request.url.startsWith(origin)&&(!event.request.url.includes('/.netlify/')||event.request.method==='GET'&&event.request.url.includes('/.netlify/functions/federal-jobs'));
    try{await c.send(local?'Fetch.continueRequest':'Fetch.failRequest',local?{requestId:event.requestId}:{requestId:event.requestId,errorReason:'BlockedByClient'});}catch{}
  });
  const load=async url=>{await c.send('Page.navigate',{url});await wait('!!document.getElementById("tops-main-content")');await frames();};
  const reveal=async id=>{await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});if(!n)throw Error('Missing '+${JSON.stringify(id)});const parents=[];for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS'&&!p.open)parents.unshift(p);for(const p of parents)p.querySelector(':scope>summary').click();if(!n.checkVisibility())throw Error('Hidden '+${JSON.stringify(id)});})()`);await frames();};
  const tap=async id=>{await reveal(id);await ev(`document.getElementById(${JSON.stringify(id)}).click()`);await frames();};
  const input=async(id,value)=>{await reveal(id);await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(n,${JSON.stringify(value)});n.dispatchEvent(new Event('input',{bubbles:true}));})()`);await frames();};
  const nav=async text=>{await ev(`[...document.querySelectorAll('[aria-label=Primary] button')].find(n=>n.textContent===${JSON.stringify(text)}).click()`);await frames();};
  const storage=()=>ev('JSON.stringify([localStorage,sessionStorage].map(store=>Object.keys(store).sort().map(key=>[key,store.getItem(key)])))');
  const text=id=>ev(`document.getElementById(${JSON.stringify(id)})?.textContent||''`);
  await c.send('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:true});
  await load(origin+'/?tool=pathway');
  await ev("(()=>{localStorage.clear();localStorage.setItem('tops_onboarded','1');localStorage.setItem('tops_user_status','guard');const guide=topsEmptyGuide();guide.currentRole='SYNTHETIC_PRIVATE_EXPERIENCE';const gap=topsEmptyGap();gap.rows[0].have='SYNTHETIC_PRIVATE_NOTE';localStorage.setItem('tops_personal_guide_v1',JSON.stringify(guide));localStorage.setItem('tops_career_gap_v1',JSON.stringify(gap));})()");
  await load(origin+'/?tool=pathway');await tap('tops-career-move');await wait('document.activeElement.id==="tops-move-heading"');
  const before=await storage();await ev('window.__writes=[];for(const method of ["setItem","removeItem","clear"]){const original=Storage.prototype[method];Storage.prototype[method]=function(...args){__writes.push([method,...args]);return original.apply(this,args);};}');
  assert.equal(await ev('document.getElementById("tops-move-savings").value'),'');
  assert.match(await ev('document.querySelector("label[for=tops-move-savings]").textContent'),/optional/i);
  assert.match(await text('tops-move-savings-hint'),/401\(k\)|TSP/);
  assert.ok(!/\$0\.00/.test(await text('tops-move-target-0')),'unset savings does not assert a zero goal');
  for(const [key,value] of Object.entries({cash:'5000',label:'SYNTHETIC-SAVINGS A',income:'3500.25',expenses:'3000.10',moving:'1000',savings:'750.15'}))await input('tops-move-'+key,value);
  assert.match(await text('tops-move-needed-0'),/\$3,000\.10/);assert.match(await text('tops-move-target-0'),/\$3,750\.25/);
  assert.match(await text('tops-move-target-balance-0'),/Covers entered expenses/);assert.match(await text('tops-move-target-balance-0'),/\$250\.00 short of your savings goal/);
  assert.match(await text('tops-move-results'),/\$4,000\.00 cash left after moving/);assert.ok(!(await text('tops-move-results')).includes('months of this monthly gap'));
  await input('tops-move-service','300.05');assert.equal(await text('tops-move-service-target-0'),'');await tap('tops-move-include-service');
  assert.match(await text('tops-move-service-target-0'),/\$50\.05/);assert.match(await text('tops-move-target-balance-0'),/\$250\.00 short/);
  await tap('tops-move-option-1');assert.equal(await ev('document.getElementById("tops-move-savings").value'),'');
  for(const [key,value] of Object.entries({label:'SYNTHETIC-SAVINGS B',income:'4000',expenses:'3000',moving:'6000',savings:'0'}))await input('tops-move-'+key,value);
  assert.match(await text('tops-move-target-1'),/\$3,000\.00/);assert.match(await text('tops-move-target-balance-1'),/\$1,000\.00/);
  for(const bad of ['-1','1e3','0.001','1000000.01']){
    await input('tops-move-savings',bad);assert.equal(await ev('document.getElementById("tops-move-savings").getAttribute("aria-invalid")'),'true');
    assert.equal(await ev('document.getElementById("tops-move-savings-error").checkVisibility()'),true);
    assert.ok(!/\$[\d,]+\.\d{2}/.test(await text('tops-move-target-1')),'invalid savings withholds the combined target');
    assert.ok(!/\$[\d,]+\.\d{2}/.test(await text('tops-move-target-balance-1')),'invalid savings withholds the target balance');
    assert.match(await text('tops-move-needed-1'),/\$3,000\.00/);
  }
  await input('tops-move-savings','');assert.ok(!/\$[\d,]+\.\d{2}/.test(await text('tops-move-target-1')));
  await input('tops-move-savings','432.19');assert.match(await text('tops-move-target-1'),/\$3,432\.19/);
  await tap('tops-move-option-0');assert.equal(await ev('document.getElementById("tops-move-savings").value'),'750.15');
  await nav('Home');await nav('Career');await reveal('tops-move-savings');assert.equal(await ev('document.getElementById("tops-move-savings").value'),'750.15');
  await tap('tops-move-option-1');assert.equal(await ev('document.getElementById("tops-move-savings").value'),'432.19');
  // Actual backup bytes omit the entire visit-only comparison, including both savings goals.
  await nav('My Plan');await reveal('tops-backup-file');
  await ev('[...document.querySelectorAll("#tops-plan-backup button")].find(n=>n.textContent==="Download my plan").click()');await frames();
  const backup=await ev('__downloads.at(-1).text()');assert.equal(Object.keys(JSON.parse(backup).sections).length,9);
  assert.ok(!/monthlySavings|SYNTHETIC-SAVINGS|750\.15|432\.19/.test(backup));assert.equal(await storage(),before);
  await nav('Career');await tap('tops-career-find-jobs');await input('tops-job-role','Data Analyst');await input('tops-job-area','54211');await reveal('tops-talent-email');
  assert.deepEqual(await ev('["email","roles","location","note"].map(key=>document.getElementById("tops-talent-"+key).value)'),['','','','']);
  await tap('tops-job-move');assert.equal(await ev('document.getElementById("tops-move-savings").value'),'432.19');
  for(const width of [320,375]){await c.send('Emulation.setDeviceMetricsOverride',{width,height:812,deviceScaleFactor:1,mobile:true});await frames();assert.ok(await ev('document.documentElement.scrollWidth<=innerWidth+1'));assert.ok(await ev('(()=>{const n=document.getElementById("tops-move-savings"),r=n.getBoundingClientRect();return n.labels.length>0&&r.height>=44&&r.width>=44;})()'));}
  assert.equal(await storage(),before);assert.deepEqual(await ev('__writes'),[]);
  // Capture the requested simple, synthetic example within this same browser run.
  await tap('tops-move-option-0');
  for(const [key,value] of Object.entries({label:'Option 1',income:'4000',expenses:'3500',moving:'2000',savings:'800'}))await input('tops-move-'+key,value);
  await tap('tops-move-include-service');
  assert.match(await text('tops-move-target-balance-0'),/Covers entered expenses\. \$300\.00 short of your savings goal/);
  assert.match(await ev('document.getElementById("tops-move-result-0").closest("section").textContent'),/\$3,000\.00 cash left after moving/);
  const clip=await ev('(()=>{const n=document.getElementById("tops-move-result-0").closest("section");n.scrollIntoView({block:"start"});const r=n.getBoundingClientRect();return {x:0,y:r.top+scrollY,width:innerWidth,height:r.height+8,scale:1};})()');await frames();
  const screenshot=await c.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip});
  const evidence=path.join(root,'intel/move-savings-20261102/focused');fs.mkdirSync(evidence,{recursive:true});fs.writeFileSync(path.join(evidence,'375-savings-result.png'),Buffer.from(screenshot.data,'base64'));
  await tap('tops-move-clear');await wait('document.activeElement.id==="tops-move-cash"');assert.equal(await ev('document.getElementById("tops-move-savings").value'),'');
  await tap('tops-move-option-1');assert.equal(await ev('document.getElementById("tops-move-savings").value'),'');assert.equal(await storage(),before);
  await input('tops-move-savings','876.54');await load(origin+'/?tool=pathway');await tap('tops-career-move');assert.equal(await ev('document.getElementById("tops-move-savings").value'),'');assert.equal(await storage(),before);
  assert.equal(requests.some(request=>request.method==='POST'),false);assert.equal(requests.some(request=>/SYNTHETIC-SAVINGS|750\.15|432\.19|876\.54/.test(request.url+request.body)),false);
  assert.equal(await ev('location.href.includes("SYNTHETIC-SAVINGS")'),false);assert.deepEqual(errors,[]);
  console.log('MOVE SAVINGS PASS: exact optional goal math, savings shortfall distinguished from expense deficit, separate Guard what-if, independent options, invalid withholding, unchanged cash/runway, navigation/clear/reload, actual backup/contact/storage/request exclusion and 320/375 reflow.');
}finally{if(chrome){await h.stopChrome(chrome);chrome.child.stderr?.destroy();}await new Promise(resolve=>server.close(resolve));}})().catch(error=>{console.error(error.stack);process.exitCode=1;});
