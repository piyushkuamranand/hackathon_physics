"use client";

import { motion } from "framer-motion";


export default function ResultsPanel({ metrics = { fidelity: 0 as number | null, components: 0, generation: 0 }, mode = "physical" }) {
  return (
    <div className="w-80 h-full border-l border-white/8 bg-black p-12 flex flex-col gap-10 overflow-y-auto custom-scrollbar shrink-0">
      
      {/* Fidelity Display - Hero Metric with Glass */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5 p-6 rounded-lg backdrop-blur-sm bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/8 shadow-lg shadow-white/[0.03]">
        {metrics.fidelity === null ? (
          <div className="text-xl font-light tracking-tight text-white/70 py-2">
            Physics pending
          </div>
        ) : (
          <div className="flex items-baseline gap-3">
            <span className="text-6xl font-light tracking-tight text-white/95 tabular-nums">{(metrics.fidelity * 100).toFixed(1)}</span>
            <span className="text-xs text-white/40 font-light">%</span>
          </div>
        )}
        <div className="text-[8px] uppercase tracking-widest text-white/25 font-light">
          {mode === "preview" ? "Seed preview" : "State Fidelity"}
        </div>
        
        {/* Progress Bar - Elegant Linear */}
        <div className="w-full h-0.5 bg-white/6 mt-4 relative overflow-hidden rounded-full">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: metrics.fidelity === null ? "0%" : `${metrics.fidelity * 100}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-white/50 to-white/30 rounded-full"
          />
        </div>
      </motion.div>

      {/* Key Metrics - Glass Cards */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.15 }}
        className="flex flex-col gap-4"
      >
        {/* Components */}
        <div className="p-4 rounded-lg backdrop-blur-sm bg-white/[0.02] border border-white/6 hover:border-white/10 transition-all duration-300">
          <span className="text-[8px] font-medium uppercase tracking-widest text-white/25 font-light">Elements</span>
          <span className="block text-3xl font-light text-white/85 mt-2">{metrics.components || "—"}</span>
        </div>
        
        {/* Generations */}
        <div className="p-4 rounded-lg backdrop-blur-sm bg-white/[0.02] border border-white/6 hover:border-white/10 transition-all duration-300">
          <span className="text-[8px] font-medium uppercase tracking-widest text-white/25 font-light">Generations</span>
          <span className="block text-3xl font-light text-white/85 mt-2">{metrics.generation || "—"}</span>
        </div>
      </motion.div>

      {/* Spacer */}
      <div className="flex-1" />
    </div>
  );
}
