'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root='/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops';
const html=fs.readFileSync(root+'/index.html','utf8'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const before='["area", "situation", "need"].forEach(function(key) { url.searchParams.delete(key); });';
const after='["area", "situation", "need"].forEach(function(key) { if (url.searchParams.has(key)) url.searchParams.delete(key); });';
assert.equal(html.split(after).length,2,'single bounded changed line');
assert.equal(sha(html.replace(after,before)),'78c6411e8e8b9cf777f64c6972956745fc128f0f81e0cc0113fc9e1bea0a5e04','no other source change since reviewed candidate');
assert.equal(sha(html),'2acb1be174325661050f982cdd56acaf3d74e0e754ef912ca9e857fccf7ca43b');
const helpers=html.slice(html.indexOf('const TOPS_TOOL_ROUTES ='),html.indexOf('function App() {'));
const state=html.slice(html.indexOf('const TOPS_STATE_HELP_NEEDS ='),html.indexOf('function StateLocalHelp(props)'));
const sync=html.slice(html.indexOf('__syncToolURL.current = function() {'),html.indexOf('__closeTop.current = function() {'));
let checks=0;
function run(href,tool,subTab,context,wi=false){
 const c={URL,window:{location:{href}},history:{state:{synthetic:true},replaceState(s,t,u){c.window.location.href=u;c.replaced++}},replaced:0,__syncToolURL:{},showOnboarding:false,activeTab:tool,subTab,stateHelpContext:context||{area:'national',situation:'browse',need:'start'},wiGuideRequested:{current:wi}};
 vm.createContext(c);vm.runInContext(helpers+state+sync+'\n__syncToolURL.current();',c);checks++;return c;
}
for(const tool of ['dashboard','pathway','resources','timeline'])for(const q of ['q=two%20words','q=a%2Bb%20c&x=%7E','q=two+words','']){
 const href='https://example.test/?tool='+tool+(q?'&'+q:'')+'#kept';const c=run(href,tool,tool==='resources'?'vsos':'');assert.equal(c.window.location.href,href);assert.equal(c.replaced,0,'unrelated URL should not be rewritten');
}
let c=run('https://example.test/?tool=resources&guide=wisconsin-work-support&q=two%20words','resources','directory',null,true);
assert.equal(c.window.location.href,'https://example.test/?tool=resources&guide=wisconsin-work-support&q=two%20words');assert.equal(c.replaced,0);
c=run('https://example.test/?tool=resources&view=state-help&area=wi&situation=guard&need=education','resources','state-help',{area:'wi',situation:'guard',need:'education'});assert.equal(c.window.location.href,'https://example.test/?tool=resources&view=state-help&area=wi&situation=guard&need=education');
c=run(c.window.location.href,'resources','documents');let u=new URL(c.window.location.href);assert.equal(u.searchParams.get('view'),'documents');for(const k of ['area','situation','need','guide'])assert.equal(u.searchParams.has(k),false);
c=run('https://example.test/?tool=pathway&area=wi&area=national&situation=guard&need=education&q=two%20words','pathway','');u=new URL(c.window.location.href);for(const k of ['area','situation','need'])assert.equal(u.searchParams.has(k),false);assert.equal(u.searchParams.get('q'),'two words');
const result={checked:'2026-10-16',index_sha256:sha(html),worker_sha256:sha(fs.readFileSync(root+'/pwa-sw.js')),result:'PASS',checks,evidence:'Exact source URL synchronization executed in isolated Node VM; no browser or provider calls.',bounded_change:'Reverting only the conditional delete guard reproduces the previously independently reviewed index hash exactly.',coverage:['unrelated active-tool URLs retain exact percent/plus encoding and fragment','legacy Wisconsin guide URL remains byte-for-byte unchanged when already correct','Wisconsin Guard context remains stable','Documents removes state-help context','navigation away removes duplicate state-help keys while preserving unrelated decoded values']};
fs.writeFileSync(__dirname+'/url-rebind.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
