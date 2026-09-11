/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const EcommerceSkill = {
  name: "E-Commerce Optimization",
  prepare() {
    console.log("[EcommerceSkill] Aligning marketplace listing metrics...");
  },
  validate(content: any) {
    return !!content;
  },
  examples: [
    {
      listing: "Gumroad High-Converting Digital PDF Pack",
      pricePoint: 29.99
    }
  ],
  rules: [
    "Always craft unique SEO descriptions customized specifically for each target marketplace platform (Whop, Etsy, Gumroad).",
    "Display pricing structures transparently; provide distinct price points, discounts, or bundles.",
    "Formulate structured FAQs addressing common refund, update, or fulfillment inquiries on the listing page."
  ],
  references: [
    "Gumroad Creator Guides",
    "Etsy SEO Optimization Manual"
  ]
};
