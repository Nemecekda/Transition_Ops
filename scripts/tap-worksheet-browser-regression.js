"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),http=require("node:http"),os=require("node:os");
const {spawn}=require("node:child_process");
const root=path.resolve(__dirname,"..");
const source=fs.readFileSync(path.join(root,"index.html"),"utf8");
const utility=fs.readFileSync(path.join(__dirname,"privacy-network-regression.js"),"utf8");
// Reuse the existing local-only Chrome/CDP launcher; no external dependencies.
const helpers=new Function("fs","path","os","spawn",utility.slice(utility.indexOf("function findChrome()"),utility.indexOf("const PROBE_SCRIPT ="))+"\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};")(fs,path,os,spawn);
const actual=source.slice(source.indexOf("const TOPS_GAP_KEY ="),source.indexOf("\nfunction App() {"));
const fixture='<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:14px;font:16px Arial}</style></head><body><div id="root"></div><script src="/vendor/react.production.min.js"></script><script src="/vendor/react-dom.production.min.js"></script><script>const {useState,useEffect}=React;window.__IS_IFRAME=false;window.__safeSet=function(k,v){try{localStorage.setItem(k,v)}catch(e){}};'+actual+'\nfunction Harness(){const [state,setState]=useState(topsLoadGap);return React.createElement(CareerGapWorksheet,{colors:{bg:"#0E120B",bgCard:"#161B11",border:"#222A19",textPrimary:"#F5F0E1",textBody:"#d4cbb3",goldBright:"#E8C547"},state,setState});}ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Harness));</script></body></html>';
const server=http.createServer((req,res)=>{if(req.url.startsWith("/vendor/")){res.setHeader("Content-Type","text/javascript");res.end(fs.readFileSync(path.join(root,req.url)));}else{res.setHeader("Content-Type","text/html");res.end(fixture);}});
(async()=>{let chrome;const sentinels=["SYNTHETIC_LATEST_GAP_",'<img src=x onerror="alert(1)">'];const attempts=[],errors=[];try{
await new Promise(r=>server.listen(0,"127.0.0.1",r));const url="http://127.0.0.1:"+server.address().port;
chrome=await helpers.launchChrome(helpers.findChrome(),9);const c=chrome.client;
await c.send("Network.enable");await c.send("Fetch.enable",{patterns:[{urlPattern:"*"}]});
c.on("Fetch.requestPaused",async e=>{attempts.push(e.request.url+" "+(e.request.postData||""));if(e.request.url.startsWith(url))await c.send("Fetch.continueRequest",{requestId:e.requestId});else await c.send("Fetch.failRequest",{requestId:e.requestId,errorReason:"BlockedByClient"});});
c.on("Runtime.exceptionThrown",e=>errors.push(e.exceptionDetails.text));await c.send("Runtime.enable");
async function ready(){await helpers.waitForExpression(c,'!!document.getElementById("career-gap-target")',"worksheet render",6000);}
async function ev(expression){return helpers.evaluate(c,expression,true);}
async function status(){return ev('document.querySelector("[role=status]").textContent');}
async function click(text){await ev('Array.from(document.querySelectorAll("button")).find(b=>b.textContent==='+JSON.stringify(text)+').click()');}
await c.send("Page.navigate",{url});await ready();
assert.equal(await ev('document.activeElement.id'),"career-gap-heading");
// Real browser text insertion then immediately activate save in the next CDP command.
for(let i=0;i<5;i++){
 await ev('document.getElementById("career-gap-target").focus()');
 await c.send("Input.insertText",{text:sentinels[0]+i});
 await click("Save on this browser");
 const values=await ev('({visible:document.getElementById("career-gap-target").value,saved:JSON.parse(localStorage.getItem("tops_career_gap_v1")).target})');
 assert.equal(values.saved,values.visible,"immediate save must contain latest typed value");assert.match(await status(),/^Saved/);
}
await ev('document.getElementById("career-gap-0-have").focus()');await c.send("Input.insertText",{text:sentinels[1]});await click("Save on this browser");
await c.send("Page.reload");await ready();assert.equal(await ev('document.getElementById("career-gap-0-have").value'),sentinels[1]);assert.equal(await ev('document.querySelectorAll("img").length'),0);
await ev('document.getElementById("career-gap-target").focus()');await c.send("Input.insertText",{text:"UNSAVED"});await c.send("Page.reload");await ready();assert.equal(await ev('document.getElementById("career-gap-target").value.includes("UNSAVED")'),false);
await c.send("Emulation.setDeviceMetricsOverride",{width:320,height:700,deviceScaleFactor:1,mobile:true});
assert.ok(await ev('document.documentElement.scrollWidth<=320'));
await ev('Array.from(document.querySelectorAll("summary")).find(s=>s.textContent==="Education and training").focus()');
await c.send("Input.dispatchKeyEvent",{type:"keyDown",key:"Enter",code:"Enter",text:"\r",unmodifiedText:"\r",windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});await c.send("Input.dispatchKeyEvent",{type:"keyUp",key:"Enter",code:"Enter",windowsVirtualKeyCode:13});
await helpers.waitForExpression(c,'document.activeElement.parentElement.open === true',"keyboard disclosure settled",3000);
await click("Clear worksheet");assert.equal(await ev('localStorage.getItem("tops_career_gap_v1")'),null);await c.send("Page.reload");await ready();assert.equal(await ev('document.getElementById("career-gap-target").value'),"");
// Denial remains visibly truthful when the existing silent storage helper cannot save.
await ev('window.__safeSet=function(){};document.getElementById("career-gap-target").focus()');await c.send("Input.insertText",{text:"DENIED_SYNTHETIC"});await click("Save on this browser");assert.match(await status(),/^Not saved/);assert.equal(await ev('document.getElementById("career-gap-target").value'),"DENIED_SYNTHETIC");
assert.equal(errors.length,0);for(const text of attempts)for(const sentinel of sentinels)assert.ok(!text.includes(sentinel));
console.log("TAP BROWSER PASS: actual React worksheet; five latest-keystroke immediate saves; saved/unsaved reload; plaintext injection; 320px no overflow; keyboard disclosure; clear/reload; save denial; no sentinel in network attempts; zero exceptions");
}finally{await helpers.stopChrome(chrome);await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e.stack);process.exitCode=1;});
