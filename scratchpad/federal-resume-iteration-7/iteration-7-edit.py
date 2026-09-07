from pathlib import Path
import sys

root = Path('/tmp/tops-federal-resume-readiness')

def replace_one(path, old, new):
    data = path.read_text()
    print('OLD', repr(old), 'NEW', repr(new))
    print('before old expect 1 actual', data.count(old))
    assert data.count(old) == 1, 'ABORT: old-string assertion'
    assert data.count(new) == 0, 'ABORT: new-string already present'
    data = data.replace(old, new)
    path.write_text(data)
    print('after old expect 0 actual', data.count(old), 'new expect 1 actual', data.count(new))
    assert data.count(old) == 0 and data.count(new) == 1, 'ABORT: post-edit assertion'

if sys.argv[1] == 'tests':
    # EDIT 7A: exercise the existing handler with each blocker origin independently.
    anchor = '  // RDM-170B: posting alignment remains available when the member fact contains the exact supported terms.\n'
    tests = '''  // Readiness iteration 7: content-free failure origins remain distinct with identical release rules.
  const blockerOriginObservations = [];
  const postingBlockerMessage = "A job-posting requirement was presented as if it were your qualification.";
  for (const mode of ["standard", "federal"]) {
    for (const transform of ["exact", "civilian_translation"]) {
      for (const origin of ["audit", "reference", "both"]) {
        nextResponse = { status: "completed", output_text: "PROFESSIONAL EXPERIENCE\\nCore Role - Core Unit\\nUsed Workday to support service members." };
        let observedClaimCount = 0;
        auditResponseQueue.push((request) => {
          const audit = passingAudit(request);
          const inventory = clauseInventoryFromAuditRequest(request);
          observedClaimCount = inventory.length;
          const claim = inventory.find((item) => /Used Workday/.test(item.claim_text));
          const trace = audit.claim_trace.find((item) => item.claim_id === claim.claim_id);
          trace.transform = transform;
          trace.posting_refs = origin === "audit" ? [] : ["Workday"];
          audit.blockers = origin === "reference" ? [] : ["posting_only_claim"];
          audit.scorecard = auditDimensions.map((dimension) => ({ dimension, status: ["job_posting_alignment", "format_compliance"].includes(dimension) ? "NEEDS MEMBER FACT" : "PASS", evidence: "Synthetic content-free evidence." }));
          audit.supported_keywords = [];
          audit.unmet_gaps = [];
          return audit;
        });
        const beforeCalls = calls.length;
        const response = await resume.lambdaHandler(post({ action: "draft", mode, target: "Program Analyst", posting: "Workday required", experience: coreLedger, confirmedFacts: coreLedger }));
        const body = JSON.parse(response.body);
        assert.ok(observedClaimCount > 0, "actual audit path executed");
        assert.equal(response.statusCode, 422);
        assert.equal(body.reasonCategory, "quality_gate");
        assert.equal(body.bullets, undefined);
        assert.equal(body.trace, undefined);
        assert.equal(body.scorecard.length, 10);
        assert.equal(body.scorecard.filter((item) => item.status === "NEEDS MEMBER FACT").length, 2);
        assert.equal(calls.length - beforeCalls, 2, "generation plus audit; no diagnostic call or retry");
        assert.doesNotMatch(JSON.stringify(body), /Workday|Core Role|Core Unit|fact_refs|claim_id|posting_refs/);
        const expected = [];
        if (origin !== "reference") expected.push("[audit_posting_only_claim] " + postingBlockerMessage);
        if (origin !== "audit") expected.push("[posting_reference_mismatch] " + postingBlockerMessage);
        blockerOriginObservations.push({ mode, transform, origin, actual: body.blockers, expected });
      }
    }
    for (const malformed of [false, true]) {
      nextResponse = { status: "completed", output_text: coreRoleDraft };
      auditResponseQueue.push((request) => {
        const audit = passingAudit(request);
        if (malformed) audit.blockers = ["posting_only_claim: PRIVATE_SENTINEL"];
        return audit;
      });
      const beforeCalls = calls.length;
      const response = await resume.lambdaHandler(post({ action: "draft", mode, target: "Program Analyst", posting: "Workday required", experience: coreLedger, confirmedFacts: coreLedger }));
      assert.equal(response.statusCode, malformed ? 502 : 200);
      assert.equal(calls.length - beforeCalls, 2);
      assert.doesNotMatch(response.body, /PRIVATE_SENTINEL|audit_posting_only_claim|posting_reference_mismatch/);
      if (malformed) assert.equal(JSON.parse(response.body).bullets, undefined);
      else assert.match(JSON.parse(response.body).bullets, /Built a transition-planning application/);
    }
  }
  console.log("READINESS7_ORIGINS " + JSON.stringify(blockerOriginObservations));
  for (const observation of blockerOriginObservations) assert.deepEqual(observation.actual, observation.expected, "Readiness7 " + observation.mode + "/" + observation.transform + "/" + observation.origin);
  console.log("PASS readiness7: 12 independently identified withheld responses; 2 release and 2 malformed controls; all call counts unchanged");

'''
    # Include the existing anchor only once as context; use a separate old/new post-count for insertions.
    path = root / 'scripts/openai-migration-regression.js'
    data = path.read_text()
    print('test anchor old expect 1 actual', data.count(anchor))
    assert data.count(anchor) == 1 and data.count(tests) == 0, 'ABORT: test insertion assertion'
    data = data.replace(anchor, tests + anchor)
    path.write_text(data)
    print('test anchor after expect 1 actual', data.count(anchor), 'new block expect 1 actual', data.count(tests))
    assert data.count(anchor) == 1 and data.count(tests) == 1, 'ABORT: test post-edit assertion'
elif sys.argv[1] == 'runtime':
    # EDIT 7B: label only the source of existing posting blockers; do not alter either predicate.
    old = '    const blockers = audit.blockers.concat(semanticBlockers).map(function (code) { return AUDIT_BLOCKER_MESSAGES[code]; });'
    new = '''    const blockers = audit.blockers.map(function (code) { return (code === "posting_only_claim" ? "[audit_posting_only_claim] " : "") + AUDIT_BLOCKER_MESSAGES[code]; });
    semanticBlockers.forEach(function (code) { blockers.push("[posting_reference_mismatch] " + AUDIT_BLOCKER_MESSAGES[code]); });'''
    replace_one(root / 'netlify/functions/resume.mjs', old, new)
else:
    raise SystemExit('unknown edit')
