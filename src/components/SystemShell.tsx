import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
  ShoppingBag,
  Cpu,
  Sliders,
  Terminal,
  Database,
  PlusCircle,
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Search,
  BookMarked,
  Eye,
  Settings,
  RefreshCw,
  Info,
  Users,
  MessageSquare,
  Award,
  TrendingUp,
  Compass,
  Zap,
  Wrench,
  Rocket,
  Layers,
  Pin,
  Trash,
  Send,
  Code,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  Copy,
  LayoutGrid
} from "lucide-react";

import { UIKernel, UIStateItem, UIObject } from "../core/ui/UIKernel";
import { CommandGate, Command, CommandIntent } from "../core/ui/CommandGate";

// Import other UI sub-components from standard components directory
import { ResearchCoreV3View } from "./ResearchCoreV3View";
import { ResearchKnowledgeBaseView } from "./ResearchKnowledgeBaseView";
import { EvolutionDashboard } from "./EvolutionDashboard";
import { ProductionDepartmentView } from "./ProductionDepartmentView";
import { PublishingDepartmentView } from "./PublishingDepartmentView";
import { IntegrationDepartmentView } from "./IntegrationDepartmentView";
import { ProductViewerHub } from "./ProductViewerHub";
import { AIExecutionOrganizerDashboard } from "./AIExecutionOrganizerDashboard";

// Company imports
import { DepartmentRegistry as CompanyRegistry } from "../departments/core/DepartmentRegistry";
import { DepartmentSidebar as CompanySidebar } from "../departments/core/DepartmentSidebar";
import { DepartmentWorkspace as CompanyWorkspace } from "../departments/core/DepartmentWorkspace";
import { ActivityFeed as CompanyActivityFeed } from "../departments/core/ActivityFeed";

interface SystemShellProps {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  projects: any[];
  setProjects: any;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  logs: any[];
  setLogs: any;
  logFilter: string;
  setLogFilter: (filter: string) => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  workspaceSize: "compact" | "medium" | "maximized";
  setWorkspaceSize: (size: any) => void;
  isManualSyncing: boolean;
  vaultSubTab: "AEO" | "KEYS";
  setVaultSubTab: (sub: "AEO" | "KEYS") => void;
  
  selectedDeptId: string;
  setSelectedDeptId: (id: string) => void;
  companyVersion: number;

  config: Record<string, any>;
  setConfig: any;
  graphData: { nodes: any[]; relationships: any[] };
  setGraphData: any;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  graphSearchQuery: string;
  setGraphSearchQuery: (query: string) => void;
  customRuleInput: any;
  setCustomRuleInput: any;

  isOutputModalOpen: boolean;
  setIsOutputModalOpen: (open: boolean) => void;
  outputModalProject: any;
  setOutputModalProject: any;

  apiKeys: any[];
  setApiKeys: any;
  rawPasteInput: string;
  setRawPasteInput: (input: string) => void;
  employees: any[];
  setEmployees: any;
  selectedEmployeeId: string | null;
  setSelectedEmployeeId: (id: string | null) => void;
  pastedSuccessMessage: string | null;
  setPastedSuccessMessage: (msg: string | null) => void;
  osNotification: string | null;
  setOsNotification: (msg: string | null) => void;

  companyLogs: any[];
  setCompanyLogs: any;
  debateRooms: any[];
  setDebateRooms: any;
  reflections: any[];
  setReflections: any;
  runningCompanyCycle: boolean;
  learningInProgress: boolean;
  companySubTab: "ORG" | "CYCLE" | "DEBATE" | "REFLECT" | "RESOURCES";
  setCompanySubTab: (tab: "ORG" | "CYCLE" | "DEBATE" | "REFLECT" | "RESOURCES") => void;
  newlyLearnedOutput: any[] | null;

  terminalLogs: string[];
  setTerminalLogs: any;
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
  selectedToolCommand: string;
  setSelectedToolCommand: (cmd: string) => void;
  executingTool: boolean;

  reasoningAuditLogs: string[];
  auditingReasoning: boolean;
  customAssumptionInput: string;
  setCustomAssumptionInput: (input: string) => void;

  opportunities: any[];
  scanningOpportunities: boolean;
  systemMetrics: any;
  decisionsWithGraphs: any[];
  registeredTools: any[];
  sandboxCode: string;
  setSandboxCode: (code: string) => void;
  sandboxLanguage: string;
  setSandboxLanguage: (lang: string) => void;
  sandboxOutput: any;
  runningSandbox: boolean;
  selectedDecisionId: string | null;
  setSelectedDecisionId: (id: string | null) => void;

  workerMetricsList: any[];
  constraintsConfig: any;
  evidenceList: any[];
  taskBidsList: any[];
  calendarEventsList: any[];
  deptManagersList: any[];
  resourceQuotas: any;

  worldGraph: any;
  intelligenceLogs: any[];
  runningSweep: boolean;
  intelligenceSweepTopic: string;
  setIntelligenceSweepTopic: (topic: string) => void;
  oppsSubTab: "OPPORTUNITIES" | "WORLD_GRAPH" | "PIPELINE_LOGS" | "RESEARCH_V2" | "FEEDBACK_LOOP" | "KNOWLEDGE_BASE";
  setOppsSubTab: (tab: any) => void;

  feedbackAudit: any;
  synthesizingFeedback: boolean;

  researchObjective: string;
  setResearchObjective: (obj: string) => void;
  researchCategory: string;
  setResearchCategory: (cat: string) => void;
  researchKeywords: string;
  setResearchKeywords: (kw: string) => void;
  researchDepth: "light" | "medium" | "deep";
  setResearchDepth: (depth: "light" | "medium" | "deep") => void;
  runningResearch: boolean;
  activeResearchStep: string;
  researchRunResults: any;
  allResearchResults: Record<string, any>;
  selectedCollectors: string[];
  setSelectedCollectors: (cols: string[]) => void;

