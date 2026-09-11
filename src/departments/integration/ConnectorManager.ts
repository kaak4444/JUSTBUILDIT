/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProviderRegistry } from "./ProviderRegistry";
import { CredentialVault } from "./CredentialVault";
import { Result, Health, Job } from "./types";

export class ConnectorManager {
  private static activeJobs: Job[] = [];

  public static async publish(provider: string, payload: any): Promise<Result> {
    const connector = ProviderRegistry.get(provider);
    if (!connector) {
      return {
        success: false,
        message: `Connector not found for provider: ${provider}`,
        timestamp: new Date().toISOString()
      };
    }

    // Add job to memory tracking for monitoring
    const job: Job = {
      id: `job_${Math.random().toString(36).substr(2, 9)}`,
      provider: connector.provider,
      action: "publish",
      payload,
      status: "PENDING",
      retries: 0,
      maxRetries: 3,
      timestamp: new Date().toISOString()
    };
    this.activeJobs.push(job);

    try {
      job.status = "PROCESSING";
      const result = await connector.publish(payload);
      if (result.success) {
        job.status = "COMPLETED";
      } else {
        job.status = "FAILED";
        job.errorMessage = result.message;
      }
      return result;
    } catch (err: any) {
      job.status = "FAILED";
      job.errorMessage = err.message || String(err);
      return {
        success: false,
        message: `Exception in ${provider} publish: ${job.errorMessage}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  public static async checkHealth(provider: string): Promise<Health> {
    const connector = ProviderRegistry.get(provider);
    if (!connector) {
      return {
        healthy: false,
        status: "Disconnected",
        latencyMs: 0,
        lastChecked: new Date().toISOString(),
        errorMessage: "Provider not configured"
      };
    }
    return await connector.health();
  }

  public static getJobs(): Job[] {
    return this.activeJobs;
  }

  public static clearJobs(): void {
    this.activeJobs = [];
  }
}
