# Documents route - root review, 2026-10-14

User authorized continued improvement followed by push/merge. Working candidate is the existing codex/support-outcome-follow-through branch in pao-useful-packets; dirty primary workspace is preserved.

## Baseline observation

OBSERVED in Codex in-app browser on localhost18778 at base c1a1f644dba03e4b655c71994a190ffa3b3e368a / cache287. Synthetic saved support step and 0/12 document flags only; no real member record used.

From My Plan, choose Documents. The page shows Document checklist and Your checklist, with My Plan selected, but the URL is only ?tool=resources. Reloading then shows Resources and support, the topic selector set to Claims help and veteran organizations, and the VSO directory. The checkmarks are not demonstrated lost; the defect is loss of the member's current destination.

Bounded fix: a closed document route and consistent document entry points, preserving reload/direct-link/history identity, saved progress, other resource routes, and exact policy/source content. This is a usability hypothesis and local lab observation, not field or retention evidence.

## Release intent

This iteration and the five preceding local improvements are authorized for release after review: support outcomes, support draft continuity, compact support review, exact search result handoff, document checklist, and document route continuity. No J1/S2, schedule, budget, AI provider, credential or notification configuration changes.

## Candidate UI observations

On candidate index8d88b6cf / cache288, root directly opened ?tool=resources&view=documents. It rendered the checklist, focused tops-plan-documents and retained 0/12. Reload retained the same URL, heading, count and saved status. Back to My Plan restored the hub and focused its Documents shortcut. From that shortcut, browser Back returned to My Plan and Forward restored Documents with heading focus. This resolves the baseline orientation defect in these local observations.

375x812 CSSpx light-theme emulation after reload shows the Back control, checklist explanation/progress and initial document cards legibly, with ordinary vertical scrolling. Screenshot after-reload-375.png is this synthetic 0/12 state. No document flag was changed in this pass. Actual phone hardware, manual AT and uncoached member outcomes remain unmeasured.

Final local source05a37549112e5e39b4a68470c538c4422abae477833ce028300b8b1f868059ee/cache288 includes the independently found fresh-direct history correction. Root reloaded this exact source in the existing375px visit and confirmed the document URL, heading and0/12 count again; after-reload-375.png was refreshed. Fresh null-history entry behavior is independently tested, not claimed as root execution. Root also expanded Home's More tools section and activated the native Document checklist button with Enter; it opened the same stable URL. This used the earlier8d88b6cf version of the unchanged tile.
