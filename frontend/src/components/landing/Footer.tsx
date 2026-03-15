"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Atom } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "Docs", href: "#docs" },
    { label: "GitHub", href: "https://github.com" },
    { label: "Contact", href: "mailto:hello@qoed.dev" }
  ];

  return (
    <footer className="relative mt-auto py-16 px-6 border-t border-white/5">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-cyan-600/[0.02] rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center justify-items-center md:justify-items-start">
          
          {/* LEFT: Logo & Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#00F5FF]/15 to-[#8B5CF6]/15 flex items-center justify-center border border-[#00F5FF]/20">
              <Atom className="w-3 h-3 text-[#00F5FF]" />
            </div>
            <span className="font-light heading-font text-white tracking-wide text-lg">
              QOED
            </span>
          </motion.div>

          {/* CENTER: Scientific Identity */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-xs font-light text-white/40 tracking-widest uppercase">
              Quantum Optical<br />Circuit Evolution
            </p>
          </motion.div>

          {/* RIGHT: Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex items-center gap-6"
          >
            {footerLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="relative group text-sm font-light text-white/50 hover:text-white/80 transition-colors"
                >
                  <span className="relative">
                    {link.label}
                    {/* Subtle underline animation */}
                    <motion.span
                      className="absolute bottom-0 left-0 h-[1px] bg-white/40"
                      initial={{ width: "0%" }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    ></motion.span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Divider Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true }}
          className="my-12 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent origin-left"
        ></motion.div>

        {/* Footer Meta */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-light text-white/30"
        >
          <div>
            © {currentYear} QOED. Quantum optical circuit design engine.
          </div>
          <div className="flex items-center gap-4">
            <span>Built with physics</span>
            <span className="text-white/15">•</span>
            <span>Optimized for quantum</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
