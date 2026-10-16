const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),os=require('node:os'),assert=require('node:assert/strict');
const root='/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops';process.chdir(root);
const git=(...args)=>cp.execFileSync('git',args,{encoding:'utf8'});
const status=git('status','--porcelain');assert.ok(status);console.log('MODE EDIT\n'+status);
const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'tops-doc-context-parse-'));
const source=fs.readFileSync('index.html','utf8');let count=0;
for(const m of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
 if(/\bsrc\s*=/.test(m[1]))continue;count++;const json=/application\/ld\+json/.test(m[1]);const target=path.join(scratch,'block'+count+(json?'.json':'.js'));fs.writeFileSync(target,m[2]);
 if(json)JSON.parse(m[2]);else cp.execFileSync(process.execPath,['--check',target]);
 const line=source.slice(0,m.index).split('\n').length;console.log('INLINE',count,json?'JSON':'JS','lines',line+'-'+(line+m[0].split('\n').length-1),'bytes',Buffer.byteLength(m[2]),'PASS');
}
const tracked=git('ls-files','-z').split('\0').filter(Boolean),untracked=git('ls-files','--others','--exclude-standard','-z').split('\0').filter(Boolean);
assert.ok(untracked.every(p=>p==='scripts/document-context-return-browser-regression.js'||p.startsWith('intel/document-context-return-20261014/')),'unexpected untracked work');
const files=[...new Set([...tracked,...untracked])];
for(const ext of ['js','mjs','cjs','json']){const selected=files.filter(f=>f.endsWith('.'+ext));console.log(ext.toUpperCase(),'INVENTORY',selected.length);for(const f of selected){if(ext==='json')JSON.parse(fs.readFileSync(f));else cp.execFileSync(process.execPath,['--check',f],{stdio:'pipe'});console.log(ext.toUpperCase(),f,fs.statSync(f).size,'bytes PASS');}}
const yaml=files.filter(f=>/\.ya?ml$/.test(f));console.log(cp.execFileSync('ruby',['-ryaml','-e','ARGV.each{|f| d=YAML.parse_stream(File.read(f));puts "YAML #{f} #{File.size(f)} bytes #{d.children.length} documents PASS"}',...yaml],{encoding:'utf8'}));
const bad=/[\u2018\u2019\u201c\u201d\u00a0]/;
for(const line of git('diff','HEAD','-U0').split('\n').filter(l=>l.startsWith('+')&&!l.startsWith('+++')))assert.equal(bad.test(line),false,'added encoding');
for(const file of untracked.filter(f=>/\.(md|txt|js|cjs|mjs|json|py|log)$/.test(f)))assert.equal(bad.test(fs.readFileSync(file,'utf8')),false,'new-file encoding '+file);
console.log('ENCODING added curly quotes and NBSP0 PASS');
for(const [label,text,expected] of [['closed return validator','function topsDocumentReturnKey(value)',1],['return adapter','function returnFromDocuments()',1],['dynamic fixed label','props.backLabel || "Open My Plan"',1],['readiness stale key clear','if (tool.subTab === "documents") documentReturn.current = "";',1],['mixed-origin directory guard','subTab === "directory" && wiGuideRequested.current ? "wisconsin" : subTab',1],['push off','const TOPS_PUSH_ENABLED = false;',1]]){const actual=source.split(text).length-1;assert.equal(actual,expected,label);console.log('PRESENCE',label,'expect',expected,'actual',actual,'PASS');}
assert.equal(fs.readFileSync('pwa-sw.js','utf8').split('const CACHE_NAME = "transition-ops-v289";').length-1,1);console.log('CACHE one declaration288→289 PASS');
const before=cp.execFileSync('git',['show','HEAD:index.html'],{encoding:'utf8',maxBuffer:8*1024*1024});const data=s=>s.match(/const DOCUMENT_VAULT = [\s\S]*?\n\];/)[0];assert.equal(data(source),data(before));console.log('DOCUMENT_VAULT source data byte-identical PASS');
git('diff','--check');console.log('DIFF whitespace PASS');console.log(git('diff','--stat'));console.log('4S/4B/4N N/A: no workflow, public-builder, package, function or config changes.');
console.log('STRUCTURAL GATE PASS');
