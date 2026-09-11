import React, { useState, useEffect } from "react";
import { Maximize2, Folder, Minimize2, X, Move, Activity, Clock, Database, Layers, Network, BookOpen, AlertTriangle } from "lucide-react";

export function RuntimeIntelligenceDashboard() {
  const [panels, setPanels] = useState<any[]>([
    { id: "org_explorer", title: "Organization Explorer", component: "OrgExplorer", x: 20, y: 20, w: 320, h: 500, zIndex: 1, visible: true },
    { id: "task_inspector", title: "Live Task Inspector", component: "TaskInspector", x: 360, y: 20, w: 400, h: 300, zIndex: 2, visible: true },
    { id: "event_timeline", title: "Event Timeline", component: "EventTimeline", x: 780, y: 20, w: 340, h: 400, zIndex: 3, visible: true },
    { id: "engine_registry", title: "Engine Registry", component: "EngineRegistry", x: 360, y: 340, w: 400, h: 300, zIndex: 4, visible: true },
    { id: "memory_browser", title: "Organization Memory", component: "MemoryBrowser", x: 20, y: 540, w: 320, h: 300, zIndex: 5, visible: true },
    { id: "mission_archive", title: "Mission Archive", component: "MissionArchive", x: 780, y: 440, w: 340, h: 400, zIndex: 6, visible: true }
  ]);
  
  const [activeZ, setActiveZ] = useState(10);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const bringToFront = (id: string) => {
    setActiveZ(prev => prev + 1);
    setPanels(panels.map(p => p.id === id ? { ...p, zIndex: activeZ + 1 } : p));
  };

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    const panel = panels.find(p => p.id === id);
    if (panel) {
      bringToFront(id);
      setDragging(id);
      setDragOffset({ x: e.clientX - panel.x, y: e.clientY - panel.y });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setPanels(panels.map(p => 
      p.id === dragging ? { ...p, x: Math.max(0, e.clientX - dragOffset.x), y: Math.max(0, e.clientY - dragOffset.y) } : p
    ));
  };

  const handlePointerUp = () => {
    setDragging(null);
  };

  const togglePanel = (id: string) => {
    setPanels(panels.map(p => p.id === id ? { ...p, visible: !p.visible } : p));
  };

  return (
    <div 
      className="relative w-full h-[calc(100vh-4rem)] bg-[#050505] overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Dock / Taskbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#0a0a0a] border border-glass rounded-full px-4 py-2 flex gap-4 z-[9999] shadow-2xl">
        {panels.map(p => (
          <button 
            key={p.id}
            onClick={() => { togglePanel(p.id); if(!p.visible) bringToFront(p.id); }}
            className={`flex items-center gap-2 text-[10px] font-mono px-3 py-1.5 rounded-full transition-all uppercase font-bold tracking-wider ${p.visible ? 'bg-accent/20 text-accent border border-accent/30' : 'text-gray-500 hover:text-white hover:bg-white/10 border border-transparent'}`}
          >
            {p.id === "org_explorer" && <Network className="w-3.5 h-3.5" />}
            {p.id === "task_inspector" && <Activity className="w-3.5 h-3.5" />}
            {p.id === "event_timeline" && <Clock className="w-3.5 h-3.5" />}
            {p.id === "engine_registry" && <Layers className="w-3.5 h-3.5" />}
            {p.id === "memory_browser" && <Database className="w-3.5 h-3.5" />}
            {p.id === "mission_archive" && <BookOpen className="w-3.5 h-3.5" />}
            {p.title}
          </button>
        ))}
      </div>

      {/* Workspace Panels */}
      {panels.map(p => p.visible && (
        <div 
          key={p.id}
          className={`absolute bg-[#0a0a0a] border ${dragging === p.id ? 'border-accent/50 shadow-[0_0_20px_rgba(var(--accent),0.2)]' : 'border-glass shadow-2xl'} rounded-xl overflow-hidden flex flex-col transition-[border-color,box-shadow]`}
          style={{ left: p.x, top: p.y, width: p.w, height: p.h, zIndex: p.zIndex }}
          onPointerDown={() => bringToFront(p.id)}
        >
          {/* Header */}
          <div 
            className="h-9 bg-white/[0.02] border-b border-glass flex items-center justify-between px-3 cursor-move shrink-0 select-none"
            onPointerDown={(e) => handlePointerDown(e, p.id)}
          >
            <span className="text-[10px] font-mono font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2 pointer-events-none">
              <Move className="w-3 h-3 text-gray-500" />
              {p.title}
            </span>
            <div className="flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); togglePanel(p.id); }} className="text-gray-500 hover:text-red-400 p-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          {/* Body */}
          <div className="flex-1 overflow-auto p-4 custom-scrollbar">
            {p.component === "OrgExplorer" && <OrgExplorer />}
            {p.component === "TaskInspector" && <TaskInspector />}
            {p.component === "EventTimeline" && <EventTimeline />}
            {p.component === "EngineRegistry" && <EngineRegistry />}
            {p.component === "MemoryBrowser" && <MemoryBrowser />}
            {p.component === "MissionArchive" && <MissionArchive />}
          </div>
        </div>
      ))}
    </div>
  );
}

// -------------------------------------------------------------------------------------
// Component Implementations
// -------------------------------------------------------------------------------------

