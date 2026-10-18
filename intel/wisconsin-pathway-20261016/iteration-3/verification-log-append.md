# Iteration 3 verification append packet

Checked October 16, 2026, America/Chicago. Government referral records only; no copied employer roster, new numeric benefit amount, deadline, personalized eligibility decision, nonprofit endorsement or current-vacancy claim. Existing routes are reused when noted. Import into the verification log before runtime copy.

## WI3-20261016-LOCAL-HELP — Start with local benefits help

Rating: **CONFIRMED**. WDVA directs veterans, service members and families to county/tribal officers for federal, state and local benefit assistance. Its official page links the office locator.

Sources read directly on 2026-10-16 (tier 1):
- https://dva.wi.gov/resources/find-my-cvso-tvso/
- https://dva.wi.gov/community-legacy/tribal-veterans/tribal-veterans-service-offices/

IMPACT: SHIP — ACT | A2/A3 | S2 primary-source verifier | 2026-10-16 | revisit NONE
A1 population: All four: SEPARATING (active component), GUARD/RESERVE, SPOUSE/FAMILY and ALREADY SEPARATED may seek the described public referral; each underlying service or benefit has separate eligibility. band: Condition-triggered need or inquiry; no fixed separation band or day-offset. excluded: No specific officer accreditation, service capacity or individual benefit award is certified here. timing: ACT AVAILABLE NOW
A2 act: "Use WDVA's Find My CVSO/TVSO page to contact the appropriate county or tribal veterans office about your benefits questions."
A3 surface(s): RESOURCES / State benefits and local help; existing claims-help locator for CLAIMS-HELP. Placement: reuse existing WI-20261016-01 route; do not duplicate card. token: NONE; direct links. sweep trigger: FIRED — awards vs ownership certification vs current jobs/SkillBridge; claims accreditation vs organization membership; member vs employer grants. Validation-gate owns execution.
A4 cost: NOTHING
EXPIRES: NONE

Runtime summary: A county or tribal veterans office can help you work through benefits questions and find the right local support.
Runtime boundary: Ask the office which services and benefits fit your service history, family situation and Wisconsin connection. A referral does not establish eligibility.

## WI3-20261016-CLAIMS-HELP — Find accredited VA claims help

Rating: **CONFIRMED**. VA provides representative guidance and an accreditation search. Accredited VSO claims representation is free; accredited attorneys and claims agents may charge permitted fees. Availability and appointment are separate.

Sources read on 2026-10-16 (guidance and OGC tier 1; finder tier 2):
- https://www.va.gov/get-help-from-accredited-representative/
- https://www.va.gov/ogc/apps/accreditation/index.asp
- https://www.benefits.va.gov/vso/

Root tier 2 resolved the finder HTML shell: public search form without login, no individual search or appointment. Receipt: `va-representative-browser.txt`. Primary destination: https://www.va.gov/get-help-from-accredited-representative/find-rep/ . Guidance and OGC remain the sources for fee/accreditation distinctions.

IMPACT: SHIP — ACT | A2/A3 | S2 primary-source verifier | 2026-10-16 | revisit NONE
A1 population: All four: SEPARATING (active component), GUARD/RESERVE, SPOUSE/FAMILY and ALREADY SEPARATED may seek the described public referral; each underlying service or benefit has separate eligibility. band: Condition-triggered need or inquiry; no fixed separation band or day-offset. excluded: This does not approve an individual claim, guarantee a representative is available, or make every service from a listed organization free. timing: ACT AVAILABLE NOW
A2 act: "Use VA's accredited-representative guidance and OGC Accreditation Search to check the representative, then contact them about availability and fees before appointing them."
A3 surface(s): RESOURCES / State benefits and local help; existing claims-help locator for CLAIMS-HELP. Placement: claims/help destination plus bounded existing locator copy correction. token: NONE; direct links. sweep trigger: FIRED — awards vs ownership certification vs current jobs/SkillBridge; claims accreditation vs organization membership; member vs employer grants. Validation-gate owns execution.
A4 cost: MONEY
EXPIRES: NONE

