# Independent Wisconsin resource review — October 13, 2026

**LOCAL AUTOMATION PASS. No remaining blocking finding in the bounded review.**

Reviewer: `/root/j1_diagnostic_review`. Branch: `codex/wisconsin-work-support`, based on Career simplification commit `c4de90b3db7b869f29617fac53292f0add9d3536`. Final reviewed index SHA-256: `970486291e4e0ea0c360439688c604fc6eafb5398a28e89889654b0ecf7f93b5`; cache candidate 281. This is a local content/interaction review, not publication authority.

## Content and source scope

Compared the shared component and verification-log entry with S2's October 13 primary-source receipt. The new text stays within that confirmed scope: an individual assessment, career/training connection, local rules, available funding, and approval before purchasing or starting training. It clearly says a listed training program does not establish funding approval. The public guide adds no guarantee of free tools, automatic eligibility, local dollar cap, private contact, blanket SkillBridge funding, or new deadline.

The directory and training links, and both DWD policy links, match the S2 receipt. They use explicit new-tab links with `noopener noreferrer` and `no-referrer`; no member-specific query values are appended (`index.html:7444`). This review relies on S2's retained source verification; it is not a second legal/policy determination or an individual eligibility decision.

## Independently tested

One focused synthetic browser run, isolated Chrome via CDP, local HTTP only. All external/function traffic blocked; clipboard success and failure were stubbed so the test did not change the user's real clipboard. Full script and output are retained in `independent-evidence/`.

- Home searches for **Wisconsin tools** and **WIOA** reach the expanded Resources guide with focus on its heading. Returning after category, paid-cost and Guard/Reserve filters resets those stale filters to the complete directory.
- The new assessment guide remains available even when unrelated directory filters produce no matching resource cards. No eligible population is hidden by the legacy American Job Centers metadata.
- The visible conditional statements and all four official URLs were checked. No new guaranteed-funding wording or dollar amount appeared in the guide.
- Copy success copies exactly the generic inquiry and announces success. A denied clipboard produces a focused, read-only, selectable text area containing the same inquiry and an honest fallback status.
- The fresh Career page still shows its two initial choices without the Wisconsin guide crowding them. Resume-free role selection still reaches the job action. The folded Wisconsin guide is reachable through Career's contextual learning options and opens using native Enter.
- New visible links, buttons and summaries meet the 44px target-height rule. Resources and Career guide layouts showed no page overflow at 320/375 CSS pixels. Saved guide/action/gap bytes were unchanged; no runtime exceptions or attempted provider/member-payload requests occurred.

These are local synthetic observations, not evidence that a member qualifies for funding or that member retention improved.

## Finding disposition

**FIXED / VERIFIED LOCALLY:** the first placement nested the Wisconsin guide beside the filtered American Job Centers card. That card's existing eligibility list omits Guard/Reserve, so choosing that filter would hide this new assessment guide. The final placement is a separate disclosure before the directory filters/results (`index.html:15060`), without adding a misleading FREE badge, modifying legacy eligibility, or inflating filtered result counts. The independent filter case passed.

The final diff preserves the prior Career implementation, source/AI confirmation, explicit storage, provider/spend controls, health guidance and other tool access. Changes to the shared focus handler are conditional on the Wisconsin heading (`index.html:9319`). No additional unrelated improvement was folded into this review.

## Limits and release handoff

S3 owns the mandatory structural/privacy/AI/accessibility gates and author regression. Parent owns the separate visible mobile walkthrough. This reviewer did not repeat broad gates, run live providers, send messages outside the agent team, access credentials, or publish.

Manual assistive-technology and hosted-release acceptance remain **PENDING**. Actual device/browser combinations beyond the local Chrome checks, clipboard permission behavior on real Safari, individual funding outcomes, first-time member usefulness and retention are unmeasured. Local passing evidence does not establish those outcomes.
