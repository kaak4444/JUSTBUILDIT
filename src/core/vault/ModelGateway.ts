/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CostController } from "./CostController";

export interface ModelRequest {
  model: string;
  messages: { role: string; content: string }[];
  stream?: boolean;
  metadata?: any;
}

export interface ModelResponse {
  text: string;
  reasoning?: string[];
  raw?: any;
}

export interface ModelProvider {
  id: string;
  provider: "Google" | "OpenAI" | "Anthropic" | "Local Llama" | "Mistral";
  model: string;
  apiKey: string;
  chat(req: ModelRequest): Promise<ModelResponse>;
}

export class ModelGateway {
  private static instance: ModelGateway | null = null;
  private costController = CostController.getInstance();

  private constructor() {}

  public static getInstance(): ModelGateway {
    if (!ModelGateway.instance) {
      ModelGateway.instance = new ModelGateway();
    }
    return ModelGateway.instance;
  }

  /**
   * Routes and executes chat completing against standard cloud APIs or mock fallbacks
   */
  public async chat(provider: ModelProvider, req: ModelRequest): Promise<ModelResponse> {
    const start = Date.now();
    try {
      // 1. Check if budget has been exceeded
      if (this.costController.isBudgetDepleted()) {
        throw new Error("AEO Budget Overrun Protection - Daily cost limit has been exceeded. Reset budget to dispatch more tasks.");
      }

      // 2. Perform chat execution on provider
      const response = await provider.chat(req);
      const latency = Date.now() - start;

      // 3. Log cost details
      this.costController.logTransaction(
        req.metadata?.taskId || `direct_${Math.random().toString(36).substring(2, 6)}`,
        provider.model,
        provider.provider,
        JSON.stringify(req.messages),
        response.text
      );

      return response;
    } catch (e: any) {
      console.error(`[ModelGateway] Error on ${provider.provider} ${provider.model}:`, e);
      throw e;
    }
  }
}
