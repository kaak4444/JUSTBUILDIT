import { EvolutionMemory, WorkerVersion, EvolvedPolicy } from "./EvolutionMemory.ts";
import { SuggestedEvolutionMutation } from "./OrganizationAnalyzer.ts";
import { WorkerEvolution } from "./WorkerEvolution.ts";
import { DepartmentEvolution } from "./DepartmentEvolution.ts";
import { SkillEvolution } from "./SkillEvolution.ts";
import { PromptEvolution } from "./PromptEvolution.ts";
import { WorkflowEvolution } from "./WorkflowEvolution.ts";
import { PolicyEvolution } from "./PolicyEvolution.ts";
import { ArchitectureEvolution } from "./ArchitectureEvolution.ts";
import { ExperimentEngine } from "./ExperimentEngine.ts";
import { OrganizationAnalyzer } from "./OrganizationAnalyzer.ts";

export class EvolutionEngine {
  private static instance: EvolutionEngine | null = null;

  public memory: EvolutionMemory;
  public workerEvolution: WorkerEvolution;
  public departmentEvolution: DepartmentEvolution;
  public skillEvolution: SkillEvolution;
  public promptEvolution: PromptEvolution;
  public workflowEvolution: WorkflowEvolution;
  public policyEvolution: PolicyEvolution;
  public architectureEvolution: ArchitectureEvolution;
  public experimentEngine: ExperimentEngine;
  public organizationAnalyzer: OrganizationAnalyzer;

  private constructor(db: any) {
    this.memory = new EvolutionMemory(db);
    this.workerEvolution = new WorkerEvolution(this.memory);
    this.departmentEvolution = new DepartmentEvolution(this.memory);
    this.skillEvolution = new SkillEvolution(this.memory);
    this.promptEvolution = new PromptEvolution(this.memory);
    this.workflowEvolution = new WorkflowEvolution(this.memory);
    this.policyEvolution = new PolicyEvolution(this.memory);
    this.architectureEvolution = new ArchitectureEvolution(this.memory);
    this.experimentEngine = new ExperimentEngine(this.memory);
    this.organizationAnalyzer = new OrganizationAnalyzer(this.memory);
  }

  public static getInstance(db?: any): EvolutionEngine {
    if (!EvolutionEngine.instance) {
      if (!db) {
        throw new Error("Database reference is required to initialize EvolutionEngine.");
      }
      EvolutionEngine.instance = new EvolutionEngine(db);
    }
    return EvolutionEngine.instance;
  }

  /**
   * Orchestrates an evolution run triggered automatically at the completion of a project or run.
   */
  public triggerEvolutionCycle(projectId: string, finalScore: number, feedbackText: string): { evolvedCount: number; messages: string[] } {
    const messages: string[] = [];
    let evolvedCount = 0;

    // 1. Evolve active workers assigned to the project
    const workers = this.memory.getWorkers();
    Object.keys(workers).forEach(workerId => {
      // For simulation, assume workers with active tasks are evaluated
      const res = this.workerEvolution.evolveWorker(workerId, { score: finalScore, feedback: feedbackText });
      if (res.evolved) {
        evolvedCount++;
        messages.push(res.message);
      }
    });

    // 2. Evaluate all departments
    const depts = this.memory.getDepartments();
    Object.keys(depts).forEach(deptId => {
      const res = this.departmentEvolution.evaluateDepartment(deptId);
      if (res.restructured) {
        evolvedCount++;
        messages.push(`Restructured '${deptId}' department following severe worker underperformance.`);
      }
    });

    // 3. Adapt operational policies (Budget & Quality Gate)
    const healthTrend = finalScore >= 85 ? "IMPROVING" : "DECLINING";
    const budgetRes = this.policyEvolution.adaptPolicy("budget_limit", healthTrend);
    if (budgetRes.adjusted) {
      evolvedCount++;
      messages.push(`Scaled budget limit policy from $${budgetRes.valueBefore} to $${budgetRes.valueAfter}`);
    }

    const gateRes = this.policyEvolution.adaptPolicy("quality_gate", healthTrend);
    if (gateRes.adjusted) {
      evolvedCount++;
      messages.push(`Adapted quality review threshold gate to ${gateRes.valueAfter}%`);
    }

    // 4. Update overall corporate quality trend index
    const experimentsCount = Object.values(this.memory.getExperiments()).filter(e => e.status === "RUNNING").length;
    this.memory.addQualityTrendEntry(finalScore, experimentsCount, evolvedCount);

    this.memory.addLog({
      projectId,
      type: "ARCHITECTURE",
      action: "COMPLETE_EVOLUTION_CYCLE",
      description: `Completed organizational self-improvement loop for project '${projectId}' (Score: ${finalScore})`,
      reasoning: `Orchestrated mutations over workers, departments, and corporate policy nodes. Total mutations applied: ${evolvedCount}`,
      metricBefore: 85,
      metricAfter: Math.round(finalScore)
    });

    return { evolvedCount, messages };
  }

  /**
   * Manually executes a proposed mutation directly from the user dashboard.
   */
  public executeManualMutation(suggestion: any): { success: boolean; message: string } {
    const type = suggestion.type;
    const targetId = suggestion.targetId;

    if (type === "WORKER") {
      this.memory.updateWorker(targetId, suggestion.proposedChange);
      this.memory.addLog({
        type: "WORKER",
        action: "EXECUTE_MANUAL_MUTATION",
        description: `Executed manual prompt update on worker '${targetId}'`,
        reasoning: "User approved suggestion from the Organizational Evolution panel.",
        metricBefore: 0,
        metricAfter: 100
      });
      return { success: true, message: `Successfully updated worker '${targetId}' prompt configuration.` };
    }

    if (type === "POLICY") {
      this.memory.updatePolicy(targetId, {
        value: suggestion.proposedChange
      });
      this.memory.addLog({
        type: "POLICY",
        action: "EXECUTE_MANUAL_MUTATION",
        description: `Executed manual policy update on '${targetId}'`,
        reasoning: "User approved policy suggestion from the Organizational Evolution panel.",
        metricBefore: 0,
        metricAfter: 100
      });
      return { success: true, message: `Successfully updated policy '${targetId}' to value '${suggestion.proposedChange}'.` };
    }

    if (type === "WORKFLOW") {
      this.memory.updateWorkflow(targetId, {
        steps: suggestion.proposedChange.steps
      });
      this.memory.addLog({
        type: "WORKFLOW",
        action: "EXECUTE_MANUAL_MUTATION",
        description: `Executed manual workflow sequence update on '${targetId}'`,
        reasoning: "User approved workflow routing override.",
        metricBefore: 0,
        metricAfter: 100
      });
      return { success: true, message: `Successfully optimized workflow '${targetId}' sequence.` };
    }

    if (type === "EXPERIMENT") {
      this.experimentEngine.launchExperiment(
        suggestion.proposedChange.name,
        suggestion.proposedChange.targetType,
        suggestion.proposedChange.targetId,
        suggestion.proposedChange.variantA,
        suggestion.proposedChange.variantB
      );
      return { success: true, message: `Successfully launched A/B experiment '${suggestion.proposedChange.name}'.` };
    }

    // Default: run architectural evolution
    if (type === "ARCHITECTURE") {
      const res = this.architectureEvolution.evolveSystemArchitecture();
      return { success: true, message: `System: ${res.description}` };
    }

    return { success: false, message: `Unknown mutation type '${type}'` };
  }
}
