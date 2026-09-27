"""No-network contract and executed-workflow regressions for J2."""
import copy
import json
import os
from pathlib import Path
import runpy
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[3]
API = runpy.run_path(str(ROOT / '.github/scripts/j2-analysis-contract.py'))
FINDING = dict(verdict='NEEDS-LADDER', source_id='synthetic-source', subject='Synthetic',
               source_excerpt='Quoted source', app_line=100,
               app_excerpt='{ a: "quoted \\" text', what_differs='Review required',
               amended_bill_trigger=False, needs_ladder_reason='Needs original source',
               contains_instruction_like_text=False)
PAYLOAD = dict(j1_issues_consumed=[7], sources_correlated=1, coverage_note='Synthetic only', findings=[FINDING])


def envelope(result):
    return dict(is_error=False, subtype='success', result=result)


def block(name):
    workflow = (ROOT / '.github/workflows/j2-weekly-analysis.yml').read_text()
    step = workflow.split('- name: ' + name, 1)[1].split('\n      - name:', 1)[0]
    body = step.split("python3 - <<'PY'\n", 1)[1].split('\n          PY', 1)[0]
    return '\n'.join(line[10:] for line in body.splitlines())


class Contract(unittest.TestCase):
    def reject(self, value):
        with self.assertRaises(API['ContractError']):
            API['decode_result'](envelope(value), {7})

    def test_plain_and_fenced_quoted_braces(self):
        raw = json.dumps(PAYLOAD)
        for text, form in [(raw, 'json'), ('```json\n'+raw+'\n```', 'json_fence')]:
            parsed, actual = API['decode_result'](envelope(text), {7})
            self.assertEqual(parsed, PAYLOAD)
            self.assertEqual(actual, form)

    def test_ambiguous_and_malformed(self):
        raw = json.dumps(PAYLOAD)
        for text in ['null', '[]', '1', '{}', raw[:-2], raw+' {}', 'preface '+raw,
                     raw+' trailing', '```json\n'+raw, '```\n'+raw+'\n```',
                     '```json\n'+raw+'\n```\nextra', json.dumps(FINDING),
                     '{"findings":[],"findings":[]}', '{"x":NaN}']:
            with self.subTest(text=text[:25]): self.reject(text)

    def test_typed_closed_shapes(self):
        mutations = [lambda x:x.update(extra=True), lambda x:x.update(findings={}),
                     lambda x:x.update(findings=[None]), lambda x:x.update(sources_correlated=True),
                     lambda x:x.update(coverage_note=[]), lambda x:x.update(j1_issues_consumed=[7,7]),
                     lambda x:x.update(j1_issues_consumed=[8]), lambda x:x.update(j1_issues_consumed=[True]),
                     lambda x:x['findings'][0].update(app_line=True),
                     lambda x:x['findings'][0].update(app_line='100'),
                     lambda x:x['findings'][0].update(amended_bill_trigger='false'),
                     lambda x:x['findings'][0].update(subject='x'*501),
                     lambda x:x['findings'][0].update(source_excerpt='\ud800'),
                     lambda x:x['findings'][0].update(extra=1)]
        for change in mutations:
            data=copy.deepcopy(PAYLOAD);change(data);self.reject(json.dumps(data))
        for bad in [dict(is_error=True,subtype='success',result=json.dumps(PAYLOAD)),
                    dict(is_error=False,subtype='error_max_budget_usd',result=json.dumps(PAYLOAD)),
                    dict(is_error=False,subtype='success',result=PAYLOAD)]:
            with self.assertRaises(API['ContractError']): API['decode_result'](bad,{7})

    def test_receipt_content_free_and_bounds(self):
        with tempfile.TemporaryDirectory() as d:
            result=Path(d)/'result';index=Path(d)/'index';index.write_text('[{"number":7}]')
            for text in ['{"result":"SECRET_SENTINEL","result":"other"}', '{"x":NaN}', 'SECRET_SENTINEL']:
                result.write_text(text);payload,receipt=API['load_analysis'](result,index)
                self.assertIsNone(payload);self.assertEqual(receipt['gathered_count'],1)
                self.assertEqual(receipt['accepted_count'],0);self.assertNotIn('SECRET_SENTINEL',json.dumps(receipt))
            result.write_bytes(b'x'*(API['MAX_BYTES']+1));self.assertEqual(API['load_analysis'](result,index)[1]['reason'],'response_too_large')
            index.write_text('[{"number":7},{"number":7}]');self.assertEqual(API['load_analysis'](result,index)[1]['reason'],'invalid_gathered_index')

    def run_governors(self, payload, history=None, fenced=False, raw=None):
        d=tempfile.TemporaryDirectory();self.addCleanup(d.cleanup);root=Path(d.name)
        (root/'out').mkdir();(root/'.github/scripts').mkdir(parents=True)
        (root/'.github/scripts/j2-analysis-contract.py').write_bytes((ROOT/'.github/scripts/j2-analysis-contract.py').read_bytes())
        text=json.dumps(payload);text='```json\n'+text+'\n```' if fenced else text
        (root/'out/analysis-result.json').write_text(raw if raw is not None else json.dumps(envelope(text)))
        for name,data in [('j1-index.json',[{'number':7}]),('flash-window.json',history or [])]:
            (root/'out'/name).write_text(json.dumps(data))
        (root/'out/app-figures.txt').write_text('100:exact app value\n')
        (root/'out/dedupe-since.txt').write_text('2026-09-24T00:00:00Z')
        env={**os.environ,'FLASH_BUDGET':'2','FLASH_WINDOW_DAYS':'7','DEDUPE_WINDOW_HOURS':'72','RUN_DATE':'2026-09-27','RUN_ID':'synthetic'}
        run=subprocess.run(['python3','-c',block('Apply governors')],cwd=root,env=env,capture_output=True,text=True)
        self.assertEqual(run.returncode,0,run.stderr)
        decisions=json.loads((root/'out/decisions.json').read_text())
        render=subprocess.run(['python3','-c',block('File ROUTINE digest')],cwd=root,env=env,capture_output=True,text=True)
        self.assertEqual(render.returncode,0,render.stderr)
        return decisions,(root/'out/digest.md').read_text(),list((root/'out/file').iterdir())

    def test_failure_has_gathered_zeroaccepted_no_flash(self):
        decision,digest,files=self.run_governors(PAYLOAD,raw='SECRET_SENTINEL')
        self.assertEqual(decision['analysis_parse']['gathered_count'],1)
        self.assertEqual(decision['j1_issues_consumed'],[])
        self.assertEqual(files,[]);self.assertIn('1 J1 issue(s) gathered',digest)
        self.assertIn('0 J1 issue(s) accepted',digest);self.assertIn('ANALYSIS  rejected',digest)
        self.assertNotIn('SECRET_SENTINEL',digest);self.assertNotIn('NO ACTION NEEDED',digest)

    def test_partial_coverage_is_not_all_clear(self):
        payload=copy.deepcopy(PAYLOAD);payload.update(j1_issues_consumed=[],findings=[],sources_correlated=0)
        decision,digest,files=self.run_governors(payload)
        self.assertEqual(decision['analysis_parse']['accepted_count'],0)
        self.assertIn('omits gathered J1 inputs',digest)
        self.assertNotIn('NO ACTION NEEDED',digest);self.assertEqual(files,[])

    def test_fence_notice_and_governors_preserved(self):
        decision,digest,_=self.run_governors(PAYLOAD,fenced=True)
        self.assertEqual(decision['j1_issues_consumed'],[7]);self.assertIn('code fence',digest)
        p=copy.deepcopy(PAYLOAD);p['findings'][0].update(verdict='CONFIRMED')
        d,_,f=self.run_governors(p);self.assertEqual(d['findings'][0]['verdict'],'NEEDS-LADDER');self.assertEqual(f,[])
        p['findings'][0].update(verdict='DIVERGENT',app_excerpt='wrong')
        d,_,f=self.run_governors(p);self.assertEqual(d['findings'][0]['verdict'],'NEEDS-LADDER');self.assertEqual(f,[])
        p['findings'][0]['app_excerpt']='exact app value'
        history=[{'title':'F2|synthetic-source|L100','createdAt':'2026-09-26T00:00:00Z','state':'OPEN','number':5}]
        d,_,f=self.run_governors(p,history);self.assertEqual(d['divergent'][0]['_label'],'ROUTINE');self.assertIn('N2 DEDUPE',str(d));self.assertEqual(f,[])
        history=[{'title':'other','createdAt':'2026-09-26T00:00:00Z','state':'CLOSED','number':n} for n in [1,2]]
        d,_,f=self.run_governors(p,history);self.assertEqual(d['n1_downgraded'],1);self.assertEqual(f,[])
        d,_,f=self.run_governors(p);self.assertEqual(d['divergent'][0]['_label'],'FLASH');self.assertEqual(len(f),1)


if __name__=='__main__': unittest.main(verbosity=2)
