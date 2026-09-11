import { getGenAI } from "./ai";
import { Type } from "@google/genai";

export interface ResearchPlan {
    objective: string;
    hypotheses: string[];
    questions: string[];
    requiredEvidence: string[];
    suggestedCollectors: string[];
    depth: "light" | "medium" | "deep";
}

export class ResearchPlanner {
    async plan(objective: string, depth: "light" | "medium" | "deep" = "medium"): Promise<ResearchPlan> {
        const ai = getGenAI();
        const prompt = `Create a highly systematic research plan to investigate the following business or research objective:
Objective: "${objective}"
Target Depth: ${depth}

The researcher behaves like an investigative analyst, asking:
- Where is evidence?
- Who already solved this?
- Who is making money?
- Who copied them?
- Which solution is newest?
- Which solution is growing?
- Which solution is dying?
- Where is the code?
- Where are the users?
- Where are complaints?

Generate hypotheses, targeted research questions, required evidence, and recommended collectors (such as reddit, github, youtube, shopify, etsy, amazon, whop, trustpilot, g2, etc.).`;

        try {
            const response = await ai.models.generateContent({
                model: "gemini-3.5-flash",
                contents: prompt,
                config: {
                    systemInstruction: "You are a professional corporate research planner and market intelligence director. You produce pristine, highly specific, and structured research plans in JSON format.",
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            objective: { type: Type.STRING },
                            hypotheses: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            },
                            questions: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            },
                            requiredEvidence: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            },
                            suggestedCollectors: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            },
                            depth: { type: Type.STRING }
                        },
                        required: ["objective", "hypotheses", "questions", "requiredEvidence", "suggestedCollectors", "depth"]
                    }
                }
            });

            const text = response.text || "{}";
            const parsed = JSON.parse(text);
            return {
                objective: parsed.objective || objective,
                hypotheses: parsed.hypotheses || [],
                questions: parsed.questions || [],
                requiredEvidence: parsed.requiredEvidence || [],
                suggestedCollectors: parsed.suggestedCollectors || [],
                depth: parsed.depth || depth,
            };
        } catch (error) {
            console.error("[ResearchPlanner] Error creating research plan:", error);
            // Return a smart fallback plan
            return {
                objective,
                hypotheses: [
                    "There are active commercial players solving this objective with distinct pricing tiers.",
                    "User complaints on Reddit and Trustpilot reveal major functional gaps in current solutions."
                ],
                questions: [
                    "Who already solved this?",
                    "Where are the users?",
                    "Where are the complaints?",
                    "Who is making money?"
                ],
                requiredEvidence: [
                    "Competitor pricing and features",
                    "Customer reviews and pain points",
                    "Developer repos and open source alternatives"
                ],
                suggestedCollectors: ["google_trends", "reddit", "github", "whop"],
                depth
            };
        }
    }
}
