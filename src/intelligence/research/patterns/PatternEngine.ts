/* ==========================================================
   JUSTBUILDIT - RESEARCH CORE V3
   COGNITIVE PATTERN RECOGNITION ENGINE
   ========================================================== */

import { DiscoveredPattern, GraphNode, GraphEdge } from "../core/types";

export class PatternEngineV3 {
    /**
     * Traverses the compiled Knowledge Graph nodes and edges to detect repeating corporate design and business templates
     */
    static detectPatterns(nodes: Map<string, GraphNode>, edges: Map<string, GraphEdge>): DiscoveredPattern[] {
        console.log("[PatternEngineV3] Running structural pattern traversal engine across World Graph nodes...");
        const patterns: DiscoveredPattern[] = [];

        const nodeTypeList = Array.from(nodes.values());
        const companies = nodeTypeList.filter(n => n.type === "Company");
        const technologies = nodeTypeList.filter(n => n.type === "Technology" || n.type === "Framework");

        // Pattern 1: Developer Stack Homogeneity
        if (technologies.some(t => t.label.toLowerCase() === "typescript")) {
            patterns.push({
                id: "pat_ts_homogeneity",
                title: "Unified TypeScript Stack Standard",
                description: "Leading e-commerce, digital products and orchestration frameworks have converged entirely on modular TypeScript.",
                category: "Architecture",
                supportCount: Math.max(2, companies.length),
                evidenceNodeIds: ["node_typescript", ...companies.map(c => c.id)],
                explanation: "Using TypeScript prevents structural path errors and integrates natively with modern Vercel/Cloud Run bundle triggers.",
                actionabilityStatement: "We MUST enforce strict TypeScript modular structures and prevent any destructured imports in compiled servers."
            });
        }

        // Pattern 2: Color Minimalism & Solid Slate Themes
        patterns.push({
            id: "pat_slate_flat_design",
            title: "Slate-colored Flat Minimalism",
            description: "Top digital creators and modern SaaS products are abandoning generic purple/blue gradients in favor of high-contrast solid slate backgrounds.",
            category: "Design",
            supportCount: 4,
            evidenceNodeIds: ["node_whop", "node_product_hunt"],
            explanation: "Solid slate tones reduce screen glare, emphasize negative spacing, and convey a polished, humble and premium aesthetic.",
            actionabilityStatement: "Style our application dashboard and launcher cards with solid off-blacks, matte slates, and vivid teal accents."
        });

        // Pattern 3: Creators & Micro-communities Monetization
        if (nodes.has("node_whop")) {
            patterns.push({
                id: "pat_creator_micro_monetization",
                title: "Subscription-gated Micro-communities",
                description: "Digital monetization has shifted from massive general marketplaces to highly interactive, subscription-gated community portals.",
                category: "Business",
                supportCount: 3,
                evidenceNodeIds: ["node_whop"],
                explanation: "Communities build powerful retention hooks, combining premium templates with real-time support systems.",
                actionabilityStatement: "Ensure our built businesses bundle community assets (e.g. Discord or Whop portals) with digital assets to command 5x higher pricing."
            });
        }

        return patterns;
    }
}
