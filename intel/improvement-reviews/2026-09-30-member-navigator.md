# 2026-09-30: member plan to Navigator handoff

EDIT MODE. Initial status: no tracked edits; existing untracked .netlify, review receipts/baseline/backlog, and scratchpad evidence preserved. User authorized continued improvement of the local member planning loop. This is implementation evidence, not a scheduled performance review or publication.

Base: a0864f611b61366f5bbb5e6c20c2836879cea8ed, branch codex/member-planning-loop. Candidate remains cache184, unpublished. Prior live release was recorded as 52f1394/cache183; production was not re-audited or changed in this iteration. origin/main was refreshed successfully and remains 261f48f983418692cf619bfb5585441b27edf63e. Prior local release work remains ahead of GitHub; synchronization remains separate from this local preview.

## Change and member consequence

Home now offers an optional, unchecked selection of direction, target, goal, matching current step, service path, and current blocker. Opening a draft does not send it. Navigator shows an editable question with an explicit send button, a scoped processing notice, and a return to the member's next move. Existing Navigator chat and unsent text remain intact. Drafts can be resumed or explicitly discarded. A changed direction does not expose the previous step as the current step. The answer does not mutate the saved plan or establish eligibility.

Navigator tool tokens now render as native buttons with minimum 44px targets and destination focus. Existing full-guide requests explicitly reveal the existing chat panel, preserving that flow even after a plan draft was opened.

Expected benefit is a hypothesis: members who need help can carry relevant context into a question and return to a concrete next action with less re-entry and less navigation uncertainty. No field usefulness, retention, or actual model-answer quality was measured.

## Evidence and privacy dispositions

- CODE-OBSERVED + RUNTIME-OBSERVED / SUPPORTED / KEEP: draft opening sends no request and does not advance the pilot count; selection defaults off; the submitted app payload contains one reviewed question, empty context, null daysOut, and no guideContext. Synthetic unselected goal/role/status/date and prior chat are absent. This is a claim about app-authored request content, not platform metadata or provider retention.
- CODE-OBSERVED + RUNTIME-OBSERVED / SUPPORTED / KEEP: existing chat and unsent text survive; answer/retry/limit handling stays in the separate plan panel; saved action storage is unchanged. Draft/answer state uses page memory, with no new storage schema or telemetry.
- CODE-OBSERVED / SUPPORTED / KEEP: existing shared endpoint, models, budgets, server guards, and store:false wrapper are unchanged. Runtime spending regression passes with stubs. Provider/account retention remains UNVERIFIED / HOLD FOR EVIDENCE; the notice makes no zero-retention promise.

## Validation

Local synthetic lab checks only. Chrome 154.0.8037.92 headless on this Mac; draft reflow at 320/375/1280 CSS pixels, 900px height, DPR1, mobile emulation. No CPU/network throttling and no performance metric claimed. External requests blocked; Navigator replies stubbed. A 375px screenshot was visually inspected. Evidence is in scratchpad/member-navigator-20260930/. Tested index.html SHA256: 657dfef07999fea37fc71bb975365d3df3358f158e0f358198338976b54ffdf6. Focused runner SHA256: b1c9a8f0d64e82c17e960a936d5d4de336168443f60754dd3fa344060311fec0.

- New member-navigator-browser-regression: unchecked context, zero-call drafting, exact isolated payload, preserved chat and unsent text, editable retry, daily-limit denial without request, resume/discard, return focus, reflow, native tool-button target size, no JS exceptions.
- Existing member-loop browser suite: active, separated, retired, Guard/Reserve (career change and skills), and spouse scenarios pass. Existing personal-guide browser regression passes.
- Required openai-migration, sw-privacy, privacy-network, runtime-ai-spend, accessibility-release all pass. Initial sandbox Chrome abort was resolved by authorized local browser execution; a test-selector escaping error was fixed before the successful focused run.
- Inline JS/JSON and all tracked JS/MJS/JSON/YAML plus intended new test parsed successfully (129 inventory results). Added-line encoding, diff whitespace, and pre-commit pass. Public build: 64 files.
- Accessibility disposition: LOCAL AUTOMATION PASS. Manual AT and hosted release acceptance remain pending; no WCAG certification or release clearance claimed.

No J1/S2, new paid runner, live model request, account, telemetry, email, schedule, budget, merge, push, or deploy action. No skills or registry changes. Local preview: http://127.0.0.1:18763/?tool=dashboard (HTTP200 confirmed after rebuild).
