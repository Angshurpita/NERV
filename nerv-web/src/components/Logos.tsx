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
      className="py-24 border-y border-gray-100 bg-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className={`flex flex-col items-center gap-16 transition-all duration-[1200ms] cubic-bezier(0.2, 0.8, 0.2, 1) ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="flex flex-col items-center gap-4">
            <span className="text-[11px] tracking-[0.5em] text-gray-500 uppercase font-black">
              Integrated Intelligence Systems
            </span>
            <div className="h-[2px] w-12 bg-blue-600 rounded-full"></div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
            {/* NERV-VIPER */}
            <div className="group flex items-center gap-4 transition-all duration-500">
              <div className="relative w-8 h-8 transition-transform duration-500 group-hover:scale-110">
                <Image
                  src="/nerv-logo.png"
                  alt="NERV"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[14px] font-bold tracking-[0.3em] text-gray-900">NERV</span>
            </div>

            {/* Gemma */}
            <div className="group flex items-center gap-3 transition-all duration-500">
              <div className="relative w-8 h-8 overflow-hidden rounded-lg border border-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-md">
                <Image
                  src="https://avatars.githubusercontent.com/u/159254807?s=200&v=4"
                  alt="Gemma"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[14px] font-bold tracking-tight text-gray-800">Gemma</span>
            </div>

            {/* Qwen */}
            <div className="group flex items-center gap-3 transition-all duration-500">
              <div className="relative w-8 h-8 overflow-hidden rounded-lg border border-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-md">
                <Image
                  src="https://avatars.githubusercontent.com/u/141221163?s=200&v=4"
                  alt="Qwen"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[14px] font-bold tracking-tight text-gray-800">Qwen</span>
            </div>

            {/* Kimi */}
            <div className="group flex items-center gap-3 transition-all duration-500">
              <div className="relative w-8 h-8 overflow-hidden rounded-lg border border-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-md">
                <Image
                  src="https://avatars.githubusercontent.com/u/136453915?s=200&v=4"
                  alt="Kimi"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[14px] font-bold tracking-tight text-gray-800">Kimi</span>
            </div>

            {/* GLM */}
            <div className="group flex items-center gap-3 transition-all duration-500">
              <div className="relative w-8 h-8 overflow-hidden rounded-lg border border-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-md">
                <Image
                  src="https://avatars.githubusercontent.com/u/120247656?s=200&v=4"
                  alt="GLM"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[14px] font-bold tracking-tight text-gray-800">GLM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
