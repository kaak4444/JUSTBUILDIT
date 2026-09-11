/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Job, Result } from "./types";
import { ConnectorManager } from "./ConnectorManager";
import { OAuthManager } from "./OAuthManager";

export class JobQueue {
  private static queue: Job[] = [];

  public static add(provider: string, action: Job["action"], payload: any): Job {
    const job: Job = {
      id: `queue_${Math.random().toString(36).substr(2, 9)}`,
      provider,
      action,
      payload,
      status: "PENDING",
      retries: 0,
      maxRetries: 2,
      timestamp: new Date().toISOString()
    };
    this.queue.push(job);
    return job;
  }

  public static getQueue(): Job[] {
    return this.queue;
  }

  public static clear(): void {
    this.queue = [];
  }

  /**
   * Simulates running the background Queue scheduler, including Auto-Retry and Expired Token correction
   */
  public static async processAll(onUpdate?: () => void): Promise<void> {
    for (const job of this.queue) {
      if (job.status === "PENDING" || job.status === "FAILED") {
        job.status = "PROCESSING";
        if (onUpdate) onUpdate();
        
        await new Promise(resolve => setTimeout(resolve, 600));

        // Trigger simulation
        const result = await ConnectorManager.publish(job.provider, job.payload);
        
        if (result.success) {
          job.status = "COMPLETED";
          job.errorMessage = undefined;
        } else {
          // If token was expired, try Auto-Correct OAuth recovery then retry!
          if (result.message?.includes("Expired") && job.retries < job.maxRetries) {
            job.retries++;
            // Auto Recovery Event
            await OAuthManager.refresh(job.provider);
            const secondAttempt = await ConnectorManager.publish(job.provider, job.payload);
            
            if (secondAttempt.success) {
              job.status = "COMPLETED";
              job.errorMessage = undefined;
            } else {
              job.status = "FAILED";
              job.errorMessage = secondAttempt.message;
            }
          } else {
            job.status = "FAILED";
            job.errorMessage = result.message;
          }
        }
        if (onUpdate) onUpdate();
      }
    }
  }
}
