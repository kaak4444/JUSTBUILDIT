import React, { useState, useEffect } from "react";
import { MissionControl } from "./components/os/MissionControl";
import { CommandPalette } from "./components/os/CommandPalette";

export default function App() {
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(o => !o);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-full h-screen bg-[#050505] overflow-hidden relative font-sans text-gray-300">
      <MissionControl />
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
