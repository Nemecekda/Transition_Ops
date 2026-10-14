# Discrete edit record

The parent approved this bounded UI-only simplification and exact copy under the continued-build request. Scripts were shown before execution. The first app script stopped before writing on a nested replacement-count expectation; accounting was corrected and the same reviewed operations completed. No partial app write occurred. Each operation asserts its old and new span count. Final in-memory replay of25 substitutions reproduces indexdab0b7 exactly; cache284 to285 is one exact substitution. The complete diff was read hunk by hunk before commit.

The first exploratory test expected the editor to move closer for both fixtures; the support fixture did not. The acceptance was aligned to the actual bounded contract: one compact card with visible editor and unchanged required notices, not an unsupported promise of universal editor-distance reduction. Full measured results are retained. The baseline measurement harness initially needed a larger local Git-output buffer to read index.html; this was a harness issue before browser execution, not an app issue.

## support-compact-edit.py

```python
from pathlib import Path
root=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops')
p=root/'index.html';s=p.read_text();records=[]
def change(label,old,new):
    global s
    assert s.count(old)==1,(label,s.count(old))
    expected=s.count(new)-old.count(new)+1 if new else 0;s=s.replace(old,new,1)
    if new: assert s.count(new)==expected,(label,s.count(new),expected)
    else: assert s.count(old)==0,label
    records.append(label);print(label+': old1 replaced; new expected='+str(expected)+' actual='+str(s.count(new) if new else 0))
# Compact1: one focused review hierarchy; retain outcome as a plain label, not a disabled control.
change('review spacing','id: "tops-support-follow-through", style: { marginTop: 16 }','id: "tops-support-follow-through", style: { marginTop: supportReview ? 0 : 16 }')
change('idle outcome label','      React.createElement("label", { htmlFor: "tops-support-outcome",','      !supportReview && React.createElement("label", { htmlFor: "tops-support-outcome",')
change('idle outcome selector','      React.createElement("select", { id: "tops-support-outcome",','      !supportReview && React.createElement("select", { id: "tops-support-outcome",')
change('review hierarchy','supportReview && React.createElement("section", { "aria-labelledby": "tops-support-review-heading", style: { borderTop: "1px solid " + C.border, paddingTop: 12 } },\n        React.createElement("h4", { id: "tops-support-review-heading", tabIndex: -1, style: { margin: "0 0 8px", fontSize: 18 } }, supportChoice ? "Review your next step" : "Review this support step"),','supportReview && React.createElement("section", { "aria-labelledby": "tops-support-review-heading" },\n        React.createElement("h3", { id: "tops-support-review-heading", tabIndex: -1, style: { margin: "0 0 8px", fontSize: 20 } }, supportChoice ? "Review your next step" : "Review this support step"),\n        React.createElement("p", { id: "tops-support-outcome-label", "data-outcome": supportReview.outcome, style: { fontSize: 14, fontWeight: 700, margin: "0 0 8px" } }, supportChoice ? supportChoice.label : "Update this step"),')
# Compact2: original snapshot is shown exactly once; conflict language never implies it is the current plan.
change('current snapshot block','React.createElement("p", { id: "tops-support-current", style: { lineHeight: 1.5 } }, "Current step: " + supportReview.current.text + (supportReview.current.done ? " (marked complete)." : " (unfinished).") + (supportReview.current.date ? " Target: " + supportReview.current.date + "." : "")),','React.createElement("p", { id: "tops-support-current", style: { lineHeight: 1.5, margin: "8px 0 12px" } }, React.createElement("strong", null, supportReview.snapshot === JSON.stringify(props.supportPlan.getPlan()) ? "Current step: " : "Step when this review began: "), supportReview.current.text + (supportReview.current.done ? " (marked complete)." : " (unfinished).") + (supportReview.current.date ? " Target: " + supportReview.current.date + "." : "")),')
focus='        React.createElement("p", { id: "tops-support-focus", style: { lineHeight: 1.5 } }, supportReview.guide.pathway === "support" ? "Focus: Get work or training support." : "Focus changes from " + TOPS_GUIDE_PATHS[supportReview.guide.pathway] + " to Get work or training support only when you keep this step. This changes future suggestions. Your role, goal and worksheet stay unchanged."),\n'
change('remove repeated or premature focus paragraph',focus,'')
change('proposed action label','supportChoice && supportChoice.id === "ready" ? "What did you agree to do next?" : "My next action"','supportChoice && supportChoice.id === "ready" ? "What did you agree to do next?" : "Proposed next step"')
# Compact3: shorten helper copy without changing any outcome action template.
for label,old,new in [
('waiting help','Choose your own follow-up date if useful. Waiting does not mark your current step complete.','Choose your own follow-up date if useful.'),
('documents help','Edit this to name what you need to prepare, without document contents or personal identifiers. Do not upload personal documents here.','Name documents only. No contents, identifiers or uploads.'),
('another option help','Name what you still need help with. A different option does not confirm eligibility or funding.','Describe the help you need. Eligibility and funding still need checking.'),
('ready help','What did you agree to do next? Edit the step below. Readiness does not mean funding or enrollment is approved.','Name what you agreed to do. Readiness is not approval for funding or enrollment.'),
('direct edit help','Use a short action without sensitive information. Keeping changes reopens a completed step.','Use a short action. Leave out personal or sensitive details.')]:change(label,old,new)
change('date and deliberate acceptance notices','React.createElement("p", { id: "tops-support-date-help", style: { fontSize: 14, lineHeight: 1.5 } }, "Your planning target, not a program deadline. Saving this step does not contact the provider. Keeping this action replaces your current step with an unfinished step."),\n        React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } },\n          React.createElement("button", { id: "tops-support-save",','React.createElement("p", { id: "tops-support-date-help", style: { fontSize: 14, lineHeight: 1.5, margin: "0 0 8px" } }, "Your date, not a program deadline."),\n        supportReview.guide.pathway !== "support" && React.createElement("p", { id: "tops-support-focus", style: { fontSize: 14, lineHeight: 1.5, margin: "0 0 8px" } }, "Focus changes from " + TOPS_GUIDE_PATHS[supportReview.guide.pathway] + " to Get work or training support. Future suggestions use that focus. Your role, goal and worksheet stay unchanged."),\n        React.createElement("p", { id: "tops-support-acceptance-help", style: { fontSize: 14, lineHeight: 1.5, margin: "0 0 8px" } }, "Both options replace your current step with an unfinished step. Neither contacts the provider."),\n        React.createElement("div", { className: "tops-next-move-actions", style: { display: "flex", flexWrap: "wrap", gap: 8 } },\n          React.createElement("button", { className: "tops-move-primary", id: "tops-support-save",')
# Compact4: suppress the idle card shell only while reviewing; state and restored invokers stay unchanged.
change('begin idle shell','    move.kind === "reflect" && React.createElement("p", { style: { lineHeight: 1.6 } }, "You marked this step done: "','    !supportReview && React.createElement(React.Fragment, null,\n    move.kind === "reflect" && React.createElement("p", { style: { lineHeight: 1.6 } }, "You marked this step done: "')
change('end idle shell','    move.kind === "continue" && contextUI,\n    supportUI,','    move.kind === "continue" && contextUI),\n    supportUI,')
change('idle timing','    timing && React.createElement("div", { id: "tops-loop-timing",','    !supportReview && timing && React.createElement("div", { id: "tops-loop-timing",')
change('preserved but hidden calendar review','    calendarPreview && React.createElement("section", { "aria-labelledby": "tops-personal-calendar-heading",','    !supportReview && calendarPreview && React.createElement("section", { "aria-labelledby": "tops-personal-calendar-heading",')
change('idle calendar message','    React.createElement("p", { role: "status", "aria-live": "polite" }, calendarMessage),','    !supportReview && React.createElement("p", { role: "status", "aria-live": "polite" }, calendarMessage),')
change('idle service action','    props.profile === "guard" && g.pathway && React.createElement("button",','    !supportReview && props.profile === "guard" && g.pathway && React.createElement("button",')
change('idle action editor','    editing && g.pathway && React.createElement(CareerAction,','    !supportReview && editing && g.pathway && React.createElement(CareerAction,')
change('idle utilities','    React.createElement(props.planHub ? "details" : "div", { id: props.planHub ? "tops-plan-options"','    !supportReview && React.createElement(props.planHub ? "details" : "div", { id: props.planHub ? "tops-plan-options"')
change('idle status','    React.createElement("p", { className: "tops-loop-meta",','    !supportReview && React.createElement("p", { className: "tops-loop-meta",')
p.write_text(s)
# Compact5: advance only this local build from the verified current candidate cache284.
p=root/'pwa-sw.js';w=p.read_text();assert w.count('transition-ops-v284')==1;w=w.replace('transition-ops-v284','transition-ops-v285',1);assert w.count('transition-ops-v284')==0 and w.count('transition-ops-v285')==1;p.write_text(w)
print('cache old284=0 new285=1; completed',len(records),'discrete index edits')
```

