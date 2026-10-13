# Independent Career review — October 12, 2026

**Verdict: LOCAL AUTOMATION PASS. No remaining blocking finding in the reviewed scope.**

Reviewer: `/root/j1_diagnostic_review`. Branch `codex/career-focused-workspace`, base main `391b810acc9bebc04d8bcdbf11764c66944d409f`. This is local acceptance of the bounded simplification, not merge, deployment, hosted accessibility or member-usefulness approval.

## Scope and retained boundaries

Read the complete four-file implementation/test diff and relevant accessibility/privacy standing orders. `index.html` changes the entry hierarchy, disclosures, task context, destination focus and job presentation. `pwa-sw.js` changes only the cache identifier to 280. The two changed regression scripts retain the saved-byte, conflict, AI-consent, message, history and occupied Resume protections; obsolete entry/Back selectors were adapted.

CODE-OBSERVED: explicit save and source confirmation remain; AI consent and request handlers, qualification/source logic, service paths and provider/spend controls are unchanged. All Career tools remain accessible through the global menu. Existing urgent help and human-support components remain in the Career surface; their content was not reverified or altered by this change. Saved networking, learning, job and growth primary actions stay outside the contextual disclosure (`index.html:7888`); unrelated secondary tools remain guarded while AI is active (`index.html:7916`).

## Independently executed evidence

Synthetic inputs only; isolated Chrome via CDP, local HTTP, all non-loopback and function traffic blocked. No real member data, external AI/job request, provider inspection, send, push, merge or deployment occurred.

1. **Eight-case independent route suite** on intermediate index SHA `e01dfee863ee6964ad8bc1afe899cbbd6c4b0512a23973b91d5c630ddab64bf5`: both visible entry routes; native Enter and focus transfer; no empty clearing/discard; exact source/role through Home and Back; no-resume role-to-job action with no automatic save; comparison without prior route choice; empty Grow-to-explore switch; exact saved action/date bytes; partial-target prefill; 320/375 CSS-pixel reflow and changed-control target sizes; no runtime exception or attempted source/provider request. See `independent-evidence/career-review-independent.log`.
2. **Author entry suite independently rerun** on that same intermediate index: PASS, including saved/completed work, conflict, prepared message, history, AI-consent reset, deliberate replacement, role-to-jobs handoff and 320/375/390 layout. See `independent-evidence/career-review-author-entry.log`.
3. **Final keyboard and file probes** on final index SHA `1a15a9fff1649f74a11c3d2c38a1ea212f0329dcde140b3249bfadf7ff4b71bf`: native Enter on Clear source returns focus to the visible file input; native last-character Backspace keeps experience and optional role fields visible, open and focused; local TXT import reveals exact review text, retains it through Home/Career and leaves saved bytes unchanged. All at 375×812 CSS pixels. See the three final `*-focus.log` / `*-file-import.log` files.

The final delta after item 2 contains only separate disclosure-open state, opening imported text for review and explicit Clear focus restoration, plus their focused regression assertions. The route/state evidence is reused with that comparability limit; it is not mislabeled as a full final-suite rerun. Builder's mandatory gates and final adapted suite are documented separately in HANDOFF.md.

## Findings closed during review

- **FIXED / VERIFIED LOCALLY — focus lost after source clearing.** The newly conditional button disappeared after keyboard activation and left focus on BODY. Final `CareerGapStarter.clear()` focuses the stable file input; native Enter reproduced the corrected behavior (`index.html:6313`).
- **FIXED / VERIFIED LOCALLY — deleting text closed an active editor.** Text-truthiness controlled the experience and optional-role disclosures; removing the final character hid the field and lost focus. Separate open state now follows deliberate disclosure interaction; both native Backspace cases preserve focused empty fields (`index.html:6309`, `6365`, `7630`, `7875`).
- **FIXED / VERIFIED LOCALLY — stale intent after switching routes.** The initial no-resume handler could retain an abandoned Grow/Compare intent. It now deliberately chooses exploration; the independent Grow switch and expanded author cases pass (`index.html:7665`).

## Privacy and release limits

RUNTIME-OBSERVED is limited to synthetic local cases. Exact saved guide/action/gap bytes remained unchanged until explicit saving; the revised screens introduce no automatic source submission. This supports the narrow draft-state notices, not any broader provider-retention claim.

Manual Safari/VoiceOver, Chrome/NVDA, Edge/JAWS and Android/TalkBack results remain **PENDING**. No manual assistive technology, full final-device matrix, hosted acceptance, field performance, real first-time usability or retention claim is made. Parent's separate CUA visual walkthrough is useful local evidence and is not a manual AT pass. Required remaining gates/approvals stay with the root release owner.

The PAO task evidence is bound to the prior application hash. After a future release it must be re-observed and renewed rather than bypassed. Temporary dependency artifacts are outside this reviewed four-file implementation scope.
