/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const LayoutSkill = {
  name: "Layout Grid & rhythm",
  prepare() {
    console.log("[LayoutSkill] Initializing 8px micro-grid calculations...");
  },
  validate(content: any) {
    return !!content;
  },
  examples: [
    {
      pattern: "Bento Grid Layout",
      classes: "grid grid-cols-1 md:grid-cols-3 gap-6"
    }
  ],
  rules: [
    "Never hardcode dimensions without considering viewport variance.",
    "Rhythm spacing must strictly follow multiples of 8px (e.g., gap-2, p-4, m-8).",
    "Isolate floating panels using subtle transparent glass backgrounds and clean card borders."
  ],
  references: [
    "Refactoring UI by Steve Schoger",
    "Stripe Layout System"
  ]
};
