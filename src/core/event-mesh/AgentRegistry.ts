// src/core/event-mesh/AgentRegistry.ts
import { bootstrapSystem } from "./SystemBootstrap";
import { providerRouterV2 } from "../kernel/ProviderRouterV2";
import { MarketingAgent } from "./agents/MarketingAgent";
import { ResearchAgent } from "./agents/ResearchAgent";
import { PublishingAgent } from "./agents/PublishingAgent";
import { PricingAgent } from "./agents/PricingAgent";
import { AnalyticsAgent } from "./agents/AnalyticsAgent";

export function initializeAgentMesh() {
  const { mesh, bus } = bootstrapSystem(providerRouterV2);
  
  mesh.register(new MarketingAgent());
  mesh.register(new ResearchAgent());
  mesh.register(new PublishingAgent());
  mesh.register(new PricingAgent());
  mesh.register(new AnalyticsAgent());
  
  return { mesh, bus };
}
