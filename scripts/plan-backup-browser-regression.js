"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),http=require("node:http"),os=require("node:os"),{spawn}=require("node:child_process");
const root=path.resolve(__dirname,".."),utility=fs.readFileSync(path.join(__dirname,"privacy-network-regression.js"),"utf8");
const h=new Function("fs","path","os","spawn",utility.slice(utility.indexOf("function findChrome()"),utility.indexOf("const PROBE_SCRIPT ="))+"\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};")(fs,path,os,spawn);
const server=http.createServer((req,res)=>{const route=req.url.split("?")[0],p=path.join(root,route==="/"?"index.html":route);if(!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);return res.end();}res.setHeader("Content-Type",p.endsWith(".js")?"text/javascript":p.endsWith(".html")?"text/html":"application/octet-stream");res.end(fs.readFileSync(p));});
(async()=>{let chrome;const requests=[],errors=[],nav=[];try{
 await new Promise(r=>server.listen(0,"127.0.0.1",r));const url="http://127.0.0.1:"+server.address().port;
 chrome=await h.launchChrome(h.findChrome(),12);const c=chrome.client;
 await c.send("Fetch.enable",{patterns:[{urlPattern:"*"}]});c.on("Fetch.requestPaused",async e=>{
  requests.push(e.request.url+" "+(e.request.postData||""));
  if(e.request.url.includes("/.netlify/functions/navigator")){nav.push(JSON.parse(e.request.postData));await c.send("Fetch.fulfillRequest",{requestId:e.requestId,responseCode:200,responseHeaders:[{name:"Content-Type",value:"application/json"}],body:Buffer.from(JSON.stringify({reply:"SYNTHETIC GUIDE RESPONSE"})).toString("base64")});}
  else await c.send(e.request.url.startsWith(url)?"Fetch.continueRequest":"Fetch.failRequest",e.request.url.startsWith(url)?{requestId:e.requestId}:{requestId:e.requestId,errorReason:"BlockedByClient"});
 });
 await c.send("Runtime.enable");c.on("Runtime.exceptionThrown",e=>errors.push(e.exceptionDetails.text));await c.send("Page.enable");
 const ev=x=>h.evaluate(c,x,true),wait=(x,label)=>h.waitForExpression(c,x,label,7000);
 const click=text=>ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==='+JSON.stringify(text)+').click()');
 const input=(id,value)=>ev('var n=document.getElementById('+JSON.stringify(id)+');Object.getOwnPropertyDescriptor(n.tagName==="SELECT"?HTMLSelectElement.prototype:HTMLInputElement.prototype,"value").set.call(n,'+JSON.stringify(value)+');n.dispatchEvent(new Event(n.tagName==="SELECT"?"change":"input",{bubbles:true}));');
 const home=async()=>{await c.send("Page.navigate",{url:url+"/?tool=dashboard"});await wait('!!document.getElementById("tops-guide-heading")','guide loaded');};
 await home();await ev('localStorage.clear();localStorage.setItem("tops_onboarded","1");localStorage.setItem("tops_user_status","separated");localStorage.setItem("unrelated_guide_sentinel","retain");');await home();

 await ev('document.getElementById("tops-plan-backup").open=true;window.__blob=null;window.__createURL=URL.createObjectURL;URL.createObjectURL=function(b){window.__blob=b;return window.__createURL(b)};window.__anchorClick=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){window.__filename=this.download};');
 await click("Download my plan");assert.equal(JSON.parse(await ev("window.__blob.text()")).sections.guide.pathway,"", "blank guide still exports existing progress");
 await input("tops-guide-pathway","skills");await input("tops-guide-goal","SYNTHETIC_BACKUP_NOTE");
 await click("Download my plan");const raw=await ev('window.__blob.text()'),backup=JSON.parse(raw);
 assert.equal(backup.sections.guide.goal,"SYNTHETIC_BACKUP_NOTE");assert.equal(await ev('localStorage.getItem("tops_personal_guide_v1")'),null);assert.match(await ev('window.__filename'),/^transition-ops-plan-\d{4}-\d{2}-\d{2}\.json$/);
 assert.equal(Object.keys(backup.sections).length,7);assert.equal(backup.version,2);assert.ok(!raw.includes("unrelated_guide_sentinel"));
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'tops-backup-')),file=path.join(dir,'synthetic-plan.json'),bad=path.join(dir,'invalid.txt');fs.writeFileSync(file,raw);fs.writeFileSync(bad,'{invalid');
 console.log("SYNTHETIC FIXTURE",file);
 const upload=async p=>{const doc=await c.send('DOM.getDocument');const {nodeId}=await c.send('DOM.querySelector',{nodeId:doc.root.nodeId,selector:'#tops-backup-file'});await c.send('DOM.setFileInputFiles',{nodeId,files:[p]});};
 const snapshot=()=>ev('JSON.stringify(Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])))');
 let before=await snapshot();await upload(file);await wait('!!document.getElementById("tops-backup-review")','restore preview');assert.equal(await snapshot(),before);await wait('document.activeElement.id==="tops-backup-review"','preview focus');
 await click("Keep my current plan");assert.equal(await snapshot(),before);assert.equal(await ev('!!document.getElementById("tops-backup-review")'),false);
 await upload(file);await wait('!!document.getElementById("tops-backup-review")','reselect same file');await upload(bad);await wait('document.getElementById("tops-backup-status").textContent.includes("not a supported")','invalid file');assert.equal(await ev('!!document.getElementById("tops-backup-review")'),false);assert.equal(await snapshot(),before);
 await upload(file);await wait('!!document.getElementById("tops-backup-review")','preview before edit');await input('tops-guide-goal','NEWER EDIT');await click('Replace with this backup');assert.equal(await ev('!!document.getElementById("tops-backup-review")'),false);assert.ok(await ev('document.getElementById("tops-backup-status").textContent.includes("plan changed")'));assert.equal(await snapshot(),before);
 await upload(file);await wait('!!document.getElementById("tops-backup-review")','preview before storage drift');await ev('localStorage.setItem("tops_career_gap_v1","different saved state")');before=await snapshot();await click('Replace with this backup');assert.equal(await snapshot(),before);assert.ok(await ev('document.getElementById("tops-backup-status").textContent.includes("plan changed")'));
 await upload(file);await wait('!!document.getElementById("tops-backup-review")','storage failure preview');before=await snapshot();await ev('window.__savedSet=Storage.prototype.setItem;window.__writeCount=0;Storage.prototype.setItem=function(k,v){if(window.__writeCount++===2)throw Error("synthetic quota");return window.__savedSet.call(this,k,v)}');await click('Replace with this backup');assert.equal(await snapshot(),before);assert.ok(await ev('document.getElementById("tops-backup-status").textContent.includes("put back")'));await ev('Storage.prototype.setItem=window.__savedSet');
 await upload(file);await wait('!!document.getElementById("tops-backup-review")','valid restore');await click('Replace with this backup');await wait('document.getElementById("tops-backup-status").textContent.includes("Plan restored")','restore complete');assert.equal(await ev('document.getElementById("tops-guide-goal").value'),'SYNTHETIC_BACKUP_NOTE');assert.equal(await ev('localStorage.getItem("unrelated_guide_sentinel")'),'retain');assert.deepEqual(JSON.parse(await ev('localStorage.getItem("tops_personal_guide_v1")')),backup.sections.guide);
 await home();assert.equal(await ev('document.getElementById("tops-guide-goal").value'),'SYNTHETIC_BACKUP_NOTE');await ev('document.getElementById("tops-plan-backup").open=true');
 // A delayed older file cannot revive a canceled/replaced preview.
 await ev('window.__fileText=File.prototype.text;File.prototype.text=function(){return new Promise(resolve=>window.__lateRead=()=>resolve('+JSON.stringify(raw)+'))}');await upload(file);await wait('!!window.__lateRead','pending read');await click('Cancel reading');await ev('window.__lateRead();File.prototype.text=window.__fileText');await new Promise(r=>setTimeout(r,80));assert.equal(await ev('!!document.getElementById("tops-backup-review")'),false);
 await upload(file);await wait('!!document.getElementById("tops-backup-review")','mobile preview');for(const width of [320,375]){await c.send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:true});assert.ok(await ev('document.documentElement.scrollWidth<=window.innerWidth'));}
 assert.equal(requests.filter(r=>r.includes('SYNTHETIC_BACKUP_NOTE')).length,0);assert.equal(errors.length,0);
 console.log('BACKUP BROWSER PASS: actual download Blob bytes/file-upload roundtrip; current unsaved guide; seven canonical sections; cancel/invalid/reselect; stale open/saved state rejection; canceled async read; explicit restore/reload; 320/375 reflow; preview focus; no backup network payload or JS errors');
 } finally {if(chrome)await h.stopChrome(chrome);await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
