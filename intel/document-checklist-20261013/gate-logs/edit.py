from pathlib import Path
root=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops')
p=root/'index.html'; s=p.read_text()
def edit(number, old, new):
 global s
 print('\nEDIT',number,'OLD\n',old,'\nNEW\n',new)
 assert s.count(old)==1,(number,s.count(old))
 s=s.replace(old,new)
 assert not new or s.count(new)==1,(number,'new',s.count(new))
 expected_old=new.count(old)
 assert s.count(old)==expected_old,(number,'old',s.count(old),expected_old)
 p.write_text(s)
 print('COUNT new expected',1 if new else 0,'actual',s.count(new) if new else 0,'old expected',expected_old,'actual',s.count(old))
# EDIT 1: shared rendering only; notes and source remain exact, controls expose native state.
component='''function DocumentChecklist(props) {
  var C = props.colors, obtained = props.documents.filter(function(d) { return d.obtained; }).length;
  function row(d) {
    return React.createElement("div", { key: d.id, id: "tops-document-" + d.id, tabIndex: -1, style: { padding: "10px 14px", marginBottom: 10, background: C.bgCard, border: "1px solid " + C.border, borderRadius: 10 } },
      React.createElement("label", { htmlFor: "tops-document-check-" + d.id, style: { display: "flex", alignItems: "center", gap: 12, minHeight: 44, cursor: "pointer" } },
        React.createElement("input", { id: "tops-document-check-" + d.id, type: "checkbox", checked: d.obtained, onChange: function() { props.toggle(d.id); }, "aria-labelledby": "tops-document-name-" + d.id, "aria-describedby": "tops-document-note-" + d.id, style: { flex: "0 0 24px", width: 24, height: 24, margin: 0, accentColor: C.greenBright, cursor: "pointer" } }),
        React.createElement("span", { style: { minWidth: 0 } }, React.createElement("span", { id: "tops-document-name-" + d.id, style: { display: "block", color: C.textPrimary, fontSize: 16, lineHeight: 1.4, fontWeight: 600 } }, d.name),
          React.createElement("span", { style: { display: "block", color: C.textSecondary, fontSize: 14, lineHeight: 1.5 } }, d.obtained ? "Obtained" : "Not yet obtained"))),
      React.createElement("p", { id: "tops-document-note-" + d.id, style: { margin: "6px 0 0", fontSize: 14, lineHeight: 1.5, color: C.textBody } }, d.notes),
      d.id === "d8" && React.createElement("a", { id: "tops-vgli-document-source", href: "https://www.va.gov/life-insurance/options-eligibility/vgli/", target: "_blank", rel: "noopener noreferrer", style: { display: "inline-flex", alignItems: "center", minHeight: 44, maxWidth: "100%", boxSizing: "border-box", padding: "8px 0", color: C.greenBright, fontSize: 14, textDecoration: "underline", lineHeight: 1.5 } }, "VA VGLI eligibility and application guidance (opens a new tab)"));
  }
  return React.createElement("section", { "aria-label": "Document checklist", id: "tops-document-checklist" },
    props.readinessReturn || React.createElement("button", { id: "tops-documents-back", type: "button", onClick: props.back, style: { minHeight: 44, padding: "10px 14px", marginBottom: 12, background: C.bgCard, color: C.textPrimary, border: "1px solid " + C.border, borderRadius: 8, font: "inherit", cursor: "pointer" } }, "Back to My Plan"),
    React.createElement("div", { style: { marginBottom: 16 } },
      React.createElement("h3", { id: "tops-plan-documents", tabIndex: -1, style: { fontSize: 20, margin: "0 0 8px", color: C.textPrimary } }, "Your checklist"),
      React.createElement("p", { style: { margin: "0 0 10px", fontSize: 16, lineHeight: 1.5, color: C.textBody } }, "Mark the documents you have. You do not upload documents here."),
      React.createElement("p", { id: "tops-document-progress", style: { margin: "0 0 4px", fontSize: 16, fontWeight: 600, color: C.textPrimary } }, obtained + " of " + props.documents.length + " marked as obtained"),
      React.createElement("p", { id: "tops-document-save-status", role: "status", "aria-live": "polite", style: { margin: "0 0 12px", fontSize: 14, lineHeight: 1.5, color: C.textSecondary } }, props.saveStatus === "saved" ? "Checkmarks saved on this browser." : props.saveStatus === "visit" ? "Checkmarks are for this visit only in this embedded view." : props.saveStatus === "unconfirmed" ? "Saving could not be confirmed. Your checkmarks are still in this tab; keep it open." : "Checking saved progress...")),
    [true, false].map(function(critical) { return React.createElement("section", { key: String(critical), "aria-labelledby": critical ? "tops-documents-critical" : "tops-documents-supporting" },
      React.createElement("h4", { id: critical ? "tops-documents-critical" : "tops-documents-supporting", style: { fontSize: 16, fontWeight: 600, margin: "16px 0 10px", color: C.textPrimary } }, critical ? "Critical documents" : "Supporting documents"), props.documents.filter(function(d) { return d.critical === critical; }).map(row)); }));
}

'''
edit(1,'const TOPS_TAP_PREP = {',component+'const TOPS_TAP_PREP = {')
# EDIT 2: status stays in App memory, no storage key or schema added.
edit(2,'  const [documents, setDocuments] = useState(topsRestoreDocuments);','  const [documents, setDocuments] = useState(topsRestoreDocuments);\n  const [documentSaveStatus, setDocumentSaveStatus] = useState("checking");')
# EDIT 3: confirm existing write, keep visit state on failure; preserve backup effect suppression.
edit(3,'''  useEffect(() => {
    if (window.__IS_IFRAME) return;
    if (restorePlanEffects.current.documents) { restorePlanEffects.current.documents = false; return; }
    try {
      window.__safeSet("docProgress", JSON.stringify(documents));
    } catch (e) {}
  }, [documents]);''','''  useEffect(() => {
    if (window.__IS_IFRAME) { setDocumentSaveStatus("visit"); return; }
    if (restorePlanEffects.current.documents) { restorePlanEffects.current.documents = false; return; }
    try {
      var raw = JSON.stringify(documents);
      localStorage.setItem("docProgress", raw);
      setDocumentSaveStatus(localStorage.getItem("docProgress") === raw ? "saved" : "unconfirmed");
    } catch (e) { setDocumentSaveStatus("unconfirmed"); }
  }, [documents]);''')
