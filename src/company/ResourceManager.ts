/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IResourceQuotas {
  cpuCores: number;
  memoryLimitGB: number;
  dailyAPIBudgetUSD: number;
  spentAPIBudgetUSD: number;
  maxConcurrentSandboxTasks: number;
}

export class ResourceManager {
  private static quotas: IResourceQuotas = {
    cpuCores: 8,
    memoryLimitGB: 16,
    dailyAPIBudgetUSD: 50.00,
    spentAPIBudgetUSD: 8.42,
    maxConcurrentSandboxTasks: 4
  };

  public static getQuotas(): IResourceQuotas {
    return this.quotas;
  }

  /**
   * Determine if the company has enough budget, capacity, and active quotas to spin up a project
   */
  public static canWeBuild(estimatedCostUSD: number): boolean {
    if (this.quotas.spentAPIBudgetUSD + estimatedCostUSD > this.quotas.dailyAPIBudgetUSD) {
      return false;
    }
    return true;
  }

  /**
   * Deduct budget upon successful execution of sandboxed API runs
   */
  public static chargeAPIFees(feesUSD: number) {
    this.quotas.spentAPIBudgetUSD = Math.round((this.quotas.spentAPIBudgetUSD + feesUSD) * 100) / 100;
  }
}
