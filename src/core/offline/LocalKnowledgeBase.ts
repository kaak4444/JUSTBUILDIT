/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CachedInsight {
  category: string;
  query: string;
  insight: string;
  confidenceScore: number;
  cachedAt: string;
}

export class LocalKnowledgeBase {
  private static insights: CachedInsight[] = [
    {
      category: "self_improvement_books",
      query: "Top complaints about morning routine guides",
      insight: "Overly repetitive, too many filler pages, and lacks simple printable checklists. Action: Restructure guides into concise 15-minute action prompts, and provide dedicated visual checkboxes.",
      confidenceScore: 98,
      cachedAt: "2026-06-30"
    },
    {
      category: "dropship_spinal_pillows",
      query: "Frustration loops for spine supports and seats",
      insight: "Users report seat slides forward on leather chairs and standard straps tear within two weeks. Action: Recommend double-anchored rubberized bottom grips and high-density memory foam specifications.",
      confidenceScore: 94,
      cachedAt: "2026-07-01"
    },
    {
      category: "kindle_marketing",
      query: "A/B test pricing sweet spots",
      insight: "Price point of $3.99 for Kindle eBooks captures 42% higher total royalties than $2.99 due to KDP's 70% threshold dynamics.",
      confidenceScore: 91,
      cachedAt: "2026-06-25"
    },
    {
      category: "color_contrast",
      query: "Eye catching thumbnail combos for books",
      insight: "Monochromatic slate backgrounds with highly saturated warm amber typography (#FFB000) have a 14.8% higher click-through-ratio compared to standard gradients.",
      confidenceScore: 89,
      cachedAt: "2026-06-28"
    }
  ];

  public static queryLocal(category: string, query: string): CachedInsight | undefined {
    return this.insights.find(
      insight => insight.category === category || insight.query.toLowerCase().includes(query.toLowerCase())
    );
  }

  public static listAllCachedInsights(): CachedInsight[] {
    return this.insights;
  }
}
