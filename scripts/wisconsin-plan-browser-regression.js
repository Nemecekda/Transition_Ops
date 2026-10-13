'use strict';
// Synthetic local regression. No official resource, model, or member-data request is allowed.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http'), os = require('node:os'), { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..'), utility = fs.readFileSync(path.join(__dirname, 'privacy-network-regression.js'), 'utf8');
const step = 'Ask a Wisconsin Job Center about eligibility and approval before paying for tools or training.';
const expectedQuestion = 'I am exploring work or training in Wisconsin and may need help with tools, work gear or training costs. Which office can assess my eligibility, what documents should I prepare, and what approval is needed before I spend anything?';
const h = new Function('fs', 'path', 'os', 'spawn', utility.slice(utility.indexOf('function findChrome()'), utility.indexOf('const PROBE_SCRIPT =')) + '\nreturn {findChrome,launchChrome,stopChrome,evaluate,waitForExpression};')(fs, path, os, spawn);
const server = http.createServer((req, res) => {
  const file = path.join(root, req.url.split('?')[0] === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream'); res.end(fs.readFileSync(file));
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
    const input = (id, value) => ev(`(() => { const n = document.getElementById(${JSON.stringify(id)}); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(n,${JSON.stringify(value)}); n.dispatchEvent(new Event('input',{bubbles:true})); })()`);
    const click = text => ev(`(() => { const n = Array.from(document.querySelectorAll('button')).find(n => n.textContent === ${JSON.stringify(text)} && n.checkVisibility()); if (!n) throw Error('Missing button: '+${JSON.stringify(text)}); n.click(); })()`);
    const reveal = id => ev(`(() => { const n=document.getElementById(${JSON.stringify(id)}); const parents=[]; for(let p=n.parentElement;p;p=p.parentElement) if(p.tagName==='DETAILS'&&!p.open) parents.unshift(p); for(const p of parents)p.querySelector(':scope > summary').click(); })()`);
    const disk = () => ev('JSON.stringify(Object.entries(localStorage).sort())');
    const load = async tool => { await c.send('Page.navigate', {url:url+'/?tool='+tool}); await wait('!!document.querySelector(".bottom-nav")'); };
    const home = async () => { await ev('Array.from(document.querySelectorAll(".bottom-nav button")).find(n=>n.querySelector(".nav-label").textContent==="Home").click()'); await wait('!!document.getElementById("tops-home-search")'); };

    const prefix='tops-wi-work-support-resources';
    const tap=async suffix=>{const id=suffix.startsWith('tops-')?suffix:prefix+suffix;await reveal(id);await ev(`document.getElementById(${JSON.stringify(id)}).click()`);};
    const edit=async(id,value)=>{await reveal(id);await ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)});Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(n,${JSON.stringify(value)});n.dispatchEvent(new Event('input',{bubbles:true}));})()`);};
    const nav=async label=>{await ev(`Array.from(document.querySelectorAll('.bottom-nav button')).find(n=>n.querySelector('.nav-label').textContent===${JSON.stringify(label)}).click()`);await wait(label==='Home'?'!!document.getElementById("tops-loop-title")':'!!document.getElementById("tops-career-start-heading")');};
    const guide=async(extra='')=>{await c.send('Page.navigate',{url:url+'/?tool=resources&guide=wisconsin-work-support'+extra});await wait('document.activeElement.id === "'+prefix+'-heading"');};
    const seed=async(expression='')=>{await ev('localStorage.clear();localStorage.setItem("tops_onboarded","1");localStorage.setItem("tops_user_status","guard");'+expression);await guide();};
    const planDisk=()=>ev('JSON.stringify(["tops_personal_guide_v1","tops_career_action_v1","tops_career_gap_v1"].map(k=>localStorage.getItem(k)))');
    const saved='const guide={version:1,pathway:"change",currentRole:"Synthetic supply clerk",targetRole:"Synthetic technician",goal:"Keep my goal"};const action={version:1,text:"Synthetic earlier next step",date:"2027-02-11",done:true,context:guide};const gap=topsEmptyGap();gap.target="Earlier worksheet";gap.rows[0].have="SYNTHETIC source canary";localStorage.setItem("tops_personal_guide_v1",JSON.stringify(guide));localStorage.setItem("tops_career_action_v1",JSON.stringify(action));localStorage.setItem("tops_career_gap_v1",JSON.stringify(gap));';
    await load('dashboard&a11y_scenario=320%20portrait%20default');assert.equal(await ev('location.search'),'?tool=dashboard&a11y_scenario=320%20portrait%20default','ordinary URL encoding stays unchanged');await seed();
    // Fresh visitors get a neutral context, without an unrelated career decision.
    await tap('-plan');assert.equal(await ev('document.getElementById("'+prefix+'-save").disabled'),false);
    assert.equal(await ev('document.getElementById("'+prefix+'-direction")===null'),true);
    assert.match(await ev('document.getElementById("'+prefix+'").textContent'),/For: Get work or training support/);
    await tap('-save');await wait('document.getElementById("'+prefix+'").textContent.includes("Saved on this browser")');
    const fresh=JSON.parse(await planDisk()).map(x=>JSON.parse(x));assert.equal(fresh[0].pathway,'support');assert.equal(fresh[1].text,step);assert.deepEqual(fresh[1].context,fresh[0]);
    await load('dashboard');await wait('!!document.getElementById("tops-loop-wisconsin")');await tap('tops-loop-wisconsin');await wait('document.activeElement.id === "'+prefix+'-heading"');
    console.log('PASS fresh support Save needs no career choice; reloaded Home reopens exact WI guide');
    // Shared enum and backup contract remain strict; completed/generic support is neutral.
    const model=await ev(`(()=>{const g={version:1,pathway:'support',currentRole:'',targetRole:'',goal:''},a={version:1,text:${JSON.stringify(step)},date:'',done:false,context:g};const backup=topsCreatePlanBackup({guide:g,careerWorksheet:topsEmptyGap(),careerAction:a,taskProgress:[],documentProgress:[],followupProgress:{},completedReminders:{}});const parsed=topsParsePlanBackup(JSON.stringify(backup));return {backup:!!parsed,restored:topsRestorePlanBackup(parsed).ok,unknown:topsValidateGuide({...g,pathway:'made-up'}),unknownAction:topsValidateAction({...a,context:{...g,pathway:'made-up'}}),badBackup:topsValidatePlanBackup({...backup,sections:{...backup.sections,guide:{...g,pathway:'made-up'}}}),legacy:['transition','skills','change'].map(pathway=>!!topsValidateAction({...a,context:{...g,pathway}})),cleared:topsMemberMove(g,topsEmptyAction(),topsEmptyGap(),'guard'),completed:topsMemberMove(g,{...a,done:true},topsEmptyGap(),'guard'),reflection:topsMemberReflection('ready',g,'guard'),time:topsMemberAdjustment('time',g,'guard','10'),actions:topsGuideActions(g,topsEmptyGap(),{},{}),mismatch:topsActionMatches(a,{...g,goal:'Changed'})};})()`);
    assert.equal(model.backup,true);assert.equal(model.restored,true);assert.equal(model.unknown,null);assert.equal(model.unknownAction,null);assert.equal(model.badBackup,null);assert.deepEqual(model.legacy,[true,true,true]);assert.equal(model.mismatch,false);
    for(const key of ['cleared','completed','reflection','time'])assert.equal(model[key].route,'support');assert.equal(model.actions[0].route,'employment');assert.doesNotMatch(JSON.stringify(model),/current job posting|Choose one role|Wisconsin.*route/);
    console.log('PASS support guide/action/backup export-parse-restore, unknown values rejected, old directions valid, neutral completion/clear/time fallback');
    // Review cancel and visit-only replacement preserve actual existing bytes and worksheet.
    await seed(saved);const before=await planDisk();await tap('-plan');assert.equal(await ev('document.getElementById("'+prefix+'-save").disabled'),true);await tap('-cancel');assert.equal(await planDisk(),before);await wait('document.activeElement.id === "'+prefix+'-plan"');
    await tap('-plan');await tap('-replace');await tap('-visit');await wait('document.getElementById("'+prefix+'").textContent.includes("For this visit only")');assert.equal(await planDisk(),before);await nav('Home');await wait('!!document.getElementById("tops-loop-wisconsin")');await tap('tops-loop-wisconsin');
    await guide();assert.equal(await planDisk(),before);await tap('-plan');await tap('-replace');await tap('-save');await wait('document.getElementById("'+prefix+'").textContent.includes("Saved on this browser")');const after=JSON.parse(await planDisk());const prior=JSON.parse(before);assert.equal(after[0],prior[0]);assert.equal(after[2],prior[2]);assert.equal(JSON.parse(after[1]).date,'');assert.equal(JSON.parse(after[1]).done,false);
    console.log('PASS explicit replacement preserves existing direction/roles/goal/worksheet; cancel/visit preserve disk, accepted save resets only step/date/done');
    // Conflicts, unreadable copies and failed atomic writes must preserve retained data.
    await seed(saved);await tap('-plan');await tap('-replace');await ev('localStorage.setItem("tops_career_action_v1","newer-unrecognized-copy")');const newer=await planDisk();await tap('-save');assert.equal(await planDisk(),newer);assert.match(await ev('document.getElementById("'+prefix+'").textContent'),/plan or saved work changed/);
    for(const raw of ['{broken',JSON.stringify({version:1,pathway:'future-value',currentRole:'',targetRole:'',goal:''})]){await seed('localStorage.setItem("tops_personal_guide_v1",'+JSON.stringify(raw)+');');const malformed=await planDisk();await tap('-plan');await tap('-save');assert.equal(await planDisk(),malformed);assert.match(await ev('document.getElementById("'+prefix+'").textContent'),/unreadable saved work/);await tap('-visit');assert.equal(await planDisk(),malformed);}
    await seed(saved);const beforeFailure=await planDisk();await edit(prefix+'-questions','SYNTHETIC preserve my exact questions');await tap('-plan');await tap('-replace');await ev(`window.originalSet=Storage.prototype.setItem;window.failOnce=true;Storage.prototype.setItem=function(k,v){if(k==='tops_career_action_v1'&&window.failOnce){window.failOnce=false;throw Error('synthetic denied')}return window.originalSet.call(this,k,v)}`);await tap('-save');assert.equal(await planDisk(),beforeFailure);assert.equal(await ev('document.getElementById("'+prefix+'-questions").value'),'SYNTHETIC preserve my exact questions');assert.match(await ev('document.getElementById("'+prefix+'").textContent'),/Not saved. Your earlier saved plan was kept/);await ev('Storage.prototype.setItem=window.originalSet');
    console.log('PASS newer/invalid saved bytes and atomic-write failure cannot overwrite plan; review and question text retained');
    // Editable shared questions use explicit short details, never source text.
    await seed(saved);await edit(prefix+'-questions','SYNTHETIC my edited question');await tap('-add-details');const question=await ev('document.getElementById("'+prefix+'-questions").value');assert.match(question,/Current role or experience: Synthetic supply clerk/);assert.match(question,/Role or field of interest: Synthetic technician/);assert.doesNotMatch(question,/source canary/);await tap('-add-details');assert.equal(await ev('document.getElementById("'+prefix+'-questions").value'),question);
    const questionsBefore=await planDisk();await nav('Career');await wait('!!document.getElementById("tops-career-explore-first")');await ev('document.getElementById("tops-career-explore-first").click()'); // saved target prefill opens next step directly
    await wait('!!document.getElementById("tops-wi-work-support-career-questions")');await reveal('tops-wi-work-support-career-questions');assert.equal(await ev('document.getElementById("tops-wi-work-support-career-questions").value'),question);await edit('tops-wi-work-support-career-questions',question+'\nSYNTHETIC added on Career');await nav('Home');await input('tops-home-search','Wisconsin');await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent.includes("Wisconsin: Help with work tools and training")).click()');await wait('document.activeElement.id === "'+prefix+'-heading"');assert.equal(await ev('document.getElementById("'+prefix+'-questions").value'),question+'\nSYNTHETIC added on Career');assert.equal(await planDisk(),questionsBefore);
    console.log('PASS shared edited questions survive Career/Resources; explicit short details append once without source text or persistence');
    // Copy-link strips ambient member data; denied copy remains selectable, no send occurs.
    await guide('&role=SYNTHETIC_PRIVATE&resume=SYNTHETIC_PRIVATE#SYNTHETIC_PRIVATE');await ev('Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async text=>{window.wiCopied=text}}})');await tap('-share');await wait('!!window.wiCopied');assert.equal(await ev('window.wiCopied'),url+'/?tool=resources&guide=wisconsin-work-support');assert.equal(await ev('topsWisconsinGuideURL("https://transitionops.org/?role=private#secret")'),'https://transitionops.org/?tool=resources&guide=wisconsin-work-support');
    await ev('Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async()=>{throw Error("denied")}}})');await tap('-share');await wait('document.activeElement.id === "'+prefix+'-link"');assert.equal(await ev('document.activeElement.readOnly'),true);await tap('-copy');await wait('document.activeElement.id === "'+prefix+'-questions"');assert.equal(await ev('document.activeElement.readOnly'),false);
    assert.equal(await ev('topsIsWisconsinGuideURL("https://transitionops.org/?tool=resources&guide=wrong")'),false);assert.equal(await ev('topsIsWisconsinGuideURL("https://transitionops.org/?tool=resources&guide=wisconsin-work-support&guide=wrong")'),false);
    for(const width of [320,375]){await c.send('Emulation.setDeviceMetricsOverride',{width,height:812,deviceScaleFactor:1,mobile:true});assert.ok(await ev('document.documentElement.scrollWidth<=innerWidth+1'));const sizes=await ev('Array.from(document.querySelectorAll("#'+prefix+' button,#'+prefix+' summary,#'+prefix+' a")).filter(n=>n.checkVisibility()).map(n=>[n.getBoundingClientRect().width,n.getBoundingClientRect().height])');for(const [w,h]of sizes)assert.ok(w>=44&&h>=44);}
    assert.deepEqual(errors,[]);assert.equal(blocked.some(r=>r.method!=='GET'||r.postData||r.url.includes('SYNTHETIC')||r.url.includes('wisconsinjobcenter.org')||r.url.includes('dwd.wisconsin.gov')),false);
    console.log('PASS origin-only fixed link; copy denial focus/select; 320/375px reflow/44px controls; zero source/provider or member-data requests');
    console.log('WI FOLLOW-THROUGH: LOCAL AUTOMATION PASS. Manual AT and hosted release checks remain pending.');
  } finally { if(chrome){await h.stopChrome(chrome);chrome.child.stderr?.destroy();} await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
