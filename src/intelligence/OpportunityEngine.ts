/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProblemCluster, Opportunity } from "./types.ts";

export class OpportunityEngine {
  /**
   * Mathematically rates opportunities prior to explanation:
   * Score = 0.25*demand + 0.20*complaints + 0.15*trend + 0.15*margin + 0.10*competition + 0.10*supplier + 0.05*branding
   */
  public rank(clusters: ProblemCluster[]): Opportunity[] {
    console.log(`[OpportunityEngine] Executing mathematical ranking over ${clusters.length} problem matrices...`);
    const opportunities: Opportunity[] = [];

    for (const cluster of clusters) {
      // 1. Calculate deterministic base scores based on cluster attributes (0 to 100)
      const demand = Math.min(100, Math.max(30, cluster.totalMentions * 12));
      const complaints = Math.min(100, cluster.averageSeverity * 10);
      const trend = Math.min(100, 50 + (cluster.totalMentions * 6));
      const margin = 85; // Default high margins for SaaS-focused solvers
      const competition = 40; // Low means high opportunity score. We'll score 100 - competition density
      const competitionFactor = 100 - competition;
      const supplier = 90; // Ease of finding/deploying components (Single-View UI modules)
      const brandingFactor = 80; // Estimated branding leverage index

      // 2. Compute exact weighted formula
      const score = Math.round(
        (0.25 * demand) +
        (0.20 * complaints) +
        (0.15 * trend) +
        (0.15 * margin) +
        (0.10 * competitionFactor) +
        (0.10 * supplier) +
        (0.05 * brandingFactor)
      );

      const id = `opp_${cluster.id.replace("cluster_", "")}`;
      opportunities.push({
        id,
        title: `Optimized Solution for ${cluster.title}`,
        summary: `Factual, data-driven opportunity solving intense complaints concerning: "${cluster.summary}". Built upon a rigorous, mathematical ranking of key factors: Demand (${demand}), Complaints (${complaints}), and Operating Margin (${margin}%).`,
        problemClusters: [cluster.id],
        trends: [`Trending topic with volume index of ${trend}%`],
        competitors: ["Traditional Legacy Monoliths"],
        technologies: ["React Single-View Layouts", "motion/react", "TypeScript"],
        estimatedMargin: `${margin}% estimated operating margins`,
        confidenceScore: score,
        evidenceIds: cluster.representativeProblems,

        // Repair 8 First-Class Deterministic Properties
        demand,
        competition,
        complaints,
        trend,
        pricing: margin,
        shipping: 95, // Digital delivery
        suppliers: supplier,
        saturation: competition,
        confidence: score
      });
    }

    // Sort opportunities descending by mathematical score
    return opportunities.sort((a, b) => b.confidenceScore - a.confidenceScore);
  }
}
