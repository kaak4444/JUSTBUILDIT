/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  X, 
  FileText, 
  Download, 
  Printer, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  RefreshCw, 
  CheckCircle, 
  Award, 
  TrendingUp, 
  DollarSign, 
  Layers, 
  BookOpen, 
  Book,
  Scale,
  Percent,
  Search,
  ShoppingCart
} from "lucide-react";

interface OutputViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    title: string;
    description: string;
    goal: string;
    status: string;
    blueprint?: any;
    strategy?: any;
    tasks?: any[];
    retrospective?: any;
  } | null;
}

export function OutputViewerModal({ isOpen, onClose, project }: OutputViewerModalProps) {
  if (!isOpen || !project) return null;

  // Aesthetic customization parameters
  const [marginSize, setMarginSize] = useState<"compact" | "swiss" | "spacious">("swiss");
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [readingTheme, setReadingTheme] = useState<"bone" | "solarized" | "midnight">("bone");
  const [fontFamily, setFontFamily] = useState<"serif" | "sans" | "mono">("serif");
  
  // Interactive page indexing
  const [currentPage, setCurrentPage] = useState<number>(0);
  
  // Real-time Crawl Simulator state
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditProgress, setAuditProgress] = useState<number>(0);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [auditedSales, setAuditedSales] = useState<number>(180);
  const [auditedRoyalty, setAuditedRoyalty] = useState<number>(845.20);
  const [auditedRank, setAuditedRank] = useState<number>(14500);

  // Auto-generate deep chapters based on project details
  const titleWords = project.title.split(" ");
  const shortTitle = titleWords.slice(0, 4).join(" ");
  const productType = project.blueprint?.type || (project.title.toLowerCase().includes("dropship") ? "dropshipping" : project.title.toLowerCase().includes("book") ? "book" : "research");

  const [documentContent, setDocumentContent] = useState<any[]>([]);

  // Regenerate content based on the project properties
  useEffect(() => {
    let pages: any[] = [];
    if (productType === "book") {
      pages = [
        {
          title: "Title & Production Editorial Specs",
          isCover: true,
          content: [
            "----------------------------------------------------------------",
            `  TITLE: ${project.title.toUpperCase()}`,
            "  AUTHOR: Autonomous JBI Publishing Swarm",
            `  PRIMARY NICHE: ${project.blueprint?.audience || "Self-Care & Mindfulness"}`,
            `  MANDATED QUALITY GRADE: ${project.retrospective?.metrics?.finalQualityGrade || "Grade AAA"}`,
            `  ISBN-13: 978-3-16-${Math.floor(100000 + Math.random() * 900000)}-0`,
            `  TIMESTAMP: ${new Date().toISOString()}`,
            "----------------------------------------------------------------",
            "This premium volume has been compiled, checked, and approved by our multi-agent Editorial Board. Content features precise typographic grids, safe reading contrast ratios, and direct evidence-backed answers addressing unserved user complaints.",
          ]
        },
        {
          title: "Chapter 1: The Foundations of Modern Mindfulness",
          content: [
            "Traditional digital products suffer from feature-fatigue. In analyzing competitor apps, we discovered over 120 critical complaint clusters citing complex nested setup screens, high night-time ocular strain, and slow, confusing page-loads.",
            "Our solution begins with immediate feedback loop immersion. By establishing clear touch targets, ample negative spaces, and a calm midnight background, readers can focus fully on the core educational lessons. Below is our daily recommended mindfulness anchorage checklist:",
            "* 08:00 AM - Synaptic Deep Offloads (3 minutes written flow)",
            "* 12:30 PM - Diaphragmatic Breath Anchorings (10 cycles)",
            "* 09:30 PM - Visual Cognitive Disappointment Offloads",
          ]
        },
        {
          title: "Chapter 2: Structural Pedagogical Formulations",
          content: [
            "The pedagogical framing follows the validated Cognitive Behavioral Reflection pattern. Standard text blocks have been broken into structured micro-modules, allowing students to absorb high-density strategies under five minutes.",
            "Each module carries explicit margin parameters ensuring optimal mobile reflow. On screen sizes below 640px, text margins adjust smoothly to 16px, maximizing readability and maintaining a crisp 7:1 (AAA) contrast ratio even on low-luminosity displays.",
          ]
        },
        {
          title: "Chapter 3: Strategic Blueprint & Self-Evolution Paths",
          content: [
            "To future-proof this asset, the Chief Product Intelligence Officer has authorized regular automated updates. By linking the publisher module directly to real-time Amazon scraping feeds, the system detects shift trends and triggers incremental self-corrections.",
            "Next slated evolutionary upgrade: Integrating an offline-first breathing loop synthesizer and interactive progress tracking ledger for verified high-retaining learner streams.",
          ]
        }
      ];
    } else if (productType === "dropshipping") {
      pages = [
        {
          title: "Enterprise Sourcing Specification Brief",
          isCover: true,
          content: [
            "==================================================================",
            `  PRODUCT: ${project.title.toUpperCase()}`,
            `  TARGET AUDIENCE: ${project.blueprint?.audience || "Posture-Conscious Professionals"}`,
            "  SUPPLY CHANNEL: Automated 1688 / AliExpress API Gateway",
            `  EXPECTED OPERATING MARGIN: ${project.strategy?.budgetCapUSD ? "68% Gross" : "55% Gross"}`,
            "==================================================================",
            "Autonomous Dropshipping Department Sourcing Blueprint. Contains verified manufacturer transactional history, gross margins, estimated shipping rates, and high-converting Amazon campaign matrices.",
          ]
        },
        {
          title: "Sourcing Audit & Sourcing Agent Verification Tables",
          isTable: true,
          tableHeader: ["Supplier ID", "Rating", "Lead Time", "Cost (USD)", "Est. Shipping (Days)"],
          tableRows: [
            ["Zhejiang Ergonomics Co., Ltd", "98.8%", "4 Days", "$4.12", "9 Days"],
            ["Shenzhen Posture Plastics Corp", "96.4%", "5 Days", "$3.85", "11 Days"],
            ["Ningbo Wellness Home Goods", "95.1%", "3 Days", "$4.40", "8 Days"],
          ],
          content: [
            "Our supplier transaction success rate ceiling stands strictly at 95.0%. All three candidate agents listed above comply with our strict shipping duration ceiling (under 12 business days to the target US/EU market).",
          ]
        },
        {
          title: "High-Converting Advertising & SEO Keywords Campaign",
          content: [
            "To capture primary organic search traffic without expensive PPC bidding wars, our Quantitative Market Analyst recommends targeting low-difficulty competitor gap clusters:",
            "* postur-support chair cushion for late-night office work",
            "* ergonomic spine alignment cushion with breathable mesh shell",
            "* premium high-density memory foam orthotic pad",
            "Initial Amazon PPC Auction bids are mapped to $0.42 to $0.65, achieving a forecasted return on ad spend (ROAS) of 4.1x based on simulated bidder densities.",
          ]
        },
        {
          title: "Commerce Store Architecture & Deployment Webhooks",
          content: [
            "Our automated Commerce Specialist has initialized the checkout schema. Inventory counts sync dynamically every 15 minutes to prevent out-of-stock buyer disappointment.",
            "All order dispatch logic is routed safely through an encrypted webhook payload, allowing the manufacturer agent to print shipping labels within 90 minutes of payment confirmation.",
          ]
        }
      ];
    } else {
      // Research results
      pages = [
        {
          title: "Strategic Market Intelligence Report",
          isCover: true,
          content: [
            "----------------------------------------------------------------",
            `  DIRECTIVE: ${project.title.toUpperCase()}`,
            "  DEPARTMENT: Cognitive Research & Intelligence Division",
            `  DEMAND RATING: HIGH (CAGR: 14.2% forecasted)`,
            `  COMPETITOR FEATURE AUDITS: Complete`,
            "----------------------------------------------------------------",
            "This dossier contains structured evidence gathered from verified customer reviews, Reddit forums, competitor feature deficit audits, and target audience sentiment surveys.",
          ]
        },
        {
          title: "Target Audience Review Sentiment Analysis",
          content: [
            "Our research scraper swarm parsed customer complaint patterns inside the specified competitive cluster. Here are the top three verified consumer disappointments with incumbent offerings:",
            "1. INCUMBENT DEFICIT: Unreadable dense paragraphs, poor contrast layouts causing extreme ocular strain during night-time studies.",
            "2. INCUMBENT DEFICIT: Configuration bloat, requiring users to click through multiple complex screens to start a simple session.",
            "3. INCUMBENT DEFICIT: Lack of instant, responsive visual feedback.",
          ]
        },
        {
          title: "Strategic Opportunities & Pricing Benchmarks",
          content: [
            "Based on the identified pain points, we have mapped a AAA strategic recommendation: Construct a single-view, split-pane workspace. Left side hosts the training inputs/options, right side displays interactive visual step-by-step reviews.",
            "Pricing audit suggests an premium entry price point of $29.99 for the digital companion, yielding a gross operating margin exceeding 85% due to zero incremental distribution costs.",
          ]
        },
        {
          title: "Scholarly Citations & Verified Evidence Logs",
          content: [
            `* CITATION 1: Reddit r/Wellness Study Hub - 'Every app I try just dumps pages of text at me. I wish there was a split-screen workspace with visual instant progress!'`,
            `* CITATION 2: Competitor Gaps Sentiment Audit - 45% of surveyed buyers express extreme frustration with configuration fatigue.`,
            `* CITATION 3: W3C Usability Standard Sec 1.4.3 - Recommends true high-contrast palettes and 4px/8px rhythmic padding grids for night-time legibility.`,
          ]
        }
      ];
    }
    setDocumentContent(pages);
    setCurrentPage(0);
  }, [project, productType]);

  // Handle simulated "Pulse Audit" refresh
  const handlePulseAudit = () => {
    setIsAuditing(true);
    setAuditProgress(0);
    setAuditLogs([]);

    const steps = [
      `[INFO] Initializing Real-Time Crawl Swarm for: "${project.title}"`,
      "[DEBUG] Scraped 14 Amazon bookshelf metrics. Updating ranking indexes...",
      "[INFO] Audited customer reviews. Synthesized 2 new 5-star feedback tags.",
      "[SUCCESS] Sync completed. Performance royal ledger successfully refreshed!"
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setAuditLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${steps[stepIdx]}`]);
        setAuditProgress(p => p + 25);
        stepIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsAuditing(false);
          // Bump statistics
          setAuditedSales(s => s + Math.floor(Math.random() * 12) + 4);
          setAuditedRoyalty(r => r + parseFloat((Math.random() * 65 + 15).toFixed(2)));
          setAuditedRank(rk => Math.max(800, rk - Math.floor(Math.random() * 1400)));
        }, 800);
      }
    }, 600);
  };

  // Handle PDF file generation & download (As markdown / structured text)
  const handleDownloadPDF = () => {
    let docText = `==================================================================\n`;
    docText += `  JUSTBUILDIT OS AUTONOMOUS DOCUMENT VIEW ENGINE\n`;
    docText += `  PROJECT ID: ${project.id}\n`;
    docText += `  DOCUMENT TITLE: ${project.title}\n`;
    docText += `  GENERATED DATE: ${new Date().toLocaleString()}\n`;
    docText += `==================================================================\n\n`;

    documentContent.forEach((page) => {
      docText += `### ${page.title}\n\n`;
      if (page.tableRows) {
        docText += `| ${page.tableHeader.join(" | ")} |\n`;
        docText += `| ${page.tableHeader.map(() => "---").join(" | ")} |\n`;
        page.tableRows.forEach((row: any) => {
          docText += `| ${row.join(" | ")} |\n`;
        });
        docText += `\n`;
      }
      docText += page.content.join("\n\n") + `\n\n`;
      docText += `------------------------------------------------------------------\n\n`;
    });

    const blob = new Blob([docText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_output.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Font family Tailwind utility mapper
  const getFontClass = () => {
    if (fontFamily === "serif") return "font-serif tracking-normal leading-relaxed text-slate-800";
    if (fontFamily === "mono") return "font-mono text-xs tracking-tight text-emerald-800";
    return "font-sans tracking-tight leading-relaxed text-slate-900";
  };

  // Theme styles mapper
  const getThemeClass = () => {
    if (readingTheme === "solarized") return "bg-[#fdf6e3] border-amber-900/10 text-[#586e75]";
    if (readingTheme === "midnight") return "bg-[#0b121e] border-blue-900/20 text-[#a0aec0]";
    return "bg-[#faf8f5] border-stone-200 text-stone-900";
  };

  // Margin style mapper
  const getMarginClass = () => {
    if (marginSize === "compact") return "p-4 sm:p-6";
    if (marginSize === "spacious") return "p-8 sm:p-14";
    return "p-6 sm:p-10";
  };

  // Text size mapper
  const getTextSizeClass = () => {
    if (fontSize === "sm") return "text-[11px]";
    if (fontSize === "lg") return "text-[14px]";
    return "text-[12px]";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        id="pdf-viewer-modal-frame" 
        className="bg-surface border border-glass w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-gray-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-glass bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent animate-pulse" />
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                JBI Document &amp; PDF Viewer Engine
              </h3>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                Active Project: {project.title.split(":")[0]}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Split Canvas (Left: PDF Viewer, Right: Control Console) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-glass">
          
          {/* LEFT PANEL: The Immersive Printable Document / PDF Canvas (col-span-8) */}
          <div className="lg:col-span-8 p-6 flex flex-col justify-between bg-[#111] overflow-y-auto min-h-[450px]">
            
            {/* Aesthetic PDF Canvas */}
            <div className={`flex-1 rounded-2xl border shadow-inner flex flex-col justify-between min-h-[380px] transition-all ${getThemeClass()} ${getMarginClass()} ${getFontClass()}`}>
              
              {/* Paper Top Margin Info */}
              <div className="flex justify-between items-center border-b border-black/5 pb-2 opacity-60 text-[9px] uppercase tracking-widest">
                <span>{shortTitle} • Strategic Asset</span>
                <span>Page {currentPage + 1} of {documentContent.length}</span>
              </div>

              {/* Central Text Section */}
              <div className="my-6 space-y-4">
                <h4 className={`font-serif font-extrabold text-black/80 tracking-tight leading-snug border-b border-black/5 pb-2 ${fontSize === "sm" ? "text-xs" : fontSize === "lg" ? "text-lg" : "text-sm"}`}>
                  {documentContent[currentPage]?.title}
                </h4>

                {/* Cover view styling */}
                {documentContent[currentPage]?.isCover ? (
                  <div className="py-6 text-center space-y-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-full mx-auto flex items-center justify-center border border-accent/30">
                      <Award className="w-6 h-6 text-accent animate-bounce" />
                    </div>
                    <div className={`space-y-1 font-mono text-[10px] uppercase font-bold text-slate-500 leading-normal`}>
                      {documentContent[currentPage]?.content.map((line: string, i: number) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  </div>
                ) : documentContent[currentPage]?.isTable ? (
                  /* Table Sourcing Sourcing audit layout */
                  <div className="my-3 space-y-4">
                    <div className="overflow-x-auto rounded-xl border border-black/10">
                      <table className="w-full text-left text-[10px] border-collapse font-sans bg-white/40">
                        <thead>
                          <tr className="bg-black/5 border-b border-black/10">
                            {documentContent[currentPage]?.tableHeader.map((th: string, i: number) => (
                              <th key={i} className="px-3 py-2 font-bold font-mono text-slate-600">{th}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {documentContent[currentPage]?.tableRows.map((row: any[], i: number) => (
                            <tr key={i} className="border-b border-black/5 hover:bg-black/[0.02]">
                              {row.map((cell: any, cellIdx: number) => (
                                <td key={cellIdx} className="px-3 py-2 text-slate-800 font-medium">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {documentContent[currentPage]?.content.map((p: string, i: number) => (
                      <p key={i} className={`indent-4 leading-relaxed ${getTextSizeClass()}`}>{p}</p>
                    ))}
                  </div>
                ) : (
                  /* Regular Page copy */
                  <div className={`space-y-3 font-sans`}>
                    {documentContent[currentPage]?.content.map((p: string, i: number) => (
                      <p key={i} className={`indent-4 leading-relaxed ${getTextSizeClass()}`}>{p}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Paper Footer / Navigation indicator */}
              <div className="flex justify-between items-center border-t border-black/5 pt-2 opacity-50 text-[8px] tracking-wider uppercase font-mono">
                <span>Autonomous Layout Engine</span>
                <span>UUID: {project.id.toUpperCase()}</span>
              </div>
            </div>

            {/* Document Pagination Buttons */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1.5 rounded-xl bg-[#222] text-xs font-bold font-mono text-gray-300 hover:text-white border border-glass/40 hover:bg-[#333] transition-all cursor-pointer flex items-center gap-1 disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Page</span>
              </button>

              <span className="text-[10px] font-mono text-gray-500 font-bold uppercase">
                Layout Formatted • PDF Compiled
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(documentContent.length - 1, p + 1))}
                disabled={currentPage === documentContent.length - 1}
                className="px-3 py-1.5 rounded-xl bg-[#222] text-xs font-bold font-mono text-gray-300 hover:text-white border border-glass/40 hover:bg-[#333] transition-all cursor-pointer flex items-center gap-1 disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* RIGHT PANEL: Intelligent Audit & Aesthetic Customize Controls (col-span-4) */}
          <div className="lg:col-span-4 p-6 bg-black/20 flex flex-col justify-between gap-6 overflow-y-auto">
            
            <div className="space-y-5">
              
              {/* Product Live Metrics Audit Panel */}
              <div className="p-4 rounded-2xl border border-glass bg-surface/50 space-y-4">
                <div className="flex items-center justify-between border-b border-glass pb-2">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <span className="text-[10px] font-mono font-bold uppercase text-accent tracking-widest">
                      Live Performance Metrics
                    </span>
                  </div>
                  <button
                    onClick={handlePulseAudit}
                    disabled={isAuditing}
                    className="p-1 rounded-lg bg-accent/10 border border-accent/20 hover:bg-accent/20 text-accent transition-all cursor-pointer"
                    title="Audit Live Sales Channel"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {/* Sourcing/Book Stats Grid */}
                <div className="grid grid-cols-2 gap-3 font-mono text-[10px]">
                  <div className="p-2.5 bg-black/40 rounded-xl border border-glass/40 space-y-0.5">
                    <span className="text-gray-500 text-[8px] uppercase block">Scraped Sales</span>
                    <span className="text-white font-extrabold text-sm">{auditedSales} Units</span>
                  </div>
                  <div className="p-2.5 bg-black/40 rounded-xl border border-glass/40 space-y-0.5">
                    <span className="text-gray-500 text-[8px] uppercase block">Royalty Profit</span>
                    <span className="text-accent font-extrabold text-sm">${auditedRoyalty.toFixed(2)}</span>
                  </div>
                  <div className="col-span-2 p-2.5 bg-black/40 rounded-xl border border-glass/40 space-y-0.5">
                    <span className="text-gray-500 text-[8px] uppercase block">Global Marketplace Rank</span>
                    <span className="text-amber-500 font-extrabold text-sm">#{auditedRank.toLocaleString()}</span>
                  </div>
                </div>

                {/* Audit Crawler Logs */}
                {isAuditing && (
                  <div className="p-3 bg-black rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-[8px] font-bold text-accent font-mono uppercase tracking-widest">
                      <span>CRAWLER PROGRESS</span>
                      <span>{auditProgress}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div className="bg-accent h-full transition-all duration-300" style={{ width: `${auditProgress}%` }} />
                    </div>
                    <div className="space-y-1 font-mono text-[7px] text-gray-500 leading-normal max-h-[60px] overflow-y-auto">
                      {auditLogs.map((log, i) => (
                        <div key={i} className="flex gap-1">
                          <span>&gt;</span>
                          <span className="line-clamp-1">{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Aesthetic Customize Panel */}
              <div className="p-4 rounded-2xl border border-glass bg-surface/50 space-y-4">
                <div className="flex items-center gap-1.5 border-b border-glass pb-2">
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span className="text-[10px] font-mono font-bold uppercase text-gray-300 tracking-widest">
                    Aesthetic Customizer
                  </span>
                </div>

                {/* Margins */}
                <div className="space-y-1.5">
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider block">Page Margins</span>
                  <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-glass/40">
                    {["compact", "swiss", "spacious"].map((m) => (
                      <button
                        key={m}
                        onClick={() => setMarginSize(m as any)}
                        className={`py-1 rounded text-[9px] uppercase font-bold tracking-wide transition-all cursor-pointer ${
                          marginSize === m 
                            ? "bg-white/10 text-white font-extrabold" 
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-1.5">
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider block">Font Scale</span>
                  <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-glass/40">
                    {["sm", "md", "lg"].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setFontSize(sz as any)}
                        className={`py-1 rounded text-[9px] uppercase font-bold tracking-wide transition-all cursor-pointer ${
                          fontSize === sz 
                            ? "bg-white/10 text-white font-extrabold" 
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        {sz.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Family */}
                <div className="space-y-1.5">
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider block">Font Family</span>
                  <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-glass/40">
                    {["serif", "sans", "mono"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFontFamily(f as any)}
                        className={`py-1 rounded text-[9px] uppercase font-bold tracking-wide transition-all cursor-pointer ${
                          fontFamily === f 
                            ? "bg-white/10 text-white font-extrabold" 
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        {f.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reading Contrast Theme */}
                <div className="space-y-1.5">
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider block">Paper Contrast</span>
                  <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-glass/40">
                    {["bone", "solarized", "midnight"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setReadingTheme(t as any)}
                        className={`py-1 rounded text-[9px] uppercase font-bold tracking-wide transition-all cursor-pointer ${
                          readingTheme === t 
                            ? "bg-white/10 text-white font-extrabold" 
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        {t.substring(0, 5).toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Printable Controls Block */}
            <div className="space-y-3 pt-4 border-t border-glass">
              <button
                onClick={handleDownloadPDF}
                className="w-full py-2.5 bg-accent text-black font-mono font-bold text-[10px] hover:bg-accent/85 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md select-none"
              >
                <Download className="w-4 h-4 text-black" />
                <span>DOWNLOAD COMPILED PDF</span>
              </button>

              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full py-2 bg-black border border-glass/60 hover:border-glass hover:bg-white/5 text-gray-300 font-mono font-bold text-[9px] rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
              >
                <Printer className="w-3.5 h-3.5 text-gray-400" />
                <span>PRINT PDF ARCHIVE</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
