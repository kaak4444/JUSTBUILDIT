/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CostTransaction {
  id: string;
  taskId: string;
  timestamp: string;
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  calculatedCost: number; // in USD
}

export interface CostConfig {
  dailyBudget: number; // in USD
  alertThreshold: number; // percentage (e.g., 80)
  totalSpent: number; // cumulative
  currency: string;
}

export class CostController {
  private static instance: CostController | null = null;
  private transactions: CostTransaction[] = [];
  private config: CostConfig = {
    dailyBudget: 5.00,
    alertThreshold: 80,
    totalSpent: 0,
    currency: "USD"
  };

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): CostController {
    if (!CostController.instance) {
      CostController.instance = new CostController();
    }
    return CostController.instance;
  }

  private loadFromStorage() {
    try {
      const savedConfig = localStorage.getItem("jbi_aeo_cost_config");
      const savedTransactions = localStorage.getItem("jbi_aeo_cost_transactions");

      if (savedConfig) {
        this.config = JSON.parse(savedConfig);
      }
      if (savedTransactions) {
        this.transactions = JSON.parse(savedTransactions);
      }
    } catch (e) {
      console.error("Failed to load CostController state:", e);
    }
  }

  public saveToStorage() {
    try {
      localStorage.setItem("jbi_aeo_cost_config", JSON.stringify(this.config));
      localStorage.setItem("jbi_aeo_cost_transactions", JSON.stringify(this.transactions));
    } catch (e) {
      console.error("Failed to save CostController state:", e);
    }
  }

  /**
   * Estimates model token usage and logs a transaction
   */
  public logTransaction(
    taskId: string,
    model: string,
    provider: string,
    inputText: string,
    outputText: string
  ): CostTransaction {
    // Basic heuristics for token estimating: ~4 characters per token
    const inputTokens = Math.max(5, Math.round(inputText.length / 4));
    const outputTokens = Math.max(5, Math.round(outputText.length / 4));
    
    // Get cost per 1M tokens
    const rates = this.getModelTokenRates(model, provider);
    const calculatedCost = 
      (inputTokens * rates.inputRate) / 1000000 + 
      (outputTokens * rates.outputRate) / 1000000;

    const tx: CostTransaction = {
      id: `tx_${Math.random().toString(36).substring(2, 8)}`,
      taskId,
      timestamp: new Date().toLocaleTimeString(),
      model,
      provider,
      inputTokens,
      outputTokens,
      calculatedCost: parseFloat(calculatedCost.toFixed(6))
    };

    this.transactions.unshift(tx);
    
    // Keep list of transactions bounded (e.g. last 100)
    if (this.transactions.length > 100) {
      this.transactions = this.transactions.slice(0, 100);
    }

    this.config.totalSpent = parseFloat((this.config.totalSpent + calculatedCost).toFixed(6));
    this.saveToStorage();

    return tx;
  }

  /**
   * Resets total spent tracking
   */
  public resetBudget() {
    this.config.totalSpent = 0;
    this.transactions = [];
    this.saveToStorage();
  }

  /**
   * Update budget configurations
   */
  public updateConfig(updates: Partial<CostConfig>) {
    this.config = { ...this.config, ...updates };
    this.saveToStorage();
  }

  public getConfig(): CostConfig {
    return this.config;
  }

  public getTransactions(): CostTransaction[] {
    return this.transactions;
  }

  /**
   * Determines if spending has hit the alert threshold
   */
  public isThresholdExceeded(): boolean {
    const usagePercent = (this.config.totalSpent / this.config.dailyBudget) * 100;
    return usagePercent >= this.config.alertThreshold;
  }

  /**
   * Determines if budget is entirely depleted
   */
  public isBudgetDepleted(): boolean {
    return this.config.totalSpent >= this.config.dailyBudget;
  }

  /**
   * Returns rates in USD per 1,000,000 tokens
   */
  private getModelTokenRates(model: string, provider: string): { inputRate: number; outputRate: number } {
    const mName = model.toLowerCase();
    
    if (mName.includes("free")) {
      return { inputRate: 0.0, outputRate: 0.0 }; // Real free OpenRouter models
    }
    if (mName.includes("pro")) {
      return { inputRate: 1.25, outputRate: 5.00 }; // Gemini 2.5 Pro level
    }
    if (mName.includes("flash")) {
      return { inputRate: 0.075, outputRate: 0.30 }; // Gemini 2.5 Flash level
    }
    if (mName.includes("gpt-4o")) {
      return { inputRate: 2.50, outputRate: 10.00 }; // GPT-4o
    }
    if (mName.includes("sonnet")) {
      return { inputRate: 3.00, outputRate: 15.00 }; // Claude 3.5 Sonnet
    }
    if (mName.includes("llama-3-8b") || provider.toLowerCase().includes("local")) {
      return { inputRate: 0.0, outputRate: 0.0 }; // Local Llama
    }

    // Default conservative rates
    return { inputRate: 0.50, outputRate: 1.50 };
  }
}
