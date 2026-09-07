# Hosted federal acceptance - 9f39034 - FAILED, stopped

Date: 2026-09-07. Dean pushed iteration 7. PR #59 and the immutable deployment were verified against commit 9f3903467d3407b8b31f4185f18430a9f30773d2, tree 86bc4cf2ca782eda532f88ca5b6e4e9af1b18ae6. Site veteranbridge-tools; deploy 6a9f110028ca6700078b2aaf; deploy-preview context; published_at null. Full identity and function digest are in deployment.json.

| Check | Observed result |
| --- | --- |
| Facts | HTTP 200, 9766 ms; one browser request and one handler response |
| Fidelity | 49 exact expected lines; six titles/employers/locations/dates, twelve duties, three education items, two certifications, skills and target retained; owning roles visually checked |
| Invention control | No Workday credential or inferred 26-year tenure appeared in the fact sheet |
| Draft | HTTP 422, 15973 ms; one browser request and one handler response |
| Blocker | [posting_reference_mismatch] A job-posting requirement was presented as if it were your qualification. |
| Model scorecard | Eight PASS; job_posting_alignment and format_compliance NEEDS MEMBER FACT |
| Model-only posting blocker | None returned |
| Released draft / trace / artifact | None; no export attempted |
| Browser console errors | Zero observed |
| Terminal state | FAILED_STOPPED; no retry |

The fictional six-role profile was used unchanged in a fresh browser tab. Facts were reviewed before the one draft activation and not edited. Actual provider count and optional structural repair use remain UNVERIFIED; browser counts do not establish provider counts. The existing four-call maximum remains in force.

The new diagnostic demonstrates that the deterministic reference check blocked this candidate. The AI review claimed all 30 supplied claims were supported, except genuinely unfilled federal fields, and reported unsupported work-order-status explanation and Workday certification in its gaps. No model FAIL row or model-only posting blocker appeared. These statements are observations of the returned review, not independent proof that the withheld candidate was correct. Its exact disputed claim and cited facts remain unavailable.

Local investigation reproduced a real false positive in that same matcher: `Tracked work-orders.` citing `Tracked work orders.` is rejected when the posting uses the hyphenated phrase. The reverse direction is also rejected. This is consistent with a possible failure involving the fixture's work-order terminology, but it is NOT proven to be the exact cause of this withheld draft. Iteration 8 fixes the separately reproduced punctuation defect and retains the origin diagnostics. No generation or audit prompt was changed on an unsupported inference.

The run ended after one facts activation and one draft activation, with zero retries and zero downloads. This candidate must not be rerun to seek a PASS. Fresh hosted federal, actual federal artifact, phone and manual accessibility acceptance remain pending. No agent push, main merge, production publication or live send occurred.
