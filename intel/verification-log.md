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

---

## V-2026-006 — VET TEC 2.0 core terms (Dole Act §212 / 38 U.S.C. §3699C)

- **Claim:** VET TEC 2.0 is authorized under the Dole Act (Pub. L. 118-210, §212,
  codified 38 U.S.C. §3699C); capped at 4,000 participants per fiscal year;
  covers tuition and fees, housing allowance, and books; charges GI Bill or DEA
  entitlement 1:1; uses VA Form 22-10297; and is **open for applications now**.
- **Rating:** CONFIRMED
- **Verified by:** s2-intel at rung 1, no wall. **Independently re-read by the
  Orchestrator the same day** against VA's own program page.
- **Verified date:** 5 AUG 2026
- **Citation of record:** 38 U.S.C. §3699C via uscode.house.gov;
  https://www.va.gov/education/other-va-education-benefits/vet-tec-2/ (page
  last-updated 5 AUG 2026); Federal Register doc 2025-22954 (VA PRA notice).
- **Supporting quotes (verbatim, VA.gov, 5 AUG 2026):**
  - *"You can apply online right now"* — with a live counter reading
    **"3,332 remaining openings"** of 4,000. Roughly 668 slots already consumed.
  - *"Tuition and fees (we pay your school directly)"*; *"Money for housing
    during your training"*; *"Books and supplies"*.
  - *"If you have remaining entitlement under Survivors' and Dependents'
    Educational Assistance (DEA), Montgomery GI Bill Active Duty, or the
    Post-9/11 GI Bill, we'll charge 1 month of entitlement for every 1 month of
    full-time training."*
  - Statute, §3699C(c): *"Not more than 4,000 covered individuals may participate
    in the program under this section in any fiscal year."*
- **THIS IS NOT THE SPOUSE-CARD CASE, and the distinction is the point.**
  [[V-2026-003]] and [[V-2026-004]] were authorities with no door to walk
  through. VET TEC 2.0 has a live application, a form number, and a decrementing
  counter. It is genuinely available, so the app may describe it as available.
  The defects below were **precision**, not false actionability.
- **Affected app module:** ACTION card (index.html:1069-1070), Career Paths
  (1898-1900, 1906, 2109), WHATS_NEW (2616), 6-month reminder `r-6-vettec`
  (2871), POLICY INTEL card (13311-13312 and byte-identical duplicate
  13541-13542).

---

## V-2026-007 — VET TEC defects found and corrected, 5 AUG 2026

This entry exists because **the app shipped these claims with no record at all.**
The gap surfaced as an incidental during the §F build and was chased here.

- **Rating summary:** three defects WRONG, one UNVERIFIED, all corrected.
- **Verified by:** s2-intel rung 1; Orchestrator independently re-read VA.gov and
  **corrected two proposed fixes that were themselves wrong** (see below).
- **Verified date:** 5 AUG 2026

