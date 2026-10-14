# Document route continuity - 14 October 2026

The checklist now retains its location after refresh and through browser Back/Forward. Its existing Home tile is a native keyboard-accessible button and reports documents marked as obtained.

## Exact candidate and reconciliation

- Started from clean `c1a1f644dba03e4b655c71994a190ffa3b3e368a`, tree `234f2ef9b5ca6e420b533ec99f81368fad95bc80`, on `codex/support-outcome-follow-through`.
- Refreshed `origin/main`: `2fbd8b4e1a87ac4b20b104290604e78c33d708b1`, unchanged, zero commits behind and six ahead before this iteration. The main SkillBridge tools-funding change is retained.
- Runtime SHA-256: index `05a37549112e5e39b4a68470c538c4422abae477833ce028300b8b1f868059ee`; worker `50b71f1390878635d600c104054ab390caea30da1ae6a6540c6a78f5956cd2d7`, cache288. Exact sizes and test hash are in `candidate-hashes.json`.
- Main's active worker is cache283; its worker history floor is283. The accumulated local sequence284-287 precedes this qualifying precached asset bump to288. APP_VERSION/What's New unchanged.

## Behavior and scope

`?tool=resources&view=documents` is accepted only with exactly one resources tool value, exactly one documents view value and no guide parameter. Other/malformed/ambiguous markers do not open Documents. Leaving Documents removes its view marker; entering from the Wisconsin guide clears the mutually exclusive guide marker.

A bounded Documents history layer preserves the actual parent (My Plan, directory, Healthcare, or Wisconsin guide). Only a closed topic name and fixed direct-entry anchor enter history state. Fresh direct links own one entry, do not add entries on reload, and retain an explicit in-app Back to My Plan. Other tools keep the existing history behavior. Direct arrival and all existing document routes use the checklist heading focus.

The existing optional Home tile now has native button semantics and says `Document checklist`, `N of 12`, `marked as obtained`. Source text, eligibility/policy data, document flags, career records and persistence format are unchanged. No new storage, upload, API, model, push or telemetry behavior.

## Validation

All final-source checks passed:

- `node scripts/document-route-browser-regression.js`: fresh direct/copy/reload, no duplicate history, My Plan and Healthcare/directory/Wisconsin parents, Back/Forward, overlay Back, closed malformed/duplicate input, native Enter on Home tile, both themes at320/375, saved career/document bytes preserved, no member text in URL/history, zero provider POST.
- `node scripts/document-checklist-browser-regression.js`: unchanged source data, native names/checkboxes/Space, note/source isolation, verified writes/reload, denied/silent writes and exact backup restore.
- `node scripts/tool-url-continuity-browser-regression.js`: existing generic deep-link/history behavior, delayed navigation and onboarding boundaries.
- `npm run test:openai-migration`, `test:sw-privacy`, `test:privacy-network`, `test:runtime-ai-spend`, `test:accessibility-release`: all final logs PASS; accessibility is LOCAL AUTOMATION PASS.
- Full structural inventory/inline script/JSON/YAML parse, added-line encoding, whitespace and presence/absence checks PASS. No workflow, packaging, configuration, dependency or build-boundary change:4S/4B/4N not triggered. Exact final logs are under `gate-logs/final-*`; structural inventory is `gate-logs/structural-final.log`.
- Independent route review and root visible phone checks are retained separately. Manual assistive technology, native phone hardware and field usefulness/retention remain unmeasured.

The first candidate's fresh direct navigation created duplicate history entries. Independent review reproduced it; the final fixed direct-entry anchor passed the actual fresh history scenario. Test-only corrections opened the optional Home disclosure and used a full Home fixture; no behavioral assertion was removed. Earlier gate logs are preliminary; `final-*` logs bind the final source.

## Accumulated release scope and reused evidence

Only `index.html` and `pwa-sw.js` change runtime compared with current main. Added/adapted browser tests and synthetic review evidence account for the other files. Server functions, package/configuration/build files, workflows, J1/S2 and controls are unchanged.

| Improvement | Retained local evidence |
| --- | --- |
| Outcome-aware support step, explicit save/visit and own target date | `intel/support-outcome-20261013/` |
| Unfinished support review survives internal navigation; conflicts and clear/restore boundaries | `intel/support-review-continuity-20261013/` |
| Compact phone review and clear native date control | `intel/support-compact-review-20261013/` |
| Exact Home search destination and return query/focus | `intel/search-handoff-20261013/` |
| Native document checklist, truthful save status and My Plan orientation | `intel/document-checklist-20261013/` |
| Stable Documents location, native Home entry | this directory |

Prior focused behavior evidence is reused where code is unchanged. Final mandatory suites cover the combined current app; the independent route review additionally checks shared search-return and support-draft navigation seams. This is not a retention or field-performance claim.

## Publication boundary

Dean explicitly authorized this improvement followed by publication/merge. At this local handoff there has been no new push, PR, merge or deploy. The local branch inherited `origin/main`; unset that upstream before publishing the feature branch so a default push cannot target main.

Current reported Netlify production is site `e8e39892-d7d1-47c0-b23a-847ed01120b8`, deploy `6aceb3a0a731d00a4b00238d`, ready at main2fbd8b4; root verified this read-only on October14. Final hosted identity and checks must be recorded separately after publication.

The strict current public builder and its independently compared array enumerate74 runtime files, unchanged from published main, plus the provider's separate root netlify.toml control record. Expected hosted inventory is75 exact path/size/hash records. Older skill prose describing22+1 is stale; this release does not widen the executable inventory. Candidate-bound rollback proof and complete hosted manifest acceptance remain separate release evidence, not implied by local PASS.
