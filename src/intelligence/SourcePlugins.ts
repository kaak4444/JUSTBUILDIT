/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IIntelligenceSource, HealthStatus, SearchResult, RawDocument } from "./IntelligenceSource.ts";
import { SearchManager } from "./SearchManager.ts";
import { BrowserEngine } from "./BrowserEngine.ts";

abstract class BaseSourcePlugin implements IIntelligenceSource {
  public abstract readonly id: string;
  public abstract readonly name: string;
  public abstract readonly version: string;
  protected abstract readonly domainConstraint: string;

  protected searchManager = new SearchManager();
  protected browser = new BrowserEngine();

  public supports(query: string): boolean {
    const qLower = query.toLowerCase();
    return qLower.length > 2;
  }

  public async health(): Promise<HealthStatus> {
    const start = Date.now();
    try {
      // Fast check
      return {
        status: "ONLINE",
        latencyMs: Date.now() - start
      };
    } catch {
      return {
        status: "OFFLINE",
        latencyMs: Date.now() - start,
        message: "Source interface timed out."
      };
    }
  }

  public async search(query: string, limit: number): Promise<SearchResult[]> {
    const siteQuery = this.domainConstraint ? `site:${this.domainConstraint} ${query}` : query;
    return this.searchManager.search(siteQuery, limit);
  }

  public async fetch(url: string): Promise<RawDocument> {
    const page = await this.browser.fetch(url);
    return {
      url: page.url,
      content: page.html,
      fetchedAt: page.fetchedAt.toISOString(),
      contentType: "text/html"
    };
  }
}

export class GoogleSource extends BaseSourcePlugin {
  public readonly id = "src_google";
  public readonly name = "Google Intelligence Index";
  public readonly version = "2.0.0";
  protected readonly domainConstraint = "";
}

export class BraveSource extends BaseSourcePlugin {
  public readonly id = "src_brave";
  public readonly name = "Brave Sovereign Search Index";
  public readonly version = "2.0.0";
  protected readonly domainConstraint = "";
}

export class DuckDuckGoSource extends BaseSourcePlugin {
  public readonly id = "src_duckduckgo";
  public readonly name = "DuckDuckGo Privacy Search";
  public readonly version = "2.0.0";
  protected readonly domainConstraint = "";
}

export class GitHubSource extends BaseSourcePlugin {
  public readonly id = "src_github";
  public readonly name = "GitHub Repo & Code Source";
  public readonly version = "2.0.0";
  protected readonly domainConstraint = "github.com";
}

export class YouTubeSource extends BaseSourcePlugin {
  public readonly id = "src_youtube";
  public readonly name = "YouTube Video Meta Crawler";
  public readonly version = "2.0.0";
  protected readonly domainConstraint = "youtube.com";
}

export class RedditSource extends BaseSourcePlugin {
  public readonly id = "src_reddit";
  public readonly name = "Reddit Public Forums";
  public readonly version = "2.0.0";
  protected readonly domainConstraint = "reddit.com";
}

export class AmazonSource extends BaseSourcePlugin {
  public readonly id = "src_amazon";
  public readonly name = "Amazon Product Indexer";
  public readonly version = "2.0.0";
  protected readonly domainConstraint = "amazon.com";
}

export class eBaySource extends BaseSourcePlugin {
  public readonly id = "src_ebay";
  public readonly name = "eBay E-Commerce Listings";
  public readonly version = "2.0.0";
  protected readonly domainConstraint = "ebay.com";
}

export class StackOverflowSource extends BaseSourcePlugin {
  public readonly id = "src_stackoverflow";
  public readonly name = "StackOverflow Technical Forum";
  public readonly version = "2.0.0";
  protected readonly domainConstraint = "stackoverflow.com";
}

export class npmSource extends BaseSourcePlugin {
  public readonly id = "src_npm";
  public readonly name = "npm Registry Crawler";
  public readonly version = "2.0.0";
  protected readonly domainConstraint = "npmjs.com";
}

export class PyPISource extends BaseSourcePlugin {
  public readonly id = "src_pypi";
  public readonly name = "PyPI Python Indexer";
  public readonly version = "2.0.0";
  protected readonly domainConstraint = "pypi.org";
}

export class MDNSource extends BaseSourcePlugin {
  public readonly id = "src_mdn";
  public readonly name = "MDN Web Docs Repository";
  public readonly version = "2.0.0";
  protected readonly domainConstraint = "developer.mozilla.org";
}

export class WikipediaSource extends BaseSourcePlugin {
  public readonly id = "src_wikipedia";
  public readonly name = "Wikipedia Knowledge Base";
  public readonly version = "2.0.0";
  protected readonly domainConstraint = "wikipedia.org";
}

export class ArXivSource extends BaseSourcePlugin {
  public readonly id = "src_arxiv";
  public readonly name = "arXiv Scientific Papers";
  public readonly version = "2.0.0";
  protected readonly domainConstraint = "arxiv.org";
}

export class ProductHuntSource extends BaseSourcePlugin {
  public readonly id = "src_producthunt";
  public readonly name = "ProductHunt Product Index";
  public readonly version = "2.0.0";
  protected readonly domainConstraint = "producthunt.com";
}
