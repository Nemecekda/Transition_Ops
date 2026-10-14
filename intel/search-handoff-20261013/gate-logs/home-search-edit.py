from pathlib import Path
import json
root=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops')
p=root/'index.html';src=p.read_text();edits=[]
def edit(label,old,new,count=1):
 global src
 n=src.count(old);assert n==count,(label,n,count)
 src=src.replace(old,new);assert src.count(new)==count,(label,'new count')
 edits.append({'edit':label,'old':old,'new':new,'old_before':n,'new_after':src.count(new),'old_after':src.count(old)})
# EDIT 1: Ephemeral search-origin state; never serialized to storage or URL.
edit('search origin state','  const [searchQ, setSearchQ] = useState("");','  const [searchQ, setSearchQ] = useState("");\n  const [homeSearchSelection, setHomeSearchSelection] = useState(null);')
# EDIT 2: Retain exact known item identity and use existing focused reminder state.
edit('search navigation helpers','  function renderHomeSearch() { return', '''  function returnToHomeSearch() {
    var target = homeSearchSelection && homeSearchSelection.returnId || "tops-home-search";
    primaryNavFocus.current = false; continuationFocus.current = target; continuationReturn.current = null;
    setHomeSearchSelection(null); setActiveTab("dashboard"); setContinuationRevision(function(value) { return value + 1; });
  }
  function searchReturnControl() { return React.createElement("div", { style: { marginBottom: 12 } },
    React.createElement("button", { id: "tops-search-back", type: "button", onClick: returnToHomeSearch, style: { minHeight: 44, padding: "10px 14px", background: C.bgCard, color: C.textPrimary, border: "1px solid " + C.border, borderRadius: 8, font: "inherit", cursor: "pointer" } }, "Back to search"),
    React.createElement("p", { style: { fontSize: 14, lineHeight: 1.5, margin: "8px 0 0", overflowWrap: "anywhere" } }, "Search: " + searchQ)); }
  function openHomeSearchResult(hit, returnId) {
    if (hit.act === "reminder" || hit.act === "window") {
      var tab = hit.act === "reminder" ? "reminders" : "critical";
      setHomeSearchSelection({ tab: tab, id: hit.id, title: hit.title, returnId: returnId });
      primaryNavFocus.current = false; setShowMoreMenu(false);
      if (tab === "reminders") openPlanRoute(tab, "tops-reminder-" + hit.id, returnId);
      else { setCriticalFilter("ALL"); setExpandedWindow(hit.id); continuationReturn.current = returnId; setActiveTab(tab); }
      return;
    }
    setHomeSearchSelection(null);
    if (hit.act === "wi-work-support") openWisconsinGuide(); else openExperienceTool(hit.tab);
  }
  useEffect(function() {
    if (!homeSearchSelection) return;
    if (activeTab !== homeSearchSelection.tab) {
      if (activeTab !== "dashboard" && continuationReturn.current === homeSearchSelection.returnId) continuationReturn.current = null;
      setHomeSearchSelection(null); return;
    }
    if (activeTab === "critical") {
      var available = !!separationDate && filterCriticalWindows(userStatus).some(function(item) { return item.id === homeSearchSelection.id; });
      setExpandedWindow(homeSearchSelection.id);
      continuationFocus.current = available ? "tops-window-title-" + homeSearchSelection.id : "tops-search-critical-context";
      setContinuationRevision(function(value) { return value + 1; });
    }
  }, [activeTab, homeSearchSelection, separationDate, userStatus]);
  function renderHomeSearch() { return''')
