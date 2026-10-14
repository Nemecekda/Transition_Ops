from pathlib import Path
root=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops')
p=root/'index.html'; s=p.read_text()
def edit(n,old,new,count=1):
 global s
 print('EDIT',n,'OLD:',old,'NEW:',new)
 assert s.count(old)==count,(n,s.count(old),count)
 prior=s.count(new);s=s.replace(old,new)
 expected_old=count*new.count(old)
 print('new expected',prior+count,'actual',s.count(new),'old expected',expected_old,'actual',s.count(old))
 assert s.count(new)==prior+count and s.count(old)==expected_old
# EDIT 1: Closed document-only URL and parent-resource history allowlist.
edit(1,'function topsCurrentToolURL(href, tool) {','''const TOPS_DOCUMENT_RETURN_TOPICS = ["directory", "vsos", "tap", "mindset", "leadership", "spouse", "perks", "skillbridge", "healthcare"];
function topsIsDocumentURL(href) {
  try { var q = new URL(href).searchParams; return q.getAll("tool").length === 1 && q.get("tool") === "resources" && q.getAll("view").length === 1 && q.get("view") === "documents" && !q.has("guide"); } catch (error) { return false; }
}
function topsCurrentToolURL(href, tool) {''')
# EDIT 2: Direct document link initializes the existing resource state.
edit(2,'const [subTab, setSubTab] = useState("vsos");','const [subTab, setSubTab] = useState(function() { return topsIsDocumentURL(window.location.href) ? "documents" : "vsos"; });')
# EDIT 3: Keep document history restoration scoped to this route and closed parent values.
edit(3,'const __planHistory = useRef(null);','''const __planHistory = useRef(null);
  const __documentHistory = useRef(null);
  __documentHistory.current = { active: activeTab === "resources" && subTab === "documents", overlay: showMoreMenu || feedbackOpen || aboutOpen || whatsNewOpen || policyPanelOpen || showNotifPanel, restore: function() {
    var url = new URL(window.location.href), tool = url.searchParams.get("tool"), state = history.state || {};
    if (TOPS_TOOL_ROUTES.indexOf(tool) === -1) tool = "dashboard";
    var docs = topsIsDocumentURL(url.href);
    wiGuideRequested.current = tool === "resources" && topsIsWisconsinGuideURL(url.href);
    if (tool === "resources") setSubTab(docs ? "documents" : wiGuideRequested.current ? "directory" : TOPS_DOCUMENT_RETURN_TOPICS.includes(state.documentParentTopic) ? state.documentParentTopic : "vsos");
    if (tool === "timeline") { setPlanView(state.planView === "timeline" ? "timeline" : "hub"); setSelectedMilestone(null); }
    continuationFocus.current = docs ? "tops-plan-documents" : wiGuideRequested.current ? "tops-wi-work-support-resources-heading" : tool === "timeline" ? "tops-plan-shortcut-resources" : "tops-page-title";
    setContinuationRevision(function(value) { return value + 1; });
    setActiveTab(tool);
  } };''')
# EDIT 4: URL serialization owns only the exact document route; clear mutually exclusive WI marker.
old='try { var next = topsCurrentToolURL(window.location.href, activeTab); if (next) { var url = new URL(next); if (activeTab === "resources" && wiGuideRequested.current) { if (url.searchParams.get("guide") !== "wisconsin-work-support") url.searchParams.set("guide", "wisconsin-work-support"); } else { if (url.searchParams.has("guide")) url.searchParams.delete("guide"); wiGuideRequested.current = false; } if (url.href !== window.location.href) history.replaceState(history.state, "", url.href); } } catch (error) {}'
new='''try { var next = topsCurrentToolURL(window.location.href, activeTab); if (next) { var url = new URL(next), docs = activeTab === "resources" && subTab === "documents";
      if (docs) { url.searchParams.set("view", "documents"); url.searchParams.delete("guide"); wiGuideRequested.current = false; }
      else { if (url.searchParams.has("view")) url.searchParams.delete("view"); if (activeTab === "resources" && wiGuideRequested.current) { if (url.searchParams.get("guide") !== "wisconsin-work-support") url.searchParams.set("guide", "wisconsin-work-support"); } else { if (url.searchParams.has("guide")) url.searchParams.delete("guide"); wiGuideRequested.current = false; } }
      if (url.href !== window.location.href) history.replaceState(history.state, "", url.href);
    } } catch (error) {}'''
