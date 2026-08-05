# VERIFICATION LOG — TRANSITION OPS

Standing record of verified benefits/policy claims per the `policy-verification`
skill. Ratings: CONFIRMED / PROBABLE / UNVERIFIED. Anything below CONFIRMED does
not ship.

Entries are append-only. Amend in place only to change a rating, and note why.

---

## V-2026-001 — FY2026 military basic pay raise: 3.8%

- **Claim:** Basic pay increased 3.8%, effective 1 JAN 2026.
- **Rating:** CONFIRMED
- **Verified by:** Dean Nemecek (human verification, read source directly)
- **Verified date:** 2 AUG 2026
- **Citation of record:** CRS In Focus IF10260, *Defense Primer: Military Pay Raise*
- **Corroborating authority:** 37 U.S.C. 1009 (Employment Cost Index formula);
  FY2026 NDAA, P.L. 119-60
- **Basis:** The 3.8% figure is the automatic ECI-indexed raise under
  37 U.S.C. 1009. The FY2026 NDAA authorized **no alternate pay adjustment**,
  so the statutory default took effect.
- **Affected app module:** 2026 POLICY INTEL card → "FY26 NDAA — ENACTED
  18 DEC 2025" block (index.html:13285 and duplicate at 13510)
- **Open item:** The figure currently ships appended to the TRICARE bullet
  inside the NDAA block, which implies the NDAA granted the raise. It did not —
  it declined to override the formula. Corrected per
  `patch-2026-08-02-policy-intel-stage.md`, item 3 — **applied 2 AUG 2026**,
  branch `s2-policy-intel-stage-accuracy`.

---

## V-2026-002 — HVAC Economic Opportunity Subcommittee markup, 24 FEB 2026

- **Claim:** The House Veterans' Affairs Subcommittee on Economic Opportunity,
  chaired by Rep. Derrick Van Orden (R-WI-3), held a markup on 24 FEB 2026.
  The majority headlined 6 GOP GI Bill / disabled-veteran affordability bills,
  but 12 bills were on the agenda — the 6 are a subset. No offsets were attached
  to any bill, so none can advance to a Full Committee markup as they stand.
- **Rating:** CONFIRMED
- **Verified by:** Dean Nemecek (human verification, opened page directly);
  independently re-read 2 AUG 2026.
- **Verified date:** 2 AUG 2026
- **Citation of record:** House Committee on Veterans' Affairs press release,
  "Economic Opportunity Subcommittee Chairman Van Orden Leads Markup of 6 House
  GOP Bills to Modernize the GI Bill and Address Affordability for Disabled
  Veterans," 24 FEB 2026 —
  https://veterans.house.gov/news/documentsingle.aspx?DocumentID=7869
