from pathlib import Path
p=Path('/tmp/tops-federal-resume-readiness/scripts/openai-migration-regression.js')
old='''          const audit = passingAudit(request);
          if (fixture.expected === 422) {'''
new='''          const audit = passingAudit(request);
          const summaryClaim = clauseInventoryFromAuditRequest(request).find(item => item.claim_text === "Equipment records review.");
          if (summaryClaim) {
            const summaryFact = factCatalogFromAuditRequest(request).find(item => item.owner === "global" && item.text.includes("Equipment records review"));
            assert.ok(summaryFact, "positive summary cites its confirmed global skill");
            audit.claim_trace.find(item => item.claim_id === summaryClaim.claim_id).fact_refs = [summaryFact.fact_id];
          }
          if (fixture.expected === 422) {'''
s=p.read_text()
print('EDIT 10E old expect 1 actual',s.count(old),flush=True)
assert s.count(old)==1 and s.count(new)==0
s=s.replace(old,new)
assert s.count(old)==0 and s.count(new)==1
p.write_text(s)
print('EDIT 10E post-count PASS')
