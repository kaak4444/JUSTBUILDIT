// src/core/event-mesh/AgentMeshV2.ts
import { EventBus } from "../event-bus/EventBus";

export class AgentMeshV2 {
  private agents: any[] = [];

  constructor(private bus: EventBus) {}

  register(agent: any) {
    this.agents.push(agent);
  }

  connect() {
    this.bus.on("ROUTE_SELECTED", async (event) => {
      const route = event.payload.route;

      const agent = this.agents.find(a =>
        a.capabilities?.includes(event.payload.original?.type) || a.intents?.includes(event.payload.original?.type)
      );

      if (!agent) {
        return this.bus.emit({
          type: "EXECUTION_FAILED",
          payload: { reason: "NO_AGENT_FOUND", event },
          meta: event.meta,
        });
      }

      try {
        const result = await agent.act(event.payload.original);

        await this.bus.emit({
          type: "TASK_COMPLETED",
          payload: result,
          meta: event.meta,
        });

      } catch (err) {
        await this.bus.emit({
          type: "EXECUTION_FAILED",
          payload: { error: err, event },
          meta: event.meta,
        });
      }
    });
  }
}
