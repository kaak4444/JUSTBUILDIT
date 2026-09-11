import { TemporalSnapshot } from "./TemporalSnapshot.ts";

export class SnapshotHistory {
    private static instance: SnapshotHistory | null = null;

    public static getInstance(): SnapshotHistory {
        if (!this.instance) {
            this.instance = new SnapshotHistory();
        }
        return this.instance;
    }

    private snapshots: TemporalSnapshot[] = [];
    private readonly MAX_HISTORY = 100;

    private constructor() {
        // Seed with yesterday's baseline metrics and today's metrics
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        this.add({
            timestamp: oneDayAgo,
            metrics: {
                "demand_interest": 62,
                "competition_density": 18,
                "profit_margin": 44,
                "transit_time_days": 6
            }
        });

        this.add({
            timestamp: now,
            metrics: {
                "demand_interest": 78,
                "competition_density": 23,
                "profit_margin": 41,
                "transit_time_days": 4
            }
        });
    }

    public add(snapshot: TemporalSnapshot): void {
        this.snapshots.push(snapshot);
        // Maintain latest snapshots first or sort them
        this.snapshots.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        if (this.snapshots.length > this.MAX_HISTORY) {
            this.snapshots = this.snapshots.slice(0, this.MAX_HISTORY);
        }
    }

    public latest(): TemporalSnapshot | null {
        return this.snapshots.length > 0 ? this.snapshots[0] : null;
    }

    public previous(): TemporalSnapshot | null {
        return this.snapshots.length > 1 ? this.snapshots[1] : null;
    }

    public getAll(): TemporalSnapshot[] {
        return this.snapshots;
    }

    public clear(): void {
        this.snapshots = [];
    }
}
