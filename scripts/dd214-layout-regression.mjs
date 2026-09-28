import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { careerPageLayout } from '../vendor/dd214-reader.mjs';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),ctx={};vm.createContext(ctx);vm.runInContext(html.slice(html.indexOf('function topsCareerSensitive('),html.indexOf('function topsCareerEvidence('))+'this.extract=topsCareerExcerptCandidates;',ctx);
const word=(text,x,y,w=340)=>({text,bbox:{x0:x,y0:y,x1:x+w,y1:y+20},confidence:95});
const lines=[word('11. PRIMARY SPECIALTY',20,20),word('7Z9X SYNTHETIC SYSTEMS MAINTENANCE',20,50),word('Maintained test equipment and completed training checks',20,80),word('13. AWARDS',20,140),word('14. MILITARY EDUCATION',520,140),word('SYNTHETIC TEAM RECOGNITION',20,170),word('SYNTHETIC SYSTEMS COURSE',520,170),word('Unit achievement entry',20,200),word('Eight-week classroom program',520,200),word('15. OTHER FIELD',20,260),word('16. OTHER FIELD',520,260),word('Do not include this unrelated entry',20,290)];
const layout=careerPageLayout(lines.map(w=>({words:[w]})),1000,1000),raw='RAW SYNTHETIC WORD ORDER UNCHANGED',page={number:1,text:raw,method:'ocr',layout};
let found=ctx.extract([page]);assert.equal(found.rows.length,3);assert.equal(found.rows[0].text,'7Z9X SYNTHETIC SYSTEMS MAINTENANCE Maintained test equipment and completed training checks');assert.equal(found.rows[1].text,'SYNTHETIC TEAM RECOGNITION Unit achievement entry');assert.equal(found.rows[2].text,'SYNTHETIC SYSTEMS COURSE Eight-week classroom program');assert.ok(found.rows.every(r=>!r.selected));assert.equal(page.text,raw);assert.ok(!found.rows[1].text.includes('COURSE'));assert.ok(!found.rows[2].text.includes('RECOGNITION'));assert.ok(!found.rows.some(r=>r.text.includes('unrelated')));console.log('LAYOUT PASS two columns; multiline same-column; heading suppression; raw retained; no preselection',JSON.stringify(found.rows.map(r=>({category:r.category,text:r.text}))));
const headings=careerPageLayout([word('PRIMARY SPECIALTY',20,20),word('MILITARY EDUCATION',20,100),word('(Course title, number of weeks)',20,130)].map(w=>({words:[w]})),1000,1000);assert.equal(ctx.extract([{...page,layout:headings}]).rows.length,0);assert.equal(ctx.extract([{...page,layout:headings}]).headings,2);
for(const bad of [careerPageLayout([{words:[word('PRIMARY SPECIALTY',20,20)],skewed:true}],1000,1000),careerPageLayout([{words:[word('PRIMARY SPECIALTY',-1,20)]}],1000,1000),careerPageLayout([{words:[word('PRIMARY SPECIALTY',20,20),word('OVERLAP',30,20)]}],1000,1000),careerPageLayout(Array.from({length:3001},()=>({words:[word('X',20,20)]})),1000,1000)]){assert.equal(bad.uncertain,true);assert.equal(ctx.extract([{...page,layout:bad}]).rows.length,0);}
assert.equal(ctx.extract([{...page,layout:undefined}]).rows.length,0);assert.equal(ctx.extract([{...page,layout:{...layout,uncertain:true}}]).rows.length,0);console.log('LAYOUT PASS labels-only fallback; absent/invalid/overlapping/skew/excess geometry manual-only');

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
