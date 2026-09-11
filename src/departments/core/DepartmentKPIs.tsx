/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Heart, Award, Zap, Layers, HardDrive, Hourglass, Users } from "lucide-react";
import { Department } from "./Department";

interface DepartmentKPIsProps {
  department: Department;
}

export function DepartmentKPIs({ department }: DepartmentKPIsProps) {
  const { kpis } = department;

  const kpiData = [
    {
      id: "health",
      label: "Health Index",
      value: `${kpis.health}%`,
      icon: <Heart className="w-4 h-4 text-emerald-400" />,
      desc: "Model response integrity rate",
      status: kpis.health >= 90 ? "OPTIMAL" : kpis.health >= 70 ? "STABLE" : "DEGRADED"
    },
    {
      id: "performance",
      label: "Performance Score",
      value: `${kpis.performance}%`,
      icon: <Award className="w-4 h-4 text-accent" />,
      desc: "Overall output satisfaction",
      status: "STABLE"
    },
    {
      id: "speed",
      label: "Processing Speed",
      value: `${kpis.speed}/100`,
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      desc: "Token parsing throughput",
      status: "OPTIMAL"
    },
    {
      id: "queueSize",
      label: "Queue Size",
      value: kpis.queueSize,
      icon: <Layers className="w-4 h-4 text-blue-400" />,
      desc: "Pending/Active mission payloads",
      status: kpis.queueSize > 3 ? "OVERLOADED" : "HEALTHY"
    },
    {
      id: "memoryUsage",
      label: "Memory Usage",
      value: kpis.memoryUsage,
      icon: <HardDrive className="w-4 h-4 text-purple-400" />,
      desc: "Active vector graph storage",
      status: "EFFICIENT"
    },
    {
      id: "avgCompletion",
      label: "Avg Completion",
      value: kpis.averageCompletionTime,
      icon: <Hourglass className="w-4 h-4 text-teal-400" />,
      desc: "Standard turn completion velocity",
      status: "OPTIMAL"
    }
  ];

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "OPTIMAL": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "STABLE": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "HEALTHY": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "EFFICIENT": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "OVERLOADED": return "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse";
      case "DEGRADED": return "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div id="department-kpis-root" className="grid grid-cols-2 lg:grid-cols-6 gap-3">
      {kpiData.map((kpi) => (
        <div
          key={kpi.id}
          className="p-3.5 rounded-xl border border-glass bg-[#080808] flex flex-col justify-between gap-2 hover:border-white/5 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-wide">
              {kpi.label}
            </span>
            {kpi.icon}
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="text-lg font-bold text-white font-mono leading-none tracking-tight">
              {kpi.value}
            </div>
            
            <div className="flex items-center justify-between gap-1 text-[8px] font-mono leading-none">
              <span className="text-gray-500 truncate max-w-[70px]">{kpi.desc}</span>
              <span className={`px-1 rounded-sm text-[7px] font-extrabold uppercase border ${getStatusBgColor(kpi.status)}`}>
                {kpi.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
