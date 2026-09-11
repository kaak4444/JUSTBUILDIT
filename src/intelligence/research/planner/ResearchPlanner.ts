/* ==========================================================
   JUSTBUILDIT - RESEARCH CORE V3
   RESEARCH PLANNER MODULE
   ========================================================== */

import { ResearchMission } from "../core/types";
import { GoogleGenAI, Type } from "@google/genai";

export class ResearchPlannerV3 {
    private static getAI(): GoogleGenAI | null {
        if (process.env.GEMINI_API_KEY) {
            try {
                return new GoogleGenAI({
                    apiKey: process.env.GEMINI_API_KEY,
                    httpOptions: {
                        headers: {
                            "User-Agent": "aistudio-build-research-planner-v3",
                        }
                    }
                });
            } catch (err) {
                console.error("[ResearchPlannerV3] Failed to create GoogleGenAI client:", err);
            }
        }
        return null;
    }

    /**
     * Deconstructs a high-level research objective into a complete, dependency-linked ResearchMission DAG.
     */
    async formulateMissions(objective: string): Promise<ResearchMission[]> {
        console.log(`[ResearchPlannerV3] Deconstructing objective: "${objective}" into discrete missions...`);
        const ai = ResearchPlannerV3.getAI();

        if (!ai) {
            console.warn("[ResearchPlannerV3] Gemini API key not found. Executing deterministic mission formulation fallback.");
            return this.formulateMissionsFallback(objective);
        }

        const prompt = `You are the Principal Systems Research Architect of JustBuildIt OS.
Your objective is to build a complete, detailed DAG of research missions for investigating the user's objective.
Objective: "${objective}"

You MUST output a set of 5-8 highly specific, dependency-linked ResearchMissions.
A complete, structured research DAG must address:
1. Finding active competitors
2. Investigating user complaint/pain points
3. Analyzing monetization strategies and pricing
4. Discovering design, layout, and UX/UI trends
5. Reviewing the tech stack and distribution channels

For each mission, provide:
- id: e.g., "mission_competitors", "mission_pricing", "mission_pains", "mission_design", "mission_tech"
- title: concise title
- objective: specific objective
- requiredKnowledge: what specific facts we need to uncover
- requiredSources: list of source platforms (e.g. reddit, github, whop, trustpilot, g2, etc.)
- priority: importance weight (1-10)
- confidenceGoal: goal probability (1-100)
- children: IDs of other missions in this set that DEPEND on this mission being completed first. E.g. mission_design might depend on mission_competitors (so mission_design's ID should be in mission_competitors' children list, or vice versa depending on direction. Let's define "children" as the list of mission IDs that should be executed AFTER this mission, meaning they depend on this one).

Ensure that:
- Dependencies form a valid directed acyclic graph (no cycles).
- Each mission has precise target sources.

Format strictly as JSON conforming to the requested schema.`;

        try {
            const response = await ai.models.generateContent({
                model: "gemini-3.5-flash",
                contents: prompt,
                config: {
                    systemInstruction: "You are a professional systems architect and market researcher. You specialize in creating optimal, dependency-linked research structures.",
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            missions: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        id: { type: Type.STRING },
                                        title: { type: Type.STRING },
                                        objective: { type: Type.STRING },
                                        requiredKnowledge: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        requiredSources: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        priority: { type: Type.INTEGER },
                                        confidenceGoal: { type: Type.INTEGER },
                                        children: { type: Type.ARRAY, items: { type: Type.STRING } }
                                    },
                                    required: ["id", "title", "objective", "requiredKnowledge", "requiredSources", "priority", "confidenceGoal", "children"]
                                }
                            }
                        },
                        required: ["missions"]
                    }
                }
            });

            const parsed = JSON.parse(response.text || "{}");
            const rawMissions = parsed.missions || [];

            return rawMissions.map((m: any) => ({
                id: m.id,
                title: m.title,
                objective: m.objective,
                requiredKnowledge: m.requiredKnowledge || [],
                requiredSources: m.requiredSources || [],
                priority: m.priority || 5,
                confidenceGoal: m.confidenceGoal || 80,
                children: m.children || [],
                status: "pending"
            }));

        } catch (error) {
            console.error("[ResearchPlannerV3] LLM formulation failed. Switching to deterministic fallback.", error);
            return this.formulateMissionsFallback(objective);
        }
    }

    /**
     * Deterministic rules-based mission planner when AI is offline.
     */
    private formulateMissionsFallback(objective: string): ResearchMission[] {
        return [
            {
                id: "mission_competitors",
                title: "Identify Active Commercial Competitors",
                objective: `Map all current digital products, tools, and SaaS companies solving: "${objective}"`,
                requiredKnowledge: ["Competitor names", "Competitor URLs", "Feature offerings", "Core value propositions"],
                requiredSources: ["google", "product_hunt", "github"],
                priority: 10,
                confidenceGoal: 90,
                children: ["mission_pricing", "mission_design"],
                status: "pending"
            },
            {
                id: "mission_pains",
                title: "Uncover User Pain Points & Complaints",
                objective: `Extract structural complaints, negative feedback, and gaps in current solutions related to: "${objective}"`,
                requiredKnowledge: ["Common user errors", "Missing features", "Reliability complaints", "Onboarding struggles"],
                requiredSources: ["reddit", "trustpilot", "g2"],
                priority: 9,
                confidenceGoal: 85,
                children: ["mission_opportunities"],
                status: "pending"
            },
            {
                id: "mission_pricing",
                title: "Deconstruct Monetization & Pricing Strategy",
                objective: "Analyze competitors' pricing, transaction types, recurring strategies, and packages",
                requiredKnowledge: ["Subscription pricing", "One-time fees", "Feature gates", "Platform monetization"],
                requiredSources: ["whop", "shopify", "g2"],
                priority: 8,
                confidenceGoal: 80,
                children: ["mission_opportunities"],
                status: "pending"
            },
            {
                id: "mission_design",
                title: "Deconstruct Design & UI/UX Patterns",
                objective: "Map common typography, layout, structural grids, colors, and components used by existing solutions",
                requiredKnowledge: ["Font pairings", "Color palettes", "UI grid systems", "Hero section copy templates"],
                requiredSources: ["product_hunt", "google", "github"],
                priority: 7,
                confidenceGoal: 75,
                children: ["mission_opportunities"],
                status: "pending"
            },
            {
                id: "mission_opportunities",
                title: "Synthesize Gaps & Strategic Opportunities",
                objective: "Generate competitive scorecards, features combinations, and execution priorities",
                requiredKnowledge: ["Discovered software gaps", "High margin features", "Novel marketing hooks"],
                requiredSources: ["custom"],
                priority: 9,
                confidenceGoal: 85,
                children: [],
                status: "pending"
            }
        ];
    }
}
