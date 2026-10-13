const fs=require('fs'),path=require('path'),cp=require('child_process'),os=require('os');
const root='/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops';process.chdir(root);
const report=[];const log=x=>{report.push(x);console.log(x)};
const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'career-gate-'));
const status=cp.execFileSync('git',['status','--porcelain'],{encoding:'utf8'});log('MODE EDIT\n'+status);
const s=fs.readFileSync('index.html','utf8');let n=0;
for(const m of s.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
 if(/\bsrc\s*=/.test(m[1]))continue;n++;
 const start=s.slice(0,m.index).split('\n').length,end=start+m[0].split('\n').length-1;
 const json=/application\/ld\+json/.test(m[1]);const file=path.join(scratch,`block${n}.${json?'json':'js'}`);fs.writeFileSync(file,m[2]);
 if(json)JSON.parse(m[2]);else cp.execFileSync(process.execPath,['--check',file],{stdio:'pipe'});
 log(`INLINE ${json?'JSON':'JS'} ${start}-${end} ${Buffer.byteLength(m[2])} bytes PASS`);
}
const tracked=cp.execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean).concat(cp.execFileSync('git',['ls-files','--others','--exclude-standard','-z'],{encoding:'utf8'}).split('\0').filter(Boolean));
for(const ext of ['js','mjs','cjs','json']){const files=tracked.filter(f=>f.endsWith('.'+ext));log(`${ext.toUpperCase()} INVENTORY ${files.length}`);for(const f of files){if(ext==='json')JSON.parse(fs.readFileSync(f));else cp.execFileSync(process.execPath,['--check',f],{stdio:'pipe'});log(`${ext.toUpperCase()} ${f} ${fs.statSync(f).size} bytes PASS`);}}
const yaml=tracked.filter(f=>/\.ya?ml$/.test(f));const ruby='ARGV.each{|f| docs=YAML.parse_stream(File.read(f)); puts "YAML INVENTORY #{f} #{File.size(f)} bytes #{docs.children.length} documents"}';log(cp.execFileSync('ruby',['-ryaml','-e',ruby,...yaml],{encoding:'utf8'}).trim());
const diff=cp.execFileSync('git',['diff','-U0'],{encoding:'utf8'});const bad=diff.split('\n').filter(x=>x.startsWith('+')&&!x.startsWith('+++')&&/[\u2018\u2019\u201c\u201d\u00a0]/.test(x));if(bad.length)throw Error('ENCODING FAIL '+bad.join('\n'));log('ENCODING added curly quotes and NBSP: 0 PASS');
for(const [label,fragment,expected] of [['search state','const [homeSearchSelection, setHomeSearchSelection]',1],['search opener','function openHomeSearchResult(',1],['exact reminder','act: "reminder", id: r.id',1],['exact window','act: "window", id: w.id',1],['result return','id: "tops-search-back"',1],['critical context','id: "tops-search-critical-context"',1],['old generic reminder search','act: "tab", tab: "reminders" });',0],['old generic window search','act: "tab", tab: "critical" });',0]]){const actual=s.split(fragment).length-1;if(actual!==expected)throw Error(label+': '+actual+' expected '+expected);log(`PRESENCE ${label} expected=${expected} actual=${actual} PASS`);}
cp.execFileSync('git',['diff','--check']);log('DIFF whitespace PASS');log(cp.execFileSync('git',['diff','--stat'],{encoding:'utf8'}).trim());log('4S N/A: no workflow changes. 4B N/A: no public builder boundary changes. 4N N/A: no Functions, config, package, dependency or public-build boundary change.');
fs.writeFileSync('/tmp/search-structural-gate.txt',report.join('\n')+'\n');log('STRUCTURAL GATE PASS; full inventory /tmp/search-structural-gate.txt');
