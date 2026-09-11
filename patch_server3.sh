#!/bin/bash
sed -i -e '/initializeAgentMesh();/a \
import "./src/core/bootstrap";\
' server.ts
