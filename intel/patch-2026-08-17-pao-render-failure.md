# PAO RENDER FAILURE — RUN 32030211413, 17 AUG 2026

**Branch:** `ops/pao-render-cvso-object` · commits `5817526`, `ef03455`
**Status: STAGED. Not merged, not pushed. Dean merges.**
**FLASH of record:** issue #27, `PAO PACKET FAILED — inputs unread 2026-08-17`

---

## BLUF

The packet was structurally fine and the renderer killed it. `cvso_email`
arrived as an **object**; `fence_for()` called `re.finditer` on it and raised
`TypeError`. The renderer exited 1 without writing a status file, the
workflow's `echo FAILED > out/pao-status.txt` default held, and a FLASH went up
over a week that had actually produced a complete packet.

**Fail-loud worked.** Nothing posted, nothing sent, the full payload preserved
in the issue body, and the failure was visible within the hour. This is the
design behaving correctly under a defect it did not anticipate — the opposite
of the run 31799240790 silence that the `if: failure()` reporter was added to
prevent.

The FLASH title is misleading in one respect worth naming: it reads **inputs
unread** when all five inputs were read (5 of 5). The title is chosen by
`case "$STATUS"` on the workflow's `*)` fallback arm, which cannot distinguish
"the drafter saw nothing" from "the renderer died". Not fixed on this branch —
flagged below.

---

## 1. THE RENDERER — DIAGNOSED FROM THE STEP LOG, THEN REPRODUCED

Reproduced locally against the preserved payload before anything was changed:

```
File ".github/scripts/pao-render-packet.py", line 201, in main
    f = fence_for(payload["cvso_email"])
File ".github/scripts/pao-render-packet.py", line 31, in fence_for
    runs = [len(m.group(0)) for m in re.finditer(r"`+", text or "")]
