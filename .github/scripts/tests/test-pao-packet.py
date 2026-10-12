#!/usr/bin/env python3
"""Offline receipt-boundary regressions for useful PAO packets. No model or network."""
import copy
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SCRIPT = ROOT / '.github/scripts/pao-render-packet.py'
FIXTURES = Path(__file__).with_name('fixtures')
spec = importlib.util.spec_from_file_location('pao_renderer', SCRIPT)
pao = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pao)
DATE = '2026-10-12'
RUN = '38306086173'
SHA = '959c99e480eb3c5931069eabb5c7110f343df1b0'
BASELINE = {'packet_date': '2026-08-14', 'last_whatsnew_version': 'v95',
            'last_v_entry': 'V-2026-014', 'last_resources_count': 47}
EVIDENCE = json.loads((ROOT / '.claude/pao-task-evidence.json').read_text())


class PacketTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.folder = Path(self.tmp.name)
        self.baseline = self.folder / 'pao-baseline.json'
        self.baseline.write_text(json.dumps(BASELINE))
        self.context = pao.make_context(self.baseline, DATE, SHA, RUN)
        self.evidence = copy.deepcopy(EVIDENCE)
        task = self.evidence['tasks'][0]
        draft = {'kind': task['kind'], 'evidence_ids': [task['id']],
                 'body_clean': task['reviewed_copy'],
                 'body_annotated': task['reviewed_copy'] + '[src: task:' + task['id'] + ']'}
        self.payload = {key: self.context[key] for key in
                        ('packet_date', 'period_start', 'period_end', 'source_commit', 'baseline_sha256')}
        self.payload.update(sources_total=7, sources_read=7, sources_failed=[],
                            source_paths_read=pao.SOURCES, comparison_gaps=[],
                            delta={'whatsnew': [], 'v_entries': [], 'resources': []},
                            drafts=[], cvso_email=draft, image_briefs=[], flags=[])

    def render(self, payload=None, evidence=None, context=None, date=DATE, envelope=None):
        if envelope is None:
            envelope = {'is_error': False, 'result': json.dumps(self.payload if payload is None else payload),
                        'session_id': 'RAW_SDK_CANARY', 'usage': {'private': 'RAW_USAGE_CANARY'}}
        body, status, receipt = pao.render(envelope, self.context if context is None else context,
                                          self.evidence if evidence is None else evidence, date, RUN)
        self.assertNotIn('RAW_SDK_CANARY', body)
        self.assertNotIn('RAW_USAGE_CANARY', body)
        self.assertNotIn('Full SDK envelope', body)
        self.assertNotIn('**Send this**', body)
        self.assertNotIn('**Post this**', body)
        return body, status, receipt

    def test_current_useful_handout_without_delta(self):
        body, status, receipt = self.render()
        self.assertEqual(status, 'REVIEW')
        self.assertEqual(receipt['drafts_for_review'], 1)
        self.assertIn('Review and save', body)
        self.assertLess(body.index('Review and save'), body.index('**Owner:**'))
        self.assertLess(body.index('Review and save'), body.index('**Baseline:**'))
        self.assertIn('Use for this visit', body)
        self.assertIn('Existing-feature how-to. Observed 2026-10-12', body)
        self.assertIn('not a new-release', body)
        self.assertNotIn('[src:', body)

    def test_actual_old_packet_is_history_and_has_owner(self):
        envelope = json.loads((FIXTURES / 'packet-20261012-actual.json').read_text())
        body, status, receipt = self.render(envelope=envelope)
        self.assertEqual(status, 'FAILED')
        self.assertIn('model_context_mismatch', receipt['errors'])
        self.assertIn('3 changelog entries, 8 verification records, 0 appended listings', body)
        self.assertNotIn('3 shipped change', body)
        self.assertNotIn('quiet week', body.lower())
        self.assertNotIn('STAGED', body)
        self.assertNotIn('5 of 7', body)
        self.assertIn('**Owner:** S3', body)
        self.assertIn('baseline', body)
        self.assertNotIn('permission_denials', body)

    def test_new_schema_empty_drafts_not_ok_from_delta(self):
        self.payload['cvso_email'] = None
        self.payload['delta']['whatsnew'] = ['v96', 'v97', 'v98']
        body, status, receipt = self.render()
        self.assertEqual(status, 'ACTION_REQUIRED')
        self.assertIn('**Owner:** PAO', body)
        self.assertIn('reviewed copy', body)
        self.assertEqual(receipt['drafts_for_review'], 0)

    def test_no_task_has_specific_s3_next_step(self):
        self.payload['cvso_email'] = None
        body, status, _ = self.render(evidence={'schema_version': 1, 'tasks': []})
        self.assertEqual(status, 'ACTION_REQUIRED')
        self.assertIn('Walk Career without a resume', body)
        self.assertIn('**Owner:** S3, then PAO', body)
        self.assertNotIn('no action needed', body.lower())

    def test_comparison_gap_does_not_block_checked_handout(self):
        self.payload['comparison_gaps'] = ['V-2026-014 lineage ambiguous after completed read']
        body, status, receipt = self.render()
        self.assertEqual(status, 'REVIEW')
        self.assertIn('historical_comparison_limited', receipt['errors'])
        self.assertNotIn(self.payload['comparison_gaps'][0], body)

    def test_partial_zero_bool_excess_and_failed_input_coverage(self):
        for field, value in [('sources_read', 0), ('sources_read', 6), ('sources_read', 8),
                             ('sources_read', True), ('sources_total', True), ('sources_total', 0),
                             ('sources_failed', None), ('sources_failed', ['SECRET_ERROR']),
                             ('source_paths_read', []), ('sources_read', '7')]:
            with self.subTest(field=field, value=value):
                changed = copy.deepcopy(self.payload); changed[field] = value
                body, status, receipt = self.render(payload=changed)
                self.assertEqual(status, 'FAILED')
                self.assertEqual(receipt['drafts_for_review'], 0)
                self.assertNotIn('SECRET_ERROR', body)

    def test_model_date_sha_period_and_baseline_drift(self):
        for field in ('packet_date', 'source_commit', 'period_start', 'period_end', 'baseline_sha256'):
            with self.subTest(field=field):
                changed = copy.deepcopy(self.payload); changed[field] = 'WRONG'
                _, status, receipt = self.render(payload=changed)
                self.assertEqual(status, 'FAILED')
                self.assertIn('model_context_mismatch', receipt['errors'])

    def test_invalid_trusted_context_no_crash(self):
        cases = [None, {}, [], 'bad']
        for field, value in [('baseline', []), ('baseline', {}), ('source_commit', []),
                             ('run_id', 'bad'), ('period_start', 'tomorrow')]:
            item = copy.deepcopy(self.context); item[field] = value; cases.append(item)
        for item in cases:
            with self.subTest(context=item):
                body, status, _ = pao.render({'result': json.dumps(self.payload)}, item, self.evidence, DATE, RUN)
                self.assertEqual(status, 'FAILED')
                self.assertIn('run_context_invalid', body)

    def test_next_monday_reuse_is_dated_not_new_release(self):
        context = pao.make_context(self.baseline, '2026-10-19', SHA, RUN)
        payload = copy.deepcopy(self.payload)
        for key in ('packet_date', 'period_start', 'period_end'):
            payload[key] = context[key]
        body, status, _ = self.render(payload=payload, context=context, date='2026-10-19')
        self.assertEqual(status, 'REVIEW')
        self.assertIn('Observed 2026-10-12', body)

    def test_expired_future_or_excess_freshness_is_held(self):
        for field, value in [('valid_through', '2026-10-11'), ('observed_date', '2026-10-13'),
                             ('valid_through', '2027-01-01'), ('observed_date', None)]:
            with self.subTest(field=field):
                evidence = copy.deepcopy(self.evidence); evidence['tasks'][0][field] = value
                _, status, receipt = self.render(evidence=evidence)
                self.assertEqual(status, 'ACTION_REQUIRED')
                self.assertEqual(receipt['drafts_for_review'], 0)

    def test_unreviewed_outcome_claim_is_withheld(self):
        draft = self.payload['cvso_email']
        draft['body_clean'] = 'This guarantees you will be hired.'
        draft['body_annotated'] = draft['body_clean'] + '[src: task:' + draft['evidence_ids'][0] + ']'
        body, status, receipt = self.render()
        self.assertEqual(status, 'ACTION_REQUIRED')
        self.assertNotIn('guarantees', body)
        self.assertIn('draft_wording_needs_editorial_review', receipt['errors'])

    def test_clean_annotated_equality_citation_presence_identity_and_leak(self):
        for field, value in [('body_annotated', 'no reference'), ('body_clean', 'leak [src: task:x]'),
                             ('body_annotated', self.payload['cvso_email']['body_clean'] + '[src: v98]'),
                             ('body_annotated', self.payload['cvso_email']['body_annotated'] + ' EXTRA'),
                             ('evidence_ids', ['unknown']), ('evidence_ids', [{}])]:
            with self.subTest(field=field):
                payload = copy.deepcopy(self.payload); payload['cvso_email'][field] = value
                _, status, receipt = self.render(payload=payload)
                self.assertEqual(status, 'ACTION_REQUIRED')
                self.assertEqual(receipt['drafts_for_review'], 0)

    def test_malformed_nested_copy_delta_and_arrays_total(self):
        for field in ('cvso_email', 'drafts', 'delta', 'comparison_gaps'):
            for value in ([], {}, 'raw SECRET_VALUE', 3, True):
                with self.subTest(field=field, value=value):
                    payload = copy.deepcopy(self.payload); payload[field] = value
                    body, _, _ = self.render(payload=payload)
                    self.assertNotIn('SECRET_VALUE', body)
        for value in (None, [], {}, 2, True, 'x' * 6501):
            payload = copy.deepcopy(self.payload); payload['cvso_email']['body_clean'] = value
            _, status, _ = self.render(payload=payload)
            self.assertEqual(status, 'ACTION_REQUIRED')

    def test_bad_task_record_types_and_duplicate_id_hold(self):
        for field, value in [('steps', {}), ('id', []), ('reviewed_copy', []),
                             ('entry_url', 'https://example.com/'), ('accepted', False)]:
            evidence = copy.deepcopy(self.evidence); evidence['tasks'][0][field] = value
            _, status, _ = self.render(evidence=evidence)
            self.assertEqual(status, 'ACTION_REQUIRED')
        evidence = copy.deepcopy(self.evidence); evidence['tasks'] *= 2
        _, status, _ = self.render(evidence=evidence)
        self.assertEqual(status, 'ACTION_REQUIRED')

    def test_raw_failed_envelope_never_enters_issue(self):
        for envelope in ([], None, {'result': 'SECRET_SDK_BODY'}, {'is_error': True, 'result': 'SECRET_SDK_BODY'},
                         {'result': json.dumps(['SECRET_SDK_BODY'])}):
            body, status, _ = pao.render(envelope, self.context, self.evidence, DATE, RUN)
            self.assertEqual(status, 'FAILED')
            self.assertNotIn('SECRET_SDK_BODY', body)
            self.assertIn('**Owner:** S3', body)

    def test_hostile_markdown_cannot_escape_reviewed_copy_fence(self):
        copytext = 'Quoted task\n```\n<img src="https://example.com/x">\n````\n@everyone'
        self.evidence['tasks'][0]['reviewed_copy'] = copytext
        draft = self.payload['cvso_email'];draft['body_clean'] = copytext
        draft['body_annotated'] = copytext + '[src: task:' + draft['evidence_ids'][0] + ']'
        body, status, _ = self.render()
        self.assertEqual(status, 'REVIEW')
        self.assertIn('`````\n' + copytext + '\n`````', body)

    def test_optional_image_and_flag_metadata_are_artifact_only(self):
        self.payload['image_briefs'] = [{'headline': 'SECRET_BRIEF'}]
        self.payload['flags'] = [{'date': '2020-01-01', 'what': 'EXPIRED_URGENCY'}]
        self.payload['analysis_notes'] = 'V-2026-017 STAGED SECRET_ANALYSIS'
        body, status, _ = self.render()
        self.assertEqual(status, 'REVIEW')
        self.assertNotIn('SECRET_BRIEF', body);self.assertNotIn('EXPIRED_URGENCY', body)
        self.assertNotIn('SECRET_ANALYSIS', body)

    def test_baseline_unchanged_and_issue22_reference(self):
        original = self.baseline.read_bytes()
        body, _, _ = self.render()
        self.assertEqual(original, self.baseline.read_bytes())
        self.assertIn('/issues/22', body)
        self.assertIn('2026-08-14 (v95, V-2026-014, 47 resources), unchanged', body)
        self.assertIn('/actions/runs/' + RUN, body)

    def test_context_generation_rejects_invalid_or_future_baseline(self):
        for field, value in [('packet_date', '2027-01-01'), ('last_whatsnew_version', ''),
                             ('last_v_entry', ''), ('last_resources_count', True)]:
            baseline = copy.deepcopy(BASELINE);baseline[field] = value
            self.baseline.write_text(json.dumps(baseline))
            with self.assertRaises(ValueError):
                pao.make_context(self.baseline, DATE, SHA, RUN)

    def test_verified_change_requires_current_release_and_primary_record(self):
        record = self.evidence['tasks'][0];record['kind'] = 'verified_change'
        record.update(release_date=DATE, primary_verification_refs=['synthetic accepted primary record'],
                      conditions='Synthetic fixture only; not a policy claim')
        self.payload['cvso_email']['kind'] = 'verified_change'
        _, status, _ = self.render(); self.assertEqual(status, 'REVIEW')
        for key, value in [('release_date', '2026-08-14'), ('release_date', '2026-10-13'),
                           ('primary_verification_refs', []), ('conditions', '')]:
            evidence = copy.deepcopy(self.evidence); evidence['tasks'][0][key] = value
            _, status, _ = self.render(evidence=evidence);self.assertEqual(status, 'ACTION_REQUIRED')

    def test_member_content_not_on_employer_channel(self):
        draft = self.payload.pop('cvso_email');draft['channel'] = 'vbs-linkedin'
        self.payload['drafts'] = [draft]
        _, status, receipt = self.render()
        self.assertEqual(status, 'ACTION_REQUIRED')
        self.assertIn('draft_channel_audience_mismatch', receipt['errors'])

    def test_legacy_fixtures_parse_without_being_current(self):
        for fixture in FIXTURES.glob('packet-*.json'):
            with self.subTest(fixture=fixture.name):
                envelope = json.loads(fixture.read_text())
                body, status, _ = self.render(envelope=envelope)
                self.assertEqual(status, 'FAILED')
                self.assertIn('**Next task:**', body)

    def test_cli_preserves_raw_and_writes_content_free_receipt(self):
        envelope = {'result': json.dumps(self.payload), 'usage': 'SECRET_RAW_USAGE'}
        data = self.folder/'packet-result.json';data.write_text(json.dumps(envelope))
        original = data.read_bytes()
        context = self.folder/'context.json'; context.write_text(json.dumps(self.context))
        evidence = self.folder/'evidence.json'; evidence.write_text(json.dumps(self.evidence))
        out = self.folder/'packet.md';status = self.folder/'status.txt'
        proc = subprocess.run([sys.executable, str(SCRIPT), str(data), str(out), DATE, RUN,
                               str(status), str(context), str(evidence)], capture_output=True, text=True)
        self.assertEqual(proc.returncode, 0, proc.stderr)
        self.assertEqual(status.read_text().strip(), 'REVIEW')
        self.assertEqual(data.read_bytes(), original)
        self.assertNotIn('SECRET_RAW_USAGE', out.read_text())
        self.assertEqual(json.loads((self.folder/'pao-validation.json').read_text())['drafts_for_review'], 1)

    def test_workflow_fallback_has_no_raw_cat_and_controls_stay_pinned(self):
        workflow = (ROOT/'.github/workflows/pao-weekly-packet.yml').read_text()
        for expected in ("cron: '0 12 * * 1'", 'MODEL: claude-haiku-4-5-20251001',
                         '--max-budget-usd 0.75', '--allowed-tools "Read"', "BASELINE_ISSUE: '22'",
                         'timeout-minutes: 20', 'retention-days: 30', 'contents: read',
                         'issues: write', 'actions: read', 'out/pao-task-evidence.json'):
            self.assertIn(expected, workflow)
        self.assertNotIn('cat out/packet-result.json', workflow)
        self.assertIn('raw output remains artifact-only', workflow)
        self.assertIn('REVIEW|ACTION_REQUIRED)', workflow)

    def test_prompt_amendment_orientation_and_no_filler_contract(self):
        prompt = (ROOT/'.claude/prompts/pao-weekly-packet.txt').read_text()
        for expected in ('NEWEST FIRST', 'entries BEFORE it', 'September 4 V-2026-017 amendment',
                         'comparison_gaps', 'Never auto-update baseline', 'reviewed_copy',
                         'READ THESE EXACT SEVEN PATHS', 'at most 14 days', 'proposed_copy'):
            self.assertIn(expected, prompt)
        self.assertNotIn('If the delta is empty in all three, say so plainly and draft nothing', prompt)


    def test_deep_json_and_error_sdk_shapes_fail_closed(self):
        deep = '[' * 1200 + '0' + ']' * 1200
        for envelope in ({'result': deep}, {'is_error': 'false', 'result': json.dumps(self.payload)},
                         {'subtype': 'error_max_budget_usd', 'result': json.dumps(self.payload)}):
            _, status, _ = self.render(envelope=envelope)
            self.assertEqual(status, 'FAILED')
        data = self.folder/'deep.txt';data.write_text(deep)
        out = self.folder/'packet.md';statusfile=self.folder/'status.txt'
        proc=subprocess.run([sys.executable,str(SCRIPT),str(data),str(out),DATE,RUN,str(statusfile)],
                            capture_output=True,text=True)
        self.assertEqual(proc.returncode,0,proc.stderr)
        self.assertEqual(statusfile.read_text().strip(),'FAILED')

    def test_changed_app_bytes_withhold_reuse(self):
        self.context['app_index_sha256']='a'*64
        body,status,receipt=self.render()
        self.assertEqual(status,'ACTION_REQUIRED')
        self.assertEqual(receipt['drafts_for_review'],0)
        self.assertIn('Verify one useful live journey',body)

    def test_voice_guard_under_current_schema(self):
        for clean in ('A task!', 'Excited to announce this task.'):
            self.evidence['tasks'][0]['reviewed_copy']=clean
            self.payload['cvso_email']['body_clean']=clean
            identity=self.evidence['tasks'][0]['id']
            self.payload['cvso_email']['body_annotated']=clean+'[src: task:'+identity+']'
            _,status,receipt=self.render()
            self.assertEqual(status,'ACTION_REQUIRED')
            self.assertIn('draft_voice_review_needed',receipt['errors'])

    def test_renderer_crash_real_workflow_fallback_keeps_sdk_private(self):
        workflow=(ROOT/'.github/workflows/pao-weekly-packet.yml').read_text()
        fragment=workflow.split('          # Default FAILED.',1)[1].split('          STATUS=',1)[0]
        fragment='\n'.join(line[10:] if line.startswith('          ') else line for line in fragment.splitlines()[1:])
        (self.folder/'out').mkdir()
        (self.folder/'out/packet-result.json').write_text('SECRET_CRASH_RAW')
        stub=self.folder/'bin';stub.mkdir()
        python=stub/'python3';python.write_text('#!/bin/sh\nif [ "$1" = "-c" ]; then echo 2026-10-12; exit 0; fi\nexit 1\n');python.chmod(0o700)
        import os
        env=dict(os.environ,PATH=str(stub)+':'+os.environ['PATH'],RUN_ID=RUN)
        proc=subprocess.run(['/bin/bash','-e','-c',fragment],cwd=self.folder,env=env,capture_output=True,text=True)
        self.assertEqual(proc.returncode,0,proc.stderr)
        body=(self.folder/'out/packet.md').read_text()
        self.assertNotIn('SECRET_CRASH_RAW',body)
        self.assertIn('Owner: S3',body)
        self.assertIn('/actions/runs/'+RUN,body)
        self.assertIn('upload status',body)
        self.assertEqual((self.folder/'out/pao-status.txt').read_text().strip(),'FAILED')

    def test_card_generator_existing_self_test(self):
        proc=subprocess.run([sys.executable,str(ROOT/'tools/make-social-card.py'),'--self-test'],
                            capture_output=True,text=True)
        self.assertEqual(proc.returncode,0,proc.stdout+proc.stderr)


if __name__ == '__main__':
    unittest.main(verbosity=2)
