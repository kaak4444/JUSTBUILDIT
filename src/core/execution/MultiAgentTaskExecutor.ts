// src/core/execution/MultiAgentTaskExecutor.ts

import { agentRegistry } from "../agents/AgentRegistry";
import { eventBus } from "../event/EventBus";

export class MultiAgentTaskExecutor {

  async execute(task: any) {

    const typeMap: any = {
      "BOOK": ["RESEARCHER", "WRITER", "VALIDATOR"],
      "PRODUCT": ["RESEARCHER", "ANALYST", "MARKETER"],
      "DESIGN": ["DESIGNER", "VALIDATOR"],
    };

    const pipeline = typeMap[task.type] || ["RESEARCHER"];

    const stageOutputs: any[] = [];

    for (const stage of pipeline) {

      const agents = agentRegistry.getPool(stage, 3); // parallel swarm

      const results = await Promise.all(
        agents.map(agent => this.runAgent(agent, task, stage))
      );

      const best = this.selectBest(results);

      stageOutputs.push(best);

      eventBus.emit("STAGE_COMPLETED", {
        taskId: task.id,
        stage,
        result: best
      });
    }

    eventBus.emit("TASK_COMPLETED", {
      taskId: task.id,
      output: stageOutputs
    });

    return stageOutputs;
  }

  private async runAgent(agent: any, task: any, stage: string) {
    try {

      eventBus.emit("AGENT_STARTED", { agent: agent.id, task: task.id, stage });

      // simulate external AI call
      const response = await this.fakeLLMCall(agent, task, stage);

      return {
        agentId: agent.id,
        output: response,
        score: Math.random() * agent.skillScore
      };

    } catch (err) {
      eventBus.emit("AGENT_FAILED", { agent, task, err });
      return null;
    }
  }

  private async fakeLLMCall(agent: any, task: any, stage: string) {
    return `output-${stage}-${task.id}-${agent.id}`;
  }

  private selectBest(results: any[]) {
    return results
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)[0];
  }
}

export const multiAgentExecutor = new MultiAgentTaskExecutor();
