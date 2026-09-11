/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ToolRegistry } from "./ToolRegistry";
import { BrowserTool } from "./impl/BrowserTool";
import { SearchTool } from "./impl/SearchTool";
import { PdfTool } from "./impl/PdfTool";
import { OcrTool } from "./impl/OcrTool";
import { ImageAnalysisTool } from "./impl/ImageAnalysisTool";
import { GitTool } from "./impl/GitTool";
import { FilesystemTool } from "./impl/FilesystemTool";
import { TerminalTool } from "./impl/TerminalTool";

export * from "./Tool";
export * from "./ToolContext";
export * from "./ToolRegistry";
export * from "./ToolManager";
export * from "./impl/BrowserTool";
export * from "./impl/SearchTool";
export * from "./impl/PdfTool";
export * from "./impl/OcrTool";
export * from "./impl/ImageAnalysisTool";
export * from "./impl/GitTool";
export * from "./impl/FilesystemTool";
export * from "./impl/TerminalTool";

export function initializeDefaultTools() {
  ToolRegistry.register(new BrowserTool());
  ToolRegistry.register(new SearchTool());
  ToolRegistry.register(new PdfTool());
  ToolRegistry.register(new OcrTool());
  ToolRegistry.register(new ImageAnalysisTool());
  ToolRegistry.register(new GitTool());
  ToolRegistry.register(new FilesystemTool());
  ToolRegistry.register(new TerminalTool());
}
