# Support outcome follow-through: root UI review

Date: 2026-10-13, America/Chicago. Local synthetic behavior, not member usefulness, retention, production or manual assistive-technology acceptance.

Tested app SHA-256: `b3dad4a2aabaa7592239fb328c324fddc5f2b1dbc410c02a49138fa573d1e086`. Worker cache283. Local server port18778, Codex in-app browser with a fresh synthetic origin. Public build282 was not modified by this work.

## Observed

- Direct Wisconsin guide opened and saved the neutral support step. Home offered the exact guide, Update this step and What happened next.
- Waiting for a reply opened a proposed follow-up while the original remained unfinished. Keep current step followed by reload retained that original unfinished action.
- They asked for documents opened an editable action. Replaced it with the invented instruction: Prepare my resume and a list of roles for the Job Center appointment. Save next step followed by reload and Open my support step recovered the exact text in its editor.
- I need another option followed by Use for this visit changed the in-tab action, with a temporary status. Reload recovered the earlier saved document-preparation action.
- Mark step complete followed by Ready for the next step offered an editable agreement prompt and stated that readiness does not mean approved funding or enrollment. Cancel preserved completion; Reopen completed step returned it to unfinished.
- Viewport375x812 reported document width371; viewport320x740 reported316. No horizontal overflow. Current step and planning focus were visible above the focused editor at375px. Controls stayed in document flow with the fixed bottom navigation.
- `mobile-review.png` shows the local document-request review using synthetic content. No document was uploaded or provider contacted.

## Date input distinction

CUA locator fill visibly set2026-10-20 in the date control but did not propagate it to the saved action, even after Tab. This was reported for independent reproduction rather than treated as a passing date test. The independent reviewer then used actual Chrome mouse/Arrow-key events (no DOM setter for the date) and verified2026-10-20 persisted through save, reload and reopening. This supports native Chrome input behavior. The CUA fill method and native iPhone date-picker behavior remain separate limitations.

## Other evidence and limits

Independent review covers old-to-support focus review, worksheet preservation, stale state, failed saves and native date input. The implementation uses the existing action/guide storage and explicit review controls. Optional Navigator assistance remains the existing consent-based route; no new model behavior or paid API request was tested. Manual screen-reader rows and real uncoached phone sessions remain pending. The companion PHONE-WALKTHROUGH.md is a test plan, not completed participant evidence.
