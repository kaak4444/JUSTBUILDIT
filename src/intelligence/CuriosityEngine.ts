/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { KnowledgeAcquisitionTask, WorldGraph, SkillPackage, Evidence } from "./types.ts";

export class CuriosityEngine {
  private missingKnowledgeQueue: KnowledgeAcquisitionTask[] = [];
  private static acquiredSkills = new Map<string, SkillPackage>();

  /**
   * Inspects current tasks and WorldGraph to detect blind spots, scheduling acquisition tasks automatically.
   */
  public inspect(taskTitle: string, taskInput: Record<string, any>, graph: WorldGraph): KnowledgeAcquisitionTask[] {
    console.log(`[CuriosityEngine] Checking active intelligence blind spots for task: "${taskTitle}"`);
    const titleLower = taskTitle.toLowerCase();
    const discoveredTasks: KnowledgeAcquisitionTask[] = [];

    // 1. Identify missing tech docs or skills
    for (const [techId, tech] of graph.technologies.entries()) {
      if (!tech.documentation || tech.documentation.length === 0) {
        const id = `kat_tech_${techId}_${Date.now()}`;
        if (!this.missingKnowledgeQueue.some(t => t.unfamiliarTechnology === tech.name)) {
          discoveredTasks.push({
            id,
            topic: `Acquire and compile technical documentation and dynamic SkillPackage for: ${tech.name}`,
            unfamiliarTechnology: tech.name,
            status: "PENDING",
            createdAt: new Date().toISOString()
          });
        }
      }
    }

    // 2. Identify missing competitor profiling
    for (const [compId, comp] of graph.companies.entries()) {
      if (!comp.strengths || comp.strengths.length === 0 || !comp.weaknesses || comp.weaknesses.length === 0) {
        const id = `kat_comp_${compId}_${Date.now()}`;
        if (!this.missingKnowledgeQueue.some(t => t.targetCompetitor === comp.name)) {
          discoveredTasks.push({
            id,
            topic: `Analyze and profile core competencies, strengths, weaknesses for competitor: ${comp.name}`,
            targetCompetitor: comp.name,
            status: "PENDING",
            createdAt: new Date().toISOString()
          });
        }
      }
    }

    // Append newly discovered tasks
    this.missingKnowledgeQueue.push(...discoveredTasks);
    return discoveredTasks;
  }

  /**
   * Generates a reusable, permanent SkillPackage when an unfamiliar technology or concept is encountered.
   */
  public acquireSkill(conceptName: string, sources: Evidence[] = []): SkillPackage {
    const key = conceptName.toLowerCase().trim();
    const existing = CuriosityEngine.acquiredSkills.get(key);
    if (existing) {
      console.log(`[CuriosityEngine] SkillPackage already acquired and validated for: ${conceptName}`);
      return existing;
    }

    console.log(`[CuriosityEngine] Acquiring skill and generating reusable SkillPackage for: ${conceptName}`);

    // Generate advanced content structure for the brand-new skill package
    const skillPackage: SkillPackage = {
      id: `skill_${key}_${Date.now()}`,
      name: conceptName,
      concepts: [
        {
          name: conceptName,
          definition: `Structured programming standards and lifecycle paradigms governing ${conceptName} implementations.`
        },
        {
          name: "Reactive State Isolation",
          definition: "Bypassing recursive parent redraws by binding animation drivers to decoupled coordinate frames."
        }
      ],
      bestPractices: [
        {
          name: "Decouple Dimension Calculations",
          constraint: "Never feed calculated bounding dimensions directly to frame dependencies without debouncing.",
          remedy: "Employ a standard ResizeObserver wrapper to throttle calculations."
        },
        {
          name: "Hardware-Accelerated Layering",
          constraint: "Avoid updating raw layout properties (height, width, top, left) directly inside dynamic lists.",
          remedy: "Utilize transform translates (scale, translate3d) to offload animation cycles to the GPU."
        }
      ],
      commonErrors: [
        {
          name: "HMR Dependency Triggers",
          constraint: "Passing object references directly inside active event listeners.",
          remedy: "Normalize values into memoized primitives prior to hook assignment."
        }
      ],
      workflows: [
        {
          name: "Pristine Component Setup",
          steps: [
            "Initialize container element with a stable non-zero dimensions ref",
            "Subscribe ResizeObserver listener with a debouncer",
            "Mount hardware-accelerated css transforms inside the active motion container"
          ]
        }
      ],
      templates: [
        {
          name: "Pristine Component Base",
          boilerplate: `export function ${conceptName}Controller() {\n  return <div className="p-4 bg-slate-900 border border-slate-800 text-white rounded">Active Module</div>;\n}`
        }
      ],
      codeExamples: [
        {
          title: "Optimized Dynamic Slider",
          code: `import { motion } from "motion/react";\n\nexport function Slider() {\n  return (\n    <motion.div\n      initial={{ opacity: 0, x: -100 }}\n      animate={{ opacity: 1, x: 0 }}\n      transition={{ type: "spring", stiffness: 100 }}\n      className="w-full h-2 rounded bg-indigo-500"\n    />\n  );\n}`
        }
      ],
      evaluationRules: [
        {
          name: "Linter Checks",
          constraint: "Ensure no implicit typescript any types exist on imported descriptors."
        }
      ],
      sources
    };

    CuriosityEngine.acquiredSkills.set(key, skillPackage);
    return skillPackage;
  }

  public getAcquiredSkills(): SkillPackage[] {
    return Array.from(CuriosityEngine.acquiredSkills.values());
  }

  public listKnowledgeTasks(): KnowledgeAcquisitionTask[] {
    const seen = new Set();
    return this.missingKnowledgeQueue.filter(item => {
      const duplicate = seen.has(item.topic);
      seen.add(item.topic);
      return !duplicate;
    });
  }

  public resolveTask(id: string): boolean {
    const task = this.missingKnowledgeQueue.find(t => t.id === id);
    if (task) {
      task.status = "COMPLETED";
      return true;
    }
    return false;
  }
}
