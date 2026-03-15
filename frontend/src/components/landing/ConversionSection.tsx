"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function ConversionSection() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const [metrics, setMetrics] = useState<{ [key: string]: number }>({
    fidelity: 0,
    convergence: 0,
    states: 0
  });

  // Animate metrics count-up
  useEffect(() => {
    if (!inView) return;

    const targets = {
      fidelity: 99.7,
      convergence: 94.2,
      states: 256
    };

    const durations = {
      fidelity: 2000,
      convergence: 2000,
      states: 2000
    };

    Object.entries(targets).forEach(([key, target]) => {
      const startTime = Date.now();
      const duration = durations[key as keyof typeof durations];

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setMetrics(prev => ({
          ...prev,
          [key]: Math.floor(target * progress * 100) / 100
        }));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    });
  }, [inView]);

  const metricCards = [
    {
      label: "Max Fidelity",
      value: metrics.fidelity,
      unit: "%",
      description: "Circuit output state purity"
    },
    {
      label: "Avg Convergence",
      value: metrics.convergence,
      unit: "%",
      description: "Population fitness improvement"
    },
    {
      label: "Supported States",
      value: metrics.states,
      unit: "",
      description: "Quantum state configurations"
    }
  ];

  return (
    <section 
      ref={ref}
      className="relative py-24 px-6 overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[250px] bg-violet-600/[0.04] rounded-full blur-[120px]"></div>
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
            PERFORMANCE METRICS
          </span>
          <h2 className="text-4xl lg:text-5xl font-light tracking-tight leading-tight mt-4 text-white/95">
            Proven Quantum Optimization
          </h2>
          <p className="mt-6 text-base text-white/50 max-w-2xl mx-auto font-light">
            Experience the power of physics-informed genetic algorithms for quantum circuit design.
          </p>
        </motion.div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT: Metrics Cards */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8 }}
          >
            {metricCards.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="group glassmorphic-premium p-8 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-xl"
              >
                {/* Label */}
                <div className="text-xs font-medium uppercase tracking-widest text-white/50 group-hover:text-white/70 transition-colors">
                  {metric.label}
                </div>

                {/* Large Metric Value */}
                <div className="mt-6 flex items-baseline gap-1">
                  <div className="text-5xl lg:text-6xl font-light text-white/95">
                    {metric.value.toFixed(metric.value < 100 ? 1 : 0)}
                  </div>
                  <span className="text-2xl text-white/40 font-light">
                    {metric.unit}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-6 text-sm text-white/40 group-hover:text-white/50 transition-colors font-light">
                  {metric.description}
                </p>

                {/* Progress Bar */}
                <div className="mt-6 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500/40 to-cyan-400/20"
                    initial={{ width: "0%" }}
                    animate={inView ? { width: `${(metric.value / 100) * 100}%` } : { width: "0%" }}
                    transition={{ duration: 2 }}
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* RIGHT: CTA Block */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8 }}
          >
            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8 }}
              whileHover={{ y: -2 }}
              className="group"
            >
              <Link
                href="/dashboard"
                className="relative block glassmorphic-premium p-10 rounded-lg border border-white/15 hover:border-white/25 transition-all duration-300 overflow-hidden"
              >
                {/* Animated background gradient on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-cyan-500/[0.03] to-violet-500/[0.03]"></div>

                <div className="relative z-10">
                  <div className="text-[11px] font-medium uppercase tracking-[2px] text-cyan-400/70 group-hover:text-cyan-300 transition-colors">
                    Primary Action
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-light mt-4 text-white/95 leading-tight">
                    Launch<br />Optimization<br />Workspace
                  </h3>
                  <p className="mt-6 text-sm text-white/50 group-hover:text-white/60 transition-colors font-light">
                    Start designing quantum circuits with AI-powered evolutionary search. Full access to physics engine and optimization controls.
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-sm font-light text-white/70 group-hover:text-white/90 transition-colors">
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              whileHover={{ y: -2 }}
              className="group"
            >
              <Link
                href="#research"
                className="relative block glassmorphic p-10 rounded-lg border border-white/8 hover:border-white/15 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/[0.02] to-white/[0.01]"></div>

                <div className="relative z-10">
                  <div className="text-[11px] font-medium uppercase tracking-[2px] text-white/40 group-hover:text-white/60 transition-colors">
                    Secondary Action
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-light mt-4 text-white/75 group-hover:text-white/95 transition-colors leading-tight">
                    Explore<br />Physics<br />Engine
                  </h3>
                  <p className="mt-6 text-sm text-white/40 group-hover:text-white/50 transition-colors font-light">
                    Deep dive into quantum simulation, photonic components, and circuit physics. Educational resources and documentation.
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-sm font-light text-white/50 group-hover:text-white/70 transition-colors">
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-4 text-center text-xs text-white/30 font-light tracking-wide"
            >
              ✓ Used by quantum research teams worldwide
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-20 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent origin-left"
        ></motion.div>
      </div>
    </section>
  );
}
