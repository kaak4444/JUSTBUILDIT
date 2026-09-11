const fs = require('fs');
let code = fs.readFileSync('src/components/PublishingDepartmentView.tsx', 'utf8');

const oldCode = `        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">`;

const newCode = `        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          {/* Action Input */}
          <div className="mb-6 p-4 rounded-xl border border-glass bg-white/[0.02]">
            <h3 className="text-xs font-mono font-bold text-white uppercase mb-3">Publishing Directive</h3>
            <div className="flex gap-4">
               <input 
                 type="text" 
                 placeholder="Enter publishing task (e.g., Deploy Shopify Store, Publish PDF Guide)..."
                 className="flex-1 bg-black/50 border border-glass rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
               />
               <button 
                 className="bg-blue-600 text-white font-bold font-mono uppercase tracking-wider px-6 py-2 rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2"
                 onClick={() => addLog("Publishing", "Initiating publishing task...", "INFO")}
               >
                 Execute <Send className="w-4 h-4" />
               </button>
            </div>
          </div>`;

code = code.replace(oldCode, newCode);
code = code.replace('import {', 'import {\n  Send,');

fs.writeFileSync('src/components/PublishingDepartmentView.tsx', code);
