export type CommandIntent =
  | "research"
  | "build"
  | "publish"
  | "analyze"
  | "design";

export interface Command {
  intent: CommandIntent;
  payload: any;
}

export class CommandGate {
  private static instance: CommandGate | null = null;

  public static getInstance(): CommandGate {
    if (!CommandGate.instance) {
      CommandGate.instance = new CommandGate();
    }
    return CommandGate.instance;
  }

  validate(cmd: Command) {
    const allowed = ["research", "build", "publish", "analyze", "design"];

    if (!allowed.includes(cmd.intent)) {
      throw new Error(`BLOCKED: Invalid intent "${cmd.intent}". Only ${allowed.join(", ")} are allowed.`);
    }

    if (!cmd.payload || (typeof cmd.payload === "string" && !cmd.payload.trim())) {
      throw new Error("BLOCKED: command requires a non-empty query or payload.");
    }

    return true;
  }
}
