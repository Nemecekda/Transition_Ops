# OpenAI clone evidence summary - 2026-09-08

Durable summary of already completed observations, not a new test run or
production clearance. Parent Codex/XO's native UI observations and Dean's
user-reported AT results are attributed separately from subordinate API/source
checks. No secrets, raw account objects or new provider observations are included.

## Identity and exact deployed artifacts

PR65 merged at 2026-09-08T15:04:40Z, source
`117dd581137975f3b7d14359c0785f43a1579556`, merge/runtime
`1803e511ff3d7001e15d41ff35465a1786657882`. Both have exact tree
`b015baa4b44fe19472326b980a824ca9bbae7936`. Main remains
`d82516389ed5906febad467cfe57887acda97053`; PR46 remains open, head1803.
At the documentation review, authenticated published refs still agree;
Claude's local 6a59611 wrapper is two unpublished documentation-only commits
ahead of 1803. Position vs main is83/0 for runtime,85/0 for the local wrapper.

| Ready 1803 deploy | Immutable public URL | Manifest / effective publish |
| --- | --- | --- |
| Clone published `6aa0240afb7cab0008ec684a` | https://6aa0240afb7cab0008ec684a--transition-ops-openai-clone.netlify.app/ | PASS22 runtime +1 control-plane / dist |
| Clone PR46 `6aa0240dfb7cab0008ec684f` | https://6aa0240dfb7cab0008ec684f--transition-ops-openai-clone.netlify.app/ | PASS22 runtime +1 control-plane / dist |
| Veteranbridge PR46 `6aa0240c6ac17c0008850ed5` | https://6aa0240c6ac17c0008850ed5--veteranbridge-tools.netlify.app/ | PASS22 runtime +1 control-plane / dist |

Subordinate authenticated `/deploys/{id}/files` observations at15:07:48 UTC
each returned the complete 23-record manifest: exactly22 runtime paths and one
separate root netlify.toml control-plane record. Every route, size and SHA-1
matched1803 with collision-free lowercase mapping. This is manifest completeness,
not22 HTTP probes. Root netlify.toml remains outside local dist.

Parent Codex/XO independently inspected each exact deploy's authenticated
Netlify UI log: `/opt/build/repo`, `/opt/build/repo/netlify.toml`,
`PUBLIC BUILD PASS: 22 files -> dist`, and `Starting to deploy site from 'dist'`.
Operational source URLs are `https://app.netlify.com/projects/transition-ops-openai-clone/deploys/`
plus the two clone IDs above, and `https://app.netlify.com/projects/veteranbridge-tools/deploys/`
plus the veteranbridge ID. Subordinate did not itself view the UI.

Public veteranbridge index/worker matched1803. Clone canonical public worker
GET returned401; authenticated exact-deploy manifest passed. Main production
deploy remained `6a9c073e97694a000737014e`, active sw.js135. Available-history
ledger plus final metadata delta found clone/relevant-context high156 and no
conflicting156 worker reuse; deleted/unreturned history remains unobservable.

| Protected file at 1803 | SHA-256 |
| --- | --- |
| index.html | `b8b653776e7182afa9c09f7909869752a8c8a2a887ee2393d3148eec41cef27e` |
| pwa-sw.js, active156 | `fdbab32cb6e0e8ab009c1ff35e2046acf90b8c4d80b659676204f270eea8a8dc` |
| sw.js, retained legacy130 | `45a4f093d7a19d4403cdaa5da0e6d6ae0a7ae497080fe92694046be789108d32` |
| netlify/functions/resume.mjs | `9f14ef2c219fb856682d832f4225759d8e098d5ad12f9e3dfde131f12f3f8085` |

All three deployed Resume digests are
`ed4fdc3b9e91b50bfffd9959a4edc05307b5182e1d2340c162b743509da28860`.
The older 7c79057 tested package digest differs; cause remains unestablished.
Source preservation does not establish package equivalence or actual call counts.

## Completed behavior and exact limits

