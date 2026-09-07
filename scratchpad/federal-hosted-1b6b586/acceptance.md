# Federal preview 1b6b586 - fact fidelity failure

2026-09-07. Dean pushed the two approved local fixes. GitHub PR #59 is open/unmerged, head 1b6b586d9fb0ace098c3ede4c831a3f7086ec6a8, base ops/openai-parallel-clone. Netlify deploy 6a9efafafb214b0009a81bf0 is ready in deploy-preview context on veteranbridge-tools and points to that exact commit. Its immutable permalink is recorded in evidence.json. Both GitHub Netlify deploy statuses are successful; that is deployment evidence only.

## Observed result

One facts activation at 18:02:10.682 UTC returned HTTP 200 in 8533 ms. The six fictional titles/employers, dates, locations, twelve duty atoms, three education entries and two certifications were preserved. The source did not include 26 or a service duration, and the Years served input was confirmed empty through the DOM. The returned NUMBERS AND SCALE section nevertheless included `26 years of service` without a warning. The fact sheet therefore fails grounding despite HTTP 200 and zero captured console errors.

The run stopped before facts confirmation. Zero draft activations, retries or exports. The field was not edited to remove the failure, and no second generation was attempted. Federal draft, audit and artifact rows are NOT RUN for this candidate; prior civilian download evidence does not clear them. Manual assistive-technology acceptance remains pending. Hosted manifest and production promotion were not certified.

## Forensics

- netlify/functions/resume.mjs:44-50 builds the bounded extraction source from the member fields. The posting is separate at lines 52-54.
- Line 58 prohibits added facts, but line 80 gives the concrete instruction example `26 years of service`. Its exact match to the returned unsupported entry suggests example leakage; the model's internal cause is not observable.
- factSheetIssues at line 294 validates role/date/Workday and structural properties, not numeric source provenance. The initial facts path at lines 1162-1164 returns HTTP 200 when that limited list is empty. The repaired-output path at lines 1183-1190 also lacks this source-number check.
- factCatalog at lines 750-761 treats only inline NUMBERS AND SCALE values specially. Multiline continuation entries fall through as ordinary global facts with unlinked_number=false. The actual-function diagnostic confirms that the unsupported tenure then appears in federal draft-eligible facts. No hosted draft was executed to test that exposure.

The included executable diagnostic loads the actual functions from the checked-out candidate. It reproduces zero fact-sheet issues for an unsupported numeric entry, confirms that multiline continuation reaches draft eligibility, and confirms the existing exact quantity tokenizer distinguishes 26 from 2026. This is diagnosis, not a passing release test.

## Concrete next proposal - not applied

proposed-extraction-number-gate.json preserves the original patch bytes and checksum for four prechecked replacements in Resume runtime code:

1. Remove the concrete numeric example from extraction instructions and explicitly forbid inferring tenure from dates.
2. Compare quantity tokens in extracted fact-catalog payloads with the bounded member source, using the existing exact tokenizer. Structural role/item labels are not source facts. Preserve decimal, grouping, currency, percent and plus forms; do not borrow numbers from the job posting or instruction examples.
3. Fail closed with the existing content-free quality_gate response before the first fact-sheet release when an extracted numeric token is absent from the source. Do not make a repair call for this grounding failure.
4. Apply the same check after the existing optional structural repair. Do not add calls, retries, models, dependencies, storage or logging.

This is a minimum source-presence gate, not proof of semantic grounding when an unrelated source fact contains the same number. It intentionally does not compare later member-confirmed edits to the original source; the confirmation contract remains authoritative. Multiline NUMBERS classification is a separate known defect needing its own hardening iteration; no general claim that all catalog ownership is fixed is made here.

Required verification after approval: stub the observed invented tenure through the actual handler (HTTP 200 -> withheld 502), verify a genuinely supplied service duration remains accepted, distinguish 26 from 2026, test invented quantities in both initial and repaired extraction responses, preserve exact decimals/currency/percent/plus and numbered structural labels, exercise both Resume modes, then run all five required local suites. New preview testing remains bounded to a fresh immutable candidate.

## State and approval boundary

No application edit was made in this run. The patch is a review artifact only. These new evidence/proposal files remain local and uncommitted for the next approved fix iteration. Nothing was pushed, merged or promoted by the agent. Main was not changed.

The Resume maintenance skill requires Dean's approval before changing extraction instructions or validators. Earlier approval covered the now-shipped quantity-comparison correction; it did not cover this newly observed extraction failure. Approval is requested for the concrete extraction patch above. The failure is BLOCKED-COMMANDER pending that ruling, not a benefits-policy/S2 text change.
