# DD214 checklist source review - 2026-09-27

The existing numbered checklist should become a field-name checklist. Primary sources confirm edition-dependent numbering and contradict the current identification of legacy block 12d as net active service. Remove unsupported universal instructions about highest rank, every award/course/certification, and an Honorable-only characterization. No eligibility determination belongs in the career bridge.

## Evidence read (Tier 1 direct web access)

**CONFIRMED - DD214 & Service Record checklist.** U.S. Department of Labor, DD Form 214 comparison, 2000 Member 4 versus 2022 Service edition: https://www.dol.gov/node/178814 (accessed 2026-09-27, lines 98-105).

The table distinguishes current-period net active service from prior active service. Numbering changes: specialty 11→12; service record 12→13; awards 13→14; education 14→15; remarks 18→20; character 24→26; separation code 26→28. Grade is 4a→5a. Therefore a single fixed number set cannot cover both editions. The table establishes labels, not an obligation to record every credential or a universal required characterization.

**CONFIRMED - DD214 & Service Record / career bridge.** National Archives: https://www.archives.gov/personnel-records-center/dd-214 (accessed 2026-09-27; page reviewed May 27, 2025, lines 59-70).

NARA describes separation records as potentially containing last assignment/rank, military specialty, military education, awards, creditable service, and separation details. This supports using relevant recorded specialty/education as a starting point for member-confirmed career notes. It does not establish that the DD214 contains every skill, civilian certification, or achievement.

**BLOCKED - not used as evidence.** DoDI 1336.01, https://www.esd.whs.mil/Portals/54/Documents/DD/issuances/dodi/133601p.pdf returned HTTP 403 on direct access 2026-09-27. Tier 1 only; reported to Orchestrator for browser escalation. No attempt to bypass; no inference from search snippets. Exact education inclusion rules and permissible characterization enumeration were not verified here and are not needed for the neutral replacement below.

## Minimal implementation recommendation

Heading: **Fields to review**

Intro: **Field numbers vary by DD214 edition. Use the field names on your copy and review them against your service records.**

| Field | Suggested review prompt |
|---|---|
| Grade, rate, or rank | Check the recorded grade, rate, or rank. |
| Service dates and totals | Check the dates and each service total separately. |
| Military specialty | Review the specialty recorded on your form. |
| Decorations and awards | Review the recorded awards against your service records. |
| Military or uniformed service education | Review the courses recorded on your form. |
| Remarks | Read the remarks for additional details about your service. |
| Character of service | Check that the recorded characterization matches your separation records. |
| Separation code | Review the recorded code with your separation paperwork. |

These are editorial review prompts based on verified field categories, not new benefit, qualification, or correction-process claims. Avoid suggesting that remarks provide civilian MOS translations. Any career skill or achievement should be confirmed and described by the member using actual experience; do not infer licenses, proficiency, quantified results, or employment eligibility from a code or award.

## Scope and release

This review covers the adjacent checklist only. It does not re-verify existing BDD, executive-order, or Reserve separation-office guidance elsewhere on the page. No app code, registry, or deployment changed by this analyst. Commander release approval remains with Orchestrator. No new organization proposed.
