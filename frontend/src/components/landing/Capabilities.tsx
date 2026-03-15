"use client";

import { motion } from "framer-motion";
import { Cpu, Network, Activity, Lightbulb } from "lucide-react";

export default function Capabilities() {
  const cards = [
    {
      icon: <Network className="w-8 h-8 text-[#00F5FF]" />,
      title: "Quantum Circuit Optimization",
      desc: "Genetic algorithms evolve optical setups mathematically structured to reach target Bell or GHZ states with minimal noise."
    },
    {
      icon: <Cpu className="w-8 h-8 text-[#8B5CF6]" />,
      title: "Photonic Simulation Engine",
      desc: "Kronecker-product scaled physics module precisely calculates vector states dynamically for 2 to 4 qubits."
    },
    {
      icon: <Activity className="w-8 h-8 text-[#00F5FF]" />,
      title: "Fidelity Prediction",
      desc: "Instant inner-product calculation comparing simulated photon pathways against ideal quantum mechanical targets."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-[#8B5CF6]" />,
      title: "AI Circuit Discovery",
      desc: "Recommends configuration replacements—like swapping beam splitters—to drastically improve noise resilience."
    }
  ];

  return (
    <section id="platform" className="py-32 px-6 bg-[#050816] relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-medium heading-font mb-6">Engineered for <span className="text-gradient">Discovery</span></h2>
          <p className="text-lg text-[#a1a1aa] max-w-2xl mx-auto font-light">
            An end-to-end framework allowing researchers to bypass manual optic alignments and generate proven photonic arrangements.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="p-10 rounded-3xl bg-[#0D1321]/50 border border-white/5 hover:border-[#00F5FF]/30 transition-colors group glass-panel"
            >
              <div className="mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500">
                {card.icon}
              </div>
              <h3 className="text-2xl font-medium heading-font text-white mb-4">{card.title}</h3>
              <p className="text-[#a1a1aa] leading-relaxed font-light">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
