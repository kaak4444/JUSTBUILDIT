/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductionPlanInput {
  businessGoal: string;
  businessType: string;
  marketplace: string;
  customer: string;
  brand: string;
  budget: number;
  deadline: number;
}

export interface AssetNode {
  id: string;
  name: string;
  type: string;
  dependencies: string[]; // parent asset IDs
  status: "PENDING" | "GENERATED" | "APPROVED" | "REVISED";
  version: number;
  cost: number;
  generationTimeSec: number;
  workerType: string;
  qualityScore?: number;
  prompt?: string;
  reviewFeedback?: string[];
}

export interface WorkerAllocation {
  id: string;
  name: string;
  type: string;
  speedSec: number;
  qualityRating: number; // 0 to 100
  costPerRun: number;
}

export interface ProductionPlanOutput {
  mission: string;
  assetsNeeded: AssetNode[];
  estimatedCost: number;
  estimatedTimeSec: number;
  workersAllocated: WorkerAllocation[];
}

export class ProductionPlanner {
  /**
   * Generates a fully fleshed out Production Plan including dependencies (Asset DAG),
   * estimated timings, costs, and workers, based on high-level constraints.
   */
  public static plan(input: ProductionPlanInput): ProductionPlanOutput {
    const goalLower = input.businessGoal.toLowerCase();
    
    // Heuristically compile assets needed based on business goal and type
    const assets: AssetNode[] = [];
    const workers: WorkerAllocation[] = [
      { id: "brand_wrk", name: "Brand Architect Bot", type: "Branding", speedSec: 8, qualityRating: 95, costPerRun: 0.02 },
      { id: "logo_wrk", name: "Logo Designer AI", type: "Logo", speedSec: 10, qualityRating: 96, costPerRun: 0.03 },
      { id: "tokens_wrk", name: "Design System Compiler", type: "DesignTokens", speedSec: 5, qualityRating: 94, costPerRun: 0.01 },
      { id: "content_wrk", name: "Product Content Synthesizer", type: "ProductContent", speedSec: 15, qualityRating: 92, costPerRun: 0.04 },
      { id: "mockup_wrk", name: "3D Render engine v3", type: "Mockups", speedSec: 12, qualityRating: 98, costPerRun: 0.05 },
      { id: "doc_wrk", name: "Technical Document Writer", type: "Documentation", speedSec: 9, qualityRating: 93, costPerRun: 0.02 },
      { id: "seo_wrk", name: "SEO Optimus Prime", type: "SEO", speedSec: 6, qualityRating: 97, costPerRun: 0.02 },
      { id: "marketing_wrk", name: "Social Ad Campaigner", type: "MarketingAssets", speedSec: 11, qualityRating: 91, costPerRun: 0.03 }
    ];

    // Define standard DAG creation
    // Level 1: Core Brand Assets
    assets.push({
      id: "brand_guidelines",
      name: `${input.brand || "Niche"} Core Brand Essence`,
      type: "Brand",
      dependencies: [],
      status: "PENDING",
      version: 1,
      cost: 0.02,
      generationTimeSec: 8,
      workerType: "Branding",
      qualityScore: 95,
      prompt: "Synthesize target customer demographics and aesthetic design directions based on brand principles."
    });

    assets.push({
      id: "brand_logo",
      name: `${input.brand || "Niche"} Visual Logo Pack`,
      type: "Logo",
      dependencies: ["brand_guidelines"],
      status: "PENDING",
      version: 1,
      cost: 0.03,
      generationTimeSec: 10,
      workerType: "Logo",
      qualityScore: 96,
      prompt: "Synthesize a minimalist vector logo conforming to brand guidelines using clean geometry and contrast ratio rules."
    });

    assets.push({
      id: "design_tokens",
      name: "Tailwind & Typography CSS Tokens",
      type: "DesignTokens",
      dependencies: ["brand_guidelines", "brand_logo"],
      status: "PENDING",
      version: 1,
      cost: 0.01,
      generationTimeSec: 5,
      workerType: "DesignTokens",
      qualityScore: 94,
      prompt: "Compile typographic paired typography hierarchy, exact margins, gap values, and hexadecimal colors."
    });

    // Level 2: Core Product Assets
    if (goalLower.includes("printable") || goalLower.includes("journal") || goalLower.includes("planner")) {
      assets.push({
        id: "core_pages",
        name: "100 High-Resolution Printable Pages",
        type: "PrintableLayout",
        dependencies: ["design_tokens"],
        status: "PENDING",
        version: 1,
        cost: 0.04,
        generationTimeSec: 15,
        workerType: "ProductContent",
        qualityScore: 92,
        prompt: "Draft 100 uniquely formulated planner pages formatted for print-ready CMYK execution with elegant gutters."
      });
      assets.push({
        id: "cover_design",
        name: "Cover Art and Binding Visuals",
        type: "PrintableLayout",
        dependencies: ["design_tokens"],
        status: "PENDING",
        version: 1,
        cost: 0.03,
        generationTimeSec: 11,
        workerType: "ProductContent",
        qualityScore: 95,
        prompt: "Design high-contrast artistic front and back covers using the specified branding typography scheme."
      });
    } else if (goalLower.includes("course") || goalLower.includes("book") || goalLower.includes("guide")) {
      assets.push({
        id: "course_curriculum",
        name: "12-Module Rich PDF Syllabus",
        type: "DocumentLayout",
        dependencies: ["design_tokens"],
        status: "PENDING",
        version: 1,
        cost: 0.05,
        generationTimeSec: 18,
        workerType: "ProductContent",
        qualityScore: 95,
        prompt: "Produce 12 modules of highly structural course outlines and educational slides with Markdown text."
      });
    } else {
      assets.push({
        id: "digital_product_source",
        name: "Digital Product Source Files",
        type: "DigitalProduct",
        dependencies: ["design_tokens"],
        status: "PENDING",
        version: 1,
        cost: 0.04,
        generationTimeSec: 12,
        workerType: "ProductContent",
        qualityScore: 91,
        prompt: "Produce the core digital files, blueprints, and assets for customer acquisition."
      });
    }

    // Level 3: Packaging & Presentation Assets
    assets.push({
      id: "product_photos",
      name: "High-Fidelity Photorealistic Renders",
      type: "Mockups",
      dependencies: assets.map(a => a.id).filter(id => id === "core_pages" || id === "cover_design" || id === "digital_product_source" || id === "course_curriculum"),
      status: "PENDING",
      version: 1,
      cost: 0.05,
      generationTimeSec: 12,
      workerType: "Mockups",
      qualityScore: 98,
      prompt: "Synthesize high-resolution photorealistic 3D mockups showcasing the physical feel of our printable pack."
    });

    assets.push({
      id: "docs_and_licenses",
      name: "Commercial License & Instruction PDF",
      type: "Documentation",
      dependencies: ["brand_guidelines"],
      status: "PENDING",
      version: 1,
      cost: 0.02,
      generationTimeSec: 9,
      workerType: "Documentation",
      qualityScore: 93,
      prompt: "Write a complete customer-facing commercial license, warranty, and visual step-by-step PDF manual."
    });

    // Level 4: SEO, Marketing & Marketplace Listings
    assets.push({
      id: "seo_meta",
      name: "Advanced Marketplace Search Keywords Pack",
      type: "SEO",
      dependencies: ["brand_guidelines"],
      status: "PENDING",
      version: 1,
      cost: 0.02,
      generationTimeSec: 6,
      workerType: "SEO",
      qualityScore: 97,
      prompt: "Research long-tail keyword strings, high search volume tags, and write optimized SEO titles."
    });

    assets.push({
      id: "marketplace_listing",
      name: "Optimized Listing Templates (Multi-Platform)",
      type: "Listing",
      dependencies: ["seo_meta", "product_photos"],
      status: "PENDING",
      version: 1,
      cost: 0.04,
      generationTimeSec: 14,
      workerType: "ProductContent",
      qualityScore: 94,
      prompt: "Compose comprehensive sales-driven listing copy incorporating guarantees, FAQ lists, and rich feature tables."
    });

    assets.push({
      id: "marketing_social_ad",
      name: "High-CTR Pinterest Pins & Instagram Layouts",
      type: "MarketingAssets",
      dependencies: ["product_photos"],
      status: "PENDING",
      version: 1,
      cost: 0.03,
      generationTimeSec: 11,
      workerType: "MarketingAssets",
      qualityScore: 91,
      prompt: "Generate 5 high-converting Pinterest templates and responsive Instagram promotional slides with strong hooks."
    });

    assets.push({
      id: "packaging_files",
      name: "Unified Compressed Delivery Artifact (ZIP)",
      type: "Packaging",
      dependencies: assets.map(a => a.id),
      status: "PENDING",
      version: 1,
      cost: 0.02,
      generationTimeSec: 7,
      workerType: "Documentation",
      qualityScore: 96,
      prompt: "Compile and bundle the production outputs, source folders, legal license sheets, and SEO tags into a production ZIP archive."
    });

    const estimatedCost = assets.reduce((sum, a) => sum + a.cost, 0);
    const estimatedTimeSec = assets.reduce((sum, a) => sum + a.generationTimeSec, 0);

    const mission = `Launch a fully automated, market-optimized ${input.businessType} digital business specializing in [${input.businessGoal}] to be published on [${input.marketplace}] targeting [${input.customer}] under the premium brand [${input.brand}].`;

    return {
      mission,
      assetsNeeded: assets,
      estimatedCost: parseFloat(estimatedCost.toFixed(2)),
      estimatedTimeSec,
      workersAllocated: workers
    };
  }
}
