// src/core/kernel/ExecutionKernel.ts
import { TaskQueue, taskQueue } from "./TaskQueue";
import { SandboxManager, sandboxManager } from "./SandboxManager";
import { KernelMonitor, kernelMonitor } from "./KernelMonitor";
import * as crypto from "crypto";

export class ExecutionKernel {
  constructor(
    private queue: TaskQueue,
    private sandbox: SandboxManager,
    private monitor: KernelMonitor
  ) {}

  async submit(task: any) {
    const taskId = task.id || crypto.randomUUID();
    const enrichedTask = { ...task, id: taskId };
    
    this.monitor.log("TASK_RECEIVED", enrichedTask.id);

    const safeTask = this.validate(enrichedTask);
    const sandbox = this.sandbox.create(safeTask);

    return this.queue.enqueue({
      ...safeTask,
      sandboxId: sandbox.id
    });
  }
  
  async dispatchTask(task: any) {
      return this.submit(task);
  }

  validate(task: any) {
    if (!task.id) throw new Error("Missing task ID");
    if (!task.type) throw new Error("Missing task type");
    return task;
  }
}

export const executionKernel = new ExecutionKernel(taskQueue, sandboxManager, kernelMonitor);
