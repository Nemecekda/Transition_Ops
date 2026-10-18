# Independent implementation review — Wisconsin iteration 3

October 16, 2026. Reviewer: Codex `/root/wi_loop_coverage`, independent of S3 implementation. The reviewer also authored the bounded nonprofit source packet; this is an independent implementation review, not a second independent policy verification of that packet. Root performed IRS/rating browser checks and actual Claude supplied separate scouting input.

**PASS for the bounded nonprofit/routing contract; no unresolved P1/P2 finding.** Full release gates remain S3's responsibility. Nothing in this report authorizes publication or establishes service availability, member outcomes or retention.

Reviewed candidate: `/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops`, branch `codex/wisconsin-pathway`.

- Final `index.html` SHA256: `cd93e02c3de0b32be4fbed8befc8f8b5005482c6952be92bb4136699546077c1`
- `pwa-sw.js` SHA256: `5672aedc5556ebaa8c9236f48e5f862f50fe39fc074bb8563aba32cc41bf6799`, cache292.
- Primary implementation: `TOPS_WISCONSIN_LOCAL_HELP` and `WisconsinNextChapter`, around lines7588–7619. Read-only review; no app edits by reviewer.

## Contract checks

| Check | Result |
|---|---|
| Only cleared new nonprofits ship | Exact three IDs match the source packet: VetsNet, CVI SSVF, VOW Marketplace. Held Dryhootch is absent from the new help data. No alternate EIN substitution. |
| One useful action before optional details | Existing primary action remains. Local help starts collapsed. Counts are start2/service2, moving3, benefits1/work1/education1/health1; no directory wall. |
| General navigation first | VetsNet precedes the targeted Women Veterans option for unspecified start/service visitors. This closes the reviewer's nonblocking ordering suggestion. |
| Geography visible | Organization and service-area text precede the summary. CVI says participating Wisconsin counties, VOW says in-person Racine, VetsNet asks about the visitor's community. No all-state capacity promise. |
| Family and service-status boundaries | CVI retains eligible veteran-household wording and provider review. VOW says surviving spouses, not all spouses. Guard, federal Reserve and family contexts do not rewrite these limits or establish eligibility. |
| Separate services are clear | VetsNet's Onward Ops is explicitly separate from Transition OPS. No sponsor availability, VA endorsement, clinical qualification or claims accreditation is inferred. Accredited claims help remains its own official route. |
| Navigation is not completion | New actions are external links with new-tab labels and safe link attributes. No completion handler is attached. Browsing, opening details and changing the selected state left saved data unchanged in the isolated checks. |
| National experience preserved | All states removes the Wisconsin helper layer. No new persistent state preference, member data, signup or external API call was added by these helpers. |
| Source copy matches implementation | Three records match `nonprofit-runtime-copy.json` after typographic-apostrophe normalization only; exact URLs, audience, caveat, geography and IDs preserved. |

## Validation and limits

`nonprofit-independent-browser.js` passed on the final hash. It ran 18 synthetic cases in isolated local headless Chrome, using 320×667 and 375×667 viewports across professional/tactical themes. Cases covered active-duty transition, Wisconsin Guard, another Reserve component, return from orders, veteran and family contexts. External/function requests were blocked. Native Enter expanded local help; no horizontal overflow, uncaught exception or POST attempt occurred. Results: `nonprofit-independent-browser.json`.

Static comparison and final hash binding: `nonprofit-source-contract.json`. The earlier f6756b8 checks were rerun after S3's final ordering and adjacent text changes. The sandbox initially denied loopback binding; the authorized isolated check then ran successfully with the required permission. This was a test-environment limitation, not an app defect.

This is laboratory evidence. It does not establish that every referral is currently accepting people, a contact responds, a user qualifies, the app is intuitive to an uncoached member, or that someone will return. No universal above-the-fold claim is made; root owns visible IAB evidence and S3 owns the mandatory accessibility/privacy/release gates.

## Adjacent finding closed

The existing American Job Centers directory entry previously promised priority to every veteran's spouse. S2 independently confirmed the narrower DOL rules, recorded in `adjacent-job-center-copy.md`. S3 corrected both the live resource description around line3377 and the existing v81 history sentence around line3157. The final copy says eligible spouses, program rules and separate DVOP screening. This resolves the contradictory promise on the linked workforce-support surface.

## Remaining evidence gaps

Dryhootch current operating legal identity remains a **PERSONAL OUTREACH** hold, not a finding of revocation or wrongdoing. A further northern/rural named-provider addition remains backlog until its exact current program area is established. County/tribal offices and the official VA housing-provider route remain available; the research gap must not be presented as an absence of services. No new messages, accounts, applications, paid APIs, telemetry, deploy or merge were performed for this review.
