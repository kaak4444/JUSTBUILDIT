#!/bin/bash
sed -i 's/import { agentMesh } from ".\/AgentMesh";/import { system } from "..\/bootstrap";/g' src/core/event-mesh/AgentRegistry.ts
sed -i 's/agentMesh\.register(/system.mesh.register(/g' src/core/event-mesh/AgentRegistry.ts
