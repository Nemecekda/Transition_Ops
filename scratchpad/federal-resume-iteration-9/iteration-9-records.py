from pathlib import Path
import shutil

root = Path('/tmp/tops-federal-resume-readiness')
evidence = Path('/tmp/tops-federal-evidence')
out = root / 'scratchpad/federal-resume-iteration-9'
out.mkdir(exist_ok=True)
# EDIT 9F: preserve the reviewed scripts and each actual check, including failures.
for name in ['iteration-9-edit.py','iteration-9-test-refinement.py','iteration-9-scope.cjs','iteration-9-baseline-openai.txt','iteration-9-baseline-openai-final.txt','iteration-9-openai.txt','iteration-9-openai-final.txt','iteration-9-sw.txt','iteration-9-spend.txt','iteration-9-package.txt','iteration-9-privacy.txt','iteration-9-accessibility.txt','iteration-9-scope.txt']:
    assert not (out / name).exists(), name
    shutil.copyfile(evidence / name, out / name)

def edit(path, old, new, label):
    src = path.read_text()
    print(label, 'old expect 1 actual', src.count(old))
    assert src.count(old) == 1 and src.count(new) == 0
    src = src.replace(old, new)
    assert src.count(new) == 1 and src.count(old) == new.count(old)
    path.write_text(src)
    print(label, 'post-count PASS')

# EDIT 9G: add the measured iteration row without altering historical verdicts.
old = '\n\nIteration 1 validation:'
new = '\n| 9 | Provider returned bare education/certification section labels rejected by the closed parser | resume.mjs; OpenAI regression; hosted/iteration evidence | Warning-free provider header cases 0/16 -> 16/16; 36 negative handler checks retained; five local suites and packaging pass | LOCAL PASS; fresh hosted/manual acceptance pending |\n\nIteration 1 validation:'
edit(root / 'scratchpad/federal-resume-readiness-log.md', old, new, 'EDIT 9G')

# EDIT 9H: prepend current handoff while preserving historical reports verbatim.
old = '# Federal Resume readiness - iteration 8 locally complete; hosted acceptance pending\n'
new = '''# Federal Resume readiness - iteration 9 locally complete; fresh hosted test pending

Dean pushed 964a93e. Its immutable preview preserved all tested fact payloads but returned bare EDUCATION and CERTIFICATIONS headings. The UI showed two structural warnings; one draft activation confirmed HTTP 400 before generation. No retries or exports followed. This attempt did not exercise the previous hyphen repair's hosted drafting behavior. See [failed hosted evidence](federal-hosted-964a93e/acceptance.md).

Iteration 9 standardizes only those provider-output labels when the whole fact sheet then passes the unchanged parser. Warning-free replay cases improved from 0/16 to 16/16; all 36 negative handler checks remain blocked. Initial extraction avoids a redundant repair call for these aliases. All five local suites, actual Word rendering and function packaging passed. See [iteration 9](federal-resume-iteration-9/readiness.md).

Next: Dean pushes codex/federal-resume-readiness to PR #59, base ops/openai-parallel-clone. Verify the fresh immutable deploy and perform one bounded fictional acceptance. Stop at unresolved fact warnings; exact payload fidelity alone is insufficient. Full federal drafting, downloadable federal artifact, phone/manual accessibility and production acceptance remain pending. Nothing pushed or merged by the agent; no skill addition, public wording or cache change.

The sections below are historical handoffs, retained verbatim.

## Historical iteration 8 handoff
'''
edit(root / 'scratchpad/federal-resume-readiness-handoff.md', old, new, 'EDIT 9H')
