import { Evidence } from "./types";

export interface ResearchProvider {
    id: string;
    name: string;
    priority: number;
    enabled: boolean;
    supports(query: ResearchQuery): boolean;
    search(query: ResearchQuery): Promise<Evidence[]>;
}

export interface ResearchQuery {
    objective: string;
    category: string;
    keywords: string[];
    constraints: string[];
    maxResults: number;
}

export interface ResearchAnalyzer {
    analyze(evidence: Evidence[]): Promise<ResearchKnowledge>;
}

export interface MarketProblem {
    problem: string;
    frequency: number; // 1 to 100
    severity: number;  // 1 to 100
    evidenceIds: string[];
}

export interface MarketOpportunity {
    title: string;
    description: string;
    score: number;       // 1 to 100
    confidence: number;  // 1 to 100
    evidenceIds: string[];
    implementationIdeas: string[];
}

export interface Competitor {
    name: string;
    url: string;
    technologies: string[];
    pricing: number[];
    strengths: string[];
    weaknesses: string[];
}

export interface Audience {
    name: string;
    painPoints: string[];
    willingnessToPay: "high" | "medium" | "low";
}

export interface ResearchKnowledge {
    problems: MarketProblem[];
    opportunities: MarketOpportunity[];
    competitors: Competitor[];
    audience: Audience[];
    recommendations: string[];
}
