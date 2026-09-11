/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Source } from "./types.ts";
import { IIntelligenceSource } from "./IntelligenceSource.ts";
import {
  GoogleSource,
  BraveSource,
  DuckDuckGoSource,
  GitHubSource,
  YouTubeSource,
  RedditSource,
  AmazonSource,
  eBaySource,
  StackOverflowSource,
  npmSource,
  PyPISource,
  MDNSource,
  WikipediaSource,
  ArXivSource,
  ProductHuntSource
} from "./SourcePlugins.ts";

export class SourceRegistry {
  private sources: Map<string, Source> = new Map();
  private plugins: Map<string, IIntelligenceSource> = new Map();

  constructor() {
    this.registerDefaultSources();
  }

  private registerDefaultSources() {
    // Register plugins
    const list: IIntelligenceSource[] = [
      new GoogleSource(),
      new BraveSource(),
      new DuckDuckGoSource(),
      new GitHubSource(),
      new YouTubeSource(),
      new RedditSource(),
      new AmazonSource(),
      new eBaySource(),
      new StackOverflowSource(),
      new npmSource(),
      new PyPISource(),
      new MDNSource(),
      new WikipediaSource(),
      new ArXivSource(),
      new ProductHuntSource()
    ];

    for (const plugin of list) {
      this.plugins.set(plugin.id, plugin);

      // Backwards compatible traditional metadata Source
      this.sources.set(plugin.id, {
        id: plugin.id,
        name: plugin.name,
        priority: plugin.id === "src_google" || plugin.id === "src_brave" ? 10 : 7,
        enabled: true,
        rateLimit: 60,
        capabilities: ["crawling", "acquisition", "research"]
      });
    }
  }

  public registerSource(source: Source): void {
    this.sources.set(source.id, source);
  }

  public getSource(id: string): Source | undefined {
    return this.sources.get(id);
  }

  public listEnabledSources(): Source[] {
    return Array.from(this.sources.values()).filter(s => s.enabled);
  }

  public listAllSources(): Source[] {
    return Array.from(this.sources.values());
  }

  public updateSourceStatus(id: string, enabled: boolean): boolean {
    const src = this.sources.get(id);
    if (src) {
      src.enabled = enabled;
      return true;
    }
    return false;
  }

  public registerPlugin(plugin: IIntelligenceSource): void {
    this.plugins.set(plugin.id, plugin);
  }

  public listPlugins(): IIntelligenceSource[] {
    return Array.from(this.plugins.values());
  }

  public getPlugin(id: string): IIntelligenceSource | undefined {
    return this.plugins.get(id);
  }
}
