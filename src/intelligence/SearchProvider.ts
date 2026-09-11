/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

export interface SearchProvider {
  id: string;
  name: string;
  health(): Promise<boolean>;
  search(query: string, limit: number): Promise<SearchResult[]>;
}
