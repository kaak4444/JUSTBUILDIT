/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IMemory } from "./interfaces.ts";

export interface IKnowledgeNode {
  id: string;
  label: string;
  properties: Record<string, any>;
}

export interface IKnowledgeRelationship {
  sourceId: string;
  targetId: string;
  type: string;
}

export class MemoryService implements IMemory {
  private shortTerm: Map<string, any> = new Map();
  private projectMemory: Map<string, Map<string, any>> = new Map();
  private longTerm: Map<string, any> = new Map();
  
  // Knowledge Graph Data structures
  private nodes: Map<string, IKnowledgeNode> = new Map();
  private relationships: IKnowledgeRelationship[] = [];

  constructor() {
    this.populateInitialKnowledge();
  }

  // Short term (RAM)
  async storeShortTerm(key: string, value: any): Promise<void> {
    this.shortTerm.set(key, value);
  }

  async retrieveShortTerm(key: string): Promise<any> {
    return this.shortTerm.get(key);
  }

  // Project isolation
  async storeProjectMemory(projectId: string, key: string, value: any): Promise<void> {
    if (!this.projectMemory.has(projectId)) {
      this.projectMemory.set(projectId, new Map());
    }
    this.projectMemory.get(projectId)!.set(key, value);
  }

  async retrieveProjectMemory(projectId: string, key: string): Promise<any> {
    return this.projectMemory.get(projectId)?.get(key);
  }

  // Long term
  async storeLongTerm(key: string, value: any): Promise<void> {
    this.longTerm.set(key, value);
    // Push into localStorage if in browser environment for actual simple persistence
    try {
      localStorage.setItem(`jbi_lt_${key}`, JSON.stringify(value));
    } catch (_) {}
  }

  async retrieveLongTerm(key: string): Promise<any> {
    if (this.longTerm.has(key)) {
      return this.longTerm.get(key);
    }
    try {
      const val = localStorage.getItem(`jbi_lt_${key}`);
      if (val) {
        const parsed = JSON.parse(val);
        this.longTerm.set(key, parsed);
        return parsed;
      }
    } catch (_) {}
    return undefined;
  }

  // Knowledge Graph
  async addKnowledgeNode(id: string, label: string, properties: Record<string, any>): Promise<void> {
    this.nodes.set(id, { id, label, properties });
  }

  async addKnowledgeRelationship(sourceId: string, targetId: string, relType: string): Promise<void> {
    // Avoid duplicates
    const exists = this.relationships.some(
      (r) => r.sourceId === sourceId && r.targetId === targetId && r.type === relType
    );
    if (!exists) {
      this.relationships.push({ sourceId, targetId, type: relType });
    }
  }

  async queryKnowledge(query: string): Promise<any> {
    const term = query.toLowerCase();
    const matchedNodes = Array.from(this.nodes.values()).filter(
      (n) =>
        n.id.toLowerCase().includes(term) ||
        n.label.toLowerCase().includes(term) ||
        JSON.stringify(n.properties).toLowerCase().includes(term)
    );
    return {
      nodes: matchedNodes,
      relationships: this.relationships.filter((r) =>
        matchedNodes.some((n) => n.id === r.sourceId || n.id === r.targetId)
      ),
    };
  }

  // For visualization and inspection in Cockpit
  getGraphData() {
    return {
      nodes: Array.from(this.nodes.values()),
      relationships: [...this.relationships],
    };
  }

  private populateInitialKnowledge() {
    if (process.env.NODE_ENV === "development") return;
    // Seed initial organizational standards
    this.addKnowledgeNode("jbi", "Platform Core", {
      mission: "Autonomous Business OS",
      status: "Active Foundation v0.1",
      architecture: "Decoupled Event-Driven",
    });

    this.addKnowledgeNode("standards_typography", "Typography Standard", {
      family: "Inter, Space Grotesk, JetBrains Mono",
      spacingGrid: "4px base grid",
      ratios: "Perfect fourth scale",
    });

    this.addKnowledgeNode("standards_code", "TypeScript Standards", {
      safety: "Strict",
      paradigm: "Composition over Inheritance",
      contracts: "All interfaces first",
    });

    this.addKnowledgeNode("gap_thinking_concept", "Gap Thinker Methodology", {
      goal: "Analyze consumer disappointment inside competitive clusters",
      output: "Structured strategic evidence rules for generation",
    });

    this.addKnowledgeRelationship("jbi", "standards_typography", "GOVERNS_AESTHETICS");
    this.addKnowledgeRelationship("jbi", "standards_code", "MANDATES_DEVELOPMENT");
    this.addKnowledgeRelationship("jbi", "gap_thinking_concept", "PRIMARY_RESEARCH_UNIT");
  }
}
