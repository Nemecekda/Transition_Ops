# STATE TAX DATA MODEL — REPLACEMENT DESIGN

Design only. No app code changes in this ship.

Replaces `STATE_TAX_DATA` (index.html:2524-2529) and rewrites the derivation
behind `getStateTaxStatus` (index.html:4972-4995).

The defect being designed out: the current model stores bucket membership and
nothing else. Every real fact about a state — the amount, the age condition,
the AGI cap, the expiration — lives in prose. California's rule is stated in
narrative at index.html:12512 and again at 12516, and stated nowhere the code
can read. The consequence is dated: on 1 JAN 2030 the CA exclusion lapses, the
app keeps rendering "PARTIAL TAX ON RETIRED PAY / Conditions apply," and no
part of the system knows anything changed. Silent expiry is the failure mode.

---

## 1. TOP-LEVEL STRUCTURE

Two constants replace one.

```js
const STATE_TAX_SCHEMA_VERSION = 2;

const STATE_TAX_RULES = {
  AK: { /* jurisdiction record */ },
  AL: { /* ... */ },
  // ... 51 records, keyed by USPS code, ASCII-ascending, DC filed under "DC"
};
```

`DATA_VERIFIED` (index.html:2562) stays for the policy-intel cards. It stops
being the authority for state tax. Per-record `verification.accessed` is the
authority there, and the UI shows the record's own date, not the global one.

### 1.1 Jurisdiction record

Canonical field order. Every field present in every record. `null` means
not-applicable; a field is never omitted, so a diff shows a value change and
never a shape change.

```js
CA: {
  code: "CA",
  name: "California",
  incomeTax: true,          // does the jurisdiction levy a personal income tax
  fallback: "FULL",         // treatment when no provision is active — see 2.2
  provisions: [ /* ordered, see 1.2 */ ],
  watch: [ /* ordered, see 1.4 */ ],
  verification: { /* see 1.3 */ },
  notes: null               // human prose. NEVER parsed. NEVER load-bearing.
}
```

- `incomeTax: false` implies `provisions: []` and `fallback: "NO_INCOME_TAX"`.
  That is the only legal shape for a no-income-tax jurisdiction, and it is
  assertable in a lint.
- `fallback` is the statutory baseline that applies when no special provision
  is in force. For every income-tax state with a conditional exclusion, that
  baseline is `"FULL"`. This is the field that makes safe degradation work.
- `notes` exists so analysts stop smuggling structure into free text. Anything
  a consumer needs is a field. If a fact only exists in `notes`, the model does
  not know it — treat that as a defect, not documentation.

### 1.2 Provision record

A provision is one rule. Age bands are separate provisions, not a nested
structure — one fact per field, and a band change is then a one-line diff.

```js
{
  id: "CA-2025-RETPAY-EXCL",   // stable, never reused, never renumbered
  kind: "FLAT_EXCLUSION",      // see enum below
  amount: 20000,               // integer USD/yr. null unless kind FLAT_EXCLUSION
  percent: null,               // integer 0-100. null unless PERCENT_EXCLUSION
  percentCap: null,            // integer USD/yr ceiling on a percent exclusion
  perTaxpayer: null,           // true = each spouse claims separately. PLACEHOLDER for CA
  minAge: null,                // inclusive, age attained during the tax year
  maxAge: null,                // inclusive
  agiCap: {                    // null when the provision has no income test
    basis: "FEDERAL_AGI",      // FEDERAL_AGI | STATE_AGI | GROSS
    behavior: "CLIFF",         // CLIFF (denied above) | PHASEOUT (reduced above)
    single: 125000,
    marriedJoint: 250000,
    marriedSeparate: null,     // PLACEHOLDER
    headOfHousehold: null      // PLACEHOLDER
  },
  effectiveTaxYear: 2025,      // first tax year the provision applies
  sunsetTaxYear: 2029,         // LAST tax year it applies. null = no sunset
  authority: "CA Rev. & Tax. Code §17140.6",   // PLACEHOLDER — cite, do not paraphrase
  note: null
}
```

