import React, { useEffect, useState } from "react";
import { AlertCircle, Clock, Server, CheckCircle, XCircle } from "lucide-react";

export function DiagnosticReporterPanel() {
  const [diagnostics, setDiagnostics] = useState<any>({
    projects: [],
    failures: [],
    health: { status: "UNKNOWN", activeWorkers: 0, queuedTasks: 0 }
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchDiagnostics = async () => {
      try {
        const res = await fetch("/api/diagnostics");
        if (res.ok) {
          setDiagnostics(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch diagnostics", err);
      }
    };
    fetchDiagnostics();
    const interval = setInterval(fetchDiagnostics, 2000);
    return () => clearInterval(interval);
  }, []);

  const { projects, failures, health } = diagnostics;

  if (!isExpanded) {
    return (
      <div 
        className="fixed bottom-4 right-4 bg-[#0a0a0a] border border-glass rounded-full px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-white/5 shadow-2xl z-50 text-xs font-mono text-white"
        onClick={() => setIsExpanded(true)}
      >
        <Server className="w-4 h-4 text-accent" />
        <span>System Reporter</span>
        <div className="flex gap-2">
          {health.status === "HEALTHY" ? (
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          )}
          {failures.length > 0 && <span className="text-red-400">({failures.length} errors)</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-[600px] h-[400px] bg-[#0a0a0a] border border-glass rounded-xl shadow-2xl z-50 flex flex-col font-mono text-xs text-white overflow-hidden">
      <div className="p-3 border-b border-glass bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-accent" />
          <span className="font-bold">Diagnostic Reporter</span>
          <span className={`px-2 py-0.5 rounded text-[10px] ${health.status === "HEALTHY" ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
            {health.status} (W: {health.activeWorkers} Q: {health.queuedTasks})
          </span>
        </div>
        <button onClick={() => setIsExpanded(false)} className="text-gray-500 hover:text-white">
          <XCircle className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Project Inspector */}
        <div className="space-y-3">
          <h3 className="text-[10px] uppercase text-gray-500 tracking-wider">Project Inspector</h3>
          {projects.length === 0 ? (
            <div className="text-gray-600 italic">No active projects</div>
          ) : (
            projects.map((p: any) => (
              <div key={p.projectId} className="p-3 rounded border border-glass bg-white/[0.02] space-y-2">
                <div className="flex items-center justify-between border-b border-glass pb-2">
                  <span className="text-accent font-bold">{p.projectId}</span>
                  <span className="px-2 py-0.5 bg-white/10 rounded">{p.status}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px]">
                  <div className="flex flex-col"><span className="text-gray-500">Running</span><span className="text-blue-400">{p.runningTasks.length}</span></div>
                  <div className="flex flex-col"><span className="text-gray-500">Waiting</span><span className="text-yellow-400">{p.waitingTasks.length}</span></div>
                  <div className="flex flex-col"><span className="text-gray-500">Blocked</span><span className="text-orange-400">{p.blockedTasks.length}</span></div>
                  <div className="flex flex-col"><span className="text-gray-500">Failed</span><span className="text-red-400">{p.failedTasks.length}</span></div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Failure Reporter */}
        <div className="space-y-3">
          <h3 className="text-[10px] uppercase text-gray-500 tracking-wider flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            Failure Traces
          </h3>
          {failures.length === 0 ? (
            <div className="text-gray-600 italic">No failures recorded</div>
          ) : (
            [...failures].reverse().map((f: any) => (
              <div key={f.id} className="p-3 rounded border border-red-500/20 bg-red-500/5 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-red-400 font-bold">TASK FAILED: {f.taskId}</span>
                  <span className="text-[10px] text-gray-500">{new Date(f.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div><span className="text-gray-500">Reason:</span> <span className="text-white">{f.reason}</span></div>
                  <div><span className="text-gray-500">Worker:</span> <span className="text-white">{f.worker || "Unknown"}</span></div>
                  <div><span className="text-gray-500">Provider:</span> <span className="text-white">{f.provider || "Unknown"}</span></div>
                  <div><span className="text-gray-500">Recovery:</span> <span className="text-amber-400">{f.recoveryPlan}</span></div>
                </div>
                {f.stack && (
                  <div className="mt-2 p-2 bg-black/50 rounded text-[9px] text-gray-400 overflow-x-auto whitespace-pre">
                    {f.stack}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
