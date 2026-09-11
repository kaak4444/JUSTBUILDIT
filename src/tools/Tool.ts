/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ToolContext } from "./ToolContext";

export interface ITool {
  id: string;
  name: string;
  description: string;
  capabilities: string[];

  execute(input: any, context: ToolContext): Promise<any>;
}
