/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorldGraph, Company, Technology, Problem, ProblemCluster, Relationship } from "./types.ts";
import fs from "fs";
import path from "path";

export class WorldGraphBuilder {
  private dbPath = path.join(process.cwd(), "data", "db.json");

  /**
   * Loads the current graph from persistent storage or returns a pristine layout.
   */
  public async loadGraph(): Promise<WorldGraph> {
    let dbContent: any = {};
    if (fs.existsSync(this.dbPath)) {
      try {
        dbContent = JSON.parse(fs.readFileSync(this.dbPath, "utf-8"));
      } catch (err) {
        console.error("Failed to load DB for WorldGraph", err);
      }
    }

    const wg = dbContent.worldGraph || {};

    return {
      companies: new Map(Object.entries(wg.companies || {})),
      technologies: new Map(Object.entries(wg.technologies || {})),
      problems: new Map(Object.entries(wg.problems || {})),
      problemClusters: new Map(Object.entries(wg.problemClusters || {})),
      trends: new Map(Object.entries(wg.trends || {})),
      evidence: new Map(Object.entries(wg.evidence || {})),
      relationships: wg.relationships || [],
      opportunities: new Map(Object.entries(wg.opportunities || {})),

      // v2.0 Extended Nodes Maps
      products: new Map(Object.entries(wg.products || {})),
      repositories: new Map(Object.entries(wg.repositories || {})),
      packages: new Map(Object.entries(wg.packages || {})),
      videos: new Map(Object.entries(wg.videos || {})),
      tutorials: new Map(Object.entries(wg.tutorials || {})),
      designSystems: new Map(Object.entries(wg.designSystems || {})),
      communities: new Map(Object.entries(wg.communities || {})),
      courses: new Map(Object.entries(wg.courses || {})),
      books: new Map(Object.entries(wg.books || {})),
      patents: new Map(Object.entries(wg.patents || {})),
      laws: new Map(Object.entries(wg.laws || {})),
      countries: new Map(Object.entries(wg.countries || {})),
      people: new Map(Object.entries(wg.people || {})),
      authors: new Map(Object.entries(wg.authors || {})),
      standards: new Map(Object.entries(wg.standards || {})),
      frameworks: new Map(Object.entries(wg.frameworks || {})),
      libraries: new Map(Object.entries(wg.libraries || {})),
      marketplaces: new Map(Object.entries(wg.marketplaces || {})),
      pricingPlans: new Map(Object.entries(wg.pricingPlans || {})),
      subscriptions: new Map(Object.entries(wg.subscriptions || {})),
      features: new Map(Object.entries(wg.features || {})),
      reviews: new Map(Object.entries(wg.reviews || {}))
    };
  }

  /**
   * Persists the active in-memory Maps back to db.json.
   */
  public async saveGraph(graph: WorldGraph): Promise<void> {
    let dbContent: any = {};
    if (fs.existsSync(this.dbPath)) {
      try {
        dbContent = JSON.parse(fs.readFileSync(this.dbPath, "utf-8"));
      } catch (err) {
        console.error("Failed to read DB for graph saving", err);
      }
    }

    dbContent.worldGraph = {
      companies: Object.fromEntries(graph.companies),
      technologies: Object.fromEntries(graph.technologies),
      problems: Object.fromEntries(graph.problems),
      problemClusters: Object.fromEntries(graph.problemClusters),
      trends: Object.fromEntries(graph.trends),
      evidence: Object.fromEntries(graph.evidence),
      relationships: graph.relationships,
      opportunities: Object.fromEntries(graph.opportunities),

      // v2.0 Extended Nodes Maps
      products: Object.fromEntries(graph.products),
      repositories: Object.fromEntries(graph.repositories),
      packages: Object.fromEntries(graph.packages),
      videos: Object.fromEntries(graph.videos),
      tutorials: Object.fromEntries(graph.tutorials),
      designSystems: Object.fromEntries(graph.designSystems),
      communities: Object.fromEntries(graph.communities),
      courses: Object.fromEntries(graph.courses),
      books: Object.fromEntries(graph.books),
      patents: Object.fromEntries(graph.patents),
      laws: Object.fromEntries(graph.laws),
      countries: Object.fromEntries(graph.countries),
      people: Object.fromEntries(graph.people),
      authors: Object.fromEntries(graph.authors),
      standards: Object.fromEntries(graph.standards),
      frameworks: Object.fromEntries(graph.frameworks),
      libraries: Object.fromEntries(graph.libraries),
      marketplaces: Object.fromEntries(graph.marketplaces),
      pricingPlans: Object.fromEntries(graph.pricingPlans),
      subscriptions: Object.fromEntries(graph.subscriptions),
      features: Object.fromEntries(graph.features),
      reviews: Object.fromEntries(graph.reviews)
    };

    try {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.dbPath, JSON.stringify(dbContent, null, 2), "utf-8");
      console.log("[WorldGraphBuilder] Persistent graph memory updated successfully.");
    } catch (err) {
      console.error("Failed to save world graph to db.json", err);
    }
  }

  /**
   * Dynamically adds relationship edges to the global knowledge graph with rich edge metadata.
   */
  public addEdge(graph: WorldGraph, edge: Relationship): void {
    const existing = graph.relationships.find(
      r => r.from === edge.from && r.to === edge.to && r.relation === edge.relation
    );
    const nowIso = new Date().toISOString();
    if (existing) {
      // Merge metadata
      existing.lastVerified = nowIso;
      existing.confidence = Math.max(existing.confidence, edge.confidence);
      if (edge.evidence && edge.evidence.length > 0) {
        const mergedEv = new Set([...(existing.evidence || []), ...edge.evidence]);
        existing.evidence = Array.from(mergedEv);
      }
    } else {
      graph.relationships.push({
        ...edge,
        firstSeen: edge.firstSeen || nowIso,
        lastVerified: edge.lastVerified || nowIso,
        evidence: edge.evidence || []
      });
    }
  }
}
