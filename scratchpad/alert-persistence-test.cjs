// Authoritative persistence regression with stubbed locks. Node built-ins only; no network or browser.
// TZ=America/Chicago node scratchpad/alert-persistence-test.cjs
const fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const assert = require('node:assert/strict');
assert.equal(process.env.TZ, 'America/Chicago');
const src = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
function anchor(text) { assert.equal(src.split(text).length - 1, 1); return src.indexOf(text); }
// Test-only activation in the isolated VM; production remains OFF.
const engine = 'const TOPS_PUSH_ENABLED = true;\n' + src.slice(anchor('const SMART_REMINDERS ='), anchor('// CRITICAL WINDOWS MODULE'));
const helpers = ['daysToETSDate', 'moToETS'].map(name => {
  anchor(`function ${name}(`);
  return src.match(new RegExp(`function ${name}\\([^]*?\\n}`))[0];
}).join('\n');
const KEY = 'tops_rung_ledger_v1', DAY = 'Mon Sep 07 2026', ETS = '2027-09-07';
const deferred = () => { let resolve, reject; const promise = new Promise((a,b)=>{resolve=a;reject=b;}); return {promise,resolve,reject}; };
const tick = () => new Promise(resolve => setImmediate(resolve));
function fixture(store = {}, options = {}) {
  let now = Date.parse('2026-09-07T12:00:00-05:00');
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return now; }
  }
  const f = {store,calls:[],logs:[],events:[],writes:[],setNow:s=>{now=Date.parse(s);}};
  let reads = 0;
  const localStorage = {
    getItem(key) { assert(f.lockHeld); reads++; if (options.read) return options.read(key,store,reads,f); return store[key] ?? null; },
    setItem(key,value) {
      assert(f.lockHeld); f.writes.push(key);
      if (options.write) return options.write(key,value,store,f.writes.length,f);
      store[key]=value;
    }
  };
  const reg = {showNotification(title, payload) {
    assert(f.lockHeld);
    // Every request must have a verified, durable pending entry, never delivered.
    const ledger = JSON.parse(store[KEY]);
    assert.equal(ledger.pending.id, payload.tag.slice(4));
    assert.equal(ledger.delivered[ledger.pending.id], undefined);
    f.calls.push(payload.tag);
    return options.show ? options.show(f) : Promise.resolve();
  }};
  const ctx = {Date:Clock,localStorage,console:{warn:s=>f.logs.push(s)},
    Notification:{permission:options.permission || 'granted'},
    navigator:{serviceWorker:{ready:options.ready || Promise.resolve(reg)}}};
  f.lockRequests = []; f.lockHeld = false;
  ctx.navigator.locks = options.locks === null ? undefined : (options.locks || {
    async request(name, config, callback) {
      assert.equal(name, 'tops-local-rung-v1'); assert.equal(config.mode, 'exclusive');
      f.lockRequests.push(name); f.lockHeld = true;
      try { return await callback(); } finally { f.lockHeld = false; }
    }
  });
  ctx.window=ctx; ctx.__trackEvent=(...args)=>{f.events.push(args);if(options.trackThrow)throw Error('analytics');};
  vm.createContext(ctx);vm.runInContext(engine+'\n'+helpers,ctx);
  f.ctx=ctx;f.reg=reg;f.notify=(date=ETS)=>ctx.notifyDueRung(date);
  f.ledger=()=>JSON.parse(store[KEY]);
  return f;
}
let passed=0;
async function test(name,fn) { await fn(); passed++; console.log('PASS '+name); }
async function blockedReload(store, expected='blocked-pending') {
  const next=fixture(store);assert.equal((await next.notify()).status,expected);assert.equal(next.calls.length,0);
}
async function run() {
  await test('normal: pending before show, delivered after fulfillment, daily cap across six reloads',async()=>{
    const store={}, show=deferred(), f=fixture(store,{show:()=>show.promise});
    const result=f.notify();assert.equal(typeof result.then,'function');await tick();
    assert(f.ledger().pending);assert.equal(f.events.length,0);
    assert.equal((await f.notify()).status,'blocked-this-open');
    show.resolve();assert.equal((await result).status,'delivered');
    assert.equal(f.ledger().pending,null);assert.equal(f.ledger().lastFired,DAY);
    assert.equal(f.events.length,1);
    for(let i=0;i<6;i++)await blockedReload(store,'blocked-daily-cap');
    assert.equal(f.calls.length,1);
  });
  await test('denied storage reads: six loads, zero requests, explicit status',async()=>{
    for(let i=0;i<6;i++){const f=fixture({}, {read:()=>{throw Error('denied');}});
      assert.equal((await f.notify()).status,'blocked-state-read-or-validation');assert.equal(f.calls.length,0);
      assert(f.logs.some(s=>s.includes('blocked-state')));}
  });
  await test('denied reservation writes: six loads, zero requests',async()=>{
    for(let i=0;i<6;i++){const f=fixture({}, {write:()=>{throw Error('denied');}});
      assert.equal((await f.notify()).status,'blocked-reservation-unverified');assert.equal(f.calls.length,0);}
  });
  await test('silent reservation no-op: verify mismatch blocks show',async()=>{
    const f=fixture({}, {write:()=>{}});assert.equal((await f.notify()).status,'blocked-reservation-unverified');assert.equal(f.calls.length,0);
  });
  await test('reservation read-back denied: pending survives and reload stays blocked',async()=>{
    const store={},f=fixture(store,{read:(key,s,n,f)=>{if(key===KEY&&f.writes.length)throw Error('readback');return s[key]??null;}});
    assert.equal((await f.notify()).status,'blocked-reservation-unverified');assert.equal(f.calls.length,0);await blockedReload(store);
  });
  for(const mode of ['throw','noop']) await test('final write '+mode+': one request, pending retained across six reloads',async()=>{
    const store={},f=fixture(store,{write:(k,v,s,n)=>{if(n===2){if(mode==='throw')throw Error('final');return;}s[k]=v;}});
    assert.equal((await f.notify()).status,'blocked-final-persistence-unverified');assert.equal(f.events.length,0);
    assert(f.ledger().pending);assert.deepEqual(f.ledger().delivered,{});
    for(let i=0;i<6;i++)await blockedReload(store);assert.equal(f.calls.length,1);
  });
  await test('final read-back denied after committed write: no success claim, no reload repeat',async()=>{
    const store={},f=fixture(store,{read:(k,s,n,f)=>{if(k===KEY&&f.writes.length===2)throw Error('verify');return s[k]??null;}});
    assert.equal((await f.notify()).status,'blocked-final-persistence-unverified');assert.equal(f.events.length,0);
    await blockedReload(store,'blocked-daily-cap');
  });
  await test('definite rejection: verified cleanup permits same-load retry',async()=>{
    let reject=true;const f=fixture({}, {show:()=>reject?Promise.reject(Error('show')):Promise.resolve()});
    assert.equal((await f.notify()).status,'show-rejected-retryable');assert.equal(f.ledger().pending,null);
    assert.deepEqual(f.ledger().delivered,{});reject=false;assert.equal((await f.notify()).status,'delivered');
  });
  await test('rejection cleanup denied: pending blocks same load and reload',async()=>{
    const store={},f=fixture(store,{show:()=>Promise.reject(Error('show')),write:(k,v,s,n)=>{if(n===2)throw Error('cleanup');s[k]=v;}});
    assert.equal((await f.notify()).status,'blocked-rejection-cleanup-unverified');
    assert.equal((await f.notify()).status,'blocked-this-open');await blockedReload(store);
  });
  await test('rejection cleanup no-op: read-back mismatch remains blocked',async()=>{
    const store={},f=fixture(store,{show:()=>Promise.reject(Error('show')),write:(k,v,s,n)=>{if(n!==2)s[k]=v;}});
    assert.equal((await f.notify()).status,'blocked-rejection-cleanup-unverified');await blockedReload(store);
  });
  for(const mode of ['throw','nonpromise'])await test('ambiguous show '+mode+': pending never auto-expires',async()=>{
    const store={},f=fixture(store,{show:()=>{if(mode==='throw')throw Error('uncertain');}});
    assert.equal((await f.notify()).status,'blocked-show-uncertain');
    const next=fixture(store);next.setNow('2026-10-07T12:00:00-05:00');
    assert.equal((await next.notify()).status,'blocked-pending');assert.equal(next.calls.length,0);
  });
  await test('unsettled show: fresh context blocked while completion unknown',async()=>{
    const store={},show=deferred(),f=fixture(store,{show:()=>show.promise});
    const result=f.notify();await tick();await blockedReload(store);show.resolve();await result;
  });
  for(const [key,value] of [[KEY,'{'],[KEY,'null'],[KEY,'[]'],[KEY,'{"version":2}'],
    ['tops_rung_notified','{'],['tops_rung_notified','null'],['tops_rung_notified','[]'],
    ['tops_rung_notified','{"r-12-bdd":false}'],['tops_rung_last_fired','garbage']]) {
    await test('malformed '+key+' '+value,async()=>{
      const f=fixture({[key]:value});assert.equal((await f.notify()).status,'blocked-state-read-or-validation');assert.equal(f.calls.length,0);assert.equal(f.writes.length,0);
    });
  }
  await test('legacy history migrated; legacy same-day cap preserved even with new ledger',async()=>{
    const store={tops_rung_notified:'{"r-12-bdd":true}'};const f=fixture(store);
    assert.equal((await f.notify()).status,'delivered');assert.equal(f.ledger().delivered['r-12-bdd'],true);
    assert.notEqual(f.calls[0],'ets-r-12-bdd');
    store.tops_rung_last_fired=DAY;await blockedReload(store,'blocked-daily-cap');
    const legacyOnly=fixture({tops_rung_last_fired:DAY});assert.equal((await legacyOnly.notify()).status,'blocked-daily-cap');assert.equal(legacyOnly.calls.length,0);
  });
  for(const key of ['tops_rung_notified','tops_rung_last_fired'])await test('legacy write denied for '+key+': no mirror writes, authoritative ledger intact',async()=>{
    const store={},f=fixture(store,{write:(k,v,s)=>{if(k===key)throw Error('legacy denied');s[k]=v;}});
    assert.equal((await f.notify()).status,'delivered');assert.deepEqual(f.writes,[KEY,KEY]);await blockedReload(store,'blocked-daily-cap');
  });
  await test('read failure of either legacy key blocks migration',async()=>{
    for(const key of ['tops_rung_notified','tops_rung_last_fired']){
      const f=fixture({}, {read:(k,s)=>{if(k===key)throw Error('legacy read');return s[k]??null;}});
      assert.equal((await f.notify()).status,'blocked-state-read-or-validation');assert.equal(f.calls.length,0);
    }
  });
  await test('midnight worker wait re-evaluates date: isolated +44 becomes excluded +45',async()=>{
    const ready=deferred(),f=fixture({}, {ready:ready.promise});
    const ids=vm.runInContext('SMART_REMINDERS.map(r=>r.id)',f.ctx);
    f.store.tops_rung_notified=JSON.stringify(Object.fromEntries(ids.filter(id=>id!=='r-p1-fedvip').map(id=>[id,true])));
    const result=f.notify('2026-07-25');f.setNow('2026-09-08T00:01:00-05:00');ready.resolve(f.reg);
    assert.equal((await result).status,'no-due-rung');assert.equal(f.calls.length,0);
  });
  await test('worker wait uses new calendar day rather than yesterday legacy cap',async()=>{
    const ready=deferred(),f=fixture({tops_rung_last_fired:DAY},{ready:ready.promise});
    const result=f.notify();f.setNow('2026-09-08T00:01:00-05:00');ready.resolve(f.reg);
    assert.equal((await result).status,'delivered');assert.equal(f.ledger().lastFired,'Tue Sep 08 2026');
  });
  await test('show spanning midnight caps completion day',async()=>{
    const show=deferred(),f=fixture({}, {show:()=>show.promise}),result=f.notify();await tick();
    f.setNow('2026-09-08T00:01:00-05:00');show.resolve();await result;
    assert.equal(f.ledger().lastFired,'Tue Sep 08 2026');
  });
  await test('analytics exception cannot turn delivered into retry',async()=>{
    const f=fixture({}, {trackThrow:true});assert.equal((await f.notify()).status,'delivered');assert.equal((await f.notify()).status,'blocked-this-open');
  });
  await test('permission denied: no reservation or show',async()=>{
    const f=fixture({}, {permission:'denied'});assert.equal((await f.notify()).status,'skipped-permission-or-worker');assert.equal(f.writes.length,0);assert.equal(f.calls.length,0);
  });
  await test('absent native locks: explicit failure, no storage writes or notification',async()=>{
    const f=fixture({}, {locks:null});
    assert.equal((await f.notify()).status,'blocked-lock-unavailable');
    assert.equal(f.calls.length,0);assert.equal(f.writes.length,0);
    assert(f.logs.some(s=>s.includes('blocked-lock-unavailable')));
  });
  await test('rejected native lock: explicit failure, no fallback or notification',async()=>{
    const f=fixture({}, {locks:{request:()=>Promise.reject(Error('lock denied'))}});
    assert.equal((await f.notify()).status,'blocked-lock-rejected');
    assert.equal(f.calls.length,0);assert.equal(f.writes.length,0);
    assert(f.logs.some(s=>s.includes('blocked-lock-rejected')));
  });
  await test('lock acquired only after readiness, held until show and finalization finish',async()=>{
    const ready=deferred(),show=deferred(),f=fixture({}, {ready:ready.promise,show:()=>show.promise});
    const result=f.notify();await tick();assert.equal(f.lockRequests.length,0);
    ready.resolve(f.reg);await tick();assert.equal(f.lockHeld,true);assert.equal(f.lockRequests.length,1);
    show.resolve();assert.equal((await result).status,'delivered');assert.equal(f.lockHeld,false);
    assert.equal(f.ledger().pending,null);
  });
  console.log(`${passed}/${passed} PASS; stubbed locks and persistence only. Native browser concurrency, old-version contexts and iOS NOT certified.`);
}
run().catch(e=>{console.error(e);process.exitCode=1;});
