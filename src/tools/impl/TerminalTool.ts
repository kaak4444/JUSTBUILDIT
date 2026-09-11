/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ITool } from "../Tool";
import { ToolContext } from "../ToolContext";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export class TerminalTool implements ITool {
  id = "terminal";
  name = "Isolated Sandbox Terminal";
  description = "Executes allowlisted, safe development terminal operations inside the container sandbox.";
  capabilities = ["terminal command", "npm lint", "test compilation"];

  private allowlist = [
    /^npm\s+run\s+lint$/,
    /^tsc\s+--noEmit$/,
    /^node\s+dist\/server\.cjs\s+--test-run$/,
    /^echo\s+['"][^'"]*['"]$/
  ];

  async execute(input: { command: string }, context: ToolContext): Promise<any> {
    if (!input || !input.command) {
      throw new Error("Missing required parameter: 'command'");
    }

    const command = input.command.trim();
    const isAllowed = this.allowlist.some(regex => regex.test(command));

    if (!isAllowed) {
      throw new Error(`Security Violation: Command "${command}" is restricted. You may only run safe lint, compilation, or echo loops.`);
    }

    try {
      const { stdout, stderr } = await execAsync(command);
      return {
        command,
        success: true,
        stdout,
        stderr,
        exitCode: 0
      };
    } catch (err: any) {
      return {
        command,
        success: false,
        stdout: err?.stdout || "",
        stderr: err?.stderr || err?.message || err,
        exitCode: err?.code || 1
      };
    }
  }
}
