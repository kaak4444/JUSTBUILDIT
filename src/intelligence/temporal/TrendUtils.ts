import { Trend } from "./Trend.ts";

export function isStrongIncrease(trend: Trend): boolean {
    return trend.delta > 20;
}

export function isModerateIncrease(trend: Trend): boolean {
    return trend.delta > 5 && trend.delta <= 20;
}

export function isStrongDecrease(trend: Trend): boolean {
    return trend.delta < -20;
}

export function isModerateDecrease(trend: Trend): boolean {
    return trend.delta < -5 && trend.delta >= -20;
}
