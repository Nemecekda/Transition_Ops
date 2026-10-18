# Wisconsin pathway: source coverage and bounded referrals

Checked: **2026-10-16, America/Chicago**. Analyst: S2 primary-source verification subagent (Codex). This is a research and staged-copy artifact; no app files, accounts, providers, J1/S2 runners, or paid APIs changed or invoked.

## Scope and evidence

Inspected the actual app at `/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops`, commit `1149ede281423de94d4ef1f93cefa35a18f12ca7`. This is the pre-merge inventory snapshot, not the identity of the current implementation branch. Its working tree was clean when inspected; S3 reports the current implementation baseline as `ffede2397c22af055c97c74a8afe631d22edbc7b`, cache 289. Source inspection establishes presence, not discoverability, successful applications, eligibility, or member outcomes. Primary pages below were read using the web tool at verification ladder tier 1 on the checked date. Search snippets were not substituted for page reads. Initial access failures were resolved by root browser tier 2; the narrow confirmations and retained receipts are recorded below.

**Do not call this all Wisconsin benefits.** This first pass covers useful statewide entry points. County/tribal programs, specialized eligibility rules, benefit interactions, current local funding and every Reserve-component process have not been exhaustively audited.

Actual Wisconsin coverage found:

- `index.html:7472–7556`: Wisconsin work tools/training WIOA guide, Job Center directory, training search, local approval/funding caveats; usable from Career, Resources and the saved next action.
- `index.html:6767–6795`: Wisconsin Service Member Support referral, inside the Guard career support directory; national alternatives remain present.
- `index.html:15357–15359`: WDVA county/tribal service officer locator, inside Claims help and veteran organizations.
- Operation Ownership appears in Career content/search. It is a business-ownership referral, not a public benefit and not evidence of statewide coverage.
- No matches for MyWisVets, Wisconsin GI Bill, Wisconsin National Guard Tuition Grant, WDVA property tax credit, VORP, DSPS military licensing or Wisconsin housing aid in the inspected app. National healthcare, housing, education, benefits and Guard/Reserve tools exist; absence of a Wisconsin entry does not mean absence of the national topic.

## Coverage matrix

All `CONFIRMED` ratings below are limited to the named referral, agency role and stated caveat. They do not rate any visitor eligible. Records `WI-20261016-01` through `WI-20261016-12`, plus `HEALTH-DIRECTORY`, `NATIONAL`, `USERRA` and optional `ESGR`, are fully staged in `verification-log-append.md`; integrate selected records into `intel/verification-log.md` before copying benefits text into the app.

