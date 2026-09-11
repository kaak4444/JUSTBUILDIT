/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IWorker, ITask, IExecutionContext, ITaskResult } from "../../../engine/interfaces";

export interface ProductSuccessRecord {
  productId: string;
  bestThumbnail: string;
  bestTitle: string;
  bestCTA: string;
  bestColors: string[];
  bestTypography: { heading: string; body: string };
  bestPricing: number;
  bestNiche: string;
  bestHooks: string[];
  bestTags: string[];
  bestKeywords: string[];
  conversionRate: number; // percentage
  refundRate: number; // percentage
}

export class ProductMemoryStore {
  private static records: Record<string, ProductSuccessRecord> = {
    "default_success": {
      productId: "rec_toefl_system",
      bestThumbnail: "OLED OLED High-Contrast dark theme outline graphic",
      bestTitle: "TOEFL Master Practice System with AI Reviewer",
      bestCTA: "Gain Instant Lifetime Access & AI Audits",
      bestColors: ["#09090b", "#fafafa", "#10b981"],
      bestTypography: { heading: "Space Grotesk", body: "Inter" },
      bestPricing: 29.99,
      bestNiche: "Ocular-fatigued late night students",
      bestHooks: ["Stop squinting at complex text grids", "Instant local-level validation reports"],
      bestTags: ["TOEFL Practice", "Dark Mode App", "Printable PDF Guides"],
      bestKeywords: ["toefl practice tests", "interactive toefl simulation", "aesthetic pdf workbook"],
      conversionRate: 4.82,
      refundRate: 0.15
    }
  };

  public static addRecord(record: ProductSuccessRecord) {
    this.records[record.productId] = record;
  }

  public static getBestByNiche(niche: string): ProductSuccessRecord | undefined {
    return Object.values(this.records).find(r => r.bestNiche.toLowerCase().includes(niche.toLowerCase()));
  }

  public static listAll(): ProductSuccessRecord[] {
    return Object.values(this.records);
  }
}

export class ProductMemory implements IWorker {
  id = "product-memory";
  name = "Product Memory Ledger";
  description = "Stores and retrieves high-performance digital product components and historic conversion rate trends.";
  departmentId = "product-lab";
  requiredSkills = ["ecommerce-optimization"];
  requiredCapabilities = ["reason"];
  inputSchema = { action: "string", payload: "object" };
  outputSchema = {
    status: "string",
    matchedRecord: "object",
    recordsList: "array"
  };

  async execute(task: ITask, context: IExecutionContext): Promise<ITaskResult> {
    const action = task.input.action || "list";
    context.logger.info(`Worker:${this.id}`, `Accessing product performance memories. Action: "${action}"`);

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (action === "store" && task.input.payload) {
      ProductMemoryStore.addRecord(task.input.payload as ProductSuccessRecord);
      return {
        success: true,
        output: { status: "RECORD_PERSISTED", matchedRecord: task.input.payload }
      };
    }

    const records = ProductMemoryStore.listAll();
    return {
      success: true,
      output: {
        status: "RECORDS_RETRIEVED",
        recordsList: records,
        matchedRecord: records[0]
      }
    };
  }
}
