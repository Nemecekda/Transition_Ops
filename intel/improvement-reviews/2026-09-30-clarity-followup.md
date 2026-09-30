# Clarity follow-up - 2026-09-30

Scope authorized by Dean: clearer Home buttons, then "keep working". Continued the unpublished cache183 experience candidate from ff2b139. Production remains the previously published cache182; remote synchronization remains pending, and remote refs were not refreshed during this local-only follow-up.

Implemented:
- Fresh checklists say Start; task/document progress changes the wording to Continue. Checklist and document buttons name their destinations. Partial-checklist routing is preserved.
- Home resource entry opens the complete resource directory with neutral browsing filters. These are directory filters, not member eligibility determinations. Dedicated document shortcuts still select Documents and focus its heading.
- Ten resource topics remain available through one labelled native selector, replacing horizontal scrolling and abbreviated labels.
- Workplace-group information remains available in a collapsed disclosure.

Evidence: local Chrome synthetic fixtures with external calls blocked/stubbed. All ten topics tested at 320 and 375 pixels without document overflow, explicit Home-to-directory route, document shortcut/focus, fresh checklist wording, search, Career shortcuts, saved guide and offline paths. Dark 375 Resources screenshot visually reviewed; Home screenshots retained. First browser run passed; screenshot rerun timed out at pre-existing career-guide return-focus assertion; an unchanged rerun passed. The timeout is retained as an unresolved intermittent test observation, not suppressed or counted as a pass. No source change was attributed to this timeout.

Required gates: openai-migration, sw-privacy, privacy-network, runtime-ai-spend, accessibility-release PASS. Home-actions logic PASS. Public build PASS (64 files). Inline JS and JSON-LD parse PASS; tracked JS/MJS, JSON and YAML parse PASS; encoding, diff whitespace and pre-commit checks PASS. No workflow edits. Full resource content, eligibility badges and verification markers were retained unchanged.

Accessibility: LOCAL AUTOMATION PASS only. Manual AT and hosted release acceptance remain pending; calibration dispositions from prior pass remain applicable. No new member, field performance or retention evidence. Usability benefit remains a hypothesis.

Logs and screenshots: scratchpad/clarity-20260930/. Local preview rebuilt at http://127.0.0.1:18763/?tool=dashboard . No production deployment, remote write, schedule, budget or J1/S2 change.

index.html SHA256: a89036c8cfc1628cfda435b1eb2a32220631900f1fc5f23405655694ec3b3693
