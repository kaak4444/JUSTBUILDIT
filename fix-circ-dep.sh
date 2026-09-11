#!/bin/bash
sed -i 's/import { system } from "..\/bootstrap";/import { globalEventBus } from "..\/event-bus\/EventBus";/g' src/core/kernel/ProviderRouterV2.ts
sed -i 's/system.bus.emit/globalEventBus.emit/g' src/core/kernel/ProviderRouterV2.ts

sed -i 's/import { system } from "..\/bootstrap";/import { globalEventBus } from "..\/event-bus\/EventBus";/g' src/core/event-mesh/AgentRegistry.ts
sed -i 's/system.mesh.register/console.log/g' src/core/event-mesh/AgentRegistry.ts
