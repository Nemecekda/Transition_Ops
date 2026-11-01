'use strict';
// Synthetic local course selection. All provider, mail and external learning traffic is blocked.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http'), os = require('node:os'), { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..'), utility = fs.readFileSync(path.join(__dirname, 'privacy-network-regression.js'), 'utf8');
const h = new Function('fs', 'path', 'os', 'spawn', utility.slice(utility.indexOf('function findChrome()'), utility.indexOf('const PROBE_SCRIPT =')) + '\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs, path, os, spawn);
const requests = [], blocked = [];
const server = http.createServer((req, res) => {
  requests.push({ method: req.method, url: req.url });
  if (req.url.startsWith('/.netlify/functions/federal-jobs') && req.method === 'GET') { res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ available: false, provider: 'USAJOBS' })); }
  const file = path.join(root, new URL(req.url, 'http://localhost').pathname === '/' ? 'index.html' : new URL(req.url, 'http://localhost').pathname);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream'); res.end(fs.readFileSync(file));
});
(async () => {
  let chrome;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = 'http://127.0.0.1:' + server.address().port;
    chrome = await h.launchChrome(h.findChrome(), 12);
    const c = chrome.client, ev = expression => h.evaluate(c, expression, true), wait = expression => h.waitForExpression(c, expression, expression, 12000), errors = [];
    const frames = () => ev('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
    const capture = async (name, selector) => {
      if (!process.env.LEARNING_EVIDENCE_DIR) return;
      await c.send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true }); await frames();
      const clip = await ev(`(()=>{const n=document.querySelector(${JSON.stringify(selector)});n.scrollIntoView({block:'start'});const r=n.getBoundingClientRect();return {x:Math.max(0,r.x+scrollX),y:r.y+scrollY,width:Math.min(r.width,375),height:r.height,scale:1};})()`);
      assert.ok(await ev('document.documentElement.scrollWidth<=innerWidth+1'), 'inline phone review does not overflow');
      fs.mkdirSync(process.env.LEARNING_EVIDENCE_DIR, { recursive: true });
      const shot = await c.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip });
      fs.writeFileSync(path.join(process.env.LEARNING_EVIDENCE_DIR, name + '.png'), Buffer.from(shot.data, 'base64'));
    };
    await c.send('Page.enable'); await c.send('Runtime.enable');
    c.on('Runtime.exceptionThrown', event => errors.push(event.exceptionDetails.text));
    await c.send('Page.addScriptToEvaluateOnNewDocument', { source: `
      try { localStorage.setItem('tops_onboarded','1'); localStorage.setItem('tops_user_status','guard'); } catch {}
      window.__storageWrites=[]; window.__failStorageKey=''; window.__externalClicks=[];
      const originalSet=Storage.prototype.setItem;
      Storage.prototype.setItem=function(key,value){ if(this===localStorage){__storageWrites.push(key);if(key===__failStorageKey)throw Error('SYNTHETIC storage refusal');}return originalSet.call(this,key,value); };
      document.addEventListener('click',event=>{const link=event.target.closest('a');if(link&&!link.href.startsWith(location.origin)){event.preventDefault();__externalClicks.push(link.href);}},true);
    ` });
    await c.send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
    c.on('Fetch.requestPaused', async event => {
      const local = event.request.url.startsWith(origin) && (!event.request.url.includes('/.netlify/') || event.request.method === 'GET' && event.request.url.includes('/.netlify/functions/federal-jobs'));
      if (!local) blocked.push(event.request.url);
      try { await c.send(local ? 'Fetch.continueRequest' : 'Fetch.failRequest', local ? { requestId: event.requestId } : { requestId: event.requestId, errorReason: 'BlockedByClient' }); } catch {}
    });
    const load = async url => { await c.send('Page.navigate', { url }); await wait('!!document.getElementById("tops-main-content")'); await frames(); };
    const reveal = async id => { await ev(`(()=>{const node=document.getElementById(${JSON.stringify(id)});if(!node)throw Error('Missing '+${JSON.stringify(id)});const parents=[];for(let p=node.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS'&&!p.open)parents.unshift(p);for(const p of parents)p.querySelector(':scope > summary').click();if(!node.checkVisibility())throw Error('Hidden '+${JSON.stringify(id)});})()`); await frames(); };
    const tap = async id => { await reveal(id); await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});if(n.disabled)throw Error('Disabled '+${JSON.stringify(id)});n.click();})()`); await frames(); };
    const attempt = async id => { await reveal(id); await ev(`document.getElementById(${JSON.stringify(id)}).click()`); await frames(); };
    const input = async (id, value) => { await reveal(id); await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});Object.getOwnPropertyDescriptor(n.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype,'value').set.call(n,${JSON.stringify(value)});n.dispatchEvent(new Event('input',{bubbles:true}));})()`); await frames(); };
    const textClick = async text => { await ev(`(()=>{const n=[...document.querySelectorAll('button')].find(n=>n.textContent===${JSON.stringify(text)}&&n.checkVisibility());if(!n)throw Error('Missing visible button '+${JSON.stringify(text)});n.click();})()`); await frames(); };
    const raw = () => ev('JSON.stringify(["tops_personal_guide_v1","tops_career_action_v1","tops_career_gap_v1","tops_my_jobs_v1"].map(key=>localStorage.getItem(key)))');
    const gapRaw = () => ev('localStorage.getItem("tops_career_gap_v1")');
    const searchURL = origin + '/?tool=pathway&view=jobs&role=Data+Analyst&location=53202';
    const searchPrefix = 'tops-learning-search';
    const selectedText = 'Explore Microsoft Learn: Power BI for Data Analyst. Check access first.';
    const powerURL = 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi';
    const homeResource = () => ev('(()=>{const n=[...document.querySelectorAll("a.tops-move-primary")].find(n=>n.checkVisibility());return n?{href:n.href,target:n.target,rel:n.rel,ref:n.referrerPolicy,text:n.textContent}:null;})()');
    const noIntake = async () => assert.equal(await ev('!!document.getElementById("career-starter-resume")&&document.getElementById("career-starter-resume").checkVisibility()'), false, 'course selection stays out of the gap/resume intake');
    const seed = async existing => {
      await ev(`(()=>{localStorage.clear();localStorage.setItem('tops_onboarded','1');const guide=topsEmptyGuide();guide.currentRole='SYNTHETIC retained experience';if(${existing}){guide.pathway='change';guide.targetRole='Recruiter';guide.goal='SYNTHETIC old goal';}const gap=topsEmptyGap();gap.target='SYNTHETIC separate worksheet';gap.rows[0].have='SYNTHETIC saved worksheet note';localStorage.setItem('tops_personal_guide_v1',JSON.stringify(guide));localStorage.setItem('tops_career_gap_v1',JSON.stringify(gap));if(${existing})localStorage.setItem('tops_career_action_v1',JSON.stringify({version:1,text:'SYNTHETIC earlier step',date:'2099-04-15',done:true,context:guide}));})()`);
      await load(searchURL); await wait('document.getElementById("tops-job-role")?.value==="Data Analyst"');
    };
    const reviewSearch = async () => { await tap(searchPrefix + '-add-microsoft-powerbi'); await wait('document.activeElement.id==="tops-learning-search-review"'); await noIntake(); };
    const ensureReplace = async prefix => { if (await ev(`!!document.getElementById(${JSON.stringify(prefix + '-replace')})`)) await tap(prefix + '-replace'); };
    await load(origin + '/?tool=pathway'); await seed(false);
    const untouched = await raw();
    // First functional assertion also provides the baseline negative control.
    assert.equal(await ev('!!document.getElementById("tops-learning-search-add-microsoft-powerbi")&&document.getElementById("tops-learning-search-add-microsoft-powerbi").checkVisibility()'), true, 'a recommendation offers a direct Add to my plan action');
    await reviewSearch();
    assert.match(await ev('document.querySelector("section[aria-labelledby=tops-learning-search-review]").textContent'), /Data Analyst/);
    assert.match(await ev('document.querySelector("section[aria-labelledby=tops-learning-search-review]").textContent'), /Sketch a useful report/);
    assert.match(await ev('document.getElementById("tops-learning-search-storage").textContent'), /Use for this visit leaves your saved plan unchanged/);
    assert.equal(await raw(), untouched, 'opening the inline review writes nothing');
    await capture('375-inline-fresh', 'section[aria-labelledby=tops-learning-search-review]');
    await tap(searchPrefix + '-cancel'); assert.equal(await raw(), untouched);
    assert.equal(await ev('document.activeElement.id'), searchPrefix + '-add-microsoft-powerbi');

    // Visit-only adoption changes the current direction/step, with a direct Home return and no persistence.
    await reviewSearch(); await tap(searchPrefix + '-visit'); await tap(searchPrefix + '-open');
    await wait('!!document.getElementById("tops-loop-title")');
    assert.equal((await homeResource()).href, powerURL); assert.equal(await raw(), untouched);
    await load(origin + '/?tool=dashboard'); assert.equal(await homeResource(), null); assert.equal(await raw(), untouched);

    // Explicit replacement discloses the old role, goal, date and completion state; cancellation keeps all bytes.
    await seed(true); const prior = await raw(); await reviewSearch();
    const preview = await ev('document.querySelector("section[aria-labelledby=tops-learning-search-review]").textContent');
    for (const text of ['Recruiter', 'SYNTHETIC old goal', 'SYNTHETIC earlier step', '2099-04-15', 'Marked done', 'Data Analyst']) assert.ok(preview.includes(text));
    await capture('375-inline-replacement', 'section[aria-labelledby=tops-learning-search-review]');
    assert.equal(await ev('document.getElementById("tops-learning-search-save").disabled'), true);
    assert.equal(await ev('document.getElementById("tops-learning-search-visit").disabled'), true);
    await attempt(searchPrefix + '-save'); assert.equal(await raw(), prior);
    await tap(searchPrefix + '-cancel'); assert.equal(await raw(), prior);
    await reviewSearch(); await tap(searchPrefix + '-replace'); await ev('window.__storageWrites=[]'); await tap(searchPrefix + '-save');
    const saved = await raw(), savedAction = await ev('JSON.parse(localStorage.getItem("tops_career_action_v1"))'), savedGuide = await ev('JSON.parse(localStorage.getItem("tops_personal_guide_v1"))');
    assert.equal(savedAction.text, selectedText); assert.equal(savedAction.date, ''); assert.equal(savedAction.done, false);
    assert.equal(savedGuide.targetRole, 'Data Analyst'); assert.equal(savedGuide.pathway, 'skills'); assert.equal(savedGuide.goal, ''); assert.equal(savedGuide.currentRole, 'SYNTHETIC retained experience');
    assert.deepEqual(savedAction.context, savedGuide);
    assert.equal(JSON.parse(saved)[2], JSON.parse(prior)[2]); assert.equal(JSON.parse(saved)[3], JSON.parse(prior)[3]);
    assert.deepEqual([...new Set(await ev('__storageWrites'))].sort(), ['tops_career_action_v1', 'tops_personal_guide_v1']);
    await tap(searchPrefix + '-open'); await wait('!!document.getElementById("tops-loop-title")');
    assert.equal((await homeResource()).href, powerURL);
    await capture('375-my-plan-exact-course', 'section[aria-labelledby=tops-loop-title]');
    await load(origin + '/?tool=dashboard');
    assert.deepEqual(await homeResource(), { href: powerURL, target: '_blank', rel: 'noopener noreferrer', ref: 'no-referrer', text: 'Open Microsoft Learn: Power BI (opens a new tab)' });
    assert.equal(await raw(), saved);

    // Same-role support direction is retained exactly, while a chosen course uses the ordinary step editor.
    await seed(false);
    const supportGuide = await ev("(()=>{const guide={version:1,pathway:'support',currentRole:'SYNTHETIC retained experience',targetRole:'Data Analyst',goal:'SYNTHETIC retained support goal'};localStorage.setItem('tops_personal_guide_v1',JSON.stringify(guide));return guide;})()");
    await load(searchURL); await reviewSearch();
    assert.equal(await ev('!!document.getElementById("tops-learning-search-replace")'), false, 'same role and direction with no current action need no replacement');
    assert.match(await ev('document.querySelector("section[aria-labelledby=tops-learning-search-review]").textContent'), /SYNTHETIC retained support goal/);
    await tap(searchPrefix + '-save');
    assert.deepEqual(await ev('JSON.parse(localStorage.getItem("tops_personal_guide_v1"))'), supportGuide);
    assert.deepEqual(await ev('JSON.parse(localStorage.getItem("tops_career_action_v1")).context'), supportGuide);
    await tap(searchPrefix + '-open'); assert.equal((await homeResource()).href, powerURL);
    assert.equal(await ev('!!document.getElementById("tops-loop-support-open")'), false);
    await textClick('Update this step'); await reveal('tops-action-text');
    assert.equal(await ev('document.getElementById("tops-action-text").value'), selectedText);
    assert.equal(await ev('!!document.getElementById("tops-support-text")'), false);
    await load(origin + '/?tool=dashboard'); assert.equal((await homeResource()).href, powerURL);

    // An older action belonging to another role is labelled with its own context before replacement.
    await seed(true);
    await ev("(()=>{const guide=JSON.parse(localStorage.getItem('tops_personal_guide_v1'));guide.targetRole='Data Analyst';guide.pathway='skills';localStorage.setItem('tops_personal_guide_v1',JSON.stringify(guide));})()");
    await load(searchURL); const staleContextRaw = await raw(); await reviewSearch();
    assert.match(await ev('document.querySelector("section[aria-labelledby=tops-learning-search-review]").textContent'), /Current step for Recruiter: SYNTHETIC earlier step/);
    assert.equal(await ev('document.getElementById("tops-learning-search-save").disabled'), true);
    await tap(searchPrefix + '-cancel'); assert.equal(await raw(), staleContextRaw);

    // Search edits and concurrent disk changes invalidate only the pending choice.
    await seed(true); await reviewSearch(); await tap(searchPrefix + '-replace');
    const searchBefore = await raw(); await input('tops-job-role', 'Recruiter'); await attempt(searchPrefix + '-save');
    assert.equal(await raw(), searchBefore); assert.match(await ev('document.getElementById("tops-learning-search-status").textContent'), /changed|review/i);
    await seed(true); await reviewSearch(); await tap(searchPrefix + '-replace');
    await ev('localStorage.setItem("tops_career_action_v1",localStorage.getItem("tops_career_action_v1")+" ")'); const concurrent = await raw();
    await attempt(searchPrefix + '-save'); assert.equal(await raw(), concurrent, 'concurrent raw bytes are not overwritten');

    // A partial two-key write failure restores the old guide/action without ever writing the worksheet.
    await seed(true); const beforeFailure = await raw(); await reviewSearch(); await tap(searchPrefix + '-replace');
    await ev('window.__storageWrites=[];window.__failStorageKey="tops_career_action_v1"'); await tap(searchPrefix + '-save');
    assert.equal(await raw(), beforeFailure); assert.ok(!await ev('__storageWrites.includes("tops_career_gap_v1")'));
    assert.match(await ev('document.getElementById("tops-learning-search-status").textContent'), /not saved|could not|restored/i);
    await ev('window.__failStorageKey=""');

    // In-memory worksheet edits remain unsaved when a separate learning step is saved.
    await seed(false); const oldGap = await gapRaw(); await tap('tops-career-other-tools'); await textClick('Career plan');
    await input('career-gap-0-have', 'SYNTHETIC unsaved worksheet edit'); assert.equal(await gapRaw(), oldGap);
    await tap('tops-career-find-jobs'); await reviewSearch(); await ensureReplace(searchPrefix); await tap(searchPrefix + '-save');
    assert.equal(await gapRaw(), oldGap, 'saving a learning step cannot persist unsaved worksheet notes');
    await tap('tops-career-other-tools'); await textClick('Career plan'); await reveal('career-gap-0-have');
    assert.equal(await ev('document.getElementById("career-gap-0-have").value'), 'SYNTHETIC unsaved worksheet edit');

    // A posting-only saved-job option can be deliberately chosen for that role without copying its posting to the gap.
    await seed(true);
    const sourceJob = { id: '987654321', title: 'SYNTHETIC Nurse', agency: 'SYNTHETIC Agency', location: 'Madison, WI', salary: 'Not supplied', closingDate: '2099-12-01', whoMayApply: 'Open to the public', qualifications: 'Use Power BI to summarize service quality data.', url: 'https://www.usajobs.gov/job/987654321', retrievedAt: '2026-11-01T12:00:00Z' };
    const jobId = await ev(`(()=>{const job=topsNewJob(${JSON.stringify(sourceJob)});localStorage.setItem('tops_my_jobs_v1',JSON.stringify({version:1,jobs:[job]}));return job.id;})()`);
    await load(origin + '/?tool=pathway'); await tap('tops-my-jobs-open');
    const openJobLearning = async id => { await ev(`document.querySelector('[data-job-review="'+${JSON.stringify(id)}+'"] > summary').click()`); await frames(); await ev(`document.querySelector('[data-job-learning="'+${JSON.stringify(id)}+'"] > summary').click()`); await frames(); };
    await openJobLearning(jobId); const prefix = 'tops-learning-job-' + jobId; const beforeJob = await raw();
    await tap(prefix + '-add-microsoft-powerbi'); await noIntake();
    assert.equal(await ev('document.getElementById("tops-my-jobs-heading").checkVisibility()'), true);
    await tap(prefix + '-replace');
    await ev('(()=>{const jobs=JSON.parse(localStorage.getItem("tops_my_jobs_v1"));jobs.jobs[0].id+="-different";localStorage.setItem("tops_my_jobs_v1",JSON.stringify(jobs));})()');
    const changedJob = await raw(); await attempt(prefix + '-save'); assert.equal(await raw(), changedJob, 'same-title replacement job cannot reuse a pending choice');
    await ev(`localStorage.setItem('tops_my_jobs_v1',${JSON.stringify(JSON.parse(beforeJob)[3])})`);
    await load(origin + '/?tool=pathway'); await tap('tops-my-jobs-open'); await openJobLearning(jobId);
    await tap(prefix + '-add-microsoft-powerbi'); await tap(prefix + '-replace'); await tap(prefix + '-save');
    const selectedJobAction = await ev('JSON.parse(localStorage.getItem("tops_career_action_v1"))');
    assert.equal(selectedJobAction.text, 'Explore Microsoft Learn: Power BI for SYNTHETIC Nurse. Check access first.');
    assert.equal(await gapRaw(), JSON.parse(beforeJob)[2]);
    assert.equal(await ev('localStorage.getItem("tops_my_jobs_v1")'), JSON.parse(beforeJob)[3]);
    await tap(prefix + '-open'); await load(origin + '/?tool=dashboard'); assert.equal((await homeResource()).href, powerURL);

    // Explicit selections have their own exact role-bound identity; legacy inference remains context guarded.
    assert.equal(await ev(`topsSelectedLearningNext(${JSON.stringify(selectedJobAction.text)},'SYNTHETIC Nurse').id`), 'microsoft-powerbi');
    assert.equal(await ev(`topsSelectedLearningNext(${JSON.stringify(selectedJobAction.text)},'Recruiter')`), null);
    assert.equal(await ev(`topsSelectedLearningNext(${JSON.stringify(selectedJobAction.text + ' custom edit')},'SYNTHETIC Nurse')`), null);
    assert.equal(await ev('topsCareerLearningNext("Explore Microsoft Learn: Power BI. Check access and choose one learning activity.","Recruiter",[])'), null);
    assert.equal(await ev('topsCareerLearningNext("Explore Microsoft Learn: Power BI. Check access and choose one learning activity.","SYNTHETIC Nurse",[{requirement:"Use AWS for infrastructure."}])'), null);
    assert.equal(await ev('topsCareerLearningNext("Explore Microsoft Learn: Power BI. Check access and choose one learning activity.","SYNTHETIC Nurse",[{requirement:"Use Power BI for reporting."}]).id'), 'microsoft-powerbi');
    for (const width of [320, 375]) { await c.send('Emulation.setDeviceMetricsOverride', { width, height: 812, deviceScaleFactor: 1, mobile: true }); await frames(); assert.ok(await ev('document.documentElement.scrollWidth<=innerWidth+1')); }
    assert.deepEqual(errors, []); assert.equal(requests.some(request=>request.method==='POST'), false);
    assert.equal(blocked.some(url=>url.includes('/.netlify/')||url.includes('learn.microsoft.com')||url.startsWith('mailto:')), false);
    assert.equal(await ev('__externalClicks.length'), 0);
    console.log('LEARNING FOLLOW THROUGH PASS: inline search/job review, exact role-bound course identity, cancel/replacement, visit/save/Home/reload, stale query/job/disk refusal, two-key rollback, unsaved worksheet preservation, legacy context guards, mobile reflow and zero provider/contact requests.');
  } finally {
    if (chrome) { await h.stopChrome(chrome); chrome.child.stderr?.destroy(); }
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
