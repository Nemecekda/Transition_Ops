# PATCH: FEDVIP Enrollment Window + Gray Area Future Retiree — Reminder Ladder
**Date staged:** 4 SEP 2026
**Branch:** ops/fedvip-gar-ladder
**Files:** index.html, sw.js
**Cache bump:** transition-ops-v130 → transition-ops-v131
**Verification log entry:** V-2026-018 (create in intel/ on merge)

---

## SOURCE VERIFICATION (completed 4 SEP 2026)

| Claim | Source | Status |
|---|---|---|
| FEDVIP window: 31 days before military retirement date through 60 days after; not automatic | benefeds.gov/assets/ABO/frequently-asked-questions.html (OPM-sponsored, primary) | VERIFIED |
| Must enroll before retirement date to prevent dental coverage gap | benefeds.gov FAQ (primary) | VERIFIED |
| Vision coverage requires TRICARE health plan enrollment | benefeds.gov FEDVIP Fact Sheet (primary) | VERIFIED |
| Gray area reservists under 60 eligible | benefeds.gov + myairforcebenefits.us.af.mil (.mil) | VERIFIED |
| FEDVIP replaced TRDP | myairforcebenefits.us.af.mil (.mil) | VERIFIED |
| Miss window → wait for Federal Benefits Open Season | benefeds.gov FAQ (primary) | VERIFIED |
| Future Retiree myPay account exists; dfas.mil/grayarea guide | dfas.mil (primary, guide updated Mar 2026) | VERIFIED |
| SmartDoc email at age 59 requires account + current email | Army Echoes Aug–Oct 2026 (DFAS Cleveland byline, official) | VERIFIED |
| Contact info must be current in DFAS, DEERS, and branch separately; no propagation | MOAA citing DFAS (Apr 2026) + DFAS login tips | VERIFIED |
| Retired pay application to service (Army: HRC GAR Branch, NOT DFAS); apply 9 mo–90 days before eligibility age | soldierforlife.army.mil Army Service Center + Army Echoes Aug–Oct 2026 (official) | VERIFIED |
| Retirement is a TRICARE QLE opening a 90-day enrollment period; retiree enrollment not automatic | Army Echoes Aug–Oct 2026 (TRICARE Communications byline) + tricare.mil/LifeEvents/QLE | VERIFIED |

No stays, injunctions, or pending rule changes affecting the above found in search 4 SEP 2026.

---

## OP 1 — index.html: insert FEDVIP T-31 rung + Gray Area rung after r-1-final

**Pre-write assertion:** `grep -c "10x harder without base access" index.html` → expect **1**. Any other count: ABORT.

**old_str:**
```
why:"Loose ends after separation become 10x harder without base access.",link:null},
```

**new_str:**
```
why:"Loose ends after separation become 10x harder without base access.",link:null},
  {id:"r-1-fedvip",mo:1,cat:"BENEFITS",pri:"CRITICAL",title:"\u26A0\uFE0F FEDVIP Dental/Vision Window OPEN (Retirees)",brief:"Your FEDVIP enrollment window opens 31 days before your retirement date. Enrollment is not automatic.",items:["Enroll BEFORE your retirement date to avoid a dental coverage gap","Window: 31 days before retirement date through 60 days after","Vision coverage requires enrollment in a TRICARE health plan","Gray area reservists under age 60 are also eligible","Miss the window and you wait for the next Federal Benefits Open Season","Enroll at BENEFEDS.gov or 1-877-888-3337"],deadline:"60 days after retirement date \u2014 HARD DEADLINE",why:"Active duty dental ends at retirement. FEDVIP replaced the TRICARE Retiree Dental Program \u2014 no dental coverage is waiting on the other side unless you enroll.",link:"https://www.benefeds.gov/"},
  {id:"r-1-gar",mo:1,cat:"GUARD/RESERVE",pri:"HIGH",title:"Entering the Gray Area \u2014 Establish Your DFAS Future Retiree Account",brief:"Guard/Reserve with 20 good years: your link to retired pay runs through a myPay account most members never set up.",items:["Establish your Future Retiree myPay account at mypay.dfas.mil \u2014 easier now while your login is active","Keep contact info current in THREE systems: DFAS, DEERS, and your branch \u2014 updates do not transfer between them","DFAS sends a retired pay prompt at age 59 ONLY if your account has a current email on file","Retired pay is NOT automatic \u2014 apply through your service (Army: HRC Gray Area Retirements Branch, not DFAS) 9 months to 90 days before eligibility age","Gray area retains commissary, exchange, MWR access, and select TRICARE plans"],deadline:"Set up before losing routine myPay access",why:"Members who fall off the radar in the gray area face serious delays when retired pay eligibility arrives.",link:"https://www.dfas.mil/RetiredMilitary/plan/Gray-Area-Retirees/"},
```

