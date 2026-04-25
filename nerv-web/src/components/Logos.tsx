"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Logos() {
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
      className="py-20 border-y border-white/5 bg-black/20 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className={`flex flex-col items-center gap-12 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.5em] text-white/20 uppercase font-bold">
              Core Intelligence Engine
            </span>
            <div className="h-px w-12 bg-white/10"></div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32 opacity-40 hover:opacity-100 transition-all duration-700">
            {/* The provided logo repeated or alongside text brands for a "Logos Section" look */}
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/nerv-logo.png"
                  alt="NERV Core"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold tracking-[0.2em] text-white">NERV-VIPER</span>
            </div>
            
            <div className="text-2xl font-black tracking-tighter text-white/40 font-mono">
              AGENTIC<span className="text-emerald-400/20">.AI</span>
            </div>

            <div className="text-xl font-light tracking-[0.4em] text-white/30 italic">
              VIPER<span className="font-bold text-white/10">.PROTOCOL</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
