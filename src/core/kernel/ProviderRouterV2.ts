// src/core/kernel/ProviderRouterV2.ts
import { globalEventBus } from "../event-bus/EventBus";

export type TaskCapability =
  | "reason"
  | "research"
  | "creative"
  | "code"
  | "fast"
  | "cheap"
  | "long_context";

export type ProviderStatus = "healthy" | "degraded" | "cooldown" | "dead";

export type Provider = {
  id: string;
  model: string;
  costPerToken: number;
  latency: number;
  capabilities: TaskCapability[];
  status: ProviderStatus;

  quota: {
    remainingRequests: number;
    resetTime?: number;
  };

  failureCount: number;
  successCount: number;
  lastUsed: number;
};

export type RouteDecision = {
  providerId: string;
  model: string;
  reason: string;
  fallbackChain: string[];
};

export class ProviderRouterV2 {
  private providers: Map<string, Provider> = new Map();
  private cooldownMap: Map<string, number> = new Map();

  constructor(initialProviders: Provider[]) {
    for (const p of initialProviders) {
      this.providers.set(p.id, p);
    }
  }

  // -------------------------
  // PUBLIC ENTRY POINT
  // -------------------------
  public async route(task: {
    type: TaskCapability;
    urgency: "low" | "medium" | "high";
    costSensitivity: "low" | "medium" | "high";
    contextSize: number;
  }): Promise<RouteDecision> {
    const candidates = this.getHealthyProviders(task.type);

    if (candidates.length === 0) {
      return this.localFallback(task);
    }

    const scored = candidates
      .map((p) => ({
        provider: p,
        score: this.scoreProvider(p, task),
      }))
      .sort((a, b) => b.score - a.score);

    const best = scored[0]?.provider;

    if (!best) return this.localFallback(task);

    return {
      providerId: best.id,
      model: best.model,
      reason: this.explain(best, task),
      fallbackChain: scored.slice(1, 4).map((s) => s.provider.id),
    };
  }

  // -------------------------
  // SCORING ENGINE
  // -------------------------
  private scoreProvider(provider: Provider, task: any): number {
    let score = 100;

    // capability match
    if (!provider.capabilities.includes(task.type)) score -= 50;

    // status penalties
    if (provider.status === "degraded") score -= 20;
    if (provider.status === "cooldown") score -= 60;
    if (provider.status === "dead") score -= 100;

    // quota pressure
    if (provider.quota.remainingRequests < 5) score -= 40;

    // cost sensitivity
    if (task.costSensitivity === "low") {
      score -= provider.costPerToken * 100;
    }

    // latency preference
    if (task.urgency === "high") {
      score -= provider.latency * 0.5;
    }

    // failure history penalty
    score -= provider.failureCount * 5;

    // success reward
    score += provider.successCount * 2;

    return score;
  }

  // -------------------------
  // PROVIDER FILTERING
  // -------------------------
  private getHealthyProviders(type: TaskCapability): Provider[] {
    const now = Date.now();

    return Array.from(this.providers.values()).filter((p) => {
      const cooldownUntil = this.cooldownMap.get(p.id);

      if (cooldownUntil && cooldownUntil > now) return false;

      if (p.status === "dead") return false;

      return p.capabilities.includes(type);
    });
  }

  // -------------------------
  // FAILURE REPORTING
  // -------------------------
  public reportFailure(providerId: string) {
    const p = this.providers.get(providerId);
    if (!p) return;

    p.failureCount += 1;
    globalEventBus.emit({ type: "PROVIDER_FAILURE", payload: { providerId } });

    if (p.failureCount > 3) {
      this.cooldownMap.set(providerId, Date.now() + 60_000);
      p.status = "cooldown";
      globalEventBus.emit({ type: "QUOTA_WARNING", payload: { providerId } });
    }
  }

  public reportSuccess(providerId: string) {
    const p = this.providers.get(providerId);
    if (!p) return;

    p.successCount += 1;
    p.failureCount = Math.max(0, p.failureCount - 1);
    globalEventBus.emit({ type: "PROVIDER_SUCCESS", payload: { providerId } });
  }

  // -------------------------
  // LOCAL FALLBACK
  // -------------------------
  private localFallback(task: any): RouteDecision {
    return {
      providerId: "local-heuristic",
      model: "rule-engine",
      reason: "All providers failed or over quota. Using deterministic fallback engine.",
      fallbackChain: [],
    };
  }

  // -------------------------
  // EXPLANATION ENGINE
  // -------------------------
  private explain(provider: Provider, task: any): string {
    return `Selected ${provider.id} for ${task.type} due to best composite score under cost/latency/quota constraints.`;
  }
}

export const providerRouterV2 = new ProviderRouterV2([
  {
    id: "inst_nemotron_ultra",
    model: "nvidia/nemotron-3-ultra-550b-a55b:free",
    costPerToken: 0,
    latency: 30,
    capabilities: ["reason", "research", "creative", "code", "fast", "cheap", "long_context"],
    status: "healthy",
    quota: { remainingRequests: 100 },
    failureCount: 0,
    successCount: 0,
    lastUsed: 0
  },
  {
    id: "openrouter-free",
    model: "openrouter/free",
    costPerToken: 0,
    latency: 50,
    capabilities: ["reason", "research", "creative", "code", "fast", "cheap", "long_context"],
    status: "healthy",
    quota: { remainingRequests: 100 },
    failureCount: 0,
    successCount: 0,
    lastUsed: 0
  }
]);

