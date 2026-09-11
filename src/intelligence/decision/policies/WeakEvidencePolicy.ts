import { Inference } from "../../reasoning/Inference.ts";
import { Decision } from "../Decision.ts";
import { DecisionPolicy } from "../DecisionPolicy.ts";

export class WeakEvidencePolicy implements DecisionPolicy {
    name = "WeakEvidencePolicy";

    evaluate(inferences: Inference[]): Decision | null {
        // If there are no inferences or all are below 0.45, recommend SKIP
        const isWeak = inferences.length === 0 || inferences.every(inf => inf.confidence < 0.45);

        if (!isWeak) {
            return null;
        }

        const avgConfidence = inferences.length > 0 
            ? inferences.reduce((acc, curr) => acc + curr.confidence, 0) / inferences.length 
            : 0.25;

        return {
            id: `dec_weak_ev_${Math.random().toString(36).substring(2, 9)}`,
            action: "SKIP",
            status: "PENDING",
            confidence: avgConfidence,
            summary: "Signals are extremely weak or absent. Highly recommend bypassing this opportunity to preserve capital.",
            reasoning: [
                "The total lack of strong high-demand or structural supply advantages renders this project high-risk.",
                "Market trends do not display sufficient MoM volume acceleration or margin buffer."
            ],
            evidenceIds: [],
            createdAt: new Date()
        };
    }
}
