'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const start=source.indexOf('// ═══════════ BOTTOM NAVIGATION BAR');const end=source.indexOf('  !window.__IS_IFRAME && TOPS_PUSH_ENABLED',start);const code=source.slice(source.indexOf('  /*#__PURE__*/React.createElement',start),end).trim().replace(/,$/,'');
function render(route,menu=false){const ctx={activeTab:route,showMoreMenu:menu,primaryNavFocus:{current:false},C:{},TIcon:()=>null,React:{createElement:(type,props,...children)=>({type,props:props||{},children:children.flat(Infinity)})},setShowMoreMenu:v=>ctx.showMoreMenu=v,setActiveTab:v=>ctx.activeTab=v,setSelectedMilestone:()=>{}};vm.createContext(ctx);const tree=vm.runInContext(code,ctx);return{ctx,buttons:tree.children};}
const expected={dashboard:'Home',timeline:'My Plan',reminders:'My Plan',readiness:'My Plan',dd214:'My Plan',pathway:'Career',vethub:'Career',critical:'Benefits',vamath:'Benefits',vapay:'Benefits',resources:'Benefits',taxes:'Benefits',finalpcs:'More',navigator:'More'};
function name(n){return n.children[1].children[0];}
for(const [route,parent] of Object.entries(expected)){const {buttons}=render(route);assert.deepEqual(buttons.map(name),['Home','My Plan','Career','Benefits','More']);assert.deepEqual(buttons.filter(b=>b.props['aria-current']==='page').map(name),[parent]);}
let {ctx,buttons}=render('dashboard');buttons[1].props.onClick();assert.equal(ctx.activeTab,'timeline');assert.equal(ctx.primaryNavFocus.current,true);buttons[3].props.onClick();assert.equal(ctx.showMoreMenu,'benefits');
({ctx,buttons}=render('dashboard','benefits'));assert.equal(buttons[3].props['aria-expanded'],true);assert.equal(buttons[4].props['aria-expanded'],false);buttons[3].props.onClick();assert.equal(ctx.showMoreMenu,false);
const themeStart=source.indexOf('  const [theme, setTheme] = useState(');const themeEnd=source.indexOf('  const C = THEMES[theme]',themeStart);const theme=source.slice(themeStart,themeEnd);
for(const [stored,want] of [['tactical','tactical'],['professional','professional'],[null,'professional'],['bad','professional']]){const c={window:{__IS_IFRAME:false,__safeGet:()=>stored},useState:fn=>[fn(),()=>{}]};vm.runInNewContext(theme+'this.value=theme;',c);assert.equal(c.value,want);}
assert.ok(!source.includes('C.bg === "#FFFFFF"'));
assert.ok(!source.includes('key: "install-banner-wrapper"'));
assert.ok(!source.includes('renderCaptureCard(),'));
assert.ok(!source.includes('__trackEvent("install_banner_shown"'));
assert.ok(!source.includes('__trackEvent("capture_card_shown"'));
console.log('NAVIGATION REFRESH PASS: all 14 route parents; five labels; real My Plan destination; Benefits open/close state; focus intent; saved dark/light retained; fresh light; no obsolete white checks or auto prompt mount/shown events');
