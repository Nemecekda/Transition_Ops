# Member planning loop - 2026-09-30

## Intent and authority
Dean explicitly asked to use a loop or goal to make Transition OPS feel personalized and agentic for transitioning members, existing veterans changing careers, and Guard/Reserve. An active Codex goal tracks implementation and validation. Asked which agentic capability to prioritize; Dean delegated that choice ("whichever makes the most sense"). Chosen priority: adapt the next step when direction, progress or obstacles change. This new scope has not been published.

## Implemented behavior
Home connects existing guide, career-action and worksheet state. It distinguishes choosing a direction, resuming an unfinished step, reflecting on member-marked completion, reviewing an earlier step after direction drift, and recovering a step whose guide was not saved. Recommendations explain their basis. Matching worksheet next-action notes may be proposed; notes for a different target are excluded. Members choose and edit a step, explicitly save it, and can reopen or clear it through existing controls. Dated reminders remain separately visible and their prioritization is unchanged.

An optional check-in offers alternatives for unclear direction, skills/experience gaps, limited time, or needing a person. Guard/Reserve limited-time explanations account for service alongside civilian responsibilities. The check-in itself is session-only. Replacing an existing step requires an explicit checkbox and review action; the old saved copy remains until Save career step. Resource routes preserve eligibility review and verification markers. No completion signal certifies an outcome or benefits eligibility.

## Acceptance loop
1. Establish member-selected direction and optional target/goal.
2. Explain a proposed next move from existing state.
3. Accept, edit and explicitly save one current step.
4. Reload to resume it without requiring a separation date.
5. Mark completion and review before choosing another step.
6. Change direction or report an obstacle; review an alternative without silently overwriting prior work.

## Evidence and limits
OBSERVED / RUNTIME-OBSERVED: synthetic isolated Chrome covers active-transition, separated-career-change, retired-career-change, Guard/Reserve career-change, Guard/Reserve skills, and spouse career-change. Existing app combines Guard and Reserve into one profile; this is not evidence of separate eligibility classification. Tested save/reload, no date requirement, correct readiness/worksheet focus, matching versus mismatched worksheet target, four blocker alternatives, no replacement without acknowledgement, unsaved versus saved replacement, directory handoff, goal drift, orphan-step recovery, failed storage, mobile 320/375 reflow, zero member-text requests/model endpoints, and zero JS exceptions.

Existing guide, career-action, Guard/Reserve and backup browser suites PASS. Required openai-migration, sw-privacy, privacy-network, runtime-ai-spend, accessibility-release PASS. Final app build PASS (64 files). Inline JS/JSON-LD and tracked/intended JS/JSON/YAML parse PASS; encoding, diff whitespace, pre-commit and Home-actions checks PASS. Existing PERSONAL_GUIDE, CAREER_ACTION and PLAN_BACKUP blocks verified byte-identical to the release base.

Accessibility verdict: LOCAL AUTOMATION PASS. Manual AT and hosted acceptance PENDING. Screenshots reviewed from synthetic local runs. No field performance, member outcome or retention measurement. Member usefulness remains a hypothesis; disposition LOCAL SYNTHETIC TEST pending member evaluation.

## Privacy and architecture
CODE-OBSERVED and RUNTIME-OBSERVED: reuses tops_personal_guide_v1 and tops_career_action_v1 through existing validators, explicit save/clear functions, and backup format. No new stored schema, accounts, telemetry, outbound loop payload, model calls, provider/budget changes or J1/S2 activity. Session-only blocker state is discarded on leaving/reloading; an accepted alternative may be stored as the existing career step only after Save. Existing Navigator transmission consent remains in the full guide and is unchanged. Browser-only save statements are SUPPORTED for these explicit local handlers; no universal host/provider no-data claim is made. Worksheet notes and member-marked completion are not independently verified.

## What this is not yet
This is an explainable, member-controlled planning loop, not autonomous job research, applications, outreach, ongoing background monitoring, multi-goal history or independent outcome verification. It manages one current direction and step. Existing AI tools remain separate. The next milestone should test whether real members can use this loop to choose and finish a useful next action, then use that feedback to prioritize richer replanning. Do not call clicks, feature presence or these synthetic passes retention evidence.

## Reconciliation and release
Branch codex/member-planning-loop, based on live v183 commit 52f13944783f9e63ec44065879c0b23bc4a30a1a. Candidate cache184. Remote fetch succeeded; origin/main and merge base remain 261f48f983418692cf619bfb5585441b27edf63e, with zero remote-only commits. Prior local published changes are preserved. GitHub synchronization of the live releases remains pending. No push, merge, production deployment or schedule change in this scope. Existing untracked receipts and scratch work preserved.

Preview: http://127.0.0.1:18763/?tool=dashboard . Evidence: scratchpad/member-loop-20260930/. No skills or registry changes.

Artifact hashes:
- index.html: SHA256 ff858d982749646664d8d57e1301f52f40d1afc6aa665ac9ee1045c8354fabed
- pwa-sw.js: SHA256 886d5efaea234b63dbbf7e3c4b9f81a3a34b7a17dae7c152056d5fa1bb124fb1
- scripts/member-loop-browser-regression.js: SHA256 42bee6442faaad5d107ef3e68bb9a2aebfa6412c6c192d173b5239e434bbb546
