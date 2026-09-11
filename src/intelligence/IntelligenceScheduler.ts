/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IntelligencePipeline } from "./IntelligencePipeline.ts";
import { KnowledgeCompressionEngine } from "./KnowledgeCompressionEngine.ts";

export class IntelligenceScheduler {
  private pipeline = new IntelligencePipeline();
  private compression = new KnowledgeCompressionEngine();
  private intervalId: NodeJS.Timeout | null = null;

  public startContinuousScheduler(): void {
    console.log("[IntelligenceScheduler] Starting CIA-grade 24/7 background learning engine.");
    
    // Simulate periodic learning intervals
    this.intervalId = setInterval(() => {
      this.hourlyCycle().catch(err => console.error("Error in scheduler hourly sweep:", err));
    }, 1000 * 60 * 15); // Run every 15 minutes in sandbox mock for high visibility
  }

  public stopContinuousScheduler(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("[IntelligenceScheduler] Continuous learning loops suspended.");
    }
  }

  public async hourlyCycle(): Promise<void> {
    console.log("[IntelligenceScheduler] Running hourlyCycle: Active Internet Observation Sweep.");
    // Triggers general crawling sweeps over trending startup technology tags
    await this.pipeline.execute("E-commerce Sourcing platforms");
  }

  public async dailyCycle(): Promise<void> {
    console.log("[IntelligenceScheduler] Running dailyCycle: Refreshing document cache & crawling links.");
    // Simulates checking doc freshness and recrawling stale pages
    await this.pipeline.execute("Interactive Scholarly Platforms");
  }

  public async weeklyCycle(): Promise<void> {
    console.log("[IntelligenceScheduler] Running weeklyCycle: Rebuilding World Graph relationships.");
    // Rebuilds entity overlaps, resolution mappings, and clusters
    await this.pipeline.execute("Digital reading layouts");
  }

  public async monthlyCycle(): Promise<void> {
    console.log("[IntelligenceScheduler] Running monthlyCycle: Executing Knowledge Compression Sweeps.");
    // Compress raw pages into neat facts/rules
    await this.compression.compress(IntelligencePipeline.getWorldGraph());
  }
}
