/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WebhookConfig {
  id: string;
  provider: string;
  url: string;
  events: string[];
  active: boolean;
}

export class WebhookManager {
  private static endpoints: WebhookConfig[] = [
    {
      id: "wh_etsy_order",
      provider: "Etsy",
      url: "https://justbuildit.ai/api/v1/webhooks/etsy",
      events: ["order.created", "order.refunded"],
      active: true
    },
    {
      id: "wh_shopify_product",
      provider: "Shopify",
      url: "https://justbuildit.ai/api/v1/webhooks/shopify",
      events: ["product.updated", "inventory.low"],
      active: true
    }
  ];

  public static getEndpoints(): WebhookConfig[] {
    return this.endpoints;
  }

  public static add(provider: string, url: string, events: string[]): WebhookConfig {
    const config: WebhookConfig = {
      id: `wh_${Math.random().toString(36).substr(2, 5)}`,
      provider,
      url,
      events,
      active: true
    };
    this.endpoints.push(config);
    return config;
  }

  public static toggle(id: string): void {
    const ep = this.endpoints.find(e => e.id === id);
    if (ep) {
      ep.active = !ep.active;
    }
  }

  /**
   * Simulates a real-time incoming webhook event being triggered from Etsy or Shopify
   */
  public static simulateIncoming(provider: string, eventName: string): any {
    const timestamp = new Date().toISOString();
    if (provider.toLowerCase() === "etsy") {
      return {
        event: eventName,
        timestamp,
        data: {
          receipt_id: `rec_${Math.floor(1000000 + Math.random() * 9000000)}`,
          buyer_email: "customer@example.com",
          currency_code: "USD",
          total_price: "14.00",
          items: [{ title: "AuraPlanners 2026 Daily Digital Planner", quantity: 1 }]
        }
      };
    } else {
      return {
        event: eventName,
        timestamp,
        data: {
          order_id: `sh_ord_${Math.floor(100000 + Math.random() * 900000)}`,
          customer_name: "Sarah Jenkins",
          total_price: "18.00",
          fulfillment_status: "unfulfilled",
          line_items: [{ title: "Swiss Minimalist Layout PDF Asset", price: "18.00" }]
        }
      };
    }
  }
}
