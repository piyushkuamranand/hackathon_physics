"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function OptimizationWorkflow() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  // Workflow stages
  const stages = [
    { label: "Input", position: 0 },
    { label: "Population", position: 1 },
    { label: "Simulation", position: 2 },
    { label: "Fitness", position: 3 },
    { label: "Best Circuit", position: 4 }
  ];

  // Pulse animation
  const pulseVariants = {
    initial: { x: "-100%", opacity: 0 },
    animate: {
      x: "100%",
      opacity: [0, 1, 1, 1, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatDelay: 1
      }
    }
  };

  return (
    <section 
      ref={ref}
      className="relative py-24 px-6 overflow-hidden"
    >
      {/* Subtle background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-cyan-600/[0.04] rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-[11px] font-medium uppercase tracking-[2px] text-white/40">
            OPTIMIZATION WORKFLOW
          </span>
          <h2 className="text-4xl lg:text-5xl font-light tracking-tight leading-tight mt-4 text-white/95">
            Premium Genetic Evolution Pipeline
          </h2>
          <p className="mt-6 text-base text-white/50 max-w-2xl mx-auto font-light">
            A sophisticated five-stage workflow for optimizing quantum optical circuits through population-based search and physics-driven evaluation.
          </p>
        </motion.div>

        {/* Workflow Container */}
        <div className="flex justify-center items-center">
          <div className="relative w-full max-w-4xl h-64 flex items-center">
            
            {/* Background animated pulse line */}
            <motion.div
              variants={pulseVariants}
              initial="initial"
              animate={inView ? "animate" : "initial"}
              className="absolute top-1/2 left-0 right-0 h-0.5 transform -translate-y-1/2 z-0"
            >
              {/* Gradient pulse */}
              <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent blur-sm"></div>
            </motion.div>

            {/* Subtle connection line */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] transform -translate-y-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent z-0"></div>

            {/* Workflow Nodes */}
            <div className="relative w-full h-full flex justify-between items-center px-0">
              {stages.map((stage, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center z-10 flex-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  {/* Node Circle */}
                  <motion.div
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/15 flex items-center justify-center relative group"
                    whileHover={{ 
                      borderColor: "rgba(0, 245, 255, 0.5)",
                      boxShadow: "0 0 20px rgba(0, 245, 255, 0.2)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Inner dot */}
                    <div className="w-2 h-2 rounded-full bg-cyan-400/60 group-hover:bg-cyan-300 transition-colors"></div>
                    
                    {/* Glow on hover */}
                    <div className="absolute inset-0 rounded-full bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors"></div>
                  </motion.div>

                  {/* Node Label */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                    className="mt-6 text-sm font-light text-white/70 text-center whitespace-nowrap"
                  >
                    {stage.label}
                  </motion.p>
                </motion.div>
              ))}
            </div>

            {/* Arrow indicators between nodes */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-6 pointer-events-none z-0">
              {[0, 1, 2, 3].map((index) => (
                <motion.div
                  key={`arrow-${index}`}
                  className="w-6 h-[1px] bg-gradient-to-r from-white/20 to-transparent flex items-center justify-end"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.2 + index * 0.05, duration: 0.6 }}
                >
                  <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Workflow Description Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {stages.map((stage, index) => (
            <div
              key={index}
              className="group glassmorphic p-6 rounded-lg border border-white/5 hover:border-white/10 transition-all duration-300"
            >
              <div className="text-xs font-medium uppercase tracking-widest text-cyan-400/70 group-hover:text-cyan-300 transition-colors">
                Stage {index + 1}
              </div>
              <h4 className="text-lg font-light mt-3 text-white/90">
                {stage.label}
              </h4>
              <p className="text-xs text-white/40 mt-3 font-light group-hover:text-white/50 transition-colors">
                {index === 0 && "Initialize quantum circuit parameters"}
                {index === 1 && "Generate candidate circuit variations"}
                {index === 2 && "Execute quantum circuit simulation"}
                {index === 3 && "Evaluate circuit output fidelity"}
                {index === 4 && "Extract optimal circuit configuration"}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Technical Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-white/30 font-light tracking-wide">
            Continuous evolution → Maximum fidelity convergence
          </p>
        </motion.div>
      </div>
    </section>
  );
}
