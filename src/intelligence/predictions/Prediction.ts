export type PredictionStatus = "PENDING" | "CORRECT" | "INCORRECT" | "UNKNOWN";

export interface Prediction {
    id: string;
    statement: string;
    confidence: number;
    predictedAt: Date;
    expectedBy: Date;
    status: PredictionStatus;
    basedOnDecision: string;
    targetBeliefId?: string;
}
