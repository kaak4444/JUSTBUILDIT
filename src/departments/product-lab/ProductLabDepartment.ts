/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Department } from "../../engine/interfaces";
import { OpportunityPlanner } from "./planners/OpportunityPlanner";
import { ProductPlanner } from "./planners/ProductPlanner";
import { ProductPositioner } from "./planners/ProductPositioner";
import { CreativePlanner } from "./planners/CreativePlanner";
import { DesignDirector } from "./designers/DesignDirector";
import { DesignResearcher } from "./designers/DesignResearcher";
import { BrandDesigner } from "./designers/BrandDesigner";
import { UXDesigner } from "./designers/UXDesigner";
import { ProductValidator } from "./validators/ProductValidator";
import { MarketValidator } from "./validators/MarketValidator";
import { HumanQualityValidator } from "./validators/HumanQualityValidator";
import { AssetGenerator } from "./generators/AssetGenerator";
import { ListingGenerator } from "./generators/ListingGenerator";
import { PromptGenerator } from "./generators/PromptGenerator";
import { ProductMemory } from "./memory/ProductMemory";

export class ProductLabDepartment extends Department {
  id = "product-lab";
  name = "Product Lab Studio";
  description = "Focuses on turning strategic market gaps into beautiful, high-converting digital products optimized for major platforms (Shopify, Etsy, Amazon, Whop, etc.).";
  workerTypes = [
    "opportunity-planner",
    "product-planner",
    "product-positioner",
    "creative-planner",
    "design-director",
    "design-researcher",
    "brand-designer",
    "ux-designer",
    "product-validator",
    "market-validator",
    "human-quality-validator",
    "asset-generator",
    "listing-generator",
    "prompt-generator",
    "product-memory"
  ];

  workers = [
    OpportunityPlanner,
    ProductPlanner,
    ProductPositioner,
    CreativePlanner,
    DesignDirector,
    DesignResearcher,
    BrandDesigner,
    UXDesigner,
    ProductValidator,
    MarketValidator,
    HumanQualityValidator,
    AssetGenerator,
    ListingGenerator,
    PromptGenerator,
    ProductMemory
  ];
}
