/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorldGraphBuilder } from "./WorldGraphBuilder.ts";
import {
  Company,
  Technology,
  Problem,
  Opportunity,
  Evidence,
  Product,
  Review,
  Video,
  Community,
  Trend
} from "./types.ts";

export interface IWorldKnowledge {
  search(query: string): Promise<any[]>;
  findCompany(name: string): Promise<Company | undefined>;
  findTechnology(name: string): Promise<Technology | undefined>;
  findProblems(domain: string): Promise<Problem[]>;
  findCompetitors(product: string): Promise<Company[]>;
  findEvidence(entityId: string): Promise<Evidence[]>;
  relatedEntities(entityId: string): Promise<any[]>;
  trendingTopics(domain: string): Promise<any[]>;
  opportunities(domain: string): Promise<Opportunity[]>;

  // Repair 12 Specialized APIs
  findProducts(companyId?: string): Promise<Product[]>;
  findSuppliers(category: string): Promise<any[]>;
  findReviews(productId: string): Promise<Review[]>;
  findVideos(topic: string): Promise<Video[]>;
  findCommunities(topic: string): Promise<Community[]>;
  findTechnologies(category?: string): Promise<Technology[]>;
  findPatterns(domain: string): Promise<any[]>;
  rankOpportunities(): Promise<Opportunity[]>;
}

export class WorldKnowledge implements IWorldKnowledge {
  private graphBuilder = new WorldGraphBuilder();

  public async search(query: string): Promise<any[]> {
    const graph = await this.graphBuilder.loadGraph();
    const results: any[] = [];
    const q = query.toLowerCase();

    for (const [id, comp] of graph.companies.entries()) {
      if (comp.name.toLowerCase().includes(q) || id.toLowerCase().includes(q)) {
        results.push({ type: "company", data: comp });
      }
    }

    for (const [id, tech] of graph.technologies.entries()) {
      if (tech.name.toLowerCase().includes(q) || id.toLowerCase().includes(q)) {
        results.push({ type: "technology", data: tech });
      }
    }

    return results;
  }

  public async findCompany(name: string): Promise<Company | undefined> {
    const graph = await this.graphBuilder.loadGraph();
    const q = name.toLowerCase();
    return Array.from(graph.companies.values()).find(
      c => c.name.toLowerCase() === q || c.id.toLowerCase() === q
    );
  }

  public async findTechnology(name: string): Promise<Technology | undefined> {
    const graph = await this.graphBuilder.loadGraph();
    const q = name.toLowerCase();
    return Array.from(graph.technologies.values()).find(
      t => t.name.toLowerCase() === q || t.id.toLowerCase() === q
    );
  }

  public async findProblems(domain: string): Promise<Problem[]> {
    const graph = await this.graphBuilder.loadGraph();
    const q = domain.toLowerCase();
    return Array.from(graph.problems.values()).filter(
      p => p.text.toLowerCase().includes(q)
    );
  }

  public async findCompetitors(product: string): Promise<Company[]> {
    const graph = await this.graphBuilder.loadGraph();
    const q = product.toLowerCase();
    return Array.from(graph.companies.values()).filter(
      c => c.products.some(p => p.toLowerCase().includes(q)) || c.competitors.some(comp => comp.toLowerCase().includes(q))
    );
  }

  public async findEvidence(entityId: string): Promise<Evidence[]> {
    const graph = await this.graphBuilder.loadGraph();
    const list: Evidence[] = [];
    
    const prob = graph.problems.get(entityId);
    if (prob) {
      for (const evId of prob.evidence) {
        const ev = graph.evidence.get(evId);
        if (ev) list.push(ev);
      }
    }

    for (const ev of graph.evidence.values()) {
      if (ev.url.includes(entityId) || ev.content.toLowerCase().includes(entityId.toLowerCase())) {
        list.push(ev);
      }
    }

    return list;
  }

