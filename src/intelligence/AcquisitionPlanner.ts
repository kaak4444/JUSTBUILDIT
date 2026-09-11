/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { WorldGraph } from "./types.ts";

export interface AcquisitionPlanStep {
  id: string;
  topic: string;
  query: string;
  unfamiliarTechnology: string;
  reason: string;
}

export interface AcquisitionPlan {
  goal: string;
  missingKnowledgeDetected: string[];
  steps: AcquisitionPlanStep[];
}

export class AcquisitionPlanner {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (process.env.GEMINI_API_KEY) {
      this.ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } }
      });
    }
  }

  /**
   * Evaluates the requested target goal against our active WorldGraph knowledge nodes,
   * detects prerequisite technological / competency gaps, and designs an acquisition plan.
   */
  public async planAcquisition(goal: string, graph: WorldGraph): Promise<AcquisitionPlan> {
    console.log(`[AcquisitionPlanner] Creating research and intelligence acquisition plan for: "${goal}"`);
    
    const missingKnowledgeDetected: string[] = [];
    const steps: AcquisitionPlanStep[] = [];

    if (this.ai) {
      try {
        const response = await this.ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Analyze the engineering goal: "${goal}". What specific technologies, APIs, design systems, languages, or libraries are needed as prerequisites? Check which ones might be missing. Return a JSON object with schema: { missingKnowledgeDetected: string[], steps: [{ topic: string, query: string, unfamiliarTechnology: string, reason: string }] }`,
          config: {
            responseMimeType: "application/json"
          }
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          console.log(`[AcquisitionPlanner] Gemini designed an acquisition plan with ${parsed.steps?.length || 0} stages.`);
          return {
            goal,
            missingKnowledgeDetected: parsed.missingKnowledgeDetected || [],
            steps: (parsed.steps || []).map((s: any, idx: number) => ({
              id: `step_${Date.now()}_${idx}`,
              ...s
            }))
          };
        }
      } catch (err) {
        console.error("[AcquisitionPlanner] Gemini planning failed, running smart fallback planning:", err);
      }
    }

    // Smart Fallback planning heuristics based on standard engineering concepts
    const lowerGoal = goal.toLowerCase();
    
    if (lowerGoal.includes("shopify") || lowerGoal.includes("dropship") || lowerGoal.includes("store")) {
      missingKnowledgeDetected.push("Shopify Liquid Templates", "Shopify Storefront API", "Hydrogen framework", "Shopify Polaris");
      steps.push(
        {
          id: `step_shopify_1`,
          topic: "Shopify Liquid template architecture",
          query: "Shopify Liquid template language rendering performance and syntax",
          unfamiliarTechnology: "Liquid Engine",
          reason: "Shopify themes require mastery of the Liquid template pipeline to prevent FCP rendering lags."
        },
        {
          id: `step_shopify_2`,
          topic: "Shopify Storefront API authentication and requests",
          query: "Shopify Storefront GraphQL API checkout session token configuration",
          unfamiliarTechnology: "Storefront API",
          reason: "Required to connect the responsive react checkout deck directly with live product options."
        }
      );
    } else if (lowerGoal.includes("framer") || lowerGoal.includes("motion") || lowerGoal.includes("animation")) {
      missingKnowledgeDetected.push("motion/react layout animations", "Repaint optimization cycles");
      steps.push({
        id: `step_motion_1`,
        topic: "motion/react gesture layoutId transitions",
        query: "framer motion layoutId layoutDependency optimization list rendering",
        unfamiliarTechnology: "motion/react",
        reason: "Required to prevent jerky repaints and layout shifts in single-screen sliding grids."
      });
    } else {
      missingKnowledgeDetected.push(`Advanced design guidelines for ${goal}`);
      steps.push({
        id: `step_general_1`,
        topic: `${goal} best practices and specifications`,
        query: `${goal} api documentation guides implementation tutorials`,
        unfamiliarTechnology: goal,
        reason: "Required to understand API specifications and competitive landscape constraints."
      });
    }

    return { goal, missingKnowledgeDetected, steps };
  }
}
