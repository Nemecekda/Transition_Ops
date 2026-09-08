# Mobile continuation obstruction correction - 2026-09-08

S3-devops. LOCAL AUTOMATION PASS. Local work on `codex/member-return-loop`,
starting at `1b3d270588475fbcb882447b707a2902527ab629`. No push, PR, merge,
hosted deployment, provider call, or message submission.

ASK and Feedback covered the Home continuation buttons at the parent's reported
375x812 placement. The correction keeps both controls in document flow at widths
up to 1200 CSS pixels or heights up to 500 pixels. ASK stays near the start of
content; Feedback stays at the page footer. Wider, taller viewports retain fixed
widgets outside the centered app. Labels, keyboard activation, and destinations
are unchanged. The live navigation height supplies scroll padding. A focus/resize
handler keeps main-content focus clear of the sticky header and fixed navigation,
while skipping controls within any fixed ancestor.

Parent review caught the first 900-pixel breakpoint's gap: both widgets overlapped
at 901; Feedback still overlapped at 1024. The measured Feedback footprint was
118.40625 pixels plus its 14-pixel right offset. At the tested final boundary,
1201 pixels, the 900-pixel app has 150.5-pixel side gutters, clearing that footprint
by 18.09375 pixels even before content padding. Both buttons pass at 901, 1024,
and 1201. The final What's New overlay check, nested inside main, proves that
focusing its close control causes zero page-scroll calls and preserves scrollY.

## Final evidence

Evidence directory: `/tmp/tops-return-loop-2026-09-08/mobile-obstruction-fix/`.
The original frozen packet and hosted-review packet remain untouched. Earlier
iterations in this new directory remain diagnostic evidence; final files are
identified explicitly below.

- `breakpoint-final/matrix.json`: 97/97 rendered checks, Chrome 152.0.7977.82,
  synthetic data, 375x812, 320x812, 812x375, 640x320, 901x812, 1024x812, 1201x812.
  Real Tab/Shift+Tab/Enter, Timeline and Documents route/return focus, resize after
  Home return, adverse scroll placement, full rectangle intersections, nine
  interior hit points, ASK/Feedback operation, and fixed-ancestor dialog checks.
- `final-negative-control/geometry.json`: the same final regression rejects the
  original v157 source for both reported 375-pixel widget obstructions.
  `breakpoint-before/` separately preserves the parent's confirmed 901/1024 gap.
- `final-exact-parent-geometry.json`: the supplied rectangles (x29/x189.5,
  y706.07, width152.5, height44) intersect the measured original ASK/Feedback
  layers. The corrected candidate has no widget overlap at that placement.
  Local fonts are blocked: actual local button metrics are recorded separately
  (y705.875, width154.5, height54), not claimed identical to hosted font rendering.
- `episodes-final/candidate.json` and `candidate-keyboard.json`: unchanged frozen
  U1-U8 fixtures pass 8/8 in each modality; all use one navigation activation.
  Fixture SHA-256 remains
  `59e94221f93c56ba8186de3cf162e018bbf65712f1a912f57433642a8944b9dc`.
- `final-validation/`: all five required commands exit 0 on the final runtime:
  `test:openai-migration`, `test:sw-privacy`, `test:privacy-network`,
  `test:runtime-ai-spend`, `test:accessibility-release`. Structural inventory:
  34 JS-family files, 69 JSON files, 6 YAML files, 2 nonempty inline blocks.
  Encoding/whitespace pass. 4S and 4N are N/A; no workflow, package, function,
  or Netlify configuration changed. `build:public` reports exactly 22 files.
  Root netlify.toml remains outside dist. Calibration ARV-1 through ARV-12
  preserves the existing verdict and skill boundaries; no skill change.

The first complete suite passed before the parent's breakpoint finding. The
complete suite was run again once after the final runtime correction. Preliminary
harness runs sampled outside ASK's rounded corners and produced inconsistent
focus observations when reusing one browser across viewport cases. Those runs
are retained; the final harness uses interior hit points plus independent full
rectangle checks and a fresh browser per viewport. Each final case still exercises
route, return, resize, reload, and ordinary keyboard traversal. This does not
claim untested cross-case history or manual assistive-technology acceptance.

## Artifact identity and preservation

- Final index.html SHA-256:
  `65eede555229d5a13528cfd3149444e7ca806d4ecdb0540eb55116be1bcf5897`
- Final pwa-sw.js SHA-256:
  `ec540966ae2d1d115f37a01e644b1f97bd14de44b39355f33112edd23af143b2`
- Cache declaration: `transition-ops-v157` -> `transition-ops-v158`.
  Worker logic, ASSETS, APP_VERSION v97, and release notes are unchanged.
- Final built preview: http://127.0.0.1:48160/ (server session 61718).
  Root and worker HTTP bytes match source and dist. Earlier port 48159 is not
  the final review origin. `final-validation/public-manifest.json` binds all files.
- Protected Resume, Privacy, backend, push, canonical policy/checklist content,
  storage shapes, analytics behavior, and old frozen fixtures are preserved.
  Only runtime layout/focus regions and the worker integer changed. Regression
  runner: `scripts/mobile-obstruction-regression.cjs`.

## Freshness and release boundary

Local origin/main and merge base are
`e9a84fe2c94cecd4b76b70880fc3a76a36e1e469`; clone tip is
`0fd3c45233c4c21437d55d646a310e6333d6825b`. Remote ref refresh failed DNS;
no GitHub API or browser workaround was attempted. Preexisting node_modules is
preserved. Parent reports no competing active-asset owner; J1's separate output
path was untouched. Recheck at handoff confirms no concurrent runtime drift.

The supplied hosted packet binds served v157 to deploy
`6aa046979eea4a00088a63c6`, so 158 is required. Production remains evidenced at
v156/deploy `6aa039a255936800098c8e74`; the clone's last reported published deploy
is `6aa031d0c00efd000812f107` at v156. Clone public worker access was 401 and the
packet's authenticated metadata attempt was 429; fresh clone bytes are unavailable.
These are attributed prior observations, not new all-origin freshness clearance.
Recheck the ledger before any new hosted handoff. The old v157 hosted/rollback
packet does not certify this final candidate.

ACTIVE_PWA_WORKER: pwa-sw.js, /pwa-sw.js, scope /. LEGACY_ROOT_WORKER: sw.js,
/sw.js, retained for prior root registrations. DEDICATED_PUSH_WORKER:
push/onesignal/OneSignalSDKWorker.js, /push/onesignal/OneSignalSDKWorker.js,
scope /push/onesignal/, dormant. PRODUCTION PUSH: OFF. New/migrated OneSignal,
GA, and Kit runtime counts remain zero in the required privacy suite. The bounded
legacy exception remains preserved; future push enablement is not authorized.

COMPLETED: final local correction, adverse regression, unchanged episode replay,
full validation, exact build/preview, and source hashes. PENDING DEAN/PARENT:
review and any separately authorized hosted/release work; PREVIEW WARRANTED.
BLOCKED: hosted release and required Safari/VoiceOver, Chrome/NVDA, Edge/JAWS,
Android/TalkBack acceptance are not established. Existing PR API 403/browser
permission remains with the parent and was not bypassed. REGISTRY CHANGES: none.
BURN: not reliably metered; no live AI/provider calls.
