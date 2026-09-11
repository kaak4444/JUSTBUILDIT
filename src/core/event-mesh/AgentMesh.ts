// src/core/event-mesh/AgentMesh.ts
import { EventBus, Event } from "./EventBus";

export class AgentMesh {
  private agents: any[] = [];

  constructor(private bus: EventBus) {}

  register(agent: any) {
    this.agents.push(agent);
  }

  connect() {
    this.bus.on("ROUTE_SELECTED", async (event: Event) => {
      const route = event.payload.route;

      const agent = this.agents.find(a =>
        a.capabilities && a.capabilities.includes(event.payload.original.type)
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