**(a) The original VET TEC was described as current — WRONG, and it was the
costliest defect.** The original pilot **ended in 2024** and **did not charge
entitlement** (CRS R48588; GAO-25-106876: *"After the pilot ended in 2024,
Congress enacted a new program"*). Four app sites still described it in the
present tense as *"fully covered by VA"* and *"covers tuition + monthly housing
stipend"*, with no cap and no entitlement charge — while the POLICY INTEL card
correctly said entitlement is charged 1:1. **The app contradicted itself about
whether using VET TEC costs GI Bill months.** A veteran reading the Career Paths
module could have enrolled believing their entitlement was untouched. Corrected
at 1898, 1900, 1906, 2109.

**(b) The linked URL served content contradicting the sentence that cited it.**
index.html:1900 pointed at `.../vettec-high-tech-program/`, which now resolves to
VET TEC 2.0 content stating *"This new program has different eligibility
requirements and entitlement rules from the program we offered before."* Repointed
to the vet-tec-2 URL.

**(c) The fields-of-study list was WRONG at four sites.** The app listed
*"cyber, software, cloud, and IT"* / *"cybersecurity, cloud computing, IT"*.
VA's actual list, verbatim: **"Computer programming / Computer software / Data
processing / Information sciences / Media application."** Only *data processing*
matched. Cybersecurity, cloud computing, and IT appear in **neither** the statute
(§3699C(h)(2)) nor VA.gov. Corrected at 1070, 2871, and both card renders.
Line 2109's *"covers cloud/DevOps bootcamps"* was likewise unsupportable and now
points the reader at VA's approved-provider list instead of asserting coverage.

**(d) The exact application-open date is UNVERIFIED at rung 1 — marked, not
softened.** VA's own provider FAQ says only *"once it is available this June"*;
no primary source states the day. Only secondary blogs give the 15th. Every site
now reads **"JUN 2026"**. The month and the currently-open status are separately
CONFIRMED. **Open item:** a tier-3 human check of VA's page history or the
GovDelivery announcement would restore the exact day.

**(e) TWO CORRECTIONS TO THE ANALYST'S OWN PROPOSALS, recorded because both would
have shipped new errors.**
  1. s2-intel proposed fixing the card's eligibility by swapping AND to OR:
     *"veterans under 62 with 36+ months active duty, OR service members within
     180 days."* That reads as though a service member skips the 36-month and age
     tests. **VA.gov's operative test is:** *"1 of these must be true"* — veteran
     discharged other than dishonorable, **or** active-duty within 180 days of
     separating — *"And you must meet both of these requirements"* — 36+ months
     active duty **and** under 62 at approval. **Both conditions apply to both
     paths.** Shipped wording reflects that.
  2. s2-intel proposed keeping *"covers cloud/DevOps bootcamps"* and merely adding
     the entitlement charge. Cloud/DevOps is not in VA's field list, so the
     coverage claim itself was unsupported. Rewritten rather than annotated.
- **Disposition:** all corrections applied on branch `ops/vettec-accuracy`,
  CACHE_NAME v109 → v110. **DATA_VERIFIED held at 1 AUG** — this verified one
  program's claims, not the dataset. COMMANDER lane; staged, not merged.

---

## V-2026-008 — OPM RIF retention and probationary appeals (final rules, 3 AUG 2026)

- **Claim:** Two OPM final rules change federal reduction-in-force retention
  standing and probationary-termination appeals, both effective 2 SEP 2026.
- **Rating:** CONFIRMED
- **Verified by:** Orchestrator, rung 1 — Federal Register API and the
  documents' own raw full-text endpoints. No wall encountered.
- **Verified date:** 6 AUG 2026
- **Citations of record:**
  - "Reduction in Force," **Final Rule, FR doc 2026-15665**, published
    2026-08-03, **effective 2026-09-02**, OPM. Amends 5 CFR Parts 316, 330, 351,
    353, 359, 362, 430. Raw text:
    `federalregister.gov/documents/full_text/text/2026/08/03/2026-15665.txt`
  - "Streamlining Probationary and Trial Period Appeals," **Final Rule, FR doc
    2026-15654**, published 2026-08-03, **effective 2026-09-02**, OPM.
  - Same-day companions, verified present but **NOT relied on** for shipped
    copy: "Reduction in Force Appeals" 2026-15666; "Suitability Action Appeals"
    2026-15650.
- **Supporting quotes, verbatim:**
  - **RETENTION ORDER** — *"Agencies will maintain separate retention registers
    for competitive service and excepted service employees; within each group,
    employees will be ranked by performance credit, augmented by veterans'
    preference, with tenure subgroup and length of service used as tie-breakers."*
  - **POINTS** — *"Preference eligibles with a compensable service-connected
    disability of 30 percent or more receive 5 additional points; other
    preference eligibles receive 3 additional points; non-preference eligibles
    receive no additional points."*
  - **EFFECTIVE** — *"This rule is effective September 2, 2026."*
  - **MSPB → OPM** (2026-15654 abstract) — *"Executive order, 'Strengthening
    Probationary Periods in the Federal Service,' rendered the prior procedures
    for appealing such actions to the Merit Systems Protection Board (MSPB)
    inoperative. This final rule establishes a new, limited appeals process
    adjudicated by OPM."*
- **STATED LIMIT, carried into the record rather than smoothed over:** the
  document does **not** contain a single sentence establishing the complete
  ranking order, and does **not** name one CFR section for retention standing.
  The ordering quote above describes the rule's operation in the preamble; it is
  **not** the codified regulatory text. Anyone relying on exact retention
  mechanics should read 5 CFR 351 as amended.
- **NOT CLAIMED — and the app is built so it cannot drift into claiming it.**
  Both rules amend RIF and appeals regulations, not the hiring-preference
  statutes, but **no sentence in either document states that hiring preference is
  unchanged.** An earlier draft of the card asserted exactly that and it was
  struck before staging. The shipped card states what the rules govern and is
  silent on hiring. The Navigator corpus carries a binding SCOPE LIMIT
  forbidding it to say hiring preference is changed *or* unchanged.
- **THE CONFUSABLE-CLAIM HAZARD — why this shipped to three places, not one.**
  The app already carried a veterans'-preference points claim for **hiring**
  (5 points, 10 with a compensable SC disability or Purple Heart). Shipping the
  RIF numbers (5 / 3) without disambiguation would have left **two different
  point systems, both containing a "5," in one app.** That is the §0.8
  successor-sweep failure arriving as a *confusable-adjacent* claim rather than a
  predecessor — same consequence, different cause.
- **Affected app modules — all corrected in this one ship, no partial fix:**
  - 2026 POLICY INTEL card, **both byte-identical renders**
  - Navigator CORPUS — the two systems split, named separately, with the scope
    limit; plus **RULES 15**, which forbids answering any preference-points
    question without naming the system and requires the Navigator to **ask**
    when the question is ambiguous
  - Guard/Reserve **Military Technician** entry — dual-status techs are federal
    civilian employees subject to RIF and would not otherwise see the card
- **Disposition:** staged on `ops/opm-rif-probation`, CACHE_NAME v110 → v111.
  **DATA_VERIFIED held at 1 AUG** — this verified two rules, not the dataset.
  COMMANDER lane; staged, not merged.

---

## V-2026-008 — AMENDMENT, 9 AUG 2026 (supersedes two statements above)

Re-verified at rung 1 against raw Federal Register full text retrieved by direct
HTTP (`curl`), which returns the complete document. The earlier pass used a
fetch tool that truncated every one of these documents inside the preamble,
before the codified amendatory text. Two statements in V-2026-008 were wrong or
incomplete as a result, and both are corrected here rather than edited above.

1. **"Two OPM final rules" is REFUTED as a count.** The Federal Register API,
   queried mechanically (`agencies=personnel-management-office`,
   `publication_date=2026-08-03`, `type=RULE`), returns **count: 4** —
   2026-15665, **2026-15666**, 2026-15654, **2026-15650**. V-2026-008 recorded
   15666 and 15650 as "verified present but NOT relied on." That was a defensible
   sourcing choice and an indefensible copy outcome: the shipped card said
   "**Two** OPM final rules," which is a count claim, and the omitted 15666 is
   *Reduction in Force Appeals* — the same subject the sentence names.
2. **The STATED LIMIT on retention mechanics is now CLOSED.** V-2026-008 recorded
   that no single sentence established the complete ranking order and no CFR
   section was named for retention standing. Both now read from codified text:
   **5 CFR 351.501** states the order in one section, and **5 CFR 351.504**
   codifies the 5 / 3 / 0 preference points. The preamble-only caveat no longer
   applies to these two claims.

**Method note, carried forward:** these FR text files contain stray NUL bytes.
`file` classifies them as binary and **plain `grep` silently reports no matches
and exits 1** — it does not warn. Counts taken that way are void. Use `grep -a`
or count in Python. One such reading was made and corrected in session.

---

## V-2026-009 — OPM RIF appeals and suitability appeals (final rules, 3 AUG 2026)

- **Claim:** Two further OPM final rules published 3 AUG 2026, effective
  2 SEP 2026, move RIF-action appeals and suitability-action appeals from the
  MSPB to OPM. Neither was in the app.
- **Rating:** CONFIRMED
- **Verified by:** Orchestrator, rung 1 — raw FR full text via direct HTTP.
- **Verified date:** 9 AUG 2026
- **Citations of record:**
  - "Reduction in Force Appeals," **Final Rule, FR doc 2026-15666**, 5 CFR 351,
    published 2026-08-03, effective 2026-09-02.
  - "Suitability Action Appeals," **Final Rule, FR doc 2026-15650**, 5 CFR 731,
    published 2026-08-03, effective 2026-09-02.
- **Supporting quotes, verbatim:**
  - **FORUM** (15666 SUMMARY) — *"OPM will replace the Merit Systems Protection
    Board (MSPB) as the adjudicative agency for such appeals."*
  - **SCOPE** (15666) — *"the final text specifies that only an employee
    furloughed for more than 30 days, separated, or demoted by a RIF action
    taken under part 351 may appeal that action to OPM."*
  - **MERITS BURDEN** (15666) — *"the appellant must prove that the agency
    failed to comply with an applicable statute or OPM regulation governing RIF
    actions under part 351, and the failure prejudiced the appellant by causing
    the appealed action or the loss of a materially more favorable outcome."*
  - **EXCLUSIVITY** (15666) — part 351 procedures are *"the sole and exclusive
    means of appealing a RIF action,"* RIF matters *"cannot be raised in
    grievance procedures or challenged through grievance arbitration,"* while
    preserving collateral jurisdiction of EEOC, Inspectors General, MSPB, DOL
    VETS, and OSC; the no-judicial-review provision is retained.
  - **APPLICABILITY** (15666 DATES) — *"This final rule applies only to a RIF
    action for which an agency issues the employee a specific RIF notice under
    5 CFR 351.802 on or after September 2, 2026."*
- **STATED LIMIT:** codified §§ 351.901–351.907 were read as amendatory text;
  the merits-burden and exclusivity sentences quoted above are from the rule's
  section-by-section analysis of its own final text, not the codified paragraph.
  Direction and effect are not in doubt; exact codified phrasing of §351.901(b)
  should be read before any copy quotes it as regulation.
- **Disposition:** shipped in the same patch as V-2026-010. COMMANDER lane.

---

## V-2026-010 — OPM performance appraisal rule, 91 FR 41521 (IN FORCE 6 AUG 2026)

- **Claim:** A separate OPM final rule, not previously in the app, removed the
  bar on forced/standardized distribution of rating levels, eliminated mandatory
  review of Level 1 ratings, and closed the negotiated-grievance route for a
  rating of record. **Effective 6 AUG 2026 — already in force when verified.**
- **Rating:** CONFIRMED — on codified regulatory text, not preamble.
- **Verified by:** Orchestrator, rung 1 — raw FR full text via direct HTTP.
- **Verified date:** 9 AUG 2026
- **Citation of record:** "Performance Appraisal for General Schedule,
  Prevailing Rate, and Certain Other Employees," **Final Rule, FR doc
  2026-13715, 91 FR 41521**, 5 CFR Parts 351, 430, 537, published 2026-07-07.
  **Effective 2026-08-06. Compliance with 5 CFR 430.208(e)(1) and (2) required
  beginning 2027-01-01.**
- **Supporting quotes, verbatim:**
  - **SUMMARY** — *"eliminates unnecessary summary level patterns; removes the
    prohibition of a forced, or standardized, distribution of performance rating
    levels; eliminates mandatory review of Level 1 ratings; removes the option to
    grieve a rating of record..."*
  - **CODIFIED §430.208(c)** — *"OPM may establish, and refine as needed, a
    standardized distribution of some or all rating levels which agencies must
    apply when rating employees, except that employees appointed under Schedules
    C or G in the excepted service may be excluded..."*
  - **CODIFIED §430.208(k)** — *"Subject to 5 U.S.C. 7116(a)(7), a rating of
    record may not be challenged through the negotiated grievance procedures
    established under 5 U.S.C. 7121."*
  - **CODIFIED §430.208(i)(1)** — a rating of record may be changed *"Within 60
    days of issuance based upon an informal request, as specified in agency
    policies and procedures, by the employee."*
  - **LEVEL 1 REVIEW** — amendatory instruction 5 removes §430.207(c). The
    characterization of what removed (c) required is taken from the rule's own
    SUMMARY, quoted above; the prior text of (c) was not read.
- **HOW THIS WAS MISSED, and why it is the finding rather than a footnote.**
  Issue #16 scoped the work to OPM documents published 3 AUG 2026. This rule
  published 7 JUL 2026 and is invisible to that query. It surfaced only because
  2026-15665's own codified text repeatedly cross-references *"the final rule
  prescribed at 91 FR 41521."* **A date-scoped source query does not bound a
  subject.** The RIF rule that was in scope depends on an appraisal rule that
  was not, and the app's advice line — *"make sure your most recent appraisal is
  accurate and on file"* — was materially incomplete without it: it told members
  to protect a rating while omitting that the union route to fix a wrong one had
  just closed.
- **CORRECTION TO ANALYST PRODUCT, recorded.** s2-intel reported this rule's
  existence — the right catch — but rated it PROBABLE that 2026-15665 does not
  amend §430.208. 15665 **does** amend it: amendatory instruction 48 revises
  §430.208(e)(4) and removes (e)(5). The substance s2-intel identified was right;
  the containment claim was wrong. Both rules touch the section; only 13715
  changes what it means for a member.
- **NOT CLAIMED:** the standardized distribution's *shape* — how many employees
  may receive each level — is not stated. §430.208(c) authorizes OPM to establish
  one; no cap figure exists in this document. No percentage may be published.
- **Disposition:** staged on `ops/opm-rif-appraisal`, CACHE_NAME v114 → v115.
  **DATA_VERIFIED held at 1 AUG** — this verified five rules, not the dataset;
  hold ratified by Dean 9 AUG 2026. COMMANDER lane; staged, not merged.

**IMPACT: SHIP - ACT | A2 | Orchestrator | 9 AUG 2026 | revisit 1 JAN 2027**
A1 population: SEPARATING, GUARD/RESERVE, SPOUSE/FAMILY, ALREADY SEPARATED — all
four, because the trigger is federal civilian employment, which any of the four
may hold (dual-status technicians and spouse-preference hires included).
band: condition-triggered, no milestone band — it keys on being a federal
civilian employee, not on months to separation.
excluded: this does not apply to anyone not in, or entering, federal civilian
service; it does not touch military pay, military force-shaping, or VA benefits.
timing: ACT AVAILABLE NOW (rule in force 6 AUG 2026).
A2 act: "If your rating of record is wrong, request a correction through your
agency's own procedures within 60 days of the date it was issued (5 CFR
430.208(i)(1)) — the negotiated grievance procedure is no longer available."
A3 surface(s): 2026 POLICY INTEL card, both renders (now ONE source —
`renderPolicyIntel()`); Navigator CORPUS (b) and new (c); RULES 16;
Guard/Reserve Military Technician entry.  token: [GUARD/RESERVE]
sweep trigger: FIRED — "amends", "changed from", plus confusable-adjacent
(a THIRD numeric scale, performance credit 7/5/3/0, alongside RIF preference 5/3
and hiring preference 5/10). Executed by `validation-gate`, not here.
**Editorial ruling: the 7/5/3/0 scale is deliberately NOT shipped.** It is real
and codified at §351.503(a)(1), but publishing a third set of points containing
a "5" into a card that already carries two re-opens the exact §0.8
confusable-adjacent hazard V-2026-008 was built to close. The card states the
ordering qualitatively instead. Recorded so this is a decision, not an omission.
A4 cost: A CLOSED WINDOW — the 60-day correction window under §430.208(i)(1),
now the primary route since the grievance route is barred.
EXPIRES: NONE — permanent regulatory change. Revisit 1 JAN 2027, when agency
compliance with §430.208(e)(1)-(2) begins and a distribution may be published.

