from pathlib import Path
import hashlib, subprocess

base = subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip()
assert base == 'fbf099617f5388e6100b83cace29841b6ba99071'
path = 'netlify/functions/resume.mjs'
old = subprocess.check_output(['git', 'show', base + ':' + path], text=True)
new = Path(path).read_text()
old_line = '    const blockers = audit.blockers.concat(semanticBlockers).map(function (code) { return AUDIT_BLOCKER_MESSAGES[code]; });'
new_lines = '''    const blockers = audit.blockers.map(function (code) { return (code === "posting_only_claim" ? "[audit_posting_only_claim] " : "") + AUDIT_BLOCKER_MESSAGES[code]; });
    semanticBlockers.forEach(function (code) { blockers.push("[posting_reference_mismatch] " + AUDIT_BLOCKER_MESSAGES[code]); });'''
assert old.count(old_line) == new.count(new_lines) == 1
assert old.replace(old_line, new_lines) == new, 'Change outside blocker presentation'
print('PASS full runtime byte comparison: only the two fixed diagnostic prefixes and separate blocker mapping changed')
print('PASS release predicates, scorecard, semantic matcher, audit schema, all generation/extraction prompts and handler call graph byte-identical')
for path in ['index.html', 'netlify/functions/navigator.mjs', 'netlify/functions/_shared/openai-client.cjs', 'netlify/functions/_shared/openai-budget.cjs', 'package.json', 'package-lock.json', 'netlify.toml', 'pwa-sw.js', 'sw.js', 'scripts/resume-docx-render-regression.js']:
    data = Path(path).read_bytes()
    assert data == subprocess.check_output(['git', 'show', base + ':' + path])
    print('UNCHANGED ' + path + ' sha256=' + hashlib.sha256(data).hexdigest())
print('PASS no new response property, provider request, log, storage, UI transport diagnostic field, dependency, cache or policy change')
