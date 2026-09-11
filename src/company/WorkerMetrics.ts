/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IWorkerMetrics {
  workerId: string;
  successRate: number;      // percentage, e.g., 94
  reviewAverage: number;    // rating 0 to 100, e.g., 88.5
  retryAverage: number;     // average count of retries per task
  providerUsage: Record<string, number>; // model -> call count
  timeAverageMs: number;    // average execution time in ms
  tasksCompleted: number;
}

export class WorkerMetricsEngine {
  private static metricsMap = new Map<string, IWorkerMetrics>([
    [
      "orchestrator-ceo",
      {
        workerId: "orchestrator-ceo",
        successRate: 100,
        reviewAverage: 98,
        retryAverage: 0,
        providerUsage: { "Gemini 2.5 Flash": 142 },
        timeAverageMs: 1200,
        tasksCompleted: 45
      }
    ],
    [
      "gap-thinker",
      {
        workerId: "gap-thinker",
        successRate: 92,
        reviewAverage: 89,
        retryAverage: 0.4,
        providerUsage: { "Gemini 2.5 Flash": 98, "Gemini 2.5 Pro": 12 },
        timeAverageMs: 2400,
        tasksCompleted: 34
      }
    ],
    [
      "book-writer",
      {
        workerId: "book-writer",
        successRate: 88,
        reviewAverage: 84,
        retryAverage: 0.7,
        providerUsage: { "Gemini 2.5 Flash": 110 },
        timeAverageMs: 4500,
        tasksCompleted: 22
      }
    ],
    [
      "frontend-engineer",
      {
        workerId: "frontend-engineer",
        successRate: 94,
        reviewAverage: 91,
        retryAverage: 0.2,
        providerUsage: { "Gemini 2.5 Flash": 150, "Gemini 2.5 Pro": 15 },
        timeAverageMs: 3200,
        tasksCompleted: 41
      }
    ],
    [
      "design-reviewer",
      {
        workerId: "design-reviewer",
        successRate: 96,
        reviewAverage: 93,
        retryAverage: 0.1,
        providerUsage: { "Gemini 2.5 Flash": 80 },
        timeAverageMs: 1800,
        tasksCompleted: 52
      }
    ]
  ]);

  public static getMetricsForWorker(workerId: string): IWorkerMetrics {
    if (!this.metricsMap.has(workerId)) {
      this.metricsMap.set(workerId, {
        workerId,
        successRate: 90,
        reviewAverage: 85,
        retryAverage: 0.5,
        providerUsage: { "Gemini 2.5 Flash": 5 },
        timeAverageMs: 2000,
        tasksCompleted: 5
      });
    }
    return this.metricsMap.get(workerId)!;
  }

  public static recordTaskOutcome(
    workerId: string,
    success: boolean,
    reviewScore: number,
    retries: number,
    provider: string,
    durationMs: number
  ) {
    const metrics = this.getMetricsForWorker(workerId);
    metrics.tasksCompleted += 1;
    metrics.successRate = Math.round(
      ((metrics.successRate * (metrics.tasksCompleted - 1) + (success ? 100 : 0)) / metrics.tasksCompleted)
    );
    metrics.reviewAverage = Math.round(
      ((metrics.reviewAverage * (metrics.tasksCompleted - 1) + reviewScore) / metrics.tasksCompleted) * 10
    ) / 10;
    metrics.retryAverage = Math.round(
      ((metrics.retryAverage * (metrics.tasksCompleted - 1) + retries) / metrics.tasksCompleted) * 10
    ) / 10;
    metrics.timeAverageMs = Math.round(
      (metrics.timeAverageMs * (metrics.tasksCompleted - 1) + durationMs) / metrics.tasksCompleted
    );

    metrics.providerUsage[provider] = (metrics.providerUsage[provider] || 0) + 1;
  }

  public static getAllMetrics(): IWorkerMetrics[] {
    return Array.from(this.metricsMap.values());
  }

  public static getDepartmentMetrics(department: string) {
    const deptWorkerMap: Record<string, string[]> = {
      "intelligence": ["gap-thinker"],
      "publishing": ["book-writer"],
      "website-agency": ["frontend-engineer"],
      "dropshipping-co": ["gap-thinker"],
      "quality-assurance": ["design-reviewer"]
    };

    const workers = deptWorkerMap[department] || [];
    if (workers.length === 0) {
      return {
        averageScore: 85,
        failureRate: 5,
        totalTasks: 10
      };
    }

    let totalScore = 0;
    let totalSuccess = 0;
    let totalTasks = 0;

    workers.forEach((wId) => {
      const wMetrics = this.getMetricsForWorker(wId);
      totalScore += wMetrics.reviewAverage;
      totalSuccess += wMetrics.successRate;
      totalTasks += wMetrics.tasksCompleted;
    });

    const avgScore = Math.round(totalScore / workers.length);
    const successRate = Math.round(totalSuccess / workers.length);
    const failureRate = 100 - successRate;

    return {
      averageScore: avgScore,
      failureRate,
      totalTasks
    };
  }
}
