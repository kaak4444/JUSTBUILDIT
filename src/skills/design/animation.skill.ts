/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const AnimationSkill = {
  name: "Animation & Motion Systems",
  prepare() {
    console.log("[AnimationSkill] Pre-computing spring stiffness values...");
  },
  validate(content: any) {
    return !!content;
  },
  examples: [
    {
      transition: "Modal Entrance",
      motionConfig: "initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}"
    }
  ],
  rules: [
    "Never use linear or jarring transition presets. Always configure spring animations for physical weight and fluid reactions.",
    "Keep duration fast (between 150ms and 300ms) to ensure actions feel snappy and responsive.",
    "Avoid gratuitous animation on dense dashboards. Animation should purely guide focus or show structural changes."
  ],
  references: [
    "Motion React Guidelines",
    "Framer Motion Spring Physics"
  ]
};