Runtime summary: Find a VA-accredited representative for help with a claim or decision review. Accredited VSO representatives provide claims help free of charge; attorneys and claims agents may charge fees.
Runtime boundary: Check accreditation and availability before appointing someone. Membership in an organization does not by itself establish that a particular person is accredited.

## WI3-20261016-JOB-HELP — Get help finding your next job

Rating: **CONFIRMED**. DWD directs job seekers to local Job Centers for one-on-one support. DVOP individualized services target eligible people with specified employment barriers; LVER contacts serve employer outreach.

Sources read directly on 2026-10-16 (tier 1):
- https://dwd.wisconsin.gov/veterans/
- https://dwd.wisconsin.gov/veterans/employment/
- https://dwd.wisconsin.gov/veterans/vetreps.htm
- https://wisconsinjobcenter.org/directory/

IMPACT: SHIP — ACT | A2/A3 | S2 primary-source verifier | 2026-10-16 | revisit NONE
A1 population: All four: SEPARATING (active component), GUARD/RESERVE, SPOUSE/FAMILY and ALREADY SEPARATED may seek the described public referral; each underlying service or benefit has separate eligibility. band: Condition-triggered need or inquiry; no fixed separation band or day-offset. excluded: Do not promise DVOP eligibility to every veteran or send job seekers to the employer-only LVER route. timing: ACT AVAILABLE NOW
A2 act: "Use the Wisconsin Job Center directory to contact a nearby center and ask for one-on-one employment support and any veteran services that fit your situation."
A3 surface(s): RESOURCES / State benefits and local help; existing claims-help locator for CLAIMS-HELP. Placement: reuse existing WI work guide; optional local help choice. token: NONE; direct links. sweep trigger: FIRED — awards vs ownership certification vs current jobs/SkillBridge; claims accreditation vs organization membership; member vs employer grants. Validation-gate owns execution.
A4 cost: NOTHING
EXPIRES: NONE

Runtime summary: A Wisconsin Job Center can help you plan a job search and connect with employment or training services.
Runtime boundary: Ask which services fit your situation. Specialized veteran services have eligibility rules; an appointment or referral does not guarantee a job or funding.

## WI3-20261016-VETS-READY — Find employers recognized for veteran support

Rating: **CONFIRMED**. DWD operates Vets Ready, an employer-recognition initiative. The official page read today lists 2025 winners, corroborated by DWD's 2025 recipient announcement. DWD says JCW lets job seekers search jobs posted by Vets Ready employers. Root tier 2 verified the public Advanced Search filter and tagged job results without signing in. The base link does not select the filter automatically; result counts and availability are transient.

Sources read 2026-10-16:
- https://dwd.wisconsin.gov/veterans/hirevets/vetsready.htm
- https://www.dwd.wisconsin.gov/press/2025/251111-vets-ready-employers.htm
- https://jobcenterofwisconsin.com/Presentation/JobSeekers/JobSearch.aspx

DWD program/list and dated release: tier 1 direct. JCW: tier 1 403, resolved root tier 2; `jcw-vets-ready-browser.txt` contains public search/results. No account or personal data used. No live-result counts or vacancy guarantees copied.

IMPACT: SHIP — ACT | A2/A3 | S2 primary-source verifier | 2026-10-16 | revisit NONE
A1 population: All four: SEPARATING (active component), GUARD/RESERVE, SPOUSE/FAMILY and ALREADY SEPARATED may seek the described public referral; each underlying service or benefit has separate eligibility. band: Condition-triggered need or inquiry; no fixed separation band or day-offset. excluded: No employment benefit or program eligibility follows from browsing the list. No 2026 recipient list or named-company current vacancy is claimed. timing: ACT AVAILABLE NOW
A2 act: "Open Job Center of Wisconsin Job Search, choose Advanced Search, then set Vets Ready Employers to All Vets Ready Employers and search; check each posting before applying."
A3 surface(s): RESOURCES / existing Wisconsin employer section. token: NONE; direct public search link plus optional DWD award-list link. sweep trigger: FIRED — recognition vs ownership vs live jobs vs SkillBridge approval.
A4 cost: NOTHING
EXPIRES: NONE for directory referral; individual postings expire and must be checked. The award list remains explicitly 2025 history.

