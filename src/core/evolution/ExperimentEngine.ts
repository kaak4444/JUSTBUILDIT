import { EvolutionMemory, ActiveExperiment } from "./EvolutionMemory.ts";

export class ExperimentEngine {
  private memory: EvolutionMemory;

  constructor(memory: EvolutionMemory) {
    this.memory = memory;
  }

  /**
   * Registers a brand-new A/B experiment inside the organization.
   */
  public launchExperiment(name: string, targetType: "PROMPT" | "POLICY" | "WORKFLOW", targetId: string, variantA: any, variantB: any): ActiveExperiment {
    const experiment: ActiveExperiment = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name,
      targetType,
      targetId,
      variantA,
      variantB,
      sampleCountA: 0,
      sampleCountB: 0,
      scoreSumA: 0,
      scoreSumB: 0,
      status: "RUNNING",
      createdAt: new Date().toISOString()
    };

    this.memory.createExperiment(experiment);

    this.memory.addLog({
      type: "EXPERIMENT",
      action: "LAUNCH_AB_TEST",
      description: `Launched A/B Experiment '${name}' targeting '${targetType}' (${targetId})`,
      reasoning: `Testing variant parameters to determine optimal baseline config for future autonomic cycles.`,
      metricBefore: 0,
      metricAfter: 50
    });

    return experiment;
  }

  /**
   * Registers performance score for an ongoing experiment.
   */
  public recordResult(experimentId: string, variant: "A" | "B", score: number): void {
    const experiments = this.memory.getExperiments();
    const exp = experiments[experimentId];

    if (!exp || exp.status === "CONCLUDED") return;

    if (variant === "A") {
      this.memory.updateExperiment(experimentId, {
        sampleCountA: exp.sampleCountA + 1,
        scoreSumA: exp.scoreSumA + score
      });
    } else {
      this.memory.updateExperiment(experimentId, {
        sampleCountB: exp.sampleCountB + 1,
        scoreSumB: exp.scoreSumB + score
      });
    }

    // Auto-conclude after 5 samples per variant to find winner
    const updatedExp = this.memory.getExperiments()[experimentId];
    if (updatedExp.sampleCountA >= 5 && updatedExp.sampleCountB >= 5) {
      this.concludeExperiment(experimentId);
    }
  }

  private concludeExperiment(experimentId: string): void {
    const exp = this.memory.getExperiments()[experimentId];
    if (!exp) return;

    const avgA = exp.scoreSumA / exp.sampleCountA;
    const avgB = exp.scoreSumB / exp.sampleCountB;
    const winner = avgA >= avgB ? "A" : "B";

    this.memory.updateExperiment(experimentId, {
      status: "CONCLUDED",
      winner
    });

    // Apply winning parameter change in system memory
    const winningVal = winner === "A" ? exp.variantA : exp.variantB;

    if (exp.targetType === "POLICY") {
      this.memory.updatePolicy(exp.targetId, {
        value: winningVal
      });
    } else if (exp.targetType === "WORKFLOW") {
      this.memory.updateWorkflow(exp.targetId, {
        steps: winningVal
      });
    }

    this.memory.addLog({
      type: "EXPERIMENT",
      action: "CONCLUDE_AB_TEST",
      description: `Concluded Experiment '${exp.name}'. Winner: Variant ${winner} (Avg A: ${avgA.toFixed(1)}, Avg B: ${avgB.toFixed(1)})`,
      reasoning: `Permanently applied winning configuration: "${JSON.stringify(winningVal)}" to system metadata.`,
      metricBefore: Math.round(avgA),
      metricAfter: Math.round(avgB)
    });
  }
}
