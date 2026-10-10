'use strict';
// Synthetic direct entry and continuity only. External and function traffic is blocked.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http'), os = require('node:os'), { spawn } = require('node:child_process');
const root = process.env.TOPS_CAREER_ENTRY_ROOT || path.resolve(__dirname, '..'), utility = fs.readFileSync(path.join(__dirname, 'privacy-network-regression.js'), 'utf8');
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
    const visible = id => ev(`!!document.getElementById(${JSON.stringify(id)})?.checkVisibility()`);
    const heading = () => ev('document.getElementById("tops-career-start-heading").textContent');
    const disk = () => ev('JSON.stringify(["tops_personal_guide_v1", "tops_career_action_v1", "tops_career_gap_v1"].map(key => localStorage.getItem(key)))');
    const load = async () => { await c.send('Page.navigate', { url: url + '/?tool=pathway' }); await wait('!!document.getElementById("tops-career-start-heading")'); };
    const nav = async label => { await ev(`Array.from(document.querySelectorAll('.bottom-nav button')).find(n => n.querySelector('.nav-label').textContent === ${JSON.stringify(label)}).click()`); await wait(label === 'Home' ? '!!document.getElementById("tops-loop-title")' : '!!document.getElementById("tops-career-start-heading")'); };
    const homeReturn = async () => { await nav('Home'); await nav('Career'); };
    const seed = async expression => { await ev('localStorage.clear(); localStorage.setItem("tops_onboarded", "1"); localStorage.setItem("tops_user_status", "guard");' + expression); await load(); };
    await load(); await seed('');
    // Zero further activations after selecting Career; baseline stops at a Start button.
    assert.equal(await visible('career-starter-resume'), true, 'fresh Career must open experience intake directly');
    assert.equal(await heading(), 'Start with your experience');
    const empty = await disk();
    await tap('tops-career-change-goal'); assert.equal(await ev('document.getElementById("tops-career-goals").open'), true);
    assert.equal(await visible('tops-career-continue-draft'), false, 'untouched intake must not become a draft');
    await click('Start with my experience'); await homeReturn();
    assert.equal(await visible('career-starter-resume'), true); assert.equal(await disk(), empty);
    // A visit returns to the real stage, retaining chosen source, role, next action and date.
    const notes = 'Experience\nSYNTHETIC trained six coworkers and maintained inventory records.';
    await input('tops-journey-role', 'SYNTHETIC Logistics Coordinator'); await input('career-starter-resume', notes);
    await homeReturn(); assert.equal(await ev('document.getElementById("career-starter-resume").value'), notes);
    assert.equal(await ev('document.getElementById("tops-journey-role").value'), 'SYNTHETIC Logistics Coordinator');
    await click('Help me find my next move'); await wait('!!document.getElementById("tops-start-action-preview")');
    await input('tops-journey-action', 'SYNTHETIC Ask the training adviser about class dates'); await input('tops-journey-date', '2027-03-12');
    await tap('tops-career-ai-open'); await tap('tops-career-ai-consent'); await homeReturn();
    assert.equal(await ev('document.getElementById("tops-start-action-preview").textContent'), 'SYNTHETIC Ask the training adviser about class dates');
    assert.equal(await ev('document.getElementById("tops-journey-date").value'), '2027-03-12');
    assert.equal(await visible('tops-career-ai-open'), true); assert.equal(await visible('tops-career-ai-consent'), false);
    await tap('tops-career-ai-open'); assert.equal(await ev('document.getElementById("tops-career-ai-consent").checked'), false); await click('Continue without AI');
    // A prepared message remains reachable while the unfinished task continues directly.
    await tap('tops-prepare-introduction'); await wait('!!document.getElementById("tops-specialist-introduction")');
    const message = 'SYNTHETIC exact visit-only message. Keep my words.';
    await input('tops-specialist-introduction', message); await homeReturn();
    assert.equal(await visible('tops-start-action-preview'), true); assert.equal(await visible('tops-career-continue-introduction'), true);
    await tap('tops-career-continue-introduction'); await wait('document.getElementById("tops-specialist-introduction")?.checkVisibility()');
    assert.equal(await ev('document.getElementById("tops-specialist-introduction").value'), message);
    await tap('tops-introduction-back'); await tap('tops-career-continue-draft');
    assert.equal(await ev('document.getElementById("tops-start-action-preview").textContent'), 'SYNTHETIC Ask the training adviser about class dates');
    await tap('tops-career-change-goal'); await ev('document.querySelectorAll(".tops-career-goal")[2].click()');
    assert.equal(await heading(), 'Build on what you already do'); assert.equal(await ev('document.getElementById("career-starter-resume").value'), notes);
    assert.equal(await disk(), empty);
    // Partial prefill must not imply a finished plan or manufacture visit work.
    await seed('const gap=topsEmptyGap(); gap.target="SYNTHETIC Partial Role"; localStorage.setItem("tops_career_gap_v1",JSON.stringify(gap));');
    const partial = await disk();
    assert.equal(await visible('career-starter-resume'), true); assert.equal(await ev('document.getElementById("tops-journey-role").value'), 'SYNTHETIC Partial Role');
    await tap('tops-career-change-goal'); assert.equal(await visible('tops-career-continue-draft'), false); assert.equal(await disk(), partial);
    // Only an exact guide/action/gap context can open saved work automatically.
    const savedSetup = 'const guide={version:1,pathway:"change",currentRole:"",targetRole:"SYNTHETIC HR Specialist",goal:"Find work that fits me"}; const action={version:1,text:"SYNTHETIC Talk with a hiring manager",date:"2027-04-12",done:DONE,context:guide}; const gap=topsEmptyGap(); gap.target=guide.targetRole; gap.rows[0].have="SYNTHETIC Trained six coworkers."; localStorage.setItem("tops_personal_guide_v1",JSON.stringify(guide)); localStorage.setItem("tops_career_action_v1",JSON.stringify(action)); localStorage.setItem("tops_career_gap_v1",JSON.stringify(gap));';
    for (const done of [false, true]) {
      await seed(savedSetup.replace('DONE', JSON.stringify(done))); await wait('!!document.getElementById("tops-journey-ready")');
      const saved = await disk(); assert.equal(await ev('document.getElementById("tops-start-action-preview").textContent'), 'SYNTHETIC Talk with a hiring manager');
      assert.ok(await ev('document.getElementById("tops-journey-action-date").textContent.includes("2027-04-12")'));
      assert.equal(await ev('document.getElementById("tops-journey-ready").textContent'), done ? 'Step completed' : 'Your next step');
      assert.equal(await visible('tops-career-next-after-completion'), done); await homeReturn(); await wait('!!document.getElementById("tops-journey-ready")'); assert.equal(await disk(), saved);
      await tap('tops-career-change-goal'); await click('Start with my experience'); await input('career-starter-resume', notes + '\nSYNTHETIC New draft.');
      await tap('tops-career-change-goal'); await click('Open my current career plan');
      assert.ok(await ev('document.body.textContent.includes("Replace this unfinished draft")')); await click('Keep unfinished draft');
      assert.ok(await ev('document.getElementById("career-starter-resume").value.includes("SYNTHETIC New draft")')); assert.equal(await disk(), saved);
    }
    for (const mismatch of ['gap.target="SYNTHETIC Other Role"; localStorage.setItem("tops_career_gap_v1",JSON.stringify(gap));', 'action.context=Object.assign({},guide,{goal:"SYNTHETIC Other goal"}); localStorage.setItem("tops_career_action_v1",JSON.stringify(action));']) {
      await seed(savedSetup.replace('DONE', 'false') + mismatch); const conflict = await disk();
      assert.equal(await visible('tops-start-action-preview'), false); assert.equal(await visible('tops-career-experience-first'), true);
      assert.ok(await ev('document.body.textContent.includes("Your saved comparison and current career goal need review")'));
      assert.equal(await disk(), conflict);
    }
    // Entering directly freezes the old plan context before any other tool can change it.
    await seed(savedSetup.replace('DONE', 'false') + 'localStorage.removeItem("tops_career_action_v1");');
    const beforeOtherTool = await disk(); await input('career-starter-resume', notes); await nav('Home');
    await input('tops-loop-target', 'SYNTHETIC New Home Direction'); await click('Use for this visit'); await nav('Career');
    assert.equal(await ev('document.getElementById("career-starter-resume").value'), notes);
    await click('Help me find my next move'); await wait('!!document.getElementById("tops-start-action-preview")');
    assert.ok(await ev('document.body.textContent.includes("Your career plan changed since this draft was prepared")'));
    assert.equal(await disk(), beforeOtherTool);
    // A deliberate Home specialist route takes precedence over automatic saved-plan entry.
    await seed(savedSetup.replace('DONE', 'false') + 'action.text=topsMemberAdjustment("person",guide).title;localStorage.setItem("tops_career_action_v1",JSON.stringify(action));');
    const beforeSpecialist = await disk(); await nav('Home'); await tap('tops-loop-career-help');
    await wait('document.getElementById("tops-prepare-introduction")?.checkVisibility()');
    assert.equal(await heading(), 'Prepare for career help'); assert.equal(await visible('career-starter-resume'), false); assert.equal(await disk(), beforeSpecialist);
    // Browser navigation honors an explicit chooser and restores the actual work stage.
    await seed(''); await input('career-starter-resume', notes); await click('Help me find my next move');
    await wait('!!document.getElementById("tops-start-action-preview")');
    await ev('history.back()'); await wait('document.getElementById("career-starter-resume")?.checkVisibility()');
    assert.equal(await ev('document.getElementById("career-starter-resume").value'), notes);
    await ev('history.forward()'); await wait('document.getElementById("tops-career-role-choices")?.checkVisibility()');
    assert.equal(await visible('tops-career-role-choices'), true);
    for (const width of [320, 375]) { await c.send('Emulation.setDeviceMetricsOverride', { width, height: 812, deviceScaleFactor: 1, mobile: true }); assert.ok(await ev('document.documentElement.scrollWidth <= innerWidth + 1')); assert.ok(await ev('document.getElementById("tops-career-change-goal").getBoundingClientRect().height >= 44')); }
    assert.deepEqual(errors, []); assert.equal(blocked.some(request => request.url.includes('/.netlify/') || request.url.includes('SYNTHETIC') || request.postData?.includes('SYNTHETIC')), false);
    console.log('CAREER SIMPLE ENTRY PASS: fresh/partial intake, no phantom draft, exact saved and completed actions, conflict guard, direct visit restoration, message coexistence, AI consent reset, deliberate replacement, goal change, Back/Forward, unchanged saved bytes, zero provider requests, 320/375 reflow.');
  } finally { if (chrome) { await h.stopChrome(chrome); chrome.child.stderr?.destroy(); } await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error.stack); process.exitCode = 1; });
