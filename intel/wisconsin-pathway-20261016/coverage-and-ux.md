# Wisconsin pathway: coverage and UX contract

Reviewed October 16, 2026, America/Chicago. Role: force-mod, executed by a Codex subagent, not Claude. A genuine independent Claude review was subsequently read at `claude-review-20261016.txt`; its recorded source is https://claude.ai/chat/7079f0f5-86be-4683-afdc-4982d1f58a8a (root observed Claude desktop, existing signed-in account, Opus 5.5 Medium). Read-only application inspection of `/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops`, clean HEAD `1149ede281423de94d4ef1f93cefa35a18f12ca7` (root reports merged main `ffede239`; this packet did not independently establish production identity). Primary workspace was already dirty; only this evidence file was created.

## Coverage verdict: PARTIAL

Existing governance covers the work's safety and release seams. It does not supply a state-program coverage inventory, the state/residency/Guard applicability model, or a reusable national-to-state visitor journey. That missing product contract is defined below; no new skill or registry change was requested or performed. The user has authorized the improvement loop. This packet is not a release verdict.

| Subject | Coverage | Owner and applicable instructions |
|---|---|---|
| Truth of benefits, dates, dollars and current program status | FULL | `policy-verification` 1.1, S2; primary sources and access ladder; a stored `verified: true` is not a fresh review |
| Practical act, audience, exclusions, timing and consequence | FULL | `member-impact` draft, S2; only after CONFIRMED evidence; named office/form and a usable next action |
| Claim that the app has every Wisconsin benefit, or is best | PARTIAL | `member-return-benchmarking` + brand voice prohibit unsupported superlatives; no defined Wisconsin coverage denominator exists yet |
| National navigation with optional state-specific help | PARTIAL | Existing tool routing, service profile and local plan contracts; missing state-lens/applicability contract below |
| Guard versus Reserve, resident versus prospective mover | PARTIAL | Existing Guard/Reserve navigation does not determine eligibility; program-by-program applicability still needs S2 truth |
| Privacy and optional continuity | FULL | `privacy-truth-to-implementation`; new storage, provider flows or universal privacy claims need their own evidence |
| AI interpretation, verified sources and deterministic eligibility rules | PARTIAL | Existing Navigator and runtime-spend controls govern calls, but no state-benefit recommendation contract exists; use deterministic routing first |
| Mobile, keyboard, focus, error recovery and production identity | FULL | `accessibility-release-validation`, `validation-gate`, `deploy-discipline`; automated success does not establish manual AT or hosted acceptance |
| Third-party referral legitimacy | PARTIAL | `resource-vetting` remains PENDING; government source verification is available, a private endorsement is not inferred |

Relevant sources read: CLAUDE.md, SHARED_DEVELOPMENT.md, registry top-level scope/owner table, force-mod prompt, policy-verification, member-impact, member-return-benchmarking, privacy-truth-to-implementation, runtime-ai-spend-governance, accessibility-release-validation, brand-voice. Validation and deploy remain independently owned release gates. Current shared work and Resume, J1/S2, spend, push and provider configuration are untouched.

## Architecture: one national app, optional state context

