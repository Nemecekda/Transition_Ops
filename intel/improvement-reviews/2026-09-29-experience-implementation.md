# Experience implementation - 2026-09-29

User authorization: "make the whole experience better" after the separately published Home fix. Implementation scope: finding a tool, page orientation, Home hierarchy, and Career navigation. Candidate only; not published.

Base: local published commit 04f0e61, cache182. Candidate branch codex/experience-navigation-pass, cache183. GitHub synchronization of the base release remains pending; origin/main did not contain the published Home fix at start. Do not replace this candidate with the older remote tree.

Changes:
- Home task choices and optional countdown disclosure, preserving date-based next-action logic and saved-plan continuation.
- Search includes named tools and keyboard-operable results, with clear and no-results recovery controls.
- All tools access and page titles across destinations; Home return available from every tool.
- Career guide, career plan and resume shortcuts with destination focus.
- General announcement badge renamed Updates and styled neutrally; its count remains general unacknowledged updates, not personal unresolved deadlines.
- Original themes, benefit eligibility logic, tool access, saved data, provider code and budgets preserved.

Evidence: local synthetic Chrome browser fixtures, blocked/stubbed external requests; no new telemetry or member data. Screenshots in scratchpad/experience-20260929 at 375 and 1280; mobile dark and light visually reviewed. Browser assertions also cover 320/375 reflow, keyboard disclosures, modal Escape, tool search destinations, Career shortcut focus, explicit save/reload, offline planning and scoped clear. Existing career-action, service-career and backup/restore browser suites passed. Home-actions logic regression passed. The browser logs retain their original summary strings; added executable cases cover the new search/shortcut journeys.

Required gates PASS: openai-migration, sw-privacy, privacy-network, runtime-ai-spend, accessibility-release. Public build PASS: exact 64-file inventory. All tracked JS/MJS and JSON parsed; tracked YAML parsed with Ruby; inline script/JSON-LD parse passed. Added-line encoding and git diff --check passed. Pre-commit guard passed. No workflow change (4S N/A).

Accessibility disposition: LOCAL AUTOMATION PASS only. Final accessibility rerun includes the completed tool directory. Manual Safari/VoiceOver, Chrome/NVDA, Edge/JAWS, Android/TalkBack and hosted acceptance remain PENDING. Calibration ARV-1..12 reviewed against this evidence: retain local-only verdict; defects described in synthetic cases would block, missing manual/hosted evidence stays pending.

Expected benefit is a hypothesis: members can find and resume a task with less searching and less setup clutter. Member completion, field performance and retention effects remain unmeasured. This work does not establish a performance or retention improvement.

Preview: http://127.0.0.1:18763/?tool=dashboard (local static build; server functions unavailable). Production remains the earlier v182 release. No production deployment, remote write, J1/S2 execution, schedule or budget change in this pass.

Artifact hashes:
- index.html: SHA256 53f37f7311915e20fb25d7856cadb0f8fb6d8f82426fc516d99912e737f30f70
- pwa-sw.js: SHA256 e77c3f05af87acc2e010e225c1afece718668542e974779172b9373968c07061
- scripts/personal-guide-browser-regression.js: SHA256 4e516b50a317c2d492c95cc6de714f8f6d1c6ec0a4bd7add0f127b32678dbbcf
