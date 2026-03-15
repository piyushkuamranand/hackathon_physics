"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Activity, Zap } from "lucide-react";
import { useState } from "react";

interface InsightsPanelProps {
  trace?: string[];
}

export default function InsightsPanel({ trace = [] }: InsightsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("trace");

  return (
    <div className="w-full border-t border-white/8 bg-black/40 backdrop-blur-sm">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-300"
      >
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-white/50" />
          <span className="text-sm font-light uppercase tracking-widest text-white/60">
            Insights & Logs
          </span>
          <motion.span 
            animate={{ 
              rotate: isOpen ? 180 : 0,
              color: isOpen ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.3)"
            }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </div>
        <span className="text-xs text-white/30 font-light">
          {trace.length} logs
        </span>
      </motion.button>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-white/8"
          >
            <div className="p-8 space-y-6">
              {/* Tab Navigation */}
              <div className="flex gap-6 border-b border-white/6 pb-4">
                <button
                  onClick={() => setActiveTab("trace")}
                  className={`flex items-center gap-2 text-sm font-light uppercase tracking-widest transition-colors duration-300 pb-2 border-b-2 ${
                    activeTab === "trace"
                      ? "text-white/70 border-white/30"
                      : "text-white/30 border-transparent hover:text-white/50"
                  }`}
                >
                  <Activity className="w-3 h-3" />
                  Optimization Trace
                </button>
                
                <button
                  onClick={() => setActiveTab("physics")}
                  className={`flex items-center gap-2 text-sm font-light uppercase tracking-widest transition-colors duration-300 pb-2 border-b-2 ${
                    activeTab === "physics"
                      ? "text-whitepace/70 border-white/30"
                      : "text-white/30 border-transparent hover:text-white/50"
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  Physics Reference
                </button>
              </div>

              {/* Trace Content */}
              {activeTab === "trace" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="max-h-64 overflow-y-auto custom-scrollbar font-mono text-[10px] space-y-2"
                >
                  {trace.length > 0 ? (
                    trace.map((log, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="flex gap-6 group hover:text-white/30 transition-colors"
                      >
                        <span className="text-white/8 shrink-0 select-none">
                          {i.toString().padStart(3, '0')}
                        </span>
                        <span className="text-white/40 font-light break-words">
                          {log}
                        </span>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex gap-6 text-white/25">
                      <span className="text-white/8">—</span>
                      <span className="font-light">Ready for optimization...</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Physics Reference Content */}
              {activeTab === "physics" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    {[
                      {
                        name: "Beam Splitter",
                        desc: "50/50 unitary coupling between two optical modes",
                        formula: "BS(θ) = 1/√2 [e^(iθ),  1; 1, -e^(iθ)]"
                      },
                      {
                        name: "Phase Shifter",
                        desc: "Introduces tunable phase delay φ",
                        formula: "PS(φ) = diag(e^(iφ), 1)"
                      },
                      {
                        name: "Detector",
                        desc: "Measures photonic state and computes fidelity",
                        formula: "F = |⟨ψ_target|ψ_measured⟩|²"
                      }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-lg bg-white/[0.02] border border-white/8"
                      >
                        <h4 className="text-xs font-medium uppercase tracking-widest text-white/60 mb-2">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-white/40 font-light mb-3">
                          {item.desc}
                        </p>
                        <div className="font-mono text-[9px] text-white/30 bg-white/[0.01] p-2 rounded border border-white/6">
                          {item.formula}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
