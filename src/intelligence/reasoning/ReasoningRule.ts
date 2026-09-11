import { Belief } from "../beliefs/Belief.ts";
import { CausalLink } from "./CausalLink.ts";
import { Inference } from "./Inference.ts";

export interface ReasoningRule {
    name: string;
    applies(beliefs: Belief[]): boolean;
    infer(beliefs: Belief[]): { links: CausalLink[]; inferences: Inference[] };
}
