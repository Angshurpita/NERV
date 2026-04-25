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
    color: "emerald",
  },
  {
    option: "2",
    target: "git_link",
    desc: "Clones repo → tests codebase, then stress tests the deployed website",
    color: "cyan",
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
  emerald: {
    border: "border-emerald-400/20",
    bg: "bg-emerald-400/5",
    text: "text-emerald-400",
    badge: "bg-emerald-400",
  },
  cyan: {
    border: "border-cyan-400/20",
    bg: "bg-cyan-400/5",
    text: "text-cyan-400",
    badge: "bg-cyan-400",
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
      <div className="w-6 h-px bg-emerald-400/50"></div>
      <span className="text-[9px] tracking-[0.35em] text-emerald-400/70 uppercase font-medium">
        {children}
      </span>
    </div>
  );
}

function CodeBlock({ children, prompt = "❯" }: { children: string; prompt?: string }) {
  return (
    <div className="relative rounded-xl border border-white/8 bg-[#050505] overflow-hidden group">
      <div className="flex items-center px-4 py-2.5 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/8"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-white/8"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-white/8"></div>
        </div>
      </div>
      <div className="p-5 font-mono text-sm flex items-center gap-3">
        <span className="text-emerald-400/60 select-none">{prompt}</span>
        <span className="text-white/90">{children}</span>
        <span className="inline-block w-2 h-5 bg-emerald-400/70 animate-terminal-blink ml-1"></span>
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
      className="relative py-32 md:py-40 px-6 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute inset-0 bg-grid opacity-20"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* ── Header ── */}
        <div
          className={`mb-20 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-emerald-400"></div>
            <span className="text-[10px] tracking-[0.4em] text-emerald-400 uppercase font-medium">
              Documentation
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 text-gradient">
            CLI Reference
          </h2>
          <p className="text-white/40 text-sm md:text-base max-w-xl leading-relaxed">
            Every command, flag, and mode available in NERV-VIPER.
            One install. Zero configuration. Instant security analysis.
          </p>
        </div>

        {/* ── Installation ── */}
        <div
          className={`mb-16 transition-all duration-1000 delay-100 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <SectionLabel>Installation</SectionLabel>
          <CodeBlock>npm i nerv-viper</CodeBlock>
          <p className="text-xs text-white/25 mt-3 ml-1 tracking-wide">
            Installs the CLI globally and auto-configures Playwright for browser-based recon.
          </p>
        </div>

        {/* ── Entry Points ── */}
        <div
          className={`mb-16 transition-all duration-1000 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <SectionLabel>Entry Points</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {entryPoints.map((ep) => (
              <div
                key={ep.binary}
                className="p-5 rounded-xl border border-white/8 bg-[#050505] flex items-start gap-4 hover:border-emerald-400/15 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-400/5 border border-emerald-400/15 flex items-center justify-center">
                  <span className="text-emerald-400 font-mono text-xs font-bold">
                    {ep.binary === "nerv" ? "N" : "R"}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-sm text-white font-mono font-semibold">
                      {ep.binary}
                    </code>
                    <span className="text-[9px] text-white/20 font-mono tracking-wider">
                      {ep.path}
                    </span>
                  </div>
                  <p className="text-xs text-white/35">{ep.purpose}</p>
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
          <SectionLabel>Reference</SectionLabel>

          {/* Tab bar */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/8 mb-8 w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-lg text-[11px] tracking-[0.15em] uppercase font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white text-black"
                    : "text-white/35 hover:text-white/60 hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="rounded-xl border border-white/8 bg-[#050505] overflow-hidden">
            {/* ─ Commands Tab ─ */}
            {activeTab === "commands" && (
              <div className="divide-y divide-white/5">
                {/* Header */}
                <div className="grid grid-cols-[1fr_2fr] md:grid-cols-[1fr_auto_2fr] gap-4 px-6 py-3.5 bg-white/[0.02]">
                  <span className="text-[9px] tracking-[0.3em] text-white/25 uppercase font-medium">
                    Command
                  </span>
                  <span className="hidden md:block text-[9px] tracking-[0.3em] text-white/25 uppercase font-medium">
                    Alias
                  </span>
                  <span className="text-[9px] tracking-[0.3em] text-white/25 uppercase font-medium">
                    Description
                  </span>
                </div>
                {/* Rows */}
                {coreCommands.map((c, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_2fr] md:grid-cols-[1fr_auto_2fr] gap-4 px-6 py-4 hover:bg-white/[0.015] transition-colors group"
                  >
                    <code className="text-sm text-emerald-400/80 font-mono group-hover:text-emerald-400 transition-colors">
                      {c.cmd}
                    </code>
                    <span className="hidden md:block text-xs text-white/20 font-mono min-w-[120px]">
                      {c.alias || "—"}
                    </span>
                    <span className="text-sm text-white/40 leading-relaxed">
                      {c.desc}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* ─ Flags Tab ─ */}
            {activeTab === "flags" && (
              <div className="divide-y divide-white/5">
                <div className="grid grid-cols-[1fr_2fr] gap-4 px-6 py-3.5 bg-white/[0.02]">
                  <span className="text-[9px] tracking-[0.3em] text-white/25 uppercase font-medium">
                    Flag
                  </span>
                  <span className="text-[9px] tracking-[0.3em] text-white/25 uppercase font-medium">
                    Description
                  </span>
                </div>
                {flags.map((f, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_2fr] gap-4 px-6 py-4 hover:bg-white/[0.015] transition-colors group"
                  >
                    <code className="text-sm text-emerald-400/80 font-mono group-hover:text-emerald-400 transition-colors whitespace-nowrap">
                      {f.flag}
                    </code>
                    <span className="text-sm text-white/40 leading-relaxed">
                      {f.desc}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* ─ AI Modes Tab ─ */}
            {activeTab === "ai-modes" && (
              <div className="p-6 space-y-5">
                <p className="text-xs text-white/30 mb-4 leading-relaxed">
                  When <code className="text-emerald-400/70 bg-emerald-400/5 px-1.5 py-0.5 rounded">--ai</code> is
                  enabled in interactive mode, three target options are presented:
                </p>
                {aiModes.map((mode) => {
                  const c = aiColorMap[mode.color];
                  return (
                    <div
                      key={mode.option}
                      className={`p-5 rounded-xl border ${c.border} ${c.bg} flex items-start gap-4 hover:border-opacity-50 transition-colors`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center`}
                      >
                        <span className={`${c.text} font-mono text-sm font-bold`}>
                          {mode.option}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <code className={`text-sm ${c.text} font-mono font-semibold`}>
                            {mode.target}
                          </code>
                        </div>
                        <p className="text-xs text-white/40 leading-relaxed">
                          {mode.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ─ Scripts Tab ─ */}
            {activeTab === "scripts" && (
              <div className="divide-y divide-white/5">
                <div className="grid grid-cols-[1fr_2fr] gap-4 px-6 py-3.5 bg-white/[0.02]">
                  <span className="text-[9px] tracking-[0.3em] text-white/25 uppercase font-medium">
                    Script
                  </span>
                  <span className="text-[9px] tracking-[0.3em] text-white/25 uppercase font-medium">
                    Runs
                  </span>
                </div>
                {npmScripts.map((s, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_2fr] gap-4 px-6 py-4 hover:bg-white/[0.015] transition-colors group"
                  >
                    <code className="text-sm text-emerald-400/80 font-mono group-hover:text-emerald-400 transition-colors">
                      {s.script}
                    </code>
                    <code className="text-sm text-white/35 font-mono">
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
          className={`mt-16 transition-all duration-1000 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <SectionLabel>Quick Start</SectionLabel>
          <div className="rounded-xl border border-white/8 bg-[#050505] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/8"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white/8"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white/8"></div>
              </div>
              <span className="text-[9px] tracking-[0.3em] text-white/20 font-mono uppercase">
                Quick Start
              </span>
              <div></div>
            </div>
            <div className="p-6 font-mono text-sm space-y-6">
              {/* Step 1 */}
              <div>
                <p className="text-[10px] text-white/20 tracking-[0.2em] uppercase mb-2">
                  # Install NERV-VIPER
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400/60 select-none">❯</span>
                  <span className="text-white/90">npm i nerv-viper</span>
                </div>
              </div>

              {/* Step 2 */}
              <div>
                <p className="text-[10px] text-white/20 tracking-[0.2em] uppercase mb-2">
                  # Run a basic stress test
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400/60 select-none">❯</span>
                  <span className="text-white/90">
                    nerv https://target-site.com
                  </span>
                </div>
              </div>

              {/* Step 3 */}
              <div>
                <p className="text-[10px] text-white/20 tracking-[0.2em] uppercase mb-2">
                  # AI-powered scan with PDF report
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400/60 select-none">❯</span>
                  <span className="text-white/90">
                    nerv https://target-site.com --ai --pdf
                  </span>
                </div>
              </div>

              {/* Step 4 */}
              <div>
                <p className="text-[10px] text-white/20 tracking-[0.2em] uppercase mb-2">
                  # Clone and scan a GitHub repo
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400/60 select-none">❯</span>
                  <span className="text-white/90">
                    nerv --ai --repo https://github.com/user/repo --repo-only
                  </span>
                </div>
              </div>

              {/* Step 5 */}
              <div>
                <p className="text-[10px] text-white/20 tracking-[0.2em] uppercase mb-2">
                  # Generate a beginner-friendly report from last scan
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400/60 select-none">❯</span>
                  <span className="text-white/90">nerv prev simplepdf</span>
                </div>
              </div>

              {/* Output */}
              <div className="border-t border-white/5 pt-4 space-y-1 text-xs text-white/20">
                <p>[NERV-VIPER v3.5.6] Pipeline initiated...</p>
                <p>[ORCHESTRATION] Routing directives → execution layer</p>
                <p>[EXECUTION] Scanning 1,247 files across 38 dependencies...</p>
                <p className="text-emerald-400/60 mt-2">
                  ✓ Scan complete. Report saved to ./reports/security_report.pdf
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
