#!/bin/bash
sed -i -e '/import "\.\/src\/core\/connectors\/AutoPublishTrigger";/a \
import { executionKernel } from "./src/core/kernel/ExecutionKernel";\
import { healthMonitor } from "./src/core/kernel/HealthMonitor";\
import { failureEngine } from "./src/core/kernel/FailureEngine";\
failureEngine.init();\
healthMonitor.check();\
' server.ts
