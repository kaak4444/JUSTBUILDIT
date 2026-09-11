/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const PremiumUISkill = {
  name: "Premium UI",
  prepare() {
    console.log("[PremiumUISkill] Instantiating high-end design variables...");
  },
  validate(content: any) {
    return !!content;
  },
  examples: [
    {
      theme: "Minimalist Slate Dark",
      container: "bg-neutral-900 border border-white/5 rounded-2xl shadow-2xl shadow-black/40"
    }
  ],
  rules: [
    "Never use generic high-intensity saturated gradients. Prefer smooth, single-step transitions.",
    "Always apply extremely soft border highlights (border-white/5 or border-black/5) to separate sections.",
    "Inject generous negative space to ensure visual focus on key interactive features."
  ],
  references: [
    "Linear Design Principles",
    "Apple VisionOS Spatial Principles"
  ]
};
