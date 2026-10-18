# Root browser review - October 16, 2026

Candidate: `codex/wisconsin-pathway`, based on main `ffede2397c22af055c97c74a8afe631d22edbc7b`; local server `http://127.0.0.1:18779/`. Final index SHA-256 `2acb1be174325661050f982cdd56acaf3d74e0e754ef912ca9e857fccf7ca43b`; worker SHA-256 `48776d6f3ce49c559ed280121b3218d0da48ef10e4e2e387e799719899f93317`, cache 290. This is local UI evidence, not a hosted release approval.

## Conditions

Codex in-app browser on Dean's Mac; synthetic browsing contexts only. Browser viewport overrides were 375 x 812 and 320 x 780. Actual document client widths were 371 and 316 respectively; document scroll widths matched, with no horizontal overflow observed. Light and dark themes were inspected. This is desktop browser simulation, not a physical iPhone/Android test, field performance measure, screen-reader audit, or member comprehension study. Temporary viewport overrides were reset after inspection. No model API was invoked by these UI checks.

## Observed behavior

- Benefits menu exposes a direct State benefits and local help entry. The national branding and navigation remain present.
- Choosing School and tuition shows the state GI Bill route; related options show the separate Wisconsin Guard tuition route with its applicability boundary.
- Choosing All states removes the Wisconsin referral cards and offers the official VA state-office directory.
- Back from orders, still serving selects DOL return-to-civilian-work guidance, without converting that context into leaving military service or calculating an unverified deadline.
- Final candidate: Resources topic selector -> State benefits and local help moves focus to `tops-state-help-heading` after the old selector unmounts.
- Final candidate: Wisconsin / back from orders / work -> Documents -> reload -> named return restores the exact URL context and focuses `tops-state-help-next`.
- The compact revision moved the selected answer higher on the phone screen. Long source caveats still require a short vertical scroll; no claim of every action being above the fold is made.
- The final desktop view was left at Wisconsin / just browsing / work, light theme, with no saved member step created by root.

## Corrections made during this loop

Root and independent review identified excessive controls ahead of the answer, a saved Guard tuition step that could reopen the general GI Bill answer, an unmounted Resources selector losing focus, and a legacy Wisconsin work-guide return lost on reload. S3 corrected these. The mandatory accessibility suite then identified unrelated URL query encoding being changed while absent state-help keys were deleted. S3 changed deletion to occur only for keys actually present. This does not alter rendering. The detailed root UI walkthrough was performed on index `78c6411e8e8b9cf777f64c6972956745fc128f0f81e0cc0113fc9e1bea0a5e04`; root reloaded the final `2acb1be` candidate and confirmed the same Wisconsin/browse/work URL, guide heading and chosen answer. S3's affected URL checks and independent review rebind to the final candidate. Actual Claude performed two independent description-based UX reviews; it did not perform this browser walkthrough or verify benefit eligibility.

## Evidence and limits

- `local-phone-work-375-light.png`: phone-width work answer after named return, including visible heading focus.
- `local-preview-work-desktop.png`: final neutral Wisconsin work preview.
- `independent-review/FINAL-REVIEW.md`: separately executed behavioral checks and artifact identity.
- S3's final validation report owns repository gate results.

Two browser-control attempts to send Control/Command+Home reported a tool timeout; direct observation afterward confirmed scroll position zero and the correct rendered view. These are recorded as control-tool errors, not hidden as application passes. A role-based lookup for a native details summary also failed and was corrected using its observed text. No application exception was established from those tool failures.

Accessibility verdict is limited to local automated evidence from the applicable suite. Manual assistive-technology matrix, hosted behavior, field performance, real-member usefulness and retention remain unmeasured or pending. Existing national resource claims were not broadly reverified by this focused Wisconsin iteration.
