/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ILogger, ILogEntry, LogLevel } from "./interfaces.ts";

export class Logger implements ILogger {
  private logs: ILogEntry[] = [];
  private subscribers: Set<(entry: ILogEntry) => void> = new Set();
  private maxLogs = 1000;

  private createEntry(level: LogLevel, source: string, message: string, metadata?: any): ILogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      source,
      message,
      metadata,
    };
  }

  private addLog(entry: ILogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    // Output to developer console for local debugging
    const styleMap: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: "color: #71717a; font-family: monospace;",
      [LogLevel.INFO]: "color: #0ea5e9; font-weight: bold;",
      [LogLevel.WARN]: "color: #f59e0b; font-weight: bold;",
      [LogLevel.ERROR]: "color: #ef4444; font-weight: bold; text-transform: uppercase;",
    };
    console.log(
      `%c[${entry.level}] [${entry.source}] ${entry.message}`, 
      styleMap[entry.level], 
      entry.metadata || ""
    );

    this.subscribers.forEach((sub) => {
      try {
        sub(entry);
      } catch (err) {
        console.error("Error in logger subscriber", err);
      }
    });
  }

  debug(source: string, message: string, metadata?: any): void {
    this.addLog(this.createEntry(LogLevel.DEBUG, source, message, metadata));
  }

  info(source: string, message: string, metadata?: any): void {
    this.addLog(this.createEntry(LogLevel.INFO, source, message, metadata));
  }

  warn(source: string, message: string, metadata?: any): void {
    this.addLog(this.createEntry(LogLevel.WARN, source, message, metadata));
  }

  error(source: string, message: string, metadata?: any): void {
    this.addLog(this.createEntry(LogLevel.ERROR, source, message, metadata));
  }

  getLogs(): ILogEntry[] {
    return [...this.logs];
  }

  subscribe(callback: (entry: ILogEntry) => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }
}
