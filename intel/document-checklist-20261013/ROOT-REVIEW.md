# Document checklist — root observations,2026-10-13

Authorized iteration: simplify the member experience. Local only; no publication.

Baseline657f790 (indexf419f3b,cache286), Codex in-app browser on localhost18778,375×812 CSSpx, light theme, prior synthetic saved support step and0/12 obtained documents. MyPlan→Documents lands on Resources and support, Benefits selected in bottom navigation, Document checklist selected in topic dropdown, then heading DOCUMENT VAULT and SECURED0/12. Checkbox-shaped marks are inside BUTTON elements with no checked semantics. Toggling synthetic d1 changes text to `✓ DD214 (Member-4 Copy)…` and count1; root restored it to0. No real document or member record used. Screenshot before-375.png visually inspected after viewport settled.

Evidence class OBSERVED for local behavior only. Document descriptions and eligibility content are existing app content, not independently verified in this UI review.

Agreed scope: native checkboxes with unambiguous names/states; readable titles/unchanged descriptions and separate sources; consistent checklist naming; documents under My Plan with clear return; honest readback-based persistence status using existing docProgress only. No document upload/storage feature, policy changes, external APIs, telemetry, paid calls, schedules or deployment.

## Final candidate observations

Final34e0b310 /cache287, reloaded before verification. Root direct UI checks on375×812 light and320×812 dark:

- My Plan→Documents focuses tops-plan-documents, selects My Plan in primary navigation, shows Document checklist page title and Your checklist section. The section scrolls into view with Back to My Plan and explanation visible; irrelevant workplace-group/category controls are absent here.
- Twelve native named checkboxes expose checked state. Checkbox labels are at least44px high. Titles are16px, notes14px, without strike-through; obtained text remains explicit. Existing descriptions are unchanged.
- Native Space toggled synthetic d1 from0→1, count updated and saved confirmation appeared. Back to My Plan focused tops-plan-shortcut-resources. Reload, then Documents recovered the checked state. Root unchecked it afterward, restoring the initial0/12 fixture.
- All tools→Resources opens Resources and support, category directory, Benefits selected. The resource picker is present there.
- VGLI source remains outside any label, so it is structurally separate from toggling. Actual intercepted source-click and failure/restore behaviors are independent tester evidence, not root claims.
- No horizontal overflow:371px document within375px viewport,316 within320. Both obtained/unobtained native checkbox appearances visually inspected. Ordinary vertical scrolling remains necessary for the full checklist.

Screenshots after-375.png and after-dark-320.png show a temporary synthetic obtained flag for demonstration. It was returned to0 afterward. No real document file was uploaded; no provider/model call or member material was used. The local saved flag is the only intentional task-state change, restored to its starting value. Native phone, manual AT, hosted acceptance, field performance and real-member usefulness remain unmeasured.

## Final focus-only delta

Candidate6372f28c/cache287 adds focus when the full Resources topic selector switches to Documents. Root reloaded the Resources directory, selected Document checklist through the visible native selector, and confirmed focus landed on H3 tops-plan-documents rather than BODY. My Plan remained selected and0/12 synthetic flags were preserved. The final change is only the selector continuation-focus handler; the34e0b310 layout screenshots remain representative. Independent review passed the final candidate and retained the unchanged storage/restore checks with explicit comparability boundaries.
