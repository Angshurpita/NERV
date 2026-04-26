"use client";

import { useEffect, useRef, useState } from "react";

/* ── Data ────────────────────────────────────────── */

const coreCommands = [
  { cmd: "nerv", alias: "run nerv", desc: "Interactive prompt — asks for AI mode and target" },
  { cmd: "nerv <url>", alias: null, desc: "Stress test a website (base mode, no AI)" },
  { cmd: "nerv <url> --ai", alias: null, desc: "AI-powered security scan on a website" },
  { cmd: "nerv prev pdf", alias: null, desc: "Generate technical PDF from the last report" },
  { cmd: "nerv prev simplepdf", alias: null, desc: "Generate beginner-friendly PDF from the last report" },
];

const flags = [
  { flag: "--ai", desc: "Enable AI mode (5 cloud models for analysis & cross-validation)" },
  { flag: "--headed", desc: "Run browser in visible (headed) mode" },
  { flag: "--pdf", desc: "Generate technical PDF report after scan" },
  { flag: "--simplepdf", desc: "Generate beginner-friendly simple PDF report after scan" },
  { flag: "-o, --output <dir>", desc: "Output directory (default: ./reports)" },
  { flag: "-v, --verbose", desc: "Enable verbose logging" },
  { flag: "--version / -V", desc: "Show version (3.5.6)" },
  { flag: "--help / -h", desc: "Show help text" },
  { flag: "--repo <url>", desc: "Clone a GitHub repo for static codebase analysis (requires --ai)" },
  { flag: "--repo-only", desc: "Repo-only analysis — no website stress test" },
  { flag: "--no-ai", desc: "Skip AI prompt in interactive mode" },
  { flag: "--max-tests <n>", desc: "Max number of tests (default: 80)" },
  { flag: "--max-time <s>", desc: "Max total time in seconds (default: 400 base / 700 AI)" },
  { flag: "--each-test-time <s>", desc: "Max time per test in seconds (default: 3)" },
];

const aiModes = [
  {
    option: "1",
    target: "git",
    desc: "Clones GitHub repo → static codebase security analysis only",
    color: "blue",
  },
  {
    option: "2",
    target: "git_link",
    desc: "Clones repo → tests codebase, then stress tests the deployed website",
    color: "indigo",
  },
  {
    option: "3",
    target: "link",
    desc: "Deep stress test on deployed web app (stealth browser recon, exploit, probe)",
    color: "violet",
  },
];

const npmScripts = [
  { script: "npm run nerv", command: "node bin/nerv.js" },
  { script: "npm run dev", command: "node bin/nerv.js run https://example.com --verbose" },
  { script: "npm test", command: "Unit tests" },
  { script: "npm run test:full", command: "Unit + integration tests" },
  { script: "npm run test:ci", command: "CI test suite" },
  { script: "postinstall", command: "npx playwright install" },
];

const entryPoints = [
  { binary: "nerv", path: "bin/nerv.js", purpose: "Primary CLI entry" },
  { binary: "run", path: "bin/run.js", purpose: "Alias — forwards run nerv → bin/nerv.js" },
];

const aiColorMap: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  blue: {
    border: "border-blue-400/20",
    bg: "bg-blue-400/5",
    text: "text-blue-400",
    badge: "bg-blue-400",
  },
  indigo: {
    border: "border-indigo-400/20",
    bg: "bg-indigo-400/5",
    text: "text-indigo-400",
    badge: "bg-indigo-400",
  },
  violet: {
    border: "border-violet-400/20",
    bg: "bg-violet-400/5",
    text: "text-violet-400",
    badge: "bg-violet-400",
  },
};

/* ── Sub-Components ──────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-[9px] tracking-[0.4em] text-blue-600 uppercase font-bold">
        {children}
      </span>
    </div>
  );
}

function CodeBlock({ children, prompt = "$" }: { children: string; prompt?: string }) {
  return (
    <div className="relative rounded-2xl border border-black/5 bg-gray-900 overflow-hidden shadow-premium group">
      <div className="flex items-center px-6 py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/40"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
          <div className="w-2 h-2 rounded-full bg-green-500/20 border border-green-500/40"></div>
        </div>
      </div>
      <div className="p-6 font-mono text-sm flex items-center gap-4">
        <span className="text-blue-400 select-none font-bold">{prompt}</span>
        <span className="text-gray-100">{children}</span>
        <span className="inline-block w-1.5 h-4 bg-blue-500 animate-terminal-blink ml-1"></span>
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────── */

