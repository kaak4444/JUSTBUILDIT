/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StrategyCandidate } from "./StrategyCandidate";

export interface IExecutive {
  id: string;
  title: string;
  department: string;

  /**
   * Decide if this department should participate in the blueprint.
   */
  shouldParticipate(blueprint: any): Promise<boolean>;

  /**
   * Build a robust Department Strategy Candidate.
   */
  buildStrategy(blueprint: any): Promise<StrategyCandidate>;

  /**
   * Estimate currency budget constraints for this department's workers.
   */
  estimateBudget(blueprint: any): Promise<number>;

  /**
   * Estimate duration in hours.
   */
  estimateDuration(blueprint: any): Promise<number>;
}
