"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),cp=require("node:child_process"),path=require("node:path");
const root=path.resolve(__dirname,".."),source=fs.readFileSync(path.join(root,"index.html"),"utf8");
const code=source.slice(source.indexOf("const TOPS_GAP_KEY ="),source.indexOf("\nfunction App() {"));
let area="national",show=false,opened=null,state,offer=null,writes=0;
const store=new Map();
const blocked=()=>{throw Error("Unexpected data transfer");};
const ctx={window:{__IS_IFRAME:false,__safeSet(k,v){writes++;store.set(k,v);}},localStorage:{getItem:k=>store.get(k)||null,removeItem:k=>store.delete(k)},useState:initial=>typeof initial==="string"?[area,v=>area=v]:[show,v=>show=v],useEffect:f=>f(),document:{getElementById:()=>({focus(){}})},fetch:blocked,navigator:{sendBeacon:blocked},React:{createElement:(type,props,...children)=>({type,props:props||{},children:children.flat(Infinity)})}};
vm.runInNewContext(code+'\nthis.api={render:GuardCareerSupport,gap:CareerGapWorksheet,empty:topsEmptyGap,save:topsSaveGap,load:topsLoadGap,key:TOPS_GAP_KEY};',ctx);const api=ctx.api;
function nodes(n){return !n||typeof n!=="object"?[]:[n,...n.children.flatMap(nodes)];}
function view(target=""){return nodes(api.render({colors:{},target,openPlan:v=>opened=v}));}
// Employer connection uses existing member entries without inventing a target or action.
let prepared=false;let employer=nodes(api.render({colors:{},target:"",opportunity:"SYNTHETIC training program",next:"Ask education office about prerequisites",openPlan:(office,prepare)=>{opened=office;prepared=prepare;}}));
assert.ok(employer.some(n=>n.children.includes("SYNTHETIC training program")));assert.ok(employer.some(n=>n.children.includes("Ask education office about prerequisites")));assert.ok(employer.some(n=>n.children.includes("Continue my career plan")));
employer.find(n=>n.children.includes("Plan my next career move")).props.onClick();assert.equal(opened,null);assert.equal(prepared,true);assert.equal(writes,0);
assert.ok(!view().some(n=>n.children.includes("Your next step: ")),"empty plan must not invent a next action");
const selection=source.match(/next: (gapState\.draft\.prep\.followup[^\n]+?), openPlan:/)[1];
for(const [followup,rows,expected] of [["Ask office",["Apply","Train",""],"Ask office"],["  ",["","Train","Apply"],"Train"],["",["","",""],""]]){assert.equal(vm.runInNewContext(selection,{gapState:{draft:{prep:{followup},rows:rows.map(next=>({next}))}}}),expected);}
const previous=cp.execFileSync("git",["show","e187622:index.html"],{cwd:root,encoding:"utf8",maxBuffer:4e6});assert.equal(source.slice(source.indexOf("const TOPS_GAP_KEY ="),source.indexOf("function CareerGapWorksheet")),previous.slice(previous.indexOf("const TOPS_GAP_KEY ="),previous.indexOf("function CareerGapWorksheet")),"existing v1/v2 schema and persistence remain exact");
let v=view();assert.ok(v.some(n=>n.children.includes("Work on my career plan")));assert.equal(v.filter(n=>n.type==="details").length,2);assert.ok(v.filter(n=>n.type==="details").every(n=>!n.props.open));
assert.ok(!v.some(n=>n.children.includes("Wisconsin Service Member Support")));
v.find(n=>n.type==="select").props.onChange({target:{value:"wi"}});v=view();assert.ok(v.some(n=>n.children.includes("Wisconsin Service Member Support")));assert.equal(writes,0);
v.find(n=>n.props["aria-label"]==="Prepare my question for Wisconsin Service Member Support").props.onClick();offer=opened;assert.equal(offer.url,"https://dma.wi.gov/service-member-support-division/");
assert.ok(view('<img src=x onerror="fetch(1)">').some(n=>n.children.includes("Continue my career plan")));assert.ok(!view().some(n=>n.props.dangerouslySetInnerHTML));
state={draft:api.empty(),status:"Loaded your saved worksheet from this browser."};state.draft.target="SYNTHETIC role";state.draft.prep.reference="SYNTHETIC retained reference";state.draft.prep.questions="SYNTHETIC question";state.draft.prep.status="Waiting for a response";
const before=JSON.stringify(state);
function gap(){return nodes(api.gap({colors:{},state,setState:f=>state=typeof f==="function"?f(state):f,officeOffer:offer,clearOfficeOffer:()=>offer=null}));}
assert.ok(gap().some(n=>n.children.includes("Replace public office reference")));assert.equal(JSON.stringify(state),before,"offer never changes notes or contact state");
gap().find(n=>n.children.includes("Replace public office reference")).props.onClick();assert.equal(state.draft.prep.reference,opened.url);assert.equal(state.draft.prep.questions,"SYNTHETIC question");assert.equal(state.draft.prep.status,"Waiting for a response");assert.equal(state.draft.target,"SYNTHETIC role");assert.equal(offer,null);assert.match(state.status,/Unsaved/);assert.equal(writes,0);
assert.equal(api.save(state.draft),true);assert.equal(api.load().draft.prep.reference,opened.url);assert.equal(writes,1);
for(const n of view().filter(n=>n.type==="a")){assert.match(n.props.href,/^https:\/\//);assert.ok(!n.props.onClick);}
const branchInit=source.match(/const \[onboardData, setOnboardData\] = useState\((function\(\) \{ var branch = [^\n]+)\);/)[1];
for(const saved of ["army","air_force","navy","marines","coast_guard","space_force","","unknown",'{"branch":"army"}']){const out=vm.runInNewContext('('+branchInit+')()',{window:{__safeGet:()=>saved}});assert.equal(out.branch,["army","air_force","navy","marines","coast_guard","space_force"].includes(saved)?saved:"");assert.equal(out.status,"");}
assert.equal(vm.runInNewContext('('+branchInit+')()',{window:{__safeGet(){throw Error("denied");}}}).branch,"");
const planning=source.slice(source.indexOf('// Planning to separate callout'),source.indexOf('// Share + VBS',source.indexOf('// Planning to separate callout')));assert.doesNotMatch(planning,/setUserStatus|__safeSet|setMilestones|setDismissed/);assert.match(planning,/setActiveTab\("timeline"\)/);
const open=source.match(/React.createElement\(GuardCareerSupport, \{ [^\n]*colors: C, target: gapState.draft.target,[^\n]+openPlan: function\(office, prepare\) \{ ([^}]+) \}/)[1];const route={};vm.runInNewContext(open,{setPrepareOpportunity:v=>route.prepare=v,setGuardOfficeOffer:v=>route.offer=v,setPathwayMode:v=>route.mode=v,setPathwayStep:v=>route.step=v,setActiveTab:v=>route.tab=v,office:null,prepare:false,window:{scrollTo(){}}});assert.deepEqual(route,{prepare:false,offer:null,mode:"planner",step:1,tab:"pathway"});
const base=cp.execFileSync("git",["show","a247c2e:index.html"],{cwd:root,encoding:"utf8",maxBuffer:4e6});
function region(s,a,b){const start=s.indexOf(a);assert.ok(start>=0);return s.slice(start,s.indexOf(b,start));}
for(const [a,b] of [["const SMART_REMINDERS =","const CRITICAL_WINDOWS ="],["const CRITICAL_WINDOWS =","const TOPS_BLENDER_ART ="],["const TRANSITION_MILESTONES =","const NOTIFICATIONS ="],["const [aiR, setAiR]","const [jobsQ"]])assert.equal(region(source,a,b),region(base,a,b));
assert.equal(region(source,'// Guard-specific intel card','// Quick links for more tools').replace(/\n        \),\n        $/,'\n        '),region(base,'// Guard-specific intel card','// Quick links for more tools'));
assert.doesNotMatch(code,/fetch\(|sendBeacon\(|__trackEvent\(|console\.|dangerouslySetInnerHTML/);
console.log("GUARD RESERVE PASS: no-date career route; plain target; collapsed guidance; national/WI memory-only selection; explicit reference replacement preserves notes/contact status; explicit save/reload; branch known/unknown/denied; component-safe Timeline navigation; exact policy/Resume/legacy guidance");
