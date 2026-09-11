/* ==========================================================
   JUSTBUILDIT - RESEARCH CORE V3
   FACT VERIFICATION ENGINE
   ========================================================== */

import { Claim, VerifiedFact } from "../core/types";

export class FactVerifierV3 {
    /**
     * Group claims asserting similar things and perform multi-source consensus cross-reference verification.
     */
    static verifyClaims(claims: Claim[]): VerifiedFact[] {
        console.log(`[FactVerifierV3] Running multi-source consensus validation on ${claims.length} claims...`);
        const verifiedFacts: VerifiedFact[] = [];
        
        // Group similar claims together based on claim type and keywords
        const groups: Record<string, Claim[]> = {};
        
        claims.forEach(c => {
            const key = `${c.type}_${this.discretizeStatement(c.statement)}`;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(c);
        });

        Object.entries(groups).forEach(([key, groupedClaims], idx) => {
            const supportingIds = groupedClaims.map(c => c.id);
            const primaryClaim = groupedClaims[0];

            // Filter out contradicting claims
            // For example, if we have different pricing values asserted, they represent contradictions
            const contradictingIds: string[] = [];
            const values = groupedClaims.map(c => String(c.value));
            const uniqueValues = Array.from(new Set(values));

            // Compute basic consensus confidence score
            // Base score depends on the number of supportive sources
            const uniqueSourcesCount = new Set(groupedClaims.map(c => c.sourceName)).size;
            let consensusScore = 0.5; // starting baseline

            if (uniqueSourcesCount > 1) {
                consensusScore += 0.15 * (uniqueSourcesCount - 1);
            }

            // Check if there are contradicting values in this group
            if (uniqueValues.length > 1) {
                // There is friction!
                consensusScore -= 0.25;
                // Gather contradicting claims
                groupedClaims.forEach(c => {
                    if (String(c.value) !== String(primaryClaim.value)) {
                        contradictingIds.push(c.id);
                    }
                });
            }

            // Clamp confidence score between 0 and 100%
            const finalConfidence = Math.min(100, Math.max(0, Math.round(consensusScore * 100)));
            let status: "verified" | "disputed" | "unverified" = "unverified";

            if (finalConfidence >= 75) {
                status = "verified";
            } else if (contradictingIds.length > 0) {
                status = "disputed";
            }

            verifiedFacts.push({
                id: `fact_${Date.now()}_${idx}`,
                claimStatement: primaryClaim.statement,
                type: primaryClaim.type,
                consensusValue: primaryClaim.value,
                unit: primaryClaim.unit,
                supportingClaimIds: supportingIds,
                contradictingClaimIds: contradictingIds,
                confidenceScore: finalConfidence,
                status,
                lastVerifiedAt: new Date().toISOString()
            });
        });

        console.log(`[FactVerifierV3] Resolved claims into ${verifiedFacts.length} consolidated consensus facts.`);
        return verifiedFacts;
    }

    private static discretizeStatement(stmt: string): string {
        const lower = stmt.toLowerCase();
        if (lower.includes("creator") || lower.includes("user")) return "users_count";
        if (lower.includes("price") || lower.includes("pricing") || lower.includes("plan")) return "pricing_model";
        if (lower.includes("gradient") || lower.includes("purple") || lower.includes("design")) return "design_styling";
        if (lower.includes("typescript") || lower.includes("import")) return "typescript_import";
        return "general_fact";
    }
}
