# Independent review: Document return context

Date: October 14, 2026. Disposition: **PASS — scoped local acceptance**.

## Coverage and finding

Existing validation-gate, accessibility-release-validation, privacy-truth-to-implementation and member-return-benchmarking skills provide **FULL** coverage. This is bounded navigation/focus work using a closed set of existing routes. No new skill or policy/provider/budget scope is required.

**OBSERVED / LOCAL SYNTHETIC TEST:** At published baseline 4080b37 (same tree as main7fbc9bb), Healthcare → Documents → visible "Back to My Plan" required three further choices (Benefits → Resources → Healthcare) to recover the starting topic. The accepted candidate returns directly to Healthcare in one action. This measures a route, not member usefulness or retention.

## Accepted bytes

- index.html: `3686af60c75d065a338065931b080d0a71f64d0d5fac79645ddc5edbf69e203d`
- pwa-sw.js (cache289): `86800106fac991d24a953071d38b5cfcfac9bea83f21495e88ea706d695cad0d`
- Author regression: `28c7aba01811dfbd3964747a7bb399f3f70cc220db23bfb68706735e85cf483a`

The source delta adds only a fixed return-key allowlist, capture/restoration in existing Documents history state, the return adapter/label, and clearing a stale return key on the existing readiness entry. No member text enters the new history field. No new localStorage key/writer, policy text, provider boundary or budget changed. Unknown/non-string/prototype return values fail closed to "Open My Plan." Existing readiness return takes precedence.

An initial source/runtime finding was corrected before acceptance: WI guide → selecting Healthcare → Documents incorrectly retained the old Wisconsin return label. The final guard requires the current directory guide surface. The exact final source delta was inspected and the mixed-origin case independently passed.

## Independent execution

Twelve grouped cases PASS in an isolated local Chrome profile with synthetic guide/action/worksheet and obtained-document flags; external and /.netlify/ requests blocked. No JavaScript errors or provider POSTs.

- All nine resource topics: correct single return label, correct topic and visible selector focus.
- Healthcare context survives refresh; explicit return and browser Back/Forward restore the intended routes.
- Three explicit-return → Forward cycles reuse the exact same parent and Documents history-entry IDs with constant entry count. Native Back also returns the original parent. Refresh adds no entry.
- Existing directory FREE filter survives in-app return; no claim of filter persistence through refresh.
- Wisconsin guide returns to its heading and fixed guide URL; selecting Healthcare after that guide now returns Healthcare.
- Both Home document controls return to the actual visible invoker after refresh, including reopening the existing optional-tools disclosure.
- My Plan returns to the Documents shortcut; readiness retains its own return control and clears stale document-return context.
- Fresh direct Documents entry creates one entry, uses "Open My Plan," stays in the app on explicit return, and later My Plan re-entry uses its correct label.
- Malformed/unknown/prototype descriptor values are discarded and never reflected as page text. Descriptor absent on unrelated route.
- Document flags and saved guide/action/worksheet bytes unchanged; existing BDD search-return query/focus and unsaved support update preserved.
- At 320/375 px in both themes, the longest return label wraps to a 58 px button within the viewport. Native Enter returns focus to the topic selector. No horizontal overflow.

## Limits and provenance

CODE-OBSERVED source scope plus RUNTIME-OBSERVED local behavior. Parent separately performs actual UI review; builder runs required project gates. This receipt is not hosted release verification or manual assistive-technology certification. First-time uncoached usefulness, field performance and retention remain **UNMEASURED**.

Retained detailed reproduction/harness and original failing candidate results: `/tmp/tops-document-context-return-review-20261014/`. Concise JSON evidence accompanies this report. Earlier unchanged checklist persistence/backup and direct-route evidence remains in `intel/document-checklist-20261013/` and `intel/document-route-20261014/`.
