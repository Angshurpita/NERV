"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getURL } from "@/utils/url";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const [supabase] = useState(() => createClient());

  // 🔐 Get user + listen to auth changes
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          setIsAuthOpen(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // 🎯 Scroll effect
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔐 Google Auth
  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${getURL()}/auth/callback`,
        queryParams: {
          access_type: "offline",
        },
      },
    });

    if (error) {
      setMessage(`Auth Error: ${error.message}`);
      setLoading(false);
    }
  };

  // 🚪 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 transition-all duration-500 ${scrolled
          ? "py-4 bg-white/70 backdrop-blur-xl border-b border-black/5 shadow-sm"
          : "py-8 bg-transparent"
          }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8">
            <Image
              src="/nerv-logo.png"
              alt="NERV Logo"
              fill
              className="object-contain opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </div>
          <span className="font-bold tracking-[0.1em] text-sm text-gray-900">
            NERV<span className="text-blue-600">-VIPER</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-10 text-[11px] tracking-[0.15em] text-gray-400 font-bold">
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
              className={`hover:text-gray-900 transition-all duration-500 ${pathname === link.href ? "text-gray-900" : ""
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4 text-xs font-bold">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span className="text-[10px] tracking-widest">
                  {user.email}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="px-5 py-2 border border-black/5 hover:bg-gray-50 rounded-lg text-[10px] tracking-widest text-gray-500 hover:text-gray-900 transition"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-5 py-2 text-gray-500 hover:text-gray-900 text-[10px] tracking-widest transition"
              >
                LOGIN
              </button>

              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-6 py-2 bg-gray-900 text-white hover:bg-blue-600 rounded-lg text-[10px] tracking-widest transition shadow"
              >
                GET STARTED
              </button>
            </>
          )}
        </div>
      </nav>

      {/* AUTH MODAL */}
      {isAuthOpen && !user && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/40 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-white border border-black/5 rounded-3xl p-8 md:p-12 relative shadow-2xl">
            {/* Close */}
            <button
              onClick={() => {
                setIsAuthOpen(false);
                setMessage("");
              }}
              className="absolute top-6 right-6 text-gray-300 hover:text-gray-900"
            >
              ✕
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2 mb-12 justify-center">
              <div className="relative w-7 h-7">
                <Image
                  src="/nerv-logo.png"
                  alt="NERV Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold tracking-[0.1em] text-sm text-gray-900">
                NERV<span className="text-blue-600">-VIPER</span>
              </span>
            </div>

            <h2 className="text-2xl font-bold text-center mb-2">
              Access Terminal
            </h2>

            <p className="text-[11px] text-gray-400 text-center mb-10">
              Initialize secure authentication
            </p>

            {/* Google Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 py-4 border rounded-2xl text-[11px] font-bold uppercase hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? "Initializing..." : "Continue with Google"}
            </button>

            {/* Error */}
            {message && (
              <p className="text-xs text-red-600 bg-red-50 px-4 py-3 rounded-xl mt-6 text-center">
                {message}
              </p>
            )}

            <p className="text-[9px] text-gray-400 text-center mt-6">
              By proceeding, you agree to our policies
            </p>
          </div>
        </div>
      )}
    </>
  );
}