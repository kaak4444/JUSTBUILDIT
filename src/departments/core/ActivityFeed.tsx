/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, Plus, Play, UserCheck, RefreshCw, AlertCircle, CheckCircle2, Flame, RefreshCcw } from "lucide-react";
import { ActivityEvent } from "./Department";
import { DepartmentRegistry } from "./DepartmentRegistry";

interface ActivityFeedProps {
  limit?: number;
}

export function ActivityFeed({ limit = 8 }: ActivityFeedProps) {
  const registry = DepartmentRegistry.getInstance();
  const activities = registry.getActivityFeed().slice(0, limit);

  const getEventIcon = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "MISSION_CREATED":
        return <Plus className="w-3 h-3 text-blue-400" />;
      case "MISSION_STARTED":
        return <Play className="w-3 h-3 text-amber-400" />;
      case "WORKER_ASSIGNED":
        return <UserCheck className="w-3 h-3 text-purple-400" />;
      case "WORKER_PROGRESS":
        return <RefreshCw className="w-3 h-3 text-gray-400 animate-spin" style={{ animationDuration: "3s" }} />;
      case "MEMORY_UPDATED":
        return <Flame className="w-3 h-3 text-accent" />;
      case "REVIEW_TRIGGERED":
        return <AlertCircle className="w-3 h-3 text-purple-400 animate-pulse" />;
      case "MISSION_COMPLETED":
        return <CheckCircle2 className="w-3 h-3 text-emerald-400 font-bold" />;
      case "MISSION_FAILED":
        return <AlertCircle className="w-3 h-3 text-red-400 font-bold" />;
    }
  };

  const getEventBgColor = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "MISSION_COMPLETED": return "bg-emerald-500/10 border-emerald-500/20";
      case "MISSION_FAILED": return "bg-red-500/10 border-red-500/20";
      case "MISSION_STARTED": return "bg-amber-500/10 border-amber-500/20";
      case "MEMORY_UPDATED": return "bg-accent/10 border-accent/20";
      default: return "bg-white/5 border-glass";
    }
  };

  return (
    <div id="activity-feed-root" className="space-y-4">
      <div className="flex items-center justify-between border-b border-glass pb-2 select-none">
        <div className="flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Company Core Activity Feed</h3>
        </div>
        <span className="text-[7.5px] font-mono uppercase bg-white/5 border border-glass px-1.5 py-0.5 rounded font-extrabold text-emerald-400 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
          Live Pulse Feed
        </span>
      </div>

      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {activities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 rounded-xl border border-glass text-center text-[10px] font-mono text-gray-500"
            >
              System fully booted. Awaiting first operations log triggers...
            </motion.div>
          ) : (
            activities.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`p-3 rounded-xl border flex gap-3 items-start hover:bg-white/[0.01] transition-all ${getEventBgColor(event.type)}`}
              >
                {/* Micro-Icon Frame */}
                <div className="flex-shrink-0 w-5 h-5 rounded bg-black/40 border border-glass/40 flex items-center justify-center">
                  {getEventIcon(event.type)}
                </div>

                <div className="flex-grow space-y-0.5">
                  <span className="block text-[10px] text-gray-300 font-sans leading-relaxed">
                    {event.message}
                  </span>
                  
                  <div className="flex items-center justify-between text-[8px] font-mono text-gray-500">
                    <span className="uppercase font-bold text-[7.5px] text-accent">{event.departmentId} workspace</span>
                    <span>{event.timestamp}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
