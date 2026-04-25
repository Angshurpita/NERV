"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { generateAuthToken, PlanType } from "@/utils/token";
import Image from "next/image";

export default function MockCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planName = searchParams.get("plan") || "PRO";
  const amount = searchParams.get("amount") || "5";
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase]);

  const handlePayment = async () => {
    if (!user) {
      alert("Please login to proceed.");
      return;
    }
    
    setLoading(true);
    setStatus("processing");

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Generate Token
    const token = generateAuthToken(user.id, planName.toUpperCase() as PlanType);

    // Get existing subscriptions or empty array
    const saved = localStorage.getItem(`sub_${user.id}`);
    let activeSubscriptions = [];
    if (saved) {
      try {
        activeSubscriptions = JSON.parse(saved);
        if (!Array.isArray(activeSubscriptions)) activeSubscriptions = [activeSubscriptions];
      } catch (e) {
        activeSubscriptions = [];
      }
    }

    // Add new subscription
    const newSub = {
      plan: planName.toUpperCase(),
      token: token,
      activatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    
    // Remove if already exists (to update)
    activeSubscriptions = activeSubscriptions.filter((s: any) => s.plan !== planName.toUpperCase());
    activeSubscriptions.push(newSub);

    localStorage.setItem(`sub_${user.id}`, JSON.stringify(activeSubscriptions));

    setStatus("success");
    setLoading(false);

    // Redirect to dashboard after a delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#050505] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-400/10 blur-[80px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <Image src="/nerv-logo.png" alt="NERV" width={24} height={24} />
            <span className="text-[10px] tracking-[0.3em] font-bold uppercase text-white/40">Secure Checkout</span>
          </div>

          {status === "idle" && (
            <>
              <h1 className="text-3xl font-black tracking-tighter mb-2 uppercase italic">
                Initialize <span className="text-emerald-400">Access</span>
              </h1>
              <p className="text-xs text-white/30 tracking-wider mb-8 uppercase">
                Plan: {planName} &mdash; ${amount}/Month
              </p>

              <div className="space-y-4 mb-10">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Authenticated Operator</p>
                  <p className="text-sm font-mono text-white/80">{user?.email || "Guest"}</p>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center">
                  <span className="text-[10px] text-white/20 uppercase tracking-widest">Total Transaction</span>
                  <span className="text-xl font-black italic text-emerald-400">${amount}.00</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-5 bg-white text-black text-[11px] font-black tracking-[0.3em] uppercase hover:bg-emerald-400 transition-all duration-300 rounded-2xl shadow-lg shadow-emerald-400/5"
              >
                {loading ? "Processing..." : "Confirm Protocol"}
              </button>
            </>
          )}

          {status === "processing" && (
            <div className="py-20 text-center">
              <div className="w-12 h-12 border-4 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin mx-auto mb-8"></div>
              <p className="text-[11px] tracking-[0.4em] text-emerald-400 uppercase font-black animate-pulse">
                Encrypting Transaction...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="py-12 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-400/20">
                <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-2xl font-black tracking-tighter mb-2 uppercase italic text-emerald-400">
                Access Granted
              </h2>
              <p className="text-[10px] text-white/30 tracking-widest uppercase mb-8">
                Generating unique Auth ID...
              </p>
              <div className="p-4 bg-emerald-400/5 border border-emerald-400/20 rounded-xl mb-8">
                <p className="text-[9px] text-emerald-400/40 uppercase tracking-widest mb-2 font-bold">New Auth ID Assigned</p>
                <div className="h-4 bg-emerald-400/10 rounded overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <p className="text-[9px] text-white/20 uppercase tracking-widest">
                Redirecting to Command Center
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
