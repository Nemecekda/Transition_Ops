"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),http=require("node:http"),os=require("node:os"),{spawn,execFileSync}=require("node:child_process");
const root=path.resolve(__dirname,".."),source=fs.readFileSync(path.join(root,"index.html"),"utf8");
const windowCode=source.slice(source.indexOf("const CRITICAL_WINDOWS ="),source.indexOf("const SCRA_WINDOW ="));
const statusCode=s=>s.slice(s.indexOf("function getCriticalWindowStatus("),s.indexOf("// Filter windows by userStatus."));
const api=vm.runInNewContext(windowCode+statusCode(source)+";({windows:CRITICAL_WINDOWS,status:getCriticalWindowStatus})");
const C={inactive:"inactive",greenBright:"green",warning:"warning",danger:"danger",goldBright:"gold"};
const vgli=api.windows.find(w=>w.id==="sgli_vgli");
assert.equal(vgli.endDay,null);assert.equal(vgli.irrevocable,false);
assert.equal(api.status(vgli,null,C).state,"unknown");
for(const [elapsed,state] of [[-100,"guidance"],[0,"open"],[179,"open"],[180,"closing"],[209,"closing"],[210,"closing_critical"],[239,"closing_critical"],[240,"closing_critical"],[241,"guidance"],[485,"guidance"],[486,"guidance"],[730,"guidance"]]) {
  const actual=api.status(vgli,-elapsed,C);assert.equal(actual.state,state,"day "+elapsed);
  if(elapsed>=0 && elapsed<=240)assert.ok(actual.label.startsWith((240-elapsed)+"D "));
  if(elapsed>240)assert.equal(actual.label,"CONFIRM VGLI DEADLINE WITH OSGLI");
  assert.doesNotMatch(actual.label,/irrevocable|ineligible|closed/i);
}
assert.match(vgli.consequence,/does not determine whether you are insured or eligible/);
assert.match(vgli.guardReserve,/civilian career-change date alone does not establish eligibility/);
assert.doesNotMatch(JSON.stringify(vgli),/485|486|guaranteed coverage|you are uncovered/i);
assert.doesNotMatch(source,/VGLI window closed permanently|PERMANENTLY ineligible for VGLI|endDay:485/);
// Fixed predecessor is the comparison oracle for unchanged windows, even after commit.
const prior=execFileSync("git",["show","c79a38f:index.html"],{cwd:root,encoding:"utf8",maxBuffer:8*1024*1024});
const priorStatus=vm.runInNewContext(statusCode(prior)+";getCriticalWindowStatus");
let parity=0;for(const win of api.windows.filter(w=>w.id!=="sgli_vgli"))for(let day=-800;day<=800;day++){
  assert.equal(JSON.stringify(api.status(win,day,C)),JSON.stringify(priorStatus(win,day,C)));parity++;
}
console.log("VGLI boundary PASS; unchanged-window parity",parity);

// Isolated rendered checks; only invented dates/profiles and local requests.
const utility=fs.readFileSync(path.join(root,"scripts/privacy-network-regression.js"),"utf8");
const h=new Function("fs","path","os","spawn",utility.slice(utility.indexOf("function findChrome()"),utility.indexOf("const PROBE_SCRIPT ="))+"\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};")(fs,path,os,spawn);
const server=http.createServer((req,res)=>{const p=path.join(root,req.url.split("?")[0]==="/"?"index.html":req.url.split("?")[0]);if(!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);return res.end();}res.setHeader("Content-Type",p.endsWith(".js")?"text/javascript":p.endsWith(".html")?"text/html":"application/octet-stream");res.end(fs.readFileSync(p));});
(async()=>{let chrome;try{
  await new Promise(r=>server.listen(0,"127.0.0.1",r));const url="http://127.0.0.1:"+server.address().port;
  chrome=await h.launchChrome(h.findChrome(),12);const c=chrome.client,ev=x=>h.evaluate(c,x,true),wait=(x,label)=>h.waitForExpression(c,x,label,10000);
  const errors=[];await c.send("Runtime.enable");c.on("Runtime.exceptionThrown",e=>errors.push(e.exceptionDetails.text));
  await c.send("Fetch.enable",{patterns:[{urlPattern:"*"}]});c.on("Fetch.requestPaused",async e=>{const local=e.request.url.startsWith(url);await c.send(local?"Fetch.continueRequest":"Fetch.failRequest",local?{requestId:e.requestId}:{requestId:e.requestId,errorReason:"BlockedByClient"});});
  await c.send("Page.enable");await c.send("Emulation.setDeviceMetricsOverride",{width:320,height:812,deviceScaleFactor:1,mobile:true});
  await c.send("Page.addScriptToEvaluateOnNewDocument",{source:'localStorage.setItem("tops_onboarded","1");localStorage.setItem("tops_sep_date","2020-01-01");localStorage.setItem("etsDate","2020-01-01");'});
  await c.send("Page.navigate",{url});await wait('typeof getCriticalWindowStatus==="function"','app');
  for(const profile of ["active","guard","separated","retired"]){
    await ev('localStorage.setItem("tops_user_status",'+JSON.stringify(profile)+')');
    await c.send("Page.navigate",{url:url+"/?tool=critical"});
    await wait('!!document.querySelector(\'[aria-controls="tops-window-detail-sgli_vgli"]\')','VGLI card');
    const selector='document.querySelector(\'[aria-controls="tops-window-detail-sgli_vgli"]\')';
    assert.match(await ev(selector+'.textContent'),/CONFIRM VGLI DEADLINE WITH OSGLI/);
    assert.doesNotMatch(await ev(selector+'.textContent'),/IRREVOCABLE|🔒/);
    await ev(selector+'.click()');
    assert.equal(await ev('document.getElementById("tops-window-detail-sgli_vgli").hidden'),false);
    assert.match(await ev('document.getElementById("tops-window-detail-sgli_vgli").textContent'),/Disability Extension/);
    assert.ok(await ev('document.documentElement.scrollWidth<=window.innerWidth+1'),'320px reflow '+profile);
    await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==="MISSED").click()');
    assert.equal(await ev(selector),null,'VGLI must not be treated as missed eligibility');
    await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent==="OPEN").click()');
    assert.ok(await ev('!!'+selector),'Confirmation guidance remains reachable');
  }
  assert.deepEqual(errors,[]);console.log("VGLI rendered PASS: four profiles, 320px reflow, expansion and filters; synthetic local evidence only");
}finally{if(chrome){await h.stopChrome(chrome);if(chrome.child&&chrome.child.stderr)chrome.child.stderr.destroy();}await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
