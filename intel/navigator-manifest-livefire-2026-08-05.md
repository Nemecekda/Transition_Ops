# NAVIGATOR TOOL MANIFEST — LIVE-FIRE EVIDENCE, 5 AUG 2026

**Change under test:** `netlify/functions/navigator.js` — the `MANIFEST` block
plus RULES 13 (manifest is authoritative, no unmanifested capabilities) and 14
(tool recommendations carry their citation link and ask for the input the tool
takes). Branch `ops/navigator-tool-manifest`.

**Who ran it:** Dean, against a deploy preview, 5 AUG 2026. Reported to the
Orchestrator and recorded here.

**Why this record exists.** The pre-merge gate ran *grounding-completeness
assertions* — 16/16, extracted from the shipped file — which proved the manifest
made the right answer available and the wrong one forbidden. It did **not** prove
the model followed it. That gap was stated in the SITREP rather than papered
over, and this record closes it with live evidence instead of assertion.

---

## RESULTS — REQUIREMENTS 1 AND 2, CLOSED ON LIVE EVIDENCE

| # | Question | Observed | Verdict |
|---|---|---|---|
| 1 | **CVSO** | Citation token rendered as a tappable link; the link-directory boundary was stated; **no ZIP requested** | **PASS** |
| 2 | **American Legion** | No locator overclaim; legion.org named; *"the app does not locate a specific post by your address"* | **PASS** |
| 3 | **No-tool** | *"beyond my verified data"*; state VA department named as authoritative; CVSO offered as backstop | **PASS** |

**Requirement 1 — the tool manifest and the ban on unmanifested capabilities —
CLOSED.** Test 2 is the load-bearing one: the app *does* carry The American
Legion as a directory entry with an outbound link, which is exactly the shape
that invites an overclaim ("the app will find you a Legion post"). The model
named the organization, named the external route, and stated the boundary in its
own words. That is the manifest doing the work it was written for.

**Requirement 2 — citation link — CLOSED for the link half.** The token rendered
tappable, confirming the answer used one of the eight tokens `renderNavText`
actually maps. The **negative control also held**: no ZIP was requested for a
tool that takes none, which is the specific overclaim rule 14 was written to
stop.

---

## WHAT THESE THREE QUESTIONS DID NOT EXERCISE — read before treating rule 14 as proven

**Rule 14 has two limbs. Live fire proved (a) and the no-ZIP negative. Limb (b) —
"close by asking for the input the tool needs" — was never triggered, because
none of the three questions routes to a tool that takes input.**

The manifest marks exactly four tools `NEEDS INPUT`:

| Tool | Input | Live token? |
|---|---|---|
| VA MATH | rating percentages | **NO** |
| TIMELINE | separation/ETS date | yes — `[TIMELINE]` |
| REMINDERS | ETS date | **NO** |
| AI Resume Drafter | role, years, skills, certs, experience | inside `[CAREER]` |

The three test questions routed to FIND YOUR VSO (input: none, by design),
RESOURCES (none), and no tool at all. So the affirmative ask-for-input behaviour
is **untested**.

**A second path is also untested: the plain-language fallback for tools with no
live token.** All three answers either used a mapped token or none. Nothing
required the model to name a tab in plain words *instead of* emitting a bracket
that would print as dead text — which is the failure mode the eight-token list
exists to prevent.

---

## ONE QUESTION CLOSES BOTH GAPS

**Recommended next test: a VA MATH question** — e.g. *"I have a 30% and a 20%
rating, how do I figure my combined rating?"*

VA MATH is the only tool that sits on both open paths at once. A correct answer
must:

1. Name the **VA MATH tab in plain words** — and must NOT emit `[VA MATH]`, which
   is not in `renderNavText`'s MAP and would render as dead text.
2. **Close by asking for the rating percentages**, per rule 14(b).
3. Explain combined-ratings math without predicting an outcome (rule 4 —
   VA MATH "DOES NOT: predict, estimate, or tell anyone what VA will award").

One question, three assertions, and it covers the entire untested surface. Until
it runs, rule 14 is **half-proven** and should be described that way.

---

## CARRIED FORWARD — corpus corrections found during this work, not yet applied

Both are stale text in `CORPUS`, not defects in the manifest:

1. **The Legion line is out of date.** It reads that the app's "Legion placement
   is in progress"; legion.org already ships in the RESOURCES directory. Test 2
   passed *despite* this line, because the manifest overrode it — which is rule
   13 working, and also a reason not to leave the contradiction sitting there.
2. **RULES line 3 lists seven citation tokens; `renderNavText`'s MAP has eight** —
   `VET HUB` is missing from rule 3. The manifest lists all eight, so the
   authoritative list is correct, but the two should agree.

Neither is applied. Both are small, both touch user-facing routing, both are
Dean's call.
