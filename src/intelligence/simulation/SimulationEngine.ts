/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Belief } from "../beliefs/Belief.ts";
import { Scenario } from "./Scenario.ts";
import { Simulation, RiskReport } from "./Simulation.ts";
import { ReasoningEngine } from "../reasoning/ReasoningEngine.ts";
import { DecisionEngine } from "../decision/DecisionEngine.ts";
import { Decision } from "../decision/Decision.ts";

export class SimulationEngine {
    private static instance: SimulationEngine | null = null;

    public static getInstance(): SimulationEngine {
        if (!this.instance) {
            this.instance = new SimulationEngine();
        }
        return this.instance;
    }

    private constructor() {}

    /**
     * Retrieves the predefined three critical business risk scenarios (Step 7).
     */
    public getScenarios(): Scenario[] {
        return [
            {
                id: "scen_demand_drops",
                name: "Demand interest drops significantly",
                beliefChanges: [
                    { beliefId: "belief_trend_demand_interest", newConfidence: 0.45 }
                ]
            },
            {
                id: "scen_competition_rises",
                name: "Competitor density spikes heavily",
                beliefChanges: [
                    { beliefId: "belief_trend_competition_density", newConfidence: 0.80 }
                ]
            },
            {
                id: "scen_margin_drops",
                name: "Profit margins collapse from bidding wars",
                beliefChanges: [
                    { beliefId: "belief_trend_profit_margin", newConfidence: 0.35 }
                ]
            }
        ];
    }

    /**
     * Evaluates a scenario deterministically by cloning active beliefs, substituting hypothetical confidences,
     * running inferences, and choosing a policy-based simulated decision without recording history.
     */
    public simulate(beliefs: Belief[], scenario: Scenario): Simulation {
        // Clone beliefs and apply what-if values (Step 5: Don't touch real beliefs)
        const simulatedBeliefs = beliefs.map(b => {
            const override = scenario.beliefChanges.find(c => c.beliefId === b.id);
            return {
                ...b,
                confidence: override ? override.newConfidence : b.confidence
            };
        });

        // Run Causal Reasoning over simulated beliefs (Step 6: Reuse engines)
        const reasoningEngine = ReasoningEngine.getInstance();
        const outcome = reasoningEngine.infer(simulatedBeliefs);

        // Run Decision Engine without committing simulated decision to live history (Step 6: Reuse engines)
        const decisionEngine = DecisionEngine.getInstance();
        const simulatedDecision = decisionEngine.evaluate(outcome.inferences, false);

        const explanation = `Simulated scenario "${scenario.name}". ` +
            `Hypothetical response action: ${simulatedDecision.action} ` +
            `(Confidence: ${(simulatedDecision.confidence * 100).toFixed(0)}%).`;

        return {
            scenarioId: scenario.id,
            decision: simulatedDecision,
            explanation
        };
    }

    /**
     * Compares real-world decision stability across all three simulated risk scenarios (Step 9 & 10).
     */
    public generateRiskReport(originalDecision: Decision, beliefs: Belief[]): RiskReport {
        const scenarios = this.getScenarios();
        const simulatedDecisions: Decision[] = [];
        let changesCount = 0;

        for (const scenario of scenarios) {
            const simResult = this.simulate(beliefs, scenario);
            simulatedDecisions.push(simResult.decision);

            if (simResult.decision.action !== originalDecision.action) {
                changesCount++;
            }
        }

        const stable = changesCount === 0;
        let riskLevel: "LOW" | "MEDIUM" | "HIGH" = "LOW";

        if (changesCount === 1) {
            riskLevel = "MEDIUM";
        } else if (changesCount >= 2) {
            riskLevel = "HIGH";
        }

        return {
            originalDecision,
            simulatedDecisions,
            stable,
            riskLevel
        };
    }
}
