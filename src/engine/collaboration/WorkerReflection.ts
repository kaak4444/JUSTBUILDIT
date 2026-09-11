/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IWorkerReflection {
  id: string;
  workerId: string;
  workerName: string;
  taskTitle: string;
  successScore: number; // 0 to 100
  reflectionMarkdown: string;
  skillsUtilized: string[];
  lessonsLearned: string[];
  timestamp: string;
}

export class WorkerReflectionEngine {
  private static reflections: IWorkerReflection[] = [
    {
      id: "ref_framer_optimize",
      workerId: "gap-thinker",
      workerName: "Strategic Gap Scout",
      taskTitle: "Analyze late-night layout animations and transitions",
      successScore: 95,
      reflectionMarkdown: "The initial hypothesis was that users needed simpler passages. However, research indicated layout difficulty must stay high; the real fatigue was optical. Switching target features to an OLED pitch-black reader model resolved the actual friction.",
      skillsUtilized: ["gap-thinking", "research-mining"],
      lessonsLearned: [
        "Contrast guidelines exceed text simplicity for scholarly focus runs.",
        "Dark-mode must avoid low-contrast gray backgrounds."
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
    }
  ];

  static listReflections(): IWorkerReflection[] {
    return this.reflections;
  }

  static addReflection(reflection: Omit<IWorkerReflection, "id" | "timestamp">): IWorkerReflection {
    const fullReflection: IWorkerReflection = {
      id: `ref_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...reflection
    };
    this.reflections.unshift(fullReflection);
    return fullReflection;
  }

  static createReflection(
    taskId: string,
    workerType: string,
    taskTitle: string,
    success: boolean,
    skillsUtilized: string[],
    lessonsLearned: string[],
    reflectionMarkdown: string
  ): IWorkerReflection {
    const fullReflection: IWorkerReflection = {
      id: `ref_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      workerId: taskId,
      workerName: workerType,
      taskTitle,
      successScore: success ? 95 : 40,
      reflectionMarkdown,
      skillsUtilized,
      lessonsLearned,
      timestamp: new Date().toISOString()
    };
    this.reflections.unshift(fullReflection);
    return fullReflection;
  }
}
