/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Audience {
  demographics: string;
  interests: string[];
  painPoints: string[];
}

export interface PainPoint {
  id: string;
  description: string;
  severity: "low" | "medium" | "high";
  context: string;
}

export interface Competitor {
  name: string;
  price: number;
  weaknesses: string[];
  strengths: string[];
}

export interface Opportunity {
  id: string;
  description: string;
  valueScore: number;
}

export interface Positioning {
  tagline: string;
  uniqueSellingProposition: string;
  toneOfVoice: string[];
}

export interface Monetization {
  strategy: string;
  pricingModels: Array<{ type: string; price: number }>;
}

export interface VisualLanguage {
  primaryColor: string;
  secondaryColor: string;
  typography: {
    heading: string;
    body: string;
  };
  borderRadius: string;
  spacingUnit: number;
}

export interface PublishingTarget {
  platform: string;
  targetAudience: string;
  format: string;
}

export interface ProductBlueprint {
  id: string;
  objective: string;
  audience: Audience;
  painPoints: PainPoint[];
  competitors: Competitor[];
  opportunities: Opportunity[];
  positioning: Positioning;
  monetization: Monetization;
  visualLanguage: VisualLanguage;
  platforms: PublishingTarget[];
}
