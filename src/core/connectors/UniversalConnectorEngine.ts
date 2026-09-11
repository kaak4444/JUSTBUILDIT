// src/core/connectors/UniversalConnectorEngine.ts

import { connectorRegistry } from "./ConnectorRegistry";
import { eventBus } from "../event/EventBus";

export class UniversalConnectorEngine {

  async publish(payload: any) {

    const { targetPlatforms, contentType, data } = payload;

    const results: any[] = [];

    for (const platform of targetPlatforms) {

      const connector = connectorRegistry.getBest(platform);

      if (!connector) {
        eventBus.emit("CONNECTOR_MISSING", { platform });
        continue;
      }

      try {

        eventBus.emit("PUBLISH_STARTED", {
          platform,
          contentType
        });

        const result = await this.routePublish(connector, data);

        results.push({
          platform,
          success: true,
          result
        });

        eventBus.emit("PUBLISH_SUCCESS", {
          platform,
          result
        });

      } catch (err) {

        connector.failureCount += 1;

        eventBus.emit("PUBLISH_FAILED", {
          platform,
          error: err
        });

        results.push({
          platform,
          success: false
        });
      }
    }

    return results;
  }

  private async routePublish(connector: any, data: any) {

    switch (connector.platform) {

      case "SHOPIFY":
        return this.publishShopify(data);

      case "ETSY":
        return this.publishEtsy(data);

      case "AMAZON":
        return this.publishAmazon(data);

      case "TIKTOK":
        return this.publishTikTok(data);

      case "EBAY":
        return this.publishEbay(data);

      default:
        throw new Error("Unsupported platform");
    }
  }

  private async publishShopify(data: any) {
    // placeholder for real Shopify Admin API
    return { id: "shopify-product-id", status: "published" };
  }

  private async publishEtsy(data: any) {
    return { id: "etsy-listing-id", status: "published" };
  }

  private async publishAmazon(data: any) {
    return { id: "amazon-book-id", status: "published" };
  }

  private async publishTikTok(data: any) {
    return { id: "tiktok-post-id", status: "published" };
  }

  private async publishEbay(data: any) {
    return { id: "ebay-listing-id", status: "published" };
  }
}

export const universalConnector = new UniversalConnectorEngine();
