import { EvolutionMemory } from "./EvolutionMemory.ts";

export interface SuggestedEvolutionMutation {
  id: string;
  type: "WORKER" | "POLICY" | "WORKFLOW" | "SKILL" | "ARCHITECTURE" | "EXPERIMENT";
  targetId: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  title: string;
  description: string;
  proposedChange: any;
  reasoning: string;
}

export class OrganizationAnalyzer {
  private memory: EvolutionMemory;

  constructor(memory: EvolutionMemory) {
    this.memory = memory;
  }

  /**
   * Scans company data and historical reviews to find bottlenecks, and recommends structural mutations.
   */
  public analyzeOrganization(): SuggestedEvolutionMutation[] {
    const suggestions: SuggestedEvolutionMutation[] = [];
    const workers = this.memory.getWorkers();
    const departments = this.memory.getDepartments();
    const policies = this.memory.getPolicies();
    const workflows = this.memory.getWorkflows();

    // 1. Check for worker bottlenecks (Low success rates)
    Object.entries(workers).forEach(([id, w]) => {
      if (w.successRate < 85 && w.tasksCompleted >= 2) {
        suggestions.push({
          id: `sug_worker_${id}_${Date.now()}`,
          type: "WORKER",
          targetId: id,
          severity: "HIGH",
          title: `Mutate ${w.name} Prompt Template`,
          description: `Worker success rate has degraded to ${w.successRate}% over ${w.tasksCompleted} tasks.`,
          proposedChange: {
            promptTemplate: `${w.promptTemplate}\nRefinement Guardrails: Strictly audit all output variables against structural layout gaps and visual artifacts.`
          },
          reasoning: `High defect levels reported inside tasks processed by ${w.name}. Immediate guideline injections required.`
        });
      }
    });

    // 2. Check for department alignment mismatches
    Object.entries(departments).forEach(([id, dept]) => {
      if (dept.alignmentIndex < 90) {
        suggestions.push({
          id: `sug_dept_${id}_${Date.now()}`,
          type: "EXPERIMENT",
          targetId: id,
          severity: "MEDIUM",
          title: `Launch A/B Policy Test on ${dept.name}`,
          description: `Department alignment index of ${dept.alignmentIndex}% is below standard.`,
          proposedChange: {
            name: `Optimize ${dept.name} Veto Constraints`,
            targetType: "POLICY",
            targetId: "veto_sensitivity",
            variantA: "HIGH",
            variantB: "NORMAL"
          },
          reasoning: `Deploying an automated A/B experiment on veto policies will calibrate decision thresholds and stabilize department alignment.`
        });
      }
    });

    // 3. Check for policy boundaries
    const budgetPolicy = policies["budget_limit"];
    if (budgetPolicy && budgetPolicy.value > 200) {
      suggestions.push({
        id: `sug_policy_budget_${Date.now()}`,
        type: "POLICY",
        targetId: "budget_limit",
        severity: "LOW",
        title: "Scale Down Autonomic Budget Cap",
        description: `Active exploration budget cap ($${budgetPolicy.value}) exceeds safety parameters.`,
        proposedChange: 150,
        reasoning: "Conserve exploratory corporate capital until higher overall review averages are reached."
      });
    }

    // 4. Check for workflow optimization opportunities
    Object.entries(workflows).forEach(([id, w]) => {
      if (w.reviewScoreAverage < 85 && !w.retired) {
        suggestions.push({
          id: `sug_wf_${id}_${Date.now()}`,
          type: "WORKFLOW",
          targetId: id,
          severity: "MEDIUM",
          title: `Bypass Step in ${w.name}`,
          description: `Workflow average review score is sluggish (${w.reviewScoreAverage}%).`,
          proposedChange: {
            steps: w.steps.filter((_, idx) => idx !== 1) // Bypass second step
          },
          reasoning: `Pruning intermediate dependencies simplifies execution and prevents cognitive dilution.`
        });
      }
    });

    // Default general suggestion if no bottlenecks are found
    if (suggestions.length === 0) {
      suggestions.push({
        id: `sug_arch_opt_${Date.now()}`,
        type: "ARCHITECTURE",
        targetId: "system",
        severity: "LOW",
        title: "Optimize Neural JSON Response Cache",
        description: "Standardize formatting layers to speed up API routes.",
        proposedChange: true,
        reasoning: "System is running at maximum efficiency. Optimization of structural layout speeds up autonomic loops."
      });
    }

    return suggestions;
  }
}