Runtime summary: Find current job listings from employers recognized by Wisconsin's Vets Ready initiative.
Runtime instructions: Advanced Search → Vets Ready Employers → All Vets Ready Employers
Runtime boundary: An award recognizes veteran support; it does not establish a current opening, job quality for every worker, hiring preference, or SkillBridge approval. Check current postings and the support that matters to you.
Award-list caption if included: Published recognition list reviewed October 16, 2026: 2025 recipients.

## WI3-20261016-RETRAINING — Ask about help paying for retraining

Rating: **CONFIRMED**. WDVA offers a needs-based Retraining Grant route for qualifying veterans facing unemployment/underemployment. Other funding is considered; OJT support is paid to the employer. The current fact sheet names WDVA 2019 and 2039 and WDVA review.

Sources read directly on 2026-10-16 (tier 1):
- https://dva.wi.gov/benefits/grants/employment-grants/
- https://dva.wi.gov/wp-content/uploads/2025/06/WDVA_2469-Retraining-Grant-Fact-Sheet.pdf

IMPACT: SHIP — ACT | A2/A3 | S2 primary-source verifier | 2026-10-16 | revisit NONE
A1 population: ALREADY SEPARATED and GUARD/RESERVE only where independently qualified under WDVA veteran and program criteria; SEPARATING (active component) may plan for a later qualifying circumstance. band: Condition-triggered need or inquiry; no fixed separation band or day-offset. excluded: This does not apply to spouses/family by relationship alone or establish a grant for a current SkillBridge placement. timing: ACT AVAILABLE NOW
A2 act: "Ask the WDVA Grants Unit through its Employment Grants page to review your retraining situation and the appropriate WDVA 2019 and, for OJT, WDVA 2039 forms before counting on grant support."
A3 surface(s): RESOURCES / State benefits and local help; existing claims-help locator for CLAIMS-HELP. Placement: conditional training/work-cost detail; avoid another first-screen card. token: NONE; direct links. sweep trigger: FIRED — awards vs ownership certification vs current jobs/SkillBridge; claims accreditation vs organization membership; member vs employer grants. Validation-gate owns execution.
A4 cost: MONEY
EXPIRES: NONE

Runtime summary: If a job loss or reduced work means you need retraining, ask WDVA whether its Retraining Grant fits your situation.
Runtime boundary: Veteran status, work history, financial need and training approval matter. Other funding is reviewed; this is not automatic extra income. OJT payments go to the employer.

## WI3-20261016-EMPLOYMENT-GRANT — Employer support for qualifying veteran hires

Rating: **CONFIRMED**. WDVA currently lists an ongoing Veterans Employment Grant for qualifying employers hiring qualifying veterans with a specified service-connected disability. Employer application and WDVA employee certification are separate forms.

Sources read directly on 2026-10-16 (tier 1):
- https://dva.wi.gov/benefits/grants/employment-grants/
- https://dva.wi.gov/wp-content/uploads/2024/05/WDVA_2643-Application-for-Veterans-Employment-Grant-Program.pdf
- https://dva.wi.gov/wp-content/uploads/2024/05/WDVA_2642-Certification-Request-For-Veterans-Employment-Grant.pdf

