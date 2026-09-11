/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StrategyCandidate {
  id: string;
  name: string;
  score: number;       // overall score 0 to 100
  quality: number;     // 0 to 100
  duration: number;    // hours
  cost: number;        // USD
  risk: number;        // 0 to 100
  marginEstimate: number; // 0 to 100
  timeToMarketDays: number;
  reusableComponents: string[];
}

export class StrategyEvaluator {
  static evaluate(candidates: StrategyCandidate[]): StrategyCandidate {
    // Score based on maximizing quality and margin while minimizing cost, risk, and duration
    let bestCandidate = candidates[0];
    let topScore = -1;

    for (const c of candidates) {
      const compositeScore = (c.quality * 0.3) + (c.marginEstimate * 0.3) - (c.risk * 0.2) - ((c.cost / 1000) * 0.1) - ((c.duration / 24) * 0.1);
      if (compositeScore > topScore) {
        topScore = compositeScore;
        bestCandidate = c;
      }
    }

    return bestCandidate;
  }
}
