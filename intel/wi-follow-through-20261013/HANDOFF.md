# Wisconsin support follow-through — local build, October 13, 2026

Members can keep the Wisconsin assessment as their next step, prepare questions they can actually use, and copy a direct guide link. The existing official Job Center and training links, prior-approval checklist, eligibility conditions and verified policy copy are preserved.

## Delivered

- One compact **Make this my next step** control opens a review. Existing direction, roles, goal and worksheet remain intact. An existing action/date/done state is shown and requires explicit replacement. Members choose **Save on this browser** or **Use for this visit**; Home reopens the exact guide for that exact unfinished action.
- Fresh plans use the visibly reviewed direction **Get work or training support**. This does not require a career change or skills goal. Generic/completed support routes lead to general Resources, including work and training options, without inferring Wisconsin residency. All three older directions remain accepted.
- Questions are editable and shared between Career and Resources during the open visit. **Add my career details** previews and appends only the member's existing short current-role/experience and target-role fields, once. It never imports a resume or overwrites edits. Questions are not included when saving the step or backing up the plan.
- **Copy guide link** constructs only the current origin plus `/?tool=resources&guide=wisconsin-work-support`. No role, questions, source text, ambient query or fragment is included. The link uses localhost in this preview and the production origin after a separately authorized release. Clipboard denial exposes focused selectable text; nothing is sent.

## Boundaries and evidence

Changed six implementation/test files listed in `candidate-hashes.json`; `patch.md` contains the complete reviewable source diff. Cache 282. The only server change adds the already validated `support` pathway to Navigator's existing explicit guide-sharing allowlist. Dry-run tests prove all four pathways accepted, unknown values rejected, and no client, store or provider request. Consent, models, spend, credentials, telemetry, source policy and schedules are unchanged.

Plan saves use existing atomic guide/action/worksheet writes and rollback. Current draft, visit work and raw disk snapshots are compared before applying. Newer, malformed or unrecognized saved copies are preserved; blocked browser saves still allow visit-only use. Failed saves retain questions and current work. Edited questions have no new storage path.

Base branch `codex/wisconsin-plan-follow-through` starts at `6c34c30b7fa1a63cc36102ef95f6fbbfb45dc35d`. Current remote main comparison is `391b810acc9bebc04d8bcdbf11764c66944d409f`, with two reviewed unpublished commits retained: Career simplification `c4de90b3db7b869f29617fac53292f0add9d3536` and initial WI resource `6c34c30b7fa1a63cc36102ef95f6fbbfb45dc35d`. Exact refs are in `base-refs.json`. Dirty primary worktree is untouched. No push, PR, merge or deployment was performed.

## Validation and release limits

All mandatory local gates and focused regression suites pass; see `GATE.md`, logs, independent review and root visual review. Preview: http://127.0.0.1:18776/?tool=resources&guide=wisconsin-work-support

Verdict: **LOCAL AUTOMATION PASS**, not published. Manual assistive-technology, actual member usefulness and hosted release checks remain pending. No retention or outcome claim is made. Screenshots precede the final routing/URL-compatibility changes; the guide layout is unchanged and final route behavior is covered by automation.

The additive `support` enum uses the existing guide/action/backup schema version and round-trips in this build. Older app versions reject this new value; their loaders preserve the raw copy rather than convert it. A rollback must retain those stored bytes and backups until compatible code returns, and must not claim older code can continue a support plan.
