'use strict';
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict'), crypto = require('node:crypto');
const source = '/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops/index.html';
const html = fs.readFileSync(source, 'utf8');
const start = html.indexOf('const TOPS_STATE_HELP_NEEDS =');
const end = html.indexOf('function StateLocalHelp(props)', start);
assert(start > 0 && end > start);
const ctx = { URL };
vm.createContext(ctx);
vm.runInContext(html.slice(start, end) + '\nglobalThis.data={needs:TOPS_STATE_HELP_NEEDS,situations:TOPS_STATE_HELP_SITUATIONS,records:TOPS_STATE_HELP_RECORDS,normalize:topsStateHelpContext,read:topsReadStateHelpURL,items:topsStateHelpItems,saved:topsStateHelpSavedAction,defaults:topsStateHelpDefault};', ctx);
const d = ctx.data, serial = x=>JSON.parse(JSON.stringify(x));
let combinations = 0, resumable = new Map();
for(const area of ['national','wi']) for(const [situation] of d.situations) for(const [need] of d.needs) {
  const c={area,situation,need}, items=d.items(c);
  assert(items.length, JSON.stringify(c));
  assert(items.every(i=>i.area===area), 'cross-state records');
  if(area==='national') assert(items.every(i=>!/(Wisconsin|dva\.wi|dma\.wi|dwd\.wisconsin)/i.test([i.title,i.summary,i.caveat,i.url].join(' '))), 'Wisconsin leakage');
  if(need==='education'&&area==='wi') {
    assert(items.some(i=>i.id==='WI-20261016-04'), 'Guard tuition hidden');
    assert.equal(items[0].id, situation==='guard'?'WI-20261016-04':'WI-20261016-03');
  }
  if(need==='moving'&&area==='wi') assert.equal(items[0].id,'WI-20261016-10');
  if(situation==='orders'&&['start','service'].includes(need)) assert.equal(items[0].verification,'WI-20261016-USERRA');
  const main=items[0], restore=d.saved(main.action), resumed=d.items(restore);
  assert.equal(resumed[0].id,main.id,'saved action changes primary '+main.id);
  resumable.set(main.id,serial(restore));
  combinations++;
}
assert.equal(d.defaults('guard').situation,'serving');
assert.equal(d.defaults('retired').situation,'veteran');
assert.equal(d.saved('an edited, unrecognized action'),null);
const base='https://example.test/?tool=resources&view=state-help';
for(const query of ['&area=wi&area=national','&need=bogus','&situation=constructor','&area=wi&situation=guard&need=education&need=service']) assert.deepEqual(serial(d.read(base+query)),{area:'national',situation:'browse',need:'start'});
const ids=d.records.map(r=>r.id);assert.equal(new Set(ids).size,ids.length);
assert.equal(new Set(d.records.map(r=>r.action)).size,d.records.length);
const log=fs.readFileSync('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops/intel/verification-log.md','utf8');
for(const record of d.records) assert(log.includes('## '+record.verification+' '),'missing verification '+record.verification);
const result={checked:'2026-10-16',evidence:'executed deterministic source helpers, no browser or provider calls',index_sha256:crypto.createHash('sha256').update(html).digest('hex'),combinations,records:d.records.length,resumable:[...resumable].map(([id,context])=>({id,context})),checks:['all state/situation/need combinations nonempty','national records do not include Wisconsin referrals','Guard tuition visible for all WI education, primary only explicit Guard','ordinary moving routes to DOR first','orders routes to DOL for start/service','every reachable saved primary reopens same primary record','profile Guard remains unspecified serving','malformed and duplicate URL IDs safely fall back','all record IDs/action strings unique','every record has verification-log entry'],result:'PASS'};
fs.writeFileSync(__dirname+'/state-contract.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
