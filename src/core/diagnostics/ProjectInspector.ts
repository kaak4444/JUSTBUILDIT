import { eventBus } from "../event/EventBus";
import { ProjectStatus, TaskStatus } from "../../engine/interfaces.ts";

export interface IProjectStatusSnapshot {
  projectId: string;
  status: string;
  runningTasks: string[];
  waitingTasks: string[];
  blockedTasks: string[];
  failedTasks: string[];
  lastUpdate: string;
}

export class ProjectInspector {
  private projectStatus: Map<string, IProjectStatusSnapshot> = new Map();

  constructor() {
    eventBus.on("PROJECT_CREATED", (payload: any) => {
      const id = payload.project?.id || payload.projectId;
      if (id) {
        this.projectStatus.set(id, {
          projectId: id,
          status: ProjectStatus.CREATED,
          runningTasks: [],
          waitingTasks: [],
          blockedTasks: [],
          failedTasks: [],
          lastUpdate: new Date().toISOString()
        });
      }
    });

    eventBus.on("PROJECT_STATUS_CHANGED", (payload: any) => {
      const proj = this.projectStatus.get(payload.projectId);
      if (proj) {
        proj.status = payload.status;
        proj.lastUpdate = new Date().toISOString();
      }
    });

    eventBus.on("TASK_UPDATED", (payload: any) => {
      const taskId = payload.id;
      const proj = this.projectStatus.get(payload.projectId);
      if (proj) {
        // Remove from all lists
        proj.runningTasks = proj.runningTasks.filter(id => id !== taskId);
        proj.waitingTasks = proj.waitingTasks.filter(id => id !== taskId);
        proj.blockedTasks = proj.blockedTasks.filter(id => id !== taskId);
        proj.failedTasks = proj.failedTasks.filter(id => id !== taskId);
        
        switch (payload.status) {
          case "RUNNING":
            proj.runningTasks.push(taskId);
            break;
          case "WAITING":
            proj.waitingTasks.push(taskId);
            break;
          case "FAILED":
            proj.failedTasks.push(taskId);
            break;
        }
        proj.lastUpdate = new Date().toISOString();
      }
    });
  }

  getInspectorData() {
    return Array.from(this.projectStatus.values());
  }
}