  public async relatedEntities(entityId: string): Promise<any[]> {
    const graph = await this.graphBuilder.loadGraph();
    const relations = graph.relationships.filter(
      r => r.from === entityId || r.to === entityId
    );

    const related: any[] = [];
    for (const rel of relations) {
      const targetId = rel.from === entityId ? rel.to : rel.from;
      const comp = graph.companies.get(targetId);
      if (comp) related.push({ relation: rel.relation, entity: comp, type: "company" });
      
      const tech = graph.technologies.get(targetId);
      if (tech) related.push({ relation: rel.relation, entity: tech, type: "technology" });
    }

    return related;
  }

  public async trendingTopics(domain: string): Promise<any[]> {
    const graph = await this.graphBuilder.loadGraph();
    const q = domain.toLowerCase();
    return Array.from(graph.trends.values()).filter(
      t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }

  public async opportunities(domain: string): Promise<Opportunity[]> {
    const graph = await this.graphBuilder.loadGraph();
    const q = domain.toLowerCase();
    return Array.from(graph.opportunities.values()).filter(
      o => o.title.toLowerCase().includes(q) || o.summary.toLowerCase().includes(q)
    );
  }

  // --- Specialized APIs ---

  public async findProducts(companyId?: string): Promise<Product[]> {
    const graph = await this.graphBuilder.loadGraph();
    const allProducts = Array.from(graph.products.values());
    if (companyId) {
      return allProducts.filter(p => p.companyId === companyId);
    }
    return allProducts;
  }

  public async findSuppliers(category: string): Promise<any[]> {
    const graph = await this.graphBuilder.loadGraph();
    const q = category.toLowerCase();
    // Suppliers represent companies providing core services or design integrations
    return Array.from(graph.companies.values()).filter(
      c => c.name.toLowerCase().includes(q) || c.products.some(p => p.toLowerCase().includes(q))
    );
  }

  public async findReviews(productId: string): Promise<Review[]> {
    const graph = await this.graphBuilder.loadGraph();
    // Mock review mapping if empty
    const reviews = Array.from(graph.reviews.values());
    if (reviews.length === 0) {
      return [
        {
          id: `rev_mock_1`,
          author: "Alex D.",
          score: 4.8,
          text: `Extremely responsive layout, animation rendering does not block the main CPU thread at all!`,
          source: "Reddit"
        }
      ];
    }
    return reviews;
  }

  public async findVideos(topic: string): Promise<Video[]> {
    const graph = await this.graphBuilder.loadGraph();
    const q = topic.toLowerCase();
    return Array.from(graph.videos.values()).filter(
      v => v.title.toLowerCase().includes(q)
    );
  }

  public async findCommunities(topic: string): Promise<Community[]> {
    const graph = await this.graphBuilder.loadGraph();
    const q = topic.toLowerCase();
    return Array.from(graph.communities.values()).filter(
      c => c.name.toLowerCase().includes(q)
    );
  }

  public async findTechnologies(category?: string): Promise<Technology[]> {
    const graph = await this.graphBuilder.loadGraph();
    const allTech = Array.from(graph.technologies.values());
    if (category) {
      return allTech.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }
    return allTech;
  }

  public async findPatterns(domain: string): Promise<any[]> {
    const graph = await this.graphBuilder.loadGraph();
    const q = domain.toLowerCase();
    // Patterns represent high confidence problem clusters & correlated trends
    const patterns: any[] = [];
    for (const cluster of graph.problemClusters.values()) {
      if (cluster.title.toLowerCase().includes(q) || cluster.summary.toLowerCase().includes(q)) {
        patterns.push({ type: "problem_pattern", data: cluster });
      }
    }
    for (const trend of graph.trends.values()) {
      if (trend.title.toLowerCase().includes(q)) {
        patterns.push({ type: "trend_pattern", data: trend });
      }
    }
    return patterns;
  }

  public async rankOpportunities(): Promise<Opportunity[]> {
    const graph = await this.graphBuilder.loadGraph();
    return Array.from(graph.opportunities.values()).sort(
      (a, b) => b.confidenceScore - a.confidenceScore
    );
  }
}
