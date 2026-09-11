/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type HealthStatus = {
  status: "ONLINE" | "OFFLINE" | "DEGRADED";
  latencyMs: number;
  message?: string;
};

export type SearchResult = {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
};

export type RawDocument = {
  url: string;
  content: string;
  fetchedAt: string;
  contentType: string;
};

export interface IIntelligenceSource {
  readonly id: string;
  readonly name: string;
  readonly version: string;

  supports(query: string): boolean;
  health(): Promise<HealthStatus>;
  search(query: string, limit: number): Promise<SearchResult[]>;
  fetch(url: string): Promise<RawDocument>;
}
