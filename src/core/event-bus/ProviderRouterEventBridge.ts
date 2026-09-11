// src/core/event-bus/ProviderRouterEventBridge.ts
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
        type: event.payload?.type || "reason",
        urgency: event.payload?.urgency || "medium",
        costSensitivity: event.payload?.costSensitivity || "medium",
        contextSize: event.payload?.contextSize || 1000,
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