function OrgExplorer() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/hierarchy").then(r => r.json()).then(d => setData(d.children || [])).catch(()=>null);
  }, []);

  const renderNode = (node: any, depth = 0) => (
    <div key={node.id} className="ml-2">
      <div className="flex items-center gap-2 py-1.5">
        {depth === 0 ? <Folder className="w-3.5 h-3.5 text-accent" /> : <Layers className="w-3 h-3 text-gray-500" />}
        <span className="text-xs font-mono font-medium text-gray-300">{node.name || node.id}</span>
      </div>
      {node.children && node.children.length > 0 && (
        <div className="border-l border-glass pl-2 ml-2">
          {node.children.map((child: any) => renderNode(child, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="text-[10px] font-mono text-accent uppercase tracking-widest border-b border-glass pb-2 mb-4">JustBuildIt OS Hierarchy</div>
      {data.length === 0 ? <div className="text-gray-500 text-xs">Loading...</div> : data.map(n => renderNode(n))}
    </div>
  );
}

function TaskInspector() {
  const [tasks, setTasks] = useState<any[]>([]);
  
  useEffect(() => {
    // Quick polling to get active tasks from projects
    const poll = setInterval(() => {
      fetch("/api/projects").then(r => r.json()).then(d => {
        const allTasks = d.flatMap((p:any) => p.tasks || []).filter((t:any) => t.status === "RUNNING" || t.status === "FAILED");
        setTasks(allTasks);
      }).catch(()=>null);
    }, 2000);
    return () => clearInterval(poll);
  }, []);

  if (tasks.length === 0) return <div className="text-gray-500 text-xs font-mono">No active or failed tasks currently under inspection.</div>;

  return (
    <div className="space-y-4">
      {tasks.map((task: any, i) => (
        <div key={i} className="border border-glass rounded bg-white/[0.02] p-3 text-xs font-mono">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold">{task.description || task.type}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] ${task.status === 'RUNNING' ? 'bg-accent/20 text-accent' : 'bg-red-500/20 text-red-400'}`}>
              {task.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-gray-400 mt-3">
            <div>Worker: <span className="text-gray-200">{task.workerType || "Agent"}</span></div>
            <div>Provider: <span className="text-gray-200">{task.provider || "System"}</span></div>
          </div>
          {task.status === "FAILED" && (
            <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400">
              <div className="font-bold mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> FAILED</div>
              <div>{task.error || "Provider failure or queue timeout"}</div>
              <div className="mt-2 text-[10px] text-red-300/70 uppercase">Recommendation: Wait 42 seconds or swap provider</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function EventTimeline() {
  const [timeline, setTimeline] = useState<any[]>([]);
  
  useEffect(() => {
    const poll = setInterval(() => {
      fetch("/api/ril/timeline").then(r => r.json()).then(d => setTimeline(d)).catch(()=>null);
    }, 2000);
    return () => clearInterval(poll);
  }, []);

  if (timeline.length === 0) return <div className="text-gray-500 text-xs font-mono">Waiting for events...</div>;

  return (
    <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-glass before:to-transparent">
      {timeline.slice(0, 50).map((t: any, i) => (
        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-4 h-4 rounded-full border border-glass bg-black shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
          <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-2 rounded border border-glass bg-white/[0.02]">
            <div className="flex items-center justify-between mb-1">
              <div className="font-bold text-accent text-[10px]">{t.type}</div>
              <div className="text-[9px] text-gray-500">{new Date(t.timestamp).toLocaleTimeString()}</div>
            </div>
            <div className="text-[10px] text-gray-400 truncate">
              {t.payload?.projectId || t.payload?.task?.id || "System Event"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EngineRegistry() {
  const [engines, setEngines] = useState<any[]>([]);
  
  useEffect(() => {
    const poll = setInterval(() => {
      fetch("/api/ril/engines").then(r => r.json()).then(d => setEngines(d)).catch(()=>null);
    }, 3000);
    return () => clearInterval(poll);
  }, []);

  return (
    <div className="space-y-2">
      {engines.map((eng: any, i) => (
        <div key={i} className="flex flex-col border border-glass rounded p-3 bg-white/[0.01]">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white font-mono">{eng.name}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-wider ${eng.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400' : eng.status === 'Offline' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
              {eng.status}
            </span>
          </div>
          {eng.warnings && eng.warnings.length > 0 && (
            <div className="mt-2 text-[10px] text-red-400/80 bg-red-500/10 p-2 rounded border border-red-500/20">
              {eng.warnings.map((w: string, j: number) => <div key={j}>• {w}</div>)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MemoryBrowser() {
  const [counts, setCounts] = useState<any>({});
  
  useEffect(() => {
    fetch("/api/graph").then(r => r.json()).then(d => {
      const c: any = { Projects: 0, Knowledge: 0, "Learned Rules": 0 };
      if (d.nodes) {
        c.Knowledge = d.nodes.length;
      }
      setCounts(c);
    }).catch(()=>null);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(counts).map(([k, v], i) => (
        <div key={i} className="p-3 border border-glass rounded bg-white/[0.02] flex flex-col gap-1 items-center justify-center">
          <span className="text-xl font-bold text-white font-mono">{v as number}</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">{k}</span>
        </div>
      ))}
    </div>
  );
}

function MissionArchive() {
  const [archives, setArchives] = useState<any[]>([]);
  
  useEffect(() => {
    fetch("/api/ril/archive").then(r => r.json()).then(d => setArchives(d)).catch(()=>null);
  }, []);

  if (archives.length === 0) return <div className="text-gray-500 text-xs font-mono">No missions archived yet.</div>;

  return (
    <div className="space-y-3">
      {archives.map((arc: any, i) => (
        <div key={i} className="p-3 border border-glass rounded bg-white/[0.02] text-xs font-mono flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-white font-bold truncate max-w-[150px]">{arc.title}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] ${arc.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : arc.status === 'FAILED' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>
              {arc.status}
            </span>
          </div>
          <div className="text-[10px] text-gray-500">
            <div>Start: {new Date(arc.startTime).toLocaleString()}</div>
            {arc.endTime && <div>Duration: {(arc.duration / 1000).toFixed(1)}s</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
