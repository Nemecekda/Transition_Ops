"""Read-only delta against the completed release history; no provider/deploy actions."""
import json,hashlib,datetime,urllib.request,concurrent.futures,re,os
from pathlib import Path
out=Path(__file__).parent
prior=Path('/tmp/tops-production-prep-0fd3c45-2026-09-08')
cfg=json.loads((Path.home()/'Library/Preferences/netlify/config.json').read_text())
token=cfg.get('users',{}).get(cfg.get('userId'),{}).get('auth',{}).get('token')
assert token,'Existing Netlify CLI authentication unavailable'
def get(p):
 with urllib.request.urlopen(urllib.request.Request('https://api.netlify.com/api/v1'+p,headers={'Authorization':'Bearer '+token}),timeout=20) as r:return json.load(r)
def safe(d):return {k:d.get(k) for k in ('id','commit_ref','state','context','branch','created_at')}
worker=(out.parents[1]/'pwa-sw.js').read_bytes();worker_sha1=hashlib.sha1(worker).hexdigest()
def one(pair):
 label,site=pair;known={d['id'] for d in json.loads((prior/(label+'-available-history.json')).read_text())['deploys']}
 rows=get('/sites/'+site+'/deploys?per_page=100&page=1')
 assert any(d['id'] in known for d in rows),'Delta does not reach prior history; cannot establish boundary'
 current=get('/sites/'+site)['published_deploy'];new=[]
 for d in rows:
  if d['id'] in known:continue
  row=safe(d)
  if d['state']=='ready':
   files=get('/deploys/'+d['id']+'/files');matches=[f for f in files if f['path']=='/pwa-sw.js'];assert len(matches)==1,(label,d['id'])
   row['worker_sha1']=matches[0]['sha'];assert row['worker_sha1']==worker_sha1,'Unresolved newer worker; do not allocate157'
   row['cache']=156
  new.append(row)
 return label,{'site':site,'published':safe(current),'new_records':new,'prior_high':156,'high':156,'delta_reaches_known_history':True}
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:sites=dict(pool.map(one,{'veteranbridge':'e8e39892-d7d1-47c0-b23a-847ed01120b8','clone':'21f00a70-f6c6-45d5-bba5-6823e6bd9434'}.items()))
with urllib.request.urlopen(urllib.request.Request('https://transitionops.org/pwa-sw.js',headers={'Cache-Control':'no-cache'}),timeout=20) as r:public=r.read()
assert public==worker,'Production worker drift'
result={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'prior_ledger':str(prior/'cache-ledger.json'),'post_release':str(prior/'post-release/README.md'),'sites':sites,'active_worker_sha256':hashlib.sha256(worker).hexdigest(),'public_production_matches':True,'highest_evidenced':156,'candidate_allocation':157,'conflicting_served_use':False,'limits':'Available history delta joined to prior completed inventory. Deleted/unreturned history not observable. Old v157 emergency patch is unapplied and was not reserved; never apply it after a different v157 worker ships. Recheck before hosted handoff.'}
(out/'cache-ledger.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
