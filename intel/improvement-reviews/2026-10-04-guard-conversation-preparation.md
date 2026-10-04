# Guard/Reserve conversation preparation - October 4, 2026

Base local commit: 9867702. Local candidate cache196, not published. Production remains PR116/cache194. Dean requested continued improvement of the Guard/Reserve experience.

## Improvement

The service-situation check-in previously suggested preparing a work handoff or return-to-work conversation but opened the general career worksheet. It now offers **Prepare this conversation**, opens the relevant worksheet disclosure and focuses a heading with three starter questions for the selected situation.

Members explicitly add those questions to their current notes, edit the combined text, and save with the existing worksheet control. Existing notes are retained. An identical question block cannot be added twice; insufficient space disables adding rather than truncating notes. The temporary suggestion clears when leaving Career or changing service profile. Saved questions use the existing bounded worksheet field and clear controls. The summary now names supervisors, advisers and counselors, without changing the stored schema or implying receipt by anyone.

Expected benefit is a hypothesis: concrete questions may make the recommended next action easier to carry out and discuss with a human. No member outcomes or retention evidence is available. No new employment-rights, eligibility, benefit or policy claims.

## Evidence and limits

- CODE-OBSERVED: closed away/return templates; explicit append; capacity and duplicate guards; transient routing context; existing save/clear behavior and 600-character limit preserved.
- RUNTIME-OBSERVED: synthetic Guard browser tests covered both situations, route/disclosure/focus, unchanged storage before explicit save, prior-note preservation, save/reload, duplicate and full-field handling, summary, ordinary-route reset, invalid template rejection, and both themes at 320/375 CSS pixels. Zero model requests or synthetic-text transfer in the runner.
- Existing TAP browser tests passed: immediate latest-keystroke save, unsaved reload, plaintext injection, keyboard disclosure, save denial, migration and summary. Counselor preparation regression passed without weakening storage, prefix preservation or Resume assertions.
- Required migration, service-worker privacy, privacy-network, runtime-spend and accessibility automated gates passed. Structural parse: 138 records; deterministic public build: 64 files. Accessibility remains LOCAL AUTOMATION PASS; manual AT and hosted acceptance remain pending.
- Visual review: light and dark phone screenshots in scratchpad/guard-conversation-20261004. Local synthetic evidence only, not field evidence.

App changes are in index.html and cache195 ->196 in pwa-sw.js. No new storage keys, telemetry, external contacts, model calls, J1/S2 changes or publication. The narrow claim that adding starter questions preserves existing notes is SUPPORTED / KEEP by code and synthetic runtime evidence; it is not a universal privacy claim.
