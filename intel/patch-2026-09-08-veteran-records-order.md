# September 8 executive order - verified content packet

Local candidate on `codex/veteran-records-order`, based on
`6f8447bc92a05f61828fc6d14df026eae656986b`. Content authorized by Dean through
the parent task. S2 supplied the verification memo; PAO supplied surface copy;
S3 adapted it to existing UI. No new skills. The parent reviewed the content,
source packet, v98/v159 and native disclosure button, and authorized a local
five-file commit after final gates passed. Publication, PR, hosted validation,
main merge and deployment remain separate decisions.

## Verification: V-2026-019-EO-20260908

All sources below were opened and read by S2 on **2026-09-08**, ladder tier 1.
CONFIRMED applies to the directive or existing guidance, never to completed
implementation. White House publication and signature dates are September 8,
2026. No order number appears on the canonical page; none is assigned here.

| Source | Exact URL | Verified use |
|---|---|---|
| S1 | https://www.whitehouse.gov/presidential-actions/2026/09/accelerating-access-to-veterans-benefits-and-employment-opportunities/ | Canonical order, sections 1-4 |
| S2 | https://www.whitehouse.gov/fact-sheets/2026/09/fact-sheet-president-donald-j-trump-accelerates-veterans-access-to-benefits-and-employment-opportunities/ | Same-day signature/classification corroboration |
| S3 | https://www.whitehouse.gov/presidential-actions/executive-orders/ | Exact title/date under Executive Orders |
| S4 | https://www.va.gov/disability/how-to-file-claim/when-to-file/pre-discharge-claim/ | Current BDD window, eligibility, SHA Part A, exams, filing-mode record instructions; updated June 18, 2026 |
| S5 | https://www.benefits.va.gov/BENEFITS/benefits-delivery-discharge-program.asp | BDD window/exams corroboration and personal STR copies; updated April 16, 2025 |
| S6 | https://www.va.gov/disability/how-to-file-claim/evidence-needed/standard-claims/ | Standard claims and evidence responsibilities |
| S7 | https://www.va.gov/records/get-military-service-records/ | Personal eVetRecs/SF180 requests; VA requests DD214 with benefits application; updated August 12, 2026 |
| S8 | https://www.dol.gov/agencies/vets/programs/tap | Installation TAP office for class registration requirements and prerequisites |

The parent independently captured S1: HTTP 200, exact final URL, accessed
2026-09-08T23:07:33.164689+00:00; 300210 bytes; SHA-256
`51add04a294087c213d492b49b5ad611828e20696fd10cedc2f7d3e9fe765949`.
The supplied paste matches sections 1-4 and signature/date, omitting the title.
This does not establish a Federal Register publication date. Search metadata
calling the page a proclamation was superseded by the directly read order,
official executive-order index, and same-day fact sheet.

## Claim-to-section map and limits

| Directive: S1, CONFIRMED | Agency interval | Internal calculated date |
|---|---|---|
| 2(a)(i): War/VA ongoing OMPF and STR sharing systems/policy from service entry through the period VA benefits are required, consistent with law | 180 days | 2027-03-07 |
| 2(a)(ii): digital benefits tools using AI/emerging capabilities, including DOL jobs/training | 180 days | 2027-03-07 |
| 2(a)(iii): share current members' personnel, health and STR records immediately upon discharge/release, thereafter | 30 days | 2026-10-08 |
| 2(b): War/VA, consulting HHS/OMB, review/modify relevant IT contracts for interoperability and require it in future contracts | 120 days | 2027-01-06 |
| 3: update TAP/workforce programs for relevant open-job connections or discretionary eligible training/apprenticeships, and government veterans-representative connections, to maximum practicability/applicability | 180 days | 2027-03-07 |
| 4(b)-(c): implementation subject to law/appropriations; no judicially enforceable right or benefit created | No member deadline | None |

Calendar dates are analyst calculations (order date excluded), not published
member availability dates, service-launch promises, or personal deadlines.
They remain internal. The app does not infer automatic eligibility, coverage,
enrollment, claim awards, payment timing, a job guarantee, an individual record
transfer, or proof that new tools are available. Nor does it assert that no
agency has implemented anything. No global agency-name replacement.

