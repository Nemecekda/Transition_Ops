# Local validation receipt

EDIT MODE. Initial candidate changes: `index.html`, `pwa-sw.js`, the Career entry browser regression and one Resume handoff selector. Intended evidence is confined to this directory. Base main: `391b810acc9bebc04d8bcdbf11764c66944d409f`.

Final app SHA-256: `1a15a9fff1649f74a11c3d2c38a1ea212f0329dcde140b3249bfadf7ff4b71bf`.
Exact implementation/test hashes: `evidence/candidate.json`.

| Command | Exit / observed final output |
| --- | --- |
| `npm run test:openai-migration` | 0; `PASS: synthetic RDM-1..RDM-263 integration paths` |
| `npm run test:sw-privacy` | 0; `SW-PRIVACY REGRESSION PASS` |
| `npm run test:privacy-network` | 0; `PRIVACY-NETWORK REGRESSION PASS` |
| `npm run test:runtime-ai-spend` | 0; `PASS: runtime AI spend governance synthetic suite` |
| `npm run test:accessibility-release` | 0; `LOCAL AUTOMATION PASS` |
| `node scripts/career-simple-entry-browser-regression.js` | 0; `CAREER SIMPLE ENTRY PASS` |
| `node scripts/career-resume-handoff-browser-regression.js` | 0; `RESUME HANDOFF PASS` |
| `node scripts/career-tools-focus-browser-regression.js` | 0; `CAREER TOOLS FOCUS PASS` |

Full final mandatory-command and entry logs are in `evidence/`. The final resume-handoff run reported:

```text
RESUME HANDOFF PASS: explicit source confirmation, actual added/kept disposition, occupied target/experience/facts/output/loading preservation, return focus and continuity, historical receipt, ordinary-entry/reload clearing, restore cleanup source check, legacy/mobile themes, no writes or provider calls.
```

The tool-focus run reported:

```text
CAREER TOOLS FOCUS PASS: held-frame normal heading transfer and rapid member focus retained; native Enter activates Resume at375/320; no data writes or API requests.
```

`evidence/structural-gate.txt` records the explicit JS/MJS/JSON/YAML inventories and real parse results. The four intended independent-review JS probe additions and two new evidence JSON files were separately parsed before commit, extending the checked inventory to 112 JS, 9 MJS and 86 JSON files. Added-line encoding and whitespace checks passed. All implementation hunks were inspected. Gate 4S, 4B and 4N are N/A because this diff does not touch workflow, public builder, dependencies, function or Netlify boundaries; the public build still executed successfully within the worker privacy regression.

Initial local attempts encountered absent dependencies and a sandbox denial of temporary public-build output. Reusing the existing dependency tree through a temporary link and running the authorized managed-worktree checks resolved those environment issues. The link was removed. No dependencies were downloaded or changed. An initial static gate expectation counted two identical AI-guard fragments even though one includes a saved-state clause; separate exact expectations both passed. An early native Enter test omitted its text event; the established keyboard-harness event sequence activated Clear correctly. Independent review reproduced the actual focus defects, and the implementation was corrected before the final checks.

No paid model invocation, credential access, API job search, workflow dispatch, send, push, merge or deployment occurred. Accessibility is local automation only; manual AT and hosted release acceptance remain PENDING. Real member usefulness and return remain unmeasured.
