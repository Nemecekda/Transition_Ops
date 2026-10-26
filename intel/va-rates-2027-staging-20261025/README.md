# 2027 VA-rate preparation — UNOFFICIAL, NON-RUNTIME

Checked October 25, 2026. Nothing in this folder is an approved 2027 VA rate table. No app code, rate selector, reminder, publication, schedule, J1 process or budget changed.

## Findings and scope

- CONFIRMED: VA's current veteran-compensation page still labels its tables **2026**, effective December 1, 2025. Source read directly: https://www.va.gov/disability/compensation-rates/veteran-rates/ . All **122 dollar cells** in the local cache303 runtime `VA_PAY_2026` match that table: two flat10/20% amounts, 96base configurations (eight ratings ×12 dependent configurations), eight additional-under18-child amounts, eight qualifying-school-child amounts, eight spouseAid&Attendance amounts. No baseline dollar discrepancies found. This compares table data, not every calculator branch or eligibility rule.
- CONFIRMED 2026 corroboration: VA FederalRegister notice https://public-inspection.federalregister.gov/2026-02997.pdf identifies P.L.119-42, 2.8% and December1,2025 effective date. It does NOT authorize2027 rates.
- SSA3.6% announcement is a SocialSecurity fact, not proof of finalized VA2027 rates. Parent read https://www.ssa.gov/news/en/advocates/2026-10-14.html . The scenario uses the user's specified1.036 multiplier only.
- Current legislative status checked by parent via orchestrator browser: https://www.congress.gov/bill/119th-congress/senate-bill/4487 showed Introduced; latest action May11,2026, Senate read twice and referred to VeteransAffairs. Its introduced summary proposes December1,2026. No enactment verified. Direct analyst accesses to S4487/all-actions failed UnexpectedStatusCode and HR8552/all-actions failed Cachemiss; tier2 supplied S4487 page observation. HR8552 latest status remains unresolved, so this review does not certify exhaustive legislative status.
- Official2027 VA compensation tables were not found in this review; the current official page is2026. Do not present the scenario as payable benefits or an eligibility award.

## Artifacts and arithmetic limit

`UNOFFICIAL-SCENARIO-NOT-VA-RATES.csv` contains all122 existing runtime cells multiplied independently by Decimal('1.036'), rounded HALF_UP to cents. Every row explicitly says UNOFFICIAL. `stage_scenario.py` reproduces both the independent baseline check and arithmetic. `baseline-comparison.json` records exact local file hash and zero baseline discrepancies.

**Important:** multiplying each total dependent configuration is not necessarily VA's eventual statutory component-rounding method. Even the current dependent additions use whole-dollar amounts for some ratings. These arithmetic outputs are for internal preparation only, not a ready-to-ship replacement. Once VA posts official tables, replace projected cells with exact official amounts and re-verify every dependent row and addition. For example, the no-dependent100% scenario is4080.37; that is not an approved2027 payment.

Key definitions: alone=no dependents; sp=spouse; p1/p2=one/two parents; c1=one child; combined keys describe those combinations. `addChild18` is each additional child under18; `addChildSchool` refers to a qualifying school program; spouseAA is the added disability-compensation amount for eligible spouseAid&Attendance, not pensionA&A.

## Out-of-scope rates, explicitly not multiplied

The app explicitly excludes SMC (index.html line19100). Official SMC page https://www.va.gov/disability/compensation-rates/special-monthly-compensation-rates/ was read and still states2026, effectiveDecember1,2025. Its K/Q variations, L/L½/M/M½/N/N½/O-P/R1/R2-T/S tables, child/parent/spouse configurations and added amounts have distinct rules; **no SMC scenario was generated**. Do not infer SMC from a100% rating. DIC, pension, clothing/special allowances and other benefit programs likewise require their own official tables and are not included in these122cells.

## Release conditions

Keep existing official2026 runtime. Before any2027 switch: verify enacted authority and final applicable text; read officialVA2027 tables and dates; compare all122cells with exactofficial values; separately assess changed eligibility/rounding rules; validate dependent combinations and year/effective-date displays; independently review before ordinary release gates. No automatic switch or new monitoring job is created here.

## Optional TRICARE calendar item — recommendation only

Parent primary-source review: https://tricare.mil/FAQs/General/GEN_OpenSeason_WhatWhen states2026 OpenSeason November9–December8,2026, with changes effectiveJanuary1ofnextyear. Corroboration: https://www.dha.mil/News/2026/10/20/13/48/TRICARE-Open-Season-2026 . Consider one eligibility-qualified calendar/reminder entry linkingofficialguidance, only after checking current app for duplicates. Do not imply everyone must reenroll or conflate FEDVIP dates. FAQ excludes TRS,TRR,TYA,TFL,CHCBP from thisOpenSeason. No calendar/app edit made here.

## Claude review adjudication and publication exclusion

Parent obtained actual Claude review in chat98aead8c-a564-4d04-b507-5db75f749faa, message20. Accepted: keep scenario files out of deploy; distinguish legal effective date from first payment/deposit date; note that a qualifying life event may permit TRICARE changes outside OpenSeason (parent primaryFAQ support). Not accepted as verified: Claude's January2027 payment timing assertion. Exactfirstpayment/depositdate remains UNVERIFIED pending officialschedule; no payment date is staged.

Static exclusion check: current candidate `scripts/build-public.js` publishes only `PUBLIC_FILES`, contains no `intel/` entry, and explicitly blocks top-level `intel`. Its `buildExactOutput` copies onlylistedfiles and asserts exactoutputinventory. `netlify.toml` builds `npm run build:public` and publishes `dist`. These artifacts are versioned internal preparation under root `intel/va-rates-2027-staging-20261025/`, outside the public allowlist and deployed runtime. The reproduction script reads this checkout's index.html. The Wisconsin contact release reran the122-cell comparison and exact74-file build; no2027rates were added to the app.
