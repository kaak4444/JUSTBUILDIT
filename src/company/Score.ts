/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IOpportunityScore {
  profitability: number;  // 0 to 100
  difficulty: number;     // 0 to 100
  competition: number;    // 0 to 100 (lower means less competition)
  demand: number;         // 0 to 100
  originality: number;    // 0 to 100
  confidence: number;     // 0 to 100
}

export class OpportunityScorer {
  /**
   * Calculates a single cohesive score representing total viability
   */
  public static calculateViability(score: IOpportunityScore): number {
    // High profitability, high demand, high originality, and high confidence increase the score.
    // High difficulty and high competition decrease the score.
    const weightedSum =
      (score.profitability * 0.25) +
      (score.demand * 0.25) +
      ((100 - score.difficulty) * 0.15) +
      ((100 - score.competition) * 0.15) +
      (score.originality * 0.1) +
      (score.confidence * 0.1);

    return Math.round(weightedSum);
  }

  /**
   * Generates a structural breakdown description
   */
  public static getFeasibilityCategory(viabilityScore: number): "EXCELLENT" | "STRONG" | "MODERATE" | "HIGH_RISK" | "VIOLATED" {
    if (viabilityScore >= 85) return "EXCELLENT";
    if (viabilityScore >= 70) return "STRONG";
    if (viabilityScore >= 55) return "MODERATE";
    if (viabilityScore >= 40) return "HIGH_RISK";
    return "VIOLATED";
  }
}
