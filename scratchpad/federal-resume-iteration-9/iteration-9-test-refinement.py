from pathlib import Path

path = Path('/tmp/tops-federal-resume-readiness/scripts/openai-migration-regression.js')
# EDIT 9E: isolate an empty-item grammar defect; an unknown numeric label exercises the separate numeric guard first.
old = '        hosted.fact_sheet.replace("EDUCATION ITEM 1 (EXACT):", "UNLABELED ITEM 1 (EXACT):"),'
new = '        hosted.fact_sheet.replace("EDUCATION ITEM 1 (EXACT): Master of Public Administration, Example Graduate University, 2018.", "EDUCATION ITEM 1 (EXACT): "),'
src = path.read_text()
print('EDIT 9E old expect 1 actual', src.count(old))
assert src.count(old) == 1 and src.count(new) == 0
src = src.replace(old, new)
assert src.count(old) == 0 and src.count(new) == 1
path.write_text(src)
print('EDIT 9E old 0 new 1')
