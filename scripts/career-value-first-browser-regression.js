'use strict';
// Synthetic local jobs-first journey. Every email, booking and external request is intercepted.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http'), os = require('node:os'), { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..'), utility = fs.readFileSync(path.join(__dirname, 'privacy-network-regression.js'), 'utf8');
const h = new Function('fs', 'path', 'os', 'spawn', utility.slice(utility.indexOf('function findChrome()'), utility.indexOf('const PROBE_SCRIPT =')) + '\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs, path, os, spawn);
let available = true, responseMode = 'success';
const calls = [], held = [], blocked = [], requests = [];
const job = { id: '987654321', title: 'SYNTHETIC Data Analyst', agency: 'SYNTHETIC Public Agency', location: 'Madison, Wisconsin', salary: 'Pay not supplied', closingDate: '2099-12-01', whoMayApply: 'Open to the public', qualifications: 'SYNTHETIC official excerpt: create reports from data.', url: 'https://www.usajobs.gov/job/987654321' };
const payload = jobs => ({ source: 'USAJOBS', scope: 'public', retrievedAt: '2026-11-01T12:00:00Z', jobs });
const server = http.createServer(async (req, res) => {
  requests.push({ method: req.method, url: req.url });
  if (req.url.startsWith('/.netlify/functions/federal-jobs')) {
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'GET') return res.end(JSON.stringify({ available, provider: 'USAJOBS' }));
    let raw = ''; for await (const chunk of req) raw += chunk;
    calls.push(JSON.parse(raw));
    if (responseMode === 'held') { held.push(() => res.end(JSON.stringify(payload([{ ...job, title: 'SYNTHETIC STALE RESPONSE' }])))); return; }
    if (responseMode === 'error') { res.statusCode = 429; return res.end('{}'); }
    return res.end(JSON.stringify(payload(responseMode === 'empty' ? [] : [job])));
  }
  const file = path.join(root, new URL(req.url, 'http://localhost').pathname === '/' ? 'index.html' : new URL(req.url, 'http://localhost').pathname);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream');
  res.end(fs.readFileSync(file));
});
(async () => {
  let chrome;
  const errors = [];
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = 'http://127.0.0.1:' + server.address().port;
    chrome = await h.launchChrome(h.findChrome(), 12);
    const c = chrome.client, ev = expression => h.evaluate(c, expression, true), wait = expression => h.waitForExpression(c, expression, expression, 12000);
    const frames = () => ev('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
    await c.send('Page.enable'); await c.send('Runtime.enable');
    c.on('Runtime.exceptionThrown', event => errors.push(event.exceptionDetails.text));
    await c.send('Page.addScriptToEvaluateOnNewDocument', { source: `
      window.syntheticClicks = []; window.syntheticCopies = []; window.syntheticDownloads = [];
      window.syntheticCopyDenied = false;
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async value => { if (syntheticCopyDenied) throw Error('synthetic denied clipboard'); syntheticCopies.push(value); } } });
      URL.createObjectURL = blob => { syntheticDownloads.push(blob); return 'blob:synthetic-search'; };
      URL.revokeObjectURL = () => {};
      document.addEventListener('click', event => { const link = event.target.closest('a'); if (link && (link.download || !link.href.startsWith(location.origin))) { event.preventDefault(); syntheticClicks.push({ href: link.href, download: link.download || '' }); } }, true);
    ` });
    await c.send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
    c.on('Fetch.requestPaused', async event => {
      const local = event.request.url.startsWith(origin) && (!event.request.url.includes('/.netlify/') || event.request.url.includes('/.netlify/functions/federal-jobs'));
      if (!local) blocked.push(event.request);
      try { await c.send(local ? 'Fetch.continueRequest' : 'Fetch.failRequest', local ? { requestId: event.requestId } : { requestId: event.requestId, errorReason: 'BlockedByClient' }); } catch {}
    });
    const reveal = async id => { await ev(`(() => { const node = document.getElementById(${JSON.stringify(id)}); if (!node) throw Error('Missing control: ' + ${JSON.stringify(id)}); const parents = []; for (let p = node.parentElement; p; p = p.parentElement) if (p.tagName === 'DETAILS' && !p.open) parents.unshift(p); for (const p of parents) p.querySelector(':scope > summary').click(); if (!node.checkVisibility()) throw Error('Hidden control: ' + ${JSON.stringify(id)}); })()`); await frames(); };
    const tap = async id => { await reveal(id); await ev(`(() => { const node = document.getElementById(${JSON.stringify(id)}); if (node.disabled) throw Error('Disabled control: ' + ${JSON.stringify(id)}); node.click(); })()`); await frames(); };
    const input = async (id, value) => { await reveal(id); await ev(`(() => { const node = document.getElementById(${JSON.stringify(id)}); Object.getOwnPropertyDescriptor(node.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, 'value').set.call(node, ${JSON.stringify(value)}); node.dispatchEvent(new Event('input', { bubbles: true })); })()`); await frames(); };
    const load = async url => { await c.send('Page.navigate', { url }); await wait('!!document.getElementById("tops-main-content")'); await frames(); };
    const plan = () => ev('JSON.stringify(["tops_personal_guide_v1", "tops_career_gap_v1", "tops_career_action_v1", "tops_my_jobs_v1"].map(key => localStorage.getItem(key)))');
    const findExternalSearches = () => ev('[...document.querySelectorAll("#tops-live-jobs-panel a")].filter(a => a.href.includes("linkedin.com/jobs/search") || a.href.includes("usajobs.gov/Search/Results")).map(a => a.href)');

    await load(origin + '/?tool=pathway');
    await ev(`localStorage.clear(); localStorage.setItem('tops_onboarded', '1'); const guide = topsEmptyGuide(); guide.currentRole = 'SYNTHETIC_PRIVATE_PROFILE_SENTINEL'; localStorage.setItem('tops_personal_guide_v1', JSON.stringify(guide)); const gap = topsEmptyGap(); gap.rows[0].have = 'SYNTHETIC_PRIVATE_RESUME_SENTINEL'; localStorage.setItem('tops_career_gap_v1', JSON.stringify(gap));`);
    const careerEntryURL = origin + '/?tool=pathway&value_first_scenario=public%20search';
    await load(careerEntryURL);
    const before = await plan();
    // The exact baseline lacks this direct two-field entry; the first assertion is functional.
    assert.equal(await ev('!!document.getElementById("tops-career-search-role") && document.getElementById("tops-career-search-role").checkVisibility()'), true, 'Career must offer role search before requiring a resume or plan');
    assert.equal(await ev('location.href'), careerEntryURL, 'unrelated query encoding stays unchanged when no shared role search is present');
    assert.deepEqual(await ev('[...document.querySelectorAll(".tops-career-workspace h1, .tops-career-workspace h2, .tops-career-workspace h3")].filter(node => node.checkVisibility()).map(node => node.id)'), ['tops-career-start-heading'], 'fresh Career has one primary in-content title');
    assert.equal(await ev('document.querySelectorAll("#tops-career-search-start-form h1, #tops-career-search-start-form h2, #tops-career-search-start-form h3").length'), 0, 'the role query form does not repeat its parent title');
    assert.equal(await ev('document.getElementById("tops-career-search-notice").checkVisibility()'), true);
    assert.match(await ev('document.getElementById("tops-career-search-notice").innerText'), /USAJOBS/);
    assert.match(await ev('document.getElementById("tops-career-search-notice").innerText'), /resume is not included/i);
    assert.match(await ev('document.getElementById("tops-career-search-notice").innerText'), /no sign-in/i);
    assert.equal(await ev('document.getElementById("tops-career-search-start").getAttribute("aria-describedby")'), 'tops-career-search-notice');
    // Exercise the actual URL boundary: no duplicate/unknown fields or malformed query can restore a search.
    assert.deepEqual(await ev(`topsReadJobSearchURL(${JSON.stringify(origin + '/?tool=pathway&view=jobs&role=Data+Analyst&location=Madison%2C+WI')})`), { keyword: 'Data Analyst', state: 'Madison, WI' });
    for (const suffix of [
      '?tool=pathway&view=jobs&role=Analyst&location=WI&role=Engineer',
      '?tool=pathway&view=jobs&role=Analyst&location=WI&email=synthetic@example.invalid',
      '?tool=pathway&view=other&role=Analyst&location=WI',
      '?tool=pathway&view=jobs&role=%3Cscript%3E&location=WI',
      '?tool=pathway&view=jobs&role=Analyst&location=WI%0Asecret',
      '?tool=pathway&view=jobs&role=' + 'x'.repeat(121) + '&location=WI'
    ]) assert.equal(await ev(`topsReadJobSearchURL(${JSON.stringify(origin + '/' + suffix)})`), null);
    assert.equal(await ev('topsJobSearchQuery("Analyst", " ")'), null);
    assert.equal(await ev('topsJobSearchQuery(["Analyst"], "WI")'), null);
    const cleanSourceURL = new URL(await ev(`topsJobSearchURL('Data Analyst', 'Madison, WI', ${JSON.stringify(origin + '/?email=SYNTHETIC_PRIVATE_EMAIL&tool=pathway#SYNTHETIC_PRIVATE_HASH')})`));
    assert.deepEqual([...cleanSourceURL.searchParams.keys()].sort(), ['location', 'role', 'tool', 'view']);
    assert.equal(cleanSourceURL.hash, '');
    const sameOriginURL = new URL(await ev('topsJobSearchURL("Data Analyst", "WI", "https://transitionops.org//example.invalid/path?private=1")'));
    assert.equal(sameOriginURL.origin, 'https://transitionops.org', 'a double-slash path cannot become a different share destination');
    assert.equal(sameOriginURL.searchParams.has('private'), false);
    assert.equal(await ev('document.getElementById("tops-career-experience-first").checkVisibility()'), true, 'resume path stays available');
    assert.equal(await ev('document.getElementById("tops-career-explore-first").checkVisibility()'), true, 'unsure/no-resume path stays available');
    await input('tops-career-search-role', 'Data Analyst'); await input('tops-career-search-area', 'Madison, WI');
    assert.equal(calls.length, 0, 'typing is not a search');
    const freshLayout = [];
    for (const [width, height] of [[375, 812], [320, 568]]) {
      await c.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: true });
      for (const theme of ['professional', 'tactical']) {
        if (await ev('document.documentElement.getAttribute("data-tops-theme")') !== theme) await ev('[...document.querySelectorAll("button")].find(button => (button.getAttribute("aria-label") || "").startsWith("Switch to")).click()');
        await ev('window.scrollTo(0, 0)'); await frames();
        const bounds = await ev('(() => { const b = document.getElementById("tops-career-search-start").getBoundingClientRect(), n = document.querySelector(".bottom-nav").getBoundingClientRect(); return {top:b.top,bottom:b.bottom,height:b.height,navTop:n.top,viewportHeight:innerHeight}; })()');
        freshLayout.push({ viewport: { width, height }, theme, ...bounds });
        assert.ok(await ev('document.documentElement.scrollWidth <= innerWidth + 1'), 'fresh Career has no horizontal overflow at ' + width + ' ' + theme);
        assert.ok(bounds.height >= 44, 'the primary search target remains at least 44 pixels high');
        if (width === 375) assert.ok(bounds.top >= 0 && bounds.bottom <= Math.min(bounds.navTop, bounds.viewportHeight) + 1, 'the search action is visible above bottom navigation on a 375 by 812 phone: ' + JSON.stringify(bounds));
        else {
          await ev('(() => { const primarySearch = document.getElementById("tops-career-search-start"); primarySearch.focus({preventScroll:true}); primarySearch.scrollIntoView({block:"center"}); })()'); await frames();
          assert.equal(await ev('document.activeElement.id'), 'tops-career-search-start');
          assert.ok(await ev('(() => { const b = document.getElementById("tops-career-search-start"), r = b.getBoundingClientRect(), n = document.querySelector(".bottom-nav").getBoundingClientRect(); return r.top >= 0 && r.bottom <= Math.min(n.top, innerHeight) + 1 && b.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)); })()'), 'the primary search action is reachable and unobscured after scrolling on a 320 by 568 phone');
        }
        assert.ok(await ev('["tops-career-search-role", "tops-career-search-area"].every(id => { const node = document.getElementById(id); return node.checkVisibility() && node.labels.length > 0 && node.getBoundingClientRect().height >= 44; })'));
        assert.equal(await ev('document.getElementById("tops-career-search-notice").checkVisibility()'), true, 'the immediate query disclosure stays visible without opening details');
      }
    }
    console.log('FRESH CAREER LAYOUT ' + JSON.stringify(freshLayout));
    await c.send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true }); await frames();
    await reveal('tops-career-search-area'); await ev('document.getElementById("tops-career-search-area").focus()');
    assert.equal(await ev('document.activeElement.id'), 'tops-career-search-area', 'native Enter submits from the location field');
    await c.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r', windowsVirtualKeyCode: 13 });
    await c.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    await wait('!!document.getElementById("tops-federal-results")'); await frames();
    assert.deepEqual(calls, [{ keyword: 'Data Analyst', location: 'Madison, WI' }], 'one explicit entry action sends only the public query');
    assert.equal(await ev('document.getElementById("tops-job-role").value'), 'Data Analyst');
    assert.equal(await ev('document.getElementById("tops-job-area").value'), 'Madison, WI');
    assert.match(await ev('document.getElementById("tops-federal-results").parentElement.textContent'), /SYNTHETIC Data Analyst/);
    assert.match(await ev('document.getElementById("tops-federal-results").parentElement.textContent'), /USAJOBS/);
    assert.match(await ev('document.getElementById("tops-search-learning").textContent'), /Power BI/);
    assert.match(await ev('document.getElementById("tops-search-learning").textContent'), /Free self-paced training/);
    const visibleLearning = await ev('[...document.querySelectorAll("#tops-search-learning article p")].filter(node => node.checkVisibility()).map(node => node.innerText).join("\\n")');
    assert.match(visibleLearning, /Free self-paced training/);
    assert.match(visibleLearning, /Check certification exam pricing separately/);
    assert.match(visibleLearning, /Open to anyone; no military status requirement/);
    const visibleSkillBridge = await ev('[...document.querySelectorAll("#tops-search-skillbridge > p")].filter(node => node.checkVisibility()).map(node => node.innerText).join("\\n")');
    assert.match(visibleSkillBridge, /current dates, availability, eligibility and required approval/);
    const sourceNotice = await ev('document.getElementById("tops-federal-results").parentElement.querySelector("p").innerText');
    assert.match(sourceNotice, /Source: USAJOBS/);
    assert.match(sourceNotice, /Eligibility is not assessed here/);
    for (const id of ['tops-job-grouping-help', 'tops-job-remote-help']) {
      assert.equal(await ev(`document.getElementById(${JSON.stringify(id)}).open`), false, 'secondary results explanation starts collapsed');
      assert.equal(await ev(`document.querySelector('#' + ${JSON.stringify(id)} + ' > p').checkVisibility()`), false);
      await ev(`document.querySelector('#' + ${JSON.stringify(id)} + ' > summary').click()`); await frames();
      assert.equal(await ev(`document.querySelector('#' + ${JSON.stringify(id)} + ' > p').checkVisibility()`), true, 'the explanation remains available through its summary');
      await ev(`document.querySelector('#' + ${JSON.stringify(id)} + ' > summary').click()`); await frames();
      assert.equal(await ev(`document.getElementById(${JSON.stringify(id)}).open`), false);
    }
    assert.equal(calls.length, 1, 'reading results explanations does not search again');
    assert.ok(await ev('[...document.querySelectorAll("#tops-search-skillbridge a")].some(a => a.href === "https://www.skillbridge.mil/locations")'));
    assert.ok(await ev('[...document.querySelectorAll("#tops-search-skillbridge a")].some(a => a.href.startsWith("https://vets2pm.zohorecruit.com/careers"))'));
    assert.equal(await ev('document.querySelectorAll("#tops-talent-contact").length'), 1, 'exactly one contact component, including hidden DOM');
    assert.equal(await ev('document.getElementById("tops-talent-contact").open'), false);
    assert.equal(await plan(), before);

    // Share preview is a deliberate action; it contains no profile, plan, resume or contact fields.
    assert.equal(await ev('!!document.getElementById("tops-job-share-url")'), false);
    await tap('tops-job-share-prepare');
    const sharedURL = await ev('document.getElementById("tops-job-share-url").value');
    const shared = new URL(sharedURL);
    assert.equal(shared.origin, origin);
    assert.deepEqual([...shared.searchParams.keys()].sort(), ['location', 'role', 'tool', 'view']);
    assert.deepEqual(Object.fromEntries(shared.searchParams), { tool: 'pathway', view: 'jobs', role: 'Data Analyst', location: 'Madison, WI' });
    assert.equal(shared.hash, '');
    assert.equal(await ev('document.getElementById("tops-job-share-url").readOnly'), true);
    await tap('tops-job-share-copy'); assert.equal(await ev('syntheticCopies.at(-1)'), sharedURL);
    await tap('tops-job-share-download'); await wait('syntheticDownloads.length === 1');
    const savedSearch = await ev('syntheticDownloads[0].text()');
    assert.ok(savedSearch.includes(sharedURL)); assert.ok(!savedSearch.includes('PRIVATE_'));
    assert.ok(!await ev('JSON.stringify(localStorage).includes("view=jobs") || JSON.stringify(sessionStorage).includes("view=jobs")'));
    assert.ok(!await ev('location.href.includes("Data") || location.href.includes("Madison")'), 'typing/sharing must not rewrite the current URL with the query');

    // Email fields remain blank until a deliberate transfer; ongoing permission is separate.
    await reveal('tops-talent-email');
    assert.equal(await ev('document.getElementById("tops-talent-email").value'), '');
    assert.equal(await ev('document.getElementById("tops-talent-roles").value'), '');
    assert.equal(await ev('document.getElementById("tops-talent-location").value'), '');
    assert.equal(await ev('document.getElementById("tops-talent-purpose").value'), 'question');
    assert.equal(await ev('!!document.getElementById("tops-talent-permission")'), false);
    await tap('tops-talent-use-search');
    assert.equal(await ev('document.getElementById("tops-talent-roles").value'), 'Data Analyst');
    assert.equal(await ev('document.getElementById("tops-talent-location").value'), 'Madison, WI');
    assert.equal(await ev('!!document.getElementById("tops-talent-permission")'), false);
    await input('tops-talent-email', 'synthetic.member@example.invalid');
    await input('tops-talent-note', 'SYNTHETIC: Which search term should I try next?');
    await tap('tops-talent-prepare'); await wait('document.activeElement.id === "tops-talent-review-heading"');
    const question = await ev('document.getElementById("tops-talent-message").value');
    assert.match(question, /This is a one-time inquiry/);
    assert.match(question, /It does not give permission for ongoing recruiting contact/);
    assert.match(question, /Data Analyst/); assert.match(question, /Madison, WI/);
    assert.ok(!question.includes('PRIVATE_')); assert.ok(!question.includes('I give Veteran Bridge Solutions permission'));
    assert.equal(await ev('syntheticClicks.filter(link => link.href.startsWith("mailto:")).length'), 0);
    const callsBeforeContactReturn = calls.length;
    await tap('tops-career-screen-back'); await tap('tops-career-find-jobs');
    await wait('document.getElementById("tops-talent-message")?.checkVisibility()');
    assert.equal(await ev('document.getElementById("tops-talent-message").value'), question, 'reviewed search inquiry survives Back and reopening Jobs');
    assert.equal(calls.length, callsBeforeContactReturn, 'returning to the search does not submit another query');
    assert.equal(await ev('document.querySelectorAll("#tops-talent-contact").length'), 1);
    await tap('tops-talent-open');
    const questionMailto = new URL(await ev('syntheticClicks.find(link => link.href.startsWith("mailto:")).href'));
    assert.equal(questionMailto.pathname, 'dean@veteranbridgesolutions.com');
    assert.equal(questionMailto.searchParams.get('subject'), 'Question about my job search');
    assert.equal(questionMailto.searchParams.get('body'), question);
    assert.match(await ev('document.getElementById("tops-talent-status").textContent'), /Nothing has been sent/);
    await tap('tops-talent-edit');
    const searchContactFields = await ev('["email", "roles", "location", "note"].map(key => document.getElementById("tops-talent-" + key).value)');
    await input('tops-job-role', '');
    assert.equal(await ev('!!document.getElementById("tops-talent-email") && document.getElementById("tops-talent-email").checkVisibility()'), false);
    await input('tops-job-role', 'Data Analyst'); await reveal('tops-talent-email');
    assert.deepEqual(await ev('["email", "roles", "location", "note"].map(key => document.getElementById("tops-talent-" + key).value)'), searchContactFields, 'temporary incomplete query preserves contact fields');
    assert.equal(calls.length, callsBeforeContactReturn);
    await reveal('tops-talent-purpose');
    await ev('(() => { const node = document.getElementById("tops-talent-purpose"); node.value = "interest"; node.dispatchEvent(new Event("change", { bubbles: true })); })()'); await frames();
    assert.equal(await ev('document.getElementById("tops-talent-permission").checked'), false);
    await tap('tops-talent-prepare'); assert.equal(await ev('!!document.getElementById("tops-talent-open")'), false);
    await tap('tops-talent-permission'); await tap('tops-talent-prepare');
    await wait('document.activeElement.id === "tops-talent-review-heading"');
    const reviewed = await ev('document.getElementById("tops-talent-message").value');
    assert.match(reviewed, /Data Analyst/); assert.match(reviewed, /Madison, WI/);
    assert.ok(!reviewed.includes('PRIVATE_'));
    assert.equal(await ev('syntheticClicks.filter(link => link.href.startsWith("mailto:")).length'), 1);
    await tap('tops-talent-open');
    const mailto = new URL(await ev('syntheticClicks.filter(link => link.href.startsWith("mailto:")).at(-1).href'));
    assert.equal(mailto.pathname, 'dean@veteranbridgesolutions.com'); assert.equal(mailto.searchParams.get('body'), reviewed);
    assert.equal(mailto.searchParams.get('subject'), 'VBS recruiting interest');
    assert.match(reviewed, /I give Veteran Bridge Solutions permission/);
    assert.ok(!reviewed.includes('Which search term should I try next?'));
    assert.match(await ev('document.getElementById("tops-talent-status").textContent'), /Nothing has been sent/);
    await tap('tops-talent-edit');
    assert.equal(await ev('document.getElementById("tops-talent-permission").checked'), false);
    assert.equal(await ev('!!document.getElementById("tops-talent-open")'), false);
    const employerLink = await ev('document.getElementById("tops-employer-booking").href');
    assert.equal(employerLink, 'https://calendly.com/dean-veteranbridgesolutions/30min');
    assert.equal(new URL(employerLink).search, '');
    await tap('tops-employer-booking');
    assert.equal(await ev('document.getElementById("tops-talent-permission").checked'), false, 'employer booking cannot grant job-seeker recruiting permission');
    assert.equal(await plan(), before);
    assert.ok(!await ev('JSON.stringify(localStorage).includes("synthetic.member@example.invalid") || JSON.stringify(sessionStorage).includes("synthetic.member@example.invalid")'));

    // A changed query clears stale results. Late responses cannot restore the earlier search.
    const count = calls.length;
    await input('tops-job-role', 'Project Manager');
    assert.equal(calls.length, count); assert.equal(await ev('!!document.getElementById("tops-federal-results")'), false);
    assert.equal(await ev('!!document.getElementById("tops-job-share-url")'), false, 'old share preview is invalidated on query edits');
    responseMode = 'held'; await tap('tops-federal-search');
    await wait('document.getElementById("tops-federal-search").textContent.includes("Searching")');
    while (!held.length) await new Promise(resolve => setTimeout(resolve, 10));
    await input('tops-job-area', 'Milwaukee, WI'); held.shift()(); await frames();
    assert.equal(await ev('!!document.getElementById("tops-federal-results")'), false);
    assert.equal(await ev('document.body.textContent.includes("SYNTHETIC STALE RESPONSE")'), false);
    responseMode = 'empty'; await tap('tops-federal-search'); await wait('document.getElementById("tops-federal-status").textContent.includes("No public")');
    assert.equal((await findExternalSearches()).length, 2); assert.ok(await ev('!!document.getElementById("tops-search-learning")'));
    responseMode = 'error'; await tap('tops-federal-search'); await wait('document.getElementById("tops-federal-status").textContent.includes("busy")');
    assert.equal((await findExternalSearches()).length, 2); assert.equal(await plan(), before);

    // A durable query link restores useful searches, without submitting or importing personal work.
    available = false; const beforeReturn = calls.length;
    await load(sharedURL); await wait('document.getElementById("tops-federal-status")?.textContent.includes("not connected")');
    assert.equal(await ev('document.getElementById("tops-job-role").value'), 'Data Analyst');
    assert.equal(await ev('document.getElementById("tops-job-area").value'), 'Madison, WI');
    assert.equal(calls.length, beforeReturn, 'opening a saved/shared URL must not auto-search');
    assert.equal(await ev('document.getElementById("tops-federal-search").disabled'), true);
    assert.equal((await findExternalSearches()).length, 2);
    assert.equal(await ev('document.querySelectorAll("#tops-talent-contact").length'), 1);
    await reveal('tops-talent-email');
    assert.equal(await ev('document.getElementById("tops-talent-email").value'), '');
    assert.equal(await ev('document.getElementById("tops-talent-roles").value'), '');
    assert.equal(await ev('document.getElementById("tops-talent-location").value'), '');
    assert.equal(await ev('document.getElementById("tops-talent-purpose").value'), 'question');
    assert.equal(await ev('!!document.getElementById("tops-talent-permission")'), false);
    assert.equal(await plan(), before);
    for (const width of [320, 375]) {
      await c.send('Emulation.setDeviceMetricsOverride', { width, height: 812, deviceScaleFactor: 1, mobile: true });
      for (const theme of ['professional', 'tactical']) {
        if (await ev('document.documentElement.getAttribute("data-tops-theme")') !== theme) await ev('[...document.querySelectorAll("button")].find(button => (button.getAttribute("aria-label") || "").startsWith("Switch to")).click()');
        await frames();
        assert.ok(await ev('document.documentElement.scrollWidth <= innerWidth + 1'), 'no horizontal overflow at ' + width + ' ' + theme);
        assert.ok(await ev('[...document.querySelectorAll("#tops-live-jobs-panel button, #tops-live-jobs-panel a, #tops-live-jobs-panel select")].filter(node => node.checkVisibility()).every(node => node.getBoundingClientRect().height >= 44)'));
        assert.ok(await ev('[...document.querySelectorAll("#tops-live-jobs-panel input, #tops-live-jobs-panel textarea, #tops-live-jobs-panel select")].every(node => node.labels.length > 0)'));
        assert.ok(await ev('(() => { const ids = [...document.querySelectorAll("[id]")].map(node => node.id); return ids.length === new Set(ids).size; })()'));
      }
    }
    // The original Career-result contact also survives a visit to Jobs, independently of the search contact.
    await tap('tops-career-screen-back'); await tap('tops-career-explore-first');
    await wait('!!document.getElementById("tops-talent-contact")'); await reveal('tops-talent-email');
    assert.equal(await ev('document.getElementById("tops-talent-purpose").value'), 'interest');
    await input('tops-talent-email', 'synthetic.career@example.invalid');
    await input('tops-talent-roles', 'SYNTHETIC Career Operations');
    await input('tops-talent-location', 'Green Bay, WI');
    await tap('tops-talent-permission'); await tap('tops-talent-prepare');
    const careerReview = await ev('document.getElementById("tops-talent-message").value');
    await tap('tops-career-find-jobs'); await wait('document.getElementById("tops-job-role")?.checkVisibility()');
    await reveal('tops-talent-email');
    assert.equal(await ev('document.getElementById("tops-talent-purpose").value'), 'question');
    assert.equal(await ev('document.getElementById("tops-talent-email").value'), '', 'the search contact does not inherit the Career contact');
    assert.equal(await ev('document.querySelectorAll("#tops-talent-contact").length'), 1);
    assert.ok(await ev('(() => { const ids = [...document.querySelectorAll("[id]")].map(node => node.id); return ids.length === new Set(ids).size; })()'));
    await tap('tops-career-screen-back'); await wait('document.getElementById("tops-talent-message")?.checkVisibility()');
    assert.equal(await ev('document.getElementById("tops-talent-message").value'), careerReview, 'reviewed Career contact survives Jobs and Back');
    await tap('tops-talent-edit');
    assert.deepEqual(await ev('["email", "roles", "location"].map(key => document.getElementById("tops-talent-" + key).value)'), ['synthetic.career@example.invalid', 'SYNTHETIC Career Operations', 'Green Bay, WI']);
    assert.equal(await plan(), before);
    assert.equal(calls.length, beforeReturn);
    assert.deepEqual(errors, []);
    assert.equal(blocked.some(request => request.url.includes('/.netlify/') || request.url.includes('calendly') || request.postData?.includes('PRIVATE_')), false);
    assert.equal(requests.some(request => /account-plan|\/resume|\/navigator/.test(request.url)), false);
    assert.ok(calls.every(call => Object.keys(call).sort().join(',') === 'keyword,location' && !JSON.stringify(call).includes('PRIVATE_')));
    console.log('CAREER VALUE FIRST PASS: direct role/location entry, one explicit federal request, source results and role learning, honest SkillBridge discovery, one-time inquiry separate from recruiting consent, separate employer booking, query-only save/share and return, stale/empty/error/unavailable recovery, preserved saved work, no automatic personal transfer or provider traffic, and 320/375 theme reflow.');
  } finally {
    held.splice(0).forEach(release => release());
    if (chrome) { await h.stopChrome(chrome); chrome.child.stderr?.destroy(); }
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error.stack); process.exitCode = 1; });
