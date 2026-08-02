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

### O-2026-001 — H.R. 980 description (flight training / monthly outreach)

- **App text:** "H.R. 980 (VR&E Improvement): expanded flight training under
  VR&E, more counselor access, monthly VA outreach."
- **Rating:** PROBABLE — partially unsupported.
- **What checks out:** The bill is real, the stage is right, and "more counselor
  access" matches. The CRS summary of the introduced version removes the
  requirement that on-campus VA educational and vocational counseling be
  delivered by VA counselors.
- **What does not:** The introduced-version summary says nothing about flight
  training or monthly VA outreach. The bill passed **as amended** and its title
  changed from "Modernizing the Veterans On-Campus Experience Act of 2025" to
  "Veterans Readiness and Employment Improvement Act of 2025," so those
  provisions may have been added in committee — but that is unconfirmed.
- **Required to close:** Read the engrossed text (BILLS-119hr980eh) or
  H. Rept. 119-228 and confirm or strike the two unsupported clauses.
- **Owner:** s2-intel. **Not yet tasked.**
