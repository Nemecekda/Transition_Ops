# 2026-09-30: useful starting points before setup

EDIT MODE. Tracked tree began clean at769ce43; existing untracked intel and scratchpad preserved. User asked to publish and keep improving value for every visitor. Confirmed live cache186 before this iteration. Candidate cache187 changes the welcome entry and empty planning state; no benefits data, functions, AI settings or eligibility rules changed.

## Member experience

The welcome screen now leads with Find my starting point, opening Home and focusing Your next move. Personalize my view remains available as an optional setup path. The previous claim about reminders firing was removed; notification behavior is unchanged.

Visible starting cards explain their outcome: explore a career direction, build skills, or prepare to leave service. Active duty sees transition preparation first; veteran, retired, Guard/Reserve, spouse and unspecified visitors see career exploration first. Guard/Reserve and spouse copy reflects their situations. All three choices remain available to all visitors and every tool remains accessible. A choice sets only the current in-memory guide pathway, preserves any other guide details, and presents a next action. Save remains explicit. Recovering an earlier action and returning to a saved direction keep their prior flows.

Hypothesis: visitors will reach a useful action more easily when they can explore before answering setup questions. Browser checks demonstrate the route and data boundaries, not delight, universal suitability, field usefulness or retention. Those outcomes remain unmeasured and need actual visitor evidence.

## Validation and evidence

CODE-OBSERVED + RUNTIME-OBSERVED / SUPPORTED / KEEP: root welcome primary route reaches Home with heading focus; optional setup reaches step1 without saving service status; all three starting cards work across seven visitor/path scenarios; no automatic guide/action/date storage; tools remain accessible; existing save/resume, completion, goal-change and target-date flows pass. Existing onboarding-completion flag is written when entering Home, as on the previous Explore tools first route. No new data key or tracking.

Chrome154.0.8037.92, isolated synthetic local browser sessions. Starting-card screenshot375px visually inspected; suite includes320/375 reflow. No CPU/network throttle and no performance metric claimed. External requests blocked; planning tests make zero model calls; Navigator tests use stubbed replies. One early run passed assertions but hit a temporary Chrome-profile cleanup race; the final complete run exited0.

PASS: member-loop expanded root-entry and visitor scenarios; existing member-navigator; required openai-migration, sw-privacy, privacy-network, runtime-ai-spend, accessibility-release;131 structural inventory results; encoding; pre-commit; whitespace; deterministic64-file public build. Accessibility disposition LOCAL AUTOMATION PASS; manual AT matrix remains pending. Evidence: scratchpad/visitor-start-20260930/.

Candidate app SHA25605af271799801110dc42ddcfcbe6d886c668fb7a6f6fab697c8602d36307a059; worker SHA2560b35e3dc670560a9fc0ab011519c151bdb8c7026bf526fbc07ee8669d639e799. Cache186 ->187 bumped before gate. Publication identity and hosted byte/inventory checks belong in the separate cache187 publication receipt. No J1/S2, paid runner, live model test, new account, telemetry, email, schedule, budget, merge or push. No skill/registry change. GitHub synchronization of CLI releases remains pending.
