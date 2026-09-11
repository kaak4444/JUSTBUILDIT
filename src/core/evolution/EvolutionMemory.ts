export interface WorkerVersion {
  id: string;
  name: string;
  departmentId: string;
  version: number;
  promptTemplate: string;
  successRate: number;
  tasksCompleted: number;
  averageDurationMs: number;
  updatedAt: string;
}

export interface DepartmentStructure {
  id: string;
  name: string;
  alignmentIndex: number; // 0-100
  efficiencyScore: number; // 0-100
  activeWorkers: string[];
  retiredWorkers: string[];
}

export interface EvolvedPolicy {
  id: string;
  name: string;
  category: "BUDGET" | "QUALITY_GATE" | "VETO_SENSID" | "AUTO_FLOW";
  value: any;
  reasoning: string;
  confidence: number;
  version: number;
  updatedAt: string;
}

export interface SkillOptimization {
  id: string;
  name: string;
  weight: number;
  utilizationCount: number;
  successGate: number;
  status: "ACTIVE" | "PENDING_TWEAK" | "DEPRECATED";
}

export interface WorkflowRouting {
  id: string;
  name: string; // e.g., "Standard Dropship Funnel"
  steps: string[]; // worker sequences
  reviewScoreAverage: number;
  retired: boolean;
  optimizedCount: number;
}

export interface ActiveExperiment {
  id: string;
  name: string;
  targetType: "PROMPT" | "POLICY" | "WORKFLOW";
  targetId: string;
  variantA: any;
  variantB: any;
  sampleCountA: number;
  sampleCountB: number;
  scoreSumA: number;
  scoreSumB: number;
  status: "RUNNING" | "CONCLUDED";
  winner?: "A" | "B";
  createdAt: string;
}

export interface EvolutionLogEntry {
  id: string;
  timestamp: string;
  projectId?: string;
  type: "WORKER" | "POLICY" | "WORKFLOW" | "SKILL" | "ARCHITECTURE" | "EXPERIMENT";
  action: string;
  description: string;
  reasoning: string;
  metricBefore?: number;
  metricAfter?: number;
}

export class EvolutionMemory {
  private dbRef: any;

  constructor(db: any) {
    this.dbRef = db;
    if (!this.dbRef.evolutionStore) {
      this.dbRef.evolutionStore = {
        workers: {},
        departments: {},
        policies: {},
        skills: {},
        workflows: {},
        experiments: {},
        logs: [],
        qualityTrend: []
      };
    }
    this.bootstrapDefaults();
  }

