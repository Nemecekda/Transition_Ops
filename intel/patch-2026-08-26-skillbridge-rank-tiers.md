# PATCH: SkillBridge Rank-Tier Accuracy Correction
**Branch:** `ops/skillbridge-tiers`
**Status:** STAGED — pending Dean SHIP/DECLINE
**Classification of defect:** ACCURACY-CRITICAL — app currently asserts blanket 180-day duration and O-4+ approval authority. All verified service instructions have superseded both claims.

---

## 1. VERIFICATION MATRIX (all extracted from primary source documents this session — not memory, not cached)

| Service | Source / Date | Categories | Duration | Approval Authority |
|---|---|---|---|---|
| **Army** | AR 600-81, 25 MAR 2026 (eff. 25 APR 2026; supersedes 12 MAR 2024 ed.), Table 5-1 | Cat I: E1–E5 · Cat II: E6–E7, WO1–CW3, O1–O3 · Cat III: E8–E9, CW4–CW5, **O-4 and above** | 120 / 90 / 60 days | Cat I: first field-grade CDR w/ UCMJ · Cat II: first O-6 CDR w/ UCMJ · Cat III: **first GO with GCMCA** — no delegation authorized at any tier |
| **Air Force** | AFI 36-2671, 31 MAR 2026, Table 1 | Cat 1: E1–E5, O1–O3 · Cat 2: E6–E7, O-4, WO1–CWO3 · Cat 3: E8–E9, O-5, CWO4–5 | 120 / 90 / 60 days | Cat 1: 1st field-grade CC (G-series) · Cats 2–3: 1st O-6 CC (G-series). **O-6 not eligible** (ETP required) |
| **Space Force** | SPFI 36-2672, 31 MAR 2026, Table 1 | Cat 1: E1–E5 · Cat 2: E6–E8 · Cat 3: O1–O4 · Cat 4: E-9, O-5+ | 120 / 120 / 120 / 90 days | Cats 1: 1st field-grade CC w/ UCMJ · Cats 2–3: 1st O-6 CC w/ UCMJ · Cat 4: GO in chain of command |
| **Marine Corps** | MARADMIN 280/24, 17 JUN 2024 (eff. 31 AUG 2024) | Cat I: E1–E5 · Cat II: E6–E7, WO–CWO3, O1–O4 · Cat III: E8–E9, CWO4–5, O5+ | 120 / 90 / 90 days | Cats I–II: O-5 (LtCol)+ · Cat III: **General Officer**, no gapped billet. Joint billets: supplemental O-6 endorsement. NCMIS application opens 365 days from EAS |
| **Coast Guard** | CI 1040.7 | No tier system | **Up to 180 days retained** | Command discretion; balance vs. unit needs |
| **Navy** | **NO SOURCE DOCUMENT IN PROJECT KNOWLEDGE** | — | — | **GAP STANDS. Patch does not assert Navy tiers. App text directs Navy members to their command career counselor / installation SkillBridge office.** |

**Cross-service divergence flag (member-critical):** An O-4 is Category II/2 in the AF, USMC, and USSF, but **Category III in the Army** (60 days, GO/GCMCA). Flattening this into one table without service labels would state a partial view as fact (§0.10 violation). All app text must be service-labeled or explicitly ranged.

---

## 2. PATCH A — CRITICAL_WINDOWS `skillbridge` module (index.html ~line 2900–2915)

### A.1 Replace `shortDesc` (line ~2903)

**OLD:**
```
shortDesc:"Civilian employer training up to T-180. Retain pay, BAH, healthcare. First field-grade commander (O-4+) approval required.",
```

**NEW:**
```
shortDesc:"Civilian employer training in your final months of service. Retain pay, BAH, healthcare. Duration and approval are now RANK-TIERED and SERVICE-SPECIFIC \u2014 most members rate 60\u2013120 days, not 180. Senior grades may require General Officer approval.",
```

### A.2 Replace `whyMatters` (line ~2904)

**OLD:**
```
whyMatters:"Frequently the only practical opportunity to gain civilian work experience before DD214. Command approval is often the rate-limiting step \u2014 start conversations 6+ months out.",
```

