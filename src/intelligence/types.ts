/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Source {
  id: string;
  name: string;
  priority: number; // 1 to 10
  enabled: boolean;
  rateLimit: number; // requests per minute
  capabilities: string[];
}

export interface NormalizedDocument {
  id: string;
  source: string;
  url: string;
  title: string;
  author?: string;
  published?: string;
  language: string;
  plainText: string;
  markdown?: string;
  html?: string;
  images: string[];
  tables: string[];
  metadata: Record<string, any>;
}

export interface Evidence {
  id: string;
  source: string;
  url: string;
  title: string;
  content: string;
  language: string;
  chunkId?: string;
  extractedStatement?: string;
  confidence: number; // 0 to 100
  extractedAt: string;
  hash?: string;
}

export interface Problem {
  id: string;
  text: string;
  frequency: number; // Occurrences found
  severity: number; // 1 to 10
  confidence: number; // 0 to 100
  evidence: string[]; // List of Evidence IDs
}

export interface ProblemCluster {
  id: string;
  title: string;
  summary: string;
  representativeProblems: string[];
  totalMentions: number;
  averageSeverity: number;
  confidenceScore: number;
}

export interface Relationship {
  from: string;
  to: string;
  relation: string;
  confidence: number;
  evidence?: string[];
  firstSeen?: string;
  lastVerified?: string;
}

export interface Company {
  id: string;
  name: string;
  website: string;
  products: string[];
  technologies: string[];
  competitors: string[];
  pricing: string[];
  weaknesses: string[];
  strengths: string[];
}

export interface Technology {
  id: string;
  name: string;
  category: string;
  latestVersion?: string;
  documentation: string[];
  repositories: string[];
  tutorials: string[];
  alternatives: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  summary: string;
  problemClusters: string[]; // Problem Cluster IDs
  trends: string[];
  competitors: string[];
  technologies: string[];
  estimatedMargin: string;
  confidenceScore: number;
  evidenceIds: string[];

  // Repair 8 Deterministic properties
  demand?: number;       // 1-100
  competition?: number;  // 1-100
  complaints?: number;   // 1-100
  trend?: number;        // 1-100
  pricing?: number;      // 1-100
  shipping?: number;     // 1-100
  suppliers?: number;    // 1-100
  saturation?: number;   // 1-100
  confidence?: number;   // 1-100
}

export interface TrendHistoryEntry {
  date: string;
  mentions: number;
  price?: number;
  interest: number;
  ads?: number;
  reviews?: number;
}

export interface Trend {
  id: string;
  title: string;
  description: string;
  growthRate: number; // percentage change period-over-period
  volume: number;
  confidence: number;
  trendHistory?: TrendHistoryEntry[];
  velocity?: number;
  acceleration?: number;
  volatility?: number;
  seasonality?: string;
}

// v2.0 Extended Nodes
export interface Product { id: string; name: string; description: string; companyId: string }
export interface Repository { id: string; url: string; stars: number; issuesCount: number }
export interface Package { id: string; name: string; registry: string; downloadsCount: number }
export interface Video { id: string; title: string; url: string; views: number }
export interface Tutorial { id: string; title: string; url: string; author: string }
export interface DesignSystem { id: string; name: string; guidelinesUrl: string }
export interface Community { id: string; name: string; size: number; platform: string }
export interface Course { id: string; name: string; price: string; link: string }
export interface Book { id: string; title: string; authors: string[]; isbn?: string }
export interface Patent { id: string; number: string; title: string; abstractText: string }
export interface Law { id: string; title: string; jurisdiction: string; complianceImpact: string }
export interface Country { id: string; name: string; code: string; complianceRegime?: string }
export interface Person { id: string; name: string; role: string; bio?: string }
export interface Author { id: string; name: string; citations: number }
export interface Standard { id: string; name: string; organization: string }
export interface Framework { id: string; name: string; language: string }
export interface Library { id: string; name: string; packageReference?: string }
export interface Marketplace { id: string; name: string; url: string }
export interface PricingPlan { id: string; name: string; priceMonthly: number; currency: string }
export interface Subscription { id: string; name: string; details: string }
export interface Feature { id: string; name: string; description: string; productOwner: string }
export interface Review { id: string; author: string; score: number; text: string; source: string }

export interface WorldGraph {
  companies: Map<string, Company>;
  technologies: Map<string, Technology>;
  problems: Map<string, Problem>;
  problemClusters: Map<string, ProblemCluster>;
  trends: Map<string, Trend>;
  evidence: Map<string, Evidence>;
  relationships: Relationship[];
  opportunities: Map<string, Opportunity>;

  // v2.0 Extended Nodes Maps
  products: Map<string, Product>;
  repositories: Map<string, Repository>;
  packages: Map<string, Package>;
  videos: Map<string, Video>;
  tutorials: Map<string, Tutorial>;
  designSystems: Map<string, DesignSystem>;
  communities: Map<string, Community>;
  courses: Map<string, Course>;
  books: Map<string, Book>;
  patents: Map<string, Patent>;
  laws: Map<string, Law>;
  countries: Map<string, Country>;
  people: Map<string, Person>;
  authors: Map<string, Author>;
  standards: Map<string, Standard>;
  frameworks: Map<string, Framework>;
  libraries: Map<string, Library>;
  marketplaces: Map<string, Marketplace>;
  pricingPlans: Map<string, PricingPlan>;
  subscriptions: Map<string, Subscription>;
  features: Map<string, Feature>;
  reviews: Map<string, Review>;
}

export interface KnowledgeAcquisitionTask {
  id: string;
  topic: string;
  missingSkillId?: string;
  unfamiliarTechnology?: string;
  targetCompetitor?: string;
  status: "PENDING" | "ACQUIRING" | "COMPLETED";
  createdAt: string;
}

export interface Concept {
  name: string;
  definition: string;
}

export interface Rule {
  name: string;
  constraint: string;
  remedy?: string;
}

export interface Workflow {
  name: string;
  steps: string[];
}

export interface Template {
  name: string;
  boilerplate: string;
}

export interface Example {
  title: string;
  code: string;
}

export interface SkillPackage {
  id: string;
  name: string;
  concepts: Concept[];
  bestPractices: Rule[];
  commonErrors: Rule[];
  workflows: Workflow[];
  templates: Template[];
  codeExamples: Example[];
  evaluationRules: Rule[];
  sources: Evidence[];
}
