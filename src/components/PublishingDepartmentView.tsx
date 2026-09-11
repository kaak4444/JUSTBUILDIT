/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Send, motion, AnimatePresence } from "motion/react";
import {
  Rocket,
  Globe,
  Tag,
  DollarSign,
  Award,
  ShieldCheck,
  TrendingUp,
  BarChart2,
  RefreshCw,
  Search,
  ExternalLink,
  PlusCircle,
  FileText,
  Percent,
  CheckCircle,
  AlertTriangle,
  Play,
  ArrowRight,
  Database,
  History,
  Activity,
  Heart,
  HelpCircle,
  BookOpen
} from "lucide-react";

export interface PublishingDepartmentViewProps {
  theme: "light" | "dark";
  logs: any[];
  addLog: (source: string, message: string, level: "INFO" | "WARN" | "ERROR" | "DEBUG") => void;
}

export function PublishingDepartmentView({ theme, logs, addLog }: PublishingDepartmentViewProps) {
  // SEO engine state
  const [targetProduct, setTargetProduct] = useState("Minimalist Digital Productivity Planner");
  const [seoVolume, setSeoVolume] = useState("18,500 monthly searches");
  const [seoDifficulty, setSeoDifficulty] = useState("Medium");
  const [seoTitle, setSeoTitle] = useState("AuraPlanners: 2026 Digital Planner | 100 Hyperlinked Productivity Pages for iPad");
  const [seoKeywords, setSeoKeywords] = useState(["digital planner", "ipad planner", "productivity journal", "goodnotes printable", "notability planner"]);

  // Market routing potential
  const [platforms, setPlatforms] = useState([
    { name: "Etsy", score: "★★★★★", weight: 98, demand: "High", fee: "6.5% + $0.20", avgPrice: "$12.00", badge: "Primary Target" },
    { name: "Shopify", score: "★★★★★", weight: 95, demand: "High", fee: "2.9% + $0.30", avgPrice: "$18.00", badge: "Brand Anchor" },
    { name: "Gumroad", score: "★★★★☆", weight: 82, demand: "Medium", fee: "10% Flat", avgPrice: "$15.00", badge: "Tech Niche" },
    { name: "Whop", score: "★★★☆☆", weight: 64, demand: "Low-Medium", fee: "3% Flat", avgPrice: "$19.00", badge: "Subscription Focus" },
    { name: "Creative Market", score: "★★☆☆☆", weight: 45, demand: "Low", fee: "40% Flat", avgPrice: "$22.00", badge: "Designers Only" }
  ]);

  // Pricing Simulator states
  const [pricingExperiments, setPricingExperiments] = useState([
    { price: 9, conversion: 6.8, revenue: 612, profit: 580, status: "Sub-Optimal" },
    { price: 14, conversion: 5.4, revenue: 756, profit: 710, status: "WINNER - Peak Profit" },
    { price: 19, conversion: 3.2, revenue: 608, profit: 570, status: "Average" },
    { price: 29, conversion: 1.1, revenue: 319, profit: 290, status: "Low Volatility" }
  ]);
  const [simulatingPrice, setSimulatingPrice] = useState(false);

  // Listing builder copy output
  const [listingTitle, setListingTitle] = useState("AuraPlanners™ 2026 Daily Digital Productivity Planner");
  const [listingDescription, setListingDescription] = useState(
    "A premium minimalist digital planner featuring 100 hyperlinked pages designed for tablet-native productivity. Organized into daily, weekly, and monthly views with an aesthetic charcoal grid design that aligns with Swiss layout proportions. Safe on eyes, responsive, and fully compatible with GoodNotes and Notability."
  );
  const [listingFAQ, setListingFAQ] = useState([
    { q: "Is this planner compatible with Android tablets?", a: "Yes, it works perfectly with any PDF annotator such as Penly, Xodo, or Noteshelf on Android." },
    { q: "Do the hyperlink tabs work on mobile?", a: "Yes, hyperlinked tabs are embedded inside the vector schema and respond instantly across all devices." }
  ]);
  const [listingComparison, setListingComparison] = useState([
    { feature: " সুইস Aesthetic Grid", premium: "Yes ( Swiss Neutral )", competitor: "No ( Cluttered )" },
    { feature: "100 Hyperlinked Spans", premium: "Yes ( Multi-index )", competitor: "No ( Linear PDF )" },
    { feature: "Lifetime Updates", premium: "Yes", competitor: "No ( Pay Annual )" }
  ]);

  // Launch Experiment Engine (A/B testing)
  const [experimentList, setExperimentList] = useState([
    { variant: "A (瑞士瑞士 Modern Focus)", title: "AuraPlanners™ Swiss Neutral Minimal Daily Planner", views: 1420, clicks: 82, ctr: 5.77, sales: 12, cr: 14.6 },
    { variant: "B (Power-Aesthetic Hook)", title: "CoreFocus™: The Hyper-Productive 2026 Digital Planner Pack", views: 1390, clicks: 124, ctr: 8.92, sales: 24, cr: 19.3, activeWinner: true }
  ]);
  const [runningABTest, setRunningABTest] = useState(false);

  // Publishing Monitor
  const [liveMonitor, setLiveMonitor] = useState({
    views: 2840,
    clicks: 206,
    ctr: 7.25,
    sales: 36,
    conversionRate: 17.4,
    revenue: 504,
    ranking: "#3 in category"
  });
  const [autoOptimizerActive, setAutoOptimizerActive] = useState(true);
  const [runningMonitorSweep, setRunningMonitorSweep] = useState(false);

  // Marketplace memory
  const [marketplaceMemory, setMarketplaceMemory] = useState([
    { platform: "Etsy", factor: "Warm color palettes & human-styled photography cover thumbnails increase CTR by 34%." },
    { platform: "Shopify", factor: "Programmatic schema markup with high star review snippets increases google search traffic by 42%." },
    { platform: "Gumroad", factor: "Highly technical feature tables, explicit licensing disclosures, and pay-what-you-want support works best." },
    { platform: "Whop", factor: "Discord community access, live direct download lock sheets, and video overview thumbnails drives high ticket items." }
  ]);

  // Pricing optimizer trigger
  const runPricingSimulator = () => {
    setSimulatingPrice(true);
    addLog("PricingEngine", "Initiating multi-point price conversion simulation. Estimating demand curve...", "INFO");
    
    setTimeout(() => {
      setPricingExperiments([
        { price: 9, conversion: 7.2, revenue: 648, profit: 615, status: "Low Pricing High Vol" },
        { price: 14, conversion: 5.9, revenue: 826, profit: 785, status: "WINNER - Peak Margin" },
        { price: 19, conversion: 3.5, revenue: 665, profit: 625, status: "Moderate Value" },
        { price: 29, conversion: 1.4, revenue: 406, profit: 375, status: "High Ticket" }
      ]);
      setSimulatingPrice(false);
      addLog("PricingEngine", "Price-response demand curve resolved. Optimal price finalized at $14.00 (estimated monthly net profit $785 USD).", "INFO");
    }, 1800);
  };

  // Run Listing Builder SEO Sweep
  const triggerSeoSweep = () => {
    addLog("SEOEngine", "Crawling trending digital productivity search intents. Refining listing metadata...", "INFO");
    setTimeout(() => {
      setSeoTitle("AuraPlanners™ 2026 Digital Planner | 100 daily pages, hyperlinked PDF, aesthetic GoodNotes");
      setSeoVolume("24,800 monthly searches (Up 34% Year over Year)");
      setSeoKeywords(["aesthetic planner", "goodnotes 2026 planner", "daily planner pdf", "minimalist ipad journal", "hyperlinked organizer"]);
      addLog("SEOEngine", "SEO titles optimized, metadata sitemaps synced, keywords targeting completed.", "INFO");
    }, 1500);
  };

  // Launch A/B Experiment
  const startABExperiment = () => {
    setRunningABTest(true);
    addLog("LaunchExperimentEngine", "Starting A/B listing experiment: Variant A (Control) vs. Variant B (Optimized Thumbnails & Pricing).", "INFO");
    
    setTimeout(() => {
      setExperimentList([
        { variant: "A (瑞士瑞士 Modern Focus)", title: "AuraPlanners™ Swiss Neutral Minimal Daily Planner", views: 1650, clicks: 94, ctr: 5.7, sales: 14, cr: 14.8 },
        { variant: "B (Power-Aesthetic Hook)", title: "CoreFocus™: The Hyper-Productive 2026 Digital Planner Pack", views: 1820, clicks: 195, ctr: 10.71, sales: 48, cr: 24.6, activeWinner: true }
      ]);
      setRunningABTest(false);
      addLog("LaunchExperimentEngine", "A/B testing window closed. Variant B outperformed Variant A with a 87% increase in conversion. Retiring Variant A.", "INFO");
    }, 2500);
  };

  // Simulated auto-optimizer monitor
  const triggerMonitorSweep = () => {
    setRunningMonitorSweep(true);
    addLog("PublishingMonitor", "Auto-scanning active listings for metric dips and competitive price gaps...", "INFO");
    
    setTimeout(() => {
      if (autoOptimizerActive) {
        addLog("AutoOptimizer", "Detected a 12% competitor price reduction. Automatically enabling active loyalty discount code. CTR and Sales stabilized.", "WARN");
      }
      setLiveMonitor({
        views: 3120,
        clicks: 248,
        ctr: 7.95,
        sales: 44,
        conversionRate: 17.7,
        revenue: 616,
        ranking: "#2 in category"
      });
      setRunningMonitorSweep(false);
    }, 1500);
  };

  return (
    <div className="space-y-6" id="publishing-department-main">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0f0f0f] border border-glass shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20">
            <Rocket className="w-5 h-5 text-accent animate-bounce" />
          </div>
          <div>
            <h1 className="text-sm font-mono font-bold uppercase text-white tracking-widest">Publishing Department</h1>
            <p className="text-[10px] text-gray-500 font-medium">Auto-route deliverables, compile SEO copywriting packages, run pricing experiments, and orchestrate A/B launch monitors.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerMonitorSweep}
            disabled={runningMonitorSweep}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg bg-white/5 border border-glass text-gray-300 hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50"
          >
            <Activity className="w-3.5 h-3.5 text-accent" />
            <span>Scan Active Monitor</span>
          </button>
          
          <button
            onClick={startABExperiment}
            disabled={runningABTest}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg bg-accent text-white hover:bg-accent/80 transition-all cursor-pointer disabled:opacity-50 shadow-md"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run Listing A/B Test</span>
          </button>
        </div>
      </div>

      {/* TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: PUBLISHING DIRECTOR ROUTING & SEO ENGINE */}
        <div className="lg:col-span-4 space-y-6">
          {/* PUBLISHING ROUTING PANEL */}
          <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
            <div className="flex items-center gap-2 border-b border-glass pb-2.5">
              <Globe className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Publishing Director</h2>
            </div>
            
            <p className="text-[9px] text-gray-400 font-mono leading-relaxed">
              Evaluating ideal marketplaces for current asset deliverables based on target buyer personas.
            </p>

            <div className="space-y-2">
              {platforms.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-black border border-glass text-[9px] font-mono">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-bold">{p.name}</span>
                      <span className="text-[7px] text-accent px-1.5 py-0.2 rounded bg-accent/10 border border-accent/20">{p.badge}</span>
                    </div>
                    <div className="text-gray-500 text-[8px]">Fee: {p.fee} | Est. Price: {p.avgPrice}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-400 font-bold">{p.score}</div>
                    <span className="text-[8px] text-gray-400">Demand: {p.demand}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO INTELLIGENCE ENGINE */}
          <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
            <div className="flex items-center justify-between border-b border-glass pb-2.5">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-accent" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">SEO Engine Optimizer</h3>
              </div>
              <button onClick={triggerSeoSweep} className="p-1 rounded hover:bg-white/5 transition-all cursor-pointer">
                <RefreshCw className="w-3.5 h-3.5 text-accent" />
              </button>
            </div>

            <div className="space-y-3 text-[9px] font-mono">
              <div>
                <span className="block text-gray-500 text-[7px] uppercase font-bold">TARGET NICHE OUTLINE</span>
                <span className="text-white font-semibold">{targetProduct}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="block text-gray-500 text-[7px] uppercase font-bold">SEARCH VOLUME</span>
                  <span className="text-emerald-400 font-bold">{seoVolume}</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-[7px] uppercase font-bold">COMPETITION RATIO</span>
                  <span className="text-amber-400 font-bold">{seoDifficulty}</span>
                </div>
              </div>
              <div>
                <span className="block text-gray-500 text-[7px] uppercase font-bold">SEO OPTIMIZED LISTING TITLE</span>
                <p className="text-gray-300 bg-black p-2.5 rounded border border-glass leading-relaxed">{seoTitle}</p>
              </div>
              <div>
                <span className="block text-gray-500 text-[7px] uppercase font-bold">SEO TAGS FOR CONVERTING INDEXES</span>
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {seoKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-lg bg-accent/5 border border-accent/15 text-accent text-[8px]">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MARKETPLACE PLATFORM MEMORY */}
          <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-3">
            <div className="flex items-center gap-2 border-b border-glass pb-2.5">
              <Database className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Marketplace Platform Memory</h3>
            </div>
            <div className="space-y-2.5">
              {marketplaceMemory.map((mem, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-[9px] font-mono font-bold text-accent uppercase">{mem.platform} PLATFORM PLATFORM</div>
                  <p className="text-[9px] text-gray-400 font-mono leading-relaxed pl-2.5 border-l border-glass">{mem.factor}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: RICH LISTING BUILDER & EXPERIMENTS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* PRICING ENGINE SIMULATOR */}
          <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
            <div className="flex items-center justify-between border-b border-glass pb-2.5">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-accent animate-spin" />
                <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Pricing Engine (Demand Curve Simulation)</h2>
              </div>
              <button
                onClick={runPricingSimulator}
                disabled={simulatingPrice}
                className="px-2.5 py-1 text-[8px] font-mono uppercase bg-accent/10 border border-accent/20 text-accent rounded hover:bg-accent/20 transition-all cursor-pointer disabled:opacity-50"
              >
                Simulate Pricing Strategy
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {pricingExperiments.map((exp, idx) => (
                <div key={idx} className={`p-3 rounded-xl border font-mono text-[9px] ${exp.status.includes("WINNER") ? "border-emerald-500/30 bg-emerald-500/[0.02]" : "border-glass bg-black"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-500 uppercase font-bold text-[7px]">PRICE</span>
                    <span className={`text-[8px] font-bold ${exp.status.includes("WINNER") ? "text-emerald-400" : "text-gray-400"}`}>{exp.status}</span>
                  </div>
                  <div className="text-lg font-bold text-white">${exp.price}.00 USD</div>
                  <div className="mt-2.5 space-y-1 text-gray-400 text-[8px] border-t border-glass pt-1.5">
                    <div className="flex justify-between"><span>CVR:</span> <span className="text-white">{exp.conversion}%</span></div>
                    <div className="flex justify-between"><span>Revenue:</span> <span className="text-white">${exp.revenue}</span></div>
                    <div className="flex justify-between"><span>Net Profit:</span> <span className="text-white font-semibold text-emerald-400">${exp.profit}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LISTING BUILDER OUTPUT PREVIEW */}
          <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
            <div className="flex items-center gap-2 border-b border-glass pb-2.5">
              <FileText className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Listing Builder Preview</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 font-mono text-[9px]">
              
              {/* IMAGE HOVER BANNER & META */}
              <div className="md:col-span-5 space-y-3">
                <div className="relative aspect-video rounded-xl border border-glass bg-gradient-to-tr from-accent/5 to-white/5 flex flex-col items-center justify-center p-4">
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 rounded text-[7px] text-teal-400 uppercase font-bold">Main Cover Mockup</div>
                  <Rocket className="w-8 h-8 text-accent opacity-50 mb-1" />
                  <span className="text-[10px] text-white font-bold uppercase">AuraPlanners 2026 Daily Planner</span>
                  <span className="text-gray-500 text-[7px]">AuraMinimal Aesthetics Theme Pack</span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-500 font-bold uppercase text-[7px]">Moneyback Guarantee</span>
                  <p className="text-gray-400 bg-black p-2 rounded leading-relaxed">100% Risk-Free Guarantee: Full refund within 30 days if digital hyper-spans do not improve workflow performance metrics.</p>
                </div>
              </div>

              {/* LISTING COPY DETAILS */}
              <div className="md:col-span-7 space-y-3">
                <div>
                  <span className="text-gray-500 font-bold uppercase text-[7px] block">Sales Optimized Description Copy</span>
                  <p className="text-gray-300 leading-relaxed bg-black p-2.5 rounded border border-glass">{listingDescription}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-500 font-bold uppercase text-[7px] block">Swiss Comparison Edge</span>
                    <div className="space-y-1">
                      {listingComparison.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-black/40 p-1 rounded">
                          <span className="text-gray-300 font-bold text-[7px]">{item.feature}</span>
                          <span className="text-emerald-400 font-semibold">{item.premium}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold uppercase text-[7px] block">Platform FAQs</span>
                    <div className="space-y-1.5">
                      {listingFAQ.map((faq, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <span className="text-white font-semibold">Q: {faq.q}</span>
                          <p className="text-gray-400 pl-1">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* LAUNCH EXPERIMENT ENGINE & PUBLISHING MONITOR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* LAUNCH EXPERIMENT ENGINE PANEL */}
            <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
              <div className="flex items-center gap-2 border-b border-glass pb-2.5">
                <Award className="w-4 h-4 text-[#a855f7]" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">A/B Launch Experiment Engine</h3>
              </div>

              <div className="space-y-3">
                {experimentList.map((exp, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border font-mono text-[9px] ${exp.activeWinner ? "border-[#a855f7]/30 bg-[#a855f7]/[0.02]" : "border-glass bg-black"}`}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-white font-bold">{exp.variant}</span>
                      {exp.activeWinner && <span className="text-[#a855f7] font-bold text-[8px] uppercase">PROMOTED WINNER</span>}
                    </div>
                    <p className="text-gray-400 text-[8px] truncate mb-2">{exp.title}</p>
                    <div className="grid grid-cols-4 gap-1 border-t border-glass pt-1.5 text-[8px] text-gray-500">
                      <div>Views: <span className="text-white font-semibold">{exp.views}</span></div>
                      <div>Clicks: <span className="text-white font-semibold">{exp.clicks}</span></div>
                      <div>CTR: <span className="text-white font-semibold">{exp.ctr}%</span></div>
                      <div>Sales: <span className="text-white font-semibold text-emerald-400">{exp.sales}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PUBLISHING MONITOR & AUTO OPTIMIZER */}
            <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
              <div className="flex items-center justify-between border-b border-glass pb-2.5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Publishing Performance Monitor</h3>
                </div>
                
                {/* AUTO OPTIMIZER TOGGLE */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[7px] text-gray-500 uppercase font-bold">Auto-Optimize</span>
                  <button
                    onClick={() => setAutoOptimizerActive(!autoOptimizerActive)}
                    className={`w-8 h-4 rounded-full relative transition-all cursor-pointer ${autoOptimizerActive ? "bg-accent" : "bg-white/10"}`}
                  >
                    <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${autoOptimizerActive ? "right-0.5" : "left-0.5"}`}></span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                <div className="p-2 bg-black rounded-lg border border-glass">
                  <span className="block text-[7px] text-gray-500 uppercase font-bold">VIEWS & CLICKS</span>
                  <span className="text-white text-md font-bold">{liveMonitor.views} views</span>
                  <span className="block text-[8px] text-gray-400 mt-1">{liveMonitor.clicks} clicks ({liveMonitor.ctr}% CTR)</span>
                </div>
                <div className="p-2 bg-black rounded-lg border border-glass">
                  <span className="block text-[7px] text-gray-500 uppercase font-bold">ORDERS & CONVERSION</span>
                  <span className="text-emerald-400 text-md font-bold">+{liveMonitor.sales} sales</span>
                  <span className="block text-[8px] text-gray-400 mt-1">{liveMonitor.conversionRate}% CVR | ${liveMonitor.revenue} Net</span>
                </div>
              </div>

              {/* DAEMON ACTIVITY LOGGER */}
              <div className="p-2.5 bg-black rounded-xl border border-glass font-mono text-[8px] text-gray-400 leading-normal">
                <div className="font-bold text-gray-500 uppercase border-b border-glass pb-1 mb-1 tracking-wider">Active Guard Daemon</div>
                {autoOptimizerActive ? (
                  <div className="space-y-0.5">
                    <div className="text-emerald-400 flex items-center gap-1">🟢 Guardian Mode active: Watching rankings, reviews, views.</div>
                    <div className="text-gray-400">🛡️ If CTR falls below 4.5% → Auto-rewrite title tags.</div>
                    <div className="text-gray-400">🛡️ If Sales velocity decreases → Trigger competitor pricing audit loop.</div>
                  </div>
                ) : (
                  <div className="text-amber-500">🟡 Automated Guard Daemon is currently disabled. Active monitoring requires manually scanning sweeps.</div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
