"use strict";
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const s=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8'),serial=x=>JSON.parse(JSON.stringify(x)),store=new Map([['unrelated','keep']]);
const c={window:{__IS_IFRAME:false,__safeSet:(k,v)=>store.set(k,v)},localStorage:{getItem:k=>store.get(k)??null,removeItem:k=>store.delete(k)}};vm.createContext(c);
vm.runInContext(s.slice(s.indexOf('function topsFollowDate('),s.indexOf('function topsFollowRead('))+s.split('// PERSONAL_GUIDE_START\n')[1].split('// PERSONAL_GUIDE_END')[0]+'\nthis.a={empty:topsEmptyAction,valid:topsValidateAction,load:topsLoadAction,save:topsSaveAction,clear:topsClearAction,matches:topsActionMatches,guide:topsEmptyGuide};',c);
const a=c.a,g={...a.guide(),pathway:'skills',currentRole:'Equipment maintenance',goal:'Practice spreadsheets'},v={version:1,text:'Compare two evening classes',date:'2026-10-01',done:false,context:g};
assert.ok(a.valid(v));assert.ok(a.valid(a.empty()));assert.equal(a.load().draft.text,'');assert.equal(a.save(v),true);assert.deepEqual(serial(a.load().draft),v);assert.equal(a.matches(v,g),true);
for(const key of ['pathway','currentRole','targetRole','goal'])assert.equal(a.matches(v,{...g,[key]:key==='pathway'?'change':'changed'}),false);
for(const mutate of [x=>x.extra=1,x=>x.version=2,x=>x.text='x'.repeat(241),x=>x.text='\n',x=>x.text=' ',x=>x.text='',x=>x.date='2026-02-30',x=>x.date=['2026-10-01'],x=>x.done='true',x=>x.context=null,x=>x.context.pathway=['skills'],x=>x.context.extra=1]){const bad=serial(v);mutate(bad);assert.equal(a.valid(bad),null);}
assert.equal(a.valid({...a.empty(),done:true}),null);assert.equal(a.valid({...a.empty(),date:'2026-10-01'}),null);
for(const raw of ['{','null','[]','x'.repeat(6001)]){store.set('tops_career_action_v1',raw);assert.equal(a.load().draft.text,'');assert.equal(store.get('tops_career_action_v1'),raw);}
store.set('tops_career_action_v1',JSON.stringify(v));c.window.__safeSet=()=>{};assert.equal(a.save({...v,done:true}),false);c.window.__IS_IFRAME=true;assert.equal(a.save(v),false);assert.equal(a.load().draft.text,'');assert.equal(a.clear(),true);assert.equal(store.has('tops_career_action_v1'),true);c.window.__IS_IFRAME=false;
const remove=c.localStorage.removeItem;c.localStorage.removeItem=()=>{throw Error('blocked')};assert.equal(a.clear(),false);c.localStorage.removeItem=remove;assert.equal(a.clear(),true);assert.equal(store.get('unrelated'),'keep');
console.log('CAREER ACTION HELPERS PASS: strict shape/types/bounds/date/context; four guide drift fields; empty/corrupt/oversize; verified save/failure; iframe; scoped clear/failure; unrelated storage preserved');
