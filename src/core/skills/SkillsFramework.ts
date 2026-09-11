/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ISkillPackage {
  id: string;
  name: string;
  description: string;
  version: string;
  domain: "Design" | "E-Commerce" | "SEO" | "Branding" | "Strategy" | "Engineering" | "Content";
  rules: string[];
  bestPractices: string[];
  systemPromptAddendum: string;
  isInstalled: boolean;
  rating: number; // 0 to 100
  executionCount: number;
  successRate: number; // 0 to 100
  history: {
    taskId: string;
    timestamp: string;
    success: boolean;
    score: number;
    feedback?: string;
  }[];
}

export class SkillsFramework {
  private static instance: SkillsFramework | null = null;
  private skills: Map<string, ISkillPackage> = new Map();
  private dbRef: any = null;

  private constructor(db?: any) {
    this.dbRef = db;
    this.loadDefaultSkills();
    if (db) {
      this.syncFromDb();
    }
  }

  public static getInstance(db?: any): SkillsFramework {
    if (!SkillsFramework.instance) {
      SkillsFramework.instance = new SkillsFramework(db);
    } else if (db && !SkillsFramework.instance.dbRef) {
      SkillsFramework.instance.dbRef = db;
      SkillsFramework.instance.syncFromDb();
    }
    return SkillsFramework.instance;
  }

  private loadDefaultSkills() {
    const defaults: ISkillPackage[] = [
      {
        id: "typography",
        name: "Typography & Layout Craft",
        description: "Rules for premium layouts, font pairings, typographic grids, letter spacing, and whitespace hierarchy.",
        version: "1.3.0",
        domain: "Design",
        rules: [
          "Use font-sans (Inter) for UI controls, font-display (Space Grotesk) for display, and font-mono for technical logs.",
          "Apply precise letter-spacing (tracking-tight) on bold display headings.",
          "Ensure body leading-relaxed is proportional to avoid visual overcrowding.",
          "Delineate areas with low-opacity borders (border-white/5) for high-end structure."
        ],
        bestPractices: [
          "Keep text line length under 65 characters.",
          "Ensure typography hierarchy uses modular scales (e.g. 1.25 ratio)."
        ],
        systemPromptAddendum: "Use standard 'Inter' or 'Space Grotesk' fonts, apply precise visual hierarchy, and respect spacing ratios on high-contrast cards.",
        isInstalled: true,
        rating: 95,
        executionCount: 24,
        successRate: 95,
        history: []
      },
      {
        id: "seo-metadata",
        name: "E-Commerce SEO Optimizer",
        description: "SEO keyword targeting, marketplace tagging, product descriptor indexing, and search conversion optimization.",
        version: "1.0.4",
        domain: "SEO",
        rules: [
          "Include target niche keyword in the first 65 characters of product titles.",
          "Construct descriptive image alt tags referencing product functionality.",
          "Generate metadata snippets packed with high-intent transactional search words."
        ],
        bestPractices: [
          "Avoid keyword stuffing; preserve high human readability.",
          "Highlight shipping delivery speeds directly in metadata titles."
        ],
        systemPromptAddendum: "Optimize titles for organic keyword discovery and conversion intent without introducing jargon.",
        isInstalled: true,
        rating: 88,
        executionCount: 12,
        successRate: 91,
        history: []
      },
      {
        id: "shopify-integration",
        name: "Shopify Core Platform Integrator",
        description: "Shopify API schemas, webhook configuration, automated inventory sync, and checkout page styling.",
        version: "2.1.0",
        domain: "E-Commerce",
        rules: [
          "Validate all incoming checkout webhook signatures before updating inventory.",
          "Ensure inventory levels are decremented atomically on checkout callbacks.",
          "Set up redirect URIs dynamically to handle multiple checkout nodes."
        ],
        bestPractices: [
          "Use a centralized webhook listener to prevent duplicate orders.",
          "Always test shipping rates with dry-run fulfillment mock accounts."
        ],
        systemPromptAddendum: "Style checkout listings clearly, and configure robust sandbox webhook pathways.",
        isInstalled: false,
        rating: 85,
        executionCount: 0,
        successRate: 100,
        history: []
      },
      {
        id: "brand-identity",
        name: "Premium Brand Identity System",
        description: "Methods to develop strict palettes, copy vocabularies, corporate voice cards, and logo scales.",
        version: "1.1.2",
        domain: "Branding",
        rules: [
          "Ban generic sales-pitch hype, exclamation marks, or clinical marketing words.",
          "Use simple backgrounds with precise, vibrant contrast highlights.",
          "Keep brand identity minimalist, elite, and intellectually positioned."
        ],
        bestPractices: [
          "Employ abstract geometric shapes rather than busy detailed vector illustrations.",
          "Select colors based on high-contrast palettes that support AAA accessibility."
        ],
        systemPromptAddendum: "Establish quiet-luxury minimalist tones and solid accent structures.",
        isInstalled: true,
        rating: 93,
        executionCount: 18,
        successRate: 94,
        history: []
      }
    ];

    defaults.forEach(s => this.skills.set(s.id, s));
  }

