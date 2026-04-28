import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative mt-auto bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-16 mb-24">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.png"
                  alt="NERV Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold tracking-[0.3em] text-[13px] text-gray-900">NERV-VIPER</span>
            </div>
            <p className="text-[14px] text-gray-500 leading-relaxed max-w-sm mb-8 font-light">
              Advanced multi-agent security orchestration framework. Delivering 
              deterministic, root-cause-first vulnerability analysis through a 
              premium 3-layer architecture.
            </p>
            <div className="flex items-center gap-6">
              <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase font-medium">
                PRODUCTION READY
              </p>
              <div className="h-px w-8 bg-gray-200"></div>
              <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase font-medium">
                MIT LICENSE
              </p>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-[11px] tracking-[0.4em] text-gray-900 uppercase font-bold mb-8">
              Platform
            </p>
            <div className="flex flex-col gap-4">
              <a href="#architecture" className="text-[13px] text-gray-500 hover:text-blue-600 transition-all duration-300 font-normal tracking-wide">Architecture</a>
              <a href="#pipeline" className="text-[13px] text-gray-500 hover:text-blue-600 transition-all duration-300 font-normal tracking-wide">Pipeline</a>
              <a href="#features" className="text-[13px] text-gray-500 hover:text-blue-600 transition-all duration-300 font-normal tracking-wide">Features</a>
              <a href="#pricing" className="text-[13px] text-gray-500 hover:text-blue-600 transition-all duration-300 font-normal tracking-wide">Subscription</a>
              <a href="#docs" className="text-[13px] text-gray-500 hover:text-blue-600 transition-all duration-300 font-normal tracking-wide">Documentation</a>
            </div>
          </div>

          {/* Ecosystem */}
          <div>
            <p className="text-[11px] tracking-[0.4em] text-gray-900 uppercase font-bold mb-8">
              Ecosystem
            </p>
            <div className="flex flex-col gap-4">
              <a href="https://github.com/ANG13T/nerv-cli" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-blue-600 transition-all duration-300 font-normal tracking-wide">GitHub Repository</a>
              <a href="https://www.npmjs.com/package/nerv-cli" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-blue-600 transition-all duration-300 font-normal tracking-wide">NPM Package</a>
              <a href="#" className="text-[13px] text-gray-500 hover:text-blue-600 transition-all duration-300 font-normal tracking-wide">Security Protocols</a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[11px] tracking-[0.4em] text-gray-900 uppercase font-bold mb-8">
              Legal
            </p>
            <div className="flex flex-col gap-4">
              <a href="/return-policy" className="text-[13px] text-gray-500 hover:text-blue-600 transition-all duration-300 font-normal tracking-wide">Return Policy</a>
              <a href="/refund-policy" className="text-[13px] text-gray-500 hover:text-blue-600 transition-all duration-300 font-normal tracking-wide">Refund Policy</a>
              <a href="/privacy-policy" className="text-[13px] text-gray-500 hover:text-blue-600 transition-all duration-300 font-normal tracking-wide">Privacy Policy</a>
              <a href="/disclaimer" className="text-[13px] text-gray-500 hover:text-blue-600 transition-all duration-300 font-normal tracking-wide">Disclaimer</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 py-12 border-t border-gray-200">
          <div className="flex flex-col gap-3">
            <p className="text-[11px] tracking-[0.4em] text-gray-900 uppercase font-bold">
              &copy; 2026 NERV-VIPER SECURITY SYSTEMS
            </p>
            <p className="text-[10px] tracking-[0.15em] text-gray-400 uppercase font-normal">
              Engineered for the Advanced Agentic Coding Initiative
            </p>
          </div>
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-blue-50 border border-blue-100">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-40"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600"></span>
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-black/40 font-semibold">Security Orchestration Active</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
