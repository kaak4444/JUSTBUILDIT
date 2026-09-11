/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const LandingSkill = {
  name: "Landing Page Conversion",
  prepare() {
    console.log("[LandingSkill] Framing premium hero layouts...");
  },
  validate(content: any) {
    return !!content;
  },
  examples: [
    {
      section: "Hero Call to Action",
      headline: "The Premium Strategy Operating System"
    }
  ],
  rules: [
    "Place the core value proposition above the fold in clear, bold display typography.",
    "Ensure the primary CTA is high-contrast, visually prominent, and instantly clickable.",
    "Integrate trust signals (testimonials, partner logos, or audit ratings) directly into the stream."
  ],
  references: [
    "Harry's Marketing Examples",
    "Tailwind UI Hero Sections"
  ]
};