**NEW:**
```
whyMatters:"Frequently the only practical opportunity to gain civilian work experience before DD214. Approval chains have been ELEVATED: junior enlisted route through the first field-grade commander, but E-8/E-9 and senior officers may require an O-6 or General Officer (Army Category III: first GO with GCMCA \u2014 no delegation). Command approval is the rate-limiting step \u2014 start conversations 6+ months out, earlier if you are senior grade with a shorter window.",
```

### A.3 Replace `actionSteps` (line ~2906)

**OLD:**
```
actionSteps:["Begin identifying potential SkillBridge partners at T-365","Obtain command endorsement \u2014 start the conversation 6+ months out","Submit package through service-specific process","Coordinate timing so clearing is complete before separation"],
```

**NEW:**
```
actionSteps:["Confirm YOUR category and maximum days under YOUR service instruction \u2014 Army AR 600-81 / AFI 36-2671 / SPFI 36-2672 / MARADMIN 280-24 (Coast Guard retains up to 180 days at command discretion; Navy members: confirm current rules with your command career counselor or installation SkillBridge office)","Begin identifying potential SkillBridge partners at T-365 \u2014 Marines can initiate the NCMIS application up to 365 days from EAS","Obtain command endorsement \u2014 start the conversation 6+ months out; senior grades requiring GO-level approval should start earlier","Submit package through service-specific process","Coordinate timing so PTDY/PTAD plus terminal leave fits inside your category ceiling and clearing is complete before separation"],
```

### A.4 Replace `sources` (line ~2913)

**OLD:**
```
sources:[{label:"DoD SkillBridge",url:"https://skillbridge.osd.mil"}],
```

**NEW:**
```
sources:[{label:"DoD SkillBridge",url:"https://skillbridge.osd.mil"},{label:"AR 600-81 (25 MAR 2026)",url:"https://armypubs.army.mil/ProductMaps/PubForm/Details.aspx?PUB_ID=1027537"},{label:"AFI 36-2671 (31 MAR 2026)",url:"https://www.e-publishing.af.mil"}],
```
> **URL verification flag:** Army Pubs URL above is UNVERIFIED from this container (armypubs not in allowed domains). Dean to verify both URLs resolve before merge, or strip to label-only.

### A.5 `hardStartDay` — DESIGN RULING REQUIRED

`hardStartDay:-180` remains numerically true only as the outer bound (USCG retains 180; Army IDES special consideration references 180). For most members the real ceiling is now -60 to -120. **Options:**
- **SHIP-A (recommended, text-only):** keep `-180`, rely on corrected text above. Zero structural risk.
- **SHIP-B (follow-on):** add a `serviceRules` array to the module and render a per-service tier table. Requires UI work + testing. Stage as separate branch after text fix ships.

---

## 3. PATCH B — SMART_REMINDERS `r-18-sb` (index.html ~line 2849)

**OLD (brief field):**
```
brief:"SkillBridge = civilian internship during last 180 days while collecting military pay. Slots fill fast \u2014 and the approval rules just shifted in your favor."
```

**NEW:**
```
brief:"SkillBridge = civilian internship during your final months while collecting military pay. Duration is now RANK-TIERED by service \u2014 most members rate 60\u2013120 days, not 180. Slots fill fast, and approval chains run higher than they used to."
```

**ADD to `items` array (insert as second item):**
```
"KNOW YOUR CEILING: E1\u2013E5 generally rate up to 120 days; mid-grades 90; senior NCOs and senior officers as few as 60 \u2014 with O-6 or General Officer approval required. Exact tiers vary by service. Coast Guard retains up to 180. Navy: confirm with your command career counselor."
```

---

## 4. PATCH C — NEW REMINDER LADDER ENTRIES (T-365 and T-150, per gap analysis)

### C.1 New entry `r-24-sb365` — insert into SMART_REMINDERS ordered position (mo:12 block or dedicated; recommend mo:12 so it fires at ~T-365)

