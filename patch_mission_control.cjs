const fs = require('fs');
let code = fs.readFileSync('src/components/os/MissionControl.tsx', 'utf8');

// Add import
code = code.replace(
  'import { useMissionData } from "./MissionControlHooks";',
  'import { useMissionData } from "./MissionControlHooks";\nimport { LegacySystemShellWrapper } from "../LegacySystemShellWrapper";\nimport { LayoutGrid, Send } from "lucide-react";'
);

// Add sidebar item
code = code.replace(
  '<NavItem icon={<Bell />} label="Alerts" active={activeView === "notifications"} onClick={() => setActiveView("notifications")} isOpen={sidebarOpen} />',
  '<NavItem icon={<Bell />} label="Alerts" active={activeView === "notifications"} onClick={() => setActiveView("notifications")} isOpen={sidebarOpen} />\n          <div className="my-2 border-t border-glass mx-4"></div>\n          <NavItem icon={<LayoutGrid />} label="Legacy OS" active={activeView === "legacy"} onClick={() => setActiveView("legacy")} isOpen={sidebarOpen} />'
);

// Add router case
code = code.replace(
  '{activeView === "notifications" && <NotificationCenter logs={recentLogs} />}',
  '{activeView === "notifications" && <NotificationCenter logs={recentLogs} />}\n          {activeView === "legacy" && <LegacySystemShellWrapper />}'
);

fs.writeFileSync('src/components/os/MissionControl.tsx', code);
