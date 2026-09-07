# Federal Resume readiness - iteration 5

LOCAL PASS. The extraction-stage invented-tenure counterexample changes from HTTP 200 with an unsupported fact sheet to HTTP 502 without a fact sheet. Fresh hosted federal acceptance remains pending. This commit does not authorize or claim production release.

Dean approved the extraction proposal and related fixes with "approved, aprove all unless its a major skill add". No skill addition was made. PR #59 remains targeted at ops/openai-parallel-clone. Parent is 1b6b586d9fb0ace098c3ede4c831a3f7086ec6a8.

## Defect and minimal fix

The immutable 1b6b586 preview returned an unsupported 26-year tenure during the single authorized facts activation. Testing stopped before confirmation, generation or download. See ../federal-hosted-1b6b586/acceptance.md for original evidence. The matching numeric prompt example is a plausible source, not proven model-internal causation.

The extraction instruction now requires explicitly supplied tenure and contains no numeric example. Before either initial or repaired extraction text can be released, the existing exact-quantity tokenizer checks payload quantities against the same bounded member source sent to extraction. Posting-only values cannot support facts. Structural ROLE and numbered-item labels are excluded. Raw payload scanning also covers malformed/legacy envelopes before structural parsing. Terminal periods and commas are comparison punctuation only; output is never rewritten.

This is source-presence checking, not a complete semantic or role-attribution proof. A number present elsewhere in the source still needs member confirmation and existing draft/audit grounding. Confirmed member edits remain authoritative for drafting and are not compared against the original source by this new gate. Models, caps, retries, privacy, generation prompts, civilian formatting/export and cache assets are unchanged. No added call, dependency, storage or logging.

## Executable evidence

- 40/40 actual-handler cases across standard and federal modes: absent/word-form/posting-only/clipped-source numbers withheld; supported values preserved; substring, grouping, currency, precision, percentage and plus distinctions covered; terminal punctuation preserved in returned text.
- Initial extraction and existing optional repair both tested. One stubbed call for initial cases, two for repair cases, no added retry. Withholding returns only the existing content-free error/category/stage.
- All five required local suites pass: OpenAI migration, service-worker/privacy, privacy/network, runtime spending, accessibility. OpenAI regression includes actual browser DOCX and LibreOffice rendering. These are synthetic/stubbed tests, not hosted model acceptance or manual accessibility proof.
- Actual installed Netlify packaging passes for both AI functions and jobs exclusion. Structural parsing and protected-file comparison pass; original outputs and hashes are in manifest.json.

The intentional baseline failed with actual 200 versus expected 502. The first patch run failed to parse because the proposed helper lacked its closing brace; corrected before tests. Subsequent full runs exposed two stale fixture sources: a duty-atom fixture inherited unrelated 15-person/$2M numbers, and an exact-item fixture supplied no actual education dates. The first fixture's unrelated scale was removed; the second now supplies its actual synthetic ledger. Original expectations were retained, and all failures are preserved. No grep/edit assertion failed and no failing test expectation was weakened.

## Outstanding work and handoff

The related multiline NUMBERS AND SCALE catalog defect remains reproducible: continuation values are ordinary global facts and can enter the draft. It will be fixed as separately approved iteration 6 before requesting a new preview. The new extraction gate independently prevents an absent quantity at extraction, but does not repair classification of member-confirmed multiline numbers.

After the next local fix, Dean must push this branch to refresh PR #59. Use a fresh immutable deploy for the bounded six-role federal fixture: one facts activation, one draft activation, at most the existing repair, maximum four provider calls and no retries seeking PASS. Stop on a fidelity failure; inspect and render the actual federal artifact only if released. Manual phone and accessibility results stay separate.

No push, merge, deployment or live request occurred in this iteration. Shared checkout and stashes remain untouched. Cache remains transition-ops-v152 because no precached file changed. The previous hosted FAIL and its original proposal are historical records; this report records the proposal's approved application. No BLOCKED-POLICY item or major skill addition.

Final staging check initially flagged the historical unified-diff proposal's required context-line space as trailing whitespace. Its exact original bytes and SHA-256 are now preserved inside JSON, and its evidence reference is updated. No runtime edit resulted. Final staged structural count: 25 JavaScript, 22 JSON, six YAML, one inline JS and one JSON-LD.
