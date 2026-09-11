/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Credential } from "./types";

export class CredentialVault {
  private static credentials: Map<string, Credential> = new Map();

  static {
    // Seed with standard connections for demo/user experience
    this.credentials.set("etsy", {
      id: "cred_etsy",
      provider: "Etsy",
      token: "etsy_oauth_token_v4_active_39401",
      refreshToken: "etsy_refresh_token_xyz_9940",
      expiry: new Date(Date.now() + 3600000 * 24).toISOString(), // 24 hours
      scopes: ["listings_w", "listings_r", "transactions_r"]
    });

    this.credentials.set("shopify", {
      id: "cred_shopify",
      provider: "Shopify",
      token: "shpat_active_admin_key_902341",
      expiry: new Date(Date.now() + 3600000 * 48).toISOString(), // 48 hours
      scopes: ["write_products", "read_orders", "write_inventory"]
    });

    this.credentials.set("tiktok", {
      id: "cred_tiktok",
      provider: "TikTok",
      token: "tiktok_act_bearer_token_93021",
      refreshToken: "tiktok_ref_3019",
      expiry: new Date(Date.now() - 5000).toISOString(), // Simulated Expired for Demo
      scopes: ["video.upload", "video.list", "user.info"]
    });

    this.credentials.set("stripe", {
      id: "cred_stripe",
      provider: "Stripe",
      token: "sk_live_51NxyzBrandActiveKey",
      scopes: ["charges.write", "products.write"]
    });

    this.credentials.set("kdp", {
      id: "cred_kdp",
      provider: "Amazon KDP",
      token: "kdp_session_cookie_expired_88301",
      refreshToken: "kdp_ref_9320",
      expiry: new Date(Date.now() - 10000).toISOString(), // Expired for Demo
      scopes: ["book_creator", "metadata_editor"]
    });
  }

  public static get(providerKey: string): Credential | undefined {
    return this.credentials.get(providerKey.toLowerCase());
  }

  public static set(providerKey: string, cred: Credential): void {
    this.credentials.set(providerKey.toLowerCase(), cred);
  }

  public static getAll(): Credential[] {
    return Array.from(this.credentials.values());
  }

  public static remove(providerKey: string): boolean {
    return this.credentials.delete(providerKey.toLowerCase());
  }

  public static isExpired(providerKey: string): boolean {
    const cred = this.get(providerKey);
    if (!cred || !cred.expiry) return false;
    return new Date(cred.expiry) < new Date();
  }
}
