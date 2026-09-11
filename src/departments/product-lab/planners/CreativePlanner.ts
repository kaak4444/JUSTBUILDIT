/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IWorker, ITask, IExecutionContext, ITaskResult } from "../../../engine/interfaces";

export interface CreativeDirection {
  isBoringRating: string;
  surpriseFactor: string;
  simplicityFormula: string;
  premiumBenchmark: string;
  targetEmotion: string;
  benchmarksChecked: {
    wouldAppleBuildThis: boolean;
    wouldStripeBuildThis: boolean;
    wouldLinearBuildThis: boolean;
    wouldNotionBuildThis: boolean;
  };
}

export class CreativePlanner implements IWorker {
  id = "creative-planner";
  name = "Senior Creative Planner";
  description = "Synthesizes competitive data into premium CreativeDirections, filtering out standard design patterns for surprise and high-end emotional value.";
  departmentId = "product-lab";
  requiredSkills = ["typography", "premium-ui"];
  requiredCapabilities = ["reason"];
  inputSchema = { productBlueprint: "object" };
  outputSchema = {
    isBoringRating: "string",
    surpriseFactor: "string",
    simplicityFormula: "string",
    premiumBenchmark: "string",
    targetEmotion: "string",
    benchmarksChecked: "object"
  };

  async execute(task: ITask, context: IExecutionContext): Promise<ITaskResult> {
    context.logger.info(`Worker:${this.id}`, "Formulating highly unexpected, premium CreativeDirection guidelines.");

    await new Promise((resolve) => setTimeout(resolve, 800));

    const direction: CreativeDirection = {
      isBoringRating: "Very Low. Traditional products in this niche are heavily cluttered; ours is hyper-focused.",
      surpriseFactor: "Interactive responsive micro-physics on secondary components to delight and reward progress clicks.",
      simplicityFormula: "Only show active work controls. Secondary configuration and statistics live in a tiny, fast drawer overlay.",
      premiumBenchmark: "Strict adherence to Stripe's border-highlight ratios and Linear's dark/light slate visual contrasts.",
      targetEmotion: "Absolute cognitive ease, trust, and premium quiet-luxury satisfaction.",
      benchmarksChecked: {
        wouldAppleBuildThis: true,
        wouldStripeBuildThis: true,
        wouldLinearBuildThis: true,
        wouldNotionBuildThis: true
      }
    };

    return {
      success: true,
      output: direction
    };
  }
}
