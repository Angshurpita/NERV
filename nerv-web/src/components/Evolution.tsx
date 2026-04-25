"use client";

import { useEffect, useRef, useState } from "react";

const layers = [
  {
    number: "01",
    name: "Directive",
    subtitle: "What to do",
    color: "emerald",
    description:
      "Natural-language SOPs written in Markdown that define objectives, inputs, execution scripts, expected outputs, and edge-case handling strategies.",
    details: [
      "security_scan.md — Multi-layer vulnerability pipeline",
      "report_generate.md — Structured PDF synthesis",
      "_template.md — Standardized directive scaffolding",
    ],
    path: "directives/",
  },
  {
    number: "02",
    name: "Orchestration",
    subtitle: "Intelligent routing",
    color: "cyan",
    description:
      "The AI-powered decision layer that reads directives, calls execution scripts in the correct order, handles errors gracefully, and feeds lessons back into the system.",
    details: [
      "Reads directives → routes to execution scripts",
      "Handles errors, retries, and edge cases autonomously",
      "Root-cause-first — reports systemic issues, not symptoms",
    ],
    path: "AI Layer",
  },
  {
    number: "03",
    name: "Execution",
    subtitle: "Doing the work",
    color: "violet",
    description:
      "Deterministic Python scripts that perform the actual operations — cloning repositories, running static analysis, auditing dependencies, and generating reports.",
    details: [
      "clone_repository.py — Isolated workspace cloning",
      "static_analysis.py — Security anti-pattern detection",
      "dependency_audit.py — CVE database cross-reference",
      "generate_report.py — Structured finding synthesis",
    ],
    path: "execution/",
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  emerald: {
    border: "border-emerald-400/30",
    bg: "bg-emerald-400/5",
    text: "text-emerald-400",
    glow: "hover:shadow-[0_0_40px_rgba(74,222,128,0.08)]",
  },
  cyan: {
    border: "border-cyan-400/30",
    bg: "bg-cyan-400/5",
    text: "text-cyan-400",
    glow: "hover:shadow-[0_0_40px_rgba(34,211,238,0.08)]",
  },
  violet: {
    border: "border-violet-400/30",
    bg: "bg-violet-400/5",
    text: "text-violet-400",
    glow: "hover:shadow-[0_0_40px_rgba(167,139,250,0.08)]",
  },
};

export default function Architecture() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="architecture"
      className="relative py-32 md:py-40 px-6 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-50"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div
          className={`mb-20 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-emerald-400"></div>
            <span className="text-[10px] tracking-[0.4em] text-emerald-400 uppercase font-medium">
              System Architecture
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 text-gradient">
            3-Layer Architecture
          </h2>
          <p className="text-white/40 text-sm md:text-base max-w-xl leading-relaxed">
            A deterministic pipeline separating intent from decisions from execution.
            Each layer is independently testable, auditable, and replaceable.
          </p>
        </div>

        {/* Architecture cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {layers.map((layer, i) => {
            const c = colorMap[layer.color];
            return (
              <div
                key={layer.number}
                className={`group relative p-8 rounded-xl border ${c.border} ${c.bg} ${c.glow} transition-all duration-500 hover:border-opacity-60 ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${200 + i * 150}ms` }}
              >
                {/* Layer number */}
                <div className={`text-[11px] tracking-[0.3em] ${c.text} font-bold mb-6 flex items-center gap-3`}>
                  <span className="font-mono">{layer.number}</span>
                  <div className={`flex-1 h-px ${c.border}`}></div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold tracking-wide mb-1">{layer.name}</h3>
                <p className="text-xs tracking-[0.2em] text-white/30 uppercase mb-5">
                  {layer.subtitle}
                </p>

                {/* Description */}
                <p className="text-sm text-white/50 leading-relaxed mb-8">{layer.description}</p>

                {/* File list */}
                <div className="space-y-2.5">
                  {layer.details.map((detail, j) => (
                    <div
                      key={j}
                      className="flex items-start gap-2.5 text-xs text-white/35 font-mono"
                    >
                      <span className={`${c.text} mt-0.5 text-[10px]`}>→</span>
                      <span className="leading-relaxed">{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Path tag */}
                <div className={`mt-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${c.bg} border ${c.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${c.text.replace("text-", "bg-")}`}></span>
                  <span className={`text-[9px] tracking-[0.2em] ${c.text} uppercase font-medium`}>
                    {layer.path}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Connection lines visual (desktop) */}
        <div
          className={`hidden lg:flex items-center justify-center mt-12 gap-4 transition-all duration-1000 delay-700 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-cyan-400/20"></div>
          <div className="text-[9px] tracking-[0.3em] text-white/20 uppercase font-mono">
            Deterministic Pipeline Flow
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/20 via-violet-400/20 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
