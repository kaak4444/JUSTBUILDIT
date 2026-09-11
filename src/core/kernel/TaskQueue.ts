// src/core/kernel/TaskQueue.ts
import { workerPool } from "./WorkerPool";

export class TaskQueue {
  private queue: any[] = [];
  private running = new Set<string>();

  constructor(private pool: typeof workerPool) {}

  enqueue(task: any) {
    this.queue.push(task);
    this.process();
    return task.id;
  }

  private async process() {
    if (this.running.size >= 10) return;

    const task = this.queue.shift();
    if (!task) return;

    this.running.add(task.id);

    try {
      const worker = this.pool.assign(task);
      await worker.execute(task);
    } catch (e) {
      await this.handleFailure(task, e);
    } finally {
      this.running.delete(task.id);
      this.process();
    }
  }

  private async handleFailure(task: any, error: any) {
    task.retryCount = (task.retryCount || 0) + 1;

    if (task.retryCount > 3) {
      console.error("TASK DEAD:", task.id);
      return;
    }

    this.queue.push(task);
  }
}

export const taskQueue = new TaskQueue(workerPool);
