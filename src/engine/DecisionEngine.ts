/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IDecision {
  id: string;
  projectId: string;
  taskId: string;
  question: string;
  alternatives: string[];
  evidence: string[];
  confidence: number; // 0 to 100
  selectedOption: string;
  reasoning: string;
  unknowns: string[];
  timestamp: string;
  authorWorkerId: string;
}

export class DecisionEngine {
  private static decisions: IDecision[] = [];

  static init(initialDecisions: IDecision[] = []) {
    this.decisions = initialDecisions;
  }

  static createDecision(params: Omit<IDecision, "id" | "timestamp">): IDecision {
    const decision: IDecision = {
      id: `dec_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      ...params
    };
    this.decisions.push(decision);
    return decision;
  }

  static getDecisions(): IDecision[] {
    return this.decisions;
  }

  static getByProject(projectId: string): IDecision[] {
    return this.decisions.filter(d => d.projectId === projectId);
  }

  static getByTask(taskId: string): IDecision[] {
    return this.decisions.filter(d => d.taskId === taskId);
  }

  // Check if an analogous decision was made previously to support cognitive reuse
  static findAnalogousDecision(question: string): IDecision | undefined {
    const qWords = question.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    if (qWords.length === 0) return undefined;

    return this.decisions.find(d => {
      const dWords = d.question.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const intersection = qWords.filter(w => dWords.includes(w));
      return intersection.length >= 3; // 3 or more overlapping keywords signifies an analogy
    });
  }
}
