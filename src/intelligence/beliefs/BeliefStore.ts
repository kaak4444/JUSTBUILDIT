import { Belief } from "./Belief.ts";

export class BeliefStore {
    private static instance: BeliefStore | null = null;

    public static getInstance(): BeliefStore {
        if (!this.instance) {
            this.instance = new BeliefStore();
        }
        return this.instance;
    }

    private beliefs = new Map<string, Belief>();

    constructor() {
        // Seed with initial architectural beliefs
        this.add({
            id: "belief_seed_demand_dropshipping",
            statement: "Consumer demand for customized eco-friendly packaging in premium dropshipping is accelerating at 14% MoM.",
            confidence: 0.78,
            supportingEvidence: ["evidence_trend_eco_pack_1", "evidence_trends_europe_2"],
            contradictingEvidence: ["evidence_shipping_delay_germany"],
            lastUpdated: new Date()
        });
        this.add({
            id: "belief_seed_supplier_reliability",
            statement: "Leveraging regional distribution hubs in Europe reduces average delivery times to under 4 business days.",
            confidence: 0.85,
            supportingEvidence: ["evidence_logistics_report_2026", "evidence_supplier_review_poland"],
            contradictingEvidence: [],
            lastUpdated: new Date()
        });
    }

    add(belief: Belief) {
        this.beliefs.set(belief.id, belief);
    }

    get(id: string) {
        return this.beliefs.get(id);
    }

    getAll() {
        return [...this.beliefs.values()];
    }
}

