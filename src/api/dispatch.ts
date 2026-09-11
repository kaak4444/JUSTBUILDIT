// src/api/dispatch.ts
import { executionKernel } from "../core/kernel/ExecutionKernel";

export async function dispatch(req: any, res: any) {
  try {
    const taskId = await executionKernel.dispatchTask(req.body);
    res.json({ taskId, status: "QUEUED" });
  } catch (error) {
    res.status(500).json({ error: "Failed to dispatch task" });
  }
}
