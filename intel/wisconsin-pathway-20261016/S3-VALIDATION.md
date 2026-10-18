# Wisconsin pathway - local implementation and validation

October 16, 2026. EDIT MODE. Local candidate only; no commit, push, merge or deploy was performed for this iteration.

## Candidate

- Branch: `codex/wisconsin-pathway`, isolated checkout `/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops`.
- Base and HEAD: main `ffede2397c22af055c97c74a8afe631d22edbc7b` (PR149). The former branch and other worktrees were preserved. Initial remote/cache proof is in `s3-baseline.json`.
- Candidate index SHA-256: `2acb1be174325661050f982cdd56acaf3d74e0e754ef912ca9e857fccf7ca43b`.
- Active worker: `transition-ops-v290`, SHA-256 `48776d6f3ce49c559ed280121b3218d0da48ef10e4e2e387e799719899f93317`.
- Focused regression SHA-256: `dfa60218377012ae73fb46857651a08c9170da9f58a3ffc2709639bcf38d1625`.

## Bounded change

Benefits, More, Resources and Home search can open State benefits and local help. The national default remains useful without Wisconsin; choosing Wisconsin opens six task groups with one official action and secondary detail. State is browsing interest, not residence or an eligibility decision. Combined Guard/Reserve profile is not interpreted as Wisconsin Guard. Returning from orders can lead to verified DOL guidance while still serving. The Wisconsin Guard tuition option is visible in Education for any Wisconsin context and becomes primary only for explicit Guard context.

The new guide uses fixed route IDs, existing history, existing source-qualified links, and the existing reviewed plan transaction. Documents and linked tools have named returns. Saving a new current step requires review and deliberate replacement; visit-only use preserves disk. Existing plan direction, Career draft and worksheet are retained. No new persistence key, account, telemetry, model call, provider integration, calendar generation or eligibility engine was added. Source claims were appended to the verification log before runtime copy insertion. Existing policy sections, J1/S2, runtime spend and push-off configuration remain untouched.

The large legacy Wisconsin work guide is no longer forced into the fresh national Resources directory. Its explicit link, search, Career disclosure, saved-plan reopen and shared deep link remain working. The existing collapsed Career Wisconsin support discovery remains as a documented later refinement rather than expanding this change.

## Checks and exact evidence

Each command ran separately with its real exit code. Complete stdout/stderr and command are retained under `checks/`; final logs all end `EXIT 0`.

| Required gate | Final evidence |
| --- | --- |
| `npm run test:openai-migration` | `checks/openai-migration-final2.log` |
| `npm run test:sw-privacy` | `checks/sw-privacy-final2.log` |
| `npm run test:privacy-network` | `checks/privacy-network-final2.log` |
| `npm run test:runtime-ai-spend` | `checks/runtime-ai-spend-final2.log` |
| `npm run test:accessibility-release` | `checks/accessibility-release-final.log` |
| Real parse, inventories, encoding and diff check | `checks/structural-final.log` |
| Local public artifact | `checks/public-build.log` - actual 74-file output; internal evidence excluded |

The service-worker regression retains an older descriptive "64-file" message in its output; the actual current public builder reports 74 files. The builder and its boundary were not edited.

Focused `scripts/wisconsin-pathway-browser-regression.js` passes on the final candidate (`checks/focused-browser-final2.log`): national default, six synthetic situations, exact route/reload/Back/Forward, picker heading focus, ordinary move/conditional housing/Guard education, four named tool returns, malformed routes, saved-plan and profile preservation, visit-only/stale review safety, exact saved Guard tuition resume, 320/375px both themes, 44px targets and native Enter. Zero uncaught exceptions and zero provider POST attempts.

Existing regressions also pass: `checks/legacy-documents.log`, `checks/legacy-wi-plan.log`, `checks/legacy-wi-work.log`. Documents ran immediately before the final conditional-query-delete fix; the final focused suite exercises Documents/native history again. Legacy Wisconsin plan and work suites ran after that fix, including exact unrelated URL encoding, old search/deep-link/copy/filter flows and save/atomic-failure boundaries.

Independent source-helper and adverse-browser review is in `independent-review/FINAL-REVIEW.md`, separate from S3's tests. Root's local visual review is in `local-browser-review.md`. Claude supplied two actual description-based UX critiques with explicit dispositions; this does not represent Claude as a source verifier or browser tester.

## Failures and corrections retained

- Initial isolated checkout had no dependencies. OpenAI and spend gates failed on missing modules. Exact lockfile dependencies were restored from the existing npm cache using `npm ci --offline --ignore-scripts --no-audit --no-fund`; no download or lifecycle script ran. Both full gates subsequently passed.
- An initial focused-test assertion used `innerText` for a collapsed secondary option. It was corrected to inspect text content, without changing the UI. Adding the property-credit assertion introduced a nested selector-quote error in the test; corrected to compare href directly. Full focused rerun passed.
- Browser checks found a real Wisconsin work-guide reload losing the new return context. Initial subtab now recognizes that existing deep link as directory before history synchronization. Full focused and legacy tests pass.
- Required accessibility initially failed its exact URL probe because deleting absent state-help parameters reserialized unrelated `%20` to `+`. The implementation now deletes a parameter only when present. Full unchanged accessibility suite and exact URL regression pass. Its original failure log is retained.
- Review corrected moving-first housing assumptions, Guard tuition resume, picker focus, and excessive controls ahead of the answer before the final freeze. Discrete edit receipts are in `edits/`.

Final structural inventory: 3 inline JavaScript blocks plus 1 JSON-LD block, 128 standalone JavaScript files (including intended evidence/tests), 207 JSON files and 6 YAML files parsed successfully. Added-line and intended-untracked encoding check found zero curly quotes/nonbreaking spaces; `git diff --check` passed. The parse inventory predates only this final text/log copy, which adds no executable, JSON or YAML artifact.

## Gate scope and limits

4S N/A: no workflow edits. 4B trigger N/A: no build boundary edits, but local public build additionally passed. 4N N/A: no function, package, lockfile or Netlify config edits. No source or assertion was weakened to bypass a failing gate. No new package/dependency or paid runtime was introduced.

Automation verdict: LOCAL AUTOMATION PASS. Headless Chrome 155, synthetic data, isolated local loopback profiles, outbound/provider traffic denied. Root separately inspected light/dark phone-width layout using the in-app browser. Manual assistive technology, physical phones, hosted acceptance, actual member comprehension, benefit outcomes, field performance and retention remain pending or unmeasured. The source coverage inventory is explicitly partial; this is not an all-benefits or all-clear claim.

App code is frozen at the hashes above. Remaining Wisconsin coverage, county/tribal routing and expansion decisions are recorded in the goal/coverage evidence. Publication requires the separate release flow; this local candidate has not been published.
