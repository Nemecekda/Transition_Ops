from pathlib import Path
# EDIT 10 corrected quote boundary: preceding assertion wrote nothing to worker.
p=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops/pwa-sw.js')
old='const CACHE_NAME = "transition-ops-v288";'
new='const CACHE_NAME = "transition-ops-v289";'
s=p.read_text();print('EDIT10 OLD:',old,'NEW:',new);assert s.count(old)==1 and s.count(new)==0
p.write_text(s.replace(old,new));s=p.read_text();print('new expect1/actual',s.count(new),'old expect0/actual',s.count(old));assert s.count(new)==1 and s.count(old)==0
