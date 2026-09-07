# Shared development - Claude and Codex

Both assistants preserve useful work from either tool. Tool identity, branch
name, commit date, or file timestamp does not determine which implementation wins.
Follow the user's current instructions and applicable skills. This workflow adds
no approval gate for routine authorized work and no push, merge, or deploy
authority. It does not reinstate withdrawn AGENTS.md standing orders.

## Integration reference and Resume continuity

The reconciled baseline is `07a1d3b19367958f13fc00cbe6156c917335da2e` (07a1d3b).
Its protected Resume implementation is inherited from
`0433f333e1de16d2dfd06e0cad4cb9a1ba025008` (0433f33), including the browser flow
in `index.html`, `netlify/functions/resume.mjs`, shared OpenAI controls, and
associated regression coverage. These are comparison references, not frozen files
or proof of production release. See [integration evidence](intel/weekend-integration-validation.md)
and the [reconciliation record](intel/weekend-update-reconciliation.md).

Preserve the existing fact-ledger confirmation, exact identity and claim grounding,
civilian/federal separation, browser-only personal header handling, draft withholding,
artifact/export behavior, and privacy/budget/retry controls under the current
[Resume skill](.claude/skills/resume-drafter-maintenance/SKILL.md) and linked skills.
User-requested Resume improvements remain allowed within their authorized scope.
Protect regression behavior while implementing them; do not lock entire files or
discard an improvement merely because it changes this baseline. Do not weaken an
assertion just to make an older implementation pass.

## Before edits and at handoff

1. Read `skills-registry.md` and relevant skills. Identify the current checkout,
   HEAD, staged changes, unstaged changes, and untracked work. Preserve other
   active work and its ownership; do not reset, clean, or overwrite it to get a
   convenient baseline.
2. Compare the published main and relevant Claude/Codex branch tips, including
   published branches not yet merged. Refresh remote-tracking refs when task
   access permits; otherwise report their freshness limit. Record exact SHAs,
   merge base, unique commits on both sides, and uncommitted work separately.
   A newer timestamp or a clean merge is not proof that an improvement survived.
3. Read the actual diffs. Account for each improvement as preserved, ported,
   superseded with a reason, or unresolved. Reconcile individual changes across
   renamed files and shared modules. Never replace a whole file or branch simply
   because one tool's copy is newer. Preserve policy wording and source lineage;
   keep colliding verification IDs distinguishable by their original source.
4. Apply changes within the user's existing authority and run the existing gates
   appropriate to the affected behavior. For Resume changes, retain the relevant
   grounding, transport, privacy/spend, and artifact regressions. Local tests do
   not substitute for required hosted, manual AT, or Word-rendering evidence.
5. Recheck for concurrent edits before handoff. Report exact refs, preserved and
   adapted improvements, tests and their limits, and any unresolved conflicts or
   policy incompatibility. Do not silently drop either side or label an unresolved
   item complete. Continue independent authorized work while reporting what remains.

This document records the user's shared-development preference. It is not a new
skill or a change to existing skill/registry rules.
