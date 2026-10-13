# Independent exact Home search review — 2026-10-13

Disposition: ACCEPT for the approved local implementation. Accessibility disposition: LOCAL AUTOMATION PASS for the affected synthetic flow only. No unresolved blocking finding in this scope; this is not hosted-release or manual AT acceptance.

## Coverage and binding

- Base: `cd5cd5b6f83bd0d1d2b40cbcf849237ca290c798`.
- Candidate index SHA-256: `f419f3b84c4569e17752f5ca68ec562a722d3c91b63fca05a4caafed60a0a260`.
- Worker SHA-256: `b7dc485d15fa3de3e8806b13152d24ad5b5dd4bdabb6ef7c9152e052c92ee0be`, cache286.
- FULL coverage from existing validation-gate1.12, accessibility-release-validation1.0 and privacy-truth-to-implementation0.2; member-return-benchmarking1.0 supplies evidence/comparability limits. No new skill needed. User's authorized simplification covers this implementation; no new approval barrier was inferred.

Member job: locate a named reminder or critical window, inspect its existing guidance, then return to the same search without searching again. The returning member can resume the same browsing task during the visit; this does not introduce persistent searches or a retention mechanism. Disposition under member-return benchmarking: LOCAL SYNTHETIC TEST. The reduction in navigation work is observed; better real-member task completion is a hypothesis.

## Observed problem and correction

Baseline375×812 local synthetic Home search for ITP opened the generic reminder directory, left `r-24-itp` collapsed at approximately728px from the viewport top, and produced no focused item title. Selecting a specific result discarded its identity. Baseline observation and screenshot are retained.

The candidate carries the existing record ID into the existing focused reminder view or expands/focuses the matching critical window. It retains the visit's query, provides Back to search and restores focus to the selected result. Result titles use clearer text hierarchy and outward links say they open a new tab. The new request context is App memory only. Reminder text, eligibility filters, date/status calculations and completion persistence are unchanged in the diff.

Three review seams were corrected before final testing: critical focus belongs to the native expansion button, All reminders clears continuation only for a search-origin request, and deliberate critical filter selection ends the exact-search context rather than leaving an unreachable return control. The query remains available on Home after that deliberate switch to general browsing.

## Independent runtime evidence

Local Chrome with all external/function requests intercepted and blocked, synthetic local records,375×812 and320×812 CSS pixels, device scale1; professional/light and tactical/dark. No provider, paid, contact, telemetry or publication action.

Passed on the exact candidate:

- Named ITP result opens the matching focused title; repeated selection and Back to search retain query and result focus across all four width/theme combinations. Back is44px high; no horizontal overflow. Saved plan/progress/profile/date values are unchanged.
- Already-completed ITP is inspected as completed without reopening or marking anything.
- An old FINANCE filter does not hide the selected ITP reminder.
- A BDD critical result without a date retains the chosen title and Back to search while preserving the date gate and saved values.
- A2020 separation fixture retains the existing closed expedited-window/standard-claim guidance. An old OPEN filter is reset for the explicit BDD selection, without changing status calculations.
- The focused critical control is a native button. Actual browser Enter events collapse and expand it while `aria-expanded` follows the state. Choosing a critical filter ends the exact-search context and preserves the query on Home.
- Guard and retired profiles searching for SkillBridge get the selected title and existing profile-exclusion context; the hidden window is not forced into view, and no profile or eligibility is changed.
- Native browser Back restores the query/result focus. Browser Forward does not restore this detail in the existing router; it leaves Home and does not resurrect stale search context. Exact Forward restoration is not claimed or added.
- All reminders, unrelated VA Math navigation and direct-route reload do not retain an inappropriate Back to search or critical search notice. Reload clears the in-memory query. The query does not appear in the URL or the tested saved plan/progress keys. No JavaScript error or member-data/provider request was observed/admitted.

The final independent log is `independent-evidence/independent-search.log`; script and observations are adjacent. S3's retained author checks include the five mandatory gates, new search handoff regression, existing Home actions and reminder-count suites. They are supporting author evidence, not represented here as independently rerun.

## Measurement and limitations

Independent ITP inspection rendered184 whole-document elements and zero directory reminder cards in each phone/theme fixture. S3 separately compared the focused BDD view with its full directory in the same build and Guard fixture:76 versus868 elements within the measured content scope, zero versus78 reminder cards. These have different counting boundaries and fixtures and must not be merged into one metric. They show reduced rendered directory work for an exact result; they do not establish faster loading, responsiveness or a percentage speed improvement. No FCP, LCP, CLS, INP or field performance claim is made.

One baseline-count retry overlapped active implementation and timed out awaiting the removed generic heading; the initial baseline observation remains the valid before evidence. Two independent harness corrections were required without app changes: the direct critical route had an incorrectly assumed page-title label, and the initial CDP Enter sequence lacked the carriage-return text used by a full native Enter event. Corrected final flow passed; exploratory logs are retained. No app failure was suppressed.

Root's separate visual review covers final light375 and dark320 search-result focus outlines and exact landing. Native phone browsers, manual assistive technology and hosted behavior remain untested by this review. Actual member usefulness, completion and retention remain UNMEASURED; no best-in-class claim or public performance claim is supported. No publication was performed.
