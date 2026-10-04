# October 4: bring the step editor into view

EDIT MODE. Started at 21c7036 on codex/member-planning-loop with no tracked changes. Existing untracked work preserved. origin/main remains the previously refreshed 863519c with merge base b499cdb; its only unique commit is the PR109 merge, with no code difference from b499cdb. Local completion/reopen and responsive header improvements are retained.

OBSERVED code gap: choosing a suggested or alternative step opened the editor without moving focus to it. Home now focuses the editor heading and scrolls it into view for suggestions, updates, earlier-step review and alternatives, including an already-open editor. The heading avoids automatically focusing a text input. The update toggle exposes expanded state. The target-date shortcut retains its explicit date-field focus. No new copy, storage, eligibility inference, network behavior or model call.

KEEP. Expected benefit is a hypothesis: members can locate the next action after choosing a step, with less searching on a phone or keyboard. Retention and member outcomes remain unmeasured.

PASS: seven synthetic member-loop scenarios, heading focus and visibility, update focus, target-date shortcut, alternative focus, unchanged explicit-save behavior and prior completion/reopen checks. All five required regression suites passed: OpenAI migration, service-worker privacy, privacy network, runtime AI spend and accessibility release. Node 24.18.1, installed Chrome, local synthetic fixtures, external requests blocked. Dedicated 375px Guard screenshot inspected; no field or performance claims. Evidence: scratchpad/editor-handoff-20261004/.

Structural parse: 137 records PASS. Added-line encoding, whitespace and pre-commit checks PASS. PUBLIC BUILD PASS: 64 files -> dist. Presence checks: one editor heading, one openStepEditor function, three call sites; old setEditing(!editing) absent. Cache190 ->191, each expected new/old count 1/0. Itemized diff reviewed for index.html, pwa-sw.js and the targeted browser regression.

Accessibility verdict LOCAL AUTOMATION PASS; manual AT and hosted acceptance pending. Skill calibration boundaries remain unchanged. Local preview rebuilt; no push, merge, deployment, J1/S2 changes, collector replay, budgets or schedules.
