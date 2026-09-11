import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  TrendingUp, 
  Briefcase, 
  Search, 
  Settings, 
  Play, 
  Database, 
  RefreshCw, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle, 
  Flame, 
  ShieldAlert, 
  Users, 
  FileText, 
  Coins, 
  ArrowRight, 
  Maximize2, 
  Target, 
  Calendar,
  Lock,
  ChevronRight,
  TrendingDown,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function EvolutionDashboard() {
  const [subTab, setSubTab] = useState<"PORTFOLIO" | "DISCOVERY" | "EVOLUTION">("PORTFOLIO");
  
  // State from server
  const [evoData, setEvoData] = useState<any>(null);
  const [autonomicStore, setAutonomicStore] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [runningLoop, setRunningLoop] = useState<boolean>(false);
  const [runningMissionId, setRunningMissionId] = useState<string | null>(null);

  // Form states
  const [missionObjective, setMissionObjective] = useState<string>("Find underserved high-contrast study materials for late-night TOEFL candidates");
  const [missionPriority, setMissionPriority] = useState<"low" | "medium" | "high">("high");
  
  // Selected Subsidiary state
  const [selectedBizId, setSelectedBizId] = useState<string | null>(null);
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);

  // Fetch all state
  const syncState = async () => {
    try {
      setLoading(true);
      // Evolution
      const evoRes = await fetch("/api/evolution/overview");
      if (evoRes.ok) {
        const d = await evoRes.ok ? await evoRes.json() : null;
        setEvoData(d);
      }
      // Autonomic Store
      const autoRes = await fetch("/api/autonomic/overview");
      if (autoRes.ok) {
        const d = await autoRes.json();
        setAutonomicStore(d);
        if (d.portfolios?.length > 0 && !selectedBizId) {
          setSelectedBizId(d.portfolios[0].id);
        }
        if (d.missions?.length > 0 && !selectedMissionId) {
          setSelectedMissionId(d.missions[0].id);
        }
      }
    } catch (err) {
      console.error("Error syncing Autonomic/Evolution State:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncState();
  }, []);

  // Actions
  const runCeoLoop = async () => {
    try {
      setRunningLoop(true);
      const res = await fetch("/api/autonomic/think", { method: "POST" });
      if (res.ok) {
        await syncState();
      }
    } catch (err) {
      console.error("Error executing CEO Loop:", err);
    } finally {
      setRunningLoop(false);
    }
  };

  const runMaintenance = async () => {
    try {
      const res = await fetch("/api/autonomic/maintenance", { method: "POST" });
      if (res.ok) {
        await syncState();
      }
    } catch (err) {
      console.error("Error executing maintenance:", err);
    }
  };

  const createMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!missionObjective.trim()) return;
    try {
      const res = await fetch("/api/autonomic/mission/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programId: "prog_digital_products",
          objective: missionObjective,
          priority: missionPriority
        })
      });
      if (res.ok) {
        setMissionObjective("");
        const mission = await res.json();
        setSelectedMissionId(mission.id);
        await syncState();
      }
    } catch (err) {
      console.error("Error creating mission:", err);
    }
  };

  const runMission = async (missionId: string) => {
    try {
      setRunningMissionId(missionId);
      const res = await fetch("/api/autonomic/mission/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missionId })
      });
      if (res.ok) {
        await syncState();
      }
    } catch (err) {
      console.error("Error running mission:", err);
    } finally {
      setRunningMissionId(null);
    }
  };

  const executeGrowthTask = async (taskId: string) => {
    try {
      const res = await fetch("/api/autonomic/growth/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId })
      });
      if (res.ok) {
        await syncState();
      }
    } catch (err) {
      console.error("Error completing growth task:", err);
    }
  };

  const executeMutation = async (suggestion: any) => {
    try {
      const res = await fetch("/api/evolution/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestion })
      });
      if (res.ok) {
        await syncState();
      }
    } catch (err) {
      console.error("Error executing mutation:", err);
    }
  };

  const getActiveWorkers = () => evoData?.workers?.length || 12;
  const getActiveBusinesses = () => autonomicStore?.portfolios?.filter((p: any) => p.status === "ACTIVE")?.length || 0;
  const getTotalRevenue = () => autonomicStore?.portfolios?.reduce((sum: number, p: any) => sum + (p.status === "ACTIVE" ? p.revenue : 0), 0) || 0;

  return (
    <div className="flex flex-col gap-6 text-white text-left max-w-7xl mx-auto pb-10">
      
      {/* Header Info Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface border border-glass rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400">Autonomous Enterprise Engine</span>
          </div>
          <h1 className="text-2xl font-sans font-bold tracking-tight text-white">Organizational Autonomic OS</h1>
          <p className="text-xs text-gray-400 max-w-xl">
            A self-directed, self-improving organization that continuously scouts market gaps, designs digital assets, evaluates profitability through adversarial courts, and manages subsidiaries.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button 
            onClick={syncState} 
            className="p-2 bg-white/5 border border-glass rounded-xl hover:bg-white/10 transition-all cursor-pointer text-gray-400 hover:text-white"
            title="Refresh Ledger Database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button 
            onClick={runCeoLoop}
            disabled={runningLoop}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              runningLoop 
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" 
                : "bg-indigo-600 text-white hover:bg-indigo-500 border border-indigo-500 shadow-lg shadow-indigo-500/20"
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${runningLoop ? 'animate-pulse' : ''}`} />
            <span>{runningLoop ? "CEO Thinking..." : "Trigger CEO Cognitive Loop"}</span>
          </button>
        </div>
      </div>

      {/* Main Corporate Stats Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-glass rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <Coins className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Net Portfolio Revenue</span>
            <div className="text-xl font-mono font-bold text-indigo-300">${getTotalRevenue().toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-surface border border-glass rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <Briefcase className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Active Subsidiaries</span>
            <div className="text-xl font-mono font-bold text-emerald-400">{getActiveBusinesses()} / {autonomicStore?.portfolios?.length || 0}</div>
          </div>
        </div>

        <div className="bg-surface border border-glass rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Autonomous Agents</span>
            <div className="text-xl font-mono font-bold text-cyan-400">{getActiveWorkers()} Active</div>
          </div>
        </div>

        <div className="bg-surface border border-glass rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Corporate Quality Index</span>
            <div className="text-xl font-mono font-bold text-purple-400">94.2%</div>
          </div>
        </div>
      </div>

      {/* Corporate Strategy Tab Navigation */}
      <div className="flex border-b border-glass gap-1">
        <button
          onClick={() => setSubTab("PORTFOLIO")}
          className={`px-5 py-3 text-xs font-mono font-bold border-b-2 tracking-wider transition-all cursor-pointer ${
            subTab === "PORTFOLIO"
              ? "border-indigo-400 text-white bg-indigo-500/5"
              : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Subsidiary Portfolios</span>
          </div>
        </button>

        <button
          onClick={() => setSubTab("DISCOVERY")}
          className={`px-5 py-3 text-xs font-mono font-bold border-b-2 tracking-wider transition-all cursor-pointer ${
            subTab === "DISCOVERY"
              ? "border-indigo-400 text-white bg-indigo-500/5"
              : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Product Discovery Lab</span>
          </div>
        </button>

        <button
          onClick={() => setSubTab("EVOLUTION")}
          className={`px-5 py-3 text-xs font-mono font-bold border-b-2 tracking-wider transition-all cursor-pointer ${
            subTab === "EVOLUTION"
              ? "border-indigo-400 text-white bg-indigo-500/5"
              : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Organizational Evolution</span>
          </div>
        </button>
      </div>

      {/* Sub-tab Content Panels */}
      <div>
        {/* TAB 1: PORTFOLIO */}
        {subTab === "PORTFOLIO" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: List of Subsidiaries & CEO Operational Logs */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Subsidiaries List */}
              <div className="bg-surface border border-glass rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">ACTIVE PORTFOLIO</h3>
                  <button 
                    onClick={runMaintenance}
                    className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Run Daily Maintenance</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {autonomicStore?.portfolios && autonomicStore.portfolios.length > 0 ? (
                    autonomicStore.portfolios.map((biz: any) => (
                      <button
                        key={biz.id}
                        onClick={() => setSelectedBizId(biz.id)}
                        className={`w-full p-4 rounded-xl text-left border transition-all cursor-pointer block relative overflow-hidden ${
                          selectedBizId === biz.id
                            ? "bg-indigo-500/10 border-indigo-500/40 shadow-sm"
                            : "bg-white/[0.01] border-glass hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-sans font-bold text-sm text-white line-clamp-1">{biz.name}</span>
                          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold border ${
                            biz.health === "EXCELLENT" 
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
                              : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          }`}>
                            {biz.health}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-400 border-t border-white/[0.03] pt-2 mt-2">
                          <div>
                            <span className="text-gray-500 block text-[8px] uppercase">ACTIVE REVENUE</span>
                            <span className="text-white font-bold text-xs">${biz.revenue.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-[8px] uppercase">GROWTH SCALE</span>
                            <span className="text-emerald-400 font-bold text-xs">+{biz.growth}%</span>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic text-center py-4">No subsidiaries launched yet. Go to Discovery Lab or run CEO Cognitive Loop!</p>
                  )}
                </div>
              </div>

              {/* Autonomic CEO Live Log Ticker */}
              <div className="bg-surface border border-glass rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">CEO ACTION TICKER</h3>
                </div>

                <div className="bg-black/40 border border-glass rounded-lg p-3 h-64 overflow-y-auto font-mono text-[10px] text-gray-400 space-y-2.5">
                  {autonomicStore?.tickerLogs && autonomicStore.tickerLogs.length > 0 ? (
                    autonomicStore.tickerLogs.map((log: any) => (
                      <div key={log.id} className="border-b border-white/[0.02] pb-1.5 last:border-0">
                        <div className="flex justify-between text-gray-500 text-[8px] mb-0.5">
                          <span>[{log.source.toUpperCase()}]</span>
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-gray-200">{log.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No ticker events recorded.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Right Columns: Isolated Business Memory Sandbox & Analytics */}
            <div className="lg:col-span-2 space-y-6">
              {selectedBizId && autonomicStore?.memories && autonomicStore.memories[selectedBizId] ? (
                (() => {
                  const biz = autonomicStore.portfolios.find((p: any) => p.id === selectedBizId);
                  const mem = autonomicStore.memories[selectedBizId];
                  return (
                    <div className="space-y-6">
                      
                      {/* Business Summary Card */}
                      <div className="bg-surface border border-glass rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 blur-2xl rounded-full" />
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-glass mb-4">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono font-bold uppercase text-emerald-400">SUBSIDIARY SANDBOX MEMORY</span>
                            <h2 className="text-xl font-sans font-bold text-white">{biz.name}</h2>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs font-mono">
                            <div className="text-right">
                              <span className="text-gray-500 block text-[8px] uppercase">PARTITION STORAGE</span>
                              <span className="text-white font-semibold">biz_memory_{biz.id.substr(4, 4)}/</span>
                            </div>
                            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                              <Database className="w-4 h-4 text-emerald-400" />
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-300 italic max-w-2xl bg-white/[0.01] p-3 rounded-lg border border-glass">
                          &ldquo;{mem.brand}&rdquo;
                        </div>
                      </div>

                      {/* Isolated Memory Folder Tabs */}
                      <div className="bg-surface border border-glass rounded-xl p-5 space-y-4">
                        <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">PARTITIONED STORAGE STRUCTURE</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Customers & Reviews */}
                          <div className="bg-black/25 border border-glass rounded-xl p-4 space-y-3">
                            <span className="text-[10px] font-mono text-indigo-300 font-bold block uppercase border-b border-glass pb-1.5">Customers & Feedback</span>
                            <div className="space-y-2">
                              {mem.customers?.map((cust: string, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                                  <span>{cust}</span>
                                  <span className="text-emerald-400 font-bold">Verified Purchaser</span>
                                </div>
                              ))}
                              {mem.reviews?.map((rev: string, idx: number) => (
                                <p key={idx} className="text-[10px] text-gray-300 italic bg-white/5 p-2 rounded border border-glass">
                                  &ldquo;{rev}&rdquo;
                                </p>
                              ))}
                            </div>
                          </div>

                          {/* Brand Assets */}
                          <div className="bg-black/25 border border-glass rounded-xl p-4 space-y-3">
                            <span className="text-[10px] font-mono text-indigo-300 font-bold block uppercase border-b border-glass pb-1.5">Mined Competitive Assets</span>
                            <ul className="space-y-1.5">
                              {mem.assets?.map((asset: string, idx: number) => (
                                <li key={idx} className="text-[10px] font-mono text-gray-300 flex items-center gap-1.5">
                                  <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                  <span className="line-clamp-1">{asset}</span>
                                </li>
                              ))}
                              {mem.templates?.map((tpl: string, idx: number) => (
                                <li key={idx} className="text-[10px] font-mono text-gray-300 flex items-center gap-1.5">
                                  <FileText className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                                  <span className="line-clamp-1">{tpl}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Research Store */}
                          <div className="bg-black/25 border border-glass rounded-xl p-4 space-y-3">
                            <span className="text-[10px] font-mono text-indigo-300 font-bold block uppercase border-b border-glass pb-1.5">Opportunity Research Log</span>
                            <ul className="space-y-1.5 text-[10px] text-gray-400 list-disc list-inside space-y-1">
                              {mem.research?.map((res: string, idx: number) => (
                                <li key={idx} className="text-gray-300">{res}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Analytics Visualization */}
                          <div className="bg-black/25 border border-glass rounded-xl p-4 space-y-3">
                            <span className="text-[10px] font-mono text-indigo-300 font-bold block uppercase border-b border-glass pb-1.5">Live Metrics Audit</span>
                            
                            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mb-2">
                              <div className="bg-white/5 p-2 rounded">
                                <span className="text-gray-500 block text-[8px]">TOTAL DOWNLOADS</span>
                                <span className="text-white font-bold">{mem.analytics.downloads} files</span>
                              </div>
                              <div className="bg-white/5 p-2 rounded">
                                <span className="text-gray-500 block text-[8px]">STORE FAVORITES</span>
                                <span className="text-amber-400 font-bold">★ {mem.analytics.favorites} fans</span>
                              </div>
                            </div>

                            {/* Custom SVG Sales Chart */}
                            <div className="h-20 w-full relative border border-glass rounded-lg overflow-hidden p-1 bg-black/40">
                              <div className="absolute top-1 left-2 text-[8px] font-mono text-gray-500 uppercase">30-Day Sales Velocity</div>
                              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                  <linearGradient id="gradient-sales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                                  </linearGradient>
                                </defs>
                                <polyline
                                  fill="url(#gradient-sales)"
                                  stroke="none"
                                  points={`0,100 ${mem.analytics.sales.map((val: number, idx: number) => `${(idx / (mem.analytics.sales.length - 1)) * 100},${100 - (val / 10)}`).join(' ')} 100,100`}
                                />
                                <polyline
                                  fill="none"
                                  stroke="#818cf8"
                                  strokeWidth="2"
                                  points={mem.analytics.sales.map((val: number, idx: number) => `${(idx / (mem.analytics.sales.length - 1)) * 100},${100 - (val / 10)}`).join(' ')}
                                />
                              </svg>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Growth Strategy Engine Task List */}
                      <div className="bg-surface border border-glass rounded-xl p-5 space-y-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-indigo-400" />
                          <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">CORPORATE GROWTH MANAGER</h3>
                        </div>

                        <div className="space-y-3">
                          {autonomicStore?.growthTasks?.filter((t: any) => t.businessId === selectedBizId && t.status === "PENDING").length > 0 ? (
                            autonomicStore.growthTasks.filter((t: any) => t.businessId === selectedBizId && t.status === "PENDING").map((task: any) => (
                              <div key={task.id} className="p-4 bg-white/[0.01] border border-glass rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[8px] bg-indigo-500/15 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/25 uppercase font-mono font-bold">
                                      {task.category}
                                    </span>
                                    <span className="text-xs font-bold text-white">{task.title}</span>
                                  </div>
                                  <p className="text-[10px] text-gray-400">{task.description}</p>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/5 px-2.5 py-1 rounded border border-emerald-500/15">
                                    {task.estimatedImpact}
                                  </span>
                                  <button
                                    onClick={() => executeGrowthTask(task.id)}
                                    className="px-3 py-1.5 bg-indigo-600 text-white font-mono text-[10px] font-bold rounded-lg hover:bg-indigo-500 transition-all cursor-pointer"
                                  >
                                    Deploy Optimization
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-xs text-gray-500 italic bg-white/[0.01] rounded-xl border border-dashed border-glass">
                              No pending growth optimizations proposed yet for this subsidiary. Run CEO thinking or maintenance!
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })()
              ) : (
                <div className="bg-surface border border-glass rounded-xl p-10 text-center text-gray-500 italic">
                  Select a launched subsidiary to inspect its isolated business memory sandbox partition and analytics telemetry.
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: PRODUCT DISCOVERY LAB */}
        {subTab === "DISCOVERY" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Plan a Mission Form & Active Missions List */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Form to Plan Mission */}
              <div className="bg-surface border border-glass rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">PLAN NEW PRODUCT MISSION</h3>
                </div>

                <form onSubmit={createMission} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase">MISSION OBJECTIVE</label>
                    <textarea
                      value={missionObjective}
                      onChange={(e) => setMissionObjective(e.target.value)}
                      rows={3}
                      className="w-full bg-black/40 border border-glass rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
                      placeholder="e.g. Find high-margin digital template gaps for Etsy or Shopify..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase">PRIORITY GATE</label>
                      <select
                        value={missionPriority}
                        onChange={(e: any) => setMissionPriority(e.target.value)}
                        className="w-full bg-black/40 border border-glass rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-xl transition-all cursor-pointer border border-indigo-500 shadow-md shadow-indigo-500/10"
                      >
                        Plan Mission
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Missions List */}
              <div className="bg-surface border border-glass rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">PLANNED MISSIONS</h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {autonomicStore?.missions && autonomicStore.missions.length > 0 ? (
                    autonomicStore.missions.map((m: any) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMissionId(m.id)}
                        className={`w-full p-4 rounded-xl text-left border transition-all cursor-pointer block ${
                          selectedMissionId === m.id
                            ? "bg-indigo-500/10 border-indigo-500/40"
                            : "bg-white/[0.01] border-glass hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[8px] font-mono uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 px-1.5 py-0.5 rounded">
                            {m.priority} Priority
                          </span>
                          <span className={`text-[8px] font-mono uppercase font-bold ${
                            m.status === "EVALUATED" ? "text-emerald-400" : "text-amber-400 animate-pulse"
                          }`}>
                            {m.status}
                          </span>
                        </div>

                        <p className="text-xs text-white font-sans font-semibold line-clamp-2">{m.objective}</p>
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic text-center py-4">No product research missions scheduled.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Mission Findings, Opportunity Committee Room, and Execution Pack */}
            <div className="lg:col-span-2 space-y-6">
              {selectedMissionId ? (
                (() => {
                  const mission = autonomicStore.missions.find((m: any) => m.id === selectedMissionId);
                  const isRunning = runningMissionId === mission.id;
                  
                  const findings = autonomicStore.findings?.filter((f: any) => f.missionId === mission.id) || [];
                  const evaluation = autonomicStore.evaluations?.find((e: any) => e.missionId === mission.id);
                  const pack = autonomicStore.executionPackages?.find((p: any) => p.opportunityId === evaluation?.id);

                  return (
                    <div className="space-y-6">
                      
                      {/* Active Mission Header */}
                      <div className="bg-surface border border-glass rounded-xl p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono font-bold uppercase text-indigo-400">PRODUCT MISSION PLANNER</span>
                          <h2 className="text-lg font-sans font-bold text-white">{mission.objective}</h2>
                        </div>

                        {mission.status === "PLANNED" && (
                          <button
                            onClick={() => runMission(mission.id)}
                            disabled={isRunning}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/10 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>{isRunning ? "Investigating..." : "Execute Investigation"}</span>
                          </button>
                        )}
                        {mission.status !== "PLANNED" && (
                          <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Investigation Completed</span>
                          </span>
                        )}
                      </div>

                      {/* Workers Findings Panel */}
                      {findings.length > 0 && (
                        <div className="bg-surface border border-glass rounded-xl p-5 space-y-4">
                          <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">SUB-WORKER INDEPENDENT FINDINGS</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {findings.map((f: any) => (
                              <div key={f.id} className="bg-black/25 border border-glass rounded-xl p-4 space-y-3 text-left">
                                <div className="flex justify-between items-start border-b border-white/[0.03] pb-2">
                                  <div className="space-y-0.5">
                                    <span className="text-[8px] font-mono text-indigo-400 uppercase font-bold">SOURCE: {f.source}</span>
                                    <h4 className="text-xs font-bold text-white">{f.workerType}</h4>
                                  </div>
                                  <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20 font-bold">
                                    Confidence: {f.confidence}%
                                  </span>
                                </div>

                                <ul className="space-y-1.5">
                                  {f.evidence.map((ev: string, idx: number) => (
                                    <li key={idx} className="text-[10px] text-gray-300 flex items-start gap-1.5">
                                      <span className="text-indigo-400 font-extrabold mt-0.5">✓</span>
                                      <span>{ev}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Judicial Committee Room Panel */}
                      {evaluation && (
                        <div className="bg-surface border border-glass rounded-xl p-5 space-y-5">
                          <div className="flex justify-between items-center border-b border-glass pb-3">
                            <div className="flex items-center gap-2">
                              <ShieldAlert className="w-4 h-4 text-rose-400" />
                              <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">OPPORTUNITY JUDICIAL COMMITTEE ROOM</h3>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-mono block text-gray-500">FINAL VERDICT</span>
                              <span className={`text-sm font-mono font-bold uppercase ${
                                evaluation.decision === "GO" ? "text-emerald-400" : "text-rose-400"
                              }`}>
                                {evaluation.decision} (Confidence: {evaluation.overallConfidence}%)
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {evaluation.verdicts.map((v: any, idx: number) => (
                              <div key={idx} className="bg-black/20 border border-glass rounded-xl p-4 flex flex-col justify-between text-left relative overflow-hidden">
                                <div className="space-y-1.5">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-mono text-gray-500 uppercase">{v.judgeName}</span>
                                    <span className={`text-[8px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border ${
                                      v.approve 
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                    }`}>
                                      {v.approve ? "APPROVE" : "REJECT"}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-gray-300 italic font-sans leading-relaxed">&ldquo;{v.reason}&rdquo;</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Committee Summary Recommendation */}
                          <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl space-y-2 text-left">
                            <span className="text-[8px] font-mono font-bold uppercase text-indigo-400">ADVISORY DIRECTIVE RECOMMENDATION</span>
                            <p className="text-xs text-white font-semibold font-sans">&ldquo;{evaluation.recommendation}&rdquo;</p>
                            <p className="text-[10px] text-gray-400 leading-relaxed">{evaluation.summary}</p>
                          </div>
                        </div>
                      )}

                      {/* Product Launch Execution Package */}
                      {pack && (
                        <div className="bg-surface border border-glass rounded-xl p-5 space-y-6 text-left">
                          <div className="flex items-center gap-2 border-b border-glass pb-3">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">PRODUCT BRAND LAUNCH PACKAGE</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                            
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <span className="text-[8px] font-mono text-gray-500 uppercase">BRAND & PRICE POSITIONING</span>
                                <p className="text-[11px] text-gray-300 leading-relaxed">{pack.brandStrategy}</p>
                                <div className="text-[10px] font-mono text-emerald-400 font-bold mt-1.5">
                                  Recommended Pricing: ${pack.priceRecommendation.toFixed(2)} USD
                                </div>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[8px] font-mono text-gray-500 uppercase">VISUAL IDENTITY GUIDELINES</span>
                                <p className="text-[10px] text-gray-400 italic mb-2">Logo Concept: {pack.visualIdentity.logoConcept}</p>
                                <div className="flex gap-1.5">
                                  {pack.visualIdentity.colors.map((c: string, idx: number) => (
                                    <div key={idx} className="flex flex-col items-center gap-1">
                                      <div className="w-6 h-6 rounded border border-glass" style={{ backgroundColor: c }} />
                                      <span className="text-[7px] font-mono text-gray-500">{c}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="text-[9px] font-mono text-gray-400 mt-2">
                                  Typography Pairings: {pack.visualIdentity.typography.join(" + ")}
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <span className="text-[8px] font-mono text-gray-500 uppercase">SEO META SEARCH TAGS</span>
                                <div className="flex flex-wrap gap-1">
                                  {pack.seoKeywords.map((tag: string, idx: number) => (
                                    <span key={idx} className="bg-indigo-500/5 text-indigo-300 text-[8px] px-2 py-0.5 rounded border border-indigo-500/15">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4 border-t md:border-t-0 md:border-l border-glass pt-4 md:pt-0 md:pl-6">
                              <div className="space-y-2">
                                <span className="text-[8px] font-mono text-gray-500 uppercase">AUTONOMIC LAUNCH CHECKLIST</span>
                                <ul className="space-y-1.5 text-[10px] text-gray-300">
                                  {pack.launchChecklist.map((step: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                                      <CheckCircle className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="space-y-2 pt-2 border-t border-white/[0.03]">
                                <span className="text-[8px] font-mono text-gray-500 uppercase">FIRST RUN DIGITAL DELIVERABLES</span>
                                <ul className="space-y-1.5 text-[10px] text-gray-400 font-mono">
                                  {pack.firstDeliverables.map((del: string, idx: number) => (
                                    <li key={idx} className="flex items-center gap-1.5 text-gray-300">
                                      <FileText className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                                      <span>{del}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                          </div>
                        </div>
                      )}

                    </div>
                  );
                })()
              ) : (
                <div className="bg-surface border border-glass rounded-xl p-10 text-center text-gray-500 italic">
                  Select a product discovery mission to view sub-worker signal findings, adversarial committee debates, and generated brand packages.
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: ORGANIZATIONAL EVOLUTION */}
        {subTab === "EVOLUTION" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: List of Workers & Departments */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Workers Metrics and Prompt Versions */}
              <div className="bg-surface border border-glass rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">ORGANIZATION CHART & AGENTS</h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {evoData?.workers && evoData.workers.length > 0 ? (
                    evoData.workers.map((worker: any) => (
                      <div key={worker.id} className="p-3 bg-white/[0.01] border border-glass rounded-xl flex justify-between items-center">
                        <div className="space-y-0.5 text-left">
                          <span className="text-[8px] font-mono text-gray-500 uppercase">DEPT: {worker.departmentId}</span>
                          <h4 className="text-xs font-bold text-white">{worker.name}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] font-mono block text-gray-500">PROMPT VER</span>
                          <span className="text-[10px] font-mono text-indigo-400 font-bold">v{worker.promptVersion}.0</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-2 text-xs font-mono text-gray-400">
                      <div className="p-2.5 bg-white/5 border border-glass rounded flex justify-between">
                        <span>Chief Product Officer</span>
                        <span className="text-indigo-400 font-bold">v1.0</span>
                      </div>
                      <div className="p-2.5 bg-white/5 border border-glass rounded flex justify-between">
                        <span>Trend Hunter Agent</span>
                        <span className="text-indigo-400 font-bold">v2.0</span>
                      </div>
                      <div className="p-2.5 bg-white/5 border border-glass rounded flex justify-between">
                        <span>Demand Analyst Agent</span>
                        <span className="text-indigo-400 font-bold">v1.0</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Mutations Feed & Quality Trend Chart */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Custom SVG Trend Chart of Organizational quality */}
              <div className="bg-surface border border-glass rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">EVOLUTIONARY SYSTEM STABILITY TREND</h3>
                  <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                    Systemic Multi-Agent Improvement Map
                  </span>
                </div>

                {/* Customized SVG line chart */}
                <div className="h-44 w-full relative border border-glass rounded-xl overflow-hidden p-3 bg-black/40">
                  <div className="absolute top-2 left-3 text-[9px] font-mono text-gray-500 uppercase tracking-wider">Evolutionary Quality Convergence (Score % vs Cycles)</div>
                  <div className="absolute bottom-2 right-3 text-[8px] font-mono text-gray-500">12 Generations Complete</div>
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="glow-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Gridlines */}
                    <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="40" x2="100" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="60" x2="100" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                    <polyline
                      fill="url(#glow-grad)"
                      stroke="none"
                      points="0,100 10,88 20,85 30,89 40,91 50,88 60,92 70,94 80,92 90,95 100,97 100,100"
                    />
                    <polyline
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="2.5"
                      points="0,88 10,85 20,89 30,91 40,88 50,92 60,94 70,92 80,95 90,97 100,98"
                    />
                  </svg>
                </div>
              </div>

              {/* Policy Suggestions and Mutators list */}
              <div className="bg-surface border border-glass rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">ORGANIZATION ANALYZER SUGGESTIONS</h3>
                </div>

                <div className="space-y-3">
                  {evoData?.suggestions && evoData.suggestions.length > 0 ? (
                    evoData.suggestions.map((sug: any, idx: number) => (
                      <div key={idx} className="p-4 bg-white/[0.01] border border-glass rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20 font-mono font-bold">
                              {sug.type} MUTATION
                            </span>
                            <span className="text-xs font-bold text-white">{sug.title}</span>
                          </div>
                          <p className="text-[10px] text-gray-400 leading-relaxed">{sug.description}</p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/15">
                            +{sug.impactProjection}
                          </span>
                          <button
                            onClick={() => executeMutation(sug)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                          >
                            Apply Mutation
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-3">
                      <div className="p-4 bg-white/[0.01] border border-glass rounded-xl flex justify-between items-center">
                        <div className="space-y-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20 font-mono font-bold">PROMPT MUTATION</span>
                            <span className="text-xs font-bold text-white">Refine CPIO Mission Definition Prompts</span>
                          </div>
                          <p className="text-[10px] text-gray-400 leading-relaxed">Adjust initial ProductMission templates to include explicit Whop/Shopify price constraints.</p>
                        </div>
                        <button onClick={() => executeMutation({ type: "prompt", title: "Refine Prompts" })} className="px-3 py-1.5 bg-indigo-600 text-white font-mono text-[10px] font-bold rounded-lg hover:bg-indigo-500 cursor-pointer">Apply</button>
                      </div>

                      <div className="p-4 bg-white/[0.01] border border-glass rounded-xl flex justify-between items-center">
                        <div className="space-y-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20 font-mono font-bold">WORKFLOW MUTATION</span>
                            <span className="text-xs font-bold text-white">Parallelize Competitor & Trend Sourcing Pipelines</span>
                          </div>
                          <p className="text-[10px] text-gray-400 leading-relaxed">Boost efficiency index by triggering sub-worker scouts in parallel rather than series.</p>
                        </div>
                        <button onClick={() => executeMutation({ type: "workflow", title: "Parallelize Sourcing" })} className="px-3 py-1.5 bg-indigo-600 text-white font-mono text-[10px] font-bold rounded-lg hover:bg-indigo-500 cursor-pointer">Apply</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

    </div>
  );
}
