from pathlib import Path
import sys

root = Path('/tmp/tops-federal-resume-readiness')
if sys.argv[1] == 'tests':
    # EDIT 8A: actual-handler counterexamples for space/hyphen equivalence and negative controls.
    old = '  // RDM-170B: posting alignment remains available when the member fact contains the exact supported terms.\n'
    block = '''  // Readiness iteration 8: a hyphen must not turn an otherwise supported phrase into a posting-only claim.
  const hyphenReadinessResults = [];
  for (const mode of ["standard", "federal"]) {
    for (const transform of ["exact", "reordered", "format_only", "civilian_translation"]) {
      for (const factPhrase of ["work orders", "work-orders"]) {
        const draftPhrase = factPhrase === "work orders" ? "work-orders" : "work orders";
        const duty = "Tracked " + factPhrase + ".";
        const ledger = coreLedger.replace("Built a transition-planning application for service members.", duty);
        nextResponse = { status: "completed", output_text: "PROFESSIONAL EXPERIENCE\\nCore Role - Core Unit\\nTracked " + draftPhrase + "." };
        let observed = null;
        auditResponseQueue.push((request) => {
          const audit = passingAudit(request);
          const claim = clauseInventoryFromAuditRequest(request).find((item) => /Tracked/.test(item.claim_text));
          const fact = factCatalogFromAuditRequest(request).find((item) => item.owner === claim.owner && item.text.includes(duty));
          const trace = audit.claim_trace.find((item) => item.claim_id === claim.claim_id);
          trace.fact_refs = [fact.fact_id];
          trace.posting_refs = [draftPhrase];
          trace.transform = transform;
          observed = { claim: claim.claim_text, fact: fact.text };
          return audit;
        });
        const beforeCalls = calls.length;
        const response = await resume.lambdaHandler(post({ action: "draft", mode, target: "Program Analyst", posting: "Track " + draftPhrase + ".", experience: ledger, confirmedFacts: ledger }));
        assert.ok(observed && observed.fact.includes(duty));
        assert.equal(calls.length - beforeCalls, 2);
        hyphenReadinessResults.push({ mode, transform, factPhrase, draftPhrase, status: response.statusCode });
        if (response.statusCode === 200) {
          const body = JSON.parse(response.body);
          assert.ok(body.bullets.includes("Tracked " + draftPhrase + "."), "no candidate rewriting");
          assert.ok(body.trace.some((trace) => trace.claim_text === "Tracked " + draftPhrase + "."));
        }
      }
      // A named tool remains unsupported, regardless of harmless punctuation in another phrase.
      const ledger = coreLedger.replace("Built a transition-planning application for service members.", "Tracked work orders.");
      nextResponse = { status: "completed", output_text: "PROFESSIONAL EXPERIENCE\\nCore Role - Core Unit\\nTracked work-orders using Workday." };
      auditResponseQueue.push((request) => {
        const audit = passingAudit(request);
        const claim = clauseInventoryFromAuditRequest(request).find((item) => /Workday/.test(item.claim_text));
        const fact = factCatalogFromAuditRequest(request).find((item) => item.owner === claim.owner && /Tracked work orders/.test(item.text));
        const trace = audit.claim_trace.find((item) => item.claim_id === claim.claim_id);
        trace.fact_refs = [fact.fact_id];
        trace.posting_refs = ["work-orders", "Workday"];
        trace.transform = transform;
        return audit;
      });
      const beforeCalls = calls.length;
      const response = await resume.lambdaHandler(post({ action: "draft", mode, target: "Program Analyst", posting: "Track work-orders using Workday.", experience: ledger, confirmedFacts: ledger }));
      assert.equal(response.statusCode, 422);
      assert.match(JSON.parse(response.body).blockers.join(" "), /posting_reference_mismatch/);
      assert.equal(JSON.parse(response.body).bullets, undefined);
      assert.equal(calls.length - beforeCalls, 2);
    }
    for (const transform of ["exact", "reordered", "format_only"]) {
      nextResponse = { status: "completed", output_text: "PROFESSIONAL EXPERIENCE\\nCore Role - Core Unit\\nTracked payroll and work-orders." };
      const ledger = coreLedger.replace("Built a transition-planning application for service members.", "Tracked work orders.");
      auditResponseQueue.push((request) => {
        const audit = passingAudit(request);
        const claim = clauseInventoryFromAuditRequest(request).find((item) => /payroll/.test(item.claim_text));
        const fact = factCatalogFromAuditRequest(request).find((item) => item.owner === claim.owner && /Tracked work orders/.test(item.text));
        const trace = audit.claim_trace.find((item) => item.claim_id === claim.claim_id);
        trace.fact_refs = [fact.fact_id];
        trace.posting_refs = ["payroll", "work-orders"];
        trace.transform = transform;
        return audit;
      });
      const beforeCalls = calls.length;
      const response = await resume.lambdaHandler(post({ action: "draft", mode, target: "Program Analyst", posting: "Track payroll and work-orders.", experience: ledger, confirmedFacts: ledger }));
      assert.equal(response.statusCode, 422);
      assert.match(JSON.parse(response.body).blockers.join(" "), /posting_reference_mismatch/);
      assert.equal(calls.length - beforeCalls, 2);
    }
  }
  console.log("READINESS8_HYPHENS " + JSON.stringify(hyphenReadinessResults));
  for (const observation of hyphenReadinessResults) assert.equal(observation.status, 200, "Readiness8 " + JSON.stringify(observation));
  console.log("PASS readiness8: 16 supported space/hyphen cases released unchanged; 8 posting-only tool and 6 unsupported-duty cases withheld; no added calls");

'''
    path = root / 'scripts/openai-migration-regression.js'
    data = path.read_text()
    print('EDIT 8A old anchor expect 1 actual', data.count(old))
    assert data.count(old) == 1 and data.count(block) == 0, 'ABORT: insertion assertion'
    data = data.replace(old, block + old)
    path.write_text(data)
    print('EDIT 8A new block expect 1 actual', data.count(block), 'retained anchor expect 1 actual', data.count(old))
    assert data.count(block) == 1 and data.count(old) == 1, 'ABORT: insertion post-assertion'
elif sys.argv[1] == 'runtime':
    # EDIT 8B: compare words across a hyphen boundary just as across a space; do not rewrite claims or identities.
    old = '.toLowerCase().match(/[a-z][a-z-]{2,}/g)'
    new = '.toLowerCase().match(/[a-z]{3,}/g)'
    path = root / 'netlify/functions/resume.mjs'
    data = path.read_text()
    print('EDIT 8B old', old, 'new', new, 'old expect 1 actual', data.count(old))
    assert data.count(old) == 1 and data.count(new) == 0, 'ABORT: runtime assertion'
    data = data.replace(old, new)
    path.write_text(data)
    print('EDIT 8B old expect 0 actual', data.count(old), 'new expect 1 actual', data.count(new))
    assert data.count(old) == 0 and data.count(new) == 1, 'ABORT: runtime post-assertion'
else:
    raise SystemExit('unknown edit')
