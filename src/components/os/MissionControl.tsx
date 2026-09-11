import React, { useState, useEffect } from "react";
import { Play, Square, Activity, Folder, Plus, ChevronRight, Hash, Clock, Cpu, Layout, FileText, CheckCircle, Database, Bell, Search, Menu, Brain, Rocket, Package, Settings, BarChart2 } from "lucide-react";
import { ArtifactExplorer } from "./ArtifactExplorer";
import { AIExecutionOrganizerDashboard } from "../AIExecutionOrganizerDashboard";
import { IntegrationDepartmentView } from "../IntegrationDepartmentView";
import { ProductionDepartmentView } from "../ProductionDepartmentView";
import { ProductViewerHub } from "../ProductViewerHub";
import { PublishingDepartmentView } from "../PublishingDepartmentView";
import { ResearchCoreV3View } from "../ResearchCoreV3View";
import { RuntimeIntelligenceDashboard } from "../ril/RuntimeIntelligenceDashboard";
import { useMissionData } from "./MissionControlHooks";
import { LegacySystemShellWrapper } from "../LegacySystemShellWrapper";
import { LayoutGrid, Send } from "lucide-react";

export function MissionControl() {
  const [activeView, setActiveView] = useState<string>("mission");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const { missions, logs: systemLogs, engines } = useMissionData();

  const activeMission = missions.length > 0 ? missions[missions.length - 1] : null;
  const recentLogs = systemLogs.slice(-50).reverse();

  return (
    <div className="flex w-full h-full bg-[#050505] text-[#d1d5db] font-sans selection:bg-accent/20 selection:text-accent">
      {/* Left Navigation Rail */}
      <div className={`${sidebarOpen ? 'w-48' : 'w-16'} border-r border-glass flex flex-col items-center lg:items-start shrink-0 bg-surface z-10 transition-all duration-300 relative`}>
        <div className="w-full h-16 border-b border-glass flex items-center justify-center lg:justify-start lg:px-4 shrink-0">
          <div className="w-8 h-8 bg-accent rounded flex items-center justify-center shrink-0 cursor-pointer" onClick={() => setSidebarOpen(o => !o)}>
            <div className="w-4 h-4 bg-black rotate-45 flex items-center justify-center">
              <Cpu className="w-2.5 h-2.5 text-accent -rotate-45" />
            </div>
          </div>
          {sidebarOpen && <span className="ml-3 font-bold text-white tracking-wider animate-in fade-in">JBI OS</span>}
        </div>
        
        <div className="flex-1 w-full py-4 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
          <NavItem icon={<Activity />} label="Mission" active={activeView === "mission"} onClick={() => setActiveView("mission")} isOpen={sidebarOpen} />
          <NavItem icon={<Brain />} label="Research" active={activeView === "research"} onClick={() => setActiveView("research")} isOpen={sidebarOpen} />
          <NavItem icon={<Layout />} label="Production" active={activeView === "production"} onClick={() => setActiveView("production")} isOpen={sidebarOpen} />
          <NavItem icon={<Rocket />} label="Publishing" active={activeView === "publishing"} onClick={() => setActiveView("publishing")} isOpen={sidebarOpen} />
          <NavItem icon={<Package />} label="Products" active={activeView === "products"} onClick={() => setActiveView("products")} isOpen={sidebarOpen} />
          <NavItem icon={<Settings />} label="Integrations" active={activeView === "integrations"} onClick={() => setActiveView("integrations")} isOpen={sidebarOpen} />
          <NavItem icon={<Database />} label="Orchestrator" active={activeView === "orchestrator"} onClick={() => setActiveView("orchestrator")} isOpen={sidebarOpen} />
          <NavItem icon={<BarChart2 />} label="Intelligence" active={activeView === "intelligence"} onClick={() => setActiveView("intelligence")} isOpen={sidebarOpen} />
          <NavItem icon={<Folder />} label="Artifacts" active={activeView === "artifacts"} onClick={() => setActiveView("artifacts")} isOpen={sidebarOpen} />
          <NavItem icon={<Clock />} label="Timeline" active={activeView === "timeline"} onClick={() => setActiveView("timeline")} isOpen={sidebarOpen} />
          <NavItem icon={<Bell />} label="Alerts" active={activeView === "notifications"} onClick={() => setActiveView("notifications")} isOpen={sidebarOpen} />
          <div className="my-2 border-t border-glass mx-4"></div>
          <NavItem icon={<LayoutGrid />} label="Legacy OS" active={activeView === "legacy"} onClick={() => setActiveView("legacy")} isOpen={sidebarOpen} />
        </div>
        
        <div className="w-full p-4 border-t border-glass shrink-0">
          <div className={`w-full bg-white/5 border border-glass rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-white/10 transition-all group ${sidebarOpen ? 'h-10' : 'h-8'}`}>
            <Plus className="w-4 h-4 text-gray-400 group-hover:text-white shrink-0" />
            {sidebarOpen && <span className="text-xs font-mono font-bold text-gray-400 group-hover:text-white uppercase animate-in fade-in">New</span>}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <div className="h-16 border-b border-glass flex items-center justify-between px-6 shrink-0 bg-[#050505] z-10">
          <div className="flex items-center gap-4 flex-1">
             <div className="flex items-center gap-2 bg-white/5 border border-glass rounded-lg px-3 py-1.5 w-96 max-w-full">
               <Search className="w-4 h-4 text-gray-500" />
               <input 
                 type="text"
                 placeholder="Universal Search... (Ctrl+K)"
                 className="bg-transparent border-none text-xs font-mono text-white focus:outline-none flex-1"
               />
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative cursor-pointer" onClick={() => setActiveView("notifications")}>
               <Bell className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
               <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-[#050505]"></span>
             </div>
          </div>
        </div>

        {/* Dynamic Views */}
        <div className="flex-1 overflow-hidden relative">
          {activeView === "mission" && <ActiveMission mission={activeMission} engines={engines} logs={recentLogs} />}
          {activeView === "research" && <div className="h-full overflow-y-auto bg-surface"><ResearchCoreV3View researchV3={null} /></div>}
          {activeView === "production" && <div className="h-full overflow-y-auto bg-surface"><ProductionDepartmentView theme="dark" logs={systemLogs} addLog={() => {}} /></div>}
          {activeView === "publishing" && <div className="h-full overflow-y-auto bg-surface"><PublishingDepartmentView theme="dark" logs={systemLogs} addLog={() => {}} /></div>}
          {activeView === "products" && <div className="h-full overflow-y-auto bg-surface"><ProductViewerHub /></div>}
          {activeView === "integrations" && <div className="h-full overflow-y-auto bg-surface"><IntegrationDepartmentView theme="dark" logs={systemLogs} addLog={() => {}} /></div>}
          {activeView === "orchestrator" && <div className="h-full overflow-y-auto bg-surface"><AIExecutionOrganizerDashboard /></div>}
          {activeView === "intelligence" && <div className="h-full overflow-y-auto bg-surface"><RuntimeIntelligenceDashboard /></div>}
          {activeView === "artifacts" && (
            <div className="p-6 h-full">
              <ArtifactExplorer />
            </div>
          )}
          {activeView === "timeline" && (
            <div className="p-6 h-full flex flex-col">
              <h2 className="text-xl font-mono font-bold text-white mb-6 uppercase tracking-wider">Event Timeline</h2>
              <div className="flex-1 bg-[#080808] border border-glass rounded-xl p-4 overflow-auto custom-scrollbar">
                <div className="space-y-2 max-w-3xl mx-auto">
                  {recentLogs.map((log: any, i: number) => (
                    <div key={i} className="flex gap-4 p-3 rounded hover:bg-white/5 transition border-b border-glass">
                      <span className="text-xs text-gray-500 font-mono w-24 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className={`text-xs font-bold uppercase w-20 shrink-0 ${log.level === 'ERROR' ? 'text-rose-500' : log.level === 'WARN' ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {log.level}
                      </span>
                      <span className="text-xs text-accent font-mono w-32 shrink-0 truncate">
                        [{log.source}]
                      </span>
                      <span className="text-sm text-gray-300 font-mono break-words">
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeView === "notifications" && <NotificationCenter logs={recentLogs} />}
          {activeView === "legacy" && <LegacySystemShellWrapper />}
        </div>
      </div>
    </div>
  );
}

function NotificationCenter({ logs }: { logs: any[] }) {
  const notifs = logs.filter(l => l.level !== 'DEBUG').slice(0, 20);

  return (
    <div className="p-6 h-full flex flex-col">
      <h2 className="text-xl font-mono font-bold text-white mb-6 uppercase tracking-wider">Notification Center</h2>
      <div className="flex-1 bg-[#080808] border border-glass rounded-xl p-4 overflow-auto custom-scrollbar">
        <div className="space-y-2 max-w-3xl mx-auto">
          {notifs.map((n, i) => (
            <div key={i} className="p-4 rounded-xl border border-glass bg-white/[0.02] flex gap-4">
              <div className="mt-1">
                {n.level === 'INFO' && <Activity className="w-5 h-5 text-blue-400" />}
                {n.level === 'SUCCESS' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                {n.level === 'WARN' && <Clock className="w-5 h-5 text-amber-400" />}
                {n.level === 'ERROR' && <Square className="w-5 h-5 text-rose-400" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-white">[{n.source}] {n.level}</h4>
                  <span className="text-[10px] text-gray-500 font-mono">{new Date(n.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1 font-mono">{n.message}</p>
              </div>
            </div>
          ))}
          {notifs.length === 0 && (
             <div className="p-8 text-center text-gray-500 font-mono text-sm">No recent notifications.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, isOpen }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void; isOpen: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center ${isOpen ? 'justify-start px-4' : 'justify-center'} h-10 transition-all relative group cursor-pointer border-l-2 shrink-0 ${active ? 'border-accent bg-white/[0.03]' : 'border-transparent hover:bg-white/[0.02]'}`}
      title={label}
    >
      <div className={`w-5 h-5 flex items-center justify-center shrink-0 ${active ? 'text-accent' : 'text-gray-500 group-hover:text-gray-300'}`}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4" })}
      </div>
      {isOpen && (
        <span className={`ml-3 text-xs font-mono font-bold uppercase tracking-wider animate-in fade-in ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
          {label}
        </span>
      )}
    </button>
  );
}

function ActiveMission({ mission, engines, logs }: { mission: any, engines: any[], logs: any[] }) {
  const [prompt, setPrompt] = useState("");
  const isRunning = mission && mission.status !== "completed";
  
  const ceoLog = logs.find(l => l.source === 'CEO' || l.message.includes('CEO'));

  const submitMission = async () => {
    if (!prompt.trim()) return;
    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: prompt, description: "Auto-dispatched via Mission Control" })
      });
      setPrompt("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#050505]">
      {/* Header */}
      <div className="h-20 border-b border-glass px-8 flex items-center justify-between shrink-0 bg-surface/50 backdrop-blur-md sticky top-0 z-10">
        <div>
          <div className="text-[10px] text-accent font-mono font-bold uppercase tracking-[0.2em] mb-1">Active Mission</div>
          <h1 className="text-2xl font-sans font-bold text-white tracking-tight">{mission ? mission.prompt : "Awaiting Directive"}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end pr-4 border-r border-glass">
            <span className="text-[10px] text-gray-500 font-mono uppercase">Status</span>
            <span className={`text-sm font-mono font-bold flex items-center gap-1 ${isRunning ? 'text-emerald-400' : 'text-gray-400'}`}>
              {isRunning && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
              {mission ? mission.status.toUpperCase() : "IDLE"}
            </span>
          </div>
          <div className="flex flex-col items-end pr-4 border-r border-glass">
            <span className="text-[10px] text-gray-500 font-mono uppercase">Progress</span>
            <span className="text-sm text-white font-mono font-bold">{mission ? 'Active' : '0%'}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 font-mono uppercase">ID</span>
            <span className="text-sm text-white font-mono font-bold">{mission ? mission.id.substring(0, 8) : "---"}</span>
          </div>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto pb-20">
          
          {/* Main Workspace Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Mission Dispatcher */}
            <div className="border border-glass rounded-xl bg-white/[0.01] p-4 flex gap-4 items-center">
               <input 
                 type="text" 
                 value={prompt} 
                 onChange={e => setPrompt(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && submitMission()}
                 placeholder="Type your core directive here (e.g. Build a dropshipping store)..."
                 className="flex-1 bg-black/50 border border-glass rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent font-mono text-sm"
               />
               <button 
                 onClick={submitMission}
                 className="bg-accent text-black font-bold font-mono uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-white transition-colors flex items-center gap-2"
               >
                 Execute <Send className="w-4 h-4" />
               </button>
            </div>

            {/* CEO Feed */}
            <div className="border border-glass rounded-xl bg-white/[0.01] overflow-hidden">
              <div className="px-4 py-2 bg-black/40 border-b border-glass flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-accent/20 flex items-center justify-center">
                  <Activity className="w-3 h-3 text-accent" />
                </div>
                <span className="text-xs font-mono font-bold text-white uppercase">CEO Directives</span>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {ceoLog ? (
                  <>
                    <div className="text-sm text-gray-300 font-mono">
                      <span className="text-accent font-bold">CEO:</span> {ceoLog.message}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">{new Date(ceoLog.timestamp).toLocaleTimeString()}</div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500 font-mono text-center">No recent CEO directives.</div>
                )}
              </div>
            </div>

            {/* Department Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DepartmentCard name="Research" status={engines.find(e => e.id === 'research')?.status || "Offline"} icon={<Search />} items={["Market Scout", "Competitor Scanner"]} color="emerald" />
              <DepartmentCard name="Production" status={engines.find(e => e.id === 'production')?.status || "Offline"} icon={<Layout />} items={["Factory Worker", "Quality Check"]} color="accent" />
              <DepartmentCard name="Creative" status={engines.find(e => e.id === 'creative')?.status || "Offline"} icon={<Folder />} items={["Logo Design", "Brand Guidelines"]} color="accent" />
              <DepartmentCard name="Publishing" status={engines.find(e => e.id === 'publishing')?.status || "Offline"} icon={<Database />} items={["Shopify Store", "KDP Books"]} color="gray" />
            </div>

            {/* Active Workers View */}
            <div className="border border-glass rounded-xl bg-white/[0.01] overflow-hidden">
              <div className="px-4 py-2 bg-black/40 border-b border-glass flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center">
                  <Cpu className="w-3 h-3 text-blue-400" />
                </div>
                <span className="text-xs font-mono font-bold text-white uppercase">Active Workers (Engines)</span>
              </div>
              <div className="p-0">
                {engines.length > 0 ? engines.map((e, i) => (
                   <WorkerView key={i} name={e.name} dept={e.id} task={`Active Tasks: ${e.activeTasks || 0}`} provider="Gemini" status={e.status} />
                )) : (
                   <div className="p-4 text-center text-sm font-mono text-gray-500">No active engines found.</div>
                )}
              </div>
            </div>

          </div>

          {/* Right Sidebar - Info & Actions */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="border border-glass rounded-xl bg-white/[0.01] p-4">
              <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-4">Providers</h3>
              <div className="space-y-3">
                <ProviderStatus name="Gemini" usage="Live" health="Healthy" />
                <ProviderStatus name="OpenRouter" usage="Idle" health="Healthy" />
                <ProviderStatus name="Claude" usage="Disabled" health="Idle" />
              </div>
            </div>

            <div className="border border-glass rounded-xl bg-white/[0.01] p-4">
              <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-4">Recent System Logs</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                {logs.slice(0, 10).map((l, i) => (
                  <ArtifactLink key={i} name={l.message} type={l.source} />
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

function DepartmentCard({ name, status, icon, items, color }: { name: string, status: string, icon: React.ReactNode, items: string[], color: string }) {
  const isHealthy = status === 'HEALTHY' || status === 'RUNNING';
  
  return (
    <div className={`p-4 rounded-xl border ${isHealthy ? 'border-accent/30 bg-accent/5' : 'border-glass bg-white/[0.02]'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded flex items-center justify-center ${isHealthy ? 'text-accent bg-accent/10' : 'text-gray-400 bg-gray-500/10'}`}>
            {React.cloneElement(icon as React.ReactElement, { className: "w-3 h-3" })}
          </div>
          <span className="font-bold text-white text-sm">{name}</span>
        </div>
        <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${isHealthy ? 'text-accent bg-accent/10 border-accent/20' : 'text-gray-400 bg-gray-500/10'}`}>
          {status}
        </span>
      </div>
      <div className="space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
            {isHealthy ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-500 ml-0.5"></div>}
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkerView({ name, dept, task, provider, status }: any) {
  const isRunning = status === 'HEALTHY' || status === 'RUNNING';
  return (
    <div className="flex items-center justify-between p-3 border-b border-glass last:border-0 hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-accent animate-pulse' : 'bg-gray-500'}`}></div>
        <div>
          <div className="text-sm font-bold text-white">{name} <span className="text-[10px] text-gray-500 font-mono ml-2 uppercase bg-white/5 px-1.5 py-0.5 rounded">{dept}</span></div>
          <div className="text-xs text-gray-400 font-mono mt-0.5">{task}</div>
        </div>
      </div>
      <div className="text-right flex flex-col items-end">
        <span className="text-[10px] text-gray-500 font-mono uppercase bg-black/50 px-2 py-0.5 rounded border border-glass">{provider}</span>
      </div>
    </div>
  );
}

function ProviderStatus({ name, usage, health }: any) {
  return (
    <div className="flex items-center justify-between text-xs font-mono">
      <span className="text-gray-300">{name}</span>
      <div className="flex items-center gap-3">
        <span className="text-gray-500">{usage}</span>
        <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${health === 'Healthy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
          {health}
        </span>
      </div>
    </div>
  );
}

function ArtifactLink({ name, type }: any) {
  return (
    <div className="flex items-center gap-2 p-2 rounded hover:bg-white/[0.05] cursor-pointer transition-colors group">
      <FileText className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors shrink-0" />
      <span className="text-xs text-gray-400 group-hover:text-white transition-colors flex-1 truncate font-mono">{name}</span>
      <span className="text-[9px] font-mono text-gray-500 uppercase shrink-0">{type}</span>
    </div>
  );
}