# EDIT 3: Carry exact reminder/window IDs instead of generic tab destinations.
edit('reminder identity','act: "tab", tab: "reminders" });','act: "reminder", id: r.id });')
edit('window identity','act: "tab", tab: "critical" });','act: "window", id: w.id });')
# EDIT 4: Use readable, title-first results with explicit external-link behavior. Keep source snippets intact.
old='''          React.createElement("div", { key: "t", style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 3 } },
            React.createElement("span", { style: { fontSize: 9, padding: "2px 6px", background: C.bgElevated, color: h.tagColor, borderRadius: 4, fontFamily: "'Oswald', sans-serif", letterSpacing: 1, flexShrink: 0 } }, h.tag),
            React.createElement("span", { style: { fontFamily: "'Oswald', sans-serif", fontSize: 13, color: C.textPrimary } }, h.title)
          ),
          React.createElement("div", { key: "s", style: { fontSize: 13, color: C.textBody, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } }, h.snip)'''
new='''          React.createElement("div", { key: "t", style: { fontSize: 16, fontWeight: 600, lineHeight: 1.35, color: C.textPrimary, overflowWrap: "anywhere" } }, h.title),
          React.createElement("div", { key: "k", style: { fontSize: 12, color: C.textSecondary, margin: "4px 0", lineHeight: 1.4 } }, { TOOL: "Tool", REMINDER: "Reminder", "CRITICAL WINDOW": "Critical window", RESOURCE: "Resource", "VSO / ORG": "Organization", SKILLBRIDGE: "SkillBridge" }[h.tag], h.act === "url" ? " - Opens a new tab" : ""),
          React.createElement("div", { key: "s", style: { fontSize: 14, color: C.textBody, lineHeight: 1.45, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } }, h.snip)'''
edit('result hierarchy',old,new)
edit('result targets','var rowStyle = { display: "block", padding: "10px 14px",','var rowStyle = { display: "block", minHeight: 44, padding: "12px 14px",')
old='''        return React.createElement("button", { key: i, type: "button", onClick: function() { if (h.act === "wi-work-support") { openWisconsinGuide(); } else openExperienceTool(h.tab); setSearchQ(""); }, style: Object.assign({}, rowStyle, { width: "100%", minHeight: 44, textAlign: "left", background: "transparent", border: 0, borderBottom: rowStyle.borderBottom, font: "inherit" }) }, inner);'''
new='''        var resultId = "tops-home-search-result-" + (h.id || h.tab || h.act);
        return React.createElement("button", { key: resultId, id: resultId, type: "button", onClick: function() { openHomeSearchResult(h, resultId); }, style: Object.assign({}, rowStyle, { width: "100%", minHeight: 44, textAlign: "left", background: "transparent", border: 0, borderBottom: rowStyle.borderBottom, font: "inherit" }) }, inner);'''
edit('result action',old,new)
# EDIT 5: Reuse one existing reminder Back control for search origin, not a competing header.
old='''          React.createElement("button", { type: "button", style: actionStyle, onClick: function() { continuationReturn.current = reminderTimedOnly ? "tops-home-reminder-count" : continuationReturn.current || "tops-home-actions-title"; setActiveTab("dashboard"); } }, "Back to Home"),'''
new='''          homeSearchSelection && homeSearchSelection.tab === "reminders" ? searchReturnControl() : React.createElement("button", { type: "button", style: actionStyle, onClick: function() { continuationReturn.current = reminderTimedOnly ? "tops-home-reminder-count" : continuationReturn.current || "tops-home-actions-title"; setActiveTab("dashboard"); } }, "Back to Home"),'''
edit('reminder search return',old,new)
edit('all reminder exits search','''onClick: function() { setReminderTimedOnly(false); setFocusedReminderId(null); continuationFocus.current = "tops-reminder-" + r.id;''','''onClick: function() { setHomeSearchSelection(null); continuationReturn.current = null; setReminderTimedOnly(false); setFocusedReminderId(null); continuationFocus.current = "tops-reminder-" + r.id;''')
# EDIT 6: Preserve selected critical identity even when existing date/profile gates prevent opening.
edit('critical selected context','''    var windows = filterCriticalWindows(userStatus);
    var pushNudge''','''    var windows = filterCriticalWindows(userStatus);
    var searchWindow = homeSearchSelection && homeSearchSelection.tab === "critical" ? homeSearchSelection : null;
    var searchWindowAvailable = searchWindow && windows.some(function(item) { return item.id === searchWindow.id; });
    var searchWindowGate = searchWindow && (!searchWindowAvailable || daysOut === null) && React.createElement("section", { style: { marginBottom: 16 } }, searchReturnControl(),
      React.createElement("h2", { id: "tops-search-critical-context", tabIndex: -1, style: { fontSize: 22, lineHeight: 1.35, color: C.textPrimary } }, searchWindow.title),
      React.createElement("p", { role: "status", style: { fontSize: 14, lineHeight: 1.5 } }, !searchWindowAvailable ? "This window is not shown for your selected service profile. Your profile has not changed." : "Add your separation date below to see this window's timing. Your search is kept."));
    var pushNudge''')
