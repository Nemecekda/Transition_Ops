from pathlib import Path
import shutil
root=Path('/tmp/tops-federal-resume-readiness')
def edit(relative,old,new,label):
    p=root/relative
    src=p.read_text()
    print(label,'old expect 1 actual',src.count(old),flush=True)
    assert src.count(old)==1 and src.count(new)==0
    src=src.replace(old,new)
    assert src.count(old)==new.count(old) and src.count(new)==1
    p.write_text(src)
    print(label,'post-count PASS')
edit('scratchpad/federal-resume-iteration-10/readiness.md',
'Actual Netlify function packaging must pass with the existing locked dependencies.',
'All five final suites PASS. Actual LibreOffice rendering PASS. Actual Netlify function packaging PASS: CLI 26.1.0, packager 14.7.1; Resume and Navigator resolve openai 7.8.0, @netlify/blobs 10.7.13, @netlify/otel 6.0.6 and @netlify/runtime-utils 2.3.0, with all four excluded from jobs. Local accessibility reports zero uncaught browser exceptions and zero external provider attempts.', 'EDIT 10J')
edit('scratchpad/federal-resume-readiness-log.md',
'| LOCAL PROMPT FIX; final validation in iteration-10 evidence; hosted/manual pending |',
'| LOCAL PASS; five final suites and packaging pass; hosted/manual pending |','EDIT 10K')
edit('scratchpad/federal-resume-readiness-handoff.md',
'These local checks do not prove the fresh model response will pass. See [iteration 10](federal-resume-iteration-10/readiness.md).',
'All five final local suites, Word rendering and function packaging pass. These local checks do not prove the fresh model response will pass. See [iteration 10](federal-resume-iteration-10/readiness.md).','EDIT 10L')
out=root/'scratchpad/federal-resume-iteration-10'
for p in sorted(Path('/tmp/tops-federal-evidence').glob('iteration-10-*')):
    if p.is_file():
        target=out/p.name
        assert not target.exists(), str(target)+' already exists'
        shutil.copyfile(p,target)
print('Copied existing iteration-10 evidence without replacing files')
