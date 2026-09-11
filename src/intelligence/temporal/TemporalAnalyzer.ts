import { Trend } from "./Trend.ts";
import { TemporalSnapshot } from "./TemporalSnapshot.ts";

export class TemporalAnalyzer {
    private static instance: TemporalAnalyzer | null = null;

    public static getInstance(): TemporalAnalyzer {
        if (!this.instance) {
            this.instance = new TemporalAnalyzer();
        }
        return this.instance;
    }

    public analyze(previous: TemporalSnapshot, current: TemporalSnapshot): Trend[] {
        const trends: Trend[] = [];
        const allMetricKeys = Array.from(
            new Set([
                ...Object.keys(previous.metrics),
                ...Object.keys(current.metrics)
            ])
        );

        for (const metric of allMetricKeys) {
            const prevVal = previous.metrics[metric] !== undefined ? previous.metrics[metric] : 0;
            const currVal = current.metrics[metric] !== undefined ? current.metrics[metric] : 0;
            const delta = currVal - prevVal;
            
            let direction: "UP" | "DOWN" | "STABLE" = "STABLE";
            if (delta > 0.001) {
                direction = "UP";
            } else if (delta < -0.001) {
                direction = "DOWN";
            }

            trends.push({
                metric,
                previous: prevVal,
                current: currVal,
                delta,
                direction
            });
        }

        return trends;
    }
}