```
{id:"r-12-sb365",mo:12,cat:"CAREER",pri:"HIGH",title:"SkillBridge Application Window OPENS \u2014 T-365",brief:"You can now formally start your SkillBridge packet. Marines: NCMIS accepts applications 365 days from EAS. All services: the clock on command endorsement starts NOW.",items:["Confirm your rank category and maximum program days under your service instruction","Marines: initiate application in NCMIS","Senior grades (E-8/E-9, O-4/O-5+): your approval may require an O-6 or General Officer \u2014 brief your chain NOW","Lock target employer list to 3\u20135 and open conversations","Map PTDY/PTAD + terminal leave inside your category ceiling"],deadline:"Packets routed through elevated approval chains can take months \u2014 T-365 start protects your window",why:"Shorter windows (60\u201390 days for many grades) mean there is no slack for a late packet. A GO-level approval that starts at T-180 can consume your entire program window.",link:"https://skillbridge.osd.mil"},
```

### C.2 New entry `r-5-sb150` — T-150 execution check (mo:5)

```
{id:"r-5-sb150",mo:5,cat:"CAREER",pri:"HIGH",title:"SkillBridge Execution Check \u2014 T-150",brief:"If your packet is not APPROVED yet, you are in the danger zone. Most rank categories cap at 60\u2013120 days \u2014 your start date math is now unforgiving.",items:["Packet approved? If not: get status from your SkillBridge coordinator TODAY","Count backward: program days + terminal leave must fit before separation date","Category ceiling check: senior grades at 60\u201390 days must start soon or lose the opportunity","No packet at all? A shorter program (30\u201360 days) with a defense-industrial-base employer may still be approvable \u2014 the JUN 2026 presumption works in your favor","Fallback: pivot to employer-direct hiring pipelines in the app feed"],deadline:"Unapproved at T-120 with a 90-day category = window functionally closed",why:"The blanket 180-day planning assumption is dead. Members who plan against the old rules discover at T-90 that their real window expired.",link:"https://skillbridge.osd.mil"},
```

---

## 5. PATCH D — CITATION UPDATES

- Any reference to AR 600-81 dated 2024 or undated → **AR 600-81, 25 MAR 2026 (effective 25 APR 2026)**
- Add where SkillBridge authorities cited: **AFI 36-2671, 31 MAR 2026** · **SPFI 36-2672, 31 MAR 2026** · **MARADMIN 280/24 (eff. 31 AUG 2024)**
- `authority` field in module (line ~2901) currently reads `10 U.S.C. \u00a7 1143 \u00b7 DoDI 1322.29` — remains true; optionally append `\u00b7 Service instructions (see sources)`

---

## 6. TERMINAL EXECUTION (Dean — Claude Code session)

```bash
cd ~/Documents/Documents*/GitHub/Transition_Ops
git checkout -b ops/skillbridge-tiers
# apply edits per Patches A–D
# VERIFICATION (state success condition before reading results):
# SUCCESS = zero hits on stale language:
grep -n "up to T-180" index.html          # expect 0 hits post-patch
grep -n "(O-4+) approval" index.html      # expect 0 hits post-patch
grep -n "last 180 days" index.html        # expect 0 hits in SkillBridge context
# SUCCESS = new entries present:
grep -n "r-12-sb365\|r-5-sb150" index.html   # expect 2+ hits
# Structural check (balance is not validity):
node --check <(sed -n '/<script>/,/<\/script>/p' index.html | sed '1d;$d') 2>&1 || echo "REVIEW REQUIRED"
# Bump sw.js cache version (required every index deploy)
git add -A && git commit -m "SkillBridge accuracy: rank-tiered durations and elevated approval chains per AR 600-81 (25 MAR 26), AFI 36-2671, SPFI 36-2672, MARADMIN 280/24; T-365 and T-150 ladder entries; Navy gap held open"
```

**Dean merges and pushes. Agents never push to origin.**

---

## 7. OPEN ITEMS CARRIED

1. **SHIP-A vs SHIP-B ruling** (§2/A.5) — text-only now vs. per-service tier table follow-on
2. **Navy source document** — gap remains open; acquire NAVADMIN/OPNAVINST before asserting Navy tiers
3. **Army Pubs URL verification** (§2/A.4) — unverifiable from container
4. **USCG CI 1040.7 currency check** — project copy retains 180 days; recommend J2 sweep flag to detect if USCG follows the other services into tiering
