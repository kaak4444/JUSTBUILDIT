/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ModelInstance, ModelRegistry } from "./ModelRegistry";

export class APIHealthMonitor {
  private registry = ModelRegistry.getInstance();

  /**
   * Run a simulation batch check (self-test) on an active instance
   */
  public async testInstance(instance: ModelInstance): Promise<ModelInstance> {
    const latencyHistory: number[] = [];
    const testCount = 3;
    let successfulCalls = 0;

    for (let i = 0; i < testCount; i++) {
      const start = Date.now();
      try {
        // Simulate real latency/verification request to endpoints
        const delay = 300 + Math.random() * 800;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Simulating some failed calls on invalid credentials
        if (instance.apiKey.includes("XXXX") && Math.random() < 0.3) {
          throw new Error("Rate limit exceeded or Invalid credential formatting.");
        }

        const latency = Date.now() - start;
        latencyHistory.push(latency);
        successfulCalls++;
      } catch (e) {
        latencyHistory.push(5000); // Penalty latency
      }
    }

    const successRate = successfulCalls / testCount;
    const avgLatency = Math.round(latencyHistory.reduce((a, b) => a + b, 0) / testCount);

    const updatedMetrics = {
      ...instance.metrics,
      avgLatency,
      successRate: parseFloat((successRate * 0.4 + instance.metrics.successRate * 0.6).toFixed(2)),
      callsCount: instance.metrics.callsCount + testCount
    };

    let newStatus = instance.status;
    if (successRate === 0) {
      newStatus = "failed";
    } else if (avgLatency > 2500) {
      newStatus = "slow";
    } else {
      newStatus = "active";
    }

    this.registry.updateInstance(instance.id, {
      status: newStatus,
      metrics: updatedMetrics
    });

    const found = this.registry.getAllInstances().find(inst => inst.id === instance.id);
    return found || instance;
  }

  /**
   * Scans and updates all models in the pool
   */
  public async scanAllInstances(onProgress?: (progress: number, msg: string) => void): Promise<ModelInstance[]> {
    const instances = this.registry.getAllInstances();
    const results: ModelInstance[] = [];

    for (let i = 0; i < instances.length; i++) {
      const inst = instances[i];
      if (onProgress) {
        onProgress(
          Math.round((i / instances.length) * 100),
          `Self-checking ${inst.provider} ${inst.model} latency margins...`
        );
      }
      const updated = await this.testInstance(inst);
      results.push(updated);
    }

    if (onProgress) {
      onProgress(100, "All micro-endpoint diagnostics successfully completed.");
    }

    return results;
  }
}
