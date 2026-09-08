from pathlib import Path
import hashlib
import re
import sys

root = Path('/tmp/tops-federal-resume-readiness')

def edit(path, old, new, label):
    src = path.read_text()
    print(label, 'old expect 1 actual', src.count(old), flush=True)
    assert src.count(old) == 1 and src.count(new) == 0
    src = src.replace(old, new)
    assert src.count(new) == 1 and src.count(old) == new.count(old)
    path.write_text(src)
    print(label, 'post-count PASS', flush=True)

if sys.argv[1] == 'tests':
    # EDIT 10A: capture actual writer requests; verify byte-exact short releases and unchanged simulated audit withholding.
    old = '  // Federal readiness iteration 2: aligned prompts, honest gaps, and unchanged withholding.\n'
    new = r'''  // Readiness iteration 10: sparse federal facts must not create a prose quota.
  {
    const shortLedger = federalMetadataLedger.replace("SKILLS AND TOOLS (EXACT OR MISSING): Planning", "SKILLS AND TOOLS (EXACT OR MISSING): Equipment records review");
    const withSummary = "PROFESSIONAL SUMMARY\nEquipment records review.\n\n" + federalMetadataDraft;
    const fixtures = [
      { name: "short exact duties without summary", draft: federalMetadataDraft, expected: 200 },
      { name: "brief confirmed global skill", draft: withSummary, expected: 200 },
      { name: "invented causal link", draft: federalMetadataDraft.replace("Reviewed equipment records.", "Reviewed equipment records to improve inventory accuracy."), expected: 422 },
      { name: "target asserted as held qualification", draft: "PROFESSIONAL SUMMARY\nQualified Program Analyst.\n\n" + federalMetadataDraft, expected: 422 },
      { name: "unconfirmed career-wide conclusion", draft: "PROFESSIONAL SUMMARY\nDirected enterprise-wide records strategy.\n\n" + federalMetadataDraft, expected: 422 },
      { name: "unsupported posting credential", draft: federalMetadataDraft + "\nCERTIFICATIONS & TRAINING\nWorkday certification", expected: 422 }
    ];
    const observed = [];
    for (const fixture of fixtures) {
      nextResponse = { status: "completed", output_text: fixture.draft };
      const startCalls = calls.length;
      const startStages = clientStages.length;
      let writerRequest;
      let auditAssertion;
      auditResponseQueue.push(request => {
        try {
          writerRequest = calls.at(-2);
          assert.equal(request.instructions, federalAuditInstructionsReadiness, "the review is not weakened");
          assert.equal(candidateDraftFromAuditRequest(request), fixture.draft, "no silent candidate repair");
          const audit = passingAudit(request);
          if (fixture.expected === 422) {
            audit.audit_verdict = "withhold";
            audit.blockers = ["unsupported_claim"];
            audit.scorecard.find(item => item.dimension === "grounding_and_claim_trace").status = "FAIL";
            const disputed = clauseInventoryFromAuditRequest(request).find(item => /improve inventory|Qualified Program|enterprise-wide|Workday/.test(item.claim_text));
            assert.ok(disputed);
            audit.claim_trace.find(item => item.claim_id === disputed.claim_id).verdict = "unsupported";
          }
          return audit;
        } catch (error) { auditAssertion = error; throw error; }
      });
      const response = await resume.lambdaHandler(post({ action: "draft", mode: "federal", target: "Program Analyst", experience: shortLedger, confirmedFacts: shortLedger, posting: "Review equipment records. Workday certification desired." }));
      if (auditAssertion) throw auditAssertion;
      assert.equal(response.statusCode, fixture.expected, fixture.name + ": " + response.body);
      const body = JSON.parse(response.body);
      if (fixture.expected === 200) {
        assert.equal(body.bullets, fixture.draft);
        assert.equal(body.scorecard.length, 10);
        assert.ok(body.trace.length);
      } else {
        assert.equal(body.bullets, undefined);
        assert.equal(body.trace, undefined);
        assert.equal(body.scorecard.find(item => item.dimension === "grounding_and_claim_trace").status, "FAIL");
      }
      assert.equal(calls.length - startCalls, 2);
      assert.deepEqual(clientStages.slice(startStages), ["resume_federal", "resume_audit"]);
      assert.equal(writerRequest.max_output_tokens, 1900);
      assert.equal(writerRequest.model, "gpt-5.6-terra");
      assert.equal(writerRequest.store, false);
      const instructions = writerRequest.instructions;
      observed.push({ name: fixture.name, status: response.statusCode,
        quotaCount: [/2-4 sentences or dense bullets per role/.test(instructions), /3-4 sentences, specific and stacked/.test(instructions)].filter(Boolean).length,
        preservesSeparateFacts: instructions.includes("Separate facts do not establish a causal relationship, purpose, sequence, or outcome"),
        targetNotQualification: instructions.includes("Never turn the target job title into a held title or proof of qualification"),
        sparseSummaryAllowed: instructions.includes("omit this section if none supports it") });
    }
    console.log("Iteration 10 actual-request observations: " + JSON.stringify(observed));
    assert.ok(observed.every(item => item.quotaCount === 0), "federal writer must have zero minimum expansion quotas");
    assert.ok(observed.every(item => item.preservesSeparateFacts && item.targetNotQualification && item.sparseSummaryAllowed));
    console.log("PASS two prose quotas removed in actual writer requests; 2 short drafts released byte-exact; 4 simulated audit failures withheld with full scorecards; two stubbed calls each; hosted model effectiveness remains pending");
  }

''' + old
    edit(root / 'scripts/openai-migration-regression.js', old, new, 'EDIT 10A')
elif sys.argv[1] == 'runtime':
    path = root / 'netlify/functions/resume.mjs'
    # EDIT 10B: preserve full role-owned detail without mandatory expansion or inferred causal links.
    old = "4. DUTY DETAIL: federal announcements score on specialized experience. Expand each role's bullets into fuller duty statements (2-4 sentences or dense bullets per role) - but ONLY elaborating what they actually stated. Never pad with generic duties they didn't mention."
    new = "4. DUTY DETAIL: Preserve supplied detail in role-owned duty statements. Each statement must be supported in full by facts from that same role. Separate facts do not establish a causal relationship, purpose, sequence, or outcome unless the member explicitly confirms that connection. Do not lengthen a short duty by adding explanations or inferred links; a short exact statement is acceptable. No minimum sentence count."
    edit(path, old, new, 'EDIT 10B')
    # EDIT 10C: permit sparse, supported summaries; do not convert an aspiration into a qualification.
    old = '3-4 sentences, specific and stacked from their input, aimed at the target role.'
    new = 'Use only nonnumeric confirmed activities, skills, or credentials; attribute role-specific activities to their exact role title or employer. Never turn the target job title into a held title or proof of qualification. Use only as much text as the confirmed facts support; omit this section if none supports it. No minimum sentence count.'
    edit(path, old, new, 'EDIT 10C')
    # EDIT 10D: record the reviewed final prompt's exact identity; behavioral request checks remain separate.
    prompt = re.search(r'const systemFederal = `([\s\S]*?)`;', path.read_text()).group(1)
    old_hash = '726e8f5bec24bd629730986f7cd9f9f62e1f6c30c11ade1078805e2141ba5313'
    new_hash = hashlib.sha256(prompt.encode()).hexdigest()
    print('Reviewed federal prompt hash:', new_hash)
    edit(root / 'scripts/openai-migration-regression.js', old_hash, new_hash, 'EDIT 10D')
else:
    raise SystemExit('unknown phase')
