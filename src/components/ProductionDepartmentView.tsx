/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Wrench,
  Cpu,
  Layers,
  Users,
  CheckCircle,
  AlertTriangle,
  Play,
  ArrowRight,
  Database,
  History,
  FileText,
  Boxes,
  ShoppingBag,
  ExternalLink,
  RefreshCw,
  GitBranch,
  ShieldCheck,
  Search,
  BookMarked,
  Sparkles,
  Zap
} from "lucide-react";
import { ProductionPlanner, ProductionPlanInput, AssetNode, WorkerAllocation, ProductionPlanOutput } from "../company/ProductionPlanner";

export interface ProductionDepartmentViewProps {
  theme: "light" | "dark";
  logs: any[];
  addLog: (source: string, message: string, level: "INFO" | "WARN" | "ERROR" | "DEBUG") => void;
}

export function ProductionDepartmentView({ theme, logs, addLog }: ProductionDepartmentViewProps) {
  // Input fields for production plan
  const [goal, setGoal] = useState("Create Productivity Printable Business");
  const [businessType, setBusinessType] = useState("Printable Planners");
  const [marketplace, setMarketplace] = useState("Etsy");
  const [customer, setCustomer] = useState("Busy Professionals & Working Moms");
  const [brand, setBrand] = useState("AuraPlanners");
  const [budget, setBudget] = useState(150);
  const [deadline, setDeadline] = useState(48);

  const [activePlan, setActivePlan] = useState<ProductionPlanOutput | null>(null);
  const [runningProduction, setRunningProduction] = useState(false);
  const [productionProgress, setProductionProgress] = useState(0);
  const [currentNodeInProduction, setCurrentNodeInProduction] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<AssetNode | null>(null);

  // Asset store
  const [assets, setAssets] = useState<AssetNode[]>([]);
  const [workers, setWorkers] = useState<WorkerAllocation[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<Record<string, string>>({}); // workerType -> workerId

  // Creative Tournament states
  const [tournamentLog, setTournamentLog] = useState<string[]>([]);
  const [runningTournament, setRunningTournament] = useState(false);

  // Packaging Engine file tree state
  const [selectedPackageFolder, setSelectedPackageFolder] = useState<string>("Product");

  // Marketplace Formatter state
  const [selectedMarketplaceFormat, setSelectedMarketplaceFormat] = useState<string>("Etsy");

  // Prompt Knowledge Base
  const [kbPrompts, setKbPrompts] = useState([
    { style: "Serene Minimalist", prompt: "A luxury pastel beige theme using high contrast spacing grid rules, sans-serif pairings.", score: 98, usage: 14 },
    { style: "Nordic Editorial", prompt: "Elegant heritage serif typography, charcoal text on linen off-white backgrounds.", score: 95, usage: 22 },
    { style: "Dark Cyber-Tech", prompt: "Hyper-saturated neon-teal accents on absolute deep black space frames with monospace typography.", score: 92, usage: 19 }
  ]);

  // Handle building production plan
  const handleBuildPlan = () => {
    addLog("ProductionPlanner", "Analyzing business goal, compiling optimal production blueprint...", "INFO");
    const input: ProductionPlanInput = {
      businessGoal: goal,
      businessType,
      marketplace,
      customer,
      brand,
      budget,
      deadline
    };

    const output = ProductionPlanner.plan(input);
    setActivePlan(output);
    setAssets(output.assetsNeeded);
    setWorkers(output.workersAllocated);

    // Initialize selected workers
    const initialWorkers: Record<string, string> = {};
    output.workersAllocated.forEach(w => {
      if (!initialWorkers[w.type]) {
        initialWorkers[w.type] = w.id;
      }
    });
    setSelectedWorkers(initialWorkers);

    addLog("ProductionPlanner", `Plan formulated: ${output.assetsNeeded.length} assets mapped, budget estimated at $${output.estimatedCost} USD.`, "INFO");
  };

  // Run Step-by-Step Production Simulation
  const handleRunProduction = async () => {
    if (assets.length === 0) return;
    setRunningProduction(true);
    setProductionProgress(0);
    addLog("ProductionDirector", "Launching production line! Processing asset dependency graph (Asset DAG)...", "INFO");

    const updatedAssets = [...assets];
    
    // Sort assets topographically by dependencies (simple simulation)
    // For simplicity, we process them in an order where dependencies are generated first
    const orderOfGeneration = [
      "brand_guidelines",
      "brand_logo",
      "design_tokens",
      "core_pages",
      "cover_design",
      "course_curriculum",
      "digital_product_source",
      "product_photos",
      "docs_and_licenses",
      "seo_meta",
      "marketplace_listing",
      "marketing_social_ad",
      "packaging_files"
    ];

    for (let i = 0; i < orderOfGeneration.length; i++) {
      const assetId = orderOfGeneration[i];
      const assetIndex = updatedAssets.findIndex(a => a.id === assetId);
      
      if (assetIndex !== -1) {
        setCurrentNodeInProduction(assetId);
        updatedAssets[assetIndex].status = "PENDING";
        setAssets([...updatedAssets]);
        
        // Wait simulated duration
        await new Promise(resolve => setTimeout(resolve, 800));
        
        updatedAssets[assetIndex].status = "GENERATED";
        // Calculate random high-quality score based on worker
        const wType = updatedAssets[assetIndex].workerType;
        const selectedWorkerId = selectedWorkers[wType];
        const currentWorker = workers.find(w => w.id === selectedWorkerId);
        const baseRating = currentWorker ? currentWorker.qualityRating : 92;
        const finalScore = Math.min(100, Math.round(baseRating - 3 + Math.random() * 6));
        
        updatedAssets[assetIndex].qualityScore = finalScore;
        updatedAssets[assetIndex].reviewFeedback = [
          `Approved by Review Committee: Code structure clean.`,
          `Visual contrast checks pass: Rating ${finalScore}%.`
        ];
        
        setAssets([...updatedAssets]);
        setProductionProgress(Math.round(((i + 1) / orderOfGeneration.length) * 100));
        addLog("ProductionManager", `Generated asset: [${updatedAssets[assetIndex].name}] with quality ${finalScore}%`, "INFO");
      }
    }

    // Mark all as approved after a QA pass
    await new Promise(resolve => setTimeout(resolve, 500));
    for (let i = 0; i < updatedAssets.length; i++) {
      updatedAssets[i].status = "APPROVED";
    }
    setAssets([...updatedAssets]);
    setCurrentNodeInProduction(null);
    setRunningProduction(false);
    addLog("ReviewPipeline", "All assets have completed Multi-Agent Committee Review successfully (Technical, Brand, Customer & Legal validated).", "INFO");
  };

  // Simulate Creative Worker Tournament
  const runWorkerTournament = () => {
    setRunningTournament(true);
    setTournamentLog([]);
    addLog("WorkerAllocator", "Initiating Creative Worker Tournament for Branding Asset Creator...", "INFO");
    
    setTimeout(() => {
      setTournamentLog(prev => [...prev, "⚔️ MATCHUP: Brand Architect Bot vs. Premium Style Engine..."]);
    }, 400);

    setTimeout(() => {
      setTournamentLog(prev => [...prev, "⏱️ Speed Check: Architect completed in 8.2s ($0.02) vs. Premium in 11.8s ($0.05)."]);
    }, 1000);

    setTimeout(() => {
      setTournamentLog(prev => [...prev, "🎨 Brand Guidelines Quality Tournament: Architect (95% readability, cohesive color hierarchy) vs. Premium (91%)."]);
    }, 1600);

    setTimeout(() => {
      setTournamentLog(prev => [...prev, "🏆 WINNER SELECTED: Brand Architect Bot chosen for optimal Speed/Quality ratio."]);
      setRunningTournament(false);
      addLog("WorkerAllocator", "Tournament concluded. CEO allocated Brand Architect Bot for the current project run.", "INFO");
    }, 2200);
  };

  // Simulating Upstream Revision Cascade
  const triggerUpstreamRevision = (assetId: string) => {
    addLog("DigitalAssetGraph", `Upstream asset [${assetId}] revised to Version ${((assets.find(a => a.id === assetId)?.version || 1) + 1)}! Cascading changes...`, "WARN");
    
    const updated = assets.map(a => {
      if (a.id === assetId) {
        return {
          ...a,
          version: a.version + 1,
          status: "APPROVED" as const,
          qualityScore: Math.min(100, (a.qualityScore || 90) + 1)
        };
      }
      
      // Downstream assets that depend on this
      if (a.dependencies.includes(assetId)) {
        addLog("DigitalAssetGraph", `Auto-rebuilding downstream dependency [${a.name}] due to parent rebuild.`, "DEBUG");
        return {
          ...a,
          status: "REVISED" as const,
          version: a.version + 1
        };
      }
      return a;
    });

    setAssets(updated);
    
    // Auto restore to approved after short timeout simulation
    setTimeout(() => {
      setAssets(prev => prev.map(a => a.status === "REVISED" ? { ...a, status: "APPROVED" } : a));
      addLog("DigitalAssetGraph", "All downstream assets fully rebuilt and re-aligned with upstream changes.", "INFO");
    }, 1500);
  };

  useEffect(() => {
    if (assets.length === 0) {
      handleBuildPlan();
    }
  }, []);

  return (
    <div className="space-y-6" id="production-department-main">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0f0f0f] border border-glass shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20">
            <Wrench className="w-5 h-5 text-accent animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-mono font-bold uppercase text-white tracking-widest">Production Department</h1>
            <p className="text-[10px] text-gray-500 font-medium">Coordinate advanced multi-worker pipelines, asset graphs, packaging and marketplace distribution.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={runWorkerTournament}
            disabled={runningTournament}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg bg-white/5 border border-glass text-gray-300 hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50"
          >
            <Users className="w-3.5 h-3.5 text-accent" />
            <span>Creative Tournament</span>
          </button>
          
          <button
            onClick={handleRunProduction}
            disabled={runningProduction || assets.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg bg-accent text-white hover:bg-accent/80 transition-all cursor-pointer disabled:opacity-50 shadow-md"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Start Production Cycle</span>
          </button>
        </div>
      </div>

      {/* TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: CONSTRAINTS & WORKER TOURNEY */}
        <div className="lg:col-span-4 space-y-6">
          {/* PRODUCTION PLANNER INPUTS */}
          <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
            <div className="flex items-center gap-2 border-b border-glass pb-2.5">
              <Cpu className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Production Planner</h2>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[8px] uppercase tracking-wider font-bold text-gray-500 mb-1 font-mono">Business Goal</label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full text-[10px] p-2 rounded-lg font-mono"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[8px] uppercase tracking-wider font-bold text-gray-500 mb-1 font-mono">Business Type</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full text-[10px] p-2 rounded-lg font-mono bg-black"
                  >
                    <option value="Printable Planners">Printable Planners</option>
                    <option value="E-Books & Manuals">E-Books & Manuals</option>
                    <option value="AI Course Kits">AI Course Kits</option>
                    <option value="Logo Graphics Pack">Logo Graphics Pack</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-wider font-bold text-gray-500 mb-1 font-mono">Marketplace Target</label>
                  <select
                    value={marketplace}
                    onChange={(e) => setMarketplace(e.target.value)}
                    className="w-full text-[10px] p-2 rounded-lg font-mono bg-black"
                  >
                    <option value="Etsy">Etsy</option>
                    <option value="Whop">Whop</option>
                    <option value="Shopify">Shopify</option>
                    <option value="Gumroad">Gumroad</option>
                    <option value="Amazon KDP">Amazon KDP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-wider font-bold text-gray-500 mb-1 font-mono">Customer Persona</label>
                <input
                  type="text"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full text-[10px] p-2 rounded-lg font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-[8px] uppercase tracking-wider font-bold text-gray-500 mb-1 font-mono">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full text-[10px] p-2 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-wider font-bold text-gray-500 mb-1 font-mono">Budget ($)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full text-[10px] p-2 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-wider font-bold text-gray-500 mb-1 font-mono">Deadline (hrs)</label>
                  <input
                    type="number"
                    value={deadline}
                    onChange={(e) => setDeadline(Number(e.target.value))}
                    className="w-full text-[10px] p-2 rounded-lg font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleBuildPlan}
                className="w-full py-2 bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-all text-accent rounded-lg text-[9px] font-mono font-bold uppercase cursor-pointer"
              >
                Formulate Production Plan
              </button>
            </div>
          </div>

          {/* ACTIVE MISSION SUMMARY */}
          {activePlan && (
            <div className="p-5 rounded-2xl bg-accent/5 border border-accent/15 space-y-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">Active Mission</span>
              </div>
              <p className="text-[10px] text-gray-300 font-mono leading-relaxed">{activePlan.mission}</p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-glass">
                <div>
                  <span className="block text-[7px] text-gray-500 uppercase font-bold font-mono">ESTIMATED PRODUCTION COST</span>
                  <span className="text-xs font-mono font-bold text-white">${activePlan.estimatedCost} USD</span>
                </div>
                <div>
                  <span className="block text-[7px] text-gray-500 uppercase font-bold font-mono">ESTIMATED CYCLE TIME</span>
                  <span className="text-xs font-mono font-bold text-white">{activePlan.estimatedTimeSec} seconds</span>
                </div>
              </div>
            </div>
          )}

          {/* CREATIVE TOURNAMENT RESULTS PANEL */}
          <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-3">
            <div className="flex items-center justify-between border-b border-glass pb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#a855f7]" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Tournament Console</h3>
              </div>
              {runningTournament && <span className="text-[8px] font-mono text-[#a855f7] animate-pulse">SIMULATING...</span>}
            </div>

            <div className="p-3 bg-black rounded-lg border border-glass font-mono text-[9px] min-h-[100px] flex flex-col justify-end space-y-1">
              {tournamentLog.length === 0 ? (
                <span className="text-gray-600 italic">No tournament running. Click 'Creative Tournament' in the header to run matches.</span>
              ) : (
                tournamentLog.map((log, i) => (
                  <div key={i} className="text-gray-300">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE ASSET DAG & PACKAGING TREE */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* DIGITAL ASSET DEPENDENCY GRAPH (DAG) */}
          <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
            <div className="flex items-center justify-between border-b border-glass pb-2.5">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-accent" />
                <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Digital Asset Graph (Asset DAG)</h2>
              </div>
              <span className="text-[8px] font-mono text-gray-500 uppercase">Interactive Upstream Cascade</span>
            </div>

            {/* LIVE SIMULATION PROGRESS BAR */}
            {runningProduction && (
              <div className="space-y-1.5 p-3 rounded-xl bg-accent/5 border border-accent/15">
                <div className="flex justify-between text-[8px] font-mono font-bold text-accent uppercase">
                  <span>Generating Assets ...</span>
                  <span>{productionProgress}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent transition-all duration-300" style={{ width: `${productionProgress}%` }}></div>
                </div>
              </div>
            )}

            {/* VISUAL LAYOUT OF ASSETS DAG */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {assets.map((asset) => {
                const isCurrent = currentNodeInProduction === asset.id;
                const statusColor = 
                  asset.status === "APPROVED" ? "border-emerald-500/30 bg-emerald-500/[0.02] text-emerald-400" :
                  asset.status === "GENERATED" ? "border-teal-500/30 bg-teal-500/[0.02] text-teal-400" :
                  asset.status === "REVISED" ? "border-amber-500/30 bg-amber-500/[0.02] text-amber-400" :
                  "border-glass bg-black text-gray-500";
                
                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer hover:border-accent/40 ${statusColor} ${isCurrent ? "ring-1 ring-accent glow-teal" : ""}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[7px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5">{asset.type}</span>
                      <span className="text-[7px] font-mono text-gray-500">v{asset.version}</span>
                    </div>
                    <h3 className="text-[9px] font-semibold font-mono text-white truncate">{asset.name}</h3>
                    
                    {/* DEPENDENCIES DISPLAY */}
                    {asset.dependencies.length > 0 && (
                      <div className="mt-2 flex items-center gap-1 overflow-x-hidden text-[7px] font-mono text-gray-500">
                        <span>Requires:</span>
                        {asset.dependencies.map(dep => (
                          <span key={dep} className="px-1 bg-white/5 rounded text-[6px]">{dep}</span>
                        ))}
                      </div>
                    )}

                    <div className="mt-2.5 flex items-center justify-between border-t border-glass pt-1.5">
                      <span className="text-[8px] font-mono text-gray-400">{asset.status}</span>
                      {asset.qualityScore && (
                        <span className="text-[8px] font-mono font-bold text-accent">{asset.qualityScore}% Q</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ASSET DETAIL / INSPECTOR & REVISION SLOT */}
          {selectedAsset && (
            <div className="p-5 rounded-2xl bg-black border border-glass space-y-4">
              <div className="flex items-center justify-between border-b border-glass pb-2">
                <div className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-mono font-bold text-white uppercase">{selectedAsset.name} Inspector</span>
                </div>
                <button
                  onClick={() => triggerUpstreamRevision(selectedAsset.id)}
                  className="px-2 py-1 text-[8px] font-mono uppercase bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-500 rounded transition-all cursor-pointer"
                >
                  Force Upstream Revision
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[9px] font-mono">
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500 font-bold uppercase block text-[7px]">Prompt Directives</span>
                    <p className="text-gray-300 bg-white/5 p-2 rounded leading-relaxed">{selectedAsset.prompt || "No prompt details."}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold uppercase block text-[7px]">Assigned Worker Type</span>
                    <p className="text-white font-semibold">{selectedAsset.workerType}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500 font-bold uppercase block text-[7px]">Review Committee Feedback</span>
                    <div className="text-gray-300 space-y-1">
                      {selectedAsset.reviewFeedback?.map((fb, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                          <span>{fb}</span>
                        </div>
                      )) || <div className="text-gray-600 italic">No review records found. Start production run.</div>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-500 font-bold uppercase block text-[7px]">Compute Cost</span>
                      <span className="text-white">${selectedAsset.cost}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-bold uppercase block text-[7px]">Execution Time</span>
                      <span className="text-white">{selectedAsset.generationTimeSec}s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PACKAGING ENGINE & MARKETPLACE FORMATTER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* PACKAGING ENGINE VIEW */}
            <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
              <div className="flex items-center gap-2 border-b border-glass pb-2.5">
                <Boxes className="w-4 h-4 text-accent" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Packaging Engine (Auto-Bundling)</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-1">
                {(["Product", "Assets", "Marketing", "Licenses", "SEO", "Marketplace"] as const).map(folder => (
                  <button
                    key={folder}
                    onClick={() => setSelectedPackageFolder(folder)}
                    className={`py-1.5 rounded-lg text-[8px] font-mono font-bold uppercase border cursor-pointer ${selectedPackageFolder === folder ? "bg-accent/15 border-accent text-accent" : "bg-black border-glass text-gray-500 hover:text-gray-400"}`}
                  >
                    {folder}/
                  </button>
                ))}
              </div>

              {/* FOLDER FILE VIEW */}
              <div className="p-3 bg-black rounded-xl border border-glass font-mono text-[9px]">
                {selectedPackageFolder === "Product" && (
                  <div className="space-y-1">
                    <div className="text-white flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-accent" /> printable_pages_100_pack.pdf (24.2 MB)</div>
                    <div className="text-white flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-accent" /> source_illustrator_editable.ai (8.1 MB)</div>
                  </div>
                )}
                {selectedPackageFolder === "Assets" && (
                  <div className="space-y-1">
                    <div className="text-white flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-accent" /> brand_guidelines_corporate.pdf (1.2 MB)</div>
                    <div className="text-white flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-accent" /> logo_symbol_transparent.png (420 KB)</div>
                    <div className="text-white flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-accent" /> typography_css_tokens.json (4.2 KB)</div>
                  </div>
                )}
                {selectedPackageFolder === "Marketing" && (
                  <div className="space-y-1">
                    <div className="text-white flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-accent" /> high_ctr_pinterest_pin_1.jpg (1.8 MB)</div>
                    <div className="text-white flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-accent" /> instagram_square_promotional.jpg (2.1 MB)</div>
                  </div>
                )}
                {selectedPackageFolder === "Licenses" && (
                  <div className="space-y-1">
                    <div className="text-white flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-accent" /> commercial_license_agreement.txt (12 KB)</div>
                    <div className="text-white flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-accent" /> standard_use_eula.txt (8 KB)</div>
                  </div>
                )}
                {selectedPackageFolder === "SEO" && (
                  <div className="space-y-1">
                    <div className="text-white flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-accent" /> long_tail_search_keywords.csv (14 KB)</div>
                    <div className="text-white flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-accent" /> optimized_titles_meta.json (2.2 KB)</div>
                  </div>
                )}
                {selectedPackageFolder === "Marketplace" && (
                  <div className="space-y-1">
                    <div className="text-white flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-accent" /> formatted_etsy_listing.json (5.1 KB)</div>
                    <div className="text-white flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-accent" /> formatted_gumroad_config.json (3.8 KB)</div>
                    <div className="text-white flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-accent" /> product_bundle_release.zip (32.4 MB)</div>
                  </div>
                )}
              </div>
            </div>

            {/* MARKETPLACE FORMATTER */}
            <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
              <div className="flex items-center gap-2 border-b border-glass pb-2.5">
                <ShoppingBag className="w-4 h-4 text-accent" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Marketplace Formatter</h3>
              </div>

              <div className="grid grid-cols-4 gap-1">
                {(["Etsy", "Whop", "Shopify", "Gumroad"] as const).map(platform => (
                  <button
                    key={platform}
                    onClick={() => setSelectedMarketplaceFormat(platform)}
                    className={`py-1 rounded-lg text-[7px] font-mono font-bold uppercase border cursor-pointer ${selectedMarketplaceFormat === platform ? "bg-accent/15 border-accent text-accent" : "bg-black border-glass text-gray-500 hover:text-gray-400"}`}
                  >
                    {platform}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-black rounded-xl border border-glass font-mono text-[9px] space-y-2">
                <div className="flex justify-between border-b border-glass pb-1 text-[8px] text-gray-500 font-bold uppercase">
                  <span>Formatting Output</span>
                  <span className="text-teal-400">Aligned OK</span>
                </div>
                {selectedMarketplaceFormat === "Etsy" && (
                  <div className="space-y-1">
                    <div><span className="text-gray-500">Image Scale:</span> <span className="text-white">2000 x 2000 px</span></div>
                    <div><span className="text-gray-500">Metadata rules:</span> <span className="text-white">13 Tags maximum, short descriptive title</span></div>
                    <div><span className="text-gray-500">SEO Keyword Focus:</span> <span className="text-white">Commercial printable PDF planner</span></div>
                  </div>
                )}
                {selectedMarketplaceFormat === "Whop" && (
                  <div className="space-y-1">
                    <div><span className="text-gray-500">Asset Delivery:</span> <span className="text-white">Direct URL or Discord role lock</span></div>
                    <div><span className="text-gray-500">Cover Scale:</span> <span className="text-white">1200 x 800 px</span></div>
                    <div><span className="text-gray-500">Metadata rules:</span> <span className="text-white">Rich HTML features, support channels list</span></div>
                  </div>
                )}
                {selectedMarketplaceFormat === "Shopify" && (
                  <div className="space-y-1">
                    <div><span className="text-gray-500">Asset Delivery:</span> <span className="text-white">Digital product download link email cascade</span></div>
                    <div><span className="text-gray-500">Cover Scale:</span> <span className="text-white">1600 x 1000 px</span></div>
                    <div><span className="text-gray-500">SEO rules:</span> <span className="text-white">Programmatic schema.org formatting rules</span></div>
                  </div>
                )}
                {selectedMarketplaceFormat === "Gumroad" && (
                  <div className="space-y-1">
                    <div><span className="text-gray-500">Asset Delivery:</span> <span className="text-white">Direct redirect or file vault view</span></div>
                    <div><span className="text-gray-500">Cover Scale:</span> <span className="text-white">800 x 600 px (3:2 ratio)</span></div>
                    <div><span className="text-gray-500">Pricing options:</span> <span className="text-white">Pay what you want threshold, custom discount codes</span></div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* PRODUCTION KNOWLEDGE BASE */}
          <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-3">
            <div className="flex items-center gap-2 border-b border-glass pb-2.5">
              <BookMarked className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Production Prompt Knowledge Base</h3>
            </div>
            <div className="space-y-2">
              {kbPrompts.map((kb, idx) => (
                <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-black border border-glass text-[9px] font-mono">
                  <div className="space-y-0.5">
                    <span className="text-accent font-bold uppercase text-[8px]">{kb.style} Style</span>
                    <p className="text-gray-400 max-w-lg truncate">{kb.prompt}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="block text-[7px] text-gray-500 uppercase font-bold">SCORE</span>
                      <span className="text-emerald-400 font-bold">{kb.score}%</span>
                    </div>
                    <div>
                      <span className="block text-[7px] text-gray-500 uppercase font-bold">RUNS</span>
                      <span className="text-white">{kb.usage}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
