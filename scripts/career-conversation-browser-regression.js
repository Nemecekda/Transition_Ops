"use strict";
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),utility=fs.readFileSync(path.join(__dirname,'privacy-network-regression.js'),'utf8');
const h=new Function('fs','path','os','spawn',utility.slice(utility.indexOf('function findChrome()'),utility.indexOf('const PROBE_SCRIPT ='))+'\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs,path,os,spawn);
const server=http.createServer((req,res)=>{const p=path.join(root,req.url.split('?')[0]==='/'?'index.html':req.url.split('?')[0]);if(!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript':p.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(p));});
(async()=>{let chrome;try{
await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
chrome=await h.launchChrome(h.findChrome(),12);const c=chrome.client,ev=x=>h.evaluate(c,x,true),wait=(x,l)=>h.waitForExpression(c,x,l,8000);const errors=[],outgoing=[];
await c.send('Runtime.enable');c.on('Runtime.exceptionThrown',e=>errors.push(e.exceptionDetails.text));await c.send('Fetch.enable',{patterns:[{urlPattern:'*'}]});c.on('Fetch.requestPaused',async e=>{const local=e.request.url.startsWith(url);if(!local)outgoing.push(e.request.url);await c.send(local?'Fetch.continueRequest':'Fetch.failRequest',local?{requestId:e.requestId}:{requestId:e.requestId,errorReason:'BlockedByClient'});});
await c.send('Page.enable');await c.send('Page.addScriptToEvaluateOnNewDocument',{source:'localStorage.setItem("tops_onboarded","1");'});await c.send('Page.navigate',{url});await wait('typeof topsEmptyGap==="function"','app');
for(const profile of ['separated','retired','active','spouse','guard']) {
 for(const [status,label,field] of [['','Resume my conversation notes','questions'],['Waiting for a response','Update my conversation','status'],['Response received','Review what changed','followup']]) {
  await ev('var gap=topsEmptyGap();gap.target="SYNTHETIC earlier career";gap.prep.questions="SYNTHETIC question";gap.prep.followup="SYNTHETIC next action";gap.prep.status='+JSON.stringify(status)+';localStorage.setItem("tops_career_gap_v1",JSON.stringify(gap));localStorage.setItem("tops_user_status",'+JSON.stringify(profile)+');');
  await c.send('Page.navigate',{url:url+'/?tool=dashboard'});const id=profile==='guard'?'guard-conversation-resume':'tops-conversation-resume';await wait('!!document.getElementById('+JSON.stringify(id)+')',profile+' recovery');
  const before=await ev('localStorage.getItem("tops_career_gap_v1")');assert.equal(await ev('document.querySelectorAll("#tops-conversation-resume,#guard-conversation-resume").length'),1);
  await ev('Array.from(document.querySelectorAll("button")).find(b=>b.textContent==='+JSON.stringify(label)+').click()');await wait('document.activeElement.id==='+JSON.stringify('career-prep-'+field),'focus');assert.equal(await ev('document.getElementById("career-gap-target").value'),'SYNTHETIC earlier career');assert.equal(await ev('localStorage.getItem("tops_career_gap_v1")'),before);
 }
}
await ev('localStorage.setItem("tops_user_status","separated");localStorage.removeItem("tops_career_gap_v1");');await c.send('Page.navigate',{url:url+'/?tool=dashboard'});await wait('!!document.getElementById("tops-loop-title")','empty Home');assert.equal(await ev('!!document.getElementById("tops-conversation-resume")'),false);
assert.equal(errors.length,0,JSON.stringify(errors));assert.equal(outgoing.some(u=>u.includes('SYNTHETIC')),false);
console.log('CAREER CONVERSATION PASS: five service profiles, three contact states, one recovery card, exact field focus, preserved worksheet and no automatic saves; empty worksheet hides card. Isolated local browser; external requests blocked.');
}finally{if(chrome)await h.stopChrome(chrome);await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e.stack);process.exitCode=1;});
