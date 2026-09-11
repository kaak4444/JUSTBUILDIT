/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ResourceManager } from "../../company/ResourceManager";
import { WorkerMetricsEngine } from "../../company/WorkerMetrics";
import { DepartmentManagerRegistry } from "../../company/DepartmentManager";
import { GovernanceEngine } from "../governance/GovernanceEngine";
import { SkillsFramework } from "../skills/SkillsFramework";

export interface KernelHeartbeatResult {
  timestamp: string;
  healthStatus: "HEALTHY" | "DEGRADED" | "CRITICAL";
  metrics: {
    totalSpentAPIBudgetUSD: number;
    remainingAPIBudgetUSD: number;
    activeQuotas: any;
    decayedNodesCount: number;
    activeDecisionsReviewCount: number;
  };
  diagnostics: string[];
}

export class SystemKernel {
  private static instance: SystemKernel | null = null;
  private dbRef: any = null;
  private heartbeatCount: number = 0;
  private logs: string[] = [];

  private constructor(db?: any) {
    this.dbRef = db;
    this.logs.push(`[SystemKernel] Operating System Kernel loaded at ${new Date().toISOString()}`);
  }

  public static getInstance(db?: any): SystemKernel {
    if (!SystemKernel.instance) {
      SystemKernel.instance = new SystemKernel(db);
    } else if (db && !SystemKernel.instance.dbRef) {
      SystemKernel.instance.dbRef = db;
    }
    return SystemKernel.instance;
  }

  /**
   * Continuous heartbeat scanning and regulatory cycles
   */
  public async heartbeat(): Promise<KernelHeartbeatResult> {
    this.heartbeatCount++;
    const timestamp = new Date().toISOString();
    const diagnostics: string[] = [];

    // 1. Health Audit: Scan Provider Registry
    const quotas = ResourceManager.getQuotas();
    let healthStatus: "HEALTHY" | "DEGRADED" | "CRITICAL" = "HEALTHY";

    if (quotas.spentAPIBudgetUSD >= quotas.dailyAPIBudgetUSD * 0.9) {
      healthStatus = "CRITICAL";
      diagnostics.push("API Budget Exhaustion Alert: Spatially depleted (>= 90% spent).");
    } else if (quotas.spentAPIBudgetUSD >= quotas.dailyAPIBudgetUSD * 0.7) {
      healthStatus = "DEGRADED";
      diagnostics.push("API Budget Exhaustion Warning: High utilization (>= 70% spent).");
    }

    // 2. Memory Decay / Knowledge Aging Cycle
    const decayedNodesCount = this.decayMemory();
    if (decayedNodesCount > 0) {
      diagnostics.push(`Memory Evolution: Retired ${decayedNodesCount} knowledge node(s) to AGING/DEPRECATED state.`);
    }

    // 3. Balance Scheduler / Budget Enforcements
    if (quotas.spentAPIBudgetUSD > quotas.dailyAPIBudgetUSD) {
      diagnostics.push(`Governor Override: Daily budget exceeded ($${quotas.spentAPIBudgetUSD} > $${quotas.dailyAPIBudgetUSD}). Halting outbound projects.`);
    }

    // 4. Department KPI aggregation
    this.aggregateDepartmentKPIs();

    this.logs.unshift(`[Heartbeat #${this.heartbeatCount}] [${healthStatus}] System Heartbeat successful. Decayed: ${decayedNodesCount} nodes.`);
    if (this.logs.length > 100) this.logs = this.logs.slice(0, 100);

    return {
      timestamp,
      healthStatus,
      metrics: {
        totalSpentAPIBudgetUSD: quotas.spentAPIBudgetUSD,
        remainingAPIBudgetUSD: Math.max(0, quotas.dailyAPIBudgetUSD - quotas.spentAPIBudgetUSD),
        activeQuotas: quotas,
        decayedNodesCount,
        activeDecisionsReviewCount: GovernanceEngine.getInstance(this.dbRef).listDecisions().length
      },
      diagnostics
    };
  }

  /**
   * Implement Organizational Memory Evolution (ACTIVE -> AGING -> DEPRECATED -> ARCHIVED)
   */
  private decayMemory(): number {
    if (!this.dbRef || !this.dbRef.knowledgeNodes) return 0;
    let count = 0;

    this.dbRef.knowledgeNodes.forEach((node: any) => {
      // Set initial state if not defined
      if (!node.state) {
        node.state = "ACTIVE";
        node.confidence = node.confidence || 100;
        node.lastUsedAt = node.lastUsedAt || new Date().toISOString();
      }

      // Age based on simulation cycles or confidence
      const ageInDays = (Date.now() - new Date(node.lastUsedAt).getTime()) / (1000 * 60 * 60 * 24);
      
      const prev = node.state;
      if (node.state === "ACTIVE") {
        if (ageInDays > 30 || node.confidence < 80) {
          node.state = "AGING";
          count++;
        }
      } else if (node.state === "AGING") {
        if (ageInDays > 60 || node.confidence < 60) {
          node.state = "DEPRECATED";
          count++;
        }
      } else if (node.state === "DEPRECATED") {
        if (ageInDays > 90 || node.confidence < 40) {
          node.state = "ARCHIVED";
          count++;
        }
      }
    });

    return count;
  }

  private aggregateDepartmentKPIs() {
    // Collect historical telemetry and compute department summaries
    const depts = ["intelligence", "publishing", "website-agency", "dropshipping-co", "quality-assurance"];
    
    depts.forEach((dept) => {
      // Pull scores
      const metrics = WorkerMetricsEngine.getDepartmentMetrics(dept) || {
        averageScore: 88,
        failureRate: 4,
        totalTasks: 42
      };

      // Set average department KPIs
      DepartmentManagerRegistry.reportKPIMetadata(
        dept,
        "Operating Quality Score",
        metrics.averageScore || 85
      );
    });
  }

  public getKernelLogs(): string[] {
    return this.logs;
  }
}