  private bootstrapDefaults() {
    const store = this.dbRef.evolutionStore;

    // Bootstrap default versioned workers if empty
    if (Object.keys(store.workers).length === 0) {
      const defaultWorkers = [
        { id: "logo_worker", name: "Logo Generation Worker", departmentId: "design", version: 1, successRate: 92, tasksCompleted: 14, averageDurationMs: 1200, updatedAt: new Date().toISOString() },
        { id: "brand_worker", name: "Brand Alignment Worker", departmentId: "creative", version: 1, successRate: 88, tasksCompleted: 8, averageDurationMs: 1500, updatedAt: new Date().toISOString() },
        { id: "copy_worker", name: "Sales Copywriter Worker", departmentId: "commerce", version: 1, successRate: 90, tasksCompleted: 22, averageDurationMs: 950, updatedAt: new Date().toISOString() },
        { id: "tech_analyst", name: "Tech Stack Audit Worker", departmentId: "research", version: 1, successRate: 95, tasksCompleted: 17, averageDurationMs: 1100, updatedAt: new Date().toISOString() }
      ];
      defaultWorkers.forEach(w => {
        store.workers[w.id] = {
          ...w,
          promptTemplate: `System: You are an elite ${w.name}.\nFocus strictly on premium aesthetic guidelines, zero margin clutter, and architectural integrity.`
        };
      });
    }

    // Bootstrap default departments if empty
    if (Object.keys(store.departments).length === 0) {
      const defaultDepts = [
        { id: "research", name: "Research Department", alignmentIndex: 85, efficiencyScore: 89, activeWorkers: ["tech_analyst"], retiredWorkers: [] },
        { id: "creative", name: "Creative Department", alignmentIndex: 90, efficiencyScore: 84, activeWorkers: ["brand_worker"], retiredWorkers: [] },
        { id: "design", name: "Design Department", alignmentIndex: 92, efficiencyScore: 87, activeWorkers: ["logo_worker"], retiredWorkers: [] },
        { id: "commerce", name: "Commerce Department", alignmentIndex: 88, efficiencyScore: 91, activeWorkers: ["copy_worker"], retiredWorkers: [] }
      ];
      defaultDepts.forEach(d => {
        store.departments[d.id] = d;
      });
    }

    // Bootstrap default policies if empty
    if (Object.keys(store.policies).length === 0) {
      const defaultPolicies: EvolvedPolicy[] = [
        { id: "budget_limit", name: "Autonomic Budget Cap", category: "BUDGET", value: 150, reasoning: "Enforce a highly efficient baseline budget for continuous exploratory micro-ventures.", confidence: 85, version: 1, updatedAt: new Date().toISOString() },
        { id: "quality_gate", name: "Self-Review Approval Threshold", category: "QUALITY_GATE", value: 85, reasoning: "Strict quality gates prevent unvetted dropshipping assets from leaking to the web.", confidence: 90, version: 1, updatedAt: new Date().toISOString() },
        { id: "veto_sensitivity", name: "Founder Veto Sensitivity", category: "VETO_SENSID", value: "HIGH", reasoning: "Ensure strict alignment with user core intent in first-phase exploratory cycles.", confidence: 80, version: 1, updatedAt: new Date().toISOString() },
        { id: "auto_flow", name: "Auto-Scheduling Operations Mode", category: "AUTO_FLOW", value: "ACTIVE", reasoning: "Fully autonomous loop cycle schedules pipelines without human approval triggers.", confidence: 95, version: 1, updatedAt: new Date().toISOString() }
      ];
      defaultPolicies.forEach(p => {
        store.policies[p.id] = p;
      });
    }

    // Bootstrap default skills if empty
    if (Object.keys(store.skills).length === 0) {
      const defaultSkills: SkillOptimization[] = [
        { id: "motion_opt", name: "Motion & Animation Tuning", weight: 1.2, utilizationCount: 5, successGate: 85, status: "ACTIVE" },
        { id: "whisper_stream", name: "Low-Latency Whisper Processing", weight: 1.0, utilizationCount: 3, successGate: 80, status: "ACTIVE" },
        { id: "d3_viz", name: "High-Fidelity D3 Grounding", weight: 1.5, utilizationCount: 11, successGate: 92, status: "ACTIVE" }
      ];
      defaultSkills.forEach(s => {
        store.skills[s.id] = s;
      });
    }

    // Bootstrap default workflows if empty
    if (Object.keys(store.workflows).length === 0) {
      const defaultWorkflows: WorkflowRouting[] = [
        { id: "dropship_standard", name: "Standard Dropship Funnel Workflow", steps: ["tech_analyst", "brand_worker", "copy_worker"], reviewScoreAverage: 88, retired: false, optimizedCount: 0 },
        { id: "visual_brand_flow", name: "Visual Identity Workflow", steps: ["brand_worker", "logo_worker"], reviewScoreAverage: 91, retired: false, optimizedCount: 0 }
      ];
      defaultWorkflows.forEach(w => {
        store.workflows[w.id] = w;
      });
    }

    // Bootstrap default logs if empty
    if (store.logs.length === 0) {
      store.logs = [
        {
          id: "ev_log_bootstrap",
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          type: "ARCHITECTURE",
          action: "BOOTSTRAP_EVOLUTION",
          description: "Organizational Evolution Engine initialized successfully. Corporate variables mapped.",
          reasoning: "Self-improvement capabilities are now bound directly to the continuous feedback loop.",
          metricBefore: 0,
          metricAfter: 100
        }
      ];
    }

    // Bootstrap quality trends if empty (simulated metrics)
    if (store.qualityTrend.length === 0) {
      const now = Date.now();
      store.qualityTrend = [
        { date: new Date(now - 86400000 * 6).toLocaleDateString(), score: 82, experiments: 1, evolvedCount: 0 },
        { date: new Date(now - 86400000 * 5).toLocaleDateString(), score: 83, experiments: 2, evolvedCount: 1 },
        { date: new Date(now - 86400000 * 4).toLocaleDateString(), score: 85, experiments: 2, evolvedCount: 2 },
        { date: new Date(now - 86400000 * 3).toLocaleDateString(), score: 85, experiments: 3, evolvedCount: 3 },
        { date: new Date(now - 86400000 * 2).toLocaleDateString(), score: 87, experiments: 4, evolvedCount: 5 },
        { date: new Date(now - 86400000 * 1).toLocaleDateString(), score: 89, experiments: 3, evolvedCount: 7 }
      ];
    }
  }

