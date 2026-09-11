/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IDebateOpinion {
  reviewerId: string;
  reviewerName: string;
  role: "Research" | "Design" | "Commerce" | "Legal";
  score: number; // 0 to 100
  opinion: string;
}

export interface IDebateRoom {
  id: string;
  topic: string;
  opinions: IDebateOpinion[];
  consensusReached: boolean;
  finalDecision: string;
  resolvedAt: string;
}

export class ReviewDebate {
  private static debates: IDebateRoom[] = [
    {
      id: "deb_toefl_style",
      topic: "Should the TOEFL academic e-reader default to 100% OLED pitch-black (#000000) or high-contrast twilight navy?",
      opinions: [
        {
          reviewerId: "rev_research",
          reviewerName: "Research Director",
          role: "Research",
          score: 95,
          opinion: "Studies show 75% of night reading complains reference blinking bright spots. Absolute OLED black prevents backlight leakage and boosts memory."
        },
        {
          reviewerId: "rev_design",
          reviewerName: "UX Principal Designer",
          role: "Design",
          score: 80,
          opinion: "OLED black is crisp but requires thick, tracking-aligned typography with high font-weight (Inter/Space Grotesk) to bypass light smearing on cheap displays."
        },
        {
          reviewerId: "rev_commerce",
          reviewerName: "Chief Revenue Officer",
          role: "Commerce",
          score: 85,
          opinion: "Premium subscribers appreciate authentic dark presentation. It makes the diagnostic reader feel like a specialized high-fidelity book simulator."
        }
      ],
      consensusReached: true,
      finalDecision: "Enforce absolute #000000 pitch-black styling paired with bold Space Grotesk 700 tracking headings to maximize visual clarity.",
      resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
    },
    {
      id: "deb_customs_tariff",
      topic: "German Tariff Declaration checkout layout structure",
      opinions: [
        {
          reviewerId: "rev_legal",
          reviewerName: "EU Legal Counsel",
          role: "Legal",
          score: 100,
          opinion: "German customs require explicit breakdown before user clicks payment. Hidden terms risk heavy compliance litigation."
        },
        {
          reviewerId: "rev_design",
          reviewerName: "UX Principal Designer",
          role: "Design",
          score: 70,
          opinion: "Adding dynamic pricing grids risks visual layout shifting. We must render a stable sticky container next to the product summary."
        }
      ],
      consensusReached: true,
      finalDecision: "Incorporate a static sticky order summary card detailing German customs tax breakdowns transparently next to the cart checkout form.",
      resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
    }
  ];

  static listDebates(): IDebateRoom[] {
    return this.debates;
  }

  static createDebate(topic: string, opinions: IDebateOpinion[]): IDebateRoom {
    const avgScore = opinions.reduce((acc, o) => acc + o.score, 0) / opinions.length;
    const finalDecision = avgScore > 75 
      ? `Consensus reached on: "${topic}"! Resolved via design language compliance standards.`
      : `Halted: Differing opinions require manual stakeholder intervention.`;

    const debate: IDebateRoom = {
      id: `deb_auto_${Date.now()}`,
      topic,
      opinions,
      consensusReached: avgScore > 75,
      finalDecision,
      resolvedAt: new Date().toISOString()
    };

    this.debates.unshift(debate);
    return debate;
  }
}
