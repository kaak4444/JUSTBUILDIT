/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PlusCircle, Play, CheckCircle, AlertTriangle, XCircle, HelpCircle, Clock, Zap } from "lucide-react";
import { Mission, Department } from "./Department";
import { DepartmentRegistry } from "./DepartmentRegistry";

interface MissionQueueProps {
  department: Department;
}

export function MissionQueue({ department }: MissionQueueProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState<Mission["priority"]>("MEDIUM");

  const registry = DepartmentRegistry.getInstance();

  const handleCreateMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newMission: Mission = {
      id: `mis_${Math.random().toString(36).substring(2, 9)}`,
      title: newTitle,
      description: newDesc,
      status: "PENDING",
      priority: newPriority,
      progress: 0,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      assignedWorkers: []
    };

    registry.updateDepartment(department.id, (dept) => ({
      ...dept,
      missions: [...dept.missions, newMission],
      kpis: { ...dept.kpis, queueSize: dept.kpis.queueSize + 1 }
    }));

    registry.emitActivity(
      department.id,
      "MISSION_CREATED",
      `Launched new mission: "${newTitle}" (${newPriority} priority)`
    );

    setNewTitle("");
    setNewDesc("");
    setNewPriority("MEDIUM");
    setShowAddModal(false);
  };

  const handleStartMission = (missionId: string) => {
    // Assign random worker who is IDLE or RUNNING
    const availableWorkers = department.workers.map(w => w.id);
    const assigned = availableWorkers.slice(0, Math.min(2, availableWorkers.length));

    registry.updateDepartment(department.id, (dept) => {
      const updatedMissions = dept.missions.map(m => {
        if (m.id === missionId) {
          return {
            ...m,
            status: "RUNNING" as const,
            progress: 10,
            assignedWorkers: assigned,
            updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
        return m;
      });

      // Also set assigned workers as RUNNING
      const updatedWorkers = dept.workers.map(w => {
        if (assigned.includes(w.id)) {
          return { ...w, status: "RUNNING" as const, progress: 10, currentTask: `Running: ${updatedMissions.find(m => m.id === missionId)?.title}` };
        }
        return w;
      });

      return { ...dept, missions: updatedMissions, workers: updatedWorkers };
    });

    const mission = department.missions.find(m => m.id === missionId);
    registry.emitActivity(
      department.id,
      "MISSION_STARTED",
      `Mission started: "${mission?.title}". Assigned workers: ${assigned.join(", ")}`
    );

    // Simulate progress updates for mock engine feel
    simulateProgress(missionId);
  };

  const simulateProgress = (missionId: string) => {
    let currentProgress = 10;
    const interval = setInterval(() => {
      registry.updateDepartment(department.id, (dept) => {
        const mission = dept.missions.find(m => m.id === missionId);
        if (!mission || mission.status !== "RUNNING") {
          clearInterval(interval);
          return dept;
        }

        const nextProgress = currentProgress + Math.floor(Math.random() * 20) + 5;
        const reachedLimit = nextProgress >= 100;

        const updatedMissions = dept.missions.map(m => {
          if (m.id === missionId) {
            return {
              ...m,
              progress: reachedLimit ? 100 : nextProgress,
              status: reachedLimit ? ("REVIEW" as const) : ("RUNNING" as const),
              updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          }
          return m;
        });

        // Sync workers
        const updatedWorkers = dept.workers.map(w => {
          if (mission.assignedWorkers.includes(w.id)) {
            return {
              ...w,
              progress: reachedLimit ? 100 : nextProgress,
              status: reachedLimit ? ("WAITING" as const) : ("RUNNING" as const)
            };
          }
          return w;
        });

        return { ...dept, missions: updatedMissions, workers: updatedWorkers };
      });

      currentProgress = currentProgress + Math.floor(Math.random() * 20) + 5;

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          // Complete the mission automatically for nice UI interactivity
          registry.updateDepartment(department.id, (dept) => {
            const mIndex = dept.missions.findIndex(m => m.id === missionId);
            if (mIndex === -1) return dept;
            const updatedMissions = [...dept.missions];
            updatedMissions[mIndex] = {
              ...updatedMissions[mIndex],
              status: "COMPLETED" as const,
              progress: 100,
              updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              output: `Generated high-quality output draft for mission: ${updatedMissions[mIndex].title}`
            };

            // Release workers
            const updatedWorkers = dept.workers.map(w => {
              if (updatedMissions[mIndex].assignedWorkers.includes(w.id)) {
                return {
                  ...w,
                  status: "IDLE" as const,
                  progress: 0,
                  currentTask: "Awaiting next assignment",
                  tasksCompleted: w.tasksCompleted + 1
                };
              }
              return w;
            });

            return { ...dept, missions: updatedMissions, workers: updatedWorkers };
          });

          const m = department.missions.find(mi => mi.id === missionId);
          registry.emitActivity(
            department.id,
            "MISSION_COMPLETED",
            `Successfully completed mission: "${m?.title}"!`
          );
        }, 1500);
      }
    }, 1500);
  };

  const getPriorityColor = (p: Mission["priority"]) => {
    switch (p) {
      case "LOW": return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      case "MEDIUM": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "HIGH": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "CRITICAL": return "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse";
    }
  };

  const getStatusIcon = (s: Mission["status"]) => {
    switch (s) {
      case "PENDING": return <Clock className="w-3.5 h-3.5 text-gray-500" />;
      case "RUNNING": return <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />;
      case "WAITING": return <Clock className="w-3.5 h-3.5 text-blue-400 animate-pulse" />;
      case "REVIEW": return <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />;
      case "COMPLETED": return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
      case "FAILED": return <XCircle className="w-3.5 h-3.5 text-red-400" />;
    }
  };

  return (
    <div id="mission-queue-root" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Mission Queue</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 text-[10px] font-mono font-bold bg-white/5 border border-glass text-white px-2 py-1.5 rounded hover:bg-white/10 transition-all select-none cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5 text-accent" />
          <span>Launch Mission</span>
        </button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {department.missions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 rounded-xl border border-glass text-center text-[10px] font-mono text-gray-500"
            >
              No active or queued missions. Launch a mission to begin.
            </motion.div>
          ) : (
            [...department.missions].reverse().map((mission) => (
              <motion.div
                key={mission.id}
                layoutId={`mission-${mission.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-3.5 rounded-xl border border-glass bg-black/40 space-y-3 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-sans">{mission.title}</span>
                      <span className={`text-[8px] font-mono border px-1.5 py-0.5 rounded font-bold uppercase ${getPriorityColor(mission.priority)}`}>
                        {mission.priority}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-mono leading-relaxed">{mission.description}</p>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase font-bold text-gray-400 bg-white/[0.02] border border-glass/40 px-2 py-1 rounded">
                    {getStatusIcon(mission.status)}
                    <span>{mission.status}</span>
                  </div>
                </div>

                {mission.status === "RUNNING" && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[8px] text-gray-500">
                      <span>COMPILING DRAFT WORKSPACE...</span>
                      <span className="text-white font-bold">{mission.progress}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <motion.div
                        className="bg-accent h-full"
                        style={{ width: `${mission.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {mission.output && (
                  <div className="p-2.5 rounded bg-white/[0.01] border border-glass text-[9px] font-mono text-emerald-400 leading-relaxed">
                    ✓ {mission.output}
                  </div>
                )}

                <div className="flex items-center justify-between text-[8px] font-mono text-gray-500 border-t border-glass/20 pt-2">
                  <span>Updated: {mission.updatedAt}</span>
                  <div className="flex items-center gap-2">
                    {mission.assignedWorkers.length > 0 && (
                      <span className="text-gray-400 uppercase">Workers: {mission.assignedWorkers.join(", ")}</span>
                    )}
                    {mission.status === "PENDING" && (
                      <button
                        onClick={() => handleStartMission(mission.id)}
                        className="flex items-center gap-1 text-[9px] font-mono font-bold bg-accent text-white px-2 py-1 rounded hover:bg-accent/80 transition-all cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        <span>Execute</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Launch Mission Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.form
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onSubmit={handleCreateMission}
              className="bg-[#0c0c0c] border border-glass p-5 rounded-2xl w-full max-w-md space-y-4"
            >
              <div className="border-b border-glass pb-2">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Launch Department Mission</h4>
                <p className="text-[10px] text-gray-500 font-mono">Create an autonomous work payload for {department.name}.</p>
              </div>

              <div className="space-y-3 font-mono text-[10px]">
                <div className="space-y-1">
                  <label className="text-gray-400">Mission Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., SEO Keyword Competition Sweep"
                    className="w-full bg-black border border-glass px-3 py-2 rounded text-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400">Description / Goal parameters</label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Describe exact targets, desired formatting, and constraints..."
                    className="w-full bg-black border border-glass px-3 py-2 rounded text-white focus:outline-none focus:border-accent resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400">Priority Level</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewPriority(p)}
                        className={`py-1.5 rounded text-[8px] font-bold border transition-all ${
                          newPriority === p
                            ? "bg-accent/10 border-accent text-white"
                            : "bg-black border-glass text-gray-500 hover:text-gray-400"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-glass pt-3 font-mono text-[9px]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded bg-white/5 text-gray-400 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-accent text-white font-bold hover:bg-accent/80"
                >
                  Queue Mission
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
