/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Claim {
  id: string;
  statement: string;
  sourceUrl: string;
  supports: string[]; // IDs of supported statements
  contradicts: string[]; // IDs of contradicted statements
  confidence: number;
}

export class ContradictionEngine {
  private claims: Map<string, Claim> = new Map();

  public registerClaim(claim: Claim): void {
    console.log(`[ContradictionEngine] Registering claim: "${claim.statement.substring(0, 60)}..."`);
    this.claims.set(claim.id, claim);
  }

  /**
   * Analyzes potential contradictions or overlaps between two claim statements.
   */
  public analyzeConflict(claimA: Claim, claimB: Claim): "SUPPORTIVE" | "CONTRADICTORY" | "NEUTRAL" {
    const textA = claimA.statement.toLowerCase();
    const textB = claimB.statement.toLowerCase();

    // Check if one claims "slow/bad/fail" while other claims "fast/good/excel" on the same topic
    const hasPerformanceTerm = textA.includes("performance") || textA.includes("speed") || textA.includes("loading");
    if (hasPerformanceTerm) {
      const aIsNegative = textA.includes("slow") || textA.includes("lag") || textA.includes("terrible");
      const bIsPositive = textB.includes("fast") || textB.includes("optimize") || textB.includes("excellent");
      if (aIsNegative && bIsPositive) {
        return "CONTRADICTORY";
      }
    }

    const hasPricingTerm = textA.includes("price") || textA.includes("cost") || textA.includes("expensive");
    if (hasPricingTerm) {
      const aIsExpensive = textA.includes("expensive") || textA.includes("high cost");
      const bIsCheap = textB.includes("free") || textB.includes("cheap") || textB.includes("affordable");
      if (aIsExpensive && bIsCheap) {
        return "CONTRADICTORY";
      }
    }

    return "NEUTRAL";
  }

  public getClaims(): Claim[] {
    return Array.from(this.claims.values());
  }
}
