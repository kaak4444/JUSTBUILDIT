/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const MobileSkill = {
  name: "Mobile UI Architecture",
  prepare() {
    console.log("[MobileSkill] Initializing touch target metrics...");
  },
  validate(content: any) {
    return !!content;
  },
  examples: [
    {
      element: "Primary Navigation Bar",
      style: "fixed bottom-0 left-0 right-0 h-16 bg-black/95 border-t border-glass px-6 flex justify-around"
    }
  ],
  rules: [
    "Ensure touch targets are at least 44px by 44px to accommodate safe tap gestures.",
    "Place destructive or crucial primary triggers within safe, easy-to-reach ergonomic zones.",
    "Enforce responsive fluid grid containers using flex-col md:flex-row configurations."
  ],
  references: [
    "iOS Human Interface Guidelines - Layout",
    "Android Material Design Touch Targets"
  ]
};
