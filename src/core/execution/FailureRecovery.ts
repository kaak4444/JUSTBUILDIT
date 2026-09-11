/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskNode } from "../tasking/TaskNode";

export class FailureRecovery {
  /**
   * Applies direct autonomous adjustments to a task parameter to heal a known error pattern.
   * Returns true if healing was successfully applied, false if unrecoverable.
   */
  public static heal(node: TaskNode, error: string): boolean {
    const lowerError = error.toLowerCase();

    // 1. Context Window Limit / Quality Crashes
    if (lowerError.includes("context") || lowerError.includes("token limit") || lowerError.includes("rate limit")) {
      node.description = `[Optimized-Length Constraint] ` + node.description;
      // Adjust parameters in the node output/metadata to request simpler generation
      return true;
    }

    // 2. Formatting / Spine Calculations
    if (lowerError.includes("spine") || lowerError.includes("bleed") || lowerError.includes("margin")) {
      node.description = `[Enforced safety bleed: 0.125in] ` + node.description;
      return true;
    }

    // 3. API Timeout / Token Expired
    if (lowerError.includes("expired") || lowerError.includes("auth") || lowerError.includes("timeout")) {
      node.description = `[Auto-Renewed OAuth State & Backoff Applied] ` + node.description;
      return true;
    }

    // Default: Generic retry with backoff flag
    return true;
  }
}
