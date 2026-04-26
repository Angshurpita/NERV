"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getURL } from "@/utils/url";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const router = useRouter();
  const [supabase] = useState(() => createClient());

  // ✅ Check session on load
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      if (data?.session) {
        router.replace("/dashboard"); // prevents back navigation to login
      } else {
        setCheckingSession(false);
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, [supabase, router]);

  // ✅ Google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${getURL()}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // ⛔ prevent flicker before session check completes
  if (checkingSession) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Checking session...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-6 pt-32">
      <div className="w-full max-w-md bg-white border border-black/5 rounded-3xl p-8 md:p-12 shadow-premium relative overflow-hidden">

        {/* Background blobs */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/5 blur-3xl rounded-full"></div>

        <div className="relative z-10">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-12 justify-center group">
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

          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
              Operator Authorization
            </h1>
            <p className="text-[11px] text-gray-400 tracking-wide font-medium uppercase">
              Secure Access Terminal
            </p>
          </div>

          {/* Login button */}
          <div className="flex flex-col gap-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 py-4 bg-white border border-black/5 rounded-2xl text-[11px] font-bold tracking-[0.1em] uppercase hover:bg-gray-50 disabled:opacity-50 transition-all duration-300 shadow-sm"
            >
              {/* Google Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>

              {loading ? "Initializing..." : "Continue with Google"}
            </button>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-600 bg-red-50 px-4 py-3 rounded-xl text-center">
                {error}
              </p>
            )}

            {/* Footer note */}
            <div className="mt-8 pt-8 border-t border-black/5 text-center">
              <p className="text-[9px] text-gray-400 leading-relaxed tracking-wider">
                BY AUTHORIZING, YOU ACKNOWLEDGE THAT ALL OPERATIONS <br />
                ARE LOGGED WITHIN THE NERV-VIPER SECURITY FRAMEWORK.
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}