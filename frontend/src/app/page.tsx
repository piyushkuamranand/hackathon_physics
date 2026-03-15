"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { initAnimation } from "./animation";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface Stats {
  fidelity: number;
  particles: number;
  accuracy: number;
  latency: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Experiment card data
// ─────────────────────────────────────────────────────────────────────────────
const experiments = [
  {
    id: "exp-01",
    tag: "PHOTONIC",
    title: "HOM Interference",
    subtitle: "Hong–Ou–Mandel",
    description:
      "High-visibility two-photon interference on a tunable 50/50 directional coupler with adaptive phase locking.",
    fidelity: "0.982",
    badge: "Enterprise Grade",
    dots: [true, true, false],
    accent: "#06b6d4",
  },
  {
    id: "exp-02",
    tag: "ENTANGLEMENT",
    title: "Bell-State Prep",
    subtitle: "Polarisation Encoding",
    description:
      "Deterministic generation of all four Bell states via cascaded SPDC sources and electro-optic switching.",
    fidelity: "0.976",
    badge: "Research Grade",
    dots: [true, false, false],
    accent: "#818cf8",
  },
  {
    id: "exp-03",
    tag: "BOSON SAMPLING",
    title: "GBS Advantage",
    subtitle: "Gaussian Boson Sampling",
    description:
      "Programmable photonic chip demonstrating quantum computational advantage via squeezed-state interference.",
    fidelity: "0.991",
    badge: "Frontier",
    dots: [true, true, true],
    accent: "#34d399",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();

  // ── Live stats ────────────────────────────────────────────────────────────
  const [stats, setStats] = useState<Stats>({
    fidelity: 0.95,
    particles: 0,
    accuracy: 0.95,
    latency: 1.8,
  });

  useEffect(() => {
    const id = setInterval(() => {
      setStats({
        fidelity:  parseFloat((0.97  + Math.random() * 0.018).toFixed(3)),
        particles: Math.floor(1_800_000 + Math.random() * 200_000),
        accuracy:  parseFloat((0.975 + Math.random() * 0.015).toFixed(3)),
        latency:   parseFloat((1.2   + Math.random() * 0.8).toFixed(1)),
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  // ── Three.js init (waits for window.THREE from CDN) ──────────────────────
  const tryInit = useCallback(() => {
    if (typeof window !== "undefined" && (window as any).THREE) {
      const cleanup = initAnimation();
      return cleanup;
    }
    return null;
  }, []);

  useEffect(() => {
    let cleanup: (() => void) | null = null;

    // Poll until THREE is on window (CDN may not have run yet)
    const pollId = setInterval(() => {
      if (typeof window !== "undefined" && (window as any).THREE) {
        clearInterval(pollId);
        const result = tryInit();
        cleanup = result ?? null;
      }
    }, 120);

    return () => {
      clearInterval(pollId);
      if (cleanup) cleanup();
    };
  }, [tryInit]);

  // ── Scroll reveal ─────────────────────────────────────────────────────────
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("active");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // ── Nav handler ──────────────────────────────────────────────────────────
  const handleLaunch = () => router.push("/dashboard");

  return (
    <>
      {/* ── Three.js CDN ── */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
        strategy="beforeInteractive"
      />

      {/* ── Global page styles ── */}
      <style>{`
        html, body { background: #000; color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; scroll-behavior: smooth; }
        #bg-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
        .page-content { position: relative; z-index: 1; }
        .glass { background: rgba(255,255,255,0.028); backdrop-filter: blur(16px) saturate(1.2); border: 1px solid rgba(255,255,255,0.07); }
        .blend-card { background: rgba(10,10,10,0.35); backdrop-filter: blur(20px) saturate(1.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 1.5rem; transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease; }
        .card-3d:hover { box-shadow: 0 30px 80px rgba(6,182,212,0.15), 0 0 60px rgba(0,0,0,0.6); border-color: rgba(6,182,212,0.25) !important; }
        .reveal { opacity: 0; transform: translateY(40px); transition: all 1s cubic-bezier(0.22, 1, 0.36, 1); }
        .reveal.active { opacity: 1; transform: translateY(0); }
        .glow-text { text-shadow: 0 0 60px rgba(255,255,255,0.25), 0 0 120px rgba(6,182,212,0.1); }
        .hero-title { text-shadow: 0 0 80px rgba(255,255,255,0.1); }
        .grid-overlay { position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px); background-size: 80px 80px; }
        .vignette { position: fixed; inset: 0; z-index: 0; pointer-events: none; background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%); }
        .dot-accent { width: 6px; height: 6px; border-radius: 50%; background: #06b6d4; box-shadow: 0 0 10px #06b6d4, 0 0 20px rgba(6,182,212,0.5); display: inline-block; margin-right: 10px; }
        .section-label { display: flex; align-items: center; justify-content: center; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5em; color: #22d3ee; font-weight: 700; margin-bottom: 2.5rem; }
        .scroll-line { width: 1px; height: 60px; background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.4)); margin: 0 auto; animation: scrollPulse 2s ease-in-out infinite; }
        @keyframes scrollPulse { 0%, 100% { opacity: 0.3; transform: scaleY(1); } 50% { opacity: 1; transform: scaleY(1.2); } }
        .experiments-title { font-size: 10vw; font-weight: 900; text-transform: uppercase; letter-spacing: -0.04em; line-height: 1; background: linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.08) 80%, transparent 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; color: transparent; user-select: none; }
        .nav-link { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.5); transition: color 0.3s; cursor: pointer; }
        .nav-link:hover { color: #fff; }
        .launch-btn { border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); backdrop-filter: blur(8px); color: #fff; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; padding: 10px 24px; border-radius: 4px; cursor: pointer; transition: all 0.3s; }
        .launch-btn:hover { background: rgba(6,182,212,0.15); border-color: rgba(6,182,212,0.5); box-shadow: 0 0 30px rgba(6,182,212,0.2); }
        .stat-divider { width: 1px; height: 60px; background: rgba(255,255,255,0.07); }
      `}</style>

      {/* ── Fixed BG layers ── */}
      <canvas id="bg-canvas" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* PAGE CONTENT */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="page-content">

        {/* ── NAV ──────────────────────────────────────────────────────── */}
        <nav
          className="glass fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16"
          style={{ height: "64px" }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="dot-accent" />
            <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" }}>
              QOED
            </span>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: "40px" }}>
            {["Features", "Physics", "Workflow", "Workspace"].map((l) => (
              <span key={l} className="nav-link hidden md:block">{l}</span>
            ))}
          </div>

          {/* CTA */}
          <button className="launch-btn" onClick={handleLaunch}>
            Launch App
          </button>
        </nav>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section
          style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px", paddingTop: "64px" }}
        >
          {/* Label */}
          <div className="section-label reveal" style={{ marginBottom: "2rem" }}>
            <span className="dot-accent" />
            Future Optics
          </div>

          {/* Title */}
          <h1
            className="hero-title reveal glow-text"
            style={{
              fontSize: "clamp(2.8rem, 8vw, 7rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: "900px",
              marginBottom: "1.8rem",
              background: "linear-gradient(135deg, #fff 30%, rgba(6,182,212,0.7) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Quantum Optical<br />Circuit Design Engine
          </h1>

          {/* Sub */}
          <p
            className="reveal"
            style={{ maxWidth: "560px", fontSize: "clamp(0.9rem, 2vw, 1.05rem)", color: "rgba(255,255,255,0.42)", lineHeight: 1.7, marginBottom: "3rem" }}
          >
            Optimize photonic quantum circuits using evolutionary search and
            physics-based simulation — from lab to production.
          </p>

          {/* Buttons */}
          <div className="reveal" style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              className="launch-btn"
              onClick={handleLaunch}
              style={{ padding: "14px 36px", fontSize: "12px" }}
            >
              Launch Workspace →
            </button>
            <button
              style={{ border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", padding: "14px 36px", borderRadius: "4px", cursor: "pointer" }}
            >
              Explore Physics Engine
            </button>
          </div>

          {/* Scroll indicator */}
          <div style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
            <p style={{ fontSize: "9px", letterSpacing: "0.4em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: "12px" }}>Scroll</p>
            <div className="scroll-line" />
          </div>
        </section>

        {/* ── STATS BLEND BLOCK ────────────────────────────────────────── */}
        <section style={{ padding: "0 24px 100px" }}>
          <div
            className="blend-card reveal"
            style={{ maxWidth: "1400px", margin: "0 auto", padding: "clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 5vw, 4rem)" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "0",
                alignItems: "center",
              }}
            >
              {/* Max Fidelity */}
              <div style={{ textAlign: "center", padding: "1rem 2rem" }}>
                <p style={{ fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.5rem" }}>Max Fidelity</p>
                <p
                  className="glow-text"
                  style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", color: "#fff" }}
                >
                  {stats.fidelity.toFixed(3)}
                </p>
                <p style={{ fontSize: "10px", color: "rgba(6,182,212,0.8)", marginTop: "4px" }}>↑ live</p>
              </div>

              <div className="stat-divider hidden md:block" />

              {/* Particles Live */}
              <div style={{ textAlign: "center", padding: "1rem 2rem" }}>
                <p style={{ fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.5rem" }}>Particles Live</p>
                <p
                  className="glow-text"
                  style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", color: "#fff" }}
                >
                  {(stats.particles / 1_000_000).toFixed(2)}M
                </p>
                <p style={{ fontSize: "10px", color: "rgba(6,182,212,0.8)", marginTop: "4px" }}>↑ live</p>
              </div>

              <div className="stat-divider hidden md:block" />

              {/* Opt. Accuracy */}
              <div style={{ textAlign: "center", padding: "1rem 2rem" }}>
                <p style={{ fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.5rem" }}>Opt. Accuracy</p>
                <p
                  className="glow-text"
                  style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", color: "#fff" }}
                >
                  {stats.accuracy.toFixed(3)}
                </p>
                <p style={{ fontSize: "10px", color: "rgba(6,182,212,0.8)", marginTop: "4px" }}>↑ live</p>
              </div>

              <div className="stat-divider hidden md:block" />

              {/* Latency */}
              <div style={{ textAlign: "center", padding: "1rem 2rem" }}>
                <p style={{ fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.5rem" }}>Avg Latency</p>
                <p
                  className="glow-text"
                  style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", color: "#fff" }}
                >
                  {stats.latency.toFixed(1)}ms
                </p>
                <p style={{ fontSize: "10px", color: "rgba(6,182,212,0.8)", marginTop: "4px" }}>↓ live</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── ABOUT US ─────────────────────────────────────────────────── */}
        <section
          style={{ padding: "100px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
        >
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div className="section-label reveal">
              <span className="dot-accent" />
              About Us
            </div>

            <h2
              className="reveal"
              style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "2rem" }}
            >
              Pioneering the frontier of<br />
              <span style={{ color: "#22d3ee" }}>photonic quantum computing</span>
            </h2>

            <p
              className="reveal"
              style={{ fontSize: "clamp(0.9rem, 2vw, 1.05rem)", color: "rgba(255,255,255,0.38)", lineHeight: 1.85, marginBottom: "3rem", maxWidth: "680px", margin: "0 auto 3rem" }}
            >
              QOED is a research-to-production platform that bridges the gap between
              theoretical quantum optics and real-world photonic chip deployment.
              Our physics engine models Hamiltonian dynamics, Lindblad noise, and
              multi-photon interference with sub-percent error — so your simulations
              match your silicon.
            </p>

            {/* About feature pills */}
            <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
              {["Physics-First Simulation", "Evolutionary ML Optimizer", "Real-time Visualisation", "Publication-Ready Reports"].map((f) => (
                <span
                  key={f}
                  className="glass"
                  style={{ padding: "8px 18px", borderRadius: "100px", fontSize: "11px", letterSpacing: "0.08em", color: "rgba(255,255,255,0.65)" }}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── EXPERIMENTS ──────────────────────────────────────────────── */}
        <section
          style={{ padding: "80px 24px 120px", display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          {/* Ghost title */}
          <div style={{ textAlign: "center", marginBottom: "0px", overflow: "hidden", width: "100%" }}>
            <p className="experiments-title">Experiments</p>
          </div>

          <div className="section-label reveal" style={{ marginTop: "-40px" }}>
            <span className="dot-accent" />
            Experiment Library
          </div>

          {/* Cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
              maxWidth: "1200px",
              width: "100%",
              margin: "0 auto",
            }}
          >
            {experiments.map((exp, i) => (
              <div
                key={exp.id}
                className="blend-card card-3d reveal"
                style={{
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.2rem",
                  animationDelay: `${i * 0.12}s`,
                  cursor: "pointer",
                }}
              >
                {/* Top row: tag + dots */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.35em",
                      textTransform: "uppercase",
                      color: exp.accent,
                      fontWeight: 700,
                    }}
                  >
                    {exp.tag}
                  </span>
                  <div style={{ display: "flex", gap: "5px" }}>
                    {exp.dots.map((active, di) => (
                      <span
                        key={di}
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: active ? exp.accent : "rgba(255,255,255,0.12)",
                          boxShadow: active ? `0 0 8px ${exp.accent}` : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "4px" }}>
                    {exp.title}
                  </h3>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {exp.subtitle}
                  </p>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

                {/* Description */}
                <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, flexGrow: 1 }}>
                  {exp.description}
                </p>

                {/* Bottom stats row — horizontally flexed, nowrap */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    paddingTop: "1rem",
                    flexWrap: "nowrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: exp.accent,
                      whiteSpace: "nowrap",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {exp.fidelity} Fidelity Score
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.3)",
                      whiteSpace: "nowrap",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "4px",
                      padding: "3px 8px",
                    }}
                  >
                    {exp.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────── */}
        <footer
          className="glass"
          style={{ padding: "40px 24px", textAlign: "center" }}
        >
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <span className="dot-accent" />
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" }}>QOED</span>
          </div>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.22)", letterSpacing: "0.1em" }}>
            © 2025 Quantum Optical Experiment Designer · All rights reserved
          </p>
        </footer>
      </div>
    </>
  );
}