---

## STANDING TICKLERS — opened 9 AUG 2026 (V-2026-009 / V-2026-010)

Dated items that must fire without anyone remembering this session. Both are
COMMANDER lane on arrival because both touch shipped policy copy.

| Fires | Item | What must happen | Source |
|---|---|---|---|
| **2 SEP 2026** | The four 3 AUG 2026 OPM rules take effect. | The POLICY INTEL entry **FEDERAL SERVICE — RIF AND APPEAL RULES CHANGE 2 SEP 2026** is written in the future tense throughout, and Navigator RULE 16 orders future tense for CORPUS (b). **On 2 SEP that copy becomes wrong by tense.** Flip (b) and the card to present tense; keep the notice-date sentence, which stays true permanently. | V-2026-009 |
| **1 JAN 2027** | Agency compliance with 5 CFR 430.208(e)(1)-(2) begins. | A standardized distribution may be published between now and then. **No cap figure exists today and none may be invented** (V-2026-010, NOT CLAIMED). Re-verify at rung 1; if OPM publishes a distribution, it is a new finding, not an edit. | V-2026-010 |

**Why the 2 SEP item is not optional.** Dean's ruling of 9 AUG 2026 is that the
card must never blend the two effective dates — a member holding a RIF notice in
August has to be able to tell which regime governs it. That ruling is what makes
the future tense correct *today* and wrong *on 2 SEP*. A tense that is only
correct inside a window is a dated liability, and this is the entry that closes
it.

