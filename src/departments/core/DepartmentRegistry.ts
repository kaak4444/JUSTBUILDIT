/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Department, Worker, Mission, ActivityEvent, DepartmentLog } from "./Department";

export class DepartmentRegistry {
  private static instance: DepartmentRegistry | null = null;
  private departments: Map<string, Department> = new Map();
  private activityFeed: ActivityEvent[] = [];
  private listeners: (() => void)[] = [];

  private constructor() {
    this.initializeDefaultDepartments();
  }

  public static getInstance(): DepartmentRegistry {
    if (!DepartmentRegistry.instance) {
      DepartmentRegistry.instance = new DepartmentRegistry();
    }
    return DepartmentRegistry.instance;
  }

  public register(dept: Department): void {
    this.departments.set(dept.id, dept);
    this.notify();
  }

  public get(id: string): Department | undefined {
    return this.departments.get(id);
  }

  public list(): Department[] {
    return Array.from(this.departments.values());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(listener => listener());
  }

  public getActivityFeed(): ActivityEvent[] {
    return this.activityFeed;
  }

  public emitActivity(deptId: string, type: ActivityEvent["type"], message: string): void {
    const event: ActivityEvent = {
      id: `act_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toLocaleTimeString(),
      departmentId: deptId,
      type,
      message
    };
    this.activityFeed = [event, ...this.activityFeed].slice(0, 50); // limit to last 50
    
    // Also append as a log to that department
    const dept = this.departments.get(deptId);
    if (dept) {
      const logEntry: DepartmentLog = {
        id: `log_${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toLocaleTimeString(),
        level: type.includes("FAILED") ? "ERROR" : type.includes("PROGRESS") ? "DEBUG" : "INFO",
        message
      };
      dept.logs = [logEntry, ...dept.logs].slice(0, 100);
      
      // Bump KPIs slightly for visual interest
      if (type === "MISSION_COMPLETED") {
        dept.kpis.queueSize = Math.max(0, dept.kpis.queueSize - 1);
        dept.kpis.performance = Math.min(100, dept.kpis.performance + 1.5);
      }
    }
    
    this.notify();
  }

  public updateDepartment(id: string, updateFn: (dept: Department) => Department): void {
    const dept = this.departments.get(id);
    if (dept) {
      this.departments.set(id, updateFn({ ...dept }));
      this.notify();
    }
  }

