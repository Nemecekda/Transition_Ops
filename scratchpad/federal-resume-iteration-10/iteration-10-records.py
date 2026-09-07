from pathlib import Path
root=Path('/tmp/tops-federal-resume-readiness')
def create(relative,text):
    p=root/relative
    assert not p.exists(), str(p)+' already exists'
    p.write_text(text)
    print('CREATED',relative)
def edit(relative,old,new,label):
    p=root/relative
    s=p.read_text()
    print(label,'old expect 1 actual',s.count(old),flush=True)
    assert s.count(old)==1 and s.count(new)==0
    s=s.replace(old,new)
    assert s.count(new)==1 and s.count(old)==new.count(old)
    p.write_text(s)
    print(label,'post-count PASS')
create('scratchpad/federal-hosted-349770c/acceptance.md', '''# Hosted federal acceptance - 349770c - FAILED, stopped

Date: 2026-09-07. One fresh fictional acceptance on veteranbridge-tools, immutable deploy 6a9f216e813d160008626f7b, commit 349770c3a3d2226621cd7215757ac05c580fc50f, tree aaf6fe0920f03fc98c5b29c414051792196fef8e. Context deploy-preview; published_at null. deployment.json records the independently checked identity and Resume function digest. PR #59 was still open and unmerged when checked; its base remained ops/openai-parallel-clone at 7948cac. PR #46 was also open. Dean's reported merge was not established by GitHub evidence.

| Check | Observed result |
| --- | --- |
| Facts request | HTTP 200, 7068 ms; one browser request and one handler response |
| Fact fidelity | All 49 expected lines retained; six roles, twelve separate duties, three education entries, two certifications; owning roles visually checked |
| Fact structure | Canonical education/certification headers; zero warnings; no manual fact edits |
| Invention checks on facts | No posting-only Workday credential or inferred 26-year tenure |
| Draft request | HTTP 422, 15939 ms; one browser request and one handler response |
| Review result | Withheld: unsupported claims C1 and C5 reported; 8 PASS, 1 FAIL, 1 NEEDS MEMBER FACT |
| Posting-origin labels | Neither posting_reference_mismatch nor audit_posting_only_claim appeared in this response |
| Browser console errors | Zero observed |
| Released draft, trace, federal artifact | Not available; zero export attempts |
| Terminal | FAILED_STOPPED; no retries |
| Actual provider calls / structural repair usage | UNVERIFIED; browser counts are not provider telemetry |

| Review dimension | Returned status | Returned assessment, summarized |
| --- | --- | --- |
| Grounding and claim trace | FAIL | C1 and C5 contain unsupported assertions; all supplied claim IDs traced |
| Exact identity preservation | PASS | Confirmed titles, employers, locations and dates retained |
| Role separation | PASS | Experience claims retained within corresponding roles |
| Date completeness | PASS | Exact dates present for all six roles |
| Quantified impact | PASS | Role-specific quantities supported for applicable experience claims |
| Job posting alignment | PASS | Records, inventory, work orders and scheduling aligned |
| Military jargon translation | PASS | Civilian-readable terminology |
| Filler | PASS | No generic filler, advice, instructions or gaps section |
| Length and readability | PASS | Organized, concise role entries |
| Format compliance | NEEDS MEMBER FACT | Missing federal identity/contact, citizenship, preference, hours and supervisor fields remain unfilled |

The visible review reported that C1 included an unsupported Program Analyst candidate assertion and mixed-role summary claims, and that C5 added a causal relationship between inventory summaries and equipment records. It listed Workday certification as an unmet posting qualification. These are the review's assessments, not independent inspection of the withheld candidate. The exact draft and claim trace are not exposed on HTTP 422; the precise C1/C5 wording is UNVERIFIED. draft-result.json preserves the actual visible panel text and transport diagnostic. facts.json preserves only this fictional fixture and its fact sheet.

Fact extraction acceptance passed for this run. Federal draft acceptance failed and stopped. Absence of the two posting blocker labels does not retrospectively prove the exact cause of older failures, nor does it establish broader model reliability. No second draft, fact retry, withheld export, agent push, merge, production publication or live send followed. Federal artifact, phone/manual accessibility and production acceptance remain pending.
''')
create('scratchpad/federal-resume-iteration-10/readiness.md', '''# Iteration 10 - remove federal prose expansion quotas

Date: 2026-09-07. Parent 349770c3a3d2226621cd7215757ac05c580fc50f; branch codex/federal-resume-readiness. Dean's continuing approval covers related fixes without another approval unless a major skill is added. No skill was added. Application source was clean before this iteration; the new fictional hosted evidence was untracked.

Selected before editing: the federal writer demands 2-4 sentences or dense bullets per role and a 3-4 sentence summary even for sparse confirmed facts. The latest hosted review reported unsupported summary and causal assertions. Expected measurable movement: minimum-expansion directives in actual writer requests 2 -> 0, with short supported output allowed and simulated failed reviews still withheld. This is a concrete instruction defect consistent with the reported failure, not proof of the hidden historical claims or proof that the model will now succeed.

| Measure | Parent / baseline | Final local result |
| --- | --- | --- |
| Minimum prose-expansion directives in actual federal writer requests | 2 in every new fixture | 0 in every new fixture |
| Separate-fact/causality instruction | No explicit separate-fact rule | Explicitly disallows inferred purpose, sequence, causality and outcome |
| Summary instruction | Fixed 3-4 sentences | Supported length only; omission allowed; role-specific facts attributed; target title is not a held qualification |
| Short supported candidate handling, stubbed reviews | 2/2 HTTP 200 | 2/2 HTTP 200, released bytes unchanged |
| Simulated failed audit handling | 4/4 HTTP 422 | 4/4 HTTP 422, no draft/trace, failed scorecard retained |
| Calls per fixture | Generation + audit | Two stubbed calls; no added retries; federal writer 1900 tokens, gpt-5.6-terra, store:false |
| Generation quantity ownership | Existing exact role attribution rule | Byte-identical; attributed quantities still permitted |
| Hosted federal acceptance | 349770c failed, 8 PASS / 1 FAIL / 1 NEEDS MEMBER FACT | Pending on a fresh deployment |

The six new fixtures run the real handler with stubbed provider responses. They capture the actual writer request and compare the actual audit instructions with the previous exact instructions. Two positive fixtures release brief supported content; four simulated audit failures cover invented causality, a target presented as a qualification, an unsupported career-wide conclusion and a posting-only credential. They demonstrate that the gate respects those simulated review failures; they do not demonstrate that the hosted model will detect or avoid every such claim. The positive summary explicitly cites its confirmed global skill. Existing scoped-quantity tests remain in force.

Only two federal writer prompt lines change. The complete remaining Resume file is byte-identical to the parent, including extraction, audit, validators, scoring, formatting, errors, caps, models, retries and transport. A whole-file comparison proves that boundary. The final federal prompt SHA-256 is 1c2350dbb8ce1f5db98dbdc4afd19581020fd3087865fc42b209a872cee77d91; the identity assertion supplements the behavioral checks. Civilian Resume/DOCX, Navigator, public wording, policies/rungs, notifications, dependencies and Netlify configuration are unchanged. No precached file changed; cache remains transition-ops-v152.

## Fail-loud and validation record

The unmodified runtime baseline exercised all six fixtures, observed both quotas in every writer request, and deliberately failed the zero-quota assertion. iteration-10-baseline.txt preserves this failure. All edit pre-counts and post-counts passed. The positive summary fixture was refined to cite its actual global skill rather than the generic audit helper's default fact. Before final validation, the draft instruction was narrowed to preserve the existing permission for correctly attributed quantities; no extra numeric restriction shipped. Original and final outputs are retained.

Final required validation and structural evidence are recorded in the adjacent iteration-10-final-* logs, iteration-10-scope.txt and iteration-10-structural.txt. The OpenAI suite includes actual browser preflight and LibreOffice DOCX rendering; the other four required suites cover service worker/public-build privacy, browser privacy/network, runtime AI spending and browser accessibility. Actual Netlify function packaging must pass with the existing locked dependencies. Local provider responses are stubbed and local browser tests suppress external calls. These local checks do not replace hosted, phone or manual assistive-technology acceptance.

## Next acceptance and remaining blockers

PREVIEW WARRANTED: Dean pushes this local iteration on codex/federal-resume-readiness to PR #59, base ops/openai-parallel-clone. Verify its new immutable deployment before one fresh fictional acceptance. One facts activation; proceed to one draft activation only with exact, warning-free facts. At most the existing single structural repair and four provider calls; no retry seeking a PASS. Provider counts remain UNVERIFIED without telemetry. Stop on failure; never export a withheld draft.

BLOCKED-TECHNICAL: full hosted federal release remains unaccepted; exact withheld C1/C5 text is unavailable. This patch's live effectiveness, actual federal artifact and phone/manual accessibility are pending. No BLOCKED-POLICY item was introduced. No audit or release threshold was weakened. No agent push, main merge, deployment or major skill addition occurred. Dean owns merge and release.
''')
old='| 9 | Provider returned bare education/certification section labels rejected by the closed parser | resume.mjs; OpenAI regression; hosted/iteration evidence | Warning-free provider header cases 0/16 -> 16/16; 36 negative handler checks retained; five local suites and packaging pass | LOCAL PASS; fresh hosted/manual acceptance pending |'
new=old+'\n| 10 | Federal writer imposed prose expansion on sparse confirmed facts | resume.mjs; OpenAI regression; hosted/iteration evidence | Actual writer minimum-expansion directives 2 -> 0; 2 brief releases and 4 simulated withholds preserved; live effectiveness pending | LOCAL PROMPT FIX; final validation in iteration-10 evidence; hosted/manual pending |'
edit('scratchpad/federal-resume-readiness-log.md',old,new,'EDIT 10H')
old='# Federal Resume readiness - iteration 9 locally complete; fresh hosted test pending\n'
new='''# Federal Resume readiness - iteration 10; fresh hosted test pending

Dean's latest push is verified at 349770c, but GitHub still reported PR #59 open and unmerged. The fresh immutable preview passed warning-free fact extraction with all 49 expected lines. Federal drafting was withheld: its review returned 8 PASS, 1 FAIL and 1 NEEDS MEMBER FACT, reporting unsupported summary and causal assertions. No retry or export followed. See [hosted evidence](federal-hosted-349770c/acceptance.md).

Iteration 10 removes two fixed-length federal prose instructions and requires supported statements without inferred relationships or target-title qualifications. Actual writer request quotas improve from 2 to 0. Short supported candidates still release; simulated unsupported reviews still withhold. Audit instructions and all validators remain unchanged. These local checks do not prove the fresh model response will pass. See [iteration 10](federal-resume-iteration-10/readiness.md).

Next: Dean pushes codex/federal-resume-readiness to PR #59, base ops/openai-parallel-clone. Verify the new immutable deploy before one bounded fictional acceptance. Full federal release, federal artifact, phone/manual accessibility and production acceptance remain pending. No agent push, merge, new skill or cache change. The working civilian Resume/DOCX remains intact.

The sections below are historical handoffs, retained verbatim.

## Historical iteration 9 handoff
'''
edit('scratchpad/federal-resume-readiness-handoff.md',old,new,'EDIT 10I')
