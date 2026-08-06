# USER-SIGNAL LOOP — DESIGN, DRAFT TO THE COMMANDER'S DESK

**Status: DESIGN ONLY. NOTHING BUILT. NOTHING SHIPS UNTIL DEAN RULES ON THE
PRIVACY DESIGN.** Drafted 6 AUG 2026.

Two pieces: Navigator question logging, and the GA4 monthly review.

---

# 0. COMMANDER RULINGS — 6 AUG 2026. ALL FIVE. BINDING.

| # | Ruling |
|---|---|
| 1 | **Privacy design APPROVED as drafted** — gap-topic only, three fields, mechanical scrubber. |
| 2 | **Prohibition table APPROVED in full.** The crisis-turn ban is **standing doctrine**, elevated below out of the design table. |
| 3 | **Sequencing: option 1.** Logging and the privacy-statement rewrite ship in the **SAME merge**. The institutional brief **holds** until after, and is **re-read against the new language** before it goes anywhere. |
| 4 | **Storage: Dean checks the Netlify plan for Blobs and reports back. Do not guess, do not fetch.** The **GitHub-issue sink is RULED OUT permanently**, regardless of what the plan says. |
| 5 | **Retention 90 days CONFIRMED. GA4 tier-3 CONFIRMED**, five questions fixed as the agenda. **The OneSignal dashboard task (V-17) runs BEFORE the first GA4 review** so Q4 can be answered whole. |

## 0.1 STANDING RULE — THE CRISIS-TURN BAN

**This is doctrine, not a design note. It does not get traded away in a later
refactor, and it is not subject to a "just the topic would be harmless" argument.**

> **Any turn where RULE 2 fires — the crisis path — logs NOTHING. Not the topic,
> not a category, not a counter, not the fact that it happened.**
>
> **A member in distress is not a data point.**

**Why it is absolute rather than minimised.** Every other prohibition in §1.3
protects against a record being *linked to a person*. This one protects against
the record *existing*. A crisis-turn counter would tell us how often the Veterans
Crisis Line path fires — which sounds like exactly the kind of thing an
operations team should want to know, and that is precisely why the ban has to be
written down. **The value of the metric is the argument that will be made for
breaking the rule.**

If we ever genuinely need that number, it comes from the Crisis Line's own
reporting or not at all. It does not come from instrumenting a person's worst
moment.

## 0.2 RULED OUT PERMANENTLY — THE GITHUB-ISSUE SINK

**Member-derived content does not belong in a repository record, and a Netlify
function does not hold a repo write credential.** Ruled out on both grounds
independently — either alone is sufficient, so no future plan-tier finding
reopens it. It cuts against R1's whole shape: the design's safety argument rests
on nothing in this system holding a credential that can write a ref.

# PIECE 1 — NAVIGATOR QUESTION LOGGING

## 1.0 The finding that should shape the whole design

**We do not need the questions.**

The deliverable is a **gap list** — topics the Navigator could not answer from
verified content, feeding verification sessions. That artifact can be built
**without ever retaining what a member typed**, because the Navigator already
announces its own gaps. RULE 1 makes it say, in its own words:

> *"That's beyond my verified data"*

**The signal is in OUR output, not in THEIR input.** That reframes the privacy
question from *how do we store questions safely* to *do we need to store
questions at all* — and the answer is no.

Everything below follows from that.

## 1.1 (a) WHERE IT LOGS — argued

| Option | Verdict |
|---|---|
| **Client-side only** | Useless. The point is that *we* learn; data that never leaves the device teaches us nothing. |
| **Function side, question text** | **Rejected.** Creates a server-side record of members asking about disability ratings, discharge characterization, and money. That record has no owner, no access control we've designed, and no retention policy. |
| **Function side, derived gap topic only** | **RECOMMENDED.** The function already sees the exchange; it is the only place that can. But it retains a *topic we authored*, never a *question they asked*. |

**Recommended: `netlify/functions/navigator.js`, gap-topic only.**

**Mechanism.** When the model hits a gap it already says so. It additionally
emits a machine-readable tag on its own line:

```
[[GAP: state property tax exemption for disabled veterans]]
```

