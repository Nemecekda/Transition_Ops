# Wisconsin welcome and SEI release preparation

October 25, 2026. User authorized publication after the local draft and requested continued building. Parent owns external GitHub/Netlify operations. This packet supersedes the earlier local-draft-only boundary for release preparation; it does not claim missing checks passed.

Baseline: published PR164, commit f4c67a6c36afc18ad0610134a7939c9b8fedb0f6, deploy6adb95f9125d53c55e6d4db4, production cache300. Parent freshly verified GitHub main and Netlify production identity. Candidate starts from equivalent db2ce3b tree and will be replayed as one scoped commit on f4c67a6.

Changes: Wisconsin start choices and return/focus handling; optional existing career-contact disclosure; SEI national and Wisconsin employer guidance; associated browser checks; ten already-published precache asset mappings and closed74/75 manifest documentation reconciled without changing allowlists.

Cache: active pwa-sw.js changes transition-ops-v300 -> transition-ops-v301, one removed and one added declaration. Production main history maximum300 matches deployment record. No recorded preview/production301 owner at preparation; parent must recheck before hosting. APP_VERSION untouched. index.html changes require this bump.

Worker roles: ACTIVE_PWA_WORKER=pwa-sw.js, URL /pwa-sw.js, scope /. LEGACY_ROOT_WORKER=sw.js, URL /sw.js, existing registrations only. DEDICATED_PUSH_WORKER=push/onesignal/OneSignalSDKWorker.js, URL /push/onesignal/OneSignalSDKWorker.js, scope /push/onesignal/, dormant. Legacy/root compatibility files unchanged. PRODUCTION PUSH: OFF. One literal TOPS_PUSH_ENABLED=false; no new/migrated OneSignal traffic; bounded legacy exception remains. No activation/sunset authority inferred.

Local scope: five required synthetic suites, policy-content, 74-file deterministic build, structural/encoding and targeted Wisconsin browser checks. Source and local journey evidence are in ../sei-resource-20261025.md and ../wisconsin-return-entry-20261025.md. These checks use synthetic data and do not prove field usefulness or retention.

PREVIEW WARRANTED: visible welcome/navigation and benefits content changed. Parent must bind the exact candidate commit/tree/worker hash to the hosted preview and complete the closed74 runtime + one root netlify.toml control-plane manifest check. No account setting, schedule, budget, credential or paid API change.

Release gaps: full manual Safari/VoiceOver, Chrome/NVDA, Edge/JAWS and Android/TalkBack matrix unperformed; local automated results are not manual AT or WCAG certification. Hosted checks and candidate-bound rollback proof are separate post-freeze evidence. No blanket prior release exception applies to this candidate. Do not claim full release clearance.

Rollback intent: restore exact PR164 app and source tree with a forward cache302, preserving push-off and legacy compatibility. Must bind and validate artifact against final commit/tree before use. Cache302 is a readiness proposal, not reservation; recheck history at actual rollback. Returning to PR164 removes the new Wisconsin welcome and SEI additions but changes no member data schema.
