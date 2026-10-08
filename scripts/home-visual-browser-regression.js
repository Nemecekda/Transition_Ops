"use strict";
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),utility=fs.readFileSync(path.join(__dirname,'privacy-network-regression.js'),'utf8');
const h=new Function('fs','path','os','spawn',utility.slice(utility.indexOf('function findChrome()'),utility.indexOf('const PROBE_SCRIPT ='))+'\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs,path,os,spawn);
const server=http.createServer((req,res)=>{const p=path.join(root,req.url.split('?')[0]==='/'?'index.html':req.url.split('?')[0]);if(!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript':p.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(p));});
(async()=>{let chrome;const requests=[],errors=[];try{
await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;chrome=await h.launchChrome(h.findChrome(),12);const c=chrome.client;
await c.send('Fetch.enable',{patterns:[{urlPattern:'*'}]});c.on('Fetch.requestPaused',async e=>{requests.push(e.request.url+' '+(e.request.postData||''));await c.send(e.request.url.startsWith(url)?'Fetch.continueRequest':'Fetch.failRequest',e.request.url.startsWith(url)?{requestId:e.requestId}:{requestId:e.requestId,errorReason:'BlockedByClient'});});
await c.send('Runtime.enable');c.on('Runtime.exceptionThrown',e=>errors.push(e.exceptionDetails.text));await c.send('Page.enable');
const ev=x=>h.evaluate(c,x,true),wait=(x,label)=>h.waitForExpression(c,x,label,7000),click=text=>ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==='+JSON.stringify(text)+').click()');
const input=(id,value)=>ev('var n=document.getElementById('+JSON.stringify(id)+');Object.getOwnPropertyDescriptor(n.tagName==="SELECT"?HTMLSelectElement.prototype:HTMLInputElement.prototype,"value").set.call(n,'+JSON.stringify(value)+');n.dispatchEvent(new Event(n.tagName==="SELECT"?"change":"input",{bubbles:true}));');
const home=async()=>{await c.send('Page.navigate',{url:url+'/?tool=dashboard'});await wait('!!document.getElementById("tops-loop-title")','member loop Home');};


const capturePrefix=process.env.TOPS_VISUAL_PREFIX||'/private/tmp/tops-home-visual';
await home();await ev('localStorage.clear();localStorage.setItem("tops_onboarded","1")');
for(const theme of ['professional','tactical'])for(const width of [320,375,1024]){
 await ev('localStorage.setItem("tops_theme",'+JSON.stringify(theme)+')');await c.send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});await home();
 assert.equal(await ev('document.querySelectorAll("#tops-home-search").length'),1);
 assert.equal(await ev('document.querySelectorAll("#tops-suicide-support").length'),1);
 assert.equal(await ev('document.querySelectorAll("#tops-priority-choices").length'),1);
 assert.equal(await ev('document.getElementById("tops-loop-title").getBoundingClientRect().top<document.getElementById("tops-home-search").getBoundingClientRect().top'),true);
 assert.equal(await ev('document.documentElement.scrollWidth<=innerWidth'),true);
 const columns=await ev('getComputedStyle(document.getElementById("tops-member-starts")).gridTemplateColumns.split(" ").length');assert.equal(columns,width<=620?1:2);
 if(width!==320){await ev('window.scrollTo(0,0)');const first=await c.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(capturePrefix+'-first-'+theme+'-'+width+'.png',Buffer.from(first.data,'base64'));}
 await ev('document.querySelector("#tops-member-starts button[aria-label=\\"Find work soon\\"]").click()');await wait('document.activeElement.id==="tops-loop-title"','compact heading focus');
 assert.equal(await ev('document.getElementById("tops-loop-title").getBoundingClientRect().width<document.querySelector(".tops-next-move").getBoundingClientRect().width-40'),true);
 assert.equal(await ev('Array.from(document.querySelectorAll(".tops-loop-utilities>details>summary")).every(n=>n.getBoundingClientRect().height>=44)'),true);
 const primary=await ev('(()=>{const node=document.querySelector(".tops-next-move-actions>.tops-move-primary"),style=getComputedStyle(node);return {height:node.getBoundingClientRect().height,minHeight:style.minHeight,boxSizing:style.boxSizing,zoom:getComputedStyle(document.documentElement).zoom}})()');assert.ok(primary.height>=48,JSON.stringify(primary));
 await ev('document.querySelector("#tops-loop-checkin>summary").focus()');await c.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',unmodifiedText:'\r',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});await c.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});await wait('document.getElementById("tops-loop-checkin").open','native disclosure Enter activation');await input('tops-loop-blocker','time');await input('tops-loop-minutes','10');
 assert.equal(await ev('(()=>{const grid=document.querySelector(".tops-loop-utilities"),style=getComputedStyle(grid);return Math.abs(document.getElementById("tops-loop-checkin").getBoundingClientRect().width-(grid.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight)))<2})()'),true);
 assert.equal(await ev('document.documentElement.scrollWidth<=innerWidth'),true);
 await ev('document.getElementById("tops-loop-checkin").open=false;document.getElementById("tops-suicide-support").open=true');
 assert.equal(await ev('!!document.querySelector("#tops-suicide-support a[href=\\"tel:988\\"]")'),true);
 assert.equal(await ev('document.documentElement.scrollWidth<=innerWidth'),true);
 await ev('document.getElementById("tops-suicide-support").open=false;window.scrollTo(0,0);new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
 const shot=await c.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(capturePrefix+'-'+theme+'-'+width+'.png',Buffer.from(shot.data,'base64'));
 console.log('PASS visual layout '+theme+' '+width+': one search/priority/support, action before search, compact heading focus, 44px utility targets, full-width expanded panels, crisis link and no overflow');
}
assert.deepEqual(errors,[]);assert.equal(requests.some(r=>r.includes('/.netlify/functions/')),false);
console.log('HOME VISUAL PASS; local synthetic desktop/mobile captures only, no manual assistive-technology or member usefulness claim');
}finally{if(chrome)await h.stopChrome(chrome);await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exit(1);});
