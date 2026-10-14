# Compact support review: root visible UI evidence

Date: October 13, 2026 (America/Chicago). Local browser lab, synthetic data. No uncoached member or retention measurement.

## Before

Candidate ec6506a, index SHA-256 51b3c1e8569ed44233764aca807de113253f9724a0e9f56e6c4ef4ae6cd2a81e, cache284.

Codex in-app browser at 375 x 812 CSS pixels, light theme, Home. Saved synthetic support step: Ask the Job Center which work tools I should discuss at my appointment.

Choose They asked for documents. Default proposed text: Confirm which documents the provider requested and how to share them through its official channel. No target date.

Measured from rendered DOM after review-heading focus:

- Whole next-move card height: 1309.4375 CSS pixels.
- Review heading top relative to card top: 330.875 CSS pixels.
- Save button top relative to card top: 884.375 CSS pixels.
- Viewport review heading top: 134.875; Save top: 688.375; Save bottom: 732.375.
- Document width 371 CSS pixels at viewport width375.

The large current action, direction and disabled outcome selector appear above the review, where current action and focus repeat. This finding concerns density and duplication, not inability to operate the current controls. Some controls already fit after automatic scrolling; no claim that Save was universally invisible.

## Acceptance scope

One focused review with exact original action/status/date once, proposed editable action, optional personal target date, conditional focus change and explicit saving choices. Keep conflicts visible, preserve save/visit/cancel and retained-draft behavior. No fixed-height clipping, tiny type, new storage or AI call. Compare the same fixture and measure layout only, not member usefulness.

## After

Final app SHA-256 dab0b79095bf4a6856e25e35942a31aa8b384f52885db440de2561e4c025864e, cache285. Same saved text, documents outcome, stock proposed text, empty date, light theme, Home and 375 x 812 viewport as the baseline.

- Card height: 822 CSS pixels (before1309.4375).
- Review heading top from card:49 (before330.875).
- Save top from card:578 (before884.375).
- Viewport review heading top:135; Save top:664; Save bottom:712.
- Document width371 CSS pixels at375 width.

The card is about37% shorter for this exact example. Heading-to-Save distance changed from553.5 to529 pixels, so the evidence supports less repeated content and a shorter card, not a large reduction in scrolling after automatic focus. Longer text and focus-change disclosures still require normal vertical scrolling. No fixed-height clipping was introduced.

Visible UI checks on final-copy candidate32616637 (before one picker-only CSS correction): edited Proposed next step survives Wisconsin-reference navigation to My Plan; cancelling restores the outcome selector and the exact prior saved action heading. That state logic was unchanged by the final CSS delta.

Final-byte checks: 375px light and320px dark reviews render the exact current action once with a labeled proposal, optional date, saving/using boundary, primary Save and secondary choices. The heading receives focus. Dark320 document width316 at320 viewport; no horizontal overflow in either root fixture. The independent reviewer owns long/completed/conflict cases and the author owns required regression suites.

A low-contrast native date icon was observed in the dark320 view. The input already inherited color-scheme:dark; the existing global calendar-indicator inversion was still applied. A support-date-only filter:none correction visibly restores the icon. Final computed native scheme is dark in tactical mode and light in light mode; the support indicator's filter is none in both. No other date field or global theme rule was changed. No native iOS picker or universal accessibility claim is made.

Screenshots: light-375.png and dark-320.png. They were captured and visually reviewed from the final app bytes above. All content is synthetic. No external links, provider request, AI submission, paid call or member data were used in root checks. Field usefulness, retention and manual assistive technology remain unmeasured.
