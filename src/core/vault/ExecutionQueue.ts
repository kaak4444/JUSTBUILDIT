/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrchestrationTask } from "./TaskRouter";
import { SwarmConsensus } from "./AgentSwarm";

export interface QueueItem {
  id: string;
  task: OrchestrationTask;
  status: "queued" | "running" | "completed" | "failed";
  addedAt: string;
  startedAt?: string;
  completedAt?: string;
  retries: number;
  maxRetries: number;
  result?: SwarmConsensus;
  error?: string;
}

export class ExecutionQueue {
  private static instance: ExecutionQueue | null = null;
  private queue: QueueItem[] = [];
  private concurrencyLimit = 3;
  private activeCount = 0;
  private listeners: (() => void)[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): ExecutionQueue {
    if (!ExecutionQueue.instance) {
      ExecutionQueue.instance = new ExecutionQueue();
    }
    return ExecutionQueue.instance;
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem("jbi_aeo_execution_queue");
      if (saved) {
        // Restores only structural metadata, resets executing statuses back to queued or failed for safety
        const raw: QueueItem[] = JSON.parse(saved);
        this.queue = raw.map(item => {
          if (item.status === "running") {
            return { ...item, status: "queued", error: "Interrupted" };
          }
          return item;
        });
      }
    } catch (e) {
      console.error("Failed to load ExecutionQueue from localStorage:", e);
    }
  }

  public saveToStorage() {
    try {
      localStorage.setItem("jbi_aeo_execution_queue", JSON.stringify(this.queue));
    } catch (e) {
      console.error("Failed to save ExecutionQueue to localStorage:", e);
    }
  }

  /**
   * Subscribes a listener to queue mutations (e.g. UI triggers)
   */
  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
    this.saveToStorage();
  }

  /**
   * Appends an OrchestrationTask to the queue
   */
  public enqueue(task: OrchestrationTask, maxRetries = 2): QueueItem {
    const item: QueueItem = {
      id: `q_item_${Math.random().toString(36).substring(2, 8)}`,
      task,
      status: "queued",
      addedAt: new Date().toLocaleTimeString(),
      retries: 0,
      maxRetries
    };

    this.queue.push(item);
    this.notify();
    
    // Asynchronously kick off queue processing
    setTimeout(() => this.processNext(), 10);
    return item;
  }

  /**
   * Tries to execute queued items up to concurrency limit
   */
  public async processNext() {
    if (this.activeCount >= this.concurrencyLimit) return;

    const nextItem = this.queue.find(item => item.status === "queued");
    if (!nextItem) return;

    this.activeCount++;
    nextItem.status = "running";
    nextItem.startedAt = new Date().toLocaleTimeString();
    this.notify();

    try {
      // Execute through the AI Execution Organizer
      // Import lazily to avoid circular imports
      const { AIExecutionOrganizer } = await import("./AIExecutionOrganizer");
      const aeo = AIExecutionOrganizer.getInstance();

      const result = await aeo.executeTaskDirectly(nextItem.task);
      
      nextItem.status = "completed";
      nextItem.completedAt = new Date().toLocaleTimeString();
      nextItem.result = result;
      this.notify();
    } catch (err: any) {
      nextItem.retries++;
      if (nextItem.retries <= nextItem.maxRetries) {
        nextItem.status = "queued";
        nextItem.error = `Attempt ${nextItem.retries} failed: ${err.message || err}. Retrying...`;
      } else {
        nextItem.status = "failed";
        nextItem.completedAt = new Date().toLocaleTimeString();
        nextItem.error = err.message || "Failed after maximum retries";
      }
      this.notify();
    } finally {
      this.activeCount--;
      // Schedule next item
      setTimeout(() => this.processNext(), 50);
    }
  }

  public getQueue(): QueueItem[] {
    return this.queue;
  }

  public clearHistory() {
    this.queue = this.queue.filter(item => item.status === "running" || item.status === "queued");
    this.notify();
  }

  public getConcurrencyLimit(): number {
    return this.concurrencyLimit;
  }

  public setConcurrencyLimit(limit: number) {
    this.concurrencyLimit = Math.max(1, limit);
    this.notify();
    setTimeout(() => this.processNext(), 10);
  }
}
