/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IWorker, ITask, IExecutionContext, ITaskResult } from "../../../engine/interfaces";

export class PromptGenerator implements IWorker {
  id = "prompt-generator";
  name = "System Prompt Synthesizer";
  description = "Compiles design, UX, and branding rules into rich, instruction-dense system prompt strings for generative text and image systems.";
  departmentId = "product-lab";
  requiredSkills = ["typography", "react-craft"];
  requiredCapabilities = ["reason"];
  inputSchema = { designRules: "object", brandDesigner: "object" };
  outputSchema = {
    compiledSystemPrompt: "string",
    variablePlaceholders: "array"
  };

  async execute(task: ITask, context: IExecutionContext): Promise<ITaskResult> {
    context.logger.info(`Worker:${this.id}`, "Compiling systematic instructions into a custom system prompt template...");

    await new Promise((resolve) => setTimeout(resolve, 500));

    const rules = task.input.designRules || {};
    const brand = task.input.brandDesigner || {};

    const prompt = `You are an elite, highly-selective Senior designer. You enforce:
1. Typography: Header="${rules.typography?.heading || "Space Grotesk"}", Body="${rules.typography?.body || "Inter"}".
2. Spacing: Rigid 8px microgrid alignment (p-4, gap-4).
3. Tone: ${brand.voiceAndTone ? brand.voiceAndTone.join("; ") : "Objective, professional, minimalist"}.
4. Style: Extremely modern, high negative-space, with soft border high-contrast definitions.`;

    return {
      success: true,
      output: {
        compiledSystemPrompt: prompt,
        variablePlaceholders: ["product_title", "target_audience_niche"]
      }
    };
  }
}
