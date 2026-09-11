/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IReasoningNode {
  id: string;
  type: "REASON" | "EVIDENCE" | "SOURCE" | "CONFIDENCE" | "UNKNOWN" | "ALTERNATIVE" | "DECISION";
  label: string;
  properties: Record<string, any>;
}

export interface IReasoningEdge {
  sourceId: string;
  targetId: string;
  relationship: string;
}

export class ReasoningGraph {
  public nodes: IReasoningNode[] = [];
  public edges: IReasoningEdge[] = [];

  static createFromDecision(decision: any): ReasoningGraph {
    const graph = new ReasoningGraph();
    const decId = decision.id;

    // 1. Decision Node
    graph.addNode(decId, "DECISION", decision.question || decision.title, {
      selectedOption: decision.selectedOption || "Default Layout",
      confidence: decision.confidence,
      reasoning: decision.reasoning
    });

    // 2. Reason Nodes
    const reasonId = `reason_${decId}`;
    graph.addNode(reasonId, "REASON", "Optimal alignment to design directives", {
      reasoning: decision.reasoning || "Swiss grid and high-contrast OLED requirements govern this choice."
    });
    graph.addEdge(reasonId, decId, "DETERMINES");

    // 3. Evidence Nodes
    (decision.evidence || []).forEach((ev: string, idx: number) => {
      const evId = `evidence_${decId}_${idx}`;
      graph.addNode(evId, "EVIDENCE", ev, { text: ev });
      graph.addEdge(evId, reasonId, "SUPPORTS");

      // 4. Source Nodes
      const srcId = `src_${decId}_${idx}`;
      const sourceName = (decision.sources && decision.sources[idx]) || "Autonomous Gap Scout Sweep";
      graph.addNode(srcId, "SOURCE", sourceName, { name: sourceName });
      graph.addEdge(srcId, evId, "PROVIDES_EVIDENCE");
    });

    // 5. Alternatives Nodes
    (decision.alternatives || []).forEach((alt: string, idx: number) => {
      const altId = `alt_${decId}_${idx}`;
      graph.addNode(altId, "ALTERNATIVE", alt, { option: alt });
      graph.addEdge(altId, decId, "EVALUATED_AGAINST");
    });

    // 6. Unknowns Nodes
    (decision.unknowns || []).forEach((unk: string, idx: number) => {
      const unkId = `unk_${decId}_${idx}`;
      graph.addNode(unkId, "UNKNOWN", unk, { text: unk });
      graph.addEdge(unkId, decId, "RISKS_IN");
    });

    return graph;
  }

  addNode(id: string, type: IReasoningNode["type"], label: string, properties: Record<string, any> = {}) {
    if (!this.nodes.some(n => n.id === id)) {
      this.nodes.push({ id, type, label, properties });
    }
  }

  addEdge(sourceId: string, targetId: string, relationship: string) {
    const edgeExists = this.edges.some(e => e.sourceId === sourceId && e.targetId === targetId && e.relationship === relationship);
    if (!edgeExists) {
      this.edges.push({ sourceId, targetId, relationship });
    }
  }

  serialize() {
    return {
      nodes: this.nodes,
      edges: this.edges
    };
  }
}
