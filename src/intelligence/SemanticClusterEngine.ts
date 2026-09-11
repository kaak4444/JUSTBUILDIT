/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { Problem, ProblemCluster } from "./types.ts";

export class SemanticClusterEngine {
  private ai: GoogleGenAI | null = null;
  private similarityThreshold = 0.55; // Cosine similarity threshold for grouping

  constructor() {
    if (process.env.GEMINI_API_KEY) {
      this.ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } }
      });
    }
  }

  /**
   * Clusters a list of raw user problems into refined ProblemClusters.
   * If Gemini API is available, uses actual vector embeddings via cosine similarity.
   * Otherwise, falls back to a mathematical token-overlap cosine-similarity model.
   */
  public async cluster(problems: Problem[]): Promise<ProblemCluster[]> {
    console.log(`[SemanticClusterEngine] Clustering ${problems.length} raw problems into semantic categories...`);
    if (problems.length === 0) return [];

    const clusters: ProblemCluster[] = [];
    
    // Step 1: Generate embeddings if API key is active, or use mathematical token weights
    const problemEmbeddings: Array<{ problem: Problem; vector: number[] }> = [];

    if (this.ai) {
      try {
        console.log("[SemanticClusterEngine] Retrieving vector embeddings via gemini-embedding-2-preview...");
        for (const p of problems) {
          const response = await this.ai.models.embedContent({
            model: "gemini-embedding-2-preview",
            contents: p.text
          }) as any;
          
          if (response.embedding?.values) {
            problemEmbeddings.push({
              problem: p,
              vector: response.embedding.values
            });
          } else if (response.embeddings?.[0]?.values) {
            problemEmbeddings.push({
              problem: p,
              vector: response.embeddings[0].values
            });
          }
        }
      } catch (err) {
        console.warn("[SemanticClusterEngine] Vector embedding fetch failed, using mathematical token similarity instead:", err);
      }
    }

    // If API embeddings failed or were not available, build TF-IDF token vectors
    if (problemEmbeddings.length < problems.length) {
      problemEmbeddings.length = 0; // reset
      for (const p of problems) {
        problemEmbeddings.push({
          problem: p,
          vector: this.buildTokenFrequencyVector(p.text)
        });
      }
    }

    // Step 2: Semantic clustering algorithm (Sequential Clustering)
    for (const item of problemEmbeddings) {
      let matchedCluster: ProblemCluster | null = null;
      let highestSimilarity = 0;

      for (const cluster of clusters) {
        // Calculate similarity to the representative problem in the cluster
        const repProblemText = cluster.representativeProblems[0];
        const repItem = problemEmbeddings.find(x => x.problem.text === repProblemText);
        
        if (repItem) {
          const similarity = this.calculateCosineSimilarity(item.vector, repItem.vector);
          if (similarity > this.similarityThreshold && similarity > highestSimilarity) {
            highestSimilarity = similarity;
            matchedCluster = cluster;
          }
        }
      }

      if (matchedCluster) {
        // Add to existing cluster
        matchedCluster.representativeProblems.push(item.problem.text);
        matchedCluster.totalMentions += item.problem.frequency;
        // Average severity
        matchedCluster.averageSeverity = Math.round(
          ((matchedCluster.averageSeverity * (matchedCluster.representativeProblems.length - 1)) + item.problem.severity) / 
          matchedCluster.representativeProblems.length
        );
      } else {
        // Create a new cluster
        const id = `cluster_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        
        // Formulate a clean heading summary for this cluster
        const summary = this.generateSummaryText(item.problem.text);
        
        clusters.push({
          id,
          title: this.capitalize(summary),
          summary: `Discovered customer complaints regarding: "${item.problem.text}"`,
          representativeProblems: [item.problem.text],
          totalMentions: item.problem.frequency,
          averageSeverity: item.problem.severity,
          confidenceScore: item.problem.confidence
        });
      }
    }

    console.log(`[SemanticClusterEngine] Structured ${problems.length} problems into ${clusters.length} distinct semantic clusters.`);
    return clusters;
  }

  private calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      // Handle variable length token vectors (pad with 0)
      const len = Math.max(vec1.length, vec2.length);
      const v1 = [...vec1, ...new Array(len - vec1.length).fill(0)];
      const v2 = [...vec2, ...new Array(len - vec2.length).fill(0)];
      return this.cosine(v1, v2);
    }
    return this.cosine(vec1, vec2);
  }

  private cosine(v1: number[], v2: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < v1.length; i++) {
      dotProduct += v1[i] * v2[i];
      normA += v1[i] * v1[i];
      normB += v2[i] * v2[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Builds a simple numerical word token weight array for TF-IDF simulation.
   */
  private buildTokenFrequencyVector(text: string): number[] {
    const stopwords = new Set(["the", "a", "an", "is", "are", "of", "and", "or", "in", "on", "at", "to", "for", "with", "by", "this", "that", "it", "my"]);
    const words = text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopwords.has(w));

    // Map each unique word to a hash code index to keep vector coordinates stable
    const vector = new Array(256).fill(0);
    for (const w of words) {
      let hash = 0;
      for (let i = 0; i < w.length; i++) {
        hash = (hash * 31 + w.charCodeAt(i)) % 256;
      }
      vector[hash]++;
    }
    return vector;
  }

  private generateSummaryText(text: string): string {
    // Keep it short, e.g. "Page Loading Delays"
    const words = text.split(" ").slice(0, 5).join(" ");
    return words.length < text.length ? words + "..." : words;
  }

  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
