# Validation gate — EDIT MODE

Final index SHA-256: `cb52b2ee4c308c7dbc8079674271a930f92b6121da32f17a9b7f4a038b7dffd7`. Six final code/test hashes are retained in `candidate-hashes.json`. All commands below exited 0 on the final source bytes.

| Gate | Result | Retained evidence |
| --- | --- | --- |
| Inline JS/JSON, tracked and added JS/MJS/JSON, multi-document YAML parser inventory | PASS | gate-logs/structural-final.log |
| Added encoding, expected surface counts, whitespace diff | PASS | gate-logs/structural-final.log |
| OpenAI migration + support pathway dry-run, unknown rejection, no provider calls | PASS | gate-logs/openai-final.log |
| Service-worker privacy and exact public-build allowlist | PASS | gate-logs/sw-final.log |
| Browser privacy/network boundaries | PASS | gate-logs/privacy-final.log |
| Runtime AI spend synthetic controls | PASS | gate-logs/spend-final.log |
| Accessibility release automation, 320/375 portrait/landscape, 200%/400% zoom | LOCAL AUTOMATION PASS | gate-logs/a11y-final.log |
| Required actual Netlify function packaging, 4N | PASS | gate-logs/package-final.log |
| Policy content, 96 assertions and 1110 parity vectors | PASS | gate-logs/policy-final.log |
| Navigation token assertions | PASS | gate-logs/nav-final.log |
| Existing Career entry, continuity, history and consent | PASS | gate-logs/career-final.log |
| Existing WI discovery, eligibility-safe wording, official links and mobile controls | PASS | gate-logs/wi-base-final.log |
| WI next-step, save/visit/cancel/conflict/failure, editable questions, direct-link and backup paths | PASS | gate-logs/wi-follow-final.log |

4S/pinned workflow refs: N/A, no workflow change. 4B: N/A, no builder boundary change; existing builder assertions run through SW privacy. 4N is applicable because Navigator's enum changed. PATH-resolved Netlify CLI 26.1.0 / zip-it-and-ship-it 14.7.1 packaged actual function config and files; Navigator and Resume resolve OpenAI 7.8.0, Blobs 10.7.13, otel 6.0.6, runtime-utils 2.3.0. Jobs excludes all four. No clients/stores were created by packaging and no credentials/provider traffic were used.

Conditions: synthetic local data; Node 24.18.1; Chrome 155.0.8059.41; isolated temporary browser profiles and denied external connections. Clipboard success/denial is stubbed. Existing dependencies were temporarily copied locally for packaging, without install/download, then removed. No member records were used.

Findings fixed before final pass: no-op URL query mutation changed percent-encoded spaces, which made the strict accessibility route wait fail; URL mutation is now conditional and a regression preserves ordinary encoding. Review also closed malformed saved-byte overwrite risk, neutral-support caller filters, and server allowlist compatibility. Initial sandbox-restricted local server/browser attempts could not run and were repeated with authorized local execution. Initial packaging with a dependency symlink failed; a real copy of the same existing dependencies produced the retained PASS. None of these earlier attempts is cited as acceptance evidence.

Manual AT rows remain PENDING: NVDA/Firefox, VoiceOver/Safari, TalkBack/Chrome; no blanket WCAG-conformance claim. Hosted deployed acceptance and actual mobile-device/member usability remain unmeasured. Root screenshots/visual checks and independent keyboard/mobile synthetic checks are separately documented.

**GATE PASS (local edit validation). Publication not performed.**
