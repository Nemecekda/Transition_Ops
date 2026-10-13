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


    const tap = id => ev(`document.getElementById(${JSON.stringify(id)}).click()`);
    const set = (id,value) => ev(`(()=>{const n=document.getElementById(${JSON.stringify(id)}),proto=n.tagName==='SELECT'?HTMLSelectElement.prototype:n.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(n,${JSON.stringify(value)});n.dispatchEvent(new Event(n.tagName==='SELECT'?'change':'input',{bubbles:true}));})()`);
    const seed = async (pathway='change',done=false,text=step) => {
      await ev(`localStorage.clear();localStorage.setItem('tops_onboarded','1');localStorage.setItem('tops_user_status','guard');const g={version:1,pathway:${JSON.stringify(pathway)},currentRole:'Synthetic maintainer',targetRole:'Synthetic technician',goal:'Preserve my goal'};const a={version:1,text:${JSON.stringify(text)},date:'2027-01-12',done:${done},context:g};const gap=topsEmptyGap();gap.target='Synthetic technician';gap.rows[0].have='SYNTHETIC PRIVATE WORKSHEET';localStorage.setItem("tops_personal_guide_v1",JSON.stringify(g));localStorage.setItem("tops_career_action_v1",JSON.stringify(a));localStorage.setItem("tops_career_gap_v1",JSON.stringify(gap));`);
      await load('dashboard'); await wait('!!document.getElementById("tops-loop-title")');
    };
    const plan = () => ev('JSON.stringify(["tops_personal_guide_v1","tops_career_action_v1","tops_career_gap_v1"].map(k=>localStorage.getItem(k)))');

    await load('dashboard');
    const measurements=[];
    await c.send('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:true});
    for(const direction of ['support','change']){
      await seed(direction);const before=await plan();await set('tops-support-outcome','documents');await wait('document.activeElement.id==="tops-support-review-heading"');
      const shape=await ev(`(()=>{const h=document.getElementById('tops-support-review-heading'),e=document.getElementById('tops-support-text'),save=document.getElementById('tops-support-save'),card=h.closest('.tops-next-move');return{headingTag:h.tagName,outerHeading:card.querySelector('h2').id,editorOffset:e.getBoundingClientRect().top-h.getBoundingClientRect().top,saveOffset:save.getBoundingClientRect().top-h.getBoundingClientRect().top,cardHeight:card.getBoundingClientRect().height,reviewHeight:h.parentElement.getBoundingClientRect().height,hidden:!document.getElementById('tops-support-outcome')&&!card.querySelector('.tops-next-move-heading')&&!document.getElementById('tops-loop-timing')&&!card.querySelector('.tops-loop-utilities'),focus:document.getElementById('tops-support-focus')?.textContent||'',current:document.getElementById('tops-support-current').textContent,primary:save.classList.contains('tops-move-primary'),help:document.getElementById('tops-support-help').textContent,dateHelp:document.getElementById('tops-support-date-help').textContent,boundary:document.getElementById('tops-support-acceptance-help').textContent,saveBefore:document.getElementById('tops-support-unsaved').textContent};})()`);
      assert.equal(shape.headingTag,'H3');assert.equal(shape.outerHeading,'tops-loop-title');assert.equal(shape.hidden,true);assert.equal(shape.primary,true);assert.equal(shape.current.split(step).length-1,1);
      assert.ok(shape.editorOffset<300);assert.ok(shape.saveOffset<(direction==='support'?572:668));assert.ok(shape.cardHeight<1000);
      if(direction==='support')assert.equal(shape.focus,'');else assert.match(shape.focus,/Focus changes from.*Future suggestions.*role, goal and worksheet stay unchanged/);
      assert.match(shape.help,/No contents, identifiers or uploads/);assert.match(shape.dateHelp,/not a program deadline/);assert.match(shape.boundary,/replaces.*unfinished.*does not contact/);assert.match(shape.saveBefore,/Save before refreshing/);
      assert.equal(await plan(),before);measurements.push({direction,...shape});await tap('tops-support-cancel');await wait('document.activeElement.id==="tops-support-outcome"');
    }
    console.log('PASS single h2/h3 review, one exact original step, visible limits and conditional focus change, primary Save; standard375px editor visible and Save offset shorter than retained baseline');
    await seed('support',true,'Completed synthetic support action.');const complete=await plan();await set('tops-support-outcome','ready');assert.equal(await ev('document.getElementById("tops-support-current").textContent.includes("marked complete")'),true);assert.equal(await ev('document.querySelector(".tops-next-move").textContent.includes("You marked this step done:")'),false);assert.match(await ev('document.getElementById("tops-support-help").textContent'),/not approval/);await tap('tops-support-cancel');assert.equal(await plan(),complete);
    await seed();await ev('document.getElementById("tops-personal-calendar-open").click()');await wait('!!document.getElementById("tops-personal-calendar-heading")');await set('tops-support-outcome','waiting');assert.equal(await ev('!!document.getElementById("tops-personal-calendar-heading")'),false);await tap('tops-support-cancel');assert.equal(await ev('!!document.getElementById("tops-personal-calendar-heading")'),true);
    console.log('PASS completed original is stated once; calendar preview is hidden during review and returns unchanged after cancellation');
    await load('dashboard');await set('tops-support-outcome','documents');await set('tops-support-text','Synthetic exact edited proposal.');await ev('localStorage.setItem("tops_career_action_v1","newer disk")');await tap('tops-support-save');assert.match(await ev('document.getElementById("tops-support-current").textContent'),/^Step when this review began:/);assert.match(await ev('document.getElementById("tops-support-unsaved").textContent'),/plan or saved work changed/);assert.equal(await ev('document.getElementById("tops-support-text").value'),'Synthetic exact edited proposal.');
    console.log('PASS stale conflict remains visible and labels the original snapshot accurately');
    const longText='Synthetic support planning words '.repeat(7).slice(0,230);await seed('support',false,longText);await set('tops-support-outcome','documents');await set('tops-support-text',longText);
    for(const width of [320,375]){await c.send('Emulation.setDeviceMetricsOverride',{width,height:812,deviceScaleFactor:1,mobile:true});assert.ok(await ev('document.documentElement.scrollWidth<=innerWidth+1'));assert.equal(await ev('document.getElementById("tops-support-text").value'),longText);const sizes=await ev('Array.from(document.querySelectorAll("#tops-support-follow-through button,#tops-support-follow-through input,#tops-support-follow-through summary")).filter(n=>n.checkVisibility()).map(n=>[n.getBoundingClientRect().width,n.getBoundingClientRect().height])');for(const [w,h]of sizes)assert.ok(w>=44&&h>=44);}
    assert.deepEqual(errors,[]);assert.equal(blocked.some(r=>r.method!=='GET'||r.postData||r.url.includes('SYNTHETIC')||r.url.includes('/.netlify/')),false);
    console.log(JSON.stringify({measurements},null,2));
    console.log('COMPACT SUPPORT REVIEW: LOCAL AUTOMATION PASS. 320/375 reflow and44px controls; no provider calls. Manual AT/native phone/hosted checks remain pending.');
  }finally{if(chrome){await h.stopChrome(chrome);chrome.child.stderr?.destroy();}await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
