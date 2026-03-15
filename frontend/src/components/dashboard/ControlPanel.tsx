"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import InputCard from "./InputCard";
import { PredictionRequest } from "@/types/api";

interface ControlPanelProps {
  onCompile: (params: PredictionRequest) => void;
  isOptimizing: boolean;
}

export default function ControlPanel({ onCompile, isOptimizing }: ControlPanelProps) {
  const [selectedQubits, setSelectedQubits] = useState(2);
  const [noiseLevel, setNoiseLevel] = useState(0.02);
  const [targetState, setTargetState] = useState("bell");

  const states = [
    { id: "bell", label: "Bell State" },
    { id: "ghz", label: "GHZ State" },
    { id: "w", label: "W State" },
  ];

  // Dependency mapping: State determines available qubits
  const getAvailableQubits = () => {
    if (targetState === "bell") return [2];
    if (targetState === "ghz" || targetState === "w") return [3, 4];
    return [2, 3, 4];
  };

  const isQubitDisabled = (qubit: number) => {
    if (targetState === "bell") return qubit !== 2;
    if (targetState === "ghz" || targetState === "w") return qubit === 2;
    return false;
  };

  // Auto-select valid qubit when state changes
  const handleStateChange = (newState: string) => {
    setTargetState(newState);
    if (newState === "bell" && selectedQubits !== 2) {
      setSelectedQubits(2);
    } else if ((newState === "ghz" || newState === "w") && selectedQubits === 2) {
      setSelectedQubits(3);
    }
  };

  const handleCompile = () => {
    onCompile({
      qubits: selectedQubits,
      noise: noiseLevel,
      phase: 0.5,
      target_state: targetState
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pb-4 border-b border-white/8"
      >
        <h3 className="text-sm font-light uppercase tracking-widest text-white/60">
          Configuration
        </h3>
      </motion.div>

      {/* Target State Selector */}
      <InputCard 
        label="Target Quantum State"
        description="Select entangled state (defines qubit count)"
      >
        <div className="relative">
          <select
            value={targetState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/8 rounded-lg px-3 py-2.5 text-white/80 text-sm appearance-none focus:outline-none focus:border-white/15 cursor-pointer font-light transition-all duration-300"
          >
            {states.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-950 text-white">
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
        </div>
      </InputCard>

      {/* Qubit System Size - State Dependent */}
      <InputCard 
        label="System Size (Qubits)"
        description={targetState === "bell" ? "Fixed to 2Q for Bell State" : "Select 3Q or 4Q"}
      >
        <div className="flex gap-2">
          {[2, 3, 4].map((q) => {
            const disabled = isQubitDisabled(q);
            return (
              <motion.button
                key={q}
                onClick={() => !disabled && setSelectedQubits(q)}
                whileHover={!disabled ? { y: -2 } : {}}
                whileTap={!disabled ? { y: 0 } : {}}
                disabled={disabled}
                className={`flex-1 py-2.5 text-xs font-medium transition-all duration-300 rounded-lg ${
                  selectedQubits === q 
                    ? "bg-white/[0.08] text-white/90 border border-white/15" 
                    : disabled
                    ? "bg-white/[0.02] text-white/25 border border-white/4 cursor-not-allowed opacity-50"
                    : "bg-white/[0.02] text-white/50 border border-white/6 hover:bg-white/[0.04] hover:text-white/60"
                }`}
              >
                {q}Q
              </motion.button>
            );
          })}
        </div>
      </InputCard>

      {/* Noise Floor */}
      <InputCard 
        label="Noise Floor"
        description="Environmental noise level"
      >
        <div className="flex justify-between items-center gap-3 mb-2">
          <input
            type="range"
            min="0"
            max="0.1"
            step="0.001"
            value={noiseLevel}
            onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
            className="flex-1 h-0.5 bg-white/8 appearance-none cursor-pointer rounded-full hover:bg-white/12 transition-colors"
          />
          <span className="text-xs font-mono text-white/50 w-12 text-right">
            {noiseLevel.toFixed(4)}
          </span>
        </div>
      </InputCard>



      {/* Spacer */}
      <div className="flex-1" />

      {/* Execute Button */}
      <motion.button
        whileHover={{ y: isOptimizing ? 0 : -2 }}
        whileTap={{ y: 0 }}
        onClick={handleCompile}
        disabled={isOptimizing}
        className={`w-full py-3.5 uppercase tracking-wider text-xs font-semibold transition-all duration-300 rounded-lg backdrop-blur-sm ${
          isOptimizing 
            ? "bg-white/[0.04] text-white/35 border border-white/6 cursor-not-allowed" 
            : "bg-white/[0.08] text-white/85 border border-white/12 hover:bg-white/[0.12] hover:text-white/95 hover:border-white/15"
        }`}
      >
        {isOptimizing ? (
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse"></span>
            Optimizing…
          </div>
        ) : (
          "Start Optimization"
        )}
      </motion.button>

    </div>
  );
}
