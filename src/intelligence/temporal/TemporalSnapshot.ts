export interface TemporalSnapshot {
    timestamp: Date;
    metrics: Record<string, number>;
}
