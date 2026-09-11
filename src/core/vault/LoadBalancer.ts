/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ModelInstance, ModelRegistry } from "./ModelRegistry";
import { OrchestrationTask } from "./TaskRouter";
import { ModelGateway } from "./ModelGateway";
import { OpenRouterProvider } from "./OpenRouterProvider";

export interface ExecutionResult {
  instanceId: string;
  provider: string;
  model: string;
  output: string;
  latency: number;
  success: boolean;
  error?: string;
}

export class LoadBalancer {
  private registry = ModelRegistry.getInstance();

  /**
   * Dispatches concurrent tasks across matched model keys
   */
  public async execute(task: OrchestrationTask, instances: ModelInstance[]): Promise<ExecutionResult[]> {
    const promises = instances.map(inst => this.executeOnInstance(task, inst));
    return await Promise.all(promises);
  }

  private async executeOnInstance(task: OrchestrationTask, instance: ModelInstance): Promise<ExecutionResult> {
    const start = Date.now();
    try {
      // 1. Instantiation of OpenRouterProvider wrapping standard configurations
      const providerInstance = new OpenRouterProvider(instance.id, instance.model, instance.apiKey);
      providerInstance.provider = instance.provider;

      const prompt = task.payload.prompt || `Process task parameters under category ${task.payload.category || "General"}`;

      // 2. Route request through Unified Model Gateway (for cost-tracking & rate safety limits)
      const response = await ModelGateway.getInstance().chat(providerInstance, {
        model: instance.model,
        messages: [{ role: "user", content: prompt }],
        metadata: { taskId: task.id }
      });

      // 3. Increment success metrics on registry
      this.registry.updateInstance(instance.id, {
        metrics: {
          ...instance.metrics,
          callsCount: instance.metrics.callsCount + 1
        }
      });

      const latency = Date.now() - start;

      return {
        instanceId: instance.id,
        provider: instance.provider,
        model: instance.model,
        output: response.text,
        latency,
        success: true
      };
    } catch (e: any) {
      // On failure, mark the instance as failed, prompting the self-replacement / self-heal trigger
      this.registry.updateInstance(instance.id, {
        status: "failed",
        metrics: {
          ...instance.metrics,
          successRate: parseFloat((instance.metrics.successRate * 0.8).toFixed(2))
        }
      });

      return {
        instanceId: instance.id,
        provider: instance.provider,
        model: instance.model,
        output: "",
        latency: Date.now() - start,
        success: false,
        error: e.message || "Endpoint connection failed"
      };
    }
  }
}
