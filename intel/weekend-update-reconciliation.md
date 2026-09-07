# Weekend update reconciliation

## Scope and authority

- Integration worktree: `/tmp/transition-ops-weekend-integration`; branch `codex/openai-weekend-integration`.
- Frozen comparison: clone `0433f333e1de16d2dfd06e0cad4cb9a1ba025008`; published-main `d82516389ed5906febad467cfe57887acda97053`; merge base `be1233459a09ac58990dd553a79e47201219ca69`.
- Existing user authority covers integration and preservation of published work. This document introduces no approval gate for mechanical preservation. It edits no application, workflow, registry, verification entry or skill. Parent/S3 own integration and validation.
- Read registry plus canonical `.claude/agents/force-mod.md`, `.claude/agents/s2-intel.md` and `.claude/skills/policy-verification/SKILL.md`; .codex agent TOMLs are absent from this worktree. Policy source URLs were not fetched; no policy values were researched or rewritten.
- Rows are recommended integration dispositions based on immutable commit diffs, not assertions that S3 has already applied them. Parent may be editing concurrently; this report intentionally compares fixed refs.
- Remote OPM tips being ancestors of origin/main is supplied parent evidence. Their content is covered by the 31-commit graph; they are not extra candidate rows.

## Critical preservation findings

1. Preserve shipped OPM card plus RULE 16/CORPUS (b) literally. The clone still instructs future tense. Preserve the notice-date discriminator, two distinct effective dates, MSPB exceptions and hiring/RIF separation. Transplant only the two Navigator policy lines, not the legacy file or whole corpus.
2. V-2026-016, V-2026-017 and V-2026-018 each identify DIFFERENT records on the two branches. Preserve both record bodies and source histories. Use source-qualified identities in the reconciliation map; do not silently pick, overwrite, collapse or renumber an original published citation. Production V-017 initial record and amendment are ONE history, not an accidental duplicate.
3. Keep clone VA Table I, BDD and SkillBridge corrections while inserting the three production reminder objects. A whole-file main checkout would erase these clone changes; a whole-file clone checkout would erase the weekend work.
4. Clean merge is not semantic clearance: workflow inserts can apply without conflict yet restore stale model labels, estimated spend claims or retry behavior. navigator.js modify/delete requires a semantic port into navigator.mjs.
5. Historical sw.js bumps v130 through v135 are evidence of production lineage, not instructions to overwrite the clone OneSignal-free pwa-sw.js, retained legacy worker or v151. Parent must allocate/freeze the reconciled candidate against the current two-origin ledger and regenerate rollback.

## Exhaustive weekend checklist: 31 commits

First-parent file lists include status A/M/D; the merge row is explicitly a first-parent delta. Titles are exact git subjects. Each patch hash in the evidence index is SHA-256 of `git diff --no-ext-diff --binary SHA^1 SHA`.

| # | Exact commit SHA | Exact title | Files changed versus first parent | Disposition | Diff-grounded integration instruction |
|---|---|---|---|---|---|
| 1 | `0d71fc5cbbb6aef88bd9c4612e3a4584162d416f` | content: flip OPM RIF and appeal rules to in-force | `M index.html`<br>`M sw.js` | PORT-VERBATIM / RETAIN-CACHE-HISTORY | OPM card header/body changes to in-force tense and adds MSPB companion citation; clone still has future-law header/body. Preserve exact production card, notice-date sentence and separate performance-rule date; do not transplant legacy sw.js or v130. |
| 2 | `d61590eeb827ae354a5c6fe97e55d08e1ca58d9e` | intel: V-2026-016 OPM RIF card in-force verification; corpus (b) recorded OPEN | `A intel/V-2026-016-opm-rif-in-force.md`<br>`M intel/verification-log.md` | RETAIN-LINEAGE | Adds the 130-line OPM source record and V-016 log entry. Retain source file and original entry with branch-qualified ID; its corpus-OPEN status is historical and later amended. |
| 3 | `fa80e5d1489c875bad36d1abacdc747cd227b3ad` | corpus: flip Navigator RIF corpus (b) and RULE 16 to in-force | `M netlify/functions/navigator.js` | PORT-VERBATIM TO MJS | Exactly two policy lines changed: RULE 16 and CORPUS (b), including MSPB pending/pre-effective-date and Foreign Service carve-outs. Clone navigator.mjs still contains the old two lines. Do not restore navigator.js or copy the whole old corpus. |
| 4 | `414c8b50016861a23270683699f9acca713f6792` | intel: V-2026-017 corpus (b) tense flip record; tickler V-2026-009 status | `M intel/verification-log.md` | RETAIN-LINEAGE | Adds V-017 staged record and updates V-009 tickler to partially closed. Preserve original entry plus subsequent amendment, not staged status as current truth. |
| 5 | `e33792c9e41b2fb1309a2ac85441bafdab0de890` | Merge branch 'ops/opm-rif-corpus-b' into ops/v-2026-017-corpus-b-record | `M netlify/functions/navigator.js` | ALREADY-COVERED BY ROW 3 / RETAIN-ANCESTRY | Merge has two parents; first-parent delta is only the same two Navigator lines from fa80e5d. Second-parent delta carries the OPM record/log. Preserve ancestry; do not apply the two policy lines twice. |
| 6 | `b4051932ce636f7af6d1bf5f8b78e6fe5ad948a1` | intel: V-2026-017 amendment — preview PASS, merged, tickler V-2026-009 CLOSED | `M intel/verification-log.md` | RETAIN-LINEAGE | Adds V-017 preview/live-edge PASS amendment and closes V-009 tickler. Historical tests bind e33792c, not the integrated candidate. Keep the explicitly deferred 5 USC 2108 elaboration deferred. |
| 7 | `0e9316396d644efe15b10fe2d6da6d63dd0b5add` | Add FEDVIP window (T-31/+60) and Gray Area Future Retiree rungs to reminder ladder; bump cache v131 | `M index.html`<br>`A intel/patch-2026-09-04-fedvip-gar-ladder.md`<br>`M sw.js` | PORT-VERBATIM / RETAIN-CACHE-HISTORY | Adds exactly three reminder objects r-1-fedvip, r-1-gar, r-p1-fedvip and source patch. All three are absent in clone. Preserve their full strings/order, not whole SMART_REMINDERS (clone has independent corrections); v131 is historical. |
| 8 | `557ee5c27bef7c77c47e698a236637794c1a1257` | intel: V-2026-018 FEDVIP/Gray Area ladder record; cache-sequence correction | `M intel/verification-log.md` | RETAIN-LINEAGE / QUALIFY-ID | Adds FEDVIP V-018 record, sourcing limitation, staged status and old cache commentary. Preserve verbatim history; append provenance context rather than overwrite clone SkillBridge V-018 or treat old clone-cache assertions as current. |
| 9 | `123363f5054975f5f45411638c458ba2086c5b6f` | quality-loop iter 0: baseline measurement, no code changes | `A scratchpad/quality-loop-baseline.md` | RETAIN-HISTORICAL | Adds quality baseline measurements, harness deviations and defect board only. Not a current candidate benchmark or manual accessibility pass. |
| 10 | `47e7ad0c8a76e59f9fe2eb186db2fbc0a9e544d2` | quality-loop iter 1: preconnect to Google Fonts origins (perf 70 -> 90) | `M index.html`<br>`A scratchpad/quality-loop-log.md` | PORT | Adds two Google Fonts preconnect links. Clone has the same font stylesheet but no preconnect. Keep optional remote-font boundary; do not restore unrelated trackers. |
| 11 | `74f79103fd38b2d60a7f0979c49cb117949a3e7d` | quality-loop iter 2: load fonts stylesheet non-blocking (perf 90 -> 98) | `M index.html`<br>`M scratchpad/quality-loop-log.md` | PORT | Changes existing font stylesheet to media=print/onload and adds noscript fallback. Clone is still blocking. Preserve font URL and clone accessibility behavior; old measured score does not transfer. |
| 12 | `48f6720aec7fedeb612b176b9c05f9e8471ccd01` | quality-loop iter 3: catch OneSignal init rejection (best-practices 74 -> 78) | `M index.html`<br>`M scratchpad/quality-loop-log.md` | ALREADY-COVERED BY REMOVAL / RETAIN-HISTORICAL | Wraps OneSignal.init in try/catch. Clone removed page SDK/init under push OFF, so do NOT reintroduce SDK, App ID or legacy registration to carry this catch. Retain quality-loop record only. |
| 13 | `44710a316dcb46e32e80c74bbc331322ecbbe9b8` | quality-loop final: bump SW cache v131 -> v132, close loop at 475/500 | `M scratchpad/quality-loop-log.md`<br>`M sw.js` | RETAIN-HISTORICAL / SUPERSEDED-CACHE | Closes quality loop, records reverted hints and plateau; sw.js v131 to v132 only. No remaining runtime hunk. Keep log, not historical cache literal. |
| 14 | `bc46412b05beaa5d3879cc13cfae3d1db89899e2` | forensics: local ETS alert channel — diagnosis, no code changes | `A scratchpad/alert-channel-forensics.md` | RETAIN-HISTORICAL | Adds channel forensics: disabled slice(0,0), wrong reminder array and old platform observations. Preserve as diagnosis of its recorded build, not integrated behavior. |
| 15 | `47063f766b0b49fea1c137adc0c566bef8047efa` | iter 1: fix daysToETSDate off-by-one west of UTC (13/13 -> 0/13) | `M index.html`<br>`M scratchpad/alert-channel-forensics.md`<br>`A scratchpad/alert-channel-loop-log.md` | PORT | daysToETSDate anchors YYYY-MM-DD at local noon instead of UTC midnight. Clone still uses new Date(dateStr). Preserve helper fix independently of enabling notifications; retain forensic/log amendment. |
| 16 | `44d188a02b24a142a904a058c34d9c8e277c99a5` | iter 2: add rung trigger engine (evaluate-on-open), not yet wired | `M index.html`<br>`M scratchpad/alert-channel-loop-log.md` | PORT-FINAL-ENGINE / KEEP-INACTIVE | Introduces trigger table and due-rung evaluator. Use final f3e969c engine semantics, not intermediate 31-day grace. Helper declarations alone do not grant permission or enable delivery. |
| 17 | `493a8de52095d5d4aac802ba1c0533584678e268` | iter 3: wire the engine to the notification path — the channel fires | `M index.html`<br>`M scratchpad/alert-channel-loop-log.md` | SUPERSEDED-BY-LATER-HARDENING / KEEP-INACTIVE | Introduces notifyDueRung and ETS-edit call, replacing disabled old loop. Its mark-before-show persistence is superseded by row 21 and supplemental fixes. Do not blindly wire caller into clone push-OFF UI. |
| 18 | `39ab67aad450a4c9e0a86a4e47ad046c5b8421df` | iter 4: evaluate-on-open — the channel now fires without a member action | `M index.html`<br>`M scratchpad/alert-channel-loop-log.md` | RETAIN-HISTORICAL / KEEP-INACTIVE | Adds permission-dependent mount effect and two-second evaluation timer. Clone has replaced notifStatus flow. Porting this caller verbatim is not preservation of an inactive engine; keep delivery entry points off. |
| 19 | `bd3bbbf33f4ebf8c8118935473313b08e2628b66` | iter 5: day-anchored rungs win the per-open slot at equal priority | `M index.html`<br>`M scratchpad/alert-channel-loop-log.md` | PORT-FINAL-ENGINE | Adds equal-priority tie-break in favor of day-anchored rungs. Preserve comparator in final engine; do not infer every eligible FEDVIP rung must win over higher priority. |
| 20 | `4750986e04aad91bc4c952ed605c67334d371018` | final: bump SW cache v132 -> v133, close loop at criterion A | `M scratchpad/alert-channel-loop-log.md`<br>`A scratchpad/alert-channel-manual-test.md`<br>`M sw.js` | RETAIN-HISTORICAL / TEST-NEEDS-SUPPLEMENT | Adds manual-device recipe and closes old loop; sw v132 to v133. Day +45 expectation becomes obsolete under row 22 and daily state is not isolated. Supplemental e073af5 corrects recipe; old PASS is not iPhone proof. |
| 21 | `2c7ed74b297ceafe402ea161b541da5058282b0f` | hotfix: stop the notification burst — one per open, one per day, SW v134 | `M index.html`<br>`A scratchpad/alert-burst-incident.md`<br>`M sw.js` | PORT-SAFETY-INVARIANTS / KEEP-INACTIVE | Adds one-per-open and calendar-day cap, defers delivered writes until fulfilled show and resets on failure; adds interim staleness table and incident report. Keep caps; use final staleness and supplemental durable locking if that follow-up is selected. No historical v134 transplant. |
| 22 | `f3e969c44414c6c457b44ffef1e4d173ba4f129e` | staleness tiers: 14d day ceiling, 15d month tail, SW v135 | `M index.html`<br>`A scratchpad/staleness-tiers.md`<br>`M sw.js` | PORT-VERBATIM-VALUES / KEEP-INACTIVE | Replaces interim grace with 14-day day-trigger ceiling, 15-day month half-window plus 15-day tail and class ceilings; final due/stale intersection. Preserve S2-fixed constants exactly; FEDVIP +44 eligible boundary, +45 stale. No new policy values. v135 is production history. |
| 23 | `62e0cf8d09ed9de8abc8eba4f941ab517014badc` | fleet baseline: 48-cell readiness audit, composite 34/96, no changes | `A scratchpad/fleet-baseline.md` | RETAIN-HISTORICAL | Adds fleet 48-cell baseline only. Preserve later corrections; baseline title 34/96 is not final corrected denominator claim. |
| 24 | `1ca9c69df142d57a7f5a4cddbef23ee67ab24aee` | iter 1: dry-run mode for the two send-capable agents (+4, composite 38/96) | `M .github/workflows/pao-weekly-packet.yml`<br>`M netlify/functions/navigator.js`<br>`A scratchpad/fleet-loop-log.md` | PORT-ADAPT | PAO gains dispatch-only dry_run and guards both issue-create paths. Navigator gains env-only dry run with same prompt assembly, but old branch calls recordGap and logs prompt size/turns. Rebuild synthetic path in mjs without gap writes or member-derived logging; preserve no model call. |
| 25 | `128c0cacbecf2a723a441a21b1dffb62e8b060b9` | iter 2A: PAO run status now tells the truth (+1, composite 38/96) | `M .github/workflows/pao-weekly-packet.yml`<br>`M scratchpad/fleet-loop-log.md` | PORT | PAO now fails on both issue-create failures and on non-OK/non-QUIET packet status; marker suppresses duplicate generic FLASH. Adapt around clone model step without changing model or schedule. |
| 26 | `6909f569b599e9248c86ae66af46f89d22991499` | iter 3: retry the network edge — J1 fetch, Navigator upstream (+3, composite 42/96) | `M .github/workflows/j1-federal-scan.yml`<br>`M netlify/functions/navigator.js`<br>`M scratchpad/fleet-baseline.md`<br>`M scratchpad/fleet-loop-log.md` | SPLIT: PORT J1 / RETAIN CLONE ZERO-RETRY | J1 adds bounded curl retry flags for source fetch. Navigator adds 8.5-second total budget, up to two Anthropic attempts, 250ms backoff on network/429/5xx. Clone OpenAI client explicitly maxRetries:0 and timeout:25000: do not import retry semantics or Anthropic request. See Navigator seam below. |
| 27 | `555619252f1723815b60c6a06883c3616f207278` | iter 4: bounded, idempotent gh retries fleet-wide (+10, composite 52/96) | `A .github/scripts/gh-retry.sh`<br>`M .github/workflows/j1-federal-scan.yml`<br>`M .github/workflows/j2-weekly-analysis.yml`<br>`M .github/workflows/j3-weekly-sitrep.yml`<br>`M .github/workflows/j4-link-audit.yml`<br>`M .github/workflows/j5-spend-check.yml`<br>`M .github/workflows/pao-weekly-packet.yml`<br>`M scratchpad/fleet-loop-log.md` | PORT-ADAPT | Adds gh-retry.sh and sources it in all six workflows. Exact-title lookup before retry provides best-effort dedupe, not guaranteed idempotency when lookup fails. Preserve scope and bounded attempts; do not widen to OpenAI model calls. |
| 28 | `b3e39a0c53eda64099ed28ee0741408244dc033c` | iter 5: labeled per-run metering, J5 loop widened to the whole fleet (+13, composite 65/96) | `A .github/scripts/emit-metering.sh`<br>`M .github/workflows/j1-federal-scan.yml`<br>`M .github/workflows/j2-weekly-analysis.yml`<br>`M .github/workflows/j3-weekly-sitrep.yml`<br>`M .github/workflows/j4-link-audit.yml`<br>`M .github/workflows/j5-spend-check.yml`<br>`M .github/workflows/pao-weekly-packet.yml`<br>`M scratchpad/fleet-loop-log.md` | PORT-ADAPT | Adds metering emitter, start marks and always-run records to six workflows; J5 now inventories J4/J5/PAO too. Keep actual clone model labels; output-file existence is not provider usage proof and records do not replace shared OpenAI budget. |
| 29 | `382afd8e24e63372428248b0a30fb802b4209e99` | iter 6: Navigator emits one status line per invocation (+3, composite 68/96) | `M netlify/functions/navigator.js`<br>`M scratchpad/fleet-loop-log.md` | PORT-ADAPT / PRIVACY-SEAM | Adds navLog once per return with outcome/status/latency/attempts/turns/tokens/dry-run. Port content-free status coverage to mjs including its 413 and budget errors; do not restore gap log, raw prompts, old provider error logs, or assume turns/prompt-size logging is authorized by no-content wording. |
| 30 | `62f137788005326f48361d803dd146f6e93bd61c` | iter 7: re-score pass, no code change (+3, composite 71/96) | `M scratchpad/fleet-loop-log.md` | RETAIN-HISTORICAL | Re-scores existing metering/status behavior and records 71/96 fleet table; no runtime change. Do not claim it tests migrated mjs. |
| 31 | `d82516389ed5906febad467cfe57887acda97053` | iter 8: J5 trailing median and 2x flagging (+6, composite 77/96) — loop terminates | `A .github/scripts/j5-metering-median.py`<br>`A .github/scripts/tests/test-j5-metering-median.py`<br>`M .github/workflows/j5-spend-check.yml`<br>`M scratchpad/fleet-loop-log.md` | PORT-ADAPT | Adds J5 median analyser, its tests, artifact collection and report section. Uses fixed 0.065 estimate, >=3 samples and >2x flags; dedup key includes agent/run/attempt. Keep estimate label and all cases, do not call this actual OpenAI spend. Existing source collects first 100 artifacts since month start; do not claim exhaustive rolling-30-day coverage. |