`kind` enum, exhaustive:

| kind | meaning | required fields |
|---|---|---|
| `FULL_EXEMPT` | all military retired pay excluded | none |
| `FLAT_EXCLUSION` | fixed dollar amount excluded | `amount` |
| `PERCENT_EXCLUSION` | share of retired pay excluded | `percent`, optional `percentCap` |
| `UNSPECIFIED_PARTIAL` | migration marker: partial tax, terms unknown | none |

`UNSPECIFIED_PARTIAL` is not a rule. It is the literal encoding of what the old
`someTax` bucket knew, and its presence in a record is an open work order for
the sweep. The sweep deletes it when it lands a real provision. Count of
`UNSPECIFIED_PARTIAL` provisions across the file is the migration's burndown
metric.

Provisions are ordered by `effectiveTaxYear` ascending, then `id` ascending.

Tax rules are year-scoped, so effectivity is stored as integer tax years, not
dates. `2025-2029` becomes two integers and the lapse is arithmetic. Mid-year
effective dates are not representable — see OPEN QUESTIONS.

### 1.3 Verification record — per jurisdiction, mandatory

Vocabulary is `policy-verification` v1.1's, unchanged: CONFIRMED / PROBABLE /
BLOCKED / UNVERIFIED. No parallel vocabulary.

```js
verification: {
  rating: "BLOCKED",              // CONFIRMED | PROBABLE | BLOCKED | UNVERIFIED
  source: "https://www.ftb.ca.gov/...",   // citation of record. null if none
  accessed: null,                 // ISO YYYY-MM-DD. null unless the source was READ
  verifier: null,                 // "D. Nemecek" for tier-3, else agent id
  ladderTier: 2,                  // highest escalation tier attempted, 1-3
  wall: {                         // non-null ONLY when rating is BLOCKED
    host: "ftb.ca.gov",
    status: "403",
    observed: "2026-08-02"
  },
  humanRecord: null,              // verbatim HUMAN-VERIFIED line, tier 3 only
  provenance: "migrated from STATE_TAX_DATA.someTax, 2026-08-01 bulk pass"
}
```

- `wall` makes BLOCKED first-class. `ftb.ca.gov` is already on the skill's
  observed-wall list, so CA is the likely first BLOCKED record in production.
- `humanRecord`, when set, carries the mandatory line verbatim:
  `HUMAN-VERIFIED | verifier | date | URL or document ID | what was read`.
  It is stored as one string on purpose — it is a citation artifact, not
  structured data the app parses.
- `provenance` is lineage, not a rating. It exists so the migration can be
  honest about where a record came from without laundering it into a rating it
  did not earn.
- `accessed: null` with `rating: "CONFIRMED"` is invalid. Lint it.

### 1.4 Watch record

Directly serves the live item: CA SB 1407 and AB 53 both move the $20,000
figure. When one passes, the edit is one integer and the diff names the state.

```js
watch: [
  { id: "CA SB 1407", affects: "CA-2025-RETPAY-EXCL.amount", lastChecked: "2026-08-02", status: "COMMITTEE" },
  { id: "CA AB 53",   affects: "CA-2025-RETPAY-EXCL.amount", lastChecked: "2026-08-02", status: "COMMITTEE" }
]
```

`affects` is a dotted path into this model. A scanner can therefore enumerate
exactly which fields have live legislative risk without reading prose.

---

## 2. EVALUATION AND SAFE DEGRADATION

### 2.1 What "conservative" means here

The harm is asymmetric and the direction is not a judgment call. A user reads
this card while deciding where to live in retirement. Over-promising a tax
break that has lapsed sends someone to a state on money that does not exist,
and they find out at filing. Under-promising sends them to verify with the
state — annoying, recoverable, no financial loss.

**Conservative therefore means: err toward MORE tax, never less. Never show a
break the model cannot currently substantiate.**

Applied:
- Lapsed provision → the record's `fallback`, which is `FULL` for every state
  with a conditional exclusion. Not the stale rule.
