---
name: member-impact
description: Usefulness standard for every CONFIRMED benefits or policy finding. Runs after a policy-verification rating of CONFIRMED and before any copy is drafted. Assesses WHO acts and when, WHAT they do differently, WHERE it lands, and WHAT not knowing costs. Produces SHIP or a first-class DECLINE. Load before proposing any card, note, reminder, WHATS_NEW entry, or Navigator corpus change. Owner - s2-intel.
---
# MEMBER IMPACT — USEFULNESS STANDARD

Every other skill governs whether content is TRUE, LANDED, SAFE, or IN VOICE.
This one governs whether a transitioning member is better off for reading it.

Doctrine: **a finding can be real, verified, important, and worth nothing to our
audience. That verdict is DECLINE, and it is a correct outcome, not a failure.**
A checklist that approves everything true is not a checklist.

**SCOPE, so this is not asked later.** This skill governs INCOMING FINDINGS
ABOUT THE WORLD. It does NOT govern outgoing claims about our own system —
privacy statements, capability descriptions, the TOOL MANIFEST. That is a
different subject with a different test and it lives elsewhere. A skill with two
subjects serves neither.

## WHEN THIS RUNS
After a `policy-verification` rating of **CONFIRMED** with an entry ID in
`intel/verification-log.md`. Before any copy is drafted.

PROBABLE, BLOCKED, and UNVERIFIED findings are **not assessed here**. Assessing
the usefulness of an unverified claim requires assuming it is true — and **a
false claim is easier to make actionable than a true one.** A2 demands an
imperative sentence naming a form; given an unverified claim you will write a
compelling, specific one off a premise nothing constrains. That is the H.R. 980
failure: the false version was more actionable than the true one. **Truth first,
then usefulness, or the instrument selects for fiction.**

**RUNG-1 TRIAGE, permitted and fenced.** An analyst may decline to escalate past
ladder rung 1 when *the source's own text states there is nothing to do* (e.g.
"is not a solicitation for public comment or a request for information"). That is
reading the source, not assuming the claim. One line, not an assessment, and it
may not cite A1–A4.

## APPLICATION RULE
Each axis is applied **literally or not at all**. No agent may reason a finding
into an axis by analogy, and none may reason one out. Mirrors §F2.

---

## A1 — WHO, AND WHEN IT BITES

**A1a POPULATION.** Every one that applies, from this closed set (§0.6):
**SEPARATING (active component)** · **GUARD/RESERVE** · **SPOUSE/FAMILY** ·
**ALREADY SEPARATED**. "All four" is permitted but must be asserted with a
reason, never defaulted.

**A1b BAND — CLOSED LIST, WRITTEN OUT.** Name the band(s) from exactly these
seven, which are the `phase` values of `TRANSITION_MILESTONES`
(`index.html:502-788`):

> **18 Months Out · 12 Months Out · 9 Months Out · 6 Months Out ·
> 3 Months Out · 1 Month Out · Post-Separation**

Corresponding `monthsOut`: **18, 12, 9, 6, 3, 1, 0**.

**Do NOT grep `phase:` to find these.** The file contains **23** distinct
`phase:` values across unrelated structures — narrative phases, career-pathway
stages, healthcare tracks. Picking one of those is the same defect class as
citing `[VA HOME LOAN]`: a label that looks like the right vocabulary and
belongs to a different system. **The seven above are the whole list.**

Post-Separation findings additionally carry a **day-offset**, because the app's
reminders run T+90, T+120, T+180, T+240 and T+486. "Post-Separation" alone is not
a band, it is a bucket. A condition-triggered finding with no band states that
explicitly — a fact about the finding, not an omission.

**One fact, two bands, two different acts = TWO FINDINGS.** Assess separately.

**A1c THE EXCLUSION LINE — MANDATORY whenever A1a names fewer than all four.**
One sentence: *"This does not apply to ___."* Members over-apply benefits
guidance to themselves and the harm is real.
**If the exclusion sentence cannot be written because we do not know who is
excluded, WHO is UNRESOLVED and the finding does not ship as guidance.** An
unknown population is not a small one.

**A1d TIMING.** Exactly one:
- **ACT AVAILABLE NOW**
- **NOT YET — revisit `<date>`.** The date must be **published by the
  authority** and must be the date the *member's act* becomes available — not a
  report deadline, not a sunset. **No published date = DECLINE, not HOLD.**
