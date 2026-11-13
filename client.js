window.__ModuleLoader__.load({
  id: 'dsh-team-board',
  factory(require) {
    const React = require('react');
    const { useState, useEffect, useMemo, useRef, useCallback } = React;
    const h = React.createElement;

    const PANEL_ID = 'team-kanban';
    const NO_HOOK = () => undefined;
    /** Shown in the page header so it is obvious which bundle the browser loaded. */
    const BUILD = 'b1.6';
    /** Remembered view state: which tab, which filters, how often to refresh. */
    const STORE_KEY = 'dsh.team-kanban.v1';

    // Copy follows the shipped Agent teamwork dictionary so both boards read the same.
    const DICT = {
      zh: {
        panel: '协作任务板',
        subtitle: '共享任务 · 依赖 · 写域冲突',
        refresh: '刷新',
        retry: '重试',
        loading: '正在加载任务板…',
        unavailable: '任务板暂不可用',
        unavailableHint: '这个会话没有 Agent Team 任务投影。若根会话已开启协作，请打开该根会话的对话再回来。',
        failure: '任务记录无效：',
        noSession: '没有打开的会话',
        noSessionHint: '先在左侧打开一个会话，这里会显示它的共享任务。',
        modeOn: '协作已开启',
        modeOff: '协作未开启',
        modeHint: '在根会话的模型菜单里选中「启用智能体团队协作」后，共享任务才会出现。',
        empty: '暂无共享任务，可以通过对话创建',
        todo: '待处理',
        doing: '进行中',
        done: '已完成',
        blocked: '被依赖阻塞',
        owner: '负责人',
        unowned: '未分配',
        dependsOn: '等',
        writeScopes: '写域',
        conflict: '写域冲突',
        tasks: '共享任务',
        blockedCount: '被依赖阻塞',
        rate: '完成率',
        follow: '跟随当前会话',
        allSessions: '全部会话',
        open: '打开',
        acrossHint: '按会话分组；只聚合已加载的会话，其余在你选中时加载。',
        windowNote: '只预加载最近的部分会话，其余选中后再读。',
        noList: '会话列表还没读到，暂时只显示当前会话。',
        debugHint: '点击查看数据诊断',
        search: '搜索任务 / 负责人 / 写域',
        onlyBlocked: '只看被依赖阻塞',
        onlyConflict: '只看写域冲突',
        ownerAll: '全部负责人',
        clearFilter: '清除',
        filtered: '筛选后',
        autoRefresh: '自动刷新',
        autoOff: '不自动',
        auto10: '10 秒',
        auto30: '30 秒',
        detailBlocked: '被以下任务阻塞',
        detailScopes: '写域路径',
        detailWarnings: '写域冲突',
        noMatch: '没有匹配的任务',
        keyHint: '↑↓ 移动 · Enter 展开 · / 搜索 · g 切视图 · r 刷新',
        cardHint: '点卡片展开详情',
        noStore: '读不到会话投影服务，看板暂不可用。',
        crashed: '看板渲染失败',
        crashedHint: '数据里出现了看板无法处理的形态。点重试重新渲染，或先把上面的错误信息反馈出来。',
        members: '子智能体',
        membersRunning: '{n} 进行中',
        membersDone: '{n} 已完成',
        collapse: '收起',
        expand: '展开',
        sessionIdLabel: '会话 id',
        tokensIn: '输入',
        tokensOut: '输出',
        tokensCacheRead: '缓存读',
        tokensCacheWrite: '缓存写',
        memberHint: '点成员行展开 token 明细',
      },
      en: {
        panel: 'Team task board',
        subtitle: 'Shared tasks · dependencies · write scopes',
        refresh: 'Refresh',
        retry: 'Retry',
        loading: 'Loading task board…',
        unavailable: 'Task board is unavailable',
        unavailableHint: 'This session has no Agent Team task projection. If the root session has teamwork on, open that root conversation and come back.',
        failure: 'Invalid task record: ',
        noSession: 'No open session',
        noSessionHint: 'Open a session on the left; its shared tasks appear here.',
        modeOn: 'Team on',
        modeOff: 'Team off',
        modeHint: 'Pick “Enable agent teamwork” in the root session’s model menu to get shared tasks.',
        empty: 'No shared tasks yet. Create them through the conversation.',
        todo: 'Pending',
        doing: 'In progress',
        done: 'Completed',
        blocked: 'Blocked by dependencies',
        owner: 'Owner',
        unowned: 'Unowned',
        dependsOn: 'waits for',
        writeScopes: 'writes',
        conflict: 'Write-scope conflict',
        tasks: 'Shared tasks',
        blockedCount: 'Blocked',
        rate: 'Completion',
        follow: 'Follow current session',
        allSessions: 'All sessions',
        open: 'Open',
        acrossHint: 'Grouped by session; only loaded sessions are aggregated, others load when you select them.',
        windowNote: 'Only the most recent sessions are preloaded; the rest load on selection.',
        noList: 'The session list has not loaded yet; only the current session is shown.',
        debugHint: 'Show data diagnostics',
        search: 'Search tasks, owners, write scopes',
        onlyBlocked: 'Blocked only',
        onlyConflict: 'Conflicts only',
        ownerAll: 'All owners',
        clearFilter: 'Clear',
        filtered: 'Showing',
        autoRefresh: 'Auto refresh',
        autoOff: 'Off',
        auto10: '10 s',
        auto30: '30 s',
        detailBlocked: 'Blocked by',
        detailScopes: 'Write scopes',
        detailWarnings: 'Write conflicts',
        noMatch: 'No matching tasks',
        keyHint: '↑↓ move · Enter expand · / search · g switch view · r refresh',
        cardHint: 'Click a card for details',
        noStore: 'The session projection service is unavailable, so the board cannot load.',
        crashed: 'The board failed to render',
        crashedHint: 'The data held a shape the board could not render. Retry, or report the error above.',
        members: 'Subagents',
        membersRunning: '{n} running',
        membersDone: '{n} completed',
        collapse: 'Hide',
        expand: 'Show',
        sessionIdLabel: 'Session id',
        tokensIn: 'input',
        tokensOut: 'output',
        tokensCacheRead: 'cache read',
        tokensCacheWrite: 'cache write',
        memberHint: 'Click a member for token details',
      },
    };

    function pickLang(ctx) {
      try {
        const svc = ctx && ctx.locale;
        const raw = svc && (typeof svc.language === 'function' ? svc.language() : svc.language);
        if (typeof raw === 'string' && raw) return raw.toLowerCase().startsWith('zh') ? 'zh' : 'en';
      } catch (e) { /* locale service unavailable */ }
      try {
        if (typeof navigator !== 'undefined' && /^zh/i.test(navigator.language || '')) return 'zh';
      } catch (e) { /* no navigator */ }
      return 'en';
    }

    function messageOf(err) {
      if (!err) return 'unknown error';
      if (typeof err === 'string') return err;
      return err.message ? err.message : String(err);
    }

    function arrayOf(value) {
      return Array.isArray(value) ? value : [];
    }

    function readPrefs() {
      try {
        const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(STORE_KEY);
        const parsed = raw ? JSON.parse(raw) : null;
        return parsed && typeof parsed === 'object' ? parsed : {};
      } catch (e) { return {}; }
    }

    function writePrefs(value) {
      try {
        if (typeof localStorage !== 'undefined') localStorage.setItem(STORE_KEY, JSON.stringify(value));
      } catch (e) { /* storage unavailable */ }
    }

    // ---------------------------------------------------------- data helpers ---
    /** Catalog rows name their id either way depending on the snapshot source. */
    function sidOf(row) {
      if (!row) return '';
      return row.sessionId || row.id || '';
    }

    function listSessions(snapshot) {
      if (!snapshot) return [];
      try {
        const candidates = [snapshot.items, snapshot.state && snapshot.state.items];
        for (const rows of candidates) {
          if (Array.isArray(rows)) {
            const kept = rows.filter((row) => row && sidOf(row));
            if (kept.length > 0) return kept;
          }
        }
        if (Array.isArray(snapshot.ids) && snapshot.byId) {
          const kept = snapshot.ids.map((id) => snapshot.byId[id]).filter((row) => row && sidOf(row));
          if (kept.length > 0) return kept;
        }
        if (snapshot.byId && typeof snapshot.byId === 'object') {
          const kept = Object.keys(snapshot.byId).map((id) => snapshot.byId[id]).filter((row) => row && sidOf(row));
          if (kept.length > 0) return kept;
        }
      } catch (e) { /* unknown snapshot shape */ }
      return [];
    }

    function rowOf(snapshot, sessionId) {
      if (!snapshot || !sessionId) return undefined;
      try {
        const table = snapshot.projectionsBySession;
        return table ? table[sessionId] : undefined;
      } catch (e) { return undefined; }
    }

    function countsOf(tasks) {
      const counts = { total: tasks.length, todo: 0, doing: 0, done: 0, blocked: 0 };
      for (const task of tasks) {
        if (task.status === 'completed') counts.done += 1;
        else if (task.status === 'in_progress') counts.doing += 1;
        else {
          counts.todo += 1;
          if (task.ready === false) counts.blocked += 1;
        }
      }
      return counts;
    }

    function countLabel(counts, t) {
      const parts = [];
      if (counts.todo > 0) parts.push(counts.todo + ' ' + t.todo);
      if (counts.doing > 0) parts.push(counts.doing + ' ' + t.doing);
      if (counts.done > 0) parts.push(counts.done + ' ' + t.done);
      return parts.join(' · ');
    }

    function statusLabel(task, t) {
      if (task.status === 'completed') return t.done;
      if (task.status === 'in_progress') return t.doing;
      if (task.ready === false) return t.blocked;
      return t.todo;
    }

    /** Same scale the shipped subagent rows use: 180K tok / 5.1M tok. */
    function formatTokens(value) {
      if (typeof value !== 'number' || !isFinite(value)) return '—';
      const scaled = (next) => (next >= 100 ? String(Math.round(next)) : String(Math.round(next * 10) / 10));
      if (value < 1000) return value + ' tok';
      if (value < 1000000) return scaled(value / 1000) + 'K tok';
      return scaled(value / 1000000) + 'M tok';
    }

    function formatDuration(ms, lang) {
      if (typeof ms !== 'number' || !isFinite(ms) || ms < 0) return '—';
      const totalSeconds = Math.floor(ms / 1000);
      const seconds = totalSeconds % 60;
      const totalMinutes = Math.floor(totalSeconds / 60);
      const minutes = totalMinutes % 60;
      const hours = Math.floor(totalMinutes / 60);
      if (lang === 'zh') {
        if (hours > 0) return hours + '时' + minutes + '分';
        if (totalMinutes > 0) return minutes + '分' + seconds + '秒';
        return seconds + '秒';
      }
      if (hours > 0) return hours + 'h ' + minutes + 'm';
      if (totalMinutes > 0) return minutes + 'm ' + seconds + 's';
      return seconds + 's';
    }

    // ------------------------------------------------------------- hooks ---
    function useCurrentSession(ctx) {
      const [sessionId, setSessionId] = useState(null);
      useEffect(() => {
        const ws = ctx && ctx.uiWorkspace;
        const read = () => {
          let next = null;
          try { next = ws && ws.mainReference ? ws.mainReference.sessionId : null; } catch (e) { next = null; }
          if (!next) {
            try {
              const saved = ws && ws.selection && ws.selection.getSnapshot();
              next = saved ? saved.sessionId : null;
            } catch (e) { next = null; }
          }
          setSessionId(next || null);
        };
        read();
        let dispose = null;
        try {
          if (ws && ws.selection && typeof ws.selection.subscribe === 'function') dispose = ws.selection.subscribe(read);
        } catch (e) { dispose = null; }
        return () => { if (typeof dispose === 'function') { try { dispose(); } catch (e) { /* ignore */ } } };
      }, [ctx]);
      return sessionId;
    }

    function useSessionCatalog(ctx) {
      const [snapshot, setSnapshot] = useState(null);
      const asked = useRef(false);
      useEffect(() => {
        const service = ctx && ctx.sessions;
        const list = service && service.list;
        if (!list || typeof list.getSnapshot !== 'function') return undefined;
        const read = () => { try { setSnapshot(list.getSnapshot()); } catch (e) { setSnapshot(null); } };
        read();
        let dispose = null;
        try { if (typeof list.subscribe === 'function') dispose = list.subscribe(read); } catch (e) { dispose = null; }
        // The catalog only exists once someone asks for it; the sidebar does, and a
        // panel opened on its own must too. One kick per mount, never a poll.
        if (!asked.current) {
          asked.current = true;
          try {
            const current = list.getSnapshot();
            const hasRows = !!(current && (
              (Array.isArray(current.items) && current.items.length > 0)
              || (Array.isArray(current.ids) && current.ids.length > 0)
              || (current.byId && Object.keys(current.byId).length > 0)));
            if (!hasRows && typeof service.refresh === 'function') {
              Promise.resolve(service.refresh()).catch(() => {});
            }
          } catch (e) { /* ignore */ }
        }
        return () => { if (typeof dispose === 'function') { try { dispose(); } catch (e) { /* ignore */ } } };
      }, [ctx]);
      return snapshot;
    }

    /**
     * Four distinct outcomes: loading, error, unavailable (load settled with no
     * projection), and the projection itself. `unavailable` is what stops a
     * missing projection from looking like an endless load.
     */
    function useTeamBoard(ctx, sessionId, team) {
      const [load, setLoad] = useState({ sessionId: null, phase: 'idle', error: null });

      const attempt = useCallback((id) => {
        if (!id) return;
        const svc = ctx && ctx.sessions;
        if (!svc || typeof svc.refreshProjections !== 'function') {
          setLoad({ sessionId: id, phase: 'error', error: DICT[pickLang(ctx)].noStore });
          return;
        }
        setLoad({ sessionId: id, phase: 'loading', error: null });
        Promise.resolve(svc.refreshProjections(id))
          .then(() => { setLoad({ sessionId: id, phase: 'ready', error: null }); })
          .catch((err) => { setLoad({ sessionId: id, phase: 'error', error: messageOf(err) }); });
      }, [ctx]);

      useEffect(() => {
        if (!sessionId || team !== undefined) return;
        setLoad((prev) => {
          if (prev.sessionId !== sessionId) {
            // New session: drop the previous outcome so no stale error survives.
            // `idle` lets the effect below start the load; `loading` would park it.
            return { sessionId, phase: 'idle', error: null };
          }
          return prev;
        });
      }, [sessionId, team]);

      useEffect(() => {
        if (!sessionId || team !== undefined) return;
        if (load.sessionId !== sessionId) return;
        if (load.phase === 'loading') return;
        if (load.phase === 'idle') attempt(sessionId);
      }, [attempt, load.phase, load.sessionId, sessionId, team]);

      const phase = load.sessionId === sessionId ? load.phase : (team === undefined ? 'loading' : 'ready');
      return { phase, error: load.sessionId === sessionId ? load.error : null, attempt };
    }

    /**
     * Preload at most `budget` sessions once per mount so the picker can show
     * counts without turning into a burst of projection reads for every session.
     */
    function useWindowWarmup(ctx, signature, budget) {
      const attempted = useRef(null);
      if (attempted.current === null) attempted.current = new Set();
      useEffect(() => {
        const svc = ctx && ctx.sessions;
        if (!svc || typeof svc.refreshProjections !== 'function') return;
        const ids = signature ? signature.split(',') : [];
        let used = 0;
        for (const id of ids) {
          if (!id) continue;
          if (used >= budget) break;
          if (attempted.current.has(id)) continue;
          attempted.current.add(id);
          used += 1;
          try { Promise.resolve(svc.refreshProjections(id)).catch(() => {}); } catch (e) { /* ignore */ }
        }
      }, [ctx, signature, budget]);
      return attempted.current;
    }

    /**
     * Members of this tree, straight from the shipped projections: the root's
     * `subagentCatalog` plus each child's `tokenUsage` and `subagentTiming`.
     */
    function useSubagents(snapshot, sessionId) {
      const byId = (snapshot && snapshot.byId) || {};
      const rootId = useMemo(() => {
        let cursor = sessionId;
        for (let depth = 0; depth < 8 && cursor; depth += 1) {
          const summary = byId[cursor];
          const parent = summary && summary.parentSessionId;
          if (!parent || !byId[parent]) break;
          cursor = parent;
        }
        return cursor;
      }, [byId, sessionId]);

      const catalogRow = rowOf(snapshot, rootId);
      const entries = catalogRow && catalogRow.values && Array.isArray(catalogRow.values.subagentCatalog)
        ? catalogRow.values.subagentCatalog
        : [];

      const anyRunning = entries.some((entry) => {
        const summary = byId[entry && (entry.id || entry.sessionId)];
        return !!(summary && summary.running === true);
      });
      const [now, setNow] = useState(() => Date.now());
      useEffect(() => {
        if (!anyRunning) return undefined;
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
      }, [anyRunning]);

      const members = useMemo(() => entries.map((entry) => {
        const id = entry.id || entry.sessionId;
        const summary = byId[id] || {};
        const values = summary.projectionValues || {};
        const usage = values.tokenUsage;
        const timing = values.subagentTiming;
        const running = summary.running === true;
        const tokens = usage && typeof usage === 'object'
          ? (usage.uncachedInputTokens || 0) + (usage.outputTokens || 0)
            + (usage.cacheReadTokens || 0) + (usage.cacheWriteTokens || 0)
          : undefined;
        let durationMs;
        if (timing && typeof timing === 'object') {
          durationMs = timing.active === undefined || timing.active === null
            ? timing.settledMs
            : (timing.settledMs || 0) + Math.max(0, (running ? now : timing.active.through) - timing.active.since);
        }
        return {
          id,
          title: summary.title || entry.title || entry.name || id,
          name: entry.name || '',
          running,
          usage,
          tokens,
          durationMs,
        };
      }), [byId, entries, now]);

      return { members, rootId };
    }

    function useDependencyEdges(boardRef, tasks, signature) {      const [edges, setEdges] = useState([]);
      const markerId = useMemo(() => 'tk-arrow-' + Math.random().toString(36).slice(2, 9), []);
      useEffect(() => {
        const root = boardRef.current;
        if (!root) { setEdges([]); return undefined; }
        let frame = 0;
        let stopped = false;
        const measure = () => {
          if (stopped) return;
          try {
            const origin = root.getBoundingClientRect();
            const spots = new Map();
            const cards = root.querySelectorAll('[data-task-id]');
            for (let index = 0; index < cards.length; index += 1) {
              const card = cards[index];
              const rect = card.getBoundingClientRect();
              spots.set(card.getAttribute('data-task-id'), {
                x: rect.left - origin.left,
                y: rect.top - origin.top,
                w: rect.width,
                h: rect.height,
              });
            }
            const next = [];
            for (const task of tasks) {
              // Only a task that is actually waiting on something is worth an edge.
              if (task.status !== 'pending' || task.ready !== false) continue;
              const target = spots.get(task.id);
              if (!target) continue;
              for (const blocker of arrayOf(task.blockedBy)) {
                const source = spots.get(blocker);
                if (!source) continue;
                const midY1 = source.y + source.h / 2;
                const midY2 = target.y + target.h / 2;
                const sameColumn = Math.abs(source.x - target.x) < 4;
                let d;
                if (sameColumn) {
                  const x = Math.min(source.x, target.x) - 14;
                  d = 'M ' + x + ' ' + midY1 + ' C ' + (x - 18) + ' ' + midY1 + ', ' + (x - 18) + ' ' + midY2 + ', ' + x + ' ' + midY2;
                } else if (source.x < target.x) {
                  const x1 = source.x + source.w;
                  const x2 = target.x;
                  const reach = Math.max(24, (x2 - x1) * 0.45);
                  d = 'M ' + x1 + ' ' + midY1 + ' C ' + (x1 + reach) + ' ' + midY1 + ', ' + (x2 - reach) + ' ' + midY2 + ', ' + x2 + ' ' + midY2;
                } else {
                  const x1 = source.x;
                  const x2 = target.x + target.w;
                  const reach = Math.max(24, (x1 - x2) * 0.45);
                  d = 'M ' + x1 + ' ' + midY1 + ' C ' + (x1 - reach) + ' ' + midY1 + ', ' + (x2 + reach) + ' ' + midY2 + ', ' + x2 + ' ' + midY2;
                }
                next.push({ key: blocker + '->' + task.id, d });
              }
            }
            setEdges(next);
          } catch (e) { setEdges([]); }
        };
        const schedule = () => {
          if (frame || stopped) return;
          frame = requestAnimationFrame(() => { frame = 0; measure(); });
        };
        schedule();
        let observer = null;
        try { observer = new ResizeObserver(schedule); observer.observe(root); } catch (e) { observer = null; }
        try { root.addEventListener('scroll', schedule, true); } catch (e) { /* ignore */ }
        try { window.addEventListener('resize', schedule); } catch (e) { /* ignore */ }
        return () => {
          stopped = true;
          if (frame) cancelAnimationFrame(frame);
          if (observer) { try { observer.disconnect(); } catch (e) { /* ignore */ } }
          try { root.removeEventListener('scroll', schedule, true); } catch (e) { /* ignore */ }
          try { window.removeEventListener('resize', schedule); } catch (e) { /* ignore */ }
        };
      }, [boardRef, tasks, signature]);
      return { edges, markerId };
    }

    // ------------------------------------------------------------- styles ---
    const STYLE = [
      '.tk-page{box-sizing:border-box;width:100%;height:100%;display:flex;flex-direction:column;gap:12px;',
      'padding:calc(var(--dsh-frame-top-clearance,0px) + 16px) 20px 14px calc(20px + var(--dsh-frame-leading-clearance,0px));',
      'color:var(--dsw-alias-label-primary);font-size:13px;overflow:hidden;outline:none}',
      '.tk-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap}',
      '.tk-title-row{display:flex;align-items:baseline;gap:8px}',
      '.tk-title{margin:0;font-size:20px;font-weight:500;line-height:28px}',
      '.tk-sub{margin:2px 0 0;font-size:12px;color:var(--dsw-alias-label-tertiary)}',
      '.tk-build{line-height:15px;padding:0 6px;border-radius:999px;cursor:pointer;font:inherit;font-size:10px;',
      'border:.5px solid var(--dsw-alias-border-l3);color:var(--dsw-alias-label-tertiary);background:transparent}',
      '.tk-build:hover{color:var(--dsw-alias-label-secondary)}',
      '.tk-controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap}',
      '.tk-btn,.tk-select{height:32px;border-radius:var(--dsw-radius-lg,16px);border:.5px solid var(--dsw-alias-border-l3);',
      'background:transparent;color:inherit;font:inherit;font-size:13px;padding:0 12px;cursor:pointer;max-width:230px}',
      '.tk-btn:hover,.tk-select:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.tk-select option{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-overlay)}',
      '.tk-badge{font-size:11px;line-height:18px;padding:0 8px;border-radius:999px;border:.5px solid var(--dsw-alias-border-l3);',
      'color:var(--dsw-alias-label-tertiary);white-space:nowrap}',
      '.tk-badge[data-on="true"]{color:var(--dsw-alias-state-success-primary);border-color:currentColor}',
      '.tk-badge[data-on="false"]{color:var(--dsw-alias-state-warn-primary);border-color:currentColor}',
      '.tk-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}',
      '.tk-input{height:30px;min-width:200px;flex:0 1 260px;border-radius:var(--dsw-radius-sm,8px);',
      'border:.5px solid var(--dsw-alias-border-l3);background:transparent;color:inherit;font:inherit;font-size:12px;padding:0 10px}',
      '.tk-input:focus{outline:none;border-color:var(--dsw-alias-border-selected)}',
      '.tk-chipbtn{height:26px;border-radius:999px;border:.5px solid var(--dsw-alias-border-l3);background:transparent;',
      'color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;padding:0 10px;cursor:pointer}',
      '.tk-chipbtn:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.tk-chipbtn[data-active="true"]{color:var(--dsw-alias-border-selected);border-color:currentColor;',
      'background:var(--dsw-alias-interactive-bg-hover)}',
      '.tk-mini{height:26px;border-radius:var(--dsw-radius-xs,4px);border:.5px solid var(--dsw-alias-border-l3);',
      'background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;padding:0 8px;cursor:pointer}',
      '.tk-mini:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.tk-select-sm{height:26px;border-radius:var(--dsw-radius-xs,4px);border:.5px solid var(--dsw-alias-border-l3);',
      'background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;padding:0 6px;max-width:180px}',
      '.tk-tally{margin-left:auto;font-size:11px;color:var(--dsw-alias-label-tertiary);white-space:nowrap}',
      '.tk-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;max-width:420px}',
      '.tk-members{display:flex;flex-direction:column;gap:1px;border:.5px solid var(--dsw-alias-border-l3);',
      'border-radius:var(--dsw-radius-sm,8px);background:var(--dsw-alias-card-fill);padding:6px 10px;',
      'max-height:190px;overflow:auto}',
      '.tk-members-head{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;',
      'color:var(--dsw-alias-label-secondary);padding:1px 0 4px}',
      '.tk-member{display:grid;grid-template-columns:10px minmax(0,1fr) auto auto;align-items:center;gap:8px;',
      'padding:3px 0;cursor:pointer;border-radius:var(--dsw-radius-xs,4px)}',
      '.tk-member:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.tk-member-name-cell{min-width:0}',
      '.tk-member-title{font-size:12px;line-height:1.35;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.tk-member-name{font-size:11px;color:var(--dsw-alias-label-tertiary);overflow:hidden;',
      'text-overflow:ellipsis;white-space:nowrap}',
      '.tk-member-num{font-size:11px;color:var(--dsw-alias-label-tertiary);white-space:nowrap;',
      'font-variant-numeric:tabular-nums}',
      '.tk-member-detail{font-size:11px;line-height:1.7;color:var(--dsw-alias-label-tertiary);',
      'padding:1px 0 6px 18px;word-break:break-all}',      '.tk-stats[data-wide="true"]{grid-template-columns:repeat(3,minmax(0,1fr));max-width:620px}',
      '.tk-stat{border:.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-sm,8px);',
      'background:var(--dsw-alias-card-fill);padding:8px 12px}',
      '.tk-stat-n{font-size:19px;font-weight:600;line-height:1.15;font-variant-numeric:tabular-nums}',
      '.tk-stat-l{margin-top:3px;font-size:11px;color:var(--dsw-alias-label-tertiary)}',
      '.tk-groups{flex:1 1 auto;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:16px;padding-right:2px}',
      '.tk-group{display:flex;flex-direction:column;gap:8px}',
      '.tk-group-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px;font-weight:600}',
      '.tk-group-meta{font-size:11px;font-weight:400;color:var(--dsw-alias-label-tertiary)}',
      '.tk-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px}',
      '.tk-link{border:.5px solid var(--dsw-alias-border-l3);background:transparent;color:var(--dsw-alias-label-secondary);',
      'font:inherit;font-size:11px;border-radius:var(--dsw-radius-xs,4px);padding:2px 8px;cursor:pointer;margin-left:auto}',
      '.tk-link:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.tk-link-flat{border:none;background:transparent;color:var(--dsw-alias-state-business-primary);font:inherit;',
      'font-size:11px;padding:0;cursor:pointer;text-align:left;text-decoration:underline;text-underline-offset:2px}',
      '.tk-board{position:relative;flex:1 1 auto;min-height:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}',
      '.tk-col{display:flex;flex-direction:column;min-height:0;border-radius:var(--dsw-radius-md,12px);',
      'background:var(--dsw-alias-bg-layer-1);border:.5px solid var(--dsw-alias-border-l3);overflow:hidden}',
      '.tk-col-head{display:flex;align-items:center;gap:8px;padding:9px 12px;font-size:12px;font-weight:600;',
      'color:var(--dsw-alias-label-secondary);border-bottom:.5px solid var(--dsw-alias-border-l3)}',
      '.tk-count{margin-left:auto;font-size:11px;font-weight:400;color:var(--dsw-alias-label-tertiary)}',
      '.tk-col-body{flex:1 1 auto;min-height:0;overflow:auto;padding:10px;display:flex;flex-direction:column;gap:8px}',
      '.tk-dot{width:8px;height:8px;border-radius:50%;background:currentColor;flex:none}',
      '.tk-page [data-tone="idle"]{color:var(--dsw-alias-label-tertiary)}',
      '.tk-page [data-tone="doing"]{color:var(--dsw-alias-state-business-primary)}',
      '.tk-page [data-tone="done"]{color:var(--dsw-alias-state-done-primary)}',
      '.tk-page [data-tone="blocked"]{color:var(--dsw-alias-state-warn-primary)}',
      '.tk-card{position:relative;z-index:1;border-radius:var(--dsw-radius-sm,8px);border:.5px solid var(--dsw-alias-border-l3);',
      'background:var(--dsw-alias-card-fill);padding:10px;display:flex;flex-direction:column;gap:5px;cursor:pointer;',
      'user-select:text}',
      '.tk-card:hover{background:var(--dsw-alias-card-fill-hover)}',
      '.tk-card[data-conflict="true"]{border-color:var(--dsw-alias-state-warn-primary)}',
      '.tk-card[data-cursor="true"]{outline:1.5px solid var(--dsw-alias-border-selected);outline-offset:1px}',
      '.tk-card[data-expanded="true"]{background:var(--dsw-alias-card-fill-hover)}',
      '.tk-subject{font-size:13px;line-height:1.35;word-break:break-word}',
      '.tk-desc{font-size:12px;line-height:1.4;color:var(--dsw-alias-label-secondary);overflow:hidden;',
      'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;white-space:pre-wrap}',
      '.tk-desc[data-open="true"]{-webkit-line-clamp:unset;max-height:none}',
      '.tk-meta{display:flex;flex-wrap:wrap;align-items:center;gap:4px 6px;font-size:11px;color:var(--dsw-alias-label-tertiary)}',
      '.tk-id{font-variant-numeric:tabular-nums}',
      '.tk-chip{border-radius:999px;padding:0 7px;line-height:16px;font-size:10px;border:1px solid var(--dsw-alias-border-l1);',
      'color:var(--dsw-alias-label-secondary)}',
      '.tk-page .tk-chip[data-tone="blocked"]{color:var(--dsw-alias-state-warn-primary);border-color:currentColor}',
      '.tk-page .tk-chip[data-tone="done"]{color:var(--dsw-alias-state-done-primary);border-color:currentColor}',
      '.tk-page .tk-chip[data-tone="doing"]{color:var(--dsw-alias-state-business-primary);border-color:currentColor}',
      '.tk-owner{color:var(--dsw-alias-label-secondary);border:none;background:transparent;font:inherit;font-size:11px;',
      'padding:0;cursor:pointer;text-decoration:underline;text-underline-offset:2px}',
      '.tk-owner:hover{color:var(--dsw-alias-label-primary)}',
      '.tk-owner[data-off="true"]{color:var(--dsw-alias-label-tertiary);text-decoration:none}',
      '.tk-detail{border-top:.5px solid var(--dsw-alias-border-l3);margin-top:3px;padding-top:7px;',
      'display:flex;flex-direction:column;gap:7px;cursor:default}',
      '.tk-detail-label{font-size:10px;letter-spacing:.02em;color:var(--dsw-alias-label-tertiary);margin-bottom:2px}',
      '.tk-detail-body{font-size:12px;line-height:1.5;color:var(--dsw-alias-label-secondary);white-space:pre-wrap;word-break:break-word}',
      '.tk-detail-list{display:flex;flex-direction:column;gap:3px;margin:0;padding:0;list-style:none}',
      '.tk-path{font-size:11px;color:var(--dsw-alias-label-secondary);word-break:break-all}',
      '.tk-warn{font-size:11px;color:var(--dsw-alias-state-warn-primary);word-break:break-word}',
      '.tk-svg{position:absolute;inset:0;pointer-events:none;overflow:visible;z-index:0}',
      '.tk-edge{fill:none;stroke:var(--dsw-alias-border-l3);stroke-width:1.5;stroke-dasharray:4 4}',
      '.tk-note{padding:22px 12px;text-align:center;font-size:12px;line-height:1.7;color:var(--dsw-alias-label-tertiary)}',
      '.tk-error{border:.5px solid var(--dsw-alias-state-error-primary);color:var(--dsw-alias-state-error-primary);',
      'border-radius:var(--dsw-radius-sm,8px);padding:9px 12px;font-size:12px;display:flex;gap:10px;align-items:center}',
      '.tk-inline-btn{border:.5px solid currentColor;background:transparent;color:inherit;font:inherit;font-size:12px;',
      'border-radius:var(--dsw-radius-xs,4px);padding:2px 10px;cursor:pointer}',
      '.tk-foot{font-size:11px;color:var(--dsw-alias-label-tertiary);padding:2px 0}',
      '.tk-keyhint{font-size:10px;color:var(--dsw-alias-label-tertiary);opacity:.85}',
      '.tk-debug{font-size:11px;line-height:1.5;white-space:pre-wrap;word-break:break-all;margin:0;',
      'color:var(--dsw-alias-label-secondary);border:.5px solid var(--dsw-alias-border-l3);',
      'border-radius:var(--dsw-radius-xs,4px);padding:8px;overflow:auto;max-height:220px;',
      'background:var(--dsw-alias-bg-layer-2)}',
      '@media (max-width:768px){.tk-page{padding:calc(var(--dsh-frame-top-clearance,0px) + 12px) 14px 14px calc(14px + var(--dsh-frame-leading-clearance,0px))}',
      '.tk-stats{grid-template-columns:repeat(2,minmax(0,1fr))}',
      '.tk-board{grid-auto-flow:column;grid-template-columns:none;grid-auto-columns:minmax(240px,1fr);overflow-x:auto}}',
    ].join('');

    // --------------------------------------------------------------- views ---
    function StatusDot(props) {
      return h('span', { className: 'tk-dot', 'data-tone': props.tone, 'aria-hidden': 'true' });
    }

    function Card(props) {
      const { task, t, expanded, cursor, byId } = props;
      const blocked = task.status === 'pending' && task.ready === false;
      const tone = task.status === 'completed' ? 'done' : task.status === 'in_progress' ? 'doing' : blocked ? 'blocked' : 'idle';
      const owner = task.ownerName || task.ownerId || '';
      const blockers = arrayOf(task.blockedBy);
      const scopes = arrayOf(task.writeScopes);
      const warnings = arrayOf(task.writeScopeWarnings);

      const detail = expanded ? h('div', { className: 'tk-detail' },
        task.description ? h('div', { className: 'tk-detail-body' }, task.description) : null,
        blockers.length > 0 ? h('div', null,
          h('div', { className: 'tk-detail-label' }, t.detailBlocked),
          h('ul', { className: 'tk-detail-list' }, blockers.map((id) => {
            const dependency = byId.get(id);
            return h('li', { key: id },
              h('button', {
                type: 'button',
                className: 'tk-link-flat',
                onClick: (event) => { event.stopPropagation(); props.onJump(id); },
              }, id + (dependency && dependency.subject ? ' · ' + dependency.subject : '') + ' [' + (dependency ? statusLabel(dependency, t) : '?') + ']'));
          }))) : null,
        scopes.length > 0 ? h('div', null,
          h('div', { className: 'tk-detail-label' }, t.detailScopes),
          h('ul', { className: 'tk-detail-list' },
            scopes.map((path) => h('li', { key: path, className: 'tk-path' }, path)))) : null,
        warnings.length > 0 ? h('div', null,
          h('div', { className: 'tk-detail-label' }, t.detailWarnings),
          h('ul', { className: 'tk-detail-list' },
            warnings.map((warning, index) => h('li', { key: index, className: 'tk-warn' }, warning)))) : null) : null;

      return h('div', {
        className: 'tk-card',
        'data-task-id': task.id,
        'data-conflict': warnings.length > 0 ? 'true' : 'false',
        'data-cursor': cursor ? 'true' : 'false',
        'data-expanded': expanded ? 'true' : 'false',
        title: t.cardHint,
        onClick: () => props.onToggle(task.id),
      },
        h('div', { className: 'tk-subject' }, task.subject || task.title || task.id),
        task.description ? h('div', { className: 'tk-desc', 'data-open': expanded ? 'true' : 'false' },
          expanded ? task.description : '') : null,
        h('div', { className: 'tk-meta' },
          h(StatusDot, { tone }),
          h('span', { className: 'tk-id' }, task.id),
          h('span', null, t.owner + ': '),
          owner
            ? h('button', {
              type: 'button',
              className: 'tk-owner',
              title: t.onlyOwnerHint,
              onClick: (event) => { event.stopPropagation(); props.onOwner(owner); },
            }, owner)
            : h('span', { className: 'tk-owner', 'data-off': 'true' }, t.unowned),
          blockers.length > 0
            ? h('span', { className: 'tk-chip', 'data-tone': blocked ? 'blocked' : 'doing', title: blockers.join(', ') },
              t.dependsOn + ' ' + blockers.join(', '))
            : null,
          warnings.length > 0
            ? h('span', { className: 'tk-chip', 'data-tone': 'blocked', title: warnings.join('\n') },
              t.conflict + ' ' + warnings.length)
            : scopes.length > 0
              ? h('span', { className: 'tk-chip', title: scopes.join('\n') }, t.writeScopes + ' ' + scopes.length)
              : null),
        detail);
    }

    function Column(props) {
      const items = props.items;
      return h('section', { className: 'tk-col' },
        h('header', { className: 'tk-col-head' },
          h(StatusDot, { tone: props.tone }),
          h('span', null, props.label),
          h('span', { className: 'tk-count' }, String(items.length))),
        h('div', { className: 'tk-col-body' },
          items.length === 0
            ? h('div', { className: 'tk-note' }, '—')
            : items.map((task) => h(Card, {
              key: task.id,
              task,
              t: props.t,
              byId: props.byId,
              expanded: props.expandedId === task.id,
              cursor: props.cursorId === task.id,
              onToggle: props.onToggle,
              onJump: props.onJump,
              onOwner: props.onOwner,
            }))));
    }

    function Members(props) {
      const { members, t, lang } = props;
      const [open, setOpen] = useState(true);
      const [expanded, setExpanded] = useState(null);
      if (!members || members.length === 0) return null;
      const running = members.filter((member) => member.running).length;
      const summaryText = running > 0
        ? t.membersRunning.replace('{n}', String(running))
        : t.membersDone.replace('{n}', String(members.length));

      return h('section', { className: 'tk-members' },
        h('div', { className: 'tk-members-head' },
          h(StatusDot, { tone: running > 0 ? 'doing' : 'done' }),
          h('span', null, t.members),
          h('span', { className: 'tk-member-num' }, summaryText),
          h('button', {
            type: 'button',
            className: 'tk-mini',
            style: { marginLeft: 'auto' },
            'aria-expanded': open,
            onClick: () => setOpen((value) => !value),
          }, open ? t.collapse : t.expand)),
        open ? members.map((member) => h('div', { key: member.id, className: 'tk-member-block' },
          h('div', {
            className: 'tk-member',
            title: t.memberHint,
            onClick: () => setExpanded((value) => (value === member.id ? null : member.id)),
          },
          h(StatusDot, { tone: member.running ? 'doing' : 'done' }),
          h('div', { className: 'tk-member-name-cell' },
            h('div', { className: 'tk-member-title' }, member.title),
            member.name ? h('div', { className: 'tk-member-name' }, member.name) : null),
          h('span', { className: 'tk-member-num' }, formatTokens(member.tokens)),
          h('span', { className: 'tk-member-num' }, formatDuration(member.durationMs, lang))),
          expanded === member.id
            ? h('div', { className: 'tk-member-detail' },
              h('div', null, t.sessionIdLabel + ': ' + member.id),
              member.usage ? h('div', null,
                t.tokensIn + ' ' + formatTokens(member.usage.uncachedInputTokens) + ' · '
                + t.tokensOut + ' ' + formatTokens(member.usage.outputTokens) + ' · '
                + t.tokensCacheRead + ' ' + formatTokens(member.usage.cacheReadTokens) + ' · '
                + t.tokensCacheWrite + ' ' + formatTokens(member.usage.cacheWriteTokens)) : null)
            : null))
          : null);
    }

    const VIEW_ALL = '__all__';
    const VIEW_FOLLOW = '__follow__';
    const WINDOW_BUDGET = 8;
    const EMPTY_FILTERS = { q: '', blockedOnly: false, conflictOnly: false, owner: '' };

    function Panel(props) {
      const ctx = props.dsh;
      const lang = pickLang(ctx);
      const t = DICT[lang] || DICT.en;
      const useSessions = typeof props.useSessions === 'function' ? props.useSessions : NO_HOOK;

      // Remembered view state, read once.
      const saved = useRef(null);
      if (saved.current === null) saved.current = readPrefs();

      const currentId = useCurrentSession(ctx);
      const sessionsSnapshot = useSessions((state) => state);
      const catalog = useSessionCatalog(ctx);
      const items = useMemo(() => {
        const direct = listSessions(catalog);
        if (direct.length > 0) return direct;
        return listSessions(sessionsSnapshot);
      }, [catalog, sessionsSnapshot]);

      const [view, setView] = useState(saved.current.view || VIEW_FOLLOW);
      const [filters, setFilters] = useState(() => ({ ...EMPTY_FILTERS, ...(saved.current.filters || {}) }));
      const [autoSec, setAutoSec] = useState(() => (saved.current.autoSec === 30 ? 30 : saved.current.autoSec === 10 ? 10 : 0));
      const [expandedId, setExpandedId] = useState(null);
      const [cursorId, setCursorId] = useState(null);
      const [debug, setDebug] = useState(false);
      const searchRef = useRef(null);
      const boardRef = useRef(null);

      const isAll = view === VIEW_ALL;
      const sessionId = isAll ? null : (view === VIEW_FOLLOW ? currentId : view);

      useEffect(() => { writePrefs({ view, filters, autoSec }); }, [view, filters, autoSec]);

      // A remembered session may be gone; fall back instead of showing a dead tab.
      useEffect(() => {
        if (isAll || view === VIEW_FOLLOW || items.length === 0) return;
        if (!items.some((item) => sidOf(item) === view)) setView(VIEW_FOLLOW);
      }, [isAll, items, view]);

      const windowSignature = useMemo(() => items
        .slice(0, WINDOW_BUDGET)
        .map((item) => sidOf(item))
        .join(','), [items]);
      useWindowWarmup(ctx, windowSignature, WINDOW_BUDGET);

      const teamOf = useCallback((state, id) => {
        const row = rowOf(state, id);
        return row && row.values ? row.values.agentTeam : undefined;
      }, []);

      const selector = useCallback((state) => (sessionId ? teamOf(state, sessionId) : undefined), [sessionId, teamOf]);
      const team = useSessions(selector);
      const board = useTeamBoard(ctx, sessionId, team);
      const projectionRow = sessionId ? rowOf(sessionsSnapshot, sessionId) : undefined;
      const projectionError = projectionRow && projectionRow.state === 'error' ? messageOf(projectionRow.error) : null;

      const currentTitle = useMemo(() => {
        const found = items.find((item) => sidOf(item) === sessionId);
        if (found && found.title) return found.title;
        return sessionId || '';
      }, [items, sessionId]);

      const tasks = useMemo(() => {
        if (!team || !Array.isArray(team.tasks)) return [];
        return team.tasks.filter((task) => task && task.status !== 'deleted');
      }, [team]);

      const byId = useMemo(() => {
        const map = new Map();
        for (const task of tasks) map.set(task.id, task);
        return map;
      }, [tasks]);

      const owners = useMemo(() => {
        const set = new Set();
        for (const task of tasks) {
          const owner = task.ownerName || task.ownerId;
          if (owner) set.add(owner);
        }
        return Array.from(set).sort();
      }, [tasks]);

      const filtering = !!(filters.q.trim() || filters.blockedOnly || filters.conflictOnly || filters.owner);
      const visible = useMemo(() => {
        const needle = filters.q.trim().toLowerCase();
        return tasks.filter((task) => {
          if (filters.blockedOnly && !(task.status === 'pending' && task.ready === false)) return false;
          if (filters.conflictOnly && arrayOf(task.writeScopeWarnings).length === 0) return false;
          const owner = task.ownerName || task.ownerId || '';
          if (filters.owner && owner !== filters.owner) return false;
          if (!needle) return true;
          const haystack = [task.subject, task.description, task.id, owner, arrayOf(task.writeScopes).join(' ')]
            .filter(Boolean).join(' ').toLowerCase();
          return haystack.indexOf(needle) !== -1;
        });
      }, [filters, tasks]);

      const groups = useMemo(() => {
        const todo = [];
        const doing = [];
        const done = [];
        for (const task of visible) {
          if (task.status === 'completed') done.push(task);
          else if (task.status === 'in_progress') doing.push(task);
          else todo.push(task);
        }
        todo.sort((a, b) => (a.ready === b.ready ? 0 : a.ready ? -1 : 1));
        return { todo, doing, done };
      }, [visible]);

      const flat = useMemo(() => groups.todo.concat(groups.doing, groups.done), [groups]);
      const flatIds = useMemo(() => flat.map((task) => task.id), [flat]);

      const signature = useMemo(() => tasks
        .map((task) => task.id + ':' + arrayOf(task.blockedBy).join('|'))
        .join(',') + '#' + flatIds.join(',') + '#' + (expandedId || ''), [tasks, flatIds, expandedId]);
      const { edges, markerId } = useDependencyEdges(boardRef, tasks, signature);
      const { members } = useSubagents(sessionsSnapshot, sessionId);

      const aggregate = useMemo(() => {
        const rows = [];
        for (const item of items) {
          const id = sidOf(item);
          if (!id) continue;
          const project = teamOf(sessionsSnapshot, id);
          if (!project) continue;
          const list = Array.isArray(project.tasks) ? project.tasks.filter((task) => task && task.status !== 'deleted') : [];
          if (list.length === 0) continue;
          rows.push({
            id,
            title: item.title || id,
            enabled: project.enabled !== false,
            tasks: list,
            counts: countsOf(list),
          });
        }
        return rows;
      }, [items, sessionsSnapshot, teamOf]);

      const totals = useMemo(() => {
        const acc = { total: 0, blocked: 0, done: 0, doing: 0, todo: 0, sessions: 0 };
        for (const row of aggregate) {
          acc.sessions += 1;
          acc.total += row.counts.total;
          acc.blocked += row.counts.blocked;
          acc.done += row.counts.done;
          acc.doing += row.counts.doing;
          acc.todo += row.counts.todo;
        }
        return acc;
      }, [aggregate]);

      const loadedCount = useMemo(() => items
        .filter((item) => {
          const row = rowOf(sessionsSnapshot, sidOf(item));
          return !!(row && row.values);
        }).length, [items, sessionsSnapshot]);

      const blockedCount = groups.todo.filter((task) => task.ready === false).length;
      const rate = visible.length === 0 ? 0 : Math.round((groups.done.length / visible.length) * 100);
      const totalRate = totals.total === 0 ? 0 : Math.round((totals.done / totals.total) * 100);
      const enabled = team ? team.enabled !== false : null;

      const refresh = useCallback(() => {
        if (isAll) {
          const svc = ctx && ctx.sessions;
          if (!svc || typeof svc.refreshProjections !== 'function') return;
          for (const row of aggregate) {
            try { Promise.resolve(svc.refreshProjections(row.id)).catch(() => {}); } catch (e) { /* ignore */ }
          }
          return;
        }
        board.attempt(sessionId);
      }, [aggregate, board, ctx, isAll, sessionId]);

      const refreshRef = useRef(refresh);
      useEffect(() => { refreshRef.current = refresh; }, [refresh]);
      useEffect(() => {
        if (!autoSec) return undefined;
        const timer = setInterval(() => { refreshRef.current(); }, autoSec * 1000);
        return () => clearInterval(timer);
      }, [autoSec]);

      const scrollToCard = useCallback((id) => {
        try {
          const root = boardRef.current;
          if (!root || !id) return;
          const node = root.querySelector('[data-task-id="' + id + '"]');
          if (node && typeof node.scrollIntoView === 'function') node.scrollIntoView({ block: 'nearest' });
        } catch (e) { /* ignore */ }
      }, []);

      const toggleCard = useCallback((id) => {
        setExpandedId((current) => (current === id ? null : id));
        setCursorId(id);
      }, []);

      const jumpToCard = useCallback((id) => {
        if (!flatIds.includes(id)) return;
        setCursorId(id);
        setExpandedId(id);
        scrollToCard(id);
      }, [flatIds, scrollToCard]);

      const moveCursor = useCallback((step) => {
        if (flatIds.length === 0) return;
        const index = cursorId ? flatIds.indexOf(cursorId) : -1;
        const next = index < 0
          ? (step > 0 ? 0 : flatIds.length - 1)
          : Math.min(flatIds.length - 1, Math.max(0, index + step));
        const id = flatIds[next];
        setCursorId(id);
        scrollToCard(id);
      }, [cursorId, flatIds, scrollToCard]);

      const onKeyDown = useCallback((event) => {
        if (event.metaKey || event.ctrlKey || event.altKey) return;
        const target = event.target;
        const tag = target && target.tagName ? target.tagName : '';
        const typing = tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';
        if (typing) {
          if (event.key === 'Escape') {
            event.preventDefault();
            try { target.blur(); } catch (e) { /* ignore */ }
          }
          return;
        }
        switch (event.key) {
          case 'ArrowDown':
          case 'j':
            event.preventDefault();
            moveCursor(1);
            return;
          case 'ArrowUp':
          case 'k':
            event.preventDefault();
            moveCursor(-1);
            return;
          case 'Enter':
          case ' ':
            if (!cursorId) return;
            event.preventDefault();
            toggleCard(cursorId);
            return;
          case 'Escape':
            setExpandedId(null);
            setCursorId(null);
            return;
          case '/':
            event.preventDefault();
            if (searchRef.current) searchRef.current.focus();
            return;
          case 'g':
            event.preventDefault();
            setView((current) => (current === VIEW_ALL ? VIEW_FOLLOW : VIEW_ALL));
            return;
          case 'r':
            event.preventDefault();
            refresh();
            return;
          default:
        }
      }, [cursorId, moveCursor, refresh, toggleCard]);

      const retryButton = () => h('button', {
        type: 'button',
        className: 'tk-inline-btn',
        onClick: refresh,
      }, t.retry);

      const body = [];
      if (typeof props.useSessions !== 'function') {
        body.push(h('div', { className: 'tk-error', key: 'nostore', role: 'alert' }, t.noStore));
      } else if (isAll) {
        if (aggregate.length === 0) {
          body.push(h('div', { className: 'tk-note', key: 'all-empty' },
            h('div', null, t.empty),
            h('div', null, t.acrossHint)));
        } else {
          body.push(h('div', { className: 'tk-stats', key: 'all-stats', 'data-wide': 'true' },
            h('div', { className: 'tk-stat' },
              h('div', { className: 'tk-stat-n' }, String(totals.total)),
              h('div', { className: 'tk-stat-l' }, t.tasks + ' · ' + totals.sessions)),
            h('div', { className: 'tk-stat' },
              h('div', { className: 'tk-stat-n' }, String(totals.blocked)),
              h('div', { className: 'tk-stat-l' }, t.blockedCount)),
            h('div', { className: 'tk-stat' },
              h('div', { className: 'tk-stat-n' }, totalRate + '%'),
              h('div', { className: 'tk-stat-l' }, t.rate))));
          body.push(h('div', { className: 'tk-groups', key: 'all-groups' },
            aggregate.map((row) => h('section', { key: row.id, className: 'tk-group' },
              h('div', { className: 'tk-group-head' },
                h('span', null, row.title),
                h('span', { className: 'tk-group-meta' },
                  countLabel(row.counts, t) + (row.enabled ? '' : ' · ' + t.modeOff)),
                h('button', {
                  type: 'button',
                  className: 'tk-link',
                  onClick: () => setView(row.id),
                }, t.open)),
              h('div', { className: 'tk-grid' },
                row.tasks.map((task) => h(Card, {
                  key: task.id,
                  task,
                  t,
                  byId,
                  expanded: false,
                  cursor: false,
                  onToggle: () => {},
                  onJump: () => {},
                  onOwner: () => {},
                }))))),
            h('div', { className: 'tk-foot' },
              t.windowNote + ' ' + loadedCount + '/' + items.length)));
        }
      } else if (!sessionId) {
        body.push(h('div', { className: 'tk-note', key: 'nosession' },
          h('div', null, t.noSession),
          h('div', null, t.noSessionHint)));
      } else if (team && team.failure) {
        body.push(h('div', { className: 'tk-error', key: 'failure', role: 'alert' },
          h('span', null, t.failure + team.failure), retryButton()));
      } else if (board.phase === 'error') {
        body.push(h('div', { className: 'tk-error', key: 'loaderror', role: 'alert' },
          h('span', null, board.error || t.failure), retryButton()));
      } else if (projectionError) {
        body.push(h('div', { className: 'tk-error', key: 'projerror', role: 'alert' },
          h('span', null, t.failure + projectionError), retryButton()));
      } else if (!team && board.phase === 'loading') {
        body.push(h('div', { className: 'tk-note', key: 'loading' }, t.loading));
      } else if (!team) {
        body.push(h('div', { className: 'tk-note', key: 'unavailable' },
          h('div', null, t.unavailable),
          h('div', null, t.unavailableHint),
          h('div', { style: { marginTop: '10px' } }, retryButton())));
      } else if (enabled === false) {
        body.push(h('div', { className: 'tk-note', key: 'off' },
          h('div', null, t.modeOff),
          h('div', null, t.modeHint)));
      } else if (tasks.length === 0) {
        body.push(h('div', { className: 'tk-note', key: 'empty' }, t.empty));
      } else {
        body.push(h('div', { className: 'tk-stats', key: 'stats' },
          h('div', { className: 'tk-stat' },
            h('div', { className: 'tk-stat-n' }, String(blockedCount)),
            h('div', { className: 'tk-stat-l' }, t.blockedCount)),
          h('div', { className: 'tk-stat' },
            h('div', { className: 'tk-stat-n' }, rate + '%'),
            h('div', { className: 'tk-stat-l' }, t.rate))));
        if (visible.length === 0) {
          body.push(h('div', { className: 'tk-note', key: 'nomatch' }, t.noMatch));
        } else {
          body.push(h('div', { className: 'tk-board', key: 'board', ref: boardRef },
            h('svg', { className: 'tk-svg', 'aria-hidden': 'true' },
              h('defs', null,
                h('marker', {
                  id: markerId,
                  viewBox: '0 0 8 8',
                  refX: 7,
                  refY: 4,
                  markerWidth: 5,
                  markerHeight: 5,
                  orient: 'auto-start-reverse',
                }, h('path', { d: 'M 0 0 L 8 4 L 0 8 z', style: { fill: 'var(--dsw-alias-border-l3)' } }))),
              edges.map((edge) => h('path', {
                key: edge.key,
                className: 'tk-edge',
                d: edge.d,
                markerEnd: 'url(#' + markerId + ')',
              }))),
            h(Column, {
              label: t.todo,
              tone: 'idle',
              items: groups.todo,
              t,
              byId,
              expandedId,
              cursorId,
              onToggle: toggleCard,
              onJump: jumpToCard,
              onOwner: (owner) => setFilters((current) => ({ ...current, owner: current.owner === owner ? '' : owner })),
            }),
            h(Column, {
              label: t.doing,
              tone: 'doing',
              items: groups.doing,
              t,
              byId,
              expandedId,
              cursorId,
              onToggle: toggleCard,
              onJump: jumpToCard,
              onOwner: (owner) => setFilters((current) => ({ ...current, owner: current.owner === owner ? '' : owner })),
            }),
            h(Column, {
              label: t.done,
              tone: 'done',
              items: groups.done,
              t,
              byId,
              expandedId,
              cursorId,
              onToggle: toggleCard,
              onJump: jumpToCard,
              onOwner: (owner) => setFilters((current) => ({ ...current, owner: current.owner === owner ? '' : owner })),
            })));
        }
      }

      if (!isAll && items.length === 0) {
        body.push(h('div', { className: 'tk-foot', key: 'nolist' }, t.noList));
      }

      if (debug) {
        body.push(h('pre', { className: 'tk-debug', key: 'debug' }, debugDump));
      }

      const showToolbar = !isAll && team && tasks.length > 0;
      const toolbar = showToolbar ? h('div', { className: 'tk-toolbar' },
        h('input', {
          ref: searchRef,
          className: 'tk-input',
          type: 'search',
          value: filters.q,
          placeholder: t.search,
          'aria-label': t.search,
          onChange: (event) => setFilters((current) => ({ ...current, q: event.target.value })),
        }),
        h('button', {
          type: 'button',
          className: 'tk-chipbtn',
          'data-active': filters.blockedOnly ? 'true' : 'false',
          onClick: () => setFilters((current) => ({ ...current, blockedOnly: !current.blockedOnly })),
        }, t.onlyBlocked),
        h('button', {
          type: 'button',
          className: 'tk-chipbtn',
          'data-active': filters.conflictOnly ? 'true' : 'false',
          onClick: () => setFilters((current) => ({ ...current, conflictOnly: !current.conflictOnly })),
        }, t.onlyConflict),
        owners.length > 0 ? h('select', {
          className: 'tk-select-sm',
          'aria-label': t.owner,
          value: filters.owner,
          onChange: (event) => setFilters((current) => ({ ...current, owner: event.target.value })),
        },
        h('option', { value: '' }, t.ownerAll),
        owners.map((owner) => h('option', { key: owner, value: owner }, owner))) : null,
        filtering ? h('button', {
          type: 'button',
          className: 'tk-mini',
          onClick: () => setFilters({ ...EMPTY_FILTERS }),
        }, t.clearFilter) : null,
        showToolbar && filtering
          ? h('span', { className: 'tk-tally' }, t.filtered + ' ' + visible.length + '/' + tasks.length)
          : null) : null;

      const selectValue = isAll ? VIEW_ALL : (view === VIEW_FOLLOW ? VIEW_FOLLOW : view);
      const followTarget = items.find((item) => sidOf(item) === currentId);
      const followLabel = t.follow + (followTarget && followTarget.title ? ' · ' + followTarget.title : '');
      const subtitle = isAll
        ? t.subtitle + ' · ' + t.allSessions
        : (currentTitle ? t.subtitle + ' · ' + currentTitle : t.subtitle);

      return h('div', { className: 'tk-page', tabIndex: -1, onKeyDown },
        h('style', null, STYLE),
        h('div', { className: 'tk-head' },
          h('div', null,
            h('div', { className: 'tk-title-row' },
              h('h1', { className: 'tk-title' }, t.panel),
              h('button', {
                type: 'button',
                className: 'tk-build',
                title: t.debugHint,
                onClick: () => setDebug((value) => !value),
              }, BUILD)),
            h('p', { className: 'tk-sub' }, subtitle)),
          h('div', { className: 'tk-controls' },
            items.length > 0
              ? h('select', {
                className: 'tk-select',
                'aria-label': t.tasks,
                value: selectValue,
                onChange: (event) => setView(event.target.value),
              },
              h('option', { value: VIEW_ALL }, t.allSessions),
              h('option', { value: VIEW_FOLLOW }, followLabel),
              items.map((item) => {
                const id = sidOf(item);
                const project = teamOf(sessionsSnapshot, id);
                const list = project && Array.isArray(project.tasks)
                  ? project.tasks.filter((task) => task && task.status !== 'deleted')
                  : null;
                const suffix = list && list.length > 0 ? ' · ' + countLabel(countsOf(list), t) : '';
                return h('option', { key: id, value: id }, (item.title || id) + suffix);
              }))
              : null,
            isAll || enabled === null ? null : h('span', { className: 'tk-badge', 'data-on': enabled ? 'true' : 'false' },
              enabled ? t.modeOn : t.modeOff),
            h('select', {
              className: 'tk-select-sm',
              'aria-label': t.autoRefresh,
              value: String(autoSec),
              title: t.autoRefresh,
              onChange: (event) => setAutoSec(Number(event.target.value) || 0),
            },
            h('option', { value: '0' }, t.autoOff),
            h('option', { value: '10' }, t.auto10),
            h('option', { value: '30' }, t.auto30)),
            h('button', { type: 'button', className: 'tk-btn', onClick: refresh }, t.refresh))),
        toolbar,
        isAll ? null : h(Members, { members, t, lang }),
        body);
    }

    /** Keeps one bad render from blanking the main panel and retiring the entry. */
    class Boundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { failed: false, message: '' };
        this.reset = this.reset.bind(this);
      }

      static getDerivedStateFromError(error) {
        return { failed: true, message: messageOf(error) };
      }

      componentDidCatch(error) {
        try { console.error('[team-kanban] render failed', error); } catch (e) { /* ignore */ }
      }

      reset() {
        this.setState({ failed: false, message: '' });
      }

      render() {
        if (!this.state.failed) return this.props.children;
        const t = this.props.copy;
        return h('div', { className: 'tk-page' },
          h('style', null, STYLE),
          h('div', { className: 'tk-error', role: 'alert' },
            h('span', null, t.crashed + ': ' + this.state.message),
            h('button', { type: 'button', className: 'tk-inline-btn', onClick: this.reset }, t.retry)),
          h('div', { className: 'tk-note' }, t.crashedHint));
      }
    }

    function PanelIcon(props) {
      const size = props && typeof props.size === 'number' && props.size > 0 ? props.size : 16;
      const width = props && props.active ? 1.6 : 1.3;
      return h('svg', { viewBox: '0 0 16 16', width: size, height: size, 'aria-hidden': true, focusable: 'false' },
        h('rect', { x: 1.75, y: 2.25, width: 3.5, height: 11.5, rx: 1, fill: 'none', stroke: 'currentColor', strokeWidth: width }),
        h('rect', { x: 6.25, y: 2.25, width: 3.5, height: 8, rx: 1, fill: 'none', stroke: 'currentColor', strokeWidth: width }),
        h('rect', { x: 10.75, y: 2.25, width: 3.5, height: 5.5, rx: 1, fill: 'none', stroke: 'currentColor', strokeWidth: width }));
    }

    // -------------------------------------------------------------- plugin ---
    function apply(ctx) {
      const t = () => DICT[pickLang(ctx)] || DICT.en;

      ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
        name: 'sidebar.panellist',
        id: PANEL_ID,
        order: 20,
        label: () => t().panel,
      }, PanelIcon));

      ctx.slots.inject('main', () => ctx.slots.register({
        name: 'main',
        key: PANEL_ID,
        inject: () => ({ dsh: ctx }),
      }, (props) => h(Boundary, { copy: t() }, h(Panel, props))));
    }

    return { inject: ['slots', 'sessions', 'uiWorkspace'], apply };
  },
});
