from pathlib import Path
import hashlib,re
p=Path('/tmp/tops-federal-resume-readiness/netlify/functions/resume.mjs')
old='Use only nonnumeric confirmed activities, skills, or credentials; attribute role-specific activities to their exact role title or employer.'
new='Use only confirmed activities, skills, or credentials; attribute role-specific activities to their exact role title or employer.'
s=p.read_text()
print('EDIT 10F old expect 1 actual',s.count(old),flush=True)
assert s.count(old)==1 and s.count(new)==0
s=s.replace(old,new)
assert s.count(old)==0 and s.count(new)==1
p.write_text(s)
print('EDIT 10F post-count PASS; existing attributed-quantity rule retained')
q=Path('/tmp/tops-federal-resume-readiness/scripts/openai-migration-regression.js')
src=q.read_text()
oldhash='a432fff4e824b51d34e805c946ca15efdc987cdaeb3c6381c211c34eba22b7bf'
newhash=hashlib.sha256(re.search(r'const systemFederal = `([\s\S]*?)`;',s).group(1).encode()).hexdigest()
print('EDIT 10G old expect 1 actual',src.count(oldhash),flush=True)
assert src.count(oldhash)==1 and src.count(newhash)==0
src=src.replace(oldhash,newhash)
assert src.count(oldhash)==0 and src.count(newhash)==1
q.write_text(src)
print('EDIT 10G post-count PASS; final prompt sha256='+newhash)
