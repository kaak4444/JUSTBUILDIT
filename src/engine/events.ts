/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IEventBus, IEvent } from "./interfaces.ts";

export class EventBus implements IEventBus {
  private handlers: Map<string, Set<(event: IEvent) => void>> = new Map();
  private wildcardHandlers: Set<(event: IEvent) => void> = new Set();

  publish(eventInput: Omit<IEvent, "id" | "timestamp">): void {
    const event: IEvent = {
      id: `evt_${Math.random().toString(36).substring(2, 11)}`,
      timestamp: new Date().toISOString(),
      ...eventInput,
    };

    // Trigger exact matches
    const typeHandlers = this.handlers.get(event.type);
    if (typeHandlers) {
      typeHandlers.forEach((handler) => {
        try {
          handler(event);
        } catch (err) {
          console.error(`Error in event handler for ${event.type}:`, err);
        }
      });
    }

    // Trigger wildcard/global subscribers
    this.wildcardHandlers.forEach((handler) => {
      try {
        handler(event);
      } catch (err) {
        console.error("Error in wildcard event handler:", err);
      }
    });
  }

  subscribe(eventType: string, handler: (event: IEvent) => void): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);

    return () => {
      const typeHandlers = this.handlers.get(eventType);
      if (typeHandlers) {
        typeHandlers.delete(handler);
        if (typeHandlers.size === 0) {
          this.handlers.delete(eventType);
        }
      }
    };
  }

  subscribeAll(handler: (event: IEvent) => void): () => void {
    this.wildcardHandlers.add(handler);
    return () => {
      this.wildcardHandlers.delete(handler);
    };
  }
}
