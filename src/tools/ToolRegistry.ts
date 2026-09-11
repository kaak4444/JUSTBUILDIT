/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ITool } from "./Tool";

export class ToolRegistry {
  private static tools = new Map<string, ITool>();

  static register(tool: ITool) {
    this.tools.set(tool.id, tool);
  }

  static get(id: string): ITool | undefined {
    return this.tools.get(id);
  }

  static list(): ITool[] {
    return Array.from(this.tools.values());
  }

  static findByCapability(capability: string): ITool[] {
    return this.list().filter(t => t.capabilities.includes(capability));
  }
}
