# Home search: open the chosen result and return to it

Date: 2026-10-13. Status: local candidate; no publication requested or performed.

A Home search result previously discarded its reminder/window identity and opened a general tool page. The selected BDD reminder was collapsed among 81 reminder controls in the root's phone fixture. The chosen reminder now opens its existing focused detail, with one Back to search control. Returning keeps the exact query and focuses the selected result. Results use readable title-first rows, sentence-case categories, and an explicit external-new-tab label.

Critical results expand/focus the existing native disclosure when its date and service-profile gates permit. Without a date, the selected title and return control remain above the existing date form. A profile-excluded item stays excluded, with that limitation shown. Neither search nor opening a result completes a task, changes eligibility, assigns a date, saves a plan, or sends a query. Choosing All reminders or a critical-window filter intentionally leaves exact-search mode while retaining the Home query. Other internal tool searches also retain the in-tab query; their existing tool routes remain in use.

## Scope and continuity

- Base: cd5cd5b6f83bd0d1d2b40cbcf849237ca290c798. Remote main refreshed read-only and unchanged at 2fbd8b4e1a87ac4b20b104290604e78c33d708b1; merge base is that main. Before this pass, branch has four local commits beyond main. All prior Career, Wisconsin, support outcome, continuity and compact-review changes remain.
- Code: index.html, pwa-sw.js (cache285 to286), one focused browser regression. Exact bytes in candidate-manifest.json.
- New request context is transient App memory only. Query was already transient; it is no longer cleared when opening an internal result. Refresh resets this search context. Browser Back and repeated selection are tested; exact Forward restoration is unchanged baseline behavior and is not claimed.
- Existing timing/status calculations, sources, policy text, completion stores, profile filters, Resume/AI/provider controls, push setting, storage/schema, schedules and budgets are unchanged.
- Existing non-search Home reminder return intent is preserved. Manual browse controls only clear the new search-origin intent when one exists.

## Observed local results

Root's matched BDD fixture, 375x812, same saved synthetic support step and no separation date: generic list had 81 reminder buttons with the collapsed target at y2308.4. Candidate opens the exact detail, no list buttons, heading y403.8. Back restores the exact BDD result and query; full focus ring visible. Final375 light and320 dark have no horizontal overflow. See ROOT-REVIEW.md and screenshots.

Author's separate synthetic Guard fixture,375x812, same final build: focused reminder has76 descendants under the main content wrapper versus868 for the full directory;0 other reminder cards versus78. This demonstrates less rendered content for this task, not improved network loading, measured responsiveness, field speed or retention. No memoization or search algorithm change was justified or made.

## Validation

All commands completed with exit0 on the final index hash f419f3b84c4569e17752f5ca68ec562a722d3c91b63fca05a4caafed60a0a260:

- Five mandatory gates: openai-migration, sw-privacy, privacy-network, runtime-ai-spend, accessibility-release.
- New home-search-handoff-browser-regression: exact ITP/BDD selection, query/focus return, native Back/repeated selection, completed reminder preservation, no-date critical gate, active/Guard applicability, native critical disclosure keyboard control, manual filter exit, unrelated route/reload cleanup,375/320 reflow,44px targets, result hierarchy and external-link markers; unchanged plan and no member-data/provider request.
- Existing home-actions-regression and reminder-count-regression (including browser): priority/day-boundary semantics, dismissal, full-library escape, existing Home return focus, count persistence and responsive behavior.
- Structural/encoding/whitespace/full source inventories are recorded separately in gate-logs/structural.log. Functions/build/config/workflows unchanged, so4N/4B/4S are not applicable.
- Independent review and root visual evidence are separate receipts in this directory.

Evidence disposition: LOCAL AUTOMATION PASS only. Manual assistive-technology matrix, native phone testing, hosted release and real-member usefulness/return outcomes remain unmeasured. No paid API call, delivery, telemetry, account setting, push, merge or deploy occurred. Preview: http://127.0.0.1:18778/?tool=dashboard .

## Honest execution notes

The first reviewed edit script applied its counted app substitutions but stopped on a cache-name assertion (it expected tops-v285; actual name transition-ops-v285). The finish script replayed every app substitution from HEAD and required exact equality with applied bytes before updating the correct one cache token. The extra two mobile styling changes and two navigation-boundary corrections were discrete counted edits. No wholesale file replacement was used.

The first browser test's external-link assertion searched Wisconsin, which currently returns the internal guide without an external result. All earlier scenarios passed. The fixture was corrected to the actual Hire Heroes resource and the entire focused test passed; no app change was needed. The initial log is retained. Temporary node_modules links used existing installed dependencies and are removed before commit.