edit('critical no-date context','''    if (daysOut === null) {
      return React.createElement("div", null,
        React.createElement("div", {style:{...S.card''','''    if (daysOut === null) {
      return React.createElement("div", null, searchWindowGate,
        React.createElement("div", {style:{...S.card''')
edit('critical profile context','''    return React.createElement("div", null, pushNudge,
      React.createElement("div", {style:{background:"linear-gradient''','''    return React.createElement("div", null, searchWindowGate, pushNudge,
      React.createElement("div", {style:{background:"linear-gradient''')
# EDIT 7: Focus/open exact critical card without bypassing existing profile/status/filter logic.
edit('critical selected row','''        return React.createElement("div", {key:w.id, style:{background:C.bgCard''','''        return React.createElement("div", {key:w.id, "data-search-selected": searchWindow && searchWindow.id === w.id ? "true" : undefined, style:{background:C.bgCard''')
edit('critical return near selected card','''          React.createElement("button", {"aria-expanded":isExpanded, "aria-controls":"tops-window-detail-" + w.id,''','''          searchWindow && searchWindow.id === w.id && React.createElement("div", { style: { padding: "14px 16px 0" } }, searchReturnControl()),
          React.createElement("button", {"aria-expanded":isExpanded, "aria-controls":"tops-window-detail-" + w.id,''')
edit('critical title focus','''React.createElement("div", {style:{fontFamily:"'Oswald',sans-serif", fontSize:14, letterSpacing:2, color:C.textPrimary, fontWeight:700}}, w.name),''','''React.createElement("span", {id:"tops-window-title-" + w.id, tabIndex:-1, style:{display:"block", fontFamily:"'Oswald',sans-serif", fontSize:14, letterSpacing:2, color:C.textPrimary, fontWeight:700}}, w.name),''')
# EDIT 8: Scroll the selected card from its Back control while focusing its exact title.
edit('selected card scroll','''      var wiDetail = currentId === "tops-wi-work-support-resources-heading" && target.closest("details");
      (wiDetail || jobsHeading || target).scrollIntoView({ block: wiDetail || jobsHeading || ["tops-my-jobs-heading", "tops-plan-timeline", "tops-loop-title"].includes(currentId) ? "start" : "center" });''','''      var wiDetail = currentId === "tops-wi-work-support-resources-heading" && target.closest("details");
      var searchCard = currentId.indexOf("tops-window-title-") === 0 && target.closest('[data-search-selected="true"]');
      (searchCard || wiDetail || jobsHeading || target).scrollIntoView({ block: searchCard || wiDetail || jobsHeading || ["tops-my-jobs-heading", "tops-plan-timeline", "tops-loop-title"].includes(currentId) ? "start" : "center" });''')
p.write_text(src)
# EDIT 9: Public app bytes require forward cache version; no worker behavior change.
w=root/'pwa-sw.js';s=w.read_text();assert s.count('tops-v285')==1;s=s.replace('tops-v285','tops-v286');assert s.count('tops-v286')==1;w.write_text(s)
out=Path('/tmp/home-search-edit-counts.json');out.write_text(json.dumps(edits,indent=2));print(json.dumps([{k:v for k,v in e.items() if k not in ['old','new']} for e in edits],indent=2));print('cache286 exact one replacement')
