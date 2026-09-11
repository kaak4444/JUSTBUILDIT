// src/core/kernel/SandboxManager.ts
import * as crypto from "crypto";

export interface Sandbox {
  id: string;
  memory: {
    feedbackStore: Record<string, any>;
    tempData: Record<string, any>;
    logs: any[];
  };
}

export class SandboxManager {
  private sandboxes = new Map<string, Sandbox>();

  create(task: any): Sandbox {
    const sandbox: Sandbox = {
      id: crypto.randomUUID(),
      memory: {
        feedbackStore: {},
        tempData: {},
        logs: []
      }
    };

    this.sandboxes.set(sandbox.id, sandbox);
    return sandbox;
  }

  get(id: string) {
    return this.sandboxes.get(id);
  }
}

export const sandboxManager = new SandboxManager();
