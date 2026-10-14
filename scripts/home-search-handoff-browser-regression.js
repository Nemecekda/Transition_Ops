'use strict';
// Synthetic local regression. No official resource, model, or member-data request is allowed.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http'), os = require('node:os'), { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..'), utility = fs.readFileSync(path.join(__dirname, 'privacy-network-regression.js'), 'utf8');
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


    const tap = id => ev(`document.getElementById(${JSON.stringify(id)}).click()`);
    const seed = async (profile='guard',date='',done=false) => {
      await ev(`localStorage.clear();localStorage.setItem('tops_onboarded','1');localStorage.setItem('tops_user_status',${JSON.stringify(profile)});${date?'localStorage.setItem("tops_sep_date",'+JSON.stringify(date)+');':''}localStorage.setItem('tops_dismissed_reminders',JSON.stringify({'r-6-bdd2':${done}}));const g={version:1,pathway:'support',currentRole:'Synthetic maintainer',targetRole:'Synthetic technician',goal:'Keep this goal'};localStorage.setItem('tops_personal_guide_v1',JSON.stringify(g));localStorage.setItem('tops_career_action_v1',JSON.stringify({version:1,text:'SYNTHETIC ask the provider about tools.',date:'2027-01-12',done:false,context:g}));`);
      await load('dashboard'); await wait('!!document.getElementById("tops-home-search")');
    };
    const plan = () => ev('JSON.stringify(["tops_personal_guide_v1","tops_career_action_v1","tops_career_gap_v1","tops_dismissed_reminders","tops_followup_v1"].map(k=>localStorage.getItem(k)))');
    const search = async (q,id) => { await input('tops-home-search',q); await wait('!!document.getElementById('+JSON.stringify('tops-home-search-result-'+id)+')'); await tap('tops-home-search-result-'+id); };
    const back = async (q,id) => { await tap('tops-search-back'); await wait('document.activeElement.id==='+JSON.stringify('tops-home-search-result-'+id)); assert.equal(await ev('document.getElementById("tops-home-search").value'),q); };
    const native = async key => { const code=key==='Enter'?13:32; await c.send('Input.dispatchKeyEvent',{type:'keyDown',key,code:key==='Enter'?'Enter':'Space',text:key==='Enter'?'\r':' ',unmodifiedText:key==='Enter'?'\r':' ',windowsVirtualKeyCode:code,nativeVirtualKeyCode:code}); await c.send('Input.dispatchKeyEvent',{type:'keyUp',key,windowsVirtualKeyCode:code,nativeVirtualKeyCode:code}); };
    await c.send('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:true});
    await load('dashboard'); await seed(); const saved=await plan();
    await search('BDD','r-6-bdd2'); await wait('document.activeElement.id==="tops-focused-title"');
    assert.match(await ev('document.getElementById("tops-focused-title").textContent'),/BDD Window OPEN/);
    assert.equal(await ev('document.querySelectorAll("[id^=tops-reminder-r-]").length'),0);
    assert.equal(await ev('document.querySelectorAll("#tops-search-back").length'),1);
    assert.equal(await plan(),saved);
    const focused=await ev('({nodes:document.querySelectorAll("#tops-main-content *").length,reminderCards:document.querySelectorAll("button[id^=tops-reminder-]").length,heading:document.getElementById("tops-focused-title").textContent,width:document.documentElement.scrollWidth})');
    await back('BDD','r-6-bdd2');
    assert.equal(await ev('getComputedStyle(document.activeElement).outlineOffset'),'-3px');
    assert.equal(await ev('getComputedStyle(document.activeElement.firstElementChild).fontSize'),'16px');
    await native('Enter'); await wait('document.activeElement.id==="tops-focused-title"');
    await click('All reminders'); await wait('!!document.getElementById("tops-reminder-r-6-bdd2")');
    const directory=await ev('({nodes:document.querySelectorAll("#tops-main-content *").length,reminderCards:document.querySelectorAll("button[id^=tops-reminder-]").length})');
    assert.ok(focused.nodes<directory.nodes/2,JSON.stringify({focused,directory}));
    assert.ok(directory.reminderCards>60); assert.equal(await ev('!!document.getElementById("tops-search-back")'),false);
    console.log('Rendered reminder comparison (same build/fixture, local Chrome375x812): '+JSON.stringify({focused,directory}));
    await home(); await search('ITP','r-24-itp'); await wait('document.activeElement.id==="tops-focused-title"');
    assert.match(await ev('document.getElementById("tops-focused-title").textContent'),/ITP/);await ev('history.back()');await wait('document.activeElement.id==="tops-home-search-result-r-24-itp"');assert.equal(await ev('document.getElementById("tops-home-search").value'),'ITP');
    await tap('tops-home-search-result-r-24-itp');await wait('document.activeElement.id==="tops-focused-title"');await back('ITP','r-24-itp');
    // A completed reminder stays completed, with its existing timing/undo UI.
    await seed('guard','',true);const completed=await plan();await search('BDD','r-6-bdd2');await wait('!!document.getElementById("tops-focused-undo")');assert.equal(await plan(),completed);await back('BDD','r-6-bdd2');
    // Critical search keeps the date gate and exact requested title; no date is invented.
    await search('Benefits Delivery at Discharge','bdd');await wait('document.activeElement.id==="tops-search-critical-context"');assert.match(await ev('document.getElementById("tops-search-critical-context").textContent'),/Benefits Delivery/);assert.equal(await ev('!!document.getElementById("tops-window-detail-bdd")'),false);assert.equal(await ev('localStorage.getItem("tops_sep_date")'),null);await back('Benefits Delivery at Discharge','bdd');
    // Applicable date opens the exact native disclosure; existing status text remains authoritative.
    await seed('active','2027-03-01');const dated=await plan();await search('Benefits Delivery at Discharge','bdd');await wait('document.activeElement.id==="tops-window-title-bdd"');assert.equal(await ev('document.activeElement.tagName'),'BUTTON');assert.equal(await ev('document.activeElement.getAttribute("aria-expanded")'),'true');assert.equal(await ev('document.getElementById("tops-window-detail-bdd").hidden'),false);await native('Enter');await wait('document.getElementById("tops-window-detail-bdd").hidden');await native('Enter');await wait('!document.getElementById("tops-window-detail-bdd").hidden');assert.equal(await plan(),dated);
    await click('MISSED');await wait('!document.getElementById("tops-search-back")');await home();assert.equal(await ev('document.getElementById("tops-home-search").value'),'Benefits Delivery at Discharge');await tap('tops-home-search-result-bdd');await wait('document.activeElement.id==="tops-window-title-bdd"');assert.equal(await ev('document.getElementById("tops-window-detail-bdd").hidden'),false);await back('Benefits Delivery at Discharge','bdd');
    // Existing Guard/Reserve applicability filter is not overridden.
    await seed('guard','2027-03-01');const guard=await plan();await search('DoD SkillBridge','skillbridge');await wait('document.activeElement.id==="tops-search-critical-context"');assert.match(await ev('document.getElementById("tops-search-critical-context").parentElement.textContent'),/not shown for your selected service profile/);assert.equal(await ev('!!document.getElementById("tops-window-detail-skillbridge")'),false);assert.equal(await plan(),guard);await back('DoD SkillBridge','skillbridge');
    // Search-related title and return intent do not leak to an unrelated tool or reload.
    await search('BDD','r-6-bdd2');await click('Career');await wait('!!document.getElementById("tops-career-start-heading")');assert.equal(await ev('!!document.getElementById("tops-search-back")'),false);await load('critical');assert.equal(await ev('!!document.getElementById("tops-search-back")'),false);
    for(const width of [375,320]) { await c.send('Emulation.setDeviceMetricsOverride',{width,height:812,deviceScaleFactor:1,mobile:true});await home();await input('tops-home-search','BDD');await wait('!!document.getElementById("tops-home-search-result-r-6-bdd2")');assert.ok(await ev('document.documentElement.scrollWidth<=innerWidth'));assert.ok(await ev('Array.from(document.querySelectorAll("button[id^=tops-home-search-result-]")).every(n=>n.getBoundingClientRect().height>=44&&n.getBoundingClientRect().width>=44)')); }
    await input('tops-home-search','Hire Heroes');await wait('Array.from(document.querySelectorAll(".tops-home-search a")).some(n=>n.textContent.includes("Opens a new tab"))');assert.ok(await ev('Array.from(document.querySelectorAll(".tops-home-search a")).every(n=>n.target==="_blank"&&n.rel.includes("noreferrer"))'));
    await click('Clear search');assert.equal(await ev('document.getElementById("tops-home-search").value'),'');assert.equal(await ev('document.activeElement.id'),'tops-home-search');
    assert.deepEqual(errors,[]);assert.equal(blocked.some(r=>r.method!=='GET'||r.postData||r.url.includes('SYNTHETIC')),false);
    console.log('HOME SEARCH PASS: exact reminder/window identity; preserved date/profile/completion; query/focus return and native Back; native disclosure keyboard; manual browse exit; scoped request lifetime;375/320reflow and44px targets; external-link label; unchanged plan and no member-data/provider request.');
  } finally { if(chrome)await h.stopChrome(chrome);await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(error);process.exitCode=1;});
