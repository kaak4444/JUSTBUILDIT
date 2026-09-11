import { Inference } from "../reasoning/Inference.ts";
import { Decision } from "./Decision.ts";
import { DecisionPolicy } from "./DecisionPolicy.ts";
import { DecisionHistory } from "./DecisionHistory.ts";
import { HighOpportunityPolicy } from "./policies/HighOpportunityPolicy.ts";
import { NeedMoreResearchPolicy } from "./policies/NeedMoreResearchPolicy.ts";
import { WeakEvidencePolicy } from "./policies/WeakEvidencePolicy.ts";

export class DecisionEngine {
    private static instance: DecisionEngine | null = null;

    public static getInstance(): DecisionEngine {
        if (!this.instance) {
            this.instance = new DecisionEngine();
        }
        return this.instance;
    }

    private policies: DecisionPolicy[] = [
        new HighOpportunityPolicy(),
        new NeedMoreResearchPolicy(),
        new WeakEvidencePolicy()
    ];

    private constructor() {}

    public evaluate(inferences: Inference[], recordHistory = true): Decision {
        for (const policy of this.policies) {
            const decision = policy.evaluate(inferences);
            if (decision) {
                // Record in history if requested
                if (recordHistory) {
                    DecisionHistory.getInstance().add(decision);
                }
                return decision;
            }
        }

        // Catch-all fallback
        const fallback: Decision = {
            id: `dec_fallback_${Math.random().toString(36).substring(2, 9)}`,
            action: "WAIT",
            status: "PENDING",
            confidence: 0.5,
            summary: "Ambiguous signals present. Holding on execution until higher-density logs compile.",
            reasoning: ["No active policy matches current cognitive inference states."],
            evidenceIds: [],
            createdAt: new Date()
        };
        if (recordHistory) {
            DecisionHistory.getInstance().add(fallback);
        }
        return fallback;
    }
}
