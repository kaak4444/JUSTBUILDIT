// src/core/bootstrap.ts
import { EventBus } from "./event-bus/EventBus";
import { ProviderRouterEventBridge } from "./event-bus/ProviderRouterEventBridge";
import { AgentMeshV2 } from "./event-mesh/AgentMeshV2";
import { SelfHealingEngine } from "./recovery/SelfHealingEngine";
import { ProviderRouterV2, providerRouterV2 } from "./kernel/ProviderRouterV2";

export function bootstrapSystem(router: ProviderRouterV2) {
  const bus = new EventBus();

  const bridge = new ProviderRouterEventBridge(router, bus);
  const mesh = new AgentMeshV2(bus);
  const healer = new SelfHealingEngine(bus, router);

  bridge.register(bus);
  mesh.connect();
  healer.register();

  return {
    bus,
    mesh,
    router,
  };
}

export const system = bootstrapSystem(providerRouterV2);
