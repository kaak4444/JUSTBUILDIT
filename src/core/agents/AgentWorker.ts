/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Agent, TaskResult } from "./WorkerTypes";
import { TaskNode } from "../tasking/TaskNode";

export class BaseAgentWorker implements Agent {
  public id: string;
  public name: string;
  public type: string;
  public status: "IDLE" | "RUNNING" | "WAITING" | "FAILED" = "IDLE";
  public maxConcurrency: number;
  public currentTasksCount: number = 0;
  public performanceScore: number;
  public tasksCompleted: number;

  constructor(id: string, name: string, type: string, maxConcurrency: number = 2) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.maxConcurrency = maxConcurrency;
    this.performanceScore = 85 + Math.floor(Math.random() * 15);
    this.tasksCompleted = Math.floor(Math.random() * 50) + 10;
  }

  public async execute(task: TaskNode): Promise<TaskResult> {
    if (this.currentTasksCount >= this.maxConcurrency) {
      this.status = "WAITING";
      throw new Error(`Agent ${this.name} (${this.id}) is at max concurrency capacity.`);
    }

    this.currentTasksCount++;
    this.status = "RUNNING";
    const startTime = Date.now();

    // Generate specialized agent-type output descriptions
    const delay = 1500 + Math.random() * 2000; // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    let output: any = {};
    let success = true;
    let errorMsg: string | undefined;

    try {
      switch (this.type) {
        case "RESEARCH":
          output = {
            keywords: ["mindfulness", "daily habits", "morning journal", "anxiety relief", "wellness templates"],
            competitors: ["5 Minute Journal (Rating: 4.7, Price: $14.99)", "Atomic Habits Planner (Rating: 4.8, Price: $16.50)"],
            unmetNeeds: "Standard user complaint: 'Not enough empty journaling space.' and 'Binding falls apart.' Solution: Hardcover split, 150 pages max.",
            marketOpportunityScore: 92
          };
          break;
        case "WRITER":
          output = {
            chapters: [
              { title: "Chapter 1: The Sanctuary of Mornings", wordsCount: 1850, approved: true },
              { title: "Chapter 2: Clearing the Synaptic Noise", wordsCount: 2100, approved: true },
              { title: "Chapter 3: Building Unshakeable Focus Hooks", wordsCount: 1950, approved: true }
            ],
            textSample: "True presence begins with the quiet breath before the screens awake. By committing just ten minutes of unfiltered reflection...",
            totalWordsCount: 5900
          };
          break;
        case "DESIGN":
          output = {
            coverArtUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600&auto=format&fit=crop",
            palette: ["#121212", "#059669", "#F59E0B", "#FDFBF7"],
            dimensions: "6x9 inches bleed-compatible",
            artworkPrompt: "Minimalist emerald green cover, subtle gold foil geometric lines, matte texture"
          };
          break;
        case "SEO":
          output = {
            indexedKeywords: ["self-guided mindfulness workbook", "daily reflection tracker", "habit loops planner", "anxiety journal for adults"],
            searchVolumeTotal: "45,200 queries/month",
            optimizedTitle: "The Serene Reader: A Daily 10-Minute Prompt Companion to Refocus and Destress"
          };
          break;
        case "PRICING":
          output = {
            optimalPrice: "$12.99 Paperback / $4.99 eBook",
            marginPercentage: "68.2%",
            printingCost: "$3.25 KDP Standard Print",
            estimatedRoyaltyPerSale: "$5.84"
          };
          break;
        case "FORMATTER":
          output = {
            pdfStatus: "COMPILED_READY",
            epubStatus: "VALIDATED_CLEAN",
            interiorSpinesCount: "128 pages offset",
            outputBlobSize: "14.2 MB Vector Layout"
          };
          break;
        case "PUBLISH":
          output = {
            publishedLink: `https://www.amazon.com/dp/B07${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            platform: "KDP Bookshelf",
            asin: `B07${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            status: "LIVE_ON_MARKET"
          };
          break;
        default:
          output = {
            status: "GENERIC_COMPLETED",
            details: `Task processed by agent worker of type [${this.type}]`
          };
      }
    } catch (e: any) {
      success = false;
      errorMsg = e.message || "Unknown error during agent task processing";
    } finally {
      this.currentTasksCount--;
      this.status = this.currentTasksCount > 0 ? "RUNNING" : "IDLE";
      this.tasksCompleted++;
    }

    return {
      taskId: task.id,
      success,
      output,
      error: errorMsg,
      duration: Math.round(Date.now() - startTime),
      completedAt: Date.now()
    };
  }
}
