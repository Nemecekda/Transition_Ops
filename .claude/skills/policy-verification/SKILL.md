---
name: policy-verification
description: Sourcing and verification standard for all benefits, policy, and dollar-figure content in Transition OPS. Mandatory before any such content ships. Also governs walled/403 sources, the orchestrator browser and human-verification escalation ladder, and citing bills that passed as amended. Owner - s2-intel.
---
# POLICY VERIFICATION — SOURCING STANDARD

Doctrine: wrong transition information causes direct harm. A number without a
primary source is a rumor, and rumors do not ship.

## PRIMARY SOURCES (citation of record)
- Statute/regulation: Congress.gov, eCFR, Title 10 / Title 38
- Federal rulemaking: FederalRegister.gov
- VA benefits: VA.gov official pages, VBA fact sheets
- DoD policy: official DoD Issuances (esd.whs.mil), incl. DoDI 1332.35 family
- Pay/travel: DFAS.mil, Joint Travel Regulations (travel.dod.mil)
- Health: TRICARE.mil
- State: the state agency's own .gov (e.g., WDVA)

News articles, VSO summaries, and blogs may TIP a finding but never serve as
its citation. Secondary-only support = UNVERIFIED.

## PROCEDURE
1. Locate the claim in a primary source. Record exact URL and access date.
   Source unreachable → run the ESCALATION LADDER. Never substitute a
   secondary source for a source you could not open.
2. Cross-check any dollar figure or date against a second primary source
   where one exists (e.g., statute + implementing agency page).
3. Check EFFECTIVE DATES. A signed change not yet in effect ships with its
   effective date stated, or waits.
4. Check for TERMINATION/supersession — confirm the program still exists.
5. Claim rests on legislation → apply the AMENDED-BILL RULE before rating.
6. Rate: CONFIRMED (primary, current) / PROBABLE (source READ, minor ambiguity
   — flag for Dean) / BLOCKED (source not read — access failure, see WALLED
   SOURCES) / UNVERIFIED (does not ship, period).

## WALLED SOURCES — 403 AND BOT-WALL
Primary sources are frequently unreachable by WebFetch. Observed walls:
congress.gov, DFAS.mil, eCFR.gov, dcsa.mil, esd.whs.mil, veterans.house.gov,
ftb.ca.gov.

Unreachable source = ACCESS failure. Unclear source = EVIDENCE failure.
Different defects, never the same rating.
- PROBABLE requires the source was READ. A wall is not ambiguity. Never record
  "I could not reach the source" as PROBABLE.
- Rate it BLOCKED and record: host, HTTP status or wall text, highest ladder
  tier attempted, date. BLOCKED does not ship.
- BLOCKED is valid only after the ladder is exhausted. It is not a resting state.

## ESCALATION LADDER (in order; stop at first success)
1. PRIMARY SOURCE DIRECT — WebFetch. Any analyst runs this.
2. ORCHESTRATOR BROWSER — orchestrator level only.
   `mcp__claude-in-chrome__navigate`, then `get_page_text`. Proven 2026-08-02:
   read a congress.gov Cloudflare "Just a moment..." interstitial AND a
   veterans.house.gov page after plain WebFetch returned 403 on both. The bot
   check cleared on its own.
   PROHIBITED: solving, answering, or bypassing a CAPTCHA. No CAPTCHA was
   solved in the proving run and none is authorized here. A challenge that
   demands human interaction ENDS this tier — go to tier 3.
3. HUMAN VERIFICATION — Dean opens the page himself and files the result.
   This is a full citation of record, not a lesser one. Precedent 2026-08-02:
   Dean personally read CRS IF10260 and personally opened the
   veterans.house.gov markup page; both were entered CONFIRMED.
4. Only after tiers 1–3 fail may a claim be rated below CONFIRMED.

SUBAGENT LIMIT: s2-intel, s2-scanner, and s2-vetting hold WebFetch/WebSearch
and NO browser tools. An analyst that hits a wall REPORTS THE WALL and stops.
It does not downgrade the rating on its own and does not improvise a
workaround. The orchestrator runs tier 2 and hands the page text DOWN to the
analyst as text.

HUMAN VERIFICATION RECORD — mandatory format, must stay auditable:
`HUMAN-VERIFIED | verifier | date | URL or document ID | what was read`
e.g. `HUMAN-VERIFIED | D. Nemecek | 2026-08-02 | CRS IF10260 | FY2026 basic
pay raise, 3.8%`. Any field missing = not a citation.

## AMENDED-BILL RULE
An introduced-version summary is NOT evidence about a bill that passed as
amended. The ENGROSSED TEXT settles content.

TRIGGER — either condition voids the introduced-version summary as a citation:
- Congress.gov actions show "as amended", OR
- the bill's title changed between versions.
Then read the engrossed text (`BILLS-###hr###eh`) and cite that. Nothing else.

FAILURE OF RECORD, 2026-08-02: the app claimed H.R. 980 provided "monthly VA
outreach," reasoned off the introduced-version CRS summary. The title had
changed — "Modernizing the Veterans On-Campus Experience Act" became "Veterans
Readiness and Employment Improvement Act." The engrossed text
(BILLS-119hr980eh, passed 2 FEB 2026) SEC. 4(a) adds a dedicated VR&E phone
line and regional-office contact details — a contact-information requirement,
NO cadence anywhere in the bill. "Monthly" was never in the source. It shipped
to production and served veterans a false claim.

CRS PRODUCTS: legitimate corroboration and admissible as citation of record —
CRS IF10260 carried the 3.8% FY2026 pay raise, corroborated by 37 U.S.C. 1009
and P.L. 119-60. But a CRS SUMMARY OF A BILL VERSION is version-scoped and is
governed by the trigger above. Do not conflate the two.

## OUTPUT
Claim → source URL(s) → access date → ladder tier used → rating → affected app
module. Tier 3 findings carry the HUMAN VERIFICATION RECORD line verbatim.
Anything below CONFIRMED goes to Dean with the ambiguity — or the wall —
stated plainly.