- **Supporting quotes (verbatim, from Van Orden's prepared opening remarks):**
  - "Today, we are marking up 12 bills."
  - "None of the bills being considered here today include the offsets that will
    be necessary to move these bills further in the legislative process."
  - "If we cannot find an offset for a bill, we would not be able to consider it
    at a Full Committee markup."
- **Affected app module:** 2026 POLICY INTEL card → "ON THE HILL — WATCH LIST"
  (index.html:13306-13307 and duplicates at 13531-13532)
- **Finding:** App wording **overstated the stage**. Corrected per
  `patch-2026-08-02-policy-intel-stage.md`, items 1 and 2 — **applied
  2 AUG 2026**, branch `s2-policy-intel-stage-accuracy`.

---

## STAGE CHECKS RUN AGAINST THE SAME WATCH LIST (2 AUG 2026)

Re-verified directly against Congress.gov so the markup finding could be scoped.

| Bill | App stage claim | Actual | Verdict |
|---|---|---|---|
| H.R. 980 | "Passed House 402-2 — awaiting Senate" | Passed House 402-2 (Roll no. 49) 2 FEB 2026; received in Senate and referred to Senate VA Cmte 3 FEB 2026 | **ACCURATE** |
| H.R. 1458 | "Passed House — awaiting Senate" | Passed House by voice vote (suspension, as amended) 2 FEB 2026; received in Senate and referred 3 FEB 2026 | **ACCURATE** |

Sources: congress.gov/bill/119th-congress/house-bill/980/all-actions and
.../house-bill/1458/all-actions, accessed 2 AUG 2026.

Neither H.R. 980 nor H.R. 1458 was part of the 24 FEB 2026 subcommittee markup.
They are a separate, further-along set. The markup bills are not individually
tracked in the app.

---

## OPEN — BELOW CONFIRMED

*(None currently open.)*

---

## CLOSED

### O-2026-001 — H.R. 980 description — CLOSED 2 AUG 2026, one clause was wrong

- **Opened as:** PROBABLE. The CRS summary of the *introduced* text supported
  "more counselor access" but said nothing about flight training or monthly
  outreach, and the bill passed **as amended** with a changed title.
- **Closed by:** reading the engrossed text directly.
- **Citation of record:** H.R. 980, Engrossed in House (BILLS-119hr980eh),
  passed 2 FEB 2026 —
  https://www.congress.gov/bill/119th-congress/house-bill/980/text/eh
  Accessed 2 AUG 2026 (via browser; congress.gov 403s automated fetch).

| Clause as shipped | Engrossed text | Verdict |
|---|---|---|
| "expanded flight training under VR&E" | SEC. 3 — Secretary may approve non-degree flight training within a ch. 31 rehabilitation program, notwithstanding 38 U.S.C. 3680A(b) | CONFIRMED |
| "more counselor access" | SEC. 2 — strikes the second sentence of 38 U.S.C. 3697B(a), removing the requirement that on-campus counseling be delivered by VA employees | CONFIRMED |
| "monthly VA outreach" | SEC. 4(a) — adds 38 U.S.C. 3104(f): a dedicated VR&E line in the Education Call Center and regional-office contact details posted online | **UNVERIFIED — no cadence of any kind appears in the bill. "Monthly" was unsupported.** |

- **Also found, and previously omitted from the app:**
  - SEC. 3(b): the flight-training authority applies to rehabilitation programs
    approved **on or after 1 AUG 2026** — in effect as of this entry.
  - SEC. 4(b): new 38 U.S.C. 3105(c)(2) — VA must approve or deny a VR&E program
    extension request **within 30 days**, with annual reporting for five years.
- **Stage claim:** "Passed House 402-2 — awaiting Senate" re-confirmed accurate.
  Unchanged.
- **Disposition:** bullet rewritten, approved by Dean 2 AUG 2026, applied on
  branch `s2-hr980-bullet-accuracy`. Both render locations.
- **Lesson for `policy-verification`:** an introduced-version CRS summary is not
  evidence about a bill that passed as amended. When actions show "as amended,"
  the engrossed text is the only citation that settles content.

---

## V-2026-003 — President's Military Spouse Commission, EO signed 3 AUG 2026

- **Claim:** A presidential commission on military spouses was established
  recently, reporting directly to the President.
- **Rating:** CONFIRMED
- **Verified by:** s2-intel (rung 1, direct read, no wall). **Independently
  re-read by the Orchestrator the same day** against the same primary document.
- **Verified date:** 5 AUG 2026
- **Citation of record:** Executive Order, "Establishing the President's
  Military Spouse Commission," signed 3 AUG 2026 —
  https://www.whitehouse.gov/presidential-actions/2026/08/establishing-the-presidents-military-spouse-commission-af64/
- **Supporting quotes (verbatim, from the primary text):**
  - Sec. 2: "There is hereby established the President's Military Spouse
    Commission (Commission)."
  - Sec. 3: "The Commission shall advise and assist the President on policies
    that affect military spouses and families."
  - Sec. 3: "developing policies that address challenges faced by military
    spouses in key areas such as housing, employment, healthcare, education, and
    deployment-related support"
  - Sec. 3: provides "the President with a report on the matters described in
    this section at the end of each fiscal year."
  - Sec. 4: "The Department of War shall provide such funding and administrative
    and technical support as the Commission may require."
  - Sec. 4: "The Commission shall terminate 2 years from the date of this order,
    unless extended by the President."
- **"Direct access to POTUS" — CONFIRMED, with a distinction that must not be
  blurred.** The advisory line runs to the President directly: Sec. 3 says
  advise and assist *the President*, and the annual report goes *to the
  President*. The Department of War is the **administrative host** — funding,
  staff, technical support. Reporting line and administrative housing are two
  different things and both are true.
- **Discrepancy noted between the two reads.** s2-intel reported membership
  including the Secretary of Homeland Security and Coast Guard leadership; the
  Orchestrator's read returned the Chairman of the Joint Chiefs, service chiefs,
  and senior enlisted advisors. **Only the Chair is asserted in shipped copy** —
  the spouse of the Secretary of War — which both reads agree on. The full
  membership roster is **not** shipped and is not settled at rung 1.
- **Federal Register status:** **Not yet published as of 5 AUG 2026**; zero
  matching entries on the FR API. No EO number is assigned in the
  whitehouse.gov text. Normal publication lag at two days, not a defect.
- **Affected app module:** 2026 POLICY INTEL card — new entry inserted at
  index.html:13297 and the duplicate render at 13527. **STAGED on branch
  `ops/coverage-charter`, NOT MERGED.** Cache bumped v105 → v106.
- **Actionability — stated plainly because the copy depends on it.** NOTHING is
  actionable for a spouse today. No application, no funding, no eligibility
  change, no program stood up. The order creates an advisory body. Shipped copy
  says so in those terms: "This is an advisory body, not a benefit."
- **Open item:** re-check the Federal Register for the assigned EO number and FR
  citation once published, and amend this entry in place.

---

## V-2026-004 — Dole Act §403 homeless-veteran implementation plan (VA notice, 29 JUL 2026)

- **Claim:** VA announced an implementation plan for section 403 of the Dole Act,
  authorizing VA to provide food, shelter, transportation, and other items to
  homeless veterans when necessary.
- **Rating:** CONFIRMED
- **Verified by:** Orchestrator, rung 1, primary source read directly.
  **DOCTRINE DEVIATION, DECLARED:** this is s2-intel's work. Delegation was
  attempted **three times** and every run died on upstream `529 Overloaded`
  errors. The ladder method is the skill's, not the agent's, so the Orchestrator
  executed rung 1 rather than leave a Commander tasking unserved. **Re-run under
  s2-intel when the staff is available**, and treat this entry as good but
  single-sourced to one analyst.
- **Verified date:** 5 AUG 2026
- **Citation of record:** "Implementation of Section 403 of the Senator Elizabeth
  Dole 21st Century Veterans Healthcare and Benefits Improvement Act," Notice,
  **FR document 2026-15301**, published **2026-07-29**, Department of Veterans
  Affairs. Effective **29 JUL 2026**. Statute: **Pub. L. 118-210**, signed
  **2 JAN 2025**.
- **WALL ENCOUNTERED, and how it was handled.** The federalregister.gov **HTML**
  page 302-redirects to `unblock.federalregister.gov`, a bot interstitial. That
  redirect was **not followed** — an interstitial is not the source. Verified
  instead through the Federal Register **JSON API** and the document's own
  **raw full-text endpoint**, which is the same agency's machine interface to the
  same document. This is the §C.6 rung-1B pattern in practice.
- **Supporting quotes (verbatim, from the full text):**
  - "On January 2, 2025, the President signed into law the Senator Elizabeth Dole
    21st Century Veterans Healthcare and Benefits Improvement Act (the Act;
    Pub. L. 118-210)."
  - "VA may provide to a covered Veteran, as the Secretary determines necessary:
    (1) food, shelter, clothing, blankets, and hygiene items required for the
    safety and survival of the Veteran; (2) transportation required to support
    the stability and health of the Veteran..."
  - "This notice provides information on how VA will implement section 403(a) of
    the Act and is not a solicitation for public comment or a request for
    information."
- **Eligibility:** "covered Veteran" = a homeless veteran per **38 U.S.C. 2002**,
  or a veteran participating in **HUD-VASH**. Assistance is **time-limited
  through 30 SEP 2027** and requires a case-by-case necessity determination by
  the Secretary.
- **ACTIONABILITY — NOTHING. This is the finding that governs disposition.**
  There is **no application, no referral path, no enrollment, and no
  eligibility-determination process** a veteran or a person helping one would
  use. There is **no veteran-facing point of contact** — the only number in the
  notice is a FOR FURTHER INFORMATION CONTACT about the notice itself. Nothing a
  veteran must now do differently. It is internal implementation guidance to VA
  medical centers.
- **DISPOSITION: DOES NOT SHIP AS A POLICY CARD.** It fails the same test the
  military spouse commission failed ([[V-2026-003]]) and for the same reason —
  an authority was implemented, not a benefit a user can obtain. Shipping "VA may
  now provide food and shelter" with no route attached would read to a veteran in
  crisis as an offer, and there is no door to walk through.
- **WHAT IT DID SURFACE — a real content gap, PROPOSED, NOT APPLIED.**
  `index.html` carries **zero** homeless-veteran content: no "homeless", no
  HUD-VASH, no National Call Center. The app does carry the Veterans Crisis Line
  (988 press 1, text 838255). The durable, actionable asset is not this notice —
  it is the **National Call Center for Homeless Veterans, 877-424-3838**,
  verified 5 AUG 2026 against VA's own homeless-programs page: "The call is free,
  confidential, and available 24 hours a day, 7 days a week," staffed by "trained
  professionals... standing by to connect you to your nearest VA," with a live
  chat option. **Proposed as a RESOURCES entry. Dean rules on inclusion; nothing
  applied.**
- **Affected app module:** none. No patch, no CACHE_NAME bump, no DATA_VERIFIED
  change.

---

## V-2026-005 — Rescission of outdated Veterans Choice Program regulations (VA rule, 28 JUL 2026)

- **Claim:** VA is rescinding obsolete Veterans Choice Program regulations,
  superseded by the Veterans Community Care Program as of 6 JUN 2019.
- **Rating:** CONFIRMED
- **Verified by:** Orchestrator, rung 1, Federal Register API. Same declared
  doctrine deviation as [[V-2026-004]] — s2-intel delegation failed three times
  on upstream 529s.
- **Verified date:** 5 AUG 2026
- **Citation of record:** "Rescission of Outdated Veterans Choice Program
  Regulations," **Rule**, **FR document 2026-15210**, published **2026-07-28**,
  Department of Veterans Affairs.
- **Supporting quote (verbatim abstract):** "The Department of Veterans Affairs
  (VA) is rescinding obsolete regulations that were previously implemented for
  the Veterans Choice Program, which has been replaced by the Veterans Community
  Care Program as of June 6, 2019."
- **Does any veteran lose anything? NO.** This removes regulatory text describing
  a program that ended **seven years ago** under the MISSION Act. No current
  entitlement, eligibility, or access route changes. It is housekeeping.
- **APP IMPACT: NONE — verified by grep, not assumed.** `index.html` contains
  **zero** occurrences of "Veterans Choice", "Choice Program", "VCP",
  "Community Care", or "MISSION Act". There is no stale reference to correct
  because the app never carried one.
- **DISPOSITION: LOG ENTRY ONLY.** No patch, no CACHE_NAME bump, no
  DATA_VERIFIED change. Recorded so that if a future contributor finds the
  rescission and wonders whether the app was exposed, the answer and its evidence
  are already here.
- **Affected app module:** none.
