/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Settings, Sliders, Cpu, Sparkles, RefreshCw, AlertTriangle } from "lucide-react";
import { Department } from "./Department";
import { DepartmentRegistry } from "./DepartmentRegistry";

interface DepartmentSettingsProps {
  department: Department;
}

export function DepartmentSettings({ department }: DepartmentSettingsProps) {
  const registry = DepartmentRegistry.getInstance();
  const { settings } = department;

  const handleUpdateModel = (model: string) => {
    registry.updateDepartment(department.id, (dept) => ({
      ...dept,
      settings: { ...dept.settings, activeModel: model }
    }));
    registry.emitActivity(
      department.id,
      "WORKER_PROGRESS",
      `Switched workspace LLM backend model to: [${model}]`
    );
  };

  const handleUpdateConcurrency = (limit: number) => {
    registry.updateDepartment(department.id, (dept) => ({
      ...dept,
      settings: { ...dept.settings, concurrencyLimit: limit }
    }));
    registry.emitActivity(
      department.id,
      "WORKER_PROGRESS",
      `Adjusted thread concurrency ceiling limit to: ${limit} simultaneous calls.`
    );
  };

  const handleToggleQualityMode = () => {
    const newVal = !settings.strictQualityMode;
    registry.updateDepartment(department.id, (dept) => ({
      ...dept,
      settings: { ...dept.settings, strictQualityMode: newVal }
    }));
    registry.emitActivity(
      department.id,
      "WORKER_PROGRESS",
      `Strict multi-agent quality peer review: [${newVal ? "ENABLED" : "DISABLED"}]`
    );
  };

  const handleToggleAutoHeal = () => {
    const newVal = !settings.autoHealEnabled;
    registry.updateDepartment(department.id, (dept) => ({
      ...dept,
      settings: { ...dept.settings, autoHealEnabled: newVal }
    }));
    registry.emitActivity(
      department.id,
      "WORKER_PROGRESS",
      `Autonomous error self-healing / OAuth retry engine: [${newVal ? "ENABLED" : "DISABLED"}]`
    );
  };

  return (
    <div id="department-settings-root" className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Thread & Model Allocations */}
      <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
        <div className="flex items-center gap-2 border-b border-glass pb-2.5">
          <Sliders className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Model Allocator Engine</h3>
        </div>

        <div className="space-y-4 font-mono text-[10px]">
          {/* Active Model Selection */}
          <div className="space-y-1.5">
            <label className="text-gray-400 block uppercase font-bold text-[9px]">Active Model Backend Target</label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", desc: "Low-latency, optimal for high-throughput scraping & writing" },
                { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", desc: "Deep reasoning model, ideal for outlining & reviews" },
                { id: "imagen-3", name: "Imagen 3 Pro", desc: "High-contrast vector cover & visual artwork generator" }
              ].map(model => (
                <button
                  key={model.id}
                  onClick={() => handleUpdateModel(model.id)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between gap-1 transition-all cursor-pointer ${
                    settings.activeModel === model.id
                      ? "bg-accent/10 border-accent text-white"
                      : "bg-black border-glass text-gray-400 hover:text-white"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-bold text-[10px] text-white flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-accent" />
                      {model.name}
                    </span>
                    {settings.activeModel === model.id && (
                      <span className="text-[7px] font-extrabold uppercase border border-accent text-accent px-1.5 rounded bg-accent/5">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[8px] text-gray-500 font-medium font-sans leading-normal">{model.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Constraints & Autonomous Policies */}
      <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-glass space-y-4">
        <div className="flex items-center gap-2 border-b border-glass pb-2.5">
          <Sparkles className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Governance Constraints & Policies</h3>
        </div>

        <div className="space-y-4 font-mono text-[10px]">
          {/* Thread limit slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-gray-400 block uppercase font-bold text-[9px]">Concurrency Thread Limit</label>
              <span className="text-white font-bold bg-white/5 border border-glass px-2 py-0.5 rounded font-mono text-[9px]">
                {settings.concurrencyLimit} simultaneous workers
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={settings.concurrencyLimit}
              onChange={(e) => handleUpdateConcurrency(Number(e.target.value))}
              className="w-full h-1 bg-white/5 border border-glass rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-[8px] text-gray-600">
              <span>MIN: 1 Thread</span>
              <span>MAX: 10 Threads</span>
            </div>
          </div>

          {/* Toggle buttons */}
          <div className="space-y-2 pt-2">
            {/* Peer review toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-glass bg-black">
              <div className="space-y-0.5 max-w-[200px]">
                <span className="block text-[10px] font-bold text-white font-sans">Strict Peer Review Validation</span>
                <span className="block text-[8px] text-gray-500 font-sans leading-normal">Forces cross-model critique verification before mission completion. Adds latency.</span>
              </div>
              <button
                onClick={handleToggleQualityMode}
                className={`w-10 h-5 rounded-full p-0.5 transition-all duration-200 focus:outline-none cursor-pointer ${
                  settings.strictQualityMode ? "bg-accent" : "bg-white/5 border border-glass"
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all ${settings.strictQualityMode ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Auto heal toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-glass bg-black">
              <div className="space-y-0.5 max-w-[200px]">
                <span className="block text-[10px] font-bold text-white font-sans">Autonomous Self-Healing</span>
                <span className="block text-[8px] text-gray-500 font-sans leading-normal">Intercepts cover bleeds, layout rules, and OAuth tokens dynamically. Highly recommended.</span>
              </div>
              <button
                onClick={handleToggleAutoHeal}
                className={`w-10 h-5 rounded-full p-0.5 transition-all duration-200 focus:outline-none cursor-pointer ${
                  settings.autoHealEnabled ? "bg-accent" : "bg-white/5 border border-glass"
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all ${settings.autoHealEnabled ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