- Unverified or blocked record → `UNKNOWN`. Not the last known good answer.
- Unknown jurisdiction code → `null`, unchanged. Reserved exclusively for
  "not a valid code," because index.html:12235 already branches on it.

### 2.2 Resolution order

`resolveStateTax(code, taxYear = currentTaxYear())` returns:

```js
{
  treatment: "FULL",         // NO_INCOME_TAX | EXEMPT | PARTIAL | FULL | UNKNOWN
  reason: "LAPSED",          // ACTIVE | LAPSED | NOT_YET_EFFECTIVE | BASELINE
                             //   | UNVERIFIED | BLOCKED | NO_INCOME_TAX
  activeProvisions: [],
  lapsedProvisions: [ /* provisions whose sunsetTaxYear < taxYear */ ],
  warnings: [ "The California exclusion applied through tax year 2029 and has expired. Verify current CA law before relying on this." ],
  verification: { /* the record's verification block, passed through */ },
  taxYear: 2030
}
```

Order, first match wins. This order is load-bearing:

1. Code not in `STATE_TAX_RULES` → return `null`.
2. `verification.rating` is `BLOCKED` or `UNVERIFIED` → `treatment: "UNKNOWN"`,
   `reason` mirrors the rating. **Do not evaluate provisions.** An unverified
   record's contents are not evidence.
3. `incomeTax === false` → `NO_INCOME_TAX`, `reason: "NO_INCOME_TAX"`.
4. Any provision with `effectiveTaxYear <= taxYear <= (sunsetTaxYear ?? ∞)` →
   active. `FULL_EXEMPT` with no conditions → `EXEMPT`. Anything else →
   `PARTIAL`.
5. No active provision, but at least one provision has
   `sunsetTaxYear < taxYear` → `treatment = fallback`, `reason: "LAPSED"`, and
   a warning naming the sunset year. This is the CA-2030 path.
6. No active provision, none lapsed → `treatment = fallback`,
   `reason: "BASELINE"`.

Age and AGI conditions are **not** evaluated against user input. The app does
not know the user's age or AGI and must not guess. A conditioned provision
resolves to `PARTIAL` and the conditions are rendered as stated terms. The
model carries them so they can be displayed and diffed, not so the app can
compute anyone's tax.

### 2.3 LAPSED vs UNVERIFIED — distinguishable, deliberately

These are different failures and must never render the same.

| | LAPSED | UNVERIFIED / BLOCKED |
|---|---|---|
| Meaning | We know the rule and we know it ended | We do not have a source we read |
| `treatment` | the record's `fallback` (`FULL`) | `UNKNOWN` |
| `reason` | `LAPSED` | `LAPSED` never; `UNVERIFIED` / `BLOCKED` |
| Status line | `FULL TAX ON RETIRED PAY` | `TAX TREATMENT UNVERIFIED` |
| Color | `#8B0000` | `C.inactive` |
| Detail | states the expiration year, then the baseline | states that we could not verify, and names the agency to call |
| Ships? | Yes — it is the correct conservative answer | Yes as a null-result panel; it makes no tax claim |

No new hex is introduced. `C.inactive` is the existing grey token.

### 2.4 Why runtime evaluation, not build-time

This is a PWA with an aggressive service-worker cache. A user running a bundle
cached in 2029 must still get the right answer in 2030. Because resolution
compares `sunsetTaxYear` against the clock at render, the lapse fires in a
stale cache with no deploy. A build-time bucket cannot do that, which is
precisely how the current model fails.

---

## 3. DIFFABILITY CONTRACT

What makes a diff mechanically meaningful, so the fifty-state sweep can assert
"NM changed" without a human reading it:

1. **Stable key order.** Jurisdictions ASCII-ascending by code. Fields in the
   canonical order declared in 1.1/1.2/1.3. Never reflow, never re-sort.
2. **Full schema always.** Every field present in every record, `null` when
   inapplicable. Additions and deletions of keys become schema events, not
   routine noise.
3. **One fact per field.** No `"$20,000 for taxpayers under age 55"` strings.
   Amount, age, and condition are three fields.
