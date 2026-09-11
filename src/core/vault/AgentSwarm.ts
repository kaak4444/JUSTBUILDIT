/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskRouter, OrchestrationTask } from "./TaskRouter";
import { LoadBalancer, ExecutionResult } from "./LoadBalancer";
import { ModelRegistry, ModelInstance } from "./ModelRegistry";

export interface SwarmConsensus {
  taskId: string;
  bestOutput: string;
  concatenatedConsensus: string;
  activeModelsCount: number;
  totalLatency: number;
  successRate: number;
  costTotalNominal: number;
  rawResults: ExecutionResult[];
}

export class AgentSwarm {
  private router = new TaskRouter();
  private balancer = new LoadBalancer();
  private registry = ModelRegistry.getInstance();

  /**
   * Routes a task, executes across the balanced candidate pool, builds consensus, and returns output
   */
  public async executeTask(task: OrchestrationTask): Promise<SwarmConsensus> {
    // 1. Determine candidate models
    const routedModels = this.router.route(task);

    // 2. Dispatch load-balanced execution across matching models
    const results = await this.balancer.execute(task, routedModels);

    // 3. Evaluate results & calculate performance
    const successfulResults = results.filter(r => r.success);
    const successRate = results.length > 0 ? successfulResults.length / results.length : 0;
    
    const totalLatency = results.reduce((sum, r) => sum + r.latency, 0);
    const avgLatency = results.length > 0 ? totalLatency / results.length : 0;

    // Nominal cost computation based on registered model specs
    const costTotalNominal = routedModels.reduce((sum, inst) => sum + (inst.metrics.costPerCall || 0.0001), 0);

    // Sort successful results by quality score (from registry) to choose the best one
    const bestOutputResult = [...successfulResults].sort((a, b) => {
      const modelA = this.registry.getAllInstances().find(i => i.id === a.instanceId);
      const modelB = this.registry.getAllInstances().find(i => i.id === b.instanceId);
      return (modelB?.metrics.qualityScore || 0) - (modelA?.metrics.qualityScore || 0);
    })[0];

    const bestOutput = bestOutputResult 
      ? bestOutputResult.output 
      : `[WARNING: SWARM FAILED TO BUILD CONSENSUS]
Task failed on all dispatched instances. Error dump: ${results.map(r => r.error).filter(Boolean).join(" | ")}`;

    // Build consensus display markdown
    const consensusRows = successfulResults.map(
      r => `### Response from [${r.provider} ${r.model}]\n${r.output}\n`
    );
    const concatenatedConsensus = consensusRows.length > 0 
      ? consensusRows.join("\n---\n") 
      : `No valid consensus could be reached.`;

    return {
      taskId: task.id,
      bestOutput,
      concatenatedConsensus,
      activeModelsCount: routedModels.length,
      totalLatency: Math.round(avgLatency),
      successRate,
      costTotalNominal,
      rawResults: results
    };
  }
}
