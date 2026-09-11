import { Opportunity } from "../../core/models/AutonomousCompany";

export interface ScoreBreakdown {
  marketGap: number;
  competition: number;
  designPotential: number;
  productionCost: number;
  automationPotential: number;
  recurringRevenue: number;
  virality: number;
  SEO: number;
  socialPotential: number;
  repeatPurchase: number;
  crossSell: number;
  brandability: number;
  reviewPain: number;
  margin: number;
  marketGrowth: number;
  totalScore: number;
}

export class BusinessJudge {
  /**
   * Performs an algorithmic multi-criteria evaluation of an opportunity.
   */
  public evaluateOpportunity(opp: Opportunity): { score: number; breakdown: ScoreBreakdown; recommended: boolean } {
    const isTOEFL = opp.title.toLowerCase().includes("toefl") || opp.title.toLowerCase().includes("academic");
    const isCustoms = opp.title.toLowerCase().includes("customs") || opp.title.toLowerCase().includes("webhook");
    const isPrintable = opp.title.toLowerCase().includes("printable") || opp.title.toLowerCase().includes("planner");

    // Dynamic factors based on type
    const factors = {
      marketGap: isTOEFL ? 95 : isPrintable ? 90 : isCustoms ? 85 : 80,
      competition: opp.competition < 40 ? 92 : opp.competition < 60 ? 85 : 70, // lower competition is better
      designPotential: isPrintable ? 98 : isTOEFL ? 92 : 75,
      productionCost: isPrintable ? 95 : isTOEFL ? 88 : 80, // digital is cheap
      automationPotential: isCustoms ? 95 : isPrintable ? 90 : 85,
      recurringRevenue: isCustoms ? 90 : isTOEFL ? 75 : 55, // software has higher recurring potential
      virality: isPrintable ? 88 : isTOEFL ? 70 : 60,
      SEO: isPrintable ? 92 : isTOEFL ? 86 : 80,
      socialPotential: isPrintable ? 94 : isTOEFL ? 80 : 50,
      repeatPurchase: isPrintable ? 85 : isTOEFL ? 65 : 80,
      crossSell: isTOEFL ? 90 : isPrintable ? 92 : 75,
      brandability: isTOEFL ? 94 : isPrintable ? 95 : 82,
      reviewPain: isTOEFL ? 92 : isPrintable ? 88 : 80, // solving pain counts higher
      margin: isPrintable ? 96 : isTOEFL ? 92 : 88,
      marketGrowth: isTOEFL ? 90 : isCustoms ? 95 : 86
    };

    // Calculate weighted or straight average
    const totalSum = Object.values(factors).reduce((sum, val) => sum + val, 0);
    const averageScore = Math.round((totalSum / Object.keys(factors).length) * 10) / 10;

    const breakdown: ScoreBreakdown = {
      ...factors,
      totalScore: averageScore
    };

    return {
      score: averageScore,
      breakdown,
      recommended: averageScore >= 85
    };
  }
}
