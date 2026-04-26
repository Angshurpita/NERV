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
    <section ref={sectionRef} id="pipeline" className="relative py-32 md:py-48 px-6 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-dots opacity-40"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div
          className={`mb-24 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] tracking-[0.4em] text-blue-600 uppercase font-bold">
              Security Pipeline
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
            Operational <span className="text-blue-600">Workflow</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-xl leading-relaxed font-medium">
            A precise, non-intrusive analysis pipeline. Each stage is isolated, 
            providing a deterministic assessment of your security posture.
          </p>
        </div>

        {/* Pipeline steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.step}
              className={`group relative p-10 rounded-3xl border border-black/5 bg-white shadow-premium hover:border-blue-600/10 transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${200 + i * 120}ms` }}
            >
              {/* Step header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-5">
                  <span className="text-blue-600/30 font-mono text-[10px] tracking-[0.2em] font-bold">
                    {step.step}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </h3>
                </div>
                <div className="text-gray-300 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-500">
                  {step.icon}
                </div>
              </div>

              {/* Description */}
              <p className="text-[13px] text-gray-500 leading-relaxed mb-8 font-medium">{step.description}</p>

              {/* Command */}
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 group-hover:border-blue-600/5 transition-all">
                <span className="text-blue-600/40 text-[11px] select-none">$</span>
                <code className="text-[11px] text-gray-400 font-mono tracking-wide group-hover:text-gray-500 transition-colors">
                  {step.command}
                </code>
              </div>
            </div>
          ))}
        </div>

        {/* Terminal output preview */}
        <div
          className={`mt-16 rounded-3xl border border-black/5 bg-[#0a0f18] overflow-hidden shadow-premium transition-all duration-1000 delay-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.03] bg-white/[0.02]">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-gray-700"></div>
              <div className="w-2 h-2 rounded-full bg-gray-700"></div>
              <div className="w-2 h-2 rounded-full bg-gray-700"></div>
            </div>
            <span className="text-[9px] tracking-[0.4em] text-gray-600 font-mono uppercase font-bold">
              Pipeline Runtime
            </span>
            <div></div>
          </div>
          <div className="p-8 font-mono text-xs space-y-2.5">
            <p className="text-gray-300"><span className="text-blue-500/60 font-bold">$</span> nerv initiate --target https://nerv.so</p>
            <p className="text-gray-500 pl-4 font-medium">[DIRECTIVE] Reading security_scan.md...</p>
            <p className="text-gray-500 pl-4 font-medium">[ORCHESTRATION] Routing to clone_repository.py</p>
            <p className="text-gray-500 pl-4 font-medium">[EXECUTION] Cloning to isolated workspace...</p>
            <p className="text-gray-500 pl-4 font-medium">[EXECUTION] Running static_analysis.py — 1,247 files scanned</p>
            <p className="text-gray-500 pl-4 font-medium">[EXECUTION] Running dependency_audit.py — Cross-referencing CVEs</p>
            <p className="text-gray-500 pl-4 font-medium">[EXECUTION] Generating report → security_report.pdf</p>
            <p className="text-blue-500 mt-5 pl-4 font-bold">✓ Pipeline terminated. Operation complete.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
