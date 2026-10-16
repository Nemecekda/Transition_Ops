# Documents context return - review diff

Review-only diff. Whitespace-only context lines are normalized for transport; the counted edit scripts record exact changes.

```diff
diff --git a/index.html b/index.html
index 0abc71c..4735b77 100644
--- a/index.html
+++ b/index.html
@@ -6229,7 +6229,7 @@ function DocumentChecklist(props) {
       d.id === "d8" && React.createElement("a", { id: "tops-vgli-document-source", href: "https://www.va.gov/life-insurance/options-eligibility/vgli/", target: "_blank", rel: "noopener noreferrer", style: { display: "inline-flex", alignItems: "center", minHeight: 44, maxWidth: "100%", boxSizing: "border-box", padding: "8px 0", color: C.greenBright, fontSize: 14, textDecoration: "underline", lineHeight: 1.5 } }, "VA VGLI eligibility and application guidance (opens a new tab)"));
   }
   return React.createElement("section", { "aria-label": "Document checklist", id: "tops-document-checklist" },
-    props.readinessReturn || React.createElement("button", { id: "tops-documents-back", type: "button", onClick: props.back, style: { minHeight: 44, padding: "10px 14px", marginBottom: 12, background: C.bgCard, color: C.textPrimary, border: "1px solid " + C.border, borderRadius: 8, font: "inherit", cursor: "pointer" } }, "Back to My Plan"),
+    props.readinessReturn || React.createElement("button", { id: "tops-documents-back", type: "button", onClick: props.back, style: { minHeight: 44, padding: "10px 14px", marginBottom: 12, background: C.bgCard, color: C.textPrimary, border: "1px solid " + C.border, borderRadius: 8, font: "inherit", cursor: "pointer" } }, props.backLabel || "Open My Plan"),
     React.createElement("div", { style: { marginBottom: 16 } },
       React.createElement("h3", { id: "tops-plan-documents", tabIndex: -1, style: { fontSize: 20, margin: "0 0 8px", color: C.textPrimary } }, "Your checklist"),
       React.createElement("p", { style: { margin: "0 0 10px", fontSize: 16, lineHeight: 1.5, color: C.textBody } }, "Mark the documents you have. You do not upload documents here."),
@@ -8814,6 +8814,8 @@ function PlanBackup(props) {

 const TOPS_TOOL_ROUTES = ["dashboard","vamath","vapay","pathway","resources","taxes","timeline","critical","reminders","readiness","vethub","dd214","finalpcs","navigator"];
 const TOPS_DOCUMENT_RETURN_TOPICS = ["directory", "vsos", "tap", "mindset", "leadership", "spouse", "perks", "skillbridge", "healthcare"];
+const TOPS_DOCUMENT_RETURNS = { plan: "Back to My Plan", home: "Back to Home", "home-documents": "Back to Home", "home-continue": "Back to Home", wisconsin: "Back to Wisconsin guide", directory: "Back to all resources", vsos: "Back to claims help and veteran organizations", tap: "Back to transition assistance programs", mindset: "Back to mindset and adjustment", leadership: "Back to leadership and communication", spouse: "Back to military spouse resources", perks: "Back to veteran discounts and perks", skillbridge: "Back to SkillBridge", healthcare: "Back to Healthcare" };
+function topsDocumentReturnKey(value) { return typeof value === "string" && Object.prototype.hasOwnProperty.call(TOPS_DOCUMENT_RETURNS, value) ? value : ""; }
 function topsIsDocumentURL(href) {
   try { var q = new URL(href).searchParams; return q.getAll("tool").length === 1 && q.get("tool") === "resources" && q.getAll("view").length === 1 && q.get("view") === "documents" && !q.has("guide"); } catch (error) { return false; }
 }
@@ -9281,11 +9283,13 @@ function App() {
   const __syncToolURL = useRef(null);
   const __careerHistory = useRef(null);
   const __planHistory = useRef(null);
+  const documentReturn = useRef(topsIsDocumentURL(window.location.href) ? topsDocumentReturnKey(history.state && history.state.documentReturn) : "");
   const __documentHistory = useRef(null);
   __documentHistory.current = { active: activeTab === "resources" && subTab === "documents", overlay: showMoreMenu || feedbackOpen || aboutOpen || whatsNewOpen || policyPanelOpen || showNotifPanel, restore: function() {
     var url = new URL(window.location.href), tool = url.searchParams.get("tool"), state = history.state || {};
     if (TOPS_TOOL_ROUTES.indexOf(tool) === -1) tool = "dashboard";
     var docs = topsIsDocumentURL(url.href);
+    documentReturn.current = docs ? topsDocumentReturnKey(state.documentReturn) : "";
     wiGuideRequested.current = tool === "resources" && topsIsWisconsinGuideURL(url.href);
     if (tool === "resources") setSubTab(docs ? "documents" : wiGuideRequested.current ? "directory" : TOPS_DOCUMENT_RETURN_TOPICS.includes(state.documentParentTopic) ? state.documentParentTopic : "vsos");
     if (tool === "timeline") { setPlanView(state.planView === "timeline" ? "timeline" : "hub"); setSelectedMilestone(null); }
@@ -9344,7 +9348,7 @@ function App() {
       __histSkipSync.current = false;
     }
     __histDepth.current = depth;
-    if (__histSuppress.current === 0) { try { var state = Object.assign({}, history.state); if (__documentEntryBase.current) { state.documentEntryBase = true; state.tops = depth; } else delete state.documentEntryBase; if (activeTab === "pathway") { state.careerView = careerScreen; state.careerStage = careerStage; } else { delete state.careerView; delete state.careerStage; } if (activeTab === "timeline") state.planView = planView; else delete state.planView; if (activeTab === "resources" && TOPS_DOCUMENT_RETURN_TOPICS.includes(subTab)) state.documentParentTopic = subTab; else delete state.documentParentTopic; history.replaceState(state, ""); } catch (e) {} __syncToolURL.current(); }
+    if (__histSuppress.current === 0) { try { var state = Object.assign({}, history.state); if (__documentEntryBase.current) { state.documentEntryBase = true; state.tops = depth; } else delete state.documentEntryBase; if (activeTab === "pathway") { state.careerView = careerScreen; state.careerStage = careerStage; } else { delete state.careerView; delete state.careerStage; } if (activeTab === "timeline") state.planView = planView; else delete state.planView; if (activeTab === "resources" && TOPS_DOCUMENT_RETURN_TOPICS.includes(subTab)) state.documentParentTopic = subTab; else delete state.documentParentTopic; if (activeTab === "resources" && subTab === "documents" && topsDocumentReturnKey(documentReturn.current)) state.documentReturn = documentReturn.current; else delete state.documentReturn; history.replaceState(state, ""); } catch (e) {} __syncToolURL.current(); }
   }, [showOnboarding, onboardStep, activeTab, subTab, planView, selectedMilestone, journeyTarget, pathwayMode, careerScreen, careerStage, showMoreMenu, feedbackOpen, aboutOpen, whatsNewOpen, policyPanelOpen, showNotifPanel, __histRevision]);
   useEffect(function() {
     var onPop = function() {
@@ -9449,7 +9453,10 @@ function App() {
     continuationFocus.current = target;
     continuationReturn.current = invoker;
     if (tab === "timeline") { setPlanView("timeline"); setSelectedMilestone(milestoneId || null); setContinuationRevision(function(value) { return value + 1; }); }
-    if (tab === "resources") { wiGuideRequested.current = false; setSubTab("documents"); setContinuationRevision(function(value) { return value + 1; }); }
+    if (tab === "resources") {
+      documentReturn.current = activeTab === "resources" && TOPS_DOCUMENT_RETURN_TOPICS.includes(subTab) ? subTab === "directory" && wiGuideRequested.current ? "wisconsin" : subTab : activeTab === "dashboard" ? invoker === "tops-home-documents" ? "home-documents" : invoker === "tops-continue-documents" ? "home-continue" : "home" : activeTab === "timeline" ? "plan" : "";
+      wiGuideRequested.current = false; setSubTab("documents"); setContinuationRevision(function(value) { return value + 1; });
+    }
     if (tab === "reminders") {
       setReminderTimedOnly(false);
       var focusedId = target.slice("tops-reminder-".length);
@@ -9463,6 +9470,25 @@ function App() {
     }
     setActiveTab(tab);
   }
+  function returnFromDocuments() {
+    var key = topsDocumentReturnKey(documentReturn.current);
+    continuationReturn.current = null;
+    if (TOPS_DOCUMENT_RETURN_TOPICS.includes(key) || key === "wisconsin") {
+      wiGuideRequested.current = key === "wisconsin";
+      setSubTab(key === "wisconsin" ? "directory" : key);
+      continuationFocus.current = key === "wisconsin" ? "tops-wi-work-support-resources-heading" : "tops-resource-topic";
+      setActiveTab("resources");
+    } else if (["home", "home-documents", "home-continue"].includes(key)) {
+      if (key === "home-documents") setDashMoreOpen(true);
+      continuationFocus.current = key === "home-documents" ? "tops-home-documents" : key === "home-continue" ? "tops-continue-documents" : "tops-page-title";
+      setActiveTab("dashboard");
+    } else {
+      setPlanView("hub"); setSelectedMilestone(null);
+      continuationFocus.current = "tops-plan-shortcut-resources";
+      setActiveTab("timeline");
+    }
+    setContinuationRevision(function(value) { return value + 1; });
+  }
   function openTimedReminderReview(hasDate) {
     setReminderTimedOnly(!!hasDate);
     setFocusedReminderId(null);
@@ -9539,6 +9565,7 @@ function App() {
     continuationFocus.current = null;
     readinessToolFocus.current = tool.target;
     setReadinessReturn({ item: item, category: category, tab: tool.tab, subTab: tool.subTab || null });
+    if (tool.subTab === "documents") documentReturn.current = "";
     if (tool.subTab) setSubTab(tool.subTab);
     setActiveTab(tool.tab);
   }
@@ -17445,7 +17472,7 @@ whatsNewUnseen && React.createElement("details", { style: { marginBottom: 12 } }
       lineHeight: 1.8,
       fontFamily: "'Source Sans 3', sans-serif"
     }
-  }, /*#__PURE__*/React.createElement("div", null, "\u25CF", " TAMP (service-determined eligibility): 180 days of premium-free TRICARE; plan enrollment requirements apply"), /*#__PURE__*/React.createElement("div", null, "\u25CF", " Must ACTIVELY enroll in VA healthcare"), /*#__PURE__*/React.createElement("div", null, "\u25CF", " Combat vets: 10-year enhanced eligibility"), /*#__PURE__*/React.createElement("div", null, "\u25CF", " CHCBP if eligible: apply within 60 days of losing regular TRICARE or TAMP"), /*#__PURE__*/React.createElement("div", null, "\u25CF", " VA dental limited — apply within 180 days of separation for one-time care")))), subTab === "documents" && React.createElement(DocumentChecklist, { colors: C, documents: documents, toggle: toggleDoc, saveStatus: documentSaveStatus, readinessReturn: renderReadinessReturn("a6"), back: function() { setPlanView("hub"); setSelectedMilestone(null); continuationFocus.current = "tops-plan-shortcut-resources"; continuationReturn.current = null; setContinuationRevision(function(value) { return value + 1; }); setActiveTab("timeline"); } })), activeTab === "taxes" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
+  }, /*#__PURE__*/React.createElement("div", null, "\u25CF", " TAMP (service-determined eligibility): 180 days of premium-free TRICARE; plan enrollment requirements apply"), /*#__PURE__*/React.createElement("div", null, "\u25CF", " Must ACTIVELY enroll in VA healthcare"), /*#__PURE__*/React.createElement("div", null, "\u25CF", " Combat vets: 10-year enhanced eligibility"), /*#__PURE__*/React.createElement("div", null, "\u25CF", " CHCBP if eligible: apply within 60 days of losing regular TRICARE or TAMP"), /*#__PURE__*/React.createElement("div", null, "\u25CF", " VA dental limited — apply within 180 days of separation for one-time care")))), subTab === "documents" && React.createElement(DocumentChecklist, { colors: C, documents: documents, toggle: toggleDoc, saveStatus: documentSaveStatus, readinessReturn: renderReadinessReturn("a6"), backLabel: TOPS_DOCUMENT_RETURNS[topsDocumentReturnKey(documentReturn.current)] || "Open My Plan", back: returnFromDocuments })), activeTab === "taxes" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
     style: S.card
   }, /*#__PURE__*/React.createElement("div", {
     style: S.cardTitle
diff --git a/pwa-sw.js b/pwa-sw.js
index 3adae85..d9fb208 100644
--- a/pwa-sw.js
+++ b/pwa-sw.js
@@ -1,4 +1,4 @@
-const CACHE_NAME = "transition-ops-v288";
+const CACHE_NAME = "transition-ops-v289";
 const CACHE_PREFIX = "transition-ops-v";
 const NETWORK_TIMEOUT_MS = 3500;

diff --git a/scripts/readiness-tool-return-browser-regression.js b/scripts/readiness-tool-return-browser-regression.js
index 39268d1..cd3a1ca 100644
--- a/scripts/readiness-tool-return-browser-regression.js
+++ b/scripts/readiness-tool-return-browser-regression.js
@@ -24,7 +24,7 @@ const server=http.createServer((req,res)=>{const p=path.join(root,req.url.split(
  const original=await snapshot();
  for(const [id,cat,target] of routes){await launch(id,cat);await wait('document.activeElement.id==='+JSON.stringify(target));assert.ok(await ev('!!document.getElementById("tops-readiness-return")'));assert.equal(await snapshot(),original);if(id==='a2'||id==='a3')assert.ok(await ev('document.getElementById('+JSON.stringify(target)+').closest("details").open'));await click('Back to transition checklist');await wait('document.activeElement.id==="tops-readiness-tool-'+id+'"');assert.equal(await ev('document.getElementById("tops-readiness-category-'+cat+'").getAttribute("aria-expanded")'),'true');assert.equal(await snapshot(),original);assert.equal(await ev('document.getElementById("tops-readiness-tool-'+id+'").closest("[role=checkbox]")'),null);}
  // Leaving through normal navigation discards the return link, including same resources subtab.
- await launch('w2','wellness');await wait('!!document.getElementById("tops-readiness-return")');await ev('(()=>{const n=document.getElementById("tops-resource-topic");n.value="documents";n.dispatchEvent(new Event("change",{bubbles:true}))})()');await wait('!document.getElementById("tops-readiness-return")');await ev('(()=>{const n=document.getElementById("tops-resource-topic");n.value="healthcare";n.dispatchEvent(new Event("change",{bubbles:true}))})()');assert.equal(await ev('!!document.getElementById("tops-readiness-return")'),false);await load();
+ await launch('w2','wellness');await wait('!!document.getElementById("tops-readiness-return")');await ev('(()=>{const n=document.getElementById("tops-resource-topic");n.value="documents";n.dispatchEvent(new Event("change",{bubbles:true}))})()');await wait('!document.getElementById("tops-readiness-return")');await click("Back to Healthcare");await wait('document.getElementById("tops-resource-topic")?.value==="healthcare"');assert.equal(await ev('!!document.getElementById("tops-readiness-return")'),false);await load();
  await launch('a2','admin');await ev('Array.from(document.querySelectorAll(".bottom-nav button")).find(n=>n.querySelector(".nav-label").textContent==="Home").click()');await wait('!!document.getElementById("tops-loop-title")');assert.equal(await ev('!!document.getElementById("tops-readiness-return")'),false);await load();
  // Service profile does not gate these member-chosen tools or change answers.
  for(const profile of ['','active','guard','separated','retired']){await ev('localStorage.setItem("tops_status",'+JSON.stringify(profile)+')');await load();await launch('h5','housing');await wait('!!document.getElementById("tops-readiness-return")');await click('Back to transition checklist');await wait('document.activeElement.id==="tops-readiness-tool-h5"');}
```
