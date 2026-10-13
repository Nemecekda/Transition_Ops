from pathlib import Path
p=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops/index.html');s=p.read_text()
# EDIT 14: show document task's return and heading together; keep existing heading focus.
a='''      var searchCard = currentId.indexOf("tops-window-title-") === 0 && target.closest('[data-search-selected="true"]');
      (searchCard || wiDetail || jobsHeading || target).scrollIntoView({ block: searchCard || wiDetail || jobsHeading || ["tops-my-jobs-heading", "tops-plan-timeline", "tops-loop-title"].includes(currentId) ? "start" : "center" });'''
b='''      var searchCard = currentId.indexOf("tops-window-title-") === 0 && target.closest('[data-search-selected="true"]');
      var documentChecklist = currentId === "tops-plan-documents" && document.getElementById("tops-document-checklist");
      (documentChecklist || searchCard || wiDetail || jobsHeading || target).scrollIntoView({ block: documentChecklist || searchCard || wiDetail || jobsHeading || ["tops-my-jobs-heading", "tops-plan-timeline", "tops-loop-title"].includes(currentId) ? "start" : "center" });'''
print('EDIT14 OLD',a,'NEW',b);assert s.count(a)==1;s=s.replace(a,b);assert s.count(a)==0;assert s.count(b)==1;p.write_text(s);print('expected new1 old0; actual new1 old0')