## OP 2 — index.html: insert FEDVIP backstop rung after r-p1

**Pre-write assertion:** `grep -c "bridge income depending on your state" index.html` → expect **1**. Any other count: ABORT.

**old_str:**
```
why:"Unemployment (UCX) can mean roughly $1,300-$2,200/month of bridge income depending on your state. Don't leave it on the table.",link:null},
```

**new_str:**
```
why:"Unemployment (UCX) can mean roughly $1,300-$2,200/month of bridge income depending on your state. Don't leave it on the table.",link:null},
  {id:"r-p1-fedvip",mo:-1,cat:"BENEFITS",pri:"HIGH",title:"FEDVIP Backstop \u2014 30 Days Left on the Window (Retirees)",brief:"If you retired without enrolling in FEDVIP dental/vision, the 60-day window is half gone.",items:["Enroll now at BENEFEDS.gov \u2014 after day 60 the next opportunity is Federal Benefits Open Season (Nov\u2013Dec)","Retiree TRICARE enrollment is also NOT automatic \u2014 retirement is a Qualifying Life Event with a 90-day enrollment period at tricare.mil"],deadline:"Day 60 after retirement date (FEDVIP); day 90 (TRICARE QLE)",why:"Two separate non-automatic enrollments \u2014 FEDVIP and retiree TRICARE \u2014 expire in your first 90 days out. Both are routinely missed.",link:"https://www.benefeds.gov/"},
```

## OP 3 — sw.js: cache bump

**Pre-write assertion:** `grep -c "transition-ops-v130" sw.js` → expect **1**. Any other count: ABORT.

**old_str:** `const CACHE_NAME = 'transition-ops-v130';`
**new_str:** `const CACHE_NAME = 'transition-ops-v131';`

---

## POST-MERGE VERIFICATION (Dean, after push — curl instrument of record)

```
curl -s https://raw.githubusercontent.com/Nemecekda/Transition_Ops/main/index.html | grep -c "r-1-fedvip"     # expect 1
curl -s https://raw.githubusercontent.com/Nemecekda/Transition_Ops/main/index.html | grep -c "r-1-gar"        # expect 1
curl -s https://raw.githubusercontent.com/Nemecekda/Transition_Ops/main/index.html | grep -c "r-p1-fedvip"    # expect 1
curl -s https://raw.githubusercontent.com/Nemecekda/Transition_Ops/main/sw.js | grep -c "transition-ops-v131" # expect 1
curl -s https://raw.githubusercontent.com/Nemecekda/Transition_Ops/main/sw.js | grep -c "transition-ops-v130" # expect 0
```

## COMMIT MESSAGE (true when written)
```
Add FEDVIP window (T-31/+60) and Gray Area Future Retiree rungs to reminder ladder; bump cache v131
```

## NOTES
- Rung display only. In-app ETS-triggered local alert channel remains INERT — these rungs render on the timeline but will not fire local notifications until that channel is fixed (same gate as ops/vgli-tail-reminders).
- Retirement-date anchor: rungs are anchored to the member's separation date, which equals the retirement date for retirees. No separate anchor built. Design ruling still open if divergence is needed later.
- Items 3–4 from the 4 SEP assessment (standalone TRICARE QLE rung, +11-month financial counseling tail) NOT included — TRICARE QLE folded into r-p1-fedvip; counseling tail held for ruling.
- Army Echoes added as quarterly secondary-source scan candidate for J2 (Block C) — separate ruling required.
