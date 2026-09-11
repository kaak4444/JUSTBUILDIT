/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const LogoSkill = {
  name: "Logo Design System",
  prepare() {
    console.log("[LogoSkill] Standardizing visual symbol constraints...");
  },
  validate(content: any) {
    return !!content;
  },
  examples: [
    {
      symbol: "Abstract Geometric Emblem",
      geometry: "Interlocking triangles on a square dark slate background"
    }
  ],
  rules: [
    "Prioritize scalability - the logo symbol must be legible at 16x16px as well as on giant banners.",
    "A logo should use minimal shapes, conveying a clear conceptual metaphor without complex lines.",
    "Maintain high-contrast silhouette compliance: verify logo is legible in pure black or pure white."
  ],
  references: [
    "Chermayeff & Geismar & Haviv Brand Guidelines",
    "Figma Community Logo kits"
  ]
};
