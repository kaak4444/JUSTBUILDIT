/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Terminal, ShieldAlert, CircleSlash, Trash2, Search, Sliders } from "lucide-react";
import { Department, DepartmentLog } from "./Department";
import { DepartmentRegistry } from "./DepartmentRegistry";

interface DepartmentLogsProps {
  department: Department;
}

export function DepartmentLogs({ department }: DepartmentLogsProps) {
  const [filter, setFilter] = useState<DepartmentLog["level"] | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  const registry = DepartmentRegistry.getInstance();
  const consoleEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to bottom when logs update
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [department.logs]);

  const handleClearLogs = () => {
    registry.updateDepartment(department.id, (dept) => ({
      ...dept,
      logs: []
    }));
    registry.emitActivity(
      department.id,
      "WORKER_PROGRESS",
      "Cleared department execution log trace stack."
    );
  };

  const getLevelColor = (level: DepartmentLog["level"]) => {
    switch (level) {
      case "INFO": return "text-emerald-400";
      case "WARN": return "text-amber-400";
      case "ERROR": return "text-red-400 font-bold";
      case "DEBUG": return "text-gray-500";
    }
  };

  const filteredLogs = department.logs.filter(log => {
    const matchesLevel = filter === "ALL" || log.level === filter;
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.level.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div id="department-logs-root" className="space-y-3 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-glass pb-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Trace Stack Daemon</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2 top-2 w-3 h-3 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs..."
              className="pl-7 pr-2 py-1 bg-black border border-glass rounded text-[9px] text-white focus:outline-none focus:border-accent w-32"
            />
          </div>

          {/* Level Filter Buttons */}
          <div className="flex items-center gap-1 border border-glass rounded p-0.5 bg-black">
            {(["ALL", "INFO", "WARN", "ERROR", "DEBUG"] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase transition-all cursor-pointer ${
                  filter === lvl
                    ? "bg-white/10 text-white"
                    : "text-gray-500 hover:text-gray-400"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={handleClearLogs}
            title="Clear Trace Logs"
            className="p-1 border border-glass bg-black text-gray-500 hover:text-red-400 hover:border-red-500/20 rounded cursor-pointer transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal View */}
      <div className="p-3 bg-black border border-glass rounded-xl h-[300px] overflow-y-auto space-y-1.5 text-[9px] leading-relaxed relative scrollbar-thin scrollbar-thumb-white/5">
        <div className="text-[8px] text-gray-500 border-b border-glass/40 pb-1.5 mb-2 uppercase flex items-center justify-between">
          <span>Active Log Pipeline daemon: live</span>
          <span>Buffer: {filteredLogs.length} traces</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="h-[200px] flex flex-col items-center justify-center text-center text-gray-600 space-y-1">
            <CircleSlash className="w-6 h-6 text-gray-700" />
            <span>Trace buffer is empty.</span>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-1.5 hover:bg-white/[0.01] px-1 py-0.5 rounded">
              <span className="text-gray-600 select-none font-bold">[{log.timestamp}]</span>
              <span className={`font-extrabold select-none ${getLevelColor(log.level)}`}>[{log.level}]</span>
              <span className="text-gray-300 break-all">{log.message}</span>
            </div>
          ))
        )}
        <div ref={consoleEndRef} />
      </div>
    </div>
  );
}
