/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TaskNode {
  id: string;
  type: string; // e.g., "RESEARCH", "OUTLINE", "CHAPTER_WRITE", "GRAMMAR", "COVER_DESIGN", "SEO_TAGS", "PRICING", "PUBLISH"
  name: string;
  description: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  dependencies: string[]; // Parent task IDs that must complete first
  assignedAgentId?: string;
  output?: any;
  error?: string;
  startedAt?: number;
  completedAt?: number;
}
