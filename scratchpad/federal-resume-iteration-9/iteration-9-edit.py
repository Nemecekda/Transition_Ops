from pathlib import Path
import sys

root = Path('/tmp/tops-federal-resume-readiness')

def edit(path, old, new, label):
    # Every approved edit must match once before writing and preserve its post-count.
    src = path.read_text()
    count = src.count(old)
    print(label, 'old expect 1 actual', count, flush=True)
    assert count == 1
    assert src.count(new) == 0
    updated = src.replace(old, new)
    assert updated.count(new) == 1
    expected_old = new.count(old)
    assert updated.count(old) == expected_old
    path.write_text(updated)
    print(label, 'new expect 1 actual', updated.count(new), 'old expect', expected_old, 'actual', updated.count(old), flush=True)

if sys.argv[1] == 'tests':
    # EDIT 9A: replay the exact failed hosted sheet, both paths/modes, plus malformed controls.
    old = '  const legacySingleRoleFacts = facts.replace(\n'
    block = r'''  // Readiness iteration 9: provider-only bare section labels cannot alter item payloads.
  {
    const hosted = JSON.parse(fs.readFileSync(path.join(root, "scratchpad/federal-hosted-964a93e/facts.json"), "utf8"));
    const canonical = hosted.fact_sheet.replace(/^EDUCATION$/m, "EDUCATION (EXACT OR MISSING):").replace(/^CERTIFICATIONS$/m, "CERTIFICATIONS (EXACT OR MISSING):");
    const results = [];
    const aliases = [
      ["both", hosted.fact_sheet],
      ["education", canonical.replace("EDUCATION (EXACT OR MISSING):", "EDUCATION")],
      ["certifications", canonical.replace("CERTIFICATIONS (EXACT OR MISSING):", "CERTIFICATIONS")],
      ["crlf", hosted.fact_sheet.replace(/\n/g, "\r\n")]
    ];
    for (const mode of ["standard", "federal"]) {
      for (const [name, sheet] of aliases) {
        for (const repair of [false, true]) {
          const startCalls = calls.length;
          const startStages = clientStages.length;
          const initial = canonical.replace("DATES (EXACT OR MISSING): January 2023 - December 2025", "DATES (EXACT OR MISSING): duration unknown");
          nextResponse = { status: "completed", output_text: sheet };
          responseQueue = (repair ? [initial, sheet] : [sheet]).map(output_text => ({ status: "completed", output_text }));
          const response = await resume.lambdaHandler(post({ action: "facts", mode, target: "Program Analyst", experience: hosted.source }));
          const body = JSON.parse(response.body);
          const expected = name === "crlf" ? canonical.replace(/\n/g, "\r\n") : canonical;
          assert.equal(response.statusCode, 200);
          assert.equal(responseQueue.length, 0);
          if (!body.warnings.length) {
            assert.equal(body.factSheet, expected, "only the two standalone labels change; payloads/line endings remain exact");
            assert.equal(calls.length - startCalls, repair ? 2 : 1);
            assert.deepEqual(clientStages.slice(startStages), repair ? ["resume_facts", "resume_fact_repair"] : ["resume_facts"]);
          } else {
            assert.equal(body.factSheet, sheet, "baseline preserves the malformed provider sheet");
          }
          results.push({ mode, name, repair, warnings: body.warnings.length, calls: calls.length - startCalls });
        }
      }
      const malformed = [
        hosted.fact_sheet.replace("DUTY ATOM 2 (EXACT): Prepared monthly", "DUTY ATOM 3 (EXACT): Prepared monthly"),
        hosted.fact_sheet.replace("EDUCATION ITEM 2 (EXACT):", "EDUCATION ITEM 4 (EXACT):"),
        hosted.fact_sheet.replace("CERTIFICATION ITEM 2 (EXACT):", "CERTIFICATION ITEM 1 (EXACT):"),
        hosted.fact_sheet.replace("CERTIFICATION ITEM 1 (EXACT): Example Records Management Certificate.", "CERTIFICATION ITEM 1 (EXACT): MISSING"),
        hosted.fact_sheet.replace("\nCERTIFICATIONS\n", "\nUnclassified education continuation.\nCERTIFICATIONS\n"),
        hosted.fact_sheet.replace("\nEDUCATION\n", "\nEDUCATION (EXACT OR MISSING): Another degree;\n"),
        hosted.fact_sheet.replace("EDUCATION ITEM 1 (EXACT):", "UNLABELED ITEM 1 (EXACT):"),
        hosted.fact_sheet.replace("\nEDUCATION\n", "\nEDUCATION DETAILS\n")
      ];
      for (const [index, sheet] of malformed.entries()) {
        nextResponse = { status: "completed", output_text: sheet };
        const startCalls = calls.length;
        const response = await resume.lambdaHandler(post({ action: "facts", mode, target: "Program Analyst", experience: hosted.source }));
        const body = JSON.parse(response.body);
        assert.equal(response.statusCode, 200);
        assert.ok(body.warnings.length, "malformed case " + index + " remains blocked");
        assert.equal(body.factSheet, sheet, "invalid candidate is never partially normalized");
        assert.equal(calls.length - startCalls, 2, "only the existing single repair");
        const draftStart = calls.length;
        const draft = await resume.lambdaHandler(post({ action: "draft", mode, target: "Program Analyst", experience: hosted.source, confirmedFacts: body.factSheet }));
        assert.equal(draft.statusCode, 400);
        assert.equal(calls.length, draftStart, "malformed confirmed facts never reach a provider");
        assert.equal(JSON.parse(draft.body).bullets, undefined);
      }
      nextResponse = { status: "completed", output_text: hosted.fact_sheet.replace("12 teams", "13 teams") };
      const numberStart = calls.length;
      const invented = await resume.lambdaHandler(post({ action: "facts", mode, target: "Program Analyst", experience: hosted.source }));
      assert.equal(invented.statusCode, 502);
      assert.equal(JSON.parse(invented.body).factSheet, undefined);
      assert.equal(calls.length - numberStart, 1, "header canonicalization cannot bypass numeric checks");
      const directStart = calls.length;
      const direct = await resume.lambdaHandler(post({ action: "draft", mode, target: "Program Analyst", experience: hosted.source, confirmedFacts: hosted.fact_sheet }));
      assert.equal(direct.statusCode, 400);
      assert.equal(calls.length, directStart, "member-confirmed facts retain the strict parser and are not rewritten");
    }
    console.log("Iteration 9 header observations: " + JSON.stringify(results));
    console.log("PASS 16 malformed extractions + 16 malformed direct drafts + 2 invented-number cases + 2 bare-header direct drafts remain blocked");
    assert.equal(results.filter(item => item.warnings === 0).length, 16, "all sixteen supported provider-only header cases should proceed without warnings");
    console.log("PASS 16/16 provider header cases; exact facts and CRLF preserved; initial calls 1, repair calls 2; no retries");
    nextResponse = { status: "completed", output_text: facts };
  }

'''
    edit(root / 'scripts/openai-migration-regression.js', old, block + old, 'EDIT 9A')
