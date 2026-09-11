/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IWorker, ITask, IExecutionContext, ITaskResult } from "../../../engine/interfaces";

export interface OpportunityReport {
  marketGap: string;
  customerPain: string;
  urgency: number; // 1-100
  marketSize: number; // Estimate in USD
  competition: number; // 1-100
  uniqueness: number; // 1-100
  confidence: number; // 1-100
}

export class OpportunityPlanner implements IWorker {
  id = "opportunity-planner";
  name = "Strategic Opportunity Planner";
  description = "Evaluates the fundamental 'Why' behind a digital product, identifying high-potential market gaps and compiling detailed Opportunity Reports.";
  departmentId = "product-lab";
  requiredSkills = ["gap-analysis"];
  requiredCapabilities = ["reason"];
  inputSchema = { objective: "string" };
  outputSchema = {
    marketGap: "string",
    customerPain: "string",
    urgency: "number",
    marketSize: "number",
    competition: "number",
    uniqueness: "number",
    confidence: "number"
  };

  async execute(task: ITask, context: IExecutionContext): Promise<ITaskResult> {
    context.logger.info(`Worker:${this.id}`, `Evaluating strategic opportunity for objective: "${task.input.objective}"`);

    // Ask deep structural questions to model the opportunity gap
    const analysisQuestions = [
      "Why does this product need to exist?",
      "Who is the specific underserved customer segment?",
      "Why is now the absolute best time to launch?",
      "What core deficits exist in current competitors?",
      "Can we leverage automated fulfillment or subscription recurring revenue models?"
    ];

    context.logger.info(`Worker:${this.id}`, `Processing structural analysis questions: ${JSON.stringify(analysisQuestions)}`);

    // Simulate analytical delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const objective = task.input.objective || "Generic Product Idea";
    const report: OpportunityReport = {
      marketGap: `High cost and extreme complexity in existing software for ${objective}. Competitors lack a cohesive and polished premium mobile-first solution.`,
      customerPain: `Users are forced to manually stitch together multiple disparate services, resulting in extreme configuration drag and high churn.`,
      urgency: 85,
      marketSize: 1250000,
      competition: 42,
      uniqueness: 78,
      confidence: 88
    };

    return {
      success: true,
      output: report
    };
  }
}
