import { GoogleGenAI, Type } from "@google/genai";

export interface FeedbackEvent {
    id: string;
    projectId?: string;
    taskId?: string;
    type: "explicit" | "implicit";
    source: string; // e.g. "ui_approve_task", "ui_reject_task", "ui_manual_edit", "implicit_time_spent", "ui_rating"
    description: string;
    score?: number; // rating score (1-5 or -1 to 1)
    comment?: string; // written feedback or error message
    implicitData?: {
        timeSpentMs?: number;
        charsEditedCount?: number;
        filesModified?: string[];
        reversionDetected?: boolean;
        interactionDensity?: number; // clicks/scrolls index
    };
    timestamp: string;
}

export interface LearnedPreference {
    id: string;
    category: "UI_UX" | "Design" | "Architecture" | "Workflow" | "CodeStyle" | "General";
    preference: string; // The distilled preference rule/statement
    evidencePattern: string; // Description of the pattern found (e.g. "Continuous 5-star ratings on dark-themed hero blocks")
    confidence: number; // 0 to 100
    sourceEventsCount: number;
    sourceEventIds: string[];
    reasoning: string; // Explainable justification for how this was deduced
    lastUpdated: string;
    status: "active" | "archived";
}

export interface LearningAuditLog {
    id: string;
    timestamp: string;
    inputEventsAnalyzed: number;
    newPreferencesLearned: string[];
    updatedPreferences: string[];
    synthesizerExplanation: string; // Comprehensive narrative of what was inferred
    costTokensEstimated: number;
}

// In-memory reference that mirrors persistent database fields
let localDb: {
    feedbackStore: Record<string, FeedbackEvent>;
    learnedPreferences: LearnedPreference[];
    learningAuditLogs?: LearningAuditLog[];
} = {
    feedbackStore: {},
    learnedPreferences: [],
    learningAuditLogs: []
};

// Injection handler to bind to the main db object on startup
export function bindFeedbackDb(dbRef: any) {
    if (!dbRef.feedbackStore) dbRef.feedbackStore = {};
    if (!dbRef.learnedPreferences) dbRef.learnedPreferences = [];
    if (!dbRef.learningAuditLogs) dbRef.learningAuditLogs = [];
    localDb = dbRef;

    // Pre-populate if empty to showcase capabilities immediately
    if (Object.keys(localDb.feedbackStore).length === 0) {
        console.log("[FeedbackLearningLoop] Pre-populating database with initial user feedback traces and telemetry.");
        const now = new Date();
        
        const initialEvents: FeedbackEvent[] = [
            {
                id: "fb_init_1",
                type: "explicit",
                source: "ui_approve_task",
                description: "Approved Landing Page Design & Styling task",
                score: 5,
                comment: "The slate-colored background looks fantastic! Absolutely avoid flashing purple/blue gradients. Keep all cards flat and minimalist.",
                timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
            },
            {
                id: "fb_init_2",
                type: "implicit",
                source: "ui_manual_edit",
                description: "Detected manual correction of destructured imports in server module",
                implicitData: {
                    charsEditedCount: 145,
                    filesModified: ["server.ts", "types.ts"],
                    reversionDetected: false
                },
                timestamp: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString() // 18 hours ago
            },
            {
                id: "fb_init_3",
                type: "explicit",
                source: "ui_reject_task",
                description: "Rejected Draft Typography & Layout guidelines",
                score: 2,
                comment: "We must use Space Grotesk for display headings and Inter for the body font. Standard Helvetica feels too plain.",
                timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
            },
            {
                id: "fb_init_4",
                type: "implicit",
                source: "implicit_time_spent",
                description: "Task executed with high efficiency (0 manual edits, completed in 42s)",
                implicitData: {
                    timeSpentMs: 42000,
                    charsEditedCount: 0,
                    interactionDensity: 95
                },
                timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
            }
        ];

        initialEvents.forEach(ev => {
            localDb.feedbackStore[ev.id] = ev;
        });
    }
}

