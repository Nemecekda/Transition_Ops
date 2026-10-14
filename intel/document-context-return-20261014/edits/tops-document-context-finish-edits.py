from pathlib import Path
repo = Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops')
source = repo/'index.html'
edits = [
    # EDIT 8 corrected boundary: the heading is inside the existing div, no source change occurred in failed assertion.
    ('}, "Back to My Plan"),\n    React.createElement("div", { style: { marginBottom: 16 } },', '}, props.backLabel || "Open My Plan"),\n    React.createElement("div", { style: { marginBottom: 16 } },'),
    # EDIT 9: Use the fixed-label map and route adapter.
    ('readinessReturn: renderReadinessReturn("a6"), back: function() { setPlanView("hub"); setSelectedMilestone(null); continuationFocus.current = "tops-plan-shortcut-resources"; continuationReturn.current = null; setContinuationRevision(function(value) { return value + 1; }); setActiveTab("timeline"); }', 'readinessReturn: renderReadinessReturn("a6"), backLabel: TOPS_DOCUMENT_RETURNS[topsDocumentReturnKey(documentReturn.current)] || "Open My Plan", back: returnFromDocuments'),
]
for number,(old,new) in enumerate(edits,8):
    s=source.read_text();print('EDIT',number,'OLD:',old,'NEW:',new)
    assert s.count(old)==1 and s.count(new)==0
    source.write_text(s.replace(old,new));s=source.read_text()
    print('new expect1/actual',s.count(new),'old expect0/actual',s.count(old));assert s.count(new)==1 and s.count(old)==0
# EDIT 10: Forward cache bump.
p=repo/'pwa-sw.js';s=p.read_text();old="const CACHE_NAME = 'transition-ops-v288';";new="const CACHE_NAME = 'transition-ops-v289';"
print('EDIT10 OLD:',old,'NEW:',new);assert s.count(old)==1 and s.count(new)==0
p.write_text(s.replace(old,new));s=p.read_text();print('new expect1/actual',s.count(new),'old expect0/actual',s.count(old));assert s.count(new)==1 and s.count(old)==0
