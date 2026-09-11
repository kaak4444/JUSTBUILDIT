// src/core/event-mesh/ProviderRouterEventBridge.ts
import { ProviderRouterV2 } from "../kernel/ProviderRouterV2";
import { EventBus } from "./EventBus";

export class ProviderRouterEventBridge {
  constructor(
    private router: ProviderRouterV2,
    private bus: EventBus
  ) {}

  register(bus: EventBus) {
    bus.on("TASK_REQUESTED", async (event) => {
      const route = await this.router.route({
        type: event.payload.type || "fast",
        urgency: event.payload.urgency || "medium",
        costSensitivity: event.payload.costSensitivity || "medium",
        contextSize: event.payload.contextSize || 0,
      });

      await bus.emit({
        type: "ROUTE_SELECTED",
        payload: {
          taskId: event.meta?.taskId,
          route,
          original: event.payload,
        },
      });
    });
  }
}
