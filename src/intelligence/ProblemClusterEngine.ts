/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Evidence, Problem, ProblemCluster } from "./types.ts";
import { SemanticClusterEngine } from "./SemanticClusterEngine.ts";

export class ProblemClusterEngine {
  private semanticClusterer = new SemanticClusterEngine();

  /**
   * Consolidates problems dynamically using real SemanticClusterEngine.
   */
  public async clusterProblems(problems: Problem[]): Promise<ProblemCluster[]> {
    console.log(`[ProblemClusterEngine] Grouping ${problems.length} problems semantically into clusters...`);
    return this.semanticClusterer.cluster(problems);
  }
}
