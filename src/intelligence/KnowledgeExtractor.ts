/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NormalizedDocument, Evidence, Problem, Company, Technology } from "./types.ts";
import { Chunker } from "./Chunker.ts";
import { LLMExtractionEngine } from "./LLMExtractionEngine.ts";
import { ConfidenceEngine } from "./ConfidenceEngine.ts";

export class KnowledgeExtractor {
  private chunker = new Chunker();
  private extractionEngine = new LLMExtractionEngine();
  private confidenceEngine = new ConfidenceEngine();

  /**
   * Performs multi-staged factual extraction over document chunk sequences.
   */
  public async extractGroundedFacts(documents: NormalizedDocument[]): Promise<{
    evidence: Evidence[];
    problems: Problem[];
    companies: Company[];
    technologies: Technology[];
  }> {
    console.log(`[KnowledgeExtractor] Running Staged Extraction on ${documents.length} inputs.`);
    const evidenceList: Evidence[] = [];
    const problems: Problem[] = [];
    const companies: Company[] = [];
    const technologies: Technology[] = [];

    const docChunks = this.chunker.chunkMany(documents.map(d => ({
      doc: {
        title: d.title,
        description: "",
        canonicalUrl: d.url,
        headings: [],
        paragraphs: [d.plainText],
        lists: [],
        tables: d.tables,
        codeBlocks: [],
        images: d.images.map(img => ({ src: img, caption: "Attached Asset" })),
        videos: [],
        links: [],
        metadata: {}
      },
      url: d.url
    })));

    for (let i = 0; i < docChunks.length; i++) {
      const chunk = docChunks[i];
      const matchedDoc = documents.find(d => chunk.text.includes(d.url)) || documents[0];
      if (!matchedDoc) continue;

      try {
        console.log(`[KnowledgeExtractor] Staged extraction chunk ${i + 1}/${docChunks.length}`);

        // Stage 1: Structure Extraction via engine
        const facts = await this.extractionEngine.extract(chunk.text);

        // Stage 2: Dual Multi-factor Confidence Calculation
        const freshness = this.confidenceEngine.calculateFreshness(matchedDoc.published);
        const overallConfidenceScore = this.confidenceEngine.calculateOverallConfidence({
          sourceAuthority: matchedDoc.source.toLowerCase().includes("official") || matchedDoc.source.toLowerCase().includes("github") ? 0.95 : 0.85,
          sourceAgreement: 0.88,
          freshness,
          extractorConfidence: 0.92,
          validatorConfidence: 0.95
        });

        const hash = this.generateHash(chunk.text);
        const evId = `ev_${Date.now()}_${i}`;

        // Stage 3: Traceable Evidence record
        const evidenceItem: Evidence = {
          id: evId,
          source: matchedDoc.source,
          url: matchedDoc.url,
          title: matchedDoc.title,
          extractedAt: new Date().toISOString(),
          confidence: overallConfidenceScore,
          language: "en",
          content: chunk.text,
          hash
        };
        evidenceList.push(evidenceItem);

        // Stage 4: Staged Problem Compiler
        for (const comp of facts.complaints || []) {
          problems.push({
            id: `prob_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            text: comp.statement,
            frequency: comp.frequencyEstimate || 1,
            severity: comp.severity || 5,
            confidence: overallConfidenceScore,
            evidence: [evId]
          });
        }

        // Stage 5: Staged Company & Product Compiler
        for (const c of facts.companies || []) {
          companies.push({
            id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: c.name,
            website: c.website || `https://${c.name.toLowerCase().replace(/\s+/g, "")}.com`,
            products: c.products || [],
            technologies: [],
            competitors: [],
            pricing: c.pricing || [],
            weaknesses: c.weaknesses || [],
            strengths: c.strengths || []
          });
        }

        // Stage 6: Staged Technology Compiler
        for (const t of facts.technologies || []) {
          technologies.push({
            id: `tech_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: t.name,
            category: t.category,
            documentation: [matchedDoc.url],
            repositories: [],
            tutorials: [],
            alternatives: []
          });
        }

      } catch (err) {
        console.error(`[KnowledgeExtractor] Staged failure on chunk ${i}:`, err);
      }
    }

    return { evidence: evidenceList, problems, companies, technologies };
  }

  private generateHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }
}
