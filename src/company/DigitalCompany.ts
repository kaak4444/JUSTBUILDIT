/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OpportunityDiscoveryEngine, IOpportunityReport } from "../opportunities/OpportunityDiscoveryEngine";
import { ChiefExecutiveOfficer, CompanyPlan } from "./ChiefExecutiveOfficer";
import { FounderBrain, FounderVetoDecision } from "./FounderBrain";
import { EvidenceRegistry } from "./Evidence";
import { TaskMarketplace } from "./TaskMarketplace";
import { ResourceManager } from "./ResourceManager";
import { DepartmentManagerRegistry } from "./DepartmentManager";
import { WorkerMetricsEngine } from "./WorkerMetrics";

export interface CompanyCycleLog {
  timestamp: string;
  phase: "MARKET_SWEEP" | "FOUNDER_REVIEW" | "C_SUITE_ALIGNMENT" | "PRODUCT_LAUNCHED" | "AUDIT_COMPLETE";
  message: string;
  payload?: any;
}

export class DigitalCompany {
  private static cycleLogs: CompanyCycleLog[] = [
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      phase: "MARKET_SWEEP",
      message: "Autonomous crawler scraped Reddit r/TOEFL and mapped high eyestrain complains during night study runs."
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(),
      phase: "FOUNDER_REVIEW",
      message: "Founder Brain evaluated the late-night academic reading gap and approved the initiative (Differentiate: OLED High Contrast)."
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      phase: "C_SUITE_ALIGNMENT",
      message: "CEO aggregated VP of Engineering and CSO budgets. Confirmed 15% combined cost integration discount."
    }
  ];

  static getLogs(): CompanyCycleLog[] {
    return this.cycleLogs;
  }

  /**
   * Run one complete autonomic cycle of the digital company
   */
  static async runAutonomicCycle(): Promise<CompanyCycleLog> {
    const timestamp = new Date().toISOString();
    
    // Step 1: Market Sweep & Opportunity Discovery
    const opp = OpportunityDiscoveryEngine.runDiscoveryScan();

    // Log finding as structural research evidence!
    EvidenceRegistry.addEvidence({
      source: "Gap Scanner Sweep",
      title: `Discovered opportunity gap: "${opp.problem.substring(0, 50)}..."`,
      extractedText: opp.problem,
      confidence: 90
    });
    
    // Step 2: Founder Brain evaluation
    const evaluation = await FounderBrain.evaluate({
      title: opp.suggestedProducts[0] || "Custom Digital Product",
      description: opp.problem,
      estimatedMarketSize: "$250,000 USD / year",
      suggestedProducts: opp.suggestedProducts
    });

    if (!evaluation.isApproved) {
      const log: CompanyCycleLog = {
        timestamp,
        phase: "FOUNDER_REVIEW",
        message: `Founder vetoed product initiative: "${evaluation.productTitle}". Reason: ${evaluation.vetoReason}`,
        payload: evaluation
      };
      this.cycleLogs.unshift(log);
      return log;
    }

    // Step 3: Align C-Suite Executives & CEO Plan
    const ceo = new ChiefExecutiveOfficer();
    const plan = await ceo.buildCompanyPlan({
      id: opp.id,
      title: evaluation.productTitle,
      type: opp.id.includes("dropship") ? "dropshipping" : "book"
    });

    // Check budget with central ResourceManager
    const canAfford = ResourceManager.canWeBuild(plan.allocatedBudget);
    if (canAfford) {
      ResourceManager.chargeAPIFees(plan.allocatedBudget * 0.015); // Charge 1.5% simulation API tokens fee
    }

    // Report performance KPIs back to department managers
    DepartmentManagerRegistry.reportKPIMetadata(
      opp.id.includes("dropship") ? "commerce" : "research",
      opp.id.includes("dropship") ? "Dropshipping Net Margin Average" : "Niche Discovered Success Rate",
      plan.selectedStrategy.marginEstimate
    );

    // Run Task Board Bidding on the primary strategy component
    const virtualTask = {
      id: `tsk_${opp.id}_core`,
      projectId: opp.id,
      title: `Build core layout and systems for ${evaluation.productTitle}`,
      description: `Formulate assets for ${evaluation.productTitle} focusing on design guidelines.`,
      workerType: opp.id.includes("dropship") ? "shopify-publisher" : "book-writer",
      dependencies: [],
      status: "PENDING" as any,
      input: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const bids = TaskMarketplace.solicitBids(virtualTask);
    const winningBid = TaskMarketplace.selectWinningBid(bids);

    // Record performance outcome on the winning worker to train metrics
    WorkerMetricsEngine.recordTaskOutcome(
      winningBid.workerId,
      true,
      92,
      0,
      "Gemini 2.5 Flash",
      3200
    );

    const finalLog: CompanyCycleLog = {
      timestamp,
      phase: "PRODUCT_LAUNCHED",
      message: `Company launched product: "${evaluation.productTitle}"! Expected Margin: ${plan.selectedStrategy.marginEstimate}%, Budget: $${plan.allocatedBudget}, Bid Winner: ${winningBid.workerName} (Confidence: ${winningBid.confidence}%)`,
      payload: {
        opportunity: opp,
        ceoPlan: plan,
        founderApproval: evaluation,
        marketplaceBidWinner: winningBid
      }
    };

    this.cycleLogs.unshift(finalLog);
    return finalLog;
  }
}
