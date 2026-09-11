import { Inference } from "../../reasoning/Inference.ts";
import { Decision } from "../Decision.ts";
import { DecisionPolicy } from "../DecisionPolicy.ts";

export class NeedMoreResearchPolicy implements DecisionPolicy {
    name = "NeedMoreResearchPolicy";

    evaluate(inferences: Inference[]): Decision | null {
        // Look for any moderate confidence inference (between 0.45 and 0.80)
        const moderateInference = inferences.find(inf => inf.confidence >= 0.45 && inf.confidence < 0.80);

        if (!moderateInference) {
            return null;
        }

        const triggeredInferences = inferences.filter(inf => inf.confidence >= 0.45);

        return {
            id: `dec_need_res_${Math.random().toString(36).substring(2, 9)}`,
            action: "RESEARCH_MORE",
            status: "PENDING",
            confidence: moderateInference.confidence,
            summary: "Moderate-confidence signals detected. Additional competitive or sourcing intelligence is required.",
            reasoning: [
                moderateInference.explanation,
                ...triggeredInferences.filter(i => i.id !== moderateInference.id).map(i => i.explanation)
            ],
            evidenceIds: Array.from(new Set(triggeredInferences.flatMap(i => i.causedBy))),
            createdAt: new Date()
        };
    }
}
