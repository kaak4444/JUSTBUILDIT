// src/core/kernel/WorkerPool.ts
import { aiRouter } from "../../agents/aiRouter";

class WorkerPool {
  workers: any[] = [];

  assign(task: any) {
    return {
      execute: async (task: any) => {
        const model = aiRouter.selectModel(task);
        const response = await aiRouter.run(model, task);
        return response;
      },
    };
  }
}

export const workerPool = new WorkerPool();