1. **National first.** Keep Transition OPS branding and Home/Career/My Plan/Benefits/More navigation. A fresh visitor sees useful national tasks without picking a state, signing in, uploading a resume or entering a separation date.
2. **Optional location intent.** A Resources entry says `State benefits and local help`. Within that entry, a compact control says `Add state-specific help`, with `National resources` as the default and `Wisconsin` as the first developed state. State selection means an area of interest, never residence, tax domicile, a duty location or eligibility. Do not infer it from IP, ZIP, a resume or a job search. Other-state users retain all national tools and an official state-office locator; do not present an empty or fake-complete 50-state catalog.
3. **Situation and need before local detail.** Preserve the member's current national next step. Reuse a valid existing service profile to prioritize relevant routes; optional service context inside the state view must not create a second mandatory onboarding flow. The Wisconsin view asks `What do you need next?` and offers a short list of member tasks: work/training, education, benefits/claims, health/family support, moving/housing, and continuing Guard/Reserve service. Show one chosen task's answer and first action. Secondary material is under `Details and eligibility` and `Official source`.
4. **Service context is optional and independent.** Reuse the existing saved service profile. If a program requires finer distinctions (Guard versus Reserve, serving versus released from orders, retired), ask only within that task or route to the responsible office. Preserve `Not sure` and browsing. Do not force Guard/Reserve members into separation, retirement or a transition date.
5. **Moving is not qualifying.** Where useful, `I live in Wisconsin`, `I plan to move there`, `I am comparing states` can change wording and suggested preparation, never establish entitlement. First iteration may omit this input and state the distinction in plain language; no need to collect facts the app cannot safely act on.
6. **Reuse tools, don't make a second app.** Route into the existing career workspace, document checklist, healthcare view, service support directory, readiness checklist and local next-step review. A member always knows where they went and can return to the Wisconsin task without losing edits. Keep one primary task CTA; avoid repeating the whole Resources directory, navigation, or plan editor inside the state view.
7. **Navigation state, not a new profile.** For the first slice, state and task choices use only bounded fixed IDs in the URL/session history; no new persistent storage. Explicit choices should survive reload, native Back/Forward and deep links. A Wisconsin public link expresses interest in that guide, not residence, and contains no member text. Invalid/unknown route IDs fall back to national help. Return labels name the destination, and focus returns to the original choice or task heading.
8. **One next step across the app.** Reuse the current reviewed plan-step boundary. Do not silently replace an unfinished step. Existing questions, current role, worksheet and date are preserved; a deliberate save or visit-only choice is explicit. Add benefits actions only where current verified content supports them.
9. **First slice needs no paid AI call.** Deterministic need-to-tool/source routing is faster and predictable. Claude can independently critique and challenge the build using public/synthetic material. Any future in-app AI should explain verified program records, suggest one next question and cite the exact source; it must never grant eligibility, invent deadlines or add an ungoverned runtime route. Existing model/provider/spend controls stay fixed.

Proposed catalog contract, before scaling to Midwest: each record has stable program ID, jurisdiction, member task, audience scope, eligibility caveats, residency/duty-status constraints, authoritative URL, verified date and effective/expiry dates when present, a named next act/office, existing tool route, source receipt, and coverage disposition. Distinguish a *referral route* from a *verified benefit summary*. Keep national records separate from state supplements so a state selection cannot remove federal tools.

## Independent Claude review disposition

The actual Claude advice is review evidence, not policy verification. **Adopt:** strongest objection to adding a large state section before understanding the member's situation; optional state choice that changes local offices but does not determine eligibility; one next action; explicit destination labels; national fallback; reload and Documents-return tests. **Adapt:** apply situation-first ordering inside the existing Resources/state-help entry and reuse the existing profile, rather than adding four more Home buttons. **Already present:** calendar export and reminders; preserve rather than rebuild. **Not approved as policy:** all benefit deadlines, USERRA examples and eligibility examples Claude marked VERIFY remain research leads for S2. **Evidence gap:** six synthetic journeys can find failures but cannot establish comprehension for real members. After the bounded slice, seek voluntary feedback with synthetic details from varied members; do not block independent authorized implementation because the feedback is not yet available.

## Current app map (CODE-OBSERVED, not a live usability result)

All line references below are in the inspected candidate's `index.html`.

