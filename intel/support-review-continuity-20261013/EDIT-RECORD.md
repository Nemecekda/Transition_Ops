# Approved discrete edit record

Local support-review continuity only. The parent approved this bounded implementation and wording under the user's continued-build request. The initial script was shown before execution and asserts every replacement. Its first run stopped before any write on a repeated-new-string count; expected counts were then derived from pre-edit text, and the reviewed script completed. The My Plan reachability condition was applied separately. The final three exact replacements shorten the duplicate notice and wire the remaining explicit clear-source callbacks. The final patch was read hunk by hunk.

An independent in-memory replay against reconciled commit577812f reproduces the final index byte-for-byte and records old/new counts after each substitution in gate-logs/discrete-edit-counts.json. Cache283 to284 is also an exact one-span substitution. New regression and evidence files are additive. No dependency, source-policy, configuration or paid-call changes.

## Initial reviewed script

```python
from pathlib import Path
import hashlib
p=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops/index.html');s=p.read_text()
def change(label,old,new):
 global s
 assert s.count(old)==1,(label,s.count(old));expected=s.count(new)+1;s=s.replace(old,new,1);assert s.count(new)==expected,label;print(label+': old span1 replaced; new span expected='+str(expected)+' actual='+str(s.count(new)))
# Recovery1: keep proposal and status owned by the app, shared by both next-step card locations.
change('shared review binding','  var [supportReview, setSupportReview] = useState(null), [supportMessage, setSupportMessage] = useState("");','  var supportReview = props.supportPlan.review, setSupportReview = props.supportPlan.setReview, supportMessage = props.supportPlan.message, setSupportMessage = props.supportPlan.setMessage;\n  useEffect(function() { if (supportReview) setSupportMessage("Your unsaved review is still here. Review it before saving. Refreshing or closing this page discards it."); }, []);')
# Recovery2: retain the original snapshot and explicit invoker; focus outcome context before fields.
change('review invoker parameter','  function reviewSupport(outcome) {','  function reviewSupport(outcome, invoker) {')
change('store invoker','setSupportReview({ outcome: outcome, snapshot: JSON.stringify(props.supportPlan.getPlan()), current: a, guide: g, text: choice ? choice.text : a.text, date: choice ? "" : a.date });','setSupportReview({ outcome: outcome, invoker: invoker || "tops-support-outcome", snapshot: JSON.stringify(props.supportPlan.getPlan()), current: a, guide: g, text: choice ? choice.text : a.text, date: choice ? "" : a.date });')
change('outcome context focus','var input = document.getElementById("tops-support-text"); if (input) { input.focus(); input.scrollIntoView({ block: "center" }); }','var target = document.getElementById(outcome === "edit" ? "tops-support-text" : "tops-support-review-heading"); if (target) { target.focus(); target.scrollIntoView({ block: "start" }); }')
# Recovery3: keep stale drafts visible and cancellable after the current plan changes.
change('stale draft reachability','var supportUI = supportStep && props.supportPlan && React.createElement','var supportUI = (supportStep || supportReview) && props.supportPlan && React.createElement')
change('focusable review heading','id: "tops-support-review-heading", style:','id: "tops-support-review-heading", tabIndex: -1, style:')
change('pending review status','React.createElement("p", { id: "tops-support-current", style:', 'React.createElement("p", { id: "tops-support-unsaved", role: "status", style: { fontSize: 14, lineHeight: 1.5 } }, supportReview.snapshot === JSON.stringify(props.supportPlan.getPlan()) ? "Not saved. Your review stays here while you use other tools in this page. Refreshing or closing the page discards it." : "Your plan or saved work changed while this review was open. Your draft is kept below. Copy anything you need, then keep the current step and start a new review."),\n        React.createElement("p", { id: "tops-support-current", style:')
change('cancel invoker focus','onClick: function() { setSupportReview(null); setSupportMessage("Your current step is unchanged."); requestAnimationFrame(function() { var select = document.getElementById("tops-support-outcome"); if (select) select.focus(); }); } }, "Keep current step"','onClick: function() { var invoker = supportReview.invoker; setSupportReview(null); setSupportMessage("Your current step is unchanged."); requestAnimationFrame(function() { var target = document.getElementById(invoker) || document.getElementById("tops-support-outcome") || document.getElementById("tops-loop-title"); if (target) target.focus(); }); } }, "Keep current step"')
# Recovery4: give direct editing a consistent action label and deterministic return targets.
change('generic direct editor','onClick: function() { reviewSupport("edit"); } }, "Open my support step"','onClick: function() { reviewSupport("edit", "tops-loop-support-open"); } }, "Update this step"')
change('WI direct editor','onClick: function() { reviewSupport("edit"); } }, "Update this step"','onClick: function() { reviewSupport("edit", "tops-support-update-current"); } }, "Update this step"')
change('date shortcut invoker','React.createElement("button", { type: "button", style: button, onClick: function() { if (supportStep) { if (!supportReview) reviewSupport("edit");','React.createElement("button", { id: "tops-loop-date-review", type: "button", style: button, onClick: function() { if (supportStep) { if (!supportReview) reviewSupport("edit", "tops-loop-date-review");')
# Recovery5: App owns only this page-memory proposal and message. Existing saved state is untouched.
anchor='  const [wiQuestions, setWiQuestions] = useState(TOPS_WISCONSIN_WORK_SUPPORT.question);'
change('App review state',anchor,anchor+'\n  var [supportReview, setSupportReview] = useState(null), [supportMessage, setSupportMessage] = useState("");')
change('shared review props','supportPlan: { getPlan: wisconsinPlanSnapshot, applyStep: applySupportOutcome }','supportPlan: { review: supportReview, setReview: setSupportReview, message: supportMessage, setMessage: setSupportMessage, getPlan: wisconsinPlanSnapshot, applyStep: applySupportOutcome }')
# Recovery7: explicit deletion/discard/restore boundaries clear only the new pending review.
change('clear pending helper','  function wisconsinPlanSnapshot() {','  function clearSupportReview() { setSupportReview(null); setSupportMessage(""); }\n  function wisconsinPlanSnapshot() {')
change('guide clear callback','    setConfirmClear(false); props.setState({ draft: topsEmptyGuide(),','    setConfirmClear(false); if (props.onClear) props.onClear(); props.setState({ draft: topsEmptyGuide(),')
change('guide clear wiring','React.createElement(PersonalGuide, { key: guideRestoreRevision,','React.createElement(PersonalGuide, { onClear: clearSupportReview, key: guideRestoreRevision,')
change('action clear callback','if (topsClearAction()) props.setState({ draft: topsEmptyAction(), status: "Step cleared from this page" + (window.__IS_IFRAME ? "." : " and this browser.") });','if (topsClearAction()) { if (props.onClear) props.onClear(); props.setState({ draft: topsEmptyAction(), status: "Step cleared from this page" + (window.__IS_IFRAME ? "." : " and this browser.") }); }')
change('guide action clear wiring','React.createElement(CareerAction, { colors: C, guide: draft, state: props.actionState, setState: props.setActionState })','React.createElement(CareerAction, { colors: C, guide: draft, state: props.actionState, setState: props.setActionState, onClear: props.onClear })')
change('loop action clear wiring','React.createElement(CareerAction, { colors: C, state: props.actionState, setState: props.setActionState, guide: g })','React.createElement(CareerAction, { colors: C, state: props.actionState, setState: props.setActionState, guide: g, onClear: props.supportPlan.clearReview })')
change('Navigator action clear wiring','React.createElement(CareerAction, { colors: C, guide: guide, state: props.state, setState: props.setState })','React.createElement(CareerAction, { colors: C, guide: guide, state: props.state, setState: props.setState, onClear: props.onClear })')
change('Navigator clear entry','React.createElement(NavigatorNextStep, { colors: C,','React.createElement(NavigatorNextStep, { onClear: clearSupportReview, colors: C,')
change('shared clear prop','supportPlan: { review: supportReview,','supportPlan: { clearReview: clearSupportReview, review: supportReview,')
change('worksheet clear callback','var ok = topsClearGap(); props.setState({ draft: topsEmptyGap(),','var ok = topsClearGap(); if (props.onClear) props.onClear(); props.setState({ draft: topsEmptyGap(),')
change('worksheet clear wiring','React.createElement(CareerGapWorksheet, { colors: C,','React.createElement(CareerGapWorksheet, { onClear: clearSupportReview, colors: C,')
change('Career discard callback','  function clearVisit() { props.setVisitDraft(null);','  function clearVisit() { if (props.onClearSupportReview) props.onClearSupportReview(); props.setVisitDraft(null);')
change('Career discard wiring','React.createElement(CareerJourney, { wisconsinSupport:','React.createElement(CareerJourney, { onClearSupportReview: clearSupportReview, wisconsinSupport:')
change('source clear callback','if (props.onSourceChange) props.onSourceChange({ resume: "", posting: "" }); setPreview(null);','if (props.onSourceChange) props.onSourceChange({ resume: "", posting: "" }); if (props.onClearSource) props.onClearSource(); setPreview(null);')
change('Career source clear wiring','onSourceChange: setSource, onReviewed: result','onClearSource: props.onClearSupportReview, onSourceChange: setSource, onReviewed: result')
change('restore clear callback','    restorePlanEffects.current = { tasks: true, documents: true };','    clearSupportReview();\n    restorePlanEffects.current = { tasks: true, documents: true };')
# Recovery8: state backup and reset scope explicitly without promising other memory is erased.
change('backup exclusion notice','Does not include your unfinished career draft, visit-only career introduction,','Does not include your unfinished support update, unfinished career draft, visit-only career introduction,')
change('backup restore notice','Your visit-only career introduction and unfinished career draft will be cleared.','Your visit-only career introduction, unfinished career draft and unfinished support update will be cleared.')
change('backup restore confirmation','Your visit-only career introduction and unfinished career draft were cleared; other tool data is unchanged.','Your visit-only career introduction, unfinished career draft and unfinished support update were cleared; other tool data is unchanged.')
change('guide clear notice','Saved guide details cleared from this browser. Your other tools and follow-ups are unchanged.','Saved guide details and any unfinished support update cleared from this page. The saved guide was removed from this browser. Your other tools and follow-ups are unchanged.')
change('pending copy','Your unsaved review is still here. Review it before saving. Refreshing or closing this page discards it.','Unfinished update. You can visit other app pages and return. Save before refreshing or closing this tab.')
change('pending visible copy','Not saved. Your review stays here while you use other tools in this page. Refreshing or closing the page discards it.','Unfinished update. You can visit other app pages and return. Save before refreshing or closing this tab.')
p.write_text(s)
# Recovery6: current published main already uses283, so this local build advances to284.
p=p.with_name('pwa-sw.js');s=p.read_text();old='transition-ops-v283';assert s.count(old)==1;s=s.replace(old,'transition-ops-v284');assert s.count(old)==0 and s.count('transition-ops-v284')==1;p.write_text(s);print('cache284: old283=0,new284=1')
print('final index',hashlib.sha256(p.with_name('index.html').read_bytes()).hexdigest())
```

