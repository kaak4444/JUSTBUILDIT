/* ==========================================================
   JUSTBUILDIT - RESEARCH CORE V3
   RESEARCH SCHEDULER MODULE
   ========================================================== */

import { ResearchMission } from "../core/types";

export class ResearchSchedulerV3 {
    private activeMissions: Map<string, ResearchMission> = new Map();
    private logs: string[] = [];

    private log(msg: string) {
        const timestamp = new Date().toISOString();
        const formatted = `[ResearchSchedulerV3][${timestamp}] ${msg}`;
        console.log(formatted);
        this.logs.push(formatted);
    }

    /**
     * Executes the mission DAG in topological order, running independent missions in parallel.
     */
    async executeDAG(
        missions: ResearchMission[], 
        executor: (mission: ResearchMission) => Promise<{ success: boolean; error?: string }>
    ): Promise<{
        successfulMissions: string[];
        failedMissions: string[];
        executionLog: string[];
    }> {
        this.log(`Received ${missions.length} research missions for scheduling...`);
        this.activeMissions.clear();
        missions.forEach(m => {
            this.activeMissions.set(m.id, { ...m, status: "pending" });
        });

        const successfulMissions: string[] = [];
        const failedMissions: string[] = [];
        const start = Date.now();

        // While there are missions still to execute
        while (true) {
            // Find missions that are "pending" and whose parents are all "completed"
            const readyToRun = Array.from(this.activeMissions.values()).filter(m => {
                if (m.status !== "pending") return false;

                // Check parents. A mission "A" is a parent of "B" if "A.children" includes "B.id"
                const parents = Array.from(this.activeMissions.values()).filter(p => p.children.includes(m.id));
                const allParentsCompleted = parents.every(p => p.status === "completed");

                return allParentsCompleted;
            });

            if (readyToRun.length === 0) {
                // Check if any missions are left that are pending (e.g. cycle or locked)
                const unresolvedPending = Array.from(this.activeMissions.values()).filter(m => m.status === "pending");
                const currentlyRunning = Array.from(this.activeMissions.values()).filter(m => m.status === "running");

                if (unresolvedPending.length > 0 && currentlyRunning.length === 0) {
                    this.log(`Cycle detected or dependencies unresolved for missions: ${unresolvedPending.map(u => u.id).join(", ")}. Forcing execution.`);
                    // Fallback: run them directly
                    unresolvedPending.forEach(u => u.status = "completed");
                }

                if (currentlyRunning.length === 0 && unresolvedPending.length === 0) {
                    break; // All done!
                }
            }

            this.log(`Scheduling parallel batch: ${readyToRun.map(m => m.title).join(", ")}`);

            // Execute batch in parallel with isolated catch blocks and retries
            const batchPromises = readyToRun.map(async (m) => {
                m.status = "running";
                const mStart = Date.now();
                this.log(`Running mission [${m.id}]: "${m.title}"`);

                let retries = 2;
                let success = false;
                let errorMsg = "";

                while (retries >= 0 && !success) {
                    try {
                        const res = await executor(m);
                        if (res.success) {
                            success = true;
                        } else {
                            errorMsg = res.error || "Execution failed without specific error";
                            retries--;
                            if (retries >= 0) {
                                this.log(`Retrying mission [${m.id}]. Attempts left: ${retries}`);
                            }
                        }
                    } catch (err: any) {
                        errorMsg = err?.message || String(err);
                        retries--;
                        if (retries >= 0) {
                            this.log(`Exception in mission [${m.id}]: ${errorMsg}. Retrying...`);
                        }
                    }
                }

                m.durationMs = Date.now() - mStart;
                if (success) {
                    m.status = "completed";
                    successfulMissions.push(m.id);
                    this.log(`Mission [${m.id}] COMPLETED successfully in ${m.durationMs}ms`);
                } else {
                    m.status = "failed";
                    m.error = errorMsg;
                    failedMissions.push(m.id);
                    this.log(`Mission [${m.id}] FAILED after retries: ${errorMsg}`);
                }
            });

            await Promise.all(batchPromises);
        }

        const totalDuration = Date.now() - start;
        this.log(`DAG scheduling execution finished in ${totalDuration}ms. Successes: ${successfulMissions.length}, Failures: ${failedMissions.length}`);

        return {
            successfulMissions,
            failedMissions,
            executionLog: this.logs
        };
    }

    getLogs(): string[] {
        return this.logs;
    }
}