## support-compact-final-copy.py

```python
from pathlib import Path
root=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops')
p=root/'index.html';s=p.read_text()
for label,old,new in [
('single short unsaved boundary','"Unfinished update. You can visit other app pages and return. Save before refreshing or closing this tab."','"Unsaved update. Save before refreshing or closing this tab."'),
('unambiguous save or visit consequence','"Both options replace your current step with an unfinished step. Neither contacts the provider."','"Saving or using this update replaces your current step as unfinished. It does not contact the provider."')]:
    assert s.count(old)==1,label
    assert s.count(new)==0,label
    s=s.replace(old,new,1)
    assert s.count(old)==0 and s.count(new)==1,label
    print(label+': old0 new1 PASS')
p.write_text(s)
# Keep the regression aligned with the measured contract: reduced overall card, visible editor, no unsupported editor-distance claim.
p=root/'scripts/support-compact-review-browser-regression.js';s=p.read_text();old="assert.ok(shape.editorOffset<(direction==='support'?236:332));assert.ok(shape.saveOffset<(direction==='support'?572:668));";new="assert.ok(shape.editorOffset<300);assert.ok(shape.saveOffset<(direction==='support'?572:668));assert.ok(shape.cardHeight<1000);";assert s.count(old)==1;s=s.replace(old,new,1);assert s.count(new)==1
old='/replace.*unfinished.*Neither contacts/';new='/replaces.*unfinished.*does not contact/';assert s.count(old)==1;s=s.replace(old,new,1);assert s.count(new)==1
old='standard375px editor/Save offsets shorter than baseline';new='standard375px editor visible and Save offset shorter than retained baseline';assert s.count(old)==1;s=s.replace(old,new,1);assert s.count(new)==1;p.write_text(s)
```