## Verification ID collision map

| Original ID | Clone 0433f333 record | Production d825163 record | Required disposition |
|---|---|---|---|
| V-2026-016 | `0433f333:intel/verification-log.md#V-2026-016` - VA combined-rating Table I reconciliation | `d825163:intel/verification-log.md#V-2026-016` - OPM RIF card in-force verification | RETAIN BOTH; qualify every new reference with source SHA/topic; preserve original body/citations |
| V-2026-017 | `0433f333:intel/verification-log.md#V-2026-017` - BDD decision, effective-date, and exam claims | `d825163:intel/verification-log.md#V-2026-017` - OPM corpus/RULE 16 staged record PLUS its closure amendment | RETAIN BOTH; qualify every new reference with source SHA/topic; preserve original body/citations |
| V-2026-018 | `0433f333:intel/verification-log.md#V-2026-018` - SkillBridge service/paygrade tier reconciliation | `d825163:intel/verification-log.md#V-2026-018` - FEDVIP / Gray Area ladder verification | RETAIN BOTH; qualify every new reference with source SHA/topic; preserve original body/citations |

Production V-009 tickler closure belongs to OPM V-016/V-017, NOT clone Table I or BDD. Production appendices below retain the exact staged-to-closed amendment chain. Clone SkillBridge V-018 prospectively supersedes only the Navy-source gap of V-015; preserving it must not modify the production FEDVIP claim record.

## Navigator migration checklist

- `fa80e5d`: PORT exactly RULE 16 and CORPUS (b) from final production navigator.js into corresponding mjs lines. Preserve clone RULES changes elsewhere, closed citation-token filtering, updated BDD/SkillBridge corpus, request sanitization and window math. Appendix A records exact strings and source positions.
- `1ca9c69`: PORT env-only `NAVIGATOR_DRY_RUN === "1"`, shared prompt assembly and synthetic response path. Do not invoke provider, spend reservation, recordGap or any Blob write. Never permit request-body control of dry run. Existing legacy synthetic GAP stripping can be tested without restoring persistence.
- `6909f56`: DO NOT mechanically transplant fetchAnthropic, ANTHROPIC_API_KEY, retry logs, two-attempt budget or 250ms delay. Clone `_shared/openai-client.cjs` explicitly has `maxRetries: 0` and `timeout: 25000`. Preserve its single-call guard and friendly failure. If changing that policy is actually desired, that retry/timeout change is the novel decision; it is not needed to preserve OPM wording or J1 fetch resilience.
- `382afd8`: PORT an outcome/status mechanism compatible with mjs (preflight, method, body size, JSON, no-user-message, dry-run, completed reply, incomplete/provider error, budget denial). Native mjs has extra paths absent in the old log. Keep telemetry content-free; audit request/turn counts and prompt sizes against the approved privacy boundary instead of assuming the legacy field list transfers. Never log exception payloads, member text/context, GAP topics, stable member identifiers or restore member-derived Blob records.
- Keep `withLambda` entrypoint, OpenAI model/options, `store: false`, aggregate admission/reservation/accounting, reasonCategory UI contract and no raw response leakage. No live function call was made by this audit.

## Silent-merge and historical-evidence traps

- The three new reminder objects must preserve the existing neighbors without replacing clone reminder descriptions corrected by V-018 SkillBridge. OPM literal copy is independently needed in the card and the model instructions; fixing only one leaves contradictory channels.
- The FEDVIP patch and V-018 entry explicitly retain historical source-pass dependence, member-impact NOT RUN and staged/inert wording. User confirms the commits are published; do not relabel that historic evidence as current absence of publication or fabricate a new source/impact pass. Retain original evidence and add dated integration context outside it.
- Production V-017 amendment explicitly defers the model eligibility-category elaboration; this audit does not enumerate 5 USC 2108 categories or reopen the published wording.
- Alert notification eligibility is separate from legal enrollment deadline. Preserve the published 14-day staleness rule; do not extend it to force an obsolete day +45 test green. Old cold-open, Chrome and Lighthouse PASS records do not prove current React UI, iPhone delivery or manual AT.
- Port final engine behavior rather than replaying transient broken states (mark-before-show, per-invocation burst, interim staleness). Keep notification activation off in the clone. No new/migrated OneSignal request or permission prompt is permitted by preservation work.
- Fleet gh wrapper dedupe is best-effort: failed lookup allows another create. The claim of idempotence in the title is not proof. Preserve the code and characterize its actual bound; do not expand remote sends during this documentation task.
- J5 source median computes over supplied records including flagged runs, not a leave-one-out baseline; collection is month-start/first-page bounded. Its fixed model-step estimate does not replace OpenAI actual usage. These are interpretation limits, not authorization requests to redesign J5.

## Supplemental published-today inventory: 3 commits, NOT part of weekend 31

Source: `origin/codex/alert-verification-followup` at `c395c454d254de2b5021fab129996b6ff38e0f55`, range `d82516389ed5906febad467cfe57887acda97053..c395c454d254de2b5021fab129996b6ff38e0f55`. Publication is parent-supplied evidence; local graph confirms three descendants. Initial integration scope is main only.

| # | Exact commit SHA | Exact title | Files changed versus first parent | Disposition | Diff-grounded integration instruction |
|---|---|---|---|---|---|
| S1 | `e073af5212d1147b096e3e90a5747e84216135b9` | test: document alert persistence gaps and correct phone boundaries | `M scratchpad/alert-channel-manual-test.md`<br>`A scratchpad/alert-verification-followup.md`<br>`A scratchpad/alert-verification-synthetic.cjs` | SEPARATE-FOLLOWUP / RETAIN-EVIDENCE | Documentation and synthetic verification only: corrects +44/+45 boundary and records persistence gaps. Useful replacement recipe, but keep as explicit supplemental scope; old evidence is not integrated-candidate proof. |
| S2 | `ca7411f37e91bfd350c530b6f078eb9bd24650d6` | fix: block unpersisted alerts; six failed-storage fires to zero | `M index.html`<br>`A scratchpad/alert-hardening-loop-log.md`<br>`A scratchpad/alert-persistence-test.cjs`<br>`M scratchpad/alert-verification-synthetic.cjs` | SEPARATE-FOLLOWUP / SAFE-INACTIVE-PORT-CANDIDATE | Adds versioned local ledger, strict legacy/new validation, verified durable pending reservation, failure cleanup and final write verification. Does not change policy/rung values. Raw notifier is NOT gated by TOPS_PUSH_ENABLED; permission granted is enough. Keep declaration-only/inactive or apply explicit clone OFF guard if parent selects port. This commit changes no worker; supplemental S3 carries the historical v136 bump. |
| S3 | `c395c454d254de2b5021fab129996b6ff38e0f55` | fix: coordinate alert delivery; browser checks 4/5 to 7/7 | `M index.html`<br>`A scratchpad/alert-browser-test.cjs`<br>`M scratchpad/alert-channel-manual-test.md`<br>`M scratchpad/alert-hardening-loop-log.md`<br>`A scratchpad/alert-hardening-sitrep.md`<br>`M scratchpad/alert-persistence-test.cjs`<br>`M sw.js` | SEPARATE-FOLLOWUP / SAFE-INACTIVE-PORT-CANDIDATE | Wraps ledger read/select/reserve/show/commit in native exclusive Web Lock; unavailable/rejected lock fails closed; adds browser harness and evidence. Raw code remains callable on existing permission. Prefer this final hardening over the intermediate notifier if explicit follow-up integration is selected; do not imply it locks older app versions. |