S4/S5 confirm the existing BDD **180-90 days before separation** window and
**45-day exam availability**, subject to eligibility/exclusions, including
qualifying Guard/Reserve full-time active duty. SHA Part A remains required.
S4's newer instructions distinguish filing mode: VA obtains STRs for online
claims; other methods require copies. S5's older broad submission language is
not generalized to every online claimant. Below 90 days, S4/S6 support standard
pre-discharge claims; separated veterans retain the normal claims route.
Personal service-record access under S7 is optional, not a filing prerequisite;
claimants need not wait for a National Archives request to finish. Separate
family-access rules apply. S8 supports current TAP-office access; the order
does not create new spouse eligibility or an enrollment requirement for
already-separated veterans. No ENPP-specific addition relies on the optional
detail page that returned S2's tier-1 internal fetch error.

## Member impact

IMPACT: DECLINE / INOCULATE | A2 | s2-intel, integrated by s3-devops | 2026-09-08 | revisit NONE

A1 population: SEPARATING (active component), GUARD/RESERVE, ALREADY SEPARATED
for records/benefits clarification; SPOUSE/FAMILY only as readers helping
members, not newly eligible beneficiaries. Band: condition-triggered by
encountering the announcement, no separation band/day-offset or member opening
date. Timing: no EO-created member act; separately sourced acts below exist now.

A2 act: NOTHING - context. Public salience: S2/S3. Wrong inference: "My
benefits are automatic now, and a job is guaranteed, so I can wait." Closure:
"What do I do today?" The same ship supplies S4/S6 claim routes, S7 personal
record access, and S8 TAP office guidance. No new benefit or member deadline.

A3 surfaces: one `renderPolicyIntel()` definition called at both existing
locations, DD214 introduction, Resources > TAP+ introduction, brief WHATS_NEW
pointer, and Navigator CORPUS. Live tokens: [VA PAY], [DD214],
[CRITICAL WINDOWS], [RESOURCES]. Sweep trigger: FIRED - 30/120/180 days
resemble existing personal windows; TAP update is a confusion/successor signal.
The implementation changes no personal window, reminder, or milestone.

A4 cost: NOTHING attributable to the EO itself without a member act.
EXPIRES: NONE for historical directive. Reassess rollout wording when official
guidance establishes actual availability; no member-facing revisit deadline.

IMPACT: SHIP - ACT | A2/A3 | s2-intel, integrated by s3-devops | 2026-09-08 | revisit NONE

A1 population: SEPARATING (active component), GUARD/RESERVE on qualifying
full-time active duty. Band: 6 Months Out, 3 Months Out, exact 180-90 days
controls. This pre-discharge action does not apply to already-separated
members, spouses/dependents claiming in their own right, or Guard/Reserve
outside qualifying active duty. Timing: ACT AVAILABLE NOW.
A2 act: "For a service-connected condition, use VA's BDD instructions to
confirm eligibility and file 180-90 days before leaving qualifying full-time
active duty, submit Separation Health Assessment Part A, and remain available
for exams during the next 45 days."
A3 surfaces: existing BDD guidance retained; short reference in Policy Intel,
DD214 annotation and Navigator; tokens [CRITICAL WINDOWS], [DD214], [VA PAY].
Sweep trigger: EO agency 180-day target; keep its anchor separate.
A4 cost: A CLOSED WINDOW (BDD route, not all disability compensation).
EXPIRES: NONE; eligibility is controlled by current VA guidance.

IMPACT: SHIP - ACT | A2/A3 | s2-intel, integrated by s3-devops | 2026-09-08 | revisit NONE

A1 population: SEPARATING (active component), applicable GUARD/RESERVE.
Band: 3 Months Out, 1 Month Out, fewer than 90 days remaining controls.
This pre-discharge action does not apply to already-separated members or
spouses claiming in their own right. Timing: ACT AVAILABLE NOW.
A2 act: "If fewer than 90 days remain and you need to claim a service-connected
disability, follow VA's standard-claim instructions to file before separation."
A3 surfaces: Policy Intel source link, existing BDD alternative retained,
Navigator; tokens [VA PAY], [CRITICAL WINDOWS]. Sweep trigger: NONE beyond EO
confusion sweep. A4 cost: NOTHING newly attributable to the EO; the standard
claim route remains available. EXPIRES: NONE.

IMPACT: SHIP - ACT | A2/A3 | s2-intel, integrated by s3-devops | 2026-09-08 | revisit NONE

A1 population: SEPARATING (active component), GUARD/RESERVE, ALREADY SEPARATED
requesting their own records. Condition-triggered; no universal band or
post-separation day offset. This own-record instruction does not establish
SPOUSE/FAMILY access rights. Timing: ACT AVAILABLE NOW.
A2 act: "To obtain your own service-record copy, follow VA's military-record
request instructions for eVetRecs or Standard Form 180; continue filing your
claim while that request is pending."
A3 surfaces: DD214 and Navigator; token [DD214]. Sweep trigger: sharing directive.
A4 cost: NOTHING for optional personal access itself. EXPIRES: NONE.

