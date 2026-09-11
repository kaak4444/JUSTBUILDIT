import { Opportunity, BusinessPortfolioItem, CorporateGrowthTask, BusinessMemoryEntry } from "../../core/models/AutonomousCompany";

export class MarketMonitor {
  /**
   * Periodically checks if trend lines or competition ratios have shifted.
   */
  public verifyMarketShift(opp: Opportunity): { shifted: boolean; trendChange: number; reason: string } {
    const change = Math.round(-5 + Math.random() * 15);
    const shifted = Math.abs(change) >= 8;
    return {
      shifted,
      trendChange: change,
      reason: change > 0 
        ? `Inflow of brand-new searches detected for '${opp.title}' on TikTok/Pinterest.` 
        : `Slight stabilization of search index volumes.`
    };
  }
}

export class LaunchManager {
  /**
   * Provisions a brand-new corporate initiative in the system portfolio.
   */
  public launchBusiness(opp: Opportunity, targetPrice: number): { item: BusinessPortfolioItem; memory: BusinessMemoryEntry } {
    const cleanName = opp.title.replace("Aesthetic ", "").replace("Minimalist ", "");
    
    const item: BusinessPortfolioItem = {
      id: `biz_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      opportunityId: opp.id,
      name: `JustBuildIt ${cleanName}`,
      category: opp.category,
      revenue: Math.round(opp.estimatedRevenue * 0.15), // initial starting revenue simulated
      growth: Math.round(5 + Math.random() * 25),
      health: "EXCELLENT",
      status: "ACTIVE",
      workersCount: 4,
      assetsCount: 12,
      knowledgeCount: 8,
      createdAt: new Date().toISOString()
    };

    // Initialize the isolated business memory sandbox
    const memory: BusinessMemoryEntry = {
      businessId: item.id,
      customers: ["study_bunny_99@etsy.com", "minimalist_coder@gumroad.com", "academic_night_owl@whop.com"],
      reviews: [
        "Absolutely love the deep contrast. Truly eye-safe!",
        "Saved so much laser black ink. Beautifully simple formatting."
      ],
      assets: ["OLED_TOEFL_E_Reader_v1.pdf", "Logo_Vector_Open_Book.svg", "Pinterest_Launch_Pin_1.png"],
      templates: ["Monochrome_Grid_A4_v1.json", "High_Contrast_Style_Sheet.css"],
      research: [
        "Mined 140 glare complaints across Reddit r/TOEFL.",
        "Verified zero design competitors on Etsy offering Monochrome laser saver formats."
      ],
      competitors: ["BlindingPrep Corp ($49/mo)", "FloralPlanners Etsy ($12)"],
      marketing: ["TikTok study-vlog aesthetic pins", "Pinterest midnight scholar pins"],
      brand: `Elite high-contrast OLED-native study and productivity tools. Typography paired for Space Grotesk and JetBrains Mono.`,
      products: [item.name],
      analytics: {
        sales: [120, 150, 180, 240, 310, 420, 510], // historical simulated sales
        traffic: [1200, 1400, 1550, 1800, 2100, 2900, 3400],
        ctr: 3.4,
        downloads: 512,
        favorites: 89
      }
    };

    return { item, memory };
  }
}

export class RevenueMonitor {
  /**
   * Refreshes the daily metrics for the portfolio.
   */
  public auditPortfolioRevenue(items: BusinessPortfolioItem[], memories: Record<string, BusinessMemoryEntry>): { totalRevenue: number; avgGrowth: number } {
    let totalRevenue = 0;
    let growthSum = 0;

    items.forEach(item => {
      const mem = memories[item.id];
      if (item.status === "ACTIVE") {
        // Daily incremental fluctuation of sales
        const fluctuation = Math.round(-150 + Math.random() * 450);
        item.revenue = Math.max(500, item.revenue + fluctuation);
        
        // Simulating analytics additions
        if (mem && mem.analytics) {
          mem.analytics.sales.push(Math.round(fluctuation > 0 ? fluctuation / 10 : 0));
          if (mem.analytics.sales.length > 30) mem.analytics.sales.shift();
          
          mem.analytics.traffic.push(Math.round(50 + Math.random() * 100));
          if (mem.analytics.traffic.length > 30) mem.analytics.traffic.shift();
        }

        totalRevenue += item.revenue;
        growthSum += item.growth;
      }
    });

    return {
      totalRevenue,
      avgGrowth: items.length > 0 ? Math.round(growthSum / items.length) : 0
    };
  }
}

export class GrowthManager {
  /**
   * Automatically schedules brand-level optimization initiatives inside active businesses.
   */
  public proposeGrowthTask(item: BusinessPortfolioItem): CorporateGrowthTask {
    const tasks: Array<{ title: string; category: "PRICING" | "SEO" | "BUNDLE" | "CREATIVE_REFRESH"; desc: string; impact: string }> = [
      {
        title: "Deploy 15% Price Increment Trial",
        category: "PRICING",
        desc: "Capitalize on high reported customer sentiment. Raise standard licensing fee from $29 to $34 with active monitoring.",
        impact: "+15% Monthly Cash-Flow Index"
      },
      {
        title: "Inject High-Volume SEO Longtail Tags",
        category: "SEO",
        desc: "Optimize metadata descriptions with 'dark academic planner' and 'ink saver monochrome layout'.",
        impact: "+25% Organic Search Visibility"
      },
      {
        title: "Bundle Core Product into Printable Suite",
        category: "BUNDLE",
        desc: "Merge reading templates with the companion midnight mock exam sheet to increase Average Order Value (AOV).",
        impact: "+35% Order Basket Size Boost"
      },
      {
        title: "Creative Refresh of Pinterest Banner Mockups",
        category: "CREATIVE_REFRESH",
        desc: "Regenerate high-contrast OLED frame mockups to reflect refined branding guidelines.",
        impact: "+12% CTR CTR Acceleration"
      }
    ];

    const chosen = tasks[Math.floor(Math.random() * tasks.length)];

    return {
      id: `growth_task_${Date.now()}`,
      businessId: item.id,
      title: chosen.title,
      category: chosen.category,
      description: chosen.desc,
      status: "PENDING",
      estimatedImpact: chosen.impact
    };
  }
}

export class RetirementManager {
  /**
   * Flags businesses demonstrating prolonged revenue and growth decay.
   */
  public inspectRetirementCandidate(item: BusinessPortfolioItem): { shouldArchive: boolean; reason: string } {
    if (item.growth < -10 || item.revenue < 100) {
      return {
        shouldArchive: true,
        reason: `Monthly growth rate (${item.growth}%) and active revenue ($${item.revenue}) fall below sustainable thresholds.`
      };
    }
    return {
      shouldArchive: false,
      reason: `Business health remains stable (${item.health}). Maintain active operations.`
    };
  }
}