**Explicit supplemental recommendation:** preserve these three commits as a separately identified follow-up; do not silently merge their tip as weekend main. Dormant engine preservation is safe with respect to delivery only when declarations have no top-level effects and no path (mount, ETS edit, permission recovery, UI or direct notifier) can dispatch under clone OFF. `TOPS_PUSH_ENABLED = false` alone does not enforce that: supplemental `notifyDueRung` checks Notification.permission, not the feature flag. Previously granted permission survives a UI hold.

If parent chooses to carry dormant helper declarations now, retain all durable-ledger/Web-Lock safety improvements together, leave the clone permission flow and push workers untouched, and make that explicit in the integration disposition. Do not re-enable OS notifications or add expiry/automatic clearing of pending state. A separate activation decision is not necessary for inactive preservation, but inactive safety still needs S3 proof on the resulting build. No supplemental code was applied by this author.

Browser 7/7 is historical evidence on the c395 lineage, with stubbed notifications and synthetic pages. It is not proof of integration OFF gating, actual iPhone delivery, full React behavior or coexistence with older unlocked tabs.

## Evidence index and completeness

- Weekend graph set: **31/31** distinct commits, exactly `git rev-list --reverse 0433f333e1de16d2dfd06e0cad4cb9a1ba025008..d82516389ed5906febad467cfe57887acda97053`.
- Supplemental graph set: **3/3** distinct commits, exactly `git rev-list --reverse d82516389ed5906febad467cfe57887acda97053..c395c454d254de2b5021fab129996b6ff38e0f55`; disjoint from weekend set.
- Every checklist row has exact git title, first-parent file inventory and a disposition; no commit omitted because its title says measurement, merge or documentation. Merge delta counted once as ancestry, not a second policy edit.
- Patch hashes below bind the reviewed changes to local git objects. They prove inventory identity, not runtime acceptance. No merge, application test, provider call, commit or registry change was performed.

| Commit | First-parent binary diff SHA-256 |
|---|---|
| `0d71fc5cbbb6aef88bd9c4612e3a4584162d416f` | `bca9442b5fe6f5a6a0f7109fdb070186d6a3baec67879aeac54dfdff7eb5063f` |
| `d61590eeb827ae354a5c6fe97e55d08e1ca58d9e` | `7cdc935e4ec32a9b13ded39234b4b8ce77a2368d286ecaf32328746cedfabdcf` |
| `fa80e5d1489c875bad36d1abacdc747cd227b3ad` | `0a5a295d7aa48bd34c9df486c2d2492d497065221f764dfad6b3b612d547c8c8` |
| `414c8b50016861a23270683699f9acca713f6792` | `ca71b5bbb3caada796a3880bd3ad86e6d6d35034b584a73bc514bd4959723363` |
| `e33792c9e41b2fb1309a2ac85441bafdab0de890` | `0a5a295d7aa48bd34c9df486c2d2492d497065221f764dfad6b3b612d547c8c8` |
| `b4051932ce636f7af6d1bf5f8b78e6fe5ad948a1` | `515b7310a41a6e43119c54804501ed955270c47e224bb408436dfd25fd5a81c4` |
| `0e9316396d644efe15b10fe2d6da6d63dd0b5add` | `a85798d6b7101006c549ddafdf40bd0e76b2f6eabfbe2e44286f642968d12c34` |
| `557ee5c27bef7c77c47e698a236637794c1a1257` | `564bbba6dafbdfa10ebc3b23112933b4e315df86366adab5d136c9ab938fe65c` |
| `123363f5054975f5f45411638c458ba2086c5b6f` | `bb6dd468ef7f6eafcab9b282b51a7998e3bf32052319fd40f0f9f0bc9a74d54f` |
| `47e7ad0c8a76e59f9fe2eb186db2fbc0a9e544d2` | `4b24a28b2aa61e4068aeffe0f55260905c9b7bdeec9fcd7e4fdcfb9d86c917db` |
| `74f79103fd38b2d60a7f0979c49cb117949a3e7d` | `421065f285d1826ae7223f8d2b3d7faf4e502f3830f79bc6f4fa2379117135ad` |
| `48f6720aec7fedeb612b176b9c05f9e8471ccd01` | `ad5d888ce9386ed9f7419bb5c70fe61b4ad49f4bdc61392a2e1995af41e8b5d8` |
| `44710a316dcb46e32e80c74bbc331322ecbbe9b8` | `61da28b81c1511037d746463dd4b50963a426014de0b5813fcaabe277fcac6b9` |
| `bc46412b05beaa5d3879cc13cfae3d1db89899e2` | `42f198720e36850675fd9b7c339aef344a596ae389198e3efae3753b79797834` |
| `47063f766b0b49fea1c137adc0c566bef8047efa` | `e14b17c9f250e6ad5bc17e274ce9c13a0caf9cdebcc47fa374696219e26eb948` |
| `44d188a02b24a142a904a058c34d9c8e277c99a5` | `cadb5bfad49920105908f51a7b6b86b53c72e4e24d5806d217d165fb0ad66ce8` |
| `493a8de52095d5d4aac802ba1c0533584678e268` | `c60a8afa9942024de168154eaa5b8cadbecdae3f2995c95ad71ccc31a916845e` |
| `39ab67aad450a4c9e0a86a4e47ad046c5b8421df` | `1eef021ecac47d10e553641816d3945057c4f2b546655d2d33bfb88cab67a2ea` |
| `bd3bbbf33f4ebf8c8118935473313b08e2628b66` | `b413b97a9e037148e31902f9441a1b3d28296d87a7e13a2c74bcd1537446ba11` |
| `4750986e04aad91bc4c952ed605c67334d371018` | `d907b59321ff5a5f3d8dc61b9353bf5fa8aec56c15f4510e4dba42f1f63178b9` |
| `2c7ed74b297ceafe402ea161b541da5058282b0f` | `870a916b261186797c5890f85f1a08b287d437d5b27c0fca5420304ce3f9eab9` |
| `f3e969c44414c6c457b44ffef1e4d173ba4f129e` | `c8c7a3377f3f6d4387a09190741f0def64de3d2f5f5009ab3c237b04f85aff3d` |
| `62e0cf8d09ed9de8abc8eba4f941ab517014badc` | `d281da4e6ce79d96cc0bc1afc3c5cfe2833a5a22f0c46dbfdadd1c4647ddf800` |
| `1ca9c69df142d57a7f5a4cddbef23ee67ab24aee` | `52c9dde9cc02949c424224d864f115ef4571a095fab80b30d67a8989f5528f8e` |
| `128c0cacbecf2a723a441a21b1dffb62e8b060b9` | `df7aa749ef075ae1a4c81ede36deabbcac70913c0d6412e0739f3f17f50deeed` |
| `6909f569b599e9248c86ae66af46f89d22991499` | `c00e6575194abe0e61e6967ec12aa515e06558952e6213bc9b481e0665c80b32` |
| `555619252f1723815b60c6a06883c3616f207278` | `34f249a7f84d1c84465597df7696cc422aff06966439a98f88c2e48ad8326cce` |
| `b3e39a0c53eda64099ed28ee0741408244dc033c` | `d1eceb5d5d2055335326ff60fbba78fc498bb1b0050f47f50f2cbd255622d7c2` |
| `382afd8e24e63372428248b0a30fb802b4209e99` | `2971da4e50646b5a61b1c731cbb7f8d57a7b6d6db55f9dc8e69e24e4eb68f098` |
| `62f137788005326f48361d803dd146f6e93bd61c` | `299ec0c000be5f026425125f3168784792319e915eda3730ba50f239340443de` |
| `d82516389ed5906febad467cfe57887acda97053` | `527ac1cd1f22ba4cfb5d8cfdad58dbf1eb13cac9cea3016f8ee6fb9dc7622049` |
| `e073af5212d1147b096e3e90a5747e84216135b9` | `a6d7901215dcd2b72bc20c7e8fd721563c58455a171bcd4abcf6cd79f8290587` |
| `ca7411f37e91bfd350c530b6f078eb9bd24650d6` | `8cd99fba2bc9311f8f36277cb454b8d6f092554a348dea14dbfaba5d6502392f` |
| `c395c454d254de2b5021fab129996b6ff38e0f55` | `be8eb96c19206a3f5583652eaf30271071451aa887dfd275d8f0ba389ebbf2d8` |

## Appendix A - verbatim published policy implementation

The following are exact source lines from immutable published-main objects, not newly researched policy assertions. Literal backslash escapes remain literal. Preserve source wording; apply only the identified objects/lines into the integrated implementation.

### OPM card header/body

Source: `d82516389ed5906febad467cfe57887acda97053:index.html`; lines 4515, 4516. Full source blob SHA-256: `e5cdb6fdc22f82d899d0b59aede504c412cd178c97cb29b68923b40e54caabce`. Excerpt SHA-256: `aec6de74be5a6f0e6ae7f10f4520c8096d856b5e95ae675e2f52d7770d15cbee`.

````text
            React.createElement("div", { style: { fontFamily: "'Oswald', sans-serif", fontSize: 11, color: C.greenBright, letterSpacing: 1, marginBottom: 4 } }, "\u2713 FEDERAL SERVICE \u2014 RIF AND APPEAL RULES IN FORCE, 2 SEP 2026"),
            React.createElement("div", { style: { fontSize: 13, color: C.textSecondary, lineHeight: 1.5 } }, "Four OPM final rules published 3 AUG 2026, all effective 2 SEP 2026 \u2014 in force now. They govern reduction-in-force retention (2026-15665), RIF appeals (2026-15666), probationary and trial-period termination appeals (2026-15654), and suitability action appeals (2026-15650). In a RIF, employees are ranked by ", React.createElement("strong", { style: { color: C.textPrimary } }, "performance credit, augmented by veterans' preference"), ", with tenure subgroup and length of service as tie-breakers (5 CFR 351.501). Preference eligibles with a compensable service-connected disability of 30% or more receive 5 additional points; other preference eligibles 3 (5 CFR 351.504, as revised effective 2 SEP 2026). Appeals have moved from the MSPB to OPM \u2014 the Board removed these appeal categories from its own regulations effective the same day (Appellate Jurisdiction Update II, RIN 3124-AA33), keeping pending and pre-2-SEP cases \u2014 and a RIF appeal is open only to an employee furloughed more than 30 days, separated, or demoted, and that employee must show the agency broke a rule and that the failure cost them the outcome. ", React.createElement("strong", { style: { color: C.textPrimary } }, "RIF notices issued before 2 SEP 2026 are processed under the prior rules \u2014 the date on your notice decides which regime governs it."), " Your retention standing runs on your rating of record, so read FEDERAL PERFORMANCE RATINGS above \u2014 that rule is in force now. Final rules 2026-15665, 2026-15666, 2026-15654 and 2026-15650.")
````

### Navigator RULE 16 and CORPUS (b)

Source: `d82516389ed5906febad467cfe57887acda97053:netlify/functions/navigator.js`; lines 25, 190. Full source blob SHA-256: `156b444bb175935f1763ac98b2ee6372c12b8e79a93091c830cdded1e616e25e`. Excerpt SHA-256: `9bc389e51dc98cd0cb1cfd56f3befcadbf0fe248e51c130466526b243b12abf5`.

````text
16. TWO OPM EFFECTIVE DATES — NEVER BLEND THEM. The 2026 OPM federal-civilian changes fall on two different dates, and a member holding a RIF notice in August must be able to tell which regime governs it. CORPUS (c), the performance-rating rule, is IN FORCE NOW as of 6 AUG 2026 — answer in the present tense. CORPUS (b), the four RIF and appeals rules, are IN FORCE NOW as of 2 SEP 2026 — answer in the present tense and state the date. NEVER describe both in one undated present tense. If asked what applies to a RIF notice already in hand, the date on the notice decides: notices issued before 2 SEP 2026 are processed under the prior rules.
  (b) RIF RETENTION PREFERENCE — keeping the job in a reduction in force. IN FORCE since 2 SEP 2026. FOUR OPM final rules published 3 AUG 2026 all took effect that day: reduction in force (FR 2026-15665), RIF appeals (FR 2026-15666), probationary and trial-period termination appeals (FR 2026-15654), and suitability action appeals (FR 2026-15650). Since 2 SEP 2026 employees are ranked by performance credit augmented by veterans' preference, with tenure subgroup and length of service as tie-breakers (5 CFR 351.501). Preference eligibles with a compensable service-connected disability of 30 percent or more receive 5 additional points; other preference eligibles 3; non-preference eligibles none (5 CFR 351.504). RIF appeals have moved from the MSPB to OPM and are open only to an employee furloughed more than 30 days, separated, or demoted, who must show the agency failed to comply with an applicable statute or OPM regulation AND that the failure prejudiced them. Probationary-termination and suitability-action appeals have also moved to OPM. The MSPB removed these appeal categories from its own regulations the same day (Appellate Jurisdiction Update II, RIN 3124-AA33, FR public-inspection doc 2026-16456): its jurisdiction over RIF, probationary-termination, and suitability appeals ended 2 SEP 2026, but pending cases and actions taken before that date stay with the Board, which also retains Foreign Service RIF jurisdiction (22 U.S.C. 4010a). RIF notices issued before 2 SEP 2026 are processed under the prior rules — the date on the notice decides which regime governs.
