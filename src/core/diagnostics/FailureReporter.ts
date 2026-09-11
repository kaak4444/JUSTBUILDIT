import { eventBus } from "../event/EventBus";

export interface IFailureRecord {
  id: string;
  projectId: string;
  taskId: string;
  reason: string;
  stack?: string;
  worker?: string;
  provider?: string;
  recoveryPlan?: string;
  timestamp: string;
}

export class FailureReporter {
  private failures: IFailureRecord[] = [];

  constructor() {
    eventBus.on("TASK_FAILED", (payload: any) => {
      this.failures.push({
        id: payload.task?.id || Math.random().toString(),
        projectId: payload.task?.projectId || "Unknown",
        taskId: payload.task?.id || "Unknown",
        reason: payload.reason || "Unknown failure",
        stack: payload.error?.stack || "",
        worker: payload.task?.workerType || "Unknown",
        provider: payload.provider || "Unknown",
        recoveryPlan: payload.recoveryPlan || "None",
        timestamp: new Date().toISOString()
      });
    });
  }

  getFailures() {
    return this.failures;
  }
}

