"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const cp = require("node:child_process");
const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "index.html"), "utf8");
const code = source.slice(source.indexOf('const TOPS_GAP_KEY ='), source.indexOf('\nfunction App() {'));
const storage = new Map([["unrelated", "retain"]]);
let denied = false, focused = null, touches = 0;
const localStorage = {
  getItem(key) { touches++; if (denied) throw new Error("denied"); return storage.has(key) ? storage.get(key) : null; },
  setItem(key, value) { touches++; if (denied) throw new Error("denied"); storage.set(key, value); },
  removeItem(key) { touches++; if (denied) throw new Error("denied"); storage.delete(key); }
};
const forbidden = () => { throw new Error("Worksheet must not contact or log answers"); };
const ctx = { localStorage, window: { __IS_IFRAME: false, __safeSet(k,v) { try { localStorage.setItem(k,v); } catch (_) {} }, __trackEvent: forbidden }, fetch: forbidden, console: {log: forbidden}, navigator: {sendBeacon: forbidden}, useEffect: f => f(), document: {getElementById(id) { return {focus() {focused=id;}}; }}, React: {createElement(type, props, ...children) {return {type,props:props||{},children:children.flat(Infinity)};}} };
vm.runInNewContext(code + '\nthis.api={empty:topsEmptyGap,validate:topsValidateGap,load:topsLoadGap,save:topsSaveGap,clear:topsClearGap,render:CareerGapWorksheet,key:TOPS_GAP_KEY};',ctx);
const api = ctx.api;
let state = api.load();
function nodes(n) { return !n || typeof n !== "object" ? [] : [n,...n.children.flatMap(nodes)]; }
function view() { return nodes(api.render({colors:{}, state, setState(next) {state=typeof next === "function" ? next(state) : next;}})); }
function field(id,value) {const n=view().find(n=>n.props.id===id); assert.ok(n,id);n.props.onChange({target:{value}});}
function click(label) {const n=view().find(n=>n.type==="button" && n.children.includes(label));assert.ok(n,label);n.props.onClick();}
assert.equal(view().filter(n=>n.type==="textarea").length,12);
assert.equal(focused,"career-gap-heading");
assert.deepEqual(view().filter(n=>n.type==="details").map(n=>n.props.open),[true,false,false]);
const labels = view().filter(n=>n.type==="label").map(n=>n.props.htmlFor);
for (const n of view().filter(n=>["input","textarea"].includes(n.type))) assert.ok(labels.includes(n.props.id));
const sentinel = '<img src=x onerror="fetch(\"SYNTHETIC_GAP_SENTINEL\")">';
field("career-gap-target",sentinel);field("career-gap-0-have",sentinel);
assert.equal(state.draft.target,sentinel);
assert.match(state.status,/Unsaved/);
assert.equal(api.load().draft.target,"");
assert.equal(storage.has(api.key),false,"edits alone never save");
click("Save on this browser");assert.match(state.status,/^Saved/);
assert.equal(api.load().draft.rows[0].have,sentinel,"saved reload exact including markup-looking plaintext");
assert.equal(view().find(n=>n.props.id==="career-gap-target").props.value,sentinel);
assert.ok(!view().some(n=>n.props.dangerouslySetInnerHTML));
field("career-gap-target","changed but unsaved");assert.equal(api.load().draft.target,sentinel);
click("Save on this browser");assert.equal(api.load().draft.target,"changed but unsaved");
click("Clear worksheet");assert.equal(state.draft.target,"");assert.equal(api.load().draft.target,"");assert.equal(storage.get("unrelated"),"retain");assert.equal(storage.has(api.key),false);
const valid=api.empty();valid.target="x".repeat(160);valid.rows[0].have="x".repeat(600);valid.rows[1].source="x".repeat(240);assert.ok(api.validate(valid));
for(const mutate of [d=>d.target="x".repeat(161),d=>d.rows[0].have="x".repeat(601),d=>d.rows[1].source="x".repeat(241),d=>d.rows.pop(),d=>d.rows[0].next=42,d=>d.version=2,d=>d.extra="x"]) { const d=api.empty();mutate(d);assert.equal(api.validate(d),null);assert.equal(api.save(d),false); }
for(const raw of ['{broken',JSON.stringify({version:1,target:"",rows:[]}),"x".repeat(10001)]) {storage.set(api.key,raw);const load=api.load();assert.equal(load.draft.target,"");assert.match(load.status,/could not be read/);}
api.clear();denied=true;field("career-gap-target","temporary");click("Save on this browser");assert.match(state.status,/^Not saved/);assert.equal(state.draft.target,"temporary");click("Clear worksheet");assert.match(state.status,/could not be removed/);assert.equal(state.draft.target,"");assert.match(api.load().status,/unavailable/);
denied=false;ctx.window.__IS_IFRAME=true;const before=touches;assert.equal(api.save(api.empty()),false);assert.equal(api.clear(),true);assert.match(api.load().status,/Embedded/);assert.equal(touches,before);assert.equal(view().find(n=>n.type==="button" && n.children.includes("Save on this browser")).props.disabled,true);
// Preserve all source task content, eligibility, IDs and restored flags.
const baseline=cp.execFileSync("git",["show","11eae368852ca736ec961c1d0074944037c1002a:index.html"],{cwd:root,encoding:"utf8",maxBuffer:4*1024*1024});
function block(s,start,end) {const a=s.indexOf(start);assert.ok(a>=0);return s.slice(a,s.indexOf(end,a));}
assert.equal(block(source,"const TRANSITION_MILESTONES =", "const NOTIFICATIONS ="),block(baseline,"const TRANSITION_MILESTONES =","const NOTIFICATIONS ="));
assert.equal(block(source,"function topsRestoreMilestones()", "function topsRestoreDocuments()"),block(baseline,"function topsRestoreMilestones()", "function topsRestoreDocuments()"));
assert.ok(source.includes('const [gapState, setGapState] = useState(topsLoadGap)'));
assert.doesNotMatch(code,/fetch\(|sendBeacon\(|__trackEvent\(|console\.|dangerouslySetInnerHTML|\.innerHTML|navigator\.clipboard/);
assert.doesNotMatch(source,/Federal format: longer|federal resumes are 4-6 pages|Federal resumes are 4-6 pages|No gap = apply now/);
const route = source.match(/t.id === "t12b" && React.createElement\("button", \{ type: "button", onClick: function\(\) \{ ([^}]+) \}/);
assert.ok(route, "Timeline worksheet route exists separately from task completion");
const nav = {};
vm.runInNewContext(route[1], {setPathwayMode(v) {nav.mode=v;},setPathwayStep(v) {nav.step=v;},setActiveTab(v) {nav.tab=v;}});
assert.deepEqual(nav,{mode:"planner",step:1,tab:"pathway"});
console.log("TAP INTEGRATION PASS: bounded schema; labeled fields; initial disclosures; entry focus; unsaved/saved reload; edit/clear isolation; malformed/denied/embed storage; markup plaintext; zero worksheet network/log/analytics calls; exact Timeline task/progress preservation; federal copy sweep");
