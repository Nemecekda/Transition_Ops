# Home navigation release - September 29, 2026

Dean reviewed the local mobile preview, approved it, and explicitly instructed "publish". That instruction authorizes publication of this bounded change through the normal Git-backed production path.

Base: 261f48f983418692cf619bfb5585441b27edf63e (PR103), verified against origin/main and production deploy 6abbdff25dfc3e000867dcac. Highest production cache in main history and live /pwa-sw.js: v181. Candidate advances to v182; legacy /sw.js and dormant /push/onesignal/ worker are unchanged.

Home no longer begins with the career guide and backup controls. The guide is in Career with explicit worksheet and return controls, including restored keyboard focus. Backup/restore is in My Plan; leaving it cancels an outstanding preview. Guard/Reserve Navigator access follows direct tool shortcuts. Existing theme, eligibility, deadline priorities, saved state, Resume and DD214 behavior are preserved.

Validation: OpenAI migration, worker privacy, browser privacy/network, runtime AI spend, local accessibility, guide navigation, backup roundtrip, career-action and service-career regressions pass. Inline/tracked script and JSON/YAML parsing, added-line encoding, whitespace and branch checks passed. Final worker bump was parsed and the five required suites rerun. Public builder validates its current 64-file allowlist; root netlify.toml remains outside the public build. All test provider calls were stubbed/blocked.

PRODUCTION PUSH: OFF. New/migrated OneSignal request count zero; dedicated push worker dormant; legacy exception preserved. No new telemetry, model calls, budget or schedule change.

Accessibility verdict: LOCAL AUTOMATION PASS. Required manual assistive-technology matrix remains untested; do not claim WCAG certification or full hosted accessibility acceptance. Dean approved the visual preview and requested publication with the disclosed local-testing limits.

Rollback base is PR103. Any rollback must revert the navigation change on a branch and advance the active cache beyond every shipped number; never restore/reuse v181 or v182. Preserve the unchanged privacy and worker-registration boundaries.
