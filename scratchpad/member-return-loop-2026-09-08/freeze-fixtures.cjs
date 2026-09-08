'use strict';
// Setup only: bind recovered U1-U8 before baseline; refuses to overwrite the freeze.
const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),path=require('node:path');
const root=path.resolve(__dirname,'../..'),source=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
if(sha(source)!=='b8b653776e7182afa9c09f7909869752a8c8a2a887ee2393d3148eec41cef27e')throw Error('Not unchanged baseline');
const literal=n=>JSON.parse(JSON.stringify(vm.runInNewContext('('+source.match(new RegExp('const '+n+' = (\\[[\\s\\S]*?\\]);'))[1]+')')));
const canonical={milestones:literal('TRANSITION_MILESTONES'),documents:literal('DOCUMENT_VAULT'),reminders:literal('SMART_REMINDERS')};
const clone=x=>JSON.parse(JSON.stringify(x)),now='2026-09-08T15:00:00.000Z';
const base={tops_onboarded:'1',tops_user_status:'active',etsDate:'2028-03-08',tops_sep_date:'2028-03-08',tops_whatsnew_seen:'v96',tops_tracked_onboarding:'1',tops_last_snapshot:JSON.stringify({ts:Date.parse(now)-7*86400000,policy:literal('POLICY_CHANGES').length,days:554})};
function task(id,target,description,options={}){
  const milestones=clone(canonical.milestones),documents=clone(canonical.documents);
  const m=milestones.find(m=>m.tasks.some(t=>t.id===target));
  for(const row of milestones)for(const t of row.tasks)t.done=row.id<=m.id&&t.id!==target;
  if(options.second){for(const t of m.tasks)t.done=t.id==='t1';}
  const storage={...base,taskProgress:JSON.stringify(milestones),docProgress:JSON.stringify(documents)};
  if(options.date)storage.etsDate=storage.tops_sep_date=options.date;
  if(options.status)storage.tops_user_status=options.status;
  if(options.legacy){const saved=clone(milestones);saved.find(x=>x.id===m.id).tasks.find(t=>t.id===target).text='OBSOLETE TASK FIXTURE';storage.taskProgress=JSON.stringify(saved);}
  return {id,description,kind:'task',target,phase:m.phase,milestone:m.id,text:m.tasks.find(t=>t.id===target).text,storage,expected:{milestones,documents},previousVisit:options.previousVisit||'2026-09-01T15:00:00.000Z',dateRationale:options.dateRationale||'18 calendar months to separation; no phase crossing during the seven-day return.'};
}
function doc(id,legacy){const milestones=clone(canonical.milestones),documents=clone(canonical.documents);documents.forEach((d,i)=>d.obtained=i<4);const storage={...base,taskProgress:JSON.stringify(milestones),docProgress:JSON.stringify(documents)};if(legacy){const saved=clone(documents);saved[11].name='OBSOLETE DOCUMENT FIXTURE';saved[11].notes='OBSOLETE NOTES FIXTURE';storage.docProgress=JSON.stringify(saved);}return {id,description:legacy?'Return with legacy document content':'Record another obtained document',kind:'document',target:'d12',text:documents[11].name,storage,expected:{milestones,documents}};}
const cases=[task('U1','t3','Finish the remaining current milestone task'),task('U2','t2','Resume the second task after the first was completed',{second:true}),doc('U3',false)];
const allM=clone(canonical.milestones),allD=clone(canonical.documents);allM.forEach(m=>m.tasks.forEach(t=>t.done=true));allD.forEach(d=>d.obtained=true);
const dismissed=Object.fromEntries(canonical.reminders.filter(r=>r.id!=='r-18-res').map(r=>[r.id,true]));
cases.push({id:'U4',description:'Complete the isolated applicable Resume-development reminder without using AI',kind:'reminder',target:'r-18-res',text:canonical.reminders.find(r=>r.id==='r-18-res').title,storage:{...base,taskProgress:JSON.stringify(allM),docProgress:JSON.stringify(allD),tops_dismissed_reminders:JSON.stringify(dismissed)},expected:{milestones:allM,documents:allD,dismissed},dateRationale:'Existing Home rule r.mo - moToETS in [-1,3]; month18 reminder at month18. All others already complete, including earlier r-24-itp. No eligibility claim.'});
cases.push(task('U5','t3','Legacy task prose must not override canonical text',{legacy:true}),doc('U6',true),task('U7','t20','Continue using the date edited on the previous visit',{date:'2027-03-08',dateRationale:'Previous visit changed date from 2028-03-08 to 2027-03-08; current six-month milestone4. Earlier three milestones complete.'}),task('U8','t38','Resume the remaining post-separation task',{date:'2026-07-08',status:'separated',previousVisit:'2026-08-08T15:00:00.000Z',dateRationale:'Separation two months before frozen return; previous visit one month earlier; milestone7 post-separation.'}));
const manifest={protocol:'Recovered v1 U1-U8; latest direct scope; SITREP OUT',baselineCommit:'e9a84fe2c94cecd4b76b70880fc3a76a36e1e469',baselineSha256:sha(source),frozenAt:new Date().toISOString(),clock:now,timezone:'America/Chicago',viewport:{width:390,height:844},navigationBudget:2,metric:'R=(F_B-F_C)/F_B if F_B>0; target>=0.5; N=8; no candidate regression',routes:'Any visible current Home route. Baseline Documents via More tools then Documents; Timeline via tab then phase; reminder via Next Action then header. Scroll/focus not navigation activations.',canonical,cases};
const bytes=JSON.stringify(manifest,null,2).replace(/[\u007f-\uffff]/g,c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0'))+'\n';
fs.writeFileSync(path.join(__dirname,'fixtures-v1.json'),bytes,{flag:'wx'});
fs.writeFileSync(path.join(__dirname,'fixtures-v1.sha256'),sha(bytes)+'  fixtures-v1.json\n',{flag:'wx'});
console.log('FROZEN 8 episodes before baseline; SHA256='+sha(bytes));
