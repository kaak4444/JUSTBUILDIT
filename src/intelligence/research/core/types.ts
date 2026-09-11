/* ==========================================================
   JUSTBUILDIT - RESEARCH CORE V3
   CORE TYPES & DATA STRUCTURES
   ========================================================== */

export interface ResearchMission {
    id: string;
    title: string;
    objective: string;
    requiredKnowledge: string[];
    requiredSources: string[];
    priority: number; // 1-10
    confidenceGoal: number; // 0-100
    children: string[]; // dependent mission IDs
    status: "pending" | "running" | "completed" | "failed";
    durationMs?: number;
    error?: string;
}

export interface RawDocument {
    id: string;
    source: string;
    url: string;
    html?: string;
    markdown?: string;
    json?: any;
    screenshot?: string;
    metadata: Record<string, any>;
    collectedAt: number;
}

export interface NormalizedDocument {
    id: string;
    rawDocumentId: string;
    source: string;
    url: string;
    title: string;
    cleanedContent: string;
    language: string;
    boilerplateRemoved: boolean;
    duplicateHash: string;
    isCanonical: boolean;
    metadata: {
        author?: string;
        datePublished?: string;
        readingTimeMinutes?: number;
        sentimentScore?: number; // -1 to 1
    };
    processedAt: number;
}

export interface Entity {
    id: string;
    name: string;
    type: "Company" | "Person" | "Product" | "Technology" | "Skill" | "Community" | "Country" | "Platform" | "Framework" | "Creator" | "Pricing" | "Location" | "Metric";
    mentionsCount: number;
    confidence: number;
    metadata: Record<string, any>;
}

export interface Claim {
    id: string;
    entityId?: string;
    type: "Revenue" | "Users" | "Pricing" | "Growth" | "Complaint" | "TechStack" | "Feature" | "LaunchDate";
    statement: string;
    value: string | number;
    unit: string;
    confidence: number;
    sourceUrl: string;
    sourceName: string;
    rawEvidenceSnippet: string;
}

export interface VerifiedFact {
    id: string;
    claimStatement: string;
    type: string;
    consensusValue: string | number;
    unit: string;
    supportingClaimIds: string[];
    contradictingClaimIds: string[];
    confidenceScore: number; // calculated from supporting vs contradicting
    status: "verified" | "disputed" | "unverified";
    lastVerifiedAt: string;
}

export interface GraphNode {
    id: string;
    label: string;
    type: string; // e.g. "Company", "Technology", "Problem", "Trend"
    properties: Record<string, any>;
}

export interface GraphEdge {
    id: string;
    source: string;
    target: string;
    relation: string; // e.g. "USES", "TARGETS", "COMPETES_WITH", "INTEGRATES"
    properties: Record<string, any>;
}

export interface KnowledgeGraph {
    nodes: Map<string, GraphNode>;
    edges: Map<string, GraphEdge>;
}

export interface DiscoveredPattern {
    id: string;
    title: string;
    description: string;
    category: "Business" | "Design" | "Marketing" | "Architecture";
    supportCount: number;
    evidenceNodeIds: string[];
    explanation: string;
    actionabilityStatement: string;
}

export interface CompanyDNA {
    name: string;
    mission: string;
    audience: string[];
    problems: string[];
    products: string[];
    pricing: string;
    trafficSources: string[];
    funnelDescription: string;
    designPhilosophy: string;
    marketingChannels: string[];
    techStack: string[];
    automationWorkflow: string[];
    competitors: string[];
    strengths: string[];
    weaknesses: string[];
}

export interface ProductDNA {
    id: string;
    name: string;
    problemSolved: string;
    transformationOutcome: string;
    targetAudience: string;
    pricingTiers: Array<{ name: string; price: number; interval: string }>;
    coreFeatures: string[];
    marketingHooks: string[];
    distributionLifecyle: string;
}

export interface DesignDNA {
    typography: { headings: string; body: string };
    colors: string[];
    spacingLayout: string;
    reusableComponents: string[];
    animationsStyle: string;
    brandPersonality: string;
    interactionsIndex: number;
}

export interface MarketingDNA {
    trafficSources: string[];
    adHooks: string[];
    contentStrategy: string;
    affiliatePrograms: boolean;
    distributionChannels: string[];
    funnelStages: string[];
}

export interface OpportunityScore {
    need: number;        // 1-100
    demand: number;      // 1-100
    competition: number; // 1-100 (inverse: high score is low competition)
    execution: number;   // 1-100
    margin: number;      // 1-100
    scalability: number; // 1-100
    novelty: number;     // 1-100
    timing: number;      // 1-100
    audiencePain: number;// 1-100
    overall: number;     // 1-100 calculated weighted average
}

export interface OrganizationalMemoryEntry {
    missionId: string;
    objective: string;
    sourcesUsed: string[];
    durationMs: number;
    costTokens: number;
    accuracyScore: number; // 1-100
    successfulQueries: string[];
    failures: string[];
}
