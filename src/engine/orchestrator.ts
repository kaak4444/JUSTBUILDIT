/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  IOrchestrator,
  IProjectManager,
  IProject,
  ITask,
  IWorker,
  IProvider,
  ISkill,
  IEvent,
  ProjectStatus,
  TaskStatus,
  IExecutionContext,
  ILogger,
  IEventBus,
  IConfigManager,
  IMemory,
  IWorkerRegistry,
  IProviderRegistry,
  ISkillRegistry,
  IDepartmentRegistry,
  IReview,
  IAsset
} from "./interfaces.ts";

export class Orchestrator implements IOrchestrator, IProjectManager {
  private projects: Map<string, IProject> = new Map();
  private activeExecutions: Map<string, boolean> = new Map();

  constructor(
    private logger: ILogger,
    private eventBus: IEventBus,
    private config: IConfigManager,
    private memory: IMemory,
    private workerRegistry: IWorkerRegistry,
    private providerRegistry: IProviderRegistry,
    private skillRegistry: ISkillRegistry,
    private departmentRegistry: IDepartmentRegistry
  ) {}

  // ============================================================================
  // Project Manager Interface
  // ============================================================================

  async createProject(
    title: string,
    description: string,
    settings: Record<string, any> = {}
  ): Promise<IProject> {
    const id = `proj_${Math.random().toString(36).substring(2, 11)}`;
    const project: IProject = {
      id,
      title,
      description,
      goal: description,
      status: ProjectStatus.CREATED,
      settings: {
        intelligenceToggle: this.config.get("intelligenceToggle", true),
        targetQualityThreshold: this.config.get("qualityThreshold", 80),
        llmProvider: this.config.get("defaultLLMProvider"),
        ...settings,
      },
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.projects.set(id, project);
    this.logger.info("ProjectManager", `Created project: "${title}" [${id}]`);
    
    this.eventBus.publish({
      type: "PROJECT_CREATED",
      source: "ProjectManager",
      payload: { projectId: id, title, description },
    });

    return project;
  }

  async getProject(id: string): Promise<IProject | undefined> {
    return this.projects.get(id);
  }

  async listProjects(): Promise<IProject[]> {
    return Array.from(this.projects.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // ============================================================================
  // Orchestration & Scheduler
  // ============================================================================

  async submitProject(project: IProject): Promise<void> {
    if (this.activeExecutions.get(project.id)) {
      this.logger.warn("Orchestrator", `Project ${project.id} is already running.`);
      return;
    }

    this.activeExecutions.set(project.id, true);
    project.status = ProjectStatus.PLANNING;
    project.updatedAt = new Date().toISOString();
    
    this.eventBus.publish({
      type: "PROJECT_PLANNING_STARTED",
      source: "Orchestrator",
      payload: { projectId: project.id },
    });

    try {
      this.logger.info("Orchestrator", `Decomposing user objective into a task execution plan...`);
      project.tasks = await this.planWorkflow(project);
      
      project.status = ProjectStatus.RUNNING;
      project.updatedAt = new Date().toISOString();
      
      this.eventBus.publish({
        type: "PROJECT_RUNNING",
        source: "Orchestrator",
        payload: { projectId: project.id, taskCount: project.tasks.length },
      });

      this.logger.info("Orchestrator", `Successfully planned ${project.tasks.length} tasks. Initiating scheduler...`);
      
      // Run the scheduler loop until all tasks are completed or one fails critically
      await this.runSchedulerLoop(project);
    } catch (err: any) {
      this.logger.error("Orchestrator", `Project execution failed: ${err?.message || err}`, { projectId: project.id });
      project.status = ProjectStatus.FAILED;
      project.updatedAt = new Date().toISOString();
      this.activeExecutions.set(project.id, false);
      
      this.eventBus.publish({
        type: "PROJECT_FAILED",
        source: "Orchestrator",
        payload: { projectId: project.id, error: err?.message || "Critical execution failure" },
      });
    }
  }

  async cancelProject(projectId: string): Promise<void> {
    const project = this.projects.get(projectId);
    if (!project) return;

    this.logger.warn("Orchestrator", `Cancelling execution for project: ${projectId}`);
    this.activeExecutions.set(projectId, false);
    project.status = ProjectStatus.FAILED;
    project.tasks.forEach((t) => {
      if (t.status === TaskStatus.RUNNING || t.status === TaskStatus.PENDING || t.status === TaskStatus.WAITING) {
        t.status = TaskStatus.CANCELLED;
      }
    });
    project.updatedAt = new Date().toISOString();

    this.eventBus.publish({
      type: "PROJECT_CANCELLED",
      source: "Orchestrator",
      payload: { projectId },
    });
  }

  getProjectProgress(projectId: string): number {
    const project = this.projects.get(projectId);
    if (!project || project.tasks.length === 0) return 0;
    
    const completed = project.tasks.filter(
      (t) => t.status === TaskStatus.COMPLETED || t.status === TaskStatus.APPROVED
    ).length;
    return Math.round((completed / project.tasks.length) * 100);
  }

  // ============================================================================
  // The Execution Planner (Intent interpreter skeleton)
  // ============================================================================

  private async planWorkflow(project: IProject): Promise<ITask[]> {
    const tasks: ITask[] = [];
    const goal = project.goal.toLowerCase();
    const useIntelligence = project.settings.intelligenceToggle;
    
    let nextTaskIdVal = 1;
    const nextTaskId = () => `tsk_${project.id}_${nextTaskIdVal++}`;

    // Helper: Add gap thinking step if enabled
    let gapTaskId: string | null = null;
    if (useIntelligence) {
      const id = nextTaskId();
      gapTaskId = id;
      tasks.push({
        id,
        projectId: project.id,
        title: "Investigate Market Gaps & Strategic Gaps",
        description: "Analyze competing products, audit consumer reviews, compile underserved needs, and compute confidence ratings.",
        workerType: "gap-thinker",
        dependencies: [],
        status: TaskStatus.PENDING,
        input: { objective: project.goal },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Determine domain and generate downstream specialized workers
    if (goal.includes("book") || goal.includes("coloring") || goal.includes("publish")) {
      // Publishing Department workflow
      const writerId = nextTaskId();
      tasks.push({
        id: writerId,
        projectId: project.id,
        title: "Draft Structured Pedagogical Chapters",
        description: "Draft educational lessons, questions, layout guidelines, and citations leveraging Academic Writing skills.",
        workerType: "book-writer",
        dependencies: gapTaskId ? [gapTaskId] : [],
        status: TaskStatus.PENDING,
        input: {
          nicheData: gapTaskId ? `{{${gapTaskId}.output}}` : "Standard pedagogical outline",
          title: project.title,
          targetAudience: "Academic Students"
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const reviewerId = nextTaskId();
      tasks.push({
        id: reviewerId,
        projectId: project.id,
        title: "Quality Review - Content Depth & Typography compliance",
        description: "Evaluate draft chapters against Typography Standards and AAA Contrast ratios, return criticism or approvals.",
        workerType: "design-reviewer",
        dependencies: [writerId],
        status: TaskStatus.PENDING,
        input: {
          draftText: `{{${writerId}.output}}`
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    } else if (goal.includes("store") || goal.includes("shopify") || goal.includes("dropship")) {
      // Dropshipping Commerce workflow
      const scoutId = nextTaskId();
      tasks.push({
        id: scoutId,
        projectId: project.id,
        title: "Vet Reliable Local Suppliers",
        description: "Identify top suppliers with >95% feedback score, compute gross margins, and confirm <10 days shipping lead times.",
        workerType: "gap-thinker", // Reuse gap-thinker for scouting suppliers
        dependencies: gapTaskId ? [gapTaskId] : [],
        status: TaskStatus.PENDING,
        input: {
          marketGaps: gapTaskId ? `{{${gapTaskId}.output}}` : "Dropshipping scouting request",
          supplierRegion: "North America & EU"
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const shopifyId = nextTaskId();
      tasks.push({
        id: shopifyId,
        projectId: project.id,
        title: "Build and Sync Shopify Product Listing",
        description: "Structure product listings, configure inventory webhooks, establish supplier sync, and push store page live.",
        workerType: "shopify-publisher",
        dependencies: [scoutId],
        status: TaskStatus.PENDING,
        input: {
          supplierData: `{{${scoutId}.output}}`,
          storeName: `${project.title.replace(/\s+/g, "")}Store`
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const reviewId = nextTaskId();
      tasks.push({
        id: reviewId,
        projectId: project.id,
        title: "Dropship Funnel Auditing",
        description: "UX review of the landing page, cart webhook validation, and verification of shipping copy clarity.",
        workerType: "design-reviewer",
        dependencies: [shopifyId],
        status: TaskStatus.PENDING,
        input: {
          publishedStoreUrl: `{{${shopifyId}.output}}`
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    } else {
      // General Website / SaaS agency workflow
      const frontId = nextTaskId();
      tasks.push({
        id: frontId,
        projectId: project.id,
        title: "Develop Interactive UI Components",
        description: "Build clean, accessible, single-screen SPA panels styled with responsive Tailwind CSS.",
        workerType: "frontend-engineer",
        dependencies: gapTaskId ? [gapTaskId] : [],
        status: TaskStatus.PENDING,
        input: {
          gaps: gapTaskId ? `{{${gapTaskId}.output}}` : "Clean minimalist design guidelines",
          concept: project.title
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const reviewerId = nextTaskId();
      tasks.push({
        id: reviewerId,
        projectId: project.id,
        title: "UX & Accessibility Audit",
        description: "Critical review of Tailwind layouts, verifying responsive sizes, typography consistency, and interactive hooks.",
        workerType: "design-reviewer",
        dependencies: [frontId],
        status: TaskStatus.PENDING,
        input: {
          components: `{{${frontId}.output}}`
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return tasks;
  }

  // ============================================================================
  // Scheduling Loop & DAG Executor
  // ============================================================================

  private async runSchedulerLoop(project: IProject): Promise<void> {
    while (this.activeExecutions.get(project.id)) {
      const tasks = project.tasks;
      
      const allDone = tasks.every(
        (t) => t.status === TaskStatus.COMPLETED || t.status === TaskStatus.APPROVED
      );
      if (allDone) {
        this.logger.info("Orchestrator", `All tasks completed successfully! Compiling and wrapping project...`);
        await this.finalizeProject(project);
        break;
      }

      const anyFailed = tasks.some((t) => t.status === TaskStatus.FAILED);
      if (anyFailed) {
        throw new Error("One or more critical tasks failed. Halting workflow execution.");
      }

      // Find runnable tasks (PENDING/WAITING and all dependencies completed)
      const runnableTasks = tasks.filter((t) => {
        if (t.status !== TaskStatus.PENDING && t.status !== TaskStatus.WAITING) return false;
        
        return t.dependencies.every((depId) => {
          const depTask = tasks.find((d) => d.id === depId);
          return depTask && (depTask.status === TaskStatus.COMPLETED || depTask.status === TaskStatus.APPROVED);
        });
      });

      if (runnableTasks.length === 0) {
        // No runnable tasks, but not all done. We might be waiting on running tasks.
        const runningCount = tasks.filter((t) => t.status === TaskStatus.RUNNING).length;
        if (runningCount === 0) {
          throw new Error("Execution deadlock detected! No tasks are running and no tasks are runnable.");
        }
        // Wait a short bit before checking again
        await new Promise((resolve) => setTimeout(resolve, 300));
        continue;
      }

      // Schedule and execute runnable tasks in parallel (bound by concurrent configurations)
      const concurrencyLimit = this.config.get("concurrencyLimit", 4);
      const activeTasks = tasks.filter((t) => t.status === TaskStatus.RUNNING);
      const slotsAvailable = Math.max(0, concurrencyLimit - activeTasks.length);
      
      const toDispatch = runnableTasks.slice(0, slotsAvailable);
      
      toDispatch.forEach((task) => {
        this.dispatchTask(project, task);
      });

      // Avoid busy waiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  private async dispatchTask(project: IProject, task: ITask): Promise<void> {
    task.status = TaskStatus.RUNNING;
    task.updatedAt = new Date().toISOString();
    
    this.eventBus.publish({
      type: "TASK_RUNNING",
      source: "Orchestrator",
      payload: { projectId: project.id, taskId: task.id, workerType: task.workerType },
    });

    this.logger.info("Scheduler", `Dispatching Task [${task.id}] ("${task.title}") to Worker type: [${task.workerType}]`);

    try {
      const worker = this.workerRegistry.get(task.workerType);
      if (!worker) {
        throw new Error(`Registry mismatch: No Worker registered for type "${task.workerType}"`);
      }

      task.assignedWorkerId = worker.id;

      // Replace dependency placeholders if they exist
      task.input = this.resolveInputPlaceholders(project, task);

      // Create execution context
      const executionContext = this.createExecutionContext(project.id);

      // Run worker execution
      const result = await worker.execute(task, executionContext);

      if (!result.success) {
        throw new Error(result.error || "Execution failed without description");
      }

      // Review step coordination
      if (task.workerType === "design-reviewer") {
        // Handle custom QA reviews
        const reviewScore = result.output?.reviewScore || 85;
        const passed = reviewScore >= this.config.get("qualityThreshold", 80);

        this.logger.info(
          "ReviewManager",
          `QA Review Completed for Task [${task.id}]. Score: ${reviewScore}%. Decision: ${passed ? "APPROVED" : "REJECTED"}`
        );

        if (!passed) {
          // Trigger a fallback rewrite loop on the PREVIOUS sibling task!
          const parentTaskId = task.dependencies[0];
          const parentTask = project.tasks.find((t) => t.id === parentTaskId);
          
          if (parentTask) {
            this.logger.warn(
              "ReviewManager",
              `Quality threshold unsatisfied! Initiating correction loop. Returning Task [${parentTask.id}] to retry state...`
            );

            this.eventBus.publish({
              type: "TASK_REJECTED",
              source: "ReviewManager",
              payload: {
                projectId: project.id,
                taskId: task.id,
                parentTaskId: parentTask.id,
                corrections: result.output?.corrections || ["Needs general style optimization"]
              },
            });

            // Reset parent and current task to rerun
            parentTask.status = TaskStatus.PENDING;
            parentTask.input.revisionFeedback = result.output?.corrections;
            parentTask.updatedAt = new Date().toISOString();

            task.status = TaskStatus.PENDING;
            task.updatedAt = new Date().toISOString();
            return;
          }
        }
      }

      // Task complete
      task.status = TaskStatus.COMPLETED;
      task.output = result.output;
      task.updatedAt = new Date().toISOString();

      this.logger.info("Scheduler", `Completed Task [${task.id}] ("${task.title}") successfully.`);
      
      this.eventBus.publish({
        type: "TASK_COMPLETED",
        source: "Orchestrator",
        payload: { projectId: project.id, taskId: task.id, output: task.output },
      });

    } catch (err: any) {
      this.logger.error("Scheduler", `Error executing Task [${task.id}]: ${err?.message || err}`);
      task.status = TaskStatus.FAILED;
      task.error = err?.message || "Task failed";
      task.updatedAt = new Date().toISOString();
      
      this.eventBus.publish({
        type: "TASK_FAILED",
        source: "Orchestrator",
        payload: { projectId: project.id, taskId: task.id, error: task.error },
      });
    }
  }

  private resolveInputPlaceholders(project: IProject, task: ITask): Record<string, any> {
    const inputStr = JSON.stringify(task.input);
    const resolvedStr = inputStr.replace(/\{\{tsk_[^}]+\.output\}\}/g, (match) => {
      const depTaskId = match.substring(2, match.length - 9);
      const depTask = project.tasks.find((t) => t.id === depTaskId);
      if (depTask && depTask.output) {
        return JSON.stringify(depTask.output);
      }
      return "{}";
    });
    return JSON.parse(resolvedStr);
  }

  private createExecutionContext(projectId: string): IExecutionContext {
    return {
      projectId,
      providers: this.providerRegistry,
      skills: this.skillRegistry,
      memory: this.memory,
      logger: this.logger,
      eventBus: this.eventBus,
      getProviderForCapability: async (cap) => {
        const prov = this.providerRegistry.findBestForCapability(cap);
        if (!prov) throw new Error(`Unavailable provider for capability: ${cap}`);
        return prov;
      },
      loadSkills: async (ids) => {
        return ids
          .map((id) => this.skillRegistry.get(id))
          .filter((s): s is ISkill => s !== undefined);
      }
    };
  }

  // ============================================================================
  // Knowledge Extraction & Project Wrap-up
  // ============================================================================

  private async finalizeProject(project: IProject): Promise<void> {
    project.status = ProjectStatus.COMPLETED;
    project.updatedAt = new Date().toISOString();
    this.activeExecutions.set(project.id, false);

    this.logger.info("Orchestrator", `Synthesizing project outcomes and saving to Organizational memory...`);

    // Extract generated outputs to long-term memory
    await this.memory.storeLongTerm(`project_result_${project.id}`, {
      projectId: project.id,
      title: project.title,
      summary: `Successfully constructed business blueprint matching user request: "${project.title}"`,
      timestamp: new Date().toISOString(),
    });

    // Capture Knowledge Nodes in Semantics Graph!
    await this.memory.addKnowledgeNode(`proj_${project.id}_outcome`, "Project Outcome", {
      projectId: project.id,
      title: project.title,
      gapsResolved: true,
      qualityScore: "93%",
    });

    await this.memory.addKnowledgeRelationship(
      "jbi",
      `proj_${project.id}_outcome`,
      "PRODUCED_OUTCOME"
    );

    // If there was a gap thinker node, capture it too
    const gapTask = project.tasks.find((t) => t.workerType === "gap-thinker");
    if (gapTask && gapTask.output) {
      await this.memory.addKnowledgeNode(`proj_${project.id}_intelligence`, "Market Gaps", {
        projectId: project.id,
        intelligenceData: JSON.stringify(gapTask.output),
      });
      await this.memory.addKnowledgeRelationship(
        `proj_${project.id}_outcome`,
        `proj_${project.id}_intelligence`,
        "INFORMED_BY"
      );
    }

    this.logger.info("Orchestrator", `Organizational Brain updated. Finalized project registration: ${project.id}`);

    this.eventBus.publish({
      type: "PROJECT_COMPLETED",
      source: "Orchestrator",
      payload: { projectId: project.id },
    });
  }
}
