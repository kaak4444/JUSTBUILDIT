/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Agent, TaskResult } from "./WorkerTypes";
import { TaskNode } from "../tasking/TaskNode";
import { BaseAgentWorker } from "./AgentWorker";

export class AgentPool {
  private static instance: AgentPool | null = null;
  private agents: Map<string, Agent[]> = new Map();

  private constructor() {
    this.registerDefaultPool();
  }

  public static getInstance(): AgentPool {
    if (!AgentPool.instance) {
      AgentPool.instance = new AgentPool();
    }
    return AgentPool.instance;
  }

  public register(agent: Agent): void {
    if (!this.agents.has(agent.type)) {
      this.agents.set(agent.type, []);
    }
    this.agents.get(agent.type)!.push(agent);
  }

  public listAgents(): Agent[] {
    const list: Agent[] = [];
    this.agents.forEach(arr => list.push(...arr));
    return list;
  }

  public async dispatch(task: TaskNode): Promise<TaskResult> {
    const available = this.agents.get(task.type) || [];
    if (available.length === 0) {
      // Dynamic fallback creation to prevent deadlocks
      const fallback = new BaseAgentWorker(
        `dyn_${task.type.toLowerCase()}_${Math.random().toString(36).substring(2, 5)}`,
        `Dynamic ${task.type} Agent`,
        task.type,
        3
      );
      this.register(fallback);
      available.push(fallback);
    }

    // Pick least loaded agent or random
    const agent = this.selectBestAgent(available);
    task.assignedAgentId = agent.id;
    return await agent.execute(task);
  }

  private selectBestAgent(agents: Agent[]): Agent {
    // Return agent with least tasks currently running
    return agents.reduce((best, curr) => {
      if (curr.currentTasksCount < best.currentTasksCount) return curr;
      return best;
    }, agents[0]);
  }

  private registerDefaultPool(): void {
    // 1. Research swarm
    this.register(new BaseAgentWorker("ag_scout_1", "Trend Scout", "RESEARCH", 3));
    this.register(new BaseAgentWorker("ag_crawler_2", "Review Crawler Swarm", "RESEARCH", 5));
    this.register(new BaseAgentWorker("ag_analyzer_3", "Complaint Grapher", "RESEARCH", 3));

    // 2. Writing authors
    this.register(new BaseAgentWorker("ag_outline_1", "Book Planner Outline Engine", "WRITER", 2));
    this.register(new BaseAgentWorker("ag_novelist_2", "Primary Prose Writer", "WRITER", 2));
    this.register(new BaseAgentWorker("ag_editor_3", "Grammar Auditor", "WRITER", 3));

    // 3. Creative Studio
    this.register(new BaseAgentWorker("ag_art_1", "Art Director Composition Core", "DESIGN", 2));
    this.register(new BaseAgentWorker("ag_color_2", "Color Psychology Palette Synthesizer", "DESIGN", 4));

    // 4. Marketing & SEO
    this.register(new BaseAgentWorker("ag_keywords_1", "SEO Tag Harvester", "SEO", 4));
    this.register(new BaseAgentWorker("ag_pricing_1", "Financial Margin Architect", "PRICING", 3));

    // 5. Publisher compiling
    this.register(new BaseAgentWorker("ag_pdf_comp_1", "PDF Canvas Compiler", "FORMATTER", 4));
    this.register(new BaseAgentWorker("ag_kdp_connector_1", "KDP Direct Sync Agent", "PUBLISH", 2));
  }
}
