/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ModelInstance {
  id: string;
  provider: "Google" | "OpenAI" | "Anthropic" | "Local Llama" | "Mistral";
  model: string;
  apiKey: string;
  status: "active" | "slow" | "failed" | "disabled";
  metrics: {
    avgLatency: number; // in milliseconds
    successRate: number; // 0.0 to 1.0
    qualityScore: number; // 0 to 100
    costPerCall: number; // dynamic or nominal
    callsCount: number;
  };
}

export class ModelRegistry {
  private static instance: ModelRegistry | null = null;
  private instances: ModelInstance[] = [];

  private constructor() {
    this.loadFromStorage();
    if (this.instances.length === 0) {
      this.seedDefaultInstances();
    }
  }

  public static getInstance(): ModelRegistry {
    if (!ModelRegistry.instance) {
      ModelRegistry.instance = new ModelRegistry();
    }
    return ModelRegistry.instance;
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem("jbi_aeo_model_instances");
      if (saved) {
        this.instances = JSON.parse(saved);
      }
      this.ensureOpenRouterKeysSeeded();
    } catch (e) {
      console.error("Failed to load ModelRegistry from localStorage:", e);
    }
  }

  private ensureOpenRouterKeysSeeded(): void {
    const orKeys: ModelInstance[] = [
      {
        id: "inst_nemotron_ultra",
        provider: "OpenAI",
        model: "nvidia/nemotron-3-ultra-550b-a55b:free",
        apiKey: "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",
        status: "active",
        metrics: {
          avgLatency: 1100,
          successRate: 0.99,
          qualityScore: 95,
          costPerCall: 0.0,
          callsCount: 0
        }
      },
      {
        id: "inst_gemma_4_31b",
        provider: "Google",
        model: "google/gemma-4-31b-it:free",
        apiKey: "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",
        status: "active",
        metrics: {
          avgLatency: 950,
          successRate: 0.99,
          qualityScore: 92,
          costPerCall: 0.0,
          callsCount: 0
        }
      },
      {
        id: "inst_nemotron_super",
        provider: "OpenAI",
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        apiKey: "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",
        status: "active",
        metrics: {
          avgLatency: 1200,
          successRate: 0.99,
          qualityScore: 90,
          costPerCall: 0.0,
          callsCount: 0
        }
      },
      {
        id: "inst_nemotron_embed",
        provider: "OpenAI",
        model: "nvidia/llama-nemotron-embed-vl-1b-v2:free",
        apiKey: "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",
        status: "active",
        metrics: {
          avgLatency: 750,
          successRate: 0.98,
          qualityScore: 85,
          costPerCall: 0.0,
          callsCount: 0
        }
      },
      {
        id: "inst_gpt_oss_120b",
        provider: "OpenAI",
        model: "openai/gpt-oss-120b:free",
        apiKey: "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",
        status: "active",
        metrics: {
          avgLatency: 1300,
          successRate: 0.99,
          qualityScore: 94,
          costPerCall: 0.0,
          callsCount: 0
        }
      },
      {
        id: "inst_gemma_4_26b",
        provider: "Google",
        model: "google/gemma-4-26b-a4b-it:free",
        apiKey: "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",
        status: "active",
        metrics: {
          avgLatency: 900,
          successRate: 0.99,
          qualityScore: 89,
          costPerCall: 0.0,
          callsCount: 0
        }
      },
      {
        id: "inst_nemotron_nano",
        provider: "OpenAI",
        model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
        apiKey: "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",
        status: "active",
        metrics: {
          avgLatency: 1050,
          successRate: 0.99,
          qualityScore: 91,
          costPerCall: 0.0,
          callsCount: 0
        }
      },
      {
        id: "inst_poolside_laguna",
        provider: "OpenAI",
        model: "poolside/laguna-m.1:free",
        apiKey: "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",
        status: "active",
        metrics: {
          avgLatency: 1000,
          successRate: 0.99,
          qualityScore: 93,
          costPerCall: 0.0,
          callsCount: 0
        }
      }
    ];

    let updated = false;
    for (const keyInfo of orKeys) {
      const existing = this.instances.find(inst => inst.id === keyInfo.id);
      if (!existing) {
        this.instances.push(keyInfo);
        updated = true;
      } else if (existing.apiKey !== keyInfo.apiKey) {
        existing.apiKey = keyInfo.apiKey;
        updated = true;
      }
    }
    if (updated) {
      this.saveToStorage();
    }
  }

  public saveToStorage() {
    try {
      localStorage.setItem("jbi_aeo_model_instances", JSON.stringify(this.instances));
    } catch (e) {
      console.error("Failed to save ModelRegistry to localStorage:", e);
    }
  }

  public addInstance(instance: ModelInstance): void {
    this.instances.push(instance);
    this.saveToStorage();
  }

  public updateInstance(id: string, updates: Partial<ModelInstance>): void {
    this.instances = this.instances.map(inst => 
      inst.id === id ? { ...inst, ...updates, metrics: { ...inst.metrics, ...updates.metrics } } : inst
    );
    this.saveToStorage();
  }

  public deleteInstance(id: string): void {
    this.instances = this.instances.filter(inst => inst.id !== id);
    this.saveToStorage();
  }

  public getAllInstances(): ModelInstance[] {
    return this.instances;
  }

  public getActiveInstancesForModel(modelName: string): ModelInstance[] {
    return this.instances.filter(
      m => m.model.toLowerCase() === modelName.toLowerCase() && m.status === "active"
    );
  }

  public getBestInstance(taskType: string): ModelInstance | undefined {
    const active = this.instances.filter(m => m.status === "active");
    if (active.length === 0) return undefined;

    // Weight score based on task category preferences
    return active.sort((a, b) => {
      let weightQuality = 0.5;
      let weightLatency = 0.3;
      let weightSuccess = 0.2;

      if (taskType === "writing" || taskType === "analysis") {
        weightQuality = 0.7;
        weightLatency = 0.15;
      } else if (taskType === "research" || taskType === "seo") {
        weightQuality = 0.3;
        weightLatency = 0.5;
      }

      const scoreA = 
        (a.metrics.qualityScore * weightQuality) +
        ((10000 / Math.max(100, a.metrics.avgLatency)) * weightLatency) +
        (a.metrics.successRate * 100 * weightSuccess);

      const scoreB = 
        (b.metrics.qualityScore * weightQuality) +
        ((10000 / Math.max(100, b.metrics.avgLatency)) * weightLatency) +
        (b.metrics.successRate * 100 * weightSuccess);

      return scoreB - scoreA;
    })[0];
  }

  private seedDefaultInstances(): void {
    this.instances = [
      {
        id: "inst_gemini_flash_primary",
        provider: "Google",
        model: "gemini-2.5-flash",
        apiKey: "system_primary_key_fallback",
        status: "active",
        metrics: {
          avgLatency: 850,
          successRate: 0.99,
          qualityScore: 88,
          costPerCall: 0.0001,
          callsCount: 342
        }
      },
      {
        id: "inst_gemini_pro_high_qual",
        provider: "Google",
        model: "gemini-2.5-pro",
        apiKey: "system_primary_key_fallback",
        status: "active",
        metrics: {
          avgLatency: 2100,
          successRate: 0.98,
          qualityScore: 98,
          costPerCall: 0.0015,
          callsCount: 88
        }
      },
      {
        id: "inst_gpt_4o_backup",
        provider: "OpenAI",
        model: "gpt-4o",
        apiKey: "sk-proj-4oBackupInstanceKeyXXXX",
        status: "active",
        metrics: {
          avgLatency: 1450,
          successRate: 0.97,
          qualityScore: 95,
          costPerCall: 0.0025,
          callsCount: 142
        }
      },
      {
        id: "inst_claude_sonnet_creative",
        provider: "Anthropic",
        model: "claude-3-5-sonnet",
        apiKey: "sk-ant-sid01-SonnetKeyFallbacks",
        status: "active",
        metrics: {
          avgLatency: 1850,
          successRate: 0.96,
          qualityScore: 99,
          costPerCall: 0.0030,
          callsCount: 56
        }
      },
      {
        id: "inst_llama_local_host",
        provider: "Local Llama",
        model: "llama-3-8b",
        apiKey: "http://localhost:11434",
        status: "active",
        metrics: {
          avgLatency: 450,
          successRate: 0.92,
          qualityScore: 78,
          costPerCall: 0.0000,
          callsCount: 201
        }
      },
      {
        id: "inst_nemotron_ultra",
        provider: "OpenAI",
        model: "nvidia/nemotron-3-ultra-550b-a55b:free",
        apiKey: "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",
        status: "active",
        metrics: {
          avgLatency: 1100,
          successRate: 0.99,
          qualityScore: 95,
          costPerCall: 0.0,
          callsCount: 0
        }
      },
      {
        id: "inst_gemma_4_31b",
        provider: "Google",
        model: "google/gemma-4-31b-it:free",
        apiKey: "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",
        status: "active",
        metrics: {
          avgLatency: 950,
          successRate: 0.99,
          qualityScore: 92,
          costPerCall: 0.0,
          callsCount: 0
        }
      },
      {
        id: "inst_nemotron_super",
        provider: "OpenAI",
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        apiKey: "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",
        status: "active",
        metrics: {
          avgLatency: 1200,
          successRate: 0.99,
          qualityScore: 90,
          costPerCall: 0.0,
          callsCount: 0
        }
      },
      {
        id: "inst_nemotron_embed",
        provider: "OpenAI",
        model: "nvidia/llama-nemotron-embed-vl-1b-v2:free",
        apiKey: "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",
        status: "active",
        metrics: {
          avgLatency: 750,
          successRate: 0.98,
          qualityScore: 85,
          costPerCall: 0.0,
          callsCount: 0
        }
      },
      {
        id: "inst_gpt_oss_120b",
        provider: "OpenAI",
        model: "openai/gpt-oss-120b:free",
        apiKey: "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",
        status: "active",
        metrics: {
          avgLatency: 1300,
          successRate: 0.99,
          qualityScore: 94,
          costPerCall: 0.0,
          callsCount: 0
        }
      },
      {
        id: "inst_gemma_4_26b",
        provider: "Google",
        model: "google/gemma-4-26b-a4b-it:free",
        apiKey: "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",
        status: "active",
        metrics: {
          avgLatency: 900,
          successRate: 0.99,
          qualityScore: 89,
          costPerCall: 0.0,
          callsCount: 0
        }
      },
      {
        id: "inst_nemotron_nano",
        provider: "OpenAI",
        model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
        apiKey: "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",
        status: "active",
        metrics: {
          avgLatency: 1050,
          successRate: 0.99,
          qualityScore: 91,
          costPerCall: 0.0,
          callsCount: 0
        }
      },
      {
        id: "inst_poolside_laguna",
        provider: "OpenAI",
        model: "poolside/laguna-m.1:free",
        apiKey: "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",
        status: "active",
        metrics: {
          avgLatency: 1000,
          successRate: 0.99,
          qualityScore: 93,
          costPerCall: 0.0,
          callsCount: 0
        }
      }
    ];
    this.saveToStorage();
  }
}
