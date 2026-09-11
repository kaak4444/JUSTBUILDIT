import React, { useState } from "react";
import { SystemShell } from "./SystemShell";

export function LegacySystemShellWrapper() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [logFilter, setLogFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("COMPANY");
  const [workspaceSize, setWorkspaceSize] = useState<"compact" | "medium" | "maximized">("medium");
  const [vaultSubTab, setVaultSubTab] = useState<"AEO" | "KEYS">("AEO");
  const [selectedDeptId, setSelectedDeptId] = useState("core");

  return (
    <div className="w-full h-full relative">
      <SystemShell 
        theme={theme} setTheme={setTheme}
        projects={projects} setProjects={setProjects}
        selectedProjectId={selectedProjectId} setSelectedProjectId={setSelectedProjectId}
        logs={logs} setLogs={setLogs}
        logFilter={logFilter} setLogFilter={setLogFilter}
        activeTab={activeTab} setActiveTab={setActiveTab}
        workspaceSize={workspaceSize} setWorkspaceSize={setWorkspaceSize}
        isManualSyncing={false}
        vaultSubTab={vaultSubTab} setVaultSubTab={setVaultSubTab}
        selectedDeptId={selectedDeptId} setSelectedDeptId={setSelectedDeptId}
      />
    </div>
  );
}
