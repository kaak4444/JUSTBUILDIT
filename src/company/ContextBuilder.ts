/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ITask, ISkill } from "../engine/interfaces";
import { IEvidence } from "./Evidence";
import { FeedbackLearningLoop } from "../intelligence/feedback/feedbackLoop";

export interface IContextAssembled {
  taskTitle: string;
  taskDescription: string;
  evidences: string;
  skills: string;
  longTermMemory: string;
}

export class ContextBuilder {
  /**
   * Gather distinct streams of business data into a cohesive structured payload
   */
  public static assemble(params: {
    task: ITask;
    skills: ISkill[];
    evidence: IEvidence[];
    previousContext?: any;
  }): IContextAssembled {
    const serializedSkills = params.skills
      .map(s => `Skill [${s.name}]: ${s.description}. Rules: ${s.rules.join(", ")}`)
      .join("\n");

    const serializedEvidence = params.evidence
      .map(e => `Evidence Source [${e.source}]: "${e.extractedText}" (Confidence: ${e.confidence}%)`)
      .join("\n");

    const preferences = FeedbackLearningLoop.getPreferencesForPrompt();
    const finalDescription = preferences 
      ? `${params.task.description}\n${preferences}` 
      : params.task.description;

    return {
      taskTitle: params.task.title,
      taskDescription: finalDescription,
      skills: serializedSkills || "No customized skills equipped for this step.",
      evidences: serializedEvidence || "No active evidence required for this task.",
      longTermMemory: params.previousContext 
        ? JSON.stringify(params.previousContext) 
        : "No previous organizational memory exists for this project scope."
    };
  }
}
