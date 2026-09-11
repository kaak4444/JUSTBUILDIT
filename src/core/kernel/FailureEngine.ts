// src/core/kernel/FailureEngine.ts
import { eventBus } from "../event/EventBus";

export const failureEngine = {
  init() {
    eventBus.on("TASK_FAILED", async (payload: any) => {
      const task = payload.task;
      if (!task) return;
      
      if ((task.retries || 0) < 3) {
        task.retries = (task.retries || 0) + 1;
        eventBus.emit("TASK_RETRY", task);
      } else {
        eventBus.emit("TASK_DEAD", task);
      }
    });
  },
};
