"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface InputCardProps {
  label: string;
  children: ReactNode;
  description?: string;
}

export default function InputCard({ label, children, description }: InputCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glassmorphic p-4 rounded-lg border border-white/8 hover:border-white/12 transition-all duration-300"
    >
      <label className="text-xs font-medium uppercase tracking-widest text-white/40">
        {label}
      </label>
      {description && (
        <p className="text-[10px] text-white/30 mt-1 font-light">{description}</p>
      )}
      <div className="mt-4">
        {children}
      </div>
    </motion.div>
  );
}
