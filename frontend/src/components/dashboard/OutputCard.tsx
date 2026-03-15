"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface OutputCardProps {
  title: string;
  children: ReactNode;
  colSpan?: number;
  className?: string;
  featured?: boolean;
}

export default function OutputCard({ 
  title, 
  children, 
  colSpan = 1,
  className = "",
  featured = false
}: OutputCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ gridColumn: `span ${colSpan}` }}
      className={`glassmorphic-premium p-6 rounded-lg border transition-all duration-300 ${
        featured
          ? "border-white/15 hover:border-white/25 shadow-xl shadow-white/[0.05]"
          : "border-white/8 hover:border-white/12"
      } ${className}`}
    >
      {title && (
        <div className="text-xs font-medium uppercase tracking-widest text-white/40 mb-4">
          {title}
        </div>
      )}
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </motion.div>
  );
}
