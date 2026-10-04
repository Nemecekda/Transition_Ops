# October 4: keep jump destinations visible

EDIT MODE. Starting HEAD d59a599 on codex/member-planning-loop; tracked files clean and existing untracked work preserved. Fresh origin/main is 863519c3fbf2ee8270b536702b5bf630b89638d4; merge base b499cdb49b0b9344fe6b59076c4e80c0052fc98f. Upstream contains only the PR109 merge relative to that base, with no implementation diff. Local d59a599 completion/reopen behavior is preserved.

The mobile capture from the earlier completion review showed the sticky header covering a jump destination. The app now measures header height and sets native document scroll padding, updating on resize and header size changes. Cleanup restores the prior padding. No copy, eligibility, saved data, model calls, collector code, schedules or budgets changed. Local candidate cache189 -> cache190.

OBSERVED synthetic local: start-aligned Home heading stays below the header at 320, 375 and 900 CSS pixels, including width changes in one session. Saved-step completion still works. Expected benefit is a hypothesis: members can see where a navigation jump took them. No field performance or retention conclusion.

An experimental focus-event correction did not pass the synthetic obstruction case and was removed. The final change is native scroll padding only; it does not claim to repair every possible focus obscuration. Final screenshots inspected at 320px. Evidence and local fixture: scratchpad/focus-navigation-20261004/.

Final checks: six regression commands exited 0 (OpenAI migration, service-worker privacy, privacy network, runtime AI spend, accessibility release, member loop). Structural parsing passed 137 tracked/inline records including modules; whitespace, added-line encoding and pre-commit checks passed. PUBLIC BUILD PASS: 64 files -> dist. Header helper expected/actual 1; removed focus helper expected/actual 0; cache190 expected/actual 1 and cache189 0. Full diff reviewed: only index.html, pwa-sw.js and this note are intended changes.

Node 24.18.1 with installed Chrome; isolated local synthetic Guard fixture, external requests blocked, no throttling or performance metric claimed. Accessibility disposition LOCAL AUTOMATION PASS. Manual AT and hosted release remain pending; the skill calibration dispositions retain these limits. No push, merge or deployment. The initial sandbox could not bind localhost; the permitted local-browser run succeeded. Remote fetch initially lacked worktree metadata access and succeeded with permission.
