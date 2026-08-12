# POLICY ORIGINATION LANDSCAPE — J1 SOURCE ASSESSMENT

**Tasked:** Coverage Charter Task 1, 5 AUG 2026.
**Analyst:** s2-intel. **Reviewed by:** Orchestrator.
**Method:** every URL fetched live at rung 1 before it was reported. Status code,
content type, document count, and the newest item's own date recorded as proof a
real body came back. This is the §0.6 live-verification rule, and it exists
because J1 once shipped a plausible, well-formed, wrong Federal Register agency
slug that returned a body and failed silently.

**Ruling status: NONE OF THIS IS ENROLLED.** `.github/j1-sources.txt` is
unchanged and still holds two sources. Dean rules per source; the tier proposal
is at §0.7 of `scheduled-ops-design.md`.

---

## VERIFIED LIVE — eligible for a ruling

| Source | ID | Status observed | Newest item |
|---|---|---|---|
| FR Presidential Documents | `federal-register-presdocu` | 200, JSON, count 8539 | 2026-08-05 |
| FR OPM | `federal-register-opm` | 200, JSON, count 4010 | 2026-08-04 |
| FR DOL-VETS | `federal-register-dolvets` | 200, JSON, count 153 | 2026-03-10 |
| FR full-text `term=veteran` | `federal-register-veteran-term` | 200, JSON, count 27 (7d window) | 2026-08-05 |
| eCFR title versioner | `ecfr-title-versioner` | 200, JSON | Title 38 amended 2026-07-28 |
| VA News RSS | `va-news-rss` | 200, RSS 2.0 | 2026-08-04 |
| war.gov press RSS | `war-gov-press-rss` | 301→200, RSS 2.0 | 2026-08-04 |

**URLs, as verified:**

```
federal-register-presdocu|https://www.federalregister.gov/api/v1/documents.json?conditions[type][]=PRESDOCU&per_page=20&order=newest
federal-register-opm|https://www.federalregister.gov/api/v1/documents.json?conditions[agencies][]=personnel-management-office&per_page=20&order=newest
federal-register-dolvets|https://www.federalregister.gov/api/v1/documents.json?conditions[agencies][]=veterans-employment-and-training-service&per_page=20&order=newest
federal-register-veteran-term|https://www.federalregister.gov/api/v1/documents.json?conditions[term]=veteran&per_page=20&order=newest
ecfr-title-versioner|https://www.ecfr.gov/api/versioner/v1/titles.json
va-news-rss|https://news.va.gov/feed/
war-gov-press-rss|https://www.war.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=1&Site=945&max=20
```

### Signal-to-noise, as observed rather than assumed

- **FR OPM — the best find in the set.** Four of eight items sampled in a single
  week were actual Rules on Reduction in Force, RIF appeals, probationary/trial
  period appeals, and suitability appeals. That is the regulatory family that
  contains veterans' preference, VRA, and Schedule A. High signal, one clean
  agency slug, regulatory text rather than press about regulatory text.
- **FR DOL-VETS — high value, nearly silent.** 153 documents total; nothing
  published since 2026-03-10. Silence is a feature: most days hash-match and cost
  nothing, and when it fires it is almost certainly relevant.
  **The slug is `veterans-employment-and-training-service`.** The general
  `employment-and-training-administration` slug was tested and rejected — 10,000
  documents dominated by H-2A/H-2B wage rules, WIOA allotments, and Job Corps,
  with essentially zero veteran content in the sample.
- **FR Presidential Documents — low volume-weighted signal, very high peak
  value.** Most items are national-emergency continuations and trade
  proclamations. But this is the day-zero capture point for presidential action,
  and it is where the 3 AUG military spouse commission EO originates. Estimated
  1–3 audience-relevant items per month.
- **eCFR versioner — a trip-wire, not a content feed.** One small JSON object
  listing all 50 CFR titles with `latest_amended_on`. It reports *that* Title 38
  changed, never *what* changed. That is enough to trigger human verification and
  it is the only candidate built for detecting a program being amended or
  terminated.