## Final reviewed script

```python
from pathlib import Path
p=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops/index.html')
s=p.read_text()
edits=[
('useEffect(function() { if (supportReview) setSupportMessage("Unfinished update. You can visit other app pages and return. Save before refreshing or closing this tab."); }, []);','useEffect(function() { if (supportReview) setSupportMessage("Your unfinished support update is still here."); }, []);'),
('React.createElement(CareerGapStarter, { draft: props.state.draft, setState: props.setState, colors: C, field: fieldStyle, button: buttonStyle })','React.createElement(CareerGapStarter, { draft: props.state.draft, setState: props.setState, colors: C, field: fieldStyle, button: buttonStyle, onClearSource: props.onClear })'),
('React.createElement(CareerGapStarter, { draft: props.gapState.draft, setState: props.setGapState, colors: C, field: field, button: button, onApplied: function() { go(1); } })','React.createElement(CareerGapStarter, { draft: props.gapState.draft, setState: props.setGapState, colors: C, field: field, button: button, onClearSource: props.onClearSupportReview, onApplied: function() { go(1); } })')
]
for old,new in edits:
    assert s.count(old)==1, old
    assert s.count(new)==0, new
    s=s.replace(old,new,1)
    assert s.count(new)==1,new
p.write_text(s)
print('PASS: three exact-count replacements; short return status and two remaining source-clear callbacks')
```