**The function strips the tag before the answer is returned — the member never
sees it** — and records only the tag's contents. The tag is a **topic the model
authors**, explicitly not the member's words, and it is bounded and scrubbed
server-side before anything is written.

**The honest weakness:** a model instructed to emit a topic could still leak a
detail from the question into it. That is a real risk and it is why §1.3's
scrubber exists as a *mechanical* control rather than a prompt instruction. A
prompt is not a boundary; the regex is.

## 1.2 (b) WHAT IS CAPTURED

Three fields. Nothing else.

| Field | Value | Why it is safe |
|---|---|---|
| `topic` | model-authored phrase, **≤80 chars**, scrubbed | Describes a subject, not a person or a question |
| `date` | **date only, `YYYY-MM-DD`** — never a timestamp | A time-of-day stamp plus a rare topic is a fingerprint |
| `count` | incremented on repeat | Frequency is the whole point — one gap is noise, forty is a work order |

**Not captured: everything else**, and that is enumerated below rather than left
to inference.

## 1.3 (c) WHAT IS NEVER CAPTURED — proposed prohibition table

**Written bans, not absences — the §6 secrets-table pattern.** An empty field
looks identical to an oversight; a written prohibition survives a refactor.

| PROHIBITED | Why |
|---|---|
| **The member's question text** — verbatim, truncated, or paraphrased | This is the whole point. There is no "short version" that is safe. |
| **Conversation history**, any turn, any length | |
| **The `context` / `daysOut` payload** the app sends | It carries separation date and planning state — the exact data the privacy statement promises stays on the device |
| **IP address, user agent, session or device identifier, any hash of any of them** | A hash is an identifier |
| **Any number the member typed** — rating %, dollar figure, dates, ZIP | |
| **Discharge characterization, claim status, diagnosis, condition names** | |
| **ANY turn where the crisis path fired (RULE 2)** | **Log nothing at all — not the topic, not a category, not a counter, not the fact that it happened. See §0.1: this is STANDING DOCTRINE, not a line in a design table, and it is the one prohibition here that protects against the record EXISTING rather than against it being linked to a person.** |
| **Free text of any origin other than the model's own topic tag** | |

**Mechanical enforcement, not prompt trust.** Before write, the function
**rejects** any tag that: exceeds 80 characters · contains a digit · contains
`@` · matches a name-shaped pattern · or fails an allowlist of
`[A-Za-z ,'()-]`. **A rejected tag is dropped entirely — never truncated and
written.** Silence beats a partial record.

## 1.4 (d) RETENTION AND ACCESS

**Proposed:** aggregate-only, **90 days**, then the raw rows are discarded and
only counts survive.

**Who can read it:** Dean. Nobody else, no agent, no job. If a verification
session needs it, Dean supplies it.

**THE STORAGE MECHANISM IS AN OPEN QUESTION AND I AM NOT GUESSING AT IT.**
Netlify functions are stateless; this needs a store. Candidates are Netlify
Blobs, an external KV, or appending to a GitHub issue via a credential. **Each
carries plan-tier and credential facts I have not verified, and per the V-17
lesson I am not going to spend a fetch loop discovering them.** This is an
**ASK** — see §1.6.

**A GitHub-issue sink is probably wrong** even though it fits our existing
pattern: it would put member-derived content in a public-ish repository record
and require the function to hold a write credential, which cuts against R1's
whole shape. Flagged as my instinct, not a ruling.

## 1.5 (e) THE PRIVACY STATEMENT MUST CHANGE FIRST

**Plainly: we do not ship this until `index.html`'s privacy statement is updated,
and the update merges first.**

Current text:

> *"Your planning data — dates, ratings, checklists — stays on your device; we
> never see it. Anonymous usage analytics only. Optional email signup is used
> solely for update alerts and never sold."*

**Two of those three sentences survive this design intact.** Planning data does
stay on the device — we ban the `context` payload explicitly. We never see it.

**The third does not.** *"Anonymous usage analytics only"* would become false.
A model-authored topic phrase describing what someone asked about is **not usage
analytics** — a reasonable member reading that sentence would not expect it, and
this audience is entitled to have the sentence mean what it says.

**Proposed replacement — Dean's wording call, this is the shape:**

