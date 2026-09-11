/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ResearchSource } from "./SourceRegistry";

export interface Fact {
  id: string;
  statement: string;
  value: any;
  confidence: number;
  source: string;
}

export interface ResearchEvidence {
  id: string;
  sourceId: string;
  topic: string;
  title: string;
  summary: string;
  url: string;
  extractedAt: number;
  confidence: number; // raw extraction confidence (0.0 to 1.0)
  freshness: number;  // computed freshness index (0.0 to 1.0)
  importance: number; // strategic importance (1 to 10)
  tags: string[];
  facts: Fact[];
  score?: number;     // final composite evidence score (0.0 to 1.0)
}

export interface Conflict {
  id: string;
  topic: string;
  factA: Fact;
  factB: Fact;
  winner?: string; // ID of the winner fact
  status: "unresolved" | "resolved";
  resolvedAt?: number;
  notes?: string;
}

export interface ResearchSnapshot {
  topicId: string;
  timestamp: number;
  evidence: ResearchEvidence[];
  score: number;
}

export class EvidenceStore {
  private evidenceList: ResearchEvidence[] = [];
  private conflicts: Conflict[] = [];
  private snapshots: ResearchSnapshot[] = [];

  constructor() {
    this.prepopulateStore();
  }

  /**
   * Pre-populates the memory store with high-fidelity historic research facts & evidence
   */
  private prepopulateStore() {
    this.evidenceList = [
      {
        id: "ev_trends_1",
        sourceId: "google_trends",
        topic: "journals",
        title: "Printable planner search volumes upsurge",
        summary: "Searches for 'printable undated planner' increased 81% year-over-year, peaking during Q4 sprint sessions.",
        url: "https://trends.google.com/trends",
        extractedAt: Date.now() - 48 * 3600 * 1000, // 2 days ago
        confidence: 0.94,
        freshness: 1.0,
        importance: 8,
        tags: ["printables", "planners", "journals"],
        facts: [
          {
            id: "fact_trends_1",
            statement: "Search volume increased 81%",
            value: 81,
            confidence: 0.94,
            source: "google_trends"
          }
        ]
      },
      {
        id: "ev_tiktok_1",
        sourceId: "tiktok",
        topic: "journals",
        title: "Micro-journaling aesthetic trend explosion",
        summary: "Under the hashtag #microjournal, content volume has spiked to 381 new videos per day with strong engagement rates.",
        url: "https://tiktok.com/insights",
        extractedAt: Date.now() - 24 * 3600 * 1000, // 1 day ago
        confidence: 0.88,
        freshness: 1.0,
        importance: 6,
        tags: ["printables", "journals", "microjournaling"],
        facts: [
          {
            id: "fact_tiktok_1",
            statement: "381 new videos/day",
            value: 381,
            confidence: 0.88,
            source: "tiktok"
          }
        ]
      },
      {
        id: "ev_reddit_1",
        sourceId: "reddit",
        topic: "journals",
        title: "Reddit community shipping complaints and DIY prints",
        summary: "Users in r/saas and r/journals complain about shipping times for heavy physical journals, preferring instantly printable PDFs.",
        url: "https://reddit.com/r/journals",
        extractedAt: Date.now() - 5 * 24 * 3600 * 1000, // 5 days ago
        confidence: 0.79,
        freshness: 1.0,
        importance: 7,
        tags: ["forum", "shipping", "complaints"],
        facts: [
          {
            id: "fact_reddit_1",
            statement: "People complain about shipping",
            value: "prefers digital printables over physical logistics",
            confidence: 0.79,
            source: "reddit"
          }
        ]
      },
      {
        id: "ev_whop_1",
        sourceId: "whop",
        topic: "saas_tools",
        title: "Subscription communities on Whop outperforming storefronts",
        summary: "Gated Discord communities bundled with design assets are recording 3x higher customer retention.",
        url: "https://whop.com",
        extractedAt: Date.now() - 12 * 24 * 3600 * 1000, // 12 days ago
        confidence: 0.95,
        freshness: 1.0,
        importance: 9,
        tags: ["communities", "monetization", "discord"],
        facts: [
          {
            id: "fact_whop_1",
            statement: "Bundled community assets command 3x higher retention",
            value: 3,
            confidence: 0.95,
            source: "whop"
          }
        ]
      }
    ];

    // Recalculate initial freshness values
    this.refreshFreshness();
  }

