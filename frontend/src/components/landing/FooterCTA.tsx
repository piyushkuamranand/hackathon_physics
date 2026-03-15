"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Atom } from "lucide-react";

export default function FooterCTA() {
  return (
    <footer className="relative pt-32 pb-12 px-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[400px] bg-[#00F5FF]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-32"
        >
          <h2 className="text-5xl md:text-7xl font-medium heading-font mb-8">
            Start Designing <br />
            <span className="text-gradient">Quantum Experiments</span>
          </h2>
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black rounded-full font-medium text-lg hover:scale-105 transition-transform"
          >
            Open Platform
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Real Footer Links */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-sm text-[#a1a1aa]">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Atom className="w-4 h-4 text-[#00F5FF]" />
            <span className="font-semibold text-white">Q-Designer</span>
            <span className="ml-2">© {new Date().getFullYear()}</span>
          </div>
          
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
