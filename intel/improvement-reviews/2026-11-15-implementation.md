# November 15 member-return improvements

Authorization: Dean requested implementation of all recommendations in the November 15 review. This candidate is local; this request does not establish publication or merge approval.

## Starting point and reconciliation

- Public production and main: PR #242, `a78cfb3a509a4bd856d634258f6871f8f3a9b9e8`, cache 339. Netlify deploy `6afa3e8c6b02037ab29a39ef`.
- Candidate: isolated checkout `/private/tmp/tops-return-20261115`, branch `codex/member-return-20261115`. Started clean from that main commit.
- Existing root worktree remains at `aa10849a`, with extensive untracked evidence and two modified review records. None of that work is reset, cleaned, or used as the app baseline.
- Current unmerged Claude work inspected: `claude/loop-23-fmla-military-service-20261115`, `dc1a563f3b3dbfbb07f39b9392d6d7e92aae8594`. Merge base is the production commit; unique commits main/Claude = 0/1. Its diff adds an FMLA policy record, source evidence, content checks and cache 340. It does not change the interfaces being revised here. It remains separate pending its own merge decision; a final main refresh is required before publishing either candidate.
- Current shipped CareerOneStop/job links, free learning, optional VBS contact, state guidance, Resume grounding and budget/privacy controls remain the baseline to preserve.

## Scope

1. Replace the misleading generic Updates count with date-relevant unfinished reminders using the existing timing logic. Unknown dates and profiles must not imply urgency or eligibility. Preserve planning access and distinguish old acknowledgments from completion.
2. Put saved job continuation ahead of a generic restart, retaining explicit chosen actions and saved move comparisons.
3. Expose the existing direct role/area search on the first Career visit, retaining the optional experience route and useful empty/error states.
4. Offer existing share and install controls after useful saved work, as secondary choices, with no automatic sharing, personal data in generic links, or access gate.

## Independent review

Claude reviewed a short public-behavior summary in the existing desktop account. It supported the scope and highlighted old acknowledgment state, expired postings, multiple saved jobs, empty search results, and clean sharing links. No private member records were sent. A separate Force Mod review confirmed existing skills cover the work and caught the undated BDD heading in the planning library.

Evidence and final checks will be recorded in `2026-11-15-implementation-validation.md`. Synthetic checks establish app behavior, not retention, recommendation quality, real-member usefulness, or field performance. No new tracking, account flow, paid model calls, J1/S2 changes or budget changes are part of this candidate.

## Implemented result

- Header Reminders and Home now use the same valid-date/service-profile context and unfinished timed list. The misleading generic notification modal is removed. Old acknowledgment storage is preserved and is not converted into task completion. Invalid calendar dates offer correction; planning references use neutral titles outside their current timing.
- Home shows the saved job, employer and chosen next step after reload. Multiple jobs offer an explicit choice, closed jobs are excluded from this continuation, expired recorded closing dates lead to review, and custom work retains precedence. The existing guarded handoff protects work when a different job is selected.
- Choosing the veteran or continuing-service welcome route opens the existing role/area search immediately. Resume-based exploration remains optional. ZIP-only search uses the existing search and external-board links, with honest unconnected-service messaging.
- A successful job save offers a dismissible secondary row for sharing a clean public Career link and using the existing installation flow. No sharing or installation happens automatically, and the row is absent when saving fails.

Final independently reviewed app SHA-256: `539055571811e6930ebddc934c9cc071c0b43a467911385f37014e726b32d0c1`. Force Mod found no remaining P1/P2 findings after correction of the Home unknown-profile reminder inconsistency and the expired-job focus handoff.

## Visual observations

Desktop in-app browser, synthetic local data, 390x844 and 320x640 viewports; light and dark themes. These are emulated viewport checks, not physical-device or field measurements.

- Fresh veteran welcome opened direct search. Empty area focused its error. ZIP-only `53202` reached the all-role search with usable other-board links when the local preview correctly reported no federal API connection.
- A fictional Data Analyst job saved successfully, revealed the optional share/install row, and appeared with its exact next task on Home after reload. Continue reached the existing guarded job-review screen.
- With synthetic Active duty profile and March 15, 2027 date, header and review both showed 3 incomplete timed reminders. Completing the BDD reminder immediately changed the count to 2. This tests timing and completion, not benefit eligibility.
- At the narrow dark-theme viewport, document scroll width matched client width; no horizontal overflow was observed. The final frozen Home was reloaded and visually captured again.
- The full manual screen-reader matrix, hosted release checks, real-device installation/native-sharing delivery, field speed, and retention remain unverified. No merge or production change occurred.

Final remote reconciliation: public main still `a78cfb3a509a4bd856d634258f6871f8f3a9b9e8`; the unmerged Claude branch is still `dc1a563f3b3dbfbb07f39b9392d6d7e92aae8594`. No concurrent change was silently adopted or dropped. Cache remains 339 pending a separately authorized release.
