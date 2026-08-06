# USER-SIGNAL LOOP — DESIGN, DRAFT TO THE COMMANDER'S DESK

**Status: DESIGN ONLY. NOTHING BUILT. NOTHING SHIPS UNTIL DEAN RULES ON THE
PRIVACY DESIGN.** Drafted 6 AUG 2026.

Two pieces: Navigator question logging, and the GA4 monthly review.

---

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
| **ANY turn where the crisis path fired (RULE 2)** | **Log nothing at all for that exchange — not even a topic.** A member in distress is not a data point. This is the single hardest ban in the table and it is not negotiable. |
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
