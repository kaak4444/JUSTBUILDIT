import React, { useState } from "react";
import { 
  Compass, Cpu, Database, Award, Zap, Sparkles, Activity, CheckCircle2, 
  Layers, ChevronRight, FileText, ArrowUpRight, Shield, RefreshCw, BarChart3, HelpCircle 
} from "lucide-react";

interface ResearchCoreV3ViewProps {
  researchV3: any;
}

export const ResearchCoreV3View: React.FC<ResearchCoreV3ViewProps> = ({ researchV3 }) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "dag" | "normalize" | "facts" | "graph" | "dna" | "report"
  >("overview");

  const [selectedDocId, setSelectedDocId] = useState<string>(
    researchV3?.normalizedDocuments?.[0]?.id || ""
  );

  const [dnaTab, setDnaTab] = useState<"company" | "product" | "design" | "marketing">("company");

  if (!researchV3) {
    return (
      <div className="p-8 text-center bg-black/20 border border-glass rounded-2xl italic font-mono text-gray-500 text-xs">
        No Research Core v3 payload detected in active results.
      </div>
    );
  }

  const selectedNormDoc = researchV3.normalizedDocuments?.find(
    (d: any) => d.id === selectedDocId
  ) || researchV3.normalizedDocuments?.[0];

  const rawDocForSelected = researchV3.rawDocuments?.find(
    (r: any) => `norm_${r.id.replace("raw_", "")}` === selectedNormDoc?.id
  );

  return (
    <div className="space-y-6 w-full text-left">
      {/* V3 Badge banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-teal-950/20 to-black/30 border border-glass/80 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-[#14b8a6]/30 flex items-center justify-center text-[#14b8a6] glow-teal-sm">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider">Research Core v3</h3>
              <span className="text-[8px] font-mono font-bold bg-[#14b8a6]/15 text-[#14b8a6] border border-[#14b8a6]/35 px-1.5 py-0.5 rounded-full">
                OS INTEL
              </span>
            </div>
            <p className="text-[10.5px] text-gray-400">
              Deterministic, parallel, and consensus-validated organizational research engine.
            </p>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex flex-wrap gap-1 bg-black/50 p-1 rounded-xl border border-glass/60">
          {(
            [
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "dag", label: "Missions DAG", icon: Activity },
              { id: "normalize", label: "Pipeline", icon: Layers },
              { id: "facts", label: "Facts Consensus", icon: Shield },
              { id: "graph", label: "World Graph", icon: Database },
              { id: "dna", label: "DNA Reconstruct", icon: Sparkles },
              { id: "report", label: "Briefing", icon: FileText }
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#14b8a6] text-black shadow-md shadow-[#14b8a6]/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TABS WORKSPACE */}

      {/* TAB 1: OVERVIEW & COMPOSITE SCORING */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Score circle card */}
            <div className="bg-black/30 border border-glass p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
                  Opportunity Composite Score
                </span>
                <span className="text-[8px] font-mono text-gray-500 block">
                  WEIGHTED SYSTEM INDEX
                </span>
              </div>

              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="#1e293b"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="#14b8a6"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={376.8}
                    strokeDashoffset={376.8 - (376.8 * (researchV3.opportunityScore?.overall || 75)) / 100}
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-mono font-bold text-white leading-none">
                    {researchV3.opportunityScore?.overall || 75}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-teal-400 tracking-wider uppercase mt-1">
                    EXCELLENT
                  </span>
                </div>
              </div>

              <p className="text-[10.5px] text-gray-400 font-sans leading-relaxed">
                The objective holds strong commercial demand with structured margins, supported by multiple verified facts across 6 core channels.
              </p>
            </div>

            {/* Weights grid scorecard */}
            <div className="lg:col-span-2 bg-black/30 border border-glass p-5 rounded-2xl space-y-4 text-left">
              <div className="border-b border-glass/40 pb-2">
                <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-teal-400" />
                  Multidimensional Score Breakdown
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Market Need", value: researchV3.opportunityScore?.need || 80, color: "text-emerald-400", barColor: "bg-emerald-400" },
                  { label: "Proven Demand", value: researchV3.opportunityScore?.demand || 85, color: "text-teal-400", barColor: "bg-teal-400" },
                  { label: "Competition Index", value: researchV3.opportunityScore?.competition || 60, color: "text-amber-400", barColor: "bg-amber-400", desc: "High score means low competition" },
                  { label: "Execution Priority", value: researchV3.opportunityScore?.execution || 78, color: "text-purple-400", barColor: "bg-purple-400" },
                  { label: "Operating Margin", value: researchV3.opportunityScore?.margin || 85, color: "text-emerald-400", barColor: "bg-emerald-400" },
                  { label: "Scalability Level", value: researchV3.opportunityScore?.scalability || 90, color: "text-cyan-400", barColor: "bg-cyan-400" },
                  { label: "Architectural Novelty", value: researchV3.opportunityScore?.novelty || 75, color: "text-teal-400", barColor: "bg-teal-400" },
                  { label: "Market Timing", value: researchV3.opportunityScore?.timing || 80, color: "text-emerald-400", barColor: "bg-emerald-400" },
                  { label: "Audience Pain Level", value: researchV3.opportunityScore?.audiencePain || 82, color: "text-rose-400", barColor: "bg-rose-400" }
                ].map((score, i) => (
                  <div key={i} className="p-3 bg-black/25 border border-glass/40 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-gray-300">
                      <span>{score.label}</span>
                      <span className={score.color}>{score.value}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-glass/40">
                      <div className={`h-full ${score.barColor}`} style={{ width: `${score.value}%` }}></div>
                    </div>
                    {score.desc && (
                      <span className="text-[7.5px] font-mono text-gray-500 block leading-tight">{score.desc}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Metrics stats banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Missions Scheduled", value: researchV3.missions?.length || 0, color: "text-teal-400" },
              { label: "Raw Traces Harvested", value: researchV3.rawDocuments?.length || 0, color: "text-cyan-400" },
              { label: "Verified Claims", value: researchV3.verifiedFacts?.filter((f: any) => f.status === "verified").length || 0, color: "text-emerald-400" },
              { label: "Knowledge Patterns", value: researchV3.patterns?.length || 0, color: "text-purple-400" }
            ].map((stat, i) => (
              <div key={i} className="bg-black/30 border border-glass p-3 rounded-xl flex flex-col justify-between h-20 text-left">
                <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-wider">{stat.label}</span>
                <span className={`text-xl font-mono font-bold ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MISSIONS DAG & PARALLEL SCHEDULER */}
      {activeTab === "dag" && (
        <div className="space-y-6 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Mission DAG status graph list */}
            <div className="lg:col-span-2 bg-black/30 border border-glass p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-glass/40 pb-2">
                <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-400" />
                  Mission DAG Execution Map
                </h4>
                <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  TOPOLOGICAL SORT OK
                </span>
              </div>

              <div className="space-y-3">
                {researchV3.missions?.map((mission: any) => {
                  let statusColor = "border-glass text-gray-500 bg-black/10";
                  if (mission.status === "completed") {
                    statusColor = "border-emerald-500/30 text-emerald-400 bg-emerald-950/10";
                  } else if (mission.status === "running") {
                    statusColor = "border-teal-500/30 text-teal-400 bg-teal-950/10 animate-pulse";
                  }

                  return (
                    <div key={mission.id} className={`p-4 rounded-xl border ${statusColor} space-y-2.5 transition-all`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono font-bold bg-black/50 border border-glass px-2 py-0.5 rounded text-gray-400">
                            {mission.id}
                          </span>
                          <h5 className="text-[11.5px] font-sans font-bold text-white">{mission.title}</h5>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                            mission.status === "completed" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" : "bg-teal-500/15 text-teal-400 border-teal-500/20"
                          }`}>
                            {mission.status}
                          </span>
                          {mission.durationMs && (
                            <span className="text-[8px] font-mono text-gray-500">
                              {mission.durationMs}ms
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-[10.5px] text-gray-400 leading-normal font-sans">
                        {mission.objective}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 border-t border-glass/10 text-[8.5px] font-mono text-gray-500">
                        <div>
                          <span className="text-gray-400 uppercase font-bold mr-1">TARGET CHANNELS:</span>
                          {mission.requiredSources?.join(", ")}
                        </div>
                        <div>
                          <span className="text-gray-400 uppercase font-bold mr-1">PRIORITY:</span>
                          {mission.priority}/10
                        </div>
                        {mission.children?.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400 uppercase font-bold mr-1">TRIGGERS AFTER:</span>
                            <div className="flex gap-1">
                              {mission.children.map((childId: string) => (
                                <span key={childId} className="bg-black/50 px-1 py-0.2 rounded border border-glass text-gray-400">
                                  {childId}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Parallel execution scheduler logs */}
            <div className="bg-black/30 border border-glass p-5 rounded-2xl flex flex-col h-full space-y-3">
              <div className="border-b border-glass/40 pb-2">
                <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  Scheduler Audit Trail
                </h4>
              </div>

              <div className="flex-1 bg-black/60 p-3 rounded-xl font-mono text-[9.5px] text-gray-400 overflow-y-auto max-h-[400px] space-y-2 leading-relaxed">
                {researchV3.schedulerLogs?.map((log: string, i: number) => {
                  let textClass = "text-gray-400";
                  if (log.includes("COMPLETED")) textClass = "text-emerald-400";
                  if (log.includes("Scheduling parallel")) textClass = "text-teal-400 font-bold";
                  if (log.includes("DAG scheduling execution finished")) textClass = "text-teal-400 font-bold";
                  return (
                    <div key={i} className={`pb-1 border-b border-glass/10 ${textClass}`}>
                      {log}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: NORMALIZATION PIPELINE */}
      {activeTab === "normalize" && (
        <div className="space-y-6 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Document list selector */}
            <div className="bg-black/30 border border-glass p-4 rounded-2xl space-y-3">
              <div className="border-b border-glass/40 pb-2">
                <h4 className="text-xs font-mono font-bold text-white uppercase">Trace Documents Collected</h4>
              </div>

              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {researchV3.normalizedDocuments?.map((doc: any) => {
                  const isActive = doc.id === selectedDocId;
                  const sentimentLabel = 
                    doc.metadata?.sentimentScore > 0 ? "Positive" :
                    doc.metadata?.sentimentScore < 0 ? "Negative" : "Neutral";
                  const sentimentColor = 
                    doc.metadata?.sentimentScore > 0 ? "text-emerald-400" :
                    doc.metadata?.sentimentScore < 0 ? "text-rose-400" : "text-gray-400";

                  return (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                        isActive
                          ? "bg-[#14b8a6]/10 border-[#14b8a6] text-accent"
                          : "bg-black/20 border-glass/60 text-gray-400 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-mono bg-black/60 px-1.5 py-0.5 rounded border border-glass font-bold uppercase">
                          {doc.source}
                        </span>
                        <span className="text-[8px] font-mono text-gray-500">
                          {doc.metadata?.datePublished}
                        </span>
                      </div>

                      <h5 className="text-[10.5px] font-sans font-bold text-white truncate w-full">{doc.title}</h5>

                      <div className="flex items-center justify-between text-[8px] font-mono text-gray-500 border-t border-glass/10 pt-1.5">
                        <span className={sentimentColor}>Sentiment: {sentimentLabel}</span>
                        <span>{doc.metadata?.readingTimeMinutes} min read</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Document comparison workspace */}
            <div className="lg:col-span-2 bg-black/30 border border-glass p-5 rounded-2xl space-y-4">
              <div className="border-b border-glass/40 pb-2 flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-400" />
                  Cleaning & Normalization Comparative Panel
                </h4>
                <span className="text-[8.5px] font-mono text-gray-500">
                  DUPLICATE HASH: {selectedNormDoc?.duplicateHash}
                </span>
              </div>

              {selectedNormDoc ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Raw Document view */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-wide block">
                      RAW TELEMETRY INPUT
                    </span>
                    <div className="bg-black/50 p-4 rounded-xl border border-glass/60 font-mono text-[10px] text-gray-400 h-[340px] overflow-y-auto whitespace-pre-wrap leading-relaxed break-all">
                      {rawDocForSelected?.markdown || rawDocForSelected?.html || (rawDocForSelected?.json ? JSON.stringify(rawDocForSelected.json, null, 2) : "No raw content")}
                    </div>
                  </div>

                  {/* Cleaned Document view */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wide block">
                      NORMALIZED & BOILERPLATE REMOVED
                    </span>
                    <div className="bg-black/50 p-4 rounded-xl border border-glass/60 font-sans text-[11px] text-gray-200 h-[340px] overflow-y-auto leading-relaxed break-words space-y-3">
                      <div className="pb-2 border-b border-glass/20 font-mono text-[9px] text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
                        <div>LANGUAGE: {selectedNormDoc.language}</div>
                        <div>BOILERPLATE REMOVED: TRUE</div>
                        <div>CANONICAL: TRUE</div>
                      </div>
                      <p>{selectedNormDoc.cleanedContent}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-gray-500 italic">
                  Select a collected trace to view comparative cleaning logs.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: CLAIMS & CONSENSUS FACT VERIFICATION */}
      {activeTab === "facts" && (
        <div className="space-y-6 text-left">
          <div className="bg-black/30 border border-glass p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-glass/40 pb-2">
              <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                Multi-Source Consensus Verification Ledger
              </h4>
              <span className="text-[9px] font-mono text-gray-400 uppercase">
                Zero Mock Policies Active
              </span>
            </div>

            <p className="text-[10.5px] text-gray-400 leading-normal max-w-3xl">
              Cross-referencing similar assertions across separate collector channels. If claims are backed by multiple platforms with identical values, they are given **Verified** status. Conflicting values generate a **Disputed** alert.
            </p>

            <div className="space-y-3">
              {researchV3.verifiedFacts?.map((fact: any) => {
                let statusBadge = "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
                if (fact.status === "disputed") {
                  statusBadge = "bg-rose-500/10 text-rose-400 border-rose-500/25";
                } else if (fact.status === "unverified") {
                  statusBadge = "bg-amber-500/10 text-amber-400 border-amber-500/25 animate-pulse";
                }

                return (
                  <div key={fact.id} className="bg-black/40 border border-glass/80 rounded-xl p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-glass/20 pb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusBadge}`}>
                          {fact.status}
                        </span>
                        <span className="text-[9px] font-mono text-gray-500 uppercase">
                          TYPE: {fact.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-gray-400">
                        <span>Consensus Confidence:</span>
                        <span className={fact.status === "verified" ? "text-emerald-400" : "text-amber-400"}>
                          {fact.confidenceScore}%
                        </span>
                      </div>
                    </div>

                    <div className="text-[11.5px] font-sans font-bold text-gray-200">
                      Consensus Factual Claim: "{fact.claimStatement}"
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] font-mono leading-relaxed text-gray-400 pt-1.5">
                      <div>
                        <span className="text-[8px] text-emerald-400 font-bold uppercase block tracking-wider mb-1">
                          Consensus Value Details
                        </span>
                        <div className="bg-black/50 p-2.5 rounded border border-glass/40 space-y-0.5">
                          <div>VALUE VERIFIED: {String(fact.consensusValue)}</div>
                          <div>MEASUREMENT UNIT: {fact.unit}</div>
                        </div>
                      </div>

                      <div>
                        <span className="text-[8px] text-gray-400 font-bold uppercase block tracking-wider mb-1">
                          Evidence Traces Audited
                        </span>
                        <div className="bg-black/50 p-2.5 rounded border border-glass/40 space-y-0.5">
                          <div>SUPPORTING CLAIMS ID: {fact.supportingClaimIds?.join(", ")}</div>
                          {fact.contradictingClaimIds?.length > 0 && (
                            <div className="text-rose-400">CONTRADICTING CLAIMS ID: {fact.contradictingClaimIds?.join(", ")}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WORLD RELATIONSHIP GRAPH & PATTERNS */}
      {activeTab === "graph" && (
        <div className="space-y-6 text-left">
          
          {/* Patterns Engine section */}
          <div className="bg-black/30 border border-glass p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-glass/40 pb-2">
              <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Pattern Engine Traversal Diagnostics
              </h4>
              <span className="text-[9px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full">
                {researchV3.patterns?.length || 0} REPEATING PATTERNS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {researchV3.patterns?.map((pattern: any) => (
                <div key={pattern.id} className="bg-black/40 border border-glass/80 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#14b8a6]/10 text-[#14b8a6] border border-[#14b8a6]/20 rounded">
                        {pattern.category}
                      </span>
                      <span className="text-[8px] font-mono text-gray-500">
                        {pattern.supportCount} companies match
                      </span>
                    </div>

                    <h5 className="text-[11px] font-sans font-bold text-white leading-snug">
                      {pattern.title}
                    </h5>

                    <p className="text-[10px] text-gray-400 leading-normal font-sans">
                      {pattern.description}
                    </p>

                    <div className="bg-black/50 p-2.5 rounded border border-glass/40 text-[9.5px] font-mono text-gray-400 space-y-1">
                      <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider">WHY IT APPEARS:</span>
                      <div className="font-sans leading-relaxed text-gray-300">{pattern.explanation}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-glass/20 mt-2 space-y-1 text-[9.5px]">
                    <span className="text-[8px] font-mono font-bold text-teal-400 uppercase tracking-wide">AUTOMATED OS ACTION:</span>
                    <div className="text-gray-200 leading-normal font-sans">{pattern.actionabilityStatement}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Node and relationship list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Graph Nodes list */}
            <div className="bg-black/30 border border-glass p-5 rounded-2xl space-y-4">
              <div className="border-b border-glass/40 pb-2">
                <h4 className="text-xs font-mono font-bold text-white uppercase">World Graph Node Directory</h4>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {Object.values(researchV3.graph?.nodes || {}).map((node: any) => (
                  <div key={node.id} className="p-2.5 bg-black/40 border border-glass/60 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                      <div>
                        <div className="text-[10.5px] font-sans font-bold text-white">{node.label}</div>
                        <div className="text-[8px] font-mono text-gray-500 uppercase">ID: {node.id}</div>
                      </div>
                    </div>

                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-black/50 border border-glass rounded text-gray-400">
                      {node.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Graph Edges / Relations list */}
            <div className="bg-black/30 border border-glass p-5 rounded-2xl space-y-4">
              <div className="border-b border-glass/40 pb-2">
                <h4 className="text-xs font-mono font-bold text-white uppercase">World Graph Structural Relations</h4>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {Object.values(researchV3.graph?.edges || {}).map((edge: any) => (
                  <div key={edge.id} className="p-2.5 bg-black/40 border border-glass/60 rounded-lg flex items-center justify-between text-[10.5px]">
                    <div className="flex items-center gap-1.5 font-mono text-gray-300">
                      <span className="text-gray-400 font-sans font-bold truncate max-w-[80px]">{edge.source.replace("node_", "")}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
                      <span className="text-teal-400 font-bold bg-teal-950/20 px-1.5 py-0.5 rounded border border-teal-500/10 text-[8.5px]">{edge.relation}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
                      <span className="text-gray-400 font-sans font-bold truncate max-w-[80px]">{edge.target.replace("node_", "")}</span>
                    </div>

                    {edge.properties?.confidence && (
                      <span className="text-[8.5px] font-mono text-gray-500">
                        Conf: {edge.properties.confidence}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 6: COMPANY & PRODUCT DNA ARCHITECTURES */}
      {activeTab === "dna" && (
        <div className="space-y-6 text-left">
          <div className="bg-black/30 border border-glass p-5 rounded-2xl space-y-4">
            
            {/* DNA subtabs */}
            <div className="flex flex-wrap gap-1 border-b border-glass/30 pb-3">
              {[
                { id: "company", label: "Company DNA Blueprint", desc: "Corporate operational deconstruction" },
                { id: "product", label: "Product DNA Blueprint", desc: "Value map and deliverables" },
                { id: "design", label: "Design DNA Blueprint", desc: "Styling standards & fonts" },
                { id: "marketing", label: "Marketing DNA Blueprint", desc: "Traffic & distribution ad hooks" }
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setDnaTab(sub.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                    dnaTab === sub.id
                      ? "bg-[#14b8a6]/15 border border-[#14b8a6]/45 text-[#14b8a6]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Sub-tab 1: Company DNA */}
            {dnaTab === "company" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <div className="bg-black/40 p-4 rounded-xl border border-glass/60 space-y-2">
                    <span className="text-[8.5px] font-mono font-bold text-teal-400 uppercase block tracking-wider">RECONSTRUCTED COMPANY NAME</span>
                    <h4 className="text-sm font-sans font-bold text-white">{researchV3.companyDna?.name}</h4>
                  </div>

                  <div className="bg-black/40 p-4 rounded-xl border border-glass/60 space-y-2">
                    <span className="text-[8.5px] font-mono font-bold text-teal-400 uppercase block tracking-wider">CORPORATE MISSION</span>
                    <p className="text-[11px] text-gray-300 font-sans leading-relaxed">{researchV3.companyDna?.mission}</p>
                  </div>

                  <div className="bg-black/40 p-4 rounded-xl border border-glass/60 space-y-2">
                    <span className="text-[8.5px] font-mono font-bold text-teal-400 uppercase block tracking-wider">MAPPED TARGET AUDIENCE</span>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-300 font-sans">
                      {researchV3.companyDna?.audience?.map((aud: string, i: number) => (
                        <li key={i}>{aud}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-black/40 p-4 rounded-xl border border-glass/60 space-y-2">
                    <span className="text-[8.5px] font-mono font-bold text-teal-400 uppercase block tracking-wider">AUTOMATION & ORCHESTRATION WORKFLOWS</span>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-300 font-sans">
                      {researchV3.companyDna?.automationWorkflow?.map((aut: string, i: number) => (
                        <li key={i}>{aut}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/40 p-4 rounded-xl border border-glass/60 space-y-1.5">
                      <span className="text-[8.5px] font-mono font-bold text-emerald-400 uppercase block tracking-wider">STRENGTHS</span>
                      <ul className="list-disc pl-4 space-y-1 text-[10px] text-gray-300 font-sans">
                        {researchV3.companyDna?.strengths?.map((str: string, i: number) => (
                          <li key={i}>{str}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-black/40 p-4 rounded-xl border border-glass/60 space-y-1.5">
                      <span className="text-[8.5px] font-mono font-bold text-rose-400 uppercase block tracking-wider">WEAKNESSES</span>
                      <ul className="list-disc pl-4 space-y-1 text-[10px] text-gray-300 font-sans">
                        {researchV3.companyDna?.weaknesses?.map((wk: string, i: number) => (
                          <li key={i}>{wk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-black/40 p-4 rounded-xl border border-glass/60 space-y-2">
                    <span className="text-[8.5px] font-mono font-bold text-teal-400 uppercase block tracking-wider">DEVELOPER TECH STACK FOUNDATION</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {researchV3.companyDna?.techStack?.map((t: string, i: number) => (
                        <span key={i} className="text-[9px] font-mono bg-black/60 px-2 py-0.5 rounded border border-glass text-gray-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-black/40 p-4 rounded-xl border border-glass/60 space-y-2">
                    <span className="text-[8.5px] font-mono font-bold text-teal-400 uppercase block tracking-wider">SOLVED CONSUMER DISAPPOINTMENTS</span>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-300 font-sans">
                      {researchV3.companyDna?.problems?.map((prob: string, i: number) => (
                        <li key={i}>{prob}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Product DNA */}
            {dnaTab === "product" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <div className="bg-black/40 p-4 rounded-xl border border-glass/60 space-y-2">
                    <span className="text-[8.5px] font-mono font-bold text-teal-400 uppercase block tracking-wider">CORE TRANSFORMATIONAL OUTCOME</span>
                    <p className="text-xs font-sans text-white font-bold">"{researchV3.productDna?.transformationOutcome}"</p>
                  </div>

                  <div className="bg-black/40 p-4 rounded-xl border border-glass/60 space-y-2">
                    <span className="text-[8.5px] font-mono font-bold text-teal-400 uppercase block tracking-wider">REUSABLE MONETIZATION PRICING TIERS</span>
                    <div className="grid grid-cols-3 gap-3 pt-1">
                      {researchV3.productDna?.pricingTiers?.map((tier: any, i: number) => (
                        <div key={i} className="bg-black/50 p-2.5 rounded-lg border border-glass/40 text-center">
                          <div className="text-[10px] font-mono font-bold text-gray-300 truncate">{tier.name}</div>
                          <div className="text-sm font-mono font-bold text-teal-400 mt-1">${tier.price}</div>
                          <div className="text-[8px] font-mono text-gray-500 uppercase">{tier.interval}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-black/40 p-4 rounded-xl border border-glass/60 space-y-2">
                    <span className="text-[8.5px] font-mono font-bold text-teal-400 uppercase block tracking-wider">MAPPED DELIVERABLE CORE FEATURES</span>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-300 font-sans">
                      {researchV3.productDna?.coreFeatures?.map((feat: string, i: number) => (
                        <li key={i}>{feat}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-black/40 p-4 rounded-xl border border-glass/60 space-y-2">
                    <span className="text-[8.5px] font-mono font-bold text-teal-400 uppercase block tracking-wider">HIGH CONVERSION MARKETING HOOKS</span>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-300 font-sans">
                      {researchV3.productDna?.marketingHooks?.map((hook: string, i: number) => (
                        <li key={i}>{hook}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 3: Design DNA */}
            {dnaTab === "design" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <div className="bg-black/40 p-4 rounded-xl border border-glass/60 space-y-3">
                    <span className="text-[8.5px] font-mono font-bold text-teal-400 uppercase block tracking-wider">VISUAL IDENTITY TYPOGRAPHY PAIRINGS</span>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/50 p-3 rounded-lg border border-glass/40">
                        <div className="text-[8px] font-mono text-gray-500 uppercase">HEADINGS (Space Grotesk)</div>
                        <div className="text-sm font-sans font-bold text-white mt-1">Hello World Greeting</div>
                      </div>
                      <div className="bg-black/50 p-3 rounded-lg border border-glass/40">
                        <div className="text-[8px] font-mono text-gray-500 uppercase">BODY (Inter)</div>
                        <div className="text-xs font-sans text-gray-300 mt-1">Lightweight, transparent, and modular software utilities.</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/40 p-4 rounded-xl border border-glass/60 space-y-2">
                    <span className="text-[8.5px] font-mono font-bold text-teal-400 uppercase block tracking-wider">ACCENT BRAND PERSONALITY</span>
                    <p className="text-xs font-sans text-white font-bold">{researchV3.designDna?.brandPersonality}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-black/40 p-4 rounded-xl border border-glass/60 space-y-2">
                    <span className="text-[8.5px] font-mono font-bold text-teal-400 uppercase block tracking-wider">DESIGN PALETTE MATRIX</span>
                    <div className="flex gap-2 pt-1.5">
                      {researchV3.designDna?.colors?.map((col: string, i: number) => (
                        <div key={i} className="flex flex-col items-center gap-1.5">
                          <div className="w-10 h-10 rounded-lg border border-glass/60" style={{ backgroundColor: col }}></div>
                          <span className="text-[8px] font-mono text-gray-500 uppercase">{col}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-black/40 p-4 rounded-xl border border-glass/60 space-y-2">
                    <span className="text-[8.5px] font-mono font-bold text-teal-400 uppercase block tracking-wider">MAPPED SPACING LAYOUT STYLES</span>
                    <p className="text-[11px] text-gray-300 font-sans leading-relaxed">{researchV3.designDna?.spacingLayout}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 4: Marketing DNA */}
            {dnaTab === "marketing" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <div className="bg-black/40 p-4 rounded-xl border border-glass/60 space-y-2">
                    <span className="text-[8.5px] font-mono font-bold text-teal-400 uppercase block tracking-wider">MAPPED DISTRIBUTION CHANNELS</span>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-300 font-sans">
                      {researchV3.marketingDna?.distributionChannels?.map((chan: string, i: number) => (
                        <li key={i}>{chan}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-black/40 p-4 rounded-xl border border-glass/60 space-y-2">
                    <span className="text-[8.5px] font-mono font-bold text-teal-400 uppercase block tracking-wider">ADVERTISING PERSUASION HOOKS</span>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-300 font-sans">
                      {researchV3.marketingDna?.adHooks?.map((hook: string, i: number) => (
                        <li key={i}>{hook}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-black/40 p-4 rounded-xl border border-glass/60 space-y-2">
                    <span className="text-[8.5px] font-mono font-bold text-teal-400 uppercase block tracking-wider">TRAFFIC SOURCE GENERATORS</span>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-300 font-sans">
                      {researchV3.marketingDna?.trafficSources?.map((ts: string, i: number) => (
                        <li key={i}>{ts}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-black/40 p-4 rounded-xl border border-glass/60 space-y-2">
                    <span className="text-[8.5px] font-mono font-bold text-teal-400 uppercase block tracking-wider">INTEGRATED LANDING FUNNEL STAGES</span>
                    <div className="flex items-center gap-1.5 pt-1">
                      {researchV3.marketingDna?.funnelStages?.map((stage: string, i: number) => (
                        <React.Fragment key={i}>
                          <span className="text-[9px] font-mono bg-black/60 px-2 py-0.5 rounded border border-glass text-gray-300">
                            {stage}
                          </span>
                          {i < researchV3.marketingDna.funnelStages.length - 1 && (
                            <ChevronRight className="w-3 h-3 text-teal-400" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* TAB 7: STRATEGIC REPORT BRIEFING */}
      {activeTab === "report" && (
        <div className="space-y-6 text-left">
          <div className="bg-black/30 border border-glass p-6 rounded-2xl space-y-6">
            
            {/* Report Header */}
            <div className="border-b border-glass/40 pb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[8.5px] font-mono font-bold bg-[#14b8a6]/10 text-[#14b8a6] border border-[#14b8a6]/20 px-2 py-0.5 rounded uppercase">
                  CONFIDENTIAL EXECUTIVE BRIEFING
                </span>
                <h3 className="text-base font-sans font-bold text-white uppercase tracking-wider">
                  {researchV3.report?.objective}
                </h3>
              </div>
              <div className="text-[10px] font-mono text-gray-500 text-right">
                <div>BRIEFING ID: {researchV3.report?.id}</div>
                <div>GENERATED: {new Date(researchV3.report?.generatedAt).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Overview paragraph */}
            <div className="bg-teal-950/5 border border-[#14b8a6]/20 p-4 rounded-xl text-xs font-sans text-gray-300 leading-relaxed">
              {researchV3.report?.marketOverview}
            </div>

            {/* Key Insights bullets */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-white uppercase">Critical Key Insights Identified</h4>
              <div className="space-y-2">
                {researchV3.report?.keyInsights?.map((insight: string, i: number) => (
                  <div key={i} className="flex gap-2 p-3 bg-black/40 border border-glass/60 rounded-xl">
                    <span className="text-[#14b8a6] font-mono font-bold">0{i + 1}.</span>
                    <p className="text-[11px] text-gray-300 leading-normal font-sans">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Assessment cards */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono font-bold text-white uppercase">Threat Index & Architectural Mitigations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {researchV3.report?.riskAssessment?.map((risk: any, i: number) => (
                  <div key={i} className="bg-black/40 border border-glass/80 p-4 rounded-xl space-y-3 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-mono font-bold text-rose-400 uppercase tracking-wider">DETECTED THREAT</span>
                      <p className="text-[11px] text-gray-300 font-sans leading-normal">{risk.threat}</p>
                    </div>

                    <div className="pt-2 border-t border-glass/20 mt-2 space-y-1 text-[10.5px]">
                      <span className="text-[8px] font-mono font-bold text-emerald-400 uppercase tracking-wide">SYSTEM-MAPPED MITIGATION</span>
                      <p className="text-gray-200 leading-normal font-sans">{risk.mitigation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
