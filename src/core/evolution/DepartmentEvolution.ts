import { EvolutionMemory, DepartmentStructure } from "./EvolutionMemory.ts";

export class DepartmentEvolution {
  private memory: EvolutionMemory;

  constructor(memory: EvolutionMemory) {
    this.memory = memory;
  }

  /**
   * Recalculates department metrics based on the performance of its child workers.
   * Promotes division of labor or restructures active/retired worker assignments.
   */
  public evaluateDepartment(departmentId: string): { restructured: boolean; alignmentIndex: number; efficiencyScore: number } {
    const departments = this.memory.getDepartments();
    const dept = departments[departmentId];

    if (!dept) {
      return { restructured: false, alignmentIndex: 0, efficiencyScore: 0 };
    }

    const workers = this.memory.getWorkers();
    const activeWorkersInDept = Object.values(workers).filter(w => w.departmentId === departmentId);

    if (activeWorkersInDept.length === 0) {
      return { restructured: false, alignmentIndex: dept.alignmentIndex, efficiencyScore: dept.efficiencyScore };
    }

    // Calculate aggregated metrics
    const totalSuccessRate = activeWorkersInDept.reduce((sum, w) => sum + w.successRate, 0);
    const averageSuccess = Math.round(totalSuccessRate / activeWorkersInDept.length);

    // Dynamic efficiency combines success rates with simulated response times
    const totalDuration = activeWorkersInDept.reduce((sum, w) => sum + w.averageDurationMs, 0);
    const averageDuration = totalDuration / activeWorkersInDept.length;
    const durationScore = Math.max(0, Math.min(100, Math.round(100 - (averageDuration / 50))));

    const newEfficiency = Math.round((averageSuccess * 0.7) + (durationScore * 0.3));
    // Alignment index is derived from the consistency of high scores
    const alignmentIndex = Math.min(100, Math.max(50, Math.round(averageSuccess + (activeWorkersInDept.length * 2))));

    let restructured = false;

    // Check if any worker is consistently underperforming (success < 60) and retire them, spinning up a replacement
    const failedWorker = activeWorkersInDept.find(w => w.successRate < 60 && w.tasksCompleted >= 5);
    if (failedWorker) {
      const activeWorkers = dept.activeWorkers.filter(id => id !== failedWorker.id);
      const retiredWorkers = [...dept.retiredWorkers, failedWorker.id];
      
      // Spawn new evolved clone worker
      const cloneId = `${failedWorker.id}_revised_${Date.now().toString(36).substr(2, 3)}`;
      const cloneWorker = {
        id: cloneId,
        name: `Evolved Clone of ${failedWorker.name}`,
        departmentId: departmentId,
        version: 1,
        promptTemplate: `System: You are an advanced cloned replacement for ${failedWorker.name}.\nAvoid previous design failures. Focus on maximum quality.`,
        successRate: 85,
        tasksCompleted: 0,
        averageDurationMs: failedWorker.averageDurationMs,
        updatedAt: new Date().toISOString()
      };

      this.memory.addWorker(cloneWorker);
      activeWorkers.push(cloneId);

      this.memory.updateDepartment(departmentId, {
        activeWorkers,
        retiredWorkers
      });

      this.memory.addLog({
        type: "ARCHITECTURE",
        action: "RETIRE_UNDERPERFORMER",
        description: `Retired underperforming worker '${failedWorker.name}' (Success: ${failedWorker.successRate}%) inside '${dept.name}'`,
        reasoning: `Spawned clone worker '${cloneWorker.name}' (${cloneWorker.id}) with fresh prompt standards to stabilize department alignment.`,
        metricBefore: dept.efficiencyScore,
        metricAfter: newEfficiency
      });

      restructured = true;
    } else {
      // Just update metrics
      this.memory.updateDepartment(departmentId, {
        alignmentIndex,
        efficiencyScore: newEfficiency
      });
    }

    return {
      restructured,
      alignmentIndex,
      efficiencyScore: newEfficiency
    };
  }
}
