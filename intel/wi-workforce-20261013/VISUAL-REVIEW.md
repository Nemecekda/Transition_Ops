# Wisconsin guide visual review - October 13, 2026

Local synthetic UI review, Codex in-app browser, http://127.0.0.1:18776/. Tested source SHA-256: `970486291e4e0ea0c360439688c604fc6eafb5398a28e89889654b0ecf7f93b5` (index.html). No personal data, AI requests, provider calls, contact forms or enrollment used.

- Reloaded current build. Career initial screen retains the resume and resume-free starting choices; Wisconsin did not add a new first-screen card.
- At 375 x 812 CSS pixels, Home search for Wisconsin returned the named resource. Activating it opened Resources / All resources, expanded the Wisconsin guide and focused its Ask before you spend heading.
- First arrival placed the guide halfway down the phone below unrelated directory content. S3 corrected placement and scroll. Repeated complete Home search path on the corrected build: guide top approximately 135px, heading approximately 213px, direct visible primary action and readable approval-before-spending steps.
- Wisconsin guide now sits outside directory filters, immediately above them. Independent automated review owns the Guard/Reserve filter and clipboard checks.
- At 375px viewport, document scroll width was 371px. At 320px it was 316px. No horizontal overflow observed in this flow.
- Normal 1280px viewport: official Job Center and training links, conditional funding text, three practical steps and expanded generic questions were readable. Tab from Questions to ask your career planner moved to Copy questions.
- Restored default viewport. Kept preview tab 4 as deliverable. Screenshots: `mobile-guide.jpg`, `desktop-guide.jpg`.

This is a bounded local visual/navigation check. Manual assistive-technology matrix, hosted acceptance and production deployment remain pending. No claim about successful individual funding or member usefulness outcomes.
