from pathlib import Path
r=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops');p=r/'index.html';s=p.read_text()
# EDIT15: the Documents topic selection unmounts the select, so move keyboard focus into its destination.
a='id: "tops-resource-topic", value: subTab, onChange: function(event) { setSubTab(event.target.value); }'
b='id: "tops-resource-topic", value: subTab, onChange: function(event) { if (event.target.value === "documents") continuationFocus.current = "tops-plan-documents"; setSubTab(event.target.value); }'
print('EDIT15 OLD',a,'NEW',b);assert s.count(a)==1;s=s.replace(a,b);assert s.count(a)==0;assert s.count(b)==1;p.write_text(s);print('new expected1 actual1 old expected0 actual0')
# Focused regression: use this actual alternate entry and assert focus after picker removal.
p=r/'scripts/document-checklist-browser-regression.js';s=p.read_text()
a='textContent\'),\'Resources and support\');await nav("My Plan");await click("tops-plan-shortcut-resources");await frames();'
b='''textContent'),'Resources and support');await ev('(()=>{const n=document.getElementById("tops-resource-topic");n.focus();n.value="documents";n.dispatchEvent(new Event("change",{bubbles:true}))})()');await wait('document.activeElement?.id==="tops-plan-documents"');assert.equal(await ev('!!document.getElementById("tops-resource-topic")'),false);await frames();'''
print('TEST alternate entry OLD',a,'NEW',b);assert s.count(a)==1;s=s.replace(a,b);assert s.count(b)==1;p.write_text(s)
