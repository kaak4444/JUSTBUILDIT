import { Decision } from "../decision/Decision.ts";
import { Prediction } from "./Prediction.ts";

export class PredictionEngine {
    private static instance: PredictionEngine | null = null;

    public static getInstance(): PredictionEngine {
        if (!this.instance) {
            this.instance = new PredictionEngine();
        }
        return this.instance;
    }

    private constructor() {}

    /**
     * Synthesizes predictions from an active executive decision.
     */
    public create(decision: Decision): Prediction[] {
        const predictions: Prediction[] = [];
        const now = new Date();
        const expectedTimeline = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000); // 15-day target window

        if (decision.action === "BUY") {
            // High-commitment buy expects increased competition and compressed margins due to entry
            predictions.push({
                id: `pred_comp_inc_${Math.random().toString(36).substring(2, 9)}`,
                statement: "Niche competitors will react to demand acceleration by increasing competitor density.",
                confidence: 0.85,
                predictedAt: now,
                expectedBy: expectedTimeline,
                status: "PENDING",
                basedOnDecision: decision.id,
                targetBeliefId: "belief_trend_competition_density"
            });

            predictions.push({
                id: `pred_margin_dec_${Math.random().toString(36).substring(2, 9)}`,
                statement: "Increased advertising bid costs will moderately compress profit margins.",
                confidence: 0.70,
                predictedAt: now,
                expectedBy: expectedTimeline,
                status: "PENDING",
                basedOnDecision: decision.id,
                targetBeliefId: "belief_trend_profit_margin"
            });
        } else if (decision.action === "TEST") {
            // Small PPC validation expects immediate consumer demand amplification
            predictions.push({
                id: `pred_demand_inc_${Math.random().toString(36).substring(2, 9)}`,
                statement: "PPC tests and localized social marketing will accelerate Demand Interest indicators upwards.",
                confidence: 0.80,
                predictedAt: now,
                expectedBy: expectedTimeline,
                status: "PENDING",
                basedOnDecision: decision.id,
                targetBeliefId: "belief_trend_demand_interest"
            });
        } else if (decision.action === "RESEARCH_MORE") {
            // Supply-chain research expects to optimize supplier/transit overheads
            predictions.push({
                id: `pred_transit_dec_${Math.random().toString(36).substring(2, 9)}`,
                statement: "Sourcing verification and route auditing will reduce typical Transit Times below current margins.",
                confidence: 0.75,
                predictedAt: now,
                expectedBy: expectedTimeline,
                status: "PENDING",
                basedOnDecision: decision.id,
                targetBeliefId: "belief_trend_transit_time_days"
            });
        }

        return predictions;
    }
}
