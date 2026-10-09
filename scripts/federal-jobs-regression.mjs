import assert from 'node:assert/strict';
import {makeFederalJobsHandler,officialURL,plain} from '../netlify/functions/_shared/federal-jobs.mjs';
const config={TOPS_USAJOBS_ENABLED:'true',USAJOBS_API_KEY:'SYNTHETIC-SECRET',USAJOBS_USER_AGENT:'synthetic@example.invalid'};
const descriptor={PositionTitle:'<b>Analyst</b>',PositionURI:'https://www.usajobs.gov/job/123456',OrganizationName:'Synthetic agency',PositionLocationDisplay:'Madison, WI',PositionRemuneration:[{MinimumRange:'25',MaximumRange:'30',RateIntervalCode:'Per Hour'}],ApplicationCloseDate:'2026-12-15T23:59:59-05:00',UserArea:{Details:{WhoMayApply:{Name:'United States citizens'},HiringPath:['public','vet']}},QualificationSummary:'<script>secret()</script>Review &amp; compare &#60;b&#62;records&#60;/b&#62;'};
const payload=d=>({SearchResult:{SearchResultItems:[{MatchedObjectId:'123456',MatchedObjectDescriptor:d}]}});
const req=(data={keyword:'Analyst',location:'Madison, WI'},origin='https://example.invalid')=>new Request('https://example.invalid/.netlify/functions/federal-jobs',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(data)});
let calls=0,last;const h=makeFederalJobsHandler({env:()=>config,now:()=>new Date('2026-10-09T12:00:00Z'),fetchImpl:async(url,opts)=>{calls++;last={url,opts};return Response.json(payload(descriptor));}});
let r=await h(new Request('https://example.invalid/.netlify/functions/federal-jobs?config=1'));assert.equal((await r.json()).available,true);assert.equal(calls,0);
r=await h(req());assert.equal(r.status,200);assert.match(r.headers.get('cache-control'),/private, no-store/);let body=await r.json();assert.equal(body.jobs[0].salary,'25 - 30 Per Hour');assert.equal(body.jobs[0].closingDate,descriptor.ApplicationCloseDate);assert.equal(body.jobs[0].title,'Analyst');assert(!body.jobs[0].qualifications.includes('<'));assert(!body.jobs[0].qualifications.includes('secret'));assert.match(body.jobs[0].whoMayApply,/United States citizens/);assert.match(body.jobs[0].whoMayApply,/public, vet/);assert(!JSON.stringify(body).includes('SYNTHETIC-SECRET'));assert.equal(calls,1);
const u=new URL(last.url);assert.equal(u.origin,'https://data.usajobs.gov');assert.equal(u.pathname,'/api/search');assert.equal(u.searchParams.get('WhoMayApply'),'Public');assert.equal(u.searchParams.get('ResultsPerPage'),'10');assert.equal(last.opts.redirect,'error');assert.equal(last.opts.headers['Authorization-Key'],config.USAJOBS_API_KEY);
for(const bad of [{keyword:'x',location:'   '},{keyword:'x',location:'',resume:'x'},{keyword:'x'.repeat(121),location:''},{keyword:'',location:''},{keyword:'x',location:'x'.repeat(81)},{keyword:'<x>',location:''},{keyword:'x'.repeat(3000),location:''}])assert.equal((await h(req(bad))).status,400);
assert.equal(calls,1);assert.equal((await h(req(undefined,'https://evil.invalid'))).status,403);
for(const url of ['https://www.usajobs.gov.evil.invalid/job/123','javascript:alert(1)','https://x@www.usajobs.gov/job/123','https://www.usajobs.gov/job/123?redirect=evil','http://www.usajobs.gov/job/123','https://www.usajobs.gov/else/123'])assert.equal(officialURL(url),null);
assert(officialURL('https://www.usajobs.gov/GetJob/ViewDetails/123'));assert.equal(plain('<img src=x>text'),'text');
const make=(fetchImpl,env=config)=>makeFederalJobsHandler({fetchImpl,env:()=>env,now:()=>new Date('2026-10-09T12:00:00Z'),timeoutMs:10});
let disabledCalls=0;const off=make(async()=>{disabledCalls++;throw Error();},{});assert.equal((await off(req())).status,503);assert.equal(disabledCalls,0);
for(const data of [{},payload(null),payload({...descriptor,PositionURI:'https://evil.invalid/job/1'}),{SearchResult:{SearchResultItems:Array(11).fill({MatchedObjectDescriptor:descriptor})}}])assert.equal((await make(async()=>Response.json(data))(req())).status,502);
assert.equal((await make(async()=>new Response('x'.repeat(1048577)))(req())).status,502);
assert.equal((await make(async()=>new Response('SECRET',{status:429}))(req())).status,429);
assert.equal((await make(async()=>new Response('SECRET',{status:500}))(req())).status,502);
assert.equal((await make(async()=>{throw Error('SYNTHETIC-SECRET');})(req())).status,502);
assert.equal((await make(()=>new Promise(()=>{}))(req())).status,504);
let timeoutSignal;assert.equal((await make(async(_u,o)=>{timeoutSignal=o.signal;return new Response(new ReadableStream({start(){}}));})(req())).status,504);assert(timeoutSignal.aborted);
body=await (await make(async()=>Response.json(payload({...descriptor,ApplicationCloseDate:'2026-10-08'})))(req())).json();assert.equal(body.jobs.length,0);assert(body.note);
body=await (await make(async()=>Response.json(payload({PositionTitle:'No fields',PositionURI:descriptor.PositionURI})))(req())).json();assert.equal(body.jobs[0].salary,'Salary not provided');assert.equal(body.jobs[0].closingDate,'Closing date not provided');

// Serialized closing dates are not midnight deadlines. Keep prior UTC date
// while it is still that calendar date in UTC-12; reject impossible dates.
const midnight=makeFederalJobsHandler({env:()=>config,now:()=>new Date('2026-10-09T00:30:00Z'),fetchImpl:async()=>Response.json(payload({...descriptor,ApplicationCloseDate:'2026-10-08'}))});
assert.equal((await (await midnight(req())).json()).jobs.length,1);
body=await (await make(async()=>Response.json(payload({...descriptor,ApplicationCloseDate:'2026-02-30'})))(req())).json();assert.equal(body.jobs[0].closingDate,'Closing date not provided');
console.log('FEDERAL JOBS PASS: fixed public endpoint, explicit config/no mount request, exact input/body bounds, no retries, bounded upstream/deadline, safe URLs/plain text, source salary/date/hiring paths, missing/expired/malformed distinctions, redacted errors/no-store. Synthetic upstream only; no credentials or live API used.');
