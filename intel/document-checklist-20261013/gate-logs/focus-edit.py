from pathlib import Path
p=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops/index.html');s=p.read_text()
# EDIT 11: keep workplace information on other resource topics, not inside the checklist task.
a='''), activeTab === "resources" && /*#__PURE__*/React.createElement("div", null,
  React.createElement("details", { style: { marginBottom: 14 } },'''
b=a.replace('  React.createElement("details"','  subTab !== "documents" && React.createElement("details"')
# EDIT 12: all other topics remain reachable from All tools/Resources; remove category selection from checklist.
c='''  React.createElement("div", { style: { marginBottom: 16 } },
    React.createElement("label", { htmlFor: "tops-resource-topic"'''
d=c.replace('  React.createElement("div"','  subTab !== "documents" && React.createElement("div"',1)
for number,old,new in [(11,a,b),(12,c,d)]:
 print('EDIT',number,'OLD',old,'NEW',new);assert s.count(old)==1;s=s.replace(old,new);assert s.count(new)==1;assert s.count(old)==0;p.write_text(s);print('new expected1 actual1; old expected0 actual0')
