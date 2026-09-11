/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IWorker, ITask, IExecutionContext, ITaskResult } from "../../../engine/interfaces";

export interface UIBlueprint {
  informationArchitecture: string[];
  navigationRules: string[];
  userJourneyStages: string[];
  componentTree: Record<string, any>;
  pageTree: string[];
  interactionRules: string[];
}

export class UXDesigner implements IWorker {
  id = "ux-designer";
  name = "Interaction & UX Architect";
  description = "Synthesizes design guidelines and brand systems into cohesive, low-friction information architectures and UI blueprints.";
  departmentId = "product-lab";
  requiredSkills = ["typography"];
  requiredCapabilities = ["reason"];
  inputSchema = { productPlan: "object", designRules: "object" };
  outputSchema = {
    informationArchitecture: "array",
    navigationRules: "array",
    userJourneyStages: "array",
    componentTree: "object",
    pageTree: "array",
    interactionRules: "array"
  };

  async execute(task: ITask, context: IExecutionContext): Promise<ITaskResult> {
    context.logger.info(`Worker:${this.id}`, "Architecting detailed low-friction UI Blueprint.");

    await new Promise((resolve) => setTimeout(resolve, 800));

    const blueprint: UIBlueprint = {
      informationArchitecture: [
        "Dashboard (Unified HUD)",
        "Workspace Sandbox Canvas",
        "Analytics Reports Pane",
        "Domain Preferences Configuration"
      ],
      navigationRules: [
        "Persistent high-contrast responsive sidebar",
        "Fluid desktop-first layouts with swift key bindings"
      ],
      userJourneyStages: [
        "Seamless onboarding with instant layout preset generation",
        "Daily active task cycles supported by server-side feedback loops"
      ],
      componentTree: {
        root: "AppContainer",
        children: [
          { name: "SidebarNavigation", purpose: "Context switching and quick settings" },
          { name: "PrimaryStage", purpose: "Active project editing and execution feedback" },
          { name: "LiveSandboxTerminal", purpose: "Displaying sandbox logs and validation reports" }
        ]
      },
      pageTree: ["/", "/workspace", "/reports", "/settings"],
      interactionRules: [
        "Every crucial workflow trigger must be accessible within 2 clicks from the main HUD",
        "Interactive hover feedback states must apply subtle spring motion scale parameters"
      ]
    };

    return {
      success: true,
      output: blueprint
    };
  }
}