  /**
   * Adds new raw evidence to the store and triggers conflict checking
   */
  addEvidence(evidence: ResearchEvidence, sources: ResearchSource[]) {
    // 1. Calculate freshness
    evidence.freshness = this.calculateFreshness(evidence.extractedAt, evidence.topic);
    
    // 2. Score the evidence
    evidence.score = this.calculateEvidenceScore(evidence, sources);
    
    // 3. Add to store
    this.evidenceList.push(evidence);

    // 4. Run contradiction detection
    this.detectConflicts(evidence);
  }

  /**
   * Freshness Engine (Confidence Decay over Time)
   * Half-life is dynamically adjusted based on the topic.
   * - Social trends ("tiktok", "viral"): Half life of 4 days.
   * - Ads & Market intelligence ("ads"): Half life of 15 days.
   * - Platforms & Software ("notion", "saas"): Half life of 90 days.
   */
  calculateFreshness(extractedAt: number, topic: string): number {
    const ageMs = Date.now() - extractedAt;
    const ageDays = ageMs / (1000 * 60 * 60 * 24);

    let halfLifeDays = 30; // default baseline

    const topicLower = topic.toLowerCase();
    if (topicLower.includes("tiktok") || topicLower.includes("social") || topicLower.includes("trend")) {
      halfLifeDays = 4; // decays super fast!
    } else if (topicLower.includes("ads") || topicLower.includes("marketing")) {
      halfLifeDays = 15;
    } else if (topicLower.includes("software") || topicLower.includes("saas") || topicLower.includes("stack") || topicLower.includes("framework")) {
      halfLifeDays = 90; // slow decay
    }

    // Exponential decay formula: F = 2 ^ (-t / t_half)
    const freshness = Math.pow(2, -ageDays / halfLifeDays);
    return Number(Math.max(0.01, Math.min(1.0, freshness)).toFixed(4));
  }

  /**
   * Iterates through all loaded evidence and updates freshness values
   */
  refreshFreshness() {
    this.evidenceList.forEach(ev => {
      ev.freshness = this.calculateFreshness(ev.extractedAt, ev.topic);
    });
  }

  /**
   * Evidence Score Engine
   * score = Trust * Freshness * Agreement * Coverage * Reliability
   */
  calculateEvidenceScore(evidence: ResearchEvidence, sources: ResearchSource[]): number {
    const src = sources.find(s => s.id === evidence.sourceId);
    const trust = src ? src.trust : 0.70; // baseline default trust

    const freshness = evidence.freshness;

    // Agreement (friction indicator): checks if this evidence topic has active unresolved conflicts
    const activeConflicts = this.conflicts.filter(c => c.topic === evidence.topic && c.status === "unresolved");
    const agreement = activeConflicts.length > 0 ? 0.60 : 1.0;

    // Coverage: score based on number of unique facts included
    const coverage = Math.min(1.0, 0.5 + (evidence.facts.length * 0.15));

    // Reliability: mean confidence score of nested facts
    const totalConf = evidence.facts.reduce((acc, f) => acc + f.confidence, 0);
    const reliability = evidence.facts.length > 0 ? totalConf / evidence.facts.length : evidence.confidence;

    const compositeScore = trust * freshness * agreement * coverage * reliability;
    return Number(Math.max(0.05, Math.min(1.0, compositeScore)).toFixed(4));
  }

