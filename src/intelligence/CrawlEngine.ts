/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserEngine, BrowserPage } from "./BrowserEngine.ts";
import { HtmlParser, ParsedDocument } from "./HtmlParser.ts";

export interface CrawlFrontierNode {
  url: string;
  depth: number;
  discoveredFrom?: string;
  priority: number; // 1 to 10
  retryCount: number;
  discoveredAt: Date;
  scheduledAt: Date;
}

export interface CrawlResult {
  url: string;
  depth: number;
  parent?: string;
  page: BrowserPage;
  doc: ParsedDocument;
}

export class CrawlEngine {
  private browser = new BrowserEngine();
  private parser = new HtmlParser();

  private defaultMaxDepth = 2;
  private defaultMaxPages = 10;
  private crawlDelayMs = 200;

  /**
   * Performs recursive priority-frontier crawling.
   */
  public async crawl(
    seeds: string[],
    options?: { maxDepth?: number; maxPages?: number; allowedDomains?: string[] }
  ): Promise<CrawlResult[]> {
    const maxDepth = options?.maxDepth ?? this.defaultMaxDepth;
    const maxPages = options?.maxPages ?? this.defaultMaxPages;
    const allowedDomains = options?.allowedDomains || [];

    console.log(`[CrawlEngine] Active Frontier Crawl started. Seeds: ${seeds.join(", ")}`);

    const visited = new Set<string>();
    const frontier: CrawlFrontierNode[] = seeds.map(url => ({
      url,
      depth: 0,
      priority: 10, // Seeds are highest priority
      retryCount: 0,
      discoveredAt: new Date(),
      scheduledAt: new Date()
    }));

    const results: CrawlResult[] = [];

    while (frontier.length > 0 && results.length < maxPages) {
      // Sort to get highest priority node
      frontier.sort((a, b) => b.priority - a.priority);
      const node = frontier.shift()!;

      const normalizedUrl = this.normalizeUrl(node.url);
      if (visited.has(normalizedUrl)) continue;
      visited.add(normalizedUrl);

      // Verify domain limitations
      if (allowedDomains.length > 0) {
        let matched = false;
        try {
          const host = new URL(node.url).hostname;
          matched = allowedDomains.some(domain => host.includes(domain));
        } catch {}
        if (!matched) continue;
      }

      if (this.isBinaryAsset(node.url)) continue;

      console.log(`[CrawlEngine] Processing Frontier Node [Priority: ${node.priority}, Depth: ${node.depth}] -> ${node.url}`);

      try {
        const page = await this.browser.fetch(node.url);
        const doc = this.parser.parse(page.html);

        results.push({
          url: node.url,
          depth: node.depth,
          parent: node.discoveredFrom,
          page,
          doc
        });

        if (node.depth < maxDepth) {
          const currentHost = new URL(node.url).hostname;
          const links = doc.links;

          for (const link of links) {
            try {
              const linkUrl = new URL(link);
              // Limit domain recursion safety
              if (linkUrl.hostname === currentHost || linkUrl.hostname.includes("github.com") || linkUrl.hostname.includes("shopify")) {
                const resolvedLink = linkUrl.toString();
                if (!visited.has(this.normalizeUrl(resolvedLink))) {
                  const priority = this.calculateLinkPriority(resolvedLink);
                  frontier.push({
                    url: resolvedLink,
                    depth: node.depth + 1,
                    discoveredFrom: node.url,
                    priority,
                    retryCount: 0,
                    discoveredAt: new Date(),
                    scheduledAt: new Date()
                  });
                }
              }
            } catch {}
          }
        }

        // Respect rate limits with active delay
        await new Promise(resolve => setTimeout(resolve, this.crawlDelayMs));

      } catch (err: any) {
        console.error(`[CrawlEngine] Failed node: ${node.url}. Retries: ${node.retryCount}`, err.message);
        if (node.retryCount < 2) {
          node.retryCount++;
          node.priority = Math.max(1, node.priority - 2); // lower priority for failing routes
          frontier.push(node);
        }
      }
    }

    console.log(`[CrawlEngine] Frontier crawl completed. Extracted ${results.length} rich document representations.`);
    return results;
  }

  private calculateLinkPriority(url: string): number {
    const lower = url.toLowerCase();
    let priority = 5; // Default priority

    if (lower.includes("api") || lower.includes("graphql") || lower.includes("endpoint")) {
      priority += 3;
    }
    if (lower.includes("doc") || lower.includes("guide") || lower.includes("readme")) {
      priority += 2;
    }
    if (lower.includes("pricing") || lower.includes("plan") || lower.includes("subscribe")) {
      priority += 2;
    }
    if (lower.includes("feature") || lower.includes("changelog") || lower.includes("status")) {
      priority += 1;
    }
    if (lower.includes("contact") || lower.includes("about") || lower.includes("team")) {
      priority -= 1;
    }
    if (lower.includes("term") || lower.includes("privacy") || lower.includes("cookie")) {
      priority -= 3;
    }

    return Math.max(1, Math.min(10, priority));
  }

  private normalizeUrl(urlStr: string): string {
    try {
      const parsed = new URL(urlStr);
      parsed.hash = "";
      return parsed.toString();
    } catch {
      return urlStr;
    }
  }

  private isBinaryAsset(url: string): boolean {
    const lower = url.toLowerCase();
    return (
      lower.endsWith(".pdf") ||
      lower.endsWith(".zip") ||
      lower.endsWith(".png") ||
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".gif") ||
      lower.endsWith(".tar.gz")
    );
  }
}
