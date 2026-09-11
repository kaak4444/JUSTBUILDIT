// src/core/agents/AgentRegistry.ts

export type AgentType =
  | "RESEARCHER"
  | "WRITER"
  | "DESIGNER"
  | "MARKETER"
  | "ANALYST"
  | "VALIDATOR";

export interface Agent {
  id: string;
  type: AgentType;
  skillScore: number; // dynamic performance score
  apiProvider: string;
  apiKeyId: string;
  lastUsed: number;
  failureRate: number;
}

export class AgentRegistry {
  private agents: Agent[] = [];

  register(agent: Agent) {
    this.agents.push(agent);
  }

  getBest(agentType: AgentType) {
    return this.agents
      .filter(a => a.type === agentType)
      .sort((a, b) => (b.skillScore - b.failureRate) - (a.skillScore - a.failureRate))[0];
  }

  getPool(agentType: AgentType, count: number) {
    return this.agents
      .filter(a => a.type === agentType)
      .sort((a, b) => b.skillScore - a.skillScore)
      .slice(0, count);
  }
}

export const agentRegistry = new AgentRegistry();
