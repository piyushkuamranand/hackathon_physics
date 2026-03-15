"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  insights?: ReactNode;
}

export default function DashboardLayout({ sidebar, children, insights }: DashboardLayoutProps) {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      
      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-30 border-b border-white/8 bg-black/40 backdrop-blur-sm px-8 py-6"
      >
        <div className="max-w-full">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light tracking-tight text-white/95 heading-font">
                Quantum Circuit Optimizer
              </h1>
              <p className="text-xs text-white/40 mt-2 font-light">
                Design and optimize photonic quantum circuits
              </p>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-xs text-white/40 tracking-widest uppercase font-light">
                WORKSPACE
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative z-20">
        
        {/* Sidebar - Fixed Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-80 border-r border-white/8 bg-black/30 backdrop-blur-sm overflow-y-auto custom-scrollbar shrink-0 p-6 flex flex-col gap-6"
        >
          {sidebar}
        </motion.div>

        {/* Main Grid Content - Scrollable */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 overflow-y-auto custom-scrollbar p-8"
        >
          {/* Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
            {children}
          </div>
        </motion.div>
      </div>

      {/* Bottom Insights Panel - Full Width, Collapsible */}
      {insights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-10 border-t border-white/8 bg-black/30 backdrop-blur-sm shrink-0"
        >
          {insights}
        </motion.div>
      )}
    </div>
  );
}
