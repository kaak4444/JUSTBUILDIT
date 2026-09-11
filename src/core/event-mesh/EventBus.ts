// src/core/event-mesh/EventBus.ts
export type Event = {
  type: string;
  payload: any;
  meta?: {
    taskId?: string;
    retry?: number;
    source?: string;
    timestamp?: number;
  };
};

type Listener = (event: Event) => Promise<void> | void;

export class EventBus {
  private listeners: Map<string, Listener[]> = new Map();

  on(eventType: string, fn: Listener) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(fn);
  }

  async emit(event: Event) {
    const handlers = this.listeners.get(event.type) || [];

    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (err) {
        this.emit({
          type: "EVENT_HANDLER_FAILED",
          payload: { error: err, event },
        });
      }
    }
  }
}

export const eventBus = new EventBus();
