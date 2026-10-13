# Compact support review - local build

Date: 2026-10-13. Branch: `codex/support-outcome-follow-through`.
Base: local `ec6506a4378b751824f3f29529b344df08fa044a`; refreshed main remains `2fbd8b4e1a87ac4b20b104290604e78c33d708b1`.
Preview: http://127.0.0.1:18778/?tool=dashboard . Not published.

## Result

Reporting an outcome now opens one review-first card. Repeated idle headings, direction, disabled outcome selector, unrelated planning tools and the separate timing/calendar view disappear only while reviewing. The original step with its completion state and date appears once, followed by the editable proposed action and visible optional date. Required focus-change, replacement, unsaved-tab, document/privacy and eligibility limits remain visible. The Save action uses the existing primary theme treatment; Visit and Keep current step remain available.

Conflicts retain their full message and accurately label the snapshot Step when this review began. Reference links stay below the review. Cancel restores the original control and idle view. An existing calendar preview is temporarily hidden, with its state and stale guards retained. A scoped CSS rule removes double inversion from this date control's native calendar icon; light and dark schemes remain the existing app schemes.

No action template, state model, storage, validation, atomic save, original snapshot, API, AI, source policy, eligibility, budget or schedule changed. Prior navigation continuity and explicit clear/restore behavior remain intact. Cache advances284 to285.

## Measured layout, not field usefulness

The root's matched375x812 synthetic fixture shows total card height1309.4375 to822px, approximately37% shorter. Focused heading to Save improves from553.5 to529px, only24.5px. The main gain is removal of surrounding clutter, not a large reduction in scrolling inside the review.

The author's separate Guard fixture includes explicit role/goal/date context and shows:

| Direction | Total card before / after | Review section before / after | Heading to editor before / after | Heading to Save before / after |
| --- | --- | --- | --- | --- |
| Support | 1757.4 /839px | 681 /708px | 236 /238px | 572 /548px |
| Career change, exact WI step | 1898.1 /931px | 777 /800px | 332 /238px | 668 /640px |

The review section is slightly taller in that fixture because its visible notices and full-width primary Save remain. No text is truncated, no fixed height is used and no additional click is required for the date or material decision text. Long text,320px and zoom can require scrolling. These are local browser geometry observations, not proof of easier completion, retention or member satisfaction. Raw measurements, exact app hashes and replayable harnesses are in measurements/; the independent and root UI receipts record their separate conditions.

## Verification

Final index `dab0b79095bf4a6856e25e35942a31aa8b384f52885db440de2561e4c025864e`; worker `a7d764d75fe89abbe01b0c5d379ed9385de0386dc761d8daa3ef8690d71e1f46`, cache285.

- All five mandatory suites rerun on final bytes: OpenAI migration, service-worker privacy, privacy network, runtime AI spend, accessibility release.
- New compact browser regression on final bytes: h2/h3 hierarchy, one exact original action, conditional focus notice, visible safety boundaries, primary Save, stale snapshot label, completed original, calendar preview restore, long text,320/375 reflow and44px controls, no provider request.
- Adapted outcome and continuity suites plus unchanged personal calendar suite pass on32616637. The final difference is exactly the one-line native-picker CSS override; these state checks are reused. Selector adaptations retain all save/visit/conflict/draft/date assertions.
- Independent final theme/icon checks and root visual checks pass. Earlier independent light/dark layout, navigation, conflict, completion and cancel matrix is reused for that exact CSS-only delta.
- Structural full inventory, added-line encoding, whitespace, exact25-substitution replay, and scope checks pass. 4N/4B/4S are not applicable because functions/configuration/dependencies/build/workflow boundaries did not change.

Changed runtime: index.html and pwa-sw.js. Tests: one new compact regression plus two narrow existing-test adaptations. Evidence only in this directory. The temporary dependency symlink is removed before local commit.

Manual assistive technology, native phone keyboards/date pickers, hosted acceptance and uncoached member usefulness remain pending. No publication or paid call occurred.