> *"Your planning data — dates, ratings, checklists — stays on your device; we
> never see it. We record which topics the Navigator could not answer, so we know
> what to verify next — the topic only, never your question, never anything you
> typed, and never anything from a conversation where you indicated distress."*

**SEQUENCING, AND IT TOUCHES SOMETHING ALREADY IN FLIGHT.** The institutional
brief drafted 5 AUG repeats the current privacy language to WING staff, CVSOs,
WCVSOA, and WDVA. **If that brief goes out and logging ships afterward, the brief
becomes false in its readers' hands** — to the exact audience whose trust the
brief is built to earn. Three ways out, Dean's call:

1. **Logging ships first**, privacy statement updated, brief written against the
   new language.
2. **Brief goes out now**, and logging waits until a follow-up can be sent.
3. **Brief's privacy line is rewritten now** to be true under both states.

**Recommend 1.** The brief is unsent, so it costs nothing to hold; a correction
to institutional gatekeepers costs a great deal.

## 1.5a THE PRIVACY STATEMENT REWRITE — DRAFT FOR APPROVAL, NOT APPLIED

**Ships in the SAME merge as the logging code (ruling 3). Neither goes without
the other.**

**The current text, for comparison:**

> *"Your planning data — dates, ratings, checklists — stays on your device; we
> never see it. Anonymous usage analytics only. Optional email signup is used
> solely for update alerts and never sold."*

**What has to be true of the replacement.** It is read by a member deciding
whether to type something honest, and by a CVSO deciding whether to refer
someone. It has to be **exactly true of the implementation** — not aspirational,
not lawyerly. Every clause below maps to a specific control in §1.2–§1.4, and if
the code ever stops matching a clause, the clause comes out.

---

### OPTION A — **APPROVED AS WRITTEN, 6 AUG 2026. SHIPPED.** Four sentences.

> **Ruling:** approved as written, ships in the same merge as the logging code.
> **NO brand-voice pass before shipping** — "the sentence is right and
> cadence-tuning risks the clause precision." pao-content reviews it **only
> after it ships**, against the frame, **changing nothing**. Recorded because it
> inverts the normal order deliberately: outward-facing copy usually gets voice
> before ship, and here precision outranked voice.

> **Your planning data — dates, ratings, checklists — stays on your device; we
> never see it. When the Navigator can't answer something, we record only the
> topic so we know what to verify next — never your question, never anything you
> typed. Nothing at all is recorded from a conversation where you tell us you're
> struggling. Anonymous usage analytics only; optional email signup is used
> solely for update alerts and never sold.**

**Why this one.** It states the new collection in the same breath as its
*purpose* — "so we know what to verify next" — which is the honest reason and
also the reassuring one. **"never your question, never anything you typed"** is
the clause a skeptical CVSO will look for, and it is doing the real work.

The crisis sentence is written in plain human terms rather than as a policy
carve-out. *"tell us you're struggling"* is what a member would recognise; *"a
conversation where the crisis path fires"* is what an engineer would write, and
it is worse.

---

### OPTION B — Tighter, three sentences. Loses the crisis clause as its own beat.

> **Your planning data — dates, ratings, checklists — stays on your device; we
> never see it. When the Navigator can't answer something we record only the
> topic — never your question, never anything you typed, and nothing at all from
> a conversation where you tell us you're struggling. Anonymous usage analytics
> only; optional email signup is used solely for update alerts and never sold.**

**Trade-off, stated plainly:** shorter and it reads faster, but the crisis
protection becomes a subordinate clause. **That protection is the strongest thing
we do and burying it mid-sentence undersells it to the audience most likely to
care.** I prefer A; B is here because in-app copy has a length cost and that is a
real argument, not a bad one.

---

### OPTION C — A, plus retention.

> *(Option A, with:)* **Topics are kept for 90 days.**

**Recommend NOT in the in-app line.** It is accurate — but it invites the follow
-up "then what?", and the honest answer ("counts remain, topics don't") needs
more room than this surface has. **Better home: a fuller privacy page**, which we
do not currently have. Flagged as a gap rather than solved by cramming.

---

### WHAT I DELIBERATELY DID NOT WRITE

