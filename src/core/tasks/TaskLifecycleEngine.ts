// src/core/tasks/TaskLifecycleEngine.ts

import { eventBus } from "../event/EventBus";

export type TaskStatus =
  | "PENDING"
  | "QUEUED"
  | "RUNNING"
  | "BLOCKED"
  | "FAILED"
  | "SUCCESS"
  | "RETRYING";

export interface Task {
  id: string;
  type: string;
  payload: any;

  status: TaskStatus;

  createdAt: number;
  updatedAt: number;

  retries: number;
  maxRetries: number;

  timeoutMs: number;

  assignedWorker?: string;
}

export class TaskLifecycleEngine {
  private tasks: Map<string, Task> = new Map();

  constructor() {
    this.startMonitor();
  }

  create(task: Omit<Task, "status" | "createdAt" | "updatedAt" | "retries">) {
    const fullTask: Task = {
      ...task,
      status: "PENDING",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      retries: 0,
    };

    this.tasks.set(fullTask.id, fullTask);

    eventBus.emit("TASK_CREATED", fullTask);
    return fullTask;
  }

  updateStatus(id: string, status: TaskStatus) {
    const task = this.tasks.get(id);
    if (!task) return;

    task.status = status;
    task.updatedAt = Date.now();

    this.tasks.set(id, task);

    eventBus.emit("TASK_UPDATED", task);
  }

  fail(id: string, reason: any) {
    const task = this.tasks.get(id);
    if (!task) return;

    task.retries += 1;
    task.updatedAt = Date.now();

    if (task.retries >= task.maxRetries) {
      task.status = "FAILED";
      eventBus.emit("TASK_FAILED", { task, reason });
    } else {
      task.status = "RETRYING";
      eventBus.emit("TASK_RETRY", { task, reason });
    }
  }

  private startMonitor() {
    setInterval(() => {
      const now = Date.now();

      for (const task of this.tasks.values()) {
        if (task.status !== "RUNNING") continue;

        if (now - task.updatedAt > task.timeoutMs) {
          eventBus.emit("TASK_STUCK_DETECTED", task);

          this.fail(task.id, "TIMEOUT");
        }
      }
    }, 5000);
  }

  getTask(id: string) {
    return this.tasks.get(id);
  }
}

export const taskEngine = new TaskLifecycleEngine();
