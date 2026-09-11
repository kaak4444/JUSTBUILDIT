/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IWorker, ITask, IExecutionContext, ITaskResult } from "../../../engine/interfaces";

export class BrandDesigner implements IWorker {
  id = "brand-designer";
  name = "Lead Brand & Identity Designer";
  description = "Produces brand voice, tone guides, color palettes, logo concepts, and custom iconography specifications.";
  departmentId = "product-lab";
  requiredSkills = ["typography"];
  requiredCapabilities = ["reason"];
  inputSchema = { productTitle: "string", targetVibe: "string" };
  outputSchema = {
    logoDirection: "string",
    voiceAndTone: "array",
    primaryColors: "array",
    illustrationStyle: "string",
    iconSystem: "string"
  };

  async execute(task: ITask, context: IExecutionContext): Promise<ITaskResult> {
    context.logger.info(`Worker:${this.id}`, `Designing complete brand ecosystem for "${task.input.productTitle}"`);

    await new Promise((resolve) => setTimeout(resolve, 700));

    const title = task.input.productTitle || "New App";
    return {
      success: true,
      output: {
        logoDirection: `A sleek, abstract geometric monogram representing '${title.charAt(0)}' in pure outline form, framed by a soft glowing neon border.`,
        voiceAndTone: [
          "Objective, intellectual, and confident",
          "No fluffy marketing words or high-intensity hype adjectives"
        ],
        primaryColors: ["#09090b (Midnight)", "#fafafa (Off-White)", "#10b981 (Emerald Accent)"],
        illustrationStyle: "Sophisticated wireframe-like vector graphics with precise technical line weights.",
        iconSystem: "Lucide React outline icons styled in thin-weight formats (strokeWidth={1.5})."
      }
    };
  }
}