---

## V-2026-011 — Veterans Forge (partner listing, certs group)

- **Claim:** Veterans Forge Inc. is a registered 501(c)(3) nonprofit offering
  hands-on AI training (machine learning, neural networks, data analysis),
  emerging-tech tracks (blockchain, cybersecurity, Internet of Things), and
  career support from resume building to interview preparation, open to
  veterans, active duty, and their spouses/partners, **at no cost to the
  member**.
- **Rating:** CONFIRMED, with one field carried on attestation (see below).
- **Verified by:** Orchestrator, rung 1, live fetch of https://veteransforge.org
  (HTTP 200), independent of the tasking packet.
- **Verified date:** 12 AUG 2026
- **Citation of record:** https://veteransforge.org
- **Supporting quotes (verbatim, veteransforge.org, 12 AUG 2026):**
  - *"Veterans Forge Inc. is a registered 501(c)(3) nonprofit organization. All
    donations are tax-deductible."*
  - Eligibility: *"US military Veterans"*, *"Active Duty, and their
    Spouses/Partners"*.
  - Programs named: AI Training — *machine learning, neural networks, data
    analysis*; Future Technology — *blockchain, cybersecurity, Internet of
    Things*; Career Support — *"From resume building to interview preparation,
    we offer the guidance needed to successfully navigate the job market."*
  - *"founded by Vets for Vets"*.

