from pathlib import Path
import subprocess, re, hashlib
base = subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip()
assert base.startswith('5ee0047')
old = subprocess.check_output(['git', 'show', base + ':netlify/functions/resume.mjs'], text=True)
new = Path('netlify/functions/resume.mjs').read_text()
pattern = r'^  function factCatalog\(facts\) \{[\s\S]*?^  \}\n'
a, b = re.findall(pattern, old, re.M), re.findall(pattern, new, re.M)
assert len(a) == len(b) == 1
assert old.replace(a[0], b[0]) == new, 'Change outside catalog'
for fragment in ['const linkedRoles = roleBlocks.map', 'return hasExactBoundaryOccurrence(block, item)']:
    assert next(line for line in a[0].splitlines() if fragment in line) == next(line for line in b[0].splitlines() if fragment in line)
print('PASS runtime changes confined to catalog field state and MISSING exclusion; exact ownership matching unchanged')
for file in ['index.html', 'netlify/functions/navigator.mjs', 'netlify/functions/_shared/openai-client.cjs', 'netlify/functions/_shared/openai-budget.cjs', 'package.json', 'package-lock.json', 'netlify.toml', 'pwa-sw.js', 'sw.js', 'scripts/resume-docx-render-regression.js']:
    data = Path(file).read_bytes()
    assert data == subprocess.check_output(['git', 'show', base + ':' + file])
    print('UNCHANGED ' + file + ' sha256=' + hashlib.sha256(data).hexdigest())
print('PASS extraction gate, generation prompts, formatting/export, models, caps, retries, privacy and precached assets unchanged; cache v152 retained')
