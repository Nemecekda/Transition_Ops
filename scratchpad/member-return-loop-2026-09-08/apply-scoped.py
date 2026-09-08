"""Authorized edits 1-3 and their actual release note; exact per-edit assertions."""
from pathlib import Path
import json
p=Path(__file__).resolve().parents[2]/'index.html'
s=p.read_text();log=[]
def edit(label,old,new):
 global s
 before=s.count(old);assert before==1,(label,before)
 assert new not in s,label
 s=s.replace(old,new)
 # New text sometimes contains its insertion anchor; record that expected count.
 expected_old=new.count(old)
 assert s.count(new)==1 and s.count(old)==expected_old,label
 p.write_text(s)
 log.append({'edit':label,'old_before':before,'new_after':1,'old_after':s.count(old),'old_expected_after':expected_old})
 print(label,log[-1])

# EDIT 1: canonical membership/content; only strict known-ID booleans survive.
edit('1a checklist hydration helpers','function App() {','''// Saved arrays carry completion only; current source owns content and membership.
function topsReadProgressArray(key) {
  if (window.__IS_IFRAME) return [];
  try {
    var saved = JSON.parse(window.__safeGet(key));
    return Array.isArray(saved) ? saved : [];
  } catch (e) { return []; }
}
function topsRestoreMilestones() {
  var saved = topsReadProgressArray("taskProgress");
  return TRANSITION_MILESTONES.map(function(m) {
    var flags = new Map();
    saved.forEach(function(row) {
      if (!row || row.id !== m.id || !Array.isArray(row.tasks)) return;
      row.tasks.forEach(function(t) {
        if (t && typeof t.done === "boolean" && !flags.has(t.id)) flags.set(t.id, t.done);
      });
    });
    return Object.assign({}, m, { tasks: m.tasks.map(function(t) {
      return Object.assign({}, t, { done: flags.has(t.id) ? flags.get(t.id) : t.done });
    }) });
  });
}
function topsRestoreDocuments() {
  var flags = new Map();
  topsReadProgressArray("docProgress").forEach(function(d) {
    if (d && typeof d.obtained === "boolean" && !flags.has(d.id)) flags.set(d.id, d.obtained);
  });
  return DOCUMENT_VAULT.map(function(d) {
    return Object.assign({}, d, { obtained: flags.has(d.id) ? flags.get(d.id) : d.obtained });
  });
}

function App() {''')
edit('1b hydrate tasks before first save','useState(TRANSITION_MILESTONES)','useState(topsRestoreMilestones)')
edit('1c hydrate docs before first save','useState(DOCUMENT_VAULT)','useState(topsRestoreDocuments)')
edit('1d remove whole-array restore and isolate notification JSON','''      const savedTasks = window.__safeGet("taskProgress");
      if (savedTasks) setMilestones(JSON.parse(savedTasks));
      const savedDocs = window.__safeGet("docProgress");
      if (savedDocs) setDocuments(JSON.parse(savedDocs));
      const savedDismissed = window.__safeGet("dismissedNotifs");
      if (savedDismissed) setDismissedNotifs(new Set(JSON.parse(savedDismissed)));''','''      try {
        const savedDismissed = JSON.parse(window.__safeGet("dismissedNotifs"));
        if (Array.isArray(savedDismissed)) setDismissedNotifs(new Set(savedDismissed));
      } catch (e) {}''')

# EDIT 2/3: transient navigation/focus only; no new persistent state or date rule.
edit('2a continuation route focus','  // Readiness Score state','''  const continuationFocus = useRef(null);
  const continuationReturn = useRef(null);
  function openPlanRoute(tab, target, invoker, milestoneId) {
    continuationFocus.current = target;
    continuationReturn.current = invoker;
    if (tab === "timeline") setSelectedMilestone(milestoneId || null);
    if (tab === "resources") setSubTab("documents");
    if (tab === "reminders") {
      setReminderFilterPri("ALL");
      setReminderFilterCat("ALL");
      setShowDismissed(false);
      setReminderExpanded(target.slice("tops-reminder-".length));
    }
    setActiveTab(tab);
  }
  useEffect(function() {
    var id = continuationFocus.current || (activeTab === "dashboard" && continuationReturn.current);
    if (!id) return;
    var frame = requestAnimationFrame(function() {
      var target = document.getElementById(id);
      if (!target) return;
      target.focus();
      target.scrollIntoView({ block: "center" });
      continuationFocus.current = null;
      if (activeTab === "dashboard") continuationReturn.current = null;
    });
    return function() { cancelAnimationFrame(frame); };
  }, [activeTab, selectedMilestone, subTab, reminderExpanded]);
  // Readiness Score state''')