IMPACT: SHIP — ACT | A2/A3 | S2 primary-source verifier | 2026-10-16 | revisit NONE
A1 population: ALREADY SEPARATED; GUARD/RESERVE only if independently qualifying as the covered veteran; SEPARATING (active component) for future-hire planning only. band: Condition-triggered need or inquiry; no fixed separation band or day-offset. excluded: This does not apply to spouses/family by relationship alone or to every veteran hire; government-agency employers are excluded by the current application. timing: ACT AVAILABLE NOW
A2 act: "Use WDVA Employment Grants to ask the WDVA Grants Unit about the employer application WDVA 2643 and employee certification WDVA 2642 for the proposed hire."
A3 surface(s): RESOURCES / State benefits and local help; existing claims-help locator for CLAIMS-HELP. Placement: collapsed employer detail only. token: NONE; direct links. sweep trigger: FIRED — awards vs ownership certification vs current jobs/SkillBridge; claims accreditation vs organization membership; member vs employer grants. Validation-gate owns execution.
A4 cost: MONEY
EXPIRES: NONE

Runtime summary: WDVA has an employer grant for qualifying veteran hires with a service-connected disability. The employer receives the grant.
Runtime boundary: The worker, employer and employment conditions must be reviewed by WDVA. This is not member cash, SkillBridge wages, or approval to combine reimbursements for the same cost.

## WI3-20261016-VETERAN-OWNED — Find Wisconsin veteran-owned businesses

Rating: **CONFIRMED**. WDVA provides a certified veteran-owned-business directory with county and business-type filters. This is ownership certification, separate from DWD veteran-support recognition or current hiring.

Sources read directly on 2026-10-16 (tier 1):
- https://dva.wi.gov/benefits/employment/veteran-owned-business/
- https://apps.dva.wisconsin.gov/veteranownedbusiness

IMPACT: SHIP — ACT | A2/A3 | S2 primary-source verifier | 2026-10-16 | revisit NONE
A1 population: All four: SEPARATING (active component), GUARD/RESERVE, SPOUSE/FAMILY and ALREADY SEPARATED may seek the described public referral; each underlying service or benefit has separate eligibility. band: Condition-triggered need or inquiry; no fixed separation band or day-offset. excluded: The directory does not certify a job vacancy or determine eligibility for a contracting preference. timing: ACT AVAILABLE NOW
A2 act: "Use WDVA's certified veteran-owned-business directory to find a business by county or category and review its own website for the service or opportunity you need."
A3 surface(s): RESOURCES / State benefits and local help; existing claims-help locator for CLAIMS-HELP. Placement: optional business ownership/networking detail; not primary job results. token: NONE; direct links. sweep trigger: FIRED — awards vs ownership certification vs current jobs/SkillBridge; claims accreditation vs organization membership; member vs employer grants. Validation-gate owns execution.
A4 cost: NOTHING
EXPIRES: NONE

Runtime summary: Explore WDVA's directory of certified veteran-owned businesses by county or type of business.
Runtime boundary: Veteran ownership does not establish a job opening, Vets Ready recognition, nonprofit status, or SkillBridge approval.

## WI3-20261016-STATE-JOBS — Explore Wisconsin state careers

Rating: **CONFIRMED**. DWD and WDVA identify Wisc.Jobs as the state-government job portal. DPM separately describes a non-competitive appointment route for qualifying disabled veterans, subject to conditions and vacancies.

Sources read directly on 2026-10-16 (tier 1):
- https://dva.wi.gov/benefits/employment/state-of-wisconsin-employment/
- https://dpm.wi.gov/Pages/Job_Seekers/VeteranHiring.aspx

IMPACT: SHIP — ACT | A2/A3 | S2 primary-source verifier | 2026-10-16 | revisit NONE
A1 population: All four: SEPARATING (active component), GUARD/RESERVE, SPOUSE/FAMILY and ALREADY SEPARATED may seek the described public referral; each underlying service or benefit has separate eligibility. band: Condition-triggered need or inquiry; no fixed separation band or day-offset. excluded: The ordinary careers portal is open to job seekers; a family connection or military service alone does not establish eligibility for the specialized appointment route. timing: ACT AVAILABLE NOW
A2 act: "Use WDVA's State of Wisconsin Employment page to reach Wisc.Jobs and the veteran appointment instructions; ask the Division of Personnel Management about eligibility or the application process."
A3 surface(s): RESOURCES / State benefits and local help; existing claims-help locator for CLAIMS-HELP. Placement: optional job-search detail; no new first-screen destination. token: NONE; direct links. sweep trigger: FIRED — awards vs ownership certification vs current jobs/SkillBridge; claims accreditation vs organization membership; member vs employer grants. Validation-gate owns execution.
A4 cost: NOTHING
EXPIRES: NONE