````

### Three FEDVIP / Gray Area reminder objects

Source: `d82516389ed5906febad467cfe57887acda97053:index.html`; lines 2878, 2879, 2882. Full source blob SHA-256: `e5cdb6fdc22f82d899d0b59aede504c412cd178c97cb29b68923b40e54caabce`. Excerpt SHA-256: `1b2f932f16a8b33397134f3132f3f04cdcc7cb37a7e7a262ad883ab05373d275`.

````text
  {id:"r-1-fedvip",mo:1,cat:"BENEFITS",pri:"CRITICAL",title:"\u26A0\uFE0F FEDVIP Dental/Vision Window OPEN (Retirees)",brief:"Your FEDVIP enrollment window opens 31 days before your retirement date. Enrollment is not automatic.",items:["Enroll BEFORE your retirement date to avoid a dental coverage gap","Window: 31 days before retirement date through 60 days after","Vision coverage requires enrollment in a TRICARE health plan","Gray area reservists under age 60 are also eligible","Miss the window and you wait for the next Federal Benefits Open Season","Enroll at BENEFEDS.gov or 1-877-888-3337"],deadline:"60 days after retirement date \u2014 HARD DEADLINE",why:"Active duty dental ends at retirement. FEDVIP replaced the TRICARE Retiree Dental Program \u2014 no dental coverage is waiting on the other side unless you enroll.",link:"https://www.benefeds.gov/"},
  {id:"r-1-gar",mo:1,cat:"GUARD/RESERVE",pri:"HIGH",title:"Entering the Gray Area \u2014 Establish Your DFAS Future Retiree Account",brief:"Guard/Reserve with 20 good years: your link to retired pay runs through a myPay account most members never set up.",items:["Establish your Future Retiree myPay account at mypay.dfas.mil \u2014 easier now while your login is active","Keep contact info current in THREE systems: DFAS, DEERS, and your branch \u2014 updates do not transfer between them","DFAS sends a retired pay prompt at age 59 ONLY if your account has a current email on file","Retired pay is NOT automatic \u2014 apply through your service (Army: HRC Gray Area Retirements Branch, not DFAS) 9 months to 90 days before eligibility age","Gray area retains commissary, exchange, MWR access, and select TRICARE plans"],deadline:"Set up before losing routine myPay access",why:"Members who fall off the radar in the gray area face serious delays when retired pay eligibility arrives.",link:"https://www.dfas.mil/RetiredMilitary/plan/Gray-Area-Retirees/"},
  {id:"r-p1-fedvip",mo:-1,cat:"BENEFITS",pri:"HIGH",title:"FEDVIP Backstop \u2014 30 Days Left on the Window (Retirees)",brief:"If you retired without enrolling in FEDVIP dental/vision, the 60-day window is half gone.",items:["Enroll now at BENEFEDS.gov \u2014 after day 60 the next opportunity is Federal Benefits Open Season (Nov\u2013Dec)","Retiree TRICARE enrollment is also NOT automatic \u2014 retirement is a Qualifying Life Event with a 90-day enrollment period at tricare.mil"],deadline:"Day 60 after retirement date (FEDVIP); day 90 (TRICARE QLE)",why:"Two separate non-automatic enrollments \u2014 FEDVIP and retiree TRICARE \u2014 expire in your first 90 days out. Both are routinely missed.",link:"https://www.benefeds.gov/"},
````

## Appendix B - verbatim collision records

Entire divergent tails are retained below to prevent loss of wording, sources, caveats or amendment chains. Historic STAGED/OPEN/cache statements are reproduced as written; see current integration context above. New citations should use the source-qualified keys, not ambiguous bare V IDs.

### Clone VA math / BDD / SkillBridge

Source: `0433f333e1de16d2dfd06e0cad4cb9a1ba025008:intel/verification-log.md:903` through EOF; SHA-256 of verbatim tail: `4d2bf50380d6af8fafed263b78fd289efba2430a27e9d4110d456f516657bf64`.

````text
V-2026-016 | 02 SEP 2026 | VA combined-rating Table I reconciliation
Method: current primary-source direct read, full-table review, and exact code
comparison at clone HEAD 29593bf. Sources accessed 02 SEP 2026.
Rating: CONFIRMED | Source ladder: 1 (binding regulation and official VA)
Sources verified: 38 CFR 4.25, Combined Ratings Table,
https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A/section-4.25
| VA, About Disability Ratings,
https://www.va.gov/disability/about-disability-ratings/
Findings: Arrange disabilities from greatest to least. For each additional
rating, carry the whole-number value produced by Table I into the next
combination. After all ratings are combined, convert the final value once to
the nearest degree divisible by 10; a final value ending in 5 adjusts upward.
The live clone contained two calcVACombined implementations and the active
one carried decimal intermediate values. Vector [60,30,10] must carry
60 -> 72 -> 75, then convert once to 80. Claims that the app produces an
official result, that intermediate decimals are carried, or that a particular
rating is the goal are withheld.

IMPACT: SHIP — ACT | A2 | s2-intel | 02 SEP 2026 | revisit NONE
A1 population: SEPARATING (active component) · GUARD/RESERVE · ALREADY SEPARATED   band: condition-triggered; no single band   excluded: This does not apply to SPOUSE/FAMILY as the rated claimant.   timing: ACT AVAILABLE NOW
A2 act: "Use VA's Combined Ratings Table from highest to lowest and treat any Transition OPS result as unavailable until it matches Table I."
A3 surface(s): VA MATH · /va-math/   token: [VA MATH]   sweep trigger: FIRED calculator capability and worked-example claims
A4 cost: MONEY
EXPIRES: NONE

---

V-2026-017 | 02 SEP 2026 | BDD decision, effective-date, and exam claims
Method: current primary-source direct read and cross-source claim separation
at clone HEAD 29593bf. Sources accessed 02 SEP 2026.
Rating: CONFIRMED | Source ladder: 1 (binding regulation and official VA/DoD)
Sources verified: VA, Pre-discharge claim,
https://www.va.gov/disability/how-to-file-claim/when-to-file/pre-discharge-claim/
| Veterans Benefits Administration, Benefits Delivery at Discharge Program,
https://benefits.va.gov/BENEFITS/benefits-delivery-discharge-program.asp
| VA, VA claim exam,
https://www.va.gov/resources/va-claim-exam/
| 38 CFR 3.400, effective dates,
https://www.ecfr.gov/current/title-38/chapter-I/part-3/subpart-A/subject-group-ECFR429f47d98271c40/section-3.400
| VA, Disability effective dates,
https://www.va.gov/disability/effective-date/
| DoDI 1332.35, Transition Assistance Program for Military Personnel,
https://www.esd.whs.mil/Portals/54/Documents/DD/issuances/dodi/133235p.pdf?ver=2018-11-08-133557-850
Findings: The BDD filing window is 180 to 90 days before separation and VA
says the program may help speed a decision. VBA states a goal of a decision
within 30 days after separation; it is not a guarantee. Eligibility requires
availability for VA exams during the 45 days after filing. VA permits a member
to request rescheduling by contacting the VA medical center or contractor at
least 48 hours in advance and warns that rescheduling may delay the claim.
An effective date as early as the day after separation depends on an awarded
claim and governing effective-date rules; it is not a guaranteed Day-1 rating
or decision. DoDI 1332.35 supports duty-time release for required TAP
workshops and briefings, but does not establish priority for BDD exams or give
a Transition Assistance Office authority to override the chain of command.
Blanket post-discharge processing-time and delayed-compensation projections
are withheld for lack of a current source matching claim type and measurement
period.

IMPACT: SHIP — ACT | A2 | s2-intel | 02 SEP 2026 | revisit NONE
A1 population: SEPARATING (active component) · GUARD/RESERVE on qualifying full-time active duty   band: 6 Months Out · 3 Months Out   excluded: This does not apply to SPOUSE/FAMILY or ALREADY SEPARATED members as BDD claimants.   timing: ACT AVAILABLE NOW
A2 act: "File VA Form 21-526EZ through BDD on VA.gov while 180–90 days remain; with fewer than 90 days, file a standard disability claim instead."
A3 surface(s): CRITICAL WINDOWS · REMINDERS · TIMELINE · Navigator CORPUS/RULES · Lead Comms   token: [CRITICAL WINDOWS], [REMINDERS], [TIMELINE]   sweep trigger: FIRED Day-1, reschedule, priority, and processing-time claims
A4 cost: A CLOSED WINDOW
EXPIRES: NONE

---

V-2026-018 | 02 SEP 2026 | SkillBridge service/paygrade tier reconciliation
Method: current primary-source direct read, full-table review, and exact-copy
sweep at clone HEAD 29593bf. Sources accessed 02 SEP 2026.
Rating: CONFIRMED | Source ladder: 1 (current official service issuances/pages)
Sources verified: AR 600-81, 25 MAR 2026, Table 5-1,
https://home.army.mil/lee/9617/7922/2401/AR-600-81-2026.pdf
| AFI 36-2671, 31 MAR 2026, Table 1,
https://static.e-publishing.af.mil/production/1/af_a1/publication/afi36-2671/afi36-2671.pdf
| SPFI 36-2672, 31 MAR 2026, Table 1,
https://static.e-publishing.af.mil/production/1/hqsf/publication/spfi36-2672/spfi36-2672.pdf
| MARADMIN 280/24, 17 JUN 2024,
https://www.marines.mil/News/Messages/Messages-Display/Article/3809908/interim-guidance-on-the-implementation-of-the-skillbridge-program/
| USCG ALCOAST 202/26,
https://content.govdelivery.com/accounts/USDHSCG/bulletins/41eb992
| MyNavyHR, SkillBridge,
https://www.mynavyhr.navy.mil/Career-Management/Transition/SkillBridge/
Findings: Army, Air Force, Space Force, and Marine Corps standard published
tiers span 60 to 120 days. Coast Guard permits up to 180 days. Current Navy
guidance sets 180 days for E-5 and below, 120 days for E-6 through E-9 and
O-4 and below, and 90 days for O-5 and above; qualifying DIB/CBP/ICE programs
may receive up to 180 days regardless of paygrade. Approval authorities also
vary by service and paygrade. No source supplies a population denominator for
"most members rate 60-120 days" or similar prevalence language, so those
claims are withheld. This record closes and prospectively supersedes only the
Navy-source gap recorded in V-2026-015; the SHIP-A ruling and hardStartDay
-180 planning boundary remain in force.

IMPACT: SHIP — ACT | A2 | s2-intel | 02 SEP 2026 | revisit NONE
A1 population: SEPARATING (active component) · GUARD/RESERVE when service guidance permits   band: 18 Months Out · 12 Months Out · 9 Months Out · 6 Months Out · 3 Months Out   excluded: This does not apply to SPOUSE/FAMILY or ALREADY SEPARATED members.   timing: ACT AVAILABLE NOW
A2 act: "Use the current service instruction or MyNavyHR SkillBridge page applicable to you to confirm your maximum days and approval authority before setting a start date."
A3 surface(s): CRITICAL WINDOWS · REMINDERS · Navigator CORPUS · RESOURCES   token: [CRITICAL WINDOWS], [REMINDERS], [RESOURCES]   sweep trigger: FIRED "most members," "most rank categories," "many grades," and Navy source gap
A4 cost: A CLOSED WINDOW
EXPIRES: NONE
````

### Published OPM / FEDVIP

Source: `d82516389ed5906febad467cfe57887acda97053:intel/verification-log.md:903` through EOF; SHA-256 of verbatim tail: `7cb6e57d4072cedb39938569ef34f23277678dac3c2a4f9174eb1671156cabfb`.

````text
## V-2026-016 — OPM RIF and appeal rules IN FORCE 2 SEP 2026 (tense flip shipped)

- **Claim:** The four OPM final rules of 3 AUG 2026 took effect 2 SEP 2026. The
  shipped POLICY INTEL card still read "future law, not current law" in the
  future tense, wrong by tense as of 0000 2 SEP. A fifth rule — the MSPB's own
  jurisdictional withdrawal, effective the same day — was absent from the app.