# Anchor includes the actual spelling at this site, verified separately before execution.
edit('2b Home current partial selection','    var remDismissed = Object.keys(dismissedReminders).length;','''    var partialMilestone = milestones.find(function(m) {
      var count = m.tasks.filter(function(t) { return t.done; }).length;
      return count > 0 && count < m.tasks.length;
    });
    var remDismissed = Object.keys(dismissedReminders).length;''')
edit('2c compact Home continuation card','      // ═══ v72 SITREP DELTA — what changed since your last check-in ═══','''      React.createElement("section", { "aria-labelledby": "tops-continue-title", style: { background: C.bgCard, border: "1px solid " + C.border, borderRadius: 12, padding: 14, marginBottom: 12 } },
        React.createElement("h2", { id: "tops-continue-title", style: { fontFamily: "'Oswald', sans-serif", fontSize: 17, fontWeight: 600, color: C.textPrimary, margin: "0 0 6px" } }, "Continue your plan"),
        React.createElement("p", { style: { fontSize: 13, color: C.textSecondary, margin: "0 0 10px", lineHeight: 1.45 } }, doneTasks + "/" + totalTasks + " tasks complete; " + docsSecured + "/" + docsTotal + " documents obtained."),
        React.createElement("p", { style: { fontSize: 12, color: C.textSecondary, margin: "0 0 10px", lineHeight: 1.45 } }, partialMilestone ? "Continue the first checklist you have started, in timeline order." : doneTasks === totalTasks ? "All timeline tasks are marked complete. You can review or reopen them." : "No checklist is partly complete. Open your timeline to choose a task."),
        React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } },
          React.createElement("button", { id: "tops-continue-milestone", "data-continue-plan": "milestone", type: "button", onClick: function() { openPlanRoute("timeline", partialMilestone ? "tops-plan-milestone" : "tops-plan-timeline", "tops-continue-milestone", partialMilestone && partialMilestone.id); }, style: { flex: "1 1 150px", minHeight: 44, border: "1px solid " + C.border, borderRadius: 6, background: C.bgElevated, color: C.textPrimary, padding: "10px 12px", fontFamily: "'Oswald', sans-serif", fontSize: 14, cursor: "pointer", textAlign: "left" } }, partialMilestone ? "Continue: " + partialMilestone.phase : "Review timeline"),
          React.createElement("button", { id: "tops-continue-documents", "data-continue-plan": "documents", type: "button", onClick: function() { openPlanRoute("resources", "tops-plan-documents", "tops-continue-documents"); }, style: { flex: "1 1 150px", minHeight: 44, border: "1px solid " + C.border, borderRadius: 6, background: C.bgElevated, color: C.textPrimary, padding: "10px 12px", fontFamily: "'Oswald', sans-serif", fontSize: 14, cursor: "pointer", textAlign: "left" } }, docsSecured === docsTotal ? "Review documents" : "Continue documents")
        )
      ),

      // ═══ v72 SITREP DELTA — what changed since your last check-in ═══''')

