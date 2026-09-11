export interface Trend {
    metric: string;
    previous: number;
    current: number;
    delta: number;
    direction: "UP" | "DOWN" | "STABLE";
}
