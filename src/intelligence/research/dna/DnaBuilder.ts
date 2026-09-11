/* ==========================================================
   JUSTBUILDIT - RESEARCH CORE V3
   COMPANY & DIGITAL PRODUCT DNA RECONSTRUCTION BUILDER
   ========================================================== */

import { CompanyDNA, ProductDNA, DesignDNA, MarketingDNA, VerifiedFact, DiscoveredPattern } from "../core/types";

export class DnaBuilderV3 {
    /**
     * Synthesizes raw extracted facts and patterns into a complete Company and Product DNA architecture
     */
    static reconstructCompany(
        objective: string, 
        facts: VerifiedFact[], 
        patterns: DiscoveredPattern[]
    ): CompanyDNA {
        console.log(`[DnaBuilderV3] Reconstructing complete Company DNA blueprint for objective: "${objective}"`);

        const audienceFacts = facts.filter(f => f.type === "Users").map(f => String(f.claimStatement));
        const pricingFacts = facts.filter(f => f.type === "Pricing").map(f => String(f.consensusValue) + " " + String(f.unit));
        const designPatterns = patterns.filter(p => p.category === "Design").map(p => p.title);
        const techFacts = facts.filter(f => f.type === "TechStack").map(f => String(f.consensusValue));

        // Assemble clean, solid Company DNA
        return {
            name: `${objective.replace(/[^a-zA-Z0-9 ]/g, "")} Inc.`,
            mission: `To democratize access to enterprise-grade solutions for ${objective.toLowerCase()} through lightweight, transparent, and modular software utilities.`,
            audience: audienceFacts.length > 0 ? audienceFacts : ["Digital creators", "Nocode builders", "TypeScript developers"],
            problems: [
                "Cluttered UI layouts with flash, blinding gradients",
                "High commission structures on transactional creator platforms",
                "Fragmented developer setups lacking robust static compilation verification"
            ],
            products: [`${objective} Engine Core`, `${objective} Visual Customizer`],
            pricing: pricingFacts.length > 0 ? pricingFacts.join(", ") : "$29.99/month Core subscription, free-tier developer sandbox",
            trafficSources: ["Developer GitHub repositories", "Active Reddit community clusters", "Product Hunt launch sprints"],
            funnelDescription: "Direct-to-developer GitHub readme links routing to high-conversion, fast slate landing pages featuring live sandboxed playgrounds.",
            designPhilosophy: designPatterns.length > 0 ? designPatterns[0] : "Solid slate themes, high margins of negative space, elegant typography pairings.",
            marketingChannels: ["Community forums", "Search Engine Optimization (SEO)", "Developer affiliate programs"],
            techStack: techFacts.length > 0 ? techFacts : ["TypeScript", "React", "Vite", "Tailwind CSS", "Express server"],
            automationWorkflow: ["Git Commit -> Auto Code Linting -> Webpack/Vite Server Bundle -> Cloud Run Hot Deploy"],
            competitors: ["Whop", "Shopify", "Gumroad"],
            strengths: ["Zero-dependency, lightweight, rapid page load speeds", "Pragmatic, explainable AI workflows"],
            weaknesses: ["Niche target audience limits mainstream consumer expansion"]
        };
    }

    /**
     * Builds details for the Product DNA
     */
    static reconstructProduct(objective: string, company: CompanyDNA): ProductDNA {
        return {
            id: `prod_dna_${Date.now()}`,
            name: company.products[0],
            problemSolved: "Tedious manual research processes and inconsistent code architectures",
            transformationOutcome: "From disorganized Google searches to structured, instantly-actionable business blueprint models",
            targetAudience: company.audience[0],
            pricingTiers: [
                { name: "Starter Bundle", price: 19, interval: "one-off" },
                { name: "Pro Creator", price: 29.99, interval: "monthly" },
                { name: "Enterprise Custom", price: 249, interval: "monthly" }
            ],
            coreFeatures: [
                "Deterministic dependency scheduling",
                "Boilerplate cleaning pipeline",
                "Node-edge World Graph visualizer"
            ],
            marketingHooks: [
                "Build exactly what your audience complained about",
                "Stop wasting thousands on bloated scraping tools"
            ],
            distributionLifecyle: "Instant SaaS distribution with Stripe checkout and automated Discord invite gateways."
        };
    }

    /**
     * Builds details for the Design DNA
     */
    static reconstructDesign(patterns: DiscoveredPattern[]): DesignDNA {
        const hasSlatePattern = patterns.some(p => p.id === "pat_slate_flat_design");
        return {
            typography: {
                headings: "Space Grotesk",
                body: "Inter"
            },
            colors: hasSlatePattern ? ["#030712", "#0f172a", "#1e293b", "#14b8a6"] : ["#090d16", "#121b2d", "#14b8a6"],
            spacingLayout: "Generous margins, flat structural cards, 24px grid layout alignment",
            reusableComponents: ["Interactive Playground Card", "Metrics Grid Block", "Trace Timeline Item"],
            animationsStyle: "Micro-interactions, subtle hover scale transitions, 150ms ease-in-out fade loops",
            brandPersonality: "Pragmatic, scientific, ultra-modern and trustworthy",
            interactionsIndex: 92
        };
    }

    /**
     * Builds details for the Marketing DNA
     */
    static reconstructMarketing(company: CompanyDNA): MarketingDNA {
        return {
            trafficSources: company.trafficSources,
            adHooks: [
                "How I replaced three scraping services with a single deterministic pipeline",
                "Your SaaS landing page is blinding your users. Here is why."
            ],
            contentStrategy: "High-value, code-focused technical guides showing architectural diagrams and explainable AI benchmarks.",
            affiliatePrograms: true,
            distributionChannels: ["Self-hosted documentation hub", "NPM registries", "Affiliate landing panels"],
            funnelStages: ["GitHub Repo -> Documentation Readme -> Live App Playground -> Pricing Gate -> Stripe Portal"]
        };
    }
}
