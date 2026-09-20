"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),cp=require("node:child_process");
const root=path.resolve(__dirname,"..");const source=fs.readFileSync(path.join(root,"index.html"),"utf8");
const code=source.slice(source.indexOf("const TOPS_GAP_KEY ="),source.indexOf("\nfunction App() {"));
const store=new Map([["unrelated","retained"]]);let writes=0,show=false,focus="",state;
const ctx={window:{__IS_IFRAME:false,__safeSet(k,v){writes++;store.set(k,v);}},localStorage:{getItem:k=>store.get(k)||null,removeItem:k=>store.delete(k)},useState:()=>[show,v=>{show=v;}],useEffect:f=>f(),document:{getElementById:id=>({focus(){focus=id;}})},React:{createElement:(type,props,...children)=>({type,props:props||{},children:children.flat(Infinity)})}};
vm.runInNewContext(code+'\nthis.api={empty:topsEmptyGap,validate:topsValidateGap,load:topsLoadGap,save:topsSaveGap,clear:topsClearGap,render:CareerGapWorksheet,key:TOPS_GAP_KEY};',ctx);const api=ctx.api;
const legacy={version:1,target:"SYNTHETIC legacy role",rows:Array.from({length:3},(_,i)=>({have:"SYNTHETIC evidence "+i,requirement:"",next:"",source:""}))};const legacyRaw=JSON.stringify(legacy);store.set(api.key,legacyRaw);
state=api.load();assert.equal(state.draft.version,2);assert.equal(JSON.stringify(state.draft.rows),JSON.stringify(legacy.rows));assert.equal(state.draft.target,legacy.target);assert.equal(store.get(api.key),legacyRaw);assert.equal(writes,0,"legacy load must not migrate persisted data");
function nodes(n){return !n||typeof n!=="object"?[]:[n,...n.children.flatMap(nodes)];}
function view(){return nodes(api.render({colors:{},state,setState:v=>{state=typeof v==="function"?v(state):v;}}));}
function click(label){const node=view().find(n=>n.type==="button"&&n.children.includes(label));assert.ok(node,label);node.props.onClick();}
function input(id,value){const node=view().find(n=>n.props.id===id);assert.ok(node,id);node.props.onChange({target:{value}});}
input("career-prep-opportunity","SYNTHETIC program");input("career-prep-questions","SYNTHETIC licensing question");input("career-prep-source",'<script>fetch("SYNTHETIC_NOT_A_REQUEST")</script>');input("career-prep-office","Education office");input("career-prep-followup","Ask about the entry requirement");input("career-prep-status","Waiting for a response");
assert.equal(writes,0,"editing does not migrate/save");click("Review counselor summary");let rendered=view();assert.equal(focus,"career-prep-summary-heading");
for(const text of [legacy.target,"SYNTHETIC program","SYNTHETIC licensing question","Education office","Waiting for a response",state.draft.prep.source])assert.ok(rendered.some(n=>n.children.includes(text)),text);
assert.ok(rendered.some(n=>n.children.includes("Contact status (reported by you)")));assert.ok(!rendered.some(n=>n.type==="dt"&&n.children.includes("Public office contact reference")),"blank optional field omitted");assert.ok(!rendered.some(n=>n.props.dangerouslySetInnerHTML));
click("Back to edit worksheet");view();assert.equal(focus,"career-gap-heading");assert.equal(state.draft.prep.opportunity,"SYNTHETIC program");assert.equal(writes,0,"summary and Back never persist");click("Save on this browser");assert.equal(writes,1);assert.equal(JSON.parse(store.get(api.key)).version,2);assert.equal(api.load().draft.prep.questions,"SYNTHETIC licensing question");
for(const mutate of [d=>d.prep.questions="x".repeat(601),d=>d.prep.opportunity="x".repeat(161),d=>d.prep.source="x".repeat(241),d=>d.prep.reference="x".repeat(161),d=>d.prep.followup="x".repeat(241),d=>d.prep.office="personal contact",d=>d.prep.status="accepted",d=>delete d.prep.questions,d=>d.prep.extra="unexpected",d=>d.version=3]){const d=api.empty();mutate(d);assert.equal(api.validate(d),null);store.set(api.key,JSON.stringify(d));assert.match(api.load().status,/could not be read/);}
const escaped=api.empty();escaped.target="\u0001".repeat(160);escaped.rows.forEach(r=>{for(const k of ["have","requirement","next"])r[k]="\u0001".repeat(600);r.source="\u0001".repeat(240);});for(const [key,max] of Object.entries({opportunity:160,source:240,questions:600,reference:160,followup:240}))escaped.prep[key]="\u0001".repeat(max);assert.equal(api.save(escaped),true);assert.equal(JSON.stringify(api.load().draft),JSON.stringify(escaped),"escaped max-length fields reload within bounded raw payload");
click("Clear worksheet");assert.equal(store.has(api.key),false);assert.equal(store.get("unrelated"),"retained");click("Review counselor summary");rendered=view();assert.equal(rendered.filter(n=>n.type==="dt").length,0);assert.ok(rendered.some(n=>n.children.includes("No notes entered yet. Return to the worksheet to add an occupation, gaps or questions.")));
assert.doesNotMatch(code,/fetch\(|sendBeacon\(|__trackEvent\(|console\.|dangerouslySetInnerHTML|\.innerHTML|navigator\.clipboard|window\.print/);
// Preserve pre-worksheet data and exact Resume state; Guard routing has its own regression.
const base=cp.execFileSync("git",["show","93e1a9e3274b5a08ef85132df726e81d18bf9901:index.html"],{cwd:root,encoding:"utf8",maxBuffer:4*1024*1024});
// Preserve the entire prefix after only the reviewed visual substitutions.
let expectedPrefix=base.slice(0,base.indexOf("const TOPS_GAP_KEY ="));
const actualPrefix=source.slice(0,source.indexOf("const TOPS_GAP_KEY ="));
function reviewedReplace(oldText,newText,count){assert.equal(expectedPrefix.split(oldText).length-1,count);expectedPrefix=expectedPrefix.split(oldText).join(newText);}
reviewedReplace('font-family:"Courier Prime","Courier New",monospace;color:var(--t-body-text)','font-family:"Source Sans 3",system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--t-body-text)',1);
reviewedReplace('.bottom-nav button .nav-label{font-size:10px;letter-spacing:1px;','.bottom-nav button .nav-label{font-size:12px;letter-spacing:0.2px;',1);
reviewedReplace('C.bg === "#FFFFFF"','C.isLight === true',2);
const themeBlock=text=>{const start=text.indexOf("const THEMES = {");const end=text.indexOf("\n};",start)+3;assert.ok(start>0&&end>start);return text.slice(start,end);};
const approvedTheme=themeBlock(actualPrefix);
assert.equal(require("node:crypto").createHash("sha256").update(approvedTheme).digest("hex"),"16124b7249e22b25bbecd79ccea0ef4fbe8c193246983de9fa0de9b06fcb1496");
reviewedReplace(themeBlock(expectedPrefix),approvedTheme,1);
assert.equal(actualPrefix,expectedPrefix);
assert.equal(source.slice(source.indexOf("const [aiR, setAiR]"),source.indexOf("const [jobsQ")),base.slice(base.indexOf("const [aiR, setAiR]"),base.indexOf("const [jobsQ")));
console.log("COUNSELOR PREPARATION PASS: v1 exact read/no write; explicit v2 save/reload; bounded/closed fields and enums; max escaped payload; deterministic partial/empty summary; member-reported status; plaintext source; focus/back edit; scoped clear; no worksheet network/log/analytics; pre-worksheet data and Resume state unchanged");
