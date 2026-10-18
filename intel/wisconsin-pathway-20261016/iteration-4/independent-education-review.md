# Independent education and county-routing review

October 16, 2026. Codex force-mod/S2, read-only app review. **PASS for the bounded local implementation after one P2 correction.** This is not a whole-app release or assistive-technology certification.

## Frozen candidate

- Checkout: `/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops`, branch `codex/wisconsin-pathway`.
- index.html SHA256: `ac4cd90dc61ca39c1230665a1b6c7465aca31324f77c3a9b63a4a92aa7090df9`.
- pwa-sw.js SHA256: `47b9e649af493b53bf7def5d5dec5cdb1bda5891289d299699a98f8eb70aba65`, cache293.
- Application source was not edited by this reviewer. Review scripts and receipts are private evidence in this directory.

## Finding and disposition

**P2 closed: housing referral displaced the existing moving primary.** On earlier frozen dd410b05, VORP acquired `needs:[health,moving]` while remaining earlier than DOR in the record array. `topsStateHelpItems` performs a stable ordinary-priority sort, so every moving visitor received VORP as the primary/save suggestion. The intended primary had been Wisconsin move/tax planning. S3 moved VORP after the ordinary moving records without changing IDs or saved-action text. On ac4cd90, all112 combinations of two areas, eight situations and seven needs match the intended primary matrix. VORP remains available as related help.

No other actionable P1/P2 defect was found in this bounded review.

## Source and UI review

- The seven education/housing verification IDs are present exactly once in the implementation verification log. Runtime options preserve the cleared program scope. Other Reserve service is not presented as Wisconsin Guard eligibility.
- The existing public-school primary now gives the concise WDVA-versus-school distinction. The area note and expanded education detail retain the rule that moving/state choice does not settle residence or eligibility.
- One native, initially collapsed **Before you enroll** section appears only for education. UW/technical-college offices, the private nonprofit HEAB route, federal VA advice and conditional VetEd review remain distinct. Selected Reserve guidance appears for serving/guard/reserve/orders contexts; its official destination contains the DD2384-1 unit steps. The app avoids repeating full form instructions on the phone screen.
- Federal and family questions have a VA destination; private-school funding is described as conditional and paid to the school. VetEd is not offered as automatic extra funding or a cleared Post-9/11/Guard combination. No disputed three/five-year rule is added.
- The Wisconsin Guard route is primary only for explicit Wisconsin Guard. Existing secondary discoverability is preserved with its exclusion note; no new Guard row is inserted into every education panel.
- Housing help uses the current VORP county map and source-listed supervisor fallback. It remains a contact route, not a capacity statement. The existing household/SSVF, CVI geography, VOW Racine/surviving-spouse and VHRP family-occupancy boundaries survive.
- The four government additions stay secondary. Long-term nursing care is under health, not moving/housing; burial and honors are separate benefits tasks; DMV is distinct from occupational licensing. Government source verification remains owned by the other S2 reviewer.
- StateLocalHelp's save/review handlers and original action strings are preserved. Exact Guard saved-action mapping still resolves to guard/education. New options are voluntary external links; they do not mark tasks contacted, eligible or complete.

## Independent checks actually run

`independent-education-browser.json`:20 synthetic cases, isolated headless Chrome,320/375×667, professional/tactical themes, loopback app server, external and function requests blocked. Eight education situations plus moving/family and moving/reserve, each in both themes. Native Enter opens the education disclosure. Checked expected rows and restrictions, safe external-link attributes, initial collapsed state, horizontal reflow, exact need/situation after reload, and unchanged local storage from browsing/reload. All states removes the Wisconsin details. Zero runtime exceptions and zero POST attempts were observed. No real member data, referral submission or external agency transaction was used.

`independent-education-source-contract.json`:112 primary-route combinations, exact saved Guard action mapping and unique presence of all seven source entries. Frozen index identity was checked before and after the browser run.

The builder and independent public-array source files show no diff in this candidate. Reused the existing74-runtime/75-hosted inventory disposition. This reviewer did not produce a hosted file manifest, measure agency availability or execute broad release suites. S3 owns required validation; root owns visible IAB review and final release acceptance.

## Actual Claude critique disposition

Read root's `claude-ux-review-raw.txt`. Accepted the school-coordination question, concise pre-enrollment advice, explicit long-term-care heading, health placement for Homes, separate burial/honors eligibility, and plain county/tribal office naming. Kept the existing broader DMV label because the destination includes more than a Veteran marker. Retained root's prior decision to keep Guard tuition discoverable as a qualified secondary option while promoting it only for explicit Guard; Claude's suggestion to hide it completely in other contexts was not adopted. Its wording critique is not source verification or an observed usability test.

## Remaining limits

The conflicting WDVA residence-duration and VetEd combination documents remain recorded in education-source-review.md and are not adjudicated by the app. The WTCS parent directory is readable, but the linked contact PDF was not readable by direct tooling or root's browser during review; no named contacts are copied or claimed verified. The VORP map access issue was recovered by root browser.

Manual assistive-technology coverage remains pending. These synthetic checks do not establish first-time member understanding, enrollment success, benefit eligibility, support capacity or retention. No claim of complete Wisconsin benefit coverage or HOSTED RELEASE PASS follows from this report.
