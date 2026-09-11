/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Decision } from "../decision/Decision.ts";

export interface Simulation {
    scenarioId: string;
    decision: Decision;
    explanation: string;
}

export interface RiskReport {
    originalDecision: Decision;
    simulatedDecisions: Decision[];
    stable: boolean;
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
}