- **No claim that logging is "anonymous."** It is — there is no identifier —
  but the word is doing suspicious work in most privacy notices and a CVSO knows
  it. Describing what we *do* is stronger than labelling it.
- **No "we may collect."** We either do or we don't. Hedged permission language
  is how a statement stops constraining the code.
- **No mention of GA4 by name.** Unchanged from current copy and out of scope for
  this rewrite — but flagged: if we ever want to name it, that is its own
  decision.

### VOICE PASS AVAILABLE, NOT TAKEN

I drafted this rather than routing it to pao-content because the binding
constraint is **truth-to-implementation** — I hold the design facts and the
failure mode is a sentence that outruns the code. **If Dean wants a brand-voice
pass before it ships, pao-content should take Option A as a fixed factual frame
and adjust cadence only, changing no clause.**

## 1.5b LIVE-FIRE — 6 AUG 2026. THE OPEN RISK IS CLOSED.

**Run by Dean on production.** The state property-tax question, asked against the
live Navigator.

| Claim | Evidence | Verdict |
|---|---|---|
| **The tag is stripped before the member sees it** | Dean read the reply on his own screen. No `[[GAP: ...]]` visible. | **PROVEN — directly observed** |
| **`require("@netlify/blobs")` resolves in our deploy** | Function log shows a normal invocation (4438 ms, 122 MB) with **no `[gap-log] store unavailable` line.** That line prints on, and only on, a failed require. | **PROVEN** |
| **The topic was recorded** | Inferred from the two rows above. **Not directly observed** — see the limit below. | **STRONGLY INFERRED, NOT PROVEN** |

### THE OPEN RISK FROM THE BUILD COMMIT IS CLOSED

**No `package.json` is needed. No `netlify.toml`. No deploy-pipeline change, and
no Commander ruling required.** The repo stays zero-dependency and keeps its
no-build-step property; `@netlify/blobs` is provided by the Netlify function
runtime. The guarded require was the right call and it cost nothing.

### THE LIMIT IN MY OWN EVIDENCE, STATED

**Absence of the error line proves the require resolved. It does NOT prove the
write succeeded.** `recordGap` swallows every error after the require — by
design, so logging can never break an answer — which means a `store.setJSON`
that threw would be **exactly as silent** as a clean write.

**The failure posture I chose makes success unverifiable from logs alone.** That
is a real trade-off, not an oversight, and it has one honest remedy: **read the
store.** The Netlify Blobs UI showing a `gap/2026-08-06` key with a topic and a
count is the only thing that closes this row properly. Until then it stands as
inferred.

**Deliberately not fixed by adding a success log line.** A per-write confirmation
would be a second record of the same event and would drift toward logging
activity rather than gaps. The store is its own proof; go look at it.

### A SIGNAL WORTH KEEPING — THE TYPO

Dean's question contained a typo (*"diaabled"*) and the Navigator handled it
correctly. That is a small quality result on its own, and it is **evidence about
the tag's provenance**: a model that normalised the misspelling in its answer
almost certainly normalised it in the topic tag too. **The tag is authored, not
echoed** — which is the property the whole privacy design rests on, and this is
the first live indication it holds.

It also probes the scrubber usefully. A typo'd topic would **pass** the charset
allowlist — letters only — and that is correct: a misspelled subject is still a
subject, not personal data. The scrubber is built to reject *personal
information*, not *bad spelling*, and it behaved that way.

## 1.5c DEFECT RECORD — THE GAP LOG WAS INERT FROM THE MOMENT IT SHIPPED

**Found 6 AUG 2026 when Dean looked for the store and it did not exist.**

**§1.5b predicted this defect by name, one day earlier, and the author of the
prediction wrote the bug.** That sentence is the record.

### What was wrong

`recordGap` suppressed on **any** reply containing `988`. **RULE 1's routing
menu — the instruction that fires on exactly the out-of-corpus condition the
gap log exists to capture — listed the Veterans Crisis Line among its routine
routes.** So a correctly-behaving model printed `988` in the same reply where
RULE 16 told it to emit the gap tag, and the suppression killed the write before
anything else ran.

**The feature could never have recorded anything.** Not rarely — never.

### Why nothing surfaced it

