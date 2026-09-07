from pathlib import Path
from html.parser import HTMLParser
import hashlib,json,re,pdfplumber
root=Path('/tmp/tops-federal-resume-readiness/scratchpad/federal-hosted-7c79057')
class Paragraphs(HTMLParser):
    def __init__(self): super().__init__(); self.items=[]; self.current=None
    def handle_starttag(self,tag,attrs):
        if tag=='p': self.current=''
    def handle_data(self,data):
        if self.current is not None: self.current+=data
    def handle_endtag(self,tag):
        if tag=='p': self.items.append(self.current); self.current=None
raw=(root/'artifact/Federal_Resume_Draft.doc').read_bytes()
assert raw.startswith(b'\xef\xbb\xbf<html')
p=Paragraphs(); p.feed(raw.decode('utf-8-sig'))
released=json.loads((root/'released-draft.json').read_text())
assert p.items==[s for s in released['lines'] if s.strip()], 'downloaded paragraph sequence differs from visible draft'
trace=released['trace']; assert len(trace)==30
facts=json.loads((root/'facts.json').read_text())['fact_sheet']
blocks=re.split(r'^ROLE \d+\n',facts,flags=re.M)[1:]
assert len(blocks)==6
role_texts=[]
for i,block in enumerate(blocks):
    def value(label):
        match=re.search(r'^'+re.escape(label)+r': (.+)$',block,re.M)
        assert match,label
        return match[1]
    title=value('JOB TITLE (EXACT)'); employer=value('EMPLOYER OR UNIT (EXACT)')
    location=value('LOCATION (EXACT OR MISSING)'); dates=value('DATES (EXACT OR MISSING)')
    duties=[value('DUTY ATOM 1 (EXACT)'),value('DUTY ATOM 2 (EXACT)')]
    expected=[title+' - '+employer,location+' | '+dates+' | [Hours per week: __]',*duties]
    owned=['F'+str(i*6+j) for j in range(1,7)]
    references=[owned[:2],owned[2:4],[owned[4]],[owned[5]]]
    for j,(claim,refs) in enumerate(zip(expected,references)):
        actual=trace[1+i*4+j]
        assert actual['claim']==claim
        assert actual['refs']=='Confirmed facts: '+', '.join(refs)
        assert claim in p.items
    role_texts.append(expected)
assert trace[0]['refs']=='Confirmed facts: F1, F2, F5, F6, F7, F8, F11, F12'
expected_summary='Operations Lead at North Test Depot with experience reviewing equipment records and preparing monthly inventory summaries. Planning Analyst at East Test Office with experience tracking work orders and maintaining project schedules.'
assert trace[0]['claim']==expected_summary
exact_global=re.findall(r'^(?:EDUCATION ITEM|CERTIFICATION ITEM) \d+ \(EXACT\): (.+)$',facts,re.M)
assert len(exact_global)==5
for i,value in enumerate(exact_global):
    assert trace[25+i]=={'claim':value,'refs':'Confirmed facts: F'+str(37+i)}
    assert value in p.items
assert not re.search(r'Workday|Qualified Program Analyst|26 years|TIP:|HONEST GAPS','\n'.join(p.items))
normalize=lambda s: re.sub(r'\s+',' ',s).strip()
with pdfplumber.open(root/'artifact/Federal_Resume_Draft.pdf') as pdf:
    assert len(pdf.pages)==2
    pages=[page.extract_text() for page in pdf.pages]
    assert normalize('\n'.join(pages))==normalize('\n'.join(p.items)), 'renderer lost or changed content'
    for i,lines in enumerate(role_texts):
        assert any(all(normalize(line) in normalize(page) for line in lines) for page in pages),'split role '+str(i+1)
    for page in pdf.pages:
        assert all(c['x0']>=0 and c['x1']<=page.width and c['top']>=0 and c['bottom']<=page.height for c in page.chars),'text outside page'
    sizes=[{'width_points':page.width,'height_points':page.height} for page in pdf.pages]
result={'filename':'Federal_Resume_Draft.doc','extension':'.doc','declared_mime':'application/msword','mime_evidence':'index.html:8426 in exact deployed commit; declaration, not captured network telemetry','actual_signature':'UTF-8 BOM followed by HTML; not native DOCX or binary DOC','bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest(),'renderer':'LibreOfficeDev 26.8.0.0.alpha0 Writer/Web PDF export','pages':2,'page_sizes':sizes,'visible_draft_matches_download':True,'renderer_text_matches_download':True,'trace_claims_checked':30,'roles_intact_on_single_pages':6,'education_entries':3,'certifications':2,'visual_review':'Both pages inspected; no clipping, overlap, hidden content or orphaned role structure; page 2 begins at role 6 and ends after final certification','phone':'PENDING','microsoft_word_app':'NOT TESTED','provider_calls':'UNVERIFIED'}
(root/'artifact-verification.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
