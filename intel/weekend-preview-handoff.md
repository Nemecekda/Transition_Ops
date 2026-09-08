# Combined-app preview handoff

> **Status note corrected 2026-09-08.** The body below remains the historical
> 2026-09-07 record for07a1d3b. Published runtime is1803e511 (v156); the later
> local documentation wrapper6a59611 is two unpublished commits ahead with
> identical runtime. Fetch the latest published clone before future edits;
> these are dated snapshots, not permanent baseline instructions.
> Federal success at 7c79057 is preserved. Current 1803 complete 22+1 manifests,
> all three operational dist logs, scoped Resume/Privacy USER-REPORTED PASS,
> 12 pre-provider rejections, and unapplied1803-bound v157 recovery are recorded
> in [current status](openai-release-status-2026-09-08.md) and the
> [durable evidence summary](openai-release-evidence-2026-09-08.md).
> Parent's 2026-09-08 disposition resolves row29 accounting by intentionally
> superseding detailed telemetry with the approved literal-marker privacy
> implementation; the dynamic feature was not ported and no rule was waived.
> Historical blockers/steps below are not current instructions or new rerun
> requirements. Full AT, provider/package limits and production acceptance
> remain separately unresolved as stated in the current record.


2026-09-07. PREVIEW WARRANTED: the integration changes app content, date
handling, dormant alert machinery and active PWA cache. This is a preview
preparation record, not production release approval.

## Candidate and protected Resume

- Repository: https://github.com/Nemecekda/Transition_Ops
- Branch: `codex/openai-weekend-integration`.
- Checkout: `/tmp/transition-ops-weekend-integration`.
- Tested runtime commit: `07a1d3b19367958f13fc00cbe6156c917335da2e`.
- Parents: clone `0433f333e1de16d2dfd06e0cad4cb9a1ba025008` and published
  main `d82516389ed5906febad467cfe57887acda97053`.
- Subsequent shared-development documentation does not change runtime bytes.
  Use the actual branch HEAD for the new deploy identity; do not identify a
  later documentation commit as the earlier tested commit.
- Resume server and shared OpenAI controls retain the clone implementation.
  The integrated index changes preserve its Resume browser code. Evidence and
  hashes: `weekend-integration-validation.md` and `weekend-update-reconciliation.md`.
- All required local suites passed, including Resume integration and actual
  LibreOffice DOCX rendering. Local automation does not establish hosted or
  phone acceptance. No test was rerun solely for documentation edits.
- Active `pwa-sw.js`: v151 -> v152 in the integration, once. No new bump for
  these internal documents. Final origin-cache ledger remains a release task.
- `PRODUCTION PUSH: OFF`. Dormant alert machinery is retained but has no
  callers. No notification or provider test is authorized by this handoff.

## Dean's next step - publish for preview only

1. Open the integration checkout above in GitHub Desktop. Verify Current Branch
   is exactly `codex/openai-weekend-integration` and Changes is empty. The
   original checkout remains on `ops/openai-parallel-clone`; publishing that
   original checkout would not publish this integration branch.
2. Publish the integration branch. Do not switch to or merge into main.
3. Create a pull request with base `ops/openai-parallel-clone` and compare
   `codex/openai-weekend-integration`. Suggested title: "Preserve weekend updates
   and the OpenAI Resume implementation". Leave it unmerged.
4. Wait for Netlify's check belonging to `transition-ops-openai-clone`. Open its
   generated preview and verify its deploy commit equals the published branch
   HEAD. If no check appears, inspect clone-site preview settings; do not assume
   a preview URL exists or change settings automatically.
5. Share that verified preview URL to the phone. PR46's existing preview is
   still the earlier candidate; this separate PR does not update it. After
   acceptance, integration into the clone branch is a separate explicit step.

## Preview review

- Confirm the published OPM and FEDVIP/Gray Area updates render.
- Check Resume form, confirmation flow and export controls retain the reviewed
  implementation. Deliberate live AI generation requires its separate test
  authorization and budget; visual review alone is not end-to-end proof.
- Confirm new/migrated browsers do not request notification permission or
  activate push. Report legacy installed-browser behavior separately.
- Record phone/browser, deploy identity, observed results and any failures.

The existing preview supplied in this task is
https://deploy-preview-46--transition-ops-openai-clone.netlify.app/ . A read-only
Netlify project check on 2026-09-07 still reported clone current deploy
`6a99e7607928610008750d83` ready. This project check is not proof of the new
candidate, an exhaustive historical cache ledger, or PR preview settings.

## Remaining production decisions

The detailed Navigator logging in reconciliation row29 remains BLOCKED-POLICY;
the recommendation is to retain the clone's existing closed diagnostic markers.
This conflict does not authorize additional telemetry. Hosted artifact/function
identity, independent Navigator and Resume acceptance, required phone/manual
accessibility evidence, two-origin cache ledger and candidate-bound rollback
remain required before production handoff. Do not reuse old release evidence
as proof of the new candidate. No push, PR creation, deploy or main merge was
performed in preparing this record.