- **FR `term=veteran` — the only cross-agency catch.** Closes a real structural
  gap: a veteran-relevant clause inside an HHS Medicare rule or a TSA notice is
  invisible to every single-agency feed. Carries keyword noise ("TSA Customer
  Comment Card") and overlaps the dedicated VA/OPM feeds.
- **VA News RSS — closer to a magazine than a policy wire.** Human-interest
  features, wellness series, "Jobs of the week." Roughly 10–20% names a program or
  benefit change. Its unique value is administrative program launches that never
  generate a Federal Register notice at all.
- **war.gov press RSS — echo, not origination.** One of eight sampled items was
  transition-relevant (~12%), and that one was the spouse commission EO, which
  Federal Register carries first. Operational readiness stories, joint exercises,
  ship deployments.

---

## BLOCKED AND KEY-GATED — two different defects

| Source | Status | Nature |
|---|---|---|
| DFAS announcements | **403**, dfas.mil | Access wall. Rung 1 exhausted. Stays on the dark ledger. |
| congress.gov direct | **403** | Access wall. Already on the walled roster. |
| DOL general press RSS | **403**, dol.gov | Access wall. Superseded by the FR route anyway. |
| **api.congress.gov** | **403 without key** — working API, key-gated | Dependency we have chosen not to hold. |
| **api.govinfo.gov** | **500** on the shared demo key | Dependency, and demo-key path is unreliable. |

**api.congress.gov is the highest-value blocked candidate in the set** and it is
not a technical problem. It is a live, correctly-formed API behind a free
registered key, and it would close the bill-text-at-origination gap — the exact
gap behind the H.R. 980 failure of record. Acquiring a key is a program
dependency change (§8.3 deferred API keys deliberately), which is COMMANDER lane
and not s2-intel's to resolve. **Flagged for a ruling, not proposed.**

---

## COLLATERAL FINDING — defense.gov now redirects to war.gov

`defense.gov` issues a permanent 301 to `war.gov`. The Department has rebranded
its public web presence.

- **Does not affect `federal-register-dod`.** The Federal Register agency slug is
  still `defense-department`, verified live 2026-08-05.
- **Does affect the app.** `index.html` carries **2** `defense.gov` links (both
  the Project Patriot Pipeline memo PDF, lines 2604 and 2610). They resolve today
  via the redirect. They are not broken, and they are one deprecation away from
  being broken.
- **Routed to J4 link-liveness, not fixed here.** Rewriting a user-facing citation
  URL is COMMANDER lane and does not belong inside an unrelated ship.

---

# SECOND SWEEP — 12 AUG 2026, ISSUE #19 SESSION

**Tasked:** Title 38 / Title 5 amendment correlation, not a charter task. These
sources were exercised to answer that tasking and are reported here because
they earned their place doing real work. **Method is unchanged: §0.6 live
verification.** Every URL below was fetched live during the session, with
status code, payload size or record count, and the substantive fact it
returned recorded as proof a real body came back.

**Ruling status: NONE OF THIS IS ENROLLED.** `.github/j1-sources.txt` is
untouched. Dean rules per source.

## VERIFIED LIVE — eligible for a ruling

| Source | ID | Status observed | What it returned |
|---|---|---|---|
| eCFR versions by date | `ecfr-versions-by-date` | 200, JSON | Title 38 on 2026-08-10: **1** changed section. Title 5 on 2026-08-06: **7**. |
| eCFR full section text | `ecfr-full-section` | 200, XML | 38 CFR 17.4020 at 4,645 B (7/10) and 4,869 B (8/10); 5 CFR 430.208 at 8,535 / 8,647 / 7,599 B across 7/07, 8/03, 8/06. |
| FR document metadata | `fr-document-metadata` | 200, JSON, 5/5 docs | `effective_on` 2026-09-02 on all four RIF-family rules; 2026-08-06 on 2026-13715. |
| FR document raw text | `fr-raw-text` | 200, 369,726 B | Located the codified home of the veterans-preference points. |

**URLs, as verified:**

```
ecfr-versions-by-date|https://www.ecfr.gov/api/versioner/v1/versions/title-{N}.json?issue_date[on]=YYYY-MM-DD
ecfr-full-section|https://www.ecfr.gov/api/versioner/v1/full/{date}/title-{N}.xml?part={P}&section={S}
fr-document-metadata|https://www.federalregister.gov/api/v1/documents/{docnum}.json?fields[]=effective_on&fields[]=cfr_references&fields[]=publication_date&fields[]=citation
fr-raw-text|https://www.federalregister.gov/documents/full_text/text/{yyyy}/{mm}/{dd}/{docnum}.txt
```

### Why these are distinct from what is already on the ledger

The enrolled-candidate `ecfr-title-versioner` (`titles.json`) reports **that** a
title moved and when. It cannot say **what** moved. This sweep needed the
section list, and `versions/title-{N}.json?issue_date[on]=` supplied it exactly:
Title 38's 2026-08-10 amendment resolved to a single section, 17.4020, which
made a NO-IMPACT verdict cheap and defensible instead of a guess. Pairing it
with `ecfr-full-section` at two dates produces a real before/after diff, which
is how the 8/3-to-8/6 changes to 5 CFR 430.208 were read rather than inferred.

`fr-document-metadata` with an explicit `fields[]` list is the cheapest
tickler-maintenance instrument found so far: one call per document returned the
effective dates that re-confirmed the 2 SEP 2026 package without opening a
single page. `fr-raw-text` is the heavyweight of the set and should be treated
as such, but it was the only thing that answered *where* a provision gets
codified, which is the question that separates a correct forward citation from
a misleading one.

**Fourth endpoint, reported for completeness.** `ecfr-full-section` was not in
the three candidates named in the session report. It is listed here because the
session actually depended on it, and a method record that omits a source it
relied on is not a method record.

## DEAD END, DOCUMENTED — KnowVA / M21-1

A documented dead end is evidence. This one should stop the next analyst from
spending the same tokens.

| Source | Status | Nature |
|---|---|---|
| M21-1 Adjudication Procedures Manual | 200 on status, **no article body** | Rendering wall, not an access wall. **Do not enroll.** |

- **Host:** `knowva.ebenefits.va.gov`. **Probed:** 12 AUG 2026.
- **Tier 1, WebFetch:** returned only *"Javascript is not enabled. Please enable
  Javascript to access this website."* No content.
- **Tier 2, orchestrator browser:** HTTP 200. Page title resolved to *"M21-1
  Adjudication Procedures Manual"* and the full Part I-XII topic tree rendered,
  so the host is reachable and not bot-walling. The **article body never
  rendered** across three attempts including a 6-second settle: `body.innerText`
  held at 3,231 characters, ending in the literal string `Loading ...`, with
  **0** occurrences of `BDD` on a page whose URL names the BDD program.
- **No CAPTCHA was encountered and none was attempted.**
- **Classification:** this is an ACCESS failure, so claims resting on it rate
  **BLOCKED, never UNSUPPORTED**. The distinction is the whole point: the two
  BDD process claims left open by this session are unread, not disproven.
- **Consequence for the charter:** curl returning 200 proves the host answered,
  not that the document was read. §0.6 exists for exactly this shape of failure.
  A scanner pointed here would report success forever and read nothing.
- **Correct route is ladder tier 3**, human verification, which is where the
  open M21-1 questions were sent.
