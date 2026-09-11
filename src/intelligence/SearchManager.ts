/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SearchProvider, SearchResult } from "./SearchProvider.ts";
import { DuckDuckGoSearchProvider, GoogleGroundingSearchProvider } from "./SearchProviders.ts";

export class SearchManager {
  private providers: SearchProvider[] = [];

  constructor() {
    // Registered providers in order of priority/health
    this.providers = [
      new GoogleGroundingSearchProvider(),
      new DuckDuckGoSearchProvider()
    ];
  }

  public async search(query: string, limit = 10): Promise<SearchResult[]> {
    console.log(`[SearchManager] Initiating search for query: "${query}"`);
    
    for (const provider of this.providers) {
      if (await provider.health()) {
        try {
          console.log(`[SearchManager] Querying provider: ${provider.name}`);
          const results = await provider.search(query, limit);
          if (results && results.length > 0) {
            console.log(`[SearchManager] Successfully retrieved ${results.length} results from ${provider.name}`);
            return results;
          }
        } catch (err) {
          console.warn(`[SearchManager] Provider ${provider.name} failed. Trying next fallback...`, err);
        }
      }
    }

    throw new Error(`SearchManager failed: No search providers succeeded for query: "${query}"`);
  }
}
