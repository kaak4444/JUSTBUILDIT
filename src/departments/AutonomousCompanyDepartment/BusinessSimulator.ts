import { ROIPrediction, Opportunity } from "../../core/models/AutonomousCompany";

export class BusinessSimulator {
  /**
   * Generates a comprehensive ROI simulation forecast for a potential digital business.
   */
  public simulateBusiness(opp: Opportunity, targetPrice: number = 29): ROIPrediction {
    const isSaaS = opp.category.toLowerCase().includes("software") || opp.category.toLowerCase().includes("webhook");
    const isPrintable = opp.category.toLowerCase().includes("printable") || opp.category.toLowerCase().includes("planner");

    // Baseline assumptions
    const organicTraffic = isPrintable ? 15000 : isSaaS ? 8000 : 12000;
    const conversionRate = isPrintable ? 2.8 : isSaaS ? 1.5 : 2.1; // SaaS converts slightly lower, printables higher
    const adsCost = isPrintable ? 350 : isSaaS ? 850 : 600;
    const seoValue = isPrintable ? 800 : isSaaS ? 500 : 650;
    const grossMargin = isPrintable ? 98 : isSaaS ? 85 : 92; // printables have almost zero delivery costs
    const productionTimeDays = isPrintable ? 4 : isSaaS ? 10 : 6;
    const supportLoad = isSaaS ? "HIGH" : isPrintable ? "LOW" : "MEDIUM";

    // Formulas
    const monthlyUnits = Math.round((organicTraffic * (conversionRate / 100)));
    const monthlyRevenue = Math.round(monthlyUnits * targetPrice);
    const costOfGoods = Math.round(monthlyRevenue * ((100 - grossMargin) / 100));
    const monthlyProfit = Math.max(0, monthlyRevenue - costOfGoods - adsCost + seoValue);

    // ROI formulas
    const totalSetupCost = productionTimeDays * 120 + adsCost; // nominal setup cost based on production days
    const roiPercentage = monthlyProfit > 0 ? Math.round((monthlyProfit / totalSetupCost) * 100) : 0;
    const timeToBreakEvenDays = monthlyProfit > 0 ? Math.round((totalSetupCost / (monthlyProfit / 30))) : 90;

    return {
      traffic: organicTraffic,
      conversionRate,
      price: targetPrice,
      grossMargin,
      adsCost,
      seoValue,
      productionTimeDays,
      supportLoad: supportLoad as "LOW" | "MEDIUM" | "HIGH",
      monthlyRevenue,
      monthlyProfit,
      roiPercentage,
      timeToBreakEvenDays
    };
  }
}
