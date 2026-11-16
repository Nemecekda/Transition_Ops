'use strict';
// Synthetic fixtures only. Every external request is blocked; no model API is called.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http'), os = require('node:os'), { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..'), utility = fs.readFileSync(path.join(__dirname, 'privacy-network-regression.js'), 'utf8');
const h = new Function('fs', 'path', 'os', 'spawn', utility.slice(utility.indexOf('function findChrome()'), utility.indexOf('const PROBE_SCRIPT =')) + '\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs, path, os, spawn);
const posts = [], requests = [], errors = [];
const fixture = { id: '123', title: 'SYNTHETIC Data Analyst', agency: 'Example employer', location: 'Milwaukee, WI', salary: '$30 Per Hour', closingDate: '2099-12-31', whoMayApply: 'Open to the public', qualifications: 'Analyze data and explain findings to project teams.', url: 'https://www.usajobs.gov/job/123' };
const server = http.createServer(async (req, res) => {
  requests.push(req.url);
  if (req.url.startsWith('/.netlify/functions/federal-jobs')) {
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'GET') return res.end(JSON.stringify({ available: true, provider: 'USAJOBS' }));
    let raw = ''; for await (const part of req) raw += part; posts.push(JSON.parse(raw));
    return res.end(JSON.stringify({ source: 'USAJOBS', scope: 'public', retrievedAt: '2026-11-15T12:00:00Z', jobs: [fixture] }));
  }
  const f = path.join(root, new URL(req.url, 'http://localhost').pathname === '/' ? 'index.html' : new URL(req.url, 'http://localhost').pathname);
  if (!fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', f.endsWith('.js') ? 'text/javascript' : f.endsWith('.html') ? 'text/html' : 'application/octet-stream'); res.end(fs.readFileSync(f));
});
(async () => {
  let chrome;
  try {
    await new Promise(r => server.listen(0, '127.0.0.1', r));
    const origin = 'http://127.0.0.1:' + server.address().port;
    chrome = await h.launchChrome(h.findChrome(), 12); const c = chrome.client;
    await c.send('Page.enable'); await c.send('Runtime.enable');
    c.on('Runtime.exceptionThrown', e => errors.push(e.exceptionDetails.text));
    await c.send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
    c.on('Fetch.requestPaused', async e => { const local = e.request.url.startsWith(origin); try { await c.send(local ? 'Fetch.continueRequest' : 'Fetch.failRequest', local ? { requestId: e.requestId } : { requestId: e.requestId, errorReason: 'BlockedByClient' }); } catch {} });
    const ev = s => h.evaluate(c, s, true), wait = s => h.waitForExpression(c, s, s, 12000), frames = () => ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
    const load = async (route = '/?tool=dashboard') => { await c.send('Page.navigate', { url: origin + route }); await wait('!!document.getElementById("tops-main-content")||!!document.getElementById("tops-first-visit")'); await frames(); };
    const click = async id => { await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});if(!n||!n.checkVisibility()||n.disabled)throw Error('Unavailable '+${JSON.stringify(id)});n.click()})()`); await frames(); };
    const textClick = async text => { await ev(`(()=>{const n=[...document.querySelectorAll('button')].find(n=>n.checkVisibility()&&n.textContent===${JSON.stringify(text)});if(!n)throw Error('Missing '+${JSON.stringify(text)});n.click()})()`); await frames(); };
    const input = async (id, value) => { await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(n,${JSON.stringify(value)});n.dispatchEvent(new Event('input',{bubbles:true}));})()`); await frames(); };
    const seed = async (data, route) => { await load(); await ev(`localStorage.clear();localStorage.setItem('tops_onboarded','1');Object.entries(${JSON.stringify(data)}).forEach(([k,v])=>localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v)))`); await load(route); };
    const date = days => ev(`(()=>{const d=new Date();d.setDate(d.getDate()+${days});return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')})()`);
    const home = async () => { await ev(`[...document.querySelectorAll('[aria-label="Primary"] button')].find(n=>n.textContent==='Home').click()`); await frames(); };
    const snapshot = () => ev(`JSON.stringify(['tops_personal_guide_v1','tops_career_action_v1','tops_career_gap_v1','tops_my_jobs_v1'].map(k=>localStorage.getItem(k)))`);
    await load();
    const day120 = await date(120), day300 = await date(300), day60 = await date(60), post300 = await date(-300);
    for (const [profile, separation, bdd, caseName] of [['', '', false, 'unknown'], ['active', '', false, 'no date'], ['active', '2026-02-31', false, 'invalid calendar date'], ['', day120, false, 'unknown profile'], ['spouse', day120, false, 'spouse profile'], ['active', day300, false, 'future'], ['active', day120, true, 'current'], ['active', day60, false, 'expired BDD'], ['separated', post300, false, 'post separation']]) {
      await seed({ tops_user_status: profile, tops_sep_date: separation, dismissedNotifs: ['n2'] });
      if (['unknown', 'no date', 'invalid calendar date', 'unknown profile', 'spouse profile'].includes(caseName)) assert.equal(await ev('!!document.getElementById("tops-home-next-action")'), false, caseName + ' has no automatic Home urgency');
      await click('tops-header-reminders'); await wait('!!document.getElementById("tops-plan-reminders")');
      const count = await ev('document.querySelectorAll("button[id^=tops-reminder-]").length');
      assert.equal(await ev('document.getElementById("tops-header-reminders").querySelector("span")?.textContent||"0"'), String(count), caseName + ' count matches list');
      assert.equal(await ev('!!document.getElementById("tops-reminder-r-6-bdd2")'), bdd, caseName);
      assert.equal(await ev('localStorage.getItem("dismissedNotifs")'), '["n2"]', 'legacy ACK unchanged');
      if (!separation || separation === '2026-02-31') assert.equal(await ev('!!document.querySelector("#tops-calendar-date-needed input")'), true, 'date recovery available');
      if (caseName === 'post separation') assert.equal(await ev('!!document.getElementById("tops-reminder-r-p10-claim")'), true);
      if (bdd) {
        await click('tops-reminder-r-6-bdd2'); await textClick('View steps'); await textClick('Mark reminder complete');
        assert.equal(await ev('JSON.parse(localStorage.getItem("tops_dismissed_reminders"))["r-6-bdd2"]'), true);
        await click('tops-header-reminders'); assert.equal(await ev('!!document.getElementById("tops-reminder-r-6-bdd2")'), false);
        assert.equal(await ev('document.getElementById("tops-header-reminders").querySelector("span")?.textContent||"0"'), String(count - 1));
      }
      console.log('PASS reminder context:', caseName);
    }
    await seed({ tops_user_status: 'guard', tops_sep_date: day120 }); assert.equal(await ev('!!document.getElementById("tops-header-reminders")'), false);
    await seed({}); await click('tops-header-reminders'); await textClick('Browse all reminders');
    assert.equal(await ev('document.getElementById("tops-reminder-r-6-bdd2").textContent.includes("Window OPEN")'), false);
    assert.equal(await ev('document.getElementById("tops-reminder-r-1-fedvip").textContent.includes("Window OPEN")'), false);
    console.log('PASS Guard context and neutral planning library');
    // The welcome route exposes one search form immediately; blank-role ZIP search is accepted.
    await seed({}); await ev("localStorage.removeItem('tops_onboarded')"); await load('/');
    await click('tops-first-veteran'); await wait('!!document.getElementById("tops-career-search-start")');
    assert.equal(await ev('document.activeElement.id'), 'tops-career-start-heading');
    assert.equal(await ev('!!document.getElementById("career-starter-resume")'), false);
    await click('tops-career-search-start'); assert.equal(await ev('document.activeElement.id'), 'tops-career-search-area');
    await input('tops-career-search-area', '53202'); await click('tops-career-search-start'); await wait('!!document.getElementById("tops-federal-results")');
    assert.equal(posts.length, 1); assert.equal(posts[0].keyword, ''); assert.equal(posts[0].location, '53202');
    assert.equal(await ev('!!document.getElementById("tops-saved-result-tools")'), false);
    await textClick('Save job and see next step'); await wait('!!document.getElementById("tops-saved-result-tools")');
    const raw = await ev('localStorage.getItem("tops_my_jobs_v1")'), job = JSON.parse(raw).jobs[0];
    // Sharing contains only a public app route, even after a personal saved result exists.
    await ev(`window.__shared=[];Object.defineProperty(navigator,'share',{configurable:true,value:async value=>window.__shared.push(value)})`);
    await click('tops-saved-result-share-button');
    assert.deepEqual(await ev('window.__shared'), [{ title: 'Transition OPS career tools', text: 'Find jobs and free learning resources in Transition OPS.', url: 'https://transitionops.org/?tool=pathway' }]);
    await textClick('Dismiss'); assert.equal(await ev('!!document.getElementById("tops-saved-result-tools")'), false);
    await home(); await wait('!!document.getElementById("tops-home-saved-jobs")');
    assert.equal(await ev('document.getElementById("tops-home-saved-jobs").textContent.includes("SYNTHETIC Data Analyst")'), true);
    assert.equal(await ev('document.getElementById("tops-loop-title").checkVisibility()'), false, 'generic chooser is secondary');
    await load(); await click('tops-home-job-' + job.id); await wait('!!document.getElementById("tops-my-job-task-heading")');
    assert.match(await ev('document.getElementById("tops-my-job-task-heading").textContent'), /SYNTHETIC Data Analyst/);
    assert.equal(await ev('localStorage.getItem("tops_my_jobs_v1")'), raw);
    console.log('PASS welcome direct ZIP search, save, public sharing, reload and exact continuation');
    const guide = { version: 1, pathway: 'change', currentRole: 'SYNTHETIC', targetRole: 'Analyst', goal: '' };
    const other = { ...job, id: '11111111-1111-4111-8111-111111111111', source: 'manual', sourceId: '', retrievedAt: '', qualifications: '', url: '', role: 'SYNTHETIC second role', closingDate: '' };
    await seed({ tops_my_jobs_v1: { version: 1, jobs: [job, other] } });
    assert.equal(await ev('document.querySelectorAll("#tops-home-saved-jobs button").length'), 2);
    assert.equal(await ev('document.getElementById("tops-home-saved-jobs-title").textContent'), 'Continue your saved jobs');
    const action = { version: 1, text: 'SYNTHETIC call my mentor', date: '', done: false, context: guide };
    await seed({ tops_my_jobs_v1: { version: 1, jobs: [job] }, tops_personal_guide_v1: guide, tops_career_action_v1: action });
    const before = await snapshot();
    assert.equal(await ev('document.getElementById("tops-loop-title").checkVisibility()'), true);
    assert.equal(await ev('!!(document.getElementById("tops-loop-title").compareDocumentPosition(document.getElementById("tops-home-saved-jobs")) & Node.DOCUMENT_POSITION_FOLLOWING)'), true);
    await click('tops-home-job-' + job.id); await wait('!!document.getElementById("tops-my-job-task-heading")'); assert.equal(await snapshot(), before);
    await seed({ tops_my_jobs_v1: { version: 1, jobs: [{ ...job, status: 'closed' }] } }); assert.equal(await ev('!!document.getElementById("tops-home-saved-jobs")'), false);
    await seed({ tops_my_jobs_v1: { version: 1, jobs: [{ ...job, closingDate: '2001-01-01' }] } });
    assert.equal(await ev(`document.getElementById('tops-home-job-${job.id}').textContent`), 'Review saved job');
    await click('tops-home-job-' + job.id); await wait(`document.activeElement.id==='tops-saved-job-${job.id}'`);
    console.log('PASS multiple jobs, explicit action precedence, unchanged plan, closed/expired jobs');
    // Corrupt storage is never treated as an empty saved list. Save failure never presents success utilities.
    await seed({ tops_my_jobs_v1: '{broken' }, '/?tool=pathway'); await ev("document.querySelector('#tops-career-menu summary').click()"); await frames(); await click('tops-my-jobs-open');
    assert.match(await ev('document.getElementById("tops-my-jobs-status").textContent'), /could not be read/); assert.equal(await ev('localStorage.getItem("tops_my_jobs_v1")'), '{broken');
    await seed({}); await load('/?tool=pathway'); await ev("document.querySelector('#tops-career-menu summary').click()"); await frames(); await click('tops-my-jobs-open'); await click('tops-my-jobs-add'); await input('tops-my-job-role', 'SYNTHETIC failed save');
    await ev(`window.__realSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='tops_my_jobs_v1')throw Error('Synthetic failure');return window.__realSet.call(this,k,v)}`);
    await click('tops-my-job-save'); assert.match(await ev('document.getElementById("tops-my-jobs-status").textContent'), /Saving failed/); assert.equal(await ev('!!document.getElementById("tops-saved-result-tools")'), false);
    await ev('Storage.prototype.setItem=window.__realSet');
    for (const theme of ['professional', 'tactical']) for (const width of [320, 375]) {
      await c.send('Emulation.setDeviceMetricsOverride', { width, height: 812, deviceScaleFactor: 1, mobile: true });
      await seed({ tops_my_jobs_v1: { version: 1, jobs: [job, other] }, tops_theme: theme });
      assert.equal(await ev('document.documentElement.scrollWidth<=innerWidth'), true);
      assert.equal(await ev('[...document.querySelectorAll("#tops-home-saved-jobs button")].every(n=>n.getBoundingClientRect().height>=44)'), true);
    }
    assert.equal(requests.some(url => /\/(resume|navigator|account-plan)(?:\?|$)/.test(url)), false); assert.deepEqual(errors, []);
    console.log('MEMBER RETURN PASS: dated/profile-scoped reminders; exact saved-work continuation; direct ZIP search; public-only post-save sharing; failure recovery; both themes at 320/375px. Synthetic search calls: ' + posts.length + '. Model calls: 0.');
  } finally { if (chrome) await h.stopChrome(chrome); await new Promise(r => server.close(r)); }
})().catch(error => { console.error(error.stack); process.exitCode = 1; });
