# Independent government-copy and architecture review

October 16, 2026. S2 read-only review of the local S3 candidate at `/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops/index.html`, service-worker cache292. Final reviewed index SHA256: `cd93e02c3de0b32be4fbed8befc8f8b5005482c6952be92bb4136699546077c1`; worker SHA256: `5672aedc5556ebaa8c9236f48e5f862f50fe39fc074bb8563aba32cc41bf6799`. The initial review used index `f6756b8c730949e192d71b4b0c239511dde39e3b66f911e30e9c4c7f816373bb`; the bounded correction closure below binds this review to the final frozen candidate. This is not a published-build claim.

Scope: the government copy added in iteration3, its immediate Wisconsin rendering, the bounded national claims-locator correction, and the Job Center priority sentence flagged by the independent reviewer. Compared against `runtime-copy.json`, `verification-log-append.md`, `adjacent-claims-copy.md` and `coverage-and-ux-contract.md`. No broad catalog audit, app edits, paid calls, account access or outreach. Nonprofit rows had been inserted by the time of this read; their placement/counts were inspected, but this report does not independently certify their legitimacy or services. That evidence belongs to the nonprofit review.

## Decision

**No blocking defect remains within this bounded government review. The pre-existing adjacent eligibility overclaim is corrected in both reviewed surfaces.** The new records match the cleared summaries, caveats and destinations. This finding is conditional on the separate focused release checks; it is not a complete accessibility, policy or production certification.

## Adjacent correction closed on final frozen candidate

The initial snapshot's `index.html:3377`, `american-job-centers`, said that "you and your spouse" receive priority and presented DVOP help as if disability alone were sufficient. A visitor following the new employment help can reach this resource catalog, where that statement conflicted with the new, qualified service guidance.

The exact minimal replacement and full **WI3-20261016-AJC-PRIORITY** verification record are in `adjacent-job-center-copy.md`. Directly read DOL operative guidance at https://www.dol.gov/node/179224 supports the distinction between covered persons for priority, eligible spouses, and the separately screened DVOP population.

Final read-only closure confirmed:
- `index.html:3377` now contains the exact approved replacement, including eligible spouses, program rules, the fact that not every military spouse qualifies, and separate DVOP eligibility. Ordinary Job Center access and the contact action remain.
- `index.html:3157`, the v81 change-log sentence, now says priority is for veterans and eligible spouses in DOL-funded employment/training services when program rules are met, with specialist eligibility separate. It no longer repeats the blanket spouse promise.
- Targeted static assertions confirmed both corrections, the cleared government local-help fields, and the maximum-three current route configuration on the final hash. No new broad audit or source expansion was performed.

## Checks that passed in the inspected source

| Requirement | Evidence and result |
|---|---|
| National default and explicit Wisconsin interest | `WisconsinNextChapter` returns null outside `area === "wi"`. The existing All states selector, neutral state-help heading and national primary route remain. No location permission, new setup or account was added. |
| Short relevant local-help set | Local routes are filtered by exact selected need. Static counts are start2, work1, education1, benefits1, moving3, health1, service2. No task exceeds three. The focused browser-regression source explicitly checks <=3 and exact IDs for every need. A runtime slice is unnecessary and could silently hide a future important route; the fixed configuration and regression are the relevant bound. One useful cleared route is preferable to padding a need to two. |
| One primary answer retained | Existing `StateLocalHelp` article still precedes the optional native disclosures. Main work route remains the Job Center. Main moving route remains neutral DOR guidance; housing crisis is not assumed. Existing save/review handling remains outside the new directory links. |
| Recognition versus cohort relationship | `index.html:7589,7607–7614`: Vets Ready has its own heading, DWD attribution, explicitly2025 recipient-list label, unfiltered JCW search instructions, and caveat against treating recognition as a vacancy, hiring preference, job-quality guarantee or SkillBridge approval. The three cohort companies have a separate heading and VBS-attributed relationship statement. No award badges are copied onto them. |
| SkillBridge approval stays separate | Official finder precedes company examples. The company note does not promise openings, approval or funding. Government recognition and employer grants are not described as SkillBridge compensation. |
| Housing conditionality | The new SSVF route is conditional on housing instability and calls out household eligibility, income, geography and availability. Existing VHRP family-occupancy exclusion remains beside that route. Routine movers retain DOR and planning information. |
| Retraining and employer payments | Retraining text names work/financial/training conditions, other-funding review and employer receipt of OJT payments. Employer-grant text separately names employer receipt and rejects assumptions about member cash, SkillBridge wages or same-cost duplicate reimbursement. |
| Claims fees and accreditation | New claims route and corrected national locator distinguish free accredited VSO claims help from potentially fee-charging accredited attorneys/agents; membership is not individual accreditation. Neither appoints a representative nor promises availability or outcome. |
| Referral links and data | New links are fixed HTTPS destinations with `noopener noreferrer`, `no-referrer` and visible "new tab" text. New rows have no submission handlers, transmitted profile/location payload, progress-complete flag or automatic saved-plan mutation. |
| Copy fidelity | A static comparison confirmed the four government local-help rows' body, note, URL and link label exactly match the cleared packet. Vets Ready body, caveat and destination also match. No fresh deadline or award-level claims were introduced. |

## Accessibility and usability limits

The new disclosures use native `details`/`summary`; summary and link styles provide minimum44px height. Their titles and external-link labels are descriptive. The existing state and need controls retain explicit labels, and the state description points to an existing explanation that selection is not residency or eligibility. No concrete keyboard-semantic blocker was found by source inspection.

This reviewer did **not** run browser measurements, contrast analysis, screen-reader testing, visual reflow or a full release suite. The focused regression source contains keyboard-disclosure,320/375px both-theme, first-action-position, safe-link and unchanged-storage cases; inspecting those assertions does not establish that they passed. S3/root must use the current final-candidate results. In particular, the enlarged optional disclosures must still reflow on320px without obscuring navigation or requiring horizontal scrolling.

Copy remains somewhat detailed when optional sections are opened, because materially different eligibility and payment rules are explained. The first answer and collapsed presentation avoid placing this detail in the initial decision. No additional card or onboarding step is recommended in this review.

## Residual evidence boundaries

- Dated employer recognition remains separate from current postings and actual employer capacity. Counts and jobs observed in the public JCW search are transient and are not hardcoded.
- This does not certify every Wisconsin benefit, employer, organization, county/tribal service or nonprofit. County/tribal and VA provider directories support broad discovery; a listed provider's actual service area and availability still require checking.
- No real-member completion, referral acceptance, hiring, satisfaction or return-use outcome was measured. The usability benefit is a hypothesis supported only by the bounded design and pending synthetic checks.
- Existing unrelated catalog content, numerical claims, helplines, tax rules and benefits were not recertified by this review.

Disposition: **LOCAL SYNTHETIC TEST** for the bounded routing and usability hypothesis. Government source claims remain limited to the associated **CONFIRMED / SHIP — ACT** records. The only required content action identified by this review, the adjacent Job Center correction, is closed in the final candidate. Separate browser and nonprofit reviews are not replaced by this document.
