'use strict';
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict'), path = require('node:path'), cp = require('node:child_process');
const source = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const helper = source.slice(source.indexOf('function topsFollowDate'), source.indexOf('function ReminderProgress'));
const c = { Date }; vm.createContext(c); vm.runInContext(helper, c);
const reminders = ['future', 'today', 'past', 'same', 'undated', 'invalid', 'done', 'dismissed', 'visible', 'today'].map(id => ({ id }));
const progress = Object.fromEntries(reminders.map(r => [r.id, { status: 'waiting', date: '' }]));
Object.assign(progress, { future: { status: 'working', date: '2026-09-21' }, today: { status: 'waiting', date: '2026-09-20' }, past: { status: 'working', date: '2026-09-19' }, same: { status: 'working', date: '2026-09-20' }, invalid: { status: 'waiting', date: '2026-02-30' }, done: { status: 'done', date: '2026-09-01' }, hiddenProfile: { status: 'waiting', date: '2026-09-01' } });
const result = c.topsExtraFollowups(reminders, progress, { dismissed: true }, [{ id: 'visible' }], new Date('2026-09-20T12:00:00'));
assert.equal(result.due, 3);
assert.equal(result.items.map(r => r.id).join(','), 'past,today,same,future,undated,invalid');
assert.equal(reminders[0].id, 'future');
console.log('PASS chronological dates; stable ties; undated and invalid last; today and past due; future excluded from due; completed/dismissed/visible/profile-inapplicable excluded; duplicate removed; inputs preserved');
if (!process.env.TOPS_DUE_TZ_CHILD) {
  for (const [tz, expected] of [['America/Los_Angeles', 0], ['Pacific/Kiritimati', 1]]) {
    const code = `const fs=require('fs'),vm=require('vm');const s=fs.readFileSync(${JSON.stringify(path.join(__dirname, '../index.html'))},'utf8');const c={Date};vm.createContext(c);vm.runInContext(s.slice(s.indexOf('function topsFollowDate'),s.indexOf('function ReminderProgress')),c);process.stdout.write(String(c.topsExtraFollowups([{id:'x'}],{x:{status:'waiting',date:'2026-09-20'}},{},[],new Date('2026-09-20T00:30:00Z')).due));`;
    assert.equal(cp.execFileSync(process.execPath, ['-e', code], { env: { ...process.env, TZ: tz, TOPS_DUE_TZ_CHILD: '1' }, encoding: 'utf8' }), String(expected));
    console.log('PASS local civil day boundary ' + tz);
  }
}
const start = source.indexOf('        extraFollowups.length > 0 && React.createElement("details"');
const end = source.indexOf('\n      ),', start);
const detailCode = source.slice(start, end).trim();
for (const count of [0, 1, 2]) {
  const context = { extraFollowups: [{id:'a', title:'Personal step'}], followupSummary: {due:count}, followProgress: {a:{status:'waiting',date:''}}, C:{}, topsFollowLabel: c.topsFollowLabel, openPlanRoute:()=>{}, React:{createElement:(type,props,...children)=>({type,props,children})} };
  const tree = vm.runInNewContext(detailCode, context), summary = tree.children[0];
  assert.equal(tree.type, 'details'); assert.equal(tree.props.open, undefined); assert.equal(summary.type, 'summary'); assert.equal(summary.props.style.minHeight, 44);
  assert.equal(summary.children[0], 'Continue what you started');
  if(count) assert.equal(summary.children[1].children[0], count + (count===1?' personal follow-up due':' personal follow-ups due')); else assert.equal(summary.children[1], false);
}
assert.ok(source.indexOf('urgentReminders.length > 0 && React.createElement("article"') < start);
console.log('PASS native collapsed details; unchanged title without due items; singular/plural visible personal count; minimum summary height; official priorities first');
