# Federal Resume readiness - iterations 5 and 6 locally complete

Latest: unsupported extraction numbers are withheld, and multiline scale entries retain the same role ownership rules as inline entries. All 40 extraction cases, 16 multiline handler cases, five full local suites and packaging pass. See [iteration 6](federal-resume-iteration-6/readiness.md) and [iteration 5](federal-resume-iteration-5/readiness.md). Dean should push codex/federal-resume-readiness to refresh PR #59; keep its base ops/openai-parallel-clone. The earlier immutable 1b6b586 run failed at extraction and stopped. Fresh hosted federal, actual federal artifact, phone/manual accessibility and release acceptance remain pending. No agent push or merge occurred.

The following dated section is the historical two-fix handoff at 3347fb6, retained for continuity.

Date: 2026-09-07. Branch: codex/federal-resume-readiness. Worktree: /tmp/tops-federal-resume-readiness. PR base for Dean: ops/openai-parallel-clone.

Both approved fixes are ready for a new preview. This is local acceptance, not production or hosted federal acceptance. The earlier assertion stop was explicitly resumed by Dean. The historical stop and subsequent test/environment failures are preserved.

## Baseline and final evidence

| Measure | Base 7948cac | Final local result |
| --- | --- | --- |
| Six-role fixture: confirmed date/location facts reaching federal generation | 0/12 | 12/12; IDs, owners, and values match audit catalog |
| Directives requiring TIP inside federal resume | 2 | 0 |
| Missing-field contract | Federal templates suggest values; federal audit contains civilian-only missing-field instructions | Truly missing fields remain unfilled; existing structured gaps carry advice; known metadata must remain exact |
| Honest missing-field fixture | Newly added coverage; no retrospective baseline PASS claimed | HTTP 200; all ten dimensions returned; two NEEDS MEMBER FACT dimensions; advice stays outside resume |
| Four simulated audit failures | Existing gate retained | TIP, replaced known dates, posting-only credential, and changed dates each return HTTP 422 with no draft |
| Calls per tested draft | Generation + audit | Two stubbed calls; no added retry |
| Five required local suites | Passed before first fix commit | All pass, including actual LibreOffice DOCX rendering |
| Netlify function package | Existing locked versions | Both AI functions resolve exact required SDK/storage packages; jobs excludes them |
| Browser exceptions / external provider attempts | Separate earlier local evidence | Accessibility automation: 0 / 0 |
| Hosted federal acceptance | Base returned HTTP 422, with four failed review dimensions | PENDING on a fresh candidate; no live retest during fixes |
| Manual assistive technology | PENDING | PENDING |

The test provider is stubbed. Negative fixtures prove the handler respects simulated failed reviews; they do not prove the hosted model will detect every unsupported claim. The prompt request assertions and exact identity check show what the actual handler sends. The old failed hosted run is not reclassified.

## Scope and governance

Only the federal generation instructions, federal audit instructions, eligibility function, and its mode-aware call changed in Resume runtime code. All other bytes of that file match base 7948cac. The civilian eligibility result is also compared directly with its prior behavior. Civilian drafting, formatting, Word export, Navigator, provider configuration, models, budgets, caps, retries, transport, privacy, notifications, dependencies, and Netlify configuration are unchanged. Protected-file hashes are in the scope evidence.

The approved missing-field change makes citizenship and preference templates unfilled. It adds no eligibility assertion. Only genuinely missing fields can remain bracketed; a bracket cannot justify a made-up value or replace a known date/location. Advice and unmet posting requirements use the existing structured output fields.

The old federal prompt hash in RDM-177/RDM-194 is superseded by this explicitly approved change, with behavioral request assertions and the new exact hash retained. No score threshold or validator was weakened. Resume governance v0.25 and hosted RDM-258..263 remain PENDING. No policy proposal is required beyond the approved scope; no new dependency was added.

Cache: no precached asset changed. Active PWA cache remains transition-ops-v152. No cache bump.

## Validation record

