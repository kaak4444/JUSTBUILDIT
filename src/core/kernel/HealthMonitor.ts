// src/core/kernel/HealthMonitor.ts
import { eventBus } from "../event/EventBus";

const runningTasks = new Map();
let monitorInterval: NodeJS.Timeout | null = null;

export const healthMonitor = {
  track(task: any) {
    runningTasks.set(task.id, Date.now());
  },

  check() {
    if (monitorInterval) return;
    
    monitorInterval = setInterval(() => {
      const now = Date.now();

      for (const [id, start] of runningTasks.entries()) {
        if (now - start > 60000) {
          eventBus.emit("TASK_STUCK", { id });
          runningTasks.delete(id); // Clean up after emitting
        }
      }
    }, 10000);
  },
};
