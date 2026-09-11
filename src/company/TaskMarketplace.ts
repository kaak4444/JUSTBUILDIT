/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ITask } from "../engine/interfaces";
import { WorkerMetricsEngine } from "./WorkerMetrics";

export interface ITaskBid {
  bidId: string;
  taskId: string;
  workerId: string;
  workerName: string;
  confidence: number;  // 0 to 100
  durationHours: number;
  costUSD: number;
  bidTimestamp: string;
}

export class TaskMarketplace {
  private static activeBids: ITaskBid[] = [];

  /**
   * Open a task for worker bidding and retrieve the matching bids
   */
  public static solicitBids(task: ITask): ITaskBid[] {
    const bids: ITaskBid[] = [];
    const workers = [
      { id: "gap-thinker", name: "Strategic Gap Explorer", matchTypes: ["gap-thinker", "scout"] },
      { id: "book-writer", name: "Pedagogical Content Writer", matchTypes: ["book-writer", "content-editor"] },
      { id: "frontend-engineer", name: "UI Core Engineer", matchTypes: ["frontend-engineer", "web-developer"] },
      { id: "shopify-publisher", name: "E-Commerce Integrator", matchTypes: ["shopify-publisher"] },
      { id: "design-reviewer", name: "Audit Principal", matchTypes: ["design-reviewer"] }
    ];

    for (const w of workers) {
      // Calculate suitability based on historical metrics
      const metrics = WorkerMetricsEngine.getMetricsForWorker(w.id);
      const isPerfectMatch = w.matchTypes.includes(task.workerType) || task.workerType.includes(w.id);
      
      const confidence = isPerfectMatch 
        ? Math.round(metrics.successRate * 0.95 + (metrics.reviewAverage * 0.05))
        : Math.round(metrics.successRate * 0.5);

      const baseDuration = isPerfectMatch ? 12 : 36;
      const baseCost = isPerfectMatch ? 150 : 450;

      const bid: ITaskBid = {
        bidId: `bid_${Date.now()}_${w.id}`,
        taskId: task.id,
        workerId: w.id,
        workerName: w.name,
        confidence,
        durationHours: Math.round(baseDuration / (metrics.successRate / 100)),
        costUSD: Math.round(baseCost * (metrics.retryAverage + 1)),
        bidTimestamp: new Date().toISOString()
      };

      bids.push(bid);
      this.activeBids.unshift(bid);
    }

    return bids;
  }

  /**
   * Determine the best bid and assign the task to that worker
   */
  public static selectWinningBid(bids: ITaskBid[]): ITaskBid {
    // Select the bid maximizing confidence while balancing cost and duration
    let bestBid = bids[0];
    let topScore = -1;

    for (const b of bids) {
      const bidScore = (b.confidence * 0.6) - (b.durationHours * 0.2) - ((b.costUSD / 100) * 0.2);
      if (bidScore > topScore) {
        topScore = bidScore;
        bestBid = b;
      }
    }

    return bestBid;
  }

  public static listAllHistoricalBids(): ITaskBid[] {
    return this.activeBids;
  }
}
