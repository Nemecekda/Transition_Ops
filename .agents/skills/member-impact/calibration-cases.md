# MEMBER-IMPACT — CALIBRATION CASES AND REGRESSION SET

**Read when learning the skill or patching it. NOT read during a routine
assessment** — that is `SKILL.md`, and its length is protected.

**EXECUTED 6 AUG 2026** against the real entries in `intel/verification-log.md`.
Registry #12 advances on this execution, not on the approval — the
`validation-gate` 1.4 precedent, where three coverage claims died in execution.

---

## RESULTS

| ID | Case | Required | Actual | Axis that produced it |
|---|---|---|---|---|
| MI-1 | V-2026-003 spouse commission EO | DECLINE / INOCULATE | **DECLINE / INOCULATE** | A2 |
| MI-2 | V-2026-004 Dole §403 | DECLINE / GAP | **DECLINE / GAP** | A2 → closure test |
| MI-3 | V-2026-005 Choice rescission | DECLINE / LOG ONLY | **DECLINE / LOG ONLY** | A2 → limb 1 |
| MI-4 | V-2026-006 VET TEC 2.0 | **SHIP — ACT** | **SHIP — ACT** | A2 |
| MI-5 | V-2026-008 OPM RIF | DECLINE / INOCULATE | **DECLINE / INOCULATE** | A2 → closure test |
| MI-6 | V-2026-007 VET TEC correction | SHIP — ACT | **SHIP — ACT** | A2 |
| MI-7 | Constructed: only act is "talk to your VSO" | FAIL A2 | **DECLINE / LOG ONLY** | A2 named non-act |
| MI-8 | Call Center assessed pre-RESOURCES | CONTENT GAP | **CONTENT GAP** | A3c |
| MI-9 | Cross-skill non-interference | no verdicts change | **PASS, with a stated limit** | — |

**9 / 9. Both mandatory declines returned DECLINE with the correct
sub-disposition. The positive control returned SHIP — ACT.**

---

## MI-1 · V-2026-003 · Military Spouse Commission EO

| Axis | Result |
|---|---|
| A1a | SPOUSE/FAMILY |
| A1b | No band — not clock-triggered. Stated, not omitted |
| A1c | *"This does not apply to service members or veterans in their own right."* Writable — **PASS** |
| A1d | The EO publishes an annual report date and a 2-year sunset. **Neither is a date the member's act becomes available.** No qualifying date → DECLINE, not HOLD |
| **A2** | **NOTHING.** Log of record: *"NOTHING is actionable for a spouse today. No application, no funding, no eligibility change, no program stood up."* Attempted sentences land on "be aware of" — a named non-act |
| A3 | POLICY INTEL, both renders · token `[NONE — card body, not a citation]` |
| A3b | No successor signal, no confusable figure. Not fired |
| A4 | **NOTHING** — no act to attribute a cost to |

**DECLINE.** Limb 1 salience **YES** (signed EO on whitehouse.gov). Limb 2 wrong
inference **YES** — *"a spouse could believe a new program exists to apply for."*
Limb 3 closure test: next question *"So is there anything for me?"* → answerable
in the same ship: *"No. This is an advisory body, not a benefit."* **PASSES.**

**→ DECLINE / INOCULATE.** EXPIRES: 2027-08-03 (2-year sunset).

**Calibration signal.** The axes never considered that the subject is spouses,
that the news is good, or that it is presidential. They asked for a sentence and
none existed. **The checklist reproduced the shipped copy from the axes** — the
live card reads *"This is an advisory body, not a benefit,"* which is exactly
what limb 2 demands. That is the strongest evidence the instrument is calibrated.

## MI-2 · V-2026-004 · Dole Act §403

| Axis | Result |
|---|---|
| A1a | ALREADY SEPARATED (homeless veterans per 38 U.S.C. 2002; HUD-VASH participants) |
| A1b | Post-Separation, **no day-offset** — condition-triggered |
| A1c | *"This does not apply to separating members, Guard/Reserve, or spouses in their own right."* **PASS** |
| A1d | Authority runs to 30 SEP 2027 — **governs VA's authority, not a member's act.** Not qualifying |
| **A2** | **NOTHING.** No application, no referral, no enrollment, **no veteran-facing contact.** Source's own words: *"is not a solicitation for public comment or a request for information"* |
| A3 | **NONE** — verified by grep, zero homeless content in `index.html` that day |
| A4 | **NOTHING.** Tempting to record MONEY or SHELTER; **rejected** — A4 requires attribution to an A2 act and A2 is empty |

**DECLINE.** Limb 1 **MARGINAL** (FR notice). Limb 2 **YES, severe** — *"VA now
provides food and shelter."* Limb 3 closure test: *"Where do I go?"* — the app
had **zero** homeless content, no HUD-VASH, no call center. **FAILS. INOCULATE
DENIED.**

**→ DECLINE / GAP.** Asset surfaced: **National Call Center for Homeless
Veterans, 877-424-3838.** Assessed as its own finding — A2: *"Call 877-424-3838,
free and confidential, 24/7, to be connected to your nearest VA."* Named
artifact, executable, no second research step. **SHIP — ACT**, surface RESOURCES.

