"""Non-runtime arithmetic scenario. Not official VA 2027 rates; never import in app."""
from pathlib import Path
from decimal import Decimal, ROUND_HALF_UP
import re, json, csv, hashlib
ROOT=Path(__file__).resolve().parents[2]
p=ROOT/'index.html'
s=p.read_text(); block=s.split('const VA_PAY_2026 = {',1)[1].split('\n};',1)[0]
# Independently transcribed official VA 2026 table rows, read 2026-10-25.
keys=['alone','sp','sp1p','sp2p','p1','p2','c1','spc1','spc1p1','spc1p2','c1p1','c1p2']
rows={
30:'552.47 617.47 669.47 721.47 604.47 656.47 596.47 666.47 718.47 770.47 648.47 700.47',
40:'795.84 882.84 952.84 1022.84 865.84 935.84 853.84 947.84 1017.84 1087.84 923.84 993.84',
50:'1132.90 1241.90 1329.90 1417.90 1220.90 1308.90 1205.90 1322.90 1410.90 1498.90 1293.90 1381.90',
60:'1435.02 1566.02 1671.02 1776.02 1540.02 1645.02 1523.02 1663.02 1768.02 1873.02 1628.02 1733.02',
70:'1808.45 1961.45 2084.45 2207.45 1931.45 2054.45 1910.45 2074.45 2197.45 2320.45 2033.45 2156.45',
80:'2102.15 2277.15 2417.15 2557.15 2242.15 2382.15 2219.15 2406.15 2546.15 2686.15 2359.15 2499.15',
90:'2362.30 2559.30 2717.30 2875.30 2520.30 2678.30 2494.30 2704.30 2862.30 3020.30 2652.30 2810.30',
100:'3938.58 4158.17 4334.41 4510.65 4114.82 4291.06 4085.43 4318.99 4495.23 4671.47 4261.67 4437.91'}
expected={('flat','10'):Decimal('180.42'),('flat','20'):Decimal('356.66')}
for rating, vals in rows.items():
 for key,val in zip(keys,vals.split()):expected[('base',f'{rating}.{key}')]=Decimal(val)
for group,vals in {'addChild18':'32 43 54 65 76 87 98 109.11','addChildSchool':'105 140 176 211 246 281 317 352.45','spouseAA':'61 81 101 121 141 161 181 201.41'}.items():
 for rating,val in zip(range(30,101,10),vals.split()):expected[(group,str(rating))]=Decimal(val)
actual={}
for group in ['flat','addChild18','addChildSchool','spouseAA']:
 text=re.search(r'\b'+group+r':\s*\{([^}]+)\}',block).group(1)
 for key,val in re.findall(r'(\d+)\s*:\s*([\d.]+)',text):actual[(group,key)]=Decimal(val)
base=block.split('base: {',1)[1].split('\n  },',1)[0]
for rating,body in re.findall(r'(\d+):\s*\{([^}]+)\}',base):
 for key,val in re.findall(r'(\w+)\s*:\s*([\d.]+)',body):actual[('base',rating+'.'+key)]=Decimal(val)
assert actual==expected,[(k,actual.get(k),v) for k,v in expected.items() if actual.get(k)!=v]
assert len(actual)==122
out=Path(__file__).parent
with (out/'UNOFFICIAL-SCENARIO-NOT-VA-RATES.csv').open('w') as f:
 w=csv.writer(f);w.writerow(['status','group','configuration','official_2026_monthly_USD','arithmetic_1_036_scenario_USD','arithmetic_difference_USD'])
 for (group,key),old in actual.items():
  new=(old*Decimal('1.036')).quantize(Decimal('.01'),rounding=ROUND_HALF_UP)
  w.writerow(['UNOFFICIAL ARITHMETIC ONLY - NOT APPROVED FOR APP',group,key,f'{old:.2f}',f'{new:.2f}',f'{new-old:.2f}'])
(out/'baseline-comparison.json').write_text(json.dumps({'checked_date':'2026-10-25','app_file':str(p.relative_to(ROOT)),'app_sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'source':'https://www.va.gov/disability/compensation-rates/veteran-rates/','source_year':2026,'source_effective':'2025-12-01','cells_compared':122,'differences':[],'method':'Decimal exact comparison against independently transcribed official VA table. Scenario multiplies each cell by1.036 and rounds HALF_UP to cents; not an official VA rate calculation.','runtime_changed':False},indent=2)+'\n')
print('122 official baseline cells matched; unofficial scenario staged only.')
