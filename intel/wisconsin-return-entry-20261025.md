# Wisconsin return entry - local draft, October 25, 2026

EDIT mode. Initial status: index.html modified and intel/sei-resource-20261025.md untracked from the authorized SEI work; both preserved. Candidate HEAD and publishing-ref comparison remain recorded in the SEI evidence. No commit, push, merge, deployment, cache bump, paid provider call or schedule change.

## Scope and route

The existing /wisconsin temporary redirect remains unchanged:
/?tool=resources&view=state-help&area=wi&situation=browse&need=start

Only the Wisconsin start surface gets the new welcome and four direct choices: work/training, benefits, moving, and county/tribal local help. Each reuses the existing state-help context and vetted content. The selected result receives focus; a return button restores the starting points. An explicit all-states button preserves national access. Broader state/topic selectors move into an optional native disclosure only on Wisconsin/start. No resident status, benefit eligibility or personal profile is inferred from the route.

Career connections reuse CareerTalentContact with a career-specific summary on Wisconsin/start. No new form or submission endpoint. Existing recruiting consent, exact email review, optional Calendly link, clear fields and email-draft semantics remain. This is not a housing/benefits intake. National and Career contact summary remains unchanged.

Parent relayed actual Claude copy review: explicitly include Guard/Reserve members, veterans and families; use a Wisconsin-specific local-help label. Adopted. Parent design review removed duplicated welcome headline and kept the national escape visible. These are design recommendations, not measured member outcomes.

## Edit verification

- Coming-home heading: one occurrence; Wisconsin start welcome wrapper: one ID.
- Four static choice records in one native navigation region; no extra navigation shell.
- All-states button: one ID. Back button: one ID.
- Existing contact component receives one optional summary prop; its default retained.
- Existing short-link regression now expects the deliberately changed start heading and explicitly checks Guard/Reserve and family inclusion. Other short-link/state/focus/storage checks retained.
- New synthetic browser regression exercises all four choices, focus, back, national escape, career contact purpose and disclosure, unchanged saved-plan bytes, no overflow and no provider POSTs.
- Initial new test had invalid selector quoting; corrected the test selector without changing app behavior.

## Measured local results

Synthetic Chrome, blocked external requests, widths 320/375/1280 CSS px, heights 812/812/900:

    Wisconsin return PASS 320px: 4 keyboard choices, focus, back, national escape, optional career contact, no saved-plan changes
    Wisconsin return PASS 375px: 4 keyboard choices, focus, back, national escape, optional career contact, no saved-plan changes
    Wisconsin return PASS 1280px: 4 keyboard choices, focus, back, national escape, optional career contact, no saved-plan changes
    WISCONSIN RETURN PASS: synthetic local, no runtime errors/provider POSTs. Manual AT not tested.

Screenshots: /tmp/wi-return-320.png, /tmp/wi-return-375.png, /tmp/wi-return-1280.png. Implementer inspected 375 and 1280. The phone uses a single readable column and normal vertical scrolling; the fourth choice is below the initial fold. No horizontal clipping observed.

Final frozen index SHA256: c23c60da40d448b412fae321dfa91c58a16d7d9160357b6f4d698cfba0eef7a6. All five prescribed local suites exited 0 on this wording, as did policy-content (96 assertions; 1110 parity vectors), state-guide entry (four mobile/theme journeys; eight simulated redirects), existing talent contact regression, and the new targeted entry test. Structural checks passed four inline blocks (246/1336/2276/1568081 bytes), 141 tracked/intended JS files and 315 JSON files; added-line encoding, diff check and installed branch guard passed. Parent independently inspected375/1280 screenshots and found them readable/consistent without horizontal clipping. Full outputs: /tmp/wi-return-{privacy,a11y,openai,sw,spend,policy,entry,talent,targeted,structure}.log. Native redirect simulation is not proof of live Netlify behavior.

Preview: http://127.0.0.1:18781/?tool=resources&view=state-help&area=wi&situation=browse&need=start (local server session 3436). Plain Python preview does not implement Netlify redirects; use the query URL locally. Public /wisconsin continues serving the currently published build until separately released.

Limitations: no manual screen-reader matrix, hosted candidate/manifest verification or member usefulness/retention measurement. Local automation is not release clearance. No claim that all Wisconsin benefits are listed. Partner sharing kit is parent-owned.
