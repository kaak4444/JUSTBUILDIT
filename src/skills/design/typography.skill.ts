/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const TypographySkill = {
  name: "Typography & Layout Craft",
  prepare() {
    console.log("[TypographySkill] Preparing typography assets & pairings...");
  },
  validate(content: any) {
    if (!content) return false;
    return true;
  },
  examples: [
    {
      pairing: "Space Grotesk + Inter",
      useCase: "Modern high-contrast tech dashboard",
      headingClass: "font-sans tracking-tight font-bold text-white",
      bodyClass: "font-sans text-gray-400 leading-relaxed"
    }
  ],
  rules: [
    "Always pair primary and display font carefully. Use Inter for core reading speed.",
    "Define precise letter-spacing (tracking-tight) on headings above 24px.",
    "Ensure readable line heights: leading-snug for headings, leading-relaxed for body copy."
  ],
  references: [
    "Apple Human Interface Guidelines - Typography",
    "Google Material Design Type Scale"
  ]
};
