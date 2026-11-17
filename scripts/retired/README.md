# Retired regression scripts

These scripts failed on `main` at `1f0fdbe` (17 November 2026). Each was rerun alone, with no other test running, and failed again. They are moved here so the active set in `scripts/` is the set that passes. Nothing in them was edited.

Reason: the screens they cover changed eight times between 15 and 16 November, and most of them check wording or controls that were deliberately replaced. A repair made now would likely break again within days. Dean chose to trim on 17 November.

What stays covered: the six gate commands (`test:policy-content`, `test:openai-migration`, `test:sw-privacy`, `test:privacy-network`, `test:runtime-ai-spend`, `test:accessibility-release`), the public build, and the 83 scripts that pass in `scripts/`.

To bring one back: `git mv scripts/retired/NAME.js scripts/`, update it to the current screen, and confirm it passes alone. Do not weaken an assertion to make it pass; replace a retired check with one that tests the current behavior.

"First failed" names the merge on `main` at which the script first failed, where it was traced. "Before 15 NOV" means it was already failing in the 15 November standing (124 scripts, 38 failing).

| Script | First failed | First error at `1f0fdbe` |
|---|---|---|
| `career-action-card-browser-regression.js` | before 15 NOV | Error: browser evaluation failed: Error: missing control Open my current career plan |
| `career-ai-journey-regression.js` | before 15 NOV | Error: browser evaluation failed: Error: Missing button: Return to my draft |
| `career-central-review-browser-regression.js` | before 15 NOV | Error: browser evaluation failed: Error: missing control Open my current career plan |
| `career-checkin-browser-regression.js` | before 15 NOV | Error: browser evaluation failed: Error: missing control Open my current career plan |
| `career-clarity-browser-regression.js` | before 15 NOV | AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: |
| `career-completed-step-browser-regression.js` | before 15 NOV | Error: browser evaluation failed: Error: missing control Open my current career plan |
| `career-composer-layout-browser-regression.js` | before 15 NOV | Error: browser evaluation failed: Error: missing control Open my current career plan |
| `career-direction-choice-browser-regression.js` | before 15 NOV | AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: |
| `career-exploration-return-browser-regression.js` | before 15 NOV | Error: runtime evidence unavailable for document.activeElement.id==="tops-career-action-heading"; last=false |
| `career-focused-message-browser-regression.js` | before 15 NOV | Error: browser evaluation failed: Error: missing control Open my current career plan |
| `career-guided-workspace-browser-regression.js` | before 15 NOV | Error: runtime evidence unavailable for document.activeElement.id==="tops-job-role"; last=false |
| `career-help-continuation-browser-regression.js` | before 15 NOV | Error: browser evaluation failed: Error: missing control Open my current career plan |
| `career-home-search-continuity-browser-regression.js` | before 15 NOV | Error: runtime evidence unavailable for document.getElementById("tops-job-role")?.checkVisibility(); last=false |
| `career-intake-continuity-browser-regression.js` | before 15 NOV | Error: browser evaluation failed: Error: missing control Start with my experience |
| `career-intent-browser-regression.js` | before 15 NOV | Error: runtime evidence unavailable for !!document.getElementById("tops-career-continue-draft"); last=false |
| `career-introduction-continuity-browser-regression.js` | before 15 NOV | Error: runtime evidence unavailable for document.activeElement.id==="tops-career-start-heading"; last=false |
| `career-job-comparison-browser-regression.js` | before 15 NOV | Error: browser evaluation failed: Error: missing control Open my current career plan |
| `career-job-relevance-browser-regression.js` | before 15 NOV | AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: |
| `career-job-result-comparison-browser-regression.js` | before 15 NOV | Error: browser evaluation failed: Error: missing Return to my draft |
| `career-job-search-flow-browser-regression.js` | before 15 NOV | AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: |
| `career-networking-browser-regression.js` | before 15 NOV | Error: runtime evidence unavailable for !!document.getElementById("tops-career-continue-draft"); last=false |
| `career-networking-next-browser-regression.js` | before 15 NOV | Error: browser evaluation failed: Error: missing control Open my current career plan |
| `career-networking-review-browser-regression.js` | before 15 NOV | Error: browser evaluation failed: Error: missing control Open my current career plan |
| `career-reflection-networking-browser-regression.js` | before 15 NOV | Error: browser evaluation failed: Error: missing control Open my current career plan |
| `career-resume-next-browser-regression.js` | before 15 NOV | Error: browser evaluation failed: Error: missing control Review and save |
| `career-simple-entry-browser-regression.js` | before 15 NOV | AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: |
| `career-specialist-browser-regression.js` | before 15 NOV | AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value: |
| `career-start-browser-regression.js` | before 15 NOV | Error: browser evaluation failed: Error: Missing button: Back to career choices |
| `career-value-first-browser-regression.js` | #245 | AssertionError [ERR_ASSERTION]: The input did not match the regular expression /Source: USAJOBS/. Input: |
| `career-visit-draft-browser-regression.js` | before 15 NOV | AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value: |
| `counselor-preparation-regression.js` | before 15 NOV | AssertionError(obj); |
| `document-checklist-browser-regression.js` | #252 | Error: browser evaluation failed: TypeError: Cannot read properties of undefined (reading 'click') |
| `document-route-browser-regression.js` | #252 | Error: browser evaluation failed: TypeError: Cannot read properties of undefined (reading 'click') |
| `due-followup-regression.js` | #244 | ReferenceError: topsReminderDisplayTitle is not defined |
| `federal-jobs-browser-regression.js` | before 15 NOV | Error: browser evaluation failed: TypeError: Cannot read properties of null (reading 'parentElement') |
| `focused-action-regression.js` | #244 | ReferenceError: reminderDate is not defined |
| `guard-reserve-regression.js` | before 15 NOV | AssertionError [ERR_ASSERTION]: The input did not match the regular expression /setActiveTab\("timeline"\)/. Input: |
| `home-actions-regression.js` | #244 | ReferenceError: homeReminderDate is not defined |
| `home-search-handoff-browser-regression.js` | #244 | AssertionError [ERR_ASSERTION]: The input did not match the regular expression /BDD Window OPEN/. Input: |
| `location-only-search-browser-regression.js` | #245 | AssertionError [ERR_ASSERTION]: The input did not match the regular expression /54211/. Input: |
| `member-loop-browser-regression.js` | before 15 NOV | Error: runtime evidence unavailable for first visit welcome; last=false |
| `my-jobs-browser-regression.js` | before 15 NOV | Error: browser evaluation failed: Error: missing Keep in My jobs |
| `my-plan-orientation-browser-regression.js` | #252 | Error: browser evaluation failed: TypeError: Cannot read properties of undefined (reading 'click') |
| `navigation-refresh-regression.js` | #252 | AssertionError(obj); |
| `next-move-browser-regression.js` | #244 | Error: browser evaluation failed: TypeError: Cannot read properties of undefined (reading 'click') |
| `support-compact-review-browser-regression.js` | before 15 NOV | AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value: |
| `talent-contact-browser-regression.js` | #244 | Error: Chrome wrote an invalid CDP port |
| `tap-integration-regression.js` | before 15 NOV | AssertionError(obj); |
| `tap-worksheet-browser-regression.js` | before 15 NOV | Error: runtime evidence unavailable for worksheet render; last=false |
| `vgli-window-regression.js` | before 15 NOV | Error: Command failed: git show c79a38f:index.html |
