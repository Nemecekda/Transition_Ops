'use strict';
// Synthetic Home "Your next move" card only. All nonlocal requests are blocked.
// Rule under test: every control on the card has one job and a label no other control on the card shares.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'scripts/privacy-network-regression.js'),'utf8');
const h=new Function('fs','path','os','spawn',source.slice(source.indexOf('function findChrome()'),source.indexOf('const PROBE_SCRIPT ='))+'\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs,path,os,spawn);
const server=http.createServer((req,res)=>{const p=new URL(req.url,'http://localhost').pathname,f=path.join(root,p==='/'?'index.html':p);if(!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(f));});
const STARTS=[['Find work soon','Find a job to pursue','Search jobs by area'],['Explore a different career','Explore career options','Explore career options'],['Grow in my current career','Prepare a growth conversation','Prepare a growth conversation'],['Prepare to leave service','Review your transition checklist','Review my transition checklist']];
const OPTIONS=['Change priority',"I'm stuck on this step",'Add a target role or goal','Draft a question for Navigator'];
const JOBS=['Search jobs by area','Find roles from my experience'];
const firstWords=labels=>labels.map(label=>label.split(' ')[0].toLowerCase());
(async()=>{let chrome;const errors=[],requests=[];try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 chrome=await h.launchChrome(h.findChrome(),12);const c=chrome.client;await c.send('Page.enable');await c.send('Runtime.enable');
 c.on('Runtime.exceptionThrown',e=>errors.push(e.exceptionDetails.text));await c.send('Fetch.enable',{patterns:[{urlPattern:'*'}]});
 c.on('Fetch.requestPaused',async e=>{requests.push(e.request.url);const local=e.request.url.startsWith(origin)&&!e.request.url.includes('/.netlify/');try{await c.send(local?'Fetch.continueRequest':'Fetch.failRequest',local?{requestId:e.requestId}:{requestId:e.requestId,errorReason:'BlockedByClient'});}catch{}});
 const ev=x=>h.evaluate(c,x,true),wait=(x,label)=>h.waitForExpression(c,x,label||x,9000);
 const card=()=>ev('(()=>{const s=document.getElementById("tops-loop-title").closest("section"),t=n=>n.textContent.trim();return{heading:t(s.querySelector(".tops-next-move-heading")),actions:Array.from(s.querySelectorAll(".tops-next-move-actions button,.tops-next-move-actions a")).map(t),options:Array.from(s.querySelectorAll(".tops-loop-utilities>details>summary")).map(t),all:Array.from(s.querySelectorAll("summary")).map(t),status:t(s.querySelector(".tops-loop-meta"))}})()');
 const home=async()=>{await c.send('Page.navigate',{url:origin+'/'});await wait('!!document.getElementById("tops-loop-title")','Home card');};
 const start=async title=>{await ev('document.getElementById("tops-priority-choices").open=true;Array.from(document.querySelectorAll("#tops-member-starts button")).find(n=>n.getAttribute("aria-label")==='+JSON.stringify(title)+').click()');};
 const press=async text=>{await ev('(()=>{const n=Array.from(document.getElementById("tops-loop-title").closest("section").querySelectorAll("button")).filter(n=>n.textContent.trim()==='+JSON.stringify(text)+');if(n.length!==1)throw Error("expected one control named "+'+JSON.stringify(text)+'+", found "+n.length);n[0].click()})()');};
 const visible=id=>ev('(()=>{const n=document.getElementById('+JSON.stringify(id)+');return !!n&&n.getClientRects().length>0})()');

 // A member with nothing saved and no priority: the priority choices are open, and the two other options name different jobs.
 await c.send('Page.navigate',{url:origin+'/'});await wait('!!window.__safeSet','loaded');await ev('localStorage.clear();sessionStorage.clear();localStorage.setItem("tops_onboarded","1")');await home();
 let state=await card();
 assert.equal(state.heading,'What matters most right now?');assert.deepEqual(state.actions,[]);
 assert.deepEqual(state.all,['Choose a priority (optional)','Add a target role or goal','Draft a question for Navigator']);
 assert.equal(await ev('!!document.getElementById("tops-home-jobs")'),false,'the job block stays out while the four starting points are open');
 assert.equal(await ev('document.querySelectorAll("#tops-member-starts button").length'),4);

 // After each starting point: two actions and four options, in a fixed order, and no two of the six begin with the same word.
 for(const [title,heading,action] of STARTS){
  await home();await start(title);await wait('document.querySelector(".tops-next-move-heading").textContent==='+JSON.stringify(heading),'card for '+title);
  state=await card();
  assert.deepEqual(state.actions,[action,'Choose this next step'],title+': one button opens the tool and one makes the move my step');
  assert.deepEqual(state.options,OPTIONS,title+': the two working-on options lead and the two help options follow each');
  const six=state.actions.concat(state.options);
  assert.equal(new Set(six).size,6,title+': six different labels');
  assert.equal(new Set(firstWords(six)).size,6,title+': six different first words: '+firstWords(six).join(', '));
  assert.ok(state.status.startsWith('Priority updated for this visit.'),title+': the status line is unchanged');
  const jobs=await ev('(()=>{const s=document.getElementById("tops-home-jobs");return s?{heading:s.querySelector("h2").textContent,buttons:Array.from(s.querySelectorAll("button")).map(n=>n.textContent.trim()),after:!!(document.getElementById("tops-loop-title").closest("section").compareDocumentPosition(s)&Node.DOCUMENT_POSITION_FOLLOWING),tall:Array.from(s.querySelectorAll("button")).every(n=>n.getBoundingClientRect().height>=44)}:null})()');
  if(title==='Find work soon'||title==='Explore a different career')assert.equal(jobs,null,title+': the card already leads with this choice, so the block is not repeated');
  else{assert.deepEqual(jobs,{heading:'Find a job or a new role',buttons:JOBS,after:true,tall:true},title+': the job block follows the card');assert.equal(six.some(label=>JOBS.includes(label)),false,title+': the block repeats no label from the card');const page=await ev('Array.from(document.querySelectorAll("main button,main summary,#root button,#root summary")).filter(n=>n.getClientRects().length>0).map(n=>n.textContent.trim())');for(const label of JOBS)assert.equal(page.filter(text=>text===label).length,1,title+': one control on Home named '+label);}
 }
 assert.equal(await ev('localStorage.getItem("tops_personal_guide_v1")'),null);assert.equal(await ev('localStorage.getItem("tops_career_action_v1")'),null);

 // Each option still opens its own control, and an open option takes the full width of the card.
 for(const [id,inner] of [['tops-priority-choices','tops-member-starts'],['tops-loop-checkin','tops-loop-blocker'],['tops-loop-direction','tops-loop-path'],['tops-loop-help',null]]){
  assert.equal(await ev('document.getElementById('+JSON.stringify(id)+').open'),false,id+' starts closed');
  await ev('document.querySelector("#'+id+'>summary").click()');
  assert.equal(await ev('document.getElementById('+JSON.stringify(id)+').open'),true);
  if(inner)assert.equal(await visible(inner),true,inner+' shows');else assert.equal(await ev('Array.from(document.querySelectorAll("#tops-loop-help button")).some(n=>n.textContent==="Open draft in Navigator"&&n.getClientRects().length>0)'),true);
  assert.equal(await ev('(()=>{const d=document.getElementById('+JSON.stringify(id)+').getBoundingClientRect(),u=document.querySelector(".tops-loop-utilities").getBoundingClientRect();return d.width>u.width*0.8})()'),true,id+' spans the card when open');
  await ev('document.querySelector("#'+id+'>summary").click()');
 }

 // The check-in's own button is named for what it does, so the card never shows two buttons with one label.
 await ev('document.querySelector("#tops-loop-checkin>summary").click()');
 await ev('(()=>{const s=document.getElementById("tops-loop-blocker");Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value").set.call(s,"time");s.dispatchEvent(new Event("change",{bubbles:true}));})()');
 await wait('!!document.querySelector(\'[aria-label="Alternative next step"]\')','alternative');
 const alternative=await ev('Array.from(document.querySelectorAll(\'[aria-label="Alternative next step"] button\')).map(n=>n.textContent.trim())');
 assert.equal(alternative[alternative.length-1],'Use this step instead');
 const shown=await ev('Array.from(document.getElementById("tops-loop-title").closest("section").querySelectorAll("button,summary")).filter(n=>n.getClientRects().length>0).map(n=>n.textContent.trim())');
 assert.equal(shown.filter(label=>label==='Choose this next step').length,1);assert.equal(shown.filter(label=>label==='Use this step instead').length,1);
 assert.equal(shown.some(label=>label==='Review this as my next step'),false);

 // "Choose this next step" opens the editor with the suggested step and saves nothing by itself.
 await press('Choose this next step');await wait('document.activeElement.id==="tops-action-heading"','step editor focus');
 assert.equal(await ev('document.getElementById("tops-action-text").value'),'Review my transition checklist and choose one item to work on');
 assert.equal(await ev('localStorage.getItem("tops_career_action_v1")'),null);assert.equal(await ev('localStorage.getItem("tops_personal_guide_v1")'),null);

 // The direction editor starts from the starting point the member just chose. Using it for the visit saves nothing.
 for(const [title,pathway] of [['Find work soon','change'],['Grow in my current career','skills'],['Prepare to leave service','transition']]){
  await ev('localStorage.clear();localStorage.setItem("tops_onboarded","1")');await home();await start(title);await wait('document.querySelector(".tops-loop-utilities>#tops-loop-direction")!==null','options for '+title);
  await ev('document.querySelector("#tops-loop-direction>summary").click()');
  assert.equal(await ev('document.getElementById("tops-loop-path").value'),pathway,title+': the focus is already set');
 }
 await ev('(()=>{const n=document.getElementById("tops-loop-target");Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set.call(n,"SYNTHETIC role");n.dispatchEvent(new Event("input",{bubbles:true}));})()');
 await press('Use for this visit');await wait('document.querySelector(".tops-loop-meta").textContent==="Direction updated for this page; not saved."','direction used for the visit');
 assert.equal(await ev('localStorage.getItem("tops_personal_guide_v1")'),null);
 assert.ok((await ev('document.getElementById("tops-loop-title").closest("section").textContent')).includes('Your direction: Prepare to leave service - SYNTHETIC role'));
 assert.ok((await card()).all.includes('Review or change my direction'));
 // With no starting point and nothing saved, the editor still asks for a direction before it will apply one.
 await ev('localStorage.clear();localStorage.setItem("tops_onboarded","1")');await home();await ev('document.querySelector("#tops-loop-direction>summary").click()');
 assert.equal(await ev('document.getElementById("tops-loop-path").value'),'');await press('Use for this visit');
 await wait('document.querySelector(".tops-loop-meta").textContent==="Choose a direction first."','direction still required');

 // A member with a saved direction keeps the label that names it.
 await ev('localStorage.setItem("tops_personal_guide_v1",JSON.stringify({version:1,pathway:"transition",currentRole:"",targetRole:"",goal:""}))');await home();
 state=await card();
 assert.ok(state.all.includes('Review or change my direction'),JSON.stringify(state.all));assert.equal(state.all.includes('Add a target role or goal'),false);
 assert.equal(new Set(state.all.concat(state.actions)).size,state.all.length+state.actions.length,'no repeated label with a saved direction');

 // Phone widths: every option row is a full touch target and nothing overflows.
 await ev('localStorage.removeItem("tops_personal_guide_v1")');
 for(const width of [320,393]){
  await c.send('Emulation.setDeviceMetricsOverride',{width,height:852,deviceScaleFactor:1,mobile:true});await home();await start('Prepare to leave service');await wait('document.querySelector(".tops-next-move-heading").textContent==="Review your transition checklist"','card at '+width);
  assert.equal(await ev('document.documentElement.scrollWidth<=window.innerWidth'),true,'no overflow at '+width);
  assert.equal(await ev('Array.from(document.querySelectorAll(".tops-loop-utilities>details>summary")).every(n=>n.getBoundingClientRect().height>=44)'),true,'44px rows at '+width);
  assert.deepEqual((await card()).options,OPTIONS);
  assert.equal(await ev('Array.from(document.querySelectorAll("#tops-home-jobs button")).length===2&&Array.from(document.querySelectorAll("#tops-home-jobs button")).every(n=>n.getBoundingClientRect().height>=44)'),true,'two job tiles of 44px or more at '+width);
 }
 // Every scenario above ran without one request to a server function.
 assert.equal(requests.some(url=>url.includes('/.netlify/')),false);

 // The job block's two buttons use the card's own routes, and Home returns focus to the button the member used.
 const nav=async label=>{await ev('Array.from(document.querySelectorAll(".bottom-nav button")).find(n=>n.querySelector(".nav-label").textContent==='+JSON.stringify(label)+').click()');};
 await home();await start('Prepare to leave service');await wait('!!document.getElementById("tops-home-jobs-jobs")','job block');
 await ev('document.getElementById("tops-home-jobs-jobs").click()');await wait('new URL(location.href).searchParams.get("tool")==="pathway"&&!!document.getElementById("tops-live-jobs-panel")','job search opens');
 await nav('Home');await wait('document.activeElement.id==="tops-home-jobs-jobs"','focus returns to Search jobs by area');
 await ev('document.getElementById("tops-home-jobs-career-explore").click()');await wait('new URL(location.href).searchParams.get("tool")==="pathway"&&!!document.getElementById("tops-career-start-heading")','career options open');
 await nav('Home');await wait('document.activeElement.id==="tops-home-jobs-career-explore"','focus returns to Find roles from my experience');
 assert.equal(await ev('localStorage.getItem("tops_personal_guide_v1")'),null);assert.equal(await ev('localStorage.getItem("tops_career_action_v1")'),null);
 // Opening job search asks the federal jobs function whether it is set up (config=1, no member content). Nothing else may reach a function.
 assert.deepEqual(errors,[]);assert.deepEqual(requests.filter(url=>url.includes('/.netlify/')&&!/\/\.netlify\/functions\/federal-jobs\?config=1$/.test(url)),[]);
 console.log('NEXT MOVE OPTIONS PASS: four starting points; two actions and four options with six different labels and first words; each option opens its own control; one label per button with the check-in open; choosing a step saves nothing; saved-direction label kept; the direction editor starts from the starting point; the Home job block shows only where the card does not lead with jobs, opens both routes and takes focus back; 320 and 393 px; zero function requests before job search, and only the content-free federal jobs configuration check after it.');
}catch(e){if(chrome){try{console.error(await h.evaluate(chrome.client,'({url:location.href,text:document.body.innerText.slice(0,900)})',true));}catch{}}throw e;}finally{if(chrome){await h.stopChrome(chrome);chrome.child.stderr?.destroy();}await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e.stack);process.exitCode=1;});
