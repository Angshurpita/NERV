import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative mt-auto">
      <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent"></div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-8 h-8">
                <Image
                  src="/nerv-logo.png"
                  alt="NERV Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold tracking-[0.2em] text-sm">NERV-VIPER</span>
            </div>
            <p className="text-xs text-white/30 leading-relaxed max-w-xs mb-6">
              Multi-agent security orchestration framework. Root-cause-first
              vulnerability analysis through a deterministic 3-layer architecture.
            </p>
            <p className="text-[9px] tracking-[0.2em] text-white/15 uppercase">
              v3.5.6 — MIT License
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase font-medium mb-5">
              Navigate
            </p>
            <div className="flex flex-col gap-3">
              <a href="/" className="text-xs text-white/25 hover:text-white/60 transition-colors">Architecture</a>
              <a href="/pipeline" className="text-xs text-white/25 hover:text-white/60 transition-colors">Pipeline</a>
              <a href="/features" className="text-xs text-white/25 hover:text-white/60 transition-colors">Features</a>
              <a href="/access" className="text-xs text-white/25 hover:text-white/60 transition-colors">Access</a>
              <a href="/docs" className="text-xs text-white/25 hover:text-white/60 transition-colors">Documentation</a>
              <a href="/contribute" className="text-xs text-white/25 hover:text-white/60 transition-colors">Contribute</a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase font-medium mb-5">
              Resources
            </p>
            <div className="flex flex-col gap-3">
              <a href="https://github.com/ANG13T/nerv-cli" target="_blank" rel="noopener noreferrer" className="text-xs text-white/25 hover:text-white/60 transition-colors">GitHub</a>
              <a href="https://www.npmjs.com/package/nerv-cli" target="_blank" rel="noopener noreferrer" className="text-xs text-white/25 hover:text-white/60 transition-colors">npm</a>
              <a href="#" className="text-xs text-white/25 hover:text-white/60 transition-colors">Documentation</a>
              <a href="#" className="text-xs text-white/25 hover:text-white/60 transition-colors">Security Policy</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-px bg-white/5 mb-8"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-8 border-t border-white/5">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] tracking-[0.3em] text-white/20 uppercase font-bold">
              &copy; 2026 NERV-VIPER SECURITY SYSTEMS
            </p>
            <p className="text-[9px] tracking-[0.1em] text-white/10 uppercase">
              Part of the Advanced Agentic Coding Initiative
            </p>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="text-[9px] tracking-[0.2em] text-white/15 hover:text-white/40 uppercase transition-colors">Privacy Protocol</a>
            <a href="#" className="text-[9px] tracking-[0.2em] text-white/15 hover:text-white/40 uppercase transition-colors">Service Terms</a>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/5 border border-emerald-400/10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
              </span>
              <span className="text-[9px] tracking-[0.3em] text-emerald-400/60 uppercase font-bold">Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
