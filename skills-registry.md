# TRANSITION OPS — SKILL REGISTRY

Property book for the agentic team. The Orchestrator consults this before
delegating; force-mod maintains it. Every skill change updates this file in
the same commit.

Status codes: CODIFIED (written, validated) · PENDING (identified, not yet
written) · DEPRECATED (superseded — note by what)

| # | Skill | Owner | Status | Version | Validated | Location |
|---|-------|-------|--------|---------|-----------|----------|
| 1 | validation-gate | s3-devops | CODIFIED | 1.8 | 2026-09-01 | .claude/skills/validation-gate/ (canonical); .agents/skills/validation-gate/ (Codex project mirror) |
| 2 | deploy-discipline | s3-devops | CODIFIED | 1.6 | 2026-08-31 | .claude/skills/deploy-discipline/ (Claude copy); .agents/skills/deploy-discipline/ (Codex copy; environment wording intentionally differs); 1.3 BURNED - see change log |
| 3 | policy-verification | s2-intel | CODIFIED | 1.1 | 2026-08-02 | .claude/skills/policy-verification/ |
| 4 | brand-voice | pao-content | CODIFIED | 1.0 | 2026-07-31 | .claude/skills/brand-voice/ |
| 5 | resource-vetting | s2-vetting | PENDING | — | — | rubric currently embedded in s2-vetting agent prompt; extract to skill when S2 stands up (Build Step 3) |
| 6 | resume-drafter-maintenance | force-mod | PENDING | 0.20 | — | .claude/skills/resume-drafter-maintenance/ |
| 7 | push-ops | s3-watch-officer | PENDING | — | — | OneSignal segments, test push procedure, delivery checks |
| 8 | outreach-correspondence | pao-content | PENDING | — | — | partner/employer email patterns (Legion, Michels-style prep) |
| 9 | proposal-onepager | pao-content | PENDING | — | — | capability statement + one-pager formats |
| 10 | brand-assets | pao-content | PENDING | — | — | Pillow pipeline, Poppins fonts, draw_letterspaced helper |
| 11 | push-worthy | pao-content | PENDING | — | — | **CRITERIA** for recommending a user push: gates G1–G5, criteria P1–P4, disqualifiers X1–X5, governors U1–U5. Doctrine drafted at `intel/scheduled-ops-design.md` §F, awaiting Commander ruling. PENDING until regression set PW-1…PW-9 + PW-X1…PW-X4 executes |
| 12 | member-impact | s2-intel | PENDING | — | 2026-08-06 (MI-1…MI-9 executed 9/9) | .claude/skills/member-impact/ |
| 13 | member-return-benchmarking | force-mod | CODIFIED | 1.0 | 2026-08-31 | .claude/skills/member-return-benchmarking/ (canonical); .agents/skills/member-return-benchmarking/ (Codex project mirror) |
| 14 | erg-client-plugin-governance | force-mod | CODIFIED | 1.0 | 2026-08-31 | .claude/skills/erg-client-plugin-governance/ (canonical); .agents/skills/erg-client-plugin-governance/ (Codex project mirror) |
| 15 | privacy-truth-to-implementation | force-mod | CODIFIED | 0.2 | 2026-08-31 | .claude/skills/privacy-truth-to-implementation/ (canonical); .agents/skills/privacy-truth-to-implementation/ (Codex project mirror) |
| 16 | runtime-ai-spend-governance | force-mod | CODIFIED | 1.3 | 2026-09-01 | .claude/skills/runtime-ai-spend-governance/ (canonical); .agents/skills/runtime-ai-spend-governance/ (Codex project mirror) |
| 17 | accessibility-release-validation | s3-devops | CODIFIED | 1.0 | 2026-08-31 | .claude/skills/accessibility-release-validation/ (canonical); .agents/skills/accessibility-release-validation/ (Codex project mirror) |

