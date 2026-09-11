import { Evidence } from "../types.ts";
import { Belief } from "./Belief.ts";
import { Trend } from "../temporal/Trend.ts";

export class BeliefEngine {
    public createBelief(evidence: Evidence): Belief {
        const id = `belief_${evidence.id}`;
        const statement = evidence.extractedStatement || evidence.title || (evidence.content ? evidence.content.slice(0, 100) : "Unnamed Observation");
        
        // Baseline confidence 0.6 as per architectural guidelines
        const confidence = 0.6;

        return {
            id,
            statement,
            confidence,
            supportingEvidence: [evidence.id],
            contradictingEvidence: [],
            lastUpdated: new Date()
        };
    }

    public createBeliefsFromTrends(trends: Trend[]): Belief[] {
        return trends.map(trend => {
            const id = `belief_trend_${trend.metric}`;
            const directionWord = trend.direction === "UP" ? "increasing" : trend.direction === "DOWN" ? "decreasing" : "remaining stable";
            const changeIndicator = trend.delta > 0 ? `up by ${trend.delta.toFixed(1)}` : trend.delta < 0 ? `down by ${Math.abs(trend.delta).toFixed(1)}` : "stable";
            
            // Format nice business-style metric names for the statement
            const cleanMetricName = trend.metric
                .split("_")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            const statement = `${cleanMetricName} is ${directionWord}, moving from ${trend.previous} to ${trend.current} (delta ${changeIndicator}).`;
            
            // Establish confidence based on trend direction shifts
            const confidence = trend.direction !== "STABLE" ? 0.85 : 0.65;

            return {
                id,
                statement,
                confidence,
                supportingEvidence: [`temporal_source_${trend.metric}`],
                contradictingEvidence: [],
                lastUpdated: new Date()
            };
        });
    }
}

