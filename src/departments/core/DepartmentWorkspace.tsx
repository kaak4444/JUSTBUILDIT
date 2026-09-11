/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LayoutDashboard, Layers, Users, BrainCircuit, Sliders, Terminal, Sparkles } from "lucide-react";
import { Department } from "./Department";
import { DepartmentOverview } from "./DepartmentOverview";
import { MissionQueue } from "./MissionQueue";
import { WorkerBoard } from "./WorkerBoard";
import { DepartmentMemory } from "./DepartmentMemory";
import { DepartmentSettings } from "./DepartmentSettings";
import { DepartmentLogs } from "./DepartmentLogs";

interface DepartmentWorkspaceProps {
  department: Department;
}

export function DepartmentWorkspace({ department }: DepartmentWorkspaceProps) {
  // Local workspace tabs
  const [activeSubTab, setActiveSubTab] = useState<
    "OVERVIEW" | "MISSIONS" | "WORKERS" | "MEMORY" | "SETTINGS" | "LOGS"
  >("OVERVIEW");

  const subTabs = [
    { id: "OVERVIEW", label: "Dashboard", icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: "MISSIONS", label: "Mission Queue", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "WORKERS", label: "Worker Board", icon: <Users className="w-3.5 h-3.5" /> },
    { id: "MEMORY", label: "Memory Ledger", icon: <BrainCircuit className="w-3.5 h-3.5" /> },
    { id: "SETTINGS", label: "Settings", icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: "LOGS", label: "Logs Console", icon: <Terminal className="w-3.5 h-3.5" /> }
  ] as const;

  return (
    <div id="department-workspace-root" className="space-y-6">
      {/* Dynamic Sub-Navigation Bar */}
      <div className="flex items-center gap-1.5 border-b border-glass pb-1 select-none overflow-x-auto scrollbar-none">
        {subTabs.map(tab => {
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 text-[10px] font-mono font-bold uppercase border-b-2 tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                active
                  ? "border-accent text-white bg-white/[0.02]"
                  : "border-transparent text-gray-500 hover:text-gray-400 hover:bg-white/[0.005]"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Selected View */}
      <div className="min-h-[450px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${department.id}-${activeSubTab}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {activeSubTab === "OVERVIEW" && <DepartmentOverview department={department} />}
            
            {activeSubTab === "MISSIONS" && (
              <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass">
                <MissionQueue department={department} />
              </div>
            )}
            
            {activeSubTab === "WORKERS" && (
              <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass">
                <WorkerBoard department={department} />
              </div>
            )}
            
            {activeSubTab === "MEMORY" && (
              <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass">
                <DepartmentMemory department={department} />
              </div>
            )}
            
            {activeSubTab === "SETTINGS" && (
              <DepartmentSettings department={department} />
            )}
            
            {activeSubTab === "LOGS" && (
              <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass">
                <DepartmentLogs department={department} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
