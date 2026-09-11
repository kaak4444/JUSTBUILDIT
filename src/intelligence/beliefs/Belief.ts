export interface Belief {
    id: string;

    statement: string;

    confidence: number;

    supportingEvidence: string[];

    contradictingEvidence: string[];

    lastUpdated: Date;
}