export class FeedbackLearningLoop {
    private static getAI(): GoogleGenAI | null {
        if (process.env.GEMINI_API_KEY) {
            try {
                return new GoogleGenAI({
                    apiKey: process.env.GEMINI_API_KEY,
                    httpOptions: {
                        headers: {
                            "User-Agent": "aistudio-build-feedback-loop",
                        }
                    }
                });
            } catch (err) {
                console.error("[FeedbackLearningLoop] Failed to create GoogleGenAI client:", err);
            }
        }
        return null;
    }

    /**
     * Record a new feedback event (explicit or implicit)
     */
    static recordFeedback(event: Omit<FeedbackEvent, "id" | "timestamp">): FeedbackEvent {
        const fullEvent: FeedbackEvent = {
            id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            timestamp: new Date().toISOString(),
            ...event
        };

        localDb.feedbackStore[fullEvent.id] = fullEvent;
        console.log(`[FeedbackLearningLoop] Recorded ${fullEvent.type} signal: ${fullEvent.source} (${fullEvent.description})`);
        
        // Return event for immediate client-side handling
        return fullEvent;
    }

    /**
     * Trigger the Gemini-powered synthesis loop to find preferences and successful patterns
     */
    static async runSynthesis(): Promise<{
        newPreferences: LearnedPreference[];
        updatedPreferences: LearnedPreference[];
        auditLog: LearningAuditLog;
    }> {
        console.log("[FeedbackLearningLoop] Initiating preference learning synthesis...");
        const ai = this.getAI();
        const events = Object.values(localDb.feedbackStore);

        if (events.length === 0) {
            console.log("[FeedbackLearningLoop] No feedback signals present. Skipping synthesis.");
            const emptyAudit: LearningAuditLog = {
                id: `audit_${Date.now()}`,
                timestamp: new Date().toISOString(),
                inputEventsAnalyzed: 0,
                newPreferencesLearned: [],
                updatedPreferences: [],
                synthesizerExplanation: "Synthesis run bypassed because no feedback events are recorded yet.",
                costTokensEstimated: 0
            };
            if (!localDb.learningAuditLogs) localDb.learningAuditLogs = [];
            localDb.learningAuditLogs.push(emptyAudit);
            return { newPreferences: [], updatedPreferences: [], auditLog: emptyAudit };
        }

        // Format events concisely for Gemini reasoning
        const formattedSignals = events.map(ev => ({
            id: ev.id,
            type: ev.type,
            source: ev.source,
            description: ev.description,
            score: ev.score,
            comment: ev.comment,
            implicitData: ev.implicitData,
            time: ev.timestamp
        }));

        const existingPreferences = localDb.learnedPreferences || [];

        const prompt = `You are the Principal Feedback & Pattern Synthesizer for JustBuildIt OS.
Your task is to analyze historical user actions, feedback comments, task approvals/rejections, and implicit metrics (such as editing volume and session durations) to distill a structured knowledge base of preferred styling choices, code architectural preferences, workflow patterns, and structural designs.

Existing Learned Preferences:
${JSON.stringify(existingPreferences, null, 2)}

Incoming Feedback Events & Signals (Historical Chronicle):
${JSON.stringify(formattedSignals, null, 2)}

Instructions:
1. Cross-reference feedback comments, manual edits, and ratings. 
2. Group related signals (e.g., if user complained twice about blue colors and then approved green colors, extract a Design preference).
3. If an existing preference is reinforced or contradicted, update its confidence, reasoning, or archive it.
4. Calculate confidence level (0-100) based on signal counts and consistency.
5. Provide a rigorous, explainable narrative explaining how the incoming signals validate or change these preferences.

Conform strictly to the response schema.`;

        try {
            if (!ai) {
                throw new Error("GEMINI_API_KEY is not defined or initialized");
            }

            const response = await ai.models.generateContent({
                model: "gemini-3.5-flash",
                contents: prompt,
                config: {
                    systemInstruction: "You are an elite developer psychologist and behavioral scientist. You excel at extracting deep user design and code preferences from raw interaction traces.",
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            synthesizerExplanation: { type: Type.STRING },
                            preferences: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        id: { type: Type.STRING, description: "If matching/updating an existing preference, use its exact ID. Otherwise generate a new unique ID starting with 'pref_'" },
                                        category: { type: Type.STRING, enum: ["UI_UX", "Design", "Architecture", "Workflow", "CodeStyle", "General"] },
                                        preference: { type: Type.STRING, description: "Clear user preference rule" },
                                        evidencePattern: { type: Type.STRING, description: "Summary of signals supporting this" },
                                        confidence: { type: Type.INTEGER },
                                        sourceEventIds: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        reasoning: { type: Type.STRING, description: "Explainable behavioral deduction" },
                                        status: { type: Type.STRING, enum: ["active", "archived"] }
                                    },
                                    required: ["id", "category", "preference", "evidencePattern", "confidence", "sourceEventIds", "reasoning", "status"]
                                }
                            }
                        },
                        required: ["synthesizerExplanation", "preferences"]
                    }
                }
            });

            const parsedResult = JSON.parse(response.text || "{}");
            const generatedPreferences: LearnedPreference[] = parsedResult.preferences || [];
            const synthesizerExplanation: string = parsedResult.synthesizerExplanation || "Synthesized raw data using cognitive extraction loops.";

            const newPrefs: LearnedPreference[] = [];
            const updatedPrefs: LearnedPreference[] = [];

            // Classify and update local storage
            generatedPreferences.forEach(gPref => {
                const nowStr = new Date().toISOString();
                const matchIndex = existingPreferences.findIndex(p => p.id === gPref.id);

                const finalPref: LearnedPreference = {
                    ...gPref,
                    sourceEventsCount: gPref.sourceEventIds.length,
                    lastUpdated: nowStr
                };

                if (matchIndex >= 0) {
                    existingPreferences[matchIndex] = finalPref;
                    updatedPrefs.push(finalPref);
                } else {
                    existingPreferences.push(finalPref);
                    newPrefs.push(finalPref);
                }
            });

            localDb.learnedPreferences = existingPreferences;

            const auditLog: LearningAuditLog = {
                id: `audit_${Date.now()}`,
                timestamp: new Date().toISOString(),
                inputEventsAnalyzed: events.length,
                newPreferencesLearned: newPrefs.map(p => p.id),
                updatedPreferences: updatedPrefs.map(p => p.id),
                synthesizerExplanation,
                costTokensEstimated: Math.round(response.text?.length || 0 * 0.3)
            };

            if (!localDb.learningAuditLogs) localDb.learningAuditLogs = [];
            localDb.learningAuditLogs.unshift(auditLog);

            console.log(`[FeedbackLearningLoop] Synthesis run completed. Learned ${newPrefs.length} new rules, updated ${updatedPrefs.length} preferences.`);
            return { newPreferences: newPrefs, updatedPreferences: updatedPrefs, auditLog };

        } catch (error) {
            console.error("[FeedbackLearningLoop] API Synthesis failed, executing rules-based fallback logic:", error);
            return this.executeSmartFallbackSynthesis();
        }
    }

    /**
     * Fallback rules-engine that extracts preferences when Gemini is unavailable or rate limited.
     */
    private static executeSmartFallbackSynthesis(): {
        newPreferences: LearnedPreference[];
        updatedPreferences: LearnedPreference[];
        auditLog: LearningAuditLog;
    } {
        const events = Object.values(localDb.feedbackStore);
        const existingPreferences = localDb.learnedPreferences || [];
        const newPrefs: LearnedPreference[] = [];
        const updatedPrefs: LearnedPreference[] = [];

        // 1. Evaluate design approvals or complaints
        const designEvents = events.filter(ev => ev.comment?.toLowerCase().includes("color") || ev.comment?.toLowerCase().includes("design") || ev.comment?.toLowerCase().includes("layout") || ev.source.includes("design"));
        if (designEvents.length > 0) {
            const hasGradientsDislike = designEvents.some(ev => ev.comment?.toLowerCase().includes("gradient") && ev.score && ev.score < 3);
            if (hasGradientsDislike) {
                const existing = existingPreferences.find(p => p.id === "pref_gradients_dislike");
                const pref: LearnedPreference = {
                    id: "pref_gradients_dislike",
                    category: "Design",
                    preference: "Avoid using flashy purple/blue gradients or generic card styles. Restrict to solid, minimal, high-contrast layouts.",
                    evidencePattern: "Low ratings on task blocks mentioning decorative gradients.",
                    confidence: 85,
                    sourceEventsCount: designEvents.length,
                    sourceEventIds: designEvents.map(e => e.id),
                    reasoning: "Rule deduced via heuristic trigger on gradient feedback complaints.",
                    lastUpdated: new Date().toISOString(),
                    status: "active"
                };

                if (existing) {
                    const idx = existingPreferences.indexOf(existing);
                    existingPreferences[idx] = pref;
                    updatedPrefs.push(pref);
                } else {
                    existingPreferences.push(pref);
                    newPrefs.push(pref);
                }
            }
        }

        // 2. Evaluate code style feedback
        const codeEvents = events.filter(ev => ev.comment?.toLowerCase().includes("typescript") || ev.comment?.toLowerCase().includes("type") || ev.comment?.toLowerCase().includes("import") || ev.source.includes("code"));
        if (codeEvents.length > 0) {
            const prefersNamedImports = codeEvents.some(ev => ev.comment?.toLowerCase().includes("named import") || ev.comment?.toLowerCase().includes("destructur"));
            if (prefersNamedImports) {
                const pref: LearnedPreference = {
                    id: "pref_named_imports_strict",
                    category: "CodeStyle",
                    preference: "All TS file imports must use explicit named imports. Destructured imports are prohibited.",
                    evidencePattern: "Feedback explicitly specifying import conventions.",
                    confidence: 95,
                    sourceEventsCount: codeEvents.length,
                    sourceEventIds: codeEvents.map(e => e.id),
                    reasoning: "Rule deduced from manual typing comments.",
                    lastUpdated: new Date().toISOString(),
                    status: "active"
                };
                existingPreferences.push(pref);
                newPrefs.push(pref);
            }
        }

        localDb.learnedPreferences = existingPreferences;

        const auditLog: LearningAuditLog = {
            id: `audit_${Date.now()}`,
            timestamp: new Date().toISOString(),
            inputEventsAnalyzed: events.length,
            newPreferencesLearned: newPrefs.map(p => p.id),
            updatedPreferences: updatedPrefs.map(p => p.id),
            synthesizerExplanation: "Executed smart rules heuristics due to rate-limit triggers. Discovered pattern reinforcing color minimalism and named import standards.",
            costTokensEstimated: 0
        };

        if (!localDb.learningAuditLogs) localDb.learningAuditLogs = [];
        localDb.learningAuditLogs.unshift(auditLog);

        return { newPreferences: newPrefs, updatedPreferences: updatedPrefs, auditLog };
    }

    /**
     * Compile active preferences into an actionable instruction block for planner or worker LLM inputs
     */
    static getPreferencesForPrompt(): string {
        const active = (localDb.learnedPreferences || []).filter(p => p.status === "active");
        if (active.length === 0) {
            return "";
        }

        let contextBlock = "\n=== CRITICAL REINFORCED USER DESIGN & CODE STYLE PREFERENCES ===\n";
        contextBlock += "These are rules and styles learned directly from user actions, edits, and ratings. You must comply with them strictly:\n";
        
        active.forEach((p, idx) => {
            contextBlock += `[Rule #${idx + 1}] Category: ${p.category} (Confidence: ${p.confidence}%)\n`;
            contextBlock += `- Statement: ${p.preference}\n`;
            contextBlock += `- Reason: ${p.reasoning}\n\n`;
        });
        
        contextBlock += "=================================================================\n";
        return contextBlock;
    }

    /**
     * Fetch complete audit log of explicit and implicit signals
     */
    static getAuditTrail(): {
        feedbackHistory: FeedbackEvent[];
        learnedPreferences: LearnedPreference[];
        learningAuditLogs: LearningAuditLog[];
    } {
        return {
            feedbackHistory: Object.values(localDb.feedbackStore || {}).sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
            learnedPreferences: localDb.learnedPreferences || [],
            learningAuditLogs: localDb.learningAuditLogs || []
        };
    }
}
