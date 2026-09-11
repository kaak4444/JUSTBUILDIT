const fs = require('fs');
let content = fs.readFileSync('src/core/kernel/ProviderRouterV2.ts', 'utf-8');
content = content.replace(/export const providerRouterV2 = new ProviderRouterV2\(\[[\s\S]*?\]\);/m, 
`export const providerRouterV2 = new ProviderRouterV2([
  {
    id: "inst_nemotron_ultra",
    model: "nvidia/nemotron-3-ultra-550b-a55b:free",
    costPerToken: 0,
    latency: 30,
    capabilities: ["reason", "research", "creative", "code", "fast", "cheap", "long_context"],
    status: "healthy",
    quota: { remainingRequests: 100 },
    failureCount: 0,
    successCount: 0,
    lastUsed: 0
  },
  {
    id: "openrouter-free",
    model: "openrouter/free",
    costPerToken: 0,
    latency: 50,
    capabilities: ["reason", "research", "creative", "code", "fast", "cheap", "long_context"],
    status: "healthy",
    quota: { remainingRequests: 100 },
    failureCount: 0,
    successCount: 0,
    lastUsed: 0
  }
]);`);
fs.writeFileSync('src/core/kernel/ProviderRouterV2.ts', content);
