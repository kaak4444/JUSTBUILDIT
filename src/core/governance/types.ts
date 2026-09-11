/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GovernanceDecision {
  id: string;
  projectId: string;
  decision: string;
  rationale: string;
  alternatives: string[];
  approvedBy: string[];
  confidence: number;
  estimatedCost: number;
  estimatedROI: number;
  createdAt: string;
}

export interface PolicyResult {
  passed: boolean;
  failures: string[];
  warnings: string[];
}

export interface GovernanceContext {
  projectId: string;
  projectName: string;
  estimatedCost: number;
  estimatedROI: number;
  estimatedDurationHours: number;
  requiredSkills: string[];
  targetWorkers: string[];
  selectedProvider: string;
}

export interface GovernancePolicy {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  validate(ctx: GovernanceContext): Promise<PolicyResult>;
}

export class GovernanceException extends Error {
  constructor(public failures: { policyId: string; policyName: string; messages: string[] }[]) {
    super(`Governance policy review failed: ${failures.map(f => `[${f.policyName}] ${f.messages.join(", ")}`).join("; ")}`);
    this.name = "GovernanceException";
  }
}