### COST IS PARTNER-ATTESTED, NOT SITE-VERIFIED — recheck trigger

**No pricing, fee, tuition, or free-access language appears anywhere on
veteransforge.org.** The `cost: "free"` field, which drives the member-facing
**FREE** chip, rests entirely on the Commander's direct confirmation from the
partner.

- **Attestation, verbatim, Dean Nemecek, 12 AUG 2026:** *"classes for veterans
  are free"*.
- **Why this is recorded separately.** Every other field on this entry is
  quotable off a public page. This one is not, so no source diff can detect
  drift. If the partner introduces tuition, the app keeps advertising FREE and
  nothing in the monitoring chain fires.
- **RECHECK TRIGGER — s2-scanner / s2-vetting.** On any of: (a) pricing,
  tuition, or fee language appearing on veteransforge.org; (b) 90 days elapsed
  with no re-attestation; (c) any member report of a charge. On fire, the
  `cost` field is re-verified before it ships another day. Route to COMMANDER
  lane — it is user-facing benefits copy.
- **Note the attestation covers "classes for veterans."** It does not by its
  own words cover active duty or spouses, who are listed as eligible. Treated
  as covered by the partner relationship for now; fold into the same recheck.

### HELD — guard_reserve eligibility

Guard/Reserve is **not** claimed. It appears nowhere on veteransforge.org, and
the eligibility array ships as `["veteran","active","spouse"]`. Awaiting Robbe.
This is a held item pending confirmation, **not an omission by oversight** — if
it lands, it is a one-line amendment to this entry and to the array.

- **Affected app module:** RESOURCES certs group, `veterans-forge`
  (index.html:2809). Second entry to carry `relationship: "partner"` under the
  disclosure convention established in 7a95351; render side unchanged.

---

## V-2026-012 — AI crawler control tokens (robots.txt policy basis)

- **Claim:** The user-agent tokens governing AI search retrieval are distinct
  from those governing model training, such that blocking a training crawler
  does not remove a site from that vendor's AI search results.
- **Rating:** CONFIRMED
- **Verified by:** Orchestrator, rung 1, each vendor's own crawler
  documentation fetched live. No secondary sources used.
- **Verified date:** 12 AUG 2026
- **Citations of record:**
  - OpenAI — https://developers.openai.com/api/docs/bots
  - Anthropic — https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
  - Google — https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers
  - Perplexity — https://docs.perplexity.ai/guides/bots
  - Common Crawl — https://commoncrawl.org/ccbot
- **TWO CITATION URLS MOVED.** Both were reached through a cross-host 301 and
  re-fetched at the destination; the destinations above are the citations of
  record. `platform.openai.com/docs/bots` now redirects to
  `developers.openai.com/api/docs/bots`, and
  `support.anthropic.com/en/articles/8896518-...` now redirects to
  `support.claude.com/en/articles/8896518-...`. Neither old URL was cited
  anywhere in this repo, so nothing was replaced; this entry is the first
  record of either.
- **Supporting quotes (verbatim):**
  - OpenAI, GPTBot: *"crawl content that may be used in training our
    generative AI foundation models"*. OAI-SearchBot: *"used to surface
    websites in search results in ChatGPT's search features"*, and *"Sites
    that are opted out of OAI-SearchBot will not be shown in ChatGPT search
    answers."*
  - Anthropic, ClaudeBot: *"collecting web content that could potentially
    contribute to their training"*. Claude-SearchBot: *"analyzes online
    content specifically to enhance the relevance and accuracy of search
    responses"*. Claude-User: *"When individuals ask questions to Claude, it
    may access websites"*.
  - Google, Google-Extended: *"manage whether content Google crawls from
    their sites may be used for training future generations of Gemini
    models"*, and *"Google-Extended does not impact a site's inclusion in
    Google Search nor is it used as a ranking signal in Google Search."*
  - Perplexity, PerplexityBot: *"designed to surface and link websites in
    search results on Perplexity. It is not used to crawl content for AI
    foundation models."* Perplexity-User *"generally ignores robots.txt
    rules"*, so a directive aimed at it is advisory only.
  - Common Crawl, CCBot: an open repository *"universally accessible and
    analyzable by anyone"*.

### What this corrected

The audit initially rated the `GPTBot` block as a CRITICAL AI-retrieval
blocker. **The vendor documentation disproves that.** GPTBot governs training
only, OAI-SearchBot was never blocked, and every AI *search* retriever was
already permitted. The finding was downgraded to MEDIUM and re-characterised:
the pre-existing file was inconsistent about **training** (opting out of
OpenAI and Common Crawl while permitting Anthropic and Gemini training), not
about search. Recorded because the first rating was wrong and the pull is what
caught it.

### Commander's ruling, 12 AUG 2026

Option B, full discovery. Training crawlers are allowed deliberately. The
reasoning of record: these systems will answer a veteran's benefits question
whether or not this site is in their corpus, so the only variable is the
quality of what they learned from. Placing primary-source-verified content in
the corpus is harm reduction consistent with the standing constraint that
wrong transition information causes direct harm.

- **NOT VERIFIED, deliberately:** Applebot and Applebot-Extended. Rung 1
  returned a truncated page and no tier-2 escalation was authorised. Both
  remain unnamed in robots.txt and therefore permitted by the wildcard, which
  is status quo. Open item, not an omission.
