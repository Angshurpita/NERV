"use client";

import { useEffect, useRef, useState } from "react";

const layers = [
  {
    number: "01",
    name: "Directive",
    subtitle: "Strategic Intent",
    color: "blue",
    description:
      "Natural-language SOPs written in Markdown that define objectives, inputs, and execution schemas for the orchestration layer.",
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
    subtitle: "Agentic Intelligence",
    color: "indigo",
    description:
      "The AI-powered decision engine that routes directives, manages multi-model consensus, and autonomous error recovery.",
    details: [
      "Interprets directives → resolves execution paths",
      "Multi-agent consensus & validation logic",
      "Self-correcting execution with automated retries",
    ],
    path: "AI Engine",
  },
  {
    number: "03",
    name: "Execution",
    subtitle: "Deterministic Logic",
    color: "violet",
    description:
      "High-performance scripts that perform the actual operations — isolated cloning, deep-static analysis, and report generation.",
    details: [
      "clone_repository.py — Isolated workspace cloning",
      "static_analysis.py — Pattern-based vulnerability detection",
      "dependency_audit.py — CVE cross-validation",
      "generate_report.py — Finding synthesis & export",
    ],
    path: "execution/",
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  blue: {
    border: "border-blue-100",
    bg: "bg-blue-50/50",
    text: "text-blue-600",
    glow: "hover:shadow-[0_0_50px_rgba(37,99,235,0.1)]",
  },
  indigo: {
    border: "border-indigo-100",
    bg: "bg-indigo-50/50",
    text: "text-indigo-600",
    glow: "hover:shadow-[0_0_50px_rgba(79,70,229,0.1)]",
  },
  violet: {
    border: "border-violet-100",
    bg: "bg-violet-50/50",
    text: "text-violet-600",
    glow: "hover:shadow-[0_0_50px_rgba(124,58,237,0.1)]",
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
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="architecture"
      className="relative py-32 md:py-48 px-6 overflow-hidden bg-gray-50"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-mesh opacity-40"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div
          className={`mb-24 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] tracking-[0.4em] text-blue-600 uppercase font-bold">
              System Architecture
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
            Elite <span className="text-blue-600">3-Layer</span> Framework
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-xl leading-relaxed font-medium">
            A deterministic orchestration pipeline that decouples strategic intent 
            from autonomous decision-making and operational execution.
          </p>
        </div>

        {/* Architecture cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {layers.map((layer, i) => {
            const c = colorMap[layer.color];
            return (
              <div
                key={layer.number}
                className={`group relative p-10 rounded-3xl border border-black/5 bg-white shadow-premium ${c.glow} transition-all duration-700 hover:border-blue-600/10 ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${200 + i * 150}ms` }}
              >
                {/* Layer number */}
                <div className={`text-[10px] tracking-[0.3em] ${c.text} font-bold mb-8 flex items-center gap-3`}>
                  <span className="font-mono">{layer.number}</span>
                  <div className={`flex-1 h-px bg-gray-100`}></div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold tracking-tight mb-1.5 text-gray-900">{layer.name}</h3>
                <p className="text-[10px] tracking-[0.25em] text-gray-400 uppercase mb-6 font-bold">
                  {layer.subtitle}
                </p>

                {/* Description */}
                <p className="text-[13px] text-gray-500 leading-relaxed mb-10 font-medium">
                  {layer.description}
                </p>

                {/* File list */}
                <div className="space-y-3">
                  {layer.details.map((detail, j) => (
                    <div
                      key={j}
                      className="flex items-start gap-3 text-[11px] text-gray-400 font-mono font-bold"
                    >
                      <span className={`${c.text} opacity-50`}>→</span>
                      <span className="leading-relaxed">{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Path tag */}
                <div className={`mt-10 inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gray-50 border border-black/5 group-hover:bg-white transition-all`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${c.text.replace("text-", "bg-")} animate-pulse`}></div>
                  <span className={`text-[9px] tracking-[0.2em] text-gray-500 uppercase font-bold`}>
                    {layer.path}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Connection lines visual (desktop) */}
        <div
          className={`hidden lg:flex items-center justify-center mt-20 gap-6 transition-all duration-1000 delay-700 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-gray-200"></div>
          <div className="text-[10px] tracking-[0.4em] text-gray-300 uppercase font-mono font-bold">
            Sequential Orchestration Flow
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 via-gray-200 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