4. **Canonical scalars.** Money = integer USD, no symbols, no separators.
   Percent = integer 0-100. Years = integer. Dates = ISO `YYYY-MM-DD`.
   Booleans = `true`/`false`/`null`, never `"yes"`.
5. **No free-text carrying structure.** `notes` and `note` are non-authoritative
   by definition and excluded from drift comparison.
6. **Stable provision ids.** `CA-2025-RETPAY-EXCL` never gets reused for a
   different rule. A sweep diff reads
   `CA / CA-2025-RETPAY-EXCL / amount: 20000 -> 25000`.
7. **Sentinel-delimited block.** The data sits between
   `// ===== STATE_TAX_RULES BEGIN =====` and `// ===== STATE_TAX_RULES END =====`
   so s2-scanner can extract it from index.html without a parser.
8. **One record per contiguous line range**, formatted so a single-state change
   touches only that state's lines. Enforce with a formatter check in
   `validation-gate`, not by convention.

Drift comparison ignores `verification.accessed`, `verification.verifier`, and
`watch[].lastChecked` — otherwise every sweep reports 51 changes. Everything
else is signal.

---

## 4. WORKED EXAMPLES

### (a) CALIFORNIA — sunset + AGI cap + flat amount

Figures below are transcribed from the app's existing prose at index.html:12512
($20,000; federal AGI caps $125,000 single / $250,000 joint; tax years
2025-2029). **They are not verified.** No primary citation of record exists for
them anywhere in this repo. They are carried into the model at their current
rating, which is UNVERIFIED, and the sweep must confirm or correct them.

```js
CA: {
  code: "CA",
  name: "California",
  incomeTax: true,
  fallback: "FULL",
  provisions: [
    {
      id: "CA-2025-RETPAY-EXCL",
      kind: "FLAT_EXCLUSION",
      amount: 20000,
      percent: null,
      percentCap: null,
      perTaxpayer: null,              // PLACEHOLDER — does each spouse claim it?
      minAge: null,
      maxAge: null,
      agiCap: {
        basis: "FEDERAL_AGI",
        behavior: "CLIFF",            // PLACEHOLDER — cliff or phaseout?
        single: 125000,
        marriedJoint: 250000,
        marriedSeparate: null,        // PLACEHOLDER
        headOfHousehold: null         // PLACEHOLDER
      },
      effectiveTaxYear: 2025,
      sunsetTaxYear: 2029,
      authority: null,                // PLACEHOLDER — statute cite required
      note: null
    }
  ],
  watch: [
    { id: "CA SB 1407", affects: "CA-2025-RETPAY-EXCL.amount", lastChecked: "2026-08-02", status: "COMMITTEE" },
    { id: "CA AB 53",   affects: "CA-2025-RETPAY-EXCL.amount", lastChecked: "2026-08-02", status: "COMMITTEE" }
  ],
  verification: {
    rating: "BLOCKED",
    source: null,
    accessed: null,
    verifier: null,
    ladderTier: 1,
    wall: { host: "ftb.ca.gov", status: "403", observed: null },
    humanRecord: null,
    provenance: "figures transcribed from index.html:12512 prose, 2026-08-02; never independently sourced"
  },
  notes: null
}
```

Three evaluations of this one record:

| Call | Result |
|---|---|
| `resolveStateTax("CA", 2026)` as written above | `UNKNOWN` / `BLOCKED`. Rule 2 fires before provisions are read. The card shows the unverified panel. |
| `resolveStateTax("CA", 2026)` once rating is CONFIRMED | `PARTIAL` / `ACTIVE`. Detail states: excludes up to $20,000/yr, denied above $125,000 AGI single / $250,000 joint, expires after tax year 2029. |
| `resolveStateTax("CA", 2030)` once rating is CONFIRMED | `FULL` / `LAPSED`, warning: exclusion applied through tax year 2029 and has expired. **Fires with no deploy and no human in the loop.** |

The third row is the entire point of this design.

### (b) MARYLAND — flat exemption, age-banded, no sunset

Chosen from the current `someTax` bucket. MD exercises a fixed dollar
subtraction plus an age condition without a sunset, which is the second-most
common shape in the country and the one the old model erased most completely.