**RE-RUN, 6 AUG 2026.** 877-424-3838 is now live (`index.html`, confirmed). **A
re-run of V-2026-004 today passes the closure test and would ship as INOCULATE.**
This is the re-runnable property, demonstrated on the case that produced it — the
verdict changed because the app changed, not because the finding did.

## MI-3 · V-2026-005 · Choice Program rescission

A2 **NOTHING** — housekeeping; the program ended 2019. A3 **NONE** — zero
occurrences of "Veterans Choice" / "Choice Program" in `index.html`, re-verified
6 AUG. A4 **NOTHING**.

**DECLINE.** Limb 1 salience **NO** — a rescission notice for a seven-year-dead
program is not something a member encounters. **Fails limb 1 → not INOCULATE.**

**→ DECLINE / LOG ONLY.** **Negative control on INOCULATE, and it holds:** the
sub-disposition discriminates rather than defaulting to the interesting one.

## MI-4 · V-2026-006 · VET TEC 2.0 — POSITIVE CONTROL

| Axis | Result |
|---|---|
| A1a | SEPARATING · ALREADY SEPARATED |
| A1b | 6 Months Out (180-day pre-separation eligibility) and Post-Separation |
| A1c | *"This does not apply to spouses or dependents in their own right."* **PASS** |
| A1d | **ACT AVAILABLE NOW** — VA.gov: *"You can apply online right now,"* 3,332 of 4,000 remaining |
| **A2** | **"Apply on VA Form 22-10297 at VA.gov."** Named artifact, executable, no second step |
| A3 | POLICY INTEL both renders · WHATS_NEW · reminder `r-6-vettec` · ACTION card |
| A4 | **MONEY** and **A CLOSED WINDOW** — tuition/housing/books, against a 4,000-seat FY cap that exhausts |

**→ SHIP — ACT.** EXPIRES: end of FY (cap resets; the 3,332 figure decays daily).

**If this had declined, the instrument would be broken.** It did not.

## MI-5 · V-2026-008 · OPM RIF — DECLINE THAT SHIPS

A2 fails: no sentence in either final rule names an act a member takes.
Constructing *"verify your veterans' preference is documented before 2 SEP 2026"*
would be reasoning by analogy — **prohibited**. A3b **FIRES** on the
confusable-adjacent signal: two preference point systems, both containing a "5".
Closure test **PASSES** — *"which system applies to me?"* is answerable in the
same ship via Navigator RULES 15.

**→ DECLINE / INOCULATE**, three surfaces: both POLICY INTEL renders, the
Navigator corpus with its SCOPE LIMIT, and the Military Technician entry.
**Exactly what shipped.** EXPIRES: NONE (permanent rule change).

**A skill whose DECLINE meant "does not ship" would have gotten this backwards.**

## MI-6 · V-2026-007 · VET TEC correction

A2: **"Check whether your VET TEC training will charge GI Bill or DEA entitlement
1:1 before you enroll."** A4: **MONEY** and **A LOST ELECTION** — entitlement
months spent on a false premise are not recoverable. A3b **FIRED** (successor:
"replaced the original"). **→ SHIP — ACT.**

**Correction class behaves correctly** without a separate verdict for it.

## MI-7 · Constructed — the grammatical-imperative trap

Finding whose only act is *"Talk to your VSO about your options."* Grammatically
imperative; **named non-act** in A2's list. A2 **NOTHING**. Limb 1 salience NO.
**→ DECLINE / LOG ONLY.**

**Tests literal application over grammatical shape.** Labelled CONSTRUCTED — not
historical.

## MI-8 · Call Center asset assessed BEFORE RESOURCES carried it

A2 yields an act. A3 **NONE** — nothing carried it. **→ CONTENT GAP**, not
DECLINE. **A3c discriminates**: a member must do something and no surface tells
them, which is a build order, not a rejection.

## MI-9 · Cross-skill non-interference

| Against | Result |
|---|---|
| `policy-verification` #3 | **PASS, specification-level only.** No rating changes; A1d/A2 cannot manufacture CONFIRMED. **STATED LIMIT: #3's P1–P6 were specified, NOT executed**, so this is a spec check, not evidence. |
| `validation-gate` #1 | **PASS on real evidence** — R0–R11 executed 5 AUG (§8.14). #12 adds no gate step and no CACHE_NAME rule. |
| `deploy-discipline` #2 | **PASS.** No cache or branch semantics touched. |
| `brand-voice` #4 | **PASS.** A2 constrains content; #4 constrains voice. A2 binds copy *upward* — copy may compress, never exceed. |
| `push-worthy` #11 | **PASS.** Only G3 imported. #12 runs pre-ship, #11 requires G2 (already serving). **#12 does not amend #11.** |

---

## WHAT THE SET DOES NOT COVER — stated, not smoothed

**This set was executed against findings, and every defect of 5–6 AUG 2026 was
something else.** None of the following would have been caught by any case here:
the 988 collision, the `[VA HOME LOAN]` dead token, the unbundled
`@netlify/blobs`, the direct commit to `main`, the privacy statement describing
collection that was not happening, or a "PROVEN" row that was false.

**All were implementation, infrastructure, process, or self-descriptive copy.**
`member-impact` governs incoming findings about the world. **That is not a
weakness in the instrument; it is the boundary of its subject** — and the gap it
reveals is a separate skill, not an extension of this one.
