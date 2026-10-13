'use strict';
// Synthetic local regression. No official resource, model, or member-data request is allowed.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http'), os = require('node:os'), { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..'), utility = fs.readFileSync(path.join(__dirname, 'privacy-network-regression.js'), 'utf8');
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
    await load('dashboard');
    await ev('localStorage.clear();localStorage.setItem("tops_onboarded","1");localStorage.setItem("tops_user_status","guard");localStorage.setItem("wi-test-sentinel","SYNTHETIC saved work");');
    await load('pathway'); await wait('!!document.getElementById("tops-career-explore-first")');
    assert.equal(await ev('document.getElementById("tops-career-experience-first").checkVisibility()'),true);
    assert.equal(await ev('!!document.getElementById("tops-wi-work-support-career")?.checkVisibility()'),false,'new guide must not occupy fresh Career');
    const before = await disk();
    await ev('document.getElementById("tops-career-explore-first").click()'); await click('Human Resources'); await click('Talent Acquisition / Recruiter');
    await wait('!!document.getElementById("tops-wi-work-support-career")'); await reveal('tops-wi-work-support-career');
    assert.equal(await ev('document.getElementById("tops-wi-work-support-career").checkVisibility()'),true);
    assert.equal(await ev('document.getElementById("tops-wi-work-support-career").open'),false);
    await ev('document.querySelector("#tops-wi-work-support-career > summary").click()');
    assert.equal(await disk(),before); console.log('PASS compact Career discovery preserves saved bytes and initial entry choices');
    for(const term of ['Wisconsin','WIOA','work tools','Wisconsin training','training']) {
      await home(); await input('tops-home-search',term); await wait('Array.from(document.querySelectorAll("button")).some(n=>n.textContent.includes("Wisconsin: Help with work tools and training"))');
      await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent.includes("Wisconsin: Help with work tools and training")).click()');
      await wait('document.activeElement.id === "tops-wi-work-support-resources-heading"');
      assert.equal(await ev('document.getElementById("tops-wi-work-support-resources").open'),true);
      assert.ok(await ev('document.querySelector("#tops-wi-work-support-resources > summary").getBoundingClientRect().top >= -1'));
    }
    const nationalCard='Array.from(document.querySelectorAll("a")).find(n=>n.textContent.includes("WIOA help with tools and work gear"))';
    assert.match(await ev(nationalCard+'.textContent'),/FUNDING CONDITIONAL/);
    await click('FREE');assert.equal(await ev('!!('+nationalCard+')'),false,'conditional funding must not appear in FREE filter');
    await home();await input('tops-home-search','Wisconsin');await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent.includes("Wisconsin: Help with work tools and training")).click()');await wait('document.activeElement.id === "tops-wi-work-support-resources-heading"');
    console.log('PASS reconciled nationwide WIOA resource preserves conditional funding and is excluded from FREE filter');
    for(const label of ['GUARD/RESERVE','ACTIVE DUTY','VETERAN','SPOUSE']) { await click(label); assert.equal(await ev('document.getElementById("tops-wi-work-support-resources").checkVisibility()'),true); }
    await click('PAID'); await home(); await input('tops-home-search','WIOA'); await ev('Array.from(document.querySelectorAll("button")).find(n=>n.textContent.includes("Wisconsin: Help with work tools and training")).click()');
    await wait('document.activeElement.id === "tops-wi-work-support-resources-heading"');
    assert.ok(await ev('Array.from(document.querySelectorAll("a")).some(n=>n.href.includes("careeronestop.org/LocalHelp"))'),'search clears incompatible resource filters');
    console.log('PASS five search queries focus and open exact destination; all service populations can discover assessment guide');
    const data = await ev(`(() => {const n=document.getElementById('tops-wi-work-support-resources');return {text:n.textContent,steps:n.querySelectorAll('ol > li').length,links:Array.from(n.querySelectorAll('a')).map(a=>[a.href,a.target,a.rel,a.referrerPolicy])};})()`);
    assert.equal(data.steps,3); assert.match(data.text,/Support depends on eligibility/); assert.match(data.text,/Get approval before buying equipment or starting training/); assert.match(data.text,/A listed program is not a funding approval/); assert.doesNotMatch(data.text,/\bFREE\b|\$\d|guaranteed|automatically eligible/);
    assert.deepEqual(data.links.map(x=>x[0]),['https://wisconsinjobcenter.org/directory/','https://dwd.wisconsin.gov/etpl/home/programsearch','https://dwd.wisconsin.gov/wioa/policy/08/08.6.htm','https://dwd.wisconsin.gov/wioa/policy/08/08.2.htm']);
    for(const link of data.links) assert.deepEqual(link.slice(1),['_blank','noopener noreferrer','no-referrer']);
    await reveal('tops-wi-work-support-resources-copy');
    await ev('window.wiCopied="";Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async text=>{window.wiCopied=text;}}});document.getElementById("tops-wi-work-support-resources-copy").focus()');
    await c.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',unmodifiedText:'\r',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});
    await c.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});
    await wait('!!window.wiCopied'); assert.equal(await ev('window.wiCopied'),expectedQuestion);
    await ev('Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async()=>{throw Error("synthetic denied")}}});document.getElementById("tops-wi-work-support-resources-copy").click()');
    await wait('document.activeElement.id === "tops-wi-work-support-resources-questions"');
    assert.equal(await ev('document.activeElement.readOnly'),false); assert.equal(await ev('document.activeElement.value'),expectedQuestion);
    assert.equal(await disk(),before); console.log('PASS official links/conditional claims; keyboard copy uses generic text only and denied clipboard offers focused manual copy');
    for(const width of [320,375,390]) {
      await c.send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});
      assert.ok(await ev('document.documentElement.scrollWidth <= innerWidth+1'));
      const sizes=await ev('Array.from(document.querySelectorAll("#tops-wi-work-support-resources a,#tops-wi-work-support-resources button,#tops-wi-work-support-resources summary")).filter(n=>n.checkVisibility()).map(n=>[n.getBoundingClientRect().width,n.getBoundingClientRect().height])');
      for(const [w,height] of sizes) assert.ok(w>=44&&height>=44);
    }
    assert.deepEqual(errors,[]); assert.equal(blocked.some(r=>r.method!=='GET'||r.postData||r.url.includes('SYNTHETIC')||r.url.includes('wisconsinjobcenter.org')||r.url.includes('dwd.wisconsin.gov')),false);
    console.log('WISCONSIN WORK SUPPORT PASS: LOCAL AUTOMATION PASS at320/375/390; no requests to official links or providers, no new saved data. Manual AT and hosted checks remain pending.');
  } finally { if(chrome){await h.stopChrome(chrome);chrome.child.stderr?.destroy();} await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
