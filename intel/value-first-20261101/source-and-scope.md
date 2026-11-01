# Value-first Career release - source and scope

2026-11-01. Candidate on `codex/value-first-20261101`, based on published merge `e37233901df331597f6f787166a194b68f6c0fbc`. Initial building and preview authority was extended by the user's explicit "keep going one more time and then publish" instruction. This builder prepares the local commit, validation and rollback; the parent owns publication. Prior runtime and resume behavior are preserved. The active PWA cache advances from 306 to 307 for this release. No provider, account, tracking, delivery backend or spend changes.

## Source evidence supplied by parent research

Primary pages checked November 1, 2026 by the parent's research agent; this builder used its bounded findings, not an invented vacancy feed:

| Source | Read evidence and display limit |
| --- | --- |
| https://www.skillbridge.mil/locations | Official discovery route. The app asks members to verify dates, availability, eligibility and required approval. No seat, acceptance or approval is inferred. |
| https://vets2pm.zohorecruit.com/careers | Provider board displayed Racine Data Center Associate Project Manager (517033 / ZR_3352_JOB) and Data Center Technician (517043 / ZR_3351_JOB), posted August 7, 2026; Mosinee Field Service Technician (ZR_3343_JOB), posted July 27, 2026. Cards are described as leads visible on the check date, not verified current capacity. Individual host employer and intake capacity remain unverified. The app links the board and asks the visitor to confirm those facts. |
| https://airtechhtg.com/careers/ | Employer's civilian careers page identifies installer/service-technician work, Fond du Lac and Ripon. It does not establish VBS or SkillBridge seats. |
| https://www.wisconsinmanagement.com/careers | Employer's page features property management and maintenance careers; a specific current vacancy/location was not established. |
| https://krietetrucks.com/careers | Employer's page describes technician, body-shop technician and painter paths; no specific dated SkillBridge opening was established. |

The user directly clarified November 1 that Kriete Trucking, Wisconsin Management Company and Air Tech Fond du Lac are VBS clients, VBS roles are not posted yet, and roles are coming soon. Three unnamed prospective clients are omitted. UI therefore says **VBS cohort employers - roles coming soon**, inside a separate collapsed section after neutral search and SkillBridge sources. Employer career links are explicitly separate civilian resources, not VBS/SkillBridge openings or matches.

Actual Claude review was relayed by parent: lead with role/location searches, no scraped/stale invented vacancies, separate employer route, and put the labelled VBS cohort after neutral sources. Adaptation preserves the existing authorized USAJOBS integration when available, with original source/eligibility and stale-response controls; no new listing provider is introduced.

Learning cards reuse `TOPS_CAREER_LEARNING` and its exact role mapping, description, cost and eligibility conditions. They do not claim an inferred skills gap, certification, hiring outcome or a financial benefit stack. Unmapped roles receive a truthful resource-library fallback. No existing training claim was broadened.

## Data and user controls

- Explicit role/location entry opens Jobs and requests the existing USAJOBS search once when its availability check succeeds. Editing or opening a saved search link does not auto-search.
- Search fields and results do not overwrite saved Career work. The public search URL contains exactly `tool`, `view`, `role`, and `location`, and keeps the same origin. It is created only through the explicit save/share control; clipboard/download actions are separate. It restores the query without storing or transporting a resume, plan, identity, contact form or result snapshot.
- A search-specific Dean form starts with a one-time question, distinct from future recruiting interest/permission. Role/location move into it only through the visible transfer button. Both existing Career and search contact forms retain independent in-memory drafts across in-tab tool switching; inactive controls have distinct IDs and remain hidden.
- Reviewed email uses the existing `mailto:` handoff and truthful draft-request status. Copy fallback remains. No email is sent by the app, receipt is not confirmed, and no server delivery service was added. A reliable delivery service remains an explicit product gap.
- Employer booking uses the existing fixed Calendly link with no query prefill and is separate from member contact permission. No member work is transferred into it.

## Boundary of validation

Focused synthetic browser tests intercept provider, email, booking, clipboard and file actions. They verify public-query payloads, real-result fixture rendering, stale/error/empty/unavailable handling, role resources, consent, one-time inquiry, contact preservation, source distinctions, same-origin query sharing and 320/375px layouts. Exact published-parent negative control fails at the new first functional entry assertion. Local browser evidence does not establish provider delivery, hosted release acceptance or manual assistive-technology acceptance.

The parent performed visual/AX review on the retained local preview. No publication or booking/message action was performed. Required-suite receipts, source hashes and final disposition accompany the handoff.

## Final release pass

The final pass retained the reviewed app instead of adding more features. The fresh Career form has one primary content title and compact spacing, while its sharing notice stays before submit. Optional result-grouping and remote-search explanations are native disclosures. Learning costs and eligibility remain visible. On synthetic 375 x 812 layouts the primary button moved 329.56 CSS pixels upward and fits above navigation; 320 x 568 still needs scrolling. This measures layout, not intuitive usability or a real on-screen keyboard. Actual Enter submission is covered by the focused test.

Parent relayed the final actual Claude review from the existing chat: keep USAJOBS failure and zero-result states plain with working external-search alternatives. The focused regression covers empty, error and unavailable responses, and the existing federal function regression covers synthetic timeout and abort behavior. This is review input, not release clearance. A ZIP/radius provider expansion discussed separately is deferred; the release adds no provider or unsupported geographic matching claim.

Parent freshly verified GitHub main `e37233901df331597f6f787166a194b68f6c0fbc`, production cache 306, and ready Netlify deploy `6ae493f425bdfe263ca0dc3b` on site `e8e39892-d7d1-47c0-b23a-847ed01120b8`, published October 30, 2026 at 12:56:34.577 UTC. Candidate cache 307 is fresh; the candidate-bound rollback uses 308. Publication and hosted identity checks remain the parent's responsibility.
