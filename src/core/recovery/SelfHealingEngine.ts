// src/core/recovery/SelfHealingEngine.ts
import { EventBus } from "../event-bus/EventBus";
import { ProviderRouterV2 } from "../kernel/ProviderRouterV2";

export class SelfHealingEngine {
  constructor(
    private bus: EventBus,
    private router: ProviderRouterV2
  ) {}

  register() {

    this.bus.on("EXECUTION_FAILED", async (event) => {
      const retry = (event.meta?.retry || 0) + 1;

      if (retry > 3) {
        return this.bus.emit({
          type: "TASK_DEAD",
          payload: event.payload,
          meta: event.meta,
        });
      }

      await this.bus.emit({
        type: "TASK_RETRYING",
        payload: {
          original: event.payload,
          retry,
        },
        meta: {
          ...event.meta,
          retry,
        },
      });

      // 🔥 SELF HEAL STRATEGY SELECTION
      const degradedRoute = await this.router.route({
        type: "fast",
        urgency: "high",
        costSensitivity: "low",
        contextSize: 0,
      });

      await this.bus.emit({
        type: "TASK_REQUESTED",
        payload: {
          ...event.payload.original,
          retryMode: true,
          forcedRoute: degradedRoute,
        },
        meta: {
          ...event.meta,
          retry,
        },
      });
    });


    this.bus.on("TASK_COMPLETED", async (event) => {
      await this.bus.emit({
        type: "MEMORY_WRITE",
        payload: event.payload,
        meta: event.meta,
      });
    });

  }
}
