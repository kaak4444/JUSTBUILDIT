import { Inference } from "../../reasoning/Inference.ts";
import { Decision } from "../Decision.ts";
import { DecisionPolicy } from "../DecisionPolicy.ts";

export class HighOpportunityPolicy implements DecisionPolicy {
    name = "HighOpportunityPolicy";

    evaluate(inferences: Inference[]): Decision | null {
        // Look for any high confidence inference (> 0.80)
        const highConfInference = inferences.find(inf => inf.confidence >= 0.80);
        
        if (!highConfInference) {
            return null;
        }

        const supportingInferences = inferences.filter(inf => inf.confidence >= 0.70);

        return {
            id: `dec_high_opp_${Math.random().toString(36).substring(2, 9)}`,
            action: "BUY",
            status: "PENDING",
            confidence: highConfInference.confidence,
            summary: `Acquisition Signal: High-confidence demand velocity indicates an immediate inventory buy window.`,
            reasoning: [
                highConfInference.explanation,
                ...supportingInferences.filter(i => i.id !== highConfInference.id).map(i => i.explanation)
            ],
            evidenceIds: Array.from(new Set(supportingInferences.flatMap(i => i.causedBy))),
            createdAt: new Date()
        };
    }
}
