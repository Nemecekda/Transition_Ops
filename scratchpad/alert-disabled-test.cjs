// Offline production-OFF regression. Node built-ins only; no real APIs or sends.
// Run: node scratchpad/alert-disabled-test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
function unique(s) { assert.equal(source.split(s).length - 1, 1); return source.indexOf(s); }
const flag = source.match(/const TOPS_PUSH_ENABLED = false;/g);
assert.equal(flag?.length, 1);
const start = unique('// Local alert persistence and native exclusive coordination.');
const end = unique('// CRITICAL WINDOWS MODULE');
const counts = {worker:0, locks:0, storage:0, show:0};
const trap = name => { counts[name]++; throw Error('OFF touched '+name); };
const navigator = {};
Object.defineProperties(navigator, {
  serviceWorker:{get:()=>trap('worker')}, locks:{get:()=>trap('locks')}
});
const context = {TOPS_PUSH_ENABLED:false, Notification:{permission:'granted'}, navigator,
  window:{__IS_IFRAME:false}, console,
  localStorage:{getItem:()=>trap('storage'),setItem:()=>trap('storage')},
  showNotification:()=>trap('show')};
vm.createContext(context);
vm.runInContext(flag[0]+'\n'+source.slice(start,end),context);
(async()=>{
  const result = await context.notifyDueRung('2027-09-07');
  assert.equal(result.status,'disabled'); assert.equal(result.id,null);
  assert.deepEqual(counts,{worker:0,locks:0,storage:0,show:0});
  assert.equal(source.split('notifyDueRung(').length-1,1,'no callers restored');
  console.log('PASS production OFF: granted permission, direct call, zero worker/locks/storage/show access; no callers');
})().catch(e=>{console.error(e);process.exitCode=1;});
