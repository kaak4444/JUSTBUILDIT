/* ==========================================================
   JUSTBUILDIT
   RESEARCH ENGINE

   Everything that enters the organization is Evidence.
   Workers NEVER use raw web pages.
   They only consume normalized Evidence.
========================================================== */

export enum SourceType {
    GOOGLE_TRENDS = "google_trends",
    REDDIT = "reddit",
    YOUTUBE = "youtube",
    TIKTOK = "tiktok",
    META_ADS = "meta_ads",
    SHOPIFY = "shopify",
    WHOP = "whop",
    ETSY = "etsy",
    AMAZON = "amazon",
    GITHUB = "github",
    PRODUCT_HUNT = "product_hunt",
    HACKERNEWS = "hackernews",
    TRUSTPILOT = "trustpilot",
    G2 = "g2",
    APPSTORE = "appstore",
    PLAYSTORE = "playstore",
    CUSTOM = "custom"
}

export interface Evidence {
    id: string;
    source: SourceType;
    title: string;
    url: string;
    collectedAt: number;
    category: string;
    confidence: number;
    raw: any;
    extracted: ExtractedKnowledge;
}

export interface ExtractedKnowledge {
    summary: string;
    problems: string[];
    solutions: string[];
    audiences: string[];
    businessModels: string[];
    monetization: string[];
    pricing: number[];
    recurringPatterns: string[];
    technologies: string[];
    competitors: string[];
    keywords: string[];
    tags: string[];
    claims?: ConsensusClaim[];
}

export interface ProviderMetadata {
    authority: number; // 1-100
    freshness: number; // 1-100
    latency: number;   // ms
    cost: number;      // abstract tokens/credits cost
    reliability: number; // 1-100
    rateLimitRemaining?: number;
}

export interface ConsensusClaim {
    claimText: string;
    value?: string | number;
    evidenceIds: string[];
    confidence: number;
    sourcesCount: number;
    status: "verified" | "disputed" | "unverified";
}

export interface TemporalTrend {
    label: string;
    velocity: number;     // -100 to 100
    acceleration: number; // -100 to 100
    decay: number;        // decay rate (e.g. half-life in days)
    seasonality: string;  // e.g. "Q4 heavy", "None"
    momentumScore: number; // calculated composite score
}

export interface CompanyDNA {
    name: string;
    mission: string;
    estimatedRevenue: string;
    products: string[];
    targetCustomers: string[];
    funnelDescription: string;
    pricingStrategy: string;
    landingPageStructure: string[];
    trafficSources: string[];
    technologies: string[];
    automationsUsed: string[];
    growthMechanisms: string[];
    contentStrategy: string;
    retentionTactics: string[];
}

export interface ProductDNA {
    coreProblem: string;
    audienceSegment: string;
    transformationOutcome: string;
    deliverableAssets: string[];
    pricingTiers: { tier: string; price: number; features: string[] }[];
    marketingHooks: string[];
}

export interface DesignDNA {
    primaryFont: string;
    secondaryFont: string;
    colorPalette: string[];
    layoutGrid: string;
    spacingSystem: string;
    componentsReused: string[];
    animationsStyle: string;
    buttonStyling: string;
    heroStructure: string;
}

export interface MarketingDNA {
    funnelStages: { stage: string; assets: string[]; conversionHook: string }[];
    adHooks: string[];
    distributionChannels: string[];
    affiliateProgramDetails: string;
}

export interface AutomationDNA {
    trigger: string;
    condition: string;
    actions: string[];
    integrations: string[];
}

export interface ReconstructedBusiness {
    company: CompanyDNA;
    product: ProductDNA;
    design: DesignDNA;
    marketing: MarketingDNA;
    automations: AutomationDNA[];
    temporalTrends: TemporalTrend[];
}

