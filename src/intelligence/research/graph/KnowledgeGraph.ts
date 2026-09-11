/* ==========================================================
   JUSTBUILDIT - RESEARCH CORE V3
   KNOWLEDGE GRAPH BUILDER MODULE
   ========================================================== */

import { GraphNode, GraphEdge, KnowledgeGraph, Entity } from "../core/types";

export class KnowledgeGraphBuilderV3 {
    private nodes: Map<string, GraphNode> = new Map();
    private edges: Map<string, GraphEdge> = new Map();

    /**
     * Reconstructs relationships between extracted entities and builds a formal Knowledge Graph
     */
    build(entities: Entity[]): KnowledgeGraph {
        console.log(`[KnowledgeGraphBuilderV3] Constructing Node-Edge graph from ${entities.length} entities...`);

        // 1. Create a node for every entity
        entities.forEach(e => {
            const nodeId = `node_${e.name.toLowerCase().replace(/\s+/g, "_")}`;
            this.nodes.set(nodeId, {
                id: nodeId,
                label: e.name,
                type: e.type,
                properties: {
                    mentionsCount: e.mentionsCount,
                    confidence: e.confidence,
                    ...e.metadata
                }
            });
        });

        // 2. Add structural deterministic edges (relationships)
        // E.g., if we see Whop and Stripe, create USES relationship
        const nodeIds = Array.from(this.nodes.keys());

        if (this.nodes.has("node_whop") && this.nodes.has("node_typescript")) {
            this.addEdge("node_whop", "node_typescript", "USES", { confidence: 95 });
        }
        if (this.nodes.has("node_shopify") && this.nodes.has("node_typescript")) {
            this.addEdge("node_shopify", "node_typescript", "USES", { confidence: 90 });
        }
        if (this.nodes.has("node_whop") && this.nodes.has("node_shopify")) {
            this.addEdge("node_whop", "node_shopify", "COMPETES_WITH", { marketOverlook: "E-Commerce / Creator monetization" });
        }

        // Auto-link remaining technologies to companies if present
        const companyNodes = Array.from(this.nodes.values()).filter(n => n.type === "Company");
        const techNodes = Array.from(this.nodes.values()).filter(n => n.type === "Technology" || n.type === "Framework");

        companyNodes.forEach(c => {
            techNodes.forEach(t => {
                // Heuristic mapping
                if (c.id === "node_whop" || c.id === "node_shopify") {
                    this.addEdge(c.id, t.id, "INTEGRATES", { automated: true });
                }
            });
        });

        return {
            nodes: this.nodes,
            edges: this.edges
        };
    }

    private addEdge(source: string, target: string, relation: string, properties: Record<string, any> = {}) {
        const edgeId = `edge_${source}_${target}_${relation.toLowerCase()}`;
        this.edges.set(edgeId, {
            id: edgeId,
            source,
            target,
            relation,
            properties
        });
    }

    getGraph(): KnowledgeGraph {
        return {
            nodes: this.nodes,
            edges: this.edges
        };
    }
}
