/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BrainCircuit, Plus, Trash2, Edit2, Check, FileText } from "lucide-react";
import { Department, MemoryFact } from "./Department";
import { DepartmentRegistry } from "./DepartmentRegistry";

interface DepartmentMemoryProps {
  department: Department;
}

export function DepartmentMemory({ department }: DepartmentMemoryProps) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(department.memory.notes);
  
  const [newFactCategory, setNewFactCategory] = useState("");
  const [newFactContent, setNewFactContent] = useState("");
  const [newFactConfidence, setNewFactConfidence] = useState(100);
  const [showAddFact, setShowAddFact] = useState(false);

  const registry = DepartmentRegistry.getInstance();

  const handleSaveNotes = () => {
    registry.updateDepartment(department.id, (dept) => ({
      ...dept,
      memory: {
        ...dept.memory,
        notes: notesValue
      }
    }));
    registry.emitActivity(
      department.id,
      "MEMORY_UPDATED",
      "Manually updated department general guidelines notes."
    );
    setEditingNotes(false);
  };

  const handleAddFact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFactCategory.trim() || !newFactContent.trim()) return;

    const newFact: MemoryFact = {
      id: `f_${Math.random().toString(36).substring(2, 9)}`,
      category: newFactCategory,
      content: newFactContent,
      confidence: newFactConfidence,
      createdAt: "Just now",
      updatedAt: "Just now"
    };

    registry.updateDepartment(department.id, (dept) => ({
      ...dept,
      memory: {
        ...dept.memory,
        facts: [...dept.memory.facts, newFact],
        knowledgeGraphNodesCount: dept.memory.knowledgeGraphNodesCount + 1
      }
    }));

    registry.emitActivity(
      department.id,
      "MEMORY_UPDATED",
      `Injected new vector knowledge fact: [${newFactCategory}] "${newFactContent.substring(0, 30)}..."`
    );

    setNewFactCategory("");
    setNewFactContent("");
    setNewFactConfidence(100);
    setShowAddFact(false);
  };

  const handleDeleteFact = (factId: string) => {
    const fact = department.memory.facts.find(f => f.id === factId);
    registry.updateDepartment(department.id, (dept) => ({
      ...dept,
      memory: {
        ...dept.memory,
        facts: dept.memory.facts.filter(f => f.id !== factId),
        knowledgeGraphNodesCount: Math.max(0, dept.memory.knowledgeGraphNodesCount - 1)
      }
    }));

    registry.emitActivity(
      department.id,
      "MEMORY_UPDATED",
      `Deleted vector knowledge fact node: "${fact?.content.substring(0, 30)}..."`
    );
  };

  return (
    <div id="department-memory-root" className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Dynamic Knowledge Graph List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-glass pb-2">
          <div className="flex items-center gap-1.5">
            <BrainCircuit className="w-4 h-4 text-accent" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Semantic Fact Ledger</h3>
          </div>
          <span className="text-[8px] font-mono text-gray-500 uppercase bg-white/5 border border-glass px-2 py-0.5 rounded font-bold">
            Graph Nodes: {department.memory.knowledgeGraphNodesCount}
          </span>
        </div>

        {/* Facts List */}
        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
          {department.memory.facts.map((fact) => (
            <div
              key={fact.id}
              className="p-3 rounded-xl border border-glass bg-black/30 space-y-2 hover:border-white/10 transition-all text-[10px] font-mono"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-accent bg-accent/5 px-2 py-0.5 border border-accent/20 rounded uppercase">
                    {fact.category}
                  </span>
                  <span className="text-[8px] text-gray-500">Confidence: {fact.confidence}%</span>
                </div>
                <button
                  onClick={() => handleDeleteFact(fact.id)}
                  className="text-gray-500 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-gray-300 leading-relaxed font-sans">{fact.content}</p>
            </div>
          ))}

          {/* Inline Add Fact Form */}
          {showAddFact ? (
            <form onSubmit={handleAddFact} className="p-3 rounded-xl border border-accent/30 bg-accent/[0.02] space-y-3 font-mono text-[10px]">
              <div className="space-y-1">
                <label className="text-gray-400">Fact Category</label>
                <input
                  type="text"
                  required
                  value={newFactCategory}
                  onChange={(e) => setNewFactCategory(e.target.value)}
                  placeholder="e.g., Target Demographic"
                  className="w-full bg-black border border-glass px-2 py-1.5 rounded text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">Content / Rule</label>
                <textarea
                  required
                  rows={2}
                  value={newFactContent}
                  onChange={(e) => setNewFactContent(e.target.value)}
                  placeholder="State the learned rule, formula, or custom parameter precisely..."
                  className="w-full bg-black border border-glass px-2 py-1.5 rounded text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="flex items-center justify-between border-t border-glass/40 pt-2 text-[9px]">
                <button
                  type="button"
                  onClick={() => setShowAddFact(false)}
                  className="text-gray-500 hover:text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-accent text-white font-bold rounded hover:bg-accent/80"
                >
                  Store Fact Node
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddFact(true)}
              className="w-full py-2 border border-dashed border-glass hover:border-accent/40 rounded-xl text-[9px] font-mono text-gray-500 hover:text-accent flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-white/[0.01]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Inject Knowledge Fact Node</span>
            </button>
          )}
        </div>
      </div>

      {/* Editable Guidelines Pads */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-glass pb-2">
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-accent" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Directives Memo</h3>
          </div>

          {!editingNotes ? (
            <button
              onClick={() => setEditingNotes(true)}
              className="flex items-center gap-1 text-[8px] font-mono bg-white/5 border border-glass px-2 py-0.5 rounded text-gray-400 hover:text-white cursor-pointer"
            >
              <Edit2 className="w-2.5 h-2.5 text-accent" />
              <span>Edit Directives</span>
            </button>
          ) : (
            <button
              onClick={handleSaveNotes}
              className="flex items-center gap-1 text-[8px] font-mono bg-accent/10 border border-accent/20 px-2 py-0.5 rounded text-emerald-400 hover:text-emerald-300 cursor-pointer"
            >
              <Check className="w-2.5 h-2.5 text-emerald-400" />
              <span>Save Directives</span>
            </button>
          )}
        </div>

        {/* Text Area */}
        <div className="h-[280px] bg-black border border-glass rounded-xl p-3 text-[10px] font-mono leading-relaxed relative">
          {editingNotes ? (
            <textarea
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              className="w-full h-full bg-transparent border-none text-white focus:outline-none resize-none"
              placeholder="Write permanent workspace guidelines, priorities, or design philosophies..."
            />
          ) : (
            <p className="text-gray-400 whitespace-pre-wrap font-sans leading-relaxed text-[11px]">
              {notesValue || "No directives currently active. Click Edit above to write custom memo guidelines for this workspace."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
