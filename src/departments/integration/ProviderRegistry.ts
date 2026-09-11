/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Connector, Health, Result } from "./types";
import { CredentialVault } from "./CredentialVault";

// Dynamic Simulated Connector Implementations
export class EtsyConnector implements Connector {
  id = "conn_etsy";
  provider = "Etsy";

  async authenticate(): Promise<void> {
    CredentialVault.set("etsy", {
      id: "cred_etsy",
      provider: "Etsy",
      token: `etsy_tok_${Math.random().toString(36).substr(2, 8)}`,
      expiry: new Date(Date.now() + 3600 * 24000).toISOString(),
      scopes: ["listings_w", "listings_r"]
    });
  }

  async publish(payload: any): Promise<Result> {
    return {
      success: true,
      id: `etsy_listing_${Math.floor(100000 + Math.random() * 900000)}`,
      url: `https://www.etsy.com/listing/demo_${Date.now()}`,
      message: `Draft Listing for '${payload.title || "Product"}' synchronized to Etsy successfully!`,
      timestamp: new Date().toISOString()
    };
  }

  async update(id: string, payload: any): Promise<Result> {
    return { success: true, message: `Etsy Listing ${id} updated: Title synchronized.`, timestamp: new Date().toISOString() };
  }

  async delete(id: string): Promise<Result> {
    return { success: true, message: `Etsy Listing ${id} deleted successfully.`, timestamp: new Date().toISOString() };
  }

  async upload(file: any): Promise<string> {
    return `https://images.etsy.com/mockups/demo_uploaded_file_${Date.now()}.png`;
  }

  async webhook(event: any): Promise<void> {
    // Process webhook
  }

  async health(): Promise<Health> {
    return {
      healthy: true,
      status: "Healthy",
      latencyMs: 145,
      lastChecked: new Date().toISOString()
    };
  }
}

export class ShopifyConnector implements Connector {
  id = "conn_shopify";
  provider = "Shopify";

  async authenticate(): Promise<void> {
    CredentialVault.set("shopify", {
      id: "cred_shopify",
      provider: "Shopify",
      token: `shpat_${Math.random().toString(36).substr(2, 8)}`,
      scopes: ["write_products", "write_inventory"]
    });
  }

  async publish(payload: any): Promise<Result> {
    return {
      success: true,
      id: `sh_prod_${Math.floor(100000000 + Math.random() * 900000000)}`,
      url: `https://demo-store.myshopify.com/products/${payload.handle || "digital-planner"}`,
      message: `Shopify Product '${payload.title || "Product"}' generated & inventory synchronized to Shopify store.`,
      timestamp: new Date().toISOString()
    };
  }

  async update(id: string, payload: any): Promise<Result> {
    return { success: true, message: `Shopify Product ${id} updated.`, timestamp: new Date().toISOString() };
  }

  async delete(id: string): Promise<Result> {
    return { success: true, message: `Shopify Product ${id} removed.`, timestamp: new Date().toISOString() };
  }

  async upload(file: any): Promise<string> {
    return `https://cdn.shopify.com/s/files/1/0000/0000/files/uploaded_asset_${Date.now()}.jpg`;
  }

  async webhook(event: any): Promise<void> {}

  async health(): Promise<Health> {
    return {
      healthy: true,
      status: "Healthy",
      latencyMs: 98,
      lastChecked: new Date().toISOString()
    };
  }
}

export class TikTokConnector implements Connector {
  id = "conn_tiktok";
  provider = "TikTok";

  async authenticate(): Promise<void> {
    CredentialVault.set("tiktok", {
      id: "cred_tiktok",
      provider: "TikTok",
      token: `tt_tok_${Math.random().toString(36).substr(2, 8)}`,
      expiry: new Date(Date.now() + 3600 * 24000).toISOString(),
      scopes: ["video.upload"]
    });
  }

  async publish(payload: any): Promise<Result> {
    // Check if expired to demo health/retry
    if (CredentialVault.isExpired("tiktok")) {
      return {
        success: false,
        message: "Authentication Failed: Token Expired. Need to authenticate or request renewal.",
        timestamp: new Date().toISOString()
      };
    }
    return {
      success: true,
      id: `tt_vid_${Math.floor(1000000 + Math.random() * 9000000)}`,
      url: `https://www.tiktok.com/@demo/video/${Date.now()}`,
      message: `Video with title '${payload.caption || "AuraPlanners Video"}' uploaded to TikTok account.`,
      timestamp: new Date().toISOString()
    };
  }

