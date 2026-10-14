from pathlib import Path
p=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops/index.html');s=p.read_text()
# EDIT 10: Keep the secondary control at its own44px height beside the search/query block.
o='''        React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 } },
          homeSearchSelection'''
n='''        React.createElement("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 10, marginBottom: 20 } },
          homeSearchSelection'''
assert s.count(o)==1;s=s.replace(o,n);assert s.count(n)==1 and s.count(o)==0;p.write_text(s);print('Edit10 old0/new1PASS')
# EDIT11: Keep each search result's focus ring inside its clipped results container.
o='var rowStyle = { display: "block", minHeight: 44, padding: "12px 14px",';n='var rowStyle = { display: "block", minHeight: 44, outlineOffset: -3, padding: "12px 14px",';assert s.count(o)==1;s=s.replace(o,n);assert s.count(n)==1 and s.count(o)==0;p.write_text(s);print('Edit11 old0/new1PASS')
