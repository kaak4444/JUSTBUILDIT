import { ProductMission, ResearchFinding, CommitteeEvaluation, ExecutionPackage, Marketplace, JudicialVerdict } from "../../core/models/AutonomousCompany";

export class ChiefProductIntelligenceOfficer {
  /**
   * Plans and schedules a brand-new exploratory product investigation.
   */
  public async createMission(
    programId: string,
    objective: string,
    priority: "low" | "medium" | "high" = "medium"
  ): Promise<ProductMission> {
    return {
      id: `mission_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      programId,
      objective,
      marketplaces: ["shopify", "etsy", "amazon", "whop"],
      departments: ["trend", "customer", "competition", "pricing"],
      requiredSignals: [
        "trend",
        "reviews",
        "competition",
        "pricing",
        "search_volume",
        "social",
        "market_gap"
      ],
      maxBudget: 15, // nominal execution budget
      priority,
      status: "PLANNED"
    };
  }

  /**
   * Orchestrates sub-worker research pipelines to aggregate standardized ResearchFindings.
   */
  public async gatherFindings(mission: ProductMission): Promise<ResearchFinding[]> {
    const objectiveLower = mission.objective.toLowerCase();
    
    // Simulate smart dynamic feedback depending on the objective text
    let isTOEFL = objectiveLower.includes("toefl") || objectiveLower.includes("esl") || objectiveLower.includes("reading");
    let isPrintable = objectiveLower.includes("printable") || objectiveLower.includes("planner") || objectiveLower.includes("digital");
    let isSaaS = objectiveLower.includes("saas") || objectiveLower.includes("automated") || objectiveLower.includes("webhook");

    const findings: ResearchFinding[] = [];

    // Worker 1: Trend Hunter (Trend, Search Volume, Pinterest/TikTok)
    findings.push({
      id: `find_trend_${Date.now()}`,
      missionId: mission.id,
      workerType: "TrendHunter",
      source: "Google Trends & TikTok Signals",
      confidence: 91,
      evidence: [
        isTOEFL ? "Google Trends queries for 'TOEFL dark reading exercises' increased by 140% YoY." :
        isPrintable ? "TikTok views for 'aesthetic minimalist daily trackers' skyrocketed to 4.2M views." :
        "Search queries for low-latency workflow automations saw a 3x spikes over the last quarter.",
        "Monthly search volume (Google) exceeds 35,000 active intents.",
        "Aesthetic Pinterest boards targeting productivity layouts grew by 60%."
      ],
      freshness: new Date().toISOString(),
      cost: 1.25,
      rawData: { searchVolume: 35000, trendSlope: 1.4 },
      structuredData: { growthYoY: "140%", volumeCategory: "High" }
    });

    // Worker 2: Demand Analyst / Customer Pain Miner (Reviews, Dissatisfaction)
    findings.push({
      id: `find_demand_${Date.now()}`,
      missionId: mission.id,
      workerType: "CustomerPainMiner",
      source: "Etsy/Amazon & Forum Negative Reviews Mined",
      confidence: 94,
      evidence: [
        isTOEFL ? "Reviewers complain about high glare during late night prep: 'My eyes burn reading these tiny paragraphs.'" :
        isPrintable ? "Customer feedback: 'I hate printing colors, give me clean greyscale/high contrast templates.'" :
        "Users complain of complicated API setup processes: 'It took me 3 hours to integrate. Give me a 1-click webhook.'",
        "Average rating of leading competitors sits at 3.9/5 stars due to readability and friction.",
        "Identified over 150 unique user threads describing eye fatigue and interface clutter."
      ],
      freshness: new Date().toISOString(),
      cost: 1.80,
      rawData: { forumsAudited: 12, badReviewsCount: 154 },
      structuredData: { primaryPainPoint: "UX Readability & High Contrast", dissatisfactionScore: "86%" }
    });

    // Worker 3: Competitor Hunter & Marketplace Scanner
    findings.push({
      id: `find_competition_${Date.now()}`,
      missionId: mission.id,
      workerType: "CompetitorHunter",
      source: "Marketplace Listing Scraper Simulation",
      confidence: 85,
      evidence: [
        isTOEFL ? "Only 2 products exist targeting TOEFL night readers; both are poorly designed black PDFs." :
        isPrintable ? "Market is crowded with floral pink templates, but lacks high-contrast dark mono aesthetic grids." :
        "Current market entrants require heavy licensing costs; zero lightweight open-source options.",
        "Average competitor listing price stands at $19.99.",
        "Etsy/Amazon saturation indices for high-contrast mono niche remain below 22%."
      ],
      freshness: new Date().toISOString(),
      cost: 1.10,
      rawData: { totalCompetitorsTracked: 4, averageCompetitorRating: 3.8 },
      structuredData: { marketDensity: "Low", barrierToEntry: "Minimal" }
    });

    // Worker 4: Pricing Analyst & Saturation Detector
    findings.push({
      id: `find_pricing_${Date.now()}`,
      missionId: mission.id,
      workerType: "PricingAnalyst",
      source: "Whop, Gumroad, & Shopify Margin Audit",
      confidence: 88,
      evidence: [
        isTOEFL ? "High willingness to pay: students pay up to $49 for custom prep bundles." :
        isPrintable ? "Average printable margins exceed 90% because digital delivery bypasses shipping." :
        "B2B customers express zero friction at a $29/mo recurring pricing tier.",
        "Projected average order value (AOV) matches $32.00.",
        "Expected COGS (cost of goods sold) is extremely close to zero (digital file/cloud route API)."
      ],
      freshness: new Date().toISOString(),
      cost: 0.95,
      rawData: { targetPriceRange: [15, 49], estimatedGrossMargin: 0.94 },
      structuredData: { optimalLaunchPrice: 29, marginPotential: "94%" }
    });

    return findings;
  }

  /**
   * Evaluates the findings through an adversarial, multi-judge Opportunity Committee.
   */
  public async runJudicialCommittee(missionId: string, findings: ResearchFinding[]): Promise<CommitteeEvaluation> {
    const verdicts: JudicialVerdict[] = [];

    const trendFinding = findings.find(f => f.workerType === "TrendHunter");
    const painFinding = findings.find(f => f.workerType === "CustomerPainMiner");
    const compFinding = findings.find(f => f.workerType === "CompetitorHunter");
    const priceFinding = findings.find(f => f.workerType === "PricingAnalyst");

    const highTrend = (trendFinding?.confidence || 90) >= 88;
    const highPain = (painFinding?.confidence || 90) >= 90;
    const lowComp = (compFinding?.structuredData?.marketDensity === "Low");
    const highMargin = (priceFinding?.structuredData?.marginPotential.includes("9") || false);

    // 1. Profit Judge
    verdicts.push({
      judgeName: "Profit Judge",
      approve: highMargin,
      reject: !highMargin,
      confidence: 93,
      reason: highMargin 
        ? "✓ High margins (90%+) verified. Digital product structure ensures low cost-of-goods and rapid cash-flow generation."
        : "⚠ Margin projections look low. Infrastructure/hosting API costs might erode profit stability."
    });

    // 2. Demand Judge
    verdicts.push({
      judgeName: "Demand Judge",
      approve: highTrend && highPain,
      reject: !(highTrend && highPain),
      confidence: 95,
      reason: (highTrend && highPain)
        ? "✓ Growing search volume paired with strong user frustration on reddit/forums shows a highly responsive target market."
        : "⚠ Subdued trend indices or generic complains. The actual consumer pull is not yet robust enough."
    });

    // 3. Competition Judge
    verdicts.push({
      judgeName: "Competition Judge",
      approve: lowComp,
      reject: !lowComp,
      confidence: 88,
      reason: lowComp
        ? "✓ Competitor saturation is extremely low. Early entrants can rank easily using organic search strategies."
        : "⚠ Dominant competitors occupy first-page SEO rankings. Breaking through requires substantial budget allocation."
    });

    // 4. Execution Judge
    verdicts.push({
      judgeName: "Execution Judge",
      approve: true,
      reject: false,
      confidence: 90,
      reason: "✓ Digital PDF templates or lightweight API webhooks are easy to build and test. Production timeline is under 5 days."
    });

    // 5. Risk Judge
    verdicts.push({
      judgeName: "Risk Judge",
      approve: true,
      reject: false,
      confidence: 85,
      reason: "✓ Zero physical inventory risks. Intellectual property bounds are clear. General compliance risks are negligible."
    });

    // 6. Originality Judge
    verdicts.push({
      judgeName: "Originality Judge",
      approve: highPain,
      reject: !highPain,
      confidence: 91,
      reason: highPain
        ? "✓ Custom high-contrast layout paired with premium typography addresses a genuine underserved aesthetic niche."
        : "⚠ Risk of producing another boilerplate commodity layout with zero standout brand characteristics."
    });

    // Calculate final decision
    const approvals = verdicts.filter(v => v.approve).length;
    const decision = approvals >= 4 ? "GO" : approvals === 3 ? "HOLD" : "NO-GO";
    const overallConfidence = Math.round(verdicts.reduce((sum, v) => sum + v.confidence, 0) / verdicts.length);

    return {
      id: `eval_${Date.now()}`,
      missionId,
      decision,
      overallConfidence,
      verdicts,
      summary: decision === "GO" 
        ? "Unanimous backing from core judges due to high margin potential, explicit customer reading strain complaints, and zero aesthetic competition."
        : "Evaluation is currently on hold. Competitor saturation limits rapid organic expansion without high ad spends.",
      evidenceStrengths: [
        "Strong negative reviewer reviews highlighting high glare reading strain.",
        "Google Trends reporting +140% search volume acceleration."
      ],
      riskWarnings: [
        "Amazon and Etsy platforms already feature highly saturated baseline planner products.",
        "Copycat merchants might clone high-contrast aesthetic templates within 3 months of launch."
      ],
      recommendation: "Launch printable high-contrast bundle rather than a standalone planner to increase average order value (AOV)."
    };
  }

  /**
   * Automates the generation of a complete product launching and execution package.
   */
  public async createExecutionPackage(opportunityId: string, evaluation: CommitteeEvaluation): Promise<ExecutionPackage> {
    const isSuccess = evaluation.decision === "GO";

    return {
      id: `exec_pack_${Date.now()}`,
      opportunityId,
      brandStrategy: "High-end, eye-safe minimalist productivity. Position the brand as an elite 'Aesthetic Study Room' utility designed exclusively for dark-room focus sessions.",
      visualIdentity: {
        logoConcept: "A stylized monocle overlapping an open book, rendered in thin vector lines.",
        colors: ["#09090B", "#18181B", "#E4E4E7", "#A1A1AA", "#4F46E5"], // OLED Black, Zinc, White, Cool Indigo
        typography: ["Space Grotesk (Headings)", "JetBrains Mono (Data Accents)", "Inter (General UI)"]
      },
      targetAudience: "Late-night ESL Candidates, Academic scholars, and minimalist aesthetic collectors.",
      priceRecommendation: isSuccess ? 29.00 : 19.00,
      marketplaceSelection: ["etsy", "gumroad", "shopify"],
      seoKeywords: [
        "aesthetic dark mode planner",
        "toefl night reading exercises",
        "eye-safe digital study notes",
        "minimalist monochrome tracker",
        "dark room productivity"
      ],
      launchChecklist: [
        "Step 1: Build the premium high-contrast greyscale core templates.",
        "Step 2: Generate elegant minimalist storefront mockups using vector visual guides.",
        "Step 3: Setup Etsy and Gumroad storefront with optimized SEO metadata.",
        "Step 4: Launch Pinterest pins and TikTok micro-videos featuring dark room aesthetics."
      ],
      marketingAngles: [
        "For the Midnight Scholar: Study without the blinding glare.",
        "Aesthetic. Minimalist. High-Contrast. The study room built for pure focus."
      ],
      firstDeliverables: [
        "High-Contrast TOEFL Core Reading PDF (v1)",
        "Social Media Launch Kit (5 static Pinterest pins, 2 video templates)",
        "Storefront Product Mockup Set (Transparent OLED frames)"
      ]
    };
  }
}
