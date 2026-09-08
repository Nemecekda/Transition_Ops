from pathlib import Path
import json
p=Path(__file__).resolve().parents[2]/'scripts/privacy-network-regression.js'
s=p.read_text();log=[]
def edit(label,old,new):
 global s
 assert s.count(old)==1,(label,s.count(old));assert new not in s
 s=s.replace(old,new);assert s.count(new)==1 and s.count(old)==new.count(old)
 p.write_text(s);log.append({'edit':label,'old_before':1,'new_after':1,'old_after':s.count(old)});print(log[-1])
# Test seam for the authorized new release note; keeps historical note/context assertions.
edit('version matches newest note helper','  const historyStatus = "Release notes describe the app at the time shown. Current status:";','''  function releaseVersionMatchesNotes(text) {
    const declarations = Array.from(text.matchAll(/const APP_VERSION = "(v\\d+)";/g));
    const firstNote = /const WHATS_NEW = \\[\\s*\\{ v: "(v\\d+)"/.exec(text);
    return declarations.length === 1 && !!firstNote && declarations[0][1] === firstNote[1];
  }
  check(!releaseVersionMatchesNotes(index.replace(/const APP_VERSION = "v\\d+";/, 'const APP_VERSION = "v0";')),
    "POFF-04 mismatched release-note version mutation fails");
  const historyStatus = "Release notes describe the app at the time shown. Current status:";''')
edit('replace obsolete v96 pin','      countMatches(index, /const APP_VERSION = "v96";/) === 1 &&','      releaseVersionMatchesNotes(index) &&')
(Path(__file__).parent/'version-test-edit.json').write_text(json.dumps(log,indent=2)+'\n')
