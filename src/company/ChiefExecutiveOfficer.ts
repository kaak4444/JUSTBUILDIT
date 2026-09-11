/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IExecutive } from "./IExecutive";
import { StrategyCandidate, StrategyEvaluator } from "./StrategyCandidate";

export interface CompanyPlan {
  projectId: string;
  blueprintTitle: string;
  selectedStrategy: StrategyCandidate;
  participatingDepartments: string[];
  allocatedBudget: number;
  expectedDurationHours: number;
  conflictsResolved: string[];
}

export class ChiefExecutiveOfficer {
  private executives: IExecutive[] = [];

  constructor() {
    this.registerDefaultExecutives();
  }

  private registerDefaultExecutives() {
    // Strategy Director
    this.executives.push({
      id: "exec_strategy",
      title: "Chief Strategy Officer (CSO)",
      department: "Research & Strategy",
      shouldParticipate: async () => true,
      buildStrategy: async (bp) => ({
        id: "strat_high_speed",
        name: `High-Velocity ${bp.title || "Product"} Release`,
        score: 88,
        quality: 85,
        duration: 48,
        cost: 2500,
        risk: 20,
        marginEstimate: 75,
        timeToMarketDays: 3,
        reusableComponents: ["OLED UI Container", "Context Compiler Hook"]
      }),
      estimateBudget: async () => 2500,
      estimateDuration: async () => 48
    });

    // Engineering Director
    this.executives.push({
      id: "exec_eng",
      title: "VP of Engineering",
      department: "Engineering",
      shouldParticipate: async (bp) => bp.type === "webapp" || bp.type === "dropshipping",
      buildStrategy: async (bp) => ({
        id: "strat_bulletproof",
        name: `Zero-Latency Robust ${bp.title || "Fullstack"} Architecture`,
        score: 95,
        quality: 98,
        duration: 72,
        cost: 4500,
        risk: 5,
        marginEstimate: 85,
        timeToMarketDays: 5,
        reusableComponents: ["Fullstack Sandbox Webhook", "Drizzle schema preset"]
      }),
      estimateBudget: async () => 4500,
      estimateDuration: async () => 72
    });

    // Commerce Director
    this.executives.push({
      id: "exec_commerce",
      title: "Chief Revenue Officer (CRO)",
      department: "Commerce",
      shouldParticipate: async (bp) => bp.type === "dropshipping",
      buildStrategy: async (bp) => ({
        id: "strat_dropship_tax",
        name: "EU-Compliant High-Margin Dropshipping Hub",
        score: 92,
        quality: 90,
        duration: 96,
        cost: 6000,
        risk: 15,
        marginEstimate: 95,
        timeToMarketDays: 8,
        reusableComponents: ["German Customs Declaration Grid", "Stripe API proxy"]
      }),
      estimateBudget: async () => 6000,
      estimateDuration: async () => 96
    });
  }

  public async buildCompanyPlan(blueprint: any): Promise<CompanyPlan> {
    const participating: string[] = [];
    const candidates: StrategyCandidate[] = [];
    let totalBudget = 0;
    let maxDuration = 0;
    const conflicts: string[] = [];

    for (const exec of this.executives) {
      const participate = await exec.shouldParticipate(blueprint);
      if (participate) {
        participating.push(exec.department);
        const strat = await exec.buildStrategy(blueprint);
        candidates.push(strat);
        
        const budget = await exec.estimateBudget(blueprint);
        totalBudget += budget;

        const duration = await exec.estimateDuration(blueprint);
        if (duration > maxDuration) {
          maxDuration = duration;
        }
      }
    }

    // Solve potential conflicts
    if (participating.includes("Engineering") && participating.includes("Commerce")) {
      conflicts.push("Resolved structural friction between Engineering custom webhooks and Commerce checkout templates.");
      totalBudget = Math.round(totalBudget * 0.85); // 15% combined efficiency discount
    }

    // Default fallback candidate if empty
    if (candidates.length === 0) {
      candidates.push({
        id: "strat_minimalist",
        name: "Standard Minimalist Layout Plan",
        score: 80,
        quality: 80,
        duration: 24,
        cost: 1000,
        risk: 10,
        marginEstimate: 60,
        timeToMarketDays: 2,
        reusableComponents: []
      });
    }

    const selectedStrategy = StrategyEvaluator.evaluate(candidates);

    return {
      projectId: blueprint.id || `proj_${Date.now()}`,
      blueprintTitle: blueprint.title || "New Initiative",
      selectedStrategy,
      participatingDepartments: participating,
      allocatedBudget: totalBudget || 1500,
      expectedDurationHours: maxDuration || 24,
      conflictsResolved: conflicts
    };
  }
}
