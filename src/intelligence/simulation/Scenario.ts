/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Scenario {
    id: string;
    name: string;
    beliefChanges: {
        beliefId: string;
        newConfidence: number;
    }[];
}