**Every figure below is PLACEHOLDER.** MD's subtraction amounts and the age
threshold are not verified in this repo and are not stated from memory here.

```js
MD: {
  code: "MD",
  name: "Maryland",
  incomeTax: true,
  fallback: "FULL",
  provisions: [
    {
      id: "MD-RETPAY-EXCL-UNDER",
      kind: "FLAT_EXCLUSION",
      amount: null,            // PLACEHOLDER — subtraction below the age threshold
      percent: null, percentCap: null,
      perTaxpayer: null,       // PLACEHOLDER
      minAge: null,
      maxAge: null,            // PLACEHOLDER — upper bound of the lower band
      agiCap: null,            // PLACEHOLDER — confirm MD applies no income test
      effectiveTaxYear: null,  // PLACEHOLDER
      sunsetTaxYear: null,     // no sunset expected — confirm
      authority: null,         // PLACEHOLDER — Md. Code Tax-Gen. cite
      note: null
    },
    {
      id: "MD-RETPAY-EXCL-OVER",
      kind: "FLAT_EXCLUSION",
      amount: null,            // PLACEHOLDER — subtraction at/above the age threshold
      percent: null, percentCap: null,
      perTaxpayer: null,       // PLACEHOLDER
      minAge: null,            // PLACEHOLDER — age threshold
      maxAge: null,
      agiCap: null,            // PLACEHOLDER
      effectiveTaxYear: null,  // PLACEHOLDER
      sunsetTaxYear: null,
      authority: null,         // PLACEHOLDER
      note: null
    }
  ],
  watch: [],
  verification: {
    rating: "UNVERIFIED",
    source: null, accessed: null, verifier: null, ladderTier: 0,
    wall: null, humanRecord: null,
    provenance: "migrated from STATE_TAX_DATA.someTax, 2026-08-01 bulk pass; no per-state citation recorded"
  },
  notes: null
}
```

Note the two-provision shape. When MD raises one band's amount, the sweep diff
is one integer on one line and names the band.

### (c) TEXAS — no income tax

```js
TX: {
  code: "TX",
  name: "Texas",
  incomeTax: false,
  fallback: "NO_INCOME_TAX",
  provisions: [],
  watch: [],
  verification: {
    rating: "UNVERIFIED",
    source: null,            // sweep records the TX Comptroller .gov page URL
    accessed: null,          // sweep records the access date
    verifier: null,
    ladderTier: 0,
    wall: null,
    humanRecord: null,
    provenance: "migrated from STATE_TAX_DATA.noIncomeTax, 2026-08-01 bulk pass"
  },
  notes: null
}
```

After the sweep the same record reads `rating: "CONFIRMED"`, `source` = the
Comptroller page, `accessed` = the sweep date, `ladderTier: 1`. No provisions
are ever added; `incomeTax: false` is the whole rule. These nine records are
the cheapest half-day of the sweep and should be done first to prove the
pipeline.

---

## 5. MIGRATION FROM THE FOUR-BUCKET MODEL

### 5.1 Mapping

| Old bucket | Count | New shape | Mechanically safe? |
|---|---|---|---|
| `noIncomeTax` | 9 | `incomeTax:false`, `provisions:[]`, `fallback:"NO_INCOME_TAX"` | Yes. Self-describing and binary. |
| `noTaxRetiredPay` | 29 | `incomeTax:true`, one `FULL_EXEMPT` provision, no conditions, `fallback:"FULL"` | **No. Highest risk in the file.** |
| `someTax` | 13 | `incomeTax:true`, one `UNSPECIFIED_PARTIAL` provision, `fallback:"FULL"` | Yes, but carries no information. |
| `fullTax` | 0 | does not survive as a bucket | n/a |

### 5.2 What the migration cannot know

The 29 `noTaxRetiredPay` records are the dangerous ones. The old bucket had no
way to express a condition, so any age floor, AGI ceiling, or sunset attached
to those exemptions was **flattened out of existence at data-entry time**. The
migration reproduces the flattening exactly — it writes an unconditional
`FULL_EXEMPT` — and that record now asserts, in structured form, that no
condition exists. That is a stronger claim than the old bucket made, and it may
be false in several states.