edit(4,old,new)
# EDIT 5: Documents has one owned history layer, above its existing parent.
edit(5,'if (activeTab !== "dashboard") depth += 1;','if (activeTab !== "dashboard") depth += 1;\n      if (activeTab === "resources" && subTab === "documents") depth += 1;')
# EDIT 6: Retain only closed resource topic context on the existing history entry.
edit(6,'if (activeTab === "timeline") state.planView = planView; else delete state.planView; history.replaceState(state, "");','if (activeTab === "timeline") state.planView = planView; else delete state.planView; if (activeTab === "resources" && TOPS_DOCUMENT_RETURN_TOPICS.includes(subTab)) state.documentParentTopic = subTab; else delete state.documentParentTopic; history.replaceState(state, "");')
# EDIT 7: Subview changes also synchronize the fixed route.
edit(7,'}, [showOnboarding, onboardStep, activeTab, planView, selectedMilestone, journeyTarget, pathwayMode, careerScreen, careerStage, showMoreMenu, feedbackOpen, aboutOpen, whatsNewOpen, policyPanelOpen, showNotifPanel, __histRevision]);','}, [showOnboarding, onboardStep, activeTab, subTab, planView, selectedMilestone, journeyTarget, pathwayMode, careerScreen, careerStage, showMoreMenu, feedbackOpen, aboutOpen, whatsNewOpen, policyPanelOpen, showNotifPanel, __histRevision]);')
# EDIT 8: Restore a document boundary on native Back/Forward, without overriding open overlays or other history.
edit(8,'__histSkipSync.current = true;\n      var plan = __planHistory.current','''__histSkipSync.current = true;
      var documentsRoute = __documentHistory.current;
      if (documentsRoute && !documentsRoute.overlay && (documentsRoute.active || topsIsDocumentURL(window.location.href))) { __histDepth.current = (history.state && history.state.tops) || 0; documentsRoute.restore(); return; }
      var plan = __planHistory.current''')
# EDIT 9: Direct-link initial focus uses the existing checklist heading/scroll behavior.
edit(9,'const continuationFocus = useRef(null);','const continuationFocus = useRef(topsIsDocumentURL(window.location.href) ? "tops-plan-documents" : null);')
# EDIT 10: Existing document entry path clears WI identity and focuses repeated entries.
edit(10,'if (tab === "resources") setSubTab("documents");','if (tab === "resources") { wiGuideRequested.current = false; setSubTab("documents"); setContinuationRevision(function(value) { return value + 1; }); }')
# EDIT 11: Topic-picker document entry uses that same route path.
edit(11,'onChange: function(event) { if (event.target.value === "documents") continuationFocus.current = "tops-plan-documents"; setSubTab(event.target.value); }','onChange: function(event) { if (event.target.value === "documents") openPlanRoute("resources", "tops-plan-documents", "tops-resource-topic"); else setSubTab(event.target.value); }')
# EDIT 12: Existing Home document tile becomes a named native button.
edit(12,'React.createElement("div", { className: "dash-card tops-progress-card", style: { margin: 0 }, onClick: function() { setActiveTab("resources"); setSubTab("documents"); } },','React.createElement("button", { id: "tops-home-documents", type: "button", className: "dash-card tops-progress-card", style: { margin: 0, minHeight: 44, textAlign: "left", font: "inherit" }, onClick: function() { openPlanRoute("resources", "tops-plan-documents", "tops-home-documents"); } },')
# EDIT 13: Honest self-reported progress copy; keep visual title readable.
edit(13,'React.createElement("div", { style: { fontSize: 10, color: C.gold, letterSpacing: 2, fontFamily: "\'Oswald\', sans-serif", marginBottom: 8 } }, "DOCUMENTS"),','React.createElement("div", { style: { fontSize: 16, fontWeight: 600, color: C.textPrimary, marginBottom: 8 } }, "Document checklist"),')
edit(14,'}, docsSecured + "/" + docsTotal),','}, docsSecured + " of " + docsTotal),')
edit(15,'React.createElement("div", { style: { fontSize: 10, color: C.inactive, marginTop: 4 } }, "secured")','React.createElement("div", { style: { fontSize: 14, color: C.textSecondary, marginTop: 4 } }, "marked as obtained")')
p.write_text(s)
# EDIT 16: Forward cache bump for changed precached app bytes.
p=root/'pwa-sw.js';s=p.read_text();edit(16,'const CACHE_NAME = "transition-ops-v287";','const CACHE_NAME = "transition-ops-v288";');p.write_text(s)