- **Service worker is not involved.** `robots.txt` is absent from the `ASSETS`
  precache list, but that alone would not settle it, since the fetch handler
  runtime-caches any GET returning 200. The controlling fact is that crawlers
  do not execute service workers at all. No cache-version bump can gate what a
  crawler reads, so none was made.
- **Affected app module:** `robots.txt`. No change to `index.html`, `sw.js`,
  or `sitemap.xml`.

---

## V-2026-013 — ChatGPT Plus free-year offer for service members, veterans, retirees

- **Claim:** OpenAI offers one free year of ChatGPT Plus to verified U.S. veterans and
  retirees who transitioned from active duty within the past 12 months, and to active
  service members who will transition within the next 12 months; verification is via
  ID.me; personal ChatGPT accounts only; the subscription renews at the standard paid
  rate after the free year unless cancelled.
- **Rating:** CONFIRMED
- **Verified date:** 13 AUG 2026
- **Ladder tiers used:** tier 1 WebFetch returned **HTTP 403** on both URLs. Tier 2
  orchestrator browser read the ToS in full. The offer page itself required **tier 3**.
- **HUMAN-VERIFIED | D. Nemecek | 2026-08-13 | chatgpt.com/veterans-claim | offer open;
  "Offer unavailable" is a state-dependent label, not a closed offer; eligibility
  headline, ID.me wording, mobile-app-store restriction, existing-subscriber
  auto-credit, no end date stated**
- **HUMAN-VERIFIED | D. Nemecek | 2026-08-13 | KnowVA M21-1 Part X, Subpart i, 6.B
  (Article 554400000177950, changed 22 APR 2026) | full section incl. tables** —
  recorded here because it arrived in the same session; it governs
  [[V-2026-011]]-adjacent BDD content, not this offer.
- **Citations of record:**
  - https://chatgpt.com/veterans-claim (tier 3)
  - https://help.openai.com/en/articles/12803158-chatgpt-plus-for-service-members-veterans-retirees-terms-of-service (tier 2)
- **CITATION URL MOVED.** The tasked URL ended `...-chatgpt-plus-for-servicemembers-veterans-terms-of-service`
  and redirects to `...-chatgpt-plus-for-service-members-veterans-retirees-terms-of-service`.
  The destination is the citation of record.
- **Supporting quotes (verbatim, OpenAI Help Center, 13 AUG 2026):**
  - *"This promotion is exclusively for verified U.S. military veterans and retirees who
    transitioned from active-duty service within the past 12 months, and active service
    members who will transition within the next 12 months. Verification through ID.me is
    required. The offer can be redeemed only on an eligible personal ChatGPT account."*
  - *"After the promotional period, your subscription will renew at the standard rate
    unless canceled."*
  - *"expires after 1 year from the date claimed"*; *"There is a limit of one offer per
    eligible subscriber."*
  - *"Accounts that belong to an Enterprise workspace cannot redeem this personal
    subscription offer, even from a personal workspace."*
  - *"If your current Plus subscription was purchased through a mobile app store, the
    offer is unavailable while that subscription is active."*
  - *"Existing web Plus users should not cancel before applying the offer."*

### The renewal term is the reason this card is worded the way it is

The tasking brief framed the offer as expiring per member. The ToS is sharper: it
**converts to paid**. A member who claims during transition is billed at the standard
rate twelve months later, which for someone who separated is roughly the point the pay
gap bites hardest. The description leads with the eligibility window but states the
renewal in its own sentence, and the push notification carries it in the body rather
than ending on good news.

### RECHECK TRIGGER — s2-scanner

The ToS page read **"Updated: 9 hours ago"** at verification time. This offer is being
actively revised. Recheck on any of: (a) the page's Updated stamp advancing; (b) an end
date appearing, since none is published today; (c) any change to the 12-month windows.
Route COMMANDER lane — it is user-facing benefits copy with a money consequence.

- **HELD, not claimed:** `guard_reserve`. The ToS says "active-duty service" throughout
  and is silent on Title 10 mobilisation, so extending it to Guard/Reserve would be
  inference. `spouse` is excluded outright: the offer is "exclusively for" members,
  veterans, and retirees.
- **Affected app module:** RESOURCES employment group, `chatgpt-plus-veterans`;
  WHATS_NEW v95. Arm's-length listing, no `relationship` field.

---

## V-2026-014 — BDD filing-window mechanics (M21-1 Part X, Subpart i, 6.B)

- **Claim:** A BDD claim received with more than 180 days of remaining service is
  **denied**, not held, except where the member has 180 or fewer days remaining by the
  time VA works it. A claim inside 90 days is **excluded** from BDD but not denied, and
  is processed under FDC, the standard process, or another available program. A claim
  with no known discharge date is an incomplete application under 38 CFR 3.159(a)(3)
  and is not accepted. Date of claim is the day following RAD regardless of receipt date.
- **Rating:** CONFIRMED
- **Verified date:** 13 AUG 2026
- **Ladder tier:** 3. Tier 1 WebFetch hit a JavaScript gate; tier 2 orchestrator browser
  rendered the KnowVA shell and topic tree but never the article body across three
  attempts. No CAPTCHA encountered or attempted.
- **HUMAN-VERIFIED | D. Nemecek | 2026-08-13 | KnowVA M21-1, Part X, Subpart i, 6.B
  (Article 554400000177950, changed 22 APR 2026) | full section captured, tables
  included**
- **Citation of record:** M21-1 Part X, Subpart i, 6.B, per the record above. No URL is
  cited because the article body is not machine-readable; see the KnowVA dead-end entry
  in `coverage-charter-landscape.md`.