| ID / member need | Existing app | Confirmed source and bounded finding | First-pass disposition |
|---|---|---|---|
| 01 / Find the right starting office | WDVA locator exists deep in claims help | [WDVA county/tribal officers](https://dva.wi.gov/resources/find-my-cvso-tvso/) provides an official route to local assistance with state/federal benefits for service members, veterans and families. | SHIP — ACT: promote the existing verified route as a first step; do not duplicate its directory. |
| 02 / Check state benefits | MyWisVets not found | [WDVA getting started](https://dva.wi.gov/get-started-with-wdva/) and the [public MyWisVets landing page](https://apps.dva.wisconsin.gov/mywisvets) identify the state portal and WDVA review. Registration is not an eligibility award. | SHIP — ACT: route to the public portal or a county/tribal officer; collect no documents in Transition OPS. |
| 03 / Pay for college | Wisconsin GI Bill not found | [WDVA Wisconsin GI Bill](https://dva.wi.gov/benefits/education/wi-gi-bill/) distinguishes state tuition remission from the federal GI Bill, with WDVA certification and a separate school determination. Service, residence and student rules apply. | SHIP — ACT: offer the exact application guidance; do not promise coverage to someone merely moving here. |
| 04 / College while serving in the Wisconsin Guard | State grant not found | [DMA tuition grant](https://dma.wi.gov/wisconsin-national-guard-tuition-grant/) provides current online application instructions, administrator contacts and school listings. It is a Wisconsin National Guard program, distinct from the Wisconsin GI Bill. | SHIP — ACT for referral only. Detailed rules/amounts/term windows deferred; reference-manual access was resolved at root tier 2. |
| 05 / Find work or fund training/tools | WIOA guide exists; broader DWD veteran job route not found | [DWD Veteran Job Seeker](https://dwd.wisconsin.gov/veterans/employment/) directs visitors to Job Centers and state job-search services. [DWD supportive-services policy](https://dwd.wisconsin.gov/wioa/policy/08/08.6.htm) allows local delivery decisions; tools are among possible supports. | SHIP — ACT: connect the existing WIOA guide and a Job Center contact. No guaranteed funding or job placement. |
| 06 / Use military training or an existing license | DSPS route not found | [DSPS military credentialing](https://dsps.wi.gov/credentialing/military-benefits-related-to-credentialing/) covers possible military-training equivalency, initial credential fee assistance, and reciprocity routes. Requirements differ by profession and pathway. | SHIP — ACT: one DSPS route; no statement that military service automatically grants a license. |
| 07 / Housing instability | National resources exist; Wisconsin VHRP not found | [WDVA Veterans Housing and Recovery](https://dva.wi.gov/services/housing-and-financial-services/veterans-housing-and-recovery/) offers a referral/application contact for veterans homeless or at risk. Spouses/children cannot reside at VHRP sites; staff can help families find other resources. | SHIP — ACT: expose application/referral contact and family limitation together. No bed or admission promise. |
| 08 / Financial hardship or health-care costs | Specific WDVA grant not found | [WDVA Health Care/Subsistence Aid](https://dva.wi.gov/services/mental-health-and-emergency-services/subsistence-aid-health-care-aid-grants/) describes limited, conditional assistance after other aid is exhausted and applications through a county/tribal office. | SHIP — ACT: office assessment only; do not imply general emergency cash for all veterans. |
| 09 / Mental health and recovery support | National help exists; Wisconsin VORP not found | [WDVA VORP](https://dva.wi.gov/services/mental-health-and-emergency-services/veterans-outreach-and-recovery/) connects people who served, including continuing Guard/Reserve members, with regional support and community services. | SHIP — ACT: regional coordinator route. Preserve existing immediate-crisis access; VORP is not presented as an emergency response line. |
| 10 / Taxes and moving home | Wisconsin-specific routes not found | [DOR military/veteran tax hub](https://www.revenue.wi.gov/Pages/Individuals/military.aspx) separates residency, pay, retirement and credit topics. [WDVA property tax credit](https://dva.wi.gov/services/housing-and-financial-services/property-tax-credit/) identifies WDVA certification and DOR administration. | SHIP — ACT: link official guidance and certification route without calculating or promising a credit. |
| 11 / Family support, deployment and demobilization | DMA support link exists | [DMA Service Member Support](https://dma.wi.gov/service-member-support-division/) offers referral/case-management support across the deployment cycle, with DEERS, TRICARE, employment and family resources. Individual programs have separate requirements. | SHIP — ACT: make the existing referral easier to reach. Do not turn a support-directory choice into a component or residency determination. |
| 12 / Retirement and survivors | Federal Guard/Reserve planning exists; Wisconsin RAO not found | [DMA Retiree Activities Office](https://dma.wi.gov/retiree-activities-office/) lists offices and information/referrals for retirees and survivors across services. | SHIP — ACT: office contact route only. Do not import its entire legacy external-link list as verified current guidance. |
| HEALTH-DIRECTORY / Compare care and coverage options | National healthcare tool exists; Wisconsin DHS entry not found | [Wisconsin DHS Health Care and Coverage](https://www.dhs.wisconsin.gov/health-care-coverage/index.htm) provides a directory of official care and state-program information. | SHIP — ACT: route to program information without deciding enrollment or substituting for VA/TRICARE guidance. |

## Brief first-pass member copy

Use a neutral national heading such as **"Find help where you live"** with a clearly selected **Wisconsin** view. Keep national tools accessible. "Wisconsin" describes the resources being browsed, not an eligibility decision or inferred residence.

Each block below is derived only from its corresponding confirmed record. The office/portal determines eligibility. Suggested question text is an editable conversation aid, not a required application step.

**01 — Not sure where to start?**

Find your county or tribal Veterans Service Office for help identifying state and federal benefits and application steps. **Action:** [Find my local veterans office](https://dva.wi.gov/resources/find-my-cvso-tvso/). **Question:** "I live in, or plan to move to, Wisconsin. Which benefits should I check, and what should I bring?"

**02 — Check Wisconsin benefits**

MyWisVets is Wisconsin's benefits portal. WDVA reviews your information and supporting documents; an account does not establish eligibility. **Action:** [Open MyWisVets](https://apps.dva.wisconsin.gov/mywisvets). Submit sensitive records only through the official process, not this app.

**03 — School and tuition**

The Wisconsin GI Bill is separate from the federal GI Bill. WDVA and your school review different parts of eligibility. **Action:** [See Wisconsin GI Bill application steps](https://dva.wi.gov/benefits/education/wi-gi-bill/). Ask the school's Veteran Certifying Official how state and federal benefits apply before committing to a funding plan.

**04 — Wisconsin Guard tuition**

Wisconsin National Guard members have a separate tuition-grant application route. Check the official instructions and school requirements with the program administrator. **Action:** [Open Guard tuition guidance](https://dma.wi.gov/wisconsin-national-guard-tuition-grant/). Do not assume a different Reserve component qualifies for this state Guard program.

**05 — Work, training and tools**

Connect with a Wisconsin Job Center for job-search help and a review of training or work-cost support. Assistance depends on the program and your situation. **Action:** [Find a Wisconsin Job Center](https://wisconsinjobcenter.org/directory/). Reuse the existing work-cost guide for questions to ask before spending.

**06 — Professional licenses**

Military training, an existing out-of-state license or eligible military status may open a different application route. Requirements vary by profession. **Action:** [See DSPS military licensing options](https://dsps.wi.gov/credentialing/military-benefits-related-to-credentialing/). Check the profession's requirements and fee assistance before applying.

**07 — Housing help**

If you are a veteran without stable housing or at risk of losing it, contact Wisconsin's Veterans Housing and Recovery Program about referrals and applications. Spouses and children cannot live at its sites; ask staff about family housing resources. **Action:** [Contact the housing program](https://dva.wi.gov/services/housing-and-financial-services/veterans-housing-and-recovery/).

**08 — Help with essential costs**

WDVA offers limited health-care and subsistence aid with specific eligibility rules, after other support is exhausted. **Action:** [Ask a county or tribal veterans office about WDVA aid](https://dva.wi.gov/resources/find-my-cvso-tvso/). [Read the grant requirements](https://dva.wi.gov/services/mental-health-and-emergency-services/subsistence-aid-health-care-aid-grants/).

**09 — Someone to help with recovery**

Wisconsin's Veterans Outreach and Recovery Program connects people who served, including current Guard and Reserve members, with community services and ongoing support. **Action:** [Find my regional VORP coordinator](https://dva.wi.gov/services/mental-health-and-emergency-services/veterans-outreach-and-recovery/). Keep the app's existing urgent-help route separate and immediately available.

**10 — Wisconsin tax questions**

Use the state's military and veterans tax guidance for residency, military income and benefit-credit questions. A move to Wisconsin does not by itself establish eligibility for a veteran credit. **Action:** [Open Wisconsin military tax guidance](https://www.revenue.wi.gov/Pages/Individuals/military.aspx). For the veteran property tax credit, use [WDVA's certification guidance](https://dva.wi.gov/services/housing-and-financial-services/property-tax-credit/).

**11 — Serving, returning from deployment or helping family**

Wisconsin's Service Member Support team connects service members, veterans and families with practical support and local referrals. **Action:** [Find Wisconsin service and family support](https://dma.wi.gov/service-member-support-division/). Ask which office can help with your current service and family situation; individual programs have separate rules.

**12 — Retirement and survivor questions**

Wisconsin's Retiree Activities Office offers information and referrals for military retirees and survivors. **Action:** [Find a retiree office](https://dma.wi.gov/retiree-activities-office/). Use the existing federal retirement tools for planning; confirm personal decisions with the responsible service or agency.

## Member-impact application

These are durable service referrals, not newly changed policy. For selected cards, append a verification-log record before publication with the bounded source claim and corresponding exact A2 act below. A suggested UI label alone does not make an unlogged benefit claim ready to ship.

Common assessment: assessor S2 primary-source verifier, date 2026-10-16; timing ACT AVAILABLE NOW; revisit NONE; EXPIRES NONE (links and agency guidance still require maintenance); surface RESOURCES; citation token NONE (direct links, not a new Navigator token). Existing Guard/Reserve module may point to the same view. Any benefit-comparison copy triggers a validation sweep for confusion with federal GI Bill/Guard tuition, insurance versus health-care aid, and tax credits versus exemptions.

| ID | A1 population / exclusion | A1 timing band | A2 act (ceiling for downstream instructions) | A4 cost |
|---|---|---|---|---|
| 01 | All four: separating, Guard/Reserve, already separated and family can seek the office's referral help; not an eligibility claim. | Condition-triggered: seeking Wisconsin benefits help; no separation-day offset. | Use WDVA's Find My CVSO/TVSO directory to contact the county or tribal office for your Wisconsin benefits questions. | NOTHING; no magnitude attributed to a referral. |
| 02 | Already separated; Guard/Reserve seeking review of veteran benefit eligibility; family directed to portal's family information. This does not establish eligibility for someone solely because they plan to move. | Condition-triggered state-benefit inquiry; no separation-day offset. | Open MyWisVets to see the state benefits application process and WDVA's review requirements, or use the county/tribal office for help. | NOTHING; browsing is not a benefit award. |
| 03 | Separating, already separated, Guard/Reserve and spouse/family applicants who seek a determination under the relevant student rules. | Condition-triggered prospective enrollment; no separation-day offset. | Follow WDVA's Wisconsin GI Bill application guidance and contact your school's Veteran Certifying Official for the school determination and benefit-use questions. | MONEY: unconfirmed funding assumptions can affect tuition commitments. |
| 04 | Guard/Reserve, specifically Wisconsin National Guard applicants. This does not apply as a state Guard entitlement to members solely of a different Reserve component. | Condition-triggered academic term; no separation-day offset. | Open DMA's Wisconsin National Guard Tuition Grant page and use its administrator contact to check the application and school requirements. | NOTHING; no specific lost award established from referral alone. |
| 05 | All four may inquire at Job Centers; funded services remain individually assessed and do not follow automatically from military affiliation. | Condition-triggered work/training need; no separation-day offset. | Contact a Wisconsin Job Center to ask about job-search help and eligibility and approval for training or work-cost support before spending. | MONEY: spending without program approval may leave costs uncovered. |
| 06 | All four may need military-related credentialing information; a family inquiry is not a blanket spouse waiver. | Condition-triggered credential application; no separation-day offset. | Open DSPS military credentialing guidance and check the applicable profession's application, training-equivalency, reciprocity and fee-assistance requirements. | MONEY: fee-assistance and credential requirements must be checked before committing costs. |
| 07 | Already separated, including former Guard/Reserve, who need housing assessment; spouse/family can seek alternative referrals. This does not permit spouses or children to reside at VHRP sites. | Condition-triggered housing instability; no separation-day offset. | Contact the VHRP office listed on WDVA's housing page about referrals, applications and family housing alternatives when applicable. | NOTHING; no admission or financial outcome inferred. |
| 08 | All four can ask about the relevant veteran or military-family aid rules; actual populations are separately defined by WDVA. | Condition-triggered hardship; no separation-day offset. | Contact the county or tribal Veterans Service Office through WDVA's directory to ask whether Health Care Aid or Subsistence Aid requirements fit your situation. | NOTHING; inquiry alone establishes no grant. |
| 09 | Separating, already separated and Guard/Reserve who have served; families may help make the connection. This is not a general family-treatment entitlement or emergency-response service. | Condition-triggered recovery/support need; no separation-day offset. | Use WDVA's VORP page to contact the coordinator for your Wisconsin region about support and community services. | NOTHING; no treatment outcome inferred. |
| 10 | All four, with different tax/residency/survivor circumstances. No tax credit follows automatically from the audience label. | Condition-triggered move, tax return or credit certification; no separation-day offset. | Open DOR's military/veterans tax hub for your tax question and use WDVA's certification route when seeking the veteran property tax credit. | NOTHING; no individual financial determination made. |
| 11 | All four: DMA describes service members, veterans and families; military-family grants have separate rules. | Condition-triggered deployment, return or family need; no separation-day offset. | Contact Wisconsin's Service Member Support team using DMA's support page to identify the office for your current service or family question. | NOTHING; no program approval implied. |
| 12 | Already separated military retirees; Guard/Reserve retirees; spouse/family survivors. This is not a retirement-pay award for every separated veteran. | Condition-triggered retirement/survivor inquiry; no separation-day offset. | Use DMA's Retiree Activities Office page to contact an office for military-retiree or survivor information and referrals. | NOTHING; information alone establishes no entitlement. |
| HEALTH-DIRECTORY | All four may need care/coverage information; program eligibility is independently determined. | Condition-triggered care/coverage inquiry; no separation-day offset. | Open Wisconsin DHS's Health Care and Coverage directory to find official information for the health program or care option you need. | NOTHING; directory access establishes no coverage. |

The implementation's **Move to Wisconsin and plan your costs** group starts with DOR residency/tax guidance and the existing Final move tool. Housing instability is an optional condition, not assumed from choosing the moving group. VHRP remains a secondary referral with the family-residence exclusion visible beside it.

## Open coverage backlog and exclusions

1. **Education depth:** VetEd reimbursement, private/nonprofit school grant, federal/state benefit coordination and specific school residency decisions need separate coverage. Do not reduce multiple programs to a single "free college" promise.
2. **Moving to Wisconsin:** returner versus new resident, future arrival versus current residence, state-entry-of-service history and federal Reserve versus Wisconsin Guard must stay distinct. Selecting Wisconsin in an interface is not evidence of any of these facts.
3. **Ongoing Guard/Reserve:** federal USERRA/ESGR, mobilization/demobilization healthcare, gray-area retirement and branch-specific reserve education are partly present nationally, but not reverified as a complete Wisconsin journey here.
4. **Family and daily life:** spouse employment/licensing, childcare, survivor eligibility, disability supports, local transportation, energy/food assistance and county/tribal grants need separate program checks. The DMA/WDVA referral hubs provide a first path while these remain open.
5. **Other Wisconsin benefits:** driver/vehicle identifiers and waivers, outdoor recreation, veterans homes, burial/cemetery benefits, veteran-owned-business certification and entrepreneurship assistance need dedicated verification. Existing Operation Ownership is not a substitute for those benefits.
6. **Health coverage:** [Wisconsin DHS care/coverage directory](https://www.dhs.wisconsin.gov/health-care-coverage/index.htm) is confirmed as a directory for health programs and care options. No personal BadgerCare, Medicaid, VA or TRICARE coverage conclusion was made. Preserve existing healthcare guidance; add state options only with clearly separate program rules.
7. **Human testing:** no evidence here proves that a first-time visitor understands the flow, reaches an office, receives a benefit or returns. Test member-selected state → need → one next action → return on mobile; keep results labeled synthetic until actual feedback exists.

**DECLINE / LOG ONLY:** the DWD Vets Ready employer award/application cycle is not a new action for an individual member in this iteration. Do not add employer award administration to the member's first-step flow. The existing employment referral is the useful asset.

## Access ladder record and resolution

- URL: `https://dma.wi.gov/wisconsin-national-guard-tuition-grant-reference-manual/`
- Entry: linked as the tuition reference manual from the successfully read DMA grant page.
- Date: 2026-10-16. Tier attempted: 1, direct web open via the official link. Result: tool `Internal Error`; no HTTP status supplied.
- Resolution: root browser tier 2 read the official manual on 2026-10-16; `wing-manual-browser-20261016.txt` retains the page text. S2 confirmed the introduction identifies a state program for Wisconsin National Guard members at qualifying schools. No detailed monetary, deadline, stacking or recoupment rules are added to this iteration.
- Search excerpts are not the citation of record. No exact term window, cap, stacking rule or detailed eligibility instruction from that manual is included in the first-pass copy.

Additional national entry points initially failed at tier 1: VA directory 400 fetch timeout, DOL USERRA 403, ESGR deployment page 502. Root browser tier 2 resolved all three on 2026-10-16; S2 read the retained texts:

- `national-locator-browser-20261016.txt`: **CONFIRMED** VA external directory contains state veterans offices, including Wisconsin and neighboring states. Ship "Find another state's veterans office." Do not promise a preselected filter or automatically selected residence.
- `dol-userra-browser-20261016.txt`: **CONFIRMED** DOL VETS offers information and assistance for service-related civilian employment problems. Ship an official-help route; no individualized rights decision, deadline or universal reinstatement guarantee.
- `esgr-browser-20261016.txt`: **CONFIRMED referral existence only**. Readable pre-/de-mobilization headings and USERRA/assistance links; the checklist body was not present in the accessibility text. Link as an optional resource only. Do not synthesize its missing checklist.

These source reads supersede the initial access failures without converting search snippets into evidence. Detailed national source/impact records are in `verification-log-append.md`.

No signed-in application, form submission, benefit enrollment, record upload or contact message was attempted.