# EDIT 4: only successful verified backup restore may assert saved; never rewrite restored compact flags.
edit(4,'    setMilestones(result.progress.milestones); setDocuments(result.progress.documents);','    setMilestones(result.progress.milestones); setDocuments(result.progress.documents); setDocumentSaveStatus("saved");')
# EDIT 5: document-only primary navigation ownership, other Resources keep Benefits.
old='n.id === "benefits" ? ["critical","vamath","vapay","resources","taxes"].indexOf(activeTab) !== -1 : n.id === "timeline" ? ["timeline","reminders","readiness","dd214"].indexOf(activeTab) !== -1'
new='n.id === "benefits" ? ["critical","vamath","vapay","resources","taxes"].indexOf(activeTab) !== -1 && !(activeTab === "resources" && subTab === "documents") : n.id === "timeline" ? ["timeline","reminders","readiness","dd214"].indexOf(activeTab) !== -1 || (activeTab === "resources" && subTab === "documents")'
edit(5,old,new)
# EDIT 6: accurate document-only page title; other topic title unchanged.
old='activeTab === "dashboard" ? "Home" : (TOPS_TOOL_CHOICES.find('
new='activeTab === "dashboard" ? "Home" : activeTab === "resources" && subTab === "documents" ? "Document checklist" : (TOPS_TOOL_CHOICES.find('
edit(6,old,new)
# EDIT 7: replace duplicate legacy cards, keep all data outside render byte-identical.
start=s.index('subTab === "documents" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {')
end=s.index('), activeTab === "taxes"',start)
old=s[start:end]
new='''subTab === "documents" && React.createElement(DocumentChecklist, { colors: C, documents: documents, toggle: toggleDoc, saveStatus: documentSaveStatus, readinessReturn: renderReadinessReturn("a6"), back: function() { setPlanView("hub"); setSelectedMilestone(null); continuationFocus.current = "tops-plan-shortcut-resources"; continuationReturn.current = null; setContinuationRevision(function(value) { return value + 1; }); setActiveTab("timeline"); } })'''
edit(7,old,new)
# EDIT 8: remove unused old-render derived value.
edit(8,'  const docsObtained = documents.filter(d => d.obtained).length;\n','')
# EDIT 9: public descriptive menu uses actual checklist term.
edit(9,'desc:"VSOs, SkillBridge, healthcare, document vault"','desc:"VSOs, SkillBridge, healthcare, document checklist"')
# EDIT 10: changed public bytes advance cache.
p=root/'pwa-sw.js'; s=p.read_text(); edit(10,'const CACHE_NAME = "transition-ops-v286";','const CACHE_NAME = "transition-ops-v287";')
