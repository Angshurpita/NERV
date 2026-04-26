"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center px-6 overflow-hidden pt-32 pb-20 bg-white">
      {/* Background layers */}
      <div className="absolute inset-0 bg-mesh opacity-100"></div>
      <div className="absolute inset-0 bg-dots opacity-[0.4]"></div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-500/[0.03] rounded-full blur-[180px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-500/[0.03] rounded-full blur-[120px] pointer-events-none animate-float"></div>

      {/* Hero Badge */}
      <div className={`mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/5 bg-black/[0.02] backdrop-blur-md transition-all duration-1000 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
        </span>
        <span className="text-[10px] tracking-[0.2em] uppercase text-black/40 font-semibold">Security Orchestration Active</span>
      </div>

      {/* Title */}
      <div className="text-center mb-10 z-10">
        <h1
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[1.1] transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="block text-gradient">NERV</span>
          <span className="block text-gradient-accent">
            VIPER
          </span>
        </h1>
      </div>

      {/* Subtitle */}
      <p
        className={`max-w-xl text-center text-gray-500 text-base md:text-lg leading-relaxed tracking-tight mb-16 font-normal transition-all duration-1000 delay-200 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        Intelligent security orchestration.{" "}
        <span className="text-gray-900 font-medium">Deterministic</span> vulnerability analysis
        powered by a multi-agent 3-layer architecture.
      </p>

      {/* Terminal / Preview */}
      <div
        className={`w-full max-w-2xl rounded-2xl border border-black/[0.05] bg-white shadow-premium overflow-hidden relative transition-all duration-1000 delay-500 ${
          mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
        }`}
      >
        <div className="flex items-center px-6 py-4 border-b border-black/[0.03] bg-gray-50/50">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-black/5 border border-black/10"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-black/5 border border-black/10"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-black/5 border border-black/10"></div>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 text-[9px] tracking-[0.3em] text-black/20 font-mono uppercase font-bold">
            nerv-viper interface
          </div>
        </div>
        <div className="p-8 md:p-10 font-mono text-sm space-y-4 bg-white">
          <div className="flex items-center">
            <span className="text-blue-600/40 mr-4 select-none">$</span>
            <span className="text-gray-800">npm i nerv-viper</span>
            <span className="inline-block w-1.5 h-4 bg-blue-600/40 ml-2 animate-terminal-blink"></span>
          </div>

          <div className="flex items-center">
            <span className="text-blue-600/40 mr-4 select-none">$</span>
            <span className="text-gray-400">nerv https://nerv.so --ai-cloud</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-10 flex flex-col items-center gap-3 transition-all duration-1000 delay-1000 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-px h-12 bg-gradient-to-b from-black/10 via-black/5 to-transparent"></div>
      </div>
    </section>
  );
}
