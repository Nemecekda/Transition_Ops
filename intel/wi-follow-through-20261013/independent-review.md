# Wisconsin follow-through independent review — October 13, 2026

**Verdict: LOCAL AUTOMATION PASS for this bounded change. No unresolved finding in the reviewed scope.** This is not a manual assistive-technology or hosted-release sign-off.

Reviewer: `/root/j1_diagnostic_review`, independent from the builder. Candidate follows base `6c34c30`. No app, provider, account, automation, or production-state edits were made by this reviewer; only these evidence files were written.

## Exact candidate

- `index.html` SHA-256 `cb52b2ee4c308c7dbc8079674271a930f92b6121da32f17a9b7f4a038b7dffd7`
- `pwa-sw.js` SHA-256 `c1955745c3a14b2f7b0dbf01827cb586e9efa19a23a67924cccb8fa94577dc36`
- `netlify/functions/navigator.mjs` SHA-256 `ca9f23fdc2e13346164834e92da9b2e421c9cc64afa0cf985c5ec3b960741bcc`

The six-file builder manifest was independently matched to disk; its exact values and manifest hash are included in this receipt. Three files above are runtime code/cache; the other three are focused regression files.

## Independent checks

Thirteen focused browser cases passed against an unchanged candidate during the run. Conditions: isolated headless Chromium via CDP, synthetic Guard profile and invented career data, loopback-only app server, external requests blocked, clipboard success/denial stubs, native Enter and Backspace events, 320/375 CSS-pixel mobile viewports. This is lab evidence, not member research or field performance evidence.

- Fresh member: review visibly proposes “Get work or training support”; no unrelated career-choice gate. Cancel returns focus. Visit-only appears on Home without changing storage and disappears on reload. Fresh explicit save and reload recover the Wisconsin step.
- Existing work: review shows the earlier step/date and requires explicit replacement. Guide/worksheet bytes remain unchanged. Cancel, newer-tab conflicts, unreadable guide/action/worksheet, and injected save failure preserve saved bytes. Unfinished Career edits survive cancel and visit-only replacement.
- Return journey: Home/Career reopen the expanded, focused guide; public deep link and browser Back work. Completing a support step routes to generic resources rather than assuming a career change or ongoing Wisconsin task. Both Home and full-guide support routes include all resource categories.
- Questions: exact, explicitly entered current-role/experience and chosen-role details append only on request, once, without overwriting edits. No raw resume/worksheet text is imported. The draft persists between Career and Resources in App memory and resets on reload as stated. Copy denial focuses and selects the editable text.
- Sharing: exact `origin/?tool=resources&guide=wisconsin-work-support` only; role, question, unrelated query values, and fragment do not enter the copied URL. Copy denial exposes a focused, selected read-only URL. No automatic sending occurs.
- Accessibility scope: changed controls have 44px minimum height in the tested layouts, no ordinary horizontal overflow at 320/375px, and deleting the final question character does not hide or blur the editor. Empty copy is disabled.
- Data compatibility: support guide/action/backup round-trip works; all three previous pathways remain valid; unsupported/prototype values reject. Browser checks observed no runtime exception or provider/member-content request.

An additional isolated Node VM test ran Navigator only with `NAVIGATOR_DRY_RUN=1`, a throwing client stub, synthetic requests, and no host environment/network. Support and three legacy paths returned 200 with `sent:false`; unknown/prototype/extra fields/overlength/control characters returned 400. Zero client constructions or provider calls occurred. Existing model, output cap, untrusted-data instructions and `store:false` remain unchanged.

## Review findings closed before acceptance

1. **Unreadable saved work could have been overwritten. FIXED.** The new save adapter validates non-null raw saved values with the existing guide/action/gap validators, in addition to snapshot/conflict checks. Exact-byte preservation and visit-only recovery passed.
2. **Neutral support could fall into career-specialist or employment-only routing. FIXED.** The member-loop caller excludes support from career-only rewriting; Home and PersonalGuide route support to all Resources. Generic support does not infer Wisconsin. New support default is visible and applies only when no direction exists.
3. **Navigator rejected the additive support direction. FIXED.** The existing closed pathway allowlist now includes support. Every other field/bound remains; dry-run acceptance/rejection passed.

The bounded repository-wide scan covered production HTML/JS/CJS/MJS/JSON/TS/Python/YAML and relevant test fixtures, excluding vendored dependencies and retained historical evidence. Guide/action/backup checks derive from `topsValidateGuide`; Navigator was the only additional production allowlist. Legacy three-path test loops remain compatibility fixtures, with new support coverage added. Career-only resume gates intentionally exclude support and use its explicit return adapter.

## Evidence classes and limits

Privacy conclusions are **CODE-OBSERVED** and **RUNTIME-OBSERVED (local synthetic)**. Question editing uses existing in-memory state; explicit saving uses the existing plan keys. The only server change is a pathway-allowlist addition. No new telemetry, provider submission, member data, account, paid run, or communication was introduced or executed in this review. Benefit/eligibility copy is unchanged from the S2-verified Wisconsin guide; its earlier source review was reused, not fetched again.

Manual Safari/VoiceOver, Chrome/NVDA, Edge/JAWS, Android/TalkBack and hosted release validation remain outside this receipt. Root owns the visual walkthrough and builder owns the required release gates; they are not represented here as reviewer executions. No retention, real-member usefulness, or funding outcome claim is made.

Rollback limitation: older builds do not recognize the additive `support` enum and may display the saved guide/action or backup as unreadable. Existing loaders retain raw bytes rather than silently remapping them. Restore compatible code before resuming that saved work; do not erase or reinterpret it as a different direction.

Evidence: `independent-evidence/wi-follow-through-independent.js` and `.log`; `wi-follow-through-navigator.js` and `.log`; bounded enum scan; exact-hash `receipt.json`.