  // Workers
  getWorkers(): Record<string, WorkerVersion> {
    return this.dbRef.evolutionStore.workers;
  }

  updateWorker(id: string, updates: Partial<WorkerVersion>): void {
    if (this.dbRef.evolutionStore.workers[id]) {
      this.dbRef.evolutionStore.workers[id] = {
        ...this.dbRef.evolutionStore.workers[id],
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }
  }

  addWorker(worker: WorkerVersion): void {
    this.dbRef.evolutionStore.workers[worker.id] = worker;
  }

  // Departments
  getDepartments(): Record<string, DepartmentStructure> {
    return this.dbRef.evolutionStore.departments;
  }

  updateDepartment(id: string, updates: Partial<DepartmentStructure>): void {
    if (this.dbRef.evolutionStore.departments[id]) {
      this.dbRef.evolutionStore.departments[id] = {
        ...this.dbRef.evolutionStore.departments[id],
        ...updates
      };
    }
  }

  // Policies
  getPolicies(): Record<string, EvolvedPolicy> {
    return this.dbRef.evolutionStore.policies;
  }

  updatePolicy(id: string, updates: Partial<EvolvedPolicy>): void {
    if (this.dbRef.evolutionStore.policies[id]) {
      this.dbRef.evolutionStore.policies[id] = {
        ...this.dbRef.evolutionStore.policies[id],
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }
  }

  // Skills
  getSkills(): Record<string, SkillOptimization> {
    return this.dbRef.evolutionStore.skills;
  }

  updateSkill(id: string, updates: Partial<SkillOptimization>): void {
    if (this.dbRef.evolutionStore.skills[id]) {
      this.dbRef.evolutionStore.skills[id] = {
        ...this.dbRef.evolutionStore.skills[id],
        ...updates
      };
    }
  }

  // Workflows
  getWorkflows(): Record<string, WorkflowRouting> {
    return this.dbRef.evolutionStore.workflows;
  }

  updateWorkflow(id: string, updates: Partial<WorkflowRouting>): void {
    if (this.dbRef.evolutionStore.workflows[id]) {
      this.dbRef.evolutionStore.workflows[id] = {
        ...this.dbRef.evolutionStore.workflows[id],
        ...updates
      };
    }
  }

  // Experiments
  getExperiments(): Record<string, ActiveExperiment> {
    return this.dbRef.evolutionStore.experiments;
  }

  createExperiment(experiment: ActiveExperiment): void {
    this.dbRef.evolutionStore.experiments[experiment.id] = experiment;
  }

  updateExperiment(id: string, updates: Partial<ActiveExperiment>): void {
    if (this.dbRef.evolutionStore.experiments[id]) {
      this.dbRef.evolutionStore.experiments[id] = {
        ...this.dbRef.evolutionStore.experiments[id],
        ...updates
      };
    }
  }

  // Logs
  getLogs(): EvolutionLogEntry[] {
    return this.dbRef.evolutionStore.logs;
  }

  addLog(log: Omit<EvolutionLogEntry, "id" | "timestamp">): void {
    const entry: EvolutionLogEntry = {
      ...log,
      id: `ev_log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString()
    };
    this.dbRef.evolutionStore.logs.unshift(entry);
    if (this.dbRef.evolutionStore.logs.length > 500) {
      this.dbRef.evolutionStore.logs = this.dbRef.evolutionStore.logs.slice(0, 500);
    }
  }

  // Quality Trends
  getQualityTrend(): any[] {
    return this.dbRef.evolutionStore.qualityTrend;
  }

  addQualityTrendEntry(score: number, experiments: number, evolvedCount: number): void {
    const today = new Date().toLocaleDateString();
    const trend = this.dbRef.evolutionStore.qualityTrend;
    // Overwrite if same date, or push new
    const existingIdx = trend.findIndex((t: any) => t.date === today);
    if (existingIdx !== -1) {
      trend[existingIdx] = { date: today, score, experiments, evolvedCount };
    } else {
      trend.push({ date: today, score, experiments, evolvedCount });
    }
    if (trend.length > 30) {
      trend.shift();
    }
  }
}
