from pathlib import Path
import json
p=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops/index.html');s=p.read_text();edits=[]
def one(label,o,n):
 global s
 assert s.count(o)==1,(label,s.count(o));s=s.replace(o,n);assert s.count(n)==1 and s.count(o)==0;edits.append({'edit':label,'old':o,'new':n,'old_after':0,'new_after':1});p.write_text(s)
# EDIT12: Only end search-return intent for search-origin All reminders; preserve older Home callers.
one('scope All reminders exit','setHomeSearchSelection(null); continuationReturn.current = null; setReminderTimedOnly(false); setFocusedReminderId(null);','if (homeSearchSelection) { setHomeSearchSelection(null); continuationReturn.current = null; } setReminderTimedOnly(false); setFocusedReminderId(null);')
# EDIT13: Exact critical focus belongs to its native disclosure button, retaining aria-expanded and Enter/Space.
one('window button focus','React.createElement("button", {"aria-expanded":isExpanded, "aria-controls":"tops-window-detail-" + w.id,','React.createElement("button", {id:"tops-window-title-" + w.id, "aria-expanded":isExpanded, "aria-controls":"tops-window-detail-" + w.id,')
one('remove nested focus','React.createElement("span", {id:"tops-window-title-" + w.id, tabIndex:-1, style:{display:"block",','React.createElement("span", {style:{display:"block",')
# EDIT14: Choosing a broader filter intentionally ends exact-search context without discarding the query.
one('manual critical browse exit','onClick:function(){ setCriticalFilter(f); }','onClick:function(){ if (homeSearchSelection) { setHomeSearchSelection(null); continuationReturn.current = null; } setCriticalFilter(f); }')
Path('/tmp/search-navigation-fix-counts.json').write_text(json.dumps(edits,indent=2));print(json.dumps(edits,indent=2))