IMPACT: SHIP - ACT | A2/A3 | s2-intel, integrated by s3-devops | 2026-09-08 | revisit NONE

A1 population: SEPARATING (active component), applicable GUARD/RESERVE
transitions. Condition-triggered before departure, no new member date. This
instruction is not a new enrollment requirement for ALREADY SEPARATED members
or SPOUSE/FAMILY. Timing: ACT AVAILABLE NOW.
A2 act: "Contact your installation TAP office for class registration
requirements and prerequisites."
A3 surfaces: Policy Intel, Resources > TAP+, Navigator; tokens [VA PAY],
[RESOURCES]. Sweep trigger: TAP update. A4 cost: NOTHING newly attributable to
the EO; this is an existing route. EXPIRES: NONE.

## Preservation and review scope

The full published-ref inventory, merge bases, and unique-commit counts are in
`/tmp/tops-records-eo-evidence-2026-09-08/ancestry.json`. Published clone
`0fd3c45233c4c21437d55d646a310e6333d6825b` (5 main-only commits), member-return
`721e96f4df67ad25f1ae556d3f5ebdf98addb282` (1), and nav-citation
`80152860c00cac702290680ff52440d7a38905b4` (185) are ancestors. Their merge
bases equal their tips; each has zero unique branch commits.

The remaining relevant Resume, accessibility, privacy and OPM published tips
are ancestors too. Two historical branches have unique commits:
`apr2026-policy-refresh` (2, base `9398493ee44b7b7e591f4f3191ab05021af051e0`)
and `codex/alert-verification-followup` (3, base
`d82516389ed5906febad467cfe57887acda97053`). The former's stale medication-rule,
SkillBridge and signup copy is superseded by main's verified content and
privacy removal; no old policy is reintroduced. Its old contrast/onboarding
edits are superseded by current styles and flow. The latter's ledger/locking
helpers and historical evidence were selectively integrated earlier, with the
production-OFF return first and callers absent, as documented in
`intel/weekend-integration-validation.md`; they remain untouched. No unique
historical branch is wholesale merged. This task inherits the prior recorded
unported dynamic Navigator telemetry decision; it neither resolves nor changes
that unrelated governance boundary.

The source checkout retains its own branch and untracked J1 plan/evidence.
No root refs, J1 checkout, or other checkout are modified. Resume functions,
OpenAI controls, privacy, member-return functions, window/reminder/milestone
data, existing policy entries and source lineage remain untouched. The v97
member-return release note remains intact under a new v98 policy pointer.
The global DATA_VERIFIED date is not advanced on behalf of unrelated content.

Validation evidence and the exact review diff are saved under
`/tmp/tops-records-eo-evidence-2026-09-08`. Local tests cannot grant manual AT,
hosted, merge or deployment clearance. Preview is warranted before release
because member-visible content changes; none is published by S3.

## Local validation and release disposition

Final candidate runtime SHA-256 identities:

| File | SHA-256 |
|---|---|
| index.html | c8bed07e00a3c52ccacf6b4b80844ce55177c21d3a8339fd1426d763895a5e76 |
| netlify/functions/navigator.mjs | 944a4635940d9b396bc1673a909c9186920735b3937f1ca8806c0ba26d987536 |
| pwa-sw.js | 146bce65954a9171b6368859c1ab86be66589e0c08847af123e5fd608c6496c3 |

Every command below exited **0** against these runtime bytes. Evidence files
are under `/tmp/tops-records-eo-evidence-2026-09-08/`. No required cases were
skipped. The accessibility log's "ABOUT TAB SKIP FIXTURE" is an executed
browser-preference regression, not a skipped test.

