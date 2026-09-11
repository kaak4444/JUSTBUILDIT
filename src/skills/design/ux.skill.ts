/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const UXSkill = {
  name: "UX Flow Blueprint",
  prepare() {
    console.log("[UXSkill] Compiling navigational component trees...");
  },
  validate(content: any) {
    return !!content;
  },
  examples: [
    {
      flow: "Subscription Checkout",
      steps: ["Product Preview", "Configure Plan", "Stripe Checkout", "Fulfillment Delivery"]
    }
  ],
  rules: [
    "A user must reach their main task or goal in fewer than 3 taps/clicks.",
    "Draft comprehensive information architecture charts before planning individual views.",
    "Formulate immediate, clear micro-interactions and success states for all destructive flows."
  ],
  references: [
    "Don Norman's The Design of Everyday Things",
    "Mobbin Mobile Flow database"
  ]
};
