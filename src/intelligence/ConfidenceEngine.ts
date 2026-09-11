/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Evidence } from "./types.ts";

export interface ConfidenceFactors {
  sourceAuthority: number;      // 0.0 to 1.0 (formerly sourceConfidence)
  sourceAgreement: number;      // 0.0 to 1.0 (formerly agreementBetweenSources)
  freshness: number;            // 0.0 to 1.0
  extractorConfidence: number;  // 0.0 to 1.0 (formerly llmConfidence)
  validatorConfidence: number;  // 0.0 to 1.0
}

export class ConfidenceEngine {
  /**
   * Calculates overall confidence score from 0 to 100 based on the mathematical formula:
   * confidence = sourceAuthority * sourceAgreement * freshness * extractorConfidence * validatorConfidence
   */
  public calculateOverallConfidence(factors: Partial<ConfidenceFactors>): number {
    const sourceAuthority = factors.sourceAuthority ?? 0.85;
    const sourceAgreement = factors.sourceAgreement ?? 0.85;
    const freshness = factors.freshness ?? 0.90;
    const extractorConfidence = factors.extractorConfidence ?? 0.90;
    const validatorConfidence = factors.validatorConfidence ?? 0.92;

    const rawMultiplier = 
      sourceAuthority * 
      sourceAgreement * 
      freshness * 
      extractorConfidence * 
      validatorConfidence;
      
    return Math.round(rawMultiplier * 100);
  }

  /**
   * Computes freshness score based on age of document.
   */
  public calculateFreshness(timestampStr: string): number {
    const created = new Date(timestampStr).getTime();
    const now = Date.now();
    const diffDays = (now - created) / (1000 * 60 * 60 * 24);
    
    // Decay freshness linearly over 60 days down to a 0.4 floor
    const freshness = Math.max(0.4, 1.0 - (diffDays / 60));
    return parseFloat(freshness.toFixed(3));
  }

  /**
   * Recalculates confidence whenever new evidence arrives.
   */
  public recalculateWithEvidence(evidenceList: Evidence[]): number {
    if (evidenceList.length === 0) return 30; // base floor with zero evidence

    let totalAuthority = 0;
    let avgExtractorConf = 0;

    for (const ev of evidenceList) {
      // Determine authority from source URL/Trust
      const srcLower = ev.source.toLowerCase();
      let auth = 0.70;
      if (srcLower.includes("official") || srcLower.includes("github.com") || srcLower.includes("w3.org")) {
        auth = 0.98;
      } else if (srcLower.includes("shopify") || srcLower.includes("stripe")) {
        auth = 0.92;
      } else if (srcLower.includes("blog") || srcLower.includes("news")) {
        auth = 0.80;
      }
      totalAuthority += auth;
      avgExtractorConf += (ev.confidence / 100);
    }

    const sourceAuthority = totalAuthority / evidenceList.length;
    const extractorConfidence = avgExtractorConf / evidenceList.length;

    // Agreement scales with density of evidence records
    const agreementFactor = Math.min(1.0, 0.70 + (evidenceList.length * 0.08));

    // Freshness is derived from the latest evidence point
    const latestDate = Math.max(...evidenceList.map(e => new Date(e.extractedAt).getTime()));
    const freshness = this.calculateFreshness(new Date(latestDate).toISOString());

    const finalScore = this.calculateOverallConfidence({
      sourceAuthority,
      sourceAgreement: agreementFactor,
      freshness,
      extractorConfidence,
      validatorConfidence: 0.95
    });

    console.log(`[ConfidenceEngine] Recalculated dynamic confidence across ${evidenceList.length} evidence nodes -> ${finalScore}%`);
    return finalScore;
  }
}
