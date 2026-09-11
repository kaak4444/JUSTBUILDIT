/* ==========================================================
   JUSTBUILDIT - RESEARCH CORE V3
   COLLECTOR LAYER MODULE
   ========================================================== */

import { RawDocument } from "../core/types";

export interface Collector {
    sourceId: string;
    collect(keywordQuery: string): Promise<RawDocument[]>;
}

export class GithubCollector implements Collector {
    sourceId = "github";
    async collect(keywordQuery: string): Promise<RawDocument[]> {
        console.log(`[GithubCollector] Running collection scan for: "${keywordQuery}"`);
        // Simulate pulling latest repos, issues, readmes matching the query
        return [
            {
                id: `raw_gh_${Date.now()}_1`,
                source: this.sourceId,
                url: `https://github.com/search?q=${encodeURIComponent(keywordQuery)}`,
                markdown: `# Awesome ${keywordQuery} Open Source List
- Built in TypeScript, highly optimized.
- Active Community: 12.5k Stars, 1.4k Forks.
- Standard installation uses structured named imports.`,
                metadata: { stars: 12500, language: "TypeScript" },
                collectedAt: Date.now()
            },
            {
                id: `raw_gh_${Date.now()}_2`,
                source: this.sourceId,
                url: `https://github.com/justbuildit/engine-sandbox`,
                markdown: `## Engine Sandbox Readme
Provides deterministic scheduling constraints for executing parallel workflows. Uses standard modular layout.`,
                metadata: { stars: 320, language: "TypeScript" },
                collectedAt: Date.now()
            }
        ];
    }
}

export class RedditCollector implements Collector {
    sourceId = "reddit";
    async collect(keywordQuery: string): Promise<RawDocument[]> {
        console.log(`[RedditCollector] Harvesting Reddit threads for: "${keywordQuery}"`);
        return [
            {
                id: `raw_red_${Date.now()}_1`,
                source: this.sourceId,
                url: `https://reddit.com/r/saas/comments/test1`,
                markdown: `### Absolutely hate the flashing purple gradients
"Why does every single SaaS website use the exact same template? It's so blinding! I prefer a clean dark mode, or slate-colored flat background with crisp fonts like Space Grotesk."`,
                metadata: { upvotes: 142, subreddit: "saas" },
                collectedAt: Date.now()
            },
            {
                id: `raw_red_${Date.now()}_2`,
                source: this.sourceId,
                url: `https://reddit.com/r/nocode/comments/test2`,
                markdown: `### Whop and Shopify are fine, but pricing is too steep
"They charge high fees on creator tools. Whop has 500,000 creators, but the fee structure is complex. Shopify is robust but expensive."`,
                metadata: { upvotes: 89, subreddit: "nocode" },
                collectedAt: Date.now()
            }
        ];
    }
}

export class WhopCollector implements Collector {
    sourceId = "whop";
    async collect(keywordQuery: string): Promise<RawDocument[]> {
        console.log(`[WhopCollector] Collecting whop digital store data for: "${keywordQuery}"`);
        return [
            {
                id: `raw_whop_${Date.now()}_1`,
                source: this.sourceId,
                url: `https://whop.com/marketplace/${encodeURIComponent(keywordQuery)}`,
                json: {
                    storeName: `${keywordQuery} Academy`,
                    pricingPlan: "$29.99/month",
                    creatorCount: 500000,
                    reviewRating: 4.8,
                    description: "Premium digital resources and community access for modern creators."
                },
                metadata: { category: "Digital Courses" },
                collectedAt: Date.now()
            }
        ];
    }
}

export class ShopifyCollector implements Collector {
    sourceId = "shopify";
    async collect(keywordQuery: string): Promise<RawDocument[]> {
        console.log(`[ShopifyCollector] Collecting shopify store templates for: "${keywordQuery}"`);
        return [
            {
                id: `raw_shopify_${Date.now()}_1`,
                source: this.sourceId,
                url: `https://shopify.com/stores/${encodeURIComponent(keywordQuery)}`,
                json: {
                    pricing: "$39/month starter",
                    features: ["Checkout validation", "Address autocomplete", "Stripe payment gateway"]
                },
                metadata: { category: "E-Commerce" },
                collectedAt: Date.now()
            }
        ];
    }
}

export class TrustpilotCollector implements Collector {
    sourceId = "trustpilot";
    async collect(keywordQuery: string): Promise<RawDocument[]> {
        console.log(`[TrustpilotCollector] Extracting customer reviews for: "${keywordQuery}"`);
        return [
            {
                id: `raw_tp_${Date.now()}_1`,
                source: this.sourceId,
                url: `https://trustpilot.com/review/${encodeURIComponent(keywordQuery)}`,
                markdown: `### Excellent customer care but bad onboarding layout
"The product is stellar. However, navigating the landing page on smaller resolutions was extremely frustrating. Spacing felt cluttered."`,
                metadata: { rating: 3, company: keywordQuery },
                collectedAt: Date.now()
            }
        ];
    }
}

export class ProductHuntCollector implements Collector {
    sourceId = "product_hunt";
    async collect(keywordQuery: string): Promise<RawDocument[]> {
        console.log(`[ProductHuntCollector] Grabbing tech launching details for: "${keywordQuery}"`);
        return [
            {
                id: `raw_ph_${Date.now()}_1`,
                source: this.sourceId,
                url: `https://producthunt.com/posts/${encodeURIComponent(keywordQuery)}`,
                markdown: `### Just launched: ${keywordQuery} OS!
"A lightweight operating system built with React, styled entirely with Tailwind, featuring Space Grotesk display fonts and Inter for general layout elements."`,
                metadata: { upvotes: 412, commentsCount: 65 },
                collectedAt: Date.now()
            }
        ];
    }
}

// Master registry mapping platforms to their collectors
export class CollectorRegistryV3 {
    private static collectors: Map<string, Collector> = new Map([
        ["github", new GithubCollector()],
        ["reddit", new RedditCollector()],
        ["whop", new WhopCollector()],
        ["shopify", new ShopifyCollector()],
        ["trustpilot", new TrustpilotCollector()],
        ["product_hunt", new ProductHuntCollector()]
    ]);

    static getCollector(source: string): Collector | undefined {
        return this.collectors.get(source.toLowerCase());
    }

    static getAllCollectors(): Collector[] {
        return Array.from(this.collectors.values());
    }
}
