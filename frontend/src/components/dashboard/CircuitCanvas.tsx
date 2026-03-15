"use client";

import React, { useMemo } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import { CircuitComponent } from "@/types/api";

// Helper to map your circuit array to ReactFlow nodes/edges
function circuitToFlow(circuit: CircuitComponent[]) {
  const nodes = circuit.map((comp, idx) => ({
    id: String(idx),
    type: "default",
    data: { label: comp.type },
    position: { x: 100 + idx * 180, y: 200 },
    style: {
      borderRadius: 12,
      border: "2px solid #0ff",
      background: "#18181b",
      color: "#fff",
      fontWeight: 500,
      fontSize: 18,
      minWidth: 60,
      minHeight: 40,
      boxShadow: "0 2px 12px rgba(0,255,255,0.08)"
    }
  }));
  const edges = circuit.slice(1).map((_, idx) => ({
    id: `e${idx}-${idx+1}`,
    source: String(idx),
    target: String(idx+1),
    animated: true,
    style: { stroke: "#0ff", strokeWidth: 2 }
  }));
  return { nodes, edges };
}

export default function CircuitCanvas({ circuit }: { circuit: CircuitComponent[] }) {
  const { nodes, edges } = useMemo(() => circuitToFlow(circuit), [circuit]);
  return (
    <div style={{ width: "100%", height: 400, background: "#18181b", borderRadius: 16, boxShadow: "0 2px 24px #0008", margin: "auto" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background color="#222" gap={16} />
      </ReactFlow>
    </div>
  );
}

            {/* Detector Node */}
            <motion.div variants={itemVariants} className="flex flex-col items-center relative group">
               <div className="w-20 h-20 rounded-2xl bg-[#120a02]/60 backdrop-blur-xl border border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.15),inset_0_2px_15px_rgba(245,158,11,0.08)] flex items-center justify-center transition-all duration-400 group-hover:shadow-[0_0_35px_rgba(245,158,11,0.3),inset_0_2px_20px_rgba(245,158,11,0.15)] group-hover:-translate-y-1">
                 <div className="text-amber-200 mt-1 font-light text-[26px] font-serif italic text-shadow-sm shadow-amber-500">D</div>
               </div>
               <div className="absolute top-[96px] text-center w-32 flex flex-col items-center gap-2">
                 <div className="text-[10px] text-white/50 tracking-[0.15em] font-light uppercase">Detector</div>
                 <div className="text-[9px] font-mono text-amber-300 flex items-center gap-1.5 font-light bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30 backdrop-blur-sm shadow-[0_2px_10px_rgba(245,158,11,0.1)]">
                    100% probability
                 </div>
               </div>
            </motion.div>

            {/* Cyan Connection + Directional Arrow */}
            <motion.div variants={lineVariants} className="flex-1 mt-[32px] h-px bg-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.4)] flex items-center justify-center origin-left relative -mx-2">
               <div className="w-1.5 h-1.5 border-t border-r border-cyan-300 rotate-45" />
            </motion.div>

            {/* PS 2 Node */}
            <motion.div variants={itemVariants} className="flex flex-col items-center relative group">
               <div className="w-20 h-20 rounded-2xl bg-[#0a0512]/60 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.15),inset_0_2px_15px_rgba(168,85,247,0.08)] flex items-center justify-center transition-all duration-400 group-hover:shadow-[0_0_35px_rgba(168,85,247,0.3),inset_0_2px_20px_rgba(168,85,247,0.15)] group-hover:-translate-y-1">
                 <div className="text-purple-300 mt-1 font-light text-xl tracking-widest text-shadow-sm shadow-purple-500">PS</div>
               </div>
               <div className="absolute top-[96px] text-center w-32 flex flex-col items-center gap-2">
                 <div className="text-[10px] text-white/50 tracking-[0.15em] font-light uppercase">Phase Shifter</div>
                 <div className="text-[9px] font-mono text-purple-300 flex items-center gap-1.5 font-light bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20 backdrop-blur-sm shadow-[0_2px_10px_rgba(168,85,247,0.1)]">
                    θ = 1.28 rad
                 </div>
               </div>
            </motion.div>

            {/* Cyan Connection + Directional Arrow */}
            <motion.div variants={lineVariants} className="flex-1 mt-[32px] h-px bg-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.4)] flex items-center justify-center origin-left relative -mx-2">
               <div className="w-1.5 h-1.5 border-t border-r border-cyan-300 rotate-45" />
            </motion.div>

            {/* Output Node */}
            <motion.div variants={itemVariants} className="flex flex-col items-center relative group">
               <div className="w-16 h-16 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)] flex items-center justify-center transition-all duration-300">
                  <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white/70" />
                  </div>
               </div>
               <div className="absolute top-[80px] text-center w-32 flex flex-col items-center">
                 <div className="text-[10px] text-white/40 tracking-[0.2em] font-light uppercase">Output</div>
               </div>
            </motion.div>

          </div>
        </motion.div>
      </div>

      {/* Debug Console - Minimal Premium Glass */}
      {debugMode && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-white/6 font-mono text-[8px] text-white/20 bg-white/[0.02] backdrop-blur-sm p-4 rounded-lg border border-white/6 shadow-lg shadow-black/20"
        >
          <div className="mb-3 uppercase tracking-widest text-white/15 font-light">Circuit JSON</div>
          <pre className="w-full max-h-28 overflow-y-auto custom-scrollbar whitespace-pre-wrap break-words text-white/20 font-light">{JSON.stringify(circuit, null, 2)}</pre>
        </motion.div>
      )}
    </div>
  );
}
