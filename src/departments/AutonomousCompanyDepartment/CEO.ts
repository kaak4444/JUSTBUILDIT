import { BusinessScout } from "./BusinessScout";
import { BusinessJudge } from "./BusinessJudge";
import { BusinessSimulator } from "./BusinessSimulator";
import { MarketMonitor, LaunchManager, RevenueMonitor, GrowthManager, RetirementManager } from "./AutonomicManagers";
import { Opportunity, BusinessPortfolioItem, BusinessMemoryEntry, CorporateGrowthTask, Program, ProductMission } from "../../core/models/AutonomousCompany";

export class CEO {
  private static instance: CEO | null = null;

  public scout: BusinessScout;
  public judge: BusinessJudge;
  public simulator: BusinessSimulator;
  public marketMonitor: MarketMonitor;
  public launchManager: LaunchManager;
  public revenueMonitor: RevenueMonitor;
  public growthManager: GrowthManager;
  public retirementManager: RetirementManager;

  private dbRef: any;

  private constructor(db: any) {
    this.dbRef = db;
    this.scout = new BusinessScout();
    this.judge = new BusinessJudge();
    this.simulator = new BusinessSimulator();
    this.marketMonitor = new MarketMonitor();
    this.launchManager = new LaunchManager();
    this.revenueMonitor = new RevenueMonitor();
    this.growthManager = new GrowthManager();
    this.retirementManager = new RetirementManager();

    this.bootstrapState();
  }

  public static getInstance(db?: any): CEO {
    if (!CEO.instance) {
      if (!db) {
        throw new Error("Database reference is required to initialize CEO singleton.");
      }
      CEO.instance = new CEO(db);
    }
    return CEO.instance;
  }

  private bootstrapState() {
    if (!this.dbRef.autonomousCompanyStore) {
      this.dbRef.autonomousCompanyStore = {
        programs: [],
        missions: [],
        findings: [],
        evaluations: [],
        executionPackages: [],
        opportunities: [],
        portfolios: [],
        memories: {},
        growthTasks: [],
        tickerLogs: []
      };
    }

    const store = this.dbRef.autonomousCompanyStore;

    // Bootstrap default Programs if empty
    if (store.programs.length === 0) {
      store.programs = [
        { id: "prog_digital_products", name: "Digital Products Program", description: "Bootstrap high-margin digital downloads and guides for late-night scholars.", goalId: "goal_passive_income", status: "ACTIVE" },
        { id: "prog_checkout_saas", name: "E-Commerce Utility Micro-SaaS", description: "Develop lightweight webhooks and automated tax grids solving checkout dropshipping friction.", goalId: "goal_saas_portfolio", status: "ACTIVE" }
      ];
    }

    // Bootstrap default opportunities
    if (store.opportunities.length === 0) {
      const defaultOpps: Opportunity[] = [
        {
          id: "opp_default_01",
          title: "Aesthetic Dark-Mode Academic Prep E-Reader",
          category: "Digital Prep & Templates",
          problem: "TOEFL and academic students reading dense mock prep passages late at night suffer high glare and eye fatigue because study platforms lack OLED-native dark layouts.",
          audience: "Late-night ESL Candidates, TOEFL/IELTS Scholars, Academic Study Communities",
          confidence: 94,
          estimatedRevenue: 14500,
          competition: 22,
          difficulty: 40,
          timestamp: new Date().toISOString(),
          status: "LAUNCHED",
          signals: [
            { type: "search_volume", source: "Google Ads", strength: 92, detail: "Search volumes for 'dark academic planner' and 'eye-safe reading' are up 140% YoY." }
          ]
        },
        {
          id: "opp_default_02",
          title: "Minimalist High-Contrast PDF Printable Planners",
          category: "Digital Planners & Printables",
          problem: "Etsy has thousands of overly decorated floral planners, but is completely missing clean, ultra-high contrast minimalist templates for laser printing that save expensive color inks.",
          audience: "Productivity Enthusiasts, Laser Printer Owners, Minimalist Designers",
          confidence: 89,
          estimatedRevenue: 18000,
          competition: 35,
          difficulty: 30,
          timestamp: new Date().toISOString(),
          status: "DISCOVERED",
          signals: [
            { type: "search_volume", source: "Etsy Search Suggestions", strength: 85, detail: "Trending tags include 'monochrome planner pdf', 'ink saver printables'." }
          ]
        }
      ];
      store.opportunities = defaultOpps;
    }

    // Bootstrap default portfolios
    if (store.portfolios.length === 0) {
      const { item, memory } = this.launchManager.launchBusiness(store.opportunities[0], 29);
      store.portfolios = [item];
      store.memories[item.id] = memory;
    }

    // Bootstrap default growth tasks
    if (store.growthTasks.length === 0 && store.portfolios.length > 0) {
      store.growthTasks = [
        {
          id: "growth_01",
          businessId: store.portfolios[0].id,
          title: "Inject High-Volume SEO Longtail Tags",
          category: "SEO",
          description: "Optimize metadata descriptions with 'dark academic planner' and 'ink saver monochrome layout'.",
          status: "PENDING",
          estimatedImpact: "+25% Organic Search Visibility"
        }
      ];
    }

    // Bootstrap default CEO ticker logs
    if (store.tickerLogs.length === 0) {
      store.tickerLogs = [
        {
          id: "ticker_01",
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          source: "CEO",
          message: "Autonomic Organization initialized. Digital product exploration portfolio listening."
        },
        {
          id: "ticker_02",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          source: "MARKET_MONITOR",
          message: "Verified stable market interest index for high-contrast monochrome printables."
        }
      ];
    }
  }

