import React, { useState, useEffect, useRef } from "react";
import { Search, Command, Play, Square, Settings, Database, Activity, RefreshCw } from "lucide-react";

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const commands = [
    { id: "new_mission", title: "Create New Mission", icon: <Play className="w-4 h-4 text-accent" /> },
    { id: "pause_mission", title: "Pause Current Mission", icon: <Square className="w-4 h-4 text-amber-500" /> },
    { id: "open_research", title: "Open Research Workspace", icon: <Database className="w-4 h-4 text-blue-400" /> },
    { id: "open_memory", title: "Inspect Organization Memory", icon: <Database className="w-4 h-4 text-emerald-400" /> },
    { id: "run_diagnostics", title: "Run System Diagnostics", icon: <Activity className="w-4 h-4 text-rose-400" /> },
    { id: "restart_worker", title: "Restart Failed Workers", icon: <RefreshCw className="w-4 h-4 text-gray-400" /> },
  ];

  const filtered = commands.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-start justify-center pt-32" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-[#0a0a0a] border border-glass rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-glass gap-3 bg-white/[0.02]">
          <Search className="w-5 h-5 text-gray-500" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-0 text-white focus:outline-none font-mono text-sm placeholder:text-gray-600"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
            }}
          />
          <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono bg-white/5 px-2 py-1 rounded">
            <span>ESC</span>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-xs font-mono">No commands found.</div>
          ) : (
            filtered.map((cmd, i) => (
              <button 
                key={cmd.id}
                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/[0.05] rounded-lg group transition-colors"
                onClick={() => {
                  console.log("Execute command:", cmd.id);
                  onClose();
                }}
              >
                {cmd.icon}
                <span className="text-sm font-mono text-gray-300 group-hover:text-white">{cmd.title}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