Every path after the `require` is swallowed so logging can never break an
answer. §1.5b stated the consequence in advance: *"a `store.setJSON` that threw
would be exactly as silent as a clean write."* The same silence covered a write
that was never attempted. **Logs showed a healthy invocation because the
invocation was healthy — the feature inside it simply never ran.**

The live-fire on 6 AUG confirmed the tag was stripped and the require resolved.
Both true. Neither touched whether a write happened, which is why §1.5b marked
that row **STRONGLY INFERRED, NOT PROVEN** rather than closing it. **The one row
held back from "proven" was the one that was false.**

### The fix — at the source, with the ban untouched

**The crisis ban was not weakened to make a feature work.** Narrowing the
mechanical test to a positional or model-signalled check would have traded the
§0.1 control for feature function, which is the trade that ruling exists to
prevent. The suppression remains **global, absolute, and unchanged**.

Instead, the spurious emissions were removed. **Four sites could put `988` into
a routine reply. Dean named three; the mechanical sweep found the fourth:**

| Site | Disposition |
|---|---|
| **RULE 1** routing menu | Crisis line removed from routine routing. RULE 2 owns distress and fires on its own. |
| **MANIFEST — "WHEN THE APP HAS NO TOOL"** | Removed. This one fired on **exactly** the no-tool case, so fixing RULE 1 alone would have left the collision fully live. |
| **MANIFEST — RESOURCES tool entry** | **The fourth site, enumerated by nobody.** RULE 14 makes the Navigator *describe a tool when it recommends one*, so this text reaches routine replies. The category is now described in words; the number lives in the corpus entry. |
| **CORPUS — `[RESOURCES]` listing** | **Kept, by ruling** — it is where a member looks for it. Guarded: surfaced on crisis, mental-health, or support-resource questions, never as filler. |

