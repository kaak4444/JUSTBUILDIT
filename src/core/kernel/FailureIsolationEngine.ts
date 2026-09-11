// src/core/kernel/FailureIsolationEngine.ts
export class FailureIsolationEngine {
  private failedTasks = new Map<string, number>();

  shouldRetry(taskId: string): boolean {
    const count = this.failedTasks.get(taskId) || 0;

    if (count > 3) return false;

    this.failedTasks.set(taskId, count + 1);
    return true;
  }

  reset(taskId: string) {
    this.failedTasks.delete(taskId);
  }
}

export const failureIsolationEngine = new FailureIsolationEngine();