Runtime summary: Explore Wisconsin state-government careers and check whether a veteran hiring route fits your situation.
Runtime boundary: Job requirements still apply. Veteran hiring routes have separate criteria and do not guarantee selection.

## WI3-20261016-FAMILY-HOUSING — Find housing support for your household

Rating: **CONFIRMED**. VA SSVF serves low-income veteran families experiencing or at imminent risk of homelessness and directs visitors to a provider list. This differs from a veteran-only residential bed or a universal grant.

Sources read directly 2026-10-16:
- https://department.va.gov/homeless/supportive-services-for-veteran-families/
- https://department.va.gov/homeless/supportive-services-for-veteran-families/program-library/

Root tier 2 verified the SSVF Providers destination as the official FY26 intake workbook: https://department.va.gov/homeless/wp-content/uploads/sites/72/2026/03/SSVF_Provider_Intake_List_FY26.xlsx . Receipt: `ssvf-provider-route-browser.txt`. Tier 1 cannot parse that workbook (400 Unsupported content-type). Directory route confirmed; workbook rows and provider capacity not certified.

IMPACT: SHIP — ACT | A2/A3 | S2 primary-source verifier | 2026-10-16 | revisit NONE
A1 population: ALREADY SEPARATED and SPOUSE/FAMILY in an eligible veteran household; GUARD/RESERVE only where independently meeting the program veteran criteria. band: Condition-triggered housing instability; no fixed separation offset. excluded: This does not establish eligibility from current military service or family relationship alone; it is not routine relocation assistance for every household. timing: ACT AVAILABLE NOW
A2 act: "Open VA's Supportive Services for Veteran Families page and use its SSVF Providers link to locate an organization serving your area, then ask that provider to review your household's situation."
A3 surface(s): RESOURCES / State benefits and local help. token: NONE. sweep trigger: FIRED — household support vs veteran-only housing and routine moving; program referral vs individual entitlement.
A4 cost: MONEY
EXPIRES: NONE; service availability and provider eligibility must be checked

Runtime summary: If your household is at risk of losing housing or is already without a home, VA Supportive Services for Veteran Families may be a route to housing support.
Runtime boundary: The provider reviews veteran-family eligibility, income, housing need, local service area and available help. This is not a guarantee of a payment or place to stay.

## WI3-20261016-WOMEN-VETERANS — Connect with Wisconsin women veterans support

Rating: **CONFIRMED**. WDVA maintains a Women Veterans Program with outreach, advocacy, connection resources and a named program contact.

Sources read directly 2026-10-16:
- https://dva.wi.gov/community-legacy/women-veterans/

IMPACT: SHIP — ACT | A2/A3 | S2 primary-source verifier | 2026-10-16 | revisit NONE
A1 population: Women in ALREADY SEPARATED; women in GUARD/RESERVE with qualifying veteran status; SEPARATING (active component) may ask about transition connections. band: Condition-triggered support or connection inquiry; no fixed separation offset. excluded: This does not establish a women-veterans service or benefit for spouses/family solely through relationship; general county/tribal help remains available. timing: ACT AVAILABLE NOW
A2 act: "Open WDVA's Women Veterans page and contact the Women Veterans Program using the published program contact to ask about resources and connections for your situation."
A3 surface(s): RESOURCES / State benefits and local help. token: NONE. sweep trigger: FIRED — household support vs veteran-only housing and routine moving; program referral vs individual entitlement.
A4 cost: NOTHING
EXPIRES: NONE; current services checked with program

Runtime summary: WDVA's Women Veterans Program offers a place to ask about support, advocacy and connections for women veterans in Wisconsin.
Runtime boundary: Ask the program which resources fit your needs. A referral does not establish eligibility for a benefit, event or clinical service.
