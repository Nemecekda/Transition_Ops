---
name: deploy-discipline
description: Deployment and rollback procedure for Transition OPS. Governs the path from feature branch to production. Owner - s3-devops.
---
# DEPLOY DISCIPLINE — SOP

Terrain: Netlify auto-publishes `main`. Therefore `main` IS production.
Treat every merge as a live deployment to serving veterans.

## FORWARD PATH
1. All work on a feature branch, named for the work (e.g. `s2-va-rates-update`).
2. Run the validation-gate skill. Attach evidence.
3. Open a PR to `main`. Netlify Deploy Previews build the branch — include
   the preview URL in the PR description.
4. Preview validation: exercise the changed feature on the preview URL.
   Confirm service workers and OneSignal remain healthy (previews may limit
   push behavior — note limitations rather than claiming false failures).
5. Hand off to Dean: PR link, preview URL, validation evidence, one-line
   summary of blast radius. DEAN MERGES. Agents never merge to main.

## ROLLBACK
Production defect detected → `git revert` the offending commit and hand Dean
the revert branch/PR immediately. Seconds, not minutes. Diagnosis happens
AFTER production is clean, never on the live app. This is established
doctrine; hold it even when the fix "looks easy."

## PROHIBITED
- Direct commits to main
- Force pushes anywhere
- Merging with a failed or skipped validation gate
- Debugging live production
