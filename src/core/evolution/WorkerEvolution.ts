import { EvolutionMemory, WorkerVersion } from "./EvolutionMemory.ts";

export class WorkerEvolution {
  private memory: EvolutionMemory;

  constructor(memory: EvolutionMemory) {
    this.memory = memory;
  }

  /**
   * Evaluates worker metrics and performs fine-tuning mutations if underperformance is detected,
   * or scales/promotes high-performance worker parameters.
   */
  public evolveWorker(workerId: string, performanceFeedback: { score: number; feedback: string }): { evolved: boolean; message: string; versionBefore: number; versionAfter: number } {
    const workers = this.memory.getWorkers();
    const worker = workers[workerId];

    if (!worker) {
      return { evolved: false, message: `Worker ${workerId} not found in evolution memory.`, versionBefore: 0, versionAfter: 0 };
    }

    const versionBefore = worker.version;
    const tasksCompleted = worker.tasksCompleted + 1;
    const currentSuccessRate = worker.successRate;
    
    // Recalculate moving average success rate: score above 80 is successful task
    const isSuccess = performanceFeedback.score >= 80;
    const newSuccessRate = Math.round(((currentSuccessRate * worker.tasksCompleted) + (isSuccess ? 100 : 0)) / tasksCompleted);

    this.memory.updateWorker(workerId, {
      tasksCompleted,
      successRate: newSuccessRate
    });

    // Determine if mutation threshold is met
    // If the success score is low, or specifically under the standard quality gate (e.g. 85), mutate prompt template
    if (performanceFeedback.score < 85) {
      const newVersion = versionBefore + 1;
      const evolvedPrompt = this.mutatePrompt(worker.promptTemplate, performanceFeedback.feedback);
      
      this.memory.updateWorker(workerId, {
        version: newVersion,
        promptTemplate: evolvedPrompt,
        successRate: Math.max(newSuccessRate - 5, 50) // temporarily dip success rate to reflect uncalibrated new version
      });

      this.memory.addLog({
        type: "WORKER",
        action: "MUTATE_PROMPT_TEMPLATE",
        description: `Evolved worker '${worker.name}' to v${newVersion} due to score ${performanceFeedback.score}`,
        reasoning: `Injected defensive constraints targeting user critique: "${performanceFeedback.feedback.substring(0, 100)}"`,
        metricBefore: currentSuccessRate,
        metricAfter: newSuccessRate
      });

      return {
        evolved: true,
        message: `Successfully mutated '${worker.name}' prompts to v${newVersion} following feedback constraint injections.`,
        versionBefore,
        versionAfter: newVersion
      };
    }

    // If it is extremely successful, reinforce it!
    if (performanceFeedback.score >= 95) {
      this.memory.addLog({
        type: "WORKER",
        action: "REINFORCE_WORKER",
        description: `Reinforced worker '${worker.name}' success weights (Task Score: ${performanceFeedback.score})`,
        reasoning: `Worker completed task with elite score. Stable parameters locked down.`,
        metricBefore: currentSuccessRate,
        metricAfter: newSuccessRate
      });
    }

    return {
      evolved: false,
      message: `Worker '${worker.name}' maintained stability. Performance score (${performanceFeedback.score}) did not trigger mutations.`,
      versionBefore,
      versionAfter: versionBefore
    };
  }

  private mutatePrompt(currentPrompt: string, feedback: string): string {
    // Cybernetic prompt mutations append exact defensive guidelines extracted from the feedback context
    const sanitisedFeedback = feedback.replace(/\n/g, " ").trim();
    const defensiveInject = `\nDefensive Guardrails: User specified feedback points to avoid: "${sanitisedFeedback}". Do NOT repeat or allow this design fault. Force strict compliance with premium aesthetic tokens.`;
    return `${currentPrompt}${defensiveInject}`;
  }
}
