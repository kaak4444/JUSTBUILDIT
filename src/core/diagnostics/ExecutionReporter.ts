import { eventBus } from "../event/EventBus";

export class ExecutionReporter {
  private events: any[] = [];

  constructor() {
    // We can just pull from eventBus.getLogs() directly, or intercept emit.
    // The core EventBus does not have subscribeAll, but it has eventLog.
  }

  getRecentEvents(limit: number = 100) {
    const logs = eventBus.getLogs();
    return logs.slice(-limit);
  }
}

