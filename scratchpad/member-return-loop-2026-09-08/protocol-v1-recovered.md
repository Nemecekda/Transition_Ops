# Recovered v1 protocol excerpt

Recovered from parent Codex/XO task `01a07c1a-0ba2-7051-a6fe-d041e4aaeac1`, command output `exec-4f5f8068-96ad-4b65-ade9-c5ca01738bdb`, before the explicit U1-U8 implementation instruction. The on-disk coverage file was concurrently replaced with revision 2; latest direct scope keeps this v1 and excludes SITREP changes. This is an excerpt, not a reconstructed full original file. No fixture or baseline result existed when recovered.

## Pre-edit synthetic evaluation protocol

### Primary outcome and formula

Measure **successful repeat-visit task continuation**, not number of features or points earned. The test asks: after leaving and reopening with saved state, can the member reach the intended current item and record the next local step without losing earlier progress?

Freeze the eight episodes below, their exact fixture IDs/JSON, expected targets, and allowed paths **before running the baseline and before editing code**. Equal weighting means one required member job per episode, not one point per implementation detail. The sample is purposive and synthetic, not a population estimate.

For build `v` and episode `i`, let `s(v,i)=1` only when all of the following hold:

- Starting on Home after hydration, the current intended item is reached within **two navigation activations**, using any visible existing route. Opening a tab/detail counts; scrolling and focus traversal are recorded separately. No developer console navigation is allowed.
- The destination identifies the correct target and uses current canonical text; its state agrees with the seeded completion marks and date. No obsolete or inapplicable item is represented as the current task.
- The prescribed mark-complete/obtained action, followed by Home and a reload, preserves prior marks and the new mark and stops recommending that completed item as unfinished. No real external task or submission is performed.

Otherwise `s(v,i)=0`, with the precise failure and step where it occurred. This is one functional outcome with acceptance conditions, not a weighted product-quality index. The two-activation budget is a proposed usability contract, not a research-established universal threshold.

```
N = 8 fixed returning-member episodes
S_v = sum(s(v,i), i=1..8)
F_v = N - S_v
Continuation success rate C_v = S_v / N
Failure reduction R = (F_baseline - F_candidate) / F_baseline
Target: R >= 0.50, provided F_baseline > 0
Equivalent integer target: F_candidate <= floor(F_baseline / 2)
```

Always report raw `S/8` and `F/8` for both builds and the absolute success-rate difference in percentage points. If `F_baseline=0`, the relative reduction is undefined: report the ceiling and stop using this target. Do not invent a baseline, add failing episodes, change the time/step budget, or switch formulas after seeing results. A changed protocol requires a new version and a rerun of both builds, with the former record retained.

Permissible eventual statement: "On these eight fixed synthetic return tasks, failed continuations fell from [measured B] to [measured C]." It is **not** "the app is 50% better," "members return 50% more," or a retention result. Retention remains **UNMEASURED**.

Record navigation activations and whether an item required scrolling as secondary diagnostics. Report their paired raw values; do not combine them into the primary percentage. Keyboard and adverse-path results below are independent non-regression gates, never bonus points. A critical safety/privacy/accessibility failure blocks acceptance even if the numerical target is met.

### Fixed returning-member episodes

Before baseline, the executor must bind semantic descriptions below to actual canonical milestone/task/document/reminder IDs and exact saved-state bytes. Use available canonical neutral tasks where possible; synthetic obsolete text is a harmless sentinel, not fabricated policy advice. Keep all unrelated state identical across builds.

