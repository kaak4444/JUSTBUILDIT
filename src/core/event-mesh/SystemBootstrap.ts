// src/core/event-mesh/SystemBootstrap.ts
import { EventBus } from "./EventBus";
import { ProviderRouterEventBridge } from "./ProviderRouterEventBridge";
import { AgentMesh } from "./AgentMesh";
import { SelfHealingEngine } from "./SelfHealingEngine";
import { ProviderRouterV2 } from "../kernel/ProviderRouterV2";

export function bootstrapSystem(router: ProviderRouterV2) {
  const bus = new EventBus();

  const bridge = new ProviderRouterEventBridge(router, bus);
  const mesh = new AgentMesh(bus);
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
