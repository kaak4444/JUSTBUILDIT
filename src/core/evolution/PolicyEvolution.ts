import { EvolutionMemory, EvolvedPolicy } from "./EvolutionMemory.ts";

export class PolicyEvolution {
  private memory: EvolutionMemory;

  constructor(memory: EvolutionMemory) {
    this.memory = memory;
  }

  /**
   * Adapts governance and operational boundaries (Self-Review approvals, budget caps) based on corporate health.
   */
  public adaptPolicy(policyId: string, healthTrend: "IMPROVING" | "DECLINING"): { adjusted: boolean; valueBefore: any; valueAfter: any } {
    const policies = this.memory.getPolicies();
    const policy = policies[policyId];

    if (!policy) {
      return { adjusted: false, valueBefore: null, valueAfter: null };
    }

    const valueBefore = policy.value;
    let valueAfter = valueBefore;

    if (policy.category === "BUDGET") {
      // If health is improving, we can expand exploration budget caps. If declining, consolidate!
      const currentBudget = typeof valueBefore === "number" ? valueBefore : 150;
      valueAfter = healthTrend === "IMPROVING" ? currentBudget + 25 : Math.max(75, currentBudget - 20);
    } else if (policy.category === "QUALITY_GATE") {
      // If declining, raise quality gates so reviews become more defensive. If improving, lock down stability.
      const currentGate = typeof valueBefore === "number" ? valueBefore : 85;
      valueAfter = healthTrend === "DECLINING" ? Math.min(95, currentGate + 2) : Math.max(80, currentGate - 1);
    } else if (policy.category === "VETO_SENSID") {
      // Toggle veto sensitivity
      valueAfter = healthTrend === "DECLINING" ? "HIGH" : "NORMAL";
    }

    if (valueAfter !== valueBefore) {
      const newVersion = policy.version + 1;
      this.memory.updatePolicy(policyId, {
        value: valueAfter,
        version: newVersion
      });

      this.memory.addLog({
        type: "POLICY",
        action: "MUTATE_GOVERNANCE_POLICY",
        description: `Adapted policy '${policy.name}' to value '${valueAfter}' (v${newVersion}) due to health: ${healthTrend}`,
        reasoning: `Cybernetic adaptation of operational thresholds matching corporate health parameters.`,
        metricBefore: typeof valueBefore === "number" ? valueBefore : 0,
        metricAfter: typeof valueAfter === "number" ? valueAfter : 1
      });

      return { adjusted: true, valueBefore, valueAfter };
    }

    return { adjusted: false, valueBefore, valueAfter };
  }
}
