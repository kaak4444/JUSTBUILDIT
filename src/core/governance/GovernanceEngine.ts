/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GovernancePolicy,
  GovernanceContext,
  PolicyResult,
  GovernanceDecision,
  GovernanceException
} from "./types";

export class GovernanceEngine {
  private static instance: GovernanceEngine | null = null;
  private policies: GovernancePolicy[] = [];
  private decisions: GovernanceDecision[] = [];
  private dbRef: any = null;

  private constructor(db?: any) {
    this.dbRef = db;
    this.registerDefaultPolicies();
    if (db) {
      this.syncFromDb();
    }
  }

  public static getInstance(db?: any): GovernanceEngine {
    if (!GovernanceEngine.instance) {
      GovernanceEngine.instance = new GovernanceEngine(db);
    } else if (db && !GovernanceEngine.instance.dbRef) {
      GovernanceEngine.instance.dbRef = db;
      GovernanceEngine.instance.syncFromDb();
    }
    return GovernanceEngine.instance;
  }

  private registerDefaultPolicies() {
    // 1. Budget Cap Policy
    this.policies.push({
      id: "budget_cap",
      name: "Corporate Budget Ceiling Enforcer",
      enabled: true,
      priority: 1,
      async validate(ctx: GovernanceContext): Promise<PolicyResult> {
        const failures: string[] = [];
        const warnings: string[] = [];
        const MAX_ALLOWED_BUDGET = 250;

        if (ctx.estimatedCost > MAX_ALLOWED_BUDGET) {
          failures.push(`Project estimated cost of $${ctx.estimatedCost} USD exceeds the maximum corporate safety ceiling of $${MAX_ALLOWED_BUDGET} USD.`);
        } else if (ctx.estimatedCost > MAX_ALLOWED_BUDGET * 0.8) {
          warnings.push(`Project cost of $${ctx.estimatedCost} is nearing the $${MAX_ALLOWED_BUDGET} USD ceiling limit.`);
        }

        return { passed: failures.length === 0, failures, warnings };
      }
    });

    // 2. Minimum ROI Policy
    this.policies.push({
      id: "minimum_roi",
      name: "Mandatory Yield Hurdle (ROI)",
      enabled: true,
      priority: 2,
      async validate(ctx: GovernanceContext): Promise<PolicyResult> {
        const failures: string[] = [];
        const warnings: string[] = [];
        const MIN_ROI = 40; // 40% hurdle rate

        if (ctx.estimatedROI < MIN_ROI) {
          failures.push(`Estimated project ROI of ${ctx.estimatedROI}% fails to meet the corporate hurdle rate of ${MIN_ROI}%.`);
        } else if (ctx.estimatedROI < MIN_ROI + 15) {
          warnings.push(`Project ROI is positive but offers relatively thin yield margins.`);
        }

        return { passed: failures.length === 0, failures, warnings };
      }
    });

    // 3. Provider Security Policy
    this.policies.push({
      id: "provider_security",
      name: "Model Provider Safety Auditor",
      enabled: true,
      priority: 3,
      async validate(ctx: GovernanceContext): Promise<PolicyResult> {
        const failures: string[] = [];
        const warnings: string[] = [];
        const banned = ["legacy-openai", "untrusted-scout-crawler"];

        if (banned.includes(ctx.selectedProvider.toLowerCase())) {
          failures.push(`Execution plan references banned or insecure provider [${ctx.selectedProvider}].`);
        }

        return { passed: failures.length === 0, failures, warnings };
      }
    });
  }

  private syncFromDb() {
    if (!this.dbRef) return;
    if (!this.dbRef.governanceDecisions) {
      this.dbRef.governanceDecisions = [];
    }
    this.decisions = this.dbRef.governanceDecisions;
  }

  private saveToDb() {
    if (!this.dbRef) return;
    this.dbRef.governanceDecisions = this.decisions;
  }

  public getPolicies(): { id: string; name: string; enabled: boolean; priority: number }[] {
    return this.policies.map(p => ({ id: p.id, name: p.name, enabled: p.enabled, priority: p.priority }));
  }

  public togglePolicy(id: string, enabled: boolean): boolean {
    const policy = this.policies.find(p => p.id === id);
    if (policy) {
      policy.enabled = enabled;
      return true;
    }
    return false;
  }

  public async review(context: GovernanceContext): Promise<{ passed: boolean; results: any[] }> {
    const activePolicies = this.policies.filter(p => p.enabled);
    const results = await Promise.all(
      activePolicies.map(async (policy) => {
        const res = await policy.validate(context);
        return {
          policyId: policy.id,
          policyName: policy.name,
          ...res
        };
      })
    );

    const failures = results.filter(r => !r.passed);

    if (failures.length > 0) {
      throw new GovernanceException(
        failures.map(f => ({
          policyId: f.policyId,
          policyName: f.policyName,
          messages: f.failures
        }))
      );
    }

    // Log this successful decision record
    const decision: GovernanceDecision = {
      id: `gov_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      projectId: context.projectId,
      decision: `Approved execution plan for "${context.projectName}"`,
      rationale: `Strategic review completed with all ${activePolicies.length} active corporate policies satisfied. High-yield estimated ROI (${context.estimatedROI}%) and optimized budget allocation.`,
      alternatives: ["Reject project", "Downscale scope", "Reroute to cheaper models"],
      approvedBy: ["System Kernel", "Chief Executive Orchestrator"],
      confidence: 94,
      estimatedCost: context.estimatedCost,
      estimatedROI: context.estimatedROI,
      createdAt: new Date().toISOString()
    };

    this.decisions.unshift(decision);
    if (this.decisions.length > 50) {
      this.decisions = this.decisions.slice(0, 50);
    }
    this.saveToDb();

    return { passed: true, results };
  }

  public listDecisions(): GovernanceDecision[] {
    return this.decisions;
  }
}