  private initializeDefaultDepartments() {
    // 1. RESEARCH DEPARTMENT
    this.departments.set("research", {
      id: "research",
      name: "Research Intelligence",
      icon: "Search",
      description: "Scans marketplaces, monitors complaints, downloads academic papers, and extracts knowledge graphs.",
      workers: [
        { id: "res_trend", name: "Trend Scout", role: "Market trend analyzer", status: "IDLE", progress: 0, currentTask: "Awaiting next seed query", performanceScore: 94, tasksCompleted: 142 },
        { id: "res_crawler", name: "Review Crawler", role: "Competitor reviews harvester", status: "RUNNING", progress: 65, currentTask: "Scraping Amazon best sellers in 'Self-Improvement'", performanceScore: 89, tasksCompleted: 231 },
        { id: "res_complaints", name: "Complaint Analyst", role: "Identifies unmet needs & frustration patterns", status: "WAITING", progress: 0, currentTask: "Waiting for raw review inputs from Trend Scout", performanceScore: 97, tasksCompleted: 88 },
        { id: "res_seo", name: "SEO Strategist", role: "Keywords & search volume optimizer", status: "IDLE", progress: 0, currentTask: "Awaiting target product spec", performanceScore: 91, tasksCompleted: 110 }
      ],
      missions: [
        { id: "mis_res_1", title: "Amazon Self-Help Book Niche Scouting", description: "Audit top 100 books to extract pain points, content gaps, and formatting choices.", status: "RUNNING", priority: "HIGH", progress: 45, createdAt: "09:30 AM", updatedAt: "10:15 AM", assignedWorkers: ["res_crawler", "res_complaints"] },
        { id: "mis_res_2", title: "Dropshipping Spine Cushions SEO Audit", description: "Search term intensity maps for spine supports and ergonomic seats.", status: "PENDING", priority: "MEDIUM", progress: 0, createdAt: "10:45 AM", updatedAt: "10:45 AM", assignedWorkers: [] }
      ],
      memory: {
        facts: [
          { id: "f_res_1", category: "Self-Help Niche", content: "Readers hate overly long introductions. Standard complaint: 'Could have been a blog post.' Keep books concise (120-150 pages).", confidence: 95, createdAt: "Yesterday", updatedAt: "Yesterday" },
          { id: "f_res_2", category: "Color Psychology", content: "Soft emerald green and cream book covers perform 32% better in clinical aesthetic categories.", confidence: 88, createdAt: "Today", updatedAt: "Today" }
        ],
        notes: "Prioritize formatting journals and checklists. Customers are buying layout templates over heavy text walls.",
        knowledgeGraphNodesCount: 148
      },
      kpis: { health: 98, performance: 94, speed: 82, queueSize: 2, memoryUsage: "12.4 MB", averageCompletionTime: "14 mins", workerCount: 4 },
      settings: { concurrencyLimit: 4, activeModel: "gemini-2.5-flash", strictQualityMode: false, autoHealEnabled: true },
      logs: [
        { id: "l_res_1", timestamp: "10:45:12", level: "INFO", message: "Successfully connected to Amazon Search index" },
        { id: "l_res_2", timestamp: "10:46:05", level: "DEBUG", message: "Review Crawler processed 45 book listings, found 182 complaints regarding spine size" }
      ]
    });

    // 2. BOOKS DEPARTMENT
    this.departments.set("books", {
      id: "books",
      name: "Autonomous Book Publisher",
      icon: "BookOpen",
      description: "Directs book construction. From outline generation, specialized chapter authors, to review & cover triggers.",
      workers: [
        { id: "bk_ceo", name: "Book CEO Agent", role: "Directs project execution pipelines", status: "RUNNING", progress: 30, currentTask: "Coordinating chapter 3 outline hand-off", performanceScore: 99, tasksCompleted: 54 },
        { id: "bk_planner", name: "Book Planner", role: "Builds structure & transformation blueprints", status: "IDLE", progress: 0, currentTask: "Waiting for niche brief", performanceScore: 96, tasksCompleted: 45 },
        { id: "bk_writer", name: "Chapter Writer", role: "Specialized chapter writing agent", status: "RUNNING", progress: 55, currentTask: "Drafting Chapter 3: 'Developing a Focused Mindset'", performanceScore: 92, tasksCompleted: 112 },
        { id: "bk_rev_grammar", name: "Grammar Inspector", role: "Syntax, spelling, & syntax validator", status: "IDLE", progress: 0, currentTask: "Awaiting next completed chapter", performanceScore: 98, tasksCompleted: 240 },
        { id: "bk_rev_comm", name: "Commercial Reviewer", role: "Reader feedback & buy-triggers auditor", status: "WAITING", progress: 0, currentTask: "Awaiting final draft bundle", performanceScore: 95, tasksCompleted: 38 }
      ],
      missions: [
        { id: "mis_bk_1", title: "The Serene Reader: Daily Journal", description: "Write and package a 120-page elegant wellness mindfulness journal.", status: "RUNNING", priority: "CRITICAL", progress: 30, createdAt: "08:15 AM", updatedAt: "10:30 AM", assignedWorkers: ["bk_ceo", "bk_writer"] }
      ],
      memory: {
        facts: [
          { id: "f_bk_1", category: "Format Rule", content: "Spine margin math: Pages (120) * 0.00225 + 0.138 inches bleed required for paperback wrapping.", confidence: 100, createdAt: "2 days ago", updatedAt: "2 days ago" },
          { id: "f_bk_2", category: "Style Guide", content: "Use Space Grotesk for chapter titles, Playfair Display for subtitles, and JetBrains Mono for visual check-lines.", confidence: 92, createdAt: "Today", updatedAt: "Today" }
        ],
        notes: "Always split chapter writing into micro-tasks. Never ask a single model to output more than 2,000 words at a time.",
        knowledgeGraphNodesCount: 204
      },
      kpis: { health: 100, performance: 96, speed: 74, queueSize: 1, memoryUsage: "48.2 MB", averageCompletionTime: "128 mins", workerCount: 5 },
      settings: { concurrencyLimit: 2, activeModel: "gemini-2.5-pro", strictQualityMode: true, autoHealEnabled: true },
      logs: [
        { id: "l_bk_1", timestamp: "10:30:00", level: "INFO", message: "Book CEO initiated pipeline for 'The Serene Reader'" },
        { id: "l_bk_2", timestamp: "10:31:12", level: "DEBUG", message: "Book Planner created blueprint outline with 6 chapters" }
      ]
    });

    // 3. CREATIVE STUDIO
    this.departments.set("creative", {
      id: "creative",
      name: "Creative Design Studio",
      icon: "Sparkles",
      description: "Generates assets, selects fonts, analyzes color psychology, and tests thumbnail contrast.",
      workers: [
        { id: "cr_director", name: "Art Director", role: "Cohesive visual theme coordinator", status: "IDLE", progress: 0, currentTask: "Awaiting branding spec", performanceScore: 95, tasksCompleted: 87 },
        { id: "cr_palette", name: "Color Psychologist", role: "Niche emotional palette generator", status: "RUNNING", progress: 85, currentTask: "Generating warm twilight dark presets for wellness app", performanceScore: 93, tasksCompleted: 119 },
        { id: "cr_cover", name: "Composition Designer", role: "Layout & thumbnail visibility tester", status: "IDLE", progress: 0, currentTask: "Awaiting prompt specs", performanceScore: 91, tasksCompleted: 64 }
      ],
      missions: [
        { id: "mis_cr_1", title: "Twilight Theme Branding Kit", description: "Design an eye-safe aesthetic layout theme with golden-sunset and deep slate colors.", status: "RUNNING", priority: "MEDIUM", progress: 85, createdAt: "10:00 AM", updatedAt: "10:50 AM", assignedWorkers: ["cr_palette"] }
      ],
      memory: {
        facts: [
          { id: "f_cr_1", category: "Color Accents", content: "Warm gold (#F59E0B) highlights against matte charcoal (#121212) drive high click rates on premium digital widgets.", confidence: 91, createdAt: "Yesterday", updatedAt: "Yesterday" }
        ],
        notes: "Keep illustrations minimal. Avoid busy vector styles. Stick to sharp contrast and solid negative spacing.",
        knowledgeGraphNodesCount: 82
      },
      kpis: { health: 95, performance: 92, speed: 89, queueSize: 1, memoryUsage: "16.8 MB", averageCompletionTime: "8 mins", workerCount: 3 },
      settings: { concurrencyLimit: 3, activeModel: "imagen-3", strictQualityMode: false, autoHealEnabled: false },
      logs: [
        { id: "l_cr_1", timestamp: "10:50:00", level: "INFO", message: "Art Director imported default golden-sun palette node" }
      ]
    });

    // 4. PUBLISHING DEPARTMENT
    this.departments.set("publishing", {
      id: "publishing",
      name: "Publishing Department",
      icon: "Rocket",
      description: "Formats final files (EPUB, PDF), prepares metadata, SEO keywords, and manages KDP bookshelves.",
      workers: [
        { id: "pb_formatter", name: "KDP Formatter", role: "Spine & page math calculations", status: "IDLE", progress: 0, currentTask: "Awaiting manuscript package", performanceScore: 97, tasksCompleted: 154 },
        { id: "pb_meta", name: "Metadata Compiler", role: "Generates title, tags, description, price rules", status: "IDLE", progress: 0, currentTask: "Awaiting final proof approval", performanceScore: 94, tasksCompleted: 182 },
        { id: "pb_connector", name: "KDP Bookshelf Agent", role: "Direct API communicator & upload agent", status: "WAITING", progress: 0, currentTask: "Waiting on token refresh validation", performanceScore: 98, tasksCompleted: 92 }
      ],
      missions: [
        { id: "mis_pb_1", title: "Publish 'The Serene Reader' to KDP", description: "Package interior, cover, format KDP guidelines, and submit under category Wellness.", status: "WAITING", priority: "HIGH", progress: 0, createdAt: "10:55 AM", updatedAt: "10:55 AM", assignedWorkers: ["pb_formatter", "pb_connector"] }
      ],
      memory: {
        facts: [
          { id: "f_pb_1", category: "Metadata Rule", content: "KDP backend search requires indexing 7 distinct keyword phrases. General tags like 'journal' waste indexing power.", confidence: 100, createdAt: "3 days ago", updatedAt: "3 days ago" }
        ],
        notes: "Store KDP draft status inside local bookshelf memory before triggering live publishing. Always check auth tokens first.",
        knowledgeGraphNodesCount: 54
      },
      kpis: { health: 78, performance: 80, speed: 65, queueSize: 1, memoryUsage: "8.5 MB", averageCompletionTime: "45 mins", workerCount: 3 },
      settings: { concurrencyLimit: 1, activeModel: "gemini-2.5-flash", strictQualityMode: true, autoHealEnabled: true },
      logs: [
        { id: "l_pb_1", timestamp: "10:55:00", level: "WARN", message: "KDP session cookie expired (Stuck at Stage 4: Packaging/Upload). Token renewal required." }
      ]
    });

    // 5. PRODUCTION LABORATORY
    this.departments.set("production", {
      id: "production",
      name: "Production Laboratory",
      icon: "Wrench",
      description: "Assembles digital products, code templates, coordinates PDF compilation scripts, and audio tracks.",
      workers: [
        { id: "pd_pdf", name: "PDF Compiler", role: "Vector canvas rendering engineer", status: "IDLE", progress: 0, currentTask: "Idle", performanceScore: 96, tasksCompleted: 310 },
        { id: "pd_epub", name: "EPUB Synthesizer", role: "Reflowable CSS book compiler", status: "IDLE", progress: 0, currentTask: "Idle", performanceScore: 93, tasksCompleted: 145 },
        { id: "pd_audio", name: "TTS Audio Engineer", role: "Voice tone & pitch model tuner", status: "RUNNING", progress: 12, currentTask: "Synthesizing chapter 1 preview audio file", performanceScore: 91, tasksCompleted: 24 }
      ],
      missions: [
        { id: "mis_pd_1", title: "Mindfulness Audio Tracks Compilation", description: "Synthesize 5 deep ambient breathing soundtracks for accompanying digital journal.", status: "RUNNING", priority: "LOW", progress: 12, createdAt: "11:00 AM", updatedAt: "11:00 AM", assignedWorkers: ["pd_audio"] }
      ],
      memory: {
        facts: [
          { id: "f_pd_1", category: "Audio Output", content: "Natural male soft British voice has 40% higher attention score for relaxation podcasts.", confidence: 85, createdAt: "Yesterday", updatedAt: "Yesterday" }
        ],
        notes: "Keep track of background noise decibel constraints. Ideal ambient hum should sit below -45dB.",
        knowledgeGraphNodesCount: 61
      },
      kpis: { health: 100, performance: 95, speed: 85, queueSize: 1, memoryUsage: "22.5 MB", averageCompletionTime: "18 mins", workerCount: 3 },
      settings: { concurrencyLimit: 3, activeModel: "gemini-2.5-flash", strictQualityMode: false, autoHealEnabled: true },
      logs: [
        { id: "l_pd_1", timestamp: "11:00:15", level: "INFO", message: "Triggered MP3 container writer for wellness asset" }
      ]
    });

    // 6. MARKETING AGENCY
    this.departments.set("marketing", {
      id: "marketing",
      name: "Marketing Agency",
      icon: "TrendingUp",
      description: "Generates high-converting copywriting, automates ad keywords, targets social media niches.",
      workers: [
        { id: "mk_copywriter", name: "Ad Copywriter", role: "AIDA format sales pitch writer", status: "IDLE", progress: 0, currentTask: "Idle", performanceScore: 95, tasksCompleted: 312 },
        { id: "mk_bidder", name: "PPC Bid Optimizer", role: "Adjusts keyword bids against competitor density", status: "IDLE", progress: 0, currentTask: "Idle", performanceScore: 90, tasksCompleted: 78 }
      ],
      missions: [
        { id: "mis_mk_1", title: "Amazon PPC Prep - Wellness Book", description: "Extract 150 target long-tail search keywords and compile bullet copywriting.", status: "PENDING", priority: "MEDIUM", progress: 0, createdAt: "11:05 AM", updatedAt: "11:05 AM", assignedWorkers: [] }
      ],
      memory: {
        facts: [
          { id: "f_mk_1", category: "Amazon SEO", content: "Keywords targeting 'habits workbook' convert at 12% compared to 'journal' which is oversaturated at 2.5%.", confidence: 97, createdAt: "3 days ago", updatedAt: "3 days ago" }
        ],
        notes: "Don't sell features. Sell the emotional state. Focus on 'Clarity over Chaos'.",
        knowledgeGraphNodesCount: 110
      },
      kpis: { health: 100, performance: 91, speed: 92, queueSize: 1, memoryUsage: "5.4 MB", averageCompletionTime: "6 mins", workerCount: 2 },
      settings: { concurrencyLimit: 5, activeModel: "gemini-2.5-flash", strictQualityMode: false, autoHealEnabled: false },
      logs: [
        { id: "l_mk_1", timestamp: "11:05:00", level: "INFO", message: "Awaiting book launch trigger to deploy keyword bidding tables" }
      ]
    });

    // 7. COMMERCE OPERATIONS
    this.departments.set("commerce", {
      id: "commerce",
      name: "Commerce Department",
      icon: "ShoppingBag",
      description: "Coordinates digital product syncing, manages checkout APIs, and communicates with dropship suppliers.",
      workers: [
        { id: "cm_shopify", name: "Shopify Sync Agent", role: "Catalog sync and inventory controller", status: "IDLE", progress: 0, currentTask: "Idle", performanceScore: 96, tasksCompleted: 420 },
        { id: "cm_scout", name: "Supplier Negotiator", role: "Audits supplier speed and reliability", status: "IDLE", progress: 0, currentTask: "Idle", performanceScore: 89, tasksCompleted: 54 }
      ],
      missions: [],
      memory: {
        facts: [
          { id: "f_cm_1", category: "Supplier SLA", content: "CJ Dropshipping warehouse 4 handles spine cushings with 3-day express shipping constraints.", confidence: 90, createdAt: "Yesterday", updatedAt: "Yesterday" }
        ],
        notes: "Keep store sync automatic. Avoid manual CSV imports. Rely on direct Webhook callbacks.",
        knowledgeGraphNodesCount: 42
      },
      kpis: { health: 100, performance: 97, speed: 96, queueSize: 0, memoryUsage: "3.2 MB", averageCompletionTime: "2 mins", workerCount: 2 },
      settings: { concurrencyLimit: 10, activeModel: "gemini-2.5-flash", strictQualityMode: false, autoHealEnabled: true },
      logs: [
        { id: "l_cm_1", timestamp: "11:00:00", level: "INFO", message: "Checked store integration. Status: ONLINE. 0 orders pending." }
      ]
    });

    // 8. FINANCE LEDGER
    this.departments.set("finance", {
      id: "finance",
      name: "Finance & Royalties",
      icon: "Database",
      description: "Tracks book royalties, calculates pricing, estimates profit margins, and manages token spending.",
      workers: [
        { id: "fn_auditor", name: "Ledger Auditor", role: "Token spend vs API calls logger", status: "IDLE", progress: 0, currentTask: "Idle", performanceScore: 98, tasksCompleted: 512 },
        { id: "fn_margins", name: "Pricing Architect", role: "Royalty ratio optimization engineer", status: "IDLE", progress: 0, currentTask: "Idle", performanceScore: 97, tasksCompleted: 130 }
      ],
      missions: [],
      memory: {
        facts: [
          { id: "f_fn_1", category: "Royalty Rules", content: "KDP offers 70% royalties for paperbacks priced between $2.99 and $9.99, but drops to 35% outside this range.", confidence: 100, createdAt: "Last week", updatedAt: "Last week" }
        ],
        notes: "Set soft coin alerts at $5.00 daily spend to prevent loops during deep model review sessions.",
        knowledgeGraphNodesCount: 30
      },
      kpis: { health: 100, performance: 99, speed: 98, queueSize: 0, memoryUsage: "1.5 MB", averageCompletionTime: "1 min", workerCount: 2 },
      settings: { concurrencyLimit: 1, activeModel: "gemini-2.5-flash", strictQualityMode: true, autoHealEnabled: true },
      logs: [
        { id: "l_fn_1", timestamp: "11:02:00", level: "INFO", message: "Royalties ledger loaded. Total accumulated earnings: $1,428.50" }
      ]
    });

    // 9. ORGANIZATIONAL EVOLUTION
    this.departments.set("evolution", {
      id: "evolution",
      name: "Self-Evolution Core",
      icon: "Cpu",
      description: "Self-adjusts department settings, modifies worker instructions, and simulates task routing.",
      workers: [
        { id: "ev_mutator", name: "Core Mutator", role: "Worker code & instruction optimizer", status: "IDLE", progress: 0, currentTask: "Idle", performanceScore: 94, tasksCompleted: 18 },
        { id: "ev_evaluator", name: "Policy Critic", role: "Simulates policy bottlenecks & adjusts limits", status: "RUNNING", progress: 40, currentTask: "Simulating throughput under active queue sizes", performanceScore: 96, tasksCompleted: 35 }
      ],
      missions: [
        { id: "mis_ev_1", title: "Simulate Workspace Speed Improvements", description: "Review and optimize concurrency constraints across active publishing pipelines.", status: "RUNNING", priority: "HIGH", progress: 40, createdAt: "11:08 AM", updatedAt: "11:08 AM", assignedWorkers: ["ev_evaluator"] }
      ],
      memory: {
        facts: [
          { id: "f_ev_1", category: "Optimization Rule", content: "Lowering concurrency limit to 2 for Books Department resolved 92% of context-window model crashes.", confidence: 99, createdAt: "Yesterday", updatedAt: "Yesterday" }
        ],
        notes: "Keep department structures modular. Allow simple injection of new workers via the registry mapping.",
        knowledgeGraphNodesCount: 75
      },
      kpis: { health: 100, performance: 95, speed: 90, queueSize: 1, memoryUsage: "14.2 MB", averageCompletionTime: "24 mins", workerCount: 2 },
      settings: { concurrencyLimit: 1, activeModel: "gemini-2.5-pro", strictQualityMode: true, autoHealEnabled: true },
      logs: [
        { id: "l_ev_1", timestamp: "11:08:00", level: "INFO", message: "Evolution Engine started workspace sweep. Found 0 bottleneck candidates." }
      ]
    });
  }
}
