// src/core/connectors/ConnectorRegistry.ts

export type Platform =
  | "SHOPIFY"
  | "ETSY"
  | "AMAZON"
  | "EBAY"
  | "TIKTOK"
  | "WHOP";

export interface Connector {
  platform: Platform;
  name: string;
  status: "ACTIVE" | "DEGRADED" | "FAILED";

  capabilities: {
    publish: boolean;
    update: boolean;
    delete: boolean;
    analytics: boolean;
  };

  apiKeyId: string;
  lastHealthCheck: number;
  failureCount: number;
}

export class ConnectorRegistry {
  private connectors: Connector[] = [];

  register(connector: Connector) {
    this.connectors.push(connector);
  }

  getActive(platform: Platform) {
    return this.connectors.filter(
      c => c.platform === platform && c.status === "ACTIVE"
    );
  }

  getBest(platform: Platform) {
    return this.getActive(platform)
      .sort((a, b) => a.failureCount - b.failureCount)[0];
  }

  getAll() {
    return this.connectors;
  }
}

export const connectorRegistry = new ConnectorRegistry();
