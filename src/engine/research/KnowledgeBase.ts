/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface KnowledgeNode {
  id: string;
  topic: string;
  category: "lesson" | "review_insight" | "trend" | "strategy";
  title: string;
  summary: string;
  score: number;
  tags: string[];
  vector?: number[]; // simulated or generated concept weights
}

export class ResearchGapDetector {
  /**
   * Scans a research report or collection of evidence to detect missing vital dimensions.
   */
  detect(report: Record<string, any>): string[] {
    const gaps: string[] = [];

    // Check Audience coverage
    const hasAudience = !!(
      report.audience || 
      report.targetAudience || 
      report.demographics || 
      report.users
    );
    if (!hasAudience) {
      gaps.push("audience");
    }

    // Check Pricing and Monetization coverage
    const hasPricing = !!(
      report.pricing || 
      report.price_points || 
      report.monetization || 
      report.cost_structure
    );
    if (!hasPricing) {
      gaps.push("pricing");
    }

    // Check Trend or demand coverage
    const hasTrends = !!(
      report.trends || 
      report.demand || 
      report.volume || 
      report.growth_rate
    );
    if (!hasTrends) {
      gaps.push("trend");
    }

    // Check Competitor coverage
    const hasCompetitors = !!(
      report.competition || 
      report.competitors || 
      report.marketShare || 
      report.alternatives
    );
    if (!hasCompetitors) {
      gaps.push("competition");
    }

    return gaps;
  }
}

export class SemanticConceptStore {
  private nodes: KnowledgeNode[] = [];
  // Standard vocabulary dictionary for lightweight vector projection
  private vocab: string[] = [
    "minimal", "logo", "branding", "nordic", "flat", "saas", "modern", 
    "design", "clean", "aesthetic", "retro", "brutalist", "typography", 
    "creative", "planner", "journal", "productivity", "notion", "printable",
    "course", "membership", "community", "subscription", "marketing", "funnel"
  ];

  constructor() {
    this.prepopulateNodes();
  }

  private prepopulateNodes() {
    const defaultNodes: Omit<KnowledgeNode, "vector">[] = [
      {
        id: "kn_minimal_logo",
        topic: "design_aesthetics",
        category: "strategy",
        title: "Minimalist Logo Design",
        summary: "Clean geometric flat branding guidelines popular in modern Nordic design and SaaS startups.",
        score: 0.95,
        tags: ["minimal", "logo", "branding", "flat", "nordic", "saas"]
      },
      {
        id: "kn_notion_productivity",
        topic: "productivity_tools",
        category: "lesson",
        title: "Notion Planner Systems",
        summary: "Digital organization templates and planners with modular tracking blocks for high-retention memberships.",
        score: 0.92,
        tags: ["notion", "planner", "productivity", "clean", "aesthetic", "subscription"]
      },
      {
        id: "kn_retro_marketing",
        topic: "marketing_funnels",
        category: "trend",
        title: "Retro Brutalist Aesthetics",
        summary: "High-contrast bold retro neon typography and layout treatments popular with Gen-Z communities.",
        score: 0.88,
        tags: ["retro", "brutalist", "typography", "creative", "marketing"]
      }
    ];

    defaultNodes.forEach(n => {
      this.nodes.push({
        ...n,
        vector: this.projectToVector(n.title + " " + n.summary + " " + n.tags.join(" "))
      });
    });
  }

  /**
   * Helper to project a textual string into a normalized TF-IDF style token-frequency vector
   */
  private projectToVector(text: string): number[] {
    const normalized = text.toLowerCase();
    const vec = this.vocab.map(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = normalized.match(regex);
      return matches ? matches.length : 0;
    });

    // Normalize vector (length = 1) for easy Cosine Similarity calculation
    const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
    if (magnitude === 0) return vec.map(() => 0);
    return vec.map(val => Number((val / magnitude).toFixed(4)));
  }

  /**
   * Computes mathematical Cosine Similarity between two normalized vectors:
   * dot_product(A, B) / (norm(A) * norm(B))
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
    }
    return dotProduct;
  }

  /**
   * Performs semantic query lookup using TF-IDF projection & Cosine Similarity vector matching
   */
  search(query: string, threshold = 0.15): KnowledgeNode[] {
    const queryVec = this.projectToVector(query);
    
    const scored = this.nodes.map(node => {
      const similarity = node.vector ? this.cosineSimilarity(queryVec, node.vector) : 0;
      return {
        ...node,
        similarity
      };
    });

    // Sort by descending similarity and filter by minimum threshold
    return scored
      .filter(s => s.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .map(({ similarity, ...node }) => node);
  }

  /**
   * Adds a new node to the Knowledge Base, building its vector representation automatically
   */
  addNode(node: Omit<KnowledgeNode, "vector">) {
    const vector = this.projectToVector(node.title + " " + node.summary + " " + node.tags.join(" "));
    this.nodes.push({
      ...node,
      vector
    });
  }

  listNodes(): KnowledgeNode[] {
    return this.nodes;
  }
}
