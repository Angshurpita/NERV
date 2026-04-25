"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    step: "01",
    title: "Clone",
    command: "execution/clone_repository.py",
    description:
      "Clones the target repository into an isolated temporary directory — never into the active project workspace. Supports both public and private repos with credential prompting.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Static Analysis",
    command: "execution/static_analysis.py",
    description:
      "Scans source files for security anti-patterns, hardcoded secrets, and unsafe code constructs. Covers injection vectors, auth flaws, and cryptographic misuse.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Dependency Audit",
    command: "execution/dependency_audit.py",
    description:
      "Cross-references all dependency manifests against CVE databases. Identifies known vulnerabilities and supply-chain risks in your dependency tree.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    step: "04",
    title: "Report Generation",
    command: "execution/generate_report.py",
    description:
      "Aggregates all findings into a structured PDF/Markdown report with severity ratings, systemic weakness analysis, and exact remediation guidance.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
];

export default function Pipeline() {
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
    <section ref={sectionRef} id="pipeline" className="relative py-32 md:py-40 px-6 overflow-hidden">
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
              Security Pipeline
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 text-gradient">
            How It Works
          </h2>
          <p className="text-white/40 text-sm md:text-base max-w-xl leading-relaxed">
            A 4-stage, non-intrusive security analysis pipeline. Point it at any repository
            and receive a deterministic, root-cause-first assessment.
          </p>
        </div>

        {/* Pipeline steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.step}
              className={`group relative p-8 rounded-xl border border-white/8 bg-[#050505] hover:border-emerald-400/20 hover:bg-emerald-400/[0.02] transition-all duration-500 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${200 + i * 120}ms` }}
            >
              {/* Step header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-emerald-400/40 font-mono text-xs tracking-wider">
                    {step.step}
                  </span>
                  <h3 className="text-lg font-bold tracking-wide group-hover:text-emerald-400 transition-colors">
                    {step.title}
                  </h3>
                </div>
                <div className="text-white/15 group-hover:text-emerald-400/40 transition-colors">
                  {step.icon}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-white/40 leading-relaxed mb-6">{step.description}</p>

              {/* Command */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/[0.03] border border-white/5">
                <span className="text-emerald-400/50 text-[10px] select-none">$</span>
                <code className="text-[11px] text-white/30 font-mono tracking-wide">
                  {step.command}
                </code>
              </div>
            </div>
          ))}
        </div>

        {/* Terminal output preview */}
        <div
          className={`mt-12 rounded-xl border border-white/8 bg-[#050505] overflow-hidden transition-all duration-1000 delay-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-white/8"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/8"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/8"></div>
            </div>
            <span className="text-[9px] tracking-[0.3em] text-white/20 font-mono uppercase">
              Pipeline Output
            </span>
            <div></div>
          </div>
          <div className="p-6 font-mono text-xs space-y-1.5 text-white/30">
            <p><span className="text-emerald-400/60">❯</span> nerv-viper initiate --target https://github.com/user/repo</p>
            <p className="text-white/15 pl-4">[DIRECTIVE] Reading security_scan.md...</p>
            <p className="text-white/15 pl-4">[ORCHESTRATION] Routing to clone_repository.py</p>
            <p className="text-white/15 pl-4">[EXECUTION] Cloning to /tmp/nerv_scan_a7f3c/repo...</p>
            <p className="text-white/15 pl-4">[EXECUTION] Running static_analysis.py — 847 files scanned</p>
            <p className="text-white/15 pl-4">[EXECUTION] Running dependency_audit.py — 3 CVEs found</p>
            <p className="text-white/15 pl-4">[EXECUTION] Generating report → security_report.pdf</p>
            <p className="text-emerald-400/60 mt-3 pl-4">✓ Pipeline terminated deterministically. Risk score: 34/100</p>
          </div>
        </div>
      </div>
    </section>
  );
}