TypeError: expected string or bytes-like object
```

`text or ""` handles `None`. It does not handle a `dict`.

### (a) The populated `cvso_email` is an OBJECT — and nothing had ever seen one

This is not a renderer-logic defect. It is a **schema gap**. The prompt's
OUTPUT block illustrated `"cvso_email": null` and never showed the populated
form, so the shape was left to inference. Handed an underspecified field, the
drafter produced the shape every other body in the packet uses:

```json
"cvso_email": { "body_annotated": "...", "body_clean": "...", "note": "..." }
```

That is the reasonable answer. The renderer was written for a bare string.

**Why no fixture caught it:** every fixture in the suite carried `cvso_email`
as `null` or declined. `packet-normal.json` asserts *"cvso email included when
warranted"* — against a **string**. Six green suites had been exercising the
null path and the declined path and nothing else. The first week the drafter
cleared the caseworker criterion was the first week the populated path ran at
all, and it ran in production.

**Closed with this run's own payload.** `packet-cvso-object.json` is run
32030211413's envelope byte for byte — not a reconstruction, including the
`permission_denials` array. Against the pre-fix renderer it reproduces the
`TypeError` and writes no status file; against the fixed renderer it produces
`status=OK`. The fixture has teeth, verified in both directions.

**Fixes:**
- `fence_for` is **total** — coerces any non-string rather than raising. A
  fence width is a formatting detail and must never be what takes a packet down.
- `render_cvso()` accepts the object and the string, renders an unrecognized
  third shape verbatim rather than dropping it, and preserves the declined
  path. Permissive deliberately: a renderer that handles only the shape it was
  promised files a FLASH the next time the drafter is reasonable in a way
  nobody predicted.
- The prompt now **states** the populated shape, and states that exactly one of
  `cvso_email` / `cvso_email_declined` carries content.

### (b) The trailing BRIEF — extraction survived it

The prompt says *"a single JSON object in a fenced block, nothing else."* The
model emitted the object, closed the fence, then appended a prose `**BRIEF:**`
summary. **Tested, not assumed:**

- `extract_payload` returned a valid payload — the non-greedy fence regex takes
  the first block and stops.
- The BRIEF did **not** leak into `inner`, so the primary evidence block in the
  packet stays clean JSON.
- The BRIEF is preserved in the collapsed full-envelope block — nothing dropped.

All three are now asserted. **No code change was needed for (b)** — the
extractor was already correct. The gap was that nothing proved it.

---

## 2. THE DELTA — RESOURCES OVER-REPORTED

The packet reported:

```json
"resources": ["chatgpt-plus-veterans", "veterans-forge"]
```

**Arithmetic, checked against the app:**

| | |
|---|---|
| `last_resources_count` (baseline #22) | **47** |
| entries in `const RESOURCES` at HEAD | **47** |
| `chatgpt-plus-veterans` | ordinal **43** |
| `veterans-forge` | ordinal **23** |
| **true delta** | **`[]`** |

The count never moved. Both named ids sit **inside** the baseline, not beyond
it. **Two of three drafts announced listings that had shipped weeks earlier**,
and the CVSO email led on both of them. The headline read *"2 new listing(s)"*
over a week that added none.

**Cause.** The rule read *"RESOURCES entries beyond last_resources_count"* —
correct, and not mechanically executable by a model that cannot count. The
drafter substituted recognition for arithmetic: entries it had not seen before
read as new.

**The rule is now arithmetic.** Count `N`; if `N <= last_resources_count` the
delta is `[]`, full stop, whatever the entries look like; otherwise it is
exactly the last `N - last_resources_count` entries in array order. State `N`
and the baseline before naming any id. An unproven delta is reported empty,
never guessed. The prompt also now forbids reaching back for older material to
fill a thin week.

**Fixture:** `packet-resources-unchanged.json` — that week told truthfully.
**Honest characterisation: this one is a forward guard, not a reproduction.**
It passes against the pre-fix renderer too, because the renderer was never
wrong here — it faithfully rendered a wrong payload. The fixture exists so that
nobody later collapses an empty `resources` delta into `QUIET` and buries a
real shipped change: empty-resources beside non-empty-whatsnew must stay `OK`.

---

## 3. RECORD — NO ACTION TAKEN

### The 2 SEP flag: FLAGS reach is nondeterministic

The 2 SEP 2026 OPM tickler **fired correctly this run** after being **absent
from packet #1** (14 AUG). Same prompt, same 21-day rule, same source.

| | packet #1, 14 AUG | this run, 17 AUG |
|---|---|---|
| days to 2 SEP | **19** — inside 21 | **16** — inside 21 |
| flag emitted | **no** | **yes** |

**The renderer is cleared.** `render_flags()` is called outside the
`if status != "QUIET"` guard, so flags render even on a quiet week. Packet #1
was a QUIET week and would have printed the flag had one been in the payload.
**The miss was drafter-side, not a render-side drop.**

The tickler lives in `intel/verification-log.md` at **line 591 of 881** (53KB),
about two-thirds in. A model reading the whole log may or may not carry
material that deep into a structured output. **This is reach, not logic** — the
rule fired when the content was reached and did not when it was not, which is
exactly the failure mode that looks like intermittence.

**The unfiltered-read refinement stands, and stays QUEUED.** Not implemented on
this branch — it is a change to what the drafter reads, and it wants its own
change and its own evidence rather than riding along with a crash fix.

**Consequence worth stating plainly:** a deadline flag that fires 2 of 3 weeks
is not a deadline system. The 2 SEP tense-flip is Dean's ruling of 9 AUG and is
not optional; it currently depends on the drafter reaching line 591 on the
Monday that matters.

> **COMMANDER RULING, 17 AUG 2026 — 2 SEP GOES ON DEAN'S CALENDAR
> INDEPENDENTLY.** The PAO is **not trusted with the 2 SEP tense-flip** until
> the unfiltered-read refinement lands. The packet flag is now redundancy, not
> the mechanism. **A date that matters does not ride on a component with
> known-nondeterministic reach** — the calendar entry is the primary and stands
> whether or not the packet fires on 24 or 31 AUG.

### Two Bash attempts denied — boundary held as designed

The envelope's `permission_denials` records two `Bash` calls, both trying to
count RESOURCES:

```
awk '/const RESOURCES = \[/,/^];$/' .../index.html | grep -c '{ id:'
```

`--allowed-tools "Read"` refused both. **The boundary worked and stays exactly
as it is. No action.**

It is worth seeing what it means rather than only that it held: the drafter
reached for a counter because counting is what the task needs, could not have
one, and fell back to recognition — which is the delta defect in §2. **The
correct response is the arithmetic rule, not a wider tool grant.** Counting by
reading is the job. This is preserved in the fixture so the reasoning survives.

---

## OPEN — NOT FIXED ON THIS BRANCH

**All three carry Commander rulings of 17 AUG 2026. None of them ride on this
branch; each gets its own.**

1. **The FLASH title lies about the cause. — AUTHORIZED.** `*)` maps every
   non-OK/QUIET status to *"inputs unread"*. A renderer crash and a blind scan
   are different failures and read identically in the issue list; this run's
   FLASH said *"inputs unread"* over a 5-of-5 read.
   **Ruling: `RENDER_FAILED` as a distinct status. Own branch. STATEMENT
   FIRST** — the status name, the title text, the `case` arm placement, and the
   label choice are stated for Dean's ruling before any edit is applied. The
   renderer and the workflow's `File the packet` step both change, so this is a
   **deploy-pipeline change, COMMANDER lane**, and the statement is the gate.
2. **The unfiltered-read refinement** — queued, above. Superseded as the 2 SEP
   mechanism by the calendar ruling; still wanted for the general case.
3. **The validation gate has no Python coverage. — AUTHORIZED as force-mod, own
   branch.** `.github/scripts/*.py` is load-bearing CI code and step 4
   prescribes `node --check`, `JSON.parse`, and Ruby/Psych — nothing for
   Python. `python3 -m py_compile` was run on every changed file this session
   and is labelled **UNPRESCRIBED** in the evidence.
   **Caveat required in the patch, per ruling: `py_compile` is a FLOOR, not a
   catch.** It would **not** have caught this defect — `fence_for(dict)` is a
   runtime type error in a syntactically perfect file. A Python step that only
   compiles buys the same assurance `node --check` buys for JS and no more, and
   must not be written up as though it closes this incident. **The thing that
   caught this was the fixture, and the gate should say so** — otherwise the
   next reader takes a green py_compile as coverage it does not have.
