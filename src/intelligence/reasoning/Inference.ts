export interface Inference {
    id: string;
    statement: string;
    confidence: number;
    causedBy: string[];
    explanation: string;
    lastUpdated: Date;
}
