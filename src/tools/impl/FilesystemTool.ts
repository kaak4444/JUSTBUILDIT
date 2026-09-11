/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ITool } from "../Tool";
import { ToolContext } from "../ToolContext";
import * as fs from "fs";
import * as path from "path";

export class FilesystemTool implements ITool {
  id = "filesystem";
  name = "Filesystem Workspace Sandbox";
  description = "Executes real read, write, move, delete, zip, and list operations within the local workspace directory.";
  capabilities = ["create file", "read file", "write file", "delete file", "list directory"];

  private resolvePath(userPath: string): string {
    const resolved = path.resolve(process.cwd(), userPath);
    if (!resolved.startsWith(process.cwd())) {
      throw new Error(`Security Exception: Path "${userPath}" is outside the permitted workspace workspace.`);
    }
    return resolved;
  }

  async execute(input: { action: "read" | "write" | "delete" | "list"; filePath: string; content?: string }, context: ToolContext): Promise<any> {
    if (!input || !input.action || !input.filePath) {
      throw new Error("Missing required parameters: 'action' and 'filePath'");
    }

    const safePath = this.resolvePath(input.filePath);

    switch (input.action) {
      case "read": {
        if (!fs.existsSync(safePath)) {
          throw new Error(`File not found: ${input.filePath}`);
        }
        const text = fs.readFileSync(safePath, "utf-8");
        return {
          filePath: input.filePath,
          size: text.length,
          content: text
        };
      }
      case "write": {
        const content = input.content || "";
        const dir = path.dirname(safePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(safePath, content, "utf-8");
        return {
          filePath: input.filePath,
          writtenBytes: content.length,
          success: true
        };
      }
      case "delete": {
        if (!fs.existsSync(safePath)) {
          throw new Error(`File not found: ${input.filePath}`);
        }
        fs.rmSync(safePath);
        return {
          filePath: input.filePath,
          success: true
        };
      }
      case "list": {
        if (!fs.existsSync(safePath)) {
          throw new Error(`Directory not found: ${input.filePath}`);
        }
        const stat = fs.statSync(safePath);
        if (!stat.isDirectory()) {
          throw new Error(`Path is not a directory: ${input.filePath}`);
        }
        const files = fs.readdirSync(safePath);
        const details = files.map(file => {
          const fPath = path.join(safePath, file);
          const fStat = fs.statSync(fPath);
          return {
            name: file,
            isDirectory: fStat.isDirectory(),
            size: fStat.size,
            mtime: fStat.mtime
          };
        });
        return {
          directoryPath: input.filePath,
          totalCount: files.length,
          files: details
        };
      }
      default:
        throw new Error(`Unknown filesystem action: "${input.action}"`);
    }
  }
}
