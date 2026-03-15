"use client";

import { motion } from "framer-motion";

export default function ResearchSection() {
  return (
    <section id="research" className="py-32 px-6 relative border-y border-white/5 bg-[#0D1321]/30">
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/grid.svg')] bg-center"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl md:text-5xl font-medium heading-font leading-tight mb-8">
            Built on beam splitter physics, interferometric modeling, and optimization algorithms derived from <span className="text-white">quantum optics literature</span>.
          </h2>
          <p className="text-[#a1a1aa] font-light text-lg">
            Empowering the next generation of researchers with scalable simulation tooling.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