export default function Docs() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "commands" | "flags" | "ai-modes" | "scripts"
  >("commands");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const tabs = [
    { id: "commands" as const, label: "Commands" },
    { id: "flags" as const, label: "Flags" },
    { id: "ai-modes" as const, label: "AI Modes" },
    { id: "scripts" as const, label: "Scripts" },
  ];

  return (
    <section
      ref={sectionRef}
      id="docs"
      className="relative py-32 md:py-48 px-6 overflow-hidden bg-white"
    >
      <div className="absolute inset-0 bg-mesh opacity-30"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* ── Header ── */}
        <div
          className={`mb-24 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] tracking-[0.4em] text-blue-600 uppercase font-bold">
              Documentation
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
            CLI <span className="text-blue-600">Reference</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-xl leading-relaxed font-medium">
            Comprehensive guide to commands, flags, and operational modes.
            Designed for clarity and precision.
          </p>
        </div>

        {/* ── Installation ── */}
        <div
          className={`mb-20 transition-all duration-1000 delay-100 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <SectionLabel>Installation</SectionLabel>
          <CodeBlock>npm i nerv-viper</CodeBlock>
          <p className="text-[11px] text-gray-400 mt-4 ml-1 tracking-tight font-bold">
            Global deployment installs core orchestration logic and auto-configures browser-based reconnaissance.
          </p>
        </div>

        {/* ── Entry Points ── */}
        <div
          className={`mb-20 transition-all duration-1000 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <SectionLabel>Entry Points</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {entryPoints.map((ep) => (
              <div
                key={ep.binary}
                className="p-6 rounded-3xl border border-black/5 bg-gray-50 flex items-start gap-5 hover:border-blue-600/20 hover:bg-white transition-all duration-500 shadow-premium group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <span className="font-mono text-lg font-bold">
                    {ep.binary === "nerv" ? "N" : "R"}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <code className="text-sm text-gray-900 font-mono font-bold">
                      {ep.binary}
                    </code>
                    <span className="text-[9px] text-gray-400 font-mono tracking-widest uppercase font-bold">
                      {ep.path}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{ep.purpose}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabbed Reference ── */}
        <div
          className={`transition-all duration-1000 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <SectionLabel>Reference Library</SectionLabel>

          {/* Tab bar */}
          <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-gray-100 border border-black/5 mb-10 w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-2.5 rounded-xl text-[10px] tracking-[0.2em] uppercase font-bold transition-all duration-500 ${
                  activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-premium"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="rounded-3xl border border-black/5 bg-white overflow-hidden shadow-premium">
            {/* ─ Commands Tab ─ */}
            {activeTab === "commands" && (
              <div className="divide-y divide-gray-100">
                {/* Header */}
                <div className="grid grid-cols-[1.5fr_2fr] md:grid-cols-[1.2fr_1fr_2fr] gap-6 px-8 py-4 bg-gray-50/50">
                  <span className="text-[9px] tracking-[0.4em] text-gray-400 uppercase font-bold">
                    Command
                  </span>
                  <span className="hidden md:block text-[9px] tracking-[0.4em] text-gray-400 uppercase font-bold">
                    Alias
                  </span>
                  <span className="text-[9px] tracking-[0.4em] text-gray-400 uppercase font-bold">
                    Description
                  </span>
                </div>
                {/* Rows */}
                {coreCommands.map((c, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1.5fr_2fr] md:grid-cols-[1.2fr_1fr_2fr] gap-6 px-8 py-5 hover:bg-gray-50 transition-colors group"
                  >
                    <code className="text-sm text-blue-600 font-mono font-bold">
                      {c.cmd}
                    </code>
                    <span className="hidden md:block text-xs text-gray-300 font-mono font-bold">
                      {c.alias || "—"}
                    </span>
                    <span className="text-sm text-gray-600 leading-relaxed font-medium">
                      {c.desc}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* ─ Flags Tab ─ */}
            {activeTab === "flags" && (
              <div className="divide-y divide-gray-100">
                <div className="grid grid-cols-[1fr_2fr] gap-6 px-8 py-4 bg-gray-50/50">
                  <span className="text-[9px] tracking-[0.4em] text-gray-400 uppercase font-bold">
                    Flag
                  </span>
                  <span className="text-[9px] tracking-[0.4em] text-gray-400 uppercase font-bold">
                    Description
                  </span>
                </div>
                {flags.map((f, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_2fr] gap-6 px-8 py-5 hover:bg-gray-50 transition-colors group"
                  >
                    <code className="text-sm text-blue-600 font-mono font-bold whitespace-nowrap">
                      {f.flag}
                    </code>
                    <span className="text-sm text-gray-600 leading-relaxed font-medium">
                      {f.desc}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* ─ AI Modes Tab ─ */}
            {activeTab === "ai-modes" && (
              <div className="p-8 space-y-6">
                <p className="text-xs text-gray-400 mb-6 leading-relaxed font-bold uppercase tracking-tight">
                  Active deployment of <code className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">--ai</code> 
                  initiates multi-agent collaboration:
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {aiModes.map((mode) => {
                    const c = aiColorMap[mode.color];
                    return (
                      <div
                        key={mode.option}
                        className={`p-6 rounded-3xl border ${c.border.replace('border-', 'border-')} ${c.bg.replace('bg-', 'bg-')} flex items-start gap-5 hover:shadow-lg transition-all duration-500`}
                        style={{ backgroundColor: mode.color === 'blue' ? '#eff6ff' : mode.color === 'indigo' ? '#eef2ff' : '#f5f3ff' }}
                      >
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center shadow-sm`}
                        >
                          <span className={`text-${mode.color}-600 font-mono text-sm font-bold`}>
                            {mode.option}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1.5">
                            <code className={`text-sm text-${mode.color}-600 font-mono font-bold`}>
                              {mode.target}
                            </code>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed font-medium">
                            {mode.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ─ Scripts Tab ─ */}
            {activeTab === "scripts" && (
              <div className="divide-y divide-gray-100">
                <div className="grid grid-cols-[1fr_2fr] gap-6 px-8 py-4 bg-gray-50/50">
                  <span className="text-[9px] tracking-[0.4em] text-gray-400 uppercase font-bold">
                    Script
                  </span>
                  <span className="text-[9px] tracking-[0.4em] text-gray-400 uppercase font-bold">
                    Execution
                  </span>
                </div>
                {npmScripts.map((s, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_2fr] gap-6 px-8 py-5 hover:bg-gray-50 transition-colors group"
                  >
                    <code className="text-sm text-blue-600 font-mono font-bold">
                      {s.script}
                    </code>
                    <code className="text-sm text-gray-400 font-mono font-bold">
                      {s.command}
                    </code>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Quick Usage Examples ── */}
        <div
          className={`mt-24 transition-all duration-1000 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <SectionLabel>Quick Deployment</SectionLabel>
          <div className="rounded-3xl border border-black/5 bg-gray-900 overflow-hidden shadow-premium">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/40"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/20 border border-green-500/40"></div>
              </div>
              <span className="text-[9px] tracking-[0.4em] text-white/10 font-mono uppercase font-bold">
                Terminal Overview
              </span>
              <div></div>
            </div>
            <div className="p-10 font-mono text-sm space-y-8">
              {/* Step 1 */}
              <div>
                <p className="text-[9px] text-white/20 tracking-[0.3em] uppercase mb-4 font-bold">
                  // Core Installation
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-blue-400 select-none font-bold">$</span>
                  <span className="text-gray-100">npm i nerv-viper</span>
                </div>
              </div>

              {/* Step 2 */}
              <div>
                <p className="text-[9px] text-white/20 tracking-[0.3em] uppercase mb-4 font-bold">
                  // Standard Stress Test
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-blue-400 select-none font-bold">$</span>
                  <span className="text-gray-100">
                    nerv https://nerv.so
                  </span>
                </div>
              </div>

              {/* Step 3 */}
              <div>
                <p className="text-[9px] text-white/20 tracking-[0.3em] uppercase mb-4 font-bold">
                  // AI Orchestration + Export
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-blue-400 select-none font-bold">$</span>
                  <span className="text-gray-100">
                    nerv https://nerv.so --ai --pdf
                  </span>
                </div>
              </div>

              {/* Output */}
              <div className="border-t border-white/5 pt-8 space-y-2 text-xs text-white/20 font-bold">
                <p>[NERV] Orchestration pipeline initialized</p>
                <p>[AI] Routing directives to analyst agents</p>
                <p className="text-blue-400 mt-4">
                  ✓ Operation complete. Report generated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
