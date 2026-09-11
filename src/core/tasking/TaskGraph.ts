/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskNode } from "./TaskNode";

export class TaskGraph {
  private nodes: Map<string, TaskNode> = new Map();

  constructor(nodes?: TaskNode[]) {
    if (nodes) {
      nodes.forEach(node => this.addNode(node));
    }
  }

  public addNode(node: TaskNode): void {
    this.nodes.set(node.id, { ...node });
  }

  public getNode(id: string): TaskNode | undefined {
    return this.nodes.get(id);
  }

  public getAllNodes(): TaskNode[] {
    return Array.from(this.nodes.values());
  }

  public getExecutableNodes(): TaskNode[] {
    // A task is executable if its status is PENDING and all its dependencies are COMPLETED
    return this.getAllNodes().filter(node => {
      if (node.status !== "PENDING") return false;
      return node.dependencies.every(depId => {
        const depNode = this.nodes.get(depId);
        return depNode && depNode.status === "COMPLETED";
      });
    });
  }

  public updateNodeStatus(id: string, status: TaskNode["status"], extra?: Partial<TaskNode>): void {
    const node = this.nodes.get(id);
    if (node) {
      this.nodes.set(id, {
        ...node,
        status,
        ...extra,
        ...(status === "RUNNING" ? { startedAt: Date.now() } : {}),
        ...(status === "COMPLETED" || status === "FAILED" ? { completedAt: Date.now() } : {})
      });
    }
  }

  public isComplete(): boolean {
    return this.getAllNodes().every(node => node.status === "COMPLETED");
  }

  public hasFailed(): boolean {
    return this.getAllNodes().some(node => node.status === "FAILED");
  }

  public getProgress(): number {
    const total = this.nodes.size;
    if (total === 0) return 0;
    const completed = this.getAllNodes().filter(n => n.status === "COMPLETED").length;
    return Math.round((completed / total) * 100);
  }

  /**
   * Validates if there's any circular dependency in the task DAG
   */
  public hasCycle(): boolean {
    const visited: Record<string, boolean> = {};
    const recStack: Record<string, boolean> = {};

    const dfs = (nodeId: string): boolean => {
      if (recStack[nodeId]) return true;
      if (visited[nodeId]) return false;

      visited[nodeId] = true;
      recStack[nodeId] = true;

      const node = this.nodes.get(nodeId);
      if (node) {
        for (const depId of node.dependencies) {
          if (dfs(depId)) return true;
        }
      }

      recStack[nodeId] = false;
      return false;
    };

    for (const nodeId of this.nodes.keys()) {
      if (dfs(nodeId)) return true;
    }

    return false;
  }
}
