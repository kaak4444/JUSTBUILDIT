/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class ToolContext {
  constructor(
    public projectId: string,
    public taskId: string,
    public metadata: Record<string, any> = {}
  ) {}
}
