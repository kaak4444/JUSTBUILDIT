#!/bin/bash
sed -i 's/import { agentMesh } from "..\/event-mesh\/AgentMesh";/import { system } from "..\/bootstrap";/' src/core/kernel/ProviderRouterV2.ts
sed -i 's/agentMesh\.emit(/system.bus.emit(/g' src/core/kernel/ProviderRouterV2.ts
