// src/core/ceo/AutonomousCEOv2.ts

import { eventBus } from "../event/EventBus";
import { taskEngine } from "../tasks/TaskLifecycleEngine";
import { multiAgentExecutor } from "../execution/MultiAgentTaskExecutor";

class AutonomousCEOv2 {
  constructor() {
    this.register();
    this.startLoop();
  }

  private register() {
    eventBus.on("TASK_FAILED", this.analyzeFailure);
    eventBus.on("REVENUE_DROP", this.reactToRevenueDrop);
    eventBus.on("OPPORTUNITY_FOUND", this.spawnBusiness);
    eventBus.on("TASK_CREATED", async (task) => {
      await multiAgentExecutor.execute(task);
    });
  }

  private startLoop() {
    setInterval(() => {
      this.dailyReview();
    }, 1000 * 60 * 30); // every 30 min (dev mode)
  }

  private dailyReview() {
    eventBus.emit("CEO_REVIEW_STARTED", {});

    const healthSignals = this.collectSystemHealth();

    if (healthSignals.stuckTasks > 5) {
      eventBus.emit("SYSTEM_DEGRADATION_ALERT", healthSignals);
    }

    if (healthSignals.opportunities > 0) {
      eventBus.emit("AUTO_EXPAND_TRIGGER", healthSignals);
    }
  }

  private collectSystemHealth() {
    return {
      stuckTasks: 0,
      failedTasks: 0,
      activeWorkers: 0,
      opportunities: 0,
    };
  }

  private analyzeFailure = (task: any) => {
    eventBus.emit("CEO_ANALYSIS", {
      taskId: task.id,
      action: "REASSIGN_OR_SPLIT",
    });
  };

  private reactToRevenueDrop = (data: any) => {
    eventBus.emit("CEO_MARKET_RESPONSE", data);
  };

  private spawnBusiness = (data: any) => {
    taskEngine.create({
      id: "auto-" + Date.now(),
      type: "BUSINESS_CREATION",
      payload: data,
      timeoutMs: 60000,
      maxRetries: 2,
    });
  };
}

export const autonomousCEO = new AutonomousCEOv2();
