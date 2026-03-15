"use client";

import { motion } from "framer-motion";
import OutputCard from "./OutputCard";


interface CircuitComponent {
  type: string;
  ratio?: number;
  phase?: number;
  probability?: number;
  [key: string]: unknown;
}

interface ResultsCardsProps {
  metrics: {
    fidelity: number | null;
    components: number;
    generation: number;
    spdcCount?: number;
  };
  circuit: CircuitComponent[];
  mode?: string;
  status?: string;
}

export default function ResultsCardsGrid({ metrics, circuit, mode, status }: ResultsCardsProps) {
  return (
    <>
      {/* State Fidelity - Hero Metric */}
      <OutputCard 
        title={mode === "preview" ? "Seed preview" : "Simulated result"} 
        colSpan={1}
        featured
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-baseline gap-2"
        >
          {metrics.fidelity === null ? (
            <div className="text-2xl font-light text-white/70 tracking-tight py-2">
              Physics pending
            </div>
          ) : (
            <>
              <motion.div 
                className="text-5xl font-light text-white/95 tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                {(metrics.fidelity * 100).toFixed(1)}
              </motion.div>
              <span className="text-xl text-white/40 font-light">%</span>
            </>
          )}
        </motion.div>
        
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/6 mt-5 relative overflow-hidden rounded-full">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: metrics.fidelity === null ? "0%" : `${metrics.fidelity * 100}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500/60 to-cyan-400/40 rounded-full"
          />
        </div>

        {/* Status Indicator */}
        <motion.div 
          className="mt-4 text-xs text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {metrics.fidelity === null ? (
            <span className="text-white/40">◯ {status || "Physics pending"}</span>
          ) : metrics.fidelity > 0.9 ? (
            <span className="text-cyan-400/70">✓ Excellent convergence</span>
          ) : metrics.fidelity > 0.75 ? (
            <span className="text-orange-400/70">◐ Good progress</span>
          ) : metrics.fidelity > 0.5 ? (
            <span className="text-yellow-400/70">◑ Optimizing...</span>
          ) : (
            <span className="text-white/40">◯ Awaiting results</span>
          )}
        </motion.div>
      </OutputCard>

      {/* Elements Count */}
      <OutputCard 
        title="Circuit Components"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div>
            <div className="text-3xl font-light text-white/85">
              {metrics.components || "—"}
            </div>
            <p className="text-[10px] text-white/30 mt-2">Total components</p>
          </div>

          {/* Component Breakdown */}
          {circuit.length > 0 && (
            <div className="pt-4 border-t border-white/6">
              <div className="text-[10px] text-white/40 mb-3">Breakdown:</div>
              <div className="space-y-1.5">
                {['BS', 'PS', 'D'].map((type) => {
                  const count = circuit.filter((c: CircuitComponent) => c.type === type).length;
                  return count > 0 ? (
                    <div key={type} className="flex justify-between text-xs">
                      <span className="text-white/50">{type === 'BS' ? 'Beam Splitter' : type === 'PS' ? 'Phase Shifter' : 'Detector'}</span>
                      <span className="text-white/70 font-mono">{count}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </motion.div>
      </OutputCard>

      {/* Generations Counter */}
      <OutputCard 
        title="Optimization Progress"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          <div>
            <div className="text-3xl font-light text-white/85">Gen {metrics.generation}</div>
            <p className="text-[10px] text-white/30 mt-2">Current generation</p>
          </div>
        </motion.div>
      </OutputCard>

      {/* Circuit Statistics */}
      <OutputCard 
        title="Circuit Metrics"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/50">Depth</span>
            <span className="font-mono text-white/75">{metrics.components * 2}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/50">Runtime</span>
            <span className="font-mono text-white/75">{(metrics.components * 3).toFixed(0)}ms</span>
          </div>
        </motion.div>
      </OutputCard>

      {/* SPDC Sources Tracker */}
      <OutputCard 
        title="SPDC Sources Tracker"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/50">SPDC Sources Used</span>
            <span className={`text-xl font-light font-mono ${
              (metrics.spdcCount || 0) >= 3 ? "text-red-500" : "text-white/75"
            }`}>
              {metrics.spdcCount || 0} / 3
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  (metrics.spdcCount || 0) >= i
                    ? i === 3 ? "bg-red-500/60" : "bg-cyan-500/60"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>
          {(metrics.spdcCount || 0) >= 3 && (
            <div className="text-xs text-red-500/70 pt-2 border-t border-red-500/20">
              ⚠ Maximum SPDC sources reached
            </div>
          )}
        </motion.div>
      </OutputCard>

      {/* Component Parameters with Descriptions */}
      {circuit.length > 0 && (
        <OutputCard 
          title="Physical Parameters & Purpose"
          colSpan={2}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-3 max-h-56 overflow-y-auto"
          >
            {circuit.map((comp: CircuitComponent, idx: number) => {
              let paramDisplay = "";
              let description = "";
              let bgColor = "bg-blue-500/10 border-blue-500/20";
              
              if (comp.type === "BS" || comp.type === "VBS") {
                const r1 = Math.round((comp.ratio || 0.5) * 100);
                const r2 = 100 - r1;
                paramDisplay = `${r1}:${r2} split`;
                description = "Distributes photons between two paths";
                bgColor = "bg-blue-500/10 border-blue-500/20";
              } else if (comp.type === "PS") {
                paramDisplay = `θ = ${(comp.phase || 0).toFixed(2)} rad`;
                description = "Introduces controllable phase shift";
                bgColor = "bg-purple-500/10 border-purple-500/20";
              } else if (comp.type === "D") {
                paramDisplay = `Detection`;
                description = "Measures photon arrival at output";
                bgColor = "bg-amber-500/10 border-amber-500/20";
              }
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-3 rounded border ${bgColor}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-white/70">[{idx}] {comp.type}</span>
                    <span className="font-mono text-[10px] text-white/60">{paramDisplay}</span>
                  </div>
                  <div className="text-[11px] text-white/40 font-light italic">
                    {description}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </OutputCard>
      )}


    </>
  );
}
