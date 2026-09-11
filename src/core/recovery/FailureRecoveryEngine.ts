// src/core/recovery/FailureRecoveryEngine.ts

import { eventBus } from "../event/EventBus";
import { taskEngine } from "../tasks/TaskLifecycleEngine";

class FailureRecoveryEngine {
  constructor() {
    this.register();
  }

  private register() {
    eventBus.on("TASK_STUCK_DETECTED", (task) => {
      this.handleStuck(task);
    });

    eventBus.on("TASK_FAILED", (data) => {
      this.handleFailure(data.task);
    });
  }

  private async handleStuck(task: any) {
    // Step 1: retry with different execution mode
    eventBus.emit("RECOVERY_TRIGGERED", {
      taskId: task.id,
      reason: "STUCK",
    });

    // Step 2: escalate if critical
    if (task.retries > 1) {
      eventBus.emit("CRO_ESCALATION", task);
    }

    // Step 3: requeue
    taskEngine.updateStatus(task.id, "RETRYING");
  }

  private handleFailure(task: any) {
    eventBus.emit("FAILURE_ANALYSIS_REQUEST", {
      taskId: task.id,
      type: task.type,
    });
  }
}

export const failureRecoveryEngine = new FailureRecoveryEngine();
