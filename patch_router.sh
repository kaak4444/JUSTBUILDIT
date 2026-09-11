#!/bin/bash
sed -i -e '/id: "openrouter-free",/a \
  },\
  {\
    id: "inst_nemotron_ultra",\
    model: "nvidia/nemotron-3-ultra-550b-a55b:free",\
    costPerToken: 0,\
    latency: 30,\
    capabilities: ["reason", "research", "creative", "code", "fast", "cheap", "long_context"],\
    status: "healthy",\
    quota: { remainingRequests: 100 },\
    failureCount: 0,\
    successCount: 0,\
    lastUsed: 0\
' src/core/kernel/ProviderRouterV2.ts
