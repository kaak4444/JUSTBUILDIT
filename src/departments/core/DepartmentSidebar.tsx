/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Department } from "./Department";
import { Search, BookOpen, Sparkles, Rocket, Wrench, TrendingUp, ShoppingBag, Database, Cpu, Award, Terminal } from "lucide-react";

interface DepartmentSidebarProps {
  departments: Department[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function DepartmentIcon({ name, className = "w-4 h-4" }: { name: string; className?: string }) {
  switch (name) {
    case "Search": return <Search className={className} />;
    case "BookOpen": return <BookOpen className={className} />;
    case "Sparkles": return <Sparkles className={className} />;
    case "Rocket": return <Rocket className={className} />;
    case "Wrench": return <Wrench className={className} />;
    case "TrendingUp": return <TrendingUp className={className} />;
    case "ShoppingBag": return <ShoppingBag className={className} />;
    case "Database": return <Database className={className} />;
    case "Cpu": return <Cpu className={className} />;
    default: return <Search className={className} />;
  }
}

export function DepartmentSidebar({ departments, selectedId, onSelect }: DepartmentSidebarProps) {
  return (
    <div id="department-sidebar-root" className="w-full flex flex-col gap-2 font-mono">
      <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold select-none border-b border-glass pb-1.5 mb-1">
        Company Divisions
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto max-h-[500px] pr-1">
        {departments.map((dept) => {
          const active = selectedId === dept.id;
          const runningMissions = dept.missions.filter(m => m.status === "RUNNING").length;
          const pendingMissions = dept.missions.filter(m => m.status === "PENDING").length;
          const activeOrPending = runningMissions + pendingMissions;

          return (
            <button
              key={dept.id}
              onClick={() => onSelect(dept.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all select-none cursor-pointer group ${
                active
                  ? "bg-accent/10 border-accent text-white"
                  : "bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                  active
                    ? "bg-accent/10 border-accent text-white"
                    : "bg-white/5 border-glass text-gray-500 group-hover:border-white/10 group-hover:text-gray-400"
                }`}>
                  <DepartmentIcon name={dept.icon} className="w-3.5 h-3.5" />
                </div>

                <div className="space-y-0.5">
                  <span className="block text-[11px] font-bold font-sans tracking-tight">{dept.name}</span>
                  <span className="block text-[8px] text-gray-500 leading-none">
                    {dept.workers.length} agent models
                  </span>
                </div>
              </div>

              {/* Badges */}
              {activeOrPending > 0 && (
                <div className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full border ${
                  runningMissions > 0
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/25 animate-pulse"
                    : "bg-white/5 text-gray-400 border-glass"
                }`}>
                  {runningMissions > 0 ? "RUN" : "PEND"}
                </div>
              )}
            </button>
          );
        })}

        {/* System Core Assets Section */}
        <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold select-none border-t border-glass pt-3 mt-3 pb-1.5 mb-1">
          System Core Assets
        </div>

        {/* Portfolio / Product Hub Button */}
        <button
          onClick={() => onSelect("portfolio")}
          className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all select-none cursor-pointer group ${
            selectedId === "portfolio"
              ? "bg-accent/10 border-accent text-white"
              : "bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
              selectedId === "portfolio"
                ? "bg-accent/10 border-accent text-white"
                : "bg-white/5 border-glass text-gray-500 group-hover:border-white/10 group-hover:text-gray-400"
            }`}>
              <Award className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-0.5">
              <span className="block text-[11px] font-bold font-sans tracking-tight">Product Portfolio</span>
              <span className="block text-[8px] text-gray-500 leading-none">
                Inspect live products & links
              </span>
            </div>
          </div>
        </button>

        {/* Legacy systems button */}
        <button
          onClick={() => onSelect("legacy_console")}
          className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all select-none cursor-pointer group ${
            selectedId === "legacy_console"
              ? "bg-accent/10 border-accent text-white"
              : "bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
              selectedId === "legacy_console"
                ? "bg-accent/10 border-accent text-white"
                : "bg-white/5 border-glass text-gray-500 group-hover:border-white/10 group-hover:text-gray-400"
            }`}>
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-0.5">
              <span className="block text-[11px] font-bold font-sans tracking-tight">Legacy Systems</span>
              <span className="block text-[8px] text-gray-500 leading-none">
                Developer sub-consoles
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
