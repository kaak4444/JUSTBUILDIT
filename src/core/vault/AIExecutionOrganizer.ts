/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ModelRegistry, ModelInstance } from "./ModelRegistry";
import { APIHealthMonitor } from "./APIHealthMonitor";
import { AgentSwarm, SwarmConsensus } from "./AgentSwarm";
import { OrchestrationTask } from "./TaskRouter";

export interface AEOConfiguration {
  enabled: boolean;
  mode: "balanced" | "speed" | "quality" | "surprise";
  parallelismLevel: number; // 1 to 100
  autoReplaceBadAPI: boolean;
  selfTestFrequency: "every_10_tasks" | "hourly" | "daily";
  lastScanTime?: string;
}

export class AIExecutionOrganizer {
  private static instance: AIExecutionOrganizer | null = null;
  
  private registry = ModelRegistry.getInstance();
  private healthMonitor = new APIHealthMonitor();
  private swarm = new AgentSwarm();

  private config: AEOConfiguration = {
    enabled: true,
    mode: "balanced",
    parallelismLevel: 5,
    autoReplaceBadAPI: true,
    selfTestFrequency: "every_10_tasks"
  };

  private constructor() {
    this.loadConfig();
  }

  public static getInstance(): AIExecutionOrganizer {
    if (!AIExecutionOrganizer.instance) {
      AIExecutionOrganizer.instance = new AIExecutionOrganizer();
    }
    return AIExecutionOrganizer.instance;
  }

  private loadConfig() {
    try {
      const saved = localStorage.getItem("jbi_aeo_configuration");
      if (saved) {
        this.config = JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load AIExecutionOrganizer configuration:", e);
    }
  }

  public saveConfig(config: Partial<AEOConfiguration>) {
    this.config = { ...this.config, ...config };
    try {
      localStorage.setItem("jbi_aeo_configuration", JSON.stringify(this.config));
    } catch (e) {
      console.error("Failed to save AIExecutionOrganizer configuration:", e);
    }
  }

  public getConfig(): AEOConfiguration {
    return this.config;
  }

  public getRegistry(): ModelRegistry {
    return this.registry;
  }

  public getHealthMonitor(): APIHealthMonitor {
    return this.healthMonitor;
  }

  public getSwarm(): AgentSwarm {
    return this.swarm;
  }

  /**
   * Helper to perform automated self-healing on failure states or bad API replacement
   */
  public attemptAutoReplacement(instanceId: string): boolean {
    if (!this.config.autoReplaceBadAPI) return false;

    const instances = this.registry.getAllInstances();
    const target = instances.find(inst => inst.id === instanceId);
    if (!target) return false;

    // Search for a healthy model with the same credentials or duplicate instance that is active
    const duplicate = instances.find(inst => 
      inst.id !== instanceId && 
      inst.model === target.model && 
      inst.status === "active"
    );

    if (duplicate) {
      // Shift failed status to disabled and route traffic to working duplicate
      this.registry.updateInstance(target.id, { status: "disabled" });
      return true;
    }

    return false;
  }

  /**
   * Dispatches task through the swarm
   */
  public async executeTask(
    type: OrchestrationTask["type"],
    category: string,
    payload: any,
    complexity: number = 5,
    priority: number = 3
  ): Promise<SwarmConsensus> {
    const task: OrchestrationTask = {
      id: `task_aeo_${Math.random().toString(36).substring(2, 8)}`,
      type,
      complexity,
      priority,
      payload: { ...payload, category },
      mode: this.config.mode
    };

    return await this.swarm.executeTask(task);
  }

  /**
   * Directly executes a prepared orchestration task through the swarm
   */
  public async executeTaskDirectly(task: OrchestrationTask): Promise<SwarmConsensus> {
    return await this.swarm.executeTask(task);
  }
}
