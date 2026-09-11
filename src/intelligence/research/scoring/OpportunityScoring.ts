/* ==========================================================
   JUSTBUILDIT - RESEARCH CORE V3
   DETERMINISTIC OPPORTUNITY SCORING ENGINE
   ========================================================== */

import { OpportunityScore } from "../core/types";

export class OpportunityScoringV3 {
    /**
     * Compute a comprehensive, explainable OpportunityScore based on multi-dimensional market characteristics
     */
    static calculateScore(params: {
        need: number;
        demand: number;
        competition: number; // 1-100 (high score means low competition)
        execution: number;
        margin: number;
        scalability: number;
        novelty: number;
        timing: number;
        audiencePain: number;
    }): OpportunityScore {
        // Enforce boundaries [1 - 100]
        const clamp = (val: number) => Math.min(100, Math.max(1, Math.round(val)));

        const need = clamp(params.need);
        const demand = clamp(params.demand);
        const competition = clamp(params.competition);
        const execution = clamp(params.execution);
        const margin = clamp(params.margin);
        const scalability = clamp(params.scalability);
        const novelty = clamp(params.novelty);
        const timing = clamp(params.timing);
        const audiencePain = clamp(params.audiencePain);

        // Weighted overall average calculation
        // High importance weights: need, demand, competition, audiencePain
        const weights = {
            need: 0.18,
            demand: 0.18,
            competition: 0.15,
            execution: 0.08,
            margin: 0.12,
            scalability: 0.08,
            novelty: 0.07,
            timing: 0.07,
            audiencePain: 0.07
        };

        const rawOverall = 
            (need * weights.need) +
            (demand * weights.demand) +
            (competition * weights.competition) +
            (execution * weights.execution) +
            (margin * weights.margin) +
            (scalability * weights.scalability) +
            (novelty * weights.novelty) +
            (timing * weights.timing) +
            (audiencePain * weights.audiencePain);

        const overall = Math.round(rawOverall);

        return {
            need,
            demand,
            competition,
            execution,
            margin,
            scalability,
            novelty,
            timing,
            audiencePain,
            overall
        };
    }
}
