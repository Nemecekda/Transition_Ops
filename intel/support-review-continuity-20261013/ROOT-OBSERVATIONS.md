# Support draft continuity: visible UI observations

Date: October 13, 2026 (America/Chicago).
Environment: Codex in-app browser, local http://127.0.0.1:18778, synthetic data only. Phone viewport 375 x 812 CSS pixels. Lab evidence, not a native phone or uncoached member study.

## Before correction

Candidate commit 5e58a8e; app SHA-256 5669afa452b72d6d578b474a45378ce1844419a44206483c5d5e3483aad4be9f.

Saved synthetic step: Prepare my resume and a list of roles for the Job Center appointment.

1. Choose They asked for documents on Home.
2. Edit My next action to: Ask the Job Center which work tools I should discuss at my appointment.
3. Expand Find support or review approval questions.
4. Open Wisconsin work-cost guide.
5. Return through Home.

Observed: review panel is absent, outcome choice is reset to Choose an update, and only the original saved step remains. The unfinished edit is lost. Saved plan was not overwritten. No external destination, provider, member data, or paid call used.

Before correction the primary Open my support step button opens the editor, and cancelling focuses the outcome selector even when entered from that button. Outcome selection focuses the text field immediately. These are secondary orientation issues within the same bounded journey.

## Intended acceptance

Keep the same unfinished review during internal reference navigation and between Home and My Plan. Keep Save/Use/Cancel explicit. Reopen edited text and date exactly, preserve the original conflict snapshot, reject a stale overwrite, and honor existing clear/reset. Reload remains a distinct unsaved-data boundary. Test the revised state and focus behavior separately from field usefulness.

## After correction

Tested final app SHA-256 51b3c1e8569ed44233764aca807de113253f9724a0e9f56e6c4ef4ae6cd2a81e, local cache284. Earlier checks at da0a72f1 were repeated for the reference-return path after the short status wording and remaining source-clear callbacks changed.

- The original reproduction now returns the exact edited action on Home. The same draft is also shown in My Plan.
- Choosing an outcome focuses the review heading, visible at 375 and 320 CSS pixels. Direct Update this step focuses its editor; Keep current step restores that button. Cancellation after outcome entry restores the outcome selector and preserves the saved action.
- Save next step after the reference detour updates the synthetic action. Reload recovers the exact saved text.
- A second unsaved edit is intentionally absent after reload, with the earlier saved action intact. This matches the visible save-before-refresh notice.
- The full unsaved boundary notice appears once; return status is the shorter Your unfinished support update is still here.
- At 320 x 740 the document width was 316 CSS pixels with a 320-pixel viewport and a visible focused review heading. At 375 x 812 the draft panel remains readable and vertically scrollable. No native phone keyboard or picker claim is made.
- `mobile-review.png` shows the same synthetic documents update after moving from Home to My Plan, with the current saved action and editable proposal clearly distinct.

Independent review owns final text/date, conflicting changes, failed saves, clear/discard/restore checks. This root receipt does not substitute for those results. No member data, external link opening, AI submission, or paid API call occurred in these UI checks. Field usefulness, retention and manual assistive technology remain unmeasured.
