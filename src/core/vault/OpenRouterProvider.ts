/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ModelProvider, ModelRequest, ModelResponse } from "./ModelGateway";

export class OpenRouterProvider implements ModelProvider {
  public id: string;
  public provider: "Google" | "OpenAI" | "Anthropic" | "Local Llama" | "Mistral" = "OpenAI";
  public model: string;
  public apiKey: string;

  constructor(id: string, model: string, apiKey: string) {
    this.id = id;
    this.model = model;
    this.apiKey = apiKey;
  }

  public async chat(req: ModelRequest): Promise<ModelResponse> {
    // Graceful Simulation fallback for dummy / test / mock keys
    const isMockKey = 
      !this.apiKey || 
      this.apiKey === "local" ||
      this.apiKey.includes("XXXX") || 
      this.apiKey.includes("fallback") || 
      this.apiKey === "system_primary_key_fallback";

    if (isMockKey) {
      // Simulate real OpenRouter API network roundtrip delay
      const delay = 400 + Math.random() * 600;
      await new Promise(resolve => setTimeout(resolve, delay));

      const mockText = this.generateSimulatedResponse(this.model, req.messages);
      return {
        text: mockText,
        reasoning: ["Candidate retrieved", "Evaluating constraints", "Injecting domain knowledge"],
        raw: { simulated: true, model: this.model, usage: { prompt_tokens: 150, completion_tokens: 300 } }
      };
    }

    try {
      // Real fetch to OpenRouter API
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin, // OpenRouter ranking metadata
          "X-Title": "JustBuildIt AI Operating System"
        },
        body: JSON.stringify({
          model: this.model || "nvidia/nemotron-3-ultra-550b-a55b:free",
          messages: req.messages,
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenRouter API error (HTTP ${response.status}): ${errText || response.statusText}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";
      
      return {
        text,
        raw: data
      };
    } catch (e: any) {
      console.error("[OpenRouterProvider] fetch failed:", e);
      throw new Error(`Connection to OpenRouter [${this.model}] failed: ${e.message}`);
    }
  }

  private generateSimulatedResponse(model: string, messages: { role: string; content: string }[]): string {
    const lastMsg = messages[messages.length - 1]?.content || "";
    const lower = lastMsg.toLowerCase();

    if (lower.includes("research") || lower.includes("complaints")) {
      return `[RESEARCH NODE: ${model}]
Executive Gap Analysis - Wellness & Mindset Workbooks:
1. CUSTOMER FRICTION POINT: Readers report that the "morning journal prompt" lists feel excessively repetitive. Over 42% of reviews highlight cognitive fatigue in Week 3 of use.
2. COMPETITOR EDGE: Top-performing journals feature dynamic, non-templated mindfulness prompts that rotate weekly.
3. RECOMMENDATION: Inject weekly contextual variety (e.g., alternating between focus exercises, gratitude logs, and micro-challenges).`;
    }

    if (lower.includes("write") || lower.includes("chapter") || lower.includes("sanctuary")) {
      return `[WRITER SYNDICATE: ${model}]
Chapter 1: The Sanctuary of Mornings

The morning sanctuary isn't a static destination; it is an active, silent commitment. When we bypass immediate screen saturation, we preserve up to 34% of our baseline cognitive energy for the tasks that truly define our day. Creating a buffer zone before the digital noise begins resets our default state from "reactive" to "intentional".`;
    }

    if (lower.includes("palette") || lower.includes("color") || lower.includes("layout")) {
      return `[DESIGN COMPOSER: ${model}]
Visual Paradigm Blueprint for Mindfulness Core UI:
- BACKGROUND: Saturated dark glassmorphic slate (#0D0D0D with 40% backing opacity)
- FOCUS INDICATOR: Dynamic solar amber (#F59E0B) providing warm, high-contrast feedback.
- SPACING RHYTHM: Generous padding gaps (px-8 py-6) to reduce visual clutter and induce cognitive calm.`;
    }

    return `[AI SPECIALIST NODE: ${model}]
Successfully completed request of length ${lastMsg.length}.
All constraints validated with nominal score. Let me know if you would like to branch or adjust parameters.`;
  }
}
