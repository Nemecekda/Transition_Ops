'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const candidate=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const start=candidate.indexOf('function WisconsinGuideShare(props) {'),end=candidate.indexOf('function StateLocalHelp(props) {',start);assert.ok(start>=0&&end>start);
const code=candidate.slice(start,end),url='https://transitionops.org/wisconsin';
function make(nav={}) {
 let state=[],refs=[],i=0,j=0;
 const blocked=()=>{throw new Error('Unexpected data access or transfer');};
 const ctx={navigator:nav,fetch:blocked,localStorage:new Proxy({},{get:blocked}),location:new Proxy({},{get:blocked}),useState(initial){const idx=i++;if(!(idx in state))state[idx]=initial;return [state[idx],v=>state[idx]=v];},React:{useRef(initial){const idx=j++;return refs[idx]||(refs[idx]={current:initial});},createElement(type,props,...children){return {type,props:props||{},children:children.flat(Infinity)};}}};
 vm.runInNewContext(code+'\nthis.render=WisconsinGuideShare;',ctx);
 function nodes(n){return !n||typeof n!=='object'?[]:[n,...n.children.flatMap(nodes)];}
 const view=()=>{i=0;j=0;return nodes(ctx.render({button:{minHeight:44},field:{width:'100%'}}));};
 const button=()=>view().find(n=>n.type==='button'),status=()=>view().find(n=>n.props.role==='status').children.join('');
 return {view,button,status};
}
(async()=>{
 let payload,copies=[];
 let app=make({share:async value=>{payload=value;},clipboard:{writeText:async v=>copies.push(v)}});
 assert.equal(payload,undefined,'no native share before click');await app.button().props.onClick();
 assert.deepEqual(JSON.parse(JSON.stringify(payload)),{title:'Wisconsin transition guide',text:'Wisconsin transition guide for veterans, Guard/Reserve and families',url});assert.equal(copies.length,0);assert.equal(app.status(),'Share options closed.');
 app=make({share:async()=>{throw Object.assign(new Error('cancel'),{name:'AbortError'});},clipboard:{writeText:async v=>copies.push(v)}});await app.button().props.onClick();assert.equal(app.status(),'Sharing canceled.');assert.equal(copies.length,0,'cancel must not write clipboard');
 app=make({clipboard:{writeText:async v=>copies.push(v)}});await app.button().props.onClick();assert.equal(app.status(),'Link copied.');assert.equal(copies.pop(),url);
 app=make({share:async()=>{throw new Error('unsupported');},clipboard:{writeText:async v=>copies.push(v)}});await app.button().props.onClick();assert.equal(app.status(),'Link copied.');assert.equal(copies.pop(),url);
 for(const nav of [{},{clipboard:{writeText:async()=>{throw new Error('denied');}}}]){
  app=make(nav);await app.button().props.onClick();assert.equal(app.status(),'Select and copy the guide link below.');const input=app.view().find(n=>n.type==='input');assert.equal(input.props.value,url);assert.equal(input.props.readOnly,true);assert.ok(app.view().some(n=>n.type==='label'&&n.props.htmlFor===input.props.id));let selected=false;input.props.onFocus({target:{select(){selected=true;}}});assert.equal(selected,true);
 }
 let resolve,calls=0;app=make({share:()=>{calls++;return new Promise(r=>resolve=r);}});let click=app.button().props.onClick;const pending=click();await click();assert.equal(calls,1);assert.equal(app.button().props.disabled,true);assert.equal(app.status(),'');resolve();await pending;assert.equal(app.button().props.disabled,false);
 const status=app.view().find(n=>n.props.role==='status');assert.equal(status.props['aria-live'],'polite');assert.equal(status.props['aria-atomic'],'true');assert.equal(app.button().props['aria-describedby'],status.props.id);
 assert.match(candidate,/context\.area === "wi" && context\.need === "start" && React\.createElement\(WisconsinGuideShare/);assert.ok(candidate.indexOf('React.createElement(WisconsinGuideShare,')>candidate.indexOf('"Wisconsin starting points"'));assert.ok(candidate.indexOf('React.createElement(WisconsinGuideShare,')<candidate.indexOf('id: "tops-wisconsin-all-states"'));
 console.log('PASS 9 targeted cases: native payload, cancel, clipboard, native error fallback, missing clipboard, denied clipboard, repeat clicks, accessible status, placement. No member state or page URL read.');
})().catch(e=>{console.error(e);process.exit(1);});