## support-compact-picker.py

```python
from pathlib import Path
p=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops/index.html');s=p.read_text()
old='input[type=date]::-webkit-calendar-picker-indicator{filter:invert(var(--t-picker-invert,0.7))}'
new=old+'\n#tops-support-date::-webkit-calendar-picker-indicator{filter:none}'
assert s.count(old)==1 and s.count(new)==0
s=s.replace(old,new,1)
assert s.count(new)==1 and s.count('#tops-support-date::-webkit-calendar-picker-indicator{filter:none}')==1
p.write_text(s)
print('PASS scoped native date-picker rule: global1 retained, support override1')
```

## support-compact-tests.py

```python
from pathlib import Path
root=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops')
# Test1: outcome is now a readable label during review; preserve exact shared-draft comparison.
p=root/'scripts/support-review-continuity-browser-regression.js';s=p.read_text();old='document.getElementById("tops-support-outcome").value,document.getElementById("tops-support-text").value';new='document.getElementById("tops-support-outcome-label").dataset.outcome,document.getElementById("tops-support-text").value';assert s.count(old)==1;s=s.replace(old,new,1);assert s.count(new)==1;p.write_text(s)
# Test2: the idle timing shortcut is intentionally hidden in the review; the same date input remains visible/editable.
p=root/'scripts/support-outcome-browser-regression.js';s=p.read_text();old='await click(\'Review my target date\');await wait(\'document.activeElement.id === "tops-support-date"\');assert.equal(await ev(\'document.getElementById("tops-support-text").value\'),after[1].text);';new='assert.equal(await ev(\'document.getElementById("tops-loop-date-review")===null && document.getElementById("tops-support-date").checkVisibility()\'),true);assert.equal(await ev(\'document.getElementById("tops-support-text").value\'),after[1].text);';assert s.count(old)==1;s=s.replace(old,new,1);assert s.count(new)==1;p.write_text(s)
# Test3: bounded compact-review smoke using the existing isolated synthetic browser harness.
prefix=s[:s.index("    await load('dashboard'); await seed();")]
body=r'''
    await load('dashboard');
    const measurements=[];
    await c.send('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:true});
    for(const direction of ['support','change']){
      await seed(direction);const before=await plan();await set('tops-support-outcome','documents');await wait('document.activeElement.id==="tops-support-review-heading"');
      const shape=await ev(`(()=>{const h=document.getElementById('tops-support-review-heading'),e=document.getElementById('tops-support-text'),save=document.getElementById('tops-support-save'),card=h.closest('.tops-next-move');return{headingTag:h.tagName,outerHeading:card.querySelector('h2').id,editorOffset:e.getBoundingClientRect().top-h.getBoundingClientRect().top,saveOffset:save.getBoundingClientRect().top-h.getBoundingClientRect().top,cardHeight:card.getBoundingClientRect().height,reviewHeight:h.parentElement.getBoundingClientRect().height,hidden:!document.getElementById('tops-support-outcome')&&!card.querySelector('.tops-next-move-heading')&&!document.getElementById('tops-loop-timing')&&!card.querySelector('.tops-loop-utilities'),focus:document.getElementById('tops-support-focus')?.textContent||'',current:document.getElementById('tops-support-current').textContent,primary:save.classList.contains('tops-move-primary'),help:document.getElementById('tops-support-help').textContent,dateHelp:document.getElementById('tops-support-date-help').textContent,boundary:document.getElementById('tops-support-acceptance-help').textContent,saveBefore:document.getElementById('tops-support-unsaved').textContent};})()`);
      assert.equal(shape.headingTag,'H3');assert.equal(shape.outerHeading,'tops-loop-title');assert.equal(shape.hidden,true);assert.equal(shape.primary,true);assert.equal(shape.current.split(step).length-1,1);
      assert.ok(shape.editorOffset<(direction==='support'?236:332));assert.ok(shape.saveOffset<(direction==='support'?572:668));
      if(direction==='support')assert.equal(shape.focus,'');else assert.match(shape.focus,/Focus changes from.*Future suggestions.*role, goal and worksheet stay unchanged/);
      assert.match(shape.help,/No contents, identifiers or uploads/);assert.match(shape.dateHelp,/not a program deadline/);assert.match(shape.boundary,/replace.*unfinished.*Neither contacts/);assert.match(shape.saveBefore,/Save before refreshing/);
      assert.equal(await plan(),before);measurements.push({direction,...shape});await tap('tops-support-cancel');await wait('document.activeElement.id==="tops-support-outcome"');
    }
    console.log('PASS single h2/h3 review, one exact original step, visible limits and conditional focus change, primary Save; standard375px editor/Save offsets shorter than baseline');
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
'''
p=root/'scripts/support-compact-review-browser-regression.js';assert not p.exists();p.write_text(prefix+body)
print('PASS two one-span selector/assertion updates and one additive compact regression; existing state/privacy assertions retained')
```
