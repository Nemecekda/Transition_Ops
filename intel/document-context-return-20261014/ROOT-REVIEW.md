# Document return continuity — 2026-10-14

User intent: keep improving the app's simplicity and usability after PR148. This iteration is local implementation, not a new publication request.

Baseline: published main `7fbc9bb30ec10c7e9fd0d1318ffc4cfaefcf98f3`, same tree as PR148 candidate `4080b37ee51fc24c1e9e1192f401cadb9030f11f`, cache288. Root observed `http://127.0.0.1:18778` in the Codex in-app browser at 375 × 812, light theme, using existing synthetic test state.

Observed obstacle: More → Resources → Healthcare → Document checklist shows **Back to My Plan**. Activating it leaves Healthcare and lands in My Plan. Reaching the prior Healthcare content requires navigating Resources and selecting the topic again. Screenshot `before-375.png` and resulting UI `before-return-ui.txt` capture the mismatch. Existing native browser Back behavior is distinct and already works.

Decision: one contextual return control using only allowlisted app route identifiers in the existing history entry. Preserve the prior topic and focus, native Back/Forward, reload, saved document flags and the existing transition-checklist return. A direct or unrecognized entry must retain a safe My Plan destination. No new storage, member data, API/provider usage or policy text is needed.

Evidence class: **OBSERVED** behavior; disposition **LOCAL SYNTHETIC TEST**. Hypothesis: restoring the source topic removes avoidable navigation after consulting documents. Fewer required navigation steps can be verified; real-member comprehension, usefulness and retention cannot be inferred from that. Existing implementation, accessibility and deployment skills fully cover this correction; no registry change is needed.

Final candidate verification follows below. No actual member records or provider calls are used.

## Root local check

On runnable index SHA256 `8a2d37e29dfee8794668a1951bd67683234559441fbab52f60188e6933a07cea`, at 375 × 812 in light theme:

- Healthcare → Documents now shows **Back to Healthcare**.
- Reload retained that destination; activating it restored Healthcare and focused the topic selector.
- Browser Forward restored Documents, its heading focus and its Healthcare return label.
- Shift+Tab from the focused checklist heading, then Enter, activated the return and restored the Healthcare topic selector.
- Home → View document checklist showed **Back to Home**; activation restored Home with focus on the original `tops-continue-documents` shortcut.
- Document progress remained 0/12; the existing synthetic saved next step remained visible. Root did not toggle flags or change member-plan inputs.

Screenshot: `after-375.png`. These are local functional observations, not a physical-phone or screen-reader result. Independent review and mandatory gate receipts determine final candidate acceptance.

## Final-source follow-up

Independent review found stale Wisconsin-guide context when a member deliberately switched to Healthcare before opening Documents. The scoped fix captures the current topic; final index SHA256 is `3686af60c75d065a338065931b080d0a71f64d0d5fac79645ddc5edbf69e203d`.

Root repeated Wisconsin guide → Healthcare → Documents → reload on those bytes. **Back to Healthcare** remained correct; it restored the Healthcare heading and focused `tops-resource-topic`. Native Forward restored Documents. The checklist stayed at 0/12. Evidence: `final-after-reload-ui.txt`, `final-return-ui.txt`, `final-after-375.png`. The temporary viewport was reset and local preview left open. No publication occurred in this iteration.
