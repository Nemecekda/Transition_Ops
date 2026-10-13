# Wisconsin work-cost help - local build, October 13, 2026

Members who need work tools or training can now find a Wisconsin Job Center, understand the need for approval before spending, and copy a short set of questions. The same compact guide appears within Career's learning options and before Resources filters. Home searches for Wisconsin, WIOA, work tools or training open the exact guide and focus its heading. The guide remains accessible when Guard/Reserve or other directory filters are selected.

This is an individual-assessment referral, not a promise of free tools or tuition. The copy retains eligibility, local rules, available funding and prior-approval conditions; ETPL listing explicitly does not mean funding approval. S2's primary-source findings and member-impact entry are retained here. No private meeting contacts, employer names, dollar caps or member details appear in the app.

## Scope and identity

- Branch: `codex/wisconsin-work-support`.
- Parent: `c4de90b3db7b869f29617fac53292f0add9d3536`, preserving yesterday's unpublished Career simplification.
- Refreshed `origin/main`: `391b810acc9bebc04d8bcdbf11764c66944d409f`; no reconciliation was required.
- App changes: reusable `WisconsinWorkSupport`, two existing resource placements, one Home search result, narrowly targeted focus/scroll handling. The legacy resource data and filtered counts are unchanged.
- Cache: 280 to 281. App index SHA-256: `970486291e4e0ea0c360439688c604fc6eafb5398a28e89889654b0ecf7f93b5`.
- No new storage, intake, automatic submission, model use or network integration. Copy acts only on the fixed generic question. Manual-copy fallback is selectable and focused. Official links leave the app only on deliberate activation.
- Local preview: `http://127.0.0.1:18776/?tool=resources`.

## EDIT validation

All final commands exited 0. Full command output is retained in `evidence/`; commands were unpiped. Node v24.18.1 and local Chrome 154.0.8037.99; synthetic scenarios, external/provider traffic blocked, clipboard success/denial stubbed. Existing installed dependencies were reused through a temporary symlink, then the symlink was removed before staging.

| Check | Output |
| --- | --- |
| `node scripts/wisconsin-work-support-browser-regression.js` | `wi.log` |
| `node scripts/career-simple-entry-browser-regression.js` | `entry.log` |
| `npm run test:policy-content` | `policy.log` |
| `node scripts/nav-token-regression.js` | `nav.log` |
| `npm run test:openai-migration` | `openai.log` |
| `npm run test:sw-privacy` | `sw.log` |
| `npm run test:privacy-network` | `privacy.log` |
| `npm run test:runtime-ai-spend` | `spend.log` |
| `npm run test:accessibility-release` | `a11y.log` |
| Structural inventory, presence/absence, encoding and diff check | `structural-gate.txt` |

Method: discrete component, placement, search/focus and cache edits; replacement counts asserted. The initially proposed placement beside the AJC card was corrected after independent review found its old filter metadata would hide the new route from Guard/Reserve members. The new author test initially referenced an app-internal constant as a global; that harness assumption was corrected to the independently approved literal question. The full final gate passed after that correction. App bytes did not change during the final gate.

Structural validation uses real parsers for all four inline blocks (three JavaScript, one JSON-LD), all tracked JavaScript/MJS/JSON and intended new code/evidence files, plus six workflow YAML documents. Added curly quotes/NBSP and whitespace errors: zero. 4S N/A: no workflow changes. 4B N/A: no public-builder changes. 4N N/A: no dependency, server-function or Netlify configuration changes.

The focused checks cover five search queries, exact destination/focus, filter reset, all four service-population filters, official-link identity/attributes, conditional copy, keyboard copy, denied clipboard, unchanged saved bytes, 320/375/390 reflow and 44px controls. The independent review and root's phone/desktop visual review passed on the same app hash. Existing Career continuity and privacy/spend boundaries passed.

**GATE PASS / LOCAL AUTOMATION PASS.** Manual assistive-technology and hosted acceptance remain pending. No Safari/device-wide, individual funding, usability or retention outcome is claimed. Nothing was pushed, merged or published. When released later, the earlier PAO handout's exact-app-hash guard must remain intact; its old observation is not current proof of this build.