elif sys.argv[1] == 'runtime':
    path = root / 'netlify/functions/resume.mjs'
    # EDIT 9B: canonicalize only two complete provider-output header aliases, and only for an otherwise valid sheet.
    old = '  function factIssueWarnings(issues) {\n'
    block = r'''  function canonicalExtractedFactHeaders(facts, source) {
    const canonical = facts
      .replace(/^EDUCATION(?=\r?\nEDUCATION ITEM 1 \(EXACT\): )/gm, "EDUCATION (EXACT OR MISSING):")
      .replace(/^CERTIFICATIONS(?=\r?\nCERTIFICATION ITEM 1 \(EXACT\): )/gm, "CERTIFICATIONS (EXACT OR MISSING):");
    return canonical !== facts && !factSheetIssues(canonical, source).length ? canonical : facts;
  }

'''
    edit(path, old, block + old, 'EDIT 9B')
    # EDIT 9C: use the provider-only helper at initial extraction; draft output stays unchanged.
    edit(path, '    const rawText = responseText(response);\n', '    const rawText = action === "facts" ? canonicalExtractedFactHeaders(responseText(response), factSourceBlock) : responseText(response);\n', 'EDIT 9C')
    # EDIT 9D: use the same helper after the existing single structural repair.
    edit(path, '      const repairedText = responseText(repairResponse);\n', '      const repairedText = canonicalExtractedFactHeaders(responseText(repairResponse), factSourceBlock);\n', 'EDIT 9D')
else:
    raise SystemExit('unknown edit phase')
