import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { careerPageLayout } from '../vendor/dd214-reader.mjs';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),ctx={};vm.createContext(ctx);vm.runInContext(html.slice(html.indexOf('function topsCareerSensitive('),html.indexOf('function topsCheckedCareerAnalysis('))+'this.extract=topsCareerExcerptCandidates;this.automatic=topsAutomaticCareerEvidence;this.evidence=topsCareerEvidence;',ctx);
const word=(text,x,y,w=340)=>({text,bbox:{x0:x,y0:y,x1:x+w,y1:y+20},confidence:95});
const lines=[word('11. PRIMARY SPECIALTY',20,20),word('7Z9X SYNTHETIC SYSTEMS MAINTENANCE',20,50),word('Maintained test equipment and completed training checks',20,80),word('13. AWARDS',20,140),word('14. MILITARY EDUCATION',520,140),word('SYNTHETIC TEAM RECOGNITION',20,170),word('SYNTHETIC SYSTEMS COURSE',520,170),word('Unit achievement entry',20,200),word('Eight-week classroom program',520,200),word('15. OTHER FIELD',20,260),word('16. OTHER FIELD',520,260),word('Do not include this unrelated entry',20,290)];
const layout=careerPageLayout(lines.map(w=>({words:[w]})),1000,1000),raw='RAW SYNTHETIC WORD ORDER UNCHANGED',page={number:1,text:raw,method:'ocr',layout};
let found=ctx.extract([page]);assert.equal(found.rows.length,3);assert.equal(found.rows[0].text,'7Z9X SYNTHETIC SYSTEMS MAINTENANCE Maintained test equipment and completed training checks');assert.equal(found.rows[1].text,'SYNTHETIC TEAM RECOGNITION Unit achievement entry');assert.equal(found.rows[2].text,'SYNTHETIC SYSTEMS COURSE Eight-week classroom program');assert.ok(found.rows.every(r=>!r.selected));assert.equal(page.text,raw);assert.ok(!found.rows[1].text.includes('COURSE'));assert.ok(!found.rows[2].text.includes('RECOGNITION'));assert.ok(!found.rows.some(r=>r.text.includes('unrelated')));console.log('LAYOUT PASS two columns; multiline same-column; heading suppression; raw retained; no preselection',JSON.stringify(found.rows.map(r=>({category:r.category,text:r.text}))));
const headings=careerPageLayout([word('PRIMARY SPECIALTY',20,20),word('MILITARY EDUCATION',20,100),word('(Course title, number of weeks)',20,130)].map(w=>({words:[w]})),1000,1000);assert.equal(ctx.extract([{...page,layout:headings}]).rows.length,0);assert.equal(ctx.extract([{...page,layout:headings}]).headings,2);
for(const bad of [careerPageLayout([{words:[word('PRIMARY SPECIALTY',20,20)],skewed:true}],1000,1000),careerPageLayout([{words:[word('PRIMARY SPECIALTY',-1,20)]}],1000,1000),careerPageLayout([{words:[word('PRIMARY SPECIALTY',20,20),word('OVERLAP',30,20)]}],1000,1000),careerPageLayout(Array.from({length:3001},()=>({words:[word('X',20,20)]})),1000,1000)]){assert.equal(bad.uncertain,true);assert.equal(ctx.extract([{...page,layout:bad}]).rows.length,0);}
assert.equal(ctx.extract([{...page,layout:undefined}]).rows.length,0);assert.ok(ctx.extract([{...page,layout:{...layout,uncertain:true}}]).rows.length > 0);console.log('LAYOUT PASS labels-only and unsafe-line fallback; uncertain page retains independently readable lines');

const simple=entries=>careerPageLayout(entries.map((text,i)=>({words:[word(text,20,20+i*30)]})),1000,1000);
const boundary=ctx.extract([{...page,layout:simple(['PRIMARY SPECIALTY','Example technical entry','12 RECORD OF SERVICE','Administrative placeholder'])}]);assert.equal(boundary.rows[0].text,'Example technical entry');
const narrative=ctx.extract([{...page,layout:simple(['PRIMARY SPECIALTY','Training supported daily operations'])}]);assert.equal(narrative.rows[0].text,'Training supported daily operations');
assert.equal(ctx.extract([{...page,layout:simple(['DECORATIONS AND AWARDS'])}]).rows.length,0);
assert.equal(ctx.extract([{...page,layout:simple(['SPECIALTYFOO'])}]).rows.length,0);
for(const [width,height] of [[NaN,1000],[1000,Infinity],[0,1000],[1000,-1]])assert.equal(careerPageLayout([],width,height).uncertain,true);
const maximum={number:1,method:'text',text:'raw',layout:simple(['PRIMARY SPECIALTY','a'.repeat(401)])};assert.equal(ctx.extract([maximum]).rows.length,0);assert.equal(ctx.extract([maximum]).omitted,1);
console.log('LAYOUT PASS punctuation-free formboundary; narrative preserved; fullheading-only; labelboundary; finite dimensions; long block manual-only');

const upperNarrative=ctx.extract([{...page,layout:simple(['11. PRIMARY SPECIALTY','TRAINING EQUIPMENT MAINTENANCE'])}]);assert.equal(upperNarrative.rows.length,1);assert.equal(upperNarrative.rows[0].category,'Specialty');assert.equal(upperNarrative.rows[0].text,'TRAINING EQUIPMENT MAINTENANCE');console.log('LAYOUT PASS uppercase narrative is not reclassified as a heading');

