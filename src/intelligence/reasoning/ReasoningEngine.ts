import { Belief } from "../beliefs/Belief.ts";
import { CausalLink } from "./CausalLink.ts";
import { Inference } from "./Inference.ts";
import { ReasoningRule } from "./ReasoningRule.ts";
import { DemandIncreaseRule } from "./rules/DemandRules.ts";
import { CompetitionRule } from "./rules/CompetitionRules.ts";
import { MarketRule } from "./rules/MarketRules.ts";

export class ReasoningEngine {
    private static instance: ReasoningEngine | null = null;

    public static getInstance(): ReasoningEngine {
        if (!this.instance) {
            this.instance = new ReasoningEngine();
        }
        return this.instance;
    }

    private rules: ReasoningRule[] = [
        new DemandIncreaseRule(),
        new CompetitionRule(),
        new MarketRule()
    ];

    private activeLinks: CausalLink[] = [];
    private activeInferences: Inference[] = [];

    public infer(beliefs: Belief[]): { links: CausalLink[]; inferences: Inference[] } {
        const links: CausalLink[] = [];
        const inferences: Inference[] = [];

        for (const rule of this.rules) {
            if (rule.applies(beliefs)) {
                const outcome = rule.infer(beliefs);
                links.push(...outcome.links);
                inferences.push(...outcome.inferences);
            }
        }

        this.activeLinks = links;
        this.activeInferences = inferences;

        return { links, inferences };
    }

    public getActiveLinks(): CausalLink[] {
        return this.activeLinks;
    }

    public getActiveInferences(): Inference[] {
        return this.activeInferences;
    }
}
