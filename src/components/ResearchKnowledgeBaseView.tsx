/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Database, GitFork, ShieldAlert, Award, Search, Sparkles, RefreshCw, 
  Clock, Zap, CheckCircle2, AlertTriangle, Play, HelpCircle, FileText, 
  MapPin, BookOpen, User, DollarSign, BarChart3, TrendingUp, Compass, ChevronRight, Activity, Flame, ShieldCheck,
  Users, Sliders
} from "lucide-react";

interface ResearchKnowledgeBaseViewProps {
  onRefresh: () => void;
}

export const ResearchKnowledgeBaseView: React.FC<ResearchKnowledgeBaseViewProps> = ({ onRefresh }) => {
  const [kbData, setKbData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "graph" | "evidence" | "sources" | "conflicts" | "semantic" | "cro" | "strategy" | "creative"
  >("creative"); // Default to "creative" to highlight the new department!
  
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>("printable planner");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Simulation state
  const [simTitle, setSimTitle] = useState<string>("Canva Template Factory");
  const [simTopic, setSimTopic] = useState<string>("notion_templates");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simSuccessMsg, setSimSuccessMsg] = useState<string>("");

  // Resolution states
  const [selectedWinnerId, setSelectedWinnerId] = useState<string>("");
  const [resolutionNotes, setResolutionNotes] = useState<string>("");
  const [resolvingId, setResolvingId] = useState<string>("");

  // CRO Missions state
  const [missions, setMissions] = useState<any[]>([]);
  const [selectedMissionId, setSelectedMissionId] = useState<string>("");
  const [missionGoal, setMissionGoal] = useState<string>("Determine whether AI Logo Packs are worth selling.");
  const [missionBudget, setMissionBudget] = useState<number>(150);
  const [isCreatingMission, setIsCreatingMission] = useState<boolean>(false);
  const [isExecutingMission, setIsExecutingMission] = useState<boolean>(false);

  // Senior Research Strategy states
  const [strategies, setStrategies] = useState<any[]>([]);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>("");
  const [strategyObjective, setStrategyObjective] = useState<string>("Validate customizable A5 disc-bound planner templates business.");
  const [strategyPriority, setStrategyPriority] = useState<"LOW" | "HIGH">("HIGH");
  const [isCreatingStrategy, setIsCreatingStrategy] = useState<boolean>(false);
  const [isExecutingStrategy, setIsExecutingStrategy] = useState<boolean>(false);

  // Creative Department Core states
  const [creativeMissions, setCreativeMissions] = useState<any[]>([]);
  const [selectedCreativeId, setSelectedCreativeId] = useState<string>("");
  const [creativeGoal, setCreativeGoal] = useState<string>("Mindful paper journal layouts containing pre-filled reflection grids.");
  const [isCreatingCreative, setIsCreatingCreative] = useState<boolean>(false);
  const [isExecutingCreative, setIsExecutingCreative] = useState<boolean>(false);

  // Fetch KB state
  const fetchKBData = async () => {
    try {
      const res = await fetch("/api/research/kb");
      if (res.ok) {
        const data = await res.json();
        setKbData(data);
      }
    } catch (err) {
      console.error("Error loading Knowledge Base:", err);
    }
  };

  // Fetch CRO missions
  const fetchMissions = async () => {
    try {
      const res = await fetch("/api/research/cro/missions");
      if (res.ok) {
        const data = await res.json();
        setMissions(data);
        if (data.length > 0 && !selectedMissionId) {
          setSelectedMissionId(data[data.length - 1].id);
        }
      }
    } catch (err) {
      console.error("Error loading CRO missions:", err);
    }
  };

  // Fetch Strategies
  const fetchStrategies = async () => {
    try {
      const res = await fetch("/api/research/strategy/list");
      if (res.ok) {
        const data = await res.json();
        setStrategies(data);
        if (data.length > 0 && !selectedStrategyId) {
          setSelectedStrategyId(data[data.length - 1].id);
        }
      }
    } catch (err) {
      console.error("Error loading strategies:", err);
    }
  };

  // Fetch Creative Missions
  const fetchCreativeMissions = async () => {
    try {
      const res = await fetch("/api/creative/missions");
      if (res.ok) {
        const data = await res.json();
        setCreativeMissions(data);
        if (data.length > 0 && !selectedCreativeId) {
          setSelectedCreativeId(data[data.length - 1].id);
        }
      }
    } catch (err) {
      console.error("Error loading creative missions:", err);
    }
  };

  useEffect(() => {
    fetchKBData();
    fetchMissions();
    fetchStrategies();
    fetchCreativeMissions();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResult(null);
    try {
      const res = await fetch("/api/research/kb/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery })
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResult(data);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResolve = async (conflictId: string, winnerFactId: string) => {
    if (!winnerFactId) return;
    setResolvingId(conflictId);
    try {
      const res = await fetch("/api/research/kb/conflict/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conflictId,
          winnerFactId,
          notes: resolutionNotes || "Resolved manually in Knowledge Dashboard"
        })
      });
      if (res.ok) {
        setResolutionNotes("");
        setSelectedWinnerId("");
        await fetchKBData();
        onRefresh();
      }
    } catch (err) {
      console.error("Resolution error:", err);
    } finally {
      setResolvingId("");
    }
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    setSimSuccessMsg("");
    try {
      const res = await fetch("/api/research/kb/simulate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: simTitle,
          topic: simTopic,
          findings: [
            { statement: `${simTitle} commands 88% gross margin via automated export`, value: 88, confidence: 0.95 },
            { statement: "High demand recorded on Etsy, competing directly with Shopify", value: "high", confidence: 0.85 }
          ],
          lessons: [
            `Utilized lightweight responsive containers inside ${simTitle} to maintain WCAG contrast standard.`
          ]
        })
      });
      if (res.ok) {
        setSimSuccessMsg("Continuous Knowledge Extractor ran pipeline successfully! Reusable knowledge cataloged.");
        await fetchKBData();
        onRefresh();
      }
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleCreateMission = async () => {
    if (!missionGoal.trim()) return;
    setIsCreatingMission(true);
    try {
      const res = await fetch("/api/research/cro/mission/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: missionGoal, budget: missionBudget })
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedMissionId(data.id);
        await fetchMissions();
      }
    } catch (err) {
      console.error("Error creating mission:", err);
    } finally {
      setIsCreatingMission(false);
    }
  };

  const handleExecuteMission = async (id: string) => {
    setIsExecutingMission(true);
    try {
      const res = await fetch("/api/research/cro/mission/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missionId: id })
      });
      if (res.ok) {
        await fetchMissions();
        await fetchKBData();
        onRefresh();
      }
    } catch (err) {
      console.error("Error executing mission:", err);
    } finally {
      setIsExecutingMission(false);
    }
  };

  if (!kbData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-black/30 border border-glass rounded-2xl">
        <RefreshCw className="w-8 h-8 text-[#14b8a6] animate-spin mb-3" />
        <p className="text-xs font-mono text-gray-400">Loading Organizational Knowledge Base v1.0...</p>
      </div>
    );
  }

  const unresolvedConflicts = kbData.conflicts?.filter((c: any) => c.status === "unresolved") || [];
  const selectedMission = missions.find(m => m.id === selectedMissionId);

  return (
    <div className="space-y-6 w-full text-left">
      
      {/* HEADER BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-teal-950/20 to-black/40 border border-glass/80 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#14b8a6]/10 border border-[#14b8a6]/30 flex items-center justify-center text-[#14b8a6] shadow-[0_0_15px_rgba(20,184,166,0.1)]">
            <Database className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider">Research Brain & Knowledge Base</h3>
              <span className="text-[8px] font-mono font-bold bg-[#14b8a6]/20 text-[#14b8a6] border border-[#14b8a6]/40 px-2 py-0.5 rounded-full uppercase">
                CRO Supervisor Mode
              </span>
            </div>
            <p className="text-[10.5px] text-gray-400">
              Adapts investigation plans, checks completeness coverage, tests competing hypotheses, clashing claims, and propagates causal DAG metrics.
            </p>
          </div>
        </div>

        {/* TABS CONTROLS */}
        <div className="flex flex-wrap gap-1 bg-black/60 p-1 rounded-xl border border-glass/60">
          {(
            [
              { id: "creative", label: "Creative Dept 🔥", icon: Flame },
              { id: "strategy", label: "Strategy Engine 🧭", icon: Compass },
              { id: "cro", label: "CRO Missions", icon: Award },
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "graph", label: "Topic Graph", icon: GitFork },
              { id: "evidence", label: "Evidence Store", icon: BookOpen },
              { id: "sources", label: "Sources", icon: Zap },
              { id: "conflicts", label: `Conflicts (${unresolvedConflicts.length})`, icon: ShieldAlert, alert: unresolvedConflicts.length > 0 },
              { id: "semantic", label: "Semantic Lessons", icon: Sparkles }
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9.5px] font-mono font-bold uppercase transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#14b8a6] text-black shadow-lg shadow-[#14b8a6]/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${('alert' in tab && (tab as any).alert) && !isActive ? "text-amber-400 animate-pulse" : ""}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CREATIVE DEPARTMENT CORE TAB (Modules 01-15) */}
      {activeTab === "creative" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN: DEFINE CREATIVE DIRECTION & HISTORY */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-amber-950/20 to-black/40 border border-amber-500/15 p-5 rounded-2xl text-left space-y-4">
                <div className="flex items-center gap-2 border-b border-glass pb-2.5">
                  <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                  <h4 className="text-xs font-mono font-bold text-white uppercase">Propose Creative Goal</h4>
                </div>
                
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  The **Creative Department** moves beyond simple AI prompting. It compiles Brand DNA and Design Systems, proposes contrasting concepts, runs critic reviews, and applies humanization offset filters.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[8px] font-mono text-gray-400 uppercase mb-1">Target Product Goal</label>
                    <textarea
                      value={creativeGoal}
                      onChange={(e) => setCreativeGoal(e.target.value)}
                      rows={3}
                      placeholder="e.g., Mindful paper journal layouts containing pre-filled reflection grids."
                      className="w-full bg-black/60 border border-glass rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-500 placeholder:text-gray-700 font-sans"
                    />
                  </div>

                  <button
                    onClick={async () => {
                      if (!creativeGoal.trim()) return;
                      setIsCreatingCreative(true);
                      try {
                        const res = await fetch("/api/creative/mission/create", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ goal: creativeGoal })
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setSelectedCreativeId(data.id);
                          await fetchCreativeMissions();
                        }
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setIsCreatingCreative(false);
                      }
                    }}
                    disabled={isCreatingCreative}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black text-[10px] font-mono font-extrabold tracking-wider rounded-xl cursor-pointer transition-all uppercase disabled:opacity-50"
                  >
                    {isCreatingCreative ? "Compiling Brand DNA..." : "Compile Brand DNA & Guidelines"}
                  </button>
                </div>
              </div>

              {/* MISSION LOGS LIST */}
              <div className="bg-black/40 border border-glass/80 p-5 rounded-2xl text-left space-y-3.5">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block border-b border-glass pb-2">
                  Active Creative Directions
                </span>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {creativeMissions.length === 0 ? (
                    <p className="text-[10px] text-gray-600 font-mono italic text-center py-4">No active creative directions Compiled yet.</p>
                  ) : (
                    creativeMissions.map((mission) => {
                      const isSelected = mission.id === selectedCreativeId;
                      return (
                        <button
                          key={mission.id}
                          onClick={() => setSelectedCreativeId(mission.id)}
                          className={`w-full p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
                            isSelected
                              ? "bg-amber-950/15 border-amber-500/40 shadow-lg shadow-amber-500/5"
                              : "bg-black/20 border-glass/30 hover:border-glass"
                          }`}
                        >
                          <div className="flex justify-between items-center text-[9px] font-mono">
                            <span className="text-amber-400 font-bold uppercase">ID: {mission.id.split("_")[1]}</span>
                            <span className={`px-1.5 py-0.5 rounded uppercase font-bold text-[8px] ${
                              mission.status === "delivered" 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}>
                              {mission.status}
                            </span>
                          </div>
                          <p className="text-[11px] font-sans text-gray-300 font-bold line-clamp-1">{mission.goal}</p>
                          <div className="text-[8px] font-mono text-gray-500 flex justify-between">
                            <span>Style: {mission.brandDNA?.style[0] || "Custom"}</span>
                            <span>{new Date(mission.startedAt).toLocaleTimeString()}</span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: MAIN WORKSPACE PREVIEW (2 COLUMNS) */}
            <div className="lg:col-span-2 space-y-6">
              {(() => {
                const creative = creativeMissions.find(m => m.id === selectedCreativeId);
                if (!creative) {
                  return (
                    <div className="flex flex-col items-center justify-center py-20 bg-black/20 border border-dashed border-glass rounded-2xl h-full">
                      <Flame className="w-8 h-8 text-amber-500/30 mb-3" />
                      <p className="text-xs font-mono text-gray-500 italic">Select a Creative Direction on the left to view workspace.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-6">
                    {/* TOP HERO PREVIEW */}
                    <div className="bg-gradient-to-br from-amber-950/20 to-black/60 border border-amber-500/20 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl shadow-black/80 text-left">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[9px] font-bold uppercase tracking-wider">
                          <Flame className="w-3.5 h-3.5 animate-pulse" />
                          Creative Department Workspace (Delivering 10/10 Creative Cognition)
                        </div>
                        <h3 className="text-sm font-sans font-extrabold text-white">{creative.goal}</h3>
                        <p className="text-[10px] font-mono text-gray-400">
                          Active Trends: {creative.styleEvolution?.activeTrends.join(" • ") || "Minimalism"}
                        </p>
                      </div>

                      {creative.status !== "delivered" ? (
                        <button
                          onClick={async () => {
                            setIsExecutingCreative(true);
                            try {
                              const res = await fetch("/api/creative/mission/execute", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ missionId: creative.id })
                              });
                              if (res.ok) {
                                await fetchCreativeMissions();
                              }
                            } catch (err) {
                              console.error(err);
                            } finally {
                              setIsExecutingCreative(false);
                            }
                          }}
                          disabled={isExecutingCreative}
                          className="px-4 py-2 bg-amber-500 text-black rounded-xl text-[10px] font-mono font-extrabold hover:bg-amber-400 transition-all cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          {isExecutingCreative ? "Refinement Running..." : "Execute Creative refinement"}
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Fully Compiled & Audited
                        </span>
                      )}
                    </div>

                    {/* MODULE 1: CREATIVE PLAN (BLUEPRINT) */}
                    {creative.creativePlan ? (
                      <div className="bg-gradient-to-r from-amber-950/15 to-stone-900/40 border border-amber-500/30 p-5 rounded-2xl text-left space-y-4">
                        <div className="flex justify-between items-center border-b border-glass pb-2.5">
                          <div className="flex items-center gap-2">
                            <Compass className="w-4 h-4 text-amber-500 animate-pulse" />
                            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Module 01: Creative Director Blueprint</h4>
                          </div>
                          <span className="text-[8px] font-mono font-extrabold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 uppercase">No designing begins without a Plan</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                          <div className="space-y-2">
                            <div>
                              <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest block">Operational Objective</span>
                              <p className="text-gray-200 leading-relaxed font-medium mt-0.5">{creative.creativePlan.objective}</p>
                            </div>
                            <div>
                              <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest block">Emotional Goal Profile</span>
                              <p className="text-amber-400 leading-relaxed font-semibold mt-0.5">"{creative.creativePlan.emotionalGoal}"</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3 text-[10px] font-mono">
                            <div className="p-2.5 bg-black/40 border border-glass rounded-xl">
                              <span className="text-gray-500 block uppercase text-[8px] font-bold">Visual Priorities</span>
                              <ul className="list-disc pl-3 text-white mt-1 space-y-0.5">
                                {creative.creativePlan.visualPriority.map((p: string, i: number) => <li key={i}>{p}</li>)}
                              </ul>
                            </div>
                            <div className="p-2.5 bg-rose-950/20 border border-rose-500/20 rounded-xl">
                              <span className="text-rose-400 block uppercase text-[8px] font-bold">Forbidden Rules</span>
                              <ul className="list-disc pl-3 text-gray-300 mt-1 space-y-0.5">
                                {creative.creativePlan.forbidden.map((p: string, i: number) => <li key={i}>{p}</li>)}
                              </ul>
                            </div>
                            <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
                              <span className="text-emerald-400 block uppercase text-[8px] font-bold">Success Criteria</span>
                              <ul className="list-disc pl-3 text-gray-300 mt-1 space-y-0.5">
                                {creative.creativePlan.successCriteria.map((p: string, i: number) => <li key={i}>{p}</li>)}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 bg-black/20 border border-dashed border-glass rounded-2xl text-center">
                        <p className="text-xs font-mono text-gray-500 italic">Plan currently compiling. Trigger refinement to launch Creative Plan blueprint.</p>
                      </div>
                    )}

                    {/* TWO COLUMN INTERACTIVE METRICS: BRAND DNA & MARKET STYLE ALIGNMENT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* BRAND DNA */}
                      <div className="bg-black/40 border border-glass p-5 rounded-2xl text-left space-y-4">
                        <div className="flex items-center gap-2 border-b border-glass pb-2">
                          <Award className="w-4 h-4 text-amber-500" />
                          <h4 className="text-xs font-mono font-bold text-white uppercase">Brand DNA Core (Module 02)</h4>
                        </div>

                        <div className="space-y-3.5">
                          <div>
                            <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest block mb-1">Personality Attributes</span>
                            <div className="flex flex-wrap gap-1">
                              {creative.brandDNA?.personality.map((p: string) => (
                                <span key={p} className="text-[9.5px] font-mono text-amber-400 bg-amber-950/20 px-2 py-0.5 rounded border border-amber-500/10">{p}</span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest block mb-1">Emotional Triggers</span>
                            <div className="flex flex-wrap gap-1">
                              {creative.brandDNA?.emotion.map((e: string) => (
                                <span key={e} className="text-[9.5px] font-mono text-white bg-white/5 px-2 py-0.5 rounded border border-glass">{e}</span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest block mb-1">Voice & Tone guidelines</span>
                            <div className="flex flex-wrap gap-1">
                              {creative.brandDNA?.voice.map((v: string) => (
                                <span key={v} className="text-[9.5px] font-mono text-gray-300 bg-black/40 px-2 py-0.5 rounded border border-glass/50">{v}</span>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-glass/40 text-[10px] font-mono text-gray-400">
                            <div>
                              <span className="text-gray-500 block uppercase text-[8px] font-bold">Target Audience</span>
                              <span className="text-white font-semibold leading-tight block mt-0.5">{creative.brandDNA?.audience.join(", ")}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 block uppercase text-[8px] font-bold">Design values</span>
                              <span className="text-white font-semibold leading-tight block mt-0.5">{creative.brandDNA?.values.join(", ")}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* MODULE 7: MARKET STYLE MATCHING */}
                      {creative.styleAlignment && (
                        <div className="bg-black/40 border border-glass p-5 rounded-2xl text-left space-y-4">
                          <div className="flex items-center gap-2 border-b border-glass pb-2">
                            <Sliders className="w-4 h-4 text-amber-500" />
                            <h4 className="text-xs font-mono font-bold text-white uppercase">Module 07: Market Style Matcher</h4>
                          </div>

                          <div className="space-y-3 font-sans">
                            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                              <div className="p-2 bg-black/40 border border-glass rounded-xl">
                                <span className="text-gray-500 block uppercase text-[8px] font-bold">Market Category</span>
                                <span className="text-white font-semibold block mt-0.5 truncate">{creative.styleAlignment.marketCategory}</span>
                              </div>
                              <div className="p-2 bg-black/40 border border-glass rounded-xl">
                                <span className="text-gray-500 block uppercase text-[8px] font-bold">Primary Aesthetic</span>
                                <span className="text-amber-400 font-bold block mt-0.5 truncate">{creative.styleAlignment.primaryAesthetic}</span>
                              </div>
                              <div className="p-2 bg-black/40 border border-glass rounded-xl">
                                <span className="text-gray-500 block uppercase text-[8px] font-bold">Density Preference</span>
                                <span className="text-white font-bold block mt-0.5 capitalize">{creative.styleAlignment.densityPreference}</span>
                              </div>
                              <div className="p-2 bg-black/40 border border-glass rounded-xl">
                                <span className="text-gray-500 block uppercase text-[8px] font-bold">Recommended Colors</span>
                                <div className="flex gap-1 mt-1">
                                  {creative.styleAlignment.recommendedPalette.map((col: string, idx: number) => (
                                    <div key={idx} className="w-3.5 h-3.5 rounded border border-white/25" style={{ backgroundColor: col }} title={col} />
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="p-2.5 bg-black/40 border border-glass rounded-xl text-[11px] font-mono">
                              <span className="text-gray-500 block uppercase text-[8px] font-bold">Demographic Typography Vibe</span>
                              <span className="text-gray-200 mt-1 block leading-normal">{creative.styleAlignment.typographyVibe}</span>
                            </div>

                            <div className="p-2.5 bg-amber-950/10 border border-amber-500/10 rounded-xl text-[10.5px]">
                              <span className="text-amber-500 block uppercase font-mono text-[8px] font-bold mb-0.5">Vibe Justification</span>
                              <p className="text-gray-400 leading-normal italic">"{creative.styleAlignment.vibeJustification}"</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* MODULE 10: COMPLETE DESIGN SYSTEM GENERATOR */}
                    {creative.designLanguage?.designSystem && (
                      <div className="bg-black/40 border border-glass p-5 rounded-2xl text-left space-y-4">
                        <div className="flex items-center gap-2 border-b border-glass pb-2">
                          <Activity className="w-4 h-4 text-amber-500" />
                          <h4 className="text-xs font-mono font-bold text-white uppercase">Module 10: Complete Design Language System (One Source of Truth)</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px] font-mono">
                          <div className="p-3 bg-black/40 border border-glass rounded-xl space-y-2">
                            <span className="text-amber-400 block uppercase text-[8px] font-bold border-b border-glass/40 pb-1">Media Vibe & Styling</span>
                            <div className="space-y-1.5">
                              <div>
                                <span className="text-gray-500 block text-[8px] uppercase">Illustration Style</span>
                                <p className="text-gray-300 leading-snug">{creative.designLanguage.designSystem.illustrationStyle}</p>
                              </div>
                              <div>
                                <span className="text-gray-500 block text-[8px] uppercase">Photography Art Vibe</span>
                                <p className="text-gray-300 leading-snug">{creative.designLanguage.designSystem.photographyVibe}</p>
                              </div>
                            </div>
                          </div>

                          <div className="p-3 bg-black/40 border border-glass rounded-xl space-y-2">
                            <span className="text-amber-400 block uppercase text-[8px] font-bold border-b border-glass/40 pb-1">UI Elements Blueprint</span>
                            <div className="space-y-1.5 text-[9.5px]">
                              <div>Forms: <span className="text-gray-300">{creative.designLanguage.designSystem.uiElements.forms}</span></div>
                              <div>Tables: <span className="text-gray-300">{creative.designLanguage.designSystem.uiElements.tables}</span></div>
                              <div>Buttons: <span className="text-gray-300">{creative.designLanguage.designSystem.uiElements.buttons}</span></div>
                              <div>Cards: <span className="text-gray-300">{creative.designLanguage.designSystem.uiElements.cards}</span></div>
                              <div>Dialogs: <span className="text-gray-300">{creative.designLanguage.designSystem.uiElements.dialogs}</span></div>
                            </div>
                          </div>

                          <div className="p-3 bg-black/40 border border-glass rounded-xl space-y-2">
                            <span className="text-amber-400 block uppercase text-[8px] font-bold border-b border-glass/40 pb-1">Multimodal Extensions</span>
                            <div className="space-y-1.5">
                              <div>
                                <span className="text-gray-500 block text-[8px] uppercase">Color Scheme Variations</span>
                                <p className="text-gray-300">{creative.designLanguage.designSystem.darkLightVariations}</p>
                              </div>
                              <div>
                                <span className="text-gray-500 block text-[8px] uppercase">Print & transactional Emails</span>
                                <p className="text-gray-300">{creative.designLanguage.designSystem.printAndEmailVibe}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* MODULE 5: COMPONENT GENOME */}
                    {creative.componentGenomes && creative.componentGenomes.length > 0 && (
                      <div className="bg-black/40 border border-glass p-5 rounded-2xl text-left space-y-4">
                        <div className="flex items-center gap-2 border-b border-glass pb-2">
                          <Sliders className="w-4 h-4 text-amber-500" />
                          <h4 className="text-xs font-mono font-bold text-white uppercase">Module 05: Component Genomes (Pristine Visual Micro-Specs)</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {creative.componentGenomes.map((genome: any, idx: number) => (
                            <div key={idx} className="p-4 bg-black/40 border border-glass rounded-xl space-y-3 font-mono text-[10px]">
                              <div className="flex justify-between items-center border-b border-glass/30 pb-1.5">
                                <span className="text-amber-400 font-extrabold uppercase">{genome.componentType} Genome</span>
                                <span className="text-emerald-400 font-bold">Usability: {genome.usabilityScore}/100</span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-gray-400">
                                <div>Padding Spec: <span className="text-white font-semibold">{genome.padding}</span></div>
                                <div>Corner Radius: <span className="text-white font-semibold">{genome.cornerRadius}</span></div>
                                <div>Shadow Frame: <span className="text-white font-semibold truncate block" title={genome.shadow}>{genome.shadow}</span></div>
                                <div>Text Type: <span className="text-white font-semibold block truncate" title={genome.typographyStyle}>{genome.typographyStyle}</span></div>
                                <div>Animation Curve: <span className="text-amber-500 font-semibold truncate block" title={genome.animationCurve}>{genome.animationCurve}</span></div>
                                <div>Contrast Ratio: <span className="text-white font-semibold">{genome.contrastRatio}</span></div>
                              </div>

                              <div className="pt-2 border-t border-glass/20 flex justify-between items-center text-[9px]">
                                <span className="text-gray-500">Accessibility Rating: {(genome.accessibilityRating * 100).toFixed(0)}%</span>
                                <span className="text-gray-300">Hover: {genome.hoverBehavior}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TWO COLUMN GRID: INSPIRATION COLLECTOR & MOODBOARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* MODULE 3: INSPIRATION COLLECTOR */}
                      <div className="bg-black/40 border border-glass p-5 rounded-2xl text-left space-y-4">
                        <div className="flex items-center gap-2 border-b border-glass pb-2">
                          <Search className="w-4 h-4 text-amber-500" />
                          <h4 className="text-xs font-mono font-bold text-white uppercase">Module 03: Inspiration Discovery (Web & Awards Crawls)</h4>
                        </div>

                        <div className="space-y-3">
                          {creative.inspirationCollector.map((item: any) => (
                            <div key={item.id} className="p-3 bg-black/40 border border-glass rounded-xl space-y-2 font-sans">
                              <div className="flex justify-between items-center text-[9px] font-mono">
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/10 uppercase font-bold text-[8px]">{item.source}</span>
                                <span className="text-gray-500">{item.category}</span>
                              </div>
                              <h5 className="text-[11px] font-bold text-white leading-tight">{item.title}</h5>
                              <p className="text-[10px] text-gray-400 leading-normal font-medium">"{item.visualHook}"</p>
                              
                              <div className="flex gap-1 pt-1.5 border-t border-glass/30 items-center">
                                <span className="text-[8px] font-mono text-gray-500 uppercase mr-1">Extracted colors:</span>
                                {item.extractedColors.map((c: string, idx: number) => (
                                  <div key={idx} className="w-3 h-3 rounded border border-white/15" style={{ backgroundColor: c }} title={c} />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* MOODBOARDS */}
                      <div className="bg-black/40 border border-glass p-5 rounded-2xl space-y-4 text-left">
                        <div className="flex items-center gap-2 border-b border-glass pb-2">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <h4 className="text-xs font-mono font-bold text-white uppercase">Moodboard Assets (Module 04)</h4>
                        </div>

                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                          {creative.moodboard.map((item) => (
                            <div key={item.id} className="p-3 bg-black/40 border border-glass rounded-xl flex items-center gap-3">
                              <div className="flex flex-col gap-1 items-center shrink-0">
                                <div className="flex gap-0.5">
                                  {item.colors.map((c, i) => (
                                    <div key={i} className="w-3.5 h-3.5 rounded border border-white/10" style={{ backgroundColor: c }} title={c} />
                                  ))}
                                </div>
                                <span className="text-[8px] font-mono text-gray-500">{item.source}</span>
                              </div>
                              <div className="flex-1 space-y-0.5">
                                <span className="text-[8px] font-mono font-bold bg-amber-500/10 text-amber-400 px-1 py-0.2 rounded">{item.category}</span>
                                <h5 className="text-[11px] font-sans font-bold text-white leading-tight">{item.title}</h5>
                                <div className="flex flex-wrap gap-1">
                                  {item.vibeTags.map(tag => (
                                    <span key={tag} className="text-[8px] font-mono text-gray-500">#{tag}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* MODULE 2: CREATIVE DEBATE (DESIGN CONFLICT BOARD) */}
                    {creative.proposals && creative.proposals.length > 0 && (
                      <div className="bg-black/40 border border-glass p-5 rounded-2xl text-left space-y-4">
                        <div className="flex items-center gap-2 border-b border-glass pb-2">
                          <Users className="w-4 h-4 text-amber-500" />
                          <h4 className="text-xs font-mono font-bold text-white uppercase">Module 02: Creative Debate Clash (Multi-Agent Design Proposals)</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
                          {creative.proposals.map((prop: any) => (
                            <div key={prop.id} className="p-3.5 bg-black/40 border border-glass rounded-xl flex flex-col justify-between gap-3 font-mono text-[10px]">
                              <div className="space-y-1.5">
                                <div className="flex justify-between items-center border-b border-glass/30 pb-1">
                                  <span className="text-amber-400 font-extrabold uppercase text-[8.5px] truncate block w-2/3">{prop.designerName}</span>
                                  <span className="text-gray-300 font-bold">{(prop.confidence * 100).toFixed(0)}%</span>
                                </div>
                                <p className="text-[9.5px] text-gray-400 leading-normal font-sans italic">"{prop.philosophy}"</p>
                              </div>

                              <div className="space-y-1.5 pt-2 border-t border-glass/20 text-[9px]">
                                <div>
                                  <span className="text-emerald-400 block text-[8px] font-bold">STRENGTHS</span>
                                  <ul className="list-disc pl-3 text-gray-300 space-y-0.5 leading-tight font-sans">
                                    {prop.strengths.map((s: string, idx: number) => <li key={idx}>{s}</li>)}
                                  </ul>
                                </div>
                                <div>
                                  <span className="text-rose-400 block text-[8px] font-bold">WEAKNESSES</span>
                                  <ul className="list-disc pl-3 text-gray-300 space-y-0.5 leading-tight font-sans">
                                    {prop.weaknesses.map((w: string, idx: number) => <li key={idx}>{w}</li>)}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CONCEPTS & CRITIC CLASH DEBATE */}
                    {creative.concepts.length > 0 && (
                      <div className="bg-black/40 border border-glass p-5 rounded-2xl space-y-4 text-left">
                        <div className="flex items-center gap-2 border-b border-glass pb-2">
                          <Award className="w-4 h-4 text-amber-500" />
                          <h4 className="text-xs font-mono font-bold text-white uppercase">Concept Clashing & Critic Audits (Modules 01, 08 & 09)</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {creative.concepts.map((concept) => {
                            const audit = creative.criticAudits.find(a => a.conceptId === concept.id);
                            return (
                              <div
                                key={concept.id}
                                className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                                  concept.selected
                                    ? "bg-amber-950/15 border-amber-500/40"
                                    : "bg-black/30 border-glass/40 opacity-70"
                                }`}
                              >
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center text-[9px] font-mono">
                                    <span className="text-amber-400 font-bold uppercase">{concept.aestheticCategory} style</span>
                                    {concept.selected && (
                                      <span className="text-[8px] font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded uppercase">WINNER</span>
                                    )}
                                  </div>
                                  <h4 className="text-xs font-sans font-bold text-white">{concept.name}</h4>
                                  <p className="text-[10px] text-gray-400 leading-normal">{concept.description}</p>
                                </div>

                                <div className="border-t border-glass/40 pt-2.5 space-y-2">
                                  <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest block">Aesthetic sketches</span>
                                  <ul className="list-disc pl-3.5 text-[9px] text-gray-300 font-mono space-y-0.5">
                                    {concept.sketches.map((sk, idx) => <li key={idx} className="marker:text-amber-500">{sk}</li>)}
                                  </ul>
                                </div>

                                {audit && (
                                  <div className="border-t border-glass/40 pt-2.5 space-y-1.5 text-[9.5px]">
                                    <div className="flex justify-between font-mono text-[8px] text-gray-500">
                                      <span>Critic Audit Score</span>
                                      <span className="text-amber-400 font-bold">{Math.round(audit.score * 100)}%</span>
                                    </div>
                                    <p className="text-[9.5px] text-gray-400 italic">"{audit.feedback[0]}"</p>
                                    <div className="text-[8px] text-rose-300 font-mono bg-rose-950/20 p-1.5 rounded border border-rose-500/10">
                                      Suggested fix: {audit.suggestedFixes[0]}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* TWO COLUMN GRID: HUMAN TASTE ENGINE & QUALITY SIMULATOR */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* MODULE 6: HUMAN TASTE ENGINE */}
                      {creative.emotionalProfile && (
                        <div className="bg-black/40 border border-glass p-5 rounded-2xl text-left space-y-4">
                          <div className="flex items-center gap-2 border-b border-glass pb-2">
                            <Activity className="w-4 h-4 text-amber-500" />
                            <h4 className="text-xs font-mono font-bold text-white uppercase">Module 06: Human Taste Engine (Psychological Profile)</h4>
                          </div>

                          <div className="space-y-3 font-mono text-[10px]">
                            <div className="flex justify-between items-center text-xs font-bold border-b border-glass/30 pb-2">
                              <span className="text-gray-300 uppercase">Aesthetic Taste Score</span>
                              <span className="text-amber-400 text-sm font-extrabold">{creative.emotionalProfile.emotionScore}/100</span>
                            </div>

                            {[
                              { label: "Trust & Safety Aura", val: creative.emotionalProfile.trust, color: "bg-emerald-500" },
                              { label: "Excitement & CTR Trigger", val: creative.emotionalProfile.excitement, color: "bg-amber-500" },
                              { label: "Luxury & Prestige Touch", val: creative.emotionalProfile.luxury, color: "bg-yellow-500" },
                              { label: "Warmth & Mindfulness Factor", val: creative.emotionalProfile.warmth, color: "bg-orange-500" },
                              { label: "Technical Confidence", val: creative.emotionalProfile.confidence, color: "bg-teal-500" },
                              { label: "Playful Personality Offset", val: creative.emotionalProfile.playfulness, color: "bg-pink-500" },
                              { label: "Authoritative Clout", val: creative.emotionalProfile.authority, color: "bg-purple-500" }
                            ].map((item, i) => (
                              <div key={i} className="space-y-1">
                                <div className="flex justify-between text-[9px] text-gray-400">
                                  <span>{item.label}</span>
                                  <span className="text-white font-bold">{Math.round(item.val * 100)}%</span>
                                </div>
                                <div className="w-full bg-stone-900 rounded-full h-1.5 overflow-hidden">
                                  <div className={`h-full ${item.color}`} style={{ width: `${item.val * 100}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* MODULE 12: VISUAL QUALITY SIMULATOR */}
                      {creative.qualitySimulation && creative.qualitySimulation.length > 0 && (
                        <div className="bg-black/40 border border-glass p-5 rounded-2xl text-left space-y-4">
                          <div className="flex items-center gap-2 border-b border-glass pb-2">
                            <ShieldCheck className="w-4 h-4 text-amber-500" />
                            <h4 className="text-xs font-mono font-bold text-white uppercase">Module 12: Premium Ship Audits (Visual Quality Simulator)</h4>
                          </div>

                          <div className="space-y-3 font-mono text-[9.5px]">
                            {creative.qualitySimulation.map((sim: any, idx: number) => (
                              <div key={idx} className="p-3 bg-black/40 border border-glass rounded-xl space-y-1.5">
                                <div className="flex justify-between items-center">
                                  <span className="text-amber-400 font-bold">Would {sim.brand} Ship This?</span>
                                  <span className={`px-1.5 py-0.2 rounded font-bold text-[8.5px] ${
                                    sim.shipConfidence > 0.90 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400"
                                  }`}>
                                    Confidence: {(sim.shipConfidence * 100).toFixed(0)}%
                                  </span>
                                </div>
                                <p className="text-[10px] text-gray-300 font-sans leading-relaxed">"{sim.auditFeedback}"</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* MODULE 11: STORYTELLING NARRATIVE ENGINE */}
                    {creative.storyGraph && creative.storyGraph.length > 0 && (
                      <div className="bg-black/40 border border-glass p-5 rounded-2xl text-left space-y-4">
                        <div className="flex items-center gap-2 border-b border-glass pb-2">
                          <BookOpen className="w-4 h-4 text-amber-500" />
                          <h4 className="text-xs font-mono font-bold text-white uppercase">Module 11: Storytelling Engine (Narrative Strategy Graph)</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-left">
                          {creative.storyGraph.map((node: any, idx: number) => (
                            <div key={node.id} className="p-3 bg-black/40 border border-glass rounded-xl flex flex-col justify-between gap-2.5 font-sans relative">
                              {idx < creative.storyGraph.length - 1 && (
                                <ChevronRight className="hidden md:block w-4 h-4 text-amber-500/30 absolute -right-2 top-1/2 -translate-y-1/2 z-10" />
                              )}
                              <div className="space-y-1">
                                <span className="text-[8px] font-mono font-extrabold text-amber-500 uppercase tracking-wider block">Step {idx+1}: {node.stage}</span>
                                <p className="text-[10.5px] font-medium text-gray-200 leading-normal">{node.narrativeLine}</p>
                              </div>
                              <div className="text-[8.5px] font-mono text-gray-500 leading-tight border-t border-glass/30 pt-1.5">
                                <span className="text-[7.5px] uppercase block text-gray-600 font-bold mb-0.5">Visual Cue</span>
                                {node.visualCue}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TWO COLUMN GRID: CREATIVE EXPERIMENTS & MEMORY OUTCOMES */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* MODULE 9: CREATIVE EXPERIMENTS */}
                      {creative.experiments && creative.experiments.length > 0 && (
                        <div className="bg-black/40 border border-glass p-5 rounded-2xl text-left space-y-4 lg:col-span-2">
                          <div className="flex items-center gap-2 border-b border-glass pb-2">
                            <Activity className="w-4 h-4 text-amber-500" />
                            <h4 className="text-xs font-mono font-bold text-white uppercase">Module 09: Creative Experiments Matrix (Versions A - E)</h4>
                          </div>

                          <div className="space-y-2.5 font-mono text-[9.5px]">
                            {creative.experiments.map((exp: any) => (
                              <div
                                key={exp.versionId}
                                className={`p-3 rounded-xl border flex flex-col md:flex-row justify-between md:items-center gap-2 ${
                                  exp.status === "champion"
                                    ? "bg-emerald-950/15 border-emerald-500/30"
                                    : exp.status === "runner_up"
                                    ? "bg-black/40 border-glass"
                                    : "bg-black/20 border-glass/20 opacity-50"
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-white font-bold">{exp.versionId.toUpperCase()} - {exp.layoutType}</span>
                                    <span className={`px-1 rounded text-[7.5px] font-extrabold uppercase ${
                                      exp.status === "champion" 
                                        ? "bg-emerald-500 text-black"
                                        : exp.status === "runner_up"
                                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/20"
                                        : "bg-stone-800 text-gray-500"
                                    }`}>
                                      {exp.status}
                                    </span>
                                  </div>
                                  <div className="text-[9px] text-gray-400 leading-normal">
                                    Fonts: <span className="text-gray-200">{exp.typographyChoice}</span> • Vibe: <span className="text-gray-200">{exp.compositionVibe}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 text-[10px] shrink-0 font-bold text-white border-t md:border-t-0 pt-1.5 md:pt-0">
                                  <span>Motion: <span className="text-amber-500 capitalize">{exp.motionIntensity}</span></span>
                                  <span>Score: <span className="text-amber-400">{exp.score}</span></span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* MODULE 8: CREATIVE MEMORY SEARCH */}
                      {creative.creativeMemory && (
                        <div className="bg-black/40 border border-glass p-5 rounded-2xl text-left space-y-4 lg:col-span-1">
                          <div className="flex items-center gap-2 border-b border-glass pb-2">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <h4 className="text-xs font-mono font-bold text-white uppercase">Module 08: Creative Memory (Past Learnings)</h4>
                          </div>

                          <div className="space-y-3 font-mono text-[9px]">
                            {creative.creativeMemory.length === 0 ? (
                              <p className="text-[10px] text-gray-600 italic text-center py-4">No historical brand lessons loaded.</p>
                            ) : (
                              creative.creativeMemory.map((mem: any) => (
                                <div key={mem.id} className="p-3 bg-black/40 border border-glass rounded-xl space-y-1.5">
                                  <div className="flex justify-between text-[8px] font-extrabold text-amber-500 uppercase border-b border-glass/30 pb-1">
                                    <span>{mem.id.toUpperCase()} DECISION</span>
                                    <span className="text-emerald-400">{mem.resultMetric}</span>
                                  </div>
                                  <h5 className="text-[10px] font-sans font-bold text-white leading-tight">{mem.decision}</h5>
                                  <p className="text-gray-400 leading-normal font-sans italic">Why: "{mem.why}"</p>
                                  <p className="text-emerald-300 font-bold pt-1 border-t border-glass/10 uppercase text-[7.5px]">Outcome: {mem.outcome}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* INSPIRATION & DESIGN REASONER */}
                    {creative.designDecisions.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* DESIGN REASONER */}
                        <div className="bg-black/40 border border-glass p-5 rounded-2xl space-y-4 text-left">
                          <div className="flex items-center gap-2 border-b border-glass pb-2">
                            <Compass className="w-4 h-4 text-amber-500" />
                            <h4 className="text-xs font-mono font-bold text-white uppercase">Design Reasoner (Module 06)</h4>
                          </div>

                          <div className="space-y-3">
                            {creative.designDecisions.map((decision, idx) => (
                              <div key={idx} className="p-3 bg-black/40 border border-glass rounded-xl space-y-2 text-[10px] font-mono">
                                <div className="flex justify-between text-[9px] font-mono">
                                  <span className="text-gray-500 uppercase">{decision.parameter}</span>
                                  <span className="text-amber-400 font-bold">{decision.choice}</span>
                                </div>
                                <p className="text-gray-300 leading-normal font-sans">{decision.reasoning}</p>
                                <div className="text-[8.5px] font-mono text-gray-500 border-t border-glass/20 pt-1">
                                  Evidence reference: {decision.evidence}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* HUMANIZATION FILTER MATRIX (Module 07) */}
                        <div className="bg-black/40 border border-glass p-5 rounded-2xl space-y-4 text-left">
                          <div className="flex items-center gap-2 border-b border-glass pb-2">
                            <Sliders className="w-4 h-4 text-amber-500" />
                            <h4 className="text-xs font-mono font-bold text-white uppercase">Humanizer Filter Matrix (Module 07)</h4>
                          </div>

                          <p className="text-[10px] text-gray-400 leading-relaxed">
                            Ensures design files don't appear sterile. Automatically applies randomized layout grids, asymmetric highlights, and typographical micro-shifts.
                          </p>

                          <div className="space-y-3">
                            {creative.humanizationRules.map((rule, idx) => (
                              <div key={idx} className="p-3 bg-gradient-to-r from-amber-950/10 to-black/30 border border-amber-500/10 rounded-xl flex justify-between items-center gap-2">
                                <div className="space-y-0.5">
                                  <h5 className="text-[11px] font-mono font-bold text-white">{rule.name}</h5>
                                  <p className="text-[9.5px] text-gray-400 font-sans">{rule.purpose}</p>
                                </div>
                                <span className="text-[8.5px] shrink-0 font-mono text-amber-400 bg-amber-950/30 px-2 py-1 rounded border border-amber-500/20">{rule.appliedOffset}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* SENIOR RESEARCH STRATEGY ENGINE TAB (Modules 26-35) */}
      {activeTab === "strategy" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN: CRATE STRATEGY & ACTIONS */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-teal-950/20 to-black/40 border border-[#14b8a6]/20 p-5 rounded-2xl text-left space-y-4">
                <div className="flex items-center gap-2 border-b border-glass pb-2.5">
                  <Compass className="w-4 h-4 text-[#14b8a6]" />
                  <h4 className="text-xs font-mono font-bold text-white uppercase">Propose Research Goal</h4>
                </div>
                
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  The **Senior Strategy Engine** maps objective goals directly to standard McKinsey business playbooks, tracks unknown risks, audits critical assumptions, and outputs DO/WAIT/AVOID decisions.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[8px] font-mono text-gray-400 uppercase mb-1">Objective Goal</label>
                    <textarea
                      value={strategyObjective}
                      onChange={(e) => setStrategyObjective(e.target.value)}
                      rows={3}
                      placeholder="e.g., Validate customizable A5 disc-bound planner templates business."
                      className="w-full bg-black/60 border border-glass rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#14b8a6] placeholder:text-gray-700 font-sans"
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-[8px] font-mono text-gray-400 uppercase mb-1">Pace Priority</label>
                      <select
                        value={strategyPriority}
                        onChange={(e: any) => setStrategyPriority(e.target.value)}
                        className="w-full bg-black text-xs font-mono border border-glass rounded-xl p-2 text-white outline-none focus:border-[#14b8a6]"
                      >
                        <option value="HIGH">HIGH (Full validation)</option>
                        <option value="LOW">LOW (Fast feedback)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      if (!strategyObjective.trim()) return;
                      setIsCreatingStrategy(true);
                      try {
                        const res = await fetch("/api/research/strategy/create", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ objective: strategyObjective, priority: strategyPriority })
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setSelectedStrategyId(data.id);
                          await fetchStrategies();
                        }
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setIsCreatingStrategy(false);
                      }
                    }}
                    disabled={isCreatingStrategy}
                    className="w-full py-2.5 bg-[#14b8a6] hover:bg-[#2dd4bf] text-black text-[10px] font-mono font-extrabold tracking-wider rounded-xl cursor-pointer transition-all uppercase disabled:opacity-50"
                  >
                    {isCreatingStrategy ? "Generating Strategy..." : "Compile Strategic Strategy Plan"}
                  </button>
                </div>
              </div>

              {/* STRATEGY LOGS LIST */}
              <div className="bg-black/40 border border-glass/80 p-5 rounded-2xl text-left space-y-3.5">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block border-b border-glass pb-2">
                  Generated Strategies
                </span>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {strategies.length === 0 ? (
                    <p className="text-[10px] text-gray-600 font-mono italic text-center py-4">No strategy plans generated yet.</p>
                  ) : (
                    strategies.map((strat) => {
                      const isSelected = strat.id === selectedStrategyId;
                      return (
                        <button
                          key={strat.id}
                          onClick={() => setSelectedStrategyId(strat.id)}
                          className={`w-full p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
                            isSelected
                              ? "bg-teal-950/15 border-[#14b8a6]/40 shadow-lg shadow-[#14b8a6]/5"
                              : "bg-black/20 border-glass/30 hover:border-glass"
                          }`}
                        >
                          <div className="flex justify-between items-center text-[9px] font-mono">
                            <span className="text-[#14b8a6] font-bold uppercase">ID: {strat.id.split("_")[1]}</span>
                            <span className={`px-1.5 py-0.5 rounded uppercase font-bold text-[8px] ${
                              strat.decision?.recommendation === "DO" 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : strat.decision?.recommendation === "WAIT"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-black/20 border-glass text-gray-400"
                            }`}>
                              {strat.decision?.recommendation || "Pending"}
                            </span>
                          </div>
                          <p className="text-[11px] font-sans text-gray-300 font-bold line-clamp-1">{strat.objective}</p>
                          <div className="text-[8px] font-mono text-gray-500 flex justify-between">
                            <span>Playbook: {strat.playbookName.split(" ")[0]}</span>
                            <span>Target: {Math.round(strat.confidenceTarget * 100)}% Conf</span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: MAIN WORKSPACE PREVIEW (2 COLUMNS) */}
            <div className="lg:col-span-2 space-y-6">
              {(() => {
                const strat = strategies.find(s => s.id === selectedStrategyId);
                if (!strat) {
                  return (
                    <div className="flex flex-col items-center justify-center py-20 bg-black/20 border border-dashed border-glass rounded-2xl h-full">
                      <Compass className="w-8 h-8 text-[#14b8a6]/30 mb-3" />
                      <p className="text-xs font-mono text-gray-500 italic">Select a Strategy Objective on the left to view workspace.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-6">
                    {/* TOP HERO PREVIEW */}
                    <div className="bg-gradient-to-r from-teal-950/20 to-black/40 border border-[#14b8a6]/25 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl shadow-black/80">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[#14b8a6] font-mono text-[9px] font-bold uppercase tracking-wider">
                          <Compass className="w-3.5 h-3.5 animate-pulse" />
                          Strategic Strategy Board
                        </div>
                        <h3 className="text-sm font-sans font-extrabold text-white">{strat.objective}</h3>
                        <p className="text-[10px] font-mono text-gray-400">
                          Active Playbook: <span className="text-white font-bold">{strat.playbookName}</span>
                        </p>
                      </div>

                      {!strat.decision && (
                        <button
                          onClick={async () => {
                            setIsExecutingStrategy(true);
                            try {
                              const res = await fetch("/api/research/strategy/execute", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ strategyId: strat.id })
                              });
                              if (res.ok) {
                                await fetchStrategies();
                                await fetchKBData();
                              }
                            } catch (err) {
                              console.error(err);
                            } finally {
                              setIsExecutingStrategy(false);
                            }
                          }}
                          disabled={isExecutingStrategy}
                          className="px-4 py-2 bg-[#14b8a6] text-black rounded-xl text-[10px] font-mono font-extrabold hover:bg-[#2dd4bf] transition-all cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          {isExecutingStrategy ? "Running Strategic Pipeline..." : "Execute Strategic Investigations"}
                        </button>
                      )}
                    </div>

                    {/* ADAPTIVE PIPELINE INVESTIGATIONS */}
                    <div className="bg-black/40 border border-glass p-5 rounded-2xl space-y-4 text-left">
                      <div className="flex items-center gap-2 border-b border-glass pb-2">
                        <Activity className="w-4 h-4 text-[#14b8a6]" />
                        <h4 className="text-xs font-mono font-bold text-white uppercase">Adaptive Pipeline Investigations (Module 28)</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {strat.investigations.map((mission: any) => (
                          <div key={mission.id} className="p-3 bg-black/40 border border-glass rounded-xl flex flex-col justify-between gap-2.5">
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-[9px] font-mono">
                                <span className="text-[#14b8a6] font-bold">Crawler: {mission.crawler}</span>
                                <span className={`px-1.5 py-0.5 rounded uppercase font-bold text-[8px] ${
                                  mission.status === "completed" 
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-amber-500/10 text-amber-400"
                                }`}>
                                  {mission.status}
                                </span>
                              </div>
                              <h5 className="text-[11px] font-sans font-bold text-white leading-snug">{mission.purpose}</h5>
                            </div>

                            {mission.findings && (
                              <div className="border-t border-glass/40 pt-2 space-y-1 text-[9.5px] text-gray-300 font-sans leading-relaxed">
                                <span className="text-[8px] font-mono text-gray-500 uppercase block">Discovered Findings</span>
                                <ul className="list-disc pl-3.5 space-y-0.5">
                                  {mission.findings.map((f: string, i: number) => <li key={i}>{f}</li>)}
                                </ul>
                              </div>
                            )}

                            <div className="text-[8px] font-mono text-gray-500 flex justify-between border-t border-glass/20 pt-1.5">
                              <span>Cost: ${mission.estimatedCost}</span>
                              <span>Stop: {mission.stopCondition.split("exceeds")[1] || "Default limit"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* UNKNOWNS & ASSUMPTION DETECTOR MATRIX */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* UNKNOWNS GAP DETECTOR (Module 31) */}
                      <div className="bg-black/40 border border-glass p-5 rounded-2xl space-y-4 text-left">
                        <div className="flex items-center gap-2 border-b border-glass pb-2">
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                          <h4 className="text-xs font-mono font-bold text-white uppercase">Unknowns Gap Detector (Module 31)</h4>
                        </div>

                        <div className="space-y-3">
                          {strat.unknowns.map((gap: any) => (
                            <div key={gap.id} className="p-3 bg-rose-950/10 border border-rose-500/20 rounded-xl space-y-2">
                              <div className="flex justify-between items-center text-[9px] font-mono">
                                <span className="text-rose-400 font-extrabold uppercase">Criticality: {gap.criticality}</span>
                                <span className="text-gray-400 capitalize">{gap.status}</span>
                              </div>
                              <h5 className="text-[11px] font-sans font-bold text-white leading-tight">{gap.text}</h5>
                              <p className="text-[9.5px] text-gray-400 font-mono leading-relaxed bg-black/40 p-2 rounded border border-glass/50">
                                Suggested Investigation: {gap.suggestedInvestigation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ASSUMPTION TRACKER (Module 32) */}
                      <div className="bg-black/40 border border-glass p-5 rounded-2xl space-y-4 text-left">
                        <div className="flex items-center gap-2 border-b border-glass pb-2">
                          <Clock className="w-4 h-4 text-[#14b8a6]" />
                          <h4 className="text-xs font-mono font-bold text-white uppercase">Assumption Tracker (Module 32)</h4>
                        </div>

                        <div className="space-y-3">
                          {strat.assumptions.map((asm: any) => (
                            <div key={asm.id} className="p-3 bg-black/40 border border-glass rounded-xl space-y-2.5">
                              <div className="flex justify-between items-center text-[9px] font-mono">
                                <span className={`px-1.5 py-0.5 rounded uppercase font-bold text-[8px] ${
                                  asm.evidenceLevel === "verified" 
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                }`}>
                                  {asm.evidenceLevel}
                                </span>
                                <span className="text-gray-400 font-bold">Conf: {Math.round(asm.confidence * 100)}%</span>
                              </div>
                              <h5 className="text-[10.5px] font-sans text-gray-300 leading-normal">{asm.text}</h5>
                              <div className="text-[9px] font-mono text-[#14b8a6] leading-normal border-t border-glass/20 pt-1.5">
                                Verification Notes: {asm.verificationNotes}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* DECISION SUPPORT & REVIEW */}
                    {strat.decision && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* REVIEW CHECKLIST */}
                        <div className="bg-black/40 border border-glass p-5 rounded-2xl space-y-3 md:col-span-1 text-left">
                          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Senior Auditor Review</span>
                          <div className="p-4 bg-teal-950/10 border border-teal-500/15 rounded-xl space-y-2 text-[11px] font-mono">
                            <div className="flex justify-between">
                              <span>Coverage:</span>
                              <span className="text-[#14b8a6] font-bold">{Math.round(strat.review?.coverageScore * 100)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Freshness:</span>
                              <span className="text-[#14b8a6] font-bold">{Math.round(strat.review?.freshnessScore * 100)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Diversity:</span>
                              <span className="text-[#14b8a6] font-bold">{Math.round(strat.review?.sourceDiversity * 100)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Contradictions:</span>
                              <span className="text-emerald-400 font-bold">Resolved</span>
                            </div>
                            <p className="text-[9.5px] text-gray-400 italic pt-1 border-t border-glass/30">"{strat.review?.reviewerNotes}"</p>
                          </div>
                        </div>

                        {/* DECISION SUMMARY (DO/WAIT/AVOID) */}
                        <div className="bg-black/40 border border-glass p-5 rounded-2xl space-y-3 md:col-span-2 text-left">
                          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Strategic Consulting Decision Support</span>
                          
                          <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
                            strat.decision.recommendation === "DO" 
                              ? "bg-emerald-950/10 border-emerald-500/30"
                              : "bg-amber-950/10 border-amber-500/30"
                          }`}>
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-mono font-bold text-white uppercase">Recommendation</h4>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold border ${
                                strat.decision.recommendation === "DO" 
                                  ? "bg-emerald-500 text-black border-emerald-500 shadow-lg shadow-emerald-500/10"
                                  : "bg-amber-500 text-black border-amber-500"
                              }`}>
                                {strat.decision.recommendation}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-gray-400">
                              <div>Expected ROI: <span className="text-white font-bold">{strat.decision.expectedROI}</span></div>
                              <div>Execution: <span className="text-white font-bold">{strat.decision.executionDifficulty}</span></div>
                              <div>Time to Launch: <span className="text-white font-bold">{strat.decision.estimatedTime}</span></div>
                              <div>Market Gap: <span className="text-amber-400 leading-tight block">{strat.decision.targetMarketGap}</span></div>
                            </div>

                            <div className="border-t border-glass/40 pt-2.5 space-y-1.5">
                              <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest block">Why this decision:</span>
                              <ul className="list-disc pl-4 text-[10px] text-gray-300 space-y-0.5">
                                {strat.decision.why.map((w: string, i: number) => <li key={i}>{w}</li>)}
                              </ul>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* CRO PLANNER & INVESTIGATOR TAB */}
      {activeTab === "cro" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN: CRATE MISSION & HISTORICAL LOG */}
            <div className="space-y-4">
              
              <div className="bg-black/40 border border-glass/80 p-5 rounded-2xl text-left space-y-4">
                <div className="flex items-center gap-2 border-b border-glass pb-2.5">
                  <Award className="w-4 h-4 text-[#14b8a6]" />
                  <h4 className="text-xs font-mono font-bold text-white uppercase">Define Research Mission</h4>
                </div>
                
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Instead of plain keyword loops, the **Chief Research Officer** acts as the supervisor, building structured questions, allocating budget thresholds, and verifying output consensus.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-[8px] font-mono text-gray-500 uppercase block mb-1">Strategic Objective / Goal</label>
                    <textarea
                      rows={3}
                      value={missionGoal}
                      onChange={(e) => setMissionGoal(e.target.value)}
                      placeholder="e.g. Determine whether AI Logo Packs are worth selling."
                      className="w-full bg-black/50 border border-glass/80 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#14b8a6] font-mono resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[8px] font-mono text-gray-500 uppercase block mb-1">Research Budget ($ Limit)</label>
                    <input
                      type="number"
                      value={missionBudget}
                      onChange={(e) => setMissionBudget(parseFloat(e.target.value) || 100)}
                      className="w-full bg-black/50 border border-glass/80 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#14b8a6] font-mono"
                    />
                  </div>

                  <button
                    onClick={handleCreateMission}
                    disabled={isCreatingMission || !missionGoal.trim()}
                    className="w-full py-2 bg-[#14b8a6] hover:bg-teal-400 text-black rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isCreatingMission ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    Initiate Strategic Mission
                  </button>
                </div>
              </div>

              {/* ACTIVE & HISTORICAL MISSIONS */}
              <div className="bg-black/30 border border-glass p-5 rounded-2xl space-y-3">
                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">Mission History</span>
                {missions.length === 0 ? (
                  <p className="text-[10px] text-gray-500 font-mono italic">No previous missions initiated.</p>
                ) : (
                  <div className="space-y-2">
                    {missions.map((m: any) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMissionId(m.id)}
                        className={`w-full p-3 rounded-xl border text-left transition-all ${
                          selectedMissionId === m.id
                            ? "bg-[#14b8a6]/10 border-[#14b8a6] text-white"
                            : "bg-black/20 border-glass/60 text-gray-400 hover:border-glass"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[8px] font-mono uppercase font-bold text-[#14b8a6]">{m.id}</span>
                          <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded ${
                            m.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" :
                            m.status === "investigating" ? "bg-amber-500/10 text-amber-400 animate-pulse border border-amber-500/25" :
                            "bg-purple-500/10 text-purple-400 border border-purple-500/25"
                          }`}>
                            {m.status}
                          </span>
                        </div>
                        <p className="text-[10.5px] font-mono line-clamp-1">"{m.goal}"</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: ACTIVE MISSION CONTROL & DETAILED DIAGNOSTICS */}
            <div className="lg:col-span-2 space-y-6">
              
              {!selectedMission ? (
                <div className="flex flex-col items-center justify-center p-12 border border-glass border-dashed rounded-2xl bg-black/10 text-center space-y-2">
                  <Compass className="w-10 h-10 text-gray-500 animate-pulse" />
                  <p className="text-xs font-mono text-gray-400">Initiate a Strategic Mission to begin senior analytics.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* COMPACT STAGE INDICATOR & CTAS */}
                  <div className="bg-black/40 border border-glass p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#14b8a6] font-bold uppercase">{selectedMission.id}</span>
                        <h4 className="text-xs font-mono font-bold text-white uppercase">Mission Dashboard</h4>
                      </div>
                      <p className="text-xs font-sans text-gray-300">"{selectedMission.goal}"</p>
                    </div>

                    <div className="flex gap-2">
                      {selectedMission.status !== "completed" && (
                        <button
                          onClick={() => handleExecuteMission(selectedMission.id)}
                          disabled={isExecutingMission}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {isExecutingMission ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                          Run Investigator Pipeline
                        </button>
                      )}
                    </div>
                  </div>

                  {/* HIGH-LEVEL MISSION METRICS */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    
                    <div className="bg-black/30 border border-glass p-4 rounded-xl space-y-1">
                      <span className="text-[8px] font-mono text-gray-500 uppercase block">Coverage Score</span>
                      <div className="text-xl font-mono font-bold text-white">
                        {selectedMission.status === "completed" ? "100%" : "22%"}
                      </div>
                      <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#14b8a6] h-full" 
                          style={{ width: selectedMission.status === "completed" ? "100%" : "22%" }}
                        />
                      </div>
                    </div>

                    <div className="bg-black/30 border border-glass p-4 rounded-xl space-y-1">
                      <span className="text-[8px] font-mono text-gray-500 uppercase block">Budget Spent</span>
                      <div className="text-xl font-mono font-bold text-white">
                        ${selectedMission.totalCostSpent.toFixed(2)}
                      </div>
                      <span className="text-[8px] text-gray-500 block font-mono">Limit: ${selectedMission.budget}</span>
                    </div>

                    <div className="bg-black/30 border border-glass p-4 rounded-xl space-y-1">
                      <span className="text-[8px] font-mono text-gray-500 uppercase block">Time Elapsed</span>
                      <div className="text-xl font-mono font-bold text-white">
                        {selectedMission.timeElapsed}s
                      </div>
                      <span className="text-[8px] text-purple-400 block font-mono">Simulated analytical cycles</span>
                    </div>

                    <div className="bg-black/30 border border-[#14b8a6]/20 p-4 rounded-xl space-y-1">
                      <span className="text-[8px] font-mono text-gray-500 uppercase block">CRO Confidence</span>
                      <div className="text-xl font-mono font-bold text-[#14b8a6]">
                        {selectedMission.status === "completed" ? "88%" : "50%"}
                      </div>
                      <span className="text-[8px] text-[#14b8a6] block font-mono">Propagated consensus</span>
                    </div>

                  </div>

                  {/* CRO SIGN-OFF SCORECARD */}
                  {selectedMission.scorecard && (
                    <div className="bg-gradient-to-r from-emerald-950/20 to-black/40 border border-emerald-500/30 p-5 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-emerald-400 animate-pulse" />
                          <span className="text-xs font-mono font-bold text-emerald-400 uppercase">CRO Supervisory Scorecard</span>
                        </div>
                        <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full uppercase">
                          Approved for Delivery
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-300 font-sans leading-relaxed italic">
                        "{selectedMission.scorecard.auditNotes}"
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                        <div className="bg-black/40 p-2 rounded border border-glass/40 text-left">
                          <span className="text-[8px] font-mono text-gray-500 uppercase block">Coverage</span>
                          <span className="text-[11.5px] font-mono font-bold text-white">{(selectedMission.scorecard.coverage * 100).toFixed(0)}%</span>
                        </div>
                        <div className="bg-black/40 p-2 rounded border border-glass/40 text-left">
                          <span className="text-[8px] font-mono text-gray-500 uppercase block">Source Diversity</span>
                          <span className="text-[11.5px] font-mono font-bold text-white">{(selectedMission.scorecard.sourceDiversity * 100).toFixed(0)}%</span>
                        </div>
                        <div className="bg-black/40 p-2 rounded border border-glass/40 text-left">
                          <span className="text-[8px] font-mono text-gray-500 uppercase block">Cost Efficiency</span>
                          <span className="text-[11.5px] font-mono font-bold text-white">{(selectedMission.scorecard.costEfficiency * 100).toFixed(0)}%</span>
                        </div>
                        <div className="bg-black/40 p-2 rounded border border-glass/40 text-left">
                          <span className="text-[8px] font-mono text-gray-500 uppercase block">Reusability Rating</span>
                          <span className="text-[11.5px] font-mono font-bold text-white">{(selectedMission.scorecard.reusabilityRating * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STRATEGIC COVERAGE PLANNER & ATOMIC QUESTIONS */}
                  <div className="bg-black/30 border border-glass p-5 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-glass/40 pb-2">
                      <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-[#14b8a6]" />
                        <h4 className="text-xs font-mono font-bold text-white uppercase">Investigative Coverage Planner</h4>
                      </div>
                      <span className="text-[8px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/25 px-2 py-0.5 rounded">
                        Module 13 Graph Tree
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-400">
                      The planner avoids fuzzy search indexing. It defines strategic criteria gaps and launches specialized worker queries only for uncovered areas.
                    </p>

                    <div className="space-y-3">
                      {selectedMission.questions.map((q: any) => (
                        <div key={q.id} className="p-4 bg-black/40 border border-glass/60 rounded-xl space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono font-bold text-[#14b8a6] uppercase">[{q.category}]</span>
                              <h5 className="text-xs font-mono font-bold text-white">"{q.text}"</h5>
                            </div>
                            <span className={`text-[8.5px] font-mono px-2 py-0.5 rounded capitalize ${
                              q.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-purple-500/10 text-purple-400 animate-pulse border border-purple-500/20"
                            }`}>
                              {q.status}
                            </span>
                          </div>

                          {/* Detail block */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono text-gray-400 bg-black/30 p-2 rounded">
                            <div>
                              <span>Est Cost:</span> <span className="text-white">${q.estimatedCost}</span>
                            </div>
                            <div>
                              <span>Est Time:</span> <span className="text-white">{q.estimatedTime}s</span>
                            </div>
                            <div>
                              <span>Assigned Source:</span> <span className="text-white truncate max-w-[80px] inline-block align-bottom">{q.assignedSource || "Auto Router"}</span>
                            </div>
                            <div>
                              <span>Propagated Confidence:</span> <span className="text-[#14b8a6] font-bold">{(q.confidence * 100).toFixed(0)}%</span>
                            </div>
                          </div>

                          {/* Findings */}
                          {q.findings && q.findings.length > 0 && (
                            <div className="pt-2 border-t border-glass/30 space-y-1">
                              <span className="text-[8px] font-mono text-gray-500 block uppercase">Retrieved Findings</span>
                              {q.findings.map((f: string, i: number) => (
                                <p key={i} className="text-[10px] text-gray-300 italic">" {f} "</p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* COMPETING HYPOTHESES (Module 14) */}
                  <div className="bg-black/30 border border-glass p-5 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 border-b border-glass/40 pb-2">
                      <Flame className="w-4 h-4 text-amber-500" />
                      <h4 className="text-xs font-mono font-bold text-white uppercase">Competing Hypotheses Matrix</h4>
                    </div>

                    <p className="text-[10px] text-gray-400">
                      Real analysts never assume one outcome. The **Hypothesis Engine** tests competing marketing, pricing, and saturation theories in parallel.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedMission.hypotheses.map((hyp: any) => (
                        <div key={hyp.id} className="p-4 bg-black/40 border border-glass rounded-xl space-y-2 text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-[8.5px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/25 px-1.5 py-0.5 rounded capitalize">
                              {hyp.id}
                            </span>
                            <span className={`text-[8.5px] font-mono px-2 py-0.5 rounded ${
                              hyp.status === "supported" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                            }`}>
                              {hyp.status.replace(/_/g, " ")}
                            </span>
                          </div>

                          <h5 className="text-[11.5px] font-mono font-bold text-white">"{hyp.statement}"</h5>
                          <p className="text-[10px] text-gray-400 leading-relaxed">{hyp.description}</p>
                          
                          <div className="flex justify-between items-center text-[10px] pt-2 border-t border-glass/20 font-mono">
                            <span>Computed Probability:</span>
                            <span className="text-emerald-400 font-bold">{(hyp.confidence * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DEBATE ARENA (Module 15) */}
                  <div className="bg-black/30 border border-glass p-5 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 border-b border-glass/40 pb-2">
                      <ShieldAlert className="w-4 h-4 text-purple-400" />
                      <h4 className="text-xs font-mono font-bold text-white uppercase">Friction Debate Arena</h4>
                    </div>

                    <p className="text-[10px] text-gray-400">
                      Conflicting market reports triggers clashing agent debates rather than soft merges. Here we track live claims, supporting files, opposing metrics, and calculated consensus winners.
                    </p>

                    {selectedMission.debates.length === 0 ? (
                      <p className="text-[10.5px] font-mono text-gray-500 italic p-4 border border-dashed border-glass rounded-xl bg-black/10 text-center">
                        Debate Arena dormant. Run the investigator pipeline to trigger evidentiary clashes.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {selectedMission.debates.map((deb: any) => (
                          <div key={deb.id} className="p-4 bg-black/40 border border-glass rounded-xl space-y-3">
                            <span className="text-[9px] font-mono text-purple-400 uppercase font-bold block">Debate: {deb.id}</span>
                            <h5 className="text-xs font-mono font-bold text-white">"{deb.claim}"</h5>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-emerald-950/10 p-3 rounded-lg border border-emerald-500/20 space-y-1.5">
                                <span className="text-[8px] font-mono text-emerald-400 uppercase block font-bold">Supporting Argument</span>
                                {deb.supportingEvidence.map((ev: any, idx: number) => (
                                  <p key={idx} className="text-[10px] text-gray-300">"{ev.text}" <span className="text-gray-500">({ev.source})</span></p>
                                ))}
                              </div>

                              <div className="bg-amber-950/10 p-3 rounded-lg border border-amber-500/20 space-y-1.5">
                                <span className="text-[8px] font-mono text-amber-400 uppercase block font-bold">Opposing Argument</span>
                                {deb.opposingEvidence.map((ev: any, idx: number) => (
                                  <p key={idx} className="text-[10px] text-gray-300">"{ev.text}" <span className="text-gray-500">({ev.source})</span></p>
                                ))}
                              </div>
                            </div>

                            {/* Outcome */}
                            {deb.winnerClaim && (
                              <div className="p-3 bg-black/50 border border-glass/40 rounded-xl space-y-1">
                                <span className="text-[8px] font-mono text-purple-400 uppercase block font-bold">Consensus Decision</span>
                                <p className="text-[10.5px] text-[#14b8a6] font-mono font-bold">Winner Claim: "{deb.winnerClaim}"</p>
                                <span className="text-[8px] text-gray-500 block">Decision confidence: {(deb.confidence * 100).toFixed(0)}%</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CAUSAL REASONER DAG (Module 23) */}
                  <div className="bg-black/30 border border-glass p-5 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 border-b border-glass/40 pb-2">
                      <GitFork className="w-4 h-4 text-[#14b8a6]" />
                      <h4 className="text-xs font-mono font-bold text-white uppercase">Causal Reasoner DAG</h4>
                    </div>

                    <p className="text-[10px] text-gray-400">
                      Causal reasoning prevents simplistic correlation fallacies. The engine diagrams actual consumer behaviors and structural mechanisms.
                    </p>

                    {selectedMission.causalLinks.length === 0 ? (
                      <p className="text-[10.5px] font-mono text-gray-500 italic p-4 border border-dashed border-glass rounded-xl bg-black/10 text-center">
                        Causal connections under development.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {selectedMission.causalLinks.map((link: any, idx: number) => (
                          <div key={idx} className="p-4 bg-black/40 border border-glass/60 rounded-xl space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[8px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/25 px-1.5 py-0.5 rounded capitalize font-bold">
                                Causal Link {idx + 1}
                              </span>
                              <span className="text-[9px] font-mono text-[#14b8a6] font-bold uppercase">Strength: {link.strength}</span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 bg-black/30 p-3 rounded-lg border border-glass/30 text-xs font-mono">
                              <div className="flex-1 space-y-1">
                                <span className="text-[8px] text-gray-500 block uppercase">Root Cause</span>
                                <span className="text-white font-bold">{link.cause}</span>
                              </div>
                              <div className="text-gray-500 font-bold self-center">
                                <ChevronRight className="w-5 h-5 hidden sm:block" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <span className="text-[8px] text-gray-500 block uppercase">Secondary Effect</span>
                                <span className="text-white font-bold">{link.effect}</span>
                              </div>
                            </div>

                            <div className="text-[10.5px] text-gray-400 leading-relaxed font-sans bg-black/50 p-2.5 rounded border border-glass/30">
                              <span className="font-mono text-gray-500 text-[8px] block uppercase mb-1">Underlying Structural Mechanism</span>
                              "{link.mechanism}"
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* STATS OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-black/30 border border-glass p-4 rounded-xl text-left space-y-1">
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">Evidence Cache</span>
              <div className="text-2xl font-mono font-bold text-white">{kbData.evidence?.length || 0}</div>
              <span className="text-[8px] text-[#14b8a6] font-mono block">Deduplicated Factual Records</span>
            </div>

            <div className="bg-black/30 border border-glass p-4 rounded-xl text-left space-y-1">
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">Topic Connections</span>
              <div className="text-2xl font-mono font-bold text-white">{kbData.topics?.length || 0}</div>
              <span className="text-[8px] text-purple-400 font-mono block">Multilateral Graph Links</span>
            </div>

            <div className={`border p-4 rounded-xl text-left space-y-1 transition-colors ${unresolvedConflicts.length > 0 ? "bg-amber-950/10 border-amber-500/30" : "bg-black/30 border-glass"}`}>
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">Friction Conflicts</span>
              <div className={`text-2xl font-mono font-bold ${unresolvedConflicts.length > 0 ? "text-amber-400" : "text-white"}`}>
                {unresolvedConflicts.length}
              </div>
              <span className={`text-[8px] font-mono block ${unresolvedConflicts.length > 0 ? "text-amber-400 animate-pulse" : "text-gray-500"}`}>
                {unresolvedConflicts.length > 0 ? "Pending Analyst Attention" : "Factual Consistency: 100%"}
              </span>
            </div>

            <div className="bg-black/30 border border-glass p-4 rounded-xl text-left space-y-1">
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">Semantic Nodes</span>
              <div className="text-2xl font-mono font-bold text-[#14b8a6]">{kbData.semanticNodes?.length || 0}</div>
              <span className="text-[8px] text-emerald-400 font-mono block">Cross-Project Learnings</span>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* SEARCH PLAYGROUND CARD */}
            <div className="lg:col-span-2 bg-black/40 border border-glass/80 p-5 rounded-2xl text-left space-y-4">
              <div className="flex items-center gap-2 border-b border-glass pb-2.5">
                <Search className="w-4 h-4 text-[#14b8a6]" />
                <h4 className="text-xs font-mono font-bold text-white uppercase">Ask Memory First Sandbox</h4>
              </div>
              
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Test the "Memory-First, Internet-Second" routing mechanism. If memory has fresh & sufficient evidence, the scheduler immediately skips internet queries, saving tokens, time, and server costs.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. printable planner, notion, journals"
                  className="flex-1 bg-black/50 border border-glass/80 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#14b8a6] font-mono"
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-[#14b8a6] hover:bg-teal-400 text-black px-4 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  Route Query
                </button>
              </div>

              {/* SEARCH RESULTS */}
              {searchResult && (
                <div className="p-4 rounded-xl border border-glass bg-black/30 space-y-4">
                  
                  {/* Route Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-gray-400 uppercase">Analysis Outcome</span>
                    {searchResult.source === "memory" ? (
                      <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Cached Memory Hit (100% savings)
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        Internet Sweep Triggered (Confidence Low)
                      </span>
                    )}
                  </div>

                  {/* Scanned Topics Graph */}
                  <div className="space-y-1 bg-black/40 p-3 rounded-lg border border-glass/40">
                    <div className="text-[8px] font-mono text-gray-500 uppercase">Related Graph Nodes Searched</div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {searchResult.relatedTopicsSearched?.map((t: string, i: number) => (
                        <span key={i} className="text-[9px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/25 px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Match score */}
                  <div className="flex items-center justify-between border-t border-glass/30 pt-3 text-[10px] font-mono text-gray-300">
                    <span>Peak Factual Score:</span>
                    <span className={searchResult.source === "memory" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                      {(searchResult.confidenceScore * 100).toFixed(1)}% (Threshold: 75.0%)
                    </span>
                  </div>

                  {/* Evidence Display */}
                  {searchResult.evidence?.length > 0 && (
                    <div className="space-y-3 pt-1">
                      <div className="text-[8px] font-mono text-gray-500 uppercase">Retrieved Merged Evidence</div>
                      {searchResult.evidence.map((ev: any, i: number) => (
                        <div key={i} className="bg-black/50 p-3 border border-glass rounded-xl text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <h5 className="font-bold font-mono text-white text-[11px]">{ev.title}</h5>
                            <span className="text-[9px] text-[#14b8a6] bg-[#14b8a6]/10 px-1.5 py-0.5 rounded font-mono">
                              Score: {ev.score || ev.confidence}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 font-sans leading-relaxed">{ev.summary}</p>
                          
                          {/* Nested facts */}
                          <div className="pt-2 border-t border-glass/30 space-y-1.5">
                            <span className="text-[8px] font-mono text-gray-500 block uppercase">Nested Atomic Facts</span>
                            {ev.facts?.map((f: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-[10px] bg-black/40 p-2 rounded">
                                <span className="font-mono text-gray-300">"{f.statement}"</span>
                                <span className="text-[9px] text-purple-400 font-mono">
                                  {f.source} ({(f.confidence * 100).toFixed(0)}%)
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* SIMULATE COMPLETED PROJECT CARD */}
            <div className="bg-black/40 border border-glass/80 p-5 rounded-2xl text-left space-y-4">
              <div className="flex items-center gap-2 border-b border-glass pb-2.5">
                <Sparkles className="text-purple-400 w-4 h-4" />
                <h4 className="text-xs font-mono font-bold text-white uppercase">Simulation & Extractor</h4>
              </div>

              <p className="text-[10px] text-gray-400 leading-relaxed">
                When a project is fully completed inside the company, the scheduler triggers a background **Knowledge Extractor** pipeline. Simulate running it now to see how memory builds on every successful delivery.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-[8px] font-mono text-gray-500 uppercase block mb-1">Project Name</label>
                  <input
                    type="text"
                    value={simTitle}
                    onChange={(e) => setSimTitle(e.target.value)}
                    className="w-full bg-black/50 border border-glass rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#14b8a6] font-mono"
                  />
                </div>

                <div>
                  <label className="text-[8px] font-mono text-gray-500 uppercase block mb-1">Target Niche</label>
                  <select
                    value={simTopic}
                    onChange={(e) => setSimTopic(e.target.value)}
                    className="w-full bg-black/50 border border-glass rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#14b8a6] font-mono cursor-pointer"
                  >
                    <option value="journals">Journals & Planners</option>
                    <option value="notion_templates">Notion Templates</option>
                    <option value="saas_tools">SaaS Utilities</option>
                    <option value="courses">Digital Courses</option>
                  </select>
                </div>

                <button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-purple-500/10"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
                  Harvest Project Knowledge
                </button>

                {simSuccessMsg && (
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-[10px] text-emerald-400 leading-normal">
                    {simSuccessMsg}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TOPIC GRAPH TAB */}
      {activeTab === "graph" && (
        <div className="bg-black/30 border border-glass p-5 rounded-2xl text-left space-y-4">
          <div className="flex items-center gap-2 border-b border-glass/40 pb-2">
            <GitFork className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-mono font-bold text-white uppercase">Hierarchical and Lateral Topic Connections</h4>
          </div>

          <p className="text-[10px] text-gray-400">
            The topic graph prevents folder-based cognitive limitations. Searching for journals automatically queries planners, eBooks, low-content books, and digital marketplaces.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {kbData.topics?.map((node: any) => (
              <div key={node.id} className="p-4 bg-black/40 border border-glass/60 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wide">{node.id.replace(/_/g, " ")}</span>
                  <span className="text-[8px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/25 px-1.5 py-0.5 rounded">
                    Graph Node
                  </span>
                </div>

                {/* Parents */}
                {node.parents.length > 0 && (
                  <div>
                    <span className="text-[8px] font-mono text-gray-500 uppercase block">Parents:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {node.parents.map((p: string, idx: number) => (
                        <span key={idx} className="text-[8.5px] font-mono bg-black/50 text-gray-300 border border-glass px-1.5 py-0.5 rounded">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Children */}
                {node.children.length > 0 && (
                  <div>
                    <span className="text-[8px] font-mono text-[#14b8a6] uppercase block">Children:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {node.children.map((c: string, idx: number) => (
                        <span key={idx} className="text-[8.5px] font-mono bg-teal-500/5 text-teal-400 border border-teal-500/20 px-1.5 py-0.5 rounded">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lateral Relations */}
                {node.related.length > 0 && (
                  <div>
                    <span className="text-[8px] font-mono text-amber-400 uppercase block">Lateral Connections:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {node.related.map((r: string, idx: number) => (
                        <span key={idx} className="text-[8.5px] font-mono bg-amber-500/5 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      )}

      {/* EVIDENCE STORE TAB */}
      {activeTab === "evidence" && (
        <div className="bg-black/30 border border-glass p-5 rounded-2xl text-left space-y-4">
          <div className="flex items-center gap-2 border-b border-glass/40 pb-2">
            <BookOpen className="w-4 h-4 text-teal-400" />
            <h4 className="text-xs font-mono font-bold text-white uppercase">Raw and Merged Evidence Store</h4>
          </div>

          <p className="text-[10px] text-gray-400">
            Every web page analyzed becomes a structural source. Atomic facts are computed with high reliability and score weights based on Freshness, Trust, and Consensus agreement indexes.
          </p>

          <div className="space-y-4">
            {kbData.evidence?.map((ev: any) => (
              <div key={ev.id} className="p-5 bg-black/40 border border-glass rounded-2xl space-y-4">
                
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-glass/30 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">{ev.title}</span>
                      <span className="text-[8px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/25 px-1.5 py-0.5 rounded capitalize">
                        {ev.topic}
                      </span>
                    </div>
                    <span className="text-[9px] text-gray-500 font-mono">Source ID: {ev.sourceId}</span>
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    <div className="text-[10px] font-mono text-gray-400">
                      Composite Evidence Score: <span className="text-[#14b8a6] font-bold">{ev.score || ev.confidence}</span>
                    </div>
                    <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                      Confidence Index
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-300 leading-relaxed font-sans">{ev.summary}</p>

                {/* Math variables table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/50 p-3 rounded-xl border border-glass/40">
                  <div className="text-left">
                    <span className="text-[8px] font-mono text-gray-500 block uppercase">Original Trust</span>
                    <span className="text-[11px] font-mono font-bold text-white">{(ev.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="text-left">
                    <span className="text-[8px] font-mono text-gray-500 block uppercase">Freshness Decay</span>
                    <span className="text-[11px] font-mono font-bold text-white">{(ev.freshness * 100).toFixed(0)}%</span>
                  </div>
                  <div className="text-left">
                    <span className="text-[8px] font-mono text-gray-500 block uppercase">Consensus Agreement</span>
                    <span className="text-[11px] font-mono font-bold text-white">100%</span>
                  </div>
                  <div className="text-left">
                    <span className="text-[8px] font-mono text-gray-500 block uppercase">Decayed Confidence</span>
                    <span className="text-[11px] font-mono font-bold text-[#14b8a6]">{((ev.confidence * ev.freshness) * 100).toFixed(0)}%</span>
                  </div>
                </div>

                {/* Nested facts */}
                <div className="space-y-2">
                  <span className="text-[8px] font-mono text-gray-500 block uppercase">Consolidated Facts</span>
                  <div className="space-y-2">
                    {ev.facts?.map((f: any, idx: number) => (
                      <div key={idx} className="flex flex-wrap items-center justify-between gap-2 p-3 bg-black/60 rounded-xl border border-glass/30">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#14b8a6]" />
                          <span className="text-[10.5px] font-mono text-gray-200">"{f.statement}"</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[9px]">
                          <span className="text-gray-500">Value: {JSON.stringify(f.value)}</span>
                          <span className="bg-[#14b8a6]/10 text-[#14b8a6] border border-[#14b8a6]/20 px-1.5 py-0.5 rounded">
                            {f.source}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* SOURCES TAB */}
      {activeTab === "sources" && (
        <div className="bg-black/30 border border-glass p-5 rounded-2xl text-left space-y-4">
          <div className="flex items-center gap-2 border-b border-glass/40 pb-2">
            <Zap className="w-4 h-4 text-[#14b8a6]" />
            <h4 className="text-xs font-mono font-bold text-white uppercase">Source Registry Analytics</h4>
          </div>

          <p className="text-[10px] text-gray-400">
            Source analytics track latency, bandwidth, cost, and historical trust scores. If a source feeds contradictory facts into the memory store, its trust is automatically penalized.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kbData.sources?.map((src: any) => (
              <div key={src.id} className="p-4 bg-black/40 border border-glass rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-white uppercase">{src.name}</span>
                  <span className="text-[8px] font-mono bg-[#14b8a6]/15 text-[#14b8a6] border border-[#14b8a6]/25 px-1.5 py-0.5 rounded uppercase">
                    {src.kind}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-black/40 p-2.5 rounded border border-glass/40 space-y-0.5">
                    <span className="text-[8px] font-mono text-gray-500 block uppercase">Trust Score</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{(src.trust * 100).toFixed(0)}%</span>
                  </div>

                  <div className="bg-black/40 p-2.5 rounded border border-glass/40 space-y-0.5">
                    <span className="text-[8px] font-mono text-gray-500 block uppercase">Speed Rating</span>
                    <span className="text-xs font-mono font-bold text-purple-400">{src.speed}/100</span>
                  </div>

                  <div className="bg-black/40 p-2.5 rounded border border-glass/40 space-y-0.5">
                    <span className="text-[8px] font-mono text-gray-500 block uppercase">Avg Latency</span>
                    <span className="text-xs font-mono font-bold text-white">{src.latency || 150}ms</span>
                  </div>

                  <div className="bg-black/40 p-2.5 rounded border border-glass/40 space-y-0.5">
                    <span className="text-[8px] font-mono text-gray-500 block uppercase">Realtime Stream</span>
                    <span className="text-xs font-mono font-bold text-white">{src.supportsRealtime ? "Supported" : "Simulated/Interval"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONFLICTS TAB */}
      {activeTab === "conflicts" && (
        <div className="bg-black/30 border border-glass p-5 rounded-2xl text-left space-y-4">
          <div className="flex items-center gap-2 border-b border-glass/40 pb-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 animate-pulse" />
            <h4 className="text-xs font-mono font-bold text-white uppercase">Contradiction & Friction Logs</h4>
          </div>

          <p className="text-[10px] text-gray-400">
            When sources report contradictory growth patterns or metrics, the **Contradiction Engine** holds the facts in quarantine. Declaring a winning fact dynamically reduces the losing source's trust.
          </p>

          <div className="space-y-4">
            {kbData.conflicts?.length === 0 ? (
              <div className="p-8 border border-glass border-dashed rounded-xl bg-black/20 text-center text-xs font-mono text-gray-500 italic">
                No active factual contradictions detected in organizational memory.
              </div>
            ) : (
              kbData.conflicts.map((conflict: any) => {
                const isUnresolved = conflict.status === "unresolved";
                const isWinnerA = conflict.winner === conflict.factA.id;
                const isWinnerB = conflict.winner === conflict.factB.id;

                return (
                  <div key={conflict.id} className={`p-5 rounded-2xl border ${isUnresolved ? "bg-amber-950/5 border-amber-500/20" : "bg-black/40 border-glass"}`}>
                    
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-glass/40 pb-2.5">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 ${isUnresolved ? "text-amber-400" : "text-gray-500"}`} />
                        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                          Conflict: {conflict.id}
                        </span>
                      </div>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-bold border ${isUnresolved ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>
                        {conflict.status}
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-400 mt-2">
                      Factual claims regarding <span className="text-white font-mono uppercase text-[11px] font-bold">{conflict.topic}</span> contradict.
                    </p>

                    {/* TWO CONFLICTING SIDES */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      
                      {/* Fact A */}
                      <label className={`p-4 rounded-xl border transition-all cursor-pointer block text-left space-y-2 ${isWinnerA ? "border-emerald-500 bg-emerald-950/10" : "border-glass hover:bg-white/5"} ${!isUnresolved && !isWinnerA ? "opacity-40" : ""}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-gray-400">CLAIM A: {conflict.factA.source}</span>
                          {isUnresolved && (
                            <input
                              type="radio"
                              name={`winner_${conflict.id}`}
                              checked={selectedWinnerId === conflict.factA.id}
                              onChange={() => setSelectedWinnerId(conflict.factA.id)}
                              className="accent-emerald-400"
                            />
                          )}
                        </div>
                        <p className="text-xs font-mono font-bold text-white">"{conflict.factA.statement}"</p>
                        <div className="flex justify-between text-[9px] font-mono text-gray-500">
                          <span>Reported Confidence:</span>
                          <span className="text-purple-400 font-bold">{(conflict.factA.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </label>

                      {/* Fact B */}
                      <label className={`p-4 rounded-xl border transition-all cursor-pointer block text-left space-y-2 ${isWinnerB ? "border-emerald-500 bg-emerald-950/10" : "border-glass hover:bg-white/5"} ${!isUnresolved && !isWinnerB ? "opacity-40" : ""}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-gray-400">CLAIM B: {conflict.factB.source}</span>
                          {isUnresolved && (
                            <input
                              type="radio"
                              name={`winner_${conflict.id}`}
                              checked={selectedWinnerId === conflict.factB.id}
                              onChange={() => setSelectedWinnerId(conflict.factB.id)}
                              className="accent-emerald-400"
                            />
                          )}
                        </div>
                        <p className="text-xs font-mono font-bold text-white">"{conflict.factB.statement}"</p>
                        <div className="flex justify-between text-[9px] font-mono text-gray-500">
                          <span>Reported Confidence:</span>
                          <span className="text-purple-400 font-bold">{(conflict.factB.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </label>

                    </div>

                    {/* RESOLUTION CONTROL */}
                    {isUnresolved && (
                      <div className="mt-4 pt-4 border-t border-glass/30 space-y-3">
                        <div>
                          <label className="text-[8px] font-mono text-gray-500 uppercase block mb-1">Analyst Audit Notes / Decisions</label>
                          <input
                            type="text"
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                            placeholder="e.g. Verified Trends dashboard, TikTok metrics are delayed due to content lifecycle."
                            className="w-full bg-black/50 border border-glass rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#14b8a6] font-mono"
                          />
                        </div>

                        <button
                          onClick={() => handleResolve(conflict.id, selectedWinnerId)}
                          disabled={!selectedWinnerId || resolvingId === conflict.id}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Resolve Factual Claim
                        </button>
                      </div>
                    )}

                    {!isUnresolved && conflict.notes && (
                      <div className="mt-4 p-3 bg-black/40 rounded-xl border border-glass/30 text-[10px] font-sans leading-relaxed text-gray-300">
                        <span className="font-mono text-[#14b8a6] font-bold uppercase block text-[8px] mb-1">Resolution Audit File</span>
                        {conflict.notes}
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SEMANTIC LESSONS TAB */}
      {activeTab === "semantic" && (
        <div className="bg-black/30 border border-glass p-5 rounded-2xl text-left space-y-4">
          <div className="flex items-center gap-2 border-b border-glass/40 pb-2">
            <Sparkles className="w-4 h-4 text-[#14b8a6]" />
            <h4 className="text-xs font-mono font-bold text-white uppercase">Semantic Lessons Store</h4>
          </div>

          <p className="text-[10px] text-gray-400">
            Past retrospective lessons are mapped semantically inside a multidimensional space using cosine token matching. When new components are built, the engine consults similar historical lessons automatically.
          </p>

          <div className="space-y-3">
            {kbData.semanticNodes?.map((node: any) => (
              <div key={node.id} className="p-4 bg-black/40 border border-glass rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-white flex-1">{node.title}</span>
                  <span className="text-[8px] font-mono bg-[#14b8a6]/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded capitalize">
                    {node.category}
                  </span>
                </div>

                <p className="text-[11px] text-gray-300 leading-normal font-sans italic">
                  "{node.summary}"
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {node.tags?.map((t: string, idx: number) => (
                    <span key={idx} className="text-[8.5px] font-mono bg-black/50 text-gray-400 border border-glass px-1.5 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
