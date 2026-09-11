// src/core/planning/TaskDecomposer.ts

export class TaskDecomposer {

  decompose(task: any) {

    if (task.type === "BOOK") {
      return [
        { stage: "RESEARCH", weight: 0.3 },
        { stage: "STRUCTURE", weight: 0.2 },
        { stage: "WRITING", weight: 0.3 },
        { stage: "EDITING", weight: 0.2 }
      ];
    }

    if (task.type === "DROPSHIPPING") {
      return [
        { stage: "TREND_RESEARCH", weight: 0.4 },
        { stage: "PRODUCT_VALIDATION", weight: 0.3 },
        { stage: "COMPETITOR_ANALYSIS", weight: 0.3 }
      ];
    }

    if (task.type === "JOURNAL") {
      return [
        { stage: "DATA_COLLECTION", weight: 0.4 },
        { stage: "INSIGHT_GENERATION", weight: 0.3 },
        { stage: "STRUCTURING", weight: 0.3 }
      ];
    }

    return [{ stage: "DEFAULT", weight: 1 }];
  }
}
