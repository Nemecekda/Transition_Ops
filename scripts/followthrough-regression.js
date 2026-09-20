'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const s=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const helper=s.slice(s.indexOf('const TOPS_FOLLOW_KEY'),s.indexOf('function ReminderProgress'));
const action=s.slice(s.indexOf('  function saveFollowProgress('),s.indexOf('  const [reminderExpanded'));
const records=[{id:'bdd',deadline:'Official timing unchanged'}];
function setup(raw){const store={tops_reminder_progress_v1:raw};const c={SMART_REMINDERS:records,generateCriticalWindowReminders:()=>[{id:'cw-guard'}],window:{__safeGet:k=>store[k],__safeSet:(k,v)=>store[k]=v},followProgress:{},dismissedReminders:{},setFollowProgress:v=>c.followProgress=v,setDismissedReminders:v=>c.dismissedReminders=v};vm.createContext(c);vm.runInContext(helper+action,c);return{c,store};}
for(const raw of ['{','null','[]','"bad"']){const {c}=setup(raw);assert.equal(JSON.stringify(c.topsFollowRead()),'{}');}
let {c,store}=setup(JSON.stringify({bdd:{status:'waiting',date:'2026-02-30',note:'secret'},evil:{status:'working'},'cw-guard':{status:'working',date:'2026-09-24'}}));
assert.equal(c.topsFollowRead().bdd.date,'');assert.equal(c.topsFollowRead().bdd.note,undefined);assert.equal(c.topsFollowRead().evil,undefined);assert.equal(c.topsFollowRead()['cw-guard'].date,'2026-09-24');
assert.equal(c.saveFollowProgress('bdd','waiting','2026-09-24'),true);assert.equal(c.dismissedReminders.bdd,undefined);assert.equal(c.followProgress.bdd.status,'waiting');assert.equal(c.topsFollowRead().bdd.status,'waiting'); assert.equal(c.topsFollowRead().bdd.date,'2026-09-24');
assert.equal(c.saveFollowProgress('bdd','done',''),true);assert.equal(c.dismissedReminders.bdd,true);assert.equal(c.followProgress.bdd,undefined);
assert.equal(c.saveFollowProgress('bdd','working',''),true);assert.equal(c.dismissedReminders.bdd,undefined);
assert.equal(c.saveFollowProgress('bdd','clear',''),true);assert.equal(c.followProgress.bdd,undefined);
c.window.__safeSet=()=>{};assert.equal(c.saveFollowProgress('bdd','waiting',''),false);assert.equal(c.followProgress.bdd,undefined);
({c,store}=setup('{}'));c.window.__IS_IFRAME=true;c.window.__safeSet=()=>{throw Error('iframe must not write')};assert.equal(c.saveFollowProgress('bdd','working',''),true);assert.equal(c.followProgress.bdd.status,'working');
({c,store}=setup('{}'));c.followProgress={bdd:{status:'working',date:''}};store.tops_reminder_progress_v1=JSON.stringify(c.followProgress);let calls=0;c.window.__safeSet=(k,v)=>{calls++;if(calls===1)store[k]=v;};assert.equal(c.saveFollowProgress('bdd','done',''),'uncertain');assert.equal(c.dismissedReminders.bdd,undefined);
assert.equal(c.topsFollowDate('2028-02-29'),'2028-02-29');assert.equal(c.topsFollowDate('2026-02-29'),'');
console.log('FOLLOWTHROUGH PASS: malformed/unknown/extra fields; generated Guard IDs; impossible/leap dates; waiting does not complete; Done/reopen/clear; blocked write; iframe zero-write; partial rollback uncertainty');
