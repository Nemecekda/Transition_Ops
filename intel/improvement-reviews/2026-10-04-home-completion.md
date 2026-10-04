# October 4: complete and reopen a saved step from Home

EDIT MODE: tracked tree began clean at b499cdb; existing untracked evidence preserved. Fresh origin/main is 863519c, the merge of this branch, with no additional upstream implementation changes. Live HTML matched the local baseline exactly and the live worker reported cache188. Dean requested continued app improvement; this iteration is local only.

Home now offers Mark step complete for a saved current-direction step, and Reopen completed step after completion. Each action explicitly saves progress immediately on this browser. Text, target date and context remain intact. Completion reveals the existing reflection/next-step flow and suppresses the member's own date reminder until reopened. No eligibility or outcome is inferred.

Quick completion is withheld while the editor is open or its draft differs from the saved step. The handler rechecks saved content before writing so a previously changed browser copy is not silently overwritten. Storage-write failure leaves the page state unchanged and announces failure. This check is not an atomic cross-tab transaction; a simultaneous write between read and write remains outside the tested protection. No new key, tracking, server request, AI call or history store.

OBSERVED local synthetic behavior; KEEP. Expected benefit is a hypothesis: less effort to maintain an accurate plan and resume the next useful action. Retention and member outcomes remain UNMEASURED.

PASS: expanded member-loop tests across seven visitor/path scenarios, completion/reload/reopen preservation, unsaved draft withholding, denied storage, changed saved-copy refusal and focus return; existing member-Navigator suite; five required OpenAI migration, service-worker privacy, privacy-network, runtime AI spend and accessibility suites. Synthetic/stubbed AI only. Structural inventory 153 records passed; added-line encoding, whitespace, pre-commit and deterministic64-file public build passed. Node24 tests use installed Chrome; isolated unthrottled local sessions with external requests blocked. No performance metric claimed. Dedicated 375px Guard visual fixture inspected; helper initially had an incorrect local import path, fixed before successful capture. Evidence: scratchpad/home-completion-20261004/.

Accessibility disposition LOCAL AUTOMATION PASS; manual assistive-technology and hosted candidate acceptance remain pending. Cache188 ->189 before tests. Preview warranted before publication. No push, merge, deployment, J1/S2, budget, schedule or policy-content change in this iteration.