| Entry | Current behavior | Suggested reuse |
|---|---|---|
| `TOPS_SERVICE_PROFILES`, line 6876; `ServiceProfileEditor`, 6893 | Five choices: active, Guard/Reserve combined, separated, retired, spouse; help already says selection does not determine eligibility; saved through existing safe storage | Reuse for relevant navigation; preserve schema and category values in the first slice |
| `TOPS_TOOL_CHOICES`, 6878; `renderHomeSearch`, 10363; `renderHomeTools`, 10428 | Shared national destinations, search and four Home shortcuts | Add a discoverable state-help entry and need synonyms without a new top-level tab or replacing Home |
| `GuardCareerSupport`, 6753; directory control, 6795 | Internal session-only `national`/`wi` choice; WI choice prepends DMA Service Member Support; national referrals remain | Consolidate with optional state lens later; avoid two conflicting state pickers. "Wisconsin example" label does not convey comprehensive coverage |
| `TOPS_WISCONSIN_WORK_SUPPORT`, 7472; `WisconsinWorkSupport`, 7483 | Concrete work-cost guidance, Job Center/ETPL links, questions, reviewed next step, visit/save modes, share URL and source section | Strong first task to retain inside Wisconsin task view; do not rewrite verified WIOA substance |
| `topsWisconsinGuideURL`/`topsIsWisconsinGuideURL`, 7481–7482 | Bounded public `?tool=resources&guide=wisconsin-work-support` route; no member text in share URL | Preserve old links; design a separate allowlisted state/guide route if needed |
| `CareerLearning`, 7560; Wisconsin panel, 7582 | Wisconsin work support is shown inside national career learning without state selection | Keep access, but state-specific prominence should follow a deliberate state choice rather than look nationally applicable |
| `openWisconsinGuide`, 10226; `wisconsinPlanSnapshot`, 10230; `applyWisconsinStep`, 10231; `wisconsinSupport`, 10257 | Routes to directory, focuses guide; snapshot and reviewed support step protect concurrent drafts | Reuse routing/focus and single-plan transaction boundaries rather than invent another save system |
| Search injection, 10392–10393 | Wisconsin work-cost keywords route directly to guide | Extend to verified state-help task labels; search result must say Wisconsin |
| Resource selector, 15327–15329 | Topics include national support, health and documents; Wisconsin panel is inserted unconditionally ahead of directory filters | Best bounded landing integration: compact national-default state lens, then contextual task cards, preserving current topic control |
| Wisconsin CVSO/TVSO, 15357 | Official Wisconsin directory link inside claims/VSO topic | Reuse as the human routing destination only within verified wording; new numeric or universal claims need fresh evidence |
| `TOPS_DOCUMENT_RETURNS`, 8817; return capture, 9457; return handler, 9476 | Allowlists named origins including Wisconsin work guide and resource topics | Include any new state guide origin deliberately; test reload and Back/Forward; do not regress PR149 |
| `userState`, 9220; tax entry, 17500 | Standalone two-letter state tax input in memory | Do not reuse as residence or state-benefit consent; benefit interest is not tax domicile |
| `jobsQ.state`, 9015/12448 | Separate job search state/ZIP | Do not silently adopt as resident/benefit state |
| Guard dashboard, 11132 onward; `GuardCareerSupport` call, 11160 | Guard-specific home with career support, readiness and broad service guidance | State help must augment it and preserve the existing selected career action |
| Operation Ownership, 8146 | Regional business-ownership pathway | Optional relevant task, not a general Wisconsin entitlement |

Fresh source evidence not produced by this code review: Wisconsin GI Bill and other education programs, state tax credits/exemptions, state hiring preference, housing/emergency grants, licensing, state health/family support, Guard tuition/reimbursement, burial/cemetery programs and every other WDVA/DMA/DWD-listed benefit. A code search did not find a unified Wisconsin benefits inventory. National topic coverage and a few Wisconsin links do not prove state completeness.

Existing useful evidence: `intel/wi-workforce-20261013/S2-verification.md` confirms bounded WIOA work-cost referral, eligibility assessment and prior approval; it explicitly includes all four member-impact populations as people who can seek an assessment, not categorical funding eligibility. Reuse within that scope and date. Do not promote historic resource flags to current confirmation.

## Six synthetic visitor journeys

