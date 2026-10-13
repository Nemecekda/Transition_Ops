from pathlib import Path
root=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops')
p=root/'scripts/document-checklist-browser-regression.js';s=p.read_text()
# Test route fixtures reflect the explicit focused checklist surface, not a removed topic selector.
old='await ev(\'(()=>{const n=document.getElementById("tops-resource-topic");n.value="documents";n.dispatchEvent(new Event("change",{bubbles:true}))})()\')'
new='await nav("My Plan");await click("tops-plan-shortcut-resources")'
print('TEST fixture old expected3 actual',s.count(old));assert s.count(old)==3;s=s.replace(old,new);assert old not in s
old='n.textContent==="Replace my plan"';new='n.textContent==="Replace with this backup"';assert s.count(old)==1;s=s.replace(old,new)
old='await ev(\'(()=>{const n=document.getElementById("tops-resource-topic");n.value="directory";n.dispatchEvent(new Event("change",{bubbles:true}))})()\')'
new='await text("All tools");await ev(\'Array.from(document.querySelectorAll("button.tops-more-tool")).find(n=>n.textContent==="Resources").click()\')'
assert s.count(old)==1;s=s.replace(old,new);p.write_text(s);print('route edits PASS')
# Existing source guard continues to test all VGLI content; assertions now use native checked state.
p=root/'scripts/vgli-document-browser-regression.js';s=p.read_text()
old='document.getElementById("tops-document-d8").textContent.includes("✓")';new='document.getElementById("tops-document-check-d8").checked';assert s.count(old)==2;s=s.replace(old,new)
old='document.getElementById("tops-document-d8").click()';new='document.getElementById("tops-document-check-d8").click()';assert s.count(old)==1;s=s.replace(old,new);p.write_text(s);print('VGLI checked expected2 actual',s.count('tops-document-check-d8"'))
