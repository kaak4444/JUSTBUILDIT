/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ISystemMetrics {
  workerSuccessRate: number;
  workerAverageDurationMs: number;
  providerLatencyMs: number;
  providerSuccessRate: number;
  averageReviewScore: number;
  averageRetries: number;
  skillUsageCount: Record<string, number>;
  departmentEfficiency: Record<string, number>;
  opportunityConversionRate: number;
}

export class MetricsEngine {
  private static metrics: ISystemMetrics = {
    workerSuccessRate: 94.2,
    workerAverageDurationMs: 3200,
    providerLatencyMs: 820,
    providerSuccessRate: 98.8,
    averageReviewScore: 88.5,
    averageRetries: 0.4,
    skillUsageCount: {
      "gap-thinking": 42,
      "book-writing": 28,
      "typescript-standard": 56,
      "design-review": 39
    },
    departmentEfficiency: {
      "Research & Strategy": 92.4,
      "Engineering": 95.8,
      "Publishing": 89.1,
      "Design & UX": 94.2
    },
    opportunityConversionRate: 72.5
  };

  static getMetrics(): ISystemMetrics {
    return this.metrics;
  }

  static trackExecution(success: boolean, durationMs: number, latencyMs: number) {
    // Dynamically update metrics based on real runs
    const oldSuccessRate = this.metrics.workerSuccessRate;
    this.metrics.workerSuccessRate = success 
      ? Math.min(100, Number((oldSuccessRate * 0.95 + 100 * 0.05).toFixed(1)))
      : Math.max(0, Number((oldSuccessRate * 0.95).toFixed(1)));

    this.metrics.workerAverageDurationMs = Math.round(this.metrics.workerAverageDurationMs * 0.9 + durationMs * 0.1);
    this.metrics.providerLatencyMs = Math.round(this.metrics.providerLatencyMs * 0.9 + latencyMs * 0.1);
  }

  static incrementSkillUsage(skillId: string) {
    if (!this.metrics.skillUsageCount[skillId]) {
      this.metrics.skillUsageCount[skillId] = 0;
    }
    this.metrics.skillUsageCount[skillId]++;
  }
}