### This closes two claims that were BLOCKED since 3791b17

Both were carried as BLOCKED rather than UNSUPPORTED, on the rule that an unreachable
source is an ACCESS failure and not an evidence failure. That distinction held: the
claims were unread, not wrong, and the record confirms them.

**It also corrects my own citation.** I recorded these as living in M21-1 **Part VIII**,
Subpart i, Chapter 1, Section A, and pointed tier-2 attempts at that article. They are in
**Part X**, Subpart i, 6.B. Part of why the browser returned a shell with zero `BDD`
occurrences is that it was aimed at the wrong document. The wrong location is preserved in
the commit body of 3791b17 and in this session's SITREPs; it appears in no shipped file.

### The wording changed as a result, and it matters

The app's previous phrasing was *"cannot process before T-180"* — passive, and it reads
like a queue. The record says the claim is **denied**: Non-BDD EP 400, denial via the
On Active Duty selection, a *Non-BDD Claim – Request Resubmission* letter, reason
*"More than 180 days of remaining service."* Denial is an adverse action.

**The aging-in exception ships wherever the denial ships**, per the Commander's ruling of
13 AUG 2026. Publishing the denial alone would tell members something harsher than the
truth, and a member who filed at T-200 and is now at T-170 would wrongly believe their
claim is dead.

### Corroboration of already-shipped content

6.B.2.b — date of claim is the day following RAD regardless of receipt date —
independently confirms the `38 CFR 3.400(b)(2)(i)` correction shipped in 3791b17.
6.B.1.b–c confirms the sub-90 language shipped on `/bdd-timeline/` in 1d3351a **exactly as
written**; that page needed enrichment, not correction.

- **Affected app module:** `/bdd-timeline/` sections "More than 180 days out", "Fewer than
  90 days left", and "Who can use BDD".

---

### Send record — V-2026-013

OneSignal broadcast for the ChatGPT Plus listing was **sent 13 AUG 2026**, on the
Commander's explicit go, after live deploy verification confirmed the listing serving in
production (RESOURCES 47, sw v124). Title: *"Free Year of ChatGPT Plus — Window Open"*.
Body carried the renewal warning rather than ending on the offer. Launch URL
`https://transitionops.org/?tool=resources`.

**Known friction, accepted deliberately:** the app reads only the `tool` URL parameter, and
`subTab` initialises to `vsos`, so the notification lands two taps from the card. No
deeper deep-link exists — there is no category, hash, or search parameter, no DOM `id` on
resource cards, and no `scrollIntoView` anywhere in the app. Ruled acceptable because the
push body carries the material facts on its own.

---

V-2026-015 | 26 AUG 2026 | SkillBridge rank-tier primary-source pass
Method: project-mount source extraction (unzip-to-text), keyword scan
with pre-stated success conditions, full-table reads. Run by S2
(chat session), attested by Dean.
Sources verified: AR 600-81, 25 MAR 2026 (eff 25 APR 2026, supersedes
12 MAR 2024 ed.), Table 5-1 | AFI 36-2671, 31 MAR 2026, Table 1 |
SPFI 36-2672, 31 MAR 2026, Table 1 | MARADMIN 280/24, 17 JUN 2024
(eff 31 AUG 2024) | CI 1040.7 (USCG retains 180-day ceiling).
Findings: rank-tiered durations 60-120 days (USCG excepted at 180);
approval elevated to O-6/GO tiers; Army Cat III = first GO w/ GCMCA,
O-4 and above; AF O-6 ineligible absent ETP. Navy: NO SOURCE — gap
held open, no Navy tiers asserted anywhere in app copy.
Live-file defect confirmed against main prior to patch: blanket
180-day and O-4+ approval language, index.html:2849/2903 plus
residuals :2812/:8761 (Patch E).

---

V-2026-016 | 02 SEP 2026 | VA combined-rating Table I reconciliation
Method: current primary-source direct read, full-table review, and exact code
comparison at clone HEAD 29593bf. Sources accessed 02 SEP 2026.
Rating: CONFIRMED | Source ladder: 1 (binding regulation and official VA)
Sources verified: 38 CFR 4.25, Combined Ratings Table,
https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A/section-4.25
| VA, About Disability Ratings,
https://www.va.gov/disability/about-disability-ratings/
Findings: Arrange disabilities from greatest to least. For each additional
rating, carry the whole-number value produced by Table I into the next
combination. After all ratings are combined, convert the final value once to
the nearest degree divisible by 10; a final value ending in 5 adjusts upward.
The live clone contained two calcVACombined implementations and the active
one carried decimal intermediate values. Vector [60,30,10] must carry
60 -> 72 -> 75, then convert once to 80. Claims that the app produces an
official result, that intermediate decimals are carried, or that a particular
rating is the goal are withheld.

IMPACT: SHIP — ACT | A2 | s2-intel | 02 SEP 2026 | revisit NONE
A1 population: SEPARATING (active component) · GUARD/RESERVE · ALREADY SEPARATED   band: condition-triggered; no single band   excluded: This does not apply to SPOUSE/FAMILY as the rated claimant.   timing: ACT AVAILABLE NOW
A2 act: "Use VA's Combined Ratings Table from highest to lowest and treat any Transition OPS result as unavailable until it matches Table I."
A3 surface(s): VA MATH · /va-math/   token: [VA MATH]   sweep trigger: FIRED calculator capability and worked-example claims
A4 cost: MONEY
EXPIRES: NONE

---