- **Rating:** CONFIRMED
- **Verified by:** S2, 3 SEP 2026, rung 1 — Federal Register full text direct.
  MSPB rule read from the federalregister.gov public-inspection document.
  Orchestrator, 4 SEP 2026, live-edge verification only; the FR and MSPB
  sources were not re-derived and remain S2's attestation.
- **Verified date:** 3 SEP 2026 (sources) / 4 SEP 2026 (live edge)
- **Citations of record:**
  - "Reduction in Force," **Final Rule, FR doc 2026-15665**, 5 CFR 351,
    published 2026-08-03, effective 2026-09-02.
  - "Reduction in Force Appeals," **Final Rule, FR doc 2026-15666**, 5 CFR 351,
    published 2026-08-03, effective 2026-09-02.
  - "Probationary and Trial Period Termination Appeals," **Final Rule, FR doc
    2026-15654**, published 2026-08-03, effective 2026-09-02.
  - "Suitability Action Appeals," **Final Rule, FR doc 2026-15650**, 5 CFR 731,
    published 2026-08-03, effective 2026-09-02.
  - MSPB, "Appellate Jurisdiction Update II," **Final Rule, RIN 3124-AA33**,
    public-inspection doc **2026-16456**, effective 2026-09-02 — removes MSPB
    regulatory jurisdiction over probationary-termination, suitability, and RIF
    appeals; not applied to pending cases or to actions taken before the
    effective date; Foreign Service RIF jurisdiction (22 U.S.C. 4010a) retained.
- **No stay, injunction, or delay** was found against any of the five rules.
- **Shipped:** commit `0d71fc5`, branch `ops/opm-rif-in-force`, merged to `main`
  4 SEP 2026. Six string-literal edits to `index.html`, header and five verb
  phrases, plus the RIN 3124-AA33 companion cite. `sw.js` CACHE_NAME v129 to
  v130. No structural change, no new assertion beyond the citations above.
- **Preserved deliberately:** "RIF notices issued before 2 SEP 2026 are
  processed under the prior rules — the date on your notice decides which
  regime governs it." Per Dean's ruling of 9 AUG 2026 the card must never blend
  the two effective dates; that sentence stays permanently true and was not
  touched. Verified present at the live edge post-merge.
- **LIVE-EDGE VERDICT: PASS** (4 SEP 2026, production, post-publish).
  `future law, not current law` expected 0, got **0**. `IN FORCE, 2 SEP 2026`
  expected 1, got **1**. `sw.js` `transition-ops-v130` expected 1, got **1**.
  Full anchor sweep: all eight new anchors returned 1, all six retired strings
  returned 0, the retained notice-date line returned 1, and stale cache
  `transition-ops-v129` returned 0 at the edge. `origin/main`, local `main`, and
  `raw.githubusercontent.com/main` all at `0d71fc5` — no publish lag, no partial
  deploy.
- **OPEN — the 2 SEP tickler is only half closed.** The tickler ordered "Flip
  (b) and the card to present tense." The card shipped; **CORPUS (b) did not**.
  `netlify/functions/navigator.js` is live and still future tense: **line 25,
  RULE 16** instructs the model to "answer in the future tense" for CORPUS (b),
  and **line 190** reads "FUTURE LAW, effective 2 SEP 2026 — not current law,"
  carrying "will be ranked by" and "will receive 5 additional points." A member
  reading the card now gets the correct framing; a member asking the Navigator
  is told it is future law. The Navigator is being instructed to be wrong.
  The corpus carries the notice-date sentence in two places — preserved on any
  flip, per the same 9 AUG ruling.
- **Disposition:** card CLOSED and verified in production. Corpus (b) OPEN,
  COMMANDER lane, needs its own branch, a `policy-verification` pass against
  this entry, and `nav-token-regression`. No cache bump — `navigator.js` is a
  Netlify Function and backs no `ASSETS` entry. The tickler row above stays
  open until (b) ships.
- **Source entry:** `intel/V-2026-016-opm-rif-in-force.md`
- **Staged patch:** `patch-2026-09-03-opm-rif-tense-flip.md`

---

## V-2026-017 — Navigator corpus (b) and RULE 16 flipped to in force (STAGED)

- **Claim:** The Navigator's CORPUS (b) and RULE 16 still described the four OPM
  rules as future law after they took effect 2 SEP 2026. RULE 16 instructed the
  model to "answer in the future tense," so the Navigator was under standing
  orders to give a wrong answer while the POLICY INTEL card beside it read
  correctly. Recorded OPEN in [[V-2026-016]]; this entry is the fix.
- **Rating:** CONFIRMED
- **Sources:** unchanged from [[V-2026-016]] — FR docs 2026-15665, 2026-15666,
  2026-15654, 2026-15650, and MSPB RIN 3124-AA33 (FR public-inspection doc
  2026-16456), all verified by S2 on 3 SEP 2026. This patch asserts nothing
  beyond them. No re-derivation was performed for this entry.
- **Verified date:** 3 SEP 2026 (sources) / 4 SEP 2026 (edit evidence)
- **Commit:** `fa80e5d` on `ops/opm-rif-corpus-b`, base `0d71fc5`. Scope:
  `netlify/functions/navigator.js` only, two lines, seven edits.

| # | Edit |
|---|---|
| R16-1 | RULE 16: CORPUS (b) "take effect 2 SEP 2026 — answer in the future tense" to "are IN FORCE NOW as of 2 SEP 2026 — answer in the present tense" |
| C-1 | "FUTURE LAW, effective 2 SEP 2026 — not current law … all take effect that day" to "IN FORCE since 2 SEP 2026 … all took effect that day" |
| C-2 | "From 2 SEP 2026 employees will be ranked by" to "Since 2 SEP 2026 employees are ranked by" (date retained by Commander ruling) |
| C-3 | "or more will receive 5 additional points" to "or more receive" |
| C-4 | "RIF appeals will move from the MSPB to OPM and will be open only to" to "have moved … and are open only to" |
| C-5 | "appeals also move to OPM" to "appeals have also moved to OPM" |
| C-6 | MSPB carve-out ADDED per Commander ruling: Board jurisdiction over RIF, probationary-termination, and suitability appeals ended 2 SEP 2026; pending cases and pre-2-SEP actions stay with the Board; Foreign Service RIF jurisdiction (22 U.S.C. 4010a) retained |
- **Grep verdicts:** every `old_str` asserted before writing — all seven
  `old=1 / new=0`, aborting on mismatch; all seven post-edit `old=0 / new=1`.
  Presence: 11 new anchors at 1 each, including `RIN 3124-AA33`,
  `public-inspection doc 2026-16456`, and `(22 U.S.C. 4010a)`. Absence: 0 each
  for `answer in the future tense`, `FUTURE LAW`, `not current law`,
  `all take effect that day`, `From 2 SEP 2026 employees will be ranked by`,
  `will receive 5 additional points`, `will move from the MSPB`,
  `will be open only to`, `appeals also move to OPM`.
- **Preserved by Commander ruling, verified present after the edits:** the
  notice-date-controls clause in **both** places it appears (count 2, lines 25
  and 190, neither inside any match window); `NEVER describe both in one undated
  present tense.`; `TWO OPM EFFECTIVE DATES — NEVER BLEND THEM`; and
  `CORPUS (c) … IN FORCE NOW as of 6 AUG 2026`.
- **nav-token-regression: PASS, exit 0** — 16 tokens in three-way MAP /
  MANIFEST / LIVE_TOKENS sync, 6 bracketed CORPUS headers all mapped, identical
  to the pre-edit baseline. Encoding PASS (zero curly quotes, zero U+00A0),
  `node --check` OK, untouched-region PASS (one file).
- **No cache bump, proven not assumed:** the ASSETS-backed path check returns
  empty and `sw.js` is absent from the diff. `navigator.js` is a Netlify
  Function and backs no `ASSETS` entry. `CACHE_NAME` stays `transition-ops-v130`.
- **PREVIEW VALIDATION: NOT PERFORMED.** No result exists and none could. The
  commit `fa80e5d` is local only; `origin/ops/opm-rif-corpus-b` carries
  `0d71fc5`, which is main's tip and therefore the PRE-edit branch. Netlify has
  never built an artifact containing this change, so no branch deploy of it can
  have been exercised. **PREVIEW WARRANTED** and still owed: the honest test is
  to ask the deployed Navigator a RIF question and read the tense back. Static
  checks prove structure and citation integrity, never answer quality.
- **Disposition:** STAGED, COMMANDER lane, unmerged. Not in production.
- **Tickler [[V-2026-009]] — NOT closed in full.** The card half closed on
  4 SEP 2026 (V-2026-016, `0d71fc5`, verified at the live edge). The corpus half
  is authored and gated but unmerged, so the shipped Navigator still answers in
  the future tense. The tickler closes when `fa80e5d` reaches `main`, not when
  it is written. The row above is marked STATUS accordingly.

---

## V-2026-017 — AMENDMENT, 4 SEP 2026 (preview verdict, merge, live-edge sweep)

Supersedes three statements in [[V-2026-017]] above, each of which was true when
written and is now overtaken: **PREVIEW VALIDATION: NOT PERFORMED**;
**Disposition: STAGED … Not in production**; and **Tickler [[V-2026-009]] — NOT
closed in full**. The entry body is left as written; this amendment carries the
change.

- **Merged:** `fa80e5d` reached `main` via merge commit `e33792c`. Netlify
  production deploy `6a9ac67e03841e00086d10c4`, commit `e33792c`, state `ready`,
  published 2026-09-04 13:24Z. Corpus (b) and RULE 16 are in production.

### PREVIEW VALIDATION: PASS

Performed by the Commander against the branch deploy
`https://ops-v-2026-017-corpus-b-record--veteranbridge-tools.netlify.app`
(deploy `6a9abd3cfd8ab300085987a7`, commit `e33792c`, `ready`, built
2026-09-04 12:44Z) **before** the merge. Two questions, both PASS.

- **Q1, RIF retention.** The answer led *"RETENTION PREFERENCE IN A RIF — IN
  FORCE SINCE 2 SEPTEMBER 2026"* and stayed in the present tense throughout.
  Ranking, preference points, and appeals content correct. The MSPB carve-out
  was stated. The notice-date rule was flagged CRITICAL. The 6 AUG
  performance-rating rule was kept separate with its own date — RULE 16's
  NEVER BLEND THEM guardrail holding under live conditions, which is the
  behaviour the guardrail exists to produce and the reason it was left standing.
- **Q2, pending MSPB appeal.** Correctly stated that a pending case stays with
  the Board, that the notice date decides the regime, and closed with a
  confirm-your-notice-date next step. This is the exact question the C-6
  carve-out was added to answer, and it could not have been answered before.

### LIVE PRODUCTION VERIFICATION: PASS

Run by the Orchestrator against `https://transitionops.org` after Netlify
published `e33792c`. Independent of the S2 codeload sweep, and of the preview.

- **Navigator corpus, read from the live edge** (`/netlify/functions/navigator.js`,
  HTTP 200, 55,062 bytes): nine new anchors at **1** each, including
  `are IN FORCE NOW as of 2 SEP 2026 — answer in the present tense`,
  `IN FORCE since 2 SEP 2026`, `Appellate Jurisdiction Update II, RIN 3124-AA33`,
  `public-inspection doc 2026-16456`, and
  `Foreign Service RIF jurisdiction (22 U.S.C. 4010a)`. Seven retired strings at
  **0** each, including `answer in the future tense`, `FUTURE LAW`, and
  `not current law`.
- **Preserved, verified live:** notice-date-controls clause **2** (both places);
  `NEVER describe both in one undated present tense.` **1**;
  `TWO OPM EFFECTIVE DATES — NEVER BLEND THEM` **1**.
- **Card, re-confirmed unchanged:** `IN FORCE, 2 SEP 2026` **1**,
  `future law, not current law` **0**, `sw.js` `transition-ops-v130`.
- **Log entries live:** V-2026-016 **1**, V-2026-017 **1**. Navigator function
  endpoint reachable (HTTP 405 on GET, POST-only).

### OBSERVATION — candidate corpus clarification, NOT part of this action

In the Q1 preview answer the Navigator glossed 3-point preference eligibility as
*"service-connected disability of any percentage, or Purple Heart."* That is an
elaboration beyond corpus text, which says only *"other preference eligibles 3,"*
and it omits other preference-eligible categories under **5 U.S.C. 2108**. Ruled
by the Commander as **not a defect and not part of this action**. Logged as a
**candidate corpus clarification** for a future pass: enumerate the 5 U.S.C. 2108
categories in CORPUS (b), or instruct the model not to enumerate them, so the
answer stops narrowing the class on its own. No change made here, and no
verification of the 2108 categories was performed for this entry.

