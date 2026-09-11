import { Belief } from "../../beliefs/Belief.ts";
import { CausalLink } from "../CausalLink.ts";
import { Inference } from "../Inference.ts";
import { ReasoningRule } from "../ReasoningRule.ts";

export class MarketRule implements ReasoningRule {
    name = "MarketMarginPressures";

    applies(beliefs: Belief[]): boolean {
        return beliefs.some(b => 
            b.statement.toLowerCase().includes("advertising") || 
            b.statement.toLowerCase().includes("cost") ||
            b.statement.toLowerCase().includes("margin") ||
            b.statement.toLowerCase().includes("delivery")
        );
    }

    infer(beliefs: Belief[]): { links: CausalLink[]; inferences: Inference[] } {
        const adBelief = beliefs.find(b => 
            b.statement.toLowerCase().includes("advertising") || 
            b.statement.toLowerCase().includes("cost")
        );
        const sourceId = adBelief ? adBelief.id : "belief_ad_cost_increasing";
        const sourceStatement = adBelief ? adBelief.statement : "Advertising Cost Increasing";

        const links: CausalLink[] = [
            {
                id: `lnk_ad_margin_${Math.random().toString(36).substring(2, 9)}`,
                sourceBelief: sourceStatement,
                targetBelief: "Profit Margin Decreasing",
                relationship: "decreases",
                confidence: 0.79,
                explanation: "Rising customer acquisition expenditures directly deduct from the net profit margin per unit sold unless offset by price increases."
            }
        ];

        const inferences: Inference[] = [
            {
                id: `inf_margin_erosion_${Math.random().toString(36).substring(2, 9)}`,
                statement: "Sustained net unit margins will experience compression unless pricing power is activated.",
                confidence: 0.76,
                causedBy: [sourceId],
                explanation: "Unmitigated increase in traffic acquisition costs narrows the profit-after-advertising buffer, making premium branding mandatory.",
                lastUpdated: new Date()
            }
        ];

        return { links, inferences };
    }
}
