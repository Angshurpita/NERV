"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: any, session: any) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          setIsAuthOpen(false);
          setShowOtpInput(false);
          setEmail("");
          setOtp("");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Transmission sent. Check your inbox for the code.");
      setShowOtpInput(true);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      setMessage(`Verification failed: ${error.message}`);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 transition-all duration-500 ${
          scrolled
            ? "py-4 bg-black/80 backdrop-blur-xl border-b border-white/5"
            : "py-6 bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 md:w-10 md:h-10">
            <Image
              src="/nerv-logo.png"
              alt="NERV Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold tracking-[0.15em] text-sm">
            NERV<span className="text-emerald-400">-VIPER</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.15em] text-white/40 font-medium">
          {[
            { name: "ARCHITECTURE", href: "/" },
            { name: "PIPELINE", href: "/pipeline" },
            { name: "DOCS", href: "/docs" },
            { name: "FEATURES", href: "/features" },
            { name: "ACCESS", href: "/access" },
            { name: "CONTRIBUTE", href: "/contribute" },
          ].map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`hover:text-white transition-all duration-300 ${
                pathname === link.href
                  ? "text-white font-bold scale-110"
                  : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3 text-xs font-semibold tracking-wider">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 text-white/50 hover:text-white transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-[11px] tracking-wider">{user.email}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all duration-300 rounded-lg text-[11px] tracking-wider text-white/60 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-4 py-2 border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all duration-300 rounded-lg text-[11px] tracking-wider text-white/60 hover:text-white"
              >
                Login
              </button>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-4 py-2 bg-white text-black hover:bg-emerald-400 transition-all duration-300 rounded-lg text-[11px] tracking-wider font-bold"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Auth Modal Overlay */}
      {isAuthOpen && !user && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#050505] border border-white/8 rounded-2xl p-8 md:p-10 relative shadow-2xl">
            <button
              onClick={() => {
                setIsAuthOpen(false);
                setShowOtpInput(false);
                setMessage("");
              }}
              className="absolute top-5 right-5 text-white/20 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="relative w-6 h-6">
                <Image
                  src="/nerv-logo.png"
                  alt="NERV Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold tracking-[0.15em] text-sm">
                NERV<span className="text-emerald-400">-VIPER</span>
              </span>
            </div>

            <h2 className="text-xl font-bold tracking-wide mb-1">System Access</h2>
            <p className="text-xs text-white/30 tracking-wider mb-8 uppercase">
              Authenticate via secure OTP transmission
            </p>

            {!showOtpInput ? (
              <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-white/30 tracking-[0.2em] uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400/30 transition-colors placeholder:text-white/15"
                    placeholder="operator@nerv.system"
                  />
                </div>

                {message && (
                  <p className={`text-xs tracking-wider px-3 py-2 rounded-lg ${
                    message.includes("Error")
                      ? "text-red-400 bg-red-400/5"
                      : "text-emerald-400 bg-emerald-400/5"
                  }`}>
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-white text-black text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-emerald-400 disabled:opacity-50 transition-all duration-300 rounded-lg"
                >
                  {loading ? "Transmitting..." : "Send Secure Code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-white/30 tracking-[0.2em] uppercase">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3 text-sm text-white tracking-[0.5em] text-center focus:outline-none focus:border-emerald-400/30 transition-colors font-mono placeholder:text-white/15"
                    placeholder="00000000"
                    maxLength={8}
                  />
                </div>

                {message && (
                  <p className={`text-xs tracking-wider px-3 py-2 rounded-lg ${
                    message.includes("Error") || message.includes("failed")
                      ? "text-red-400 bg-red-400/5"
                      : "text-emerald-400 bg-emerald-400/5"
                  }`}>
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-white text-black text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-emerald-400 disabled:opacity-50 transition-all duration-300 rounded-lg"
                >
                  {loading ? "Verifying..." : "Initialize Session"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowOtpInput(false);
                    setMessage("");
                    setOtp("");
                  }}
                  className="text-[10px] text-white/25 hover:text-white/60 uppercase tracking-[0.2em] transition-colors"
                >
                  ← Back to email
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
