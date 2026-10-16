# Documents return context - local handoff

Ready locally on `codex/document-context-return`, based directly on published main `7fbc9bb30ec10c7e9fd0d1318ffc4cfaefcf98f3`. The preceding release candidate branch and its evidence remain unchanged. Main was rechecked at handoff and is unchanged. No push, merge or deployment was performed for this iteration.

The visible Documents return control now goes back to the actual originating resource topic, Wisconsin guide, Home or My Plan. Healthcare now takes one return action instead of the observed detour through My Plan and three further choices. A direct link without a recognized origin says Open My Plan. Existing Readiness return takes precedence. Return labels come from fixed allowlisted values stored only in the existing browser history entry; no member text enters that field or the URL. Reload and native Back/Forward keep the destination. Unknown metadata safely falls back to My Plan. Resource filters remain in existing page memory; they are not newly persisted.

Code scope is `index.html` and one active-worker cache declaration, 288 to 289. Tests add `scripts/document-context-return-browser-regression.js` and adapt one obsolete hidden-selector step in `scripts/readiness-tool-return-browser-regression.js` to the real Back to Healthcare control, retaining its stale-return assertion. Document source data, saved checklist flags, guide/action/worksheet, policy, Resume, provider, budget, configuration and push boundaries are unchanged. No framework or storage schema was added. Production push remains OFF; the legacy and dedicated workers are unchanged.

## Validation

EDIT MODE GATE PASS on final index SHA256 `3686af60c75d065a338065931b080d0a71f64d0d5fac79645ddc5edbf69e203d`. Worker SHA256 `86800106fac991d24a953071d38b5cfcfac9bea83f21495e88ea706d695cad0d`, cache `transition-ops-v289`. All candidate hashes are in `candidate-hashes.json`.

- All five required suites passed: OpenAI migration, service-worker privacy, privacy network, runtime AI spend, accessibility release. Accessibility verdict is LOCAL AUTOMATION PASS.
- New focused context-return suite, existing full Documents route suite and the adapted six-route Readiness return suite passed.
- Independent 12-group matrix passed: closed labels, reload/history entry identity, mixed Wisconsin-to-Healthcare origin, native keyboard, long labels at 320/375 in both themes, existing search/support draft continuity, and exact saved bytes. Receipt `6a1a6277d644df4cd000b496fe1bdd80446437cbb63c4574c6ee169e9fd3359b`.
- Root visible 375px review passed Healthcare return, reload, keyboard focus and native Forward. Source/final screenshots and observations are retained alongside this note.
- Full inline and standalone script/JSON/YAML inventory parses, added encoding, counted anchors, unchanged document data and whitespace checks passed. 4S/4B/4N are N/A because their triggering files did not change. Exact commands/output are in `gate-logs/`.

Eleven discrete app/worker edits are recorded under `edits/`. Two asserted string-boundary mismatches stopped before writing the attempted edits; corrected boundaries were then counted. The first Readiness caller run exposed an obsolete hidden-picker test step, not an app error; its final run uses the visible return and passes all original behavior assertions. Structural harness corrections increased the source-read buffer for the existing 1.5MB app and normalized six quotation glyphs in the independent report; no app behavior changed. Final structural output is retained. Temporary dependency link removed.

Preview: http://127.0.0.1:18778/?tool=resources . Choose Healthcare, then Document checklist to see the contextual return. A copied/direct checklist link deliberately has no origin context. Existing history entries created before this change also safely use the My Plan fallback.

This is a local synthetic/visible-UI result, not a field usefulness, retention or speed claim. Manual assistive technology, native physical-phone and hosted checks remain pending. Preview warranted before any later release because route/focus behavior changed. No publication is requested for this iteration. Cache289 was only prepared in the prior rollback artifact and never served; current published high remains288.
