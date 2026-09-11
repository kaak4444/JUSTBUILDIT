/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ToolRegistry } from "./ToolRegistry";
import { ToolContext } from "./ToolContext";

export class ToolManager {
  static async executeTool(toolId: string, input: any, context: ToolContext): Promise<any> {
    const tool = ToolRegistry.get(toolId);
    if (!tool) {
      throw new Error(`Tool "${toolId}" not found in Tool Registry.`);
    }
    
    try {
      return await tool.execute(input, context);
    } catch (err: any) {
      throw new Error(`Execution error in tool "${toolId}": ${err?.message || err}`);
    }
  }
}
