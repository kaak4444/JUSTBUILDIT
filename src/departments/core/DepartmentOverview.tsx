/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Sparkles, Server, Zap, Compass, Activity } from "lucide-react";
import { Department } from "./Department";
import { DepartmentKPIs } from "./DepartmentKPIs";
import { MissionQueue } from "./MissionQueue";
import { WorkerBoard } from "./WorkerBoard";
import { DepartmentLogs } from "./DepartmentLogs";

interface DepartmentOverviewProps {
  department: Department;
}

export function DepartmentOverview({ department }: DepartmentOverviewProps) {
  // Find currently running mission
  const runningMissions = department.missions.filter(m => m.status === "RUNNING");
  const totalCompleted = department.missions.filter(m => m.status === "COMPLETED").length;

  return (
    <div id="department-overview-root" className="space-y-6">
      {/* Dynamic Header */}
      <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-3 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-glass pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              <h2 className="text-sm font-mono font-extrabold text-white uppercase tracking-wider">
                {department.name} Active Command Console
              </h2>
            </div>
            <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
              {department.description}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-[9px] uppercase font-bold text-gray-400 bg-black border border-glass px-3 py-1.5 rounded-lg select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Autonomous Service Broker: Connected</span>
          </div>
        </div>

        {/* Dynamic summary widgets */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
          <div className="p-2.5 rounded-xl border border-glass/60 bg-black/35 font-mono text-[9px]">
            <span className="text-gray-500 block uppercase font-bold">ACTIVE AGENT THREADS:</span>
            <span className="text-white font-extrabold block text-xs pt-0.5">
              {department.workers.filter(w => w.status === "RUNNING").length} running / {department.workers.length} registered
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-glass/60 bg-black/35 font-mono text-[9px]">
            <span className="text-gray-500 block uppercase font-bold">ACTIVE MISSION PAYLOAD:</span>
            <span className="text-amber-400 font-extrabold block text-xs pt-0.5">
              {runningMissions.length > 0 ? `"${runningMissions[0].title}" (${runningMissions[0].progress}%)` : "No Active Mission"}
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-glass/60 bg-black/35 font-mono text-[9px]">
            <span className="text-gray-500 block uppercase font-bold">COMPLETED MISSIONS:</span>
            <span className="text-emerald-400 font-extrabold block text-xs pt-0.5">
              {totalCompleted} lifetime runs
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-glass/60 bg-black/35 font-mono text-[9px]">
            <span className="text-gray-500 block uppercase font-bold">LLM REASONER TARGET:</span>
            <span className="text-white font-extrabold block text-xs pt-0.5 uppercase">
              {department.settings.activeModel}
            </span>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid Dashboard */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">Department KPIs</h4>
        <DepartmentKPIs department={department} />
      </div>

      {/* Main split dashboard view */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-2">
        {/* Missions Left */}
        <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
          <MissionQueue department={department} />
        </div>

        {/* Workers Right */}
        <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
          <WorkerBoard department={department} />
        </div>
      </div>

      {/* Live Logs Bottom */}
      <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
        <DepartmentLogs department={department} />
      </div>
    </div>
  );
}
