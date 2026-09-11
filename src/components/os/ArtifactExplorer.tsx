import React, { useState } from "react";
import { FileText, Image as ImageIcon, Book, Code, Box, Search, ExternalLink, Check, X, MessageSquare, RefreshCw, UserPlus, GitCompare } from "lucide-react";

export function ArtifactExplorer() {
  const [query, setQuery] = useState("");
  const [selectedArtifact, setSelectedArtifact] = useState<number | null>(null);
  
  const artifacts = [
    { id: 1, type: "Book", title: "The Mindful Developer", date: "10 mins ago", size: "2.4 MB", status: "Review Required" },
    { id: 2, type: "Research", title: "Competitor Analysis: SaaS", date: "2 hours ago", size: "145 KB", status: "Completed" },
    { id: 3, type: "Image", title: "Cover_Final_v2.png", date: "5 hours ago", size: "4.1 MB", status: "Approved" },
    { id: 4, type: "Code", title: "Landing Page React Component", date: "1 day ago", size: "12 KB", status: "Deployed" },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "Book": return <Book className="w-4 h-4 text-emerald-400" />;
      case "Research": return <FileText className="w-4 h-4 text-blue-400" />;
      case "Image": return <ImageIcon className="w-4 h-4 text-purple-400" />;
      case "Code": return <Code className="w-4 h-4 text-orange-400" />;
      default: return <Box className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#080808] border border-glass rounded-xl overflow-hidden relative">
      <div className="px-4 py-3 border-b border-glass flex items-center justify-between bg-white/[0.02] shrink-0">
        <div className="flex items-center gap-2 text-sm font-mono font-bold text-white uppercase tracking-wider">
          <Box className="w-4 h-4 text-accent" />
          Artifact Explorer
        </div>
        <div className="flex items-center gap-2 bg-black/40 border border-glass px-2 py-1 rounded-md w-64">
          <Search className="w-3.5 h-3.5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search artifacts..."
            className="bg-transparent border-0 text-xs font-mono text-white focus:outline-none flex-1"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {artifacts.map(art => (
            <div 
              key={art.id} 
              onClick={() => setSelectedArtifact(art.id)}
              className={`group p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-3 relative ${selectedArtifact === art.id ? 'border-accent bg-accent/5' : 'border-glass bg-white/[0.02] hover:bg-white/[0.05]'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getIcon(art.type)}
                  <span className="text-xs font-mono font-bold text-gray-300">{art.type}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${art.status === 'Review Required' ? 'bg-amber-500/20 text-amber-500' : 'bg-white/10 text-gray-400'}`}>
                  {art.status}
                </span>
              </div>
              
              <div className="text-sm font-bold text-white line-clamp-2">{art.title}</div>
              
              <div className="mt-auto flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span>{art.date}</span>
                <span>{art.size}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Mode Panel */}
      {selectedArtifact && (
        <div className="absolute inset-y-0 right-0 w-[400px] bg-[#0a0a0a] border-l border-glass shadow-2xl flex flex-col z-20">
          <div className="px-4 py-3 border-b border-glass flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-white uppercase">Review Mode</span>
            <button onClick={() => setSelectedArtifact(null)} className="text-gray-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-4 flex flex-col gap-6">
            {/* Preview Area Placeholder */}
            <div className="w-full aspect-video bg-black border border-glass rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent"></div>
              <Box className="w-8 h-8 text-gray-700" />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">
                {artifacts.find(a => a.id === selectedArtifact)?.title}
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                <ReviewButton icon={<Check />} label="Approve" color="text-emerald-400" />
                <ReviewButton icon={<X />} label="Reject" color="text-rose-400" />
                <ReviewButton icon={<MessageSquare />} label="Comment" />
                <ReviewButton icon={<RefreshCw />} label="Regenerate" />
                <ReviewButton icon={<UserPlus />} label="Assign Reviewer" />
                <ReviewButton icon={<GitCompare />} label="Compare Versions" />
              </div>
            </div>
            
            <div className="mt-auto border-t border-glass pt-4 space-y-3">
              <div className="text-xs font-mono font-bold text-gray-400 uppercase">Version History</div>
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                v2 - Addressed CEO feedback (Current)
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-gray-700"></span>
                v1 - Initial Generation
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewButton({ icon, label, color = "text-gray-300" }: { icon: React.ReactNode, label: string, color?: string }) {
  return (
    <button className="flex items-center justify-center gap-2 p-2 rounded-md border border-glass bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
      {React.cloneElement(icon as React.ReactElement, { className: `w-4 h-4 ${color}` })}
      <span className={`text-xs font-mono font-bold ${color}`}>{label}</span>
    </button>
  );
}
