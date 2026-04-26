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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const [supabase] = useState(() => createClient());

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
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
        },
      },
    });

    if (error) {
      setMessage(`Auth Error: ${error.message}`);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <>
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

        {/* Nav links */}
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
              className={`hover:text-gray-900 transition-all duration-500 ${pathname === link.href
                ? "text-gray-900"
                : ""
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-4 text-xs font-bold">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span className="text-[10px] tracking-widest">{user.email}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2 border border-black/5 hover:bg-gray-50 transition-all duration-500 rounded-lg text-[10px] tracking-widest text-gray-500 hover:text-gray-900 font-bold"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsAuthOpen(true);
                }}
                className="px-5 py-2 text-gray-500 hover:text-gray-900 transition-all duration-500 text-[10px] tracking-widest font-bold"
              >
                LOGIN
              </button>
              <button
                onClick={() => {
                  setIsAuthOpen(true);
                }}
                className="px-6 py-2 bg-gray-900 text-white hover:bg-blue-600 transition-all duration-500 rounded-lg text-[10px] tracking-widest font-bold shadow-premium"
              >
                GET STARTED
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Auth Modal Overlay */}
      {isAuthOpen && !user && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/40 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-white border border-black/5 rounded-3xl p-8 md:p-12 relative shadow-2xl">
            <button
              onClick={() => {
                setIsAuthOpen(false);
                setMessage("");
              }}
              className="absolute top-6 right-6 text-gray-300 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
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

            <h2 className="text-2xl font-bold tracking-tight mb-2 text-center text-gray-900">
              Access Terminal
            </h2>
            <p className="text-[11px] text-gray-400 tracking-wide mb-10 text-center font-medium">
              Initialize secure synchronization with NERV-VIPER
            </p>

            <div className="flex flex-col gap-6">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-4 py-4 bg-white border border-black/5 rounded-2xl text-[11px] font-bold tracking-[0.1em] uppercase hover:bg-gray-50 disabled:opacity-50 transition-all duration-300 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {loading ? "Initializing..." : "Continue with Google"}
              </button>

              {message && (
                <p className="text-xs text-red-600 bg-red-50 px-4 py-3 rounded-xl tracking-wide text-center">
                  {message}
                </p>
              )}

              <p className="text-[9px] text-gray-400 text-center leading-relaxed tracking-wider mt-4">
                BY PROCEEDING, YOU AGREE TO THE NERV PROTOCOLS <br />
                AND SECURITY DIRECTIVES.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