| Case | Synthetic situation | Expected usable result and safety check |
|---|---|---|
| WI-1 | Active-duty member, stationed elsewhere, considering moving to Wisconsin, no date supplied | From national Home reach Wisconsin work/training help with at most two deliberate navigation choices; see one Job Center first action, source and official link. No claim of residency or funding eligibility; no date required |
| WI-2 | Drilling Wisconsin National Guard member who intends to remain in service and wants training | Reuse Guard profile; find career/training and state support without an ETS clock or assumption of separation. Distinguish finding an office from qualifying for a program |
| WI-3 | Reservist living outside Wisconsin, returning from active orders and exploring relocation | National healthcare and employer-support routes remain available. No automatic TAMP, state Guard tuition or state resident benefit promise from the combined Guard/Reserve profile |
| WI-4 | Already-separated Wisconsin veteran changing careers, with an unfinished saved resume/plan step | Reach a work-cost or career tool, return to the Wisconsin task, and preserve all saved work. New proposed step requires deliberate replacement and never marks completed work as unfinished silently |
| WI-5 | Military spouse/family member planning a Wisconsin move and seeking education or family support | Eligible-for-review referral path; family coverage named only when verified. An omitted program is labelled unknown/unreviewed in internal inventory, not assumed unavailable to the member |
| WI-6 | Illinois or unknown-state visitor, any education level, skips all personalization | National app works immediately; no compulsory Wisconsin text or false empty benefits result. Can use a familiar tool, find official state contact, and change back to national resources without losing progress |

Run each at 375px, plus smallest required 320px and both themes for changed surfaces. Use synthetic data only. Include keyboard/focus, headings, source links, native Back/Forward/reload, blocked storage, old Wisconsin share links, current documents return, unsaved edits, and no-JavaScript-error checks. Manual AT/physical-device evidence remains separately reported.

## First iteration: bounded and reviewable

Build a **state-aware Resources entry and Wisconsin starting point** using already verified referral routes and existing tools. Add a primary-source coverage matrix in parallel; ship only rows individually cleared by S2. Do not claim all benefits in the first iteration or make the site Wisconsin-only.

Acceptance criteria:

- Fresh visitor can identify what the app is for and start a national tool without setup. The state supplement is optional and labelled.
- A visitor who selects Wisconsin sees no more than six clear task choices; opening one reveals one recommended first action, the relevant office/tool, and a visible way back.
- From a selected state, no more than two navigation choices to the relevant task's first useful action; eligibility questions required by official programs are not hidden to meet a click target.
- Every first-slice Wisconsin benefit statement has a current primary-source receipt and one honest applicability boundary. Unknown conditions route to the named determining office; they do not receive an AI inference.
- Bounded fixed state/task IDs in URL/history survive reload and native Back/Forward, unknown IDs fall back to national help, and returning from Documents restores the exact prior task/focus. National, Wisconsin, existing WIOA direct links and Guard support choices agree; no redundant/conflicting state selection. Do not repurpose job-search state or tax state as residency.
- Existing plan, documents, resume and career drafts survive entry/return/reload. Saved steps are changed only through the existing deliberate review boundary.
- All six synthetic journeys pass; 320/375px changed surfaces retain readable labels, 44px targets, no ordinary horizontal scroll and visible keyboard focus.
- Required validation suites pass on one candidate. No extra model calls, telemetry, external accounts or content transmissions occur from state selection. Manual AT and production evidence are not implied by local success.
- The catalog has an explicit denominator: every program in the chosen official Wisconsin overview(s) is marked mapped, awaiting verification, intentionally out-of-scope with reason, or superseded. A reviewed inventory is distinct from shipped coverage.

Mechanism disposition: **LOCAL SYNTHETIC TEST** for optional state context, task-first presentation and cross-tool continuation. Plausible member benefit: less search and less repeated setup. Outcome and retention remain **UNMEASURED**; neither successful tests nor more benefit links proves return or real-world usefulness. Exact next loop: inventory/verify → simplify one task → synthetic walkthrough → independent Claude challenge → fix observed friction → retain evidence and review release. Reuse that same program model for surrounding Midwest states only after Wisconsin's source coverage and journeys are explicit.
