export type UIObject =
  | "task"
  | "research"
  | "product"
  | "agent"
  | "log";

export interface UIStateItem {
  id: string;
  type: UIObject;
  title: string;
  status: "running" | "done" | "failed";
  data: any;
  timestamp: number;
  pinned?: boolean;
}

export class UIKernel {
  private static instance: UIKernel | null = null;
  private store: Map<string, UIStateItem> = new Map();
  private listeners: (() => void)[] = [];

  public static getInstance(): UIKernel {
    if (!UIKernel.instance) {
      UIKernel.instance = new UIKernel();
    }
    return UIKernel.instance;
  }

  add(item: UIStateItem) {
    this.store.set(item.id, item);
    this.notify();
  }

  update(id: string, patch: Partial<UIStateItem>) {
    const existing = this.store.get(id);
    if (!existing) return;

    this.store.set(id, { ...existing, ...patch });
    this.notify();
  }

  list() {
    return Array.from(this.store.values())
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  get(id: string) {
    return this.store.get(id);
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (e) {
        console.error("UIKernel listener error", e);
      }
    }
  }
}
