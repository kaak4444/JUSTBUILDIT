import { ResearchProvider, ResearchQuery, ResearchKnowledge } from "./contracts";
import { ResearchPlanner, ResearchPlan } from "./planner";
import { Evidence, ReconstructedBusiness, ConsensusClaim } from "./types";
import { ReverseEngineeringEngine } from "./reverseEngineer";

export class ResearchEngine {
    private reEngine: ReverseEngineeringEngine;

    constructor(
        private providers: ResearchProvider[],
        private analyzer: any
    ) {
        this.reEngine = new ReverseEngineeringEngine();
    }

    async execute(query: ResearchQuery): Promise<{ 
        plan: ResearchPlan; 
        evidence: Evidence[]; 
        knowledge: ResearchKnowledge;
        reconstruction?: ReconstructedBusiness;
        verifiedClaims?: ConsensusClaim[];
    }> {
        console.log(`[ResearchEngine] Beginning execution for objective: "${query.objective}"`);

        // 1. Step 1: Create a research plan
        const planner = new ResearchPlanner();
        const plan = await planner.plan(query.objective);
        console.log(`[ResearchEngine] Generated Research Plan with ${plan.questions.length} questions and ${plan.suggestedCollectors.length} suggested collectors.`);

        // 2. Filter down to active, matching providers
        const activeProviders = this.providers.filter(p => {
            if (!p.enabled) return false;
            if (!p.supports(query)) return false;
            return true; 
        });

        console.log(`[ResearchEngine] Launching ${activeProviders.length} providers in parallel...`);

        // 3. Parallel collection (Step 2) with error isolating wrapper
        const evidencePromises = activeProviders.map(async (provider) => {
            try {
                const result = await provider.search(query);
                console.log(`[ResearchEngine] Provider [${provider.name}] collected ${result.length} evidence items.`);
                return result;
            } catch (err) {
                console.error(`[ResearchEngine] Provider [${provider.name}] failed:`, err);
                return [];
            }
        });

        const resultsArray = await Promise.all(evidencePromises);
        const evidence: Evidence[] = resultsArray.flat();

        console.log(`[ResearchEngine] Total raw evidence collected: ${evidence.length}. Commencing deep analyzer...`);

        // 4. Run Pattern, Feature, Complaint analysis (Step 7/8/9/10)
        const knowledge = await this.analyzer.analyze(evidence);

        // 5. Run Reverse Engineering and Claims Verification loops
        let reconstruction: ReconstructedBusiness | undefined;
        let verifiedClaims: ConsensusClaim[] | undefined;

        if (evidence.length > 0) {
            try {
                reconstruction = await this.reEngine.reconstruct(query.objective, evidence);
                verifiedClaims = this.reEngine.verifyClaims(evidence);
                console.log(`[ResearchEngine] Successfully completed business DNA reconstruction and verified ${verifiedClaims.length} multi-source consensus claims.`);
            } catch (reErr) {
                console.error("[ResearchEngine] Reverse engineering module threw exception:", reErr);
            }
        }

        console.log(`[ResearchEngine] Analysis completed! Discovered ${knowledge.opportunities.length} opportunities, ${knowledge.competitors.length} competitors, and ${knowledge.problems.length} core complaint clusters.`);

        return {
            plan,
            evidence,
            knowledge,
            reconstruction,
            verifiedClaims
        };
    }
}

