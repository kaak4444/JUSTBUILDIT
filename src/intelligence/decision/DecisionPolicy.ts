import { Inference } from "../reasoning/Inference.ts";
import { Decision } from "./Decision.ts";

export interface DecisionPolicy {
    name: string;
    evaluate(inferences: Inference[]): Decision | null;
}
