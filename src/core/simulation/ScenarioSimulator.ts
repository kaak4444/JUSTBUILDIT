/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MarketScenario {
  id: string;
  name: string;
  description: string;
  shocks: {
    category: "Cost" | "Conversion" | "API" | "Traffic";
    magnitude: number; // percentage change (-100 to +100)
    targetDepartment: string;
  }[];
}

export interface SimulationResult {
  scenarioId: string;
  scenarioName: string;
  urgencyLevel: "Low" | "Medium" | "High" | "Critical";
  impactAnalysis: {
    immediateCostImpact: string;
    throughputImpact: string;
    roiReduction: number; // percentage
  };
  timeHorizons: {
    daily: string;
    weekly: string;
    monthly: string;
    quarterly: string;
    annual: string;
  };
  mitigations: string[];
}

export class ScenarioSimulator {
  private static scenarios: MarketScenario[] = [
    {
      id: "google_seo_shock",
      name: "Google SEO Algorithm Overhaul",
      description: "Google rolls out a major Core Update that penalizes low-value programmatic content, cutting organic search traffic by 40%.",
      shocks: [
        { category: "Traffic", magnitude: -40, targetDepartment: "dropshipping-co" },
        { category: "Cost", magnitude: 30, targetDepartment: "intelligence" }
      ]
    },
    {
      id: "shopify_fee_hike",
      name: "Shopify Transaction Fee Escalation",
      description: "Shopify elevates its base transaction fees by 15% and increases api subscription tiers.",
      shocks: [
        { category: "Cost", magnitude: 15, targetDepartment: "dropshipping-co" },
        { category: "Conversion", magnitude: -5, targetDepartment: "publishing" }
      ]
    },
    {
      id: "tiktok_ban",
      name: "Regulatory Ban on Short-Form Video App",
      description: "Major social platforms ban organic short-form promotion, removing dropshipping's primary organic marketing engine overnight.",
      shocks: [
        { category: "Traffic", magnitude: -60, targetDepartment: "dropshipping-co" },
        { category: "Cost", magnitude: 50, targetDepartment: "website-agency" }
      ]
    },
    {
      id: "openai_cost_doubling",
      name: "OpenAI Token Pricing Duplication",
      description: "OpenAI raises API token call costs by 100%, causing tight budget constraints on high-latency worker nodes.",
      shocks: [
        { category: "API", magnitude: 100, targetDepartment: "website-agency" },
        { category: "Cost", magnitude: 40, targetDepartment: "intelligence" }
      ]
    }
  ];

  public static listScenarios(): MarketScenario[] {
    return this.scenarios;
  }

  /**
   * Run scenario simulation and compile strategic multi-temporal impact
   */
  public static runSimulation(scenarioId: string): SimulationResult | null {
    const scenario = this.scenarios.find(s => s.id === scenarioId);
    if (!scenario) return null;

    let urgencyLevel: "Low" | "Medium" | "High" | "Critical" = "Medium";
    let roiReduction = 0;
    let immediateCostImpact = "No immediate fiscal cost changes predicted.";
    let throughputImpact = "Throughput expected to remain stable.";

    scenario.shocks.forEach(shock => {
      if (shock.category === "Cost" && shock.magnitude > 30) {
        urgencyLevel = "High";
        roiReduction += 12;
        immediateCostImpact = `API operating cost metrics predicted to inflate by +${shock.magnitude}% across ${shock.targetDepartment}.`;
      } else if (shock.category === "Traffic" && shock.magnitude <= -40) {
        urgencyLevel = "Critical";
        roiReduction += 25;
        throughputImpact = `Severe acquisition collapse! Organic customer clicks expected to decline by ${shock.magnitude}% inside ${shock.targetDepartment}.`;
      } else if (shock.category === "API") {
        urgencyLevel = "High";
        roiReduction += 15;
        immediateCostImpact = `Critical cost escalation! Developer tools API token overhead expands by +${shock.magnitude}%.`;
      }
    });

    // Strategy Planning Horizons
    const timeHorizons = {
      daily: "Evaluate current active budgets. Halt expensive background crawling routines. Toggle local fallback smart heuristics to decrease token use.",
      weekly: "Assess project pipelines. Pivot advertising copy toward high-intent customer segments to offset organic loss.",
      monthly: "Audit active providers. Migrate expensive model instances to Gemini-Flash, reducing token costs by up to 60%. Configure backup dropship suppliers.",
      quarterly: "Refocus department resources. Deprecate affected e-commerce branches and invest memory/tokens in academic publishing or web agencies.",
      annual: "Refine corporate policies. Re-program the CEO Brain to prioritize organic email-marketing engines and establish private localized vector models."
    };

    const mitigations = [
      "Accelerate deployment of local-heuristics models for low-complexity worker tasks.",
      "Re-allocate budget limits dynamically using the Resource Allocator to support higher-ROI publishing projects.",
      "Evolve the core branding skill package to target low-cost search niches directly."
    ];

    return {
      scenarioId,
      scenarioName: scenario.name,
      urgencyLevel,
      impactAnalysis: {
        immediateCostImpact,
        throughputImpact,
        roiReduction
      },
      timeHorizons,
      mitigations
    };
  }
}
