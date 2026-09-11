/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IConfigManager } from "./interfaces.ts";

export class ConfigManager implements IConfigManager {
  private config: Record<string, any> = {};
  private subscribers: Set<(config: Record<string, any>) => void> = new Set();

  constructor(initialConfig: Record<string, any> = {}) {
    this.config = {
      intelligenceToggle: true, // research before building
      concurrencyLimit: 4,
      defaultLLMProvider: "inst_nemotron_ultra",
      fallbackLLMProvider: "gemini-flash",
      costCeiling: 10.00, // Max mock budget
      maxReviewRetries: 3,
      qualityThreshold: 80, // Minimum review score (0-100) to pass
      ...initialConfig,
    };
  }

  get(key: string, defaultValue?: any): any {
    return this.config[key] !== undefined ? this.config[key] : defaultValue;
  }

  set(key: string, value: any): void {
    this.config[key] = value;
    this.notifySubscribers();
  }

  getAll(): Record<string, any> {
    return { ...this.config };
  }

  subscribe(callback: (config: Record<string, any>) => void): () => void {
    this.subscribers.add(callback);
    callback({ ...this.config });
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach((sub) => {
      try {
        sub({ ...this.config });
      } catch (err) {
        console.error("Error in config subscriber", err);
      }
    });
  }
}
