# Release reconciliation - October 16, 2026

Fresh origin fetch and refs read: see baseline.json. Current main is ffede2397c22af055c97c74a8afe631d22edbc7b (PR149); production worker is cache289 with SHA256 86800106fac991d24a953071d38b5cfcfac9bea83f21495e88ea706d695cad0d. Candidate branch codex/wisconsin-pathway is based on that exact main and retains all uncommitted iterations1-3 (cache292, index cd93e02c3de0b32be4fbed8befc8f8b5005482c6952be92bb4136699546077c1). No remote heads changed since the previous iteration. No working tree was reset and no application work in the primary checkout was touched.

Five remote branches have unique commit identities against main:

- codex/document-context-return at1149ede has the exact same tree as main after squash merge PR149. Already integrated.
- codex/wisconsin-plan-follow-through at78b4931 was released via PR147 squash f948e3b; main includes later support and document improvements. Preserve current main and the branch.
- codex/support-outcome-follow-through at4080b37 has support, resume and document changes incorporated in main, followed by the contextual document-return addition. Preserve the newer main tree and the branch.
- codex/pao-useful-packets ata360dce is an unrelated PAO task, retained on its branch. Do not mix that packet into this app release.
- codex/alert-verification-followup atc395c45 is an older alert-delivery branch diverging before the current privacy, Resume and provider architecture. It is retained, not integrated wholesale. Its old alert fixes remain separately reviewable; this release preserves current production push-OFF and alert behavior. Replacing main with that old branch would remove unrelated later work.

No competing remote reservation above main cache289 was found. Local iteration292 is consumed in this task; planned next candidate is293. Recheck refs, production/preview cache and reservations before actual release or rollback.

The exact existing public boundary is74 runtime files, plus one Netlify-generated root netlify.toml record when hosted. The atomic precache is19 routes mapping to18 unique local files. Reuse intel/wi-release-20261013/INVENTORY-RECONCILIATION.md; historical22/23 prose does not widen or shrink the current explicit arrays. Exact path/size/hash proof is required. No allowlist or precache mapping change is planned.

User explicitly authorized publishing all. Root coordinates remote mutations after local validation and candidate-bound rollback preparation. Manual assistive-technology rows remain PENDING; no HOSTED RELEASE PASS will be asserted from automated checks alone.
