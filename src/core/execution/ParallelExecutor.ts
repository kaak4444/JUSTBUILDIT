/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskGraph } from "../tasking/TaskGraph";
import { TaskNode } from "../tasking/TaskNode";
import { AgentPool } from "../agents/AgentPool";
import { TaskResult } from "../agents/WorkerTypes";
import { FailureRecovery } from "./FailureRecovery";

export type ExecutionProgressCallback = (graph: TaskGraph, activeRunningNodeIds: string[]) => void;

export class ParallelExecutor {
  private agentPool = AgentPool.getInstance();

  constructor() {}

  public async executeGraph(
    graph: TaskGraph,
    onProgress?: ExecutionProgressCallback,
    autoHeal: boolean = true
  ): Promise<boolean> {
    const runningNodes = new Set<string>();

    while (!graph.isComplete() && !graph.hasFailed()) {
      const executable = graph.getExecutableNodes();

      if (executable.length === 0) {
        // If there are no executable nodes, but we aren't done and nothing is failed, we might have a deadlock/stuck graph.
        if (runningNodes.size === 0) {
          throw new Error("Task graph deadlock: No active tasks are running and no tasks are ready to run.");
        }
        // Wait briefly for active tasks to finish
        await new Promise(resolve => setTimeout(resolve, 200));
        continue;
      }

      // Execute ready nodes in parallel!
      const promises = executable.map(async (node) => {
        runningNodes.add(node.id);
        graph.updateNodeStatus(node.id, "RUNNING");
        if (onProgress) onProgress(graph, Array.from(runningNodes));

        let attempts = 0;
        let success = false;
        let result: TaskResult | null = null;

        while (!success && attempts < 3) {
          attempts++;
          result = await this.agentPool.dispatch(node);
          
          if (result.success) {
            success = true;
          } else if (autoHeal) {
            // Apply autonomous self-healing strategy
            const healed = FailureRecovery.heal(node, result.error || "Unknown failure");
            node.description = `[Healed-Retry ${attempts}] ` + node.description;
            if (!healed) break; // If we can't heal this error type, break early
          } else {
            break;
          }
        }

        runningNodes.delete(node.id);

        if (result && result.success) {
          graph.updateNodeStatus(node.id, "COMPLETED", {
            output: result.output,
            assignedAgentId: node.assignedAgentId
          });
        } else {
          graph.updateNodeStatus(node.id, "FAILED", {
            error: result?.error || "Task processing failed after multiple healing attempts.",
            assignedAgentId: node.assignedAgentId
          });
        }

        if (onProgress) onProgress(graph, Array.from(runningNodes));
      });

      // Wait for the current batch of parallel executable tasks to finish
      await Promise.all(promises);
    }

    return graph.isComplete();
  }
}
