import copy, importlib.util, json, os, re, subprocess, sys, tempfile, unittest
from pathlib import Path
sys.dont_write_bytecode = True
ROOT=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops')
SCRIPT=ROOT/'.github/scripts/pao-render-packet.py'
spec=importlib.util.spec_from_file_location('independent_pao',SCRIPT)
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
RUN='38306086173'; SHA='959c99e480eb3c5931069eabb5c7110f343df1b0'
class IndependentTests(unittest.TestCase):
 def setUp(self):
  self.temp=tempfile.TemporaryDirectory();self.addCleanup(self.temp.cleanup);self.folder=Path(self.temp.name)
  self.baseline=self.folder/'baseline.json';self.baseline.write_text(json.dumps({'packet_date':'2026-08-14','last_whatsnew_version':'v95','last_v_entry':'V-2026-014','last_resources_count':47}))
  self.date='2026-10-12';self.c=m.make_context(self.baseline,self.date,SHA,RUN)
  self.e=json.loads((ROOT/'.claude/pao-task-evidence.json').read_text());r=self.e['tasks'][0]
  self.p={k:self.c[k] for k in ('packet_date','period_start','period_end','source_commit','baseline_sha256')}
  self.p.update(sources_total=7,sources_read=7,source_paths_read=m.SOURCES,sources_failed=[],delta={'whatsnew':[],'v_entries':[],'resources':[]},drafts=[],cvso_email={'kind':r['kind'],'evidence_ids':[r['id']],'body_clean':r['reviewed_copy'],'body_annotated':r['reviewed_copy']+'[src: task:'+r['id']+']'},comparison_gaps=[])
 def render(self,p=None,e=None,c=None,date=None,envelope=None):
  return m.render(envelope if envelope is not None else {'is_error':False,'result':json.dumps(self.p if p is None else p),'usage':{'CANARY_SECRET':'never main body'}},self.c if c is None else c,self.e if e is None else e,self.date if date is None else date,RUN)
 def date_render(self,date):
  c=m.make_context(self.baseline,date,SHA,RUN);p=copy.deepcopy(self.p)
  for k in ('packet_date','period_start','period_end'):p[k]=c[k]
  return self.render(p=p,c=c,date=date)
 def test_next_run_exact_expiry_and_after_expiry(self):
  for date,expected in [('2026-10-19','REVIEW'),('2026-10-26','REVIEW'),('2026-10-27','ACTION_REQUIRED')]:
   with self.subTest(date=date):
    body,status,r=self.date_render(date);self.assertEqual(status,expected);self.assertNotIn('CANARY_SECRET',body)
    if status=='REVIEW':self.assertIn('2026-10-12',body)
 def test_future_observation_and_unbounded_expiry_withheld(self):
  for k,v in [('observed_date','2026-10-13'),('valid_through','2026-10-27'),('valid_through','2099-01-01')]:
   e=copy.deepcopy(self.e);e['tasks'][0][k]=v;_,status,r=self.render(e=e);self.assertEqual(status,'ACTION_REQUIRED');self.assertEqual(r['drafts_for_review'],0)
 def test_verified_change_cannot_use_task_reuse_window(self):
  e=copy.deepcopy(self.e);e['tasks'][0].update(kind='verified_change',release_date='2026-10-12',primary_verification_refs=['synthetic valid reference'],conditions='synthetic fixture')
  c=m.make_context(self.baseline,'2026-10-19',SHA,RUN);p=copy.deepcopy(self.p)
  for k in ('packet_date','period_start','period_end'):p[k]=c[k]
  p['cvso_email']['kind']='verified_change'
  _,status,r=self.render(p=p,e=e,c=c,date='2026-10-19');self.assertEqual(status,'ACTION_REQUIRED')
 def test_changed_app_bytes_hold_task_reuse(self):
  for target in ('context','record'):
   c=copy.deepcopy(self.c);e=copy.deepcopy(self.e)
   if target=='context':c['app_index_sha256']='0'*64
   else:e['tasks'][0]['app_index_sha256']='0'*64
   body,status,r=self.render(c=c,e=e);self.assertEqual(status,'ACTION_REQUIRED');self.assertEqual(r['drafts_for_review'],0)
 def test_missing_clean_copy_cannot_be_promoted_from_annotations(self):
  p=copy.deepcopy(self.p);p['cvso_email'].pop('body_clean')
  body,status,r=self.render(p=p);self.assertEqual(status,'ACTION_REQUIRED');self.assertEqual(r['drafts_for_review'],0)
  self.assertNotIn('Exploring a new role',body)
 def test_sdk_explicit_or_malformed_errors_never_accept_valid_result(self):
  for fields in [{'is_error':True},{'is_error':'true'},{'is_error':1},{'is_error':None},{'is_error':False,'subtype':'error_max_budget_usd'},{'is_error':False,'subtype':'error_during_execution'}]:
   with self.subTest(fields=fields):
    env={'result':json.dumps(self.p),**fields};body,status,r=self.render(envelope=env);self.assertEqual(status,'FAILED');self.assertEqual(r['drafts_for_review'],0);self.assertNotIn(self.p['cvso_email']['body_clean'],body)
 def test_deep_json_inner_and_outer_are_contained(self):
  nested='['*1500+'"SECRET_NESTED"'+']'*1500
  body,status,r=self.render(envelope={'result':nested});self.assertEqual(status,'FAILED');self.assertNotIn('SECRET_NESTED',body)
  raw=self.folder/'raw.json';raw.write_text(nested);c=self.folder/'context.json';c.write_text(json.dumps(self.c));e=self.folder/'evidence.json';e.write_text(json.dumps(self.e));out=self.folder/'out.md';st=self.folder/'status.txt'
  proc=subprocess.run([sys.executable,'-B',str(SCRIPT),str(raw),str(out),self.date,RUN,str(st),str(c),str(e)],capture_output=True,text=True)
  self.assertEqual(proc.returncode,0,proc.stderr);self.assertEqual(st.read_text().strip(),'FAILED');self.assertNotIn('SECRET_NESTED',out.read_text())
 def test_no_raw_or_model_controls_in_primary_body(self):
  p=copy.deepcopy(self.p);p.update(recommendation={'owner':'@everyone','action':'[click](https://evil.invalid)'},analysis_notes='SECRET_ANALYSIS',flags=[{'what':'URGENT_CANARY'}],image_briefs=[{'headline':'SECRET_IMAGE'}],evidence_url='https://evil.invalid')
  body,status,r=self.render(p=p);self.assertEqual(status,'REVIEW')
  for secret in ['@everyone','evil.invalid','SECRET_ANALYSIS','URGENT_CANARY','SECRET_IMAGE','CANARY_SECRET']:self.assertNotIn(secret,body)
  self.assertIn('https://github.com/Nemecekda/Transition_Ops/actions/runs/'+RUN,body)
 def test_draft_source_mismatch_never_quiet_or_send_ready(self):
  p=copy.deepcopy(self.p);p['cvso_email']['body_clean']='Unauthorized output';p['cvso_email']['body_annotated']='Unauthorized output[src: task:'+self.e['tasks'][0]['id']+']'
  body,status,r=self.render(p=p);self.assertEqual(status,'ACTION_REQUIRED');self.assertNotIn('Unauthorized output',body);self.assertIn('**Owner:** PAO',body)
  self.assertNotIn('no action needed',body.lower());self.assertNotIn('quiet week',body.lower())
 def test_actual_packet_not_labeled_this_week_or_current_staged(self):
  env=json.loads((ROOT/'.github/scripts/tests/fixtures/packet-20261012-actual.json').read_text());body,status,r=self.render(envelope=env)
  self.assertEqual(status,'FAILED');self.assertIn('not weekly shipping counts',body);self.assertIn('**Owner:** S3',body)
  for x in ['3 shipped change','STAGED','permission_denials','Full SDK envelope']:self.assertNotIn(x,body)
 def test_malformed_matrix_total_and_payload_no_leak(self):
  values=[None,True,False,0,1,[],{},['MATRIX_SECRET'],{'MATRIX_SECRET':1},'MATRIX_SECRET',1.2]
  count=0
  for target,base in [('payload',self.p),('context',self.c),('evidence',self.e),('record',self.e['tasks'][0])]:
   for key in base:
    for value in values:
     p,c,e=copy.deepcopy(self.p),copy.deepcopy(self.c),copy.deepcopy(self.e);dest={'payload':p,'context':c,'evidence':e,'record':e['tasks'][0]}[target];dest[key]=value
     with self.subTest(target=target,key=key,type=type(value).__name__):
      body,status,r=self.render(p=p,c=c,e=e);self.assertNotIn('MATRIX_SECRET',body)
     count+=1
  print('independent malformed field substitutions:',count)
 def test_cli_renderer_failure_fallback_no_raw_disclosure(self):
  w=(ROOT/'.github/workflows/pao-weekly-packet.yml').read_text();start=w.index('          if ! python3 .github/scripts/pao-render-packet.py');end=w.index('          STATUS=',start)
  snippet='\n'.join(line[10:] for line in w[start:end].splitlines())
  (self.folder/'out').mkdir();(self.folder/'out/packet-result.json').write_text('SECRET_RAW_FALLBACK')
  stub='python3() { return 17; }\nRUN_ID='+RUN+'\nDATE=2026-10-12\n'+snippet
  proc=subprocess.run(['bash','-c',stub],cwd=self.folder,capture_output=True,text=True);self.assertEqual(proc.returncode,0,proc.stderr)
  body=(self.folder/'out/packet.md').read_text();self.assertIn('Owner: S3',body);self.assertIn('/actions/runs/'+RUN,body);self.assertNotIn('SECRET_RAW_FALLBACK',body)
 def test_workflow_frozen_operating_controls(self):
  old=subprocess.check_output(['git','show','HEAD:.github/workflows/pao-weekly-packet.yml'],cwd=ROOT,text=True);new=(ROOT/'.github/workflows/pao-weekly-packet.yml').read_text()
  for pattern in [r"cron: '[^']+'",r'MODEL: [^\n]+',r'--max-budget-usd [\d.]+',r'--allowed-tools "[^"]+"',r'timeout-minutes: \d+',r'retention-days: \d+',r'permissions:\n(?:  [^\n]+\n)+',r'concurrency:\n(?:  [^\n]+\n)+']:
   self.assertEqual(re.findall(pattern,old),re.findall(pattern,new),pattern)
  self.assertNotIn('cat out/packet-result.json',new)
if __name__=='__main__':unittest.main(verbosity=2)