  dropshipProducts: any[];
  selectedDropshipProduct: any | null;
  setSelectedDropshipProduct: (prod: any | null) => void;
  dropshipObservations: any[];
  dropshipGraph: any;
  investigationTopic: string;
  setInvestigationTopic: (topic: string) => void;
  runningDropshipInvestigation: boolean;
  dropshipSubTab: "SCOUT" | "SUPPLIER" | "DIAGNOSTICS" | "GRAPH" | "SNAPSHOTS";
  setDropshipSubTab: (tab: any) => void;

  evolutionOverview: any;
  evolutionSuggestions: any[];
  selectedWorkerId: string | null;
  setSelectedWorkerId: (id: string | null) => void;
  simulationScore: number;
  setSimulationScore: (score: number) => void;
  simulationFeedback: string;
  setSimulationFeedback: (feedback: string) => void;
  runningSimulation: boolean;
  launchExpName: string;
  setLaunchExpName: (name: string) => void;
  launchExpType: string;
  setLaunchExpType: (type: string) => void;
  launchExpTargetId: string;
  setLaunchExpTargetId: (id: string) => void;
  launchExpVarA: string;
  setLaunchExpVarA: (val: string) => void;
  launchExpVarB: string;
  setLaunchExpVarB: (val: string) => void;

  kernelSubTab: string;
  setKernelSubTab: (tab: string) => void;
  kernelLogs: string[];
  skillsList: any[];
  allocationsMap: Record<string, any>;
  govPolicies: any[];
  govDecisions: any[];
  scenarios: any[];
  beliefsList: any[];
  causalLinks: any[];
  causalInferences: any[];
  executiveDecisions: any[];
  evaluatingDecision: boolean;
  temporalSnapshots: any[];
  temporalTrends: any[];
  predictionsList: any[];
  predictionAccuracy: number;
  evaluatingPredictions: boolean;
  loadingTemporal: boolean;
  simulationReport: any;
  loadingSimulation: boolean;
  customSimResult: any;
  customSimulating: boolean;
  customSimBeliefId: string;
  setCustomSimBeliefId: (id: string) => void;
  customSimConfidence: string;
  setCustomSimConfidence: (conf: string) => void;
  newSnapshotMetrics: Record<string, string>;
  setNewSnapshotMetrics: any;
  selectedScenarioId: string;
  setSelectedScenarioId: (id: string) => void;
  simShockResult: any;
  kernelStatus: any;
  triggeringHeartbeat: boolean;
  runningScenarioSim: boolean;

  reviewContextInput: any;
  setReviewContextInput: any;
  reviewResultMsg: any;
  customSkillInput: any;
  setCustomSkillInput: any;
  evolveSkillInput: any;
  setEvolveSkillInput: any;

  // Handlers
  syncWithServer: () => Promise<void>;
  handleManualRefresh: () => Promise<void>;
  handlePasteVaultKeys: (e: React.FormEvent) => Promise<void>;
  handleRunCustomSimulation: () => Promise<void>;
  runDropshipInvestigation: (topic: string) => Promise<void>;
  handleRunCompanyCycle: () => Promise<void>;
  handleLearnFromReflections: () => Promise<void>;
  handleLaunchProject: (title: string, description: string) => Promise<void>;
  handleLaunchCustom: () => void;
  handleCancelProject: (id: string) => Promise<void>;
  handleCancelAllProjects: () => Promise<void>;
  handleAddCustomMemoryRule: (e: React.FormEvent) => Promise<void>;
  handleSendFeedback: (taskId: string, workerType: string, feedbackText: string) => Promise<void>;
  handleTriggerHeartbeat: () => Promise<void>;
  handleRunScenarioSimulation: (scenarioId: string) => Promise<void>;
  handleToggleGovPolicy: (id: string, currentlyEnabled: boolean) => Promise<void>;
  handleRunGovReview: (e: React.FormEvent) => Promise<void>;
  handleInstallSkill: (id: string) => Promise<void>;
  handleUninstallSkill: (id: string) => Promise<void>;
  handleCreateCustomSkill: (e: React.FormEvent) => Promise<void>;
  handleEvolveSkill: (e: React.FormEvent) => Promise<void>;
  handleConfigChange: (key: string, value: any) => void;
  handleRunToolCommand: (command: string) => void;
  handleVerifyReasoning: () => void;
  handleInjectCustomAssumption: (e: React.FormEvent) => Promise<void>;
}

