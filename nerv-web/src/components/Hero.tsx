"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center px-6 overflow-hidden pt-24 pb-12">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/[0.03] rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none animate-float"></div>



      {/* Title */}
      <h1
        className={`text-6xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter leading-[0.85] mb-8 text-center transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <span className="block text-gradient">NERV</span>
        <span className="block text-stroke font-extralight text-gradient-accent" style={{ WebkitTextStroke: '1.5px rgba(74, 222, 128, 0.5)', color: 'transparent' }}>
          VIPER
        </span>
      </h1>

      {/* Subtitle */}
      <p
        className={`max-w-2xl text-center text-white/40 text-sm md:text-base leading-relaxed tracking-wide mb-14 font-light transition-all duration-1000 delay-200 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        Multi-agent security orchestration framework.{" "}
        <span className="text-white/70">Root-cause-first</span> vulnerability analysis
        through a deterministic 3-layer architecture — Directive, Orchestration, Execution.
      </p>



      {/* Terminal */}
      <div
        className={`w-full max-w-3xl rounded-xl border border-white/8 bg-[#050505] shadow-2xl overflow-hidden relative glow-white transition-all duration-1000 delay-500 ${
          mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
        }`}
      >
        <div className="scanline">
          <div className="flex items-center px-5 py-3.5 border-b border-white/8">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-white/10 hover:bg-red-400/60 transition-colors"></div>
              <div className="w-3 h-3 rounded-full bg-white/10 hover:bg-yellow-400/60 transition-colors"></div>
              <div className="w-3 h-3 rounded-full bg-white/10 hover:bg-emerald-400/60 transition-colors"></div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-white/30 font-mono uppercase">
              nerv-viper — terminal
            </div>
          </div>
          <div className="p-6 md:p-8 font-mono text-sm space-y-3">
            <div className="flex items-center">
              <span className="text-emerald-400/70 mr-3 select-none">❯</span>
              <span className="text-white/90">npm i nerv-viper</span>
              <span className="inline-block w-2 h-5 bg-emerald-400/80 ml-2 animate-terminal-blink"></span>
            </div>

            <div className="flex items-center mt-4">
              <span className="text-emerald-400/70 mr-3 select-none">❯</span>
              <span className="text-white/50">nerv https://target-site.com --ai</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-10 flex flex-col items-center gap-2 transition-all duration-1000 delay-700 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-[9px] tracking-[0.4em] text-white/20 uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent"></div>
      </div>
    </section>
  );
}
