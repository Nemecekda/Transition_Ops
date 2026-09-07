# Hosted federal acceptance - 349770c - FAILED, stopped

Date: 2026-09-07. One fresh fictional acceptance on veteranbridge-tools, immutable deploy 6a9f216e813d160008626f7b, commit 349770c3a3d2226621cd7215757ac05c580fc50f, tree aaf6fe0920f03fc98c5b29c414051792196fef8e. Context deploy-preview; published_at null. deployment.json records the independently checked identity and Resume function digest. PR #59 was still open and unmerged when checked; its base remained ops/openai-parallel-clone at 7948cac. PR #46 was also open. Dean's reported merge was not established by GitHub evidence.

| Check | Observed result |
| --- | --- |
| Facts request | HTTP 200, 7068 ms; one browser request and one handler response |
| Fact fidelity | All 49 expected lines retained; six roles, twelve separate duties, three education entries, two certifications; owning roles visually checked |
| Fact structure | Canonical education/certification headers; zero warnings; no manual fact edits |
| Invention checks on facts | No posting-only Workday credential or inferred 26-year tenure |
| Draft request | HTTP 422, 15939 ms; one browser request and one handler response |
| Review result | Withheld: unsupported claims C1 and C5 reported; 8 PASS, 1 FAIL, 1 NEEDS MEMBER FACT |
| Posting-origin labels | Neither posting_reference_mismatch nor audit_posting_only_claim appeared in this response |
| Browser console errors | Zero observed |
| Released draft, trace, federal artifact | Not available; zero export attempts |
| Terminal | FAILED_STOPPED; no retries |
| Actual provider calls / structural repair usage | UNVERIFIED; browser counts are not provider telemetry |

| Review dimension | Returned status | Returned assessment, summarized |
| --- | --- | --- |
| Grounding and claim trace | FAIL | C1 and C5 contain unsupported assertions; all supplied claim IDs traced |
| Exact identity preservation | PASS | Confirmed titles, employers, locations and dates retained |
| Role separation | PASS | Experience claims retained within corresponding roles |
| Date completeness | PASS | Exact dates present for all six roles |
| Quantified impact | PASS | Role-specific quantities supported for applicable experience claims |
| Job posting alignment | PASS | Records, inventory, work orders and scheduling aligned |
| Military jargon translation | PASS | Civilian-readable terminology |
| Filler | PASS | No generic filler, advice, instructions or gaps section |
| Length and readability | PASS | Organized, concise role entries |
| Format compliance | NEEDS MEMBER FACT | Missing federal identity/contact, citizenship, preference, hours and supervisor fields remain unfilled |

The visible review reported that C1 included an unsupported Program Analyst candidate assertion and mixed-role summary claims, and that C5 added a causal relationship between inventory summaries and equipment records. It listed Workday certification as an unmet posting qualification. These are the review's assessments, not independent inspection of the withheld candidate. The exact draft and claim trace are not exposed on HTTP 422; the precise C1/C5 wording is UNVERIFIED. draft-result.json preserves the actual visible panel text and transport diagnostic. facts.json preserves only this fictional fixture and its fact sheet.

Fact extraction acceptance passed for this run. Federal draft acceptance failed and stopped. Absence of the two posting blocker labels does not retrospectively prove the exact cause of older failures, nor does it establish broader model reliability. No second draft, fact retry, withheld export, agent push, merge, production publication or live send followed. Federal artifact, phone/manual accessibility and production acceptance remain pending.
