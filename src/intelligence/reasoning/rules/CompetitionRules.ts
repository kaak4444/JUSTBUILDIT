import { Belief } from "../../beliefs/Belief.ts";
import { CausalLink } from "../CausalLink.ts";
import { Inference } from "../Inference.ts";
import { ReasoningRule } from "../ReasoningRule.ts";

export class CompetitionRule implements ReasoningRule {
    name = "CompetitionIncrease";

    applies(beliefs: Belief[]): boolean {
        // Can apply if there is an active belief about competition or if we have high-density market activity
        return beliefs.some(b => 
            b.statement.toLowerCase().includes("competitor") || 
            b.statement.toLowerCase().includes("competition") ||
            b.statement.toLowerCase().includes("market entry")
        );
    }

    infer(beliefs: Belief[]): { links: CausalLink[]; inferences: Inference[] } {
        const compBelief = beliefs.find(b => 
            b.statement.toLowerCase().includes("competitor") || 
            b.statement.toLowerCase().includes("competition")
        );
        const sourceId = compBelief ? compBelief.id : "belief_competition_increasing";
        const sourceStatement = compBelief ? compBelief.statement : "Competition Increasing";

        const links: CausalLink[] = [
            {
                id: `lnk_comp_ad_${Math.random().toString(36).substring(2, 9)}`,
                sourceBelief: sourceStatement,
                targetBelief: "Advertising Cost Increasing",
                relationship: "increases",
                confidence: 0.88,
                explanation: "More active advertisers bid on the same keywords and audience segments, driving advertising CPMs and CPCs upward."
            }
        ];

        const inferences: Inference[] = [
            {
                id: `inf_cac_spike_${Math.random().toString(36).substring(2, 9)}`,
                statement: "Customer acquisition cost (CAC) will rise, squeezing ad-spend profitability.",
                confidence: 0.85,
                causedBy: [sourceId],
                explanation: "Intense ad bidding and overlapping audience targets inevitably lead to budget dilution and reduced ROAS.",
                lastUpdated: new Date()
            }
        ];

        return { links, inferences };
    }
}
