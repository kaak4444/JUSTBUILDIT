export interface CausalLink {
    id: string;
    sourceBelief: string;
    targetBelief: string;
    relationship:
        | "causes"
        | "supports"
        | "increases"
        | "decreases";
    confidence: number;
    explanation: string;
}
