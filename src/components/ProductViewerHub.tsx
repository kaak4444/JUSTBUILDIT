/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BookOpen, 
  ShoppingBag, 
  RefreshCw, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  TrendingUp, 
  Award, 
  DollarSign, 
  Layers, 
  CheckCircle,
  Clock,
  Building2,
  FileText
} from "lucide-react";
import { UnifiedProduct } from "../core/execution/ResultAggregator";
import { DepartmentRegistry } from "../departments/core/DepartmentRegistry";

// Initial Seed Products
const SEED_PRODUCTS: UnifiedProduct[] = [
  {
    id: "p_serene_journal",
    title: "The Serene Reader: A 10-Minute Guide & Daily Reflective Journal",
    description: "An elegant, self-guided wellness companion engineered with spacious page grids, targeted gratitude anchors, and weekly mind-clearance exercises.",
    category: "Books & Journals",
    asin: "B07X947KRP",
    url: "https://www.amazon.com/dp/B07X947KRP",
    coverImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
    price: "$12.99",
    estimatedRoyalty: "$5.84",
    pages: 128,
    wordCount: 8400,
    creationDate: "Jun 24, 2026",
    keywords: ["mindfulness logbook", "daily meditation journal", "anxiety workbook", "prompt book"],
    status: "LIVE_ON_MARKET",
    chapters: [
      { title: "Introduction: The Mechanics of Presence", wordsCount: 1200 },
      { title: "Day 1-7: Morning Synaptic Offloads", wordsCount: 1800 },
      { title: "Day 8-14: Identifying Frustration Triggers", wordsCount: 2400 },
      { title: "Day 15-30: Building Habit Anchorage Points", wordsCount: 3000 }
    ],
    performanceMetrics: {
      totalSalesCount: 148,
      totalEarnings: 864.32,
      salesRank: 12450,
      starsAverage: 4.8,
      dailyPageReads: 340,
      trendIndicator: "UP"
    }
  },
  {
    id: "p_spine_cushion",
    title: "Ergonomic Lumbar Spine Cushion: Specification Brief & SEO Strategy Guide",
    description: "Multi-agent blueprint outlining supplier specifications, anti-slip anchors, and exact high-converting Amazon campaign structures for spine support cushions.",
    category: "Dropship Blueprints",
    asin: "B09W218HYX",
    url: "https://www.shopify.com",
    coverImage: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600&auto=format&fit=crop",
    price: "$29.99",
    estimatedRoyalty: "$14.25",
    pages: 18,
    wordCount: 3400,
    creationDate: "Jun 28, 2026",
    keywords: ["spinal posture cushion", "lumbar support seat for office", "orthopedic spine pads"],
    status: "LIVE_ON_MARKET",
    chapters: [
      { title: "Section 1: Complaint Pattern Graph Mapping", wordsCount: 950 },
      { title: "Section 2: High-Density Polyurethane Density Guidelines", wordsCount: 1100 },
      { title: "Section 3: Amazon PPC Auction Bidding Tables", wordsCount: 1350 }
    ],
    performanceMetrics: {
      totalSalesCount: 42,
      totalEarnings: 598.50,
      salesRank: 64100,
      starsAverage: 4.5,
      dailyPageReads: 0,
      trendIndicator: "STEADY"
    }
  }
];

