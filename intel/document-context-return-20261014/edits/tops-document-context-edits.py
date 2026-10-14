from pathlib import Path

repo = Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops')
source = repo / 'index.html'
edits = [
    # EDIT 1: Closed return keys and visible labels, never caller-supplied text.
    ('const TOPS_DOCUMENT_RETURN_TOPICS = ["directory", "vsos", "tap", "mindset", "leadership", "spouse", "perks", "skillbridge", "healthcare"];', '''const TOPS_DOCUMENT_RETURN_TOPICS = ["directory", "vsos", "tap", "mindset", "leadership", "spouse", "perks", "skillbridge", "healthcare"];
const TOPS_DOCUMENT_RETURNS = { plan: "Back to My Plan", home: "Back to Home", "home-documents": "Back to Home", "home-continue": "Back to Home", wisconsin: "Back to Wisconsin guide", directory: "Back to all resources", vsos: "Back to claims help and veteran organizations", tap: "Back to transition assistance programs", mindset: "Back to mindset and adjustment", leadership: "Back to leadership and communication", spouse: "Back to military spouse resources", perks: "Back to veteran discounts and perks", skillbridge: "Back to SkillBridge", healthcare: "Back to Healthcare" };
function topsDocumentReturnKey(value) { return typeof value === "string" && Object.prototype.hasOwnProperty.call(TOPS_DOCUMENT_RETURNS, value) ? value : ""; }'''),
    # EDIT 2: Read only a valid fixed key from this document history entry.
    ('  const __documentHistory = useRef(null);', '''  const documentReturn = useRef(topsIsDocumentURL(window.location.href) ? topsDocumentReturnKey(history.state && history.state.documentReturn) : "");
  const __documentHistory = useRef(null);'''),
    # EDIT 3: Native Back/Forward restores this entry's own return key.
    ('    var docs = topsIsDocumentURL(url.href);', '''    var docs = topsIsDocumentURL(url.href);
    documentReturn.current = docs ? topsDocumentReturnKey(state.documentReturn) : "";'''),
    # EDIT 4: Keep only this closed key in Documents history, not in URL or storage.
    ('if (activeTab === "resources" && TOPS_DOCUMENT_RETURN_TOPICS.includes(subTab)) state.documentParentTopic = subTab; else delete state.documentParentTopic; history.replaceState(state, "");', 'if (activeTab === "resources" && TOPS_DOCUMENT_RETURN_TOPICS.includes(subTab)) state.documentParentTopic = subTab; else delete state.documentParentTopic; if (activeTab === "resources" && subTab === "documents" && topsDocumentReturnKey(documentReturn.current)) state.documentReturn = documentReturn.current; else delete state.documentReturn; history.replaceState(state, "");'),
    # EDIT 5: Capture the actual fixed origin before changing the resource topic.
    ('    if (tab === "resources") { wiGuideRequested.current = false; setSubTab("documents"); setContinuationRevision(function(value) { return value + 1; }); }', '''    if (tab === "resources") {
      documentReturn.current = activeTab === "resources" && TOPS_DOCUMENT_RETURN_TOPICS.includes(subTab) ? wiGuideRequested.current ? "wisconsin" : subTab : activeTab === "dashboard" ? invoker === "tops-home-documents" ? "home-documents" : invoker === "tops-continue-documents" ? "home-continue" : "home" : activeTab === "timeline" ? "plan" : "";
      wiGuideRequested.current = false; setSubTab("documents"); setContinuationRevision(function(value) { return value + 1; });
    }'''),
    # EDIT 6: Return through existing route/focus state; no history push or URL supplied by a caller.
    ('  function openTimedReminderReview(hasDate) {', '''  function returnFromDocuments() {
    var key = topsDocumentReturnKey(documentReturn.current);
    continuationReturn.current = null;
    if (TOPS_DOCUMENT_RETURN_TOPICS.includes(key) || key === "wisconsin") {
      wiGuideRequested.current = key === "wisconsin";
      setSubTab(key === "wisconsin" ? "directory" : key);
      continuationFocus.current = key === "wisconsin" ? "tops-wi-work-support-resources-heading" : "tops-resource-topic";
      setActiveTab("resources");
    } else if (["home", "home-documents", "home-continue"].includes(key)) {
      if (key === "home-documents") setDashMoreOpen(true);
      continuationFocus.current = key === "home-documents" ? "tops-home-documents" : key === "home-continue" ? "tops-continue-documents" : "tops-page-title";
      setActiveTab("dashboard");
    } else {
      setPlanView("hub"); setSelectedMilestone(null);
      continuationFocus.current = "tops-plan-shortcut-resources";
      setActiveTab("timeline");
    }
    setContinuationRevision(function(value) { return value + 1; });
  }
  function openTimedReminderReview(hasDate) {'''),
    # EDIT 7: Existing Readiness return remains authoritative; no stale resource key underneath it.
    ('    if (tool.subTab) setSubTab(tool.subTab);', '''    if (tool.subTab === "documents") documentReturn.current = "";
    if (tool.subTab) setSubTab(tool.subTab);'''),
    # EDIT 8: One visible return control takes its text from the closed mapping.
    ('}, "Back to My Plan"),\n    React.createElement("h3", { id: "tops-plan-documents"', '}, props.backLabel || "Open My Plan"),\n    React.createElement("h3", { id: "tops-plan-documents"'),
    # EDIT 9: Wire the closed return label and handler into the existing checklist.
    ('readinessReturn: renderReadinessReturn("a6"), back: function() { setPlanView("hub"); setSelectedMilestone(null); continuationFocus.current = "tops-plan-shortcut-resources"; continuationReturn.current = null; setContinuationRevision(function(value) { return value + 1; }); setActiveTab("timeline"); }', 'readinessReturn: renderReadinessReturn("a6"), backLabel: TOPS_DOCUMENT_RETURNS[topsDocumentReturnKey(documentReturn.current)] || "Open My Plan", back: returnFromDocuments'),
]
for number, (old, new) in enumerate(edits, 1):
    s = source.read_text()
    print('EDIT', number, 'OLD:', old, '\nNEW:', new)
    assert s.count(old) == 1, (number, s.count(old))
    assert s.count(new) == 0, (number, 'new already present')
    source.write_text(s.replace(old, new))
    s = source.read_text()
    expected_old = 1 if old in new else 0
    print('new expect 1 / actual', s.count(new), '- old expect', expected_old, '/ actual', s.count(old))
    assert s.count(new) == 1 and s.count(old) == expected_old
# EDIT 10: New local cache integer above published main288; rollback289 was never served.
worker = repo / 'pwa-sw.js'
s = worker.read_text()
old, new = "const CACHE_NAME = 'transition-ops-v288';", "const CACHE_NAME = 'transition-ops-v289';"
print('EDIT 10 OLD:', old, 'NEW:', new)
assert s.count(old) == 1 and s.count(new) == 0
worker.write_text(s.replace(old, new))
s = worker.read_text()
print('new expect 1 / actual', s.count(new), '- old expect 0 / actual', s.count(old))
assert s.count(new) == 1 and s.count(old) == 0
