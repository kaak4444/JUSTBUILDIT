#!/bin/bash
sed -i -e '/app\.post("\/api\/projects", async (req, res) => {/i \
app.post("/api/dispatch", async (req, res) => {\
  try {\
    const { executionKernel } = await import("./src/core/kernel/ExecutionKernel");\
    const taskId = await executionKernel.dispatchTask(req.body);\
    res.json({ taskId, status: "QUEUED" });\
  } catch (error) {\
    res.status(500).json({ error: "Failed to dispatch task" });\
  }\
});\
' server.ts
