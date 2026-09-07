// Offline, in-memory synthetic checks. Node built-ins only; no browser or sends.
// Run from repo root: TZ=America/Chicago node scratchpad/alert-verification-synthetic.cjs
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
// Historical defect reproduction pinned to the pre-fix audit; use alert-persistence-test.cjs for current behavior.
const source = require('node:child_process').execFileSync('git', ['show', 'e073af5:index.html'], { cwd: path.join(__dirname, '..'), encoding: 'utf8' });
function unique(text) {
  assert.equal(source.split(text).length - 1, 1, `Non-unique source anchor: ${text}`);
  return source.indexOf(text);
}
const start = unique('const SMART_REMINDERS =');
const stop = unique('// CRITICAL WINDOWS MODULE');
assert(stop > start);
const engine = source.slice(start, stop);
const helpers = ['daysToETSDate', 'moToETS'].map(name => {
  unique(`function ${name}(`);
  const match = source.match(new RegExp(`function ${name}\\([^]*?\\n}`));
  assert(match, `Missing helper ${name}`);
  return match[0];
}).join('\n');
const storageHelpers = ['__safeGet', '__safeSet'].map(name => {
  unique(`window.${name} =`);
  const line = source.split('\n').find(line => line.startsWith(`window.${name} =`));
  assert(line, `Missing storage helper ${name}`);
  return line;
}).join('\n');
class Clock extends Date {
  constructor(...args) { super(...(args.length ? args : ['2026-09-07T12:00:00-05:00'])); }
  static now() { return Date.parse('2026-09-07T12:00:00-05:00'); }
}
let calls = 0;
const flush = () => new Promise(resolve => setImmediate(resolve));
function context(store = {}, failWrite = false, rejectShow = false) {
  const ctx = { Date: Clock, Notification: { permission: 'granted' }, __EMBED_MODE: false };
  ctx.localStorage = {
    getItem: key => store[key] ?? null,
    setItem: (key, value) => { if (failWrite) throw Error('synthetic storage failure'); store[key] = value; }
  };
  ctx.navigator = { serviceWorker: { ready: Promise.resolve({
    showNotification: () => {
      calls++;
      return rejectShow ? Promise.reject(Error('synthetic show rejection')) : Promise.resolve();
    }
  }) } };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(storageHelpers + '\n' + engine + '\n' + helpers, ctx);
  return ctx;
}
async function run() {
  assert.equal(process.env.TZ, 'America/Chicago', 'Run with TZ=America/Chicago');
  let store = {}, ctx = context(store);
  for (let i = 0; i < 6; i++) ctx.notifyDueRung('2027-09-07');
  await flush();
  assert.equal(calls, 1);
  console.log('same-load six calls: 1');
  for (let i = 0; i < 5; i++) { context(store).notifyDueRung('2027-09-07'); await flush(); }
  assert.equal(calls, 1);
  console.log('six sequential loads total: 1');
  calls = 0; store = {};
  context(store).notifyDueRung('2027-09-07');
  context(store).notifyDueRung('2027-09-07');
  await flush();
  assert.equal(calls, 2);
  console.log('two concurrent loads: 2');
  calls = 0;
  for (let i = 0; i < 6; i++) { context({}, true).notifyDueRung('2027-09-07'); await flush(); }
  assert.equal(calls, 6);
  console.log('failed storage six loads: 6');
  store = {}; ctx = context(store, false, true);
  ctx.notifyDueRung('2027-09-07'); await flush();
  assert.deepEqual(store, {}); assert.equal(ctx.__rungFiredThisOpen, false);
  console.log('show reject: {"store":{},"guard":false}');
  ctx = context();
  const results = JSON.parse(vm.runInContext(`JSON.stringify((() => {
    let groups = {}, suppressed = 0, inversions = 0;
    const ranks = {CRITICAL:0,HIGH:1,MEDIUM:2,ADVISORY:3};
    function dateAt(d) {
      let dt = new Date(); dt.setDate(dt.getDate() + d);
      return dt.getFullYear() + '-' + String(dt.getMonth()+1).padStart(2,'0') + '-' + String(dt.getDate()).padStart(2,'0');
    }
    for (let d = -1100; d <= 1100; d++) {
      const ds = dateAt(d), dues = dueRungs(ds, {});
      for (let j=1; j<dues.length; j++) if (ranks[dues[j-1].pri] > ranks[dues[j].pri]) inversions++;
      for (const r of SMART_REMINDERS) {
        if (!rungIsDue(r, ds)) continue;
        if (rungIsStale(r, ds)) suppressed++;
        const key = (Object.hasOwn(RUNG_DAY_TRIGGERS,r.id) ? 'DAY ' : 'MONTH ') + r.pri;
        const past = rungTriggerDay(r) - daysToETSDate(ds);
        const g = groups[key] || (groups[key] = {min:Infinity,max:-Infinity});
        g.min = Math.min(g.min,past); g.max = Math.max(g.max,past);
      }
    }
    const seen = Object.fromEntries(SMART_REMINDERS.filter(r=>r.id!=='r-p1-fedvip').map(r=>[r.id,true]));
    return {groups,suppressed,inversions,
      isolated44:dueRungs(dateAt(-44),seen).map(r=>r.id),
      isolated45:dueRungs(dateAt(-45),seen).map(r=>r.id),
      unisolated44:dueRungs(dateAt(-44),{}).map(r=>r.id),
      unisolated45:dueRungs(dateAt(-45),{}).map(r=>r.id)};
  })())`, ctx));
  assert.equal(results.suppressed, 0); assert.equal(results.inversions, 0);
  assert.deepEqual(results.isolated44, ['r-p1-fedvip']);
  assert.deepEqual(results.isolated45, []);
  assert.equal(results.unisolated44[0], 'r-p1');
  assert(!results.unisolated45.includes('r-p1-fedvip'));
  console.log('Chicago frozen-noon sweep:', JSON.stringify(results));
  console.log('PASS: synthetic checks only; no browser, iOS, or incident attribution tested.');
}
run().catch(error => { console.error(error); process.exitCode = 1; });
