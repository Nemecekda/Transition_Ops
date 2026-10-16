from pathlib import Path
p=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops/scripts/readiness-tool-return-browser-regression.js')
s=p.read_text()
# Adapt the old hidden-picker step to the actual visible return. The stale Readiness link assertion remains unchanged.
old='await ev(\'(()=>{const n=document.getElementById("tops-resource-topic");n.value="healthcare";n.dispatchEvent(new Event("change",{bubbles:true}))})()\');assert.equal(await ev(\'!!document.getElementById("tops-readiness-return")\'),false);await load();'
new='await click("Back to Healthcare");await wait(\'document.getElementById("tops-resource-topic")?.value==="healthcare"\');assert.equal(await ev(\'!!document.getElementById("tops-readiness-return")\'),false);await load();'
print('CALLER TEST OLD:',old,'NEW:',new);assert s.count(old)==1 and s.count(new)==0;p.write_text(s.replace(old,new));s=p.read_text();print('new expect1/actual',s.count(new),'old expect0/actual',s.count(old));assert s.count(new)==1 and s.count(old)==0
