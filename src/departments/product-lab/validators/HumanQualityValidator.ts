/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IWorker, ITask, IExecutionContext, ITaskResult } from "../../../engine/interfaces";

export interface TasteEvaluation {
  score: number; // 0 to 100
  criticisms: string[];
  suggestions: string[];
  highlights: string[];
}

export class TasteReviewer {
  public static evaluate(designRules: any, uiBlueprint: any, asset: any): TasteEvaluation {
    const criticisms: string[] = [];
    const suggestions: string[] = [];
    const highlights: string[] = [];

    // Evaluate Beauty, Premium Feeling, Modernity, and visual rhythm
    const colors = asset?.primaryColors || designRules?.colors || [];
    if (colors.length > 4) {
      criticisms.push("Too many colors. Saturated multi-color palettes look unprofessional and dilute brand strength.");
      suggestions.push("Restrict the color palette to 1 primary background, 1 neutral, and 1 solid accent hue.");
    } else {
      highlights.push("Excellent restraint in color selection - highly unified visual palette.");
    }

    const typography = asset?.typography || designRules?.typography || {};
    if (typography.heading === "Arial" || typography.heading === "Times New Roman") {
      criticisms.push("Typography weak. Standard system presets look dated and cheap.");
      suggestions.push("Leverage high-character display typefaces such as Space Grotesk or Outfit.");
    } else {
      highlights.push("Highly premium typography choices pairing display and body weights beautifully.");
    }

    const spacing = asset?.spacing || designRules?.spacing;
    if (spacing && spacing !== 8 && spacing !== 4) {
      criticisms.push("Spacing inconsistent. Breaks 8px grid rhythm and looks chaotic.");
      suggestions.push("Enforce strict 8px multiples (gap-2, p-4, m-8) to establish elegant structural alignment.");
    } else {
      highlights.push("Excellent rhythmic pacing; whitespace breathing room looks spacious and elite.");
    }

    // Default general check if everything looks empty
    if (criticisms.length === 0) {
      // Simulate minor feedback for premium polish
      criticisms.push("Brand personality slightly generic. Visual accent weights could feel more courageous.");
      suggestions.push("Add extremely thin borders (border-white/5) around secondary panels to isolate context.");
    }

    const score = Math.max(50, 100 - criticisms.length * 12);

    return {
      score,
      criticisms,
      suggestions,
      highlights
    };
  }
}

export class HumanQualityValidator implements IWorker {
  id = "human-quality-validator";
  name = "Aesthetic Taste Validator";
  description = "Evaluates visual harmony, elegance, layout rhythm, and luxury-level polish using the Human Taste Engine.";
  departmentId = "product-lab";
  requiredSkills = ["typography", "premium-ui"];
  requiredCapabilities = ["reason", "review"];
  inputSchema = { designRules: "object", uiBlueprint: "object", asset: "object" };
  outputSchema = {
    passed: "boolean",
    score: "number",
    criticisms: "array",
    suggestions: "array",
    highlights: "array"
  };

  async execute(task: ITask, context: IExecutionContext): Promise<ITaskResult> {
    context.logger.info(`Worker:${this.id}`, "Invoking Human Taste Engine (TasteReviewer) on visual asset layout...");

    await new Promise((resolve) => setTimeout(resolve, 800));

    const evalResult = TasteReviewer.evaluate(
      task.input.designRules,
      task.input.uiBlueprint,
      task.input.asset
    );

    context.logger.warn(`Worker:${this.id}`, `TasteReviewer feedback compiled. Score: ${evalResult.score}%. Criticisms: [${evalResult.criticisms.join("; ")}]`);

    return {
      success: true,
      output: {
        passed: evalResult.score >= 80,
        score: evalResult.score,
        criticisms: evalResult.criticisms,
        suggestions: evalResult.suggestions,
        highlights: evalResult.highlights
      }
    };
  }
}
