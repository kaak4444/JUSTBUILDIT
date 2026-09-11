// src/core/connectors/AutoPublishTrigger.ts

import { eventBus } from "../event/EventBus";
import { universalConnector } from "./UniversalConnectorEngine";
import { aiConnectorRouter } from "./AIConnectorRouter";

class AutoPublishTrigger {

  constructor() {
    this.listen();
  }

  listen() {

    eventBus.on("TASK_COMPLETED", async (task) => {

      if (!task.output) return;

      const platforms = aiConnectorRouter.selectBestPlatform(task);

      await universalConnector.publish({
        targetPlatforms: platforms,
        contentType: task.type,
        data: task.output
      });

    });

    eventBus.on("USER_APPROVED", async (payload: any) => {

      const platforms = aiConnectorRouter.selectBestPlatform(payload.task);

      await universalConnector.publish({
        targetPlatforms: platforms,
        contentType: payload.task.type,
        data: payload.task.output
      });

    });
  }
}

export const autoPublishTrigger = new AutoPublishTrigger();
