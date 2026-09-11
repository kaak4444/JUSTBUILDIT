import { Decision, DecisionStatus } from "./Decision.ts";

export class DecisionHistory {
    private static instance: DecisionHistory | null = null;

    public static getInstance(): DecisionHistory {
        if (!this.instance) {
            this.instance = new DecisionHistory();
        }
        return this.instance;
    }

    private decisions: Decision[] = [];

    private constructor() {
        // Seed with a historical baseline decision for realistic simulation
        this.add({
            id: "dec_seed_dropship_launch",
            action: "TEST",
            status: "APPROVED",
            confidence: 0.78,
            summary: "Launch small-scale PPC tests for customized eco-packaging across Germany & Poland.",
            reasoning: [
                "Consumer demand for customized eco-packaging is growing at 14% MoM.",
                "Supplier transit times can be minimized to under 4 days using regional Polish hubs."
            ],
            evidenceIds: ["evidence_trend_eco_pack_1", "evidence_supplier_review_poland"],
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        });
    }

    public add(decision: Decision): void {
        // Prevent exact duplicates by action and summary in rapid succession
        const isDuplicate = this.decisions.some(
            d => d.action === decision.action && d.summary === decision.summary && (Date.now() - d.createdAt.getTime()) < 5000
        );
        if (!isDuplicate) {
            this.decisions.unshift(decision); // Keep newest first
        }
    }

    public updateStatus(id: string, status: DecisionStatus): boolean {
        const decision = this.decisions.find(d => d.id === id);
        if (decision) {
            decision.status = status;
            return true;
        }
        return false;
    }

    public getLatest(): Decision | null {
        return this.decisions.length > 0 ? this.decisions[0] : null;
    }

    public getAll(): Decision[] {
        return this.decisions;
    }

    public clear(): void {
        this.decisions = [];
    }
}
