# Adjacent American Job Center correction

Checked October 16, 2026. Bounded correction to `RESOURCES` record `american-job-centers`, candidate `index.html:3377`. Import the verification record below before replacing its description. Keep the existing locator destination and ordinary resource filters; those filters are discovery aids, not individual priority or DVOP determinations.

## Exact replacement description

American Job Centers help with job searches and training. Veterans and eligible spouses receive priority for DOL-funded employment and training services when they meet the program's rules. Not every military spouse qualifies for priority, and DVOP specialist support has separate eligibility requirements. Use the American Job Center locator to contact a center and ask which services fit your situation.

This removes the unsupported blanket spouse promise, a stale center count, the unsupported popularity claim, and the implication that disability alone establishes DVOP access. It does not withdraw ordinary Job Center access from other visitors.

## WI3-20261016-AJC-PRIORITY — Job Center priority and specialist access

Rating: **CONFIRMED** for the narrow correction. The directly read DOL VPL 05-24 attachment distinguishes covered persons for priority of service from DVOP-eligible populations. Its background and appendix describe priority for DOL-funded programs; sections VI and IX require screening for specialist services. The appendix defines eligible spouses, rather than all military spouses, as covered persons. No new amounts, time windows, eligibility percentages or demographic estimates are proposed.

Sources read directly 2026-10-16:
- https://www.dol.gov/node/179224 — DOL-hosted full text of VPL 05-24, attached to TEGL 03-24. Relevant sections: IV; VI.A; IX.A–B; appendix E. The page contains the operative attachment text, not only a search snippet.
- https://dwd.wisconsin.gov/veterans/employment/ — DWD directs jobseekers to their local Job Center for one-on-one help; current Wisconsin referral corroboration.

Access limitations: the guessed DOL `/agencies/vets/programs/priority-of-service` route failed; direct `/agencies/eta/jobs-for-veterans-act` returned 403; `/node/159628` and the existing CareerOneStop locator could not be fetched by this web tool. None supplied the evidentiary basis. The fully readable DOL operative attachment above supports this narrower correction. The locator is an existing unchanged app destination; its page was not newly certified here.

IMPACT: SHIP — ACT | A2/A3 | S2 primary-source verifier | 2026-10-16 | revisit NONE
A1 population: All four: SEPARATING (active component), GUARD/RESERVE, SPOUSE/FAMILY and ALREADY SEPARATED may seek ordinary Job Center help and ask for a service review. This does not give every visitor priority or specialist eligibility. band: Condition-triggered employment or training need; no fixed separation band or day-offset. excluded: Military connection or spouse status alone is not a priority-of-service or DVOP determination. timing: ACT AVAILABLE NOW
A2 act: "Use the American Job Center locator to contact a center and ask staff which employment, training, priority-of-service and specialist services fit your situation."
A3 surface(s): RESOURCES record `american-job-centers`; bounded correction adjacent to the Wisconsin Job Center route. token: NONE. sweep trigger: FIRED — priority of service versus specialized DVOP eligibility; ordinary access versus eligibility for priority. Validation-gate owns execution.
A4 cost: NOTHING
EXPIRES: NONE

Acceptance: searching the directory for Job Centers must not promise priority to every spouse or specialist help to every disabled veteran. The record must retain an executable center-contact action and must not imply that an ineligible priority applicant is excluded from ordinary jobsearch help.
