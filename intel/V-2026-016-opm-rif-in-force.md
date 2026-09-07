# V-2026-016 — OPM RIF and appeal rules: future tense flipped to in force

**Source entry for `intel/verification-log.md`.** Authored 4 SEP 2026 as the record
of the 2 SEP 2026 standing tickler firing (opened 9 AUG 2026 under V-2026-009).

---

## Claim

Four OPM final rules published 3 AUG 2026 took effect 2 SEP 2026. The shipped
POLICY INTEL card read "future law, not current law" with future-tense verbs
throughout, making it wrong by tense as of 0000 2 SEP 2026. A fifth rule, the
MSPB's own jurisdictional withdrawal, took effect the same day and was absent
from the app entirely.

**Rating:** CONFIRMED

## Verification

- **S2, 3 SEP 2026** — Federal Register final rules 2026-15665 (RIF) and
  2026-15666 (RIF Appeals) confirmed effective 2 SEP 2026, notice-date-controls
  transition provision intact. No stay, injunction, or delay found.
- **S2, 3 SEP 2026** — MSPB final rule "Appellate Jurisdiction Update II"
  (RIN 3124-AA33) verified direct from federalregister.gov public-inspection
  document 2026-16456: effective 2 SEP 2026; removes MSPB regulatory
  jurisdiction over probationary-termination, suitability, and RIF appeals;
  MSPB will not apply the rule to pending cases or to actions taken before the
  effective date; Foreign Service RIF jurisdiction (22 U.S.C. 4010a) retained.
- **Orchestrator, 4 SEP 2026** — live-edge verification against production only.
  Did not re-derive the Federal Register or MSPB sources; those remain S2's
  attestation of 3 SEP 2026.

## Citations of record

- "Reduction in Force," Final Rule, FR doc **2026-15665**, 5 CFR 351, published
  2026-08-03, effective 2026-09-02.
- "Reduction in Force Appeals," Final Rule, FR doc **2026-15666**, 5 CFR 351,
  published 2026-08-03, effective 2026-09-02.
- "Probationary and Trial Period Termination Appeals," Final Rule, FR doc
  **2026-15654**, published 2026-08-03, effective 2026-09-02.
- "Suitability Action Appeals," Final Rule, FR doc **2026-15650**, 5 CFR 731,
  published 2026-08-03, effective 2026-09-02.
- MSPB, "Appellate Jurisdiction Update II," Final Rule, **RIN 3124-AA33**,
  public-inspection document **2026-16456**, effective 2026-09-02.

## What shipped

Commit `0d71fc5`, branch `ops/opm-rif-in-force`, merged to `main` 4 SEP 2026.
Six string-literal edits to `index.html` plus the mandatory service-worker
cache bump. No structural change, no new assertion beyond the sources above.

| # | Change |
|---|---|
| 1 | Card header: "RULES CHANGE 2 SEP 2026" to "RULES IN FORCE, 2 SEP 2026" |
| 2 | Lead: "future law, not current law" to "in force now" |
| 3 | "employees will be ranked by" to "employees are ranked by" |
| 4 | "30% or more will receive" to "30% or more receive" |
| 5 | "Appeals will move from the MSPB to OPM: a RIF appeal will be open only to" to present tense, with the RIN 3124-AA33 companion cite and its pending-case carve-out added |
| 6 | "Your retention standing will run on" to "runs on" |
| 7 | `sw.js` CACHE_NAME v129 to v130 |

**Preserved verbatim, and deliberately:** "RIF notices issued before 2 SEP 2026
are processed under the prior rules — the date on your notice decides which
regime governs it." Dean's ruling of 9 AUG 2026 is that the card must never
blend the two effective dates. That sentence is what keeps a member holding an
August notice from reading the new regime onto their own case. It stays
permanently true and was not touched.

## LIVE-EDGE VERIFICATION — PASS

Run 4 SEP 2026 against production after Netlify published `main`.

**The three instrument-of-record checks:**

| Check | Expect | Actual | |
|---|---|---|---|
| `curl -s https://transitionops.org \| grep -c "future law, not current law"` | 0 | **0** | PASS |
| `curl -s https://transitionops.org \| grep -c "IN FORCE, 2 SEP 2026"` | 1 | **1** | PASS |
| `curl -s https://transitionops.org/sw.js \| grep -c "transition-ops-v130"` | 1 | **1** | PASS |

**Full anchor sweep at the live edge** — all six edits, not only the two above.

New anchors, expected 1 each, all returned 1:
`RIF AND APPEAL RULES IN FORCE, 2 SEP 2026` · `in force now. They govern` ·
`In a RIF, employees are ranked by` · `30% or more receive 5 additional points` ·
`Appeals have moved from the MSPB to OPM` · `RIN 3124-AA33` ·
`and a RIF appeal is open only to` ·
`Your retention standing runs on your rating of record`

Retired strings, expected 0 each, all returned 0:
`RIF AND APPEAL RULES CHANGE 2 SEP 2026` · `future law, not current law` ·
`In a RIF, employees will be ranked by` ·
`30% or more will receive 5 additional points` ·
`Appeals will move from the MSPB to OPM` ·
`Your retention standing will run on your rating of record`

Retained member-critical line, expected 1, returned **1**.
Stale cache `transition-ops-v129` at the edge, expected 0, returned **0**.

`origin/main` and local `main` both at `0d71fc5`; `raw.githubusercontent.com/main`
returns the same 0 / 1 / 1. GitHub and the Netlify edge agree — no publish lag,
no partial deploy.

## OPEN — THE TICKLER IS ONLY HALF CLOSED

The 2 SEP 2026 standing tickler ordered two flips: **"Flip (b) and the card to
present tense."** This patch flipped the card. **CORPUS (b) was not touched and
is still future tense in production.**

`netlify/functions/navigator.js`, live (POST-only; GET returns 405):

- **Line 25, RULE 16** — instructs the model that CORPUS (b) rules "take effect
  2 SEP 2026 — answer in the future tense." The rule now orders a wrong answer.
- **Line 190, CORPUS (b)** — "RIF RETENTION PREFERENCE ... **FUTURE LAW,
  effective 2 SEP 2026 — not current law.**" Also carries "will be ranked by"
  and "will receive 5 additional points."

A member who reads the card now gets the correct in-force framing; a member who
asks the Navigator the same question is told it is future law. The two surfaces
disagree, and the Navigator is the one being instructed to be wrong.

The corpus also carries the notice-date sentence in two places. Per the same
9 AUG ruling, that sentence is preserved on any corpus flip, not removed.

**Disposition:** OPEN. COMMANDER lane — shipped policy copy. Requires a separate
branch, its own `policy-verification` pass against this entry, and the
`nav-token-regression` script. No cache bump: `navigator.js` is a Netlify
Function and backs no `ASSETS` entry.

The tickler row at `verification-log.md:598` stays open until (b) ships.
