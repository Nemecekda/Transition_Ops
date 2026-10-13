from pathlib import Path
r=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops')
p=r/'index.html';s=p.read_text()
# EDIT 13: the Resources menu entry must open its directory, not retain focused Documents.
a='onClick: function() { primaryNavFocus.current = true; setActiveTab(m.id); setShowMoreMenu(false); }'
b='onClick: function() { if (m.id === "resources") { openExperienceTool("resources"); return; } primaryNavFocus.current = true; setActiveTab(m.id); setShowMoreMenu(false); }'
print('EDIT13 OLD',a,'NEW',b);assert s.count(a)==1;s=s.replace(a,b);assert s.count(a)==0;assert s.count(b)==1;p.write_text(s);print('expected new1 old0; actual new1 old0')
# Test-only buffer and actual existing menu label, no weaker assertions.
p=r/'scripts/document-checklist-browser-regression.js';s=p.read_text();a="{cwd:root,encoding:'utf8'}";b="{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024}";assert s.count(a)==1;s=s.replace(a,b)
a='n.textContent==="Resources"';b='n.textContent.includes("RESOURCES")';assert s.count(a)==1;s=s.replace(a,b);p.write_text(s)
