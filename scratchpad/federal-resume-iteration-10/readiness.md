# Iteration 10 - remove federal prose expansion quotas

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

Final required validation and structural evidence are recorded in the adjacent iteration-10-final-* logs, iteration-10-scope.txt and iteration-10-structural.txt. The OpenAI suite includes actual browser preflight and LibreOffice DOCX rendering; the other four required suites cover service worker/public-build privacy, browser privacy/network, runtime AI spending and browser accessibility. All five final suites PASS. Actual LibreOffice rendering PASS. Actual Netlify function packaging PASS: CLI 26.1.0, packager 14.7.1; Resume and Navigator resolve openai 7.8.0, @netlify/blobs 10.7.13, @netlify/otel 6.0.6 and @netlify/runtime-utils 2.3.0, with all four excluded from jobs. Local accessibility reports zero uncaught browser exceptions and zero external provider attempts. Local provider responses are stubbed and local browser tests suppress external calls. These local checks do not replace hosted, phone or manual assistive-technology acceptance.

## Next acceptance and remaining blockers

PREVIEW WARRANTED: Dean pushes this local iteration on codex/federal-resume-readiness to PR #59, base ops/openai-parallel-clone. Verify its new immutable deployment before one fresh fictional acceptance. One facts activation; proceed to one draft activation only with exact, warning-free facts. At most the existing single structural repair and four provider calls; no retry seeking a PASS. Provider counts remain UNVERIFIED without telemetry. Stop on failure; never export a withheld draft.

BLOCKED-TECHNICAL: full hosted federal release remains unaccepted; exact withheld C1/C5 text is unavailable. This patch's live effectiveness, actual federal artifact and phone/manual accessibility are pending. No BLOCKED-POLICY item was introduced. No audit or release threshold was weakened. No agent push, main merge, deployment or major skill addition occurred. Dean owns merge and release.
