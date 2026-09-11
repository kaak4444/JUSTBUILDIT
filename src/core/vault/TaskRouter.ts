/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ModelInstance, ModelRegistry } from "./ModelRegistry";

export interface OrchestrationTask {
  id: string;
  type: "research" | "writing" | "design" | "analysis" | "seo" | "pricing" | "formatting";
  complexity: number; // Scale of 1 to 10
  priority: number; // Scale of 1 to 5
  payload: any;
  mode?: "balanced" | "speed" | "quality" | "surprise";
}

export const TASK_MODEL_MAP: Record<string, string[]> = {
  research: ["nemotron-3-ultra", "poolside/laguna", "gemma-4-31b", "nemotron-3-super", "emergency-llama-fallback"],
  writing: ["gpt-oss-120b", "gemma-4-31b", "nemotron-3-super", "nemotron-3-ultra"],
  design: ["gpt-oss-120b", "gemma-4-31b", "nemotron-3-ultra"],
  analysis: ["poolside/laguna", "nemotron-3-super", "gemma-4-31b", "gpt-oss-120b"],
  seo: ["gemma-4-26b", "llama-nemotron-embed", "nemotron-3-nano"],
  pricing: ["poolside/laguna", "gpt-oss-120b", "gemma-4-31b", "nemotron-3-nano"],
  formatting: ["llama-nemotron-embed", "gemma-4-26b", "nemotron-3-nano", "emergency-llama-fallback"]
};

export class TaskRouter {
  private registry = ModelRegistry.getInstance();

  /**
   * Identifies candidate models and matches best matching models according to strategy/mode preference
   */
  public route(task: OrchestrationTask): ModelInstance[] {
    const instances = this.registry.getAllInstances();
    let activeInstances = instances.filter(inst => inst.status === "active" || inst.status === "slow");

    if (activeInstances.length === 0) {
      // Emergency fallback to local sandbox mock instance
      return [
        {
          id: "emergency_fallback",
          provider: "Local Llama",
          model: "emergency-llama-fallback",
          apiKey: "local",
          status: "active",
          metrics: { avgLatency: 50, successRate: 1.0, qualityScore: 50, costPerCall: 0, callsCount: 1 }
        }
      ];
    }

    // 1. Filter active instances by task-model specialization capability map
    const specializedModels = TASK_MODEL_MAP[task.type] || [];
    let candidates = activeInstances.filter(inst => 
      specializedModels.some(modelName => inst.model.toLowerCase().includes(modelName.toLowerCase()))
    );

    // Resilient Fallback if no specialized models are currently registered or active
    if (candidates.length === 0) {
      candidates = activeInstances;
    }

    // Creative/Surprise mode swaps/shuffles randomly to create alternative branching choices
    if (task.mode === "surprise") {
      return [...candidates].sort(() => Math.random() - 0.5).slice(0, 3);
    }

    const sorted = [...candidates].sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      if (task.mode === "speed") {
        // Latency dominates preference
        scoreA = (10000 / a.metrics.avgLatency) * 0.8 + a.metrics.successRate * 20;
        scoreB = (10000 / b.metrics.avgLatency) * 0.8 + b.metrics.successRate * 20;
      } else if (task.mode === "quality") {
        // Quality Score dominates preference
        scoreA = a.metrics.qualityScore * 0.8 + a.metrics.successRate * 20;
        scoreB = b.metrics.qualityScore * 0.8 + b.metrics.successRate * 20;
      } else {
        // Balanced strategy
        const qualityWeight = task.complexity >= 7 ? 0.5 : 0.3;
        const latencyWeight = task.complexity >= 7 ? 0.2 : 0.4;
        const successWeight = 0.3;

        scoreA = 
          (a.metrics.qualityScore * qualityWeight) +
          ((10000 / a.metrics.avgLatency) * latencyWeight) +
          (a.metrics.successRate * 100 * successWeight);

        scoreB = 
          (b.metrics.qualityScore * qualityWeight) +
          ((10000 / b.metrics.avgLatency) * latencyWeight) +
          (b.metrics.successRate * 100 * successWeight);
      }

      return scoreB - scoreA;
    });

    // Take top 3 suitable models for swarm consensus, or 1 if priority/complexity is low
    const countNeeded = task.complexity >= 8 || task.priority >= 4 ? 3 : 2;
    return sorted.slice(0, Math.min(countNeeded, sorted.length));
  }
}
