"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Atom } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#capabilities" },
    { label: "Physics", href: "#research" },
    { label: "Workflow", href: "#workflow" },
    { label: "Workspace", href: "/dashboard" }
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-5 flex items-center justify-between transition-all duration-300 ${
        isScrolled
          ? "glassmorphic-dark border-b border-white/5"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* LEFT: Logo */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center gap-2.5"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#00F5FF]/20 to-[#8B5CF6]/20 flex items-center justify-center border border-[#00F5FF]/25">
          <Atom className="w-3.5 h-3.5 text-[#00F5FF]" />
        </div>
        <span className="font-light heading-font text-white tracking-wider text-sm">
          QOED
        </span>
      </motion.div>

      {/* CENTER: Navigation Links */}
      <motion.div
        className="hidden lg:flex items-center gap-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        {navLinks.map((link, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.08, duration: 0.6 }}
          >
            <Link
              href={link.href}
              className="relative group text-sm font-light text-white/60 hover:text-white/90 transition-colors"
            >
              <span className="relative">
                {link.label}
                {/* Smooth underline on hover */}
                <motion.span
                  className="absolute bottom-0 left-0 h-[1px] bg-white/60"
                  initial={{ width: "0%" }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                ></motion.span>
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* RIGHT: Launch Button */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center gap-4"
      >
        <Link
          href="/dashboard"
          className="group relative px-6 py-2.5 bg-white/8 border border-white/15 text-white rounded-lg font-light text-sm uppercase tracking-wide transition-all duration-300 hover:bg-white/12 hover:border-white/25 flex items-center gap-2"
        >
          <span>Launch</span>
          <motion.span
            initial={{ x: 0 }}
            whileHover={{ x: 2 }}
            transition={{ duration: 0.3 }}
          >
            →
          </motion.span>
        </Link>
      </motion.div>
    </motion.nav>
  );
}