- Iteration 1 commit: 96dea57 - confirmed metadata 0/12 -> 12/12.
- Iteration 2 commit message: fix: remove two conflicting federal TIP directives; local gates pass.
- Full iteration log: federal-resume-readiness-log.md.
- Test outputs: federal-resume-readiness-evidence/. manifest.json records each original log's byte count and SHA-256.
- Final successful outputs have names beginning iteration-2-final-. Accessibility success is specifically iteration-2-final-accessibility-retry.txt; the earlier accessibility log is a startup FAILURE.
- Structural evidence covers 24 JavaScript modules/scripts, 15 existing JSON files, six YAML files, one inline JavaScript block, and one JSON-LD block. The added evidence manifest is separately parsed before commit.
- Actual packaging uses installed Netlify CLI 26.1.0 and packager 14.7.1: openai 7.8.0, @netlify/blobs 10.7.13, @netlify/otel 6.0.6, @netlify/runtime-utils 2.3.0.
- Source/test hunks were reviewed; all resumed exact-match edits passed. No application edits followed the successful final suites.

Initial iteration-2 fixture failure: raw double-underscore placeholders differed from the existing normalized text. The test now explicitly expects that unchanged normalization, with fields still unfilled. The actual audit candidate and released candidate are byte-identical. The app formatter was not changed. The later accessibility startup failure was isolated to its temporary test browser; its failed attempt is retained and the unchanged suite passed alone.

## Next actions for Dean

PREVIEW WARRANTED: these changes affect federal generation and review, which cannot be cleared by civilian or local stubbed evidence.

1. In GitHub Desktop, choose the tops-federal-resume-readiness worktree and verify current branch codex/federal-resume-readiness. Publish that branch.
2. Create the pull request into ops/openai-parallel-clone. Keep this separate from main.
3. Use the new pull request's Netlify preview. Record the immutable deploy ID, exact commit/tree, site, and context. Existing preview #46 does not automatically contain this unpushed branch.
4. Execute the federal acceptance procedure below on that candidate. Stop on a failed result; no repeat generation to seek a PASS.
5. Keep the existing manual accessibility gate open until its required device/screen-reader matrix is completed. Dean owns merge and production release.

## Fresh federal acceptance procedure

Use only the fictional profile in federal-resume-readiness-phone-fixture.txt. Start a fresh preview session, choose Career, Resume Drafter, Federal (USAJOBS), and paste the source and fictional announcement into their respective fields. Do not add real member information or missing citizenship/preference/hours/salary/supervisor facts.

Generate one fact sheet. Compare all six titles/employers, six exact dates, six locations, twelve separate duties, three education entries, and two certifications to the source. Confirm only if exact. Workday certification appears only in the fictional posting and must not become a member fact.

Activate federal drafting once. Record HTTP outcome, elapsed time, browser request/handler counts, scorecard, blockers, and separate gaps using the existing diagnostics. At most the existing single structural fact repair is allowed: total provider maximum four calls; no new provider or browser retries. Browser counts are not provider counts; record provider count as unverified if it cannot be established without collecting member content.

For a released draft, confirm known dates/locations survive exactly, six roles stay separate, and all factual claims trace to their owning confirmed facts. Only actually unprovided fields may be unfilled. No TIP, advice, invented qualification, inferred citizenship/preference, or posting-only credential may appear as resume content. Missing facts and unmet qualifications belong in the gaps report. Return every one of the ten dimensions, with honest NEEDS MEMBER FACT where applicable; no failed dimension or blocker can be dismissed because another dimension passed.

On desktop and Dean's phone, download the released federal file once. Record its actual filename, MIME/type, successful opening, page rendering, content continuity, role boundaries, visible ending, and lack of clipping. Do not infer the file type from the button label. A withheld draft must expose no download and cause no export. The working civilian DOCX remains separate evidence.

Record each hosted acceptance row independently: identity/grounding, announcement isolation, missing-field truth, specialized experience, artifact/rendering, and terminal stop. Safari/VoiceOver, Chrome/NVDA, Edge/JAWS, and Android Chrome/TalkBack manual acceptance remain distinct from the local automation.

## Branch boundary

Nothing was pushed, merged into main, or deployed by the agent. No live provider request or external send was made during these fixes. The shared checkout remains on ops/openai-parallel-clone at 7948cac, with its existing untracked release records and four stashes preserved. Main and origin/main remained d825163 when read. The fix branch contains only the two local defect commits above the clone integration base after the second commit is created.
