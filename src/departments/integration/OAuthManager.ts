/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CredentialVault } from "./CredentialVault";
import { ProviderRegistry } from "./ProviderRegistry";

export class OAuthManager {
  /**
   * Simulates initiating and resolving an OAuth authentication flow for a platform.
   */
  public static async connect(providerKey: string): Promise<{ success: boolean; message: string }> {
    const key = providerKey.toLowerCase();
    const connector = ProviderRegistry.get(key);
    
    if (connector) {
      await connector.authenticate();
      return {
        success: true,
        message: `Successfully connected ${connector.provider} account using dynamic OAuth flow!`
      };
    } else {
      // Dynamic fallback for all other registry items
      const providers = ProviderRegistry.getSupportedProviders();
      const matched = providers.find(p => p.toLowerCase() === key);
      const displayName = matched || providerKey;
      
      CredentialVault.set(key, {
        id: `cred_${key}`,
        provider: displayName,
        token: `mock_live_oauth_token_${Math.random().toString(36).substr(2, 8)}`,
        expiry: new Date(Date.now() + 3600000 * 24).toISOString(),
        scopes: ["read_default", "write_default"]
      });

      return {
        success: true,
        message: `Provisioned credential mapping inside vault for ${displayName} successfully.`
      };
    }
  }

  /**
   * Force refreshes an expired credential token.
   */
  public static async refresh(providerKey: string): Promise<{ success: boolean; token: string }> {
    const cred = CredentialVault.get(providerKey);
    if (!cred) {
      throw new Error(`No credential located for ${providerKey}`);
    }

    const newToken = `${providerKey.toLowerCase()}_oauth_refreshed_${Math.random().toString(36).substr(2, 6)}`;
    CredentialVault.set(providerKey, {
      ...cred,
      token: newToken,
      expiry: new Date(Date.now() + 3600000 * 24).toISOString() // reset 24 hrs
    });

    return { success: true, token: newToken };
  }
}