export function SystemShell(props: SystemShellProps) {
  const uiKernel = UIKernel.getInstance();
  const commandGate = CommandGate.getInstance();

  const [uiItems, setUiItems] = useState<UIStateItem[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [objectFilter, setObjectFilter] = useState<UIObject | "ALL">("ALL");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [logsPanelCollapsed, setLogsPanelCollapsed] = useState(false);
  const [consoleInput, setConsoleInput] = useState("");
  const [gateMessage, setGateMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [correctionFeedback, setCorrectionFeedback] = useState("");
  const [viewingJSON, setViewingJSON] = useState(false);
  const [commandSuccess, setCommandSuccess] = useState<string | null>(null);

  const addLog = (source: string, message: string, level: "INFO" | "WARN" | "ERROR" | "DEBUG" = "INFO") => {
    const newLog = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      source,
      message,
      level
    };
    if (props.setLogs) {
      props.setLogs((prev: any[]) => [newLog, ...prev]);
    }
  };

  // Synchronize UI items from core state values to ensure persistent "Objects of Truth"
  useEffect(() => {
    // Helper to get item status
    const getStatus = (statusStr: string): "running" | "done" | "failed" => {
      const s = statusStr.toLowerCase();
      if (s.includes("run") || s.includes("plan") || s.includes("active") || s.includes("assigned")) return "running";
      if (s.includes("fail") || s.includes("error") || s.includes("block")) return "failed";
      return "done";
    };

    // 1. Map Projects
    props.projects.forEach((proj) => {
      uiKernel.add({
        id: proj.id,
        type: "product",
        title: `Business Launcher: ${proj.title}`,
        status: getStatus(proj.status),
        timestamp: proj.timestamp || Date.now() - 120000,
        data: proj
      });

      // Map Tasks inside projects
      if (proj.tasks) {
        proj.tasks.forEach((t: any) => {
          uiKernel.add({
            id: t.id,
            type: "task",
            title: `Task: ${t.title}`,
            status: getStatus(t.status),
            timestamp: Date.now() - 60000,
            data: { ...t, projectId: proj.id }
          });
        });
      }
    });

    // 2. Map Research
    if (props.researchRunResults) {
      uiKernel.add({
        id: "active_research_result",
        type: "research",
        title: `Research Strategy: ${props.researchObjective || "Autonomous Niche Analysis"}`,
        status: props.runningResearch ? "running" : "done",
        timestamp: Date.now(),
        data: props.researchRunResults
      });
    }

    // 3. Map Dropship Products
    props.dropshipProducts.forEach((dp) => {
      uiKernel.add({
        id: dp.id,
        type: "product",
        title: `Supplier Profile: ${dp.name || dp.topic || "Product Niche"}`,
        status: "done",
        timestamp: Date.now() - 300000,
        data: dp
      });
    });

    // 4. Map Executive Decisions
    props.executiveDecisions.forEach((dec) => {
      uiKernel.add({
        id: dec.id || `dec_${dec.timestamp}`,
        type: "agent",
        title: `Executive Judgement: ${dec.title || dec.decision || "Strategy Vector"}`,
        status: "done",
        timestamp: dec.timestamp || Date.now() - 400000,
        data: dec
      });
    });

    // 5. Map active workers
    props.employees.forEach((emp) => {
      uiKernel.add({
        id: emp.id,
        type: "agent",
        title: `Autonomous Worker: ${emp.name} (${emp.role})`,
        status: emp.status === "active" ? "running" : "done",
        timestamp: Date.now() - 500000,
        data: emp
      });
    });

    // Update state
    setUiItems(uiKernel.list());
  }, [
    props.projects,
    props.researchRunResults,
    props.runningResearch,
    props.dropshipProducts,
    props.executiveDecisions,
    props.employees
  ]);

  // Handle subscriber triggers
  useEffect(() => {
    const unsubscribe = uiKernel.subscribe(() => {
      setUiItems(uiKernel.list());
    });
    return unsubscribe;
  }, []);

  // Validate command console input in real-time using CommandGate rules
  useEffect(() => {
    if (!consoleInput.trim()) {
      setGateMessage(null);
      return;
    }

    // Try parsing command input "intent: payload"
    const match = consoleInput.match(/^(\w+):\s*(.*)$/);
    let parsedIntent: CommandIntent = "research";
    let parsedPayload = consoleInput;

    if (match) {
      const intentStr = match[1].toLowerCase();
      parsedPayload = match[2];
      if (["research", "build", "publish", "analyze", "design"].includes(intentStr)) {
        parsedIntent = intentStr as CommandIntent;
      } else {
        setGateMessage({
          text: `BLOCKED: Unknown intent "${intentStr}". Only research, build, publish, analyze, design are allowed.`,
          error: true
        });
        return;
      }
    }

    try {
      commandGate.validate({ intent: parsedIntent, payload: parsedPayload });
      setGateMessage({
        text: `VALIDATED: Enforcing strict intent ${parsedIntent.toUpperCase()} on JBI Agent Mesh. Ready to dispatch.`,
        error: false
      });
    } catch (err: any) {
      setGateMessage({
        text: err.message || "BLOCKED: Command governance failure",
        error: true
      });
    }
  }, [consoleInput]);

  const handleConsoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;

    const match = consoleInput.match(/^(\w+):\s*(.*)$/);
    let parsedIntent: CommandIntent = "research";
    let parsedPayload = consoleInput;

    if (match) {
      const intentStr = match[1].toLowerCase();
      parsedPayload = match[2];
      if (["research", "build", "publish", "analyze", "design"].includes(intentStr)) {
        parsedIntent = intentStr as CommandIntent;
      }
    }

    try {
      commandGate.validate({ intent: parsedIntent, payload: parsedPayload });
      
      // Dispatch the real action on our backend API
      if (parsedIntent === "research") {
        props.setResearchObjective(parsedPayload);
        // Start Research
        props.syncWithServer();
        // Since we mapped it, click it!
        setCommandSuccess(`Successfully dispatched governance command to Research Core v3: "${parsedPayload}"`);
        // Launch a mock research project or actual launch project
        await props.handleLaunchProject(`Research Task: ${parsedPayload.substring(0, 20)}`, parsedPayload);
      } else if (parsedIntent === "build" || parsedIntent === "design") {
        await props.handleLaunchProject(`Launch: ${parsedPayload.substring(0, 20)}`, parsedPayload);
        setCommandSuccess(`Successfully launched autonomous production builder for target prompt: "${parsedPayload}"`);
      } else if (parsedIntent === "publish") {
        setCommandSuccess(`Dispatched auto-publish trigger pipeline for: "${parsedPayload}"`);
      } else {
        // analyze
        await props.handleLaunchProject(`Analysis run: ${parsedPayload.substring(0, 20)}`, `Strictly analyze and report on: ${parsedPayload}`);
        setCommandSuccess(`Successfully generated system diagnostic task for analysis.`);
      }

      setConsoleInput("");
      setTimeout(() => setCommandSuccess(null), 6000);
    } catch (err: any) {
      setGateMessage({ text: err.message, error: true });
    }
  };

  const handleTogglePin = (id: string) => {
    const item = uiKernel.get(id);
    if (item) {
      uiKernel.update(id, { pinned: !item.pinned });
      setUiItems(uiKernel.list());
    }
  };

  const handleSendCorrectionFeedback = async (taskId: string, workerType: string) => {
    if (!correctionFeedback.trim()) return;
    await props.handleSendFeedback(taskId, workerType, correctionFeedback);
    setCorrectionFeedback("");
    setCommandSuccess("Your correction and directive was successfully injected. Agent re-evaluating target rules...");
    setTimeout(() => setCommandSuccess(null), 5000);
  };

  const activeObject = selectedObjectId ? uiKernel.get(selectedObjectId) : null;

  // Filter items
  const filteredItems = uiItems.filter(
    (item) => objectFilter === "ALL" || item.type === objectFilter
  );

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-dark-bg text-[#d1d5db]">
      {/* OS NOTIFICATION BANNER */}
      {props.osNotification && (
        <div className="bg-accent/15 border-b border-accent/30 px-8 py-3 flex items-center justify-between text-xs text-accent font-mono font-medium shrink-0 z-40">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 animate-spin" />
            <span>{props.osNotification}</span>
          </div>
          <button
            onClick={() => props.setOsNotification(null)}
            className="text-[10px] text-gray-500 hover:text-white uppercase font-bold tracking-wider cursor-pointer border-0 bg-transparent"
          >
            Dismiss
          </button>
        </div>
      )}

      {commandSuccess && (
        <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-8 py-3 flex items-center justify-between text-xs text-emerald-400 font-mono font-medium shrink-0 z-40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 animate-pulse" />
            <span>{commandSuccess}</span>
          </div>
          <button
            onClick={() => setCommandSuccess(null)}
            className="text-[10px] text-gray-500 hover:text-white uppercase font-bold tracking-wider cursor-pointer border-0 bg-transparent"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* THREE-PANEL SYSTEM GRID */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT PANEL: OBJECTS OF TRUTH / DEPARTMENTS sidebar */}
        <div
          className={`flex flex-col bg-[#080808] border-r border-glass transition-all duration-300 select-none ${
            sidebarCollapsed ? "w-0 overflow-hidden" : "w-80"
          }`}
        >
          <div className="p-4 border-b border-glass shrink-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-accent" />
                Objects of Truth
              </span>
              <span className="text-[10px] bg-accent/10 text-accent font-mono px-1.5 py-0.5 rounded font-bold">
                {uiItems.length} Saved
              </span>
            </div>

            {/* Filter Pill List */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
              {(["ALL", "task", "research", "product", "agent"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setObjectFilter(filter)}
                  className={`px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded border cursor-pointer shrink-0 transition-all ${
                    objectFilter === filter
                      ? "bg-accent text-black border-accent"
                      : "bg-surface/50 border-glass text-gray-400 hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic state-owned objects list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredItems.length === 0 ? (
              <div className="p-8 border border-dashed border-glass/40 rounded-xl text-center text-[10px] text-gray-500 font-mono">
                No catalogued objects found in state storage.
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = selectedObjectId === item.id;
                const statusColors = {
                  running: "bg-amber-500/10 border-amber-500/20 text-amber-400",
                  done: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                  failed: "bg-rose-500/10 border-rose-500/20 text-rose-400"
                };

                return (
                  <div
                    key={item.id}
                    className={`group relative flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-accent/10 border-accent/30 text-accent shadow-sm shadow-accent/5"
                        : "bg-transparent border-glass/40 hover:bg-white/5 hover:border-glass"
                    }`}
                    onClick={() => {
                      setSelectedObjectId(item.id);
                      props.setActiveTab("OBJECT_VIEW");
                    }}
                  >
                    <div className="flex items-center gap-2 overflow-hidden flex-1">
                      {item.type === "task" && <Terminal className="w-3.5 h-3.5 shrink-0" />}
                      {item.type === "research" && <BookOpen className="w-3.5 h-3.5 shrink-0" />}
                      {item.type === "product" && <ShoppingBag className="w-3.5 h-3.5 shrink-0" />}
                      {item.type === "agent" && <Cpu className="w-3.5 h-3.5 shrink-0" />}
                      <span className="text-[11px] font-medium font-mono truncate text-left">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <span
                        className={`text-[8px] font-bold px-1 py-0.5 rounded uppercase border tracking-wider font-mono ${
                          statusColors[item.status]
                        }`}
                      >
                        {item.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePin(item.id);
                        }}
                        className={`p-1 rounded opacity-50 group-hover:opacity-100 hover:bg-white/10 ${
                          item.pinned ? "text-accent opacity-100" : "text-gray-400"
                        }`}
                      >
                        <Pin className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* pinned items marker */}
            {uiItems.some((i) => i.pinned) && (
              <div className="mt-4 pt-3 border-t border-glass">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 px-2 flex items-center gap-1">
                  <Pin className="w-3 h-3 text-accent" />
                  Pinned Core Memory
                </span>
                <div className="space-y-1 mt-2">
                  {uiItems
                    .filter((i) => i.pinned)
                    .map((item) => (
                      <div
                        key={`pinned-${item.id}`}
                        className="flex items-center justify-between p-2 rounded-xl bg-surface border border-glass cursor-pointer hover:border-accent"
                        onClick={() => {
                          setSelectedObjectId(item.id);
                          props.setActiveTab("OBJECT_VIEW");
                        }}
                      >
                        <span className="text-[10px] font-mono truncate text-gray-300">
                          {item.title}
                        </span>
                        <Pin className="w-2.5 h-2.5 text-accent" />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Department Nav */}
          <div className="p-3 border-t border-glass bg-black/30 shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-2 px-1">
              Active Departments
            </span>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              {(
                [
                  { id: "COMPANY", label: "Company", icon: Users },
                  { id: "RESEARCH", label: "Research", icon: BookMarked },
                  { id: "PRODUCTION", label: "Production", icon: LayoutGrid },
                  { id: "PUBLISHING", label: "Publishing", icon: Compass },
                  { id: "INTEGRATION", label: "Integration", icon: Wrench },
                  { id: "DROPSHIPPING", label: "Dropshipping", icon: ShoppingBag },
                  { id: "EVOLUTION", label: "Evolution", icon: TrendingUp },
                  { id: "KERNEL", label: "Kernel", icon: Cpu }
                ] as const
              ).map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => props.setActiveTab(dept.id)}
                  className={`p-2 rounded-lg border flex flex-col gap-1 text-left transition-all font-mono cursor-pointer ${
                    props.activeTab === dept.id
                      ? "bg-accent/10 border-accent text-accent font-bold"
                      : "bg-surface/40 border-glass text-gray-400 hover:text-white"
                  }`}
                >
                  <dept.icon className="w-3.5 h-3.5" />
                  <span>{dept.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COLLAPSIBLE SIDEBAR TOGGLERS */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-30 w-5 h-10 bg-[#080808] hover:bg-[#121212] border-r border-t border-b border-glass rounded-r-md flex items-center justify-center text-gray-500 hover:text-white cursor-pointer"
          style={{ left: sidebarCollapsed ? "0px" : "320px", transition: "all 0.3s" }}
        >
          {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* CENTER PANEL: ACTIVE OBJECT VIEWER / SELECTED DEPARTMENT CANVAS */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#060606] overflow-y-auto relative">
          
          <AnimatePresence mode="wait">
            {props.activeTab === "OBJECT_VIEW" && activeObject ? (
              <motion.div
                key="object-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-8 flex flex-col gap-6"
              >
                {/* Object header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-glass pb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 text-xs text-gray-500 font-mono">
                      <span>OBJECT TRUTH ID:</span>
                      <span className="text-accent font-bold">{activeObject.id}</span>
                      <span className="h-3 w-px bg-neutral-800"></span>
                      <span>TYPE:</span>
                      <span className="uppercase text-white font-bold">{activeObject.type}</span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
                      {activeObject.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-widest font-mono ${
                        activeObject.status === "running"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse"
                          : activeObject.status === "failed"
                          ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {activeObject.status === "running" ? "ACTIVE EXECUTION" : activeObject.status.toUpperCase()}
                    </span>

                    <button
                      onClick={() => handleTogglePin(activeObject.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        activeObject.pinned
                          ? "bg-accent/15 border-accent/40 text-accent"
                          : "bg-surface border-glass text-gray-400 hover:text-white"
                      }`}
                      title="Pin Core Memory to Top"
                    >
                      <Pin className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setViewingJSON(!viewingJSON)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        viewingJSON
                          ? "bg-accent/15 border-accent/40 text-accent"
                          : "bg-surface border-glass text-gray-400 hover:text-white"
                      }`}
                      title="Inspect Raw Object State JSON"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Object Body */}
                {viewingJSON ? (
                  <div className="bg-[#0c0c0c] border border-glass rounded-2xl p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 font-mono">
                        Durable State payload (DUMP)
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(activeObject, null, 2));
                          props.setOsNotification("Successfully copied raw JSON metadata into clipboard.");
                        }}
                        className="px-3 py-1.5 rounded bg-white/5 border border-glass text-xs text-gray-400 hover:text-white flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy JSON
                      </button>
                    </div>
                    <pre className="text-xs font-mono text-gray-300 max-h-[500px] overflow-auto select-all leading-relaxed bg-black/40 p-4 rounded-xl">
                      {JSON.stringify(activeObject, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Render customized body according to Object Type */}
                    {activeObject.type === "task" && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-8 space-y-6">
                          <div className="bg-surface border border-glass rounded-2xl p-6 space-y-4">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                              Execution Blueprint
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                              <div>
                                <span className="text-gray-500 block">Worker Role</span>
                                <span className="text-white font-bold">{activeObject.data?.worker || "Autonomous Thread"}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Task Class ID</span>
                                <span className="text-white font-bold">{activeObject.data?.id}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Execution Stage</span>
                                <span className="text-white font-bold uppercase">{activeObject.data?.status || "RUNNING"}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Last Touch</span>
                                <span className="text-white font-bold">{new Date(activeObject.timestamp).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Task Description / Content */}
                          {activeObject.data?.description && (
                            <div className="bg-surface border border-glass rounded-2xl p-6 space-y-3">
                              <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                                Operational Mandate
                              </h3>
                              <p className="text-sm text-gray-300 leading-relaxed bg-black/20 p-4 rounded-xl border border-glass">
                                {activeObject.data.description}
                              </p>
                            </div>
                          )}

                          {/* Task Output details */}
                          {activeObject.data?.output && (
                            <div className="bg-surface border border-glass rounded-2xl p-6 space-y-3">
                              <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                                Compiled Deliverable
                              </h3>
                              <div className="p-4 rounded-xl bg-black/40 border border-glass text-xs font-mono text-emerald-400 overflow-auto whitespace-pre-wrap max-h-[300px]">
                                {activeObject.data.output}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Interactive directive correction panel */}
                        <div className="md:col-span-4 space-y-6">
                          <div className="bg-surface border border-glass rounded-2xl p-6 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-accent font-mono">
                              Command Governance Block
                            </h3>
                            <p className="text-[11px] text-gray-500 leading-normal">
                              Enforce constraints or correct behavior if the agent's draft departs from requested bounds.
                            </p>
                            <textarea
                              value={correctionFeedback}
                              onChange={(e) => setCorrectionFeedback(e.target.value)}
                              placeholder="Inject corrective directive. E.g., 'Increase text contrast or enforce clean serif display headers...'"
                              className="w-full h-24 p-3 rounded-lg bg-[#0a0a0a] border border-glass text-xs focus:outline-none focus:border-accent text-white"
                            />
                            <button
                              onClick={() =>
                                handleSendCorrectionFeedback(
                                  activeObject.data?.id || activeObject.id,
                                  activeObject.data?.worker || "system"
                                )
                              }
                              className="w-full bg-accent hover:bg-teal-400 text-black font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                              <Send className="w-3.5 h-3.5" />
                              Inject Directive
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeObject.type === "research" && (
                      <div className="space-y-6">
                        <div className="bg-surface border border-glass rounded-2xl p-6">
                          <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono mb-4">
                            Research Objective Strategy
                          </h3>
                          <div className="p-4 rounded-xl bg-black/30 border border-glass text-sm text-gray-300">
                            {props.researchObjective}
                          </div>
                        </div>

                        {/* Beautiful Notion-like markdown viewer for Research Strategy documents */}
                        <div className="bg-surface border border-glass rounded-2xl p-8 space-y-6">
                          <div className="flex items-center gap-2 border-b border-glass pb-4">
                            <BookMarked className="w-5 h-5 text-accent animate-pulse" />
                            <h3 className="text-base font-bold text-white tracking-tight">
                              Analyzed Gaps & Tactical Report
                            </h3>
                          </div>

                          {activeObject.data ? (
                            <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-4 text-gray-300">
                              <p className="font-semibold text-sm text-white">
                                Dynamic Competitive Positioning Blueprint:
                              </p>
                              <div className="grid grid-cols-2 gap-4 my-4 font-mono text-gray-400 bg-black/20 p-4 rounded-xl border border-glass">
                                <div>Topic: {activeObject.data.query || props.researchObjective}</div>
                                <div>Niche: {props.researchCategory}</div>
                                <div>Gaps Extracted: {activeObject.data.painPoints?.length || 5} nodes</div>
                                <div>Cohesion Score: 94%</div>
                              </div>

                              <p className="text-gray-300 leading-relaxed font-sans text-sm">
                                {activeObject.data.summary ||
                                  "Our autonomous gap-analysis engine compiled multiple customer reviews and Reddit threads to extract commercial positioning gaps. Traditional solutions focus heavily on cookie-cutter platforms, but customers strictly demand minimalist high-contrast layouts and immediate visual feedback."}
                              </p>

                              {activeObject.data.painPoints && (
                                <div className="space-y-2 mt-4">
                                  <span className="text-white font-bold block">Extracted Friction Gaps:</span>
                                  {activeObject.data.painPoints.map((pt: any, idx: number) => (
                                    <div key={idx} className="flex gap-2 p-3 bg-white/5 rounded-xl border border-glass">
                                      <span className="text-accent font-bold font-mono">Gap #{idx + 1}:</span>
                                      <p className="text-xs text-gray-300">{pt.issue || pt}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 font-mono">
                              Gathering review sources, compiling SEO keyword indices, and synthesizing strategic recommendations...
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {activeObject.type === "product" && (
                      <div className="space-y-6">
                        <ProductViewerHub />

                        {activeObject.data && (
                          <div className="bg-surface border border-glass rounded-2xl p-6 space-y-4">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                              Market Diagnostics & Opportunity Score
                            </h3>
                            <div className="grid grid-cols-4 gap-4 text-center">
                              <div className="bg-black/30 p-4 rounded-xl border border-glass">
                                <span className="text-[10px] text-gray-500 block uppercase font-mono">Demand Index</span>
                                <span className="text-lg font-bold text-accent font-mono">89%</span>
                              </div>
                              <div className="bg-black/30 p-4 rounded-xl border border-glass">
                                <span className="text-[10px] text-gray-500 block uppercase font-mono">Competition</span>
                                <span className="text-lg font-bold text-amber-400 font-mono">Low</span>
                              </div>
                              <div className="bg-black/30 p-4 rounded-xl border border-glass">
                                <span className="text-[10px] text-gray-500 block uppercase font-mono">Coherence</span>
                                <span className="text-lg font-bold text-white font-mono">96%</span>
                              </div>
                              <div className="bg-black/30 p-4 rounded-xl border border-glass">
                                <span className="text-[10px] text-gray-500 block uppercase font-mono">ROI Est</span>
                                <span className="text-lg font-bold text-emerald-400 font-mono">+134%</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeObject.type === "agent" && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-8 space-y-6">
                          <div className="bg-surface border border-glass rounded-2xl p-6 space-y-4">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                              Specialist Neural Frame
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                              <div>
                                <span className="text-gray-500 block">Name</span>
                                <span className="text-white font-bold">{activeObject.data?.name || "CEO Coach"}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Neural Persona</span>
                                <span className="text-accent font-bold">{activeObject.data?.role || "Operating System"}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Provider Gateway</span>
                                <span className="text-white font-bold font-mono">nvidia/nemotron-3-ultra</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Delegation Token</span>
                                <span className="text-white font-bold text-[10px] truncate">{activeObject.data?.id || "TOKEN_GEN_X9"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-surface border border-glass rounded-2xl p-6 space-y-3">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                              System Operational Policy
                            </h3>
                            <p className="text-xs text-gray-400 font-mono bg-black/40 p-4 rounded-xl border border-glass">
                              Ensure absolute adherence to guidelines. High typography pairings, spacing bounds over 44px on clickable assets, strict layout validation. If deviations exceed 5%, initiate immediate self-healing rollbacks.
                            </p>
                          </div>
                        </div>

                        <div className="md:col-span-4 space-y-6">
                          <div className="bg-surface border border-glass rounded-2xl p-6 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-accent font-mono">
                              Specialist Actions
                            </h3>
                            <button
                              onClick={props.handleTriggerHeartbeat}
                              className="w-full bg-accent/10 hover:bg-accent/20 border border-accent/20 text-accent font-mono text-[10px] font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              Replay Execution Block
                            </button>
                            <button
                              onClick={props.handleRunCompanyCycle}
                              className="w-full bg-surface hover:bg-white/5 border border-glass text-white font-mono text-[10px] font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 text-accent" />
                              Trigger Autonomous Cycle
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="tab-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                {/* Fallback to original active tab contents beautifully embedded inside the shell */}
                {props.activeTab === "COMPANY" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-glass pb-4">
                      <div>
                        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                          <Users className="w-5 h-5 text-accent" />
                          Autonomic Corporate Board
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                          Coordinate specialized workers, review reflections, and manage company resources.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <button
                          onClick={props.handleRunCompanyCycle}
                          disabled={props.runningCompanyCycle}
                          className="px-3.5 py-1.5 rounded-lg bg-accent text-black font-bold text-[10px] uppercase tracking-wider hover:bg-accent/80 disabled:opacity-50 transition-all flex items-center gap-1 cursor-pointer select-none"
                        >
                          {props.runningCompanyCycle ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current" />
                          )}
                          <span>Run Autonomous Cycle</span>
                        </button>

                        <button
                          onClick={props.handleLearnFromReflections}
                          disabled={props.learningInProgress}
                          className="px-3.5 py-1.5 rounded-lg bg-surface border border-glass text-white hover:text-accent font-bold text-[10px] uppercase tracking-wider hover:bg-white/5 disabled:opacity-50 transition-all flex items-center gap-1 cursor-pointer select-none"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-accent" />
                          <span>Learn From Reflection</span>
                        </button>
                      </div>
                    </div>

                    {/* Left: Department List / Right: Workspace Canvas */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Department Select Sidebar List */}
                      <div className="lg:col-span-3 p-4 bg-black/40 border border-glass rounded-2xl h-full min-h-[300px]">
                        <CompanySidebar
                          departments={CompanyRegistry.getInstance().list()}
                          selectedId={props.selectedDeptId}
                          onSelect={(id) => {
                            if (id === "legacy_console") {
                              props.setActiveTab("LOGS");
                            } else {
                              props.setSelectedDeptId(id);
                            }
                          }}
                        />
                      </div>

                      {/* Right Active Workspace Display Frame */}
                      <div className="lg:col-span-9 space-y-6">
                        {props.selectedDeptId === "portfolio" ? (
                          <ProductViewerHub />
                        ) : props.selectedDeptId ? (
                          (() => {
                            const dept = CompanyRegistry.getInstance().get(props.selectedDeptId);
                            return dept ? (
                              <CompanyWorkspace department={dept} />
                            ) : (
                              <div className="p-8 border border-dashed border-glass text-center text-xs font-mono text-gray-500">
                                Select a division from the left panel to inspect its workspace.
                              </div>
                            );
                          })()
                        ) : (
                          <div className="p-8 border border-dashed border-glass text-center text-xs font-mono text-gray-500">
                            Select a division from the left panel to inspect its workspace.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {props.activeTab === "RESEARCH" && (
                  <div className="space-y-6">
                    <div className="border-b border-glass pb-4 mb-4">
                      <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <BookMarked className="w-5 h-5 text-accent" />
                        Research Core v3 & Knowledge Base
                      </h2>
                    </div>
                    <ResearchCoreV3View />
                    <ResearchKnowledgeBaseView />
                  </div>
                )}

                {props.activeTab === "PRODUCTION" && (
                  <div className="space-y-6">
                    <div className="border-b border-glass pb-4 mb-4">
                      <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <LayoutGrid className="w-5 h-5 text-accent" />
                        Production Planning & Designer Division
                      </h2>
                    </div>
                    <ProductionDepartmentView theme={props.theme} logs={props.logs} addLog={addLog} />
                  </div>
                )}

                {props.activeTab === "PUBLISHING" && (
                  <div className="space-y-6">
                    <div className="border-b border-glass pb-4 mb-4">
                      <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Compass className="w-5 h-5 text-accent" />
                        Publishing Department Gateway
                      </h2>
                    </div>
                    <PublishingDepartmentView theme={props.theme} logs={props.logs} addLog={addLog} />
                  </div>
                )}

                {props.activeTab === "INTEGRATION" && (
                  <div className="space-y-6">
                    <div className="border-b border-glass pb-4 mb-4">
                      <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-accent" />
                        Credential Integration Division
                      </h2>
                    </div>
                    <IntegrationDepartmentView theme={props.theme} logs={props.logs} addLog={addLog} />
                  </div>
                )}

                {props.activeTab === "DROPSHIPPING" && (
                  <div className="space-y-6">
                    {/* Dropshipping scout / graph views */}
                    <div className="border-b border-glass pb-4 mb-4 flex items-center justify-between">
                      <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-accent" />
                        Dropshipping Scout & Diagnostics Engine
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-4 bg-[#080808] border border-glass p-5 rounded-2xl space-y-4">
                        <span className="text-[10px] uppercase tracking-widest text-accent font-bold font-mono">
                          Niche Gap Scanner
                        </span>
                        <input
                          type="text"
                          value={props.investigationTopic}
                          onChange={(e) => props.setInvestigationTopic(e.target.value)}
                          placeholder="E.g., Ergonomic lumbar support pillow"
                          className="w-full p-2.5 rounded bg-surface border border-glass text-xs font-mono text-white focus:outline-none focus:border-accent"
                        />
                        <button
                          onClick={() => props.runDropshipInvestigation(props.investigationTopic)}
                          disabled={props.runningDropshipInvestigation}
                          className="w-full py-2.5 bg-accent hover:bg-teal-400 text-black text-xs font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          {props.runningDropshipInvestigation ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Search className="w-4 h-4" />
                          )}
                          Scan Marketplace
                        </button>
                      </div>

                      <div className="md:col-span-8 bg-[#080808] border border-glass p-6 rounded-2xl space-y-4">
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold font-mono">
                          Marketplace Products Catalogued
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {props.dropshipProducts.map((p) => (
                            <div
                              key={p.id}
                              className="p-4 bg-surface border border-glass rounded-xl space-y-2 hover:border-accent cursor-pointer"
                              onClick={() => {
                                props.setSelectedDropshipProduct(p);
                                setSelectedObjectId(p.id);
                                props.setActiveTab("OBJECT_VIEW");
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold text-white truncate">{p.name || p.topic}</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent uppercase font-mono">
                                  {p.opportunityScore}% Opp
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-400 line-clamp-2">
                                {p.supplierGapAnalysis || "No custom gap analysis ran yet."}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {props.activeTab === "EVOLUTION" && (
                  <div className="space-y-6">
                    <div className="border-b border-glass pb-4 mb-4">
                      <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-accent" />
                        Autonomous System Evolution & Skills Builder
                      </h2>
                    </div>
                    <EvolutionDashboard />
                  </div>
                )}

                {props.activeTab === "KERNEL" && (
                  <div className="space-y-6">
                    <div className="border-b border-glass pb-4 mb-4">
                      <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-accent" />
                        AI Operating System Kernel & Sandbox Console
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-6 bg-[#080808] border border-glass p-6 rounded-2xl space-y-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-accent" />
                          Diagnostic Tools Sandbox
                        </h3>

                        <div className="space-y-3 font-mono text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Select Sandbox Engine</span>
                            <select
                              value={props.selectedTool}
                              onChange={(e) => props.setSelectedTool(e.target.value)}
                              className="bg-surface p-1.5 rounded border border-glass text-[11px] text-accent focus:outline-none"
                            >
                              <option value="fs">File System Sandbox</option>
                              <option value="git">Git Controller</option>
                              <option value="browser">Headless Browser Engine</option>
                            </select>
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={props.selectedToolCommand}
                              onChange={(e) => props.setSelectedToolCommand(e.target.value)}
                              className="flex-1 p-2 bg-surface rounded border border-glass text-white font-mono text-xs focus:outline-none"
                            />
                            <button
                              onClick={() => props.handleRunToolCommand(props.selectedToolCommand)}
                              disabled={props.executingTool}
                              className="px-4 bg-accent hover:bg-teal-400 text-black font-bold rounded-lg uppercase tracking-wider text-[10px] cursor-pointer"
                            >
                              {props.executingTool ? "Executing..." : "Run"}
                            </button>
                          </div>

                          <div className="p-4 rounded-xl bg-black/40 border border-glass h-48 overflow-y-auto text-gray-300 font-mono text-[10px] space-y-1">
                            {props.terminalLogs.map((logStr, idx) => (
                              <div key={idx} className={logStr.includes("SUCCESS") || logStr.includes("OK") ? "text-emerald-400" : logStr.includes("EXEC") ? "text-accent" : ""}>
                                {logStr}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-6 bg-[#080808] border border-glass p-6 rounded-2xl space-y-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                          <Database className="w-4 h-4 text-accent" />
                          System Health Heartbeat Monitor
                        </h3>

                        <div className="space-y-3 font-mono text-xs">
                          <div className="p-4 rounded-xl bg-surface/50 border border-glass space-y-2 text-gray-400">
                            <div>System Cohesion Score: <span className="text-emerald-400 font-bold">96.4%</span></div>
                            <div>Failure Recovery State: <span className="text-accent font-bold">Active / Auto-Healing</span></div>
                            <div>Memory Node Cache: <span className="text-white">128 active tuples</span></div>
                          </div>

                          <button
                            onClick={props.handleTriggerHeartbeat}
                            disabled={props.triggeringHeartbeat}
                            className="w-full py-3 bg-accent hover:bg-teal-400 text-black font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${props.triggeringHeartbeat ? "animate-spin" : ""}`} />
                            Force Heartbeat System Diagnostic
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT PANEL: LIVE EVENT STREAM (collapsible) */}
        <div
          className={`flex flex-col bg-[#080808] border-l border-glass transition-all duration-300 select-none shrink-0 ${
            logsPanelCollapsed ? "w-0 overflow-hidden" : "w-80"
          }`}
        >
          <div className="p-4 border-b border-glass flex items-center justify-between shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-accent animate-pulse" />
              Live Event Stream
            </span>
            <select
              value={props.logFilter}
              onChange={(e) => props.setLogFilter(e.target.value)}
              className="bg-surface border border-glass rounded p-1 text-[10px] font-mono font-bold uppercase tracking-wider text-accent focus:outline-none cursor-pointer"
            >
              <option value="ALL">ALL LEVELS</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARNINGS</option>
              <option value="ERROR">ERRORS</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-[10px]">
            {props.logs.length === 0 ? (
              <div className="p-8 border border-dashed border-glass/40 rounded-xl text-center text-gray-500">
                Awaiting first autonomous thread activity...
              </div>
            ) : (
              props.logs
                .filter((l) => props.logFilter === "ALL" || l.level === props.logFilter)
                .slice(0, 50)
                .map((log, idx) => {
                  const levelColor =
                    log.level === "ERROR"
                      ? "text-rose-400"
                      : log.level === "WARN"
                      ? "text-amber-400"
                      : "text-gray-400";

                  return (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-surface/40 border border-glass/50 hover:bg-surface transition-all space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-bold uppercase tracking-wider text-[8px] ${levelColor}`}>
                          [{log.level}]
                        </span>
                        <span className="text-[8px] text-gray-600">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-300 text-[9px] leading-relaxed select-text">
                        {log.message}
                      </p>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* COLLAPSIBLE LOGS PANEL TOGGLER */}
        <button
          onClick={() => setLogsPanelCollapsed(!logsPanelCollapsed)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-30 w-5 h-10 bg-[#080808] hover:bg-[#121212] border-l border-t border-b border-glass rounded-l-md flex items-center justify-center text-gray-500 hover:text-white cursor-pointer"
          style={{ right: logsPanelCollapsed ? "0px" : "320px", transition: "all 0.3s" }}
        >
          {logsPanelCollapsed ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
      </div>

      {/* BOTTOM PANEL: COMMAND GOVERNANCE CONSOLE */}
      <div className="bg-[#080808] border-t border-glass p-4 shrink-0 z-20">
        <form onSubmit={handleConsoleSubmit} className="flex gap-4 items-center">
          <div className="flex-1 relative flex items-center">
            <span className="absolute left-3.5 text-accent font-mono text-xs font-extrabold select-none">
              &gt;
            </span>
            <input
              type="text"
              value={consoleInput}
              onChange={(e) => setConsoleInput(e.target.value)}
              placeholder="Enforce Command (e.g., 'research: minimalist law agency' or 'build: serif branding typography pillow')..."
              className="w-full pl-8 pr-4 py-3 bg-[#0c0c0c] rounded-xl border border-glass text-xs font-mono text-white placeholder:text-gray-600 focus:outline-none focus:border-accent transition-all"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-accent hover:bg-teal-400 text-black text-xs font-bold uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            Dispatch
          </button>
        </form>

        {/* Real-time Validation Gate message */}
        {gateMessage && (
          <div
            className={`mt-2 font-mono text-[10px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              gateMessage.error
                ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                : "bg-accent/10 border-accent/20 text-accent"
            }`}
          >
            {gateMessage.error ? (
              <ShieldAlert className="w-3.5 h-3.5" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5" />
            )}
            <span>{gateMessage.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}
