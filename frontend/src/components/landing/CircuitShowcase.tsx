"use client";

import { motion } from "framer-motion";

export default function CircuitShowcase() {
  const showcases = [
    {
      title: "Bell State Generator",
      fidelity: "0.992",
      complexity: "3 Components",
      desc: "Optimal generation of maximally entangled 2-qubit states using minimal beam splitters.",
      gradient: "from-[#00F5FF]/10 to-transparent"
    },
    {
      title: "GHZ State Generator",
      fidelity: "0.945",
      complexity: "5 Components",
      desc: "Multi-partite entanglement pipeline designed for robust 3-qubit state preparation.",
      gradient: "from-[#8B5CF6]/10 to-transparent"
    },
    {
      title: "Mach-Zehnder Interference",
      fidelity: "0.981",
      complexity: "4 Components",
      desc: "Classic interferometry mapping auto-calibrated to cancel phase-induced decoherence.",
      gradient: "from-[#00F5FF]/5 via-[#8B5CF6]/10 to-transparent"
    }
  ];

  return (
    <section id="experiments" className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-medium heading-font mb-6">Generated <span className="text-gradient">Circuits</span></h2>
          <p className="text-lg text-[#a1a1aa] font-light max-w-2xl">
            A selection of high-fidelity optical configurations generated autonomously by our ML optimizer.
          </p>
        </motion.div>

        <div className="flex flex-col gap-8">
          {showcases.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0D1321]/40 hover:bg-[#0D1321]/80 transition-all p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
              
              <div className="relative z-10 flex-1">
                <h3 className="text-3xl font-medium heading-font text-white mb-4">{item.title}</h3>
                <p className="text-[#a1a1aa] font-light text-lg mb-8 leading-relaxed max-w-xl">
                  {item.desc}
                </p>
                
                <div className="flex gap-6">
                  <div className="bg-[#050816] px-4 py-2 rounded-lg border border-white/5">
                    <div className="text-sm text-[#a1a1aa] mb-1">Fidelity</div>
                    <div className="text-xl font-medium text-[#00F5FF]">{item.fidelity}</div>
                  </div>
                  <div className="bg-[#050816] px-4 py-2 rounded-lg border border-white/5">
                    <div className="text-sm text-[#a1a1aa] mb-1">Complexity</div>
                    <div className="text-xl font-medium text-white">{item.complexity}</div>
                  </div>
                </div>
              </div>

              {/* Mock Circuit Visual */}
              <div className="relative z-10 w-full md:w-[400px] h-[200px] bg-[#050816]/50 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center p-6">
                 {/* Visual dots / lines representing quantum nodes */}
                 <div className="flex items-center gap-4 w-full justify-between">
                    {[1,2,3].map((node) => (
                       <div key={node} className="relative flex flex-col items-center gap-2">
                         <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#00F5FF]/30 transition-colors">
                            <span className="w-2 h-2 rounded-full bg-[#8B5CF6] group-hover:shadow-[0_0_10px_#8B5CF6]"></span>
                         </div>
                         {node < 3 && <div className="absolute right-[-40px] top-6 w-8 h-[1px] bg-gradient-to-r from-white/20 to-transparent"></div>}
                       </div>
                    ))}
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
