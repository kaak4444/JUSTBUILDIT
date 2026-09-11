/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SourceRegistry } from "./SourceRegistry.ts";
import { ObservationEngine } from "./ObservationEngine.ts";
import { KnowledgeExtractor } from "./KnowledgeExtractor.ts";
import { ProblemClusterEngine } from "./ProblemClusterEngine.ts";
import { TrendEngine } from "./TrendEngine.ts";
import { CompetitorEngine } from "./CompetitorEngine.ts";
import { OpportunityEngine } from "./OpportunityEngine.ts";
import { CuriosityEngine } from "./CuriosityEngine.ts";
import { WorldGraphBuilder } from "./WorldGraphBuilder.ts";
import { EvidenceRepository } from "./EvidenceRepository.ts";
import { KnowledgeCompressionEngine } from "./KnowledgeCompressionEngine.ts";
import { AcquisitionPlanner } from "./AcquisitionPlanner.ts";
import { WorldGraph, Relationship } from "./types.ts";
import { BeliefEngine } from "./beliefs/BeliefEngine.ts";
import { BeliefStore } from "./beliefs/BeliefStore.ts";
import { ReasoningEngine } from "./reasoning/ReasoningEngine.ts";
import { DecisionEngine } from "./decision/DecisionEngine.ts";
import { SnapshotHistory } from "./temporal/SnapshotHistory.ts";
import { TemporalAnalyzer } from "./temporal/TemporalAnalyzer.ts";
import { PredictionStore } from "./predictions/PredictionStore.ts";
import { PredictionEngine } from "./predictions/PredictionEngine.ts";
import { PredictionEvaluator } from "./predictions/PredictionEvaluator.ts";
import { SimulationEngine } from "./simulation/SimulationEngine.ts";



export class IntelligencePipeline {
  private static worldGraph: WorldGraph = {
    companies: new Map(),
    technologies: new Map(),
    problems: new Map(),
    problemClusters: new Map(),
    trends: new Map(),
    evidence: new Map(),
    relationships: [],
    opportunities: new Map(),

    // v2.0 Extended Nodes Maps
    products: new Map(),
    repositories: new Map(),
    packages: new Map(),
    videos: new Map(),
    tutorials: new Map(),
    designSystems: new Map(),
    communities: new Map(),
    courses: new Map(),
    books: new Map(),
    patents: new Map(),
    laws: new Map(),
    countries: new Map(),
    people: new Map(),
    authors: new Map(),
    standards: new Map(),
    frameworks: new Map(),
    libraries: new Map(),
    marketplaces: new Map(),
    pricingPlans: new Map(),
    subscriptions: new Map(),
    features: new Map(),
    reviews: new Map()
  };

  private static pipelineLogs: any[] = [];

  private graphBuilder = new WorldGraphBuilder();
  private evidenceRepo = new EvidenceRepository();
  private compressionEngine = new KnowledgeCompressionEngine();
  private planner = new AcquisitionPlanner();
  private beliefEngine = new BeliefEngine();
  private beliefStore = BeliefStore.getInstance();

  constructor(
    public readonly sources = new SourceRegistry(),
    public readonly observation = new ObservationEngine(),
    public readonly extractor = new KnowledgeExtractor(),
    public readonly clustering = new ProblemClusterEngine(),
    public readonly trends = new TrendEngine(),
    public readonly competitors = new CompetitorEngine(),
    public readonly opportunitiesEngine = new OpportunityEngine(),
    public readonly curiosity = new CuriosityEngine()
  ) {}

  public static getWorldGraph(): WorldGraph {
    return this.worldGraph;
  }

  public static getPipelineLogs(): any[] {
    return this.pipelineLogs;
  }

