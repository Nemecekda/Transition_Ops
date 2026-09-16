# Employer-to-career-plan connection: approved scope

Force Mod, 2026-09-16. Baseline Guard preview `e187622`. Dean authorized finishing this connection and publishing the verified update; do not re-request generic implementation or publication permission. Actual release checks remain separate. This memo makes no code, account, provider, outreach or registry change.

## Coverage

**FULL.** Existing member-return-benchmarking, privacy-truth-to-implementation, policy-verification, brand-voice, validation and accessibility controls cover the bounded feature. Existing S2-vetting rubric covers any future commercial recommendation; a member manually recording an employer lead is not an app endorsement. No new skill needed.

## Minimum useful implementation

Use existing Career Gap/counselor preparation state and summary. The current schema already holds `prep.opportunity` (160 characters), `prep.source` (240) and `prep.followup` (240). Prefer labeling the first field "Employer and role or training opportunity" so a member can enter the employer and current posting title together; preserve its existing training use. Retain the target occupation and gap rows. This avoids a separate application tracker, employer database or schema migration.

Add a clear route from ESGR discovery to this existing preparation section. The member enters the employer/opportunity, public posting/source reference and next action after reviewing the external source. Opening the route or an ESGR link must not populate a signer, mark a job verified, change contact status or overwrite any notes. No map scraping, imports, new accounts, APIs, embedded external page or automatic URL fetch.

Guard Home should resume a partially entered opportunity or next action even when the general target occupation is blank. Show only bounded member-entered content with honest labels; keep one primary continuation action. No new Home feed, menu, badges, score, saved employer list or application-status workflow.

## Meaning and privacy

- State that this is the member's lead/plan. The app has not verified that a posting is still open, that the employer signed an ESGR pledge, or that a signer has satisfactory employment practices.
- Preserve the existing pledge-versus-award/opening/hiring distinction. Signing-date evidence does not certify current workplace policy. Do not add named company recommendations, logos or rankings.
- Keep reference text inert and React-escaped. A URL is not permission to retrieve it. Do not insert notes into query strings, Resume facts, AI calls, analytics, emails, telemetry or contact forms.
- Existing explicit Save and scoped Clear control all fields. Route changes remain memory-only; no new profile key. Indicate unsaved changes truthfully and retain denied-storage/iframe handling. Existing shared-device notice remains relevant.
- Do not collect recruiter personal details, employer correspondence, pay offers, applications, credentials, identifiers or sensitive service records. Do not imply a saved lead means an application was submitted or an office received it.

If a separate employer field is essential after UX review, the existing strict schema requires a deliberate new version, backward-compatible v1/v2 reads, exact preservation of old fields, no write on load, explicit new-version save and rollback compatibility. That is within the approved bounded feature only if documented and tested; avoid it when the existing opportunity field serves the task.

## Acceptance

Synthetic cases: blank target with employer/opportunity still offers useful Home continuation; existing training opportunity survives unchanged; source and next action survive explicit save/reload; navigating from ESGR never overwrites notes or changes contact status; opening a reference creates no automatic request; Clear removes the same exact worksheet key/memory and leaves profile settings alone. Test denied/malformed storage, iframe, escaped text, keyboard/focus and mobile layout. Confirm no new provider/network/telemetry transfer and preserve all Resume and policy invariants.

Final independent review will bind the actual implementation and evidence to exact app bytes. Publication authority does not supply missing manual accessibility, hosted identity, cache or rollback evidence; prepare those without reopening already granted general authority.
