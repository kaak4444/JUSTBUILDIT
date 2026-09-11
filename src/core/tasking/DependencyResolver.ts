/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskGraph } from "./TaskGraph";
import { TaskNode } from "./TaskNode";

export class DependencyResolver {
  /**
   * Performs topological sort on the nodes to return a valid sequence of tasks
   */
  public static resolveOrder(graph: TaskGraph): TaskNode[] {
    if (graph.hasCycle()) {
      throw new Error("Cannot resolve dependency order: Task graph contains a circular dependency loop!");
    }

    const visited = new Set<string>();
    const tempVisited = new Set<string>();
    const order: TaskNode[] = [];

    const visit = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      if (tempVisited.has(nodeId)) {
        throw new Error("Cycle detected!");
      }

      tempVisited.add(nodeId);

      const node = graph.getNode(nodeId);
      if (node) {
        for (const depId of node.dependencies) {
          visit(depId);
        }
      }

      tempVisited.delete(nodeId);
      visited.add(nodeId);
      if (node) {
        order.push(node);
      }
    };

    const allNodes = graph.getAllNodes();
    for (const node of allNodes) {
      visit(node.id);
    }

    return order;
  }
}
