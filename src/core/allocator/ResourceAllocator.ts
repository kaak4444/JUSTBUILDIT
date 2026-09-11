/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ResourceManager } from "../../company/ResourceManager";

export interface ResourceBudget {
  tokens: number;
  dollars: number;
  cpu: number;
  memory: number;
  apiQuota: number;
  maxWorkers: number;
}

export interface ResourceAllocationRequest {
  projectId: string;
  projectName: string;
  urgency: number; // 0 to 100
  expectedROI: number; // percentage
  confidence: number; // 0 to 100
  estimatedCostUSD: number;
}

export class ResourceAllocator {
  private static allocations: Map<string, ResourceBudget> = new Map();

  /**
   * Calculate and allocate precise resource boundaries based on project priority, ROI, and budget limits
   */
  public static allocate(request: ResourceAllocationRequest): ResourceBudget {
    const limits = ResourceManager.getQuotas();
    
    // Calculate a weight index based on strategic factors
    const priorityWeight = (request.urgency * 0.4) + (request.expectedROI * 0.4) + (request.confidence * 0.2);
    
    // Base dollar constraint
    const dollarsAllocated = Math.min(
      request.estimatedCostUSD * (priorityWeight / 100) + 10,
      limits.dailyAPIBudgetUSD - limits.spentAPIBudgetUSD
    );

    // Compute constraints proportional to priority
    const cpuCores = priorityWeight > 80 ? 4 : (priorityWeight > 50 ? 2 : 1);
    const memoryLimitGB = priorityWeight > 80 ? 8 : (priorityWeight > 50 ? 4 : 2);
    const maxWorkers = priorityWeight > 80 ? limits.maxConcurrentSandboxTasks : Math.max(1, Math.round(limits.maxConcurrentSandboxTasks / 2));
    
    // API and Token quotas
    const apiQuota = Math.round(50 * (priorityWeight / 100) + 10);
    const tokensAllocated = Math.round(500000 * (priorityWeight / 100) + 100000);

    const budget: ResourceBudget = {
      tokens: tokensAllocated,
      dollars: Math.round(dollarsAllocated * 100) / 100,
      cpu: cpuCores,
      memory: memoryLimitGB,
      apiQuota,
      maxWorkers
    };

    this.allocations.set(request.projectId, budget);
    return budget;
  }

  public static getAllocation(projectId: string): ResourceBudget | undefined {
    return this.allocations.get(projectId);
  }

  public static listAllocations(): Record<string, ResourceBudget> {
    const record: Record<string, ResourceBudget> = {};
    this.allocations.forEach((budget, key) => {
      record[key] = budget;
    });
    return record;
  }

  public static deallocate(projectId: string): boolean {
    return this.allocations.delete(projectId);
  }
}
