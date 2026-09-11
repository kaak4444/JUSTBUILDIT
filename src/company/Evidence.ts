/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IEvidence {
  id: string;
  source: string;        // e.g. "Reddit r/TOEFL Forum"
  url?: string;          // e.g. "https://reddit.com/r/TOEFL/comments/..."
  title: string;         // e.g. "Complaints on night reading contrasts"
  extractedText: string; // verbatim quote or data point
  confidence: number;    // 0 to 100 confidence score
  timestamp: string;
}

export class EvidenceRegistry {
  private static evidences: IEvidence[] = [
    {
      id: "ev_01",
      source: "Reddit r/TOEFL Forum",
      url: "https://www.reddit.com/r/toefl/comments/night_reading_eyestrain",
      title: "Extremely high eyestrain on current TOEFL preparation platforms",
      extractedText: "I study late at night for TOEFL, and most e-readers have these blinding white overlays. My eyes are burning after 30 minutes! Why is there no true black AMOLED option?",
      confidence: 95,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
      id: "ev_02",
      source: "W3C Usability Standard Section 1.4.3",
      url: "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html",
      title: "Mandatory Contrast (Minimum) guidelines for accessible systems",
      extractedText: "The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for large-scale text or low-light twilight configurations which benefit from a 7:1 ratio.",
      confidence: 100,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
    },
    {
      id: "ev_03",
      source: "Express Logistics SLA Report",
      title: "Transpacific Delivery times optimization index",
      extractedText: "Guaranteed shipping lead time on certified e-commerce cargo channels was reduced from 12 days to 9 days using state-of-the-art regional routing hubs.",
      confidence: 90,
      timestamp: new Date().toISOString()
    }
  ];

  public static listEvidences(): IEvidence[] {
    return this.evidences;
  }

  public static addEvidence(evidence: Omit<IEvidence, "id" | "timestamp">): IEvidence {
    const newEvidence: IEvidence = {
      ...evidence,
      id: `ev_auto_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    this.evidences.unshift(newEvidence);
    return newEvidence;
  }
}
