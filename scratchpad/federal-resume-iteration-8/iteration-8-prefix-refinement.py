from pathlib import Path
import sys

root = Path('/tmp/tops-federal-resume-readiness')
if sys.argv[1] == 'tests':
    # EDIT 8C: protect short prefixes whose removal changes the meaning of a claim.
    path = root / 'scripts/openai-migration-regression.js'
    old = '  console.log("READINESS8_HYPHENS " + JSON.stringify(hyphenReadinessResults));\n'
    block = '''  const shortPrefixResults = [];
  for (const mode of ["standard", "federal"]) {
    for (const transform of ["exact", "reordered", "format_only"]) {
      for (const [claimed, confirmed] of [["un-paid work", "paid work"], ["de-icing", "icing"]]) {
        const duty = "Performed " + confirmed + ".";
        const ledger = coreLedger.replace("Built a transition-planning application for service members.", duty);
        nextResponse = { status: "completed", output_text: "PROFESSIONAL EXPERIENCE\\nCore Role - Core Unit\\nPerformed " + claimed + "." };
        auditResponseQueue.push((request) => {
          const audit = passingAudit(request);
          const claim = clauseInventoryFromAuditRequest(request).find((item) => /Performed/.test(item.claim_text));
          const fact = factCatalogFromAuditRequest(request).find((item) => item.owner === claim.owner && item.text.includes(duty));
          const trace = audit.claim_trace.find((item) => item.claim_id === claim.claim_id);
          trace.fact_refs = [fact.fact_id];
          trace.posting_refs = [claimed];
          trace.transform = transform;
          return audit;
        });
        const beforeCalls = calls.length;
        const response = await resume.lambdaHandler(post({ action: "draft", mode, target: "Program Analyst", posting: "Perform " + claimed + ".", experience: ledger, confirmedFacts: ledger }));
        assert.equal(calls.length - beforeCalls, 2);
        shortPrefixResults.push({ mode, transform, claimed, confirmed, status: response.statusCode });
      }
    }
  }
  console.log("READINESS8_SHORT_PREFIXES " + JSON.stringify(shortPrefixResults));
  for (const observation of shortPrefixResults) assert.equal(observation.status, 422, "Readiness8 short prefix " + JSON.stringify(observation));
  console.log("PASS readiness8: 12 short-prefix meaning changes remain withheld");
'''
    data = path.read_text()
    print('EDIT 8C anchor before', data.count(old), 'expected 1')
    assert data.count(old) == 1 and data.count(block) == 0, 'ABORT: test assertion'
    data = data.replace(old, block + old)
    path.write_text(data)
    assert data.count(old) == 1 and data.count(block) == 1, 'ABORT: post-edit assertion'
    print('EDIT 8C new 1; retained anchor 1')
elif sys.argv[1] == 'runtime':
    # EDIT 8D: preserve the original treatment of compounds with short components.
    path = root / 'netlify/functions/resume.mjs'
    old = 'return (String(text || "").toLowerCase().match(/[a-z]{3,}/g) || []).map(function (term)'
    new = '''return (String(text || "").toLowerCase().match(/[a-z][a-z-]{2,}/g) || []).flatMap(function (term) {
      const parts = term.split("-");
      return parts.length > 1 && parts.every(function (part) { return part.length >= 3; }) ? parts : [term];
    }).map(function (term)'''
    data = path.read_text()
    print('EDIT 8D old', repr(old), 'new', repr(new), 'before', data.count(old), 'expected 1')
    assert data.count(old) == 1 and data.count(new) == 0, 'ABORT: runtime assertion'
    data = data.replace(old, new)
    path.write_text(data)
    assert data.count(old) == 0 and data.count(new) == 1, 'ABORT: runtime post-edit assertion'
    print('EDIT 8D old 0; new 1')
else:
    raise SystemExit('unknown edit')
