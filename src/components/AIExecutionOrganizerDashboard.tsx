/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Sliders, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Sparkles, 
  Play,
  CheckCircle,
  AlertTriangle,
  Clock,
  Coins,
  DollarSign,
  TrendingUp,
  Settings,
  AlertOctagon,
  RotateCcw,
  Layers,
  HelpCircle
} from "lucide-react";
import { AIExecutionOrganizer, AEOConfiguration } from "../core/vault/AIExecutionOrganizer";
import { ModelInstance } from "../core/vault/ModelRegistry";
import { SwarmConsensus } from "../core/vault/AgentSwarm";
import { DepartmentRegistry } from "../departments/core/DepartmentRegistry";
import { ExecutionQueue, QueueItem } from "../core/vault/ExecutionQueue";
import { CostController, CostTransaction } from "../core/vault/CostController";

export function AIExecutionOrganizerDashboard() {
  const aeo = AIExecutionOrganizer.getInstance();
  const queueEngine = ExecutionQueue.getInstance();
  const costEngine = CostController.getInstance();
  
  // Dashboard Sub-navigation Tab
  const [subTab, setSubTab] = useState<"parameters" | "queue" | "costs" | "testing">("parameters");

  // Core configurations & items state
  const [config, setConfig] = useState<AEOConfiguration>(() => aeo.getConfig());
  const [instances, setInstances] = useState<ModelInstance[]>(() => aeo.getRegistry().getAllInstances());
  const [selectedInstance, setSelectedInstance] = useState<ModelInstance | null>(null);

  // Playground state
  const [testInstanceId, setTestInstanceId] = useState<string>("");
  const [testPrompt, setTestPrompt] = useState("How many r's are in the word 'strawberry'?");
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState("");
  const [testReasoning, setTestReasoning] = useState<string[]>([]);
  const [testError, setTestError] = useState("");
  const [testLatency, setTestLatency] = useState(0);

  // Auto-select the first instance when loaded
  useEffect(() => {
    if (instances.length > 0 && !testInstanceId) {
      setTestInstanceId(instances[0].id);
    }
  }, [instances]);

  const handleRunPlaygroundTest = async () => {
    const targetInst = instances.find(inst => inst.id === testInstanceId);
    if (!targetInst) {
      setTestError("Please select a valid registered endpoint to test.");
      return;
    }

    setTestLoading(true);
    setTestResult("");
    setTestReasoning([]);
    setTestError("");
    const startTime = Date.now();

    try {
      const { OpenRouterProvider } = await import("../core/vault/OpenRouterProvider");
      const provider = new OpenRouterProvider(targetInst.id, targetInst.model, targetInst.apiKey);
      
      const response = await provider.chat({
        model: targetInst.model,
        messages: [{ role: "user", content: testPrompt }]
      });

      const elapsed = Date.now() - startTime;
      setTestLatency(elapsed);
      setTestResult(response.text);
      if (response.reasoning) {
        setTestReasoning(response.reasoning);
      } else {
        setTestReasoning(["Connection Handshake OK", "Model selection routed", "Prompt parsed successfully", `Inference completed in ${elapsed}ms`]);
      }
      
      // Update metrics in the registry to reflect a successful call
      const updatedCalls = (targetInst.metrics.callsCount || 0) + 1;
      const updatedLatency = targetInst.metrics.callsCount === 0 
        ? elapsed 
        : Math.round((targetInst.metrics.avgLatency * 3 + elapsed) / 4);

      aeo.getRegistry().updateInstance(targetInst.id, {
        status: "active",
        metrics: {
          ...targetInst.metrics,
          avgLatency: updatedLatency,
          callsCount: updatedCalls,
          successRate: 0.99
        }
      });
      setInstances([...aeo.getRegistry().getAllInstances()]);

    } catch (err: any) {
      const elapsed = Date.now() - startTime;
      setTestLatency(elapsed);
      setTestError(err.message || "An unexpected connection error occurred.");
      
      // Mark as failed in registry
      aeo.getRegistry().updateInstance(targetInst.id, {
        status: "failed",
        metrics: {
          ...targetInst.metrics,
          successRate: Math.max(0, targetInst.metrics.successRate - 0.1)
        }
      });
      setInstances([...aeo.getRegistry().getAllInstances()]);
    } finally {
      setTestLoading(false);
    }
  };

  // Queue state tracking
  const [queueList, setQueueList] = useState<QueueItem[]>(() => queueEngine.getQueue());
  const [concurrencyLimit, setConcurrencyLimit] = useState(() => queueEngine.getConcurrencyLimit());

  // Cost tracking state
  const [costConfig, setCostConfig] = useState(() => costEngine.getConfig());
  const [transactions, setTransactions] = useState(() => costEngine.getTransactions());

  // Live subscription to queue mutations
  useEffect(() => {
    const unsubscribe = queueEngine.subscribe(() => {
      setQueueList([...queueEngine.getQueue()]);
      // Sync cost tracking after operations
      setCostConfig({ ...costEngine.getConfig() });
      setTransactions([...costEngine.getTransactions()]);
    });
    return unsubscribe;
  }, []);

  // Diagnostic states
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  // Simulation Task states
  const [taskType, setTaskType] = useState<"research" | "writing" | "design" | "analysis" | "seo" | "pricing" | "formatting">("research");
  const [taskCategory, setTaskCategory] = useState("Wellness & Mindset Workbooks");
  const [taskComplexity, setTaskComplexity] = useState(7);
  const [taskPriority, setTaskPriority] = useState(3);
  const [taskPrompt, setTaskPrompt] = useState("Research customer complaints about repetitive morning journal guides.");
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [executionResult, setExecutionResult] = useState<SwarmConsensus | null>(null);

  // Adding new model instance
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProvider, setNewProvider] = useState<"Google" | "OpenAI" | "Anthropic" | "Local Llama" | "Mistral">("Google");
  const [newModelName, setNewModelName] = useState("gemini-2.5-flash");
  const [newApiKey, setNewApiKey] = useState("");

  // Budget settings modifiers
  const [customDailyBudget, setCustomDailyBudget] = useState(() => costEngine.getConfig().dailyBudget.toString());
  const [customAlertThreshold, setCustomAlertThreshold] = useState(() => costEngine.getConfig().alertThreshold.toString());

  const updateConfig = (updates: Partial<AEOConfiguration>) => {
    aeo.saveConfig(updates);
    setConfig(aeo.getConfig());
    
    // Notify department registry
    const reg = DepartmentRegistry.getInstance();
    reg.emitActivity("governance", "MISSION_STARTED", `AEO parameters adjusted. Mode switched to [${updates.mode || config.mode}] with Parallelism: ${updates.parallelismLevel || config.parallelismLevel}`);
  };

  const handleRunFullScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs([`[INFO] Starting Distributed API Health Auditing at ${new Date().toLocaleTimeString()}...`]);

    try {
      await aeo.getHealthMonitor().scanAllInstances((progress, msg) => {
        setScanProgress(progress);
        setScanLogs(prev => [...prev, `[HEALTH-SCAN] ${msg}`]);
        // Refresh instances local state
        setInstances([...aeo.getRegistry().getAllInstances()]);
      });
      
      const updatedConfig = { ...config, lastScanTime: new Date().toLocaleTimeString() };
      aeo.saveConfig(updatedConfig);
      setConfig(updatedConfig);
      setScanLogs(prev => [...prev, `[SUCCESS] All endpoints verified. Diagnostics complete!`]);
    } catch (e: any) {
      setScanLogs(prev => [...prev, `[ERROR] Health Monitor scan interrupted: ${e.message}`]);
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddInstance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelName) return;

    const newInst: ModelInstance = {
      id: `inst_${newProvider.toLowerCase().replace(" ", "_")}_${Math.random().toString(36).substring(2, 6)}`,
      provider: newProvider,
      model: newModelName,
      apiKey: newApiKey || `sk-proj-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      status: "active",
      metrics: {
        avgLatency: 1200 + Math.floor(Math.random() * 800),
        successRate: 0.95 + Math.random() * 0.04,
        qualityScore: newProvider === "Anthropic" ? 98 : newProvider === "Google" ? 90 : 85,
        costPerCall: newProvider === "Google" ? 0.0001 : 0.002,
        callsCount: 0
      }
    };

    aeo.getRegistry().addInstance(newInst);
    setInstances([...aeo.getRegistry().getAllInstances()]);
    setShowAddForm(false);
    setNewApiKey("");
    
    // Notify activity feed
    const reg = DepartmentRegistry.getInstance();
    reg.emitActivity("integration", "WORKER_ASSIGNED", `Registered new LLM endpoint: [${newProvider}] ${newModelName}`);
  };

  const handleDeleteInstance = (id: string) => {
    aeo.getRegistry().deleteInstance(id);
    setInstances([...aeo.getRegistry().getAllInstances()]);
    if (selectedInstance?.id === id) {
      setSelectedInstance(null);
    }
  };

  const handleSingleTest = async (instance: ModelInstance) => {
    setSelectedInstance(instance);
    // Visual indicator of self-test
    const updated = await aeo.getHealthMonitor().testInstance(instance);
    setInstances([...aeo.getRegistry().getAllInstances()]);
    setSelectedInstance(updated);
  };

  // Immediate execution of single task via the load balancer swarm
  const handleDispatchSwarmImmediate = async () => {
    setIsExecuting(true);
    setExecutionResult(null);
    setExecutionLogs([
      `[1/4] Brain Task Intelligence Router triggered for category: [${taskCategory}]...`,
      `[2/4] Mapping optimal candidates matching strategy mode: [${config.mode.toUpperCase()}]...`
    ]);

    // Simulate multi-agent steps
    setTimeout(() => {
      const candidates = aeo.getSwarm()["router"].route({
        id: "temp",
        type: taskType,
        complexity: taskComplexity,
        priority: taskPriority,
        payload: { prompt: taskPrompt },
        mode: config.mode
      });

      setExecutionLogs(prev => [
        ...prev,
        `[3/4] Dispatched concurrent load-balanced pipelines across ${candidates.length} active API keys...`,
        ...candidates.map(c => `      - Connected to [${c.provider}] ${c.model} (Expected latency: ${c.metrics.avgLatency}ms)`)
      ]);

      setTimeout(async () => {
        try {
          const consensus = await aeo.executeTask(
            taskType,
            taskCategory,
            { prompt: taskPrompt },
            taskComplexity,
            taskPriority
          );

          setExecutionLogs(prev => [
            ...prev,
            `[4/4] Unified responses received. Synthesizing consensus markdown and auditing quality tags...`,
            `[SUCCESS] Swarm resolved successfully in ${consensus.totalLatency}ms. Consolidated consensus locked.`
          ]);
          setExecutionResult(consensus);

          // Update cost config states
          setCostConfig({ ...costEngine.getConfig() });
          setTransactions([...costEngine.getTransactions()]);

          // Log in department registry
          const reg = DepartmentRegistry.getInstance();
          reg.emitActivity(
            taskType === "research" ? "research" : taskType === "writing" ? "books" : "marketing",
            "MISSION_COMPLETED",
            `AEO Swarm compiled task on "${taskCategory}". Balanced latency: ${consensus.totalLatency}ms.`
          );

        } catch (err: any) {
          setExecutionLogs(prev => [...prev, `[ERROR] Swarm failed to complete task: ${err.message}`]);
        } finally {
          setIsExecuting(false);
        }
      }, 1500);

    }, 1000);
  };

  // Adds a task to the asynchronous execution queue
  const handleEnqueueTask = () => {
    const taskObj = {
      id: `task_aeo_${Math.random().toString(36).substring(2, 8)}`,
      type: taskType,
      complexity: taskComplexity,
      priority: taskPriority,
      payload: { prompt: taskPrompt, category: taskCategory },
      mode: config.mode
    };

    queueEngine.enqueue(taskObj);
    
    // Switch to queue tab to view it
    setSubTab("queue");

    // Log in department registry
    const reg = DepartmentRegistry.getInstance();
    reg.emitActivity("governance", "MISSION_STARTED", `Task enqueued into AEO scheduler queue: [${taskType}] complexity: ${taskComplexity}`);
  };

  // Updates cost management budget
  const handleSaveBudgetConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const budget = parseFloat(customDailyBudget);
    const threshold = parseFloat(customAlertThreshold);

    if (isNaN(budget) || isNaN(threshold)) return;

    costEngine.updateConfig({
      dailyBudget: budget,
      alertThreshold: threshold
    });
    setCostConfig({ ...costEngine.getConfig() });
    
    const reg = DepartmentRegistry.getInstance();
    reg.emitActivity("governance", "MISSION_STARTED", `AEO Spending Policy redefined. Daily Budget: $${budget}, alerting at ${threshold}%`);
  };

  return (
    <div id="aeo-dashboard-root" className="space-y-6 font-mono text-left">
      {/* Top Banner and Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-glass pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-accent animate-pulse" />
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Distributed AI Execution Organizer (AEO)
            </h2>
          </div>
          <p className="text-[10px] text-gray-500 max-w-2xl font-sans leading-relaxed">
            A secure, vault-level subsystem that load-balances multiple API keys per model, manages rate queues, monitors micro-gateway latency health, and provides granular spent audits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-black border border-glass px-2.5 py-1.5 rounded-lg text-[9px]">
            <span className="text-gray-500 font-bold uppercase">Spending:</span>
            <span className={`font-extrabold ${costConfig.totalSpent >= costConfig.dailyBudget ? "text-rose-500 animate-pulse" : "text-emerald-400"}`}>
              ${costConfig.totalSpent.toFixed(4)} / ${costConfig.dailyBudget.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-black border border-glass px-2.5 py-1.5 rounded-lg text-[9px]">
            <span className="text-gray-500 font-bold uppercase">Status:</span>
            <span className="flex items-center gap-1 text-emerald-400 font-extrabold">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Dashboard Top Horizontal Sub-tabs */}
      <div className="flex items-center gap-1 border-b border-glass/30 pb-0.5 select-none text-[10px] font-bold">
        <button
          onClick={() => setSubTab("parameters")}
          className={`px-4 py-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            subTab === "parameters"
              ? "border-accent text-white"
              : "border-transparent text-gray-500 hover:text-gray-400"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Gateway & Registry</span>
        </button>
        <button
          onClick={() => setSubTab("queue")}
          className={`px-4 py-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            subTab === "queue"
              ? "border-accent text-white"
              : "border-transparent text-gray-500 hover:text-gray-400"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Execution Queue ({queueList.filter(q => q.status === "queued" || q.status === "running").length})</span>
        </button>
        <button
          onClick={() => setSubTab("costs")}
          className={`px-4 py-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            subTab === "costs"
              ? "border-accent text-white"
              : "border-transparent text-gray-500 hover:text-gray-400"
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>Cost Control & Spent Auditing</span>
        </button>
        <button
          onClick={() => setSubTab("testing")}
          className={`px-4 py-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            subTab === "testing"
              ? "border-accent text-white"
              : "border-transparent text-gray-500 hover:text-gray-400"
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-accent" />
          <span>Model Testing Lab</span>
        </button>
      </div>

      {/* ----------------- SUB-TAB 1: GATEWAY & REGISTRY ----------------- */}
      {subTab === "parameters" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fade-in">
          {/* Left Column (xl:col-span-8) */}
          <div className="xl:col-span-8 space-y-6">
            
            {/* Orchestrator parameters controllers */}
            <div className="p-5 border border-glass rounded-2xl bg-black/40 space-y-5">
              <div className="flex items-center gap-2 border-b border-glass pb-2.5">
                <Settings className="w-4 h-4 text-accent" />
                <h3 className="text-xs font-bold text-white uppercase">Vault Orchestrator Parameters</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                {/* Enabled Toggler and Mode */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/[0.01] border border-glass rounded-xl">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-white block">AEO Intelligent Routing</span>
                      <span className="text-[8px] text-gray-500 font-sans block">Toggle multi-key balanced routing & health checks</span>
                    </div>
                    <button 
                      onClick={() => updateConfig({ enabled: !config.enabled })}
                      className={`w-10 h-6 rounded-full p-0.5 transition-all relative ${config.enabled ? "bg-accent" : "bg-neutral-800"}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-black transition-all transform ${config.enabled ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest block">Execution Mode Priority</span>
                    <div className="grid grid-cols-2 gap-2">
                      {(["balanced", "speed", "quality", "surprise"] as const).map((m) => {
                        const active = config.mode === m;
                        return (
                          <button
                            key={m}
                            onClick={() => updateConfig({ mode: m })}
                            className={`px-3 py-2 rounded-xl text-left border text-[10px] uppercase font-bold transition-all cursor-pointer flex items-center justify-between ${
                              active 
                                ? "bg-accent/10 border-accent text-white" 
                                : "bg-black border-glass text-gray-400 hover:text-white"
                            }`}
                          >
                            <span className="font-sans font-bold capitalize">{m}</span>
                            {active && <CheckCircle className="w-3.5 h-3.5 text-accent" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Slider & Autoreplace */}
                <div className="space-y-4">
                  <div className="p-3 bg-white/[0.01] border border-glass rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-white">Parallel Swarm Limit</span>
                      <span className="text-[10px] text-accent font-bold">{config.parallelismLevel} Workers</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={config.parallelismLevel}
                      onChange={(e) => updateConfig({ parallelismLevel: parseInt(e.target.value) })}
                      className="w-full accent-accent bg-neutral-800 h-1 rounded cursor-pointer"
                    />
                    <span className="text-[8px] text-gray-500 font-sans block leading-normal">
                      Defines the maximum concurrent parallel models polled for swarm consensus.
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/[0.01] border border-glass rounded-xl">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-white block">API Auto-Heal (Replacement)</span>
                      <span className="text-[8px] text-gray-500 font-sans block">Instantly deprecate failed keys and swap to duplicates</span>
                    </div>
                    <button 
                      onClick={() => updateConfig({ autoReplaceBadAPI: !config.autoReplaceBadAPI })}
                      className={`w-10 h-6 rounded-full p-0.5 transition-all relative ${config.autoReplaceBadAPI ? "bg-accent" : "bg-neutral-800"}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-black transition-all transform ${config.autoReplaceBadAPI ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Endpoints List */}
            <div className="p-5 border border-glass rounded-2xl bg-black/40 space-y-4">
              <div className="flex items-center justify-between border-b border-glass pb-2.5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase">Active API Key Gateways</h3>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded-lg bg-accent text-black hover:bg-accent/85 transition-all flex items-center gap-1 cursor-pointer select-none"
                >
                  <Plus className="w-3 h-3" />
                  <span>Register Endpoint</span>
                </button>
              </div>

              {/* Add Key form */}
              {showAddForm && (
                <form onSubmit={handleAddInstance} className="p-4 bg-white/[0.01] border border-accent/20 rounded-xl space-y-3 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase text-gray-500 font-bold">API Provider</label>
                      <select 
                        value={newProvider}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setNewProvider(val);
                          setNewModelName(
                            val === "Google" ? "gemini-2.5-flash" : 
                            val === "OpenAI" ? "gpt-4o" : 
                            val === "Anthropic" ? "claude-3-5-sonnet" : 
                            val === "Mistral" ? "mistral-large" : "llama-3-8b"
                          );
                        }}
                        className="w-full bg-black border border-glass text-[10px] p-2 text-white focus:outline-none focus:border-accent rounded cursor-pointer"
                      >
                        <option value="Google">Google AI</option>
                        <option value="OpenAI">OpenAI Core</option>
                        <option value="Anthropic">Anthropic Corp</option>
                        <option value="Mistral">Mistral AI</option>
                        <option value="Local Llama">Local Host (Ollama)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] uppercase text-gray-500 font-bold">Model Name</label>
                      <input 
                        type="text" 
                        value={newModelName}
                        onChange={(e) => setNewModelName(e.target.value)}
                        className="w-full bg-black border border-glass text-[10px] p-2 text-white focus:outline-none focus:border-accent rounded font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] uppercase text-gray-500 font-bold">Credentials API Key</label>
                      <input 
                        type="password" 
                        placeholder="Paste sk-... or system key"
                        value={newApiKey}
                        onChange={(e) => setNewApiKey(e.target.value)}
                        className="w-full bg-black border border-glass text-[10px] p-2 text-white focus:outline-none focus:border-accent rounded font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button 
                      type="button" 
                      onClick={() => setShowAddForm(false)}
                      className="px-2.5 py-1 text-[9px] font-mono border border-glass text-gray-400 rounded"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-3 py-1 text-[9px] font-mono bg-accent text-black font-bold rounded"
                    >
                      Lock In Credentials
                    </button>
                  </div>
                </form>
              )}

              {/* Grid of registered endpoints */}
              <div className="space-y-2.5">
                {instances.map(inst => {
                  const isTestingThis = selectedInstance?.id === inst.id;
                  
                  let statusColor = "bg-neutral-500";
                  if (inst.status === "active") statusColor = "bg-emerald-500";
                  if (inst.status === "slow") statusColor = "bg-amber-500";
                  if (inst.status === "failed") statusColor = "bg-rose-500";
                  if (inst.status === "disabled") statusColor = "bg-gray-600";

                  return (
                    <div key={inst.id} className="p-3 bg-[#0d0d0d] border border-glass rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${statusColor} ${inst.status === "active" ? "animate-pulse" : ""}`} />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold text-white">{inst.provider}</span>
                            <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-gray-400 font-bold">{inst.model}</span>
                          </div>
                          <span className="block text-[8px] text-gray-600 font-mono">
                            Obscured Secret: {inst.apiKey.slice(0, 10)}... (Calls: {inst.metrics.callsCount})
                          </span>
                        </div>
                      </div>

                      {/* Endpoint Metrics */}
                      <div className="flex flex-wrap items-center gap-4 text-[9px]">
                        <div className="space-y-0.5">
                          <span className="text-gray-500 text-[7px] uppercase font-bold block">Latency</span>
                          <span className={`font-bold ${inst.metrics.avgLatency < 1000 ? "text-emerald-400" : "text-amber-500"}`}>
                            {inst.metrics.avgLatency}ms
                          </span>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-gray-500 text-[7px] uppercase font-bold block">Reliability</span>
                          <span className="font-bold text-white">
                            {(inst.metrics.successRate * 100).toFixed(0)}%
                          </span>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-gray-500 text-[7px] uppercase font-bold block">Quality</span>
                          <span className="font-bold text-accent">
                            {inst.metrics.qualityScore}/100
                          </span>
                        </div>

                        {/* Interactive Controls */}
                        <div className="flex items-center gap-2 border-l border-glass pl-3 shrink-0">
                          <button
                            onClick={() => handleSingleTest(inst)}
                            disabled={isTestingThis}
                            className="px-2 py-1 rounded bg-white/5 border border-glass text-gray-300 hover:text-white text-[8px] font-mono uppercase flex items-center gap-1 cursor-pointer disabled:opacity-30"
                          >
                            <RefreshCw className={`w-2.5 h-2.5 ${isTestingThis ? "animate-spin" : ""}`} />
                            <span>Verify Key</span>
                          </button>
                          <button
                            onClick={() => handleDeleteInstance(inst.id)}
                            className="p-1 rounded text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Diagnostic Console & Immediate Dispatcher (xl:col-span-4) */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Health Monitor scan block */}
            <div className="p-5 border border-glass rounded-2xl bg-black/40 space-y-4">
              <div className="flex items-center justify-between border-b border-glass pb-2">
                <span className="text-[10px] font-extrabold text-white uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  Self-Testing Monitor
                </span>
                <button 
                  onClick={handleRunFullScan}
                  disabled={isScanning}
                  className="px-2.5 py-1 text-[8px] font-mono uppercase bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 rounded cursor-pointer disabled:opacity-20"
                >
                  Diagnose All
                </button>
              </div>

              {isScanning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] text-accent">
                    <span>Testing network micro-gateways...</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div className="bg-accent h-full transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                  </div>
                </div>
              )}

              <div className="p-3 bg-black border border-glass rounded-xl font-mono text-[8px] text-gray-500 h-[100px] overflow-y-auto space-y-1.5 leading-relaxed">
                {scanLogs.length === 0 ? (
                  <div className="italic text-gray-700 h-full flex items-center justify-center">
                    No diagnostics run in this session. Trigger scan to run 5-point ping health evaluation.
                  </div>
                ) : (
                  scanLogs.map((log, i) => (
                    <div key={i} className="flex gap-1.5">
                      <span className="text-accent">&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Task Form & Immediate Swarm dispatcher */}
            <div className="p-5 border border-glass rounded-2xl bg-black/40 space-y-4">
              <div className="border-b border-glass pb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <h3 className="text-xs font-bold text-white uppercase font-mono">Immediate Swarm Tester</h3>
              </div>

              <div className="space-y-3 font-mono">
                <div className="space-y-1">
                  <label className="text-[8px] uppercase text-gray-500 font-bold">Specialized Category</label>
                  <select 
                    value={taskType}
                    onChange={(e) => {
                      const type = e.target.value as any;
                      setTaskType(type);
                      setTaskPrompt(
                        type === "research" ? "Research customer complaints about repetitive morning journal guides." :
                        type === "writing" ? "Write a dynamic introductory chapter for 'Sanctuary of Mornings' guide." :
                        type === "design" ? "Create high-contrast layout parameters and colors for a self-guided meditation app." :
                        "Perform mathematical elasticity review on priced mindset books to maximize margin ratios."
                      );
                    }}
                    className="w-full bg-black border border-glass text-[10px] p-2 text-white focus:outline-none rounded cursor-pointer"
                  >
                    <option value="research">Market Research Spec</option>
                    <option value="writing">Chapter Novelist Spec</option>
                    <option value="design">Layout Art Direction</option>
                    <option value="analysis">Elastic Pricing Analysis</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] uppercase text-gray-500 font-bold">Target Book / Product Title</label>
                  <input 
                    type="text" 
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full bg-black border border-glass text-[10px] p-2 text-white focus:outline-none rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase text-gray-500 font-bold">Complexity (1-10)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="10" 
                      value={taskComplexity}
                      onChange={(e) => setTaskComplexity(parseInt(e.target.value))}
                      className="w-full bg-black border border-glass text-[10px] p-2 text-white focus:outline-none rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase text-gray-500 font-bold">Priority (1-5)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="5" 
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(parseInt(e.target.value))}
                      className="w-full bg-black border border-glass text-[10px] p-2 text-white focus:outline-none rounded"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] uppercase text-gray-500 font-bold">Input Context Instruction</label>
                  <textarea 
                    rows={2}
                    value={taskPrompt}
                    onChange={(e) => setTaskPrompt(e.target.value)}
                    className="w-full bg-black border border-glass text-[10px] p-2 text-white focus:outline-none rounded leading-normal font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleEnqueueTask}
                    className="py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-glass font-bold uppercase text-[9px] tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Layers className="w-3 h-3" />
                    <span>Queue Task</span>
                  </button>

                  <button
                    onClick={handleDispatchSwarmImmediate}
                    disabled={isExecuting}
                    className="py-2 rounded-xl bg-accent text-black font-extrabold uppercase text-[9px] tracking-wider hover:bg-accent/85 transition-all flex items-center justify-center gap-1 cursor-pointer disabled:bg-neutral-800 disabled:text-neutral-500"
                  >
                    <Play className="w-3 h-3 fill-black" />
                    <span>Run Direct</span>
                  </button>
                </div>
              </div>

              {/* Execution status telemetry panel */}
              {(isExecuting || executionLogs.length > 0) && (
                <div className="mt-4 p-3.5 bg-black border border-glass rounded-xl space-y-3 text-left">
                  <div className="space-y-1 font-mono text-[8px] text-gray-500 leading-normal max-h-[140px] overflow-y-auto">
                    {executionLogs.map((log, i) => (
                      <div key={i} className="flex gap-1.5">
                        <span className="text-accent font-bold">&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>

                  {executionResult && (
                    <div className="border-t border-glass pt-3 space-y-2.5">
                      <span className="text-[9px] font-extrabold uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        Swarm Consensus Resolved
                      </span>

                      {/* Swarm details */}
                      <div className="grid grid-cols-3 gap-2 text-[8px] text-gray-500">
                        <div className="bg-white/[0.01] p-1.5 border border-glass rounded">
                          <span>Active Keys</span>
                          <b className="block text-[10px] text-white font-bold">{executionResult.activeModelsCount} Keys</b>
                        </div>
                        <div className="bg-white/[0.01] p-1.5 border border-glass rounded">
                          <span>Avg Latency</span>
                          <b className="block text-[10px] text-amber-500 font-bold">{executionResult.totalLatency}ms</b>
                        </div>
                        <div className="bg-white/[0.01] p-1.5 border border-glass rounded">
                          <span>Transaction Cost</span>
                          <b className="block text-[10px] text-teal-400 font-bold">${executionResult.costTotalNominal.toFixed(4)}</b>
                        </div>
                      </div>

                      {/* Merged response preview */}
                      <div className="p-3 rounded-lg bg-white/[0.02] border border-glass space-y-1.5">
                        <span className="text-[7px] text-gray-600 uppercase font-bold tracking-widest block font-mono">Consolidated Swarm Output</span>
                        <p className="text-[10px] text-gray-300 font-sans leading-relaxed whitespace-pre-line">
                          {executionResult.bestOutput}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 2: EXECUTION QUEUE ----------------- */}
      {subTab === "queue" && (
        <div className="space-y-6 animate-fade-in text-left">
          {/* Concurrency and queue details header */}
          <div className="p-5 border border-glass rounded-2xl bg-black/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Layers className="w-4.5 h-4.5 text-accent" />
                <h3 className="text-xs font-bold text-white uppercase font-mono">Asynchronous Job Queue Manager</h3>
              </div>
              <p className="text-[10px] text-gray-500 font-sans">
                Buffers subtasks to prevent API rate overflows, monitors active execution threads, and triggers automated multi-attempt retries.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0 text-left">
              {/* Concurrency controller */}
              <div className="p-3 bg-white/[0.01] border border-glass rounded-xl space-y-1 min-w-[160px]">
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-gray-400 font-bold uppercase">Concurrency Limit</span>
                  <span className="text-accent font-extrabold">{concurrencyLimit} Running</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={concurrencyLimit}
                  onChange={(e) => {
                    const lim = parseInt(e.target.value);
                    setConcurrencyLimit(lim);
                    queueEngine.setConcurrencyLimit(lim);
                  }}
                  className="w-full accent-accent bg-neutral-800 h-1 rounded cursor-pointer"
                />
              </div>

              <button
                onClick={() => queueEngine.clearHistory()}
                className="px-3 py-2 border border-glass hover:bg-rose-950/20 text-rose-400 rounded-xl text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer transition-all shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Logs</span>
              </button>
            </div>
          </div>

          {/* Queue items list */}
          <div className="p-5 border border-glass rounded-2xl bg-black/40 space-y-4">
            <div className="border-b border-glass pb-2 flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-white uppercase tracking-wider block font-mono">Scheduled Task Ledgers</span>
              <span className="text-[9px] text-gray-500 font-bold">Total Tasks logged: {queueList.length}</span>
            </div>

            {queueList.length === 0 ? (
              <div className="p-12 border border-dashed border-glass rounded-2xl text-center space-y-2">
                <Terminal className="w-8 h-8 text-neutral-700 mx-auto animate-pulse" />
                <p className="text-xs text-gray-600 italic">No tasks currently queued. Enqueue a task on the Parameters tab to test concurrency.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {queueList.map((item) => {
                  let statusBg = "border-neutral-800 bg-neutral-900/40 text-neutral-400";
                  let statusBadge = "text-neutral-500 bg-neutral-950 border-neutral-800";
                  
                  if (item.status === "queued") {
                    statusBg = "border-sky-950 bg-sky-950/5 text-sky-300";
                    statusBadge = "text-sky-400 bg-sky-950/50 border-sky-800/40 animate-pulse";
                  } else if (item.status === "running") {
                    statusBg = "border-amber-900 bg-amber-950/5 text-amber-300";
                    statusBadge = "text-amber-400 bg-amber-950/50 border-amber-800/40";
                  } else if (item.status === "completed") {
                    statusBg = "border-emerald-950 bg-emerald-950/5 text-emerald-300";
                    statusBadge = "text-emerald-400 bg-emerald-950/50 border-emerald-800/40";
                  } else if (item.status === "failed") {
                    statusBg = "border-rose-950 bg-rose-950/5 text-rose-300";
                    statusBadge = "text-rose-400 bg-rose-950/50 border-rose-800/40";
                  }

                  return (
                    <div key={item.id} className={`p-4 border rounded-xl space-y-3 transition-all ${statusBg}`}>
                      {/* Top section: Status & metadata */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px]">
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2 py-0.5 rounded border text-[8px] font-extrabold uppercase font-mono ${statusBadge}`}>
                            {item.status}
                          </span>
                          <span className="font-extrabold text-white uppercase">ID: {item.id}</span>
                          <span className="text-gray-500">| Category: <b className="text-gray-300">{item.task.payload.category || "General"}</b></span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-500 font-mono text-[9px]">
                          <span>Enqueued: {item.addedAt}</span>
                          {item.startedAt && <span>Started: {item.startedAt}</span>}
                          {item.completedAt && <span>Finished: {item.completedAt}</span>}
                        </div>
                      </div>

                      {/* Middle section: Instruction and Prompt */}
                      <div className="text-[11px] font-sans text-gray-300 leading-relaxed bg-black/30 p-2.5 border border-glass/30 rounded-lg">
                        <div className="text-[8px] font-mono text-gray-500 uppercase font-bold mb-1 tracking-widest">TASK REQUEST</div>
                        <b>Specialist Job [{item.task.type.toUpperCase()}] (Complexity: {item.task.complexity}/10):</b> {item.task.payload.prompt}
                      </div>

                      {/* Bottom section: Errors or success output summaries */}
                      {item.error && (
                        <div className="p-2.5 bg-rose-950/15 border border-rose-900/30 text-rose-400 text-[10px] rounded-lg flex items-start gap-1.5 font-sans">
                          <AlertOctagon className="w-4 h-4 shrink-0 text-rose-500" />
                          <div className="space-y-0.5">
                            <b>Queue Engine Failure Alert:</b>
                            <p className="text-[9px] font-mono leading-tight">{item.error}</p>
                          </div>
                        </div>
                      )}

                      {item.result && (
                        <div className="space-y-2 text-[10px] font-sans">
                          <div className="flex items-center gap-4 text-[9px] text-gray-500 border-b border-glass pb-1 font-mono">
                            <span>Consensus Latency: <b className="text-amber-500 font-bold">{item.result.totalLatency}ms</b></span>
                            <span>Consensus Cost: <b className="text-teal-400 font-bold">${item.result.costTotalNominal.toFixed(5)}</b></span>
                            <span>Vetted Keys: <b className="text-gray-300 font-bold">{item.result.activeModelsCount}</b></span>
                          </div>

                          <div className="p-3 bg-emerald-950/10 border border-emerald-900/20 text-gray-300 rounded-lg leading-relaxed whitespace-pre-line text-[10px]">
                            <div className="text-[8px] font-mono text-emerald-400 uppercase font-bold mb-1 tracking-widest">Consolidated Swarm output</div>
                            {item.result.bestOutput}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 3: COST CONTROL ----------------- */}
      {subTab === "costs" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fade-in text-left">
          {/* Budget control settings & spent dials (xl:col-span-4) */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Visual spent dial indicator */}
            <div className="p-5 border border-glass rounded-2xl bg-black/40 space-y-4">
              <span className="text-[10px] font-extrabold text-white uppercase tracking-wider block font-mono">Dynamic Budget Meter</span>
              
              <div className="py-2 space-y-3.5">
                {/* Visual Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] text-gray-500 uppercase font-bold">Spent Limit Threshold</span>
                    <span className="text-xs text-white font-extrabold font-mono">
                      ${costConfig.totalSpent.toFixed(4)} <span className="text-gray-500 text-[10px] font-bold">/ ${costConfig.dailyBudget.toFixed(2)}</span>
                    </span>
                  </div>
                  
                  <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-glass/40 relative">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        costConfig.totalSpent >= costConfig.dailyBudget 
                          ? "bg-rose-500" 
                          : costEngine.isThresholdExceeded() 
                            ? "bg-amber-500" 
                            : "bg-emerald-400"
                      }`} 
                      style={{ width: `${Math.min(100, (costConfig.totalSpent / costConfig.dailyBudget) * 100)}%` }} 
                    />
                  </div>
                  
                  <div className="flex justify-between text-[8px] text-gray-600">
                    <span>Spent: {((costConfig.totalSpent / costConfig.dailyBudget) * 100).toFixed(1)}%</span>
                    <span>Remaining: ${(Math.max(0, costConfig.dailyBudget - costConfig.totalSpent)).toFixed(4)}</span>
                  </div>
                </div>

                {/* Status message alerts */}
                {costConfig.totalSpent >= costConfig.dailyBudget ? (
                  <div className="p-3 bg-rose-950/15 border border-rose-900/30 rounded-xl flex items-start gap-2.5 text-rose-400 text-[9px] leading-relaxed">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                    <div>
                      <b className="block font-mono uppercase">Vault Spent Limit Depleted</b>
                      Orchestration requests are temporarily throttled to protect key limits. Re-configure budget caps below to resume.
                    </div>
                  </div>
                ) : costEngine.isThresholdExceeded() ? (
                  <div className="p-3 bg-amber-950/15 border border-amber-900/30 rounded-xl flex items-start gap-2.5 text-amber-400 text-[9px] leading-relaxed">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                    <div>
                      <b className="block font-mono uppercase">Alert Trigger Threshold Exceeded</b>
                      Daily expenditures have crossed {costConfig.alertThreshold}% of allocated budget. Monitor live streams below.
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-950/15 border border-emerald-900/30 rounded-xl flex items-start gap-2.5 text-emerald-400 text-[9px] leading-relaxed">
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                    <div>
                      <b className="block font-mono uppercase">Budget Parameters Healthy</b>
                      Spending is well within nominal ranges. Cost containment protocols fully operational.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Budget Configuration Form */}
            <form onSubmit={handleSaveBudgetConfig} className="p-5 border border-glass rounded-2xl bg-black/40 space-y-4 text-left">
              <span className="text-[10px] font-extrabold text-white uppercase tracking-wider block border-b border-glass pb-1.5 font-mono">Spent Limit Policies</span>
              
              <div className="space-y-3">
                <div className="space-y-1 text-left">
                  <label className="text-[8px] text-gray-500 uppercase font-bold font-mono">Daily Spending Budget (USD)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    <input 
                      type="text" 
                      value={customDailyBudget}
                      onChange={(e) => setCustomDailyBudget(e.target.value)}
                      className="w-full bg-black border border-glass rounded p-2 pl-7 text-[10px] text-white font-mono focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[8px] text-gray-500 uppercase font-bold font-mono">Notification Alert Threshold (%)</label>
                  <input 
                    type="number" 
                    min="1"
                    max="100"
                    value={customAlertThreshold}
                    onChange={(e) => setCustomAlertThreshold(e.target.value)}
                    className="w-full bg-black border border-glass rounded p-2 text-[10px] text-white font-mono focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex gap-2 pt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      costEngine.resetBudget();
                      setCostConfig({ ...costEngine.getConfig() });
                      setTransactions([]);
                    }}
                    className="px-3 py-2 border border-glass hover:bg-white/5 text-gray-400 rounded-xl text-[9px] font-bold uppercase flex items-center justify-center gap-1 cursor-pointer transition-all flex-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset spent</span>
                  </button>

                  <button
                    type="submit"
                    className="px-3 py-2 bg-accent hover:bg-accent/90 text-black rounded-xl text-[9px] font-extrabold uppercase flex items-center justify-center gap-1 cursor-pointer transition-all flex-1"
                  >
                    <CheckCircle className="w-3 h-3" />
                    <span>Save Policy</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Transaction Ledger Table (xl:col-span-8) */}
          <div className="xl:col-span-8 space-y-6">
            <div className="p-5 border border-glass rounded-2xl bg-black/40 space-y-4">
              <span className="text-[10px] font-extrabold text-white uppercase tracking-wider block border-b border-glass pb-1.5 font-mono">Transaction Ledger (Spent Log)</span>
              
              {transactions.length === 0 ? (
                <div className="p-12 text-center text-xs text-gray-600 italic">
                  No spend records compiled yet. Run a direct swarm or schedule a queued task to audit live transactions.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[9px] text-gray-400 border-collapse">
                    <thead>
                      <tr className="border-b border-glass/40 text-gray-500">
                        <th className="py-2.5 font-bold uppercase">Time</th>
                        <th className="py-2.5 font-bold uppercase">Task ID</th>
                        <th className="py-2.5 font-bold uppercase">Model Node</th>
                        <th className="py-2.5 font-bold uppercase text-right">Tokens (I/O)</th>
                        <th className="py-2.5 font-bold uppercase text-right">Total Charge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-glass/20">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-white/[0.01] transition-all">
                          <td className="py-2.5 font-bold text-gray-400">{tx.timestamp}</td>
                          <td className="py-2.5 font-mono text-gray-500">{tx.taskId}</td>
                          <td className="py-2.5">
                            <span className="text-gray-300 font-extrabold">{tx.provider}</span>
                            <span className="ml-1 text-[8px] bg-white/5 border border-glass/40 px-1 py-0.2 rounded text-gray-400">{tx.model}</span>
                          </td>
                          <td className="py-2.5 text-right text-gray-400 font-mono">
                            {tx.inputTokens} <span className="text-gray-600">/</span> {tx.outputTokens}
                          </td>
                          <td className="py-2.5 text-right text-emerald-400 font-extrabold font-mono">
                            ${tx.calculatedCost.toFixed(6)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 4: MODEL TESTING LAB ----------------- */}
      {subTab === "testing" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fade-in text-left">
          {/* Left Panel: Selection and Prompt Settings (xl:col-span-5) */}
          <div className="xl:col-span-5 space-y-6">
            <div className="p-5 border border-glass rounded-2xl bg-black/40 space-y-4">
              <div className="flex items-center gap-2 border-b border-glass pb-2.5">
                <Terminal className="w-4.5 h-4.5 text-accent" />
                <h3 className="text-xs font-bold text-white uppercase font-mono">Inference Handshake Settings</h3>
              </div>

              <div className="space-y-4 font-mono">
                {/* Select Model Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[8px] uppercase text-gray-500 font-bold block">Target Registered Key Node</label>
                  <select
                    value={testInstanceId}
                    onChange={(e) => setTestInstanceId(e.target.value)}
                    className="w-full bg-black border border-glass text-[10px] p-2.5 text-white focus:outline-none focus:border-accent rounded-xl cursor-pointer"
                  >
                    {instances.map((inst) => {
                      const isFree = inst.model.includes("free");
                      return (
                        <option key={inst.id} value={inst.id}>
                          {inst.provider} — {inst.model} {isFree ? "(Free OpenRouter)" : ""} [{inst.status.toUpperCase()}]
                        </option>
                      );
                    })}
                  </select>
                  {testInstanceId && (
                    <div className="text-[8px] text-gray-500 space-y-0.5 mt-1 font-sans">
                      <span>• Endpoint Status: <b className="text-emerald-400 capitalize">{instances.find(i => i.id === testInstanceId)?.status}</b></span>
                      <span className="block">• Current Registered secret: <b className="text-gray-300 font-mono">{instances.find(i => i.id === testInstanceId)?.apiKey.slice(0, 15)}...</b></span>
                    </div>
                  )}
                </div>

                {/* Quick Presets */}
                <div className="space-y-1.5">
                  <label className="text-[8px] uppercase text-gray-500 font-bold block">Test Prompts / Presets</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "🍓 Strawberry count", q: "How many r's are in the word 'strawberry'?" },
                      { label: "🧮 Logic Riddle", q: "If a shirt takes 1 hour to dry in the sun, how long do 5 shirts take to dry?" },
                      { label: "💻 Code Sandbox", q: "Write a high-performance TypeScript helper function to compute Fibonacci numbers up to n." },
                      { label: "✨ Creativity", q: "Write a 3-sentence sci-fi premise about a supercomputer that got tired and took a vacation." }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTestPrompt(item.q)}
                        className="px-2.5 py-1.5 text-[8px] font-sans font-medium rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-glass/40 hover:text-white transition-all cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Instruction Prompt Area */}
                <div className="space-y-1.5">
                  <label className="text-[8px] uppercase text-gray-500 font-bold block">Input Prompt Content</label>
                  <textarea
                    rows={4}
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    placeholder="Enter prompt to execute live inference against selected key..."
                    className="w-full bg-black border border-glass text-[11px] p-3 text-white focus:outline-none focus:border-accent rounded-xl leading-normal font-sans"
                  />
                </div>

                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={handleRunPlaygroundTest}
                  disabled={testLoading || !testInstanceId}
                  className="w-full py-3 rounded-xl bg-accent text-black font-extrabold uppercase text-[10px] tracking-wider hover:bg-accent/85 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-neutral-800 disabled:text-neutral-500"
                >
                  {testLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Streaming Inference Handshake...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>Verify and Execute Live Inference</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Output & Live Logs (xl:col-span-7) */}
          <div className="xl:col-span-7 space-y-6">
            <div className="p-5 border border-glass rounded-2xl bg-black/40 space-y-4">
              <div className="flex items-center justify-between border-b border-glass pb-2.5">
                <span className="text-[10px] font-extrabold text-white uppercase flex items-center gap-1.5 font-mono">
                  <Cpu className="w-4 h-4 text-accent" />
                  Live API Execution Console
                </span>
                {testLatency > 0 && (
                  <span className="text-[8px] font-mono text-gray-500">
                    Network roundtrip: <b className="text-amber-400">{testLatency}ms</b>
                  </span>
                )}
              </div>

              {/* Handshake Stream Progress */}
              <div className="space-y-2">
                <span className="text-[8px] uppercase text-gray-600 font-bold block font-mono">Inference Pipeline Handshake</span>
                <div className="p-3 bg-black border border-glass rounded-xl font-mono text-[9px] text-gray-500 h-[100px] overflow-y-auto space-y-1.5 leading-relaxed font-mono">
                  {testLoading ? (
                    <div className="space-y-1.5">
                      <div className="flex gap-1.5 text-accent">
                        <span>&gt;</span>
                        <span className="animate-pulse">Establishing handshake with openrouter.ai gateway...</span>
                      </div>
                      <div className="flex gap-1.5 text-gray-600">
                        <span>&gt;</span>
                        <span>Sending payload headers and authorization token...</span>
                      </div>
                    </div>
                  ) : testReasoning.length === 0 ? (
                    <div className="italic text-gray-700 h-full flex items-center justify-center">
                      No active inference pipeline loaded. Choose an endpoint and dispatch the playground test.
                    </div>
                  ) : (
                    testReasoning.map((log, i) => (
                      <div key={i} className="flex gap-1.5">
                        <span className="text-emerald-400 font-bold">&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Output Content Display */}
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] uppercase text-gray-600 font-bold block font-mono">Response content payload</span>
                  {testResult && (
                    <button
                      onClick={() => navigator.clipboard.writeText(testResult)}
                      className="text-[7px] text-accent uppercase font-mono tracking-wider hover:underline"
                    >
                      Copy Output
                    </button>
                  )}
                </div>

                {testError ? (
                  <div className="p-4 bg-rose-950/15 border border-rose-900/30 rounded-xl flex items-start gap-2.5 text-rose-400 text-[10px] leading-relaxed">
                    <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-rose-500" />
                    <div>
                      <b className="block font-mono uppercase">API Connection Error</b>
                      {testError}
                      <p className="mt-2 text-[8px] text-gray-500 font-sans">
                        Tip: Check if your OpenRouter API key is funded, valid, and that your internet connection supports requests to openrouter.ai.
                      </p>
                    </div>
                  </div>
                ) : testResult ? (
                  <div className="p-4 bg-emerald-950/5 border border-glass rounded-xl space-y-2">
                    <p className="text-[11px] text-gray-300 font-sans leading-relaxed whitespace-pre-line">
                      {testResult}
                    </p>
                  </div>
                ) : (
                  <div className="p-8 border border-dashed border-glass rounded-xl text-center italic text-gray-700 text-[10px] font-sans">
                    Waiting for inference payload resolution...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
