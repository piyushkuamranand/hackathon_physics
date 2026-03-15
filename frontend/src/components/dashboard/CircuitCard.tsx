"use client";

import { motion } from "framer-motion";
import OutputCard from "./OutputCard";
import { CircuitComponent } from "@/types/api";

export default function CircuitCard({ circuit, isOptimizing }: { circuit: CircuitComponent[], isOptimizing: boolean }) {
  const nodes = circuit || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.08, delayChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 15 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { duration: 0.5 } 
    }
  };

  const getComponentColor = (type: string) => {
    switch(type) {
      case "BS": return { bg: "from-blue-500/20 to-blue-600/15", border: "border-blue-500/40", accent: "text-blue-300" };
      case "PS": return { bg: "from-purple-500/20 to-purple-600/15", border: "border-purple-500/40", accent: "text-purple-300" };
      case "D": return { bg: "from-amber-500/20 to-amber-600/15", border: "border-amber-500/40", accent: "text-amber-300" };
      default: return { bg: "from-white/10 to-white/5", border: "border-white/20", accent: "text-white/70" };
    }
  };

  const getComponentDesc = (type: string) => {
    switch(type) {
      case "BS": return "Beam Splitter";
      case "PS": return "Phase Shifter";
      case "D": return "Detector";
      default: return "Component";
    }
  };

  return (
    <OutputCard 
      title="Optical Experiment Table: Linear Circuit Layout" 
      colSpan={2} 
      featured
      className="min-h-[480px]"
    >
      <div className="relative flex-1 flex flex-col rounded-lg overflow-hidden bg-gradient-to-b from-white/[0.01] to-white/[0.005] border border-white/6 p-8">
        {/* Grid background */}
        <div 
          className="absolute inset-0 opacity-[0.003] pointer-events-none" 
          style={{ 
            backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", 
            backgroundSize: "60px 60px" 
          }} 
        />

        {/* Linear Optical Table */}
        <div className="relative z-10">
          {nodes.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-white/20 text-[10px] tracking-widest uppercase font-light text-center py-20"
            >
              {isOptimizing ? (
                <div className="flex flex-col items-center gap-3">
                  <motion.div 
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex gap-1"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                  </motion.div>
                  <span>Optimizing quantum circuit...</span>
                </div>
              ) : (
                "Awaiting optimization"
              )}
            </motion.div>
          )}
          
          {/* Left-to-Right Linear Flow */}
          {nodes.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Main circuit flow line */}
              <div className="relative pt-12 pb-8">
                {/* Horizontal flow connector */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                {/* Components arranged left-to-right */}
                <div className="flex items-start justify-between gap-2 relative">
                  {nodes.map((node, idx) => {
                    const colors = getComponentColor(node.type);
                    
                    return (
                      <div key={node.id || idx} className="flex-1 flex flex-col items-center">
                        {/* Component Box */}
                        <motion.div 
                          variants={itemVariants}
                          className={`relative w-24 h-20 flex flex-col items-center justify-center transition-all duration-300 rounded-lg backdrop-blur-sm border ${colors.border} bg-gradient-to-b ${colors.bg} shadow-lg hover:shadow-xl hover:shadow-white/10 group`}
                        >
                          {/* Component Type */}
                          <div className="text-center">
                            <div className={`text-2xl font-light font-mono ${colors.accent}`}>
                              {node.type}
                            </div>
                            <div className="text-[9px] uppercase tracking-wider text-white/40 font-light mt-1">
                              {getComponentDesc(node.type)}
                            </div>
                          </div>
                        </motion.div>

                        {/* Component Index */}
                        <div className="text-[10px] text-white/30 mt-2 font-mono">#{idx}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Connection arrows between components */}
                {nodes.length > 1 && (
                  <div className="absolute top-8 left-0 right-0 flex justify-between px-12 pointer-events-none">
                    {nodes.slice(0, -1).map((_, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ delay: idx * 0.1 + 0.4, duration: 0.6 }}
                        className="flex-1 flex items-center justify-center"
                      >
                        {/* Arrow pointing right */}
                        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" className="opacity-40">
                          <path d="M0 6h20M20 2l4 4-4 4" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
                        </svg>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Legend and Description */}
              <div className="pt-6 border-t border-white/6">
                <div className="text-[9px] uppercase tracking-widest text-white/30 mb-3 font-light">Optical Table Flow</div>
                <div className="text-[11px] text-white/40 leading-relaxed font-light">
                  This represents a reproducible quantum experiment layout. Photons flow left-to-right through <span className="text-white/60">{nodes.length} optical components</span>, where each element performs its designated function in creating the target quantum state.
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </OutputCard>
  );
}
