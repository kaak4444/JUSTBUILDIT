import { Belief } from "../../beliefs/Belief.ts";
import { CausalLink } from "../CausalLink.ts";
import { Inference } from "../Inference.ts";
import { ReasoningRule } from "../ReasoningRule.ts";

export class DemandIncreaseRule implements ReasoningRule {
    name = "DemandIncrease";

    applies(beliefs: Belief[]): boolean {
        return beliefs.some(b => 
            b.statement.toLowerCase().includes("demand") || 
            b.statement.toLowerCase().includes("accelerating") ||
            b.statement.toLowerCase().includes("increasing")
        );
    }

    infer(beliefs: Belief[]): { links: CausalLink[]; inferences: Inference[] } {
        const demandBelief = beliefs.find(b => 
            b.statement.toLowerCase().includes("demand") || 
            b.statement.toLowerCase().includes("accelerating") ||
            b.statement.toLowerCase().includes("increasing")
        );
        const sourceId = demandBelief ? demandBelief.id : "belief_demand_increasing";
        const sourceStatement = demandBelief ? demandBelief.statement : "Demand Increasing";

        const links: CausalLink[] = [
            {
                id: `lnk_demand_comp_${Math.random().toString(36).substring(2, 9)}`,
                sourceBelief: sourceStatement,
                targetBelief: "Competition Increasing",
                relationship: "causes",
                confidence: 0.82,
                explanation: "Growing customer demand and sales volume attract new market competitors seeking high-yield opportunities."
            }
        ];

        const inferences: Inference[] = [
            {
                id: `inf_market_entry_${Math.random().toString(36).substring(2, 9)}`,
                statement: "Market entry velocity and competitor influx will escalate over the next 45-60 days.",
                confidence: 0.82,
                causedBy: [sourceId],
                explanation: "High demand indicators act as strong signals to competitors, accelerating their listing launches and pricing trials.",
                lastUpdated: new Date()
            }
        ];

        return { links, inferences };
    }
}