Mitigation: every migrated record ships `rating: "UNVERIFIED"`, which under
resolution rule 2 short-circuits to `UNKNOWN` before any provision is read.
The false claim is inert until a human verifies it. Sweep priority order is
therefore: the 29 first, the 13 second, the 9 last.

Migration also cannot manufacture citations. There are none. `DATA_VERIFIED`
is a single global string, the 1 AUG 2026 re-verification produced 10
corrections but no per-state URLs, and no per-jurisdiction source exists
anywhere in the repo. The migration seeds `source: null`, `accessed: null`,
`rating: "UNVERIFIED"`, and a `provenance` string naming the bulk pass. It does
not seed CONFIRMED, PROBABLE, or a date pretending to be an access date. A
seeded citation is a fabricated citation.

### 5.3 `fullTax` — the bucket dies, the value lives

`fullTax` is an empty enum member. As a bucket it is deleted. As a **value** it
becomes `fallback: "FULL"` on 42 of 51 records and `treatment: "FULL"` on the
lapse path — which is exactly the destination the old model could never reach.
The empty array was not dead weight; it was the state CA is scheduled to enter
in 2030 with no mechanism to get there.

### 5.4 `getStateTaxStatus`

The four hard-coded returns become a derived view. The status strings and the
first three colors are preserved verbatim so this migration does not smuggle a
copy change into a data change:

| treatment | status | color | source of `detail` |
|---|---|---|---|
| `NO_INCOME_TAX` | `NO STATE INCOME TAX` | `C.greenBright` | existing constant, unchanged |
| `EXEMPT` | `NO TAX ON RETIRED PAY` | `#6B8E23` | existing constant, unchanged |
| `PARTIAL` | `PARTIAL TAX ON RETIRED PAY` | `C.goldBright` | **composed from the record** |
| `FULL` | `FULL TAX ON RETIRED PAY` | `#8B0000` | existing constant + lapse warning if `reason: "LAPSED"` |
| `UNKNOWN` | `TAX TREATMENT UNVERIFIED` | `C.inactive` | new string, makes no tax claim |

`detail` ceasing to be a generic constant for `PARTIAL` is the user-facing
payload of this whole design — and it is a content change, COMMANDER lane,
pao-content drafts, Dean approves. It does not ride along on the data ship.

Recommended sequencing, three ships:
1. Land `STATE_TAX_RULES` alongside `STATE_TAX_DATA`, unused. Zero user impact.
2. Repoint `getStateTaxStatus` at the derived view with `detail` still constant.
   Behavior-identical for all 51 except the UNKNOWN path. Delete `STATE_TAX_DATA`.
3. Composed per-state `detail`, after the sweep, after pao-content, after Dean.

The prose at index.html:12512 and 12516 is the same rule stated a third and
fourth time. It stays out of scope for ship 1 but must be reconciled — a rule
in three places drifts in three directions.

---

## 6. CONSUMER COMPATIBILITY

**Preserve `{status, color, detail}` and preserve `null`. Additive only.**

`getStateTaxStatus(st)` keeps its signature and its return shape, gaining an
optional second argument `taxYear`. It returns the same three keys plus
`treatment`, `reason`, `verification`, and `warnings`. The render sites at
index.html:12240-12258 read three keys and ignore the rest; they need no edit
in ship 1 or 2.

`null` stays reserved for an unrecognized code, because index.html:12235
branches on falsiness to show "Not a recognized state code." An UNKNOWN
treatment must return an object, never `null`, or an unverified state renders
as a typo.

Justification for not changing the contract: the data migration and the UI
change have different blast radii and different approval lanes. Coupling them
means the model cannot be validated in production until copy is approved.
Keeping the legacy shape as a derived view lets ships 1 and 2 be provably
behavior-identical — a diff of `getStateTaxStatus` output across all 51 codes
before and after must be empty except for records the sweep has touched. That
is a mechanical regression test, and it only exists if the shape holds.

