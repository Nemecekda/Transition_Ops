'use strict';
// Synthetic fixtures only. Every external request is blocked; no model API is called.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http'), os = require('node:os'), { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..'), utility = fs.readFileSync(path.join(__dirname, 'privacy-network-regression.js'), 'utf8');
const h = new Function('fs', 'path', 'os', 'spawn', utility.slice(utility.indexOf('function findChrome()'), utility.indexOf('const PROBE_SCRIPT =')) + '\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs, path, os, spawn);
const posts = [], requests = [], errors = [];
const fixture = { id: '123', title: 'SYNTHETIC Data Analyst', agency: 'Example employer', location: 'Milwaukee, WI', salary: '$30 Per Hour', closingDate: '2099-12-31', whoMayApply: 'Open to the public', qualifications: 'Analyze data and explain findings to project teams.', url: 'https://www.usajobs.gov/job/123' };
let jobs = [fixture];
const server = http.createServer(async (req, res) => {
  requests.push(req.url);
  if (req.url.startsWith('/.netlify/functions/federal-jobs')) {
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'GET') return res.end(JSON.stringify({ available: true, provider: 'USAJOBS' }));
    let raw = ''; for await (const part of req) raw += part; posts.push(JSON.parse(raw));
    return res.end(JSON.stringify({ source: 'USAJOBS', scope: 'public', retrievedAt: '2026-11-15T12:00:00Z', jobs: jobs }));
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
    const textClick = async text => { await ev(`(()=>{const n=[...document.querySelectorAll('button')].find(n=>n.textContent===${JSON.stringify(text)});if(!n)throw Error('Missing '+${JSON.stringify(text)});const parents=[];for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS'&&!p.open)parents.unshift(p);for(const p of parents)p.querySelector(':scope>summary').click();if(!n.checkVisibility())throw Error('Hidden '+${JSON.stringify(text)});n.click()})()`); await frames(); };
    const input = async (id, value) => { await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});Object.getOwnPropertyDescriptor(n.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype,'value').set.call(n,${JSON.stringify(value)});n.dispatchEvent(new Event('input',{bubbles:true}));})()`); await frames(); };
    const seed = async (data, route) => { await load(); await ev(`localStorage.clear();localStorage.setItem('tops_onboarded','1');Object.entries(${JSON.stringify(data)}).forEach(([k,v])=>localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v)))`); await load(route); };

    const reveal = async id => { await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});if(!n)throw Error('Missing '+${JSON.stringify(id)});const parents=[];for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS'&&!p.open)parents.unshift(p);for(const p of parents)p.querySelector(':scope>summary').click();if(!n.checkVisibility())throw Error('Hidden '+${JSON.stringify(id)});})()`); await frames(); };
    const select = async (id, value) => { await reveal(id); await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});n.value=${JSON.stringify(value)};n.dispatchEvent(new Event('change',{bubbles:true}));})()`); await frames(); };
    const nav = async text => { await ev(`[...document.querySelectorAll('[aria-label="Primary"] button')].find(n=>n.textContent===${JSON.stringify(text)}).click()`); await frames(); };
    const disk = () => ev('JSON.stringify(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))');
    const form = () => ev('JSON.stringify(["career-starter-resume","career-starter-posting","tops-journey-role"].map(id=>[id,document.getElementById(id)?.value]))');
    const shot = async name => { if(!process.env.TOPS_FOLLOWTHROUGH_EVIDENCE)return; const dir=path.resolve(process.env.TOPS_FOLLOWTHROUGH_EVIDENCE); fs.mkdirSync(dir,{recursive:true}); const image=await c.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(dir,name+'.png'),Buffer.from(image.data,'base64')); };

    const search = async () => { await wait('!document.getElementById("tops-federal-search").disabled'); await click('tops-federal-search'); await wait('!!document.getElementById("tops-federal-results")'); };
    const searchRoute = '/?tool=pathway&view=jobs&role=&location=54211';
    jobs = [
      {...fixture,id:'1',title:'SYNTHETIC nationwide',location:'Anywhere in the U.S. (remote job)',url:'https://www.usajobs.gov/job/1'},
      {...fixture,id:'2',title:'SYNTHETIC specific',location:'Madison, WI',url:'https://www.usajobs.gov/job/2'},
      {...fixture,id:'3',title:'SYNTHETIC multiple',location:'Multiple Locations',url:'https://www.usajobs.gov/job/3'},
      {...fixture,id:'4',title:'SYNTHETIC conditional',location:'Location Negotiable After Selection',url:'https://www.usajobs.gov/job/4'},
      {...fixture,id:'5',title:'SYNTHETIC remote policy',location:'Not a remote job',url:'https://www.usajobs.gov/job/5'}
    ];
    await seed({}, searchRoute); const clean = await disk();
    assert.equal(posts.length, 0, 'opening a search link does not send a query');
    await search(); assert.deepEqual(posts, [{keyword:'',location:'54211'}]);
    assert.equal(await ev('document.getElementById("tops-job-family-refinement").open'), false);
    assert.equal(await ev('document.querySelectorAll("#tops-job-remote-locations article").length'), 1);
    assert.equal(await ev('document.querySelectorAll("#tops-job-other-locations article").length'), 4);
    assert.match(await ev('document.getElementById("tops-job-remote-locations").textContent'), /Nationwide remote listing/);
    assert.match(await ev('document.getElementById("tops-job-other-locations").textContent'), /Multiple listed workplaces/);
    assert.match(await ev('document.getElementById("tops-job-other-locations").textContent'), /Workplace is not yet specified/);
    assert.doesNotMatch(await ev('document.getElementById("tops-federal-results").parentElement.textContent'), /No local jobs|local match(?:es)? found/i);
    await c.send('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:true});
    await ev('document.getElementById("tops-federal-results").scrollIntoView({block:"start"})'); await frames(); await shot('mixed-results-375');
    await select('tops-job-family', 'Operations'); assert.equal(posts.length, 1, 'choosing a family is not submission');
    assert.equal(await ev('document.getElementById("tops-job-role").value'), '');
    await click('tops-job-family-search'); await wait('document.getElementById("tops-federal-results")?.textContent.includes("logistics")');
    assert.deepEqual(posts[1], {keyword:'logistics',location:'54211'}); assert.equal(posts.length, 2, 'one explicit family search');
    assert.equal(await ev('document.getElementById("tops-job-area").value'), '54211');
    assert.equal(await ev('!!document.getElementById("tops-job-family-refinement")'), false);
    await input('tops-job-role', 'SYNTHETIC custom keyword'); assert.equal(posts.length, 2); await search();
    assert.deepEqual(posts[2], {keyword:'SYNTHETIC custom keyword',location:'54211'}); assert.equal(await disk(), clean);
    // All-remote, zero-result and filter changes describe only the returned set.
    await input('tops-job-role',''); jobs=jobs.filter(j=>j.id==='1'); await search();
    assert.equal(await ev('!!document.getElementById("tops-job-other-locations")'), false);
    assert.equal(await ev('document.querySelectorAll("#tops-job-remote-locations article").length'), 1);
    await ev('document.getElementById("tops-federal-results").scrollIntoView({block:"start"})'); await frames(); await shot('remote-results-375');
    const beforeFilter=posts.length; await select('tops-job-location-filter','remote'); assert.equal(posts.length,beforeFilter);
    jobs=[]; await search(); assert.match(await ev('document.getElementById("tops-federal-status").textContent'), /No public federal openings could be shown/);
    assert.equal(await ev('!!document.querySelector("#tops-federal-results ~ article")'), false);
    assert.equal(await ev('document.getElementById("tops-job-careeronestop").checkVisibility()'), true);
    console.log('PASS optional family refinement, unchanged ZIP/custom text, exact one-request submission, explicit returned location scopes and zero-result fallback');

    // An exact selected announcement and pasted experience survive Home without a generic chooser.
    jobs=[fixture]; await seed({},searchRoute); await search(); await textClick('Compare this job');
    await wait('document.getElementById("career-starter-resume")?.checkVisibility()');
    const experience='SYNTHETIC private experience: I analyzed reports and explained findings to a team.';
    await input('career-starter-resume',experience); const draftForm=await form(), unsavedDisk=await disk();
    await nav('Home'); await wait('!!document.getElementById("tops-home-career-draft")');
    assert.equal(await ev('document.getElementById("tops-home-career-draft-title").textContent'),fixture.title);
    assert.equal(await ev('document.getElementById("tops-loop-title").checkVisibility()'),false);
    await click('tops-home-career-continue'); await wait('document.getElementById("career-starter-resume")?.checkVisibility()');
    assert.equal(await form(),draftForm); assert.equal(await disk(),unsavedDisk);
    await textClick('Compare my experience with this job'); await wait('!!document.getElementById("tops-start-action-preview")');
    const step=await ev('document.getElementById("tops-start-action-preview").textContent');
    await nav('Home'); assert.equal(await ev('document.getElementById("tops-home-career-continue").textContent'),'Continue this comparison');
    await click('tops-home-career-continue'); await wait('!!document.getElementById("tops-start-action-preview")');
    assert.equal(await ev('document.getElementById("tops-start-action-preview").textContent'),step); assert.equal(await disk(),unsavedDisk);
    await textClick('Edit experience or posting'); await wait('document.getElementById("career-starter-resume")?.checkVisibility()'); assert.equal(await form(),draftForm);
    // The original disk guard still detects another tab changing saved work.
    await nav('Home'); await ev('localStorage.setItem("tops_career_gap_v1","SYNTHETIC changed storage")');
    await click('tops-home-career-continue'); await wait('document.getElementById("career-starter-resume")?.checkVisibility()'); assert.equal(await form(),draftForm);
    assert.equal(await ev('localStorage.getItem("tops_career_gap_v1")'),'SYNTHETIC changed storage');
    assert.equal(await ev('Object.values(localStorage).concat(Object.values(sessionStorage)).some(v=>v.includes('+JSON.stringify(experience)+'))'),false);
    assert.equal(await ev('location.href.includes("SYNTHETIC")'),false);
    console.log('PASS exact named visit-draft continuation across Home in both stages without disk writes or source leakage');

    // Explicit saved action remains first, even when the current comparison names another role.
    const guide={version:1,pathway:'change',currentRole:'SYNTHETIC current',targetRole:'SYNTHETIC goal',goal:''};
    const action={version:1,text:'SYNTHETIC call my mentor',date:'',done:false,context:guide};
    await seed({tops_personal_guide_v1:guide,tops_career_action_v1:action},searchRoute); await search(); await textClick('Compare this job');
    await wait('document.getElementById("career-starter-resume")?.checkVisibility()'); await input('career-starter-resume',experience);
    const actionDisk=await disk(); await nav('Home');
    assert.equal(await ev('document.getElementById("tops-loop-title").checkVisibility()'),true);
    assert.equal(await ev('!!(document.getElementById("tops-loop-title").compareDocumentPosition(document.getElementById("tops-home-career-draft"))&Node.DOCUMENT_POSITION_FOLLOWING)'),true);
    await click('tops-home-career-continue'); await wait('document.getElementById("career-starter-resume")?.checkVisibility()'); assert.equal(await disk(),actionDisk);
    console.log('PASS explicit saved-action priority and unchanged saved plan');
    // A pending conversation check-in stays a review, never an automatic replacement on Home.
    const gap=await ev('topsEmptyGap()'); gap.target=guide.targetRole; gap.rows[0].have=experience;
    gap.prep={opportunity:'SYNTHETIC role conversation',source:'Public posting',questions:'SYNTHETIC original question?',office:'Employment adviser',reference:'Public office',followup:'SYNTHETIC old follow-up',status:'Waiting for a response'};
    await seed({tops_personal_guide_v1:guide,tops_career_action_v1:action,tops_career_gap_v1:gap},'/?tool=pathway');
    await wait('!!document.getElementById("tops-conversation-checkin")'); await reveal('tops-checkin-takeaway');
    await input('tops-checkin-takeaway','SYNTHETIC feedback from a conversation'); await input('tops-checkin-next','SYNTHETIC prepare a reporting example');
    const beforeCheckin=await disk(); await textClick('Review my conversation check-in'); await wait('!!document.getElementById("tops-checkin-preview")');
    await nav('Home'); assert.equal(await ev('document.getElementById("tops-home-career-continue").textContent'),'Continue my review');
    await click('tops-home-career-continue'); await wait('!!document.getElementById("tops-start-action-preview")');
    assert.equal(await ev('document.getElementById("tops-checkin-next").value'),'SYNTHETIC prepare a reporting example');
    assert.equal(await ev('document.getElementById("tops-start-action-preview").textContent'),'SYNTHETIC prepare a reporting example');
    assert.equal(await disk(),beforeCheckin); assert.equal(await ev('!!document.getElementById("tops-journey-review-panel")'),false,'return still requires fresh review');
    console.log('PASS pending check-in continuation keeps review and does not apply or save it');


    // Checklist f2 opens the same budget with saved values, then preserves unsaved edits and exact return.
    const option={label:'SYNTHETIC option',income:'4200',expenses:'3100',monthlySavings:'200',moving:'800',service:'',includeService:false,costs:{housing:'',transport:'',health:'',other:''}};
    const savedMove={version:1,comparison:{cash:'6000',options:[option,{...option,label:'SYNTHETIC other',income:'4300'}]}};
    const budgetSeed={tops_readiness:{f2:false,a2:true},tops_move_comparison_v1:savedMove,tops_personal_guide_v1:guide,tops_career_action_v1:action};
    for(const theme of ['professional','tactical'])for(const width of [320,375]){
      await c.send('Emulation.setDeviceMetricsOverride',{width,height:812,deviceScaleFactor:1,mobile:true});
      await seed({...budgetSeed,tops_theme:theme},'/?tool=readiness'); const before=await disk();
      if(theme==='professional'&&width===320){
        await nav('Career'); await reveal('tops-career-other-tools'); await click('tops-career-other-tools'); await textClick('Resume drafter');
        await wait('document.getElementById("tops-resume-drafter-panel")?.checkVisibility()');
        await nav('My Plan'); await reveal('tops-plan-shortcut-readiness'); await click('tops-plan-shortcut-readiness'); await wait('!!document.getElementById("tops-plan-readiness")');
      }

      await click('tops-readiness-category-finance'); await click('tops-readiness-tool-f2'); await wait('document.activeElement.id==="tops-move-heading"');
      assert.equal(await ev('document.getElementById("tops-move-comparison").open'),true);
      assert.equal(await ev('document.getElementById("tops-move-income").value'),'4200');
      assert.equal(await ev('document.getElementById("tops-move-cash").value'),'6000');
      assert.equal(await ev('document.querySelectorAll("#tops-move-comparison").length'),1);
      assert.equal(await ev('(()=>{const r=document.getElementById("tops-readiness-return").getBoundingClientRect();return r.height>=44&&r.top>=0&&r.bottom<=innerHeight})()'),true);
      await input('tops-move-income','4500.25'); const budget=await ev('document.getElementById("tops-move-results").textContent');
      await click('tops-readiness-return'); await wait('document.activeElement.id==="tops-readiness-tool-f2"');
      assert.equal(await ev('document.getElementById("tops-readiness-category-finance").getAttribute("aria-expanded")'),'true');
      assert.equal(await ev('document.getElementById("tops-readiness-tool-f2").parentElement.querySelector("[role=checkbox]").getAttribute("aria-checked")'),'false');
      assert.equal(await disk(),before);
      await click('tops-readiness-tool-f2'); await wait('document.activeElement.id==="tops-move-heading"');
      assert.equal(await ev('document.getElementById("tops-move-income").value'),'4500.25');
      assert.equal(await ev('document.getElementById("tops-move-results").textContent'),budget);
      assert.equal(await ev('document.documentElement.scrollWidth<=innerWidth+1'),true);
      await nav('Home'); assert.equal(await ev('!!document.getElementById("tops-readiness-return")'),false); assert.equal(await disk(),before);
    }
    console.log('PASS f2 exact budget/return, persisted and visit-only amounts retained, checklist/action untouched, adjacent return in both themes at320/375');
    assert.deepEqual(errors,[]); assert.equal(requests.some(x=>x.includes('/navigator')||x.includes('/resume')||x.includes('account-plan')),false);
    console.log('FIRST RESULT FOLLOW-THROUGH PASS: targeted synthetic journeys only; zero model calls, no new storage or tracking.');
  } finally { if(chrome){await h.stopChrome(chrome);chrome.child.stderr?.destroy();} await new Promise(r=>server.close(r)); }
})().catch(e=>{console.error(e.stack);process.exitCode=1});
