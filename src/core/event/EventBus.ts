// src/core/event/EventBus.ts

type EventHandler = (payload: any) => void | Promise<void>;

class EventBus {
  private static instance: EventBus;
  private listeners: Map<string, Set<EventHandler>> = new Map();

  private eventLog: any[] = [];

  private constructor() {}

  static get(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  on(event: string, handler: EventHandler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  off(event: string, handler: EventHandler) {
    this.listeners.get(event)?.delete(handler);
  }

  async emit(event: string, payload: any) {
    this.eventLog.push({
      event,
      payload,
      timestamp: Date.now(),
    });

    const handlers = this.listeners.get(event);
    if (!handlers) return;

    for (const handler of handlers) {
      try {
        await handler(payload);
      } catch (err) {
        this.emit("SYSTEM_ERROR", {
          event,
          error: err,
          payload,
        });
      }
    }
  }

  getLogs() {
    return this.eventLog;
  }
}

export const eventBus = EventBus.get();
