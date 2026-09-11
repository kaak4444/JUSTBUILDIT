/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IWorker, ITask, IExecutionContext, ITaskResult } from "../../../engine/interfaces";

export interface GeneratedAsset {
  id: string;
  type: string;
  title: string;
  specifications: string;
}

export class AssetGenerator implements IWorker {
  id = "asset-generator";
  name = "Digital Asset Generator";
  description = "Transforms conceptual blueprints and brand instructions into production-ready visual asset specifications and structural files.";
  departmentId = "product-lab";
  requiredSkills = ["react-craft", "typography"];
  requiredCapabilities = ["text-generation", "reason"];
  inputSchema = { uiBlueprint: "object", brandDesigner: "object", designRules: "object", productBlueprint: "object" };
  outputSchema = {
    assetsGenerated: "array",
    productionStatus: "string",
    deliveryManifest: "array"
  };

  async execute(task: ITask, context: IExecutionContext): Promise<ITaskResult> {
    context.logger.info(`Worker:${this.id}`, "Synthesizing design system rules to generate elite digital asset files...");

    await new Promise((resolve) => setTimeout(resolve, 900));

    const brand = task.input.brandDesigner || {};
    const rules = task.input.designRules || {};

    const assets: GeneratedAsset[] = [
      {
        id: "ast_logo_svg",
        type: "Vector Emblem",
        title: "Primary Logo Monogram",
        specifications: brand.logoDirection || "Sleek outline graphic"
      },
      {
        id: "ast_landing_html",
        type: "React Component",
        title: "High-Converting Landing Page",
        specifications: `Styled with Tailwind CSS using ${rules.typography?.heading || "Space Grotesk"} display heading styles.`
      },
      {
        id: "ast_product_pdf",
        type: "PDF Document",
        title: "Curated Guide / Reference Sheet",
        specifications: "Pre-formatted publication ready document adhering to 8px margin rhythm rules."
      }
    ];

    return {
      success: true,
      output: {
        assetsGenerated: assets,
        productionStatus: "ASSETS_READY_FOR_PUBLISHING",
        deliveryManifest: assets.map(a => `${a.title} (${a.type})`)
      }
    };
  }
}
