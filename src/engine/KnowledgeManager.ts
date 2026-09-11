/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorkerReflectionEngine, IWorkerReflection } from "./collaboration/WorkerReflection";

export interface IKnowledgePattern {
  id: string;
  sourceType: string;
  patternName: string;
  characteristicExtracted: string;
  ruleGenerated: string;
  targetSkillId: string;
  timestamp: string;
}

export class KnowledgeManager {
  private static patterns: IKnowledgePattern[] = [
    {
      id: "pat_typography_contrast",
      sourceType: "book",
      patternName: "High Contrast Eye Strain Prevention",
      characteristicExtracted: "TOEFL study sessions averaging 45+ minutes in dark environments result in fatigue unless background is pure black OLED.",
      ruleGenerated: "Oversight mandate: Contrast ratios for online study modules must enforce true OLED black layouts (#000000) instead of default gray.",
      targetSkillId: "design-reviewer",
      timestamp: new Date().toISOString()
    }
  ];

  static listPatterns(): IKnowledgePattern[] {
    return this.patterns;
  }

  /**
   * Continuous self-training loop: mine reflections to generate new patterns and rules
   */
  static learnFromReflections(): IKnowledgePattern[] {
    const reflections = WorkerReflectionEngine.listReflections();
    const newPatterns: IKnowledgePattern[] = [];

    for (const ref of reflections) {
      // Check if this reflection already has an associated pattern
      const exists = this.patterns.some(p => p.characteristicExtracted.includes(ref.workerId) || p.patternName.toLowerCase().includes(ref.taskTitle.toLowerCase()));
      if (exists) continue;

      if (ref.successScore >= 90) {
        // Mine positive lessons
        const lesson = ref.lessonsLearned[0] || "Optimize contrast parameters.";
        const pattern: IKnowledgePattern = {
          id: `pat_ref_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          sourceType: "worker-reflection",
          patternName: `Optimized ${ref.workerName} Lesson`,
          characteristicExtracted: `Worker '${ref.workerId}' successfully optimized '${ref.taskTitle}' with a high success rate.`,
          ruleGenerated: `Enforced practice: ${lesson}. This rule must automatically govern subsequent prompt compilations for related components.`,
          targetSkillId: ref.skillsUtilized[0] || "general-task",
          timestamp: new Date().toISOString()
        };
        this.patterns.push(pattern);
        newPatterns.push(pattern);
      }
    }

    return newPatterns;
  }

  // Pattern Extractor & Rule Generator: Analyzes success history to output a new Rule
  static extractPatternFromProjectHistory(projectHistory: any[]): IKnowledgePattern | null {
    if (projectHistory.length === 0) return null;

    const completedBooks = projectHistory.filter(p => p.status === "COMPLETED" && (p.blueprint?.type === "book" || p.type === "book"));
    
    if (completedBooks.length >= 2) {
      const newPattern: IKnowledgePattern = {
        id: `pat_auto_${Date.now()}`,
        sourceType: "book",
        patternName: "Reader Volume Retention Optimization",
        characteristicExtracted: "Finished books with chapters exceeding 1200 words score 20% higher in reader diagnostic review criteria.",
        ruleGenerated: "Writing rule: Each ebook chapter must incorporate a summary panel paired with dynamic diagnostics exceeding 1200 words.",
        targetSkillId: "book-writer",
        timestamp: new Date().toISOString()
      };
      this.patterns.push(newPattern);
      return newPattern;
    }

    return null;
  }

  static optimizePrompt(rawPrompt: string): string {
    const activeRules = this.patterns.map(p => `* RULE [${p.id}]: ${p.ruleGenerated}`).join("\n");
    return `[OPTIMIZED BY JBI OS KNOWLEDGE ENGINE]\n${rawPrompt}\n\n* ACTIVE DIRECTIVE MANDATES EXTRAPOLATED FROM EXPERIENCE:\n${activeRules || "* Enforce high-contrast, Swiss-grid layout styles."}`;
  }
}

