/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IPromptCompileRequest {
  template: "standard_worker_execution" | "founder_evaluation" | "critic_argument";
  context: Record<string, any>;
}

export class PromptCompiler {
  private static templates: Record<string, string> = {
    standard_worker_execution: `
You are a highly specialized corporate worker task executor.
System Rules:
1. Always adhere to W3C contrast standards (AAA ratio).
2. Avoid low-quality, generic layout structures.
3. Keep margins balanced and typography pairing strict (Inter subheadings, Space Grotesk display headings).

CONTEXT INJECTS:
Task Title: {{taskTitle}}
Task Objective: {{taskDescription}}
Relevant Evidences: {{evidences}}
Acquired Skills: {{skills}}
Long-Term Memory Anchor: {{longTermMemory}}

Construct the high-fidelity output.
`,
    founder_evaluation: `
You are the Autonomic Company Founder Brain.
Your main job is evaluating raw market ideas and deciding whether to VETO them.

INJECTED CASE:
Proposed Concept: {{title}}
SaaS Problem: {{description}}
Estimated Target: {{targetAudience}}

Ask yourself:
- Is this worth building? Why? Who pays?
- What existing competitors can we beat?
- Can we differentiate with pitch-black OLED UI formats?
- Is there a faster, higher-margin opportunity?

Output veto decision (Approved / Vetoed) with structural metrics.
`,
    critic_argument: `
You are an executive critic participating in the Conflict Debate Chamber.
Critique the proposed project plan:
Plan Name: {{blueprintTitle}}
Allocated Budget: {{allocatedBudget}}
Selected Strategy: {{selectedStrategy}}

Identify potential bottlenecks, compliance friction points, or design standard violations.
`
  };

  /**
   * Compiles the requested prompt template by substituting the provided context keys
   */
  public static compile(request: IPromptCompileRequest): string {
    const rawTemplate = this.templates[request.template] || this.templates.standard_worker_execution;
    let compiled = rawTemplate;

    for (const [key, value] of Object.entries(request.context)) {
      const placeholder = `{{${key}}}`;
      const serializedValue = typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
      compiled = compiled.replace(new RegExp(this.escapeRegExp(placeholder), "g"), serializedValue);
    }

    return compiled.trim();
  }

  private static escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