| ID | Synthetic setup and return | Required useful continuation |
|---|---|---|
| U1 | Active-duty profile; valid date; one incomplete neutral task in the current milestone and earlier tasks done. Leave; return seven days later without a phase crossing. | Reach that unfinished task, mark it done, and preserve all earlier marks on reload. |
| U2 | Same kind of profile, with the first current task completed on the prior visit and a second task open. | Resume the second task, not the completed first task; complete it and preserve both marks. |
| U3 | Documents checklist has several obtained flags and one selected missing neutral document. Return after obtaining it in the fictional scenario. | Reach that document, record obtained, and preserve the other flags. Existing Home document navigation is an eligible baseline path. |
| U4 | Valid date with a currently applicable reminder, plus an earlier completed reminder. All unrelated milestone/document tasks are completed to isolate this job. | Open the intended current reminder with actionable detail; mark it complete and keep the earlier reminder complete after reload. Exact eligibility/date expectation must be predeclared from the governed existing data. |
| U5 | Legacy `taskProgress` contains a known task ID with obsolete sentinel text and valid completion marks for sibling tasks. | Render current canonical text for the intended unfinished task, retain sibling marks, and complete that task without restoring legacy text. |
| U6 | Legacy `docProgress` has a known document ID with obsolete sentinel name/notes and other documents already obtained. | Render current canonical document information, record the intended document obtained, and preserve other marks. |
| U7 | Member edited separation date during the previous visit so the relevant milestone changed; prior progress is still saved. Return with that edited date. | Reach the task appropriate to the revised date without resetting completion or describing the old date as current. |
| U8 | Separated profile with a saved post-separation checklist and one unfinished neutral task. Return after a month. | Resume that remaining task using current post-separation context, mark it complete, and preserve progress on another reload. |

These episodes do not assume daily visits, require a particular card layout, or count a notification, changelog, or generic "welcome back" as a useful continuation.

### Independent adverse and regression scenarios

- **No work / no date:** new visitor, missing date, invalid date, all tasks complete, and all reminders dismissed. No invented delta, urgency, deadline, or claim of lost progress. Allow honest empty/setup states; do not force a return prompt.
- **Audience:** active, separated, retired, Guard/Reserve, and spouse. Verify current supported audience routing; never infer service-specific eligibility from the presence of an ID. The special Guard dashboard is an independent preservation case, not silently covered by standard Home tests.
- **Storage:** absent values, invalid JSON, valid JSON of wrong shape, duplicate IDs, unknown/removed IDs, new canonical IDs, and non-boolean flags. No crash, no overwritten canonical prose, no resurrection of deleted items. Disabled storage must not claim persistence; inspect initialization writes for transient clobbering. Test mismatched/meaning-changed IDs separately.
- **Same-day continuity:** complete/reopen a task and change the date without remounting; go to another tool and back; perform a second reload. Current continuation must update without depending on the 20-hour SITREP window.
- **Delta blind spots:** simulate 6-hour repeated opens, a non-Home deep-link mount before Home review, a 21-hour return, unchanged policy count with replacement, and a count increase. Record actual visibility and routes; do not mark unimplemented snapshot fixes as passed. Preserve policy threshold text byte-for-byte.
- **Dates:** morning versus noon on one local date, calendar-day crossing, both DST transitions, future snapshot timestamp, and the exact existing threshold boundaries. Use a frozen clock; expectations concern date calculation and routing, not a new policy ruling.
- **Navigation and accessibility:** hidden reminder filters, previously expanded different item, Back navigation, native keyboard activation, focus arrival/restoration, reduced motion, small viewport, and zoom. Repeat U1–U8 with keyboard access as a separately reported matrix. Required manual AT/hosted evidence remains governed by #17.
- **Offline and privacy:** load only local candidate assets in a disposable synthetic profile; deny outbound traffic and record attempted destinations. Do not activate AI, jobs refresh, notification permission, analytics consent, or external resource links. No new storage keys, network flows, IDs, per-visit events, tracking, or notification activity is permitted for the candidate. Existing unrelated network attempts are documented separately; a local blocked request is not proof that production makes no request.
- **Clearability:** test browser/site-data clearing followed by a cold reload of the disposable profile. Inspect any actual in-app clear control before promising one; none was established in this brief source inspection. Do not claim local clearing deletes provider records or another device's state.
- **Preservation:** no Resume changes, no weakening of its fact/identity grounding or budget controls, and no changes to benefit literals, source links, push behavior, or shared provider paths. Existing regressions stay intact.
