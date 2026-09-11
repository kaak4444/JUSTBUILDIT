/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Cpu, UserCheck, Play, Radio, Users } from "lucide-react";
import { Worker, Department } from "./Department";
import { DepartmentRegistry } from "./DepartmentRegistry";

interface WorkerBoardProps {
  department: Department;
}

export function WorkerBoard({ department }: WorkerBoardProps) {
  const registry = DepartmentRegistry.getInstance();

  const getStatusColor = (status: Worker["status"]) => {
    switch (status) {
      case "IDLE": return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      case "RUNNING": return "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse";
      case "WAITING": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "COMPLETED": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "FAILED": return "bg-red-500/10 text-red-400 border-red-500/20";
    }
  };

  const getStatusPing = (status: Worker["status"]) => {
    switch (status) {
      case "RUNNING": return "bg-amber-400 animate-ping";
      case "WAITING": return "bg-blue-400 animate-ping";
      default: return "bg-transparent";
    }
  };

  const handleTriggerWorker = (workerId: string) => {
    // Manually trigger a quick operational scan
    const w = department.workers.find(wk => wk.id === workerId);
    if (!w || w.status === "RUNNING") return;

    registry.updateDepartment(department.id, (dept) => {
      const updatedWorkers = dept.workers.map(wk => {
        if (wk.id === workerId) {
          return {
            ...wk,
            status: "RUNNING" as const,
            progress: 0,
            currentTask: "Performing autonomous memory audit sweep..."
          };
        }
        return wk;
      });
      return { ...dept, workers: updatedWorkers };
    });

    registry.emitActivity(
      department.id,
      "WORKER_ASSIGNED",
      `Triggered diagnostics on ${w.name}: "${w.role}"`
    );

    // Simulate quick run
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      registry.updateDepartment(department.id, (dept) => {
        const updatedWorkers = dept.workers.map(wk => {
          if (wk.id === workerId) {
            return {
              ...wk,
              progress,
              currentTask: progress >= 100 ? "Awaiting next assignment" : `Performing sweep: ${progress}%`
            };
          }
          return wk;
        });
        return { ...dept, workers: updatedWorkers };
      });

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          registry.updateDepartment(department.id, (dept) => {
            const updatedWorkers = dept.workers.map(wk => {
              if (wk.id === workerId) {
                return {
                  ...wk,
                  status: "IDLE" as const,
                  progress: 0,
                  tasksCompleted: wk.tasksCompleted + 1
                };
              }
              return wk;
            });
            return { ...dept, workers: updatedWorkers };
          });
          registry.emitActivity(
            department.id,
            "WORKER_PROGRESS",
            `Worker ${w.name} finished autonomous sweep successfully.`
          );
        }, 1000);
      }
    }, 800);
  };

  return (
    <div id="worker-board-root" className="space-y-4">
      <div className="flex items-center justify-between border-b border-glass pb-2">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Worker Board</h3>
        </div>
        <span className="text-[9px] font-mono font-bold text-gray-500 bg-white/5 border border-glass px-2 py-0.5 rounded uppercase">
          {department.workers.length} active models
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
        {department.workers.map((worker) => (
          <motion.div
            key={worker.id}
            layoutId={`worker-${worker.id}`}
            whileHover={{ y: -2 }}
            className="p-3 rounded-xl border border-glass bg-black/30 flex flex-col justify-between gap-3 hover:border-white/10 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-glass">
                  <Cpu className="w-4 h-4 text-accent/80" />
                  <span className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${getStatusPing(worker.status)}`} />
                </div>

                <div className="space-y-0.5">
                  <span className="block text-[11px] font-bold text-white font-sans">{worker.name}</span>
                  <span className="block text-[8px] text-gray-500 font-mono leading-tight">{worker.role}</span>
                </div>
              </div>

              <div className={`text-[8px] font-mono border px-2 py-0.5 rounded font-bold uppercase ${getStatusColor(worker.status)}`}>
                {worker.status}
              </div>
            </div>

            <div className="space-y-1 bg-white/[0.01] p-2 rounded border border-glass/40">
              <div className="flex justify-between text-[8px] font-mono text-gray-500">
                <span>TASK HAND-OFF:</span>
                <span className="text-white truncate max-w-[150px]">{worker.currentTask}</span>
              </div>
              {worker.status === "RUNNING" && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[8px] font-mono text-amber-400">
                    <span>SWEEP INTENSITY</span>
                    <span>{worker.progress}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-accent h-full"
                      style={{ width: `${worker.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-glass/20 pt-2 text-[8px] font-mono text-gray-500">
              <div className="flex items-center gap-3">
                <span>TASKS: <strong className="text-white">{worker.tasksCompleted}</strong></span>
                <span>EFFICIENCY: <strong className="text-emerald-400">{worker.performanceScore}%</strong></span>
              </div>

              {worker.status === "IDLE" && (
                <button
                  onClick={() => handleTriggerWorker(worker.id)}
                  className="flex items-center gap-1 text-[8px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-white border border-glass cursor-pointer transition-all"
                >
                  <Radio className="w-2.5 h-2.5 text-accent animate-pulse" />
                  <span>Pulse Audit</span>
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