| Command / evidence | Actual terminal result |
|---|---|
| `npm run test:openai-migration` / final-openai.log | PASS: synthetic RDM-1..RDM-263 integration paths; actual local LibreOffice DOCX rendering also passed |
| `npm run test:sw-privacy` / final-sw.log | SW-PRIVACY REGRESSION PASS |
| `npm run test:privacy-network` / final-privacy.log | PRIVACY-NETWORK REGRESSION PASS; new/migrated provider count 0 |
| `npm run test:runtime-ai-spend` / final-spend.log | PASS: runtime AI spend governance synthetic suite |
| `npm run test:accessibility-release` / final-accessibility.log | LOCAL AUTOMATION PASS; external target attempts 0 |
| `node scripts/nav-token-regression.js` / final-nav.log | RESULT: ALL ASSERTIONS PASS; 7 bracketed headers, all mapped |
| `npm run test:policy-content` / final-policy.log | Policy content regression: PASS (96 assertions; 1110 parity vectors) |
| `python3 .../structural.py` / final-structural.log | STRUCTURAL PASS failures 0; 34 JS/MJS/CJS, 69 JSON, 6 YAML; one inline JS and one JSON-LD block |
| Scope/encoding comparison / final-scope.log | Exact four tracked changes plus intended packet; 421 other tracked files preserved; curly quotes/NBSP/conflict markers 0 in additions |
| Existing installed 4N command / final-package-snapshot.log | CLI 26.1.0, packager 14.7.1; PACKAGE PASS; Navigator and Resume package/API resolution PASS; Jobs excludes all four package paths |
| Local mobile harness / rendered-content-keyboard-final.log | CONTENT RENDER PASS 8/8 route-width combinations; no skipped combinations |

The original 4N attempt with the requested shared `node_modules` symlink failed
with `EEXIST` while the packager created `navigator/node_modules`. That failure
remains in `final-package.log`. The successful attempt used an evidence-only
packaging snapshot: 7,045 input/source/dependency files were individually
SHA-256 checked against the candidate and existing shared dependencies, with
the exact `netlify.toml`, function source, package and lock bytes. See
`packaging-input-identity.json`. The same installed CLI/packager and exact 4N
normalization/module-resolution command were used; no installation, alternate
CLI, config change, credential read, client/store construction or provider call.
Only the snapshot dereferenced dependency bytes; the shared dependency directory
was untouched and the clone's owned temporary symlink is removed before commit.

The baseline Policy Intel disclosure was a nonfocusable div. The parent
authorized correcting this exposed flow: a native 44px button now retains the
shared render structure, adds `aria-expanded`, and references the panel only
while mounted. At both VA Math and VA Pay, at 320x812 and 375x812, actual Tab
reaches the control, Enter independently opens/closes it, Space independently
opens/closes it, focus remains visible/unobscured, and ARIA state/target match.
Both render sites produce identical policy content. Resources > TAP+ and DD214
were also tested at both widths. Every new source link matches its expected URL
and is reachable by Tab; no horizontal overflow or clipping was found.

Standalone source links meet the 44px target rule. Native links embedded in
records/TAP sentences retain inline styling under the WCAG 2.5.5 inline-text
exception; this is the specific target-size exception, not a broad suppression.
No source link was activated externally. Chrome 152.0.7977.82 used synthetic
state and the existing runner's blocking proxy; remote font stylesheets were
removed by its established local fixture. Browser exceptions and external
target attempts were zero. Local font metrics are not hosted-font evidence.

Final screenshots: `policy-intel-mobile-375.png` (entire advisory crop) and
`policy-intel-viewport-375.png` (375x1200 viewport to show the full advisory
clear of fixed navigation). The eight functional checks used 812px height;
the screenshot's taller viewport is reported separately.

Cache: active PWA `/pwa-sw.js`, root scope, v158 -> v159, one declaration-only
change. Main history floor is 158, recorded in `main-worker-history.txt`;
v159 was reviewed by the parent for this local candidate. Exact ASSETS mapping
matches the skill. Legacy `/sw.js` and root compatibility worker remain exact;
the dedicated `/push/onesignal/` worker remains dormant. PRODUCTION PUSH: OFF;
clone/test origin and App-ID literals absent; new/migrated OneSignal requests
zero; bounded legacy cohort preserved; future enablement not authorized.

Release state: locally validated candidate for the parent's publication/PR
decision. Ref recheck kept main `6f8447bc92a05f61828fc6d14df026eae656986b`,
clone `0fd3c45233c4c21437d55d646a310e6333d6825b`, and member-return
`721e96f4df67ad25f1ae556d3f5ebdf98addb282` unchanged. No production-origin
deployment ledger or hosted candidate was inspected by S3 in this task; cache
ownership/high must be rechecked before publication, including both origins
if a separate preview origin is used. No hosted-release or manual AT verdict
is implied. Required Safari/VoiceOver, Chrome/NVDA, Edge/JAWS and
Android/TalkBack rows remain pending. Workflow schema gate 4S and changed-build
gate 4B are N/A; no workflows or build boundary changed.
