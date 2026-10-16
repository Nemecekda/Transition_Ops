from pathlib import Path
repo=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops')
# EDIT 11: The fixed guide marker only identifies the actual Wisconsin directory surface.
p=repo/'index.html';s=p.read_text()
old='TOPS_DOCUMENT_RETURN_TOPICS.includes(subTab) ? wiGuideRequested.current ? "wisconsin" : subTab'
new='TOPS_DOCUMENT_RETURN_TOPICS.includes(subTab) ? subTab === "directory" && wiGuideRequested.current ? "wisconsin" : subTab'
print('EDIT11 OLD:',old,'NEW:',new);assert s.count(old)==1 and s.count(new)==0
p.write_text(s.replace(old,new));s=p.read_text();print('new expect1/actual',s.count(new),'old expect0/actual',s.count(old));assert s.count(new)==1 and s.count(old)==0
# Regression: selecting Healthcare after the Wisconsin guide must capture Healthcare, not the stale guide marker.
p=repo/'scripts/document-context-return-browser-regression.js';s=p.read_text()
old=" console.log('PASS: fixed Wisconsin guide origin returns to its expanded heading, including after reload.');"
new=""" console.log('PASS: fixed Wisconsin guide origin returns to its expanded heading, including after reload.');
 await topic('healthcare');await topic('documents');await expectDocs(topics.healthcare);await click('tops-documents-back');await expectTopic('healthcare');
 console.log('PASS: Wisconsin guide followed by Healthcare captures the actual Healthcare origin.');"""
assert s.count(old)==1 and s.count(new)==0;p.write_text(s.replace(old,new));assert p.read_text().count(new)==1
