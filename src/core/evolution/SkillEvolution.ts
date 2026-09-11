import { EvolutionMemory, SkillOptimization } from "./EvolutionMemory.ts";

export class SkillEvolution {
  private memory: EvolutionMemory;

  constructor(memory: EvolutionMemory) {
    this.memory = memory;
  }

  /**
   * Evaluates skill performance and raises/lowers the skill weight or gate conditions.
   */
  public optimizeSkill(skillId: string, success: boolean): { optimized: boolean; weightBefore: number; weightAfter: number } {
    const skills = this.memory.getSkills();
    const skill = skills[skillId];

    if (!skill) {
      return { optimized: false, weightBefore: 1.0, weightAfter: 1.0 };
    }

    const weightBefore = skill.weight;
    const utilizationCount = skill.utilizationCount + 1;
    
    // Scale weight up slightly on success, decay slightly on failure to prefer successful skills
    let weightAfter = weightBefore;
    if (success) {
      weightAfter = Math.min(2.5, +(weightBefore + 0.05).toFixed(2));
    } else {
      weightAfter = Math.max(0.5, +(weightBefore - 0.08).toFixed(2));
    }

    this.memory.updateSkill(skillId, {
      utilizationCount,
      weight: weightAfter
    });

    if (Math.abs(weightAfter - weightBefore) >= 0.05) {
      this.memory.addLog({
        type: "SKILL",
        action: "OPTIMIZE_SKILL_WEIGHT",
        description: `Recalibrated skill weights for '${skill.name}' to ${weightAfter} (Utilization count: ${utilizationCount})`,
        reasoning: `Skill usage was associated with a project ${success ? "success" : "failure"} cycle. Dynamic feedback weight applied.`,
        metricBefore: weightBefore,
        metricAfter: weightAfter
      });
      return { optimized: true, weightBefore, weightAfter };
    }

    return { optimized: false, weightBefore, weightAfter };
  }
}
