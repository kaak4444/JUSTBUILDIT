/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskNode } from "../tasking/TaskNode";

export interface TaskResult {
  taskId: string;
  success: boolean;
  output?: any;
  error?: string;
  duration: number;
  completedAt: number;
}

export interface Agent {
  id: string;
  name: string;
  type: string; // e.g. "RESEARCH", "WRITER", "SEO", "DESIGN", "PRICING", "MARKETING", "FORMATTER", "VALIDATOR"
  status: "IDLE" | "RUNNING" | "WAITING" | "FAILED";
  maxConcurrency: number;
  currentTasksCount: number;
  performanceScore: number;
  tasksCompleted: number;

  execute(task: TaskNode): Promise<TaskResult>;
}