  async update(id: string, payload: any): Promise<Result> {
    return { success: false, message: "TikTok API does not allow editing captions after publish.", timestamp: new Date().toISOString() };
  }

  async delete(id: string): Promise<Result> {
    return { success: true, message: `Video ${id} set to private.`, timestamp: new Date().toISOString() };
  }

  async upload(file: any): Promise<string> {
    return `https://tiktok-demo-storage.s3.amazonaws.com/uploads/${Date.now()}.mp4`;
  }

  async webhook(event: any): Promise<void> {}

  async health(): Promise<Health> {
    const expired = CredentialVault.isExpired("tiktok");
    return {
      healthy: !expired,
      status: expired ? "Expired Token" : "Healthy",
      latencyMs: 312,
      lastChecked: new Date().toISOString(),
      errorMessage: expired ? "Bearer Token has expired. Refresh required." : undefined
    };
  }
}

export class AmazonKDPConnector implements Connector {
  id = "conn_kdp";
  provider = "Amazon KDP";

  async authenticate(): Promise<void> {
    CredentialVault.set("kdp", {
      id: "cred_kdp",
      provider: "Amazon KDP",
      token: "kdp_auth_cookie_active",
      scopes: ["book_creator", "metadata_editor"]
    });
  }

  async publish(payload: any): Promise<Result> {
    if (CredentialVault.isExpired("kdp")) {
      return {
        success: false,
        message: "Authentication Failed: Token Expired. Need to authenticate or request renewal.",
        timestamp: new Date().toISOString()
      };
    }
    return {
      success: true,
      id: `kdp_asin_${Math.random().toString(36).substr(2, 10).toUpperCase()}`,
      url: "https://kdp.amazon.com/bookshelf",
      message: `Paperback book '${payload.title || "Book"}' successfully created in drafts on Amazon KDP. manuscript and cover uploaded.`,
      timestamp: new Date().toISOString()
    };
  }

  async update(id: string, payload: any): Promise<Result> {
    return { success: true, message: `KDP Book metadata updated.`, timestamp: new Date().toISOString() };
  }

  async delete(id: string): Promise<Result> {
    return { success: false, message: "KDP Books cannot be fully deleted. Set to Unpublished.", timestamp: new Date().toISOString() };
  }

  async upload(file: any): Promise<string> {
    return "s3://kdp-manuscript-bucket/uploads/file.pdf";
  }

  async webhook(event: any): Promise<void> {}

  async health(): Promise<Health> {
    const expired = CredentialVault.isExpired("kdp");
    return {
      healthy: !expired,
      status: expired ? "Expired Token" : "Healthy",
      latencyMs: 182,
      lastChecked: new Date().toISOString(),
      errorMessage: expired ? "Session Token has expired. Refresh required." : undefined
    };
  }
}

export class ProviderRegistry {
  private static registry: Map<string, Connector> = new Map();

  static {
    // Bootstrap providers dynamically
    this.register("etsy", new EtsyConnector());
    this.register("shopify", new ShopifyConnector());
    this.register("tiktok", new TikTokConnector());
    this.register("amazon kdp", new AmazonKDPConnector());
  }

  public static register(provider: string, connector: Connector): void {
    this.registry.set(provider.toLowerCase(), connector);
  }

  public static get(provider: string): Connector | undefined {
    return this.registry.get(provider.toLowerCase());
  }

  public static getAll(): Connector[] {
    return Array.from(this.registry.values());
  }

  public static getSupportedProviders(): string[] {
    return [
      "Amazon KDP", "Shopify", "Whop", "Etsy", "eBay", "TikTok", "Instagram",
      "Facebook", "Pinterest", "LinkedIn", "YouTube", "X", "Discord", "Slack",
      "Google Drive", "Dropbox", "Notion", "GitHub", "Stripe", "PayPal",
      "Gmail", "Google Calendar", "Google Sheets", "Airtable", "Printful", "Printify"
    ];
  }
}
