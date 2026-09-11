/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IWorker, ITask, IExecutionContext, ITaskResult } from "../../../engine/interfaces";

export interface DesignRules {
  typography: {
    heading: string;
    body: string;
    mono: string;
  };
  spacing: number;
  radius: number;
  shadows: "None" | "Soft" | "Intense";
  animations: "Instant" | "Linear" | "Spring";
  hierarchy: "Standard" | "Minimal" | "Brutalist";
  buttons: "Sharp" | "Rounded" | "Pill";
}

export class DesignDirector implements IWorker {
  id = "design-director";
  name = "Aesthetic Design Director";
  description = "Establishes cohesive typographic, spacing, and micro-interaction design rules for digital systems.";
  departmentId = "product-lab";
  requiredSkills = ["typography"];
  requiredCapabilities = ["reason"];
  inputSchema = { designInspiration: "object" };
  outputSchema = {
    typography: "object",
    spacing: "number",
    radius: "number",
    shadows: "string",
    animations: "string",
    hierarchy: "string",
    buttons: "string"
  };

  async execute(task: ITask, context: IExecutionContext): Promise<ITaskResult> {
    context.logger.info(`Worker:${this.id}`, "Formulating systematic design rules based on aesthetic trends research.");

    await new Promise((resolve) => setTimeout(resolve, 600));

    const rules: DesignRules = {
      typography: {
        heading: "Space Grotesk",
        body: "Inter",
        mono: "JetBrains Mono"
      },
      spacing: 8,
      radius: 18,
      shadows: "Soft",
      animations: "Spring",
      hierarchy: "Minimal",
      buttons: "Rounded"
    };

    return {
      success: true,
      output: rules
    };
  }
}