- **WINDOW CLOSED FOR EVERYONE IN A1a.** Open for anyone in A1a = not closed.
  Never estimate a share.

**PROHIBITED IN A1 — POPULATION-SHARE CLAIMS.** "Most members," "many," "a
majority," "the average member," "a meaningful share." **We hold no user
demographics** — OneSignal is initialised with no tags, no user properties, no
external IDs. Permitted: describing who **the authority** covers. Prohibited:
describing who **we** reach.

---

## A2 — THE ACT (§F1 G3, imported as the general test)

**One imperative sentence naming a form, portal, office, deadline, or election.**
Or the honest: **"NOTHING — this is context."**

**These are not acts:** "be aware of," "keep an eye on," "this could affect you,"
"talk to your VSO," "monitor," "stay tuned," "consider," "may want to," "check
back," "review your options."

1. **Names the artifact, not the category.** "File VA Form 21-526EZ" is an act.
   "File the application" is not.
2. **Executable without a second research step.** If the reader must first
   discover *where*, the sentence names where.
3. **If eligibility cannot be self-determined from the sentence, the sentence
   names where it is determined.**

**A2 IS THE SOURCE TEXT FOR ALL DOWNSTREAM COPY.** Shipped copy may compress
this sentence. It may **never contain an instruction absent from it.** This
closes the H.R. 980 failure one layer earlier: nobody lied there, somebody
paraphrased.

---

## A3 — WHERE IT LANDS

Name the surface, or **NONE**. Surfaces: the 14 `validTabs`
(`index.html:4176`) · 2026 POLICY INTEL card — **both byte-identical renders,
always** · ACTION card · WHATS_NEW · TRANSITION_MILESTONES · reminders ·
Navigator CORPUS and RULES · RESOURCES · Guard/Reserve module.

**A3a CITATION TOKEN — name it, and it must be live.** Where the surface is
reachable by citation, state the exact token and confirm it is on the live list
policed by `scripts/nav-token-regression.js`. **Naming a surface is not enough:
`[VA HOME LOAN]` named a real surface and printed as dead text on a member's
screen.** A token not on that list is not a citation.

**A3b SUPERSESSION AND CONFUSION CHECK.**
- **Successor signal** — *replaces, supersedes, returns, is back, 2.0, new
  version, reauthorized, amends, changed from the original*, or a known
  predecessor → **§0.8 successor sweep fires in the same ship.**
- **Confusable-adjacent signal** — a figure, points system, percentage, or
  deadline **resembling one the app already carries for a different purpose** →
  same treatment. Case of record: two veterans'-preference point systems, both
  containing a "5" ([[V-2026-008]]). Not a predecessor; identical consequence.

**FENCE: this skill DETECTS the trigger and reports it. It does not execute the
sweep.** §0.8.4 assigns execution to `validation-gate`. Two skills must not own
one procedure.

**A3c THE CONTRADICTION.** A2 yields an act **and** A3 is NONE → **CONTENT GAP**,
not a decline. A member must do something and no surface tells them.

---

## A4 — WHAT NOT KNOWING COSTS

Exactly one: **MONEY** · **A CLOSED WINDOW** · **A LOST OR FORECLOSED ELECTION**
· **A WRONG ACTION ALREADY TAKEN** · **NOTHING**.

**Binding: the cost must be attributable to the specific act named in A2. No act
⇒ A4 is NOTHING regardless of topic importance.** This is where topic importance
gets smuggled in, and this is where it stops.

Priority when more than one applies (§0.8.3): **money > eligibility > dates.** A
member recovers from a wrong field-of-study list. They do not recover entitlement
months spent on a false premise.

**No invented magnitudes.** A dollar figure only if the authority states it.

---

## VERDICTS — CLOSED SET

- **SHIP — ACT.** A2 yields an imperative sentence and A3 names a surface.
- **HOLD — NOT YET (revisit `<date>`).** Requires an authority-published date.
- **CONTENT GAP.** A3c.
- **DECLINE.** A2 yields nothing. **A sub-disposition is MANDATORY.**

### DECLINE SUB-DISPOSITIONS

**DECLINE / INOCULATE.** No act, but a member would predictably infer a benefit
that does not exist. Ships as **bounded context whose entire job is the
negation.** All three limbs required:
1. **PUBLIC SALIENCE** — named outside our channel such that a member could
   plausibly encounter it.
