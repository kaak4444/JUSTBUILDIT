/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Agent } from "./WorkerTypes";
import { AgentPool } from "./AgentPool";

export class WorkerRegistry {
  private static pool = AgentPool.getInstance();

  public static listAllWorkers(): Agent[] {
    return this.pool.listAgents();
  }

  public static getWorkerById(id: string): Agent | undefined {
    return this.pool.listAgents().find(a => a.id === id);
  }

  public static getWorkerRoles(): Record<string, string> {
    return {
      "RESEARCH": "Crawls and extracts customer complaints, trend keywords and competitor specs.",
      "WRITER": "Constructs structured outlines and drafts high-fidelity longform text.",
      "DESIGN": "Generates aesthetic palettes, book covers, and contrast ratio tested tiles.",
      "SEO": "Assembles search volume arrays and optimizes commercial meta text.",
      "PRICING": "Simulates price elasticity, printing costs, and royal-ledger splits.",
      "FORMATTER": "Compiles raw prose into print-ready PDF vector layouts or EPUB trees.",
      "PUBLISH": "Directly synchronizes listings, titles, and tags with marketplace accounts."
    };
  }
}
