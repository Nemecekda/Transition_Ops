# Share Wisconsin guide - integrated local draft

October 25, 2026. User authorized continued building after PR171 publication. No publication, merge or commit is performed for this follow-on.

Isolated worktree: scratchpad/wisconsin-share-20261025; branch codex/share-wisconsin-20261025. Starts at exact reviewed PR171 candidate37d1105 (tree67f3c129), whose indexc23c60da matches the parent-verified production dc4ae99/cache301. Local publishing checkout did not yet contain the squash commitdc4ae99; fetching it failed, so ancestry must be refreshed before a future release. Published candidate checkout remains untouched and clean.

Integrated the already-reviewed two-hunk patch, not a whole-file replacement. Component and conditional invocation each appear exactly once. Result index SHA25662d869b32c770515f4b7cd2c6b8eb4ca49a2bafc91960217cb6d73fc5f93b1a6 matches the isolated draft. Actual Claude feedback supplied by parent already covered secondary placement, neutral copy, fixed URL and accessible status; no redundant external review requested.

Behavior: one secondary Share Wisconsin guide button only on Wisconsin/start. Click invokes native sharing with a fixed title, neutral description and https://transitionops.org/wisconsin. No current URL/query, service context, profile or plan enters the payload. Native resolution says Share options closed, not sent. AbortError says Sharing canceled without clipboard fallback. Unavailable/failed sharing tries fixed-URL copying; clipboard failure exposes a labeled read-only field whose value selects on focus. Status is polite/atomic, duplicate clicks are guarded, and nothing shares on render.

Privacy classification: CODE-OBSERVED and bounded RUNTIME-OBSERVED. No component fetch, telemetry, storage or model call. These facts do not assert how a browser/OS or user-selected destination retains information. Clipboard is changed only following the invoked share fallback, never native cancel.

Tests now extract the actual integrated component from index.html. Nine branch/behavior cases cover exact native payload, cancellation, copy, fallback, missing/denied clipboard, duplicate-click guard, accessible status and placement. Browser test reuses the repository CDP harness rather than introducing Playwright/runtime dependencies; synthetic profiles and intercepted external requests only. It checks keyboard/Tab/full selection, fixed URL,320/375/1280 reflow,44px button, absence outside WI/start and unchanged saved-plan bytes. Screenshot: /tmp/wisconsin-share-integrated-375.png.

Active worker bumped301->302 before final local gates because index is precached. This is an unpublished local proposal, not an origin reservation. Cache302 was also proposed for a prior rollback readiness artifact but never served by that artifact; recheck production/preview cache ownership before any release. APP_VERSION, push state, routes, consent controls and data formats remain unchanged.

Local preview: http://127.0.0.1:18782/?tool=resources&view=state-help&area=wi&situation=browse&need=start (server session55363). Port18781 still serves frozen PR171. These are separate origins; no member data copied.

All five required local suites passed once on final integrated app/cache302 (browser chain28159 exit0). Exact74-file public build, four inline blocks (246/1336/2276/1570331 bytes),143 tracked/intended JS files and316 JSON files, nine targeted behavior cases and the integrated browser check passed. Installed pre-commit branch guard and diff check exited0. Implementer visually inspected375px fallback screenshot: clear status/label and selectable fixed link, no horizontal clipping. Full logs: /tmp/wi-share-*.log. Manual AT matrix, hosted preview and hosted manifest remain unperformed for this draft. Local checks are not release clearance or measured member usefulness/retention. No paid calls, new telemetry or live sharing performed.


## Authorized release preparation

User subsequently authorized merging this share update. Fresh public GitHub main is dc4ae99c34442db47f1290dbe9769cc1cc17b45c; its tracked tree matches the37d1105 base exactly. Parent verified Netlify ready production6adea1dbc5b47f8e0f4bb60c on that commit. Main cache history maximum301 agrees with published301. Candidate302 bytes remain unchanged from the passing local checks above; those results are reused rather than rerunning them without a change. Scoped commit will be replayed on dc4ae99. Parent owns external operations.

PREVIEW WARRANTED because a visible interactive sharing control changed. Required full manual AT matrix remains unavailable/unperformed; no prior waiver applies to this release. Hosted identity/full74+1 manifest and exact-candidate rollback are separate evidence. Proposed rollback restores PR171 content with forward cache303, preserves push OFF and legacy compatibility, and does not alter member data formats. No app or schedule changes beyond the reviewed share component/cache bump are included.
