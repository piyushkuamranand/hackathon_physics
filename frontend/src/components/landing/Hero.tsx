"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  // Mini circuit components configuration
  const circuitNodes = [
    { type: "BS", label: "Beam Splitter", phase: 0 },
    { type: "PS", label: "Phase Shifter", phase: 1.57 },
    { type: "BS", label: "Beam Splitter", phase: 0 },
    { type: "D", label: "Detector", phase: 0 }
  ];

  // Photon animation variants
  const photonVariants = {
    initial: { x: 0, opacity: 0 },
    animate: {
      x: [0, 100, 220, 340, 460],
      opacity: [1, 1, 1, 1, 1],
      transition: {
        duration: 4,
        repeat: Infinity
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20 overflow-hidden bg-gradient-to-b from-black via-slate-950 to-black">
      
      {/* Subtle Background Glow - Restrained */}
      <div className="absolute top-40 left-20 w-96 h-96 bg-cyan-600/[0.08] rounded-full blur-[120px] pointer-events-none opacity-30"></div>
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-violet-600/[0.06] rounded-full blur-[100px] pointer-events-none opacity-20"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        
        {/* LEFT COLUMN - Content */}
        <div className="flex flex-col gap-8 max-w-lg">
          
          {/* Product Label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex w-fit"
          >
            <span className="text-[11px] font-medium uppercase tracking-[2px] text-white/40">QOED</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl lg:text-6xl font-light tracking-tight leading-[1.15] text-white/95"
          >
            Quantum Optical<br />Circuit Design<br />Engine
          </motion.h1>

          {/* Scientific Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base lg:text-lg text-white/50 font-light leading-relaxed max-w-lg"
          >
            Optimize photonic quantum circuits using evolutionary search and physics-based simulation.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 pt-6"
          >
            {/* Primary CTA */}
            <Link 
              href="/dashboard"
              className="group relative px-8 py-3.5 bg-white/10 border border-white/15 text-white rounded-lg font-light text-sm uppercase tracking-wide transition-all duration-300 hover:bg-white/15 hover:border-white/25 flex items-center justify-center gap-2"
            >
              Launch Workspace
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {/* Secondary CTA */}
            <Link 
              href="#research"
              className="px-8 py-3.5 bg-transparent border border-white/8 text-white/70 rounded-lg font-light text-sm uppercase tracking-wide transition-all duration-300 hover:bg-white/[0.03] hover:border-white/15 hover:text-white/85 flex items-center justify-center"
            >
              Explore Physics Engine
            </Link>
          </motion.div>
        </div>

        {/* RIGHT COLUMN - Mini Circuit Preview */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-md h-64 flex items-center justify-center">
            
            {/* Circuit Container with Glass */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/6 rounded-xl backdrop-blur-sm shadow-xl shadow-black/30"></div>

            {/* Circuit Content */}
            <div className="relative z-10 w-full px-8 flex items-center justify-between">
              
              {/* Circuit Components - Sequential Animation */}
              {circuitNodes.map((node, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.5 + i * 0.15,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="flex flex-col items-center gap-2"
                >
                  {/* Component Card */}
                  <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/12 backdrop-blur-sm shadow-lg shadow-white/[0.05]">
                    <span className="text-sm font-light text-white/85">{node.type}</span>
                  </div>
                  
                  {/* Label */}
                  <span className="text-[10px] text-white/25 font-light text-center leading-tight">
                    {node.label}
                  </span>
                </motion.div>
              ))}

              {/* Connection Arrows */}
              {circuitNodes.map((_, i) => (
                i < circuitNodes.length - 1 && (
                  <motion.div
                    key={`arrow-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.8 + i * 0.15
                    }}
                    className="absolute h-px bg-gradient-to-r from-white/20 to-white/5"
                    style={{
                      width: "20px",
                      left: `${60 + i * 92}px`,
                      top: "50%"
                    }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-white/20 rotate-45"></div>
                  </motion.div>
                )
              ))}
            </div>

            {/* Photon Pulse Animation */}
            <motion.div
              variants={photonVariants}
              initial="initial"
              animate="animate"
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400/60 blur-md"
              style={{ left: 0 }}
            ></motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