- **Disposition:** CLOSED. Both halves of the 2 SEP tickler shipped and verified.
- **Tickler [[V-2026-009]]: CLOSED 4 SEP 2026.** The row above is flipped from
  STATUS to CLOSED. Card closed via V-2026-016 (`0d71fc5`); corpus (b) and
  RULE 16 closed via this amendment (`fa80e5d`, merged as `e33792c`).

---

## V-2026-018 — FEDVIP enrollment window + Gray Area Future Retiree rungs (STAGED)

- **Claim:** The reminder ladder had no rung for the FEDVIP dental/vision
  enrollment window (opens 31 days before a retirement date, closes 60 days
  after, enrollment not automatic) and no rung for Guard/Reserve members
  entering the gray area with 20 good years. Both are hard-deadline,
  non-automatic actions with no in-app prompt.
- **Rating:** CONFIRMED
- **Sources:** as asserted in `intel/patch-2026-09-04-fedvip-gar-ladder.md`,
  eleven claims marked VERIFIED by S2 on 4 SEP 2026 — benefeds.gov ABO FAQ and
  FEDVIP Fact Sheet (OPM-sponsored, primary), myairforcebenefits.us.af.mil
  (.mil), dfas.mil Gray Area Retirees guide (primary, updated Mar 2026),
  Army Echoes Aug–Oct 2026 (DFAS Cleveland and TRICARE Communications bylines),
  soldierforlife.army.mil Army Service Center, MOAA citing DFAS (Apr 2026),
  tricare.mil/LifeEvents/QLE. Patch records no stays, injunctions, or pending
  rule changes found on 4 SEP 2026.
- **NOT RE-DERIVED FOR THIS ENTRY.** This record covers the *application* of the
  patch, not its sourcing. No primary source was re-read during execution and no
  URL was fetched. The CONFIRMED rating rests entirely on the S2 pass the patch
  asserts. If that pass is not itself logged, this entry does not substitute
  for it.