Consequence to accept: warnings must be prepended into `detail` for the legacy
consumer, since it renders no other field. A lapsed CA in 2030 shows the
expiration sentence inside `detail` until ship 3 gives warnings their own row.

---

## 7. OPEN VERIFICATION ITEMS — s2-intel

Every PLACEHOLDER in this document, itemized:

| # | Item | Jurisdiction |
|---|---|---|
| 1 | Statutory citation of record for the $20,000 exclusion | CA |
| 2 | Confirm the $20,000 amount against the statute | CA |
| 3 | Confirm AGI caps $125,000 single / $250,000 joint | CA |
| 4 | AGI cap behavior — hard cliff or phaseout | CA |
| 5 | AGI thresholds for married-separate and head-of-household | CA |
| 6 | Whether the exclusion is per taxpayer or per return | CA |
| 7 | Confirm tax years 2025-2029 and the exact lapse mechanism | CA |
| 8 | Status of SB 1407 and AB 53 after the 3 and 5 AUG 2026 hearings | CA |
| 9 | Subtraction amount, lower age band | MD |
| 10 | Subtraction amount, upper age band | MD |
| 11 | Age threshold separating the bands | MD |
| 12 | Whether MD applies any AGI test | MD |
| 13 | First effective tax year of the current MD subtraction | MD |
| 14 | Per taxpayer or per return | MD |
| 15 | Statutory citation of record | MD |
| 16 | Comptroller page URL confirming no personal income tax | TX |
| 17 | Whether any of the 29 `noTaxRetiredPay` exemptions carry age, AGI, or sunset conditions the old bucket erased | 29 states |
| 18 | Actual terms for all 13 `someTax` states, replacing `UNSPECIFIED_PARTIAL` | 13 states |

CA sourcing runs the escalation ladder from tier 1. `ftb.ca.gov` is a known
wall; expect tier 2, plan for tier 3.

---

## 8. OPEN QUESTIONS — COMMANDER

1. **Cutover policy.** Under resolution rule 2 an UNVERIFIED record renders
   UNKNOWN. Migrating all 51 at once therefore blanks the tax feature for every
   state until the sweep completes. Three options: (a) no cutover until all 51
   are CONFIRMED; (b) per-state cutover, old buckets serve the rest; (c) cut
   over immediately and accept a mostly-UNKNOWN card. Recommend (b). Your call —
   it determines how long the feature is degraded and it is user-facing.
2. **UNKNOWN presentation.** Suppress the card entirely for an unverified state,
   or show a grey panel that names the state revenue agency and makes no claim?
   Recommend the panel. User-facing, so yours.
3. **Per-state `detail` copy.** Composing detail from the record means up to 51
   distinct user-facing paragraphs through pao-content. Approve the scope, or
   cap it at CA plus the states with conditioned exclusions and leave the rest
   on the constants?
4. **Filing status.** AGI caps differ single vs joint. Do we ask the user, or
   always display the single (lower, conservative) threshold with the joint
   figure noted? Recommend display-both, ask-nothing — the app should not
   collect income data.
5. **The 29 on discovery.** When the sweep finds an erased condition in a state
   we currently advertise as fully exempt, does that state degrade to PARTIAL
   the same day, or batch into a weekly correction ship? Same-day is correct and
   churny.
6. **Re-verification interval.** 365 days globally, or 180 for records with a
   non-empty `watch` array? Drives the recurring sweep's cost.
7. **Mid-year effectivity.** Integer tax years cannot express a rule effective 1
   JUL. Adding ISO date fields to every provision is ~100 more fields to verify.
   Accept the year-granularity limit until a state actually needs it?
8. **File location.** Inline in index.html, or a separate `/data/state-tax.js`?
   Separate is far better for per-state diffs and sweep tooling, but it adds a
   fetched asset and a service-worker cache entry — deploy pipeline, your lane.
9. **Rates.** Confirm the model never stores tax rates and the app never
   computes tax owed. Recommend hard no. Rates make this a tax calculator and
   the liability posture changes.