**Scope fence between #3 and #12 — read before extending either.**
`policy-verification` (#3) owns whether a claim is **TRUE**. Its OUTPUT field
"affected app module" is **routing exhaust**, not an assessment.
`member-impact` (#12) owns whether a CONFIRMED finding is **USEFUL**, and there
**"none" is a verdict**, not a blank. **#3 does not cover #12, and the seam is
one field wide** — which is exactly the width someone will point at in three
months.

**Second fence — #12 and #11.** #12 runs **pre-ship**; #11's G2 requires content
**already merged, cache-bumped, and serving**. Only G3 is shared. **#12 does not
amend #11, and #11 does not govern findings.**

**Third fence — what #12 does NOT govern.** #12 assesses **incoming findings
about the world**. It does **not** govern outgoing claims about our own system —
privacy statements, capability descriptions, the TOOL MANIFEST. **That subject is
real, is currently unowned, and stays unowned rather than being absorbed here.**
A skill with two subjects serves neither.

**Scope fence between #7 and #11 — read before extending either.** `push-ops`
(#7) owns **mechanics only**: OneSignal segments, send procedure, delivery and
opt-out telemetry, channel liveness testing. `push-worthy` (#11) owns **whether
a push is justified at all**. Criteria live in #11 and never in #7.

The fence exists because #7 is PENDING, names OneSignal, and is the row someone
will point at in three months to claim the gap is covered. It is not, and the
ownership matters: #7's owner is s3-watch-officer, a Haiku detection-and-report
agent. **The decision about what interrupts every user's phone must not end up
owned by the cheapest agent on the roster.** Same seam pattern as
validation-gate / deploy-discipline 1.1(d).

**Fourth fence - #6 and #16.** `resume-drafter-maintenance` owns the Resume
call graph, grounding, stage meaning, exact caps, partial-artifact withholding,
and output quality. `runtime-ai-spend-governance` owns shared site-wide admission,
aggregate accounting, pricing, and request-option enforcement. **Neither skill's
PASS clears the other**, and Navigator remains independently tested even though
it shares the aggregate ledger.

**Fifth fence - #1, #17, and #2.** `validation-gate` owns repository commands
and local evidence. `accessibility-release-validation` owns the WCAG 2.2 AA
project verdict and required manual assistive-technology matrix.
`deploy-discipline` owns artifact identity, preview, rollback, handoff, and
production. **Local automation is not manual AT or hosted release acceptance.**

## CHANGE LOG
- 2026-09-02 - **#6 `resume-drafter-maintenance` 0.19 -> 0.20 remains
  PENDING.** The Resume client now makes exactly one request per button
  activation with no automatic replay and classifies the request-local boundary
  into only `handler_json`, `fetch_rejected`, `non_handler_response`,
  `handler_non_json`, or `handler_json_parse`. One fixed content-free handler
  response marker distinguishes Resume-handler responses without changing any
  response body. The memory-only diagnostic is limited to fixed path,
  integer-or-null HTTP status, integer elapsed milliseconds, request-attempt
  count, handler-response count, and closed outcome; it enters no log, storage,
  analytics, later request, member-facing copy, or download. The targeted
  offline OpenAI migration regression passes RDM-208 through RDM-216 with
  synthetic fetch and handler-response stubs and zero hosted or provider calls.
  The remaining four local PRE-MAIN suites and real-artifact 4N are pending
  parent execution; the active PWA cache advances from v145 to v146. Existing Resume models,
  call graph, caps, shared budget guard, grounding, audit, export, privacy,
  public response bodies, and member-safe failure copy remain unchanged. This
  local evidence does not clear the required live-clone or actual Word-render
  evidence and does not promote the skill. No live function or model invocation,
  provider/settings change, commit, push, deployment, merge, or production
  change occurred. Lane: COMMANDER. Owner: force-mod.
- 2026-09-01 - **#1 `validation-gate` 1.7 -> 1.8 remains CODIFIED.** The 4N
  real-artifact boundary now requires Navigator and Resume to load OpenAI 7.8.0
  and Blobs 10.7.13, verify the OpenAI constructor and Blobs `getStore` API
  shapes, resolve OTel 6.0.6 and runtime-utils 2.3.0, and prove `jobs` excludes
  all four package paths. The exact function-scoped four-path source rule keeps
  global or broad inclusion and bundler overrides prohibited. VG-18-1 through
  VG-18-7 pass 7/7; canonical and mirror remain byte-identical. The module-only
  calibration used no client, store, credential, function, network, provider,
  model, hosted, deploy, merge, or production action. Runtime-spend 1.3 and
  deploy-discipline 1.6 seams remain unchanged. Lane: AUTO. Owner: s3-devops.
- 2026-09-01 - **#1 `validation-gate` 1.6 -> 1.7 remains CODIFIED.** The
  hosted clone's fixed `client_init/module_load_resolution_code` marker exposed
  a package-boundary gap: OpenAI 7.8.0 was installed and pinned, but the modern
  runtime-v2 NFT artifact omitted it. Version 1.7 makes `netlify.toml` trigger
  all five PRE-MAIN suites and adds a real-artifact boundary that packages
  Navigator and Resume separately, requires OpenAI 7.8.0 to exist and resolve
  from both artifacts, and requires the non-AI `jobs` artifact to exclude it.
  The source fixture requires exactly two function-scoped inclusion rules and
  rejects global or broad inclusion plus bundler, externalization, and ignored-
  module overrides. It expressly rejects `netlify functions:build` alone as
  evidence because CLI 26.1.0 was measured to omit normalized per-function
  config on that command. Calibration cases VG-17-1 through VG-17-6 pass 6/6;
  canonical and Codex mirrors remain byte-identical. The local artifact smoke
  performs no credential access, client construction, function invocation,
  provider call, network request, or model request. Hosted acceptance remains
  owned by deploy discipline. Lane: AUTO. Owner: s3-devops.
- 2026-09-01 - **#16 `runtime-ai-spend-governance` 1.2 -> 1.3 remains
  CODIFIED.** The hosted clone's `client_init/module_load` marker combined
  resolution-coded failures with every other SDK load or evaluation failure.
  Version 1.3 retires that ambiguous subphase and closes the boundary at
  `module_load_resolution_code` and `module_load_other`. The first is selected
  only when the existing static `require("openai")` throws with exactly
  `MODULE_NOT_FOUND` or `ERR_MODULE_NOT_FOUND`; every missing, inaccessible,
  non-string, unknown, package-export, module-format, or other code selects the
  residual bucket. The classifier reads no caught-error property except `code`,
  emits only fixed literal markers, and preserves the content-free
  `upstream_unavailable` response and zero provider calls on initialization
  failure. It preserves exactly one static OpenAI require and adds no
  `require.resolve`, dynamic require/import, package externalization, package
  change, public-response change, or spend-control change. Neither marker proves
  root-package absence, artifact inventory, SDK evaluation, provider state, or
  the identity of a transitive dependency. Written synthetic cases RSG-1 through
  RSG-25 classify 25/25 PASS, including both allowlisted codes, residual and
  inaccessible-code variants, retired-subphase drift, sentinel exclusion, and
  zero-provider-call behavior. Canonical and Codex mirrors remain byte-identical.
  Lane: COMMANDER. Owner: force-mod.
- 2026-09-01 - **#16 `runtime-ai-spend-governance` 1.1 -> 1.2 remains
  CODIFIED.** The hosted clone's content-free `client_init` marker narrowed the
  failure to provider-client initialization but could not identify the failing
  initialization boundary. Under the Commander's exact governance-only
  authorization, v1.2 closes `client_init` at `module_load`, `api_shape`,
  `key_lookup`, `client_construct`, and `guard_construct`. Every initialization
  failure requires exactly one complete compile-time fixed literal, the public
  `upstream_unavailable` response remains unchanged, and initialization failure
  permits zero provider calls. Missing, unknown, duplicated, computed,
  concatenated, interpolated, or otherwise dynamic `client_init` subphases fail.
  Raw errors, stacks, messages, codes, statuses, credentials, secrets, requests,
  responses, member data, identities, and IP addresses remain prohibited from
  diagnostics. Existing v1.1 phases and subphases remain unchanged;
  `provider_call`, `provider_result`, and `settlement` remain phase-only. Written
  synthetic cases RSG-19...RSG-24 cover all five subphases plus missing,
  invalid, dynamic, and duplicate drift, bringing the governance calibration to
  24/24 PASS. This validates governance text only, not application
  instrumentation, runtime wiring, hosted behavior, root cause, or provider or
  production state. This force-mod governance slice modified no application
  code and performed no model request, provider/settings action, staging,
  commit, push, deployment, merge, or production change. Lane: COMMANDER.
  Owner: force-mod.
- 2026-09-01 - **#16 `runtime-ai-spend-governance` 1.0 -> 1.1 remains
  CODIFIED.** A fail-closed but unclassified clone invocation exposed PARTIAL
  governance coverage: the existing four content-free phases did not cover
  every `upstream_unavailable` origin. Under the Commander's exact governance-
  only authorization, v1.1 closes the phase set at `prepare`,
  `blob_store_load`, `ledger_read`, `ledger_write`, `client_init`,
  `provider_call`, `provider_result`, and `settlement`. Every such terminal
  origin requires exactly one compile-time-literal marker; the four new phases
  have no subphases; terminal precedence suppresses earlier markers; success
  and valid internal-cutoff budget denial remain silent; and the marker
  prohibition covers the caught error, stack, message, code, status, request,
  response, usage, ledger,
  secret, cookie, identity, IP, provider identifier, model, stage, amount, URL,
  and timestamp. A marker identifies application execution location only and
  creates no provider- or account-observability claim. Written synthetic cases
  RSG-1...RSG-18 classified 18/18 PASS against the approved contract; both
  skill copies passed skill-creator `quick_validate`, and canonical/mirror skill
  and calibration files are byte-identical. This validates governance text,
  not application instrumentation, runtime wiring, hosted behavior, or root
  cause. This force-mod slice changed no application code and made no
  provider/account inspection or change, live model or external network request,
  staging, commit, push, deployment, merge, or production action. Lane:
  COMMANDER. Owner: force-mod.
- 2026-08-31 - **PRE-MAIN REMEDIATION PHASE 2 clone implementation completed
  with LOCAL AUTOMATION PASS; manual AT and hosted acceptance remain
  PENDING.** Under the Commander's exact clone-only approval, the manifest
  portrait lock and two stale `Nothing you type is stored.` clauses in
  `WHATS_NEW` v77/v78 were removed without changing `APP_VERSION`, the
  `WHATS_NEW` version sequence, or the PWA build comment. Reduced-motion and
  focus-visible behavior, one content-scoped main landmark and level-one
  heading, persistent input labels, keyboard-operable cards, 44-pixel targets,
  corrected contrast, a content-free live status region, zoom/reflow-safe
  navigation, and modal naming/focus entry/trap/Escape/restoration were added.
  `test:openai-migration`, `test:sw-privacy`, `test:privacy-network`,
  `test:runtime-ai-spend`, and `test:accessibility-release` all passed locally;
  the accessibility command covered twelve portrait/landscape scenarios at
  default, 200%, and 400% zoom, keyboard traversal, dialog behavior, the browser
  accessibility tree, and zero attempted external provider requests. The same
  uncommitted Phase 1 packet retains active cache v144; no second cache number
  was consumed. Changes remain staged only. No provider setting, live model
  call, commit, push, merge, deployment, hosted preview, manual assistive-
  technology acceptance, or production change occurred. Registry versions are
  unchanged. Lane: COMMANDER.
- 2026-08-31 - **PRE-MAIN REMEDIATION PHASE 1 clone implementation staged for
  review; release gate remains BLOCKED.** Under the Commander's isolated-clone
  approval, browser GA and Kit collection paths and client-side Kit material
  were removed; production push is one literal OFF state with clone origin,
  App ID, SDK activation, permission, subscription, and tag paths absent;
  member-derived Navigator Blob logging was removed; and the legacy worker
  exception was preserved unchanged. Navigator and Resume now enter the shared
  USD 4.00 UTC-month aggregate-only guard with closed model/price tables,
  request and stage-output caps, zero provider calls on denied or failed
  accounting, conservative reservation/settlement, and a content-free ledger.
  The active PWA cache moved from v143 to v144. OpenAI migration, worker
  privacy, privacy/network, and runtime-spend commands passed locally; npm
  audit reported zero vulnerabilities. The accessibility command correctly
  blocks on the existing forced-portrait manifest before it can issue local
  automation acceptance, so there is no `GATE PASS`, manual assistive-
  technology acceptance, hosted acceptance, or release clearance. Changes are
  staged only. No provider setting, live model call, commit, push, merge,
  deployment, or production change occurred. Lane: COMMANDER.
- 2026-08-31 - **PRE-MAIN REMEDIATION GOVERNANCE PACKET v1.0: #16
  `runtime-ai-spend-governance` 1.0 and #17
  `accessibility-release-validation` 1.0 added CODIFIED; #1
  `validation-gate` 1.5 -> 1.6 and #2 `deploy-discipline` 1.5 -> 1.6; #6
  `resume-drafter-maintenance` 0.18 -> 0.19 and remains PENDING.** The Commander
  approved the governance slice for a site-wide aggregate USD 4.00 UTC-month
  internal OpenAI guard, closed Luna/Terra price/model/stage controls, atomic
  reservation and conservative settlement, content-free denial, production
  push OFF with clone configuration prohibited, and a WCAG 2.2 AA release gate.
  RDM retains the Resume call graph and exact 3500/3500/2200/1900/4000 caps;
  #16 owns shared admission/accounting; #15 retains privacy/account truth; #1,
  #17, and #2 retain repository, accessibility, and deployment authority.
  Dated account evidence keeps the configured USD 5 provider project limit and
  alert `ACCOUNT-VERIFIED` for its 2026-08-31 scope and overage warning; it is
  distinct from the repository guard and is not full-account hard-cap proof.
  Synthetic governance calibration executed RSG 14/14, ARV 12/12, RDM 9/9,
  VG-16 6/6, and DD-16 6/6 PASS; fixed-point spend state transitions executed
  10/10 PASS. System skill-creator `quick_validate` passed all nine changed
  skill folders. Runtime, accessibility, and validation mirrors are
  byte-identical; deploy copies retain only their documented
  environment-specific wording. Required application privacy/network, budget,
  Resume, worker, and accessibility commands are prescribed but were not run:
  app, runtime, test, and package files were explicitly outside this slice.
  Manual AT and hosted acceptance remain PENDING. No application code, provider
  state, live model call, hosted preview, staging, commit, push, merge, or
  deployment was used or authorized. Lane: COMMANDER.
- 2026-08-31 - **SW-PRIVACY-01 governance package: #15
  `privacy-truth-to-implementation` 0.1 -> 0.2, #2 `deploy-discipline`
  1.4 -> 1.5, and #1 `validation-gate` 1.4 -> 1.5.** The Commander approved
  prospective zero-OneSignal-request behavior for new and migrated browsers,
  an OneSignal-free active PWA worker, post-consent dedicated push scope under
  `/push/onesignal/`, and a bounded legacy root-worker exception through a
  sunset no earlier than one year after production cutover. Privacy governance
  now separates NEW, MIGRATED, LEGACY, and RETIRED states and withholds
  universal claims until retirement and validation. Deploy governance owns the
  worker-role record, cache ownership, migration, cohort validation, rollback,
  and sunset execution. Validation-gate generalizes only its hardcoded worker
  anchor and standalone-JavaScript inventory; it gains no privacy or deployment
  authority. PTI-SW1...PTI-SW4 and the complete privacy suite executed 4/4 and
  24/24 PASS. Two independent forward tests passed, all six skill packages
  passed skill-creator validation, privacy and validation mirrors remain
  byte-identical, and deploy copies preserve their environment-specific wording.
  No app code, provider setting, account, staging, commit, push, merge,
  deployment, or production authority was granted. Lane: COMMANDER.
- 2026-08-31 - **#15 `privacy-truth-to-implementation` 0.1 added as
  CODIFIED.** Commander explicitly approved codification after force-mod found
  no existing owner for outward claims about Transition OPS or VBS privacy,
  data handling, retention, logging, deletion, and member controls. The skill
  requires distinct code, runtime, provider-documentation, and account evidence;
  universal language fails on any unknown path; provider/account settings,
  user controls, clear/delete boundaries, drift triggers, and claim-release
  rows remain explicit. PTI-1...PTI-16, PTI-X1, PTI-X2, and two cross-skill
  seam cases executed 20/20 PASS on synthetic inputs; skill-creator
  `quick_validate` passed both copies, and canonical/Codex skill and calibration
  mirrors are byte-identical. An independent fresh-context forward test also
  passed: it withheld all universal claims, distinguished missing
  owner/scope/artifact/drift evidence, and preserved every external authority
  seam. `policy-verification`, `member-impact`,
  `brand-voice`, `erg-client-plugin-governance`, `member-return-benchmarking`,
  `resume-drafter-maintenance`, `resource-vetting`, qualified privacy/legal
  review, `validation-gate`, and `deploy-discipline` retain independent blocking
  authority. No app, provider account, client, contract, external action,
  product change, staging, commit, push, merge, deployment, or production
  authority was used or granted. Lane: COMMANDER. Owner: force-mod.
- 2026-08-31 — **#14 `erg-client-plugin-governance` 1.0 added as CODIFIED.**
  Commander explicitly approved the capability after force-mod found NONE
  coverage for employer-sponsored ERG product governance. The skill requires a
  closed delivery-model classification, field-level data/access matrix, content
  authority separation, tenant isolation, review question log, evidence-based
  business model, synthetic pilot measures, sponsor-report limits, RACI, risk
  register, and explicit offboarding. Hard red lines bar employer access to
  individual plans, resumes, prompts, benefits activity, or inferred readiness;
  data sale, ads, and leads; loss of free public access; unsupported ROI or
  retention claims; and unapproved accounts, SSO, HRIS, analytics, storage,
  integrations, spend, deployment, outreach, contracts, or code. Client copy
  cannot override verified federal policy. `member-return-benchmarking`,
  `policy-verification`, `member-impact`, `resource-vetting`, `brand-voice`,
  `resume-drafter-maintenance`, `validation-gate`, and `deploy-discipline`
  retain independent blocking authority. Canonical and Codex mirror files are
  byte-identical. EPG-1…EPG-11 and EPG-X1 executed 12/12 PASS on synthetic
  inputs; skill-creator `quick_validate` passed both copies. No client,
  platform, product code, member data, external action, or deployment was used
  or authorized. Lane: COMMANDER. Owner: force-mod.
- 2026-08-31 — **#13 `member-return-benchmarking` 1.0 added as CODIFIED.**
  Commander approved the capability after force-mod found NONE coverage for
  evidence-governed product benchmarking and privacy-compatible member-return
  recommendations. The skill preserves `OBSERVED`, `REPORTED`, `CORROBORATED`,
  and `NONCOMPARABLE`; blocks unsupported retention rankings and no-data
  regressions; and returns only ADOPT / LOCAL SYNTHETIC TEST / WATCH / REJECT.
  Scope fences leave resource legitimacy, policy truth, member impact, outward
  voice, push-worthiness, Resume Drafter controls, general privacy self-claims,
  validation, and deployment with their existing owners. Canonical and Codex
  mirror files are byte-identical. MRB-1…MRB-12 and MRB-X1 executed 13/13 PASS,
  including realistic resume, policy/member-impact, push, and deploy seam cases.
  Lane: COMMANDER. Owner: force-mod.
- 2026-08-30 — **#6 `resume-drafter-maintenance` 0.17 -> 0.18, remains
  PENDING.** Dean approved v0.18 after the live-clone `Resume_Draft3.docx`
  exposed PARTIAL v0.17 coverage: a senior, broad candidate with six roles,
  14 supported role bullets, four certifications, and four education items
  still received the compact one-page profile. Force-mod classified this as a
  narrow skill amendment, not a new skill. Version 0.18 keeps a fixed
  senior-readable profile for a selected two-page candidate with `B >= 10`;
  compact fallback remains limited to insufficient post-audit evidence. A
  naturally two-page candidate may receive one presentation-only break at a
  deterministic semantic role boundary when executed layout checks prove it
  improves balance and produces substantive pages; `ResumeSpacer` remains
  prohibited, the EXPERIENCE heading remains with its first role, candidate
  content remains byte-exact, and an unresolved sparse result is withheld
  rather than released or compacted. A fixed-profile candidate that safely
  fits on one page is released as an honest one-page evidence exception, with Length and
  Readability marked `NEEDS MEMBER FACT` and no filler, padding, compression,
  or forced second page. RDM-195…198 cover the senior live shape, fallback
  separation, honest one-page exception, and unchanged federal/API/cap/privacy
  boundary. Synthetic RDM-1…RDM-198, browser preflight, and actual LibreOffice
  rendering passed locally on 2026-08-30. Models, calls, retries, caps, storage,
  logging, persistence, analytics, privacy, usage limits, budget, and costs are
  unchanged; maximum incremental API exposure is $0 and the external monthly
  cap remains `UNVERIFIED`. Live-clone validation is not yet claimed, so
  registration remains PENDING. Lane: AUTO for internal governance; app
  implementation remains Commander-gated. Owner: force-mod.
- 2026-08-30 — **#6 `resume-drafter-maintenance` 0.16 -> 0.17, remains
  PENDING.** Commander-approved live evidence established that civilian length
  must adapt to confirmed target-relevant experience, distinct relevant-role
  breadth, and grounded evidence fit rather than a fixed one-page target.
  Version 0.17 preserves every v0.16 grounding, identity, role, privacy, cost,
  federal, content-equivalence, and pagination protection and adds the ADAPTIVE
  CIVILIAN LENGTH CONTRACT. The exact request-local options are `Adaptive (recommended)`
  (default), `Prefer one page`, and `Prefer two pages`; neither preference nor
  rationale may be logged, persisted, stored, or sent to analytics. The plan is
  computed before generation from the confirmed draft-eligible fact catalog:
  `Y` is explicit member-confirmed target-relevant years; `R` is the count of
  member-selected relevant roles that contain draft-eligible duty/outcome
  evidence; and `A` is the distinct draft-eligible same-role duty/outcome
  evidence owned by those selected roles. New and edited fact sheets begin with
  no relevant roles selected; no role selection means `R = 0`.
  Target, title, posting, keyword overlap, and model output cannot select a role
  or add an atom; posting remains targeting language, never member fact support. Adaptive
  recommends two pages only when `A >= 10` and relevant years/role breadth meet
  `10/3` or `15/2`, or, when relevant years are unavailable, `R >= 4`. Age,
  total service, title, and prose cannot supply relevant years. The plan and
  guarded preference may guide how much grounded role-owned evidence the
  existing generator retains and the presentation profile, so a valid two-page
  resume may contain more grounded role detail than a valid one-page resume.
  They cannot alter the ledger or catalog, omit a role, education item, or
  credential, relax grounding, invent, duplicate, fill, pad, add calls or
  retries, or exceed caps. After audit, `B >= 10` supported role bullets and an
  actual Word-compatible DOCX render must prove that a selected two-page output
  is substantive; failure applies only the one-page presentation profile to the
  same audited candidate and re-renders without another model call, or withholds
  the artifact if one page cannot render safely. Automatic `pageBreakBefore` on
  `ResumeSpacer` remains prohibited, and browser estimation remains conservative
  preflight rather than proof. RDM-187…194 cover short-career one page,
  senior/broad detail retention, exact rule boundaries and total-service
  isolation, guarded overrides, spacer safety, actual DOCX/post-audit fallback,
  per-output content exactness, and unchanged federal/API/cap/privacy/cost
  controls. App code, tests, and cache metadata implement the approved contract;
  no model, call, retry, cap, storage, logging, persistence, analytics, privacy,
  usage-limit, budget, or cost behavior changes; maximum incremental API
  exposure is $0 and the external monthly cap remains `UNVERIFIED`. This entry
  records the approved live evidence and specification scope. Synthetic
  RDM-1…RDM-194, browser preflight, and actual LibreOffice rendering passed
  locally on 2026-08-30; live-clone validation is not yet claimed, so
  registration remains PENDING. Lane: AUTO for internal governance; app
  implementation remains Commander-gated. Owner: force-mod.
- 2026-08-30 — **#6 `resume-drafter-maintenance` 0.15 -> 0.16, remains
  PENDING.** Dean approved v0.16 after live-clone Word export evidence exposed
  PARTIAL v0.15 coverage: six `Title | Employer` role headers were classified as
  metadata, the browser estimator withheld an otherwise grounded artifact from
  second-page occupancy alone, and the committed regression asserted render
  wiring without executing layout in a layout-capable browser. Version 0.16
  preserves every v0.15 requirement and adds the CIVILIAN WORD PAGINATION
  CONTRACT: structural-sequence classification of the already-audited released
  candidate text after PROFESSIONAL EXPERIENCE or a completed bullet block;
  pipe, hyphen, and em-dash presentation variants with separator alone
  insufficient and no browser ledger reparsing; executed browser-layout
  evidence; occupancy as a review signal but not proof of avoidability; safe
  content-equivalent rebalancing; transitive keep-with-next; and blocking
  controls for clipping, overlap, hidden text, orphaned headings or role
  headers, more than two pages, and unreadable compression. RDM-179…186 add a
  synthetic six-role/16-bullet/four-certification/
  four-education positive control, role grammar, real-browser execution,
  sparse-versus-avoidable controls, complete-chain pagination, content
  equivalence, negative layout cases, and federal/operational non-regression.
  No app code, tests, cache, model, API call, retry, cap, privacy, logging,
  storage, persistence, analytics, usage-limit, budget, or cost behavior is
  changed by this specification update; maximum incremental API exposure is $0
  and the external monthly cap remains `UNVERIFIED`. This records Dean's
  specification approval only; registration remains PENDING until synthetic
  regression execution and live-clone evidence pass. Lane: AUTO for internal
  governance; app implementation remains Commander-gated. Owner: force-mod.
- 2026-08-30 — **#6 `resume-drafter-maintenance` 0.14 -> 0.15, remains
  PENDING.** Commander-approved scope responds to the first rendered v0.14
  civilian artifact: confirmed education was omitted; confirmed header and
  credentials were not deterministically guaranteed; Summary repeated exact
  Core Skills atoms; the two-page export stranded two roles on a mostly blank
  second page; and HTML was presented with a `.doc` extension. Version 0.15 adds
  a FINAL CIVILIAN ARTIFACT GATE. Summary atoms are excluded byte-exact before
  Core Skills selection. Every confirmed personal-header, education,
  certification, and license item is included byte-exact and exactly once;
  missing essential header facts produce Format Compliance `NEEDS MEMBER FACT`
  and member guidance without placeholders or invention. The actual export must
  remain content-equivalent to released audited candidate text and be a genuine
  `.docx` with matching Office Open XML MIME type and file signature. Final
  render and page balance govern Length and Readability and Format Compliance.
  RDM-160/161 are amended; RDM-168A/B, RDM-169A/B, RDM-170A/B, and RDM-172…178
  specify de-duplication, translation boundaries, posting isolation, exact
  education and credential survival, export equivalence, truthful file format,
  page balance, federal non-regression, and operational non-regression. No model,
  call, retry, cap, privacy, storage, logging, persistence, analytics, usage, or
  cost control changes are authorized; maximum incremental API exposure is $0
  and the external monthly cap remains `UNVERIFIED`. This entry records approved
  specification scope only. No regression or live execution evidence is claimed;
  registration remains PENDING. Lane: AUTO for internal governance; app
  implementation remains Commander-gated. Owner: force-mod.
- 2026-08-30 — **#6 `resume-drafter-maintenance` 0.13 -> 0.14, remains
  PENDING.** Live v0.13 evidence showed a correctly withheld civilian draft:
  Core Skills presented posting-only workforce-development and onboarding
  terminology as member qualifications, and a role claim broadened a confirmed
  transition-planning application into candidate support. Exact identities,
  role separation, dates, quantities, jargon, filler, readability, and format
  otherwise passed. Coverage was **PARTIAL**: existing doctrine prohibited both
  failures and the audit withheld them, but model-authored Core Skills and the
  civilian-translation boundary lacked deterministic governance. Version 0.14
  replaces generated Core Skills with a server-owned section derived only from
  up to nine safe, exact semicolon-delimited global Skills atoms in stable order;
  omits the section when none are safe; preserves all other bytes; and uses one
  deterministic closed-global-Skills trace outside model adjudication. Posting,
  target, roles, duties, and raw source cannot contribute canonical skills.
  Civilian translation may change terminology only while preserving the entire
  confirmed activity, object, beneficiary or audience, purpose, domain, scope,
  scale, level, and outcome; same-role support remains mandatory and posting
  references cannot cure partial support. RDM-158…RDM-171 use synthetic fixtures
  and preserve federal behavior, models, calls, zero retries, all caps,
  `store: false`, privacy, logging/storage/persistence/analytics, and usage
  limits. No call, retry, model, cap, or cost ceiling changes; maximum
  incremental API exposure is $0 and the external monthly cap remains
  `UNVERIFIED`. Registry remains PENDING until synthetic and live clone
  validation pass. Lane: AUTO for internal governance; app implementation
  remains Commander-gated. Owner: force-mod.
- 2026-08-30 — **#6 `resume-drafter-maintenance` 0.12 -> 0.13, remains
  PENDING.** A live pre-audit `unlinked_global_number` rejection exposed an
  overbroad exact-phrase collision check: a shortened role claim could collide
  with an unlinked global phrase even when every exact quantity was independently
  supported by that same role. Version 0.13 keeps every unlinked `NUMBERS AND
  SCALE` entry excluded from generation, audit support IDs, and returned trace;
  uses escaped alphanumeric-boundary collision matching; and permits only a
  role-owned collision with exact same-role, non-unlinked numeric provenance to
  reach the existing audit. Numeric provenance is a prerequisite, never
  automatic approval; same-role references and a supported verdict remain
  mandatory, while global, unresolved, absent-token, wrong-role, unknown,
  cross-role, unlinked-reference, and unsupported-audit cases remain
  fail-closed. RDM-142…RDM-157 use synthetic fixtures and preserve federal
  behavior, models, calls, zero retries, all caps, `store: false`, privacy,
  logging/storage/persistence/analytics, and usage limits. A qualifying request
  may consume the already-authorized audit call rather than stopping early;
  configured maximum exposure is unchanged and the external monthly cap remains
  `UNVERIFIED`. Registry remains PENDING until synthetic and live clone
  validation pass. Lane: AUTO for internal governance; app implementation
  remains Commander-gated. Owner: force-mod.
- 2026-08-30 — **#6 `resume-drafter-maintenance` 0.11 -> 0.12, remains
  PENDING.** Complete live v0.11 evidence isolated the only substantive failure
  to an unsupported aggregated civilian Summary while identities, roles,
  quantities, keywords, translation, filler, and readability passed. Version
  0.12 replaces model Summary content with a server-owned canonical Summary
  derived only from up to four safe semicolon-delimited global Skills atoms in
  stable source order. It preserves atom and non-Summary bytes, excludes unsafe
  or duplicate atoms, omits Summary when none are safe, and prohibits role,
  posting, target, raw-source, duty, quantity, and career-span influence. The
  canonical claim is excluded from model-adjudicated IDs, mapped only to the
  closed global Skills fact, and merged exactly once after remaining audit
  checks pass; unsupported non-Summary claims remain fail-closed.
  RDM-123…RDM-141 use synthetic fixtures and preserve federal behavior, models,
  caps, calls, zero retries, usage limits, `store: false`, no
  logging/storage/analytics, privacy controls, and the `UNVERIFIED` external
  monthly cap. No call or cap is added; maximum incremental API exposure is $0.
  Registry remains PENDING until app regressions and live clone evidence pass.
  Lane: AUTO for internal governance; app implementation remains
  Commander-gated. Owner: force-mod.
- 2026-08-30 — **#6 `resume-drafter-maintenance` 0.10 -> 0.11, remains
  PENDING.** Live v0.10 evidence showed a grounded draft withheld because the
  generator omitted confirmed role dates and locations. Version 0.11 adds a
  civilian-only deterministic completion step after text normalization and
  before grounding, inventory, and audit. It inserts byte-exact confirmed
  location/date values under the exact owning role, omits literal `MISSING`,
  generates only the ` | ` separator, is idempotent, preserves every bullet,
  and never infers from duties, posting, target, adjacent roles, or raw source.
  Existing exact metadata may be safely canonicalized; unknown or conflicting
  metadata remains visible to fail-closed audit. Duplicate identities use safe
  first-unmatched ownership or fail closed. RDM-106…RDM-122 use synthetic
  fixtures and preserve federal behavior, models, caps, calls, zero retries,
  usage limits, `store: false`, no logging/storage/analytics, privacy controls,
  and the `UNVERIFIED` external monthly cap. No call or cap is added; maximum
  incremental API exposure is $0. Registry remains PENDING until app regressions
  and live clone evidence pass. Lane: AUTO for internal governance; app
  implementation remains Commander-gated. Owner: force-mod.
- 2026-08-30 — **#6 `resume-drafter-maintenance` 0.9 -> 0.10, remains
  PENDING.** A repeated live audit-reference rejection showed that generation,
  clause ownership, and audit-reference rules needed one alignment contract
  before further validator changes. Version 0.10 keeps quantities out of
  civilian Summary and Core Skills, preserves any used supported metrics in their owning
  role bullets, restricts role claims to same-role facts, keeps global skills in
  Core Skills unless repeated in a role, and requires minimum necessary audit
  references with no redundant refs. Shared heading and role-header recognition
  covers safe punctuation and variants, numbering consistency, and `MISSING`
  employers. Reference failures may expose only allowlisted content-free codes
  and messages; member content, IDs, identities, provider/token details,
  logging, and persistence remain prohibited. RDM-93…RDM-105 use synthetic
  fixtures and preserve all caps, calls, zero retries, draft limit, posting
  isolation, `store: false`, no logging/storage, and the `UNVERIFIED` external
  monthly cap. No call or cap is added; maximum incremental API exposure is $0.
  Lane: AUTO for internal governance; app implementation remains
  Commander-gated. Owner: force-mod.
- 2026-08-30 — **#6 `resume-drafter-maintenance` 0.8 -> 0.9, remains
  PENDING.** A live structured-audit rejection exposed a shared-quantity
  validator seam: a nonnumeric global claim was rejected because its supporting
  role fact line also contained a metric. Version 0.9 determines global
  attribution restrictions from quantified values shared by the claim and the
  referenced role fact, not merely any number in that fact. Nonnumeric Summary
  and Core Skills claims may cite audit-supported mixed duty/metric facts.
  Explicit numeric global claims still require the exact owning title or
  employer; unlinked numbers, unknown references, cross-role experience
  references, wrong-role numeric collisions, and unsupported audit verdicts
  remain fail-closed. RDM-82…RDM-92 use synthetic fixtures and preserve all
  caps, calls, zero retries, draft limit, posting isolation, `store: false`, no
  logging/storage, and the `UNVERIFIED` external monthly cap. No call or cap is
  added; maximum incremental API exposure is $0. Lane: AUTO for internal
  governance; app implementation remains Commander-gated. Owner: force-mod.
- 2026-08-30 — **#6 `resume-drafter-maintenance` 0.7 -> 0.8, remains
  PENDING.** A live pre-audit rejection exposed a generation/validation seam:
  the generator could receive raw unlinked global numbers that the deterministic
  gate correctly refused. Version 0.8 requires catalog-first generation and a
  separate draft-eligible scoped fact view, excluding the raw ledger, `MISSING`,
  raw `NUMBERS AND SCALE`, and every global unlinked number. Role ownership and
  exact identities remain binding; one-page pressure may reduce bullets but not
  roles. Deterministic failures now require distinct content-free categories,
  and filler checks apply only to prose. RDM-69…RDM-81 use synthetic portable
  fixtures and preserve facts/repair 3500, civilian 2200, federal 1900, audit
  4000, calls, zero retries, draft limit, posting isolation, `store: false`, no
  logging/storage, and the `UNVERIFIED` external monthly cap. No call or cap is
  added; maximum incremental API exposure is $0. Lane: AUTO for internal
  governance; app implementation remains Commander-gated. Owner: force-mod.
- 2026-08-30 — **#6 `resume-drafter-maintenance` 0.6 -> 0.7, remains
  PENDING.** A live six-role civilian draft exposed conflicting placeholder
  rules and lost number provenance. Version 0.7 makes civilian output
  candidate-ready: unknown contact/header, role location/date segments, and
  education years are omitted; `MISSING` stays in the reviewed ledger; optional
  gaps are `NEEDS MEMBER FACT`; brackets, literal `MISSING`, and `TIP:` are
  prohibited in civilian output while federal brackets remain unchanged.
  Identity fields stay byte-exact, translations move to summaries/duties, and
  unrelated numeric runtime exemplars are prohibited. A request-local
  role-scoped fact catalog closes `fact_refs`; global unlinked numbers cannot
  support role or ambiguous summary claims, and unknown/cross-role references
  fail closed. RDM-54…RDM-68 use a synthetic, structurally equivalent six-role
  reproduction rather than member source or an attachment path, and preserve
  facts/repair 3500, civilian 2200, federal 1900, audit 4000, calls, zero
  retries, draft limit, posting isolation, `store: false`, no logging/storage,
  and the `UNVERIFIED` external monthly cap. No call or cap is added; maximum
  incremental API exposure is $0. Lane: AUTO for internal governance; app
  implementation remains Commander-gated. Owner: force-mod.
- 2026-08-30 — **#6 `resume-drafter-maintenance` 0.5 -> 0.6, remains
  PENDING.** Root cause moved the live limit from draft generation to button-one
  fact extraction. Version 0.6 sets mode-independent Luna extraction and Terra
  repair hard caps of 3500, excludes the full posting while retaining the
  explicit target, bars posting content from member facts, and withholds every
  partial sheet with fact-stage wording. Maximum output exposure is $0.00420
  initial, $0.04200 repair, $0.04620 repaired worst case, and $0.02904 added
  worst case over 1300. RDM-44…RDM-53 preserve civilian 2200, federal 1900,
  audit 4000, calls, zero retries, `store: false`, no logging/storage, and the
  `UNVERIFIED` external monthly cap; they also record that the local three-draft
  limit is not a fact-request cap. Any fact cap above 3500 requires a new
  architecture review. Lane: AUTO for internal governance; app implementation
  remains separately gated. Owner: force-mod.
- 2026-08-30 — **#6 `resume-drafter-maintenance` 0.4 -> 0.5, remains
  PENDING.** Repeated generation-stage `output_limit` evidence authorizes a
  civilian hard ceiling of 2200: +600/37.50% over 1600 and +900/69.23% over the
  original 1300, with maximum added exposure of $0.0072/$0.0216 per draft/day
  over 1600 and $0.0108/$0.0324 over 1300. The trace contract now permits the
  model to omit claim text only behind a closed request-local `C1`…`Cn`
  inventory, exact ID-set validation, and byte-exact server reattachment before
  the UI response. RDM-33…RDM-43 preserve complete trace, ten dimensions and
  evidence, federal 1900, audit 4000, fact/repair caps, calls, zero retries,
  `store: false`, no logging/storage, and the `UNVERIFIED` external monthly cap.
  RDM-43 fails closed on an empty inventory before any audit call and prohibits
  constructing an empty `claim_id` enum.
  Any increase above 2200 requires a new architecture review. Lane: AUTO for
  internal governance; app implementation remains separately gated. Owner:
  force-mod.
- 2026-08-30 — **#6 `resume-drafter-maintenance` 0.3 -> 0.4, remains
  PENDING.** Records reproduced generation-stage `output_limit` evidence and the
  approved civilian-only cap increase from 1300 to 1600: +300 tokens or 23.08%,
  with maximum added exposure of $0.0036 per draft and $0.0108 per three-draft
  browser day at verified Terra output pricing. RDM-30…RDM-32 hold federal at
  1900, audit at 4000, fact/repair behavior and caps unchanged, zero retries,
  unchanged call count, `store: false`, no logging/storage, and the external
  monthly cap at `UNVERIFIED`. Lane: AUTO for internal governance; app
  implementation remains separately gated. Owner: force-mod.
- 2026-08-30 — **#6 `resume-drafter-maintenance` 0.2 -> 0.3, remains
  PENDING.** Governs the approved audit-only capacity increase from 3000 to
  4000, separates generation-stage from audit-stage output limits, and requires
  audit-specific member-safe wording. Records the exact 33.33% cap increase,
  $0.012 maximum added exposure per audit, $0.036 per three-draft browser day,
  and conservative ceilings of $0.08/$0.24. RDM-24…RDM-29 preserve all other
  caps, zero retries, call count, full schema, complete trace, ten score
  dimensions, no logging/storage, and the `UNVERIFIED` external monthly cap.
  Lane: AUTO for internal governance; app implementation remains separately
  gated. Owner: force-mod.
- 2026-08-30 — **#6 `resume-drafter-maintenance` 0.1 -> 0.2, remains
  PENDING.** Adds an allowlisted, content-free failure contract for output
  limits, timeouts, rate and budget limits, upstream failure, quality-gate
  rejection, and unknown incomplete responses. Raw errors, member content, IDs,
  token details, logging, persistence, retries, and unapproved cap changes are
  prohibited. RDM-17A…RDM-23 cover classification, sanitization, privacy, and
  cap evidence. Lane: AUTO for internal governance; app implementation remains
  separately gated. Owner: force-mod.
- 2026-08-30 — **#6 `resume-drafter-maintenance` drafted at 0.1, remains
  PENDING.** Coverage was PARTIAL: the private OpenAI clone had fact extraction,
  selected grounding checks, separate civilian/federal prompts, and `store:
  false`, but no governed scorecard, complete claim trace, or executed regression
  suite. Version 0.1 defines blocking grounding and identity invariants, ten
  score dimensions, the claim-to-confirmed-fact trace contract, privacy and cost
  requirements, and RDM-1…RDM-17 plus RDM-X1…RDM-X3. The external monthly budget
  cap is explicitly **UNVERIFIED** until direct account evidence exists. Remains
  PENDING until app regression execution and Commander review. Lane: COMMANDER.
  Owner: force-mod.
- 2026-08-06 — **#12 `member-impact` added as PENDING, owner s2-intel.**
  Coverage test returned **NONE**: every skill we hold governs whether content is
  TRUE (#3), LANDED (#1), SAFE (#2), or IN VOICE (#4). **Nothing governed whether
  a transitioning member is better off for reading it.** #11 could not serve as
  the filter — its G2 requires content already merged and serving, so **the only
  usefulness test in the repo was unreachable at the moment the ship/decline
  decision is made.** Drafted by force-mod on Commander tasking; amended and
  executed by the Orchestrator.
  **Four axes:** WHO and when it bites (closed population set, mandatory
  exclusion line, band from a **written-out closed list** rather than a grep) ·
  THE ACT (§F's G3 imported as the general test, with named non-acts) · WHERE IT
  LANDS (plus the citation token, which must be live) · WHAT NOT KNOWING COSTS.
  **The load-bearing clause: "No act ⇒ A4 is NOTHING regardless of topic
  importance."** That is where topic importance gets smuggled in and where it
  stops.
  **DECLINE is first-class and sub-dispositioned** — INOCULATE / GAP / LOG ONLY.
  The discriminator is the **closure test**: write the reader's next question,
  and if the app cannot answer it in the same ship, INOCULATE is denied.
  *"Publishing context that provokes a question we cannot answer is not
  inoculation, it is a wound."* **DECLINE is not silence** — INOCULATE ships a
  card whose job is the negation.
  **Verdicts are re-runnable, not permanent**: a verdict is a function of the
  app's state, not the finding's dignity. V-2026-004 failed the closure test the
  day the app had no homeless content and **passes now that 877-424-3838 ships.**
  **Amendments beyond the original tasking:** citation token named in A3 (a
  surface alone is not enough — `[VA HOME LOAN]` named a real surface and printed
  as dead text); an **EXPIRES** stamp, because §0.8's lesson runs both ways and
  **usefulness decays too**; and the decline-rate tally recorded **in the weekly
  SITREP beside N7, not on the registry validation line — where numbers go to not
  be read.**
  **Rejected from this skill by Commander ruling, and recorded so it is not
  re-absorbed:** truth-to-implementation for **outgoing self-descriptive claims**.
  Real, earned by the 6 AUG privacy defect, and **a different subject** — to be
  drafted separately as doctrine. Fence three exists to hold that line.
  **PENDING until registration, and MI-1…MI-9 EXECUTED FIRST, 9/9**, per the
  `validation-gate` 1.4 precedent where the registry advanced on execution
  evidence and three coverage claims died in that execution. Both mandatory
  declines returned DECLINE with the correct sub-disposition; the positive
  control (VET TEC, MI-4) returned SHIP — ACT. Results in
  `.claude/skills/member-impact/calibration-cases.md`.
  **Stated limit:** MI-9 against #3 is **specification-level only** — #3's P1–P6
  were specified, never executed.
  Lane: **COMMANDER**, all of it — blast radius is what a member is told to do
  and, sharper, what they are not told.
- 2026-08-05 — **#11 `push-worthy` added as PENDING; #7 `push-ops` fenced.**
  Coverage test returned **NONE**: no existing skill covers push-recommendation
  criteria, and the nearest doctrine (§D.4) is a *prohibition* on routing
  operator alerts through OneSignal — so an agent searching the registry finds
  "don't" and no rule saying when it may. That shape produces paralysis or
  improvisation. Doctrine drafted as design-doc **§F**, deliberately NOT as a
  §D.6: §D and N5 forbid a third severity tier, and PUSH-WORTHY is a different
  axis (§D grades how the machine reaches Dean; §F grades whether Dean reaches
  users). F0 carries the non-amendment clause. Commander's fourth candidate
  criterion, "major family/spouse development," **deleted** — a topic has no
  threshold, and it would have pushed the spouse-commission EO that the
  regression set requires to return NO. Orchestrator corrected force-mod's
  label-attachment rule, which excluded NO-APP-EXPOSURE and would have made its
  own VET TEC 2.0 YES case unreachable. Lane: **COMMANDER**, all of it — blast
  radius is every subscribed user's lock screen. Registration blocked on
  PW-1…PW-9 and PW-X1…PW-X4, plus V-17.
- 2026-07-31 — Registry established. Skills 1–4 codified from workflows
  reconstructed out of project session history (Phase 1, Build Step 1).
  Skills 5–10 scheduled for codification during Build Steps 2–5.
- 2026-07-31 - validation-gate 1.0 -> 1.1. (a) Adds INTEGRITY MODE: a defined
  procedure branch when `git status --porcelain` is empty, with prescribed
  substitute checks for the three diff-scoped steps (1 presence, 2 absence,
  5 untouched-region) plus explicit reporting rules that keep N/A as N/A.
  (b) Promotes `node --check` and `JSON.parse` to the primary structural check;
  brace/paren/bracket counting is demoted to a labeled fallback for when no
  parser is available or raw JSX is present. (c) Encoding check tightened to
  the real invariant: curly quotes and U+00A0 are hard zero, em/en dashes are
  legitimate in HTML text and are not defects. Driver: s3-devops read-only gate
  run at dd4e1f0 against a clean tree had to improvise substitute checks and
  fell back to brace counting. FAILURE RESPONSE and Evidence rules unchanged.
  Drafted by force-mod, validated by s3-devops regression cases R1-R4.
  Lane: COMMANDER (touches the deploy pipeline). Owner s3-devops.
  Open follow-up: regression case R5 (cross-skill non-interference vs
  deploy-discipline #2 and policy-verification #3) specified but not
  executed; tracked, not blocking.
- 2026-08-01 - deploy-discipline 1.0 -> 1.1. Adds a mandatory service-worker
  cache-bump requirement as FORWARD PATH step 2, placed before the
  validation gate so the bump is covered by a single gate run instead of
  triggering FAILURE RESPONSE rerun. (a) Defines the bump trigger as any
  change to a file backing an entry in the `sw.js` ASSETS list, enumerated
  as an entry-to-repo-file table (index.html, manifest.json, both icons,
  va-math/index.html, both vendor/react files) with a `git diff
  --name-only` trigger check, a `git diff | grep CACHE_NAME` proof check,
  and an ASSETS drift check that stops and flags force-mod if sw.js
  enumerates an asset the skill does not. (b) States the mechanism
  accurately: sw.js is NETWORK FIRST with a 3500 ms timeout and re-caches
  successful GETs, so online users self-heal; the exposed population is
  users on dead or >3.5s connections, who are served the install-time
  precached shell. Narrow and real, deliberately not inflated. (c) Firewalls
  `APP_VERSION` (index.html:2560): it is not the cache counter, it gates the
  What's New badge (read 4254, written 6439, coupled to WHATS_NEW[0].v), and
  bumping it re-shows the panel to every user. Three counters - CACHE_NAME,
  APP_VERSION, and the cosmetic PWA BUILD comment at index.html:497 - are
  documented as deliberately independent and MUST NOT be unified; APP_VERSION
  and WHATS_NEW are Dean's editorial call and require COMMANDER approval.
  (d) Adds a SKILL SEAM section splitting ownership with validation-gate 1.1:
  the gate owns parse, encoding, and untouched-region on sw.js; this skill
  owns whether a bump was required, whether the integer moved forward, and
  whether it was ever used. GATE PASS is explicitly not cache-bump
  clearance. (e) ROLLBACK gains a mandatory forward bump: a revert restores
  the prior CACHE_NAME, and a subsequent re-land at current+1 reproduces a
  cache name that already holds the defective shell byte-identically, so no
  worker update is detected and offline users keep the defect indefinitely.
  Next number is therefore derived from main's history (max ever + 1), never
  from the current file value; reverted integers are burned permanently.
  PROHIBITED list extended by four items. v1.0 content, numbering intent, and
  voice preserved; existing steps are verbatim, renumbered 2-5 to 3-6.
  Driver: force-mod cache-staleness gap note, corrected on severity framing
  by the Commander. Drafted by force-mod; regression spec R1-R6 in
  `deploy-discipline-coverage-v1.1.md`, executed by s3-devops.
  Lane: COMMANDER (deploy pipeline). Owner s3-devops.
  Closes the prior open follow-up on validation-gate R5 cross-skill
  non-interference for the deploy-discipline pair (R5 here); the
  policy-verification pair is covered by R6.
- 2026-08-02 - deploy-discipline 1.1 -> 1.2. Never-push doctrine. (a) PROHIBITED
  gains a new first entry: pushing to `origin` is prohibited on any branch in any
  circumstance; agents stage local commits and Dean merges and pushes. The
  rationale is recorded in the entry itself - "branches but not main" is a
  judgment call, `main` auto-publishes, and a rule requiring the agent to
  classify the target correctly every time is one mistake from a deploy.
  (b) FORWARD PATH step 4 rewritten from "Open a PR to `main`" (which implied
  push authority) to staging the branch locally for Dean to merge and push.
  Driver: the Commander set this as standing doctrine on 2026-08-02 after an
  agent attempted `git push -u origin <feature-branch>` to package a validated
  branch for review. That specific push was assessed harmless; the objection was
  to the rule it implied. Drafted by the Commander, applied by the Orchestrator -
  NOT routed through force-mod, and no regression cases were written or run.
  Lane: COMMANDER (deploy pipeline). Owner s3-devops.
  (c) FORWARD PATH steps 5 and 6 rewritten, because step 4 orphaned them. Both
  assumed a pushed branch - step 5 directed validation on a Netlify Deploy
  Preview URL, step 6 required handing over a "PR link, preview URL" - and
  neither artifact can exist at agent handoff once agents do not push. Step 5 is
  now local validation, with an explicit bar on claiming preview evidence that
  cannot exist. Step 6 now requires branch name, `git log --oneline`, diffstat,
  gate evidence, cache-bump line, blast radius, and a PREVIEW CALL.
  (d) Adds STEP 6 DETAIL - THE PREVIEW CALL. The handoff must state whether the
  diff warrants a pre-merge preview and why: default NO for doctrine and process
  ships (`.claude/**`, `skills-registry.md`, `intel/**`, `*.md`), default YES for
  anything user-facing (index.html, manifest.json, icons, va-math/, vendor/**,
  sw.js caching logic). When Dean wants one, HE publishes the branch from GitHub
  Desktop and validates before merging; agents still never push. Omitting the
  call is an incomplete handoff - silence reads as "not needed."
  Validation: the Commander accepted this doctrine as validated by his own
  review on 2026-08-02. No force-mod regression cases were written or run, by
  his explicit decision. The prior blocking follow-up on steps 5 and 6 is CLOSED.
- 2026-08-02 - policy-verification 1.0 -> 1.1. Walled-source doctrine. The skill
  assumed primary sources are reachable; in practice congress.gov, DFAS.mil,
  eCFR.gov, dcsa.mil, esd.whs.mil, veterans.house.gov and ftb.ca.gov return 403
  or bot-walls, and findings were sitting at PROBABLE for ACCESS reasons rather
  than EVIDENCE reasons. (a) Adds WALLED SOURCES: separates access failure from
  evidence failure and introduces a fourth rating, BLOCKED (source not read),
  with a required record of host, status, highest tier attempted, and date.
  BLOCKED does not ship and is not a resting state. (b) Adds ESCALATION LADDER:
  tier 1 WebFetch, tier 2 orchestrator-only Chrome browser
  (mcp__claude-in-chrome__navigate then get_page_text, proven 2026-08-02 against
  a congress.gov Cloudflare interstitial and veterans.house.gov), tier 3 human
  verification by Dean as a FULL citation of record with a mandatory auditable
  record format, tier 4 only then rate below CONFIRMED. CAPTCHA solving or
  bypass is PROHIBITED and a challenge demanding human interaction ends tier 2.
  Encodes the SUBAGENT LIMIT: s2-intel/s2-scanner/s2-vetting have no browser
  tools, so an analyst reports the wall and stops while the orchestrator runs
  tier 2 and hands page text down. (c) Adds the AMENDED-BILL RULE: an
  introduced-version summary is not evidence about a bill that passed as
  amended; "as amended" in the actions or a title change between versions voids
  it and the engrossed text settles content. Driver is a live production error -
  the app claimed H.R. 980 provided "monthly VA outreach" reasoned off the
  introduced-version CRS summary, while the engrossed text SEC. 4(a) is a
  contact-information requirement with no cadence anywhere in the bill.
  Distinguishes standalone CRS products (admissible; IF10260 carried the 3.8%
  pay raise) from version-scoped CRS bill summaries.
  Drafted by force-mod. Regression spec P1-P6 specified, NOT executed.
  Lane: COMMANDER (benefits/policy content). Owner s2-intel.
  (d) Charter patch, same branch: `.claude/agents/s2-intel.md` enumerated exactly
  CONFIRMED / PROBABLE / UNVERIFIED, which left the new BLOCKED rating
  unreachable by the agent that owns this skill. Its rating enumeration now
  carries BLOCKED, with the no-browser-tools constraint and an explicit bar on
  downgrading a wall to PROBABLE. Flagged by force-mod during the draft,
  authorized by the Commander 2026-08-02, applied here. Prior blocking
  follow-up CLOSED.
- 2026-08-02 - validation-gate 1.1 -> 1.2. No-unreviewed-bulk-scripts doctrine,
  standing Commander feedback from 2026-07-31 now codified. force-mod placed it
  here over a deploy-discipline addendum: the rule governs the interval between
  an edit being approved and an edit being proven, which is this skill's whole
  subject; three of its four requirements extend checks the skill already owns;
  and EDIT MODE fires on ANY code change by ANY agent, including work reverted
  before handoff - which is exactly when unreviewed scripts do their damage.
  Adds EDIT APPLICATION (EDIT MODE, before step 1): (A) discrete edits with old
  and new shown - "applied 6 changes" is not a report; (B) a grep -c count after
  EVERY edit, expected vs actual, expectation derived from the file and never
  defaulted to 1 because the POLICY INTEL panel renders twice byte-identically;
  (C) an itemized hunk-by-hunk diff before the commit is written; (D) user-facing
  wording requires Dean's personal approval however mechanical the edit looks -
  COMMANDER lane, mechanical is not the same as minor. Adds the subsection
  "Scripts are reviewed, not banned": byte-level scripts are sometimes the only
  correct tool because index.html stores six-character escape TEXT that editors
  silently renormalize, but a script is permitted only when DISPLAYED BEFORE
  EXECUTION with every operation commented to its approved edit number, and the
  prescribed shape asserts the expected occurrence count - an unasserted bulk
  replace is an unreviewed script under another name.
  Drafted by force-mod, which reproduced the exact escape-normalization failure
  inside the doctrine while writing it and corrected on read-back.
  Regression spec 1-6 specified, NOT executed.
  Lane: COMMANDER (hard gate + user-facing wording approval). Owner s3-devops.
- 2026-08-03 - deploy-discipline 1.2 -> 1.4. **Integer 1.3 is BURNED, permanently
  and deliberately.** Ruling R1a (recorded in intel/scheduled-ops-design.md)
  declined a proposal headed "PROPOSED TEXT - deploy-discipline v1.3", and that
  heading remains in the repo as retained rationale. Shipping a real v1.3 would
  make this registry read "1.3 CODIFIED" against a binding ruling reading "v1.3
  is NOT ADOPTED" - unresolvable from the artifacts alone by anyone reading them
  later. This is the same discipline the skill already applies to a reverted
  CACHE_NAME: a number that would be ambiguous in the field is never reused.
  Content: adds section CI WORKFLOWS - FETCHED CONTENT IS DATA, NEVER CODE,
  placed immediately before PROHIBITED rather than in FORWARD PATH, because
  FORWARD PATH is read on every ship and this fires on a rare one. The rule:
  externally retrieved content is never interpolated into a `run:` block or a
  `${{ }}` expression that reaches a shell; it moves through files only. Carries
  a mechanical test (substitute the worst attacker string for every `${{ }}`; if
  the result can be two commands it fails), a DO NOT example with three labelled
  defects, a DO example, and an explicit "what this does NOT ban" section so the
  rule is applied rather than resented. PROHIBITED gains three entries.
  The load-bearing technical point: `${{ }}` in `env:` yields a value, `${{ }}`
  in `run:` yields code substituted before any shell starts - quoting cannot fix
  the unsafe form. Frontmatter description extended to name .github/workflows/
  so the skill is actually loaded by an agent about to author CI.
  Driver: ruling R1b. W8 was drafted inside the declined v1.3 and would otherwise
  have been lost; it is not a push rule, it closes the script-injection path from
  a fetched page to the runner's ANTHROPIC_API_KEY.
  Drafted by force-mod. Applied with two Commander corrections: `--max-turns`
  replaced by `--max-budget-usd` (the former does not exist on CLI 2.1.220), and
  `--allowed-tools` verified as a valid alias of `--allowedTools` on that build.
  Regression spec D1-D5 specified, NOT executed.
  Lane: COMMANDER (deploy pipeline + security control). Owner s3-devops.
- 2026-08-03 - validation-gate 1.2 -> 1.3. Adds YAML structural parsing to step 4
  and 4I. Driver: the skill's structural check was `node --check` and JSON.parse,
  neither of which parses YAML, and this repo was about to commit its first
  .github/workflows/*.yml - the gate would have reported a clean structural PASS
  on a file it never parsed, which is the exact silent-green failure the skill
  exists to prevent. Prescribes `ruby -ryaml -e '...YAML.parse_stream...'`:
  Psych is in-tree, offline and deterministic, `parse_stream` covers
  multi-document files that `YAML.load` would silently truncate to the first doc,
  and PyYAML is unavailable here (python3 3.9.6, no yaml module). Explicitly
  PROHIBITS npx js-yaml - a gate step must not fetch over the network. Scope is
  parseability only, matching how step 4 already treats JS and JSON; semantic
  workflow linting is a separate skill and a separate decision, flagged to Dean
  and not bolted on. Records the YAML 1.1 trap (bare `on` parses as boolean
  true - verified, a workflow's top-level keys come back as ["name", true,
  "jobs"]) and a labelled no-Ruby FALLBACK. Block inventory now records the YAML
  set; the empty set is a valid fingerprint that must be reported, never omitted.
  Also adds DO NOT PIPE THIS COMMAND: `ruby ... | head` makes $? report head, so
  a Psych::SyntaxError prints while the step still exits 0. Found by executing
  the cases, not by reading them.
  Drafted by force-mod. Regression cases Y1-Y5 **EXECUTED**, evidence in
  intel/scheduled-ops-design.md section 8.4 - including the deliberate
  scope-boundary case (valid YAML, semantically garbage, must PASS). force-mod
  argued this item must close on execution rather than on the text landing,
  because it is the gate standing between this repo and its first workflow
  commit; that argument was accepted.
  Lane: COMMANDER (hard gate). Owner s3-devops.
- 2026-08-05 - **validation-gate 1.3 -> 1.4. Adds step 4S, `actionlint`, to EDIT
  MODE.** Driver: the J2 startup failure of 3 AUG 2026
  (`intel/scheduled-ops-design.md` section 8.10). A shell comment inside a `run:`
  block held an Actions expression with an empty body; GitHub substitutes
  expressions textually before any shell exists, so the leading `#` protected
  nothing and the file was rejected at startup with zero steps run. Every local
  layer passed - YAML parsed under Psych, Python compiled, governor regression
  7/7 - because none of them is GitHub's schema.
  (a) 4S fires only when the diff touches `.github/workflows/`, runs AFTER step
  4's Ruby parse and BEFORE staging. Neither layer replaces the other: step 4
  covers every YAML in the repo with an in-tree offline parser and remains the
  fallback authority when the binary is missing or its hash fails.
  (b) Pinned to v1.7.12, `actionlint_1.7.12_darwin_arm64.tar.gz`, SHA-256
  `aba9ced2dee8d27fecca3dc7feb1a7f9a52caefa1eb46f3271ea66b6e0e6953f`, per the V-6
  discipline. **Hash verified before extraction on install and matched character
  for character.** `brew install` is non-conforming; `-version` is checked every
  run.
  (c) Carries the DO NOT PIPE warning forward from step 4 verbatim.
  (d) LOCAL gate, explicitly NOT a CI job (W-2).
  (e) Binding DISPOSITION RULE: zero findings is the only PASS, a hit inside a
  comment is still a hit, and "COMMENT (inert)" is a prohibited disposition - it
  is what cleared the 8.10 defect after the sweep had already found it.
  **(f) Non-coverage list, REWRITTEN FROM MEASURED EVIDENCE rather than carried
  over from the drafted text.** R0-R11 executed 5 AUG 2026, and three coverage
  claims in the draft did not survive execution and were struck before the text
  was applied: **shell analysis of `run:` bodies is INERT** - actionlint delegates
  to a separate `shellcheck` binary which is not installed, so section 8.9's gap
  stays OPEN (R6); **`github.event.*` payload is not validated against the
  trigger** - `github.event` is typed as a bare object (R4); and **`with:` input
  names are not checked on SHA-pinned refs** - the input dataset is tag-keyed, so
  the full-SHA form V-6 mandates silently disables input validation (R7).
  SHA-pinning of `uses:` is likewise not enforced by actionlint (R5), so 4S
  carries **its own mechanical SHA-pin assertion** as a separate bullet: full
  40-hex commit SHA required, local `./` actions exempt, a version comment is not
  a pin, and the check is pure `grep` so it still runs when the binary is
  unavailable. The V-6 control is now asserted by the gate rather than only
  cross-referenced from it. Regression R11 (unpinned MUST FAIL, negative control
  against the live files, self-certifying `@tag # pinned` case). Commander ruling
  3 AUG 2026, flag 2 of the W-2 package resolved as option (b).
  (g) Section 8.4's scope-boundary case (valid YAML, semantically garbage as a
  workflow) still PASSES step 4 and now FAILS the gate (R9). The verdict change is
  deliberate and recorded here so a future reader does not read it as a
  regression.
  **Regression evidence: R0-R11 executed 5 AUG 2026, full results at
  `intel/scheduled-ops-design.md` section 8.14. The registry advanced on
  execution, not on approval.**
  Basis: Commander ruling W-2, 3 AUG 2026, `intel/scheduled-ops-design.md`
  section 8.5. Drafted by force-mod in
  `intel/patch-2026-08-03-validation-gate-1.4-actionlint.md`; corrected against
  evidence and applied by the Orchestrator, 5 AUG 2026.
  Lane: COMMANDER (hard gate). Owner s3-devops.