# EDIT 3: existing Home routes become native; reminder destination expands exact ID.
edit('3a Timeline stat native','''React.createElement("div", { style: { textAlign: "center", cursor: "pointer" }, onClick: function() { setActiveTab("timeline"); } },''','''React.createElement("button", { id: "tops-home-timeline", type: "button", style: { textAlign: "center", cursor: "pointer", background: "transparent", border: 0, padding: 0, minWidth: 44, minHeight: 44 }, onClick: function() { openPlanRoute("timeline", "tops-plan-timeline", "tops-home-timeline"); } },''')
edit('3b Readiness stat native','''React.createElement("div", { style: { textAlign: "center", cursor: "pointer" }, onClick: function() { setActiveTab("readiness"); } },''','''React.createElement("button", { id: "tops-home-readiness", type: "button", style: { textAlign: "center", cursor: "pointer", background: "transparent", border: 0, padding: 0, minWidth: 44, minHeight: 44 }, onClick: function() { openPlanRoute("readiness", "tops-plan-readiness", "tops-home-readiness"); } },''')
edit('3c Next Action native exact route','''urgentReminders.length > 0 && React.createElement("div", { style: { background: C.bgCard, borderRadius: 12, padding: "14px 16px", marginBottom: 12, display: "flex", alignItems: "center", gap: 13, cursor: "pointer" }, onClick: function() { setActiveTab("reminders"); } },''','''urgentReminders.length > 0 && React.createElement("button", { id: "tops-home-next-action", type: "button", style: { width: "100%", textAlign: "left", border: "1px solid " + C.border, background: C.bgCard, borderRadius: 12, padding: "14px 16px", marginBottom: 12, display: "flex", alignItems: "center", gap: 13, cursor: "pointer" }, onClick: function() { openPlanRoute("reminders", "tops-reminder-" + urgentReminders[0].id, "tops-home-next-action"); } },''')
edit('3d Timeline focus target','''activeTab === "timeline" && !selectedMilestone && /*#__PURE__*/React.createElement("div", null,''','''activeTab === "timeline" && !selectedMilestone && /*#__PURE__*/React.createElement("div", { id: "tops-plan-timeline", role: "region", "aria-label": "Timeline", tabIndex: -1 },''')
edit('3e Milestone focus target','''    }, m.phase), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,''','''    }, m.phase), /*#__PURE__*/React.createElement("div", {
      id: "tops-plan-milestone", tabIndex: -1, role: "heading", "aria-level": 2,
      style: {
        fontSize: 14,''')
edit('3f Document focus target','''    style: S.cardTitle
  }, "DOCUMENT VAULT"),''','''    id: "tops-plan-documents", tabIndex: -1, role: "heading", "aria-level": 2,
    style: S.cardTitle
  }, "DOCUMENT VAULT"),''')
edit('3g Readiness focus target','''React.createElement("div", { style: { fontSize: 10, color: C.gold, letterSpacing: 3, fontFamily: "'Oswald', sans-serif", marginBottom: 16 } }, "TRANSITION READINESS SCORE")''','''React.createElement("div", { id: "tops-plan-readiness", tabIndex: -1, role: "heading", "aria-level": 2, style: { fontSize: 10, color: C.gold, letterSpacing: 3, fontFamily: "'Oswald', sans-serif", marginBottom: 16 } }, "TRANSITION READINESS SCORE")''')
edit('3h Exact reminder native focus target','''React.createElement("div", { style: { padding: 14, cursor: "pointer", display: "flex", gap: 10 }, onClick: function() { setReminderExpanded(isExp ? null : r.id); } },''','''React.createElement("button", { id: "tops-reminder-" + r.id, type: "button", "aria-expanded": isExp, style: { width: "100%", background: "transparent", border: 0, textAlign: "left", padding: 14, cursor: "pointer", display: "flex", gap: 10 }, onClick: function() { setReminderExpanded(isExp ? null : r.id); } },''')

# EDIT 4: release notes describe only this implemented frontend change.
edit('4a release-note version','const APP_VERSION = "v96";','const APP_VERSION = "v97";')
edit('4b implemented release note','const WHATS_NEW = [','''const WHATS_NEW = [
  { v: "v97", date: "8 SEP 2026", note: "Continue your plan from Home: see task and document counts, reopen a partly completed checklist, or go straight to Documents. Saved completion marks now use current checklist content. Home timeline, readiness, and Next Action controls work with the keyboard; Next Action opens the matching reminder." },''')
(Path(__file__).parent/'edit-assertions.json').write_text(json.dumps(log,indent=2)+'\n')
