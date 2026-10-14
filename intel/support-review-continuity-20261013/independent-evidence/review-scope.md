# Independent support draft-return review scope - 2026-10-13

Coverage: FULL under current validation-gate1.12, privacy-truth-to-implementation0.2 and accessibility-release-validation1.0. No new skill is needed. User continuation authorizes this narrow app correction; publication is outside the current task.

## Observed problem

At local commit5e58a8e (index5669afa4), a synthetic375px Home support update lost edited text/date when its offered Wisconsin reference was opened and Home revisited. The saved plan remained unchanged. Source: supportReview/supportMessage were owned by MemberPlanningLoop and lost on unmount. Reproduction script and log are retained separately.

## Approved correction

Lift only the review and its status into App page memory, shared by Home/My Plan. Keep the original snapshot and existing explicit Save/Use semantics. No new browser storage, telemetry, metadata, provider contact or AI use. Cancel/accepted save/visit clear the shared review. Successful explicit guide clear and deliberate backup restore must discard copied guide fields; failed clearing must not discard drafts. Normal navigation or guide changes must not silently replace/rebase the original snapshot.

Use consistent Update this step copy. Outcome selection focuses the review heading so current/proposed meaning can be read; direct edit can focus text. Cancellation returns to its invoker. Existing source/funding content is not being reviewed or changed by this feature.

## Focused independent matrix

- Edited outcome, action and date survive Wisconsin reference -> Home and Home <-> My Plan, with no storage write.
- Cancel clears the one shared draft, returns to outcome/direct-edit/date invoker as applicable, and preserves saved plan.
- Intervening disk changes while away do not rebase the snapshot or admit stale save.
- Successful explicit Save/Use clears the shared draft; visit-only remains page-memory and reload returns saved state.
- Completed original support step follows the same return flow without premature completion.
- Failed explicit guide clear retains draft; successful clear cannot resurrect it after same guide fields are re-entered.
- Backup restore deliberately removes an older review; no old copied guide details survive that explicit reset.

Reuse the earlier independent state/native-date/mobile evidence for unchanged logic. New tests are synthetic local Chrome with all external/function traffic blocked. These checks do not establish native-phone picker, manual assistive-technology, hosted or member-usefulness outcomes.
