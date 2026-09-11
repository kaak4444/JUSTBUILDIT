/* ==========================================================
   JUSTBUILDIT - RESEARCH CORE V3
   ORGANIZATIONAL MEMORY MODULE
   ========================================================== */

import { OrganizationalMemoryEntry } from "../core/types";

let memoryStore: Record<string, OrganizationalMemoryEntry> = {};

export class OrganizationalMemoryV3 {
    /**
     * Bind persistent database reference to memory store
     */
    static bindMemory(storeRef: Record<string, OrganizationalMemoryEntry>) {
        memoryStore = storeRef;

        // Pre-populate with successful organizational knowledge runs if empty
        if (Object.keys(memoryStore).length === 0) {
            console.log("[OrganizationalMemoryV3] Initializing historical memory store with optimized patterns.");
            memoryStore["mem_init_1"] = {
                missionId: "mission_competitors",
                objective: "Competitor Market Landscapes",
                sourcesUsed: ["reddit", "product_hunt", "github"],
                durationMs: 1420,
                costTokens: 450,
                accuracyScore: 94,
                successfulQueries: ["site:github.com e-commerce engine", "reddit r/saas competitor complaints"],
                failures: []
            };
            memoryStore["mem_init_2"] = {
                missionId: "mission_pricing",
                objective: "SaaS Monetization Schemes",
                sourcesUsed: ["whop", "shopify"],
                durationMs: 820,
                costTokens: 250,
                accuracyScore: 91,
                successfulQueries: ["whop creator pricing subscription", "shopify platform transaction fees"],
                failures: []
            };
        }
    }

    /**
     * Logs the telemetry from a completed research mission
     */
    static recordEntry(entry: OrganizationalMemoryEntry) {
        const id = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
        memoryStore[id] = entry;
        console.log(`[OrganizationalMemoryV3] Logged organizational telemetry for [${entry.missionId}]. Accuracy: ${entry.accuracyScore}%.`);
    }

    /**
     * Retrieve optimal sources and successful search terms from memory based on mission keyword queries
     */
    static getOptimizedStrategy(keyword: string): { suggestedSources: string[]; queryHooks: string[] } {
        const entries = Object.values(memoryStore);
        const matched = entries.filter(e => 
            e.objective.toLowerCase().includes(keyword.toLowerCase()) || 
            e.successfulQueries.some(q => q.toLowerCase().includes(keyword.toLowerCase()))
        );

        const suggestedSources: string[] = [];
        const queryHooks: string[] = [];

        if (matched.length > 0) {
            matched.forEach(e => {
                e.sourcesUsed.forEach(s => {
                    if (!suggestedSources.includes(s)) suggestedSources.push(s);
                });
                e.successfulQueries.forEach(q => {
                    if (!queryHooks.includes(q)) queryHooks.push(q);
                });
            });
        } else {
            // Default baseline strategy
            suggestedSources.push("reddit", "github", "product_hunt");
            queryHooks.push(`best alternative to ${keyword}`, `${keyword} competitor pricing`);
        }

        return {
            suggestedSources: suggestedSources.slice(0, 4),
            queryHooks: queryHooks.slice(0, 3)
        };
    }

    static getHistory(): OrganizationalMemoryEntry[] {
        return Object.values(memoryStore);
    }
}
