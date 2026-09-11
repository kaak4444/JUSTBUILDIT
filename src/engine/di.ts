/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IDIContainer } from "./interfaces.ts";

export class DIContainer implements IDIContainer {
  private services: Map<string, any> = new Map();

  register<T>(name: string, instance: T): void {
    if (this.services.has(name)) {
      console.warn(`[DIContainer] Overwriting service registration: ${name}`);
    }
    this.services.set(name, instance);
  }

  resolve<T>(name: string): T {
    if (!this.services.has(name)) {
      throw new Error(`[DIContainer] Service not registered: ${name}`);
    }
    return this.services.get(name) as T;
  }

  has(name: string): boolean {
    return this.services.has(name);
  }
}

// Global default container
export const container = new DIContainer();
