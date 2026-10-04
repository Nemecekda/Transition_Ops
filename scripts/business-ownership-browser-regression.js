"use strict";
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),utility=fs.readFileSync(path.join(__dirname,'privacy-network-regression.js'),'utf8');
const h=new Function('fs','path','os','spawn',utility.slice(utility.indexOf('function findChrome()'),utility.indexOf('const PROBE_SCRIPT ='))+'\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs,path,os,spawn);
const server=http.createServer((req,res)=>{const p=path.join(root,req.url.split('?')[0]==='/'?'index.html':req.url.split('?')[0]);if(!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript':p.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(p));});
(async()=>{let chrome;const requests=[],errors=[];try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;chrome=await h.launchChrome(h.findChrome(),12);const c=chrome.client;
 await c.send('Fetch.enable',{patterns:[{urlPattern:'*'}]});c.on('Fetch.requestPaused',async e=>{requests.push(e.request.url);await c.send(e.request.url.startsWith(url)?'Fetch.continueRequest':'Fetch.failRequest',e.request.url.startsWith(url)?{requestId:e.requestId}:{requestId:e.requestId,errorReason:'BlockedByClient'});});
 await c.send('Runtime.enable');c.on('Runtime.exceptionThrown',e=>errors.push(e.exceptionDetails.text));await c.send('Page.enable');
 const ev=x=>h.evaluate(c,x,true),wait=(x,label)=>h.waitForExpression(c,x,label,7000);
 await c.send('Page.navigate',{url:url+'/?tool=dashboard'});await wait('!!document.getElementById("tops-loop-title")','Home');
 await ev('localStorage.setItem("tops_onboarded","1");localStorage.setItem("tops_user_status","guard")');
 for(const theme of ['professional','tactical'])for(const width of [320,375,900]){
  await ev('localStorage.setItem("tops_theme",'+JSON.stringify(theme)+')');
  await c.send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});
  await c.send('Page.navigate',{url:url+'/?tool=pathway'});await wait('!!document.getElementById("tops-business-ownership")','ownership section');
  assert.equal(await ev('document.getElementById("tops-business-ownership").open'),false);
  await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==="Business ownership").click()');
  await wait('document.activeElement.id==="tops-ownership-heading"','shortcut focus');
  assert.equal(await ev('document.getElementById("tops-business-ownership").open'),true);
  assert.equal(await ev('document.documentElement.scrollWidth<=innerWidth'),true);
  const links=await ev('Array.from(document.querySelectorAll("#tops-business-ownership a")).map(n=>({href:n.getAttribute("href"),height:n.getBoundingClientRect().height}))');
  assert.deepEqual(links.map(n=>n.href),['mailto:dcarey@rbpchemical.net?subject=Operation%20Ownership%20inquiry','tel:+14148390077']);
  assert.ok(links.every(n=>n.height>=44));
  const text=await ev('document.getElementById("tops-business-ownership").textContent');
  assert.ok(text.includes('provided by Dan Carey'));assert.ok(text.includes('any costs'));
  assert.equal(/Charlie Klein|\$25B|10,000|Confidential:|November|Spring/.test(text),false);
  if(process.env.TOPS_OWNERSHIP_SCREENSHOT_DIR && width===375){fs.mkdirSync(process.env.TOPS_OWNERSHIP_SCREENSHOT_DIR,{recursive:true});const shot=await c.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(process.env.TOPS_OWNERSHIP_SCREENSHOT_DIR,theme+'.png'),Buffer.from(shot.data,'base64'));}
  console.log('PASS ownership shortcut, contact links, attribution and reflow '+theme+' '+width);
 }
 await c.send('Page.navigate',{url:url+'/?tool=dashboard'});await wait('!!document.getElementById("tops-home-search")','Home search');
 await ev('var n=document.getElementById("tops-home-search");Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set.call(n,"Operation Ownership");n.dispatchEvent(new Event("input",{bubbles:true}));');
 await wait('document.body.textContent.includes("Explore roles, business ownership, your plan or resume")','ownership search result');
 assert.equal(requests.some(u=>u.includes('rbpchemical')||u.includes('/.netlify/functions/')),false);assert.deepEqual(errors,[]);
 console.log('BUSINESS OWNERSHIP PASS; no email, call, model request or member data sent');
}finally{if(chrome)await h.stopChrome(chrome);await new Promise(r=>{server.close(r);server.closeAllConnections();});}})().catch(e=>{console.error(e.stack);process.exitCode=1;});