  public static logPipelineEvent(phase: string, message: string, payload?: any) {
    this.pipelineLogs.unshift({
      id: `ipl_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      phase,
      message,
      payload
    });
  }

  /**
   * Executes the complete, incremental active intelligence acquisition and learning loop.
   */
  public async execute(query: string): Promise<WorldGraph> {
    IntelligencePipeline.logPipelineEvent("ACQUISITION_INITIATED", `Starting incremental 9-phase intelligence cycle for "${query}"...`);

    try {
      // 1. Load active graph state
      IntelligencePipeline.worldGraph = await this.graphBuilder.loadGraph();

      // 2. Formulate dynamic Acquisition Plan
      const plan = await this.planner.planAcquisition(query, IntelligencePipeline.worldGraph);
      IntelligencePipeline.logPipelineEvent("ACQUISITION_PLAN_FORMULATED", `Identified knowledge prerequisites for "${query}".`, { plan });

      // 3. Scan & Observe Sources
      const activeSources = this.sources.listEnabledSources();
      let rawDocuments: any[] = [];
      
      for (const source of activeSources) {
        const docs = await this.observation.observe(source, query);
        rawDocuments.push(...docs);
      }
      IntelligencePipeline.logPipelineEvent("RAW_DOCUMENTS_INGESTED", `Successfully ingested ${rawDocuments.length} source documents.`, { count: rawDocuments.length });

      // 4. Extraction Engine
      const { evidence, problems, companies, technologies } = await this.extractor.extractGroundedFacts(rawDocuments);
      
      for (const ev of evidence) {
        IntelligencePipeline.worldGraph.evidence.set(ev.id, ev);
        await this.evidenceRepo.save(ev); // Persist to evidence store
        
        // Convert to belief and persist to BeliefStore
        const belief = this.beliefEngine.createBelief(ev);
        this.beliefStore.add(belief);
      }

      // Execute Temporal Intelligence Step (Before Causal Reasoning)
      try {
        const history = SnapshotHistory.getInstance();
        const latestSnapshot = history.latest();
        const previousSnapshot = history.previous();
        if (latestSnapshot && previousSnapshot) {
          const analyzer = TemporalAnalyzer.getInstance();
          const trends = analyzer.analyze(previousSnapshot, latestSnapshot);
          IntelligencePipeline.logPipelineEvent("TEMPORAL_ANALYSIS_COMPLETED", `Analyzed ${trends.length} key metrics. Calculated MoM/DoD changes and delta-direction shifts.`, { trendCount: trends.length });
          
          const trendBeliefs = this.beliefEngine.createBeliefsFromTrends(trends);
          for (const tb of trendBeliefs) {
            this.beliefStore.add(tb);
          }
        }
      } catch (temporalErr) {
        console.error("Temporal Intelligence analysis failed:", temporalErr);
      }

      // Execute Causal Reasoning & Decision Engine
      try {
        const activeBeliefs = this.beliefStore.getAll();

        // 1. Evaluate any outstanding predictions against current beliefs
        try {
          PredictionEvaluator.getInstance().evaluate(activeBeliefs);
        } catch (evalErr) {
          console.error("Prediction evaluation failed:", evalErr);
        }

        const outcome = ReasoningEngine.getInstance().infer(activeBeliefs);
        IntelligencePipeline.logPipelineEvent("CAUSAL_REASONING_COMPLETED", `Successfully evaluated ${activeBeliefs.length} beliefs and produced causal reasoning structures.`, { beliefCount: activeBeliefs.length });

        // Synthesize a trial decision first to use as originalDecision in simulation
        const trialDecision = DecisionEngine.getInstance().evaluate(outcome.inferences, false);

        // Run Simulation Engine on three high-risk scenarios (Step 8 & 9)
        let riskReport = null;
        try {
          const simEngine = SimulationEngine.getInstance();
          riskReport = simEngine.generateRiskReport(trialDecision, activeBeliefs);
          
          IntelligencePipeline.logPipelineEvent(
            "RISK_SIMULATION_COMPLETED", 
            `Simulation of 3 high-risk scenarios completed. Risk level assessed as: ${riskReport.riskLevel}.`, 
            { 
              riskLevel: riskReport.riskLevel, 
              stable: riskReport.stable,
              simulations: riskReport.simulatedDecisions.map((d, i) => ({
                scenario: simEngine.getScenarios()[i].name,
                simulatedAction: d.action
              }))
            }
          );
        } catch (simErr) {
          console.error("Scenario simulation failed:", simErr);
        }

        // Synthesize final executive choice from causal inferences and record to history
        const decision = DecisionEngine.getInstance().evaluate(outcome.inferences);

        // Append risk simulation advisory details to reasoning array if available (Step 8 & 9)
        if (riskReport) {
          decision.reasoning.push(`[Scenario Planning Advisory] Risk assessed as ${riskReport.riskLevel} (Stable: ${riskReport.stable}).`);
          for (let i = 0; i < riskReport.simulatedDecisions.length; i++) {
            const sc = SimulationEngine.getInstance().getScenarios()[i];
            const sd = riskReport.simulatedDecisions[i];
            decision.reasoning.push(` - If "${sc.name}" occurs, action changes to: ${sd.action}`);
          }
        }

        IntelligencePipeline.logPipelineEvent("EXECUTIVE_DECISION_GENERATED", `Executive choice synthesized: ${decision.action} with confidence ${(decision.confidence * 100).toFixed(0)}%`, { action: decision.action, id: decision.id });

        // 2. Synthesize strategic forecasts (predictions) from the new decision
        try {
          const predictions = PredictionEngine.getInstance().create(decision);
          const predStore = PredictionStore.getInstance();
          for (const p of predictions) {
            predStore.add(p);
          }
          if (predictions.length > 0) {
            IntelligencePipeline.logPipelineEvent("STRATEGIC_PREDICTIONS_REGISTERED", `Generated ${predictions.length} forward-looking predictions tied to decision ${decision.id}`, { decisionId: decision.id, count: predictions.length });
          }
        } catch (predErr) {
          console.error("Prediction synthesis failed:", predErr);
        }
      } catch (reasoningErr) {
        console.error("Causal reasoning or Decision execution failed:", reasoningErr);
      }
      for (const p of problems) {
        // Incremental check: Only insert if not a duplicate statement
        const duplicate = Array.from(IntelligencePipeline.worldGraph.problems.values()).some(
          existing => existing.text.toLowerCase().trim() === p.text.toLowerCase().trim()
        );
        if (!duplicate) {
          IntelligencePipeline.worldGraph.problems.set(p.id, p);
        }
      }
      for (const c of companies) {
        const existing = Array.from(IntelligencePipeline.worldGraph.companies.values()).find(
          ec => ec.name.toLowerCase() === c.name.toLowerCase()
        );
        if (existing) {
          // Incremental merge
          existing.products = Array.from(new Set([...existing.products, ...c.products]));
          existing.pricing = Array.from(new Set([...existing.pricing, ...c.pricing]));
          existing.strengths = Array.from(new Set([...existing.strengths, ...c.strengths]));
          existing.weaknesses = Array.from(new Set([...existing.weaknesses, ...c.weaknesses]));
        } else {
          IntelligencePipeline.worldGraph.companies.set(c.id, c);
        }
      }
      for (const t of technologies) {
        const existing = Array.from(IntelligencePipeline.worldGraph.technologies.values()).find(
          et => et.name.toLowerCase() === t.name.toLowerCase()
        );
        if (existing) {
          existing.documentation = Array.from(new Set([...existing.documentation, ...t.documentation]));
        } else {
          IntelligencePipeline.worldGraph.technologies.set(t.id, t);
        }
      }
      IntelligencePipeline.logPipelineEvent("EVIDENCE_EXTRACTED", `Incremental facts mapped: ${evidence.length} facts, ${problems.length} problems, ${technologies.length} technologies.`, { count: evidence.length });

      // 5. Semantic Clustering
      const rawProblemsList = Array.from(IntelligencePipeline.worldGraph.problems.values());
      const clusters = await this.clustering.clusterProblems(rawProblemsList);
      
      for (const cl of clusters) {
        const existing = Array.from(IntelligencePipeline.worldGraph.problemClusters.values()).find(
          ec => ec.title.toLowerCase() === cl.title.toLowerCase()
        );
        if (existing) {
          existing.totalMentions += cl.totalMentions;
          existing.representativeProblems = Array.from(new Set([...existing.representativeProblems, ...cl.representativeProblems]));
          existing.averageSeverity = Math.round((existing.averageSeverity + cl.averageSeverity) / 2);
        } else {
          IntelligencePipeline.worldGraph.problemClusters.set(cl.id, cl);
        }
      }
      IntelligencePipeline.logPipelineEvent("PROBLEMS_CLUSTERED", `Consolidated problems into active semantic clusters.`, { count: clusters.length });

      // 6. Dynamic Trend Analysis
      const detectedTrends = await this.trends.detectTrends(query, rawProblemsList.length || 10);
      for (const trnd of detectedTrends) {
        IntelligencePipeline.worldGraph.trends.set(trnd.id, trnd);
      }
      IntelligencePipeline.logPipelineEvent("TRENDS_DETECTED", `Calculated trends and calculus velocity histories.`, { count: detectedTrends.length });

      // 7. Dynamic Competitor Profiling
      const analyzedCompetitors = await this.competitors.analyzeCompetitors(query);
      for (const comp of analyzedCompetitors) {
        const existing = Array.from(IntelligencePipeline.worldGraph.companies.values()).find(
          ec => ec.name.toLowerCase() === comp.name.toLowerCase()
        );
        if (existing) {
          existing.weaknesses = Array.from(new Set([...existing.weaknesses, ...comp.weaknesses]));
          existing.strengths = Array.from(new Set([...existing.strengths, ...comp.strengths]));
        } else {
          IntelligencePipeline.worldGraph.companies.set(comp.id, comp);
        }
      }
      IntelligencePipeline.logPipelineEvent("COMPETITORS_PROFILED", `Compiled weakness matrices.`, { count: analyzedCompetitors.length });

      // 8. Scientific Opportunity Ranking
      const activeClustersList = Array.from(IntelligencePipeline.worldGraph.problemClusters.values());
      const opportunities = this.opportunitiesEngine.rank(activeClustersList);
      
      for (const opp of opportunities) {
        const existing = Array.from(IntelligencePipeline.worldGraph.opportunities.values()).find(
          eo => eo.title.toLowerCase() === opp.title.toLowerCase()
        );
        if (existing) {
          existing.confidenceScore = Math.max(existing.confidenceScore, opp.confidenceScore);
        } else {
          IntelligencePipeline.worldGraph.opportunities.set(opp.id, opp);
        }
      }
      IntelligencePipeline.logPipelineEvent("OPPORTUNITIES_RANKED", `Formulated opportunities without database deletions.`, { count: opportunities.length });

      // 9. Build Knowledge Graph Edges with verification metadata
      for (const opp of opportunities) {
        for (const comp of analyzedCompetitors) {
          this.graphBuilder.addEdge(IntelligencePipeline.worldGraph, {
            from: opp.id,
            to: comp.id,
            relation: "competes",
            confidence: opp.confidenceScore,
            evidence: opp.evidenceIds
          });
        }
      }

      // 10. Run Curiosity Blindspot Checker & generate SkillPackages for unrecognized technologies
      const curiosityTasks = this.curiosity.inspect(query, {}, IntelligencePipeline.worldGraph);
      for (const task of curiosityTasks) {
        if (task.unfamiliarTechnology) {
          // Immediately learn and generate pristine SkillPackage
          this.curiosity.acquireSkill(task.unfamiliarTechnology, evidence);
        }
      }

      // 11. Run Compression and Learning Consolidation
      await this.compressionEngine.compress(IntelligencePipeline.worldGraph);

      // Persist active graph state back to storage
      await this.graphBuilder.saveGraph(IntelligencePipeline.worldGraph);

      IntelligencePipeline.logPipelineEvent("PIPELINE_COMPLETE", "Incremental active intelligence and learning cycle completed.", {
        evidenceCount: IntelligencePipeline.worldGraph.evidence.size,
        opportunitiesCount: IntelligencePipeline.worldGraph.opportunities.size,
        companiesCount: IntelligencePipeline.worldGraph.companies.size
      });

    } catch (err: any) {
      const errMsg = err?.message || err;
      IntelligencePipeline.logPipelineEvent("PIPELINE_ERROR", `Pipeline failed: ${errMsg}`, { error: err });
    }

    return IntelligencePipeline.worldGraph;
  }
}
