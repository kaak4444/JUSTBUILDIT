export interface Program {
  id: string;
  name: string;
  description: string;
  goalId: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
}

export type Marketplace = "shopify" | "etsy" | "amazon" | "whop" | "gumroad";

export interface ProductMission {
  id: string;
  programId: string;
  objective: string;
  marketplaces: Marketplace[];
  departments: string[];
  requiredSignals: string[];
  maxBudget: number;
  priority: "low" | "medium" | "high";
  deadline?: string;
  status: "PLANNED" | "INVESTIGATING" | "EVALUATED" | "ARCHIVED";
}

export interface ResearchFinding {
  id: string;
  missionId: string;
  workerType: string;
  source: string;
  confidence: number; // 0-100
  evidence: string[];
  freshness: string;
  cost: number;
  rawData: any;
  structuredData: any;
}

export interface JudicialVerdict {
  judgeName: string;
  approve: boolean;
  reject: boolean;
  confidence: number; // 0-100
  reason: string;
}

export interface CommitteeEvaluation {
  id: string;
  missionId: string;
  decision: "GO" | "NO-GO" | "HOLD";
  overallConfidence: number;
  verdicts: JudicialVerdict[];
  summary: string;
  evidenceStrengths: string[];
  riskWarnings: string[];
  recommendation: string;
}

export interface ExecutionPackage {
  id: string;
  opportunityId: string;
  brandStrategy: string;
  visualIdentity: {
    logoConcept: string;
    colors: string[];
    typography: string[];
  };
  targetAudience: string;
  priceRecommendation: number;
  marketplaceSelection: Marketplace[];
  seoKeywords: string[];
  launchChecklist: string[];
  marketingAngles: string[];
  firstDeliverables: string[];
}

export interface Signal {
  type: string;
  source: string;
  strength: number;
  detail: string;
}

export interface Opportunity {
  id: string;
  title: string;
  category: string;
  problem: string;
  audience: string;
  confidence: number;
  estimatedRevenue: number;
  competition: number; // 0-100
  difficulty: number; // 0-100
  signals: Signal[];
  timestamp: string;
  status: "DISCOVERED" | "SIMULATING" | "LAUNCHED" | "ARCHIVED";
}

export interface ROIPrediction {
  traffic: number;
  conversionRate: number; // percentage
  price: number;
  grossMargin: number; // percentage
  adsCost: number;
  seoValue: number;
  productionTimeDays: number;
  supportLoad: "LOW" | "MEDIUM" | "HIGH";
  monthlyRevenue: number;
  monthlyProfit: number;
  roiPercentage: number;
  timeToBreakEvenDays: number;
}

export interface BusinessPortfolioItem {
  id: string;
  opportunityId: string;
  name: string;
  category: string;
  revenue: number;
  growth: number; // percentage
  health: "EXCELLENT" | "STABLE" | "DECLINING";
  status: "ACTIVE" | "ARCHIVED";
  workersCount: number;
  assetsCount: number;
  knowledgeCount: number;
  createdAt: string;
}

export interface BusinessMemoryEntry {
  businessId: string;
  customers: string[];
  reviews: string[];
  assets: string[];
  templates: string[];
  research: string[];
  competitors: string[];
  marketing: string[];
  brand: string;
  products: string[];
  analytics: {
    sales: number[];
    traffic: number[];
    ctr: number;
    downloads: number;
    favorites: number;
  };
}

export interface CorporateGrowthTask {
  id: string;
  businessId: string;
  title: string;
  category: "PRICING" | "SEO" | "BUNDLE" | "CREATIVE_REFRESH";
  description: string;
  status: "PENDING" | "RUNNING" | "COMPLETED";
  estimatedImpact: string;
}
