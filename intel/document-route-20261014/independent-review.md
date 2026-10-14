# Independent review: document route continuity — October 14, 2026

**PASS for this bounded local candidate.** No unresolved defect found in the reviewed document route and entry/return seams. This is independent local acceptance, not hosted release or manual assistive-technology clearance.

## Scope and identity

Base `c1a1f64`. Final index SHA-256 `05a37549112e5e39b4a68470c538c4422abae477833ce028300b8b1f868059ee`; worker `50b71f1390878635d600c104054ab390caea30da1ae6a6540c6a78f5956cd2d7`, cache288.

Existing validation, accessibility, privacy-truth and member-return skills provide **FULL** coverage. No new skill or registry change is needed. The closed route is `?tool=resources&view=documents`. Browser history adds a fixed document-entry flag and an allowlisted parent topic, not member text. No plan-storage schema, policy, provider, budget, credential or telemetry expansion is introduced. The reviewer made no app edits or publication calls.

The member job is to return to the same document checklist after refreshing or navigating, without losing saved work. The usefulness hypothesis is reduced disorientation; no field or retention improvement is established. Evidence class **OBSERVED**, disposition **LOCAL SYNTHETIC TEST**; retention and uncoached member usefulness remain **UNMEASURED**.

## Baseline and correction

At `c1a1f64`, My Plan → Documents showed the checklist under My Plan with a saved count, but URL `?tool=resources` reloaded into Claims help/VSOs under Benefits. This was reproduced independently at375×812. The final route restores the exact checklist, including direct entry and reload.

Review found a fresh-entry bug in initial candidate `8d88b6cf`: null-history direct links created three identical Documents entries. One browser Back stayed in the checklist. The final Documents-only logical entry offset fixes this without changing the general routing model. Its explicit Back to My Plan was tested to remain inside the app; merely suppressing initial pushes would not have been enough.

## Final independent checks

Environment: local desktop Chrome155.0.8059.41, Darwin25.5.0 arm64; synthetic saved guide/action/worksheet and two obtained documents;375×812 plus320×812 in light/professional and dark/tactical themes. External and function requests blocked. Zero provider POSTs and no application JavaScript exceptions.

Final `05a37549` checks passed:

- My Plan → Documents, direct URL and reload restore the correct title, My Plan ownership, heading focus and exact saved flags. Guide/action/worksheet remain byte-identical.
- Fresh direct link from about:blank creates exactly one Documents entry. Reload adds none. Native browser Back reaches the prior document and Forward restores Documents. All tools opens/closes one overlay. Explicit Back to My Plan stays in-app; subsequent Documents entry and browser Back/Forward work.
- VSOs, directory and Healthcare each restore their actual parent topic through Back/Forward. Wisconsin guide entry restores its guide marker and directory; Documents removes that marker. Generic Resources still defaults to VSOs. Duplicate tool/view values, wrong tools, unsupported views and any guide/view combination do not select Documents.
- Transition checklist item a6 opens the document heading; its explicit return focuses the same item. Browser Back/Forward also restores the expected surfaces, The reviewed routing code does not write readiness answers.
- Optional Home Documents tile is a native button, activates with Enter and says marked as obtained. Both mobile widths/themes retain44px targets, no horizontal overflow and a visible Back control on document arrival.
- Existing BDD search result/Back retains query and result focus. An unfinished support update survives My Plan → Documents → My Plan/Home, preserving saved plan bytes.

The first final-matrix run had one harness error when its execution context disappeared during cross-document history navigation. It is retained in `independent-results.json`; the fresh-entry case was rerun alone with page-load-aware browser-history APIs and passed in `fresh-final-results.json`. This was a harness correction, not an app change or a suppressed assertion. The remaining11 cases passed in the original final run. Mobile checks are separately retained.

## Accumulated release seams

Previous independent evidence for support outcomes, review continuity, compact reviews, exact search handoff and document checkbox/save/restore behavior remains valid where implementation is unchanged. The current diff changes the closed Documents route/history, its entry focus and the optional Home tile. The saved-data writers and document policy content are unchanged. Shared-router interactions with search and support drafts were freshly checked above. Root visual checks and builder mandatory-gate results are separate records, not relabelled as this reviewer's execution.

Independently compared the closed runtime arrays and whole builder/verifier files at main `2fbd8b4` versus `c1a1f64` and the final working bytes: exactly74 unique runtime paths, identical builder/verifier arrays, no root netlify.toml in runtime. No allowlist widening occurred. Hosted acceptance must compare that exact74-path candidate union plus the separate root config record, not count alone. Prior accepted75-record preview/production proof is in the primary3dc7 checkout's `intel/wi-release-20261013/PUBLICATION.md` and raw manifests, for PR147/main `f948e3b`. Historical skill22/23 and old log64 counts are stale documentation, not today's executable contract. No skill changes are necessary for this unchanged boundary.

## Limits

This is synthetic browser lab evidence, not real-phone, VoiceOver/NVDA/JAWS/TalkBack, field-performance, member-usefulness or retention evidence. No hosted artifact was inspected in this subtask and no push/merge/deploy was performed. Final release provenance, hosted manifest and mandatory gates remain the release owner's responsibilities.
