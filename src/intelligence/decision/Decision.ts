export type DecisionAction =
    | "BUY"
    | "TEST"
    | "WAIT"
    | "SKIP"
    | "RESEARCH_MORE";

export type DecisionStatus =
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "EXECUTED";

export interface Decision {
    id: string;
    action: DecisionAction;
    status: DecisionStatus;
    confidence: number;
    summary: string;
    reasoning: string[];
    evidenceIds: string[];
    createdAt: Date;
}
