const fs = require('fs');
let code = fs.readFileSync('src/components/ResearchCoreV3View.tsx', 'utf8');

const oldCode = `      {/* Main Content Area */}`;

const newCode = `      {/* Main Content Area */}
      
      <div className="border-b border-glass p-4 bg-white/[0.01]">
         <div className="max-w-4xl mx-auto flex gap-4">
           <input 
             type="text" 
             placeholder="Enter research topic (e.g., Target audience for ergonomic chairs)..."
             className="flex-1 bg-black/50 border border-glass rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
           />
           <button 
             className="bg-blue-600 text-white font-bold font-mono uppercase tracking-wider px-6 py-2 rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2"
           >
             Research <span className="text-xl leading-none">→</span>
           </button>
         </div>
      </div>`;

code = code.replace(oldCode, newCode);

fs.writeFileSync('src/components/ResearchCoreV3View.tsx', code);
