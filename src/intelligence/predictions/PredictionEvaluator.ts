import { Belief } from "../beliefs/Belief.ts";
import { PredictionStore } from "./PredictionStore.ts";
import { DecisionHistory } from "../decision/DecisionHistory.ts";

export class PredictionEvaluator {
    private static instance: PredictionEvaluator | null = null;

    public static getInstance(): PredictionEvaluator {
        if (!this.instance) {
            this.instance = new PredictionEvaluator();
        }
        return this.instance;
    }

    private constructor() {}

    /**
     * Evaluates all PENDING predictions against active beliefs.
     * Updates prediction statuses and logs outcomes to the decision history.
     */
    public evaluate(activeBeliefs: Belief[]): void {
        const store = PredictionStore.getInstance();
        const pendingPredictions = store.getPending();

        for (const prediction of pendingPredictions) {
            if (!prediction.targetBeliefId) {
                continue;
            }

            const associatedBelief = activeBeliefs.find(b => b.id === prediction.targetBeliefId);
            if (!associatedBelief) {
                // Keep pending if target belief hasn't compiled yet
                continue;
            }

            const text = associatedBelief.statement.toLowerCase();
            let isCorrect = false;
            let evaluated = false;

            if (prediction.targetBeliefId === "belief_trend_competition_density") {
                // Expected increase
                isCorrect = text.includes("increasing") || text.includes("up by");
                evaluated = true;
            } else if (prediction.targetBeliefId === "belief_trend_profit_margin") {
                // Expected decrease
                isCorrect = text.includes("decreasing") || text.includes("down by");
                evaluated = true;
            } else if (prediction.targetBeliefId === "belief_trend_demand_interest") {
                // Expected increase
                isCorrect = text.includes("increasing") || text.includes("up by");
                evaluated = true;
            } else if (prediction.targetBeliefId === "belief_trend_transit_time_days") {
                // Expected decrease
                isCorrect = text.includes("decreasing") || text.includes("down by");
                evaluated = true;
            }

            if (evaluated) {
                prediction.status = isCorrect ? "CORRECT" : "INCORRECT";

                // Update associated decision details in history (Step 9)
                const decisionHistory = DecisionHistory.getInstance();
                const decision = decisionHistory.getAll().find(d => d.id === prediction.basedOnDecision);
                if (decision) {
                    const outcomeText = `[Prediction Verification] predicted: "${prediction.statement}" -> ${prediction.status}`;
                    if (!decision.reasoning.includes(outcomeText)) {
                        decision.reasoning.push(outcomeText);
                    }
                }
            }
        }
    }
}
