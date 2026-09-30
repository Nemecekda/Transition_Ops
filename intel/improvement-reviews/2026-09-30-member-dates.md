# 2026-09-30: member target-date follow-through

EDIT MODE. Tracked tree began clean at 250e55c; pre-existing untracked reviews, receipts and scratchpad preserved. Dean authorized publication followed by continued building. cache185/250e55c was published and verified as deploy 6abd0cf6cae6232047e80df2 at 2026-09-30T13:22:52.578Z; see 2026-09-30-cache185-publication.json. This follow-on is local cache186, not published.

## Change

Your next move now distinguishes a member-selected target date that is upcoming, today, or past. A direct Review my target date button opens the existing editor and focuses the date. Copy identifies this as the member's own planning date, not a benefits deadline or notification. The member can adjust the date or mark the step done through the existing explicit-save workflow.

Date prompts apply only to a valid, unfinished step matching the current direction. Completed, invalid, undated, and earlier-goal actions do not generate these prompts. Date comparison uses the browser's local calendar, not UTC date slicing. Home refreshes the day on mount and window focus/visibility changes; it does not run a notification timer or background service. A continuously visible page crossing midnight updates on the next focus/visibility change or Home remount.

Verified deadline cards and their priority are unchanged. No new schema, telemetry, storage keys, eligibility calculations, server requests, model calls, schedules or notification permissions. Existing saved plans remain intact until the member saves an edit.

Hypothesis: a returning member can recognize a step needing attention and revise a realistic target with less navigation. This does not establish member usefulness, retention or deadline compliance; field evidence remains absent.

## Evidence and disposition

CODE-OBSERVED + RUNTIME-OBSERVED / SUPPORTED / KEEP: rendered upcoming/today/past states; date-editor focus; unsaved date change leaves stored action unchanged; saved changes survive reload; completed steps lose the prompt. Six scenarios cover active transition, separated veteran, retired veteran, Guard/Reserve career change, Guard/Reserve skills and spouse career change. Pure browser cases cover invalid dates, no date and changed goal. Honolulu/Berlin boundary checks verify the same UTC instant maps to different local calendar dates as appropriate.

Local synthetic lab conditions: Chrome 154.0.8037.92 on this Mac, isolated profiles, external requests blocked. Planning suite makes zero model/member-text network requests; existing Navigator regression uses stubbed replies. Reflow at 320/375 CSS pixels; synthetic 375px Guard screenshot visually inspected. No CPU/network throttle, field cohort, performance or retention metric. Evidence: scratchpad/member-dates-20260930/.

PASS: expanded member-loop and existing member-navigator browser regressions; required openai-migration, sw-privacy, privacy-network, runtime-ai-spend and accessibility-release suites; 130 structural inventory results (inline JS/JSON, tracked JS/MJS/JSON/YAML); added-line encoding; pre-commit; whitespace; deterministic 64-file public build. Accessibility disposition LOCAL AUTOMATION PASS; manual AT and hosted acceptance for cache186 remain pending. No live AI response quality claim.

Cache185 ->186 bumped before validation. Tested index SHA256 ca00854dc7eb3716239bc037d436396e602a973f4f06c92eefa150b49d043c7b; worker SHA256 d851b3e6ddc84bfb341d56e9b115aa520371281a46d2a3b84381e98a5efd42c0. Existing functions/config are unchanged. No J1/S2, paid runner, new account, email, budget, merge or push. No skills/registry changes. GitHub synchronization remains pending; production serves the CLI-published cache185 candidate rather than current origin/main.
