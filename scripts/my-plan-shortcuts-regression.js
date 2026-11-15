'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const s=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const a=s.indexOf('  React.createElement("nav", { "aria-label": "My Plan tools"');
const b=s.indexOf('  ), /*#__PURE__*/React.createElement("div", {',a)+3;
const route=s.slice(s.indexOf('  function openPlanRoute('),s.indexOf('  useEffect(function() {\n    var id = continuationFocus.current'));
// openPlanRoute now records where Documents was opened from. The shortcuts under test render on My Plan,
// so the sandbox supplies that screen's state and the app's own list of document return topics.
const topicsSource=(s.match(/const TOPS_DOCUMENT_RETURN_TOPICS = \[[^\]]*\];/)||[])[0];assert.ok(topicsSource,'document return topics constant found');
const c={C:{},continuationFocus:{current:null},continuationReturn:{current:null},documentReturn:{current:null},wiGuideRequested:{current:false},activeTab:'timeline',subTab:'',TOPS_DOCUMENT_RETURN_TOPICS:vm.runInNewContext(topicsSource+';TOPS_DOCUMENT_RETURN_TOPICS'),React:{createElement:(type,props,...children)=>({type,props,children:children.flat()})}};
for(const key of ['PlanView','ReminderTimedOnly','ActiveTab','SubTab','SelectedMilestone','FocusedReminderId','ReminderNotice','ReminderFilterPri','ReminderFilterCat','ShowDismissed','ReminderExpanded']) c['set'+key]=value=>c[key]=value;
c.revision=0;c.setContinuationRevision=fn=>c.revision=fn(c.revision);
vm.createContext(c);vm.runInContext(route,c);const tree=vm.runInContext(s.slice(a,b),c);
assert.equal(tree.type,'nav');assert.equal(tree.props['aria-label'],'My Plan tools');assert.equal(tree.props.style.flexWrap,'wrap');
assert.equal(tree.children.map(n=>n.children[0]).join('|'),'Reminders & follow-ups|Documents|Transition checklist');
for(const [i,tab,target] of [[0,'reminders','tops-plan-reminders'],[1,'resources','tops-plan-documents'],[2,'readiness','tops-plan-readiness']]){
 const button=tree.children[i];assert.equal(button.type,'button');assert.equal(button.props.type,'button');assert.equal(button.props.style.minHeight,44);assert.equal(button.props.style.minWidth,44);button.props.onClick();assert.equal(c.ActiveTab,tab);assert.equal(c.continuationFocus.current,target);assert.equal(c.continuationReturn.current,'tops-plan-shortcut-'+tab);
}
assert.equal(c.ReminderTimedOnly,false);assert.equal(c.SubTab,'documents');assert.equal(c.FocusedReminderId,null);assert.equal(c.ReminderExpanded,null);assert.equal(c.ReminderFilterPri,'ALL');assert.equal(c.ReminderFilterCat,'ALL');assert.equal(c.ShowDismissed,false);
assert.equal(c.revision,1,'Documents shortcut refreshes focus exactly once; the other two shortcuts do not');assert.equal(c.documentReturn.current,'plan','Documents opened from My Plan returns to My Plan');
c.openPlanRoute('reminders','tops-reminder-bdd','tops-home-follow-bdd');assert.equal(c.FocusedReminderId,'bdd');assert.equal(c.ReminderExpanded,'bdd');assert.equal(c.continuationFocus.current,'tops-focused-title');
c.openPlanRoute('timeline','tops-plan-timeline','tops-home-timeline');tree.children[0].props.onClick();assert.equal(c.FocusedReminderId,null);assert.equal(c.ReminderExpanded,null);assert.equal(c.continuationFocus.current,'tops-plan-reminders');
c.openPlanRoute('timeline','tops-plan-timeline','tops-home-timeline');assert.equal(c.PlanView,'timeline');assert.equal(c.SelectedMilestone,null);assert.equal(c.revision,3,'one Documents refresh plus one per timeline route');assert.equal(c.continuationFocus.current,'tops-plan-timeline');
assert.equal((s.match(/id: "tops-plan-reminders"/g)||[]).length,1);
assert.ok(s.includes('id: "tops-plan-reminders", tabIndex: -1'));
assert.ok(!s.slice(a,b).includes('__safeSet'));assert.ok(!s.slice(a,b).includes('setSeparationDate'));
console.log('MY PLAN SHORTCUTS PASS: three named native buttons; wrapping 44px controls; exact existing destinations/focus targets; Documents subtab; reminders list reset; Home focused reminder preserved; no date/profile/progress/storage mutation');