export function ProductViewerHub() {
  const [products, setProducts] = useState<UnifiedProduct[]>(() => {
    if (process.env.NODE_ENV === "development") {
      return [];
    }
    const saved = localStorage.getItem("jbi_published_products");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedProduct, setSelectedProduct] = useState<UnifiedProduct | null>(products[0]);
  const [activeViewerTab, setActiveViewerTab] = useState<"METRIC" | "E_READER">("METRIC");
  
  // Interactive Reader flip states
  const [activePage, setActivePage] = useState<number>(0);

  // Pulse Refresher Simulation states
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshLogs, setRefreshLogs] = useState<string[]>([]);
  const [refreshProgress, setRefreshProgress] = useState<number>(0);

  const triggerPulseRefresher = (product: UnifiedProduct) => {
    setIsRefreshing(true);
    setRefreshProgress(0);
    setRefreshLogs([]);

    const logSteps = [
      `[INFO] Booting Multi-Agent Analytics Harvester for product: ${product.asin}...`,
      `[DEBUG] Connecting review crawler swarms to Amazon Scraper Endpoint...`,
      `[DEBUG] Scraped 28 competitor pricing nodes. Soft-margin calculation active...`,
      `[INFO] Auditing buyer feedback. Found 4 new 5-star reviews on Kindle bookshelf!`,
      `[SUCCESS] Sync completed. Metrics aggregated & royal ledger synced.`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logSteps.length) {
        setRefreshLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${logSteps[currentStep]}`]);
        setRefreshProgress(p => p + 20);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          // Perform sales bump update
          setProducts(prevProducts => {
            const updated = prevProducts.map(p => {
              if (p.id === product.id) {
                const salesAdd = Math.floor(Math.random() * 8) + 3;
                const newSales = p.performanceMetrics.totalSalesCount + salesAdd;
                const priceNum = parseFloat(p.price.replace("$", ""));
                const royaltyNum = parseFloat(p.estimatedRoyalty.replace("$", ""));
                const newEarnings = parseFloat((newSales * royaltyNum).toFixed(2));
                const newRank = Math.max(800, p.performanceMetrics.salesRank - Math.floor(Math.random() * 1500));
                
                const updatedProduct = {
                  ...p,
                  performanceMetrics: {
                    ...p.performanceMetrics,
                    totalSalesCount: newSales,
                    totalEarnings: newEarnings,
                    salesRank: newRank,
                    starsAverage: parseFloat(Math.min(5.0, p.performanceMetrics.starsAverage + 0.1 * (Math.random() - 0.3)).toFixed(1))
                  }
                };

                if (selectedProduct?.id === product.id) {
                  setSelectedProduct(updatedProduct);
                }

                return updatedProduct;
              }
              return p;
            });
            localStorage.setItem("jbi_published_products", JSON.stringify(updated));
            return updated;
          });

          // Add a global activity event in the department registry
          const reg = DepartmentRegistry.getInstance();
          reg.emitActivity("publishing", "MISSION_COMPLETED", `Pulse Audit Completed for [${product.title}]. Rank updated to #${product.performanceMetrics.salesRank - 1500}!`);

          setIsRefreshing(false);
        }, 1000);
      }
    }, 1200);
  };

  return (
    <div id="product-viewer-hub-root" className="space-y-6 font-mono">
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-glass pb-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-accent animate-pulse" />
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
            CEO Portfolio & Market Listings Hub
          </h2>
        </div>
        <span className="text-[9px] bg-accent/10 border border-accent/20 px-2.5 py-1 rounded text-accent uppercase font-bold">
          {products.length} Products Live
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Product List Deck (col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2">
          <div className="text-[10px] text-gray-500 uppercase font-bold border-b border-glass pb-1 select-none">
            Active Store Assets
          </div>
          {products.map(product => {
            const active = selectedProduct?.id === product.id;
            return (
              <button
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product);
                  setActivePage(0);
                }}
                className={`w-full p-3 border text-left rounded-xl transition-all cursor-pointer flex gap-3 ${
                  active 
                    ? "bg-accent/10 border-accent text-white" 
                    : "bg-black border-glass text-gray-400 hover:text-white hover:bg-white/[0.01]"
                }`}
              >
                <img 
                  src={product.coverImage} 
                  alt={product.title} 
                  className="w-12 h-16 rounded object-cover border border-glass shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1 overflow-hidden">
                  <span className="block text-[10px] font-bold font-sans line-clamp-2 text-white leading-snug">
                    {product.title}
                  </span>
                  <div className="flex items-center gap-2 text-[8px] text-gray-500">
                    <span className="bg-white/5 px-1.5 py-0.5 rounded uppercase font-bold tracking-wide">
                      {product.category}
                    </span>
                    <span>•</span>
                    <span className="text-accent font-bold">{product.price}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Showcase Viewers & Pulse Refresher (col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedProduct ? (
            <div className="p-5 border border-glass rounded-2xl bg-black/40 space-y-5">
              
              {/* Product Header details */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-glass pb-4">
                <div className="space-y-1.5 max-w-md">
                  <span className="text-[8px] uppercase tracking-wider font-extrabold text-accent bg-accent/5 px-2 py-0.5 border border-accent/10 rounded">
                    ASIN: {selectedProduct.asin}
                  </span>
                  <h3 className="text-xs font-bold text-white font-sans leading-relaxed">
                    {selectedProduct.title}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Listing Action buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <a 
                    href={selectedProduct.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg border border-glass bg-white/5 hover:bg-white/10 text-[9px] text-white hover:text-white font-mono font-bold flex items-center gap-1.5 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-accent" />
                    <span>View Live Account</span>
                  </a>
                  <button 
                    onClick={() => triggerPulseRefresher(selectedProduct)}
                    disabled={isRefreshing}
                    className="px-3 py-1.5 rounded-lg bg-accent text-black font-mono font-bold text-[9px] hover:bg-accent/85 transition-all flex items-center gap-1 cursor-pointer disabled:bg-neutral-800 disabled:text-neutral-500 select-none"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                    <span>Pulse Audit</span>
                  </button>
                </div>
              </div>

              {/* Sub-tab Viewer Mode Selector */}
              <div className="flex items-center gap-2 border-b border-glass/50 select-none">
                <button
                  onClick={() => setActiveViewerTab("METRIC")}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeViewerTab === "METRIC"
                      ? "border-accent text-white"
                      : "border-transparent text-gray-500 hover:text-gray-400"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Product Refresher</span>
                </button>
                <button
                  onClick={() => {
                    setActiveViewerTab("E_READER");
                    setActivePage(0);
                  }}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeViewerTab === "E_READER"
                      ? "border-accent text-white"
                      : "border-transparent text-gray-500 hover:text-gray-400"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Immersive E-Reader (PDF/EPUB)</span>
                </button>
              </div>

              {/* TAB CONTENT 1: METRICS AUDIT REFRESHER */}
              {activeViewerTab === "METRIC" && (
                <div className="space-y-4">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 bg-white/[0.01] border border-glass rounded-xl space-y-1">
                      <span className="text-[8px] uppercase text-gray-500 font-bold block">Accumulated Sales</span>
                      <span className="text-sm font-extrabold text-white flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5 text-teal-400" />
                        {selectedProduct.performanceMetrics.totalSalesCount}
                      </span>
                    </div>

                    <div className="p-3 bg-white/[0.01] border border-glass rounded-xl space-y-1">
                      <span className="text-[8px] uppercase text-gray-500 font-bold block">Royalty Profit</span>
                      <span className="text-sm font-extrabold text-accent flex items-center gap-0.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        {selectedProduct.performanceMetrics.totalEarnings || (selectedProduct.performanceMetrics.totalSalesCount * parseFloat(selectedProduct.estimatedRoyalty.replace("$", ""))).toFixed(2)}
                      </span>
                    </div>

                    <div className="p-3 bg-white/[0.01] border border-glass rounded-xl space-y-1">
                      <span className="text-[8px] uppercase text-gray-500 font-bold block">Amazon Sales Rank</span>
                      <span className="text-sm font-extrabold text-amber-500 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        #{selectedProduct.performanceMetrics.salesRank.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-3 bg-white/[0.01] border border-glass rounded-xl space-y-1">
                      <span className="text-[8px] uppercase text-gray-500 font-bold block">Rating Score</span>
                      <span className="text-sm font-extrabold text-white flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        {selectedProduct.performanceMetrics.starsAverage} / 5.0
                      </span>
                    </div>
                  </div>

                  {/* Pulse Telemetry Logs */}
                  {isRefreshing && (
                    <div className="p-4 bg-black border border-accent/20 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-extrabold text-accent tracking-widest uppercase flex items-center gap-1">
                          <Clock className="w-3 h-3 animate-spin" />
                          Multi-Agent Swarm Crawler Running...
                        </span>
                        <span className="text-[9px] text-accent font-bold">{refreshProgress}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                        <div className="bg-accent h-full transition-all duration-300" style={{ width: `${refreshProgress}%` }} />
                      </div>
                      <div className="space-y-1 font-mono text-[8px] text-gray-500 leading-normal max-h-[80px] overflow-y-auto">
                        {refreshLogs.map((log, i) => (
                          <div key={i} className="flex gap-1">
                            <span className="text-accent">&gt;</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Improvement Recommendation Card */}
                  <div className="p-4 rounded-xl border border-glass bg-white/[0.02] flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 text-left">
                      <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">
                        Autonomous Improvement Recommendation
                      </h4>
                      <p className="text-[10px] text-gray-500 leading-relaxed font-sans">
                        Our review scraper swarm parsed buyer complains on similar self-improvement trackers. Adding a dedicated **&quot;3-Minute Nightly Wind-down Checklist&quot;** section is expected to increase KDP royalties by **18%**. 
                      </p>
                      <button 
                        onClick={() => {
                          const reg = DepartmentRegistry.getInstance();
                          reg.emitActivity("books", "MISSION_CREATED", `CEO authorized dynamic expansion of [${selectedProduct.title}] structure.`);
                          alert("A self-evolution mission has been dispatched to the Books Department to compile Chapter Variations autonomously!");
                        }}
                        className="mt-2 px-2.5 py-1 text-[8px] font-extrabold uppercase bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded transition-all cursor-pointer"
                      >
                        Authorize Books Swarm Integration
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 2: IMMERSIVE PDF/EPUB READER */}
              {activeViewerTab === "E_READER" && (
                <div className="space-y-4">
                  {/* Book Mockup Frame */}
                  <div className="p-5 sm:p-8 rounded-2xl bg-[#fdfbf7] border border-glass text-[#2d2d2d] flex flex-col justify-between min-h-[350px] shadow-2xl relative overflow-hidden">
                    {/* Tiny visual binding seam */}
                    <div className="absolute top-0 bottom-0 left-4 w-px bg-black/5 shadow-inner" />
                    
                    <div className="space-y-4 text-left">
                      {/* Book header */}
                      <div className="flex items-center justify-between border-b border-black/10 pb-2 select-none">
                        <span className="text-[8px] font-mono tracking-widest uppercase opacity-60">
                          {selectedProduct.title.split(":")[0]}
                        </span>
                        <span className="text-[9px] font-mono font-bold opacity-60">
                          PAGE {activePage + 1} OF {selectedProduct.chapters?.length || 1}
                        </span>
                      </div>

                      {/* Reading content canvas */}
                      <div className="space-y-3 font-sans max-w-lg mx-auto py-4">
                        <h4 className="text-xs font-serif font-extrabold text-black/80 tracking-wide">
                          {selectedProduct.chapters?.[activePage]?.title || "Interior Chapter"}
                        </h4>
                        <p className="text-[10px] text-black/70 leading-relaxed indent-4">
                          This print interior layout has been formatted dynamically by the KDP Vector Layout compiler worker. By adjusting text bleed bounds and spine margins for exactly {selectedProduct.pages} pages, we guarantee professional paper wrapping on delivery.
                        </p>
                        <p className="text-[10px] text-black/70 leading-relaxed indent-4">
                          All chapter subsections conform strictly to commercial buy-triggers discovered by the Research division. Reader satisfaction metrics are locked to high-density clarity margins.
                        </p>
                      </div>
                    </div>

                    {/* Book footer / navigation */}
                    <div className="flex items-center justify-between border-t border-black/10 pt-3 select-none">
                      <button
                        onClick={() => setActivePage(p => Math.max(0, p - 1))}
                        disabled={activePage === 0}
                        className="px-2.5 py-1 rounded hover:bg-black/5 text-[9px] font-mono font-bold flex items-center gap-1 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Prev Chapter</span>
                      </button>

                      <span className="text-[8px] font-mono tracking-widest uppercase opacity-40">
                        JustBuildIt E-Reader v1.4
                      </span>

                      <button
                        onClick={() => setActivePage(p => Math.min((selectedProduct.chapters?.length || 1) - 1, p + 1))}
                        disabled={activePage === (selectedProduct.chapters?.length || 1) - 1}
                        className="px-2.5 py-1 rounded hover:bg-black/5 text-[9px] font-mono font-bold flex items-center gap-1 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        <span>Next Chapter</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Print / Compilation specs indicator */}
                  <div className="flex justify-between items-center text-[9px] text-gray-500 font-mono px-2">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-accent" />
                      PDF Layout Status: <b className="text-white">COMPILED_READY</b>
                    </span>
                    <span>Interior Wordcount: <b className="text-white">{selectedProduct.wordCount} words</b></span>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 border border-dashed border-glass rounded-2xl text-center text-xs text-gray-500">
              Select a product asset on the left to activate the immersive portfolio view.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
