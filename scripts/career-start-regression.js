'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('index.html','utf8');
const slice=(a,b)=>{const first=source.indexOf(a),last=source.indexOf(b,first);assert.ok(first>=0&&last>first);return source.slice(first,last)};
const code=[slice('const TOPS_GAP_KEY =','function topsLoadGap('),slice('const TOPS_GUIDE_KEY =','function topsLoadGuide('),slice('const TOPS_ACTION_KEY =','function topsLoadAction('),slice('function topsSaveCareerSession(','function HumanSupportChoices(')].join('\n');
function fixture(mode){const data=new Map([['tops_personal_guide_v1','old guide'],['tops_career_action_v1','old step'],['tops_career_gap_v1','old worksheet']]);let writes=0;const ctx={window:{},localStorage:{getItem(k){if(mode==='read')throw Error('read');return data.get(k)??null;},setItem(k,v){writes++;if(mode==='rollback'&&writes===2)throw Error('write');if(mode==='partial'&&writes>=2)throw Error('write and rollback');if(mode==='silent'&&writes===2)return;data.set(k,v);},removeItem(k){data.delete(k);}}};vm.createContext(ctx);vm.runInContext(code,ctx);return{ctx,data,writes:()=>writes};}
const guide={version:1,pathway:'skills',currentRole:'Synthetic technician',targetRole:'Team lead',goal:'Advance where I work'};
const action={version:1,text:'Ask my supervisor about one responsibility.',date:'',done:false,context:guide};
for(const mode of ['normal','rollback','partial','silent','read']){const f=fixture(mode),before=JSON.stringify([...f.data]),gap=f.ctx.topsEmptyGap();gap.rows[0].have='SYNTHETIC retained experience';const result=f.ctx.topsSaveCareerSession(guide,action,gap);assert.equal(result.ok,mode==='normal');if(mode==='normal'){assert.equal(JSON.parse(f.data.get('tops_career_gap_v1')).rows[0].have,gap.rows[0].have);assert.equal(JSON.parse(f.data.get('tops_career_action_v1')).context.targetRole,guide.targetRole);}else if(mode==='partial'){assert.equal(result.reason,'partial');assert.notEqual(JSON.stringify([...f.data]),before);}else{assert.equal(JSON.stringify([...f.data]),before);assert.equal(result.reason,mode==='read'?'read':'restored');}}
for(const type of ['invalid','mismatch','iframe']){const f=fixture();const before=JSON.stringify([...f.data]);if(type==='iframe')f.ctx.window.__IS_IFRAME=true;const a=structuredClone(action);if(type==='invalid')a.text='x'.repeat(241);if(type==='mismatch')a.context.targetRole='Different role';assert.equal(f.ctx.topsSaveCareerSession(guide,a,f.ctx.topsEmptyGap()).ok,false);assert.equal(f.writes(),0);assert.equal(JSON.stringify([...f.data]),before);}
console.log('CAREER SAVE PASS: valid atomic-intent save, retained worksheet, denied and silently lost writes roll back, rollback failure honestly partial, read failure, iframe, invalid and stale-context rejection without writes.');

// Conversation starters are editable planning aids, never claims about qualifications.
const kitContext = vm.createContext({});
vm.runInContext(slice('function topsCareerActionKit(', 'function CareerStart('), kitContext);
for (const id of ['advance','training','change','leave']) {
  const kit=kitContext.topsCareerActionKit({id},'SYNTHETIC career field',null,'guard');
  assert.ok(kit.opener.length>30);assert.ok(kit.outcome.length>20);assert.ok(kit.service.includes('service commitments'));
  assert.equal(kitContext.topsCareerActionKit({id},'',null,'separated').service,'');
}
assert.ok(kitContext.topsCareerActionKit({id:'change'},'SYNTHETIC career field',null,'guard').opener.includes('SYNTHETIC career field'));
assert.ok(kitContext.topsCareerActionKit({id:'unknown'},'',null,'').opener.includes('practical step'));
console.log('ACTION KIT PASS: all four goals, member-provided role, optional Guard/Reserve context and safe unknown-goal fallback.');