  private syncFromDb() {
    if (!this.dbRef) return;
    if (!this.dbRef.skillsStore) {
      this.dbRef.skillsStore = {};
      this.saveToDb();
    }

    // Load from DB, merging defaults
    const stored = this.dbRef.skillsStore;
    Object.keys(stored).forEach((id) => {
      this.skills.set(id, {
        ...this.skills.get(id),
        ...stored[id]
      } as ISkillPackage);
    });
  }

  private saveToDb() {
    if (!this.dbRef) return;
    const store: Record<string, any> = {};
    this.skills.forEach((skill, id) => {
      store[id] = skill;
    });
    this.dbRef.skillsStore = store;
  }

  public listAll(): ISkillPackage[] {
    return Array.from(this.skills.values());
  }

  public get(id: string): ISkillPackage | undefined {
    return this.skills.get(id);
  }

  public install(id: string): boolean {
    const skill = this.skills.get(id);
    if (skill) {
      skill.isInstalled = true;
      this.saveToDb();
      return true;
    }
    return false;
  }

  public uninstall(id: string): boolean {
    const skill = this.skills.get(id);
    if (skill) {
      skill.isInstalled = false;
      this.saveToDb();
      return true;
    }
    return false;
  }

  public createSkill(skillData: Omit<ISkillPackage, "isInstalled" | "rating" | "executionCount" | "successRate" | "history">): ISkillPackage {
    const newSkill: ISkillPackage = {
      ...skillData,
      isInstalled: true,
      rating: 100,
      executionCount: 0,
      successRate: 100,
      history: []
    };
    this.skills.set(newSkill.id, newSkill);
    this.saveToDb();
    return newSkill;
  }

  public updateSkill(id: string, updatedData: Partial<ISkillPackage>): boolean {
    const skill = this.skills.get(id);
    if (skill) {
      Object.assign(skill, updatedData);
      this.saveToDb();
      return true;
    }
    return false;
  }

  public recordSkillUsage(id: string, taskId: string, success: boolean, score: number, feedback?: string) {
    const skill = this.skills.get(id);
    if (skill) {
      skill.executionCount++;
      skill.history.push({
        taskId,
        timestamp: new Date().toISOString(),
        success,
        score,
        feedback
      });

      // Calculate new success rate
      const successes = skill.history.filter(h => h.success).length;
      skill.successRate = Math.round((successes / skill.executionCount) * 100);

      // Adjust overall rating based on task review score and successes
      const scoresSum = skill.history.reduce((sum, h) => sum + h.score, 0);
      skill.rating = Math.round((scoresSum / skill.executionCount) * 0.7 + skill.successRate * 0.3);

      this.saveToDb();
    }
  }

  public evolveSkill(id: string, criticism: string) {
    const skill = this.skills.get(id);
    if (skill && criticism) {
      // Create a new rule based on the feedback to represent dynamic skill learning!
      const isDuplicate = skill.rules.some(r => r.toLowerCase().includes(criticism.toLowerCase().substring(0, 15)));
      if (!isDuplicate) {
        skill.rules.push(`Rule generated from audit correction: ${criticism}`);
        skill.version = this.incrementVersion(skill.version);
        this.saveToDb();
      }
    }
  }

  private incrementVersion(versionStr: string): string {
    const parts = versionStr.split(".").map(Number);
    if (parts.length === 3) {
      parts[2]++; // increment patch version
      return parts.join(".");
    }
    return `${versionStr}.1`;
  }
}
