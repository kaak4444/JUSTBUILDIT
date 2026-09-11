import { eventBus } from "../event/EventBus";

export class SystemHealth {
  private activeWorkers = 0;
  private queuedTasks = 0;

  constructor() {
    eventBus.on("TASK_RUNNING", () => { this.activeWorkers++; });
    eventBus.on("TASK_COMPLETED", () => {
      if (this.activeWorkers > 0) this.activeWorkers--;
    });
    eventBus.on("TASK_FAILED", () => {
      if (this.activeWorkers > 0) this.activeWorkers--;
    });
  }

  getHealth() {
    return {
      activeWorkers: this.activeWorkers,
      queuedTasks: this.queuedTasks,
      status: this.activeWorkers > 10 ? "DEGRADED" : "HEALTHY"
    };
  }
}

