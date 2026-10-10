'use strict';
// Synthetic visit-only follow-ups. All external and function traffic is blocked.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http'), os = require('node:os'), { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..'), utility = fs.readFileSync(path.join(__dirname, 'privacy-network-regression.js'), 'utf8');
const h = new Function('fs', 'path', 'os', 'spawn', utility.slice(utility.indexOf('function findChrome()'), utility.indexOf('const PROBE_SCRIPT =')) + '\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs, path, os, spawn);
const server = http.createServer((req, res) => {
  const file = path.join(root, req.url.split('?')[0] === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream');
  res.end(fs.readFileSync(file));
});
(async () => {
  let chrome;
  const errors = [], blocked = [];
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const url = 'http://127.0.0.1:' + server.address().port;
    chrome = await h.launchChrome(h.findChrome(), 12);
    const c = chrome.client, ev = expression => h.evaluate(c, expression, true), wait = expression => h.waitForExpression(c, expression, expression, 12000);
    await c.send('Page.enable'); await c.send('Runtime.enable');
    c.on('Runtime.exceptionThrown', event => errors.push(event.exceptionDetails.text));
    await c.send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
    c.on('Fetch.requestPaused', async event => {
      const local = event.request.url.startsWith(url) && !event.request.url.includes('/.netlify/');
      if (!local) blocked.push(event.request);
      try { await c.send(local ? 'Fetch.continueRequest' : 'Fetch.failRequest', local ? { requestId: event.requestId } : { requestId: event.requestId, errorReason: 'BlockedByClient' }); } catch {}
    });
    const reveal = selector => ev(`(() => { const n = document.querySelector(${JSON.stringify(selector)}); if (!n) throw Error('Missing control: ' + ${JSON.stringify(selector)}); const parents = []; for (let p = n.parentElement; p; p = p.parentElement) if (p.tagName === 'DETAILS' && !p.open) parents.unshift(p); for (const p of parents) p.querySelector(':scope > summary').click(); if (!n.checkVisibility()) throw Error('Hidden control'); })()`);
    const tap = async id => { await reveal('#' + id); await ev(`(() => { const n = document.getElementById(${JSON.stringify(id)}); if (n.disabled) throw Error('Disabled control'); n.click(); })()`); };
    const click = text => ev(`(() => { const n = Array.from(document.querySelectorAll('button')).find(n => n.textContent === ${JSON.stringify(text)} && n.checkVisibility()); if (!n || n.disabled) throw Error('Unusable button: ' + ${JSON.stringify(text)}); n.click(); })()`);
    const input = async (id, value) => { await reveal('#' + id); await ev(`(() => { const n = document.getElementById(${JSON.stringify(id)}); Object.getOwnPropertyDescriptor(n.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, 'value').set.call(n, ${JSON.stringify(value)}); n.dispatchEvent(new Event('input', { bubbles: true })); })()`); };
    const select = async (id, value) => { await reveal('#' + id); await ev(`(() => { const n = document.getElementById(${JSON.stringify(id)}); n.value = ${JSON.stringify(value)}; n.dispatchEvent(new Event('change', { bubbles: true })); })()`); };
    const nav = async label => { await ev(`Array.from(document.querySelectorAll('.bottom-nav button')).find(n => n.querySelector('.nav-label').textContent === ${JSON.stringify(label)}).click()`); await wait(label === 'Home' ? '!!document.getElementById("tops-loop-title")' : '!!document.getElementById("tops-career-start-heading")'); };
    const load = async () => { await c.send('Page.navigate', { url: url + '/?tool=pathway' }); await wait('!!document.getElementById("tops-career-start-heading")'); };
    const draft = () => ev('document.getElementById("tops-specialist-introduction").value');
    const origin = () => ev('document.getElementById("tops-application-message-origin")?.textContent || ""');
    const disk = () => ev('JSON.stringify(["tops_personal_guide_v1", "tops_career_action_v1", "tops_career_gap_v1"].map(key => localStorage.getItem(key)))');
    await load();
    const guide = { version: 1, pathway: 'change', currentRole: 'SYNTHETIC military operations', targetRole: 'Human Resources Specialist', goal: 'SYNTHETIC career goal' };
    const jobs = [
      { id: '11111111-1111-4111-8111-111111111111', role: 'Executive Director', employer: 'SYNTHETIC DEMO Agency A', location: 'Madison, WI', url: 'https://example.org/jobs/a', source: 'manual', sourceId: '', closingDate: '', retrievedAt: '', qualifications: '', status: 'applied', nextAction: 'followup', actionDate: '' },
      { id: '22222222-2222-4222-8222-222222222222', role: 'Executive Director', employer: 'SYNTHETIC DEMO Agency B', location: 'Madison, WI', url: 'https://example.org/jobs/b', source: 'manual', sourceId: '', closingDate: '', retrievedAt: '', qualifications: '', status: 'applied', nextAction: 'followup', actionDate: '' }
    ];
    await ev(`localStorage.clear(); localStorage.setItem('tops_onboarded', '1'); localStorage.setItem('tops_user_status', 'guard'); localStorage.setItem('tops_personal_guide_v1', ${JSON.stringify(JSON.stringify(guide))}); localStorage.setItem('tops_my_jobs_v1', ${JSON.stringify(JSON.stringify({ version: 1, jobs }))});`);
    await load();
    const originalPlan = await disk(), originalJobs = await ev('localStorage.getItem("tops_my_jobs_v1")');
    await ev(`window.__copies = []; Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.__copies.push(text); } } }); window.__downloads = []; URL.createObjectURL = blob => { window.__downloads.push(blob); return 'blob:synthetic-followup'; }; URL.revokeObjectURL = () => {}; HTMLAnchorElement.prototype.click = function() { if (!this.download) throw Error('Unexpected external link'); };`);
    const openJob = async index => {
      await tap('tops-my-jobs-open');
      const selector = '[data-job-review="' + jobs[index].id + '"]';
      await ev(`(() => { const panel = document.querySelector(${JSON.stringify(selector)}); if (!panel.open) panel.querySelector(':scope > summary').click(); })()`);
      await wait(`!!document.querySelector('[data-job-review-next="${jobs[index].id}"]')`);
      await ev(`document.querySelector('[data-job-review-next="${jobs[index].id}"]').click()`);
      await wait('!!document.getElementById("tops-my-job-task-continue")');
      await tap('tops-my-job-task-continue');
      await wait('!!document.getElementById("tops-prepare-introduction")');
    };
    const continueDraft = async () => { await tap('tops-career-continue-introduction'); await wait('document.activeElement.id === "tops-specialist-introduction"'); };
    const assertOriginal = async text => {
      assert.equal(await draft(), text, 'exact edited text must survive');
      assert.equal(await ev('document.querySelector("label[for=tops-specialist-introduction]").textContent'), 'My follow-up');
      assert.match(await origin(), /Executive Director at SYNTHETIC DEMO Agency A/);
      assert.equal(await ev('document.getElementById("tops-career-specialist").textContent.includes("Make time for the next step")'), false);
      assert.equal(await ev('document.getElementById("tops-introduction-back").previousElementSibling.textContent'), 'Career focus: Executive Director');
    };
    await openJob(0); await tap('tops-prepare-introduction');
    await wait('document.activeElement.id === "tops-specialist-introduction"');
    assert.match(await draft(), /I applied for the Executive Director position with SYNTHETIC DEMO Agency A/);
    const custom = 'SYNTHETIC VISIT ONLY A: Please keep my exact edited application follow-up.\nNo automatic rewrite.';
    await input('tops-specialist-introduction', custom); await tap('tops-introduction-reviewed');
    await tap('tops-introduction-back');
    const continueLabel = await ev('document.getElementById("tops-career-continue-introduction").textContent');
    // The baseline bug appears here: text A returned under career-goal B with generic controls.
    await continueDraft(); await assertOriginal(custom);
    assert.equal(continueLabel, 'Continue my follow-up');
    assert.equal(await ev('document.getElementById("tops-introduction-reviewed").checked'), false);
    await nav('Home'); await nav('Career'); await continueDraft(); await assertOriginal(custom);
    assert.equal(await ev('document.getElementById("tops-introduction-reviewed").checked'), false);

    // Same-title, distinct job cannot acquire A's message by checking review.
    await openJob(1); await assertOriginal(custom);
    assert.equal(await ev('document.getElementById("tops-introduction-reviewed").disabled'), true);
    await click('Copy follow-up'); await click('Download follow-up');
    assert.equal(await ev('__copies.length + __downloads.length'), 0);
    await tap('tops-prepare-introduction'); await click('Keep my introduction');
    await assertOriginal(custom);
    assert.equal(await ev('document.getElementById("tops-introduction-reviewed").disabled'), false, 'Keep restores original application context');
    await tap('tops-introduction-reviewed'); await click('Copy follow-up');
    assert.deepEqual(await ev('__copies'), [custom]);
    await openJob(1); await tap('tops-prepare-introduction'); await click('Replace introduction');
    assert.match(await draft(), /SYNTHETIC DEMO Agency B/); assert.match(await origin(), /Agency B/);
    await tap('tops-introduction-back'); await continueDraft(); assert.match(await origin(), /Agency B/);

    // Changing setup preserves text and origin until replacement is confirmed.
    const second = await draft();
    await select('tops-network-purpose', 'learn'); assert.equal(await draft(), second); assert.match(await origin(), /Agency B/);
    assert.equal(await ev('document.getElementById("tops-introduction-reviewed").disabled'), true);
    assert.equal(await ev('!!document.getElementById("tops-network-date")'), false);
    await tap('tops-prepare-introduction'); await click('Keep my introduction');
    assert.equal(await ev('document.getElementById("tops-network-purpose").value'), 'followup');
    await select('tops-network-purpose', 'learn'); await tap('tops-prepare-introduction'); await click('Replace introduction');
    assert.equal(await origin(), ''); assert.equal(await ev('!!document.getElementById("tops-network-date")'), true);
    const generic = await draft();
    await openJob(0); assert.equal(await draft(), generic); assert.equal(await origin(), '');
    await select('tops-network-purpose', 'followup');
    assert.equal(await ev('document.getElementById("tops-introduction-reviewed").disabled'), true);
    await tap('tops-prepare-introduction'); await click('Replace introduction');
    await input('tops-specialist-introduction', custom);

    // Unrelated planning metadata does not alter application identity.
    const storeJobs = async next => { await ev(`localStorage.setItem('tops_my_jobs_v1', ${JSON.stringify(JSON.stringify({ version: 1, jobs: next }))}); window.dispatchEvent(new Event('storage'));`); };
    const planning = jobs.map(job => ({ ...job })); planning[0].actionDate = '2026-12-01'; planning[0].nextAction = 'skills';
    await storeJobs(planning);
    assert.equal(await ev('document.getElementById("tops-introduction-reviewed").disabled'), false);
    await tap('tops-introduction-reviewed'); await click('Copy follow-up');
    assert.equal(await ev('__copies.length'), 2);

    // Changed status, source URL, exact record id, missing source, and unreadable storage fail closed.
    for (const mutate of [list => { list[0].status = 'interviewing'; }, list => { list[0].url = 'https://example.org/jobs/revised'; }, list => { list[0].id = '33333333-3333-4333-8333-333333333333'; }, list => { list.shift(); }]) {
      const changed = jobs.map(job => ({ ...job })); mutate(changed); await storeJobs(changed);
      await assertOriginal(custom);
      assert.equal(await ev('document.getElementById("tops-introduction-reviewed").disabled'), true);
      assert.ok(await ev('document.getElementById("tops-career-specialist").textContent.includes("This saved job changed or is no longer available")'));
      await click('Copy follow-up'); await click('Download follow-up');
      assert.equal(await ev('__copies.length'), 2); assert.equal(await ev('__downloads.length'), 0);
      await tap('tops-prepare-introduction'); await click('Replace introduction'); assert.equal(await draft(), custom);
      await storeJobs(jobs);
    }
    await ev(`window.__storageGet = Storage.prototype.getItem; Storage.prototype.getItem = function(key) { if (key === 'tops_my_jobs_v1') throw Error('synthetic blocked storage'); return window.__storageGet.call(this, key); }; window.dispatchEvent(new Event('focus'));`);
    assert.equal(await ev('document.getElementById("tops-introduction-reviewed").disabled'), true); await click('Copy follow-up'); assert.equal(await ev('__copies.length'), 2);
    await ev('Storage.prototype.getItem = window.__storageGet; window.dispatchEvent(new Event("focus"));');
    const deleted = [jobs[1]]; await storeJobs(deleted);
    await tap('tops-message-review-job'); await wait('document.activeElement.id === "tops-my-jobs-heading"');
    assert.equal(await ev('document.getElementById("tops-my-jobs-heading").checkVisibility()'), true);
    await click('Back to Career'); await wait('document.getElementById("tops-specialist-introduction").checkVisibility()');
    await assertOriginal(custom); await storeJobs(jobs);

    for (const width of [320, 375]) { await c.send('Emulation.setDeviceMetricsOverride', { width, height: 812, deviceScaleFactor: 1, mobile: true }); assert.ok(await ev('document.documentElement.scrollWidth <= innerWidth + 1')); assert.ok(await ev('document.getElementById("tops-message-review-job").getBoundingClientRect().height >= 44')); }
    assert.equal(await disk(), originalPlan); assert.equal(await ev('localStorage.getItem("tops_my_jobs_v1")'), originalJobs);
    assert.equal(await ev('Object.values(localStorage).concat(Object.values(sessionStorage)).some(value => value.includes("SYNTHETIC VISIT ONLY"))'), false);
    assert.equal(await ev('location.href.includes("SYNTHETIC")'), false);
    await click('Clear follow-up'); await click('Keep introduction'); await wait('document.activeElement.id === "tops-specialist-introduction"'); await assertOriginal(custom);
    await click('Clear follow-up'); await click('Confirm clear introduction'); await wait('document.activeElement.id === "tops-career-start-heading"');
    assert.equal(await ev('!!document.getElementById("tops-career-continue-introduction")'), false);
    // Clear removes origin as well as text; a fresh follow-up selects B normally.
    await openJob(1); await tap('tops-prepare-introduction'); assert.match(await origin(), /Agency B/);
    await load(); assert.equal(await ev('!!document.getElementById("tops-career-continue-introduction")'), false);
    assert.equal(await disk(), originalPlan); assert.equal(await ev('localStorage.getItem("tops_my_jobs_v1")'), originalJobs);
    assert.deepEqual(errors, []);
    assert.equal(blocked.some(request => request.url.includes('/.netlify/') || request.url.includes('SYNTHETIC') || request.postData?.includes('SYNTHETIC')), false);
    console.log('APPLICATION FOLLOW-UP RETURN PASS: exact A draft across Back and Home/Career remount, original role/employer and controls, same-title B replacement/cancel, purpose consent, metadata tolerance, changed/deleted/unreadable source guards, My jobs recovery, clear/reload, unchanged saved plan/jobs, no message persistence or provider traffic, and 320/375 reflow.');
  } finally {
    if (chrome) { await h.stopChrome(chrome); chrome.child.stderr?.destroy(); }
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error.stack); process.exitCode = 1; });
