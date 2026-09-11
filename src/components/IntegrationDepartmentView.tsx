/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe,
  ShieldCheck,
  Zap,
  Activity,
  Key,
  Database,
  History,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Lock,
  PlusCircle,
  Clock,
  Radio,
  FileText,
  Play,
  Settings,
  Wifi,
  Workflow,
  Sparkles,
  ExternalLink,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import { ProviderRegistry } from "../departments/integration/ProviderRegistry";
import { CredentialVault } from "../departments/integration/CredentialVault";
import { ConnectorManager } from "../departments/integration/ConnectorManager";
import { OAuthManager } from "../departments/integration/OAuthManager";
import { JobQueue } from "../departments/integration/JobQueue";
import { WebhookManager, WebhookConfig } from "../departments/integration/WebhookManager";
import { Health, Credential, Job } from "../departments/integration/types";

interface IntegrationDepartmentViewProps {
  theme: "light" | "dark";
  logs: any[];
  addLog: (source: string, message: string, level: "INFO" | "WARN" | "ERROR" | "DEBUG") => void;
}

export function IntegrationDepartmentView({ theme, logs, addLog }: IntegrationDepartmentViewProps) {
  // Navigation for local Integration OS Tabs
  const [localTab, setLocalTab] = useState<"CONNECTORS" | "VAULT" | "JOBS" | "WEBHOOKS" | "BOOK_PIPELINE">("CONNECTORS");

  // Book Pipeline States for Amazon KDP
  const [bookStage, setBookStage] = useState<"RESEARCH" | "WRITER" | "COVER" | "METADATA_STUCK" | "SOLVING" | "COMPLETED">("METADATA_STUCK");
  const [solvingProgress, setSolvingProgress] = useState(0);
  const [currentSolvingStep, setCurrentSolvingStep] = useState<string>("");
  const [bleedCorrected, setBleedCorrected] = useState("0.125 inches (STUCK)");
  const [kdpSessionTokenStatus, setKdpSessionTokenStatus] = useState("EXPIRED (STUCK)");
  const [publishedAsin, setPublishedAsin] = useState<string | null>(null);

  // State hooks synchronized with backend modules
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [providerHealth, setProviderHealth] = useState<Record<string, Health>>({});
  const [jobs, setJobs] = useState<Job[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);

  // Payload inputs for publishing simulation
  const [selectedProvider, setSelectedProvider] = useState<string>("Etsy");
  const [publishingTitle, setPublishingTitle] = useState("AuraPlanners™ 2026 Daily Digital Planner");
  const [publishingPrice, setPublishingPrice] = useState("14.00");

  // Selected Scope info for explanation
  const [selectedScopeProvider, setSelectedScopeProvider] = useState<string>("Etsy");

  // Initialize and load all initial integration state
  useEffect(() => {
    refreshAllData();
  }, []);

  const refreshAllData = () => {
    setCredentials(CredentialVault.getAll());
    setWebhooks(WebhookManager.getEndpoints());
    
    // Sync active jobs and queue jobs
    const allJobs = [...ConnectorManager.getJobs(), ...JobQueue.getQueue()];
    setJobs(allJobs);

    // Refresh health status
    const currentHealth: Record<string, Health> = {};
    const activeProviders = ["etsy", "shopify", "tiktok", "amazon kdp"];
    
    Promise.all(activeProviders.map(async p => {
      const h = await ConnectorManager.checkHealth(p);
      currentHealth[p] = h;
    })).then(() => {
      setProviderHealth(currentHealth);
    });
  };

  // Re-usable OAuth connect simulator
  const handleConnect = async (providerKey: string) => {
    addLog("OAuthCenter", `Requesting Auth token mapping for platform: ${providerKey}`, "INFO");
    const result = await OAuthManager.connect(providerKey);
    addLog("CredentialVault", result.message, "INFO");
    refreshAllData();
  };

  // Force token refresh (Self-Heal demonstration)
  const handleRefreshToken = async (providerKey: string) => {
    addLog("OAuthCenter", `Refreshing expired bearer token for ${providerKey}...`, "WARN");
    await OAuthManager.refresh(providerKey);
    addLog("CredentialVault", `Token refreshed. Expiry extended by 24h. Connected state: OPTIMAL`, "INFO");
    refreshAllData();
  };

  // Force credentials delete
  const handleDeleteCred = (providerKey: string) => {
    CredentialVault.remove(providerKey);
    addLog("CredentialVault", `Deleted credentials token for ${providerKey}`, "WARN");
    refreshAllData();
  };

  // Trigger simulated immediate publish via the ConnectorManager
  const handlePublishImmediate = async () => {
    addLog("ConnectorManager", `Routing publish event for [${selectedProvider}]`, "INFO");
    const payload = {
      title: publishingTitle,
      price: publishingPrice,
      handle: "aula-planner-2026"
    };

    const result = await ConnectorManager.publish(selectedProvider, payload);
    
    if (result.success) {
      addLog("Publisher", `Success! Listing Live: ${result.url}`, "INFO");
    } else {
      addLog("Publisher", `Error publishing to ${selectedProvider}: ${result.message}`, "ERROR");
    }
    refreshAllData();
  };

  // Queue a job for the job queue simulator
  const handleQueueJob = (action: "publish" | "sync") => {
    const payload = {
      title: publishingTitle,
      price: publishingPrice
    };
    JobQueue.add(selectedProvider, action, payload);
    addLog("JobQueue", `Job queued for ${selectedProvider} [${action.toUpperCase()}]`, "INFO");
    refreshAllData();
  };

  // Process the entire job queue (Simulating retries and healing)
  const handleProcessQueue = async () => {
    setIsProcessingQueue(true);
    addLog("JobQueue", "Initiating pipeline execution sweep. Running active queues...", "INFO");
    
    await JobQueue.processAll(() => {
      const allJobs = [...ConnectorManager.getJobs(), ...JobQueue.getQueue()];
      setJobs(allJobs);
    });

    setIsProcessingQueue(false);
    addLog("JobQueue", "Queue sweep complete. Checked for failed endpoints and recovered credentials automatically.", "INFO");
    refreshAllData();
  };

  // Clear all logs/jobs
  const handleClearJobs = () => {
    ConnectorManager.clearJobs();
    JobQueue.clear();
    addLog("JobQueue", "Cleared jobs & execution histories.", "DEBUG");
    refreshAllData();
  };

  // Simulating an incoming Webhook event
  const handleIncomingWebhook = (provider: string, eventName: string) => {
    addLog("WebhookListener", `Incoming webhook POST received on route: /api/v1/webhooks/${provider.toLowerCase()}`, "DEBUG");
    const payload = WebhookManager.simulateIncoming(provider, eventName);
    
    addLog("EventBus", `[Incoming Webhook] Provider: ${provider} | Event: ${eventName} | Data: ${JSON.stringify(payload.data)}`, "INFO");
  };

  return (
    <div className="space-y-6" id="integration-department-main">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0f0f0f] border border-glass shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20">
            <Workflow className="w-5 h-5 text-accent animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-mono font-bold uppercase text-white tracking-widest">Integration Operating System</h1>
            <p className="text-[10px] text-gray-500 font-medium">Dynamically coordinate accounts, vault credentials, register connectors, run back-off retries and monitor webhook listeners.</p>
          </div>
        </div>

        {/* SYSTEM STATS */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-black border border-glass text-center">
            <span className="block text-[7px] text-gray-500 font-mono font-bold uppercase">CONNECTED</span>
            <span className="text-xs font-mono font-bold text-white">{credentials.length} Providers</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-black border border-glass text-center">
            <span className="block text-[7px] text-gray-500 font-mono font-bold uppercase">QUEUE LEVEL</span>
            <span className="text-xs font-mono font-bold text-accent">{jobs.filter(j => j.status === "PENDING").length} Pending</span>
          </div>
        </div>
      </div>

      {/* DEPARTMENT NAVIGATION BAR */}
      <div className="flex items-center gap-1 border-b border-glass pb-1 select-none overflow-x-auto">
        {(["CONNECTORS", "VAULT", "JOBS", "WEBHOOKS", "BOOK_PIPELINE"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setLocalTab(tab)}
            className={`px-4 py-2 text-[9px] font-mono font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              localTab === tab ? "border-accent text-white bg-white/[0.02]" : "border-transparent text-gray-500 hover:text-gray-400"
            }`}
          >
            {tab === "BOOK_PIPELINE" ? "📚 Book Pipeline Solver" : tab}
          </button>
        ))}
      </div>

      {/* TWO COLUMN CONTENT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE VIEW ACTIONS */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: DYNAMIC CONNECTOR CATALOGUE */}
            {localTab === "CONNECTORS" && (
              <motion.div
                key="connectors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* ACTIVE CONNECTOR STATUS */}
                <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
                  <div className="flex items-center justify-between border-b border-glass pb-2.5">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-accent" />
                      <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Dynamic Provider Registry</h2>
                    </div>
                    <span className="text-[8px] font-mono text-gray-500 uppercase">Live Health status</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Etsy", "Shopify", "TikTok", "Amazon KDP"].map(providerName => {
                      const key = providerName.toLowerCase();
                      const healthInfo = providerHealth[key];
                      const isConnected = credentials.some(c => c.provider.toLowerCase() === key);
                      
                      const statusColor = 
                        !isConnected ? "border-glass bg-black text-gray-500" :
                        healthInfo?.status === "Healthy" ? "border-emerald-500/30 bg-emerald-500/[0.02] text-emerald-400" :
                        healthInfo?.status === "Expired Token" ? "border-amber-500/30 bg-amber-500/[0.02] text-amber-500" :
                        "border-red-500/30 bg-red-500/[0.02] text-red-500";

                      return (
                        <div key={key} className={`p-4 rounded-xl border transition-all ${statusColor}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-white">{providerName}</span>
                              {isConnected && (
                                <span className="text-[7px] bg-white/5 border border-glass px-1.5 py-0.5 rounded text-accent uppercase font-bold">Connected</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${isConnected && healthInfo?.healthy ? "bg-emerald-500 animate-pulse" : isConnected && healthInfo?.status === "Expired Token" ? "bg-amber-500" : "bg-gray-700"}`}></span>
                              <span className="text-[8px] font-mono text-gray-400">
                                {isConnected ? healthInfo?.status || "Checking..." : "Offline"}
                              </span>
                            </div>
                          </div>

                          <div className="text-[8px] text-gray-400 font-mono space-y-1.5 mb-3.5">
                            <div className="flex justify-between">
                              <span>API Latency:</span>
                              <span className="text-white">{isConnected ? `${healthInfo?.latencyMs || 0}ms` : "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Registered Scopes:</span>
                              <span className="text-white truncate max-w-[150px]">
                                {isConnected ? credentials.find(c => c.provider.toLowerCase() === key)?.scopes.join(", ") : "None"}
                              </span>
                            </div>
                          </div>

                          {/* ACTION ACTIONS */}
                          <div className="flex items-center justify-end gap-2 border-t border-glass pt-2.5">
                            {isConnected ? (
                              <>
                                {healthInfo?.status === "Expired Token" && (
                                  <button
                                    onClick={() => handleRefreshToken(key)}
                                    className="px-2 py-1 text-[8px] font-mono uppercase bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded hover:bg-amber-500/20 cursor-pointer"
                                  >
                                    Self-Heal Token
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteCred(key)}
                                  className="px-2 py-1 text-[8px] font-mono uppercase bg-red-500/10 border border-red-500/20 text-red-500 rounded hover:bg-red-500/20 cursor-pointer"
                                >
                                  Disconnect
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleConnect(key)}
                                className="px-3 py-1 text-[8px] font-mono uppercase bg-accent/10 border border-accent/20 text-accent rounded hover:bg-accent/20 cursor-pointer font-bold"
                              >
                                Connect via OAuth
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PUBLISHING CONTROLLER PANEL */}
                <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
                  <div className="flex items-center gap-2 border-b border-glass pb-2.5">
                    <Workflow className="w-4 h-4 text-accent" />
                    <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Dynamic Publishing Controller</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[8px] uppercase tracking-wider font-bold text-gray-500 mb-1 font-mono">Select Active Provider</label>
                        <select
                          value={selectedProvider}
                          onChange={(e) => setSelectedProvider(e.target.value)}
                          className="w-full text-[10px] p-2 rounded-lg font-mono bg-black border border-glass"
                        >
                          <option value="Etsy">Etsy</option>
                          <option value="Shopify">Shopify</option>
                          <option value="TikTok">TikTok</option>
                          <option value="Amazon KDP">Amazon KDP</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <label className="block text-[8px] uppercase tracking-wider font-bold text-gray-500 mb-1 font-mono">Payload Title</label>
                          <input
                            type="text"
                            value={publishingTitle}
                            onChange={(e) => setPublishingTitle(e.target.value)}
                            className="w-full text-[10px] p-2 rounded-lg font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase tracking-wider font-bold text-gray-500 mb-1 font-mono">Payload Price ($)</label>
                          <input
                            type="text"
                            value={publishingPrice}
                            onChange={(e) => setPublishingPrice(e.target.value)}
                            className="w-full text-[10px] p-2 rounded-lg font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-black border border-glass flex flex-col justify-between">
                      <div className="text-[9px] font-mono text-gray-400 leading-relaxed">
                        <span className="font-bold text-white uppercase block mb-1">Architecture Pipeline</span>
                        When publishing, the Connector Manager dynamically pulls credentials, handles throttling, validates payload formatting schemas, and logs outcomes securely.
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-glass mt-3">
                        <button
                          onClick={() => handleQueueJob("publish")}
                          className="flex-1 py-1.5 text-[8px] font-mono uppercase bg-white/5 border border-glass hover:bg-white/10 text-gray-300 rounded cursor-pointer"
                        >
                          Queue Job
                        </button>
                        <button
                          onClick={handlePublishImmediate}
                          className="flex-1 py-1.5 text-[8px] font-mono uppercase bg-accent text-white hover:bg-accent/80 font-bold rounded cursor-pointer"
                        >
                          Publish Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* THE INTEGRATION DIRECTIVE EXPLANATOR */}
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/15 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-accent animate-pulse shrink-0" />
                  <p className="text-[10px] font-mono text-gray-300 leading-relaxed">
                    <strong className="text-white">Why are there no hardcoded endpoints?</strong> By using a unified <code>Connector</code> interface, adding a new platform involves loading another module in the Provider Registry. Everything else (token refreshing, job queue, error healing, stats caching) remains untouched.
                  </p>
                </div>
              </motion.div>
            )}

            {/* VIEW 2: CREDENTIALS VAULT */}
            {localTab === "VAULT" && (
              <motion.div
                key="vault"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
                  <div className="flex items-center gap-2 border-b border-glass pb-2.5">
                    <Key className="w-4 h-4 text-accent animate-spin" />
                    <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Credential Vault</h2>
                  </div>

                  <p className="text-[9px] text-gray-400 font-mono leading-relaxed">
                    A secure, isolated keystore managing cryptographic bearer keys, client tokens, scope authorizations, and expiration schedules.
                  </p>

                  <div className="space-y-2.5">
                    {credentials.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-glass rounded-xl font-mono text-gray-600 italic">
                        Vault is empty. Go back to 'Connectors' tab to connect providers.
                      </div>
                    ) : (
                      credentials.map(c => {
                        const expired = CredentialVault.isExpired(c.provider);
                        return (
                          <div key={c.id} className="p-3 bg-black rounded-xl border border-glass font-mono text-[9px] space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-white font-bold">{c.provider} KEYSET</span>
                              <span className={`text-[7px] uppercase font-bold px-1.5 py-0.2 rounded ${expired ? "bg-red-500/10 border border-red-500/20 text-red-500" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"}`}>
                                {expired ? "Expired" : "Active"}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-gray-400 text-[8px]">
                              <div>
                                <span className="block text-[7px] text-gray-500 uppercase font-bold">Vault Client Token</span>
                                <span className="text-white font-mono blur-sm hover:blur-none transition-all cursor-help">{c.token}</span>
                              </div>
                              <div>
                                <span className="block text-[7px] text-gray-500 uppercase font-bold">Expiration Stamp</span>
                                <span className="text-white">{c.expiry ? new Date(c.expiry).toLocaleString() : "Never"}</span>
                              </div>
                            </div>

                            <div className="pt-1 border-t border-glass/50 flex justify-between items-center">
                              <span className="text-gray-500 text-[7px] uppercase font-bold">Permissions: {c.scopes.join(", ")}</span>
                              <button
                                onClick={() => handleDeleteCred(c.provider)}
                                className="p-1 rounded hover:bg-white/5 transition-all text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* THE SECURITY SCOPE EXPLORER */}
                <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
                  <div className="flex items-center gap-2 border-b border-glass pb-2.5">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Dynamic Scope Explorer</h3>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {["Etsy", "Shopify", "TikTok", "Amazon KDP"].map(provider => (
                      <button
                        key={provider}
                        onClick={() => setSelectedScopeProvider(provider)}
                        className={`py-1 rounded-lg text-[8px] font-mono font-bold uppercase border cursor-pointer ${selectedScopeProvider === provider ? "bg-accent/15 border-accent text-accent" : "bg-black border-glass text-gray-500 hover:text-gray-400"}`}
                      >
                        {provider}
                      </button>
                    ))}
                  </div>

                  <div className="p-3 bg-black rounded-xl border border-glass font-mono text-[9px] space-y-2">
                    {selectedScopeProvider === "Etsy" && (
                      <div className="space-y-1">
                        <div><code className="text-accent">listings_w</code> - Required to create, publish, and delete Etsy product draft files.</div>
                        <div><code className="text-accent">listings_r</code> - Allows reading active metrics, sales quantities and active thumbnails.</div>
                        <div><code className="text-accent">transactions_r</code> - Required to subscribe to real-time shop sales webhook streams.</div>
                      </div>
                    )}
                    {selectedScopeProvider === "Shopify" && (
                      <div className="space-y-1">
                        <div><code className="text-accent">write_products</code> - Necessary to register product objects, descriptions and image pointers.</div>
                        <div><code className="text-accent">write_inventory</code> - Used to modify SKU stock quantities automatically from local memory caches.</div>
                        <div><code className="text-accent">read_orders</code> - Required to receive webhooks whenever a client purchases items on checkout.</div>
                      </div>
                    )}
                    {selectedScopeProvider === "TikTok" && (
                      <div className="space-y-1">
                        <div><code className="text-accent">video.upload</code> - Allows uploading compressed video templates directly onto user feeds.</div>
                        <div><code className="text-accent">video.list</code> - Required to trace video URLs and fetch analytical views/likes statistics.</div>
                      </div>
                    )}
                    {selectedScopeProvider === "Amazon KDP" && (
                      <div className="space-y-1">
                        <div><code className="text-accent">book_creator</code> - Allows creating paperback templates, manuscript structures, and upload actions.</div>
                        <div><code className="text-accent">metadata_editor</code> - Required to push territory pricing rules and royalty specifications.</div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 3: JOB QUEUE & AUTO-RETRY */}
            {localTab === "JOBS" && (
              <motion.div
                key="jobs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-glass pb-2.5 gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Dynamic Job Queue</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleClearJobs}
                        className="px-2 py-1 text-[8px] font-mono bg-white/5 border border-glass hover:bg-white/10 text-gray-300 rounded cursor-pointer"
                      >
                        Clear Jobs
                      </button>
                      <button
                        onClick={handleProcessQueue}
                        disabled={isProcessingQueue}
                        className="px-3 py-1 text-[8px] font-mono bg-accent hover:bg-accent/80 text-white font-bold rounded cursor-pointer disabled:opacity-50"
                      >
                        {isProcessingQueue ? "Processing..." : "Process Queue"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {jobs.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-glass rounded-xl font-mono text-gray-600 italic">
                        Job Queue is currently empty.
                      </div>
                    ) : (
                      jobs.map(job => {
                        const statusColor = 
                          job.status === "COMPLETED" ? "text-emerald-400" :
                          job.status === "PROCESSING" ? "text-accent" :
                          job.status === "FAILED" ? "text-red-400" :
                          "text-gray-500";
                        
                        return (
                          <div key={job.id} className="p-3 bg-black rounded-xl border border-glass font-mono text-[9px] flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-white font-bold">{job.provider}</span>
                                <span className="text-gray-500">[{job.action.toUpperCase()}]</span>
                              </div>
                              <div className="text-gray-400 text-[8px] mt-0.5">Title: {job.payload.title || "Payload File"} | Exe: {new Date(job.timestamp).toLocaleTimeString()}</div>
                              {job.errorMessage && (
                                <div className="text-red-400 text-[7px] mt-1 bg-red-500/5 p-1 rounded max-w-md">{job.errorMessage}</div>
                              )}
                            </div>
                            <div className="text-right">
                              <span className={`font-bold block ${statusColor}`}>{job.status}</span>
                              <span className="text-gray-500 text-[7px] block mt-0.5">Retries: {job.retries}/{job.maxRetries}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* THE RATE LIMITER INDICATORS */}
                <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-3">
                  <div className="flex items-center gap-2 border-b border-glass pb-2">
                    <Activity className="w-4 h-4 text-accent" />
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Background Rate Limiter & Back-Off Engine</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[9px] font-mono">
                    <div className="p-2.5 bg-black rounded-lg border border-glass">
                      <span className="block text-[7px] text-gray-500 uppercase font-bold">ETSY LIMITS</span>
                      <span className="text-emerald-400 font-bold">10 requests / sec</span>
                      <span className="block text-[8px] text-gray-400 mt-0.5">Quota consumed: 1.4%</span>
                    </div>
                    <div className="p-2.5 bg-black rounded-lg border border-glass">
                      <span className="block text-[7px] text-gray-500 uppercase font-bold">SHOPIFY LIMITS</span>
                      <span className="text-emerald-400 font-bold">2 bucket leaks / sec</span>
                      <span className="block text-[8px] text-gray-400 mt-0.5">Quota consumed: 0.8%</span>
                    </div>
                    <div className="p-2.5 bg-black rounded-lg border border-glass">
                      <span className="block text-[7px] text-gray-500 uppercase font-bold">TIKTOK LIMITS</span>
                      <span className="text-amber-500 font-bold">100 video uploads / day</span>
                      <span className="block text-[8px] text-gray-400 mt-0.5">Quota consumed: 4.2%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 4: WEBHOOK LISTENERS */}
            {localTab === "WEBHOOKS" && (
              <motion.div
                key="webhooks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
                  <div className="flex items-center gap-2 border-b border-glass pb-2.5">
                    <Radio className="w-4 h-4 text-accent animate-pulse" />
                    <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Registered Webhook Listener Endpoints</h2>
                  </div>

                  <div className="space-y-2.5">
                    {webhooks.map(wh => (
                      <div key={wh.id} className="p-3 bg-black rounded-xl border border-glass font-mono text-[9px] space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                            <span className="text-white font-bold">{wh.provider} Stream</span>
                            <span className={`w-1.5 h-1.5 rounded-full ${wh.active ? "bg-emerald-500" : "bg-gray-700"}`}></span>
                          </div>
                          <span className="text-[7px] text-accent font-bold px-1.5 py-0.2 rounded bg-accent/5 border border-accent/15 uppercase">Active URL</span>
                        </div>

                        <div className="text-gray-400 text-[8px] bg-white/5 p-2 rounded truncate">{wh.url}</div>

                        <div className="flex items-center justify-between border-t border-glass pt-2 text-[8px] text-gray-500">
                          <span>Subscribed events: {wh.events.join(", ")}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleIncomingWebhook(wh.provider, wh.events[0])}
                              className="px-2 py-0.5 bg-accent/10 border border-accent/20 text-accent font-semibold rounded hover:bg-accent/20 cursor-pointer"
                            >
                              Simulate Webhook
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* REAL-TIME EVENT BUS FLOW DIAGRAM */}
                <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-3">
                  <div className="flex items-center gap-2 border-b border-glass pb-2">
                    <Workflow className="w-4 h-4 text-accent" />
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Webhooks to Internal Event Bus Flow</h3>
                  </div>

                  <div className="flex items-center justify-between font-mono text-[8px] text-gray-400 text-center">
                    <div className="p-2 bg-black border border-glass rounded w-[22%]">
                      <span className="text-white font-bold block mb-1">Incoming Hook</span>
                      Shopify checkout sale
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                    <div className="p-2 bg-black border border-glass rounded w-[22%]">
                      <span className="text-white font-bold block mb-1">Webhook Listener</span>
                      Verifies signatures
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                    <div className="p-2 bg-black border border-glass rounded w-[22%]">
                      <span className="text-white font-bold block mb-1">Event Bus Router</span>
                      Distributes payload
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                    <div className="p-2 bg-[#a855f7]/10 border border-[#a855f7]/20 text-purple-400 rounded w-[22%]">
                      <span className="text-white font-bold block mb-1">System Action</span>
                      Fulfillment & Finance logged
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 5: DYNAMIC KDP BOOK PIPELINE & SELF-HEALING ENGINE */}
            {localTab === "BOOK_PIPELINE" && (
              <motion.div
                key="book_pipeline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* INTERACTIVE SOLVER HEADER CARD */}
                <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-glass pb-3">
                    <div className="flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-accent animate-spin" />
                      <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">KDP Book Publishing Pipeline Solver</h2>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          if (bookStage === "SOLVING" || bookStage === "COMPLETED") return;
                          
                          setBookStage("SOLVING");
                          setSolvingProgress(10);
                          addLog("BookPipelineSolver", "Initiating pipeline diagnostics on stuck draft...", "INFO");
                          
                          const steps = [
                            { p: 25, msg: "Re-calculating spine thickness ratio. Optimal bleed formula: Pages (120) * 0.00225 + 0.138 inches.", desc: "Calculating page margins..." },
                            { p: 45, msg: "Autonomously rebuilding PDF canvas parameters. Bleed resized dynamically from 0.125\" to 0.138\"!", desc: "Correcting bleed layout parameters..." },
                            { p: 60, msg: "Validating new PDF bleed dimensions against KDP layout rules. State: OPTIMAL.", desc: "Bleed validation passed." },
                            { p: 75, msg: "Querying credential vault for Amazon KDP credentials. Auth status: EXPIRED.", desc: "Triggering OAuth recovery..." },
                            { p: 90, msg: "Requesting credential token refresh stream from KDP Auth endpoint. Active token renewed successfully!", desc: "OAuth session token refreshed." },
                            { p: 95, msg: "Connecting to Amazon KDP Connector. Uploading manuscript PDF & Cover artwork...", desc: "Synchronizing files to KDP..." },
                            { p: 100, msg: "Synchronizing title, description, royalties (70%), pricing ($14.99) and target territories.", desc: "Finalizing draft on bookshelf..." }
                          ];

                          for (let i = 0; i < steps.length; i++) {
                            await new Promise(resolve => setTimeout(resolve, 1400));
                            setSolvingProgress(steps[i].p);
                            setCurrentSolvingStep(steps[i].msg);
                            addLog("BookPipelineSolver", steps[i].msg, "INFO");
                            
                            if (i === 1) {
                              setBleedCorrected("0.138 inches (CORRECTED)");
                            }
                            if (i === 4) {
                              setKdpSessionTokenStatus("ACTIVE (HEALED)");
                              await OAuthManager.refresh("kdp");
                              refreshAllData();
                            }
                          }

                          await new Promise(resolve => setTimeout(resolve, 800));
                          const asin = `B0C${Math.floor(100000 + Math.random() * 900000)}X`;
                          setPublishedAsin(asin);
                          setBookStage("COMPLETED");
                          addLog("BookPipelineSolver", `SUCCESS! Book 'The Serene Reader' successfully published to Amazon KDP! ASIN: ${asin}`, "INFO");
                          refreshAllData();
                        }}
                        disabled={bookStage === "SOLVING" || bookStage === "COMPLETED"}
                        className="px-3 py-1.5 text-[9px] font-mono font-bold uppercase rounded bg-accent text-white hover:bg-accent/80 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {bookStage === "SOLVING" ? "Solving..." : bookStage === "COMPLETED" ? "Pipeline Resolved" : "⚡ Self-Heal & Resume Upload"}
                      </button>

                      {(bookStage === "COMPLETED" || bookStage === "SOLVING") && (
                        <button
                          onClick={() => {
                            setBookStage("METADATA_STUCK");
                            setCurrentSolvingStep("");
                            setSolvingProgress(0);
                            setBleedCorrected("0.125 inches (STUCK)");
                            setKdpSessionTokenStatus("EXPIRED (STUCK)");
                            setPublishedAsin(null);
                            addLog("BookPipelineSolver", "Book publishing pipeline reset to mock stuck state.", "DEBUG");
                          }}
                          disabled={bookStage === "SOLVING"}
                          className="px-2 py-1.5 text-[8px] font-mono uppercase bg-white/5 border border-glass text-gray-400 hover:bg-white/10 rounded cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-400 font-mono leading-relaxed">
                    Most book publishing systems fail because file format specs, margin bleeds, and auth credentials expire or mismatch during the multi-hour compilation flow. JustBuildIt's integration layer intercepts these errors and auto-corrects them using dynamic vector-canvas formulas and autonomous OAuth self-healing.
                  </p>

                  {/* VISUAL STEP-BY-STEP PROGRESS FLOW */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-2 text-center font-mono text-[9px]">
                    <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.02]">
                      <span className="block text-[7px] text-emerald-400 font-bold uppercase mb-1">STAGE 1</span>
                      <span className="text-white font-bold block">Research</span>
                      <span className="text-gray-500 text-[8px]">Complete</span>
                    </div>

                    <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.02]">
                      <span className="block text-[7px] text-emerald-400 font-bold uppercase mb-1">STAGE 2</span>
                      <span className="text-white font-bold block">Writer/Author</span>
                      <span className="text-gray-500 text-[8px]">Complete</span>
                    </div>

                    <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.02]">
                      <span className="block text-[7px] text-emerald-400 font-bold uppercase mb-1">STAGE 3</span>
                      <span className="text-white font-bold block">Cover Design</span>
                      <span className="text-gray-500 text-[8px]">Complete</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border transition-all ${
                      bookStage === "METADATA_STUCK" ? "border-red-500/40 bg-red-500/[0.02]" :
                      bookStage === "SOLVING" && solvingProgress < 45 ? "border-amber-500/40 bg-amber-500/[0.02] animate-pulse" :
                      "border-emerald-500/30 bg-emerald-500/[0.02]"
                    }`}>
                      <span className={`block text-[7px] font-bold uppercase mb-1 ${bookStage === "METADATA_STUCK" ? "text-red-400" : "text-emerald-400"}`}>STAGE 4</span>
                      <span className="text-white font-bold block">Packaging</span>
                      <span className={`text-[8px] font-semibold ${bookStage === "METADATA_STUCK" ? "text-red-400" : "text-gray-500"}`}>
                        {bookStage === "METADATA_STUCK" ? "Bleed Stuck ❌" : "Resolved ✅"}
                      </span>
                    </div>

                    <div className={`p-2.5 rounded-xl border transition-all ${
                      bookStage === "METADATA_STUCK" ? "border-glass bg-black text-gray-500" :
                      bookStage === "SOLVING" ? "border-amber-500/40 bg-amber-500/[0.02] animate-pulse text-amber-500" :
                      "border-emerald-500/30 bg-emerald-500/[0.02] text-white"
                    }`}>
                      <span className="block text-[7px] font-bold uppercase mb-1">STAGE 5</span>
                      <span className="text-white font-bold block">KDP Upload</span>
                      <span className="text-[8px]">
                        {bookStage === "METADATA_STUCK" ? "Pending" : bookStage === "SOLVING" ? "Uploading..." : "Uploaded ✅"}
                      </span>
                    </div>

                    <div className={`p-2.5 rounded-xl border transition-all ${
                      bookStage === "COMPLETED" ? "border-emerald-500/30 bg-emerald-500/[0.02] text-white" : "border-glass bg-black text-gray-500"
                    }`}>
                      <span className="block text-[7px] font-bold uppercase mb-1">STAGE 6</span>
                      <span className="text-white font-bold block">Ready & Live</span>
                      <span className="text-[8px]">
                        {bookStage === "COMPLETED" ? "Live in KDP! 📚" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC DIAGNOSTIC RUNS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* METRIC ANALYSIS */}
                  <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
                    <div className="flex items-center gap-2 border-b border-glass pb-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Diagnostic Analysis Engine</h3>
                    </div>

                    <div className="space-y-3 font-mono text-[9px]">
                      <div className="p-3 bg-black rounded-lg border border-glass space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">BOOK TITLE:</span>
                          <span className="text-white font-bold">The Serene Reader: An Aesthetic Daily Journal</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">TOTAL PAGE SPAN:</span>
                          <span className="text-white font-semibold">120 Pages</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">PDF BLEED RULE:</span>
                          <span className={`font-bold ${bookStage === "METADATA_STUCK" ? "text-red-400" : "text-emerald-400"}`}>
                            {bleedCorrected}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">KDP SESSION CREDENTIALS:</span>
                          <span className={`font-bold ${kdpSessionTokenStatus.includes("EXPIRED") ? "text-red-400" : "text-emerald-400"}`}>
                            {kdpSessionTokenStatus}
                          </span>
                        </div>
                      </div>

                      {bookStage === "METADATA_STUCK" && (
                        <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/[0.01] text-[8px] text-red-400 leading-relaxed">
                          ⚠️ <strong>CRITICAL BLOCKER DETECTED</strong>: paperback cover layout requires 0.138 inches bleed margin to wrap correctly around a 120-page paperback spine. The current PDF is bundled with standard 0.125 inches bleed, causing automatic KDP console rejecting. Click the Self-Heal button to adjust.
                        </div>
                      )}

                      {bookStage === "SOLVING" && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-[8px]">
                            <span className="text-amber-500 font-bold">RECOVERING PIPELINE STATE...</span>
                            <span className="text-white font-bold">{solvingProgress}%</span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <motion.div
                              className="bg-accent h-full"
                              style={{ width: `${solvingProgress}%` }}
                            />
                          </div>
                          <p className="text-[8px] text-gray-400 leading-relaxed animate-pulse">
                            Current Task: {currentSolvingStep || "Resolving bleed conflict..."}
                          </p>
                        </div>
                      )}

                      {bookStage === "COMPLETED" && (
                        <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.01] text-[8px] text-emerald-400 leading-relaxed space-y-2">
                          <div className="flex items-center gap-1.5 font-bold">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span>AUTONOMOUS PIPELINE COMPLETED SUCCESSFULLY!</span>
                          </div>
                          <p className="text-gray-400 leading-relaxed">
                            The integration system caught the sizing reject error, applied Swiss geometry rules to scale the bleed margin canvas, refreshed the expired KDP OAuth token in the Credential Vault, and finalized KDP draft bookshelf metadata synchronously.
                          </p>
                          <div className="pt-1 flex items-center justify-between border-t border-glass/30 text-[9px] font-mono mt-1.5">
                            <span className="text-gray-500">ASIN ON AMAZON:</span>
                            <span className="text-white font-bold flex items-center gap-1">
                              {publishedAsin}
                              <ExternalLink className="w-3 h-3 text-accent" />
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ACTIVE HEALING LOGGER */}
                  <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
                    <div className="flex items-center gap-2 border-b border-glass pb-2.5">
                      <History className="w-4 h-4 text-accent" />
                      <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Healer Execution Daemon Console</h3>
                    </div>

                    <div className="p-3 bg-black rounded-xl border border-glass font-mono text-[8px] text-gray-400 space-y-1.5 h-[150px] overflow-y-auto">
                      <div className="text-gray-500 font-bold uppercase border-b border-glass pb-1 mb-1">Active Trace Stack</div>
                      
                      {bookStage === "METADATA_STUCK" && (
                        <>
                          <div>[12:00:01] <span className="text-red-400">[ERROR]</span> KDP-0418: Bleed validation failed on file: manuscript_final_v3.pdf</div>
                          <div>[12:00:02] <span className="text-amber-500">[WARN]</span> Pipeline enters STUCKE state. Holding assets in secure cache.</div>
                          <div>[12:00:03] <span className="text-gray-500">[INFO]</span> Waiting for developer trigger to resolve or resume.</div>
                        </>
                      )}

                      {bookStage === "SOLVING" && (
                        <>
                          <div>[12:00:01] <span className="text-red-400">[ERROR]</span> KDP-0418: Bleed validation failed on file: manuscript_final_v3.pdf</div>
                          <div>[12:00:02] <span className="text-amber-500">[WARN]</span> Pipeline enters STUCKE state. Holding assets in secure cache.</div>
                          <div className="text-amber-400 font-bold">[12:01:10] [ACTION] Triggering Self-Healing Pipeline solver daemon...</div>
                          {solvingProgress >= 25 && <div>[12:01:11] [INFO] Calculating dynamic paperback bleed formula. Value: 0.138".</div>}
                          {solvingProgress >= 45 && <div className="text-emerald-400">[12:01:13] [SUCCESS] Layout margins corrected in memory. Asset re-packaged.</div>}
                          {solvingProgress >= 75 && <div>[12:01:15] [WARN] Amazon KDP Credentials Expired. Requesting OAuth recovery...</div>}
                          {solvingProgress >= 90 && <div className="text-emerald-400">[12:01:17] [SUCCESS] Vault token refreshed via refresh_token method. Status: OPTIMAL.</div>}
                        </>
                      )}

                      {bookStage === "COMPLETED" && (
                        <>
                          <div className="text-gray-500">... previous stuck logs archived ...</div>
                          <div className="text-emerald-400">[12:01:13] [SUCCESS] Layout margins corrected in memory. Asset re-packaged.</div>
                          <div className="text-emerald-400">[12:01:17] [SUCCESS] Vault token refreshed via refresh_token method. Status: OPTIMAL.</div>
                          <div>[12:01:18] [INFO] Initiating multipart upload to S3 bookshelf manuscript manuscript bucket...</div>
                          <div>[12:01:19] [INFO] Transfer rate: 45.2 MB/s. Writing metadata nodes.</div>
                          <div className="text-emerald-400 font-bold">[12:01:21] [SUCCESS] Amazon KDP Bookshelf registered! ASIN: {publishedAsin}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: PROVIDER REGISTRY OVERVIEWS & HEALTH DAEMON */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* THE ALL-SUPPORTED-PROVIDERS EXPANSION LIST */}
          <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
            <div className="flex items-center gap-2 border-b border-glass pb-2.5">
              <Database className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Integration Operating System</h2>
            </div>

            <p className="text-[9px] text-gray-400 font-mono leading-relaxed">
              Every external connector dynamically matches a single polymorphic template. Registering additional platforms involves dropping them directly into our system.
            </p>

            <div className="grid grid-cols-2 gap-1.5 text-[8px] font-mono text-gray-400 max-h-[300px] overflow-y-auto">
              {ProviderRegistry.getSupportedProviders().map(provider => {
                const isActive = provider === "Etsy" || provider === "Shopify" || provider === "TikTok" || provider === "Amazon KDP";
                return (
                  <div
                    key={provider}
                    className={`p-2 rounded-lg border flex items-center justify-between ${isActive ? "border-accent/20 bg-accent/5 text-white" : "border-glass bg-black/40 text-gray-600"}`}
                  >
                    <span>{provider}</span>
                    <span className="text-[6px] uppercase font-bold">{isActive ? "Ready" : "Inactive"}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTIVE SYNC ENGINE STATS */}
          <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
            <div className="flex items-center gap-2 border-b border-glass pb-2.5">
              <Activity className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Synchronization Engine</h2>
            </div>

            <div className="space-y-3 font-mono text-[9px]">
              <div className="flex justify-between items-center border-b border-glass/30 pb-1.5">
                <span className="text-gray-500">Auto-Polling interval:</span>
                <span className="text-white">Every 15 minutes</span>
              </div>
              <div className="flex justify-between items-center border-b border-glass/30 pb-1.5">
                <span className="text-gray-500">Signature verification:</span>
                <span className="text-emerald-400 font-semibold">Enabled (HMAC-SHA256)</span>
              </div>
              <div className="flex justify-between items-center border-b border-glass/30 pb-1.5">
                <span className="text-gray-500">Encryption strength:</span>
                <span className="text-white">AES-256-GCM Vaulted</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
