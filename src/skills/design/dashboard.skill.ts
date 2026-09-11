/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const DashboardSkill = {
  name: "Dashboard Analytics",
  prepare() {
    console.log("[DashboardSkill] Establishing bento grid grids...");
  },
  validate(content: any) {
    return !!content;
  },
  examples: [
    {
      component: "Performance Chart Card",
      classes: "bg-surface/30 p-5 rounded-2xl border border-glass"
    }
  ],
  rules: [
    "Present density and rhythm; show major KPIs clearly with larger display numbers.",
    "Order items logically: Summary KPIs at the top, detail grids/charts below.",
    "Minimize clutter. Status flags and logging details should be tiny and secondary."
  ],
  references: [
    "D3 Data Visualizations",
    "Stripe Analytics Layout"
  ]
};
