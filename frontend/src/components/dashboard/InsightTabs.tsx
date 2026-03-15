"use client";

import { motion } from "framer-motion";
import { Activity, Zap } from "lucide-react";
import { useState } from "react";

export default function InsightTabs({ trace = [] }: { trace?: string[] }) {
  const [activeTab, setActiveTab] = useState("trace");

  return (
    <div className="h-48 shrink-0 border-t border-white/6 bg-black flex flex-col relative z-20 backdrop-blur-sm bg-gradient-to-t from-white/[0.01] to-transparent">
      {/* Tab Headers - Premium */}
      <div className="flex px-12 border-b border-white/6">
        <button
          onClick={() => setActiveTab("trace")}
          className="py-4 pr-8 text-[9px] font-medium tracking-widest uppercase flex items-center gap-2 text-white/30 hover:text-white/50 transition-colors relative group font-light"
        >
          <Activity className="w-3 h-3" />
          Optimization Trace
          {activeTab === "trace" && (
            <motion.div layoutId="activetab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 rounded-full" initial={{ width: "0%" }} />
          )}
        </button>
        
        <button
          onClick={() => setActiveTab("physics")}
          className="py-4 pr-8 text-[9px] font-medium tracking-widest uppercase flex items-center gap-2 text-white/30 hover:text-white/50 transition-colors relative font-light"
        >
          <Zap className="w-3 h-3" />
          Physics Engine
          {activeTab === "physics" && (
            <motion.div layoutId="activetab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 rounded-full" initial={{ width: "0%" }} />
          )}
        </button>
      </div>

      {/* Tab Content - Premium Lab Terminal */}
      <div className="flex-1 px-12 py-5 overflow-y-auto font-mono text-[9px] leading-relaxed text-white/25 custom-scrollbar bg-white/[0.01]">
        {activeTab === "trace" && (
          <div className="flex flex-col gap-2">
            {trace.length > 0 ? (
              trace.map((log, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex gap-8 group hover:text-white/40 transition-colors font-light"
                >
                  <span className="text-white/8 shrink-0 select-none">{i.toString().padStart(3, '0')}</span>
                  <span className="text-white/20 font-light">{log}</span>
                </motion.div>
              ))
            ) : (
              <div className="flex gap-8 text-white/15">
                <span className="text-white/8">—</span>
                <span className="font-light">Ready for optimization...</span>
              </div>
            )}
          </div>
        )}

        {activeTab === "physics" && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-8 group hover:text-white/40 transition-colors">
              <span className="text-white/8 shrink-0 font-light">[1]</span>
              <span className="text-white/20 font-light">Physics Engine: Quantum Optical Model</span>
            </div>
            <div className="flex gap-8 group hover:text-white/40 transition-colors">
              <span className="text-white/8 shrink-0 font-light">[2]</span>
              <span className="text-white/20 font-light">Beam Splitter: 50/50 unitary coupling</span>
            </div>
            <div className="flex gap-8 group hover:text-white/40 transition-colors">
              <span className="text-white/8 shrink-0 font-light">[3]</span>
              <span className="text-white/20 font-light">Phase Shifter: Variable φ ∈ [0, 2π]</span>
            </div>
            <div className="flex gap-8 group hover:text-white/40 transition-colors">
              <span className="text-white/8 shrink-0 font-light">[4]</span>
              <span className="text-white/20 font-light">State Fidelity: Computed per population</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
