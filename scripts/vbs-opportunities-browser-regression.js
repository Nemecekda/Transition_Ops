'use strict';
// Synthetic fixtures only. External navigation and provider requests are blocked.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),vm=require('node:vm'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),app=fs.readFileSync(path.join(root,'index.html'),'utf8'),utility=fs.readFileSync(path.join(__dirname,'privacy-network-regression.js'),'utf8');
const h=new Function('fs','path','os','spawn',utility.slice(utility.indexOf('function findChrome()'),utility.indexOf('const PROBE_SCRIPT ='))+'\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs,path,os,spawn);
const URL_ROLES='https://www.veteranbridgesolutions.com/opportunities';
const pure={};vm.createContext(pure);vm.runInContext(app.slice(app.indexOf('const TOPS_VBS_ROLE_REVIEW_DAYS'),app.indexOf('function VbsEmployerRoles'))+app.slice(app.indexOf('const TOPS_TALENT_EMAIL'),app.indexOf('function CareerTalentContact'))+';this.rows=JSON.parse(JSON.stringify(TOPS_VBS_EMPLOYER_ROLES));this.status=topsVbsRoleStatus;this.message=topsTalentMessage;',pure);
assert.equal(pure.rows.length,7);assert.equal(new Set(pure.rows.map(x=>x.id)).size,7);
const now=Date.UTC(2026,10,27),john=pure.rows[0],fields={name:'',email:'synthetic@example.invalid',roles:'SYNTHETIC',location:'',availability:'',note:'Confirm details, please.'};
assert.equal(pure.status(john,now),'Listed on VBS');assert.equal(pure.status(john,Date.UTC(2026,11,25)),'Listed on VBS');
for(const t of [Date.UTC(2026,11,26),Date.UTC(2026,10,24),NaN])assert.equal(pure.status(john,t),'Check current availability on VBS');
for(const updated of ['bad','2026-02-31','2026-13-01'])assert.equal(pure.status({...john,updated},now),'Check current availability on VBS');
assert.equal(pure.message('interest',fields,false),null);assert.ok(pure.message('interest',fields,true));assert.match(pure.message('question',fields,false).body,/one-time inquiry/);assert.equal(pure.message('question',{...fields,email:'bad\r\nbcc:x@example.invalid'},false),null);
assert.ok(pure.rows.filter(x=>x.employer==='Johnsonville').every(x=>x.location==='Sheboygan, Wisconsin'));
assert.deepEqual(Array.from(pure.rows.filter(x=>x.employer==='Johnsonville'),x=>x.schedule),['2nd shift, Monday-Friday','2nd shift, Monday-Friday','3rd shift, Monday-Friday']);
assert.deepEqual(Array.from(pure.rows.filter(x=>x.employer==='Kriete Truck Centers'),x=>[x.title,x.location]),[['Heavy Duty Diesel Technician','Location to confirm'],['Parts Counterperson','Location to confirm']]);
assert.deepEqual(Array.from(pure.rows.filter(x=>x.employer==='Air Tech Heating, Inc.'),x=>[x.title,x.location]),[['Residential New Construction Installer','Fond du Lac, Wisconsin'],['Commercial Installer','Fond du Lac, Wisconsin']]);
const component=app.slice(app.indexOf('const TOPS_VBS_ROLE_REVIEW_DAYS'),app.indexOf('const TOPS_TALENT_EMAIL'));
assert.doesNotMatch(component,/\$\d|12-week|SkillBridge Fellow|guaranteed|sharepoint|docs\.google|preview_token|inquiryId|localStorage|sessionStorage|fetch\(|CareerTalentContact|\bApply now\b|\bApproved employer\b/i);
assert.match(component,/These are employment roles\. SkillBridge pathways are in development; no fellowship openings are listed here\./);
assert.equal((app.match(/React\.createElement\(VbsEmployerRoles,/g)||[]).length,3);
assert.doesNotMatch(app,/topsVbsInquiry|VbsSkillbridgeInquiries|TOPS_VBS_SKILLBRIDGE_PATHS/);
console.log('PASS seven exact employment roles, date boundaries and stale/future/invalid fallback; no fellowship, pay, private URL or added contact-form claims');
const errors=[],posts=[],searches=[],external=[];
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost'),file=path.join(root,url.pathname==='/'?'index.html':url.pathname);if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.html')?'text/html':'application/octet-stream');let body=fs.readFileSync(file);if(file.endsWith('index.html'))body=body.toString().replace('  const stateHelpReturn = useRef(', '  window.__vbsProtected={jobs:jobsQ,setJobs:setJobsQ,resume:aiR,setResume:setAiR,move:moveComparison,guide:guideState.draft,action:actionState.draft};\n  const stateHelpReturn = useRef(');res.end(body);});
(async()=>{let chrome;try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;chrome=await h.launchChrome(h.findChrome(),12);const c=chrome.client,ev=s=>h.evaluate(c,s,true),wait=s=>h.waitForExpression(c,s,s,12000),frames=()=>ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
 await c.send('Page.enable');await c.send('Runtime.enable');c.on('Runtime.exceptionThrown',e=>errors.push(e.exceptionDetails.text));await c.send('Fetch.enable',{patterns:[{urlPattern:'*'}]});
 c.on('Fetch.requestPaused',async e=>{if(e.request.method==='POST')posts.push(e.request.url);if(e.request.url.includes('/.netlify/functions/federal-jobs')&&!e.request.url.includes('config=1'))searches.push(e.request.url);const local=e.request.url.startsWith(origin)&&!e.request.url.includes('/.netlify/');if(!e.request.url.startsWith(origin))external.push(e.request.url);try{await c.send(local?'Fetch.continueRequest':'Fetch.failRequest',local?{requestId:e.requestId}:{requestId:e.requestId,errorReason:'BlockedByClient'});}catch{}});
 const load=async route=>{await ev('window.__vbsLoading=1');await c.send('Page.navigate',{url:origin+route});await wait('window.__vbsLoading!==1&&(!!document.getElementById("tops-main-content")||!!document.getElementById("tops-first-visit"))');await frames();await ev(`window.vbsClicks=[];document.addEventListener('click',e=>{const a=e.target.closest('a');if(a&&(a.href.startsWith('mailto:')||a.href.startsWith('https:'))){e.preventDefault();window.vbsClicks.push(a.href)}},true)`);};
 const click=async id=>{await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});if(!n?.checkVisibility())throw Error('Hidden '+${JSON.stringify(id)});n.click()})()`);await frames();};
 const type=async(id,value)=>{await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(n,${JSON.stringify(value)});n.dispatchEvent(new Event('input',{bubbles:true}));})()`);await frames();};
 const disk=()=>ev('JSON.stringify(Object.entries(localStorage).sort())'),protectedState=()=>ev('JSON.stringify([window.__vbsProtected.jobs.keyword,window.__vbsProtected.jobs.state,window.__vbsProtected.resume.exp,window.__vbsProtected.resume.target,window.__vbsProtected.move,window.__vbsProtected.guide,window.__vbsProtected.action])');
 const checkLinks=async surface=>{
   const base='tops-vbs-roles-'+surface;
   await wait(`!!document.getElementById('${base}')`);
   await ev(`document.querySelectorAll('#${base} [data-vbs-employer]').forEach(n=>n.open=true)`);await frames();
   assert.equal(await ev(`document.querySelectorAll('#${base} [data-vbs-role]').length`),7);
   const actual=await ev(`Array.from(document.querySelectorAll('#${base} article a')).map(n=>({href:n.href,target:n.target,rel:n.rel,referrer:n.referrerPolicy,name:n.textContent,description:document.getElementById(n.getAttribute('aria-describedby'))?.textContent,height:n.getBoundingClientRect().height,width:n.getBoundingClientRect().width}))`);
   assert.equal(actual.length,7);actual.forEach((n,i)=>{assert.equal(n.href,URL_ROLES);assert.equal(new URL(n.href).search,'');assert.equal(new URL(n.href).hash,'');assert.equal(n.target,'_blank');assert.equal(n.rel,'noopener noreferrer');assert.equal(n.referrer,'no-referrer');assert.equal(n.name,'Find this role on VBS (new tab)');assert.equal(n.description,pure.rows[i].title);assert.ok(n.height>=44&&n.width>=44);});
   assert.equal(await ev(`document.querySelector('#${base}').textContent.includes('no fellowship openings are listed here')`),true);
   assert.equal(await ev('document.documentElement.scrollWidth<=innerWidth+1'),true);
   const ids=await ev('Array.from(document.querySelectorAll("[id]")).map(n=>n.id)');assert.equal(new Set(ids).size,ids.length);
   for(const row of pure.rows)await click(base+'-view-'+row.id);
   assert.deepEqual(await ev('vbsClicks'),Array(7).fill(URL_ROLES));
   // Native Enter activates a real link; this fixture prevents only leaving the app.
   const target=base+'-view-johnsonville-electromechanical-3';await ev(`document.getElementById('${target}').focus()`);await c.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await c.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await frames();assert.equal(await ev('vbsClicks.length'),8);assert.equal(await ev('document.activeElement.id'),target);
   await ev('window.vbsClicks=[]');
 };
 const route='/?tool=resources&view=state-help&area=wi&situation=browse&need=work';
 for(const width of [320,375])for(const theme of ['professional','tactical']){
   await c.send('Emulation.setDeviceMetricsOverride',{width,height:812,deviceScaleFactor:1,mobile:true});await load(route);await ev(`localStorage.clear();localStorage.setItem('tops_onboarded','1');localStorage.setItem('tops_theme',${JSON.stringify(theme)})`);await load(route);
   await ev(`window.__vbsProtected.setJobs(p=>Object.assign({},p,{keyword:'SYNTHETIC Data Analyst',state:'53202'}));window.__vbsProtected.setResume(p=>Object.assign({},p,{exp:'SYNTHETIC occupied resume',target:'Keep this target'}))`);await frames();const before=await disk(),savedWork=await protectedState();
   await ev('document.getElementById("tops-talent-contact").open=true;document.getElementById("tops-talent-email-section").open=true');await type('tops-talent-email','generic@example.invalid');await type('tops-talent-roles','SYNTHETIC existing recruiting interest');await click('tops-talent-permission');await click('tops-talent-prepare');const generic=await ev('document.getElementById("tops-talent-message").value');
   await checkLinks('wisconsin');assert.equal(await ev('document.getElementById("tops-talent-message").value'),generic);
   assert.equal(await ev('document.getElementById("tops-talent-open-roles").href'),URL_ROLES);
   assert.equal(await ev('document.getElementById("tops-talent-network").href'),'https://apply.veteranbridgesolutions.com/apply');
   const cohort=await ev('Array.from(document.querySelectorAll("#tops-wisconsin-cohort > div > h4")).map(n=>n.textContent)');assert.equal(cohort.length,5);assert.ok(cohort.includes('Wisconsin Management Company')&&cohort.includes('Therma-Tron-X, Inc. (TTX)'));
   assert.equal(await disk(),before);assert.equal(await protectedState(),savedWork);
   if(process.env.TOPS_VBS_EVIDENCE){await ev('document.getElementById("tops-vbs-roles-wisconsin").scrollIntoView({block:"start"})');await frames();fs.writeFileSync(path.join(process.env.TOPS_VBS_EVIDENCE,`roles-${width}-${theme}.png`),Buffer.from((await c.send('Page.captureScreenshot',{format:'png'})).data,'base64'));}
   console.log(`PASS ${width} ${theme}: all seven exact links, native keyboard activation, 44px targets, no overflow, reviewed generic draft and saved work unchanged`);
 }
 await load('/?tool=pathway&view=jobs&role=Data+Analyst&location=53202');await checkLinks('search');
 await load('/?tool=pathway&view=jobs&role=Data+Analyst&location=55401');assert.equal(await ev('!!document.getElementById("tops-vbs-roles-search")'),false);
 await load('/?tool=resources');await ev(`(()=>{const n=document.getElementById('tops-resource-topic');Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(n,'skillbridge');n.dispatchEvent(new Event('change',{bubbles:true}));})()`);await checkLinks('skillbridge');
 assert.deepEqual(errors,[]);assert.deepEqual(posts,[]);assert.deepEqual(searches,[]);assert.equal(external.some(u=>/openai|anthropic|onesignal|veteranbridgesolutions/.test(u)),false);
 console.log('VBS OPPORTUNITIES PASS: all three surfaces; no automatic external request, submission, saved-data write or provider call. Local synthetic evidence only.');
 }finally{if(chrome)await h.stopChrome(chrome);await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e.stack);process.exitCode=1});
