from pathlib import Path
import shutil,json
root=Path('/tmp/tops-federal-resume-readiness')
e=root/'scratchpad/federal-hosted-7c79057'
def edit(path,old,new,label):
 p=root/path; s=p.read_text()
 print(label,'old expect 1 actual',s.count(old),flush=True)
 assert s.count(old)==1 and s.count(new)==0
 s=s.replace(old,new)
 assert s.count(old)==new.count(old) and s.count(new)==1
 p.write_text(s); print(label,'post-count PASS')
# V1-A: new hosted acceptance evidence; no runtime edit.
p=e/'acceptance.md'; assert not p.exists()
p.write_text('''# Federal hosted verification - 7c79057

Date: 2026-09-07. This is a single bounded fictional run on the exact ready veteranbridge-tools deploy 6a9f25af9495300009430de3, commit 7c79057801f7430c082fdc8009ded1fe307ba76b, tree 0f83c5c3f20f81effbc0678bbf856ee93919a4b7. Immutable URL: https://6a9f25af9495300009430de3--veteranbridge-tools.netlify.app/. Context deploy-preview; published_at null. The deployment record contains the verified Resume function digest. GitHub PR #59 remains open into ops/openai-parallel-clone; no merge was performed.

Result: hosted fact extraction, federal draft release, visible claim trace, desktop download and Word-compatible rendering PASS for this fixture. This is not blanket production acceptance. Two score dimensions truthfully require member facts; actual provider count, phone, manual assistive-technology and production release remain unverified or pending.

| Measure | Prior 349770c run | Current 7c79057 run |
| --- | --- | --- |
| Fact transport | 200, 7068 ms | 200, 6866 ms |
| Expected fact lines / unresolved warnings | 49/49, zero | 49/49, zero |
| Draft transport | 422, 15939 ms | 200, 15423 ms |
| Returned scorecard | 8 PASS / 1 FAIL / 1 NEEDS MEMBER FACT | 8 PASS / 0 FAIL / 2 NEEDS MEMBER FACT |
| Candidate release | Withheld | Released; independently inspected |
| Claim trace | Withheld | 30/30 references checked against the owning facts |
| Federal artifact | No export | One download; full content preserved in two rendered pages |
| Console errors | Zero | Zero, including after download |
| Browser activations | One facts, one draft | One facts, one draft, one export |
| Browser retries | Zero | Zero |
| Actual provider calls | UNVERIFIED | UNVERIFIED; no provider telemetry available through the enabled read connector |

| Dimension | Returned result | Verification |
| --- | --- | --- |
| Grounding and claim trace | PASS | Summary names the exact owning roles; all 30 trace entries checked |
| Exact identity preservation | PASS | Six titles/employers/locations/date ranges, three education entries and two certifications remain exact |
| Role separation | PASS | Twelve duties retained under six distinct owning roles |
| Date completeness | PASS | All six confirmed date ranges retained |
| Quantified impact | PASS | 12 teams, 8 sites and 6 teams retained only under their owning roles |
| Job posting alignment | NEEDS MEMBER FACT | Workday certification and explaining work-order status remain gaps; neither invented in the draft |
| Military jargon translation | PASS | Civilian-readable supplied activities retained |
| Filler | PASS | No unsupported summary inflation, causal additions, instructions, TIP or gaps inserted into the resume |
| Length and readability | PASS | Concise role entries; actual renderer text equals the full visible candidate |
| Format compliance | NEEDS MEMBER FACT | Unprovided contact, citizenship, preference, hours and supervisor fields remain unfilled |

The draft's two-sentence summary explicitly names Operations Lead at North Test Depot and Planning Analyst at East Test Office. Its activities are supported by the exact facts for those roles. Each experience entry repeats its two independently supplied duties without adding purpose, causal links or outcomes. The posting is used for supported targeting only. No citizenship, preference, salary, hours, supervisor, series or grade value is invented. Missing fields are not treated as confirmed facts. The two NEEDS MEMBER FACT statuses are retained; the result is not described as ten PASS dimensions.

## Artifact evidence

The actual browser download is Federal_Resume_Draft.doc, 4571 bytes, declared application/msword by the exact deployed source. Its signature is UTF-8 BOM followed by HTML; it is not native DOCX or binary DOC. MIME declaration is source evidence, not captured transport metadata. artifact-verification.json contains the measured byte count and SHA-256 and is controlling if prose transcription differs.

The unmodified download opened in bundled LibreOfficeDev 26.8.0.0.alpha0 through Writer/Web and rendered to two A4 PDF pages. All downloaded paragraph text exactly matches the visible released draft. All renderer-extracted text matches the download after whitespace-only layout normalization. All six role blocks stay intact on a single page: roles 1-5 on page 1; role 6, education and certifications on page 2. Both page images were inspected: no clipping, overlap, hidden content, orphaned role structure or content loss. Page 2 ends visibly with Synthetic Scheduling Certificate. This is Word-compatible renderer evidence; Microsoft Word itself and Dean's phone have not yet been tested for this artifact.

A first local render command used an absent /Applications LibreOffice path and exited 127. The existing bundled renderer succeeded without changing the file. The optional pdftotext command was also unavailable; bundled pdfplumber supplied full text extraction. Neither was a hosted retry, model retry or artifact change. The original render failure and successful output are preserved.

## Scope and remaining acceptance

No application, prompt, validator, policy, cache, dependency, skill or deployment configuration changed in this verification cycle. All shipped source remains the tested 7c79057 version. The previous five local suites and package checks at that commit remain valid; only evidence and handoff files change here. One subsequent documentation commit does not retroactively change the immutable deployment identity recorded above.

RDM-258 independent federal execution: observed. RDM-259 browser activations and no-retry boundary: observed; actual provider count and optional repair usage UNVERIFIED. RDM-260 identities, ownership, trace and quantities: observed; returned dimensions remain 8 PASS and 2 NEEDS MEMBER FACT. RDM-261 missing-field truth: observed. RDM-262 desktop Word-compatible artifact: PASS. RDM-263 no replay and no runtime/production change: observed. No full-matrix promotion or PENDING skill promotion is claimed.

Dean was asked to AirDrop the newly downloaded file from Downloads to his phone and check all six roles plus the final certification. Phone answer remains PENDING. This requires no additional generation. The separate Safari/VoiceOver, Chrome/NVDA, Edge/JAWS and Android Chrome/TalkBack matrix remains pending; local automation does not clear it. Production release and merge remain Dean's. No agent push, merge, live send, notification or production publication occurred.
''')
# V1-B: prepend current result, retaining the full historical handoff.
old='# Federal Resume readiness - iteration 10; fresh hosted test pending\n'
new='''# Federal Resume readiness - desktop hosted draft and artifact verified

The pushed 7c79057 immutable preview released the federal draft: 8 PASS, zero FAIL and 2 honest NEEDS MEMBER FACT dimensions. All six roles, twelve duties, exact identities and quantities, and all 30 claim references were checked. One actual federal Word download opened and rendered across two pages with complete content and intact roles. See [acceptance evidence](federal-hosted-7c79057/acceptance.md).

The file is HTML-backed Federal_Resume_Draft.doc; the civilian native DOCX remains a separate, unchanged path. No source change is needed from this successful desktop run. One facts activation, one draft activation and one export; zero retries and console errors. Actual provider call count remains UNVERIFIED.

Next is Dean's phone check using the already downloaded file, with no new generation. Phone/manual assistive-technology and production acceptance remain pending. PR #59 is open into ops/openai-parallel-clone; Dean owns merge and release. No skill or production acceptance is promoted by this partial matrix. Nothing pushed or merged by the agent.

## Historical iteration 10 handoff
'''
edit('scratchpad/federal-resume-readiness-handoff.md',old,new,'V1-B')
# V1-C: append a verification row; fix iteration count remains ten.
old='| 10 | Federal writer imposed prose expansion on sparse confirmed facts | resume.mjs; OpenAI regression; hosted/iteration evidence | Actual writer minimum-expansion directives 2 -> 0; 2 brief releases and 4 simulated withholds preserved; live effectiveness pending | LOCAL PASS; five final suites and packaging pass; hosted/manual pending |'
new=old+'\n| V1 (verification only) | Verify pushed iteration 10 on one immutable preview | Hosted evidence; handoff/log only | Federal draft HTTP 422 -> 200; failed dimensions 1 -> 0; 30/30 claim references checked; one download renders completely in two pages | DESKTOP HOSTED/ARTIFACT PASS; 2 NEEDS MEMBER FACT; provider count unverified; phone/manual/production pending |'
edit('scratchpad/federal-resume-readiness-log.md',old,new,'V1-C')
for source in sorted(Path('/tmp/tops-federal-evidence').glob('hosted-7c79057-*')):
 if source.is_file() and source.name!='hosted-7c79057-record-edits.txt':
  target=e/source.name; assert not target.exists(); shutil.copyfile(source,target)
print('PASS V1 record edits; no runtime change')
