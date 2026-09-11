/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ResolvableEntity {
  name: string;
  domain?: string;
  logo?: string;
  metadata?: Record<string, any>;
}

export class EntityResolver {
  /**
   * Normalizes and cleans brands into canonical strings (e.g., "Open AI" -> "OpenAI").
   */
  public resolveName(name: string): string {
    if (!name) return "";
    
    let normalized = name.trim();
    const lower = normalized.toLowerCase();
    
    if (lower === "openai" || lower === "open ai" || lower === "open-ai") {
      return "OpenAI";
    }
    if (lower === "shopify" || lower === "shopify inc" || lower === "shopify.com") {
      return "Shopify";
    }
    if (lower === "github" || lower === "git hub" || lower === "github inc") {
      return "GitHub";
    }
    if (lower === "framer motion" || lower === "framermotion" || lower === "framer-motion") {
      return "Framer Motion";
    }
    if (lower === "stripe" || lower === "stripe inc" || lower === "stripe.com") {
      return "Stripe";
    }
    if (lower === "whisper" || lower === "whisper live" || lower === "openai whisper") {
      return "Whisper API";
    }

    normalized = normalized
      .replace(/\s+(inc|llc|co|ltd|corp|corporation|gmbh|systems|software|platform|labs|solutions)\.?$/gi, "")
      .trim();

    return normalized
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /**
   * Calculates similarity between two records based on a multi-factor weighted scoring formula:
   * Score = Domain*0.35 + TrigramOverlap*0.30 + NameLevenshtein*0.20 + LogoMatch*0.10 + Metadata*0.05
   */
  public calculateRecordSimilarity(a: ResolvableEntity, b: ResolvableEntity): number {
    // 1. Domain Similarity (Weight: 0.35)
    let domainSim = 0;
    if (a.domain && b.domain) {
      const cleanDomA = a.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "");
      const cleanDomB = b.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "");
      domainSim = cleanDomA === cleanDomB ? 1.0 : (cleanDomA.includes(cleanDomB) || cleanDomB.includes(cleanDomA) ? 0.7 : 0);
    }

    // 2. Embedding Trigram Similarity (Weight: 0.30)
    const trigramSim = this.computeTrigramSimilarity(a.name, b.name);

    // 3. Name Levenshtein Similarity (Weight: 0.20)
    const normA = a.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normB = b.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    let nameSim = 0;
    if (normA && normB) {
      const distance = this.levenshteinDistance(normA, normB);
      const maxLength = Math.max(normA.length, normB.length);
      nameSim = maxLength > 0 ? (maxLength - distance) / maxLength : 1.0;
    }

    // 4. Logo Similarity (Weight: 0.10)
    let logoSim = 0;
    if (a.logo && b.logo) {
      logoSim = a.logo.toLowerCase().trim() === b.logo.toLowerCase().trim() ? 1.0 : 0;
    }

    // 5. Metadata Similarity (Weight: 0.05)
    let metadataSim = 0;
    const keysA = Object.keys(a.metadata || {});
    const keysB = Object.keys(b.metadata || {});
    if (keysA.length > 0 && keysB.length > 0) {
      let matchedKeys = 0;
      for (const k of keysA) {
        if (keysB.includes(k) && a.metadata?.[k] === b.metadata?.[k]) {
          matchedKeys++;
        }
      }
      metadataSim = matchedKeys / Math.max(keysA.length, keysB.length);
    }

    const totalScore = (domainSim * 0.35) + (trigramSim * 0.30) + (nameSim * 0.20) + (logoSim * 0.10) + (metadataSim * 0.05);
    console.log(`[EntityResolver] Comparing "${a.name}" & "${b.name}" -> Multi-factor Score: ${totalScore.toFixed(4)}`);
    return totalScore;
  }

  public calculateSimilarity(a: string, b: string): number {
    return this.calculateRecordSimilarity({ name: a }, { name: b });
  }

  private computeTrigramSimilarity(s1: string, s2: string): number {
    const t1 = this.getTrigrams(s1.toLowerCase());
    const t2 = this.getTrigrams(s2.toLowerCase());
    if (t1.size === 0 || t2.size === 0) return 0;

    let intersection = 0;
    for (const tri of t1) {
      if (t2.has(tri)) intersection++;
    }

    return (2.0 * intersection) / (t1.size + t2.size);
  }

  private getTrigrams(str: string): Set<string> {
    const trigrams = new Set<string>();
    for (let i = 0; i < str.length - 2; i++) {
      trigrams.add(str.substring(i, i + 3));
    }
    return trigrams;
  }

  private levenshteinDistance(s1: string, s2: string): number {
    const m = s1.length;
    const n = s2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + 1);
        }
      }
    }
    
    return dp[m][n];
  }
}
