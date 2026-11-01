# Value-first Career release - source and scope

2026-11-01. Candidate on `codex/value-first-20261101`, based on published merge `e37233901df331597f6f787166a194b68f6c0fbc`. Initial building and preview authority was extended by the user's explicit "keep going one more time and then publish" instruction, followed by the requested learning-resource recommendations. This builder prepares the local commit, validation and rollback; the parent owns publication. Prior runtime and resume behavior are preserved. The active PWA cache advances from production 306 through preview 307 to corrected candidate 308. No new server/API provider integration, account creation, tracking, delivery backend or spend changes.

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

Learning cards share the fourteen-entry `TOPS_CAREER_LEARNING` catalogue. The five existing resource IDs, names, destinations, descriptions and access conditions are preserved. Nine verified additions include three general options; full source and access evidence is in `learning-catalogue.md`. Recommendations do not claim an inferred skills gap, required credential, hiring outcome, comprehensive coverage or a financial benefit stack. Unmapped or ambiguous titles receive clearly labelled general learning.

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

The final release adds a ZIP-based resource display hint and the requested curated learning recommendations to the reviewed app. The fresh Career form has one primary content title and compact spacing, while its sharing notice stays before submit. Optional result-grouping and remote-search explanations are native disclosures. Learning costs and eligibility remain visible with each displayed card. On synthetic 375 x 812 layouts the primary button moved 329.56 CSS pixels upward and fits above navigation; 320 x 568 still needs scrolling. This measures layout, not intuitive usability or a real on-screen keyboard. Actual Enter submission is covered by the focused test.

Parent relayed the final actual Claude review from the existing chat: keep USAJOBS failure and zero-result states plain with working external-search alternatives. The focused regression covers empty, error and unavailable responses, and the existing federal function regression covers synthetic timeout and abort behavior. This is review input, not release clearance. A ZIP/radius provider expansion discussed separately is deferred; the release adds no provider or unsupported geographic matching claim.

Parent freshly verified GitHub main `e37233901df331597f6f787166a194b68f6c0fbc`, production cache 306, and ready Netlify deploy `6ae493f425bdfe263ca0dc3b` on site `e8e39892-d7d1-47c0-b23a-847ed01120b8`, published October 30, 2026 at 12:56:34.577 UTC. Preview candidate 307 was held after the parent found that ZIP 53202 omitted Wisconsin resources. The corrected candidate advances to 308, with candidate-bound rollback 309. Publication and hosted identity checks remain the parent's responsibility.

## Wisconsin ZIP display hint

Primary source checked by parent and builder on November 1, 2026: [USPS three-digit ZIP Code list by area/district](https://about.usps.com/what/performance/service-performance/zip-3-by-area-district.htm). Its Wisconsin district row lists 530, 531, 532, 534, 535, 537, 538, 539, 540, 541, 542, 543, 544, 545, 546, 547, 548 and 549. The app uses only this explicit allowlist after matching a complete five-digit ZIP or ZIP+4; state-name and WI text behavior is preserved. The source is a postal district list, not an exhaustive validation of individual ZIP codes or a residency/eligibility dataset.

The hint only displays the existing Wisconsin provider/VBS sections. It does not rewrite the search, perform geocoding, contact a new provider, prove that a ZIP exists, assess eligibility or imply a nearby vacancy. Provider capacity warnings, source dates and VBS roles-coming-soon wording remain unchanged. Focused cases include positive 53202, 54935, 54301 and ZIP+4; excluded prefixes 533/536, Illinois 60601 and partial/extra characters remain negative. ZIP query requests and share links preserve the entered value.

## Learning selection and saved-job context

The shared selector ranks explicit terms found in the available requirement excerpt first, then exact catalogue roles, then curated bounded title/family cues, then general options. It shows at most three default recommendations and quotes the actual matched term when explaining a posting signal. No frequency, demand or requirement is inferred from returned listings. Ambiguous technical communications, software maintenance and emergency-room nursing do not become marketing, trade-safety or first-response recommendations from those broad words alone.

Search results and saved-job application reviews show one recommendation, with the other default choices behind "Show 2 more learning options". General options not already shown remain in "Skills useful in any role". Every card has a small practical next activity, explicit free/access and credential boundaries, and a fixed provider link. The saved-job view uses only that job's role and requirement excerpt, remains read-only, and does not substitute the global Career target or mutate the plan. No personal data is appended to provider links.

The existing detailed Career learning group retains reviewed draft replacement, dismissal and save controls. Existing next-step action text remains stable; recognition uses all currently relevant catalogue matches before the top-three display limit. Thus a still-relevant saved choice survives reordering, while a changed role or requirement context still withholds an unrelated next link.

Actual Claude review supplied by the parent recommended one strongest visible suggestion and collapsed alternatives, with no unverified durations. This presentation was adopted. Reviewer checks preserve the old five records and test bounded family cues and exact posting reasons; local test and hosted acceptance receipts remain separate.
