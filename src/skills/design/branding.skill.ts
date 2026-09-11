/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const BrandingSkill = {
  name: "Branding & Identity System",
  prepare() {
    console.log("[BrandingSkill] Defining brand personality metrics...");
  },
  validate(content: any) {
    return !!content;
  },
  examples: [
    {
      tone: "Elegant, elite, and minimalist",
      vocabulary: ["orchestrate", "precision", "formulate", "blueprint"]
    }
  ],
  rules: [
    "Define a consistent semantic vocabulary representing the core brand voice.",
    "Formulate an intentional 3-color palette (Primary, Neutral Surface, Accent). Never pollute with raw secondary hues.",
    "Draft tone and communication instructions that avoid generic sales-pitch hype."
  ],
  references: [
    "Vercel Brand Book",
    "Notion Visual Identity Guides"
  ]
};
