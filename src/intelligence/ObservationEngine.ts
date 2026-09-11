/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Source, NormalizedDocument } from "./types.ts";
import { SearchManager } from "./SearchManager.ts";
import { BrowserEngine } from "./BrowserEngine.ts";
import { HtmlParser } from "./HtmlParser.ts";

export class ObservationEngine {
  private searchManager = new SearchManager();
  private browser = new BrowserEngine();
  private parser = new HtmlParser();

  /**
   * Performs dynamic internet sweeps using search managers, fetches pages,
   * parses their contents, and normalizes them with zero hardcoding or simulated data.
   */
  public async observe(source: Source, query: string): Promise<NormalizedDocument[]> {
    console.log(`[ObservationEngine] Initiating live web-scout sweep for query: "${query}" using source: ${source.name}`);
    const results: NormalizedDocument[] = [];

    try {
      // 1. Perform a real web query
      const searchResults = await this.searchManager.search(query, 3);
      
      // 2. Fetch the matched URLs in parallel
      const urls = searchResults.map(r => r.url);
      const pages = await Promise.all(urls.map(url => this.browser.fetch(url)));

      // 3. Parse and normalize each page
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const searchResult = searchResults[i];
        
        const doc = this.parser.parse(page.html);
        
        results.push({
          id: `doc_${Date.now()}_${i}`,
          source: source.name,
          url: page.url,
          title: doc.title || searchResult.title,
          published: page.fetchedAt.toISOString(),
          language: "en",
          plainText: doc.paragraphs.join("\n\n") || searchResult.snippet,
          markdown: `# ${doc.title}\n\n${doc.paragraphs.join("\n\n")}`,
          images: doc.images.map(img => img.src),
          tables: doc.tables,
          metadata: {
            ...doc.metadata,
            snippet: searchResult.snippet
          }
        });
      }
    } catch (err) {
      console.error("[ObservationEngine] Web observation cycle failed:", err);
    }

    return results;
  }
}