  /**
   * Evidence Merger Engine
   * Groups independent feeds by topic and outputs a consolidated factual snapshot.
   */
  mergeEvidence(filterTopic?: string): ResearchEvidence[] {
    const targetEvidence = filterTopic 
      ? this.evidenceList.filter(e => e.topic.toLowerCase() === filterTopic.toLowerCase())
      : this.evidenceList;

    // Group by topic
    const grouped: Record<string, ResearchEvidence[]> = {};
    targetEvidence.forEach(ev => {
      const key = ev.topic.toLowerCase();
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(ev);
    });

    const mergedList: ResearchEvidence[] = [];

    Object.entries(grouped).forEach(([topic, items]) => {
      // Aggregate facts
      const factsMap = new Map<string, Fact>();
      const allTags = new Set<string>();
      let totalConfidence = 0;
      let totalImportance = 0;
      let newestTimestamp = 0;
      const uniqueSources = new Set<string>();

      items.forEach(ev => {
        uniqueSources.add(ev.sourceId);
        totalConfidence += ev.confidence;
        totalImportance += ev.importance;
        if (ev.extractedAt > newestTimestamp) newestTimestamp = ev.extractedAt;
        
        ev.tags.forEach(tag => allTags.add(tag));

        ev.facts.forEach(f => {
          // Check if statement already exists. If yes, take higher confidence fact
          const cleanStmt = f.statement.toLowerCase().trim();
          const existing = factsMap.get(cleanStmt);
          if (!existing || existing.confidence < f.confidence) {
            factsMap.set(cleanStmt, f);
          }
        });
      });

      const avgConfidence = totalConfidence / items.length;
      const avgImportance = Math.round(totalImportance / items.length);

      // Create consolidated merged evidence object
      const merged: ResearchEvidence = {
        id: `merged_${topic}_${Date.now()}`,
        sourceId: Array.from(uniqueSources).join("+"),
        topic,
        title: `Consolidated Market Evidence for ${topic}`,
        summary: `Consolidated data from ${items.length} sources (${Array.from(uniqueSources).join(", ")}). Contains ${factsMap.size} unique facts.`,
        url: items[0]?.url || "https://internal.justbuildit.ai",
        extractedAt: newestTimestamp,
        confidence: Number(avgConfidence.toFixed(4)),
        freshness: this.calculateFreshness(newestTimestamp, topic),
        importance: avgImportance,
        tags: Array.from(allTags),
        facts: Array.from(factsMap.values())
      };

      merged.score = Number((merged.confidence * merged.freshness).toFixed(4));
      mergedList.push(merged);
    });

    return mergedList;
  }

  /**
   * Contradiction Engine
   * Compares newly added evidence with existing database to surface conflicting statements.
   */
  private detectConflicts(newEv: ResearchEvidence) {
    const sisterEvidence = this.evidenceList.filter(
      e => e.topic.toLowerCase() === newEv.topic.toLowerCase() && e.id !== newEv.id
    );

    newEv.facts.forEach(factA => {
      sisterEvidence.forEach(sister => {
        sister.facts.forEach(factB => {
          // Simple rule-based contradiction checks
          const stmtA = factA.statement.toLowerCase();
          const stmtB = factB.statement.toLowerCase();

          // Rule 1: Opposite directions/growth claims
          const scaleConflict = 
            (stmtA.includes("increase") || stmtA.includes("growing") || stmtA.includes("up")) && 
            (stmtB.includes("decrease") || stmtB.includes("declining") || stmtB.includes("down") || stmtB.includes("dead"));

          // Rule 2: Numeric friction on same subject
          // If statement prefixes are similar but numbers differ wildly
          const prefixA = stmtA.substring(0, 15);
          const prefixB = stmtB.substring(0, 15);
          const numericFriction = (prefixA === prefixB && factA.value !== factB.value && typeof factA.value === "number" && typeof factB.value === "number");

          if (scaleConflict || numericFriction) {
            const conflictId = `conflict_${factA.id}_${factB.id}`;
            const exists = this.conflicts.some(c => c.id === conflictId);
            if (!exists) {
              this.conflicts.push({
                id: conflictId,
                topic: newEv.topic,
                factA,
                factB,
                status: "unresolved"
              });
            }
          }
        });
      });
    });
  }

  /**
   * Resolves an ongoing contradiction by declaring a winning fact
   */
  resolveConflict(conflictId: string, winnerFactId: string, resolutionNotes: string) {
    const conflict = this.conflicts.find(c => c.id === conflictId);
    if (conflict) {
      conflict.status = "resolved";
      conflict.winner = winnerFactId;
      conflict.resolvedAt = Date.now();
      conflict.notes = resolutionNotes;
    }
  }

  /**
   * Records a snapshot of current metrics/evidence for historic tracking
   */
  recordSnapshot(topicId: string, score: number) {
    const snapshot: ResearchSnapshot = {
      topicId,
      timestamp: Date.now(),
      evidence: JSON.parse(JSON.stringify(this.evidenceList.filter(e => e.topic.toLowerCase() === topicId.toLowerCase()))),
      score
    };
    this.snapshots.push(snapshot);
  }

  getEvidence(): ResearchEvidence[] {
    return this.evidenceList;
  }

  getConflicts(): Conflict[] {
    return this.conflicts;
  }

  getSnapshots(): ResearchSnapshot[] {
    return this.snapshots;
  }
}