- Parent native Safari on exact 6aa0240c: unfocused Privacy visible, pointer
  opens About with Close focused; Tab/Shift/Option variants contained;
  Escape returns Privacy. This is keyboard/AX/screenshot evidence, not speech.
- Dean answered **"Yes, all of those work."** to the named exact 6aa0240c Mac
  Safari/VoiceOver Privacy test: About/Close announcements, Tab/Shift+Tab
  containment, Escape and return to Privacy. **USER-REPORTED PASS** only that
  flow. macOS Tahoe 26.5.2, Safari 26.5.2 (21624.2.5.11.8); VO version unspecified.
- Prior Resume **USER-REPORTED PASS** at PR63 candidate 01ecad8, veteranbridge
  preview 6a9f3f5ae2d3e400086d607f: Mac both formats initial empty-error speech
  and retained focus, repeated announcement, moved-focus/no-focus-theft.
  iPhone both formats initial empty-error speech only; reported iOS 26.6.1.
  No iPhone focus/repeat/moved-focus or Privacy result is inferred.
- Existing local error regression:96 cases passed across both formats and four
  response classes. Relevant footer/About local gates and negative control
  passed; hosted/user results above are separate. No repeat test is required solely for this documentation change.
- Existing f63 hosted pre-provider harness: **12/12 PASS**, Navigator/Resume
  method/preflight, malformed/empty, endpoint-invalid and oversized rejections.
  Provider bypass follows inspected pre-client branches; account counters were
  not read. Actual provider-timeout/budget-denial/status/repair counts remain
  unverified. A page synthetic helper cannot clear them and is not a prerequisite.
- Federal 7c79057 acceptance:49/49 facts; facts/draft HTTP200;8 PASS/0 FAIL/2
  honest NEEDS MEMBER FACT;30/30 trace; six roles; one export; no browser retry.
  Existing 4571-byte HTML-backed .doc rendered completely to two pages in
  LibreOffice Writer/Web. Phone opening confirmed; full phone layout/content,
  named phone app, Microsoft Word itself and provider/repair counts unverified.
  See [tracked acceptance](../scratchpad/federal-hosted-7c79057/acceptance.md).

Neither narrow AT result passes an entire manual browser/AT row. No new federal
generation is required merely because the three already checked frontend fixes
or these documentation-only commits exist. No hosted tests/provider calls ran
to prepare this summary. Full production requirements remain separately open.

## Existing recovery and accounting disposition

Prepared-only network recovery157 is bound to exact 1803/tree b015baa above.
Patch SHA-256 `06c6ea11ac6ea8ac751a669e4324a8e6378d7e6a595a68a2034057de023982fd`;
expected result tree `6bf1af8f4434edc2a697af9fe3d17e528bbac69e`.
Applicability, protected hashes, normal-worker compatibility, all five required
local suites, structural checks and exact22 build passed. Disposable validation
trees removed. No application/publish occurred; legacy bytes/push OFF retained.
If separately used, app offline caching is unavailable.157 is proposed, never
reserved; recheck ownership and rebind when the final candidate differs from 1803.
This is not a valid binding to 6a59611 merely because runtime bytes match.

Parent disposition 2026-09-08 resolves row29 accounting: retain approved closed
literal-marker logging; dynamic per-invocation Navigator telemetry intentionally
superseded, not ported. Parent cites PR58's approved description excluding it.
Historical reconciliation remains unchanged; no privacy-rule waiver follows.
The nonancestor c395 alert branch was selectively preserved inactive and the
April branch accounted for by preservation/supersession; neither is an automatic
missing-work gate. Exact source comparisons already passed.

Underlying local packets, retained for detailed review:
`/tmp/tops-about-safari-tab-fix-2026-09-08/post-merge/`,
`/tmp/tops-pr63-hosted-review/dean-safari-report-2026-09-08.md`, and
`/tmp/tops-readiness-1803e511-2026-09-08/` (including recovery-1803e511).
The facts above are retained here so GitHub readers do not require those local
paths to understand the scope, identities or limits.
