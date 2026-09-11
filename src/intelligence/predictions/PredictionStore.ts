import { Prediction } from "./Prediction.ts";

export class PredictionStore {
    private static instance: PredictionStore | null = null;

    public static getInstance(): PredictionStore {
        if (!this.instance) {
            this.instance = new PredictionStore();
        }
        return this.instance;
    }

    private predictions: Prediction[] = [];

    private constructor() {
        // Seed with a few past completed predictions to establish a baseline accuracy history
        const now = new Date();
        this.add({
            id: "pred_seed_1",
            statement: "Competitors will increase advertising cost in customization niche.",
            confidence: 0.85,
            predictedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
            expectedBy: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
            status: "CORRECT",
            basedOnDecision: "dec_seed_dropship_launch",
            targetBeliefId: "belief_trend_competition_density"
        });

        this.add({
            id: "pred_seed_2",
            statement: "Profit margin on customized eco-packaging will expand with larger transit hubs.",
            confidence: 0.75,
            predictedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
            expectedBy: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
            status: "INCORRECT",
            basedOnDecision: "dec_seed_dropship_launch",
            targetBeliefId: "belief_trend_profit_margin"
        });
    }

    public add(prediction: Prediction): void {
        const exists = this.predictions.some(p => p.id === prediction.id);
        if (!exists) {
            this.predictions.unshift(prediction); // Newest first
        }
    }

    public getPending(): Prediction[] {
        return this.predictions.filter(p => p.status === "PENDING");
    }

    public getAll(): Prediction[] {
        return this.predictions;
    }

    public getAccuracy(): number {
        const completed = this.predictions.filter(p => p.status === "CORRECT" || p.status === "INCORRECT");
        if (completed.length === 0) {
            return 0;
        }
        const correct = completed.filter(p => p.status === "CORRECT");
        return correct.length / completed.length;
    }

    public clear(): void {
        this.predictions = [];
    }
}
