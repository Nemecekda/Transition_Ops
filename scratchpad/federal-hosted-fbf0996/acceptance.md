# Federal hosted acceptance - fbf0996 - FAILED, stopped

Date: 2026-09-07. Dean reported the branch pushed; PR #59 and the immutable Netlify deploy were verified at fbf099617f5388e6100b83cace29841b6ba99071. Tree 474ca3626ebbc055c275ce28eab733d4ea36d616. Site veteranbridge-tools; deploy 6a9f08b3e90dd300083e1b17; deploy-preview context; published_at null. The candidate was not published to production. See deployment.json for function digest and immutable URL.

One fresh browser session used only the six-role fictional phone fixture. No real member data or fact edits were used. Activation counts: one facts, one federal draft, zero browser retries, zero export/download attempts. The draft was withheld and this candidate was not retried. Existing provider maximum remains four; actual provider call count and optional structural repair use are UNVERIFIED. Browser request counts do not establish provider call counts.

| Measure | Observed result |
| --- | --- |
| Fact extraction | HTTP 200; 9044 ms; one request and one handler response |
| Six titles, employers, dates, locations | Exact source matches |
| Duty preservation | All 12 separate duties in their owning roles |
| Education / credentials | Three / two exact items |
| Inferred tenure / posting-only credential in facts | Neither found |
| Federal drafting | HTTP 422; 16726 ms; one request and one handler response |
| Visible blocker | A job-posting requirement was presented as if it were your qualification. |
| Model scorecard | Eight PASS, two NEEDS MEMBER FACT: job_posting_alignment and format_compliance |
| Candidate and trace | Withheld; unavailable for independent review |
| Federal artifact / phone rendering | Not tested: no released draft to export |
| Browser console errors | Zero observed |
| Hosted federal acceptance | FAIL; source of posting blocker unresolved on this candidate |

Facts began 2026-09-07T18:59:04.370Z. Draft began 2026-09-07T19:00:08.096Z. The stored facts, diagnostics, verification counts, and visible review are in facts.json, facts-verification.json and draft-result.json. All applicant content in these evidence files is fictional.

## Diagnosis and limit

The model's review said all 30 supplied claim IDs were supported, and identified Workday certification as an unmet requirement, along with genuinely absent federal fields. That does not prove the withheld draft was correct: its candidate and trace were not released.

At this commit, netlify/functions/resume.mjs:1066-1069 can append posting_only_claim from the deterministic hasPostingOnlySemanticCure check. The model can separately return the same allowlisted blocker. At line 1088 both lists are concatenated and mapped to the same message; line 1092 deduplicates it. The HTTP 422 response at lines 1278-1282 supplies no origin distinction. No separate withhold-verdict, unsupported-trace, or failed-dimension message appeared, but an audit.blockers entry can still coexist with PASS rows. Therefore the evidence cannot distinguish a model blocker from a deterministic reference mismatch or both. It cannot establish which claimed qualification was unsupported or that this was a false positive.

Do not weaken the posting gate or rewrite generation instructions on that inference. Iteration 7 makes those existing failure sources distinguishable with fixed content-free prefixes in the existing blockers field. It changes neither decision rule and does not resolve this historical hosted failure. A fresh candidate is required before another bounded acceptance attempt. Do not reuse this failed deployment for repeated generations.

No agent push, merge, live send, production publication, credential access, or new skill occurred. Manual assistive-technology acceptance and actual federal export remain pending independently of local tests and the previously working civilian DOCX.
