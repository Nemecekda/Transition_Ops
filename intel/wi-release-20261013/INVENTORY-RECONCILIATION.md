# Release inventory reconciliation — 2026-10-13

Scope: read-only reconciliation for the authorized Career/Wisconsin release. This document neither expands the public allowlist nor certifies a hosted deployment.

## Current finding

The closed `PUBLIC_FILES` array in `scripts/build-public.js` contains **74 files**, and the independent `EXPECTED_PUBLIC_FILES` array in `scripts/sw-privacy-regression.js` has the same exact entries. The regression's printed “64-file” description is stale; its executable equality check is not a count-only check. The arrays are unchanged between production-source baseline `2e0dfdf34ce1dcf004554916aa41e08c43007817` and the feature head examined (`169d1712311f3e8edfeef7751e8023d7374e07b4`). Final candidate identity must be bound separately after freeze.

The deploy skill's 22-runtime/23-total hosted count and validation skill's historical 22-file calibration describe the September 3 inventory. They are not the current runtime inventory. Preserve their exact-path/hash boundary using the current, already merged allowlist; do not accept an arbitrary count or extra file.

## Provenance

| Inventory | Change | Existing repository evidence |
| --- | --- | --- |
| 22 | Original public runtime set | September 8 release evidence records complete 22 runtime + 1 control-plane manifests for exact commit `1803e511ff3d7001e15d41ff35465a1786657882`. |
| 24 | Two journey motion MP4 files | `369d1b6c528878fd5feb2a41abbc0f91dee7a670`, September 10, changed builder and executable regression together. |
| 64 | Forty local DD214/PDF/OCR reader assets | `36aa7cc4c64d41c487afeeb37cefd15e05f43e28`, September 27, changed builder and executable regression together. September 29 and October 4 release records report exact 64-file builds. |
| 74 | Ten journey image assets | `3960b507147e27c2da810bd1307f26123c5b52dd`, October 7, changed both closed arrays and the worker's precache mapping. This is an ancestor of baseline `2e0dfdf`. |

The current atomic precache list also includes those ten images. It has 19 route entries, representing 18 unique local files because `/` and `/index.html` both map to `index.html`. No precache mapping is introduced by this release; the active-worker diff from the baseline is its cache literal only.

## Exact acceptance boundary

- Local deterministic build: precisely the frozen candidate's 74 enumerated runtime paths; root `netlify.toml` remains absent from `dist`.
- Hosted Git-backed manifest: exact closed union of 74 runtime records plus one separate root `netlify.toml` control-plane record, if the provider continues the previously accepted manifest behavior. Expected total: 75. Classify every record; compare each size and SHA-1 to the frozen candidate.
- Keep existing one-to-one, collision-free path canonicalization rules. Duplicate, additional, missing, ambiguous or mismatched entries fail. Count equality alone is insufficient.
- Bind the deploy to the frozen commit/tree and effective publish directory `dist`. Compare candidate root `netlify.toml`, never an unrelated checkout.
- If full hosted manifest access is unavailable, report that gap. The October 4 record explicitly distinguished changed-file HTTP checks from complete manifest acceptance; it is not precedent for claiming the latter.
- No new release, merge, deploy or hosted verification is performed by this reconciliation. User publication authority is held by the root task; stale local-only wording does not revoke that authority.

## Governance disposition

Existing validation/deployment rules cover the boundary; no new skill is needed. The current release does not add public files. A later documentation correction should replace stale historical counts and the stale regression message without widening either executable array. This packet does not silently modify the skills registry or claim that historical 22/23 checks passed for a 74-file candidate.
