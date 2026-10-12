# Career workspace simplification - local draft, October 12, 2026

Branch: `codex/career-focused-workspace`, based on main `391b810acc9bebc04d8bcdbf11764c66944d409f`.
Preview: http://127.0.0.1:18776/?tool=pathway
Cache candidate: 280. Not published, pushed, or merged.

Fresh Career now offers two visible routes: **Use my resume** and **Start without a resume**. Resume intake appears only after selection; a member can instead choose a role and open job search without saving a plan. Returning members continue the actual unfinished or saved task. The chosen role, one next action, and storage state stay visible; optional AI, learning, networking, and detailed editing are folded under contextual help. The global menu still exposes the full set of Career tools.

The job-search destination has one visible heading and Back button, carries the chosen role, and focuses the heading rather than the entire form. Resume intake no longer repeats its heading or leads with the optional role field. Empty visits have no discard control. Meaningful unsaved work is explicitly labeled **Not saved**.

## Changed implementation

- `index.html`: route chooser, compact workspace hierarchy, contextual disclosures, meaningful-draft controls, destination focus, and dedicated job-search presentation. Existing source review, storage, conflict, AI consent, spend, help contacts, and eligibility logic remain in place.
- `pwa-sw.js`: cache 279 to 280.
- `scripts/career-simple-entry-browser-regression.js`: adapted entry expectations and bounded route/job/focus/layout regressions, retaining saved-byte, conflict, history, introduction, and AI-consent assertions.
- `scripts/career-resume-handoff-browser-regression.js`: one renamed Back selector; occupied facts/output/loading and source-confirmation checks retained.

## Validation

All five mandatory Phase 1 commands passed locally, as did the focused entry, resume-handoff, and keyboard-tools regressions. Final logs and exact file hashes are in `evidence/`. The structural gate parsed 3 inline JS blocks, 1 JSON-LD block, 108 tracked JS files, 9 MJS files, and 84 JSON files; all 6 workflow YAML files were inventoried and parsed. Added curly quotes/NBSP and whitespace defects: zero. Workflow/package/budget/schedule boundaries are unchanged.

Independent native-keyboard review caught and corrected two local regressions before handoff: deleting the last character no longer collapses its active editor, and Clear source text returns focus to the file input when the Clear button disappears. The final entry regression exercises native deletion in resume, posting and role fields plus native Enter on Clear. All five mandatory checks were rerun against the corrected app bytes. Existing installed dependencies were reused through a temporary symlink; that link was removed after checking. No package installation or dependency mutation occurred.

Conditions: Chrome 154.0.8037.99, Node 24.18.1, synthetic local data. Focused layout checks at 320/375/390 CSS pixels; the required accessibility suite also covers 200%/400% zoom, keyboard semantics, target sizes, contrast, reduced motion, and modal behavior. External traffic was blocked in test browsers; AI handlers used local stubs. The job destination's existing content-free availability GET was blocked; no job search or paid provider call was performed.

Accessibility disposition: **LOCAL AUTOMATION PASS**. Manual assistive-technology rows and hosted acceptance remain PENDING. Root also walked the local phone preview at 390 x 844: both entry choices visible, role-to-jobs handoff and return retained the role, and the destination showed one heading/Back. This is synthetic review, not member usability or return evidence.

## Privacy claim check

| Claim | Evidence | Verdict / disposition |
| --- | --- | --- |
| Not saved / draft in this tab | Explicit storage path unchanged; synthetic entry, route, history and conflict tests preserve exact saved bytes. | CODE-OBSERVED + RUNTIME-OBSERVED; SUPPORTED / KEEP, scoped to the draft. |
| Saved on this browser / For this visit only | Existing explicit confirmation and separate saved/visit state preserved. | CODE-OBSERVED + RUNTIME-OBSERVED; SUPPORTED / KEEP. |
| Optional AI sends reviewed excerpts | Existing consent and fact review retained, consent resets on return, no automatic provider dispatch. | CODE-OBSERVED + RUNTIME-OBSERVED for local boundary; KEEP existing scoped notice. Hosted/provider retention remains outside this check. |

No new collection, telemetry, persistence, external AI infrastructure, health guidance, paid runners, or communications were introduced. Original light/dark theme and compact urgent-help access remain available. The published PAO handout's old app-index hash will correctly hold after a future app release; it must be rechecked rather than bypassing its evidence guard.

## Remaining evidence

Independent review is recorded separately in this directory. Real first-time member usefulness, mobile-device assistive technology, hosted behavior, and retention remain unmeasured. No production claim or release approval is made by this local handoff.