V-2026-017 | 02 SEP 2026 | BDD decision, effective-date, and exam claims
Method: current primary-source direct read and cross-source claim separation
at clone HEAD 29593bf. Sources accessed 02 SEP 2026.
Rating: CONFIRMED | Source ladder: 1 (binding regulation and official VA/DoD)
Sources verified: VA, Pre-discharge claim,
https://www.va.gov/disability/how-to-file-claim/when-to-file/pre-discharge-claim/
| Veterans Benefits Administration, Benefits Delivery at Discharge Program,
https://benefits.va.gov/BENEFITS/benefits-delivery-discharge-program.asp
| VA, VA claim exam,
https://www.va.gov/resources/va-claim-exam/
| 38 CFR 3.400, effective dates,
https://www.ecfr.gov/current/title-38/chapter-I/part-3/subpart-A/subject-group-ECFR429f47d98271c40/section-3.400
| VA, Disability effective dates,
https://www.va.gov/disability/effective-date/
| DoDI 1332.35, Transition Assistance Program for Military Personnel,
https://www.esd.whs.mil/Portals/54/Documents/DD/issuances/dodi/133235p.pdf?ver=2018-11-08-133557-850
Findings: The BDD filing window is 180 to 90 days before separation and VA
says the program may help speed a decision. VBA states a goal of a decision
within 30 days after separation; it is not a guarantee. Eligibility requires
availability for VA exams during the 45 days after filing. VA permits a member
to request rescheduling by contacting the VA medical center or contractor at
least 48 hours in advance and warns that rescheduling may delay the claim.
An effective date as early as the day after separation depends on an awarded
claim and governing effective-date rules; it is not a guaranteed Day-1 rating
or decision. DoDI 1332.35 supports duty-time release for required TAP
workshops and briefings, but does not establish priority for BDD exams or give
a Transition Assistance Office authority to override the chain of command.
Blanket post-discharge processing-time and delayed-compensation projections
are withheld for lack of a current source matching claim type and measurement
period.

IMPACT: SHIP — ACT | A2 | s2-intel | 02 SEP 2026 | revisit NONE
A1 population: SEPARATING (active component) · GUARD/RESERVE on qualifying full-time active duty   band: 6 Months Out · 3 Months Out   excluded: This does not apply to SPOUSE/FAMILY or ALREADY SEPARATED members as BDD claimants.   timing: ACT AVAILABLE NOW
A2 act: "File VA Form 21-526EZ through BDD on VA.gov while 180–90 days remain; with fewer than 90 days, file a standard disability claim instead."
A3 surface(s): CRITICAL WINDOWS · REMINDERS · TIMELINE · Navigator CORPUS/RULES · Lead Comms   token: [CRITICAL WINDOWS], [REMINDERS], [TIMELINE]   sweep trigger: FIRED Day-1, reschedule, priority, and processing-time claims
A4 cost: A CLOSED WINDOW
EXPIRES: NONE

---

V-2026-018 | 02 SEP 2026 | SkillBridge service/paygrade tier reconciliation
Method: current primary-source direct read, full-table review, and exact-copy
sweep at clone HEAD 29593bf. Sources accessed 02 SEP 2026.
Rating: CONFIRMED | Source ladder: 1 (current official service issuances/pages)
Sources verified: AR 600-81, 25 MAR 2026, Table 5-1,
https://home.army.mil/lee/9617/7922/2401/AR-600-81-2026.pdf
| AFI 36-2671, 31 MAR 2026, Table 1,
https://static.e-publishing.af.mil/production/1/af_a1/publication/afi36-2671/afi36-2671.pdf
| SPFI 36-2672, 31 MAR 2026, Table 1,
https://static.e-publishing.af.mil/production/1/hqsf/publication/spfi36-2672/spfi36-2672.pdf
| MARADMIN 280/24, 17 JUN 2024,
https://www.marines.mil/News/Messages/Messages-Display/Article/3809908/interim-guidance-on-the-implementation-of-the-skillbridge-program/
| USCG ALCOAST 202/26,
https://content.govdelivery.com/accounts/USDHSCG/bulletins/41eb992
| MyNavyHR, SkillBridge,
https://www.mynavyhr.navy.mil/Career-Management/Transition/SkillBridge/
Findings: Army, Air Force, Space Force, and Marine Corps standard published
tiers span 60 to 120 days. Coast Guard permits up to 180 days. Current Navy
guidance sets 180 days for E-5 and below, 120 days for E-6 through E-9 and
O-4 and below, and 90 days for O-5 and above; qualifying DIB/CBP/ICE programs
may receive up to 180 days regardless of paygrade. Approval authorities also
vary by service and paygrade. No source supplies a population denominator for
"most members rate 60-120 days" or similar prevalence language, so those
claims are withheld. This record closes and prospectively supersedes only the
Navy-source gap recorded in V-2026-015; the SHIP-A ruling and hardStartDay
-180 planning boundary remain in force.

IMPACT: SHIP — ACT | A2 | s2-intel | 02 SEP 2026 | revisit NONE
A1 population: SEPARATING (active component) · GUARD/RESERVE when service guidance permits   band: 18 Months Out · 12 Months Out · 9 Months Out · 6 Months Out · 3 Months Out   excluded: This does not apply to SPOUSE/FAMILY or ALREADY SEPARATED members.   timing: ACT AVAILABLE NOW
A2 act: "Use the current service instruction or MyNavyHR SkillBridge page applicable to you to confirm your maximum days and approval authority before setting a start date."
A3 surface(s): CRITICAL WINDOWS · REMINDERS · Navigator CORPUS · RESOURCES   token: [CRITICAL WINDOWS], [REMINDERS], [RESOURCES]   sweep trigger: FIRED "most members," "most rank categories," "many grades," and Navy source gap
A4 cost: A CLOSED WINDOW
EXPIRES: NONE
