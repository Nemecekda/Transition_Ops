from pathlib import Path
p=Path('/Users/deannemecek/.codex/worktrees/pao-useful-packets/Transition_Ops/index.html');s=p.read_text()
def edit(n,old,new):
 global s
 print('EDIT',n,'OLD:',old,'NEW:',new);assert s.count(old)==1
 s=s.replace(old,new);assert s.count(new)==1;print('new expected1 actual',s.count(new),'old expected',new.count(old),'actual',s.count(old));assert s.count(old)==new.count(old)
# EDIT 17: A fresh direct checklist is its actual single history entry; record only a fixed routing anchor.
edit(17,'const __histDepth = useRef((history.state && history.state.tops) || 0);','''const __histDepth = useRef((history.state && history.state.tops) || 0);
  const __documentEntryBase = useRef(topsIsDocumentURL(window.location.href) && (!history.state || typeof history.state.tops !== "number" || history.state.documentEntryBase === true) ? 2 : 0);''')
# EDIT 18: Offset only that direct-entry UI depth; leaving it starts normal in-app history from its real entry.
edit(18,'if (__histSuppress.current > 0) return;\n    var prev = __histDepth.current;','''if (__histSuppress.current > 0) return;
    if (__documentEntryBase.current && !(activeTab === "resources" && subTab === "documents")) __documentEntryBase.current = 0;
    depth = Math.max(0, depth - __documentEntryBase.current);
    var prev = __histDepth.current;''')
# EDIT 19: Preserve direct-entry anchor for reload and forward, never member data.
edit(19,'var state = Object.assign({}, history.state); if (activeTab === "pathway")','var state = Object.assign({}, history.state); if (__documentEntryBase.current) { state.documentEntryBase = true; state.tops = depth; } else delete state.documentEntryBase; if (activeTab === "pathway")')
# EDIT 20: Re-entering the direct entry restores its own logical offset before React reconciles.
edit(20,'__histSkipSync.current = true;\n      var documentsRoute','__histSkipSync.current = true;\n      __documentEntryBase.current = topsIsDocumentURL(window.location.href) && history.state && history.state.documentEntryBase === true ? 2 : 0;\n      var documentsRoute')
p.write_text(s)
