'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
for(const [file,id] of [['index.html','tops-theme-prepaint'],['va-math/index.html','tops-guide-theme'],['bdd-timeline/index.html','tops-guide-theme']]){
 const s=fs.readFileSync(path.join(root,file),'utf8'), code=s.match(new RegExp('<script id="'+id+'">([\\s\\S]*?)</script>'))[1];
 for(const [saved,iframe,blocked,want] of [['tactical',false,false,'tactical'],['professional',false,false,'professional'],['bad',false,false,'professional'],[null,false,false,'professional'],['tactical',true,false,'professional'],['tactical',false,true,'professional']]){
  let actual,reads=0;const self={};vm.runInNewContext(code,{window:{top:iframe?{}:self,self},localStorage:{getItem:k=>{reads++;assert.equal(k,'tops_theme');if(blocked)throw Error('unavailable');return saved;},setItem:()=>{throw Error('unexpected write');}},document:{documentElement:{setAttribute:(k,v)=>{assert.equal(k,'data-tops-theme');actual=v;}}}});
  assert.equal(actual,want);if(iframe)assert.equal(reads,0);
 }
 console.log('PASS '+file+' prepaint saved dark/light; fresh/invalid/blocked cream; iframe no read; no writes');
}
const s=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.ok(s.includes('var obC = C;'));
assert.ok(s.includes('background: C.isLight ? C.bg : "#1A2114"'));
assert.ok(s.includes('WebkitTextFillColor: C.isLight ? C.textPrimary : "#F2EFE4"'));
assert.ok(s.includes('background: "#FDFDF8"'));
assert.ok(s.includes(':root:not([data-tops-theme="tactical"]) .seo-content'));
console.log('PASS setup follows theme; Navigator typed text matches theme; paper preview preserved; no-JS fallback palette defined');