- **Verified date:** 4 SEP 2026 (sources, per patch) / 4 SEP 2026 (edit evidence)
- **Commit:** `0e93163` on `ops/fedvip-gar-ladder`, base `b405193` (main's tip).
  Scope: `index.html` (+3), `sw.js` (1 line), and the patch file itself.
  Three str_replace operations, no other changes.

| # | Edit |
|---|---|
| OP 1 | `index.html` — inserted rungs `r-1-fedvip` (CRITICAL, BENEFITS, mo:1) and `r-1-gar` (HIGH, GUARD/RESERVE, mo:1) immediately after `r-1-final` |
| OP 2 | `index.html` — inserted rung `r-p1-fedvip` (HIGH, BENEFITS, mo:-1) immediately after `r-p1`; TRICARE QLE 90-day period folded into this rung rather than given its own |
| OP 3 | `sw.js` — `CACHE_NAME` `transition-ops-v130` → `transition-ops-v131` |

- **Grep verdicts — pre-write:** the patch's three anchor assertions each
  returned exactly 1 (`10x harder without base access`,
  `bridge income depending on your state`, `transition-ops-v130`); abort was
  armed on any other count. A fourth gate not called for by the patch was added:
  each `old_str` had to occur exactly once in its target file — all three
  returned 1, so no replacement target was ambiguous. Nothing was written until
  all gates cleared.
- **Grep verdicts — post-write:** presence `r-1-fedvip` 1, `r-1-gar` 1,
  `r-p1-fedvip` 1, `transition-ops-v131` 1. Absence `transition-ops-v130` 0.
  Ladder order confirmed by id sequence: `r-1-final` → `r-1-fedvip` → `r-1-gar`
  → `r-0-ets`, and `r-p1` → `r-p1-fedvip` → `r-p4`.
- **Escape integrity, proven not assumed:** the new rungs carry literal
  `\u26A0\uFE0F` and `\u2014` sequences that had to survive as backslash escapes,
  not glyphs. `old_str`/`new_str` were extracted programmatically from the patch
  file rather than retyped, so no transcription path existed. Witness: literal
  `\u26A0` 20 → 21 (+1, the one new title), real `⚠️` character 1 → 1
  (unchanged — nothing was converted). Per-op `\u` delta was computed from the
  strings themselves and re-checked against the actual file delta after each
  write, aborting on mismatch. Delimiters balanced: `{`/`}` +2/+2 and +1/+1,
  `[`/`]` likewise, quote deltas even (54, 20).
- **Syntax:** `node --check sw.js` OK. All three inline `<script>` blocks in
  `index.html` parse clean and parse *identically* before and after the edit
  (plain JS, no JSX/Babel, so this is a true parse test, not a lint).
- **Cache-name sequence — no live collision. Correcting an earlier claim in
  this session.** A survey of `CACHE_NAME` at every local and remote branch tip
  shows **no branch but this one holds `transition-ops-v131`**. The string
  appears only inside the *history* of `ops/openai-parallel-clone`: `cfa5f52`
  (30 AUG 2026) bumped v130→v131, `93b3545` moved v131→v132, the branch climbed
  to v140, and `4377a6b` "Correct service-worker cache sequence" (31 AUG 2026)
  wound it back to **v130**, where its tip sits today. An earlier `git log -S`
  probe returned "2 commits" for v131 and was reported as a live claim on that
  name; that was wrong. `-S` counts commits where a string's occurrence count
  *changed*, so it matched the commit that created v131 and the one that removed
  it, neither of which is reachable as a value at the tip.
- **The real cache exposure, which that error obscured.**
  `ops/openai-parallel-clone` is unmerged, **61 commits ahead of main**, and its
  tip `CACHE_NAME` is `transition-ops-v130` — *identical to main's*. Merging it
  as-is ships no cache bump at all, so returning users keep a stale service
  worker. Merging it after this branch would additionally regress v131 → v130.
  This branch's own v130 → v131 bump is correct against main and is unaffected.
  Merge order and a re-bump on `ops/openai-parallel-clone` need a Commander
  ruling.
- **PREVIEW VALIDATION: NOT PERFORMED.** Commit `0e93163` is local only and was
  not pushed. No `origin/ops/fedvip-gar-ladder` ref exists, so Netlify has never
  built an artifact containing these rungs and no branch deploy of them can have
  been exercised. Static checks prove structure and encoding, never render.
- **Rungs render but do not fire.** Per the patch's own note, the in-app
  ETS-triggered local alert channel remains INERT — these rungs appear on the
  timeline and will not produce a notification until that channel is fixed
  (same gate as `ops/vgli-tail-reminders`). A member who does not open the app
  gets nothing.
- **Anchor caveat carried forward:** rungs are anchored to the member's
  separation date, which equals the retirement date for retirees. No separate
  retirement-date anchor was built. Design ruling remains open if the two ever
  need to diverge.
- **member-impact: NOT RUN.** The skill requires a SHIP/DECLINE assessment after
  a CONFIRMED rating and before copy is drafted. The patch carries source
  verification but no member-impact section, and none was performed during
  execution. Owed before merge.
- **Disposition:** STAGED, COMMANDER lane (benefits content + deploy pipeline),
  unmerged, unpushed. Not in production. `main` remains at `b405193` and
  contains zero of these ids.
- **Execution incident, recorded for the pattern:** the three edits sat
  uncommitted across a session boundary. GitHub Desktop auto-stashed them on a
  branch switch (`stash@{0}: On ops/fedvip-gar-ladder: !!GitHub_Desktop`) and
  left HEAD on `main` with a clean tree, which reads as total loss on first
  inspection. Recovered whole from the stash and verified byte-identical by the
  escape and delimiter witnesses above. This is the third GitHub_Desktop stash
  of this shape in the log's recent history. **Standing correction: agent work
  gets committed to its branch in the same session it is written, never left
  uncommitted for a later turn.**
````

## Applied-state verification - measured snapshot (separate from recommendations)

Captured UTC: 2026-09-07T14:28:14.447030+00:00. HEAD remains 0433f333e1de16d2dfd06e0cad4cb9a1ba025008. This is a working-tree source comparison, not a new frozen release candidate, app test pass, merge or release approval. S3 may continue editing; hashes below invalidate affected rows on change.

Authorization update: parent explicitly selected inactive supplemental hardening. This supersedes the earlier separate-follow-up recommendation for integration selection only. The supplemental set remains separately counted, never folded into weekend 31.

| Weekend row | Measured status | Evidence IDs | Actual disposition |
|---|---|---|---|
| 1 | APPLIED-ADAPTED | E25, E26, E44 | Exact published card; legacy worker preserved, historical cache bump not replayed. |
| 2 | APPLIED | E11, E40 | Source record and original verification tail preserved. |
| 3 | APPLIED-ADAPTED | E27, E28, E36, E37, E38 | Two policy lines transferred to mjs; other clone declarations unchanged. |
| 4 | RETAINED-HISTORY | E40, E41 | Staged record retained with later closure. |
| 5 | CONTENT-ACCOUNTED | E27, E28, E40 | Merge first-parent policy delta present once. This does not assert a merge commit or ancestry update occurred. |
| 6 | RETAINED-HISTORY | E40, E41 | Exact V-017 amendment and final tickler; historical preview is not current acceptance. |
| 7 | APPLIED-ADAPTED | E22, E23, E24, E12, E35 | Exactly three full objects; other clone policy lines retained. |
| 8 | RETAINED-QUALIFIED | E40, E39 | Both V-018 identities preserved, full source SHA provenance present. |
| 9 | RETAINED-HISTORY | E19 | Exact production baseline, no new benchmark claimed. |
| 10 | APPLIED | E29 | Both production preconnect lines preserved. |
| 11 | APPLIED | E29 | Exact nonblocking stylesheet and noscript fallback preserved; no new speed claim. |
| 12 | COVERED-BY-REMOVAL | E43, E20 | No SDK/init to catch; historical entry preserved. |
| 13 | RETAINED-HISTORY | E20, E44 | Final historical log retained; old worker version not replayed. |
| 14 | RETAINED-HISTORY | E14 | Exact production diagnosis retained. |
| 15 | APPLIED | E30, E15 | Exact main date helper preserved. |
| 16 | APPLIED-FINAL-INACTIVE | E31, E32, E33, E42 | Final published evaluator replaces transient engine; dispatch dormant. |
| 17 | SUPERSEDED-SAFELY | E59, E42, E15 | Supplemental hardening replaces old mark-before-show implementation; no ETS-edit caller added. |
| 18 | KEPT-INACTIVE | E42, E15 | No mount/evaluation caller imported. Source history retained. |
| 19 | APPLIED | E34 | Exact production comparator including day-rung tie-break. |
| 20 | RETAINED-AND-SUPERSEDED | E15, E61, E44 | Old loop history retained; corrected supplemental manual recipe replaces obsolete +45 expectation. |
| 21 | APPLIED-HARDENED-INACTIVE | E59, E42, E13 | Per-open/daily caps retained in hardened notifier; legacy worker preserved. |
| 22 | APPLIED | E31, E32, E33, E21 | Exact final due/stale code and historical S2 values record. |
| 23 | RETAINED-HISTORY | E17 | Final production baseline file retained, including amendments. |
| 24 | APPLIED-ADAPTED | E10, E50 | PAO exact main; mjs synthetic env gate before provider/client, no gap persistence. |
| 25 | APPLIED | E10 | PAO failure/marker/duplicate-reporter controls exact main. |
| 26 | SPLIT-DISPOSITION | E5, E47, E48 | J1 retry preserved; Navigator provider retry deliberately not ported, clone zero-retry contract retained. |
| 27 | APPLIED | E2, E5, E6, E7, E8, E9, E10 | Wrapper and all workflow callsites exact main; best-effort dedupe caveat retained. |
| 28 | APPLIED | E1, E5, E6, E7, E8, E9, E10 | All main metering records and J5 fleet inventory retained; estimate is not provider billing. |
| 29 | BLOCKED-POLICY | E51, E18 | Dynamic per-invocation logging not ported because current closed-marker gate prohibits its fields. Compliant proposal below; no silent omission. |
| 30 | RETAINED-HISTORY | E18 | Re-score history preserved; does not grant new mjs observability credit. |
| 31 | APPLIED | E3, E4, E9, E18 | Exact production analyser/tests/integration; coverage/estimate limits preserved. |

**Accounting:** 31/31 weekend rows have measured dispositions; 1 unresolved row(s): 29. No unresolved row is counted as preserved/complete.

| Supplemental row | Measured status | Evidence IDs | Actual disposition |
|---|---|---|---|
| S1 | APPLIED-INACTIVE/TEST-ADAPTED | E61, E65, E66 | Corrected recipe and final synthetic verification source retained. |
| S2 | APPLIED-INACTIVE/TEST-ADAPTED | E53, E54, E55, E56, E57, E58, E64, E42 | Final durable ledger helpers preserved with OFF boundary. |
| S3 | APPLIED-INACTIVE/TEST-ADAPTED | E59, E42, E60, E62, E63 | Native-lock notifier preserved plus explicit OFF return; historical tests retained, not rerun by this audit. |

### Row 29: explicit BLOCKED-POLICY and implementation proposal

Production `382afd8e24e63372428248b0a30fb802b4209e99:netlify/functions/navigator.js` adds a dynamic `navLog` record with outcome, HTTP status, timestamp-derived latency, attempts, turns, usage tokens and dry_run. Current `.agents/skills/runtime-ai-spend-governance/SKILL.md:155` forbids logging request/response/usage/denial details outside its closed diagnostic boundary; lines 225-229 require one compile-time literal argument and prohibit status, usage, request, model and timestamp. The canonical .claude copy carries the same restriction.

**Measured:** no navLog/console logger exists in current navigator.mjs. This is deliberate conflict containment, not preservation of the production observability feature. Its source commit remains reachable and its exact fleet-loop history is retained. No policy waiver follows from the user preservation request.

**Conforming proposal:** retain the existing closed terminal-failure phase markers only, at their established shared-client/budget emission sites, with one fixed literal argument and existing terminal precedence; use synthetic returned outcomes/test evidence for per-path verification without application logging of status/usage/turns. Do not add a new marker vocabulary, success/preflight log or per-invocation metric. This cannot reproduce the old per-invocation feature in full. Parent must explicitly retain the old feature as superseded by current policy, or obtain a separately approved governance change if full dynamic telemetry is still wanted. Until that disposition is recorded, row 29 stays BLOCKED-POLICY.

### Source comparison evidence

| ID | Result | Comparison / exact source location |
|---|---|---|
| E1 | MATCH | .github/scripts/emit-metering.sh:1; SHA-256 6a5e22d5bffef25cc0a9617023f7d628af9cc9c55588e2d7526d26721d419822; main blob 6a5e22d5bffef25cc0a9617023f7d628af9cc9c55588e2d7526d26721d419822 |
| E2 | MATCH | .github/scripts/gh-retry.sh:1; SHA-256 1368c3c38112c1315fed4a92891054c7df1e11fbb1a5bc23b41abd61db38789f; main blob 1368c3c38112c1315fed4a92891054c7df1e11fbb1a5bc23b41abd61db38789f |
| E3 | MATCH | .github/scripts/j5-metering-median.py:1; SHA-256 11752fc789c8d0ceadc35a1e023bfb489e623a1f56bb98929f36c5eafd370376; main blob 11752fc789c8d0ceadc35a1e023bfb489e623a1f56bb98929f36c5eafd370376 |
| E4 | MATCH | .github/scripts/tests/test-j5-metering-median.py:1; SHA-256 e728d266ccafb5906f9d4db4000f4d58fa9f4d721ab06c4de0485b22d0bca913; main blob e728d266ccafb5906f9d4db4000f4d58fa9f4d721ab06c4de0485b22d0bca913 |
| E5 | MATCH | .github/workflows/j1-federal-scan.yml:1; SHA-256 440c01b8d7aec51635374ac83ef7ea4ca2bb5008d0ba6eb34e858e4506efab46; main blob 440c01b8d7aec51635374ac83ef7ea4ca2bb5008d0ba6eb34e858e4506efab46 |
| E6 | MATCH | .github/workflows/j2-weekly-analysis.yml:1; SHA-256 3bb60575d45fba81c96c060d123c1b7cc11ee3ccc4e32936b0d488a239c9f1d6; main blob 3bb60575d45fba81c96c060d123c1b7cc11ee3ccc4e32936b0d488a239c9f1d6 |
| E7 | MATCH | .github/workflows/j3-weekly-sitrep.yml:1; SHA-256 0d931a60bba8812818b9ed2d4f953bb456d247f16623ebe4d7362fa5dc3f7ec8; main blob 0d931a60bba8812818b9ed2d4f953bb456d247f16623ebe4d7362fa5dc3f7ec8 |
| E8 | MATCH | .github/workflows/j4-link-audit.yml:1; SHA-256 225cc68c65f0ee64b8592fe6a731f51ac8df876c3ed44ba9bdcf56e840a3b234; main blob 225cc68c65f0ee64b8592fe6a731f51ac8df876c3ed44ba9bdcf56e840a3b234 |
| E9 | MATCH | .github/workflows/j5-spend-check.yml:1; SHA-256 75d6106aa42fd7fba2a6b36da19a30464375c6378f1f2d10bfe527435a49d3d3; main blob 75d6106aa42fd7fba2a6b36da19a30464375c6378f1f2d10bfe527435a49d3d3 |
| E10 | MATCH | .github/workflows/pao-weekly-packet.yml:1; SHA-256 20fdf249e49d01042450e799465292ce420796f447476771f3fd48d8c5fa0658; main blob 20fdf249e49d01042450e799465292ce420796f447476771f3fd48d8c5fa0658 |
| E11 | MATCH | intel/V-2026-016-opm-rif-in-force.md:1; SHA-256 171d7943971fc77a23f4861696234f9db85eb92ad00a9f41da3abc0b87734bcb; main blob 171d7943971fc77a23f4861696234f9db85eb92ad00a9f41da3abc0b87734bcb |
| E12 | MATCH | intel/patch-2026-09-04-fedvip-gar-ladder.md:1; SHA-256 2b270248c8ac474fa9ae94590b9586acfd7ff34982c0c7c071a14d9a07d91f37; main blob 2b270248c8ac474fa9ae94590b9586acfd7ff34982c0c7c071a14d9a07d91f37 |
| E13 | MATCH | scratchpad/alert-burst-incident.md:1; SHA-256 8533ab36c9f84a1087564d6401b1bb328bac24dff421dffa7df20e169cfeecee; main blob 8533ab36c9f84a1087564d6401b1bb328bac24dff421dffa7df20e169cfeecee |
| E14 | MATCH | scratchpad/alert-channel-forensics.md:1; SHA-256 e27f849a2cdbd5b7686b808b13d58e85cc9bb2d149fa6f2902c7b7c7ef8e695b; main blob e27f849a2cdbd5b7686b808b13d58e85cc9bb2d149fa6f2902c7b7c7ef8e695b |
| E15 | MATCH | scratchpad/alert-channel-loop-log.md:1; SHA-256 a3587a9b50ed0d692ebecd288aa980792e9dcce86d081d8991b35757ebd17d06; main blob a3587a9b50ed0d692ebecd288aa980792e9dcce86d081d8991b35757ebd17d06 |
| E16 | MATCH | scratchpad/alert-channel-manual-test.md:1; INTENTIONAL SUPERSESSION: current recipe equals c395c45 exactly, not d825163; original remains in git and row 20 records replacement. |
| E17 | MATCH | scratchpad/fleet-baseline.md:1; SHA-256 78cc9ab88f6af9d5efee6016558c1c91d52630e16b99be310ac5dede214d5068; main blob 78cc9ab88f6af9d5efee6016558c1c91d52630e16b99be310ac5dede214d5068 |
| E18 | MATCH | scratchpad/fleet-loop-log.md:1; SHA-256 5283ff8c14b400e4166cb90d31cff514702643cf7a19c5c7b1a49a4116f6f2a3; main blob 5283ff8c14b400e4166cb90d31cff514702643cf7a19c5c7b1a49a4116f6f2a3 |
| E19 | MATCH | scratchpad/quality-loop-baseline.md:1; SHA-256 7a1c551e63c2262f0ea81ce3655848ad77d02637e3902d06d2ee9e22b6e43ff6; main blob 7a1c551e63c2262f0ea81ce3655848ad77d02637e3902d06d2ee9e22b6e43ff6 |
| E20 | MATCH | scratchpad/quality-loop-log.md:1; SHA-256 14464778435b01ab2a1685f95fa8e306e16cb55ba2f4d597710fe19f37415cb8; main blob 14464778435b01ab2a1685f95fa8e306e16cb55ba2f4d597710fe19f37415cb8 |
| E21 | MATCH | scratchpad/staleness-tiers.md:1; SHA-256 087788c2ee612d7065a64ae35b88516316552fd39cd0a2221eba356aff967c4e; main blob 087788c2ee612d7065a64ae35b88516316552fd39cd0a2221eba356aff967c4e |
| E22 | MATCH | index.html:2972; exact source line 8c3a14b59d1ee0caa94d2e753f1d800d4fb78308944940419e822bcc475eabdd; count 1 |
| E23 | MATCH | index.html:2973; exact source line bbbc14587ae419eb61bf249db37618580ac7f876c4f347bb5fe787a2b0080a4a; count 1 |
| E24 | MATCH | index.html:2976; exact source line 3ff2734eb0ef0a8746cdb4a488ac0c37dd0022e3569abe7ec2425fded43c5953; count 1 |
| E25 | MATCH | index.html:5568; exact source line 8160985987bc5be6f8d07364e36540684323dfba808452717b69eb61ab4ab245; count 1 |
| E26 | MATCH | index.html:5569; exact source line c904a35fb4a9917f598ec2c3b4c14f640287285a55e55f973be4c771fce360e3; count 1 |
| E27 | MATCH | netlify/functions/navigator.mjs:30; exact source line 2cb8652acf918ab15763fe3d2b1346321106a854f201a57a531794bac20c8733; count 1 |
| E28 | MATCH | netlify/functions/navigator.mjs:195; exact source line 398d1d542b688553b5c33cdcadb59a666fa4214fb255ac987adc98dbbc1101b2; count 1 |
| E29 | MATCH | index.html:104; exact full production font block SHA-256 fbafcc33185b7f52b86e6a85be13cfddb5ebad97a477ca64e937855b327cb9e2 |
| E30 | MATCH | index.html:3377; function source SHA-256 0c1c95a540133dd396cdcf2e2679496f06889e73bb30fd32ca86b05b5096288a; expected 0c1c95a540133dd396cdcf2e2679496f06889e73bb30fd32ca86b05b5096288a |
| E31 | MATCH | index.html:3024; function source SHA-256 ec27ae8cbac0aaca468318d07d11ee59883afd3d36170767dbc97244b1c0d5b5; expected ec27ae8cbac0aaca468318d07d11ee59883afd3d36170767dbc97244b1c0d5b5 |
| E32 | MATCH | index.html:3031; function source SHA-256 0629f306952e54b79ca1048358a47bb5851842aac0f9cd24ea5705755a963e52; expected 0629f306952e54b79ca1048358a47bb5851842aac0f9cd24ea5705755a963e52 |
| E33 | MATCH | index.html:3050; function source SHA-256 5e0aa1637f897bd402a78888e23dd843a028e71997312f4f950b20da2fef969d; expected 5e0aa1637f897bd402a78888e23dd843a028e71997312f4f950b20da2fef969d |
| E34 | MATCH | index.html:3063; function source SHA-256 941d6b461b92668d7872728ffdbc18e3cccd0e99113e5c8466dccd70a0279f6c; expected 941d6b461b92668d7872728ffdbc18e3cccd0e99113e5c8466dccd70a0279f6c |
| E35 | MATCH | git diff 0433f333e1de16d2dfd06e0cad4cb9a1ba025008 -- index.html: removed/replaced clone lines 4; exactly 4 expected (font link, date helper, OPM header/body). All other clone lines preserved in order. |
| E36 | MATCH | netlify/functions/navigator.mjs:11; clone declaration retained except exact OPM line; normalized SHA-256 8d1b7af6791094a249c76a485dc161f89b280a3b3cb59208e8f766eacae8df1c |
| E37 | MATCH | netlify/functions/navigator.mjs:120; clone declaration retained except exact OPM line; normalized SHA-256 d1d5182490179a982c1086b1d16be390abe095067b10a1a683f33214236d6399 |
| E38 | MATCH | netlify/functions/navigator.mjs:37; clone declaration retained; normalized SHA-256 b83bc69cbb4132a426bcff98214e4061ce0d760bbea5e4ef2cbafffb486d6da9 |
| E39 | MATCH | intel/verification-log.md:912; exact clone tail SHA-256 4d2bf50380d6af8fafed263b78fd289efba2430a27e9d4110d456f516657bf64; full source SHA named in provenance |
| E40 | MATCH | intel/verification-log.md:1016; exact main tail SHA-256 7cb6e57d4072cedb39938569ef34f23277678dac3c2a4f9174eb1671156cabfb; full source SHA named in provenance |
| E41 | MATCH | intel/verification-log.md:598; exact final production tickler row |
| E42 | MATCH | index.html:486; notifier OFF guard at index.html:3148; notifier name occurrences 1 (declaration only) |
| E43 | MATCH | index.html: no OneSignal.init or requestPermission call |
| E44 | MATCH | sw.js:1; exact clone SHA-256 45a4f093d7a19d4403cdaa5da0e6d6ae0a7ae497080fe92694046be789108d32 |
| E45 | MATCH | OneSignalSDKWorker.js:1; exact clone SHA-256 2f213985d10e5c5117acfde4f0cab00ad2c13035577ef38c7f0d86d2dd722fbc |
| E46 | MATCH | push/onesignal/OneSignalSDKWorker.js:1; exact clone SHA-256 c0dff569138a3876f942c7c931f4c3a1b812399565337d87d426207a26c4d69a |
| E47 | MATCH | netlify/functions/_shared/openai-client.cjs:1; exact clone SHA-256 f48dc815e1dd97b09a3a5dbdb484254aae60a3d35e62c50a2776eb38062520ca |
| E48 | MATCH | netlify/functions/_shared/openai-budget.cjs:1; exact clone SHA-256 c011445dd8551d4e9f6dea863cd46117c9dfa58f24c9bfec5af5cf6af093b772 |
| E49 | MATCH | netlify/functions/resume.mjs:1; exact clone SHA-256 5d356db08ca2586af176819effd591966444f6131581cf5b91265c531a35a54c |
| E50 | MATCH | netlify/functions/navigator.mjs:324; before client; no recordGap; existing S3 openai-migration-final.log:5 reports dry-run test PASS, not rerun here |
| E51 | BLOCKED-POLICY | netlify/functions/navigator.mjs contains no console logging/navLog. Production 382afd8 dynamic outcome/status/ms/attempts/turns/tokens/dry_run conflicts with runtime-ai-spend-governance/SKILL.md:155 and :225. BLOCKED-POLICY; source retained in git and fleet history. |
| E52 | MATCH | index.html:3087; exact c395c45 helper SHA-256 8c05aaf76283727e7713296242658b9f60ab18a3ef4a71cb81110020457cd303 |
| E53 | MATCH | index.html:3094; exact c395c45 helper SHA-256 a10f2ca323674b82654c1a58aceb6445d5f04679e979d0986994f0db4dd05076 |
| E54 | MATCH | index.html:3098; exact c395c45 helper SHA-256 84b8aa10501fce63fe6ed1e9bdd828391c5fc9498d2642d58c0c671e089f1f54 |
| E55 | MATCH | index.html:3103; exact c395c45 helper SHA-256 26f8e8f9659112da179763faf49b41c8b4c9f090df95036f1797942924cd04d0 |
| E56 | MATCH | index.html:3109; exact c395c45 helper SHA-256 355bcd2ace94b4a4ce1f23b8000fcf3ab4c9673dfb246f104fabb5e20f796443 |
| E57 | MATCH | index.html:3120; exact c395c45 helper SHA-256 f9705a7c96d3d18aba90cb9b65d6e35142782d1301352de048d34264564ba952 |
| E58 | MATCH | index.html:3137; exact c395c45 helper SHA-256 108a22da2b9f400822b5acd6cb042c82f4736b0aa0284bb8fe29413b16ff24c1 |
| E59 | MATCH | index.html:3148; exact c395c45 notifier except one explicit OFF-return line; native lock/ledger held intact |
| E60 | MATCH | scratchpad/alert-browser-test.cjs:1; exact c395c45 after removing only documented test-fixture activation; all prior assertions retained; SHA-256 72742026f899cfe2816251d4bc23bfd84fedb2c55d4f38a78c385cc03f830def |
| E61 | MATCH | scratchpad/alert-channel-manual-test.md:1; exact c395c45 bytes; SHA-256 6be50c4f5c305c21e407ceec3808a72e33e24eca5aae890d1746fac8de1c3134 |
| E62 | MATCH | scratchpad/alert-hardening-loop-log.md:1; exact c395c45 bytes; SHA-256 f30b386cabf7abfaae795c79400cb857708b47101755182822cb332f1f4e9b01 |
| E63 | MATCH | scratchpad/alert-hardening-sitrep.md:1; exact c395c45 bytes; SHA-256 18acc5e4cf36aa737532c1d2ac0cff8d9c34e7483bffa1aa4832be3a4a17111d |
| E64 | MATCH | scratchpad/alert-persistence-test.cjs:1; exact c395c45 after removing only documented test-fixture activation; all prior assertions retained; SHA-256 9b3b195033c102f59dc2cdba405616e803d25f36f6687b79f8deb4b4cf4b54d5 |
| E65 | MATCH | scratchpad/alert-verification-followup.md:1; exact c395c45 bytes; SHA-256 735e2715c4431213d6d72579e005cc69641b30024eb0b801d96c313202a257ed |
| E66 | MATCH | scratchpad/alert-verification-synthetic.cjs:1; exact c395c45 bytes; SHA-256 00404c9a4a7c99b3c3ef7369c7179074a89e992f3ad45e869e494a401869cee0 |

### Snapshot manifest

| Working-tree file | SHA-256 at comparison |
|---|---|
| `.github/scripts/emit-metering.sh` | `6a5e22d5bffef25cc0a9617023f7d628af9cc9c55588e2d7526d26721d419822` |
| `.github/scripts/gh-retry.sh` | `1368c3c38112c1315fed4a92891054c7df1e11fbb1a5bc23b41abd61db38789f` |
| `.github/scripts/j5-metering-median.py` | `11752fc789c8d0ceadc35a1e023bfb489e623a1f56bb98929f36c5eafd370376` |
| `.github/scripts/tests/test-j5-metering-median.py` | `e728d266ccafb5906f9d4db4000f4d58fa9f4d721ab06c4de0485b22d0bca913` |
| `.github/workflows/j1-federal-scan.yml` | `440c01b8d7aec51635374ac83ef7ea4ca2bb5008d0ba6eb34e858e4506efab46` |
| `.github/workflows/j2-weekly-analysis.yml` | `3bb60575d45fba81c96c060d123c1b7cc11ee3ccc4e32936b0d488a239c9f1d6` |
| `.github/workflows/j3-weekly-sitrep.yml` | `0d931a60bba8812818b9ed2d4f953bb456d247f16623ebe4d7362fa5dc3f7ec8` |
| `.github/workflows/j4-link-audit.yml` | `225cc68c65f0ee64b8592fe6a731f51ac8df876c3ed44ba9bdcf56e840a3b234` |
| `.github/workflows/j5-spend-check.yml` | `75d6106aa42fd7fba2a6b36da19a30464375c6378f1f2d10bfe527435a49d3d3` |
| `.github/workflows/pao-weekly-packet.yml` | `20fdf249e49d01042450e799465292ce420796f447476771f3fd48d8c5fa0658` |
| `OneSignalSDKWorker.js` | `2f213985d10e5c5117acfde4f0cab00ad2c13035577ef38c7f0d86d2dd722fbc` |
| `index.html` | `54db0513e6aa6063c057f0f6780a2ccf4b54a6e8338addf17348f6c603515e39` |
| `intel/V-2026-016-opm-rif-in-force.md` | `171d7943971fc77a23f4861696234f9db85eb92ad00a9f41da3abc0b87734bcb` |
| `intel/patch-2026-09-04-fedvip-gar-ladder.md` | `2b270248c8ac474fa9ae94590b9586acfd7ff34982c0c7c071a14d9a07d91f37` |
| `intel/verification-log.md` | `d3dbef38e2e13e7d30a5649253c4ae36f43605f31c1ec4437c300b57a315c308` |
| `netlify/functions/_shared/openai-budget.cjs` | `c011445dd8551d4e9f6dea863cd46117c9dfa58f24c9bfec5af5cf6af093b772` |
| `netlify/functions/_shared/openai-client.cjs` | `f48dc815e1dd97b09a3a5dbdb484254aae60a3d35e62c50a2776eb38062520ca` |
| `netlify/functions/navigator.mjs` | `3196dab6d35e157a4b6536076446e2d414621e8d4d9b24d937cfe3134a1332c9` |
| `netlify/functions/resume.mjs` | `5d356db08ca2586af176819effd591966444f6131581cf5b91265c531a35a54c` |
| `push/onesignal/OneSignalSDKWorker.js` | `c0dff569138a3876f942c7c931f4c3a1b812399565337d87d426207a26c4d69a` |
| `pwa-sw.js` | `0f2499c307702a3533d399fc720a0f991eb6674576cdf5155166022dbedc7ff6` |
| `scratchpad/alert-browser-test.cjs` | `72742026f899cfe2816251d4bc23bfd84fedb2c55d4f38a78c385cc03f830def` |
| `scratchpad/alert-burst-incident.md` | `8533ab36c9f84a1087564d6401b1bb328bac24dff421dffa7df20e169cfeecee` |
| `scratchpad/alert-channel-forensics.md` | `e27f849a2cdbd5b7686b808b13d58e85cc9bb2d149fa6f2902c7b7c7ef8e695b` |
| `scratchpad/alert-channel-loop-log.md` | `a3587a9b50ed0d692ebecd288aa980792e9dcce86d081d8991b35757ebd17d06` |
| `scratchpad/alert-channel-manual-test.md` | `6be50c4f5c305c21e407ceec3808a72e33e24eca5aae890d1746fac8de1c3134` |
| `scratchpad/alert-disabled-test.cjs` | `0e7a6382e504adb89932b50b29c13aec815d96cd1709ea18d479bf6754f86e83` |
| `scratchpad/alert-hardening-loop-log.md` | `f30b386cabf7abfaae795c79400cb857708b47101755182822cb332f1f4e9b01` |
| `scratchpad/alert-hardening-sitrep.md` | `18acc5e4cf36aa737532c1d2ac0cff8d9c34e7483bffa1aa4832be3a4a17111d` |
| `scratchpad/alert-persistence-test.cjs` | `9b3b195033c102f59dc2cdba405616e803d25f36f6687b79f8deb4b4cf4b54d5` |
| `scratchpad/alert-verification-followup.md` | `735e2715c4431213d6d72579e005cc69641b30024eb0b801d96c313202a257ed` |
| `scratchpad/alert-verification-synthetic.cjs` | `00404c9a4a7c99b3c3ef7369c7179074a89e992f3ad45e869e494a401869cee0` |
| `scratchpad/fleet-baseline.md` | `78cc9ab88f6af9d5efee6016558c1c91d52630e16b99be310ac5dede214d5068` |
| `scratchpad/fleet-loop-log.md` | `5283ff8c14b400e4166cb90d31cff514702643cf7a19c5c7b1a49a4116f6f2a3` |
| `scratchpad/quality-loop-baseline.md` | `7a1c551e63c2262f0ea81ce3655848ad77d02637e3902d06d2ee9e22b6e43ff6` |
| `scratchpad/quality-loop-log.md` | `14464778435b01ab2a1685f95fa8e306e16cb55ba2f4d597710fe19f37415cb8` |
| `scratchpad/staleness-tiers.md` | `087788c2ee612d7065a64ae35b88516316552fd39cd0a2221eba356aff967c4e` |
| `scripts/openai-migration-regression.js` | `af97ec017bc0271fe7914ab974b376189a034907a68687ba603d90c69d08f4a0` |
| `scripts/policy-content-regression.js` | `3614034f7787f76381576423f14dd8eff3cdbbe6fe1b6b28ff9fae650534d460` |
| `sw.js` | `45a4f093d7a19d4403cdaa5da0e6d6ae0a7ae497080fe92694046be789108d32` |

Validation limit: these are static byte/line/function comparisons and existing local log references. No S3 regression was duplicated. Historical docs remaining exact is evidence of retention, not validation of their old claims against this candidate. The final comparison below matches S3's recorded source hashes; this remains an uncommitted working-tree audit, not a frozen hosted release identity.

### Final source-hash cross-check against existing S3 evidence

At 2026-09-07T14:28:32.597059+00:00, all four checked runtime identities (index.html, navigator.mjs, pwa-sw.js and retained sw.js) still match S3's `/private/tmp/tops-weekend-evidence/final-gate.log:73` through :76. The app and Navigator hashes are unchanged across repeated comparison snapshots. The browser log's recorded index.html hash also matches this snapshot. This closes the risk of reporting on the earlier pre-hardening notifier; it does not freeze a new commit or certify any future edits.

Existing evidence read, not re-executed:

- `/private/tmp/tops-weekend-evidence/final-gate.log:68`: structural PASS, FAIL=0; :69-72 record pinning/encoding/conflict/index checks. Source identities at :73-76 match this audit.
- `/private/tmp/tops-weekend-evidence/alert-browser.log:2`: app identity matches; :11 reports 7/7 PASS. Real Chromium engine with stubbed notifications, not full UI/iPhone proof.
- `/private/tmp/tops-weekend-evidence/alert-disabled.log:1`: production-OFF direct invocation with permission already granted reports zero worker/locks/storage/show access and no callers.
- `/private/tmp/tops-weekend-evidence/alert-persistence.log`: existing 35/35 PASS; stubbed lock/persistence boundary only. This log does not independently record an app hash, so the browser and final-gate identity evidence is reported separately.

Final accounting for this audit: **31/31 weekend rows individually accounted; 30 fulfilled by preservation/adaptation/supersession, 1 BLOCKED-POLICY (row 29). Supplemental 3/3 applied in explicitly inactive form, with the two test-only activation adaptations identified.** No row is omitted; no full release-ready verdict is issued. Any source change after the manifest above invalidates affected comparisons. Parent owns resolution of row 29 and the remaining integration/release gates.
