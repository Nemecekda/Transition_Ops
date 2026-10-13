# Document checklist: local implementation handoff

2026-10-13. User authorized continued simplification. Local build only; no push, pull request, merge or deployment.

Base: `657f790e01f035d478da1d65eac302e53c09783f` on `codex/support-outcome-follow-through`. Refreshed `origin/main` remains `2fbd8b4e1a87ac4b20b104290604e78c33d708b1`; it is already an ancestor. The earlier local Career, Wisconsin support, outcome, continuity, compact-review and exact-search work is preserved. Dirty primary checkout was not changed.

## Member task and result

My Plan -> Documents now opens a focused Document checklist. Each of the existing twelve documents has a named native checkbox with checked state, a 44px label target and readable unchanged notes. Reading notes or following the VGLI source does not change the checkmark. Obtained items retain full-size text rather than strike-through or reduced contrast. Progress says how many items the member marked as obtained, not that documents are secured or verified. The checklist states that documents are not uploaded here.

The Documents view belongs to My Plan, has a direct Back to My Plan control, and returns focus to the Documents shortcut. Other resource topics remain under Benefits. Directory-specific controls are omitted only inside Documents; More/Benefits -> Resources opens the full directory. Choosing Documents from that directory transfers focus from its removed selector to the checklist heading. Document arrival scrolls its own section into view without changing other tool continuations.

The existing `docProgress` write is now confirmed by an exact readback. A denied or silently dropped write preserves the in-tab checkmarks and reports that saving could not be confirmed. It does not claim the disk is unchanged after an unreadable readback. Embedded views remain visit-only. Successful backup restore already validates all writes; its existing effect suppression is retained so compact restored flags are not overwritten by a second effect write.

No storage key/schema, document collection/upload, source fact, eligibility rule, external API, tracking, paid call, AI, push, schedule or budget change. `DOCUMENT_VAULT`, the document loader and the toggle semantics are unchanged. The shared row renderer replaces the duplicated critical/supporting renderers.

## Candidate identities

| File | SHA-256 |
| --- | --- |
| `index.html` | `6372f28cd0cd9712feffee6f38e1df135a56c2c2fa1626e75e9a43f8c5d3a808` |
| `pwa-sw.js` (cache287) | `fc8392447031ee82bd976c152cdd0bda4354c8507994a0c55ee0ae6c330354b8` |
| `scripts/document-checklist-browser-regression.js` | `793bef2638f797d7ab60344428f91c2291fbcdab10254960264aed4c77c2d6d2` |
| `scripts/vgli-document-browser-regression.js` | `9fe934feebcec59de0b9b346b31dbad40c1df80d06b03035d04e5a9b6df71fed` |

The existing VGLI regression now asserts the native checkbox state rather than a decorative checkmark. All policy/source assertions remain.

## Validation evidence

EDIT MODE. Fifteen discrete app/worker edits; each old/new block and expected/actual count is retained in `gate-logs/*edit*`. Full itemized diff reviewed. Intended new regression is included in structural inventory. Initial sandbox-restricted runs could not start local browser/server or temporary public-build output; scoped local execution resolved those environment failures. Test-only corrections were an output buffer, actual existing menu/restore labels and the unchanged directory title. No application guard was weakened to satisfy a test.

All five required gates were run against final6372f28c and passed (the `sealed-*.log` files):

- OpenAI migration, including local DOCX render fixtures.
- Service-worker/privacy and deterministic public-build boundary.
- Privacy/network, including zero provider requests in new/migrated fixtures.
- Runtime AI spend governance, synthetic only.
- Accessibility release: LOCAL AUTOMATION PASS.

The new final browser regression passed native Space + accessibility-tree checked state, all twelve names/notes, explicit return focus, normal write/reload, denied write, silent write drop, in-tab recovery, actual backup-file review/restore without effect rewrite, directory topic entry focus, exact unchanged source data, no document upload control, separate source activation, and 320/375/1280 layouts in both themes. No provider POST occurred.

Affected VGLI source-link, My Plan orientation, My Plan shortcuts and backup regressions passed on34e0b310. Their evidence is reused for the final one-condition topic-focus delta; the final focused regression and mandatory gates cover that delta directly. No functional or source policy change occurred afterward.

Root `ROOT-REVIEW.md` and screenshots bind34e0b310. Final6372f28c differs only in the topic-selector focus handoff; layout and all photographed controls are unchanged. Independent review separately binds final bytes and covers failed writes, embedded no-write, source isolation, backup restore, title/navigation, and final keyboard focus.

Preview: http://127.0.0.1:18778/?tool=dashboard -> My Plan -> Documents.

## Limits

Evidence is local synthetic lab testing, not native-phone or manual assistive-technology certification, hosted release acceptance, loading-speed improvement, return/retention evidence or proof of field usefulness. Document guidance was preserved, not re-rated by this UI change. Existing `docProgress` contains source metadata plus flags; this build does not claim only checkmarks are stored. A failed save leaves the current in-tab progress available until refresh/close; no new background retry or cross-device persistence exists.

Final structural gate: GATE PASS. Full tracked/intended inline JavaScript/JSON-LD, standalone JS/MJS/CJS, JSON and YAML inventory parsed successfully; added-line curly quotes/NBSP zero; whitespace and presence/absence checks passed. See `gate-logs/structural-final.log`. Steps4S/4B/4N are N/A for this diff, not implied hosted acceptance. The final remote refresh still reports main2fbd8b4 and0 behind. Temporary dependency link removed. Independent final receipt: `38b8b5bcb9e3d54c849ac9aeb5106cae8040da178689c428ecfeeec5ed3d742c`.
