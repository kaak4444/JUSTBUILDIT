const fs = require('fs');
let code = fs.readFileSync('src/components/os/MissionControl.tsx', 'utf8');

const oldActiveMission = `function ActiveMission({ mission, engines, logs }: { mission: any, engines: any[], logs: any[] }) {
  const isRunning = mission && mission.status !== "completed";
  
  const ceoLog = logs.find(l => l.source === 'CEO' || l.message.includes('CEO'));

  return (
    <div className="h-full flex flex-col bg-[#050505]">
      {/* Header */}
      <div className="h-20 border-b border-glass px-8 flex items-center justify-between shrink-0 bg-surface/50 backdrop-blur-md sticky top-0 z-10">
        <div>
          <div className="text-[10px] text-accent font-mono font-bold uppercase tracking-[0.2em] mb-1">Active Mission</div>
          <h1 className="text-2xl font-sans font-bold text-white tracking-tight">{mission ? mission.prompt : "Awaiting Directive"}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end pr-4 border-r border-glass">
            <span className="text-[10px] text-gray-500 font-mono uppercase">Status</span>
            <span className={\`text-sm font-mono font-bold flex items-center gap-1 \${isRunning ? 'text-emerald-400' : 'text-gray-400'}\`}>
              {isRunning && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
              {mission ? mission.status.toUpperCase() : "IDLE"}
            </span>
          </div>
          <div className="flex flex-col items-end pr-4 border-r border-glass">
            <span className="text-[10px] text-gray-500 font-mono uppercase">Progress</span>
            <span className="text-sm text-white font-mono font-bold">{mission ? 'Active' : '0%'}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 font-mono uppercase">ID</span>
            <span className="text-sm text-white font-mono font-bold">{mission ? mission.id.substring(0, 8) : "---"}</span>
          </div>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto pb-20">
          
          {/* Main Workspace Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* CEO Feed */}
            <div className="border border-glass rounded-xl bg-white/[0.01] overflow-hidden">
              <div className="px-4 py-2 bg-black/40 border-b border-glass flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-accent/20 flex items-center justify-center">
                  <Activity className="w-3 h-3 text-accent" />
                </div>
                <span className="text-xs font-mono font-bold text-white uppercase">CEO Directives</span>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {ceoLog ? (
                  <>
                    <div className="text-sm text-gray-300 font-mono">
                      <span className="text-accent font-bold">CEO:</span> {ceoLog.message}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">{new Date(ceoLog.timestamp).toLocaleTimeString()}</div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500 font-mono text-center">No recent CEO directives.</div>
                )}
              </div>
            </div>`;

const newActiveMission = `function ActiveMission({ mission, engines, logs }: { mission: any, engines: any[], logs: any[] }) {
  const [prompt, setPrompt] = useState("");
  const isRunning = mission && mission.status !== "completed";
  
  const ceoLog = logs.find(l => l.source === 'CEO' || l.message.includes('CEO'));

  const submitMission = async () => {
    if (!prompt.trim()) return;
    try {
      await fetch('/api/autonomic/mission/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, strategy: "AUTO" })
      });
      setPrompt("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#050505]">
      {/* Header */}
      <div className="h-20 border-b border-glass px-8 flex items-center justify-between shrink-0 bg-surface/50 backdrop-blur-md sticky top-0 z-10">
        <div>
          <div className="text-[10px] text-accent font-mono font-bold uppercase tracking-[0.2em] mb-1">Active Mission</div>
          <h1 className="text-2xl font-sans font-bold text-white tracking-tight">{mission ? mission.prompt : "Awaiting Directive"}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end pr-4 border-r border-glass">
            <span className="text-[10px] text-gray-500 font-mono uppercase">Status</span>
            <span className={\`text-sm font-mono font-bold flex items-center gap-1 \${isRunning ? 'text-emerald-400' : 'text-gray-400'}\`}>
              {isRunning && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
              {mission ? mission.status.toUpperCase() : "IDLE"}
            </span>
          </div>
          <div className="flex flex-col items-end pr-4 border-r border-glass">
            <span className="text-[10px] text-gray-500 font-mono uppercase">Progress</span>
            <span className="text-sm text-white font-mono font-bold">{mission ? 'Active' : '0%'}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 font-mono uppercase">ID</span>
            <span className="text-sm text-white font-mono font-bold">{mission ? mission.id.substring(0, 8) : "---"}</span>
          </div>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto pb-20">
          
          {/* Main Workspace Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Mission Dispatcher */}
            <div className="border border-glass rounded-xl bg-white/[0.01] p-4 flex gap-4 items-center">
               <input 
                 type="text" 
                 value={prompt} 
                 onChange={e => setPrompt(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && submitMission()}
                 placeholder="Type your core directive here (e.g. Build a dropshipping store)..."
                 className="flex-1 bg-black/50 border border-glass rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent font-mono text-sm"
               />
               <button 
                 onClick={submitMission}
                 className="bg-accent text-black font-bold font-mono uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-white transition-colors flex items-center gap-2"
               >
                 Execute <Send className="w-4 h-4" />
               </button>
            </div>

            {/* CEO Feed */}
            <div className="border border-glass rounded-xl bg-white/[0.01] overflow-hidden">
              <div className="px-4 py-2 bg-black/40 border-b border-glass flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-accent/20 flex items-center justify-center">
                  <Activity className="w-3 h-3 text-accent" />
                </div>
                <span className="text-xs font-mono font-bold text-white uppercase">CEO Directives</span>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {ceoLog ? (
                  <>
                    <div className="text-sm text-gray-300 font-mono">
                      <span className="text-accent font-bold">CEO:</span> {ceoLog.message}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">{new Date(ceoLog.timestamp).toLocaleTimeString()}</div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500 font-mono text-center">No recent CEO directives.</div>
                )}
              </div>
            </div>`;

if (!code.includes(oldActiveMission)) {
  console.log("oldActiveMission not found, matching piece by piece...");
} else {
  code = code.replace(oldActiveMission, newActiveMission);
  fs.writeFileSync('src/components/os/MissionControl.tsx', code);
}
