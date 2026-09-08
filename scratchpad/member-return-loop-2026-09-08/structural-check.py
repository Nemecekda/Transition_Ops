"""Required structural inventories plus scoped diff checks; no network."""
from pathlib import Path
import subprocess,re,json,tempfile,hashlib
root=Path(__file__).resolve().parents[2];out=Path(__file__).parent
def git(*a):return subprocess.check_output(['git',*a],cwd=root,text=True)
status=git('status','--porcelain','--untracked-files=all');assert status
print('EDIT MODE\n'+status)
tracked=git('ls-files').splitlines();new=[str(p.relative_to(root)) for p in out.rglob('*') if p.is_file()]
js=sorted({p for p in tracked+new if Path(p).suffix in ('.js','.cjs','.mjs')})
js_results=[]
for p in js:
 r=subprocess.run(['node','--check',str(root/p)],capture_output=True,text=True)
 js_results.append({'path':p,'bytes':(root/p).stat().st_size,'exit':r.returncode});assert r.returncode==0,(p,r.stderr)
jsons=sorted({p for p in tracked+new if p.endswith('.json')});json_results=[]
for p in jsons:
 json.loads((root/p).read_text());json_results.append({'path':p,'bytes':(root/p).stat().st_size,'result':'PASS'})
inline=[];source=(root/'index.html').read_text()
with tempfile.TemporaryDirectory(prefix='tops-return-parse-') as tmp:
 for i,m in enumerate(re.finditer(r'<script\b([^>]*)>([\s\S]*?)</script>',source,re.I)):
  body=m.group(2)
  if not body.strip():continue
  kind='json' if 'ld+json' in m.group(1) else 'js'
  if kind=='json':json.loads(body)
  else:
   p=Path(tmp)/('block'+str(i)+'.js');p.write_text(body);r=subprocess.run(['node','--check',str(p)],capture_output=True,text=True);assert r.returncode==0,r.stderr
  inline.append({'block':i,'kind':kind,'start_line':source[:m.start()].count('\n')+1,'end_line':source[:m.end()].count('\n')+1,'bytes':len(body.encode()),'result':'PASS'})
diff=git('diff','-U0');bad=[l for l in diff.splitlines() if l.startswith('+') and re.search('[\u2018\u2019\u201c\u201d\u00a0]',l)];assert not bad,bad
subprocess.run(['git','diff','--check'],cwd=root,check=True)
result={'mode':'EDIT','status':status,'js_inventory':js_results,'json_inventory':json_results,'inline':inline,'added_runtime_encoding':'PASS','diff_check':'PASS','workflow_checks':'4S and YAML N/A: no workflow change','function_package':'4N N/A: no function/package/Netlify configuration change','result':'PASS'}
(out/'structural.json').write_text(json.dumps(result,indent=2)+'\n');print('STRUCTURAL PASS',len(js),'JS files,',len(jsons),'JSON files,',len(inline),'inline blocks')
