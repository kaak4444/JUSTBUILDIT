/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ResearchSource {
  id: string;
  name: string;
  kind: "marketplace" | "social" | "ads" | "forum" | "trend";
  trust: number; // 0.0 to 1.0 trust index
  cost: number;  // 1 to 100 cost rating
  speed: number; // 1 to 100 speed rating
  supportsRealtime: boolean;
  latency?: number; // ms
  rateLimit?: string; // "High" | "Medium" | "Low"
  updatedAt?: number;
}

export class SourceRegistry {
  private sources: Map<string, ResearchSource> = new Map();

  constructor() {
    this.prepopulateRegistry();
  }

  private prepopulateRegistry() {
    const defaultSources: ResearchSource[] = [
      {
        id: "google_trends",
        name: "Google Trends",
        kind: "trend",
        trust: 0.98,
        cost: 10,
        speed: 90,
        supportsRealtime: true,
        latency: 120,
        rateLimit: "High",
        updatedAt: Date.now()
      },
      {
        id: "tiktok",
        name: "TikTok Insights",
        kind: "social",
        trust: 0.81,
        cost: 20,
        speed: 50,
        supportsRealtime: false,
        latency: 1400,
        rateLimit: "Medium",
        updatedAt: Date.now()
      },
      {
        id: "reddit",
        name: "Reddit Communities",
        kind: "forum",
        trust: 0.67,
        cost: 5,
        speed: 80,
        supportsRealtime: true,
        latency: 450,
        rateLimit: "High",
        updatedAt: Date.now()
      },
      {
        id: "whop",
        name: "Whop Marketplace",
        kind: "marketplace",
        trust: 0.93,
        cost: 15,
        speed: 85,
        supportsRealtime: true,
        latency: 320,
        rateLimit: "Medium",
        updatedAt: Date.now()
      },
      {
        id: "etsy",
        name: "Etsy Analytics",
        kind: "marketplace",
        trust: 0.96,
        cost: 12,
        speed: 75,
        supportsRealtime: false,
        latency: 550,
        rateLimit: "Medium",
        updatedAt: Date.now()
      },
      {
        id: "product_hunt",
        name: "Product Hunt",
        kind: "marketplace",
        trust: 0.91,
        cost: 10,
        speed: 82,
        supportsRealtime: true,
        latency: 380,
        rateLimit: "High",
        updatedAt: Date.now()
      }
    ];

    defaultSources.forEach(s => this.sources.set(s.id, s));
  }

  /**
   * Adds or updates a source in the registry
   */
  registerSource(src: ResearchSource) {
    this.sources.set(src.id, {
      ...src,
      updatedAt: Date.now()
    });
  }

  /**
   * Fetches a single source's stats
   */
  getSource(id: string): ResearchSource | undefined {
    return this.sources.get(id.toLowerCase());
  }

  /**
   * Returns all available sources
   */
  listSources(): ResearchSource[] {
    return Array.from(this.sources.values());
  }

  /**
   * Dynamically adjusts a source's trust score based on verified versus disputed facts.
   * Decrements trust if claims from this source are contradicted, increments on successful verification consensus.
   */
  adjustTrust(id: string, success: boolean) {
    const src = this.sources.get(id.toLowerCase());
    if (src) {
      const delta = success ? 0.01 : -0.03;
      src.trust = Math.min(1.0, Math.max(0.1, Number((src.trust + delta).toFixed(2))));
      src.updatedAt = Date.now();
    }
  }
}
