/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TopicGraph } from "./TopicGraph";
import { SourceRegistry } from "./SourceRegistry";
import { EvidenceStore, ResearchEvidence, Fact } from "./EvidenceStore";
import { SemanticConceptStore, ResearchGapDetector } from "./KnowledgeBase";

export class ResearchMemory {
  private static instance: ResearchMemory;

  public topicGraph: TopicGraph;
  public sourceRegistry: SourceRegistry;
  public evidenceStore: EvidenceStore;
  public semanticConceptStore: SemanticConceptStore;
  public gapDetector: ResearchGapDetector;

  private constructor() {
    this.topicGraph = new TopicGraph();
    this.sourceRegistry = new SourceRegistry();
    this.evidenceStore = new EvidenceStore();
    this.semanticConceptStore = new SemanticConceptStore();
    this.gapDetector = new ResearchGapDetector();
  }

  /**
   * Singleton accessor
   */
  public static getInstance(): ResearchMemory {
    if (!ResearchMemory.instance) {
      ResearchMemory.instance = new ResearchMemory();
    }
    return ResearchMemory.instance;
  }

  /**
   * Memory-First Router
   * Checks the Topic Graph, searches Evidence Store (merging multi-feed data),
   * and measures cumulative usable confidence.
   * If memory contains fresh & high-confidence facts, skips hitting the live internet.
   */
  public async findTopic(
    topic: string, 
    minConfidence = 0.75
  ): Promise<{ 
    evidence: ResearchEvidence[]; 
    source: "memory" | "internet"; 
    confidenceScore: number;
    relatedTopicsSearched: string[];
  }> {
    // 1. Expand search terms using Topic Graph
    const relatedTopics = this.topicGraph.findRelatedTopics(topic);
    
    // 2. Fetch merged evidence for matching related topics
    let bestEvidence: ResearchEvidence[] = [];
    let bestScore = 0;

    for (const relatedTopic of relatedTopics) {
      const mergedEv = this.evidenceStore.mergeEvidence(relatedTopic);
      if (mergedEv.length > 0) {
        // Evaluate the quality score of merged evidence
        const totalScore = mergedEv.reduce((acc, ev) => acc + (ev.score || ev.confidence), 0) / mergedEv.length;
        if (totalScore > bestScore) {
          bestScore = totalScore;
          bestEvidence = mergedEv;
        }
      }
    }

    // 3. Determine if confidence satisfies threshold
    const hasEnoughConfidence = bestScore >= minConfidence && bestEvidence.length > 0;
    
    if (hasEnoughConfidence) {
      // Cross-project reuse: update freshness score upon retrieval
      bestEvidence.forEach(ev => {
        ev.extractedAt = Date.now(); // update extraction window to keep fresh
        ev.freshness = 1.0;          // reset freshness back to peak
        if (ev.score) {
          ev.score = this.evidenceStore.calculateEvidenceScore(ev, this.sourceRegistry.listSources());
        }
      });

      return {
        evidence: bestEvidence,
        source: "memory",
        confidenceScore: bestScore,
        relatedTopicsSearched: relatedTopics
      };
    }

    // fallback to internet
    return {
      evidence: [],
      source: "internet",
      confidenceScore: bestScore,
      relatedTopicsSearched: relatedTopics
    };
  }

  /**
   * Knowledge Extraction Pipeline (Continuous Learning)
   * Pipeline: Project -> Assets -> Research -> Reviews -> Lessons -> Reusable Knowledge -> Research Memory
   */
  public learnFromProjectCompletion(project: any) {
    if (!project) return;

    const projectId = project.id || `proj_${Date.now()}`;
    const projectTitle = project.title || "Untitled Project";
    
    // 1. Extract lessons/retrospectives if available
    const lessons: string[] = [];
    if (project.retrospective) {
      if (Array.isArray(project.retrospective.lessons)) {
        lessons.push(...project.retrospective.lessons);
      } else if (typeof project.retrospective.lessons === "string") {
        lessons.push(project.retrospective.lessons);
      }
    }

    // 2. Extract facts from research reports/outputs
    const extractedFacts: Fact[] = [];
    let topicName = "general";

    if (project.tasks && Array.isArray(project.tasks)) {
      project.tasks.forEach((task: any) => {
        // Target research workers or completed output
        if (task.workerType?.toLowerCase().includes("research") || task.title?.toLowerCase().includes("research")) {
          const output = task.output;
          if (output) {
            // Determine primary topic
            if (output.topic) topicName = output.topic;
            else if (project.settings?.niche) topicName = project.settings.niche;

            // Gather structural findings as facts
            if (output.findings && Array.isArray(output.findings)) {
              output.findings.forEach((finding: any, idx: number) => {
                extractedFacts.push({
                  id: `fact_extracted_${task.id}_${idx}`,
                  statement: typeof finding === "string" ? finding : (finding.statement || JSON.stringify(finding)),
                  value: finding.value || true,
                  confidence: finding.confidence || 0.85,
                  source: "knowledge_extraction_worker"
                });
              });
            } else if (output.summary) {
              extractedFacts.push({
                id: `fact_extracted_summary_${task.id}`,
                statement: output.summary,
                value: true,
                confidence: 0.80,
                source: "knowledge_extraction_worker"
              });
            }
          }
        }
      });
    }

    // 3. Register as reusable knowledge node
    if (extractedFacts.length > 0) {
      const evidenceId = `ev_extracted_${projectId}`;
      const newEvidence: ResearchEvidence = {
        id: evidenceId,
        sourceId: "knowledge_extraction_worker",
        topic: topicName,
        title: `Harvested Knowledge from completed project: ${projectTitle}`,
        summary: `Factual research data extracted upon successful completion of project: ${projectTitle}.`,
        url: `https://justbuildit.ai/projects/${projectId}`,
        extractedAt: Date.now(),
        confidence: 0.90,
        freshness: 1.0,
        importance: 8,
        tags: [topicName, "knowledge_extraction", "reusable_evidence"],
        facts: extractedFacts
      };

      this.evidenceStore.addEvidence(newEvidence, this.sourceRegistry.listSources());
    }

    // 4. Inject high-retention Lessons learned into the Semantic Concept Store
    lessons.forEach((lesson, idx) => {
      this.semanticConceptStore.addNode({
        id: `kn_lesson_${projectId}_${idx}`,
        topic: topicName,
        category: "lesson",
        title: `Lesson: ${projectTitle}`,
        summary: lesson,
        score: 0.90,
        tags: [topicName, "lessons_learned", "retrospective"]
      });
    });
  }
}
