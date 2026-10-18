# S3 local validation: Wisconsin human help, iteration 3

October16,2026. Implemented local candidate, not a publication receipt. Iteration1/2 work and evidence are preserved. This remains a bounded referral slice, not complete Wisconsin benefit coverage.

## Candidate and scope

Checkout `/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops`; branch `codex/wisconsin-pathway`; base `ffede2397c22af055c97c74a8afe631d22edbc7b` (merged PR149). Baseline read-only remote/ref and production receipts are in `baseline.json`; served production was cache289. The prior local iteration was291; this candidate is292. Worker change is CACHE_NAME only. No commit, push, merge or deployment occurred.

- Index SHA256: `cd93e02c3de0b32be4fbed8befc8f8b5005482c6952be92bb4136699546077c1`.
- Worker SHA256: `5672aedc5556ebaa8c9236f48e5f862f50fe39fc074bb8563aba32cc41bf6799`.
- Local preview: `http://127.0.0.1:18779/?tool=resources&view=state-help&area=wi&situation=browse&need=work`.
- Complete implementation hashes: `candidate-manifest.json`.

## Member changes

The first action and national default stay as before. One collapsed optional help section matches the selected need, without another selector or setup step. Seven helper records yield these finite groups: start/service2, moving3, benefits1, work/education1, health1. The general VetsNet route precedes the optional Women Veterans route for unspecified visitors.

Three nonprofit routes are included after separate service and legal-identity checks: VetsNet transition navigation, CVI's county-limited SSVF housing intake, and VOW's in-person Racine food/personal-care marketplace for veterans and surviving spouses. Organization/geography and access limits are visible beside the action. Onward Ops is explicitly separate from Transition OPS. Dryhootch is held out of this new runtime data because current legal-identity evidence remains unresolved; this is not a finding of revocation or misconduct.

Official help adds accredited VA claims assistance, conditional household housing support, retraining inquiry and an optional Women Veterans contact. Existing county/tribal offices, Job Centers, VORP and Guard support are reused rather than duplicated. Separate veteran-owned-business and state-jobs entries remain deferred depth. Fourteen verification entries were imported before their related claims:10 government records,3 nonprofits and1 adjacent Job Center correction. Nine new runtime records use the cleared exact copy and URLs; four government records support reuse/deferred coverage rather than additional rows.

The existing employer disclosure now distinguishes DWD's Vets Ready recognition and2025 recipient list from VBS cohort membership. The Job Center link is generic and displays the exact manual filter steps; it is not presented as prefiltered. Cohort membership remains separately labeled, with the official SkillBridge finder before all three company examples. A WDVA employer grant sits only in employer-support detail and explicitly belongs to the employer.

The adjacent national claims locator no longer equates organization membership with individual accreditation or universal free service. The Job Center card and the same historical v81 sentence no longer promise priority to every military spouse; program rules and separate DVOP screening are explicit. No unrelated catalog audit is implied.

## Validation

The complete prescribed gate was restarted after a test-harness failure. All final checks exited0 on the exact frozen index. Full receipts are under `checks/`, using `-cd93-revalidation.log` suffixes:

- Five required suites: OpenAI migration, service-worker privacy, privacy/network, runtime AI spend and accessibility release.
- Three targeted synthetic browser regressions: Wisconsin pathway, welcome and new human help.
- Existing policy-content regression:96 assertions and1,110 VA math vectors.
- Public build:74 allowlisted files. Internal evidence and new regression scripts stay outside public assets. The inherited worker-suite prose still calls one allowlist check64 files; its actual builder validates74.
- Exact source/presence/absence check:9 runtime records match cleared source copy after typographic normalization;14 verification headers appear exactly once; held record and corrected false phrases are absent. The state-context helpers and full primary/save component are byte-identical to iteration2. Receipt: `checks/source-contract-cd93.json`.
- Structural inventory parses all inline JavaScript/JSON-LD and tracked plus intended untracked JS/JSON/YAML, checks added-text encoding and the diff, and confirms untouched scope. The final post-copy receipt is `checks/structural-final-package.log`.

4S,4B boundary-change and4N triggers remain N/A: no workflow, public boundary, function, package or Netlify configuration change. Required existing suites still ran. No new dependencies were needed.

Tests used local synthetic profiles with outbound providers blocked, Node24.18.1 and Chrome155.0.8059.80. Phone emulations include320/371/375 CSS px,667px height, light/dark themes; the retained pathway test also covers320/375x812. The new focused test checks actual visible resource navigation, exact source boundaries, native Enter, at least44px links, no horizontal overflow, no saved-data changes on browsing, zero provider POSTs and zero uncaught app exceptions.

## Failure and review custody

The initial new help test incorrectly tried to read an app-closure constant from the browser global and stopped with `ReferenceError: RESOURCES is not defined`. This was a test-harness error. Its receipt `checks/help-cd93.log` is retained. The corrected test navigates the actual Resources selector and reads the visible American Job Centers card. No app runtime edit was made. The entire gate was then rerun from step1, including all five required suites and targeted checks; earlier passes are not substitutes for the final revalidation.

Independent implementation review reran18 need/context/theme cases on the final hash and reports no unresolved P1/P2. Its scope/author overlap with the nonprofit source packet is disclosed. Root separately verified IRS/rating evidence and performed actual CUA review. Actual Claude scouting/UX input and root's adoption/decline decisions are retained; that input is not substituted for source verification or browser acceptance.

Root's375x667 review observed the complete Work action above bottom navigation with the new assistance collapsed below it. Root checked moving/referral geography, keyboard disclosures, broad-first start help, All states removal,320 dark reflow and employer distinctions. The focused headless375 test measured action bottom548.6px/nav606.6px;320 light ended at616.6px and needed a small scroll. These are separate lab/browser observations, not a universal first-fold or field-performance claim. See `root-visual-review.md` and screenshots.

## Limits and handoff

No named provider was contacted or referral submitted. Link visits do not mark completion, appoint representatives or create applications. State interest and service context do not determine residence, eligibility or program availability. Current openings, approval, capacity, successful referrals, uncoached comprehension and retention remain unmeasured. Manual assistive-technology and hosted release acceptance remain pending. Northern/rural named-provider coverage remains a research gap; official locators remain available.

Evidence-copy custody is recorded in `evidence-copy-manifest.json`. Raw source/Claude/browser TXT receipts remain byte-exact in primary and are referenced by absolute path/hash, not duplicated or normalized. Copied Markdown/log smart quotes/NBSP are normalized; JSON is serialized in ASCII with values preserved; images/scripts stay byte-exact. Only this task's evidence is copied. Prior iterations remain historical.

No J1/S2 pipeline, provider, Resume, account, budget, schedule, persistent state contract or production setting was changed. Account usage was used for this work; precise cost is unknown, and this report does not describe scheduled/AI work as free.
