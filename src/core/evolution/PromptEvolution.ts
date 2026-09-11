import { EvolutionMemory } from "./EvolutionMemory.ts";

export class PromptEvolution {
  private memory: EvolutionMemory;

  constructor(memory: EvolutionMemory) {
    this.memory = memory;
  }

  /**
   * Refines general worker prompts to enforce strict formatting standards (e.g., Swiss grid, OLED dark contrast, no margin clutter).
   */
  public refineSystemPrompt(workerId: string, aestheticTopic: string): { refined: boolean; newPrompt: string } {
    const workers = this.memory.getWorkers();
    const worker = workers[workerId];

    if (!worker) {
      return { refined: false, newPrompt: "" };
    }

    const currentPrompt = worker.promptTemplate;
    const guidelines = this.getAestheticGuidelines(aestheticTopic);
    
    // Check if guideline is already included
    if (currentPrompt.includes(guidelines)) {
      return { refined: false, newPrompt: currentPrompt };
    }

    const newPrompt = `${currentPrompt}\n\nAesthetic Refinement Standards [${aestheticTopic}]: ${guidelines}`;
    const newVersion = worker.version + 1;

    this.memory.updateWorker(workerId, {
      version: newVersion,
      promptTemplate: newPrompt
    });

    this.memory.addLog({
      type: "WORKER",
      action: "EVOLVE_AESTHETIC_STANDARD",
      description: `Evolved worker '${worker.name}' prompts to v${newVersion} incorporating aesthetic guidelines: "${aestheticTopic}"`,
      reasoning: "Injecting strict visual design rules regarding typography paired ratios and negative spacing.",
      metricBefore: worker.version,
      metricAfter: newVersion
    });

    return { refined: true, newPrompt };
  }

  private getAestheticGuidelines(topic: string): string {
    const rules: Record<string, string> = {
      SwissMinimalism: "Use spacious letter tracking, Inter paired display fonts, sharp borders, and generous grid-based negative space. No text-larping status bars.",
      HighContrastOLED: "Utilize deep blacks, rich dark greys, and high-contrast glowing neon text accents. Ensure full responsive touch padding.",
      CleanBentoGrid: "Arrange components inside distinctive asymmetrical cards with subtle hover feedback transitions. Enforce clear visual hierarchy."
    };
    return rules[topic] || "Emphasize absolute clarity, literal human labeling, and elegant typography pairing.";
  }
}