2. **THE WRONG INFERENCE IS WRITABLE IN ONE SENTENCE.**
3. **THE CLOSURE TEST — write the reader's next question after reading our card.
   If the app cannot answer it in the SAME ship, INOCULATE is DENIED.**

> **Publishing context that provokes a question we cannot answer is not
> inoculation, it is a wound.** It is worst in exactly the population least able
> to absorb it. A card that leaves a veteran in crisis asking "so where do I go?"
> fails this test no matter how true it is.

**DECLINE / GAP.** No act in the finding, but assessing it surfaced a durable
actionable asset the app lacks. **The asset is proposed — not the finding** — and
is assessed on its own A1–A4 as a separate finding.

**DECLINE / LOG ONLY.** No act, no salience, no gap. Recorded so it is assessed
once rather than re-litigated.

### DECLINE IS NOT "DOES NOT SHIP"
DECLINE / INOCULATE **ships a card** — one whose job is to say what the finding
is NOT. [[V-2026-003]] was correctly declined here and correctly shipped
*"This is an advisory body, not a benefit."*

### VERDICTS ARE RE-RUNNABLE, NOT PERMANENT
**A verdict is a function of the app's state, not of the finding's dignity.**
[[V-2026-004]] failed the closure test because the app had no homeless content
that day. Once 877-424-3838 shipped, **a re-run passes and it could ship as
INOCULATE.** Nothing here is decided forever. A DECLINE records what was true of
the app on a date, and **the trigger to re-run is the app changing, not the
finding changing.** That is the difference between a checklist and a set of
remembered rulings.

### §F's DISQUALIFIERS DO NOT APPLY HERE
**Only G3 is imported.** X1–X5 and P1–P4 are push doctrine calibrated to the
scarcest channel we manage. Importing them would make this a push-worthiness
clone that declines cards which should ship. **This skill does not amend #11 and
#11 does not govern here.**

---

## OUTPUT — appended to the verification-log entry, fixed format

```
IMPACT: <verdict> | <axis ID that produced it> | <assessor> | <date> | revisit <date or NONE>
A1 population: ...   band: ...   excluded: ...   timing: ...
A2 act: "<the imperative sentence>"  OR  NOTHING - context
A3 surface(s): ...   token: <[TOKEN] or NONE>   sweep trigger: FIRED <terms> / NONE
A4 cost: ...
EXPIRES: <date the finding stops being true or useful, or NONE>
```

**EXPIRES is not the same as revisit.** `revisit` is when a HOLD becomes
assessable. **EXPIRES is when a SHIPPED finding stops being true or useful** — a
sunset, a fiscal-year cap reset, a closing window. §0.8's lesson from the other
direction: **correctness is not the only property a line loses after it is
verified. Usefulness decays too**, and a card about a closed window is worse than
no card because it consumes the attention a live one needed.

Recorded on **every** assessment, ship or decline. **Silence is not a verdict.**

## DECLINE RATE — AN OBSERVED NUMBER, AND A PATCH TRIGGER BOTH WAYS
"A skill that cannot decline is miscalibrated" is an observable, not an
aspiration. **If this declines nothing across n assessments the axes are too
loose; if it declines nearly everything the app stops being useful and they are
too tight.** Either is a force-mod patch trigger, not a reason to argue the case.

**The running tally goes in the weekly SITREP beside N7**, which is already the
surface for rate-shaped observations — **not the registry validation line, where
numbers go to not be read.** No threshold is set and none may be invented:
**n = 0.** force-mod sets one from the observed baseline at n = 10.

---

## PROHIBITED
- Assessing a finding rated below CONFIRMED.
- Any population-share claim about our users (A1).
- Deriving the A1b band by grepping `phase:` — use the closed list.
- Writing an act by analogy when the source names none (A2).
- A bare DECLINE with no sub-disposition.
- INOCULATE without all three limbs, closure test included.
- Executing a §0.8 sweep inside this skill rather than triggering it (A3b).
- Adding an instruction to shipped copy that is not in the A2 sentence.
- Naming a citation token that is not on the live list (A3a).
- Inventing a dollar magnitude, a share, or a deadline (A4).
- Using this skill on outgoing claims about our own system. Different subject.
