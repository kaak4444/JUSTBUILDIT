// src/core/kernel/TaskScheduler.ts
import { workerPool } from "./WorkerPool";
import { eventBus } from "../event/EventBus";

export const taskScheduler = {
  async schedule(task: any) {
    try {
      eventBus.emit("TASK_SCHEDULING", task);
      const worker = workerPool.assign(task);
      const result = await worker.execute(task);
      eventBus.emit("TASK_COMPLETED", { task, result });
      return result;
    } catch (err) {
      eventBus.emit("TASK_FAILED", { task, err });
      throw err;
    }
  },
};