**Routine-reachable sites remaining: zero.** The two survivors are RULE 2 itself
(distress only — the ban's purpose) and the guarded corpus listing.

**That fourth site is the §0.8 pattern arriving inside a single file.** One fact,
four places, and fixing the named three would have left the defect live while
appearing resolved. The lesson generalises past successor content: **a mechanical
sweep beats an enumeration, including an enumeration by the person who wrote the
code.**

### Diagnostics — two, and deliberately not three

`[gap-log] no-tag` and `[gap-log] rejected` record **our own behaviour** and
carry no member data.

**There is no line for the crisis suppression, and there will not be.** §0.1
bans recording *"the fact that it happened."* A `[gap-log] suppressed` line would
do precisely that. **So the one path that failed silently for a day remains the
one path that must stay silent** — its failures stay indistinguishable, and that
blindness is accepted rather than overlooked. If the crisis path ever
malfunctions, we will find it the way we found this one: by looking at the store,
not at a log.

## 1.6 THE OUTPUT — a gap list, which is a work order

Not a transcript. Not a dashboard. A ranked list handed into verification
sessions:

```
NAVIGATOR GAP LIST — 30 days to 2026-09-05
  14  state property tax exemption for disabled veterans
   9  VA dental eligibility after the 180-day window
   6  Chapter 35 DEA transfer to a stepchild
   3  TSP withdrawal timing at separation
```

**Fourteen members asked something we could not answer.** That is a verification
tasking with its own priority order, and it is the entire reason to build this.

**A second use worth naming:** a topic appearing here that the app *does* cover
means the Navigator failed to find its own content — a retrieval or corpus-gap
bug, not a verification gap. **The list diagnoses two different failures and the
reader must not conflate them.**

## 1.7 WHAT I NEED FROM DEAN

1. **Rule on the privacy design** — gap-topic-only, or not at all.
2. **Rule on the prohibition table** (§1.3), especially the crisis-turn total ban.
3. **Rule the sequencing** (§1.5) — this one gates the institutional brief.
4. **ASK — the storage mechanism.** Netlify Blobs, external KV, or something
   else? I am not guessing at plan-tier facts. If you can see what the Netlify
   plan offers, that answers it in a minute; otherwise it is a scoped tier-3.
5. **Retention: 90 days** — confirm or set a different number.

---

# PIECE 2 — GA4 MONTHLY REVIEW

## 2.1 CAN I REACH GA4? NO. This is tier-3, and I am not fetching to confirm it.

**Determined from the credential inventory, not from a fetch loop** — the V-17
lesson applied on the first move rather than the twelfth:

- **No Analytics credential exists anywhere in the repo** — no service account,
  no `GOOGLE_APPLICATION_CREDENTIALS`, no GA4 API key.
- **The connected Google surfaces are Drive, Calendar, and Gmail. Analytics is
  not among them.**
- GA4 reporting requires the Google Analytics Data API with OAuth or a service
  account. We hold neither.

**Conclusion: Dean pulls the reports. I design the session and interpret what he
brings.** There is no fetch that changes this, so none was spent.

## 2.2 THE DESIGN PRINCIPLE — decide what answers MEAN before looking

**The failure mode of any analytics review is that the numbers arrive first and
the interpretation is fitted to them.** Every question below therefore carries
its interpretations **written in advance**. If a result doesn't match a
pre-written reading, that is a finding in itself — not a licence to invent a
third reading on the spot.

## 2.3 THE QUESTIONS — and what each answer would mean

**Q1 — Which tabs open, and which never do?**
*Pull: page/screen views or tab events by count, full month, all 14 tabs.*
- A tab with near-zero opens is **either undiscoverable or unwanted**, and those
  need opposite fixes. Do not guess which — pair with Q2.
- **Pre-committed action:** any tab under ~2% of the top tab's volume goes on a
  list for a navigation review, not a deletion decision.

**Q2 — Where do sessions end?**
*Pull: exit rate by tab, and last-page-in-session.*
- High exits on a **terminal** tab (Resume Drafter, VA MATH) may mean the member
  got what they came for. High exits on a **routing** tab (Dashboard, Resources)
  means they left without finding it.
- **Pre-committed:** exits are only a problem on routing surfaces. Say which
  before reading the number.

**Q3 — Returning vs one-time.**
*Pull: new vs returning users; sessions per user.*
- Transition is a months-long process. **A one-time-visit-dominated profile means
  the app is being read as a reference, not used as a companion** — which is a
  product finding, not a traffic finding.
- **Pre-committed:** this number changes what we build next; it does not change
  what we verify.

**Q4 — Alerts opened vs ignored.**
*Pull: whatever GA4 holds on notification-origin sessions.*
- **CAVEAT, and it is load-bearing:** GA4 sees a session that *followed* a tap.
  It does not see delivery or open rate — **that is OneSignal telemetry, and per
  V-17 we have not confirmed what OneSignal exports.** Do not compute an
  open-rate from GA4 and call it delivery.
- **This question is partly blocked on V-17** and should be marked so rather than
  answered with the half we can see.

**Q5 — Does the Navigator get used, and does it retain?**
*Pull: Navigator tab sessions, and whether they precede or follow other tabs.*
- Navigator-first sessions mean it is the front door. Navigator-last means it is
  the fallback when navigation failed. **Different products.**

## 2.4 SESSION SHAPE — repeatable, not a job

**Monthly. Not automated, and deliberately so:** a scheduled job would produce
numbers nobody interprets, which is the CHANNEL HEALTH tautology in a new
costume. This is a **thinking session with a fixed agenda**, run by the
Orchestrator against reports Dean pulls.

1. **Dean pulls** the five report sets above.
2. **Orchestrator writes the reading against the pre-committed interpretations
   FIRST**, before any recommendation.
3. **Anything that doesn't fit a pre-written reading is flagged as such** — not
   explained away.
4. **Output:** at most three actions, ranked. A review producing ten actions has
   produced none.
5. **Filed** in `intel/` with the date and the raw figures, so next month has a
   baseline instead of a memory.

**First run has no baseline and will mostly establish one.** That is the correct
expectation and it should be said out loud rather than discovered as a
disappointment.

## 2.5 WHAT I NEED FROM DEAN

1. **Confirm tier-3** — you pull, I interpret. Or tell me a credential path
   exists and I will reassess.
2. **Confirm the five questions** are the right five, or swap them before we
   look. Choosing questions after seeing data is how a review lies to itself.
3. **Q4 is partly blocked on V-17** — the OneSignal dashboard task. Worth doing
   that first so the alerts question can be answered whole.
