import { eventBus } from "../../event/EventBus";
import { ProjectStatus, TaskStatus } from "../../../engine/interfaces";

export interface IEngineStatus {
  id: string;
  name: string;
  status: "Running" | "Idle" | "Cooldown" | "Healthy" | "Offline" | "Degraded";
  lastHeartbeat: number;
  warnings: string[];
}

export interface IMissionArchiveRecord {
  id: string;
  title: string;
  status: string;
  startTime: string;
  endTime?: string;
  artifacts: any[];
  timeline: any[];
  cost: number;
  duration: number;
}

export class RuntimeIntelligenceLayer {
  private static instance: RuntimeIntelligenceLayer;
  private timeline: any[] = [];
  private engines: Map<string, IEngineStatus> = new Map();
  private missionArchive: Map<string, IMissionArchiveRecord> = new Map();

  private constructor() {
    this.initializeEngineRegistry();
    this.subscribeToEvents();
    
    // Dead Engine Detector loop
    setInterval(() => this.checkEngineHealth(), 10000);
  }

  public static getInstance(): RuntimeIntelligenceLayer {
    if (!RuntimeIntelligenceLayer.instance) {
      RuntimeIntelligenceLayer.instance = new RuntimeIntelligenceLayer();
    }
    return RuntimeIntelligenceLayer.instance;
  }

  private initializeEngineRegistry() {
    const defaultEngines = [
      "Research Engine",
      "Publishing",
      "Creative",
      "Memory",
      "Provider Router",
      "Connector Engine",
      "Execution Stability Kernel",
      "Event Bus"
    ];
    defaultEngines.forEach(name => {
      this.engines.set(name, {
        id: name.toLowerCase().replace(/\s/g, "_"),
        name,
        status: "Healthy",
        lastHeartbeat: Date.now(),
        warnings: []
      });
    });
  }

  private subscribeToEvents() {
    eventBus.on("SYSTEM_HEARTBEAT", (payload: any) => {
      const engineName = payload.engine;
      if (engineName && this.engines.has(engineName)) {
        const engine = this.engines.get(engineName)!;
        engine.lastHeartbeat = Date.now();
        engine.status = payload.status || "Healthy";
        engine.warnings = [];
      }
    });

    // Capture everything for the timeline
    eventBus.on("TASK_CREATED", (payload) => this.logEvent("TASK_CREATED", payload));
    eventBus.on("TASK_UPDATED", (payload) => this.logEvent("TASK_UPDATED", payload));
    eventBus.on("TASK_FAILED", (payload) => this.logEvent("TASK_FAILED", payload));
    eventBus.on("TASK_COMPLETED", (payload) => this.logEvent("TASK_COMPLETED", payload));
    eventBus.on("PROJECT_CREATED", (payload) => {
      this.logEvent("PROJECT_CREATED", payload);
      const proj = payload.project || payload;
      this.missionArchive.set(proj.id, {
        id: proj.id,
        title: proj.title,
        status: proj.status,
        startTime: proj.createdAt || new Date().toISOString(),
        artifacts: [],
        timeline: [],
        cost: 0,
        duration: 0
      });
    });
    eventBus.on("PROJECT_STATUS_CHANGED", (payload) => {
      this.logEvent("PROJECT_STATUS_CHANGED", payload);
      const archive = this.missionArchive.get(payload.projectId);
      if (archive) {
        archive.status = payload.status;
        if (payload.status === "COMPLETED" || payload.status === "FAILED" || payload.status === "CANCELLED") {
          archive.endTime = new Date().toISOString();
          archive.duration = new Date(archive.endTime).getTime() - new Date(archive.startTime).getTime();
        }
      }
    });
  }

  private logEvent(type: string, payload: any) {
    const entry = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      timestamp: new Date().toISOString(),
      payload
    };
    this.timeline.unshift(entry);
    if (this.timeline.length > 2000) {
      this.timeline.pop();
    }
    
    // Add to specific mission timeline if applicable
    const projectId = payload.projectId || payload.project?.id || payload.task?.projectId;
    if (projectId && this.missionArchive.has(projectId)) {
      this.missionArchive.get(projectId)!.timeline.push(entry);
    }
  }

  private checkEngineHealth() {
    const now = Date.now();
    this.engines.forEach(engine => {
      // If no heartbeat in 2 minutes, consider offline
      if (now - engine.lastHeartbeat > 120000) {
        engine.status = "Offline";
        engine.warnings = [
          `No events received for ${Math.floor((now - engine.lastHeartbeat) / 60000)} min.`,
          "Possible causes: Connector Offline, Provider Missing, Queue Blocked"
        ];
      }
    });
    eventBus.emit("RIL_ENGINE_HEALTH_UPDATED", Array.from(this.engines.values()));
  }

  public getTimeline() {
    return this.timeline;
  }

  public getEngines() {
    return Array.from(this.engines.values());
  }

  public getMissionArchive() {
    return Array.from(this.missionArchive.values());
  }
}

export const runtimeIntelligence = RuntimeIntelligenceLayer.getInstance();
