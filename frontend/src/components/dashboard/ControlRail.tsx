"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { PredictionRequest } from "@/types/api";

export default function ControlRail({ onCompile, isOptimizing }: { onCompile: (params: PredictionRequest) => void, isOptimizing: boolean }) {
  const [selectedQubits, setSelectedQubits] = useState(2);
  const [noiseLevel, setNoiseLevel] = useState(0.02);
  const [phaseShift, setPhaseShift] = useState(0.5);
  const [targetState, setTargetState] = useState("bell");
  const [mode, setMode] = useState("auto");

  const states = [
    { id: "bell", label: "Bell State" },
    { id: "ghz", label: "GHZ State" },
    { id: "w", label: "W State" },
  ];

  const handleCompile = () => {
    onCompile({
      qubits: selectedQubits,
      noise: noiseLevel,
      phase: phaseShift,
      target_state: targetState
    });
  };

  return (
    <div className="w-80 h-full border-r border-white/8 bg-black p-12 flex flex-col gap-12 overflow-y-auto custom-scrollbar relative z-10 shrink-0">
      {/* Target State Selector */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
        <label className="text-[9px] font-medium uppercase tracking-widest text-white/30">Target Quantum State</label>
        <div className="relative p-4 rounded-lg backdrop-blur-sm bg-white/[0.02] border border-white/6 hover:border-white/10 transition-all duration-300">
          <select
            value={targetState}
            onChange={(e) => setTargetState(e.target.value)}
            className="w-full bg-transparent text-white/80 text-sm appearance-none focus:outline-none cursor-pointer font-light"
          >
            {states.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-950 text-white">{s.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 pointer-events-none" />
        </div>
      </motion.div>

      {/* Qubit System Size */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="flex flex-col gap-4">
        <label className="text-[9px] font-medium uppercase tracking-widest text-white/30">System Size (Qubits)</label>
        <div className="flex gap-2">
          {[2, 3, 4].map((q) => (
            <motion.button
              key={q}
              onClick={() => setSelectedQubits(q)}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              className={`flex-1 py-2.5 text-xs font-medium transition-all duration-300 rounded-lg backdrop-blur-sm ${
                selectedQubits === q 
                  ? "bg-white/[0.08] text-white/90 border border-white/15 shadow-lg shadow-white/[0.05]" 
                  : "bg-white/[0.02] text-white/50 border border-white/6 hover:bg-white/[0.04] hover:text-white/60 hover:border-white/10"
              }`}
            >
              {q}Q
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Noise Floor */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4 p-4 rounded-lg backdrop-blur-sm bg-white/[0.02] border border-white/6">
        <div className="flex justify-between items-baseline">
          <label className="text-[9px] font-medium uppercase tracking-widest text-white/30">Noise Floor</label>
          <span className="text-[10px] font-mono text-white/50 font-light">{noiseLevel.toFixed(4)}</span>
        </div>
        <input
          type="range"
          min="0" max="0.1" step="0.001"
          value={noiseLevel}
          onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
          className="w-full h-0.5 bg-white/8 appearance-none cursor-pointer accent-white/30 hover:accent-white/40 transition-all duration-200 rounded-full"
        />
      </motion.div>

      {/* Phase Injection */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex flex-col gap-4 p-4 rounded-lg backdrop-blur-sm bg-white/[0.02] border border-white/6">
        <div className="flex justify-between items-baseline">
          <label className="text-[9px] font-medium uppercase tracking-widest text-white/30">Phase Injection</label>
          <span className="text-[10px] font-mono text-white/50 font-light">{(phaseShift * Math.PI).toFixed(2)}π</span>
        </div>
        <input
          type="range"
          min="0" max="1" step="0.01"
          value={phaseShift}
          onChange={(e) => setPhaseShift(parseFloat(e.target.value))}
          className="w-full h-0.5 bg-white/8 appearance-none cursor-pointer accent-white/30 hover:accent-white/40 transition-all duration-200 rounded-full"
        />
      </motion.div>
      
      {/* Optimization Strategy */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col gap-4">
        <label className="text-[9px] font-medium uppercase tracking-widest text-white/30">Optimization Mode</label>
        <div className="flex gap-2">
          {['auto', 'depth', 'fidelity'].map((strat) => (
            <motion.button
              key={strat}
              onClick={() => setMode(strat)}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              className={`flex-1 py-2.5 text-xs font-medium transition-all duration-300 rounded-lg backdrop-blur-sm ${
                mode === strat 
                  ? "bg-white/[0.08] text-white/90 border border-white/15 shadow-lg shadow-white/[0.05]" 
                  : "bg-white/[0.02] text-white/50 border border-white/6 hover:bg-white/[0.04] hover:text-white/60 hover:border-white/10"
              }`}
            >
              {strat}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Compile Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ y: isOptimizing ? 0 : -2 }}
        whileTap={{ y: 0 }}
        onClick={handleCompile}
        disabled={isOptimizing}
        className={`w-full py-3.5 uppercase tracking-wider text-[9px] font-semibold transition-all duration-300 rounded-lg backdrop-blur-sm shadow-lg shadow-white/[0.03] ${
          isOptimizing 
            ? "bg-white/[0.04] text-white/35 border border-white/6 cursor-not-allowed" 
            : "bg-white/[0.06] text-white/80 border border-white/12 hover:bg-white/[0.08] hover:text-white/90 hover:border-white/15 hover:shadow-lg hover:shadow-white/[0.05]"
        }`}
      >
        {isOptimizing ? "Optimizing…" : "Compile"}
      </motion.button>
    </div>
  );
}
