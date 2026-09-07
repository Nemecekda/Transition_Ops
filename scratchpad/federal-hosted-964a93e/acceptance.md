# Hosted federal acceptance - 964a93e - FAILED, stopped

Date: 2026-09-07. Dean's push was verified against PR #59 and the ready immutable veteranbridge-tools deploy 6a9f1cfba3d00800082863b6, commit 964a93e7712e2b89075cbad803fac583503f04de, tree ba77889babfc0e4268aaed8f2c143a25b68f5501. Context deploy-preview, published_at null. Full identity and Resume function digest are in deployment.json.

| Check | Observed result |
| --- | --- |
| Facts request | HTTP 200, 12673 ms; one browser request and one handler response |
| Source fidelity | All 49 expected lines retained; six roles, twelve duties, three education entries and two certifications; owning roles visually checked |
| Invention check | No Workday credential or inferred 26-year tenure in the fact sheet |
| Fact structure | FAILED: bare EDUCATION and CERTIFICATIONS headings; two visible structural warnings |
| Draft activation | One; HTTP 400, 389 ms; one browser request and one handler response |
| Visible error | Resolve the fact-sheet warnings before drafting. Review each role, date, tool, and certification, then try again. |
| Released candidate, trace, scorecard, artifact | None; no export attempted |
| Browser console errors | Zero observed |
| Terminal | FAILED_STOPPED; zero retries |

The fixture was fictional and unchanged. The fact payloads were faithful, but HTTP 200 did not mean that the fact sheet passed structural acceptance: the UI displayed FIX THESE BEFORE DRAFTING. One draft activation confirmed the server's pre-generation rejection. The unchanged fact sheet was not edited, and no second attempt or export followed. Future acceptance must stop at unresolved fact warnings rather than treating successful transport as readiness to draft.

The parser requires `EDUCATION (EXACT OR MISSING):` and `CERTIFICATIONS (EXACT OR MISSING):`. The returned numbered items had only the bare section names. The duty parser consequently treated the education section as unexpected continuation under the last role; the exact-item parser could not find its required global headers. Local replay of the actual returned fact sheet reproduces both warnings. Merely correcting those two labels makes it pass the unchanged parent parser, with every payload byte preserved.

This is an observed extraction-format failure. The fresh attempt never exercised the iteration-8 hyphen comparison in federal generation or review. It neither proves nor disproves that repair's hosted result. Actual provider counts and use of the optional structural repair remain UNVERIFIED; browser request counts do not establish provider counts. The draft error occurs before provider-client creation in the verified source, but that source inspection is not provider telemetry.

No agent push, main merge, production publication or live send occurred. Federal release, actual federal artifact, phone and manual accessibility acceptance remain pending. The failed candidate must not be rerun to seek a PASS.
