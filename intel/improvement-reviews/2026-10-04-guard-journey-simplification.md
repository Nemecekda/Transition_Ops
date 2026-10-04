# Guard journey simplification - October 4, 2026

Base local commit 833277b. Local cache198; not published. Production remains PR116/cache194. Dean emphasized practical member value and requested continued improvement.

## Findings addressed

1. Guard Home repeated nine shortcuts after the main tool chooser: a four-button row and five large cards. Removed those duplicate blocks while preserving the tool chooser, search, primary navigation, All tools, Navigator, transition timeline card, policy notice and Guard/Reserve guidance. No tool or eligibility content was removed.
2. A member's chosen career target did not carry into an empty worksheet, requiring re-entry before the later conversation follow-up could match that target. Opening a career worksheet or conversation from Your next move now prefills the target in the page only when the worksheet has no target and no existing notes. The member reviews and explicitly saves. Any existing target, row note or preparation note prevents the prefill; invalid or blank directions do not create a target.

Hypothesis: fewer repeated choices and less re-entry make the first useful action easier to complete. These are source- and synthetic-runtime observations, not proof of usability, retention or field performance.

## Validation

Guard browser regression verifies chosen-target handoff with no storage write, preservation of existing targets and untargeted notes, retained All tools destinations, and the retained transition-timeline card. Existing conversation preparation, response/follow-up, editor focus, save/reload, mismatch and completion boundaries remain exercised. A test initially expected no dash-card elements; it was corrected to require the retained timeline card and exclude the removed duplicate cards.

Required migration, service-worker privacy, privacy-network, runtime-spend and accessibility automation, seven-scenario member-loop tests, Guard unit and navigation regressions passed locally. Structural inventory: 138 records. Deterministic public build: 64 files. Evidence is under scratchpad/guard-simplify-20261004. Accessibility remains LOCAL AUTOMATION PASS; manual AT and hosted acceptance are pending. Actual uncoached member task completion and retention remain unmeasured.

No new storage keys, automatic saves, telemetry, model calls, accounts, contacts, benefits claims, J1/S2 changes or publication. Cache197 ->198. Existing worksheet schema and notes are preserved.
