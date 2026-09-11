// src/core/connectors/AIConnectorRouter.ts

import { connectorRegistry } from "./ConnectorRegistry";

export class AIConnectorRouter {

  selectBestPlatform(task: any) {

    const map: any = {
      BOOK: ["AMAZON", "WHOP"],
      DIGITAL_PRODUCT: ["SHOPIFY", "ETSY", "WHOP"],
      VIDEO_CONTENT: ["TIKTOK"],
      ECOMMERCE: ["SHOPIFY", "EBAY"]
    };

    return map[task.type] || ["SHOPIFY"];
  }

  selectBestConnector(platform: string) {
    return connectorRegistry.getBest(platform as any);
  }

  validateConnectorHealth(connector: any) {

    if (connector.failureCount > 3) {
      return false;
    }

    if (Date.now() - connector.lastHealthCheck > 1000 * 60 * 10) {
      return false;
    }

    return true;
  }
}

export const aiConnectorRouter = new AIConnectorRouter();
