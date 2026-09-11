// src/core/event-mesh/WorldState.ts
export class WorldState {
  businesses = new Map<string, any>();
  memory: Record<string, any> = {
    feedbackStore: {},
    tempData: {},
    logs: []
  };
  metrics = {
    revenue: 0,
    tasksCompleted: 0,
    activeAgents: 0
  };
}

export const globalWorldState = new WorldState();