  public getStore() {
    return this.dbRef.autonomousCompanyStore;
  }

  /**
   * Primary cognitive loop representing the CEO's automated daily thoughts.
   * Scans markets, evaluates opportunities, simulates, and triggers automatic business launches!
   */
  public async think(): Promise<{ launched: boolean; message: string; opportunity?: Opportunity }> {
    const store = this.dbRef.autonomousCompanyStore;
    const ticker = store.tickerLogs;

    this.addTickerLog("CEO", "Executing daily autonomic operational cycle. Scanning market signals...");

    // 1. Scan for opportunities
    const discovered = await this.scout.scanForOpportunities();
    
    // Add newly discovered opportunities to store, avoiding duplicates
    discovered.forEach(newOpp => {
      const existing = store.opportunities.find((o: Opportunity) => o.title === newOpp.title);
      if (!existing) {
        store.opportunities.unshift(newOpp);
      }
    });

    // 2. Rank discovered opportunities
    const pendingOpps = store.opportunities.filter((o: Opportunity) => o.status === "DISCOVERED");
    if (pendingOpps.length === 0) {
      this.addTickerLog("CEO", "Review cycle completed. No new unvetted opportunities detected in marketplace.");
      return { launched: false, message: "No new unvetted opportunities." };
    }

    // Score and select winner
    const scoredOpps = pendingOpps.map((opp: Opportunity) => {
      const res = this.judge.evaluateOpportunity(opp);
      return { opp, score: res.score };
    });

    scoredOpps.sort((a: any, b: any) => b.score - a.score);
    const winnerData = scoredOpps[0];

    this.addTickerLog("CEO", `Identified top opportunity: '${winnerData.opp.title}' (Viability Score: ${winnerData.score}/100)`);

    // 3. Trigger Business Simulation
    const prediction = this.simulator.simulateBusiness(winnerData.opp, 29);
    this.addTickerLog("SIMULATOR", `Projected ROI for '${winnerData.opp.title}': Monthly Profit: $${prediction.monthlyProfit}. Break-even: ${prediction.timeToBreakEvenDays} days.`);

    // 4. CEO Go/No-Go Decision Gate
    if (winnerData.score >= 85) {
      // Launch!
      winnerData.opp.status = "LAUNCHED";
      
      const { item, memory } = this.launchManager.launchBusiness(winnerData.opp, 29);
      store.portfolios.unshift(item);
      store.memories[item.id] = memory;

      // Automatically propose first growth task
      const firstTask = this.growthManager.proposeGrowthTask(item);
      store.growthTasks.unshift(firstTask);

      this.addTickerLog("CEO", `APPROVED! Launched entire autonomic subsidiary: '${item.name}'!`);
      this.addTickerLog("LAUNCH_MANAGER", `Provisioned separate business memory sandbox and assets for '${item.name}'`);

      return {
        launched: true,
        message: `Successfully approved and launched digital company subsidiary: '${item.name}'! Viability score: ${winnerData.score}.`,
        opportunity: winnerData.opp
      };
    } else {
      winnerData.opp.status = "ARCHIVED";
      this.addTickerLog("CEO", `REJECTED: Opportunity '${winnerData.opp.title}' scored ${winnerData.score}/100, which falls below the strict 85 threshold.`);
      return {
        launched: false,
        message: `Opportunity rejected due to score ${winnerData.score} underperforming corporate quality gate.`,
        opportunity: winnerData.opp
      };
    }
  }

  /**
   * Refreshes portfolio financial counters and growth tasks.
   */
  public performDailyMaintenance(): void {
    const store = this.dbRef.autonomousCompanyStore;
    
    // Audit revenues
    const res = this.revenueMonitor.auditPortfolioRevenue(store.portfolios, store.memories);
    this.addTickerLog("REVENUE_MONITOR", `Completed daily ledger audit. Total corporate portfolio revenue adjusted to $${res.totalRevenue}.`);

    // Check for retirement candidates
    store.portfolios.forEach((item: BusinessPortfolioItem) => {
      if (item.status === "ACTIVE") {
        const retirementCheck = this.retirementManager.inspectRetirementCandidate(item);
        if (retirementCheck.shouldArchive) {
          item.status = "ARCHIVED";
          item.health = "DECLINING";
          this.addTickerLog("RETIREMENT_MANAGER", `Permanently archived decayed business '${item.name}'. Reason: ${retirementCheck.reason}`);
        }
      }
    });
  }

  /**
   * Launches A/B experiment iterations inside the corporate engine.
   */
  public conductExperimentIteration(oppId: string): void {
    const store = this.dbRef.autonomousCompanyStore;
    this.addTickerLog("EXPERIMENT_MANAGER", `Deploying 3 automated rapid prototyping templates targeting opportunity '${oppId}'...`);
    this.addTickerLog("EXPERIMENT_MANAGER", "A/B Testing variant click rates on Etsy layout mockups. Optimal configuration will scale automatically.");
  }

  public addTickerLog(source: string, message: string) {
    const store = this.dbRef.autonomousCompanyStore;
    store.tickerLogs.unshift({
      id: `ticker_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      source,
      message
    });
    if (store.tickerLogs.length > 200) {
      store.tickerLogs = store.tickerLogs.slice(0, 200);
    }
  }
}
