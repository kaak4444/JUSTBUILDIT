/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IConstraints {
  budgetUSD: number;
  deadlineHours: number;
  qualityThreshold: number; // 0 to 100
  allowedProviders: string[];
  bannedProviders: string[];
}

export interface ConstraintValidationResult {
  isCompliant: boolean;
  violations: string[];
  warnings: string[];
}

export class ConstraintEngine {
  private static activeConstraints: IConstraints = {
    budgetUSD: 5000,
    deadlineHours: 72,
    qualityThreshold: 80,
    allowedProviders: ["Gemini 2.5 Flash", "Gemini 2.5 Pro", "Custom Local Sandbox"],
    bannedProviders: ["Legacy OpenAI GPT-3", "Banned Web Crawler Alpha"]
  };

  public static getActiveConstraints(): IConstraints {
    return this.activeConstraints;
  }

  public static updateConstraints(newConstraints: Partial<IConstraints>) {
    this.activeConstraints = {
      ...this.activeConstraints,
      ...newConstraints
    };
  }

  /**
   * Validate a strategy candidate against active company constraints
   */
  public static validate(candidate: { cost: number; duration: number; quality: number; name: string }): ConstraintValidationResult {
    const violations: string[] = [];
    const warnings: string[] = [];
    const limits = this.activeConstraints;

    // Budget check
    if (candidate.cost > limits.budgetUSD) {
      violations.push(`Project cost ($${candidate.cost} USD) exceeds corporate budget cap of $${limits.budgetUSD} USD.`);
    } else if (candidate.cost > limits.budgetUSD * 0.8) {
      warnings.push(`Project cost is within 20% of the maximum budget cap.`);
    }

    // Deadline check
    if (candidate.duration > limits.deadlineHours) {
      violations.push(`Project duration (${candidate.duration} hours) exceeds maximum allowed timeline of ${limits.deadlineHours} hours.`);
    } else if (candidate.duration > limits.deadlineHours * 0.8) {
      warnings.push(`Project timeline is near the hard deadline threshold.`);
    }

    // Quality gate check
    if (candidate.quality < limits.qualityThreshold) {
      violations.push(`Expected quality (${candidate.quality}%) is below the mandatory quality gate threshold (${limits.qualityThreshold}%).`);
    }

    return {
      isCompliant: violations.length === 0,
      violations,
      warnings
    };
  }
}