const courseDuration=ctx.extract([{...page,layout:simple(['14. MILITARY EDUCATION','12 WEEK SYNTHETIC SYSTEMS COURSE'])}]);assert.equal(courseDuration.rows[0].text,'12 WEEK SYNTHETIC SYSTEMS COURSE');console.log('LAYOUT PASS course duration is not mistaken for a field number');

const partial=careerPageLayout([{words:[word('Unreadable label',-5,20)]},{words:[word('SYNTHETIC equipment maintenance course',20,50)]},{words:[word('SYNTHETIC systems instruction',20,80)],skewed:true},{words:[word('SYNTHETIC maintenance',20,110,180),word('NAME EXAMPLE',520,110,200)]}],1000,1000);
const recovered=ctx.extract([{...page,layout:partial}]);assert.equal(recovered.rows.length,1);assert.equal(recovered.rows[0].text,'SYNTHETIC equipment maintenance course');assert.equal(recovered.rows[0].uncertain,true);assert.equal(recovered.rows[0].selected,false);assert.equal(recovered.rows[0].original,recovered.rows[0].text);
const rawOnly='PRIMARY SPECIALTY\nSYNTHETIC equipment maintenance course\nMILITARY EDUCATION\nNAME EXAMPLE equipment training\nSYNTHETIC logistics   NAME EXAMPLE\nCOURSE TITLE NUMBER OF WEEKS\n11';
const rawPage={number:2,method:'ocr',text:rawOnly};const rawFound=ctx.extract([rawPage]);assert.equal(rawFound.rows.length,1);assert.equal(rawFound.rows[0].text,'SYNTHETIC equipment maintenance course');assert.equal(rawFound.rows[0].page,2);assert.equal(rawPage.text,rawOnly);
assert.equal(ctx.extract([{...rawPage,text:'PRIMARY SPECIALTY\nMILITARY EDUCATION\n11'}]).rows.length,0);
console.log('LAYOUT PASS uncertain-page reliable line recovery; no skew/gutter/PII line; bounded raw-line fallback; no joining, rewriting or preselection');

const damagedAwards=careerPageLayout([{words:[word('13. AWARDS',20,100),word('OVERLAP',30,100)]},{words:[word('14. MILITARY EDUCATION',520,100)]},{words:[word('NAME PRIVATE',20,140),word('MIXED AWARD',30,140)]},{words:[word('SYNTHETIC SYSTEMS COURSE',520,140)]},{words:[word('Eight-week classroom program',520,170)]}],1000,1000);
const auto=ctx.automatic([{number:1,method:'ocr',text:'RAW PRIVATE',layout:damagedAwards}],'');assert.equal(auto.excerpts.length,1);assert.equal(auto.excerpts[0].text,'SYNTHETIC SYSTEMS COURSE Eight-week classroom program');assert.ok(!JSON.stringify(auto).includes('PRIVATE'));
assert.equal(ctx.automatic([{number:1,method:'ocr',text:rawOnly}]),null);
assert.equal(ctx.automatic([{number:1,method:'ocr',text:rawOnly,layout:{...damagedAwards,incomplete:true}}]),null);
const low=structuredClone(damagedAwards);low.lines.find(l=>l.words[0].text==='SYNTHETIC SYSTEMS COURSE').words[0].confidence=60;assert.equal(ctx.automatic([{...page,layout:low}]),null);
const overlap=structuredClone(damagedAwards);overlap.lines.find(l=>l.words[0].text==='SYNTHETIC SYSTEMS COURSE').uncertain=true;overlap.lines.find(l=>l.words[0].text==='SYNTHETIC SYSTEMS COURSE').splitSafe=false;assert.equal(ctx.automatic([{...page,layout:overlap}]),null);
assert.equal(ctx.automatic([{...page,layout:simple(['13. AWARDS','SYNTHETIC EQUIPMENT AWARD'])}]),null);
assert.equal(ctx.automatic([{...page,layout:simple(['14. MILITARY EDUCATION','NAME SYNTHETIC INSTRUCTOR COURSE'])}]),null);
console.log('AUTOMATIC PASS isolated training survives uncertain awards column; unknown/incomplete/low-confidence/overlapping/identity/awards excluded; no generic raw fallback auto-send');
const joinedRows=careerPageLayout([{words:[word('13. AWARDS',20,100,180),word('OVERLAP',30,100,180),word('14. MILITARY EDUCATION',520,100)]},{words:[word('NAME PRIVATE',20,140,180),word('MIXED AWARD',30,140,180),word('SYNTHETIC SYSTEMS COURSE',520,140)]},{words:[word('Eight-week classroom program',520,170)]}],1000,1000);
assert.equal(joinedRows.uncertain,true);assert.equal(ctx.automatic([{...page,layout:joinedRows}]).excerpts[0].text,'SYNTHETIC SYSTEMS COURSE Eight-week classroom program');
const skewedRows=careerPageLayout([{words:[word('14. MILITARY EDUCATION',520,100)],skewed:true},{words:[word('SYNTHETIC SYSTEMS COURSE',520,140)]}],1000,1000);assert.equal(ctx.automatic([{...page,layout:skewedRows}]),null);
console.log('AUTOMATIC PASS OCR same-line merged columns split only at geometric gutter; overlap excluded per run; skewed header never sent');
