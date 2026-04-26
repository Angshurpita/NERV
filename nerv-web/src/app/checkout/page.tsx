"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { generateAuthToken, PlanType } from "@/utils/token";
import Image from "next/image";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planName = searchParams.get("plan") || "PRO";
  const amount = searchParams.get("amount") || "5";

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  useEffect(() => {
    supabase.auth.getUser().then((res: any) => setUser(res.data.user));
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

    // Add to Database for persistent access
    const { error: dbError } = await supabase
      .from("subscriptions")
      .insert({
        user_id: user.id,
        plan: newSub.plan,
        token: newSub.token,
        expires_at: newSub.expiresAt,
      });

    if (dbError) {
      console.error("Database sync failed:", dbError.message);
    }

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
    <main className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-dots opacity-[0.2] pointer-events-none"></div>
      
      <div className="w-full max-w-lg bg-white border border-gray-100 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden shadow-premium">
        {/* Subtle Accent Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-500/[0.03] blur-[100px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-14">
            <Image src="/nerv-logo.png" alt="NERV" width={28} height={28} />
            <span className="text-[10px] tracking-[0.5em] font-bold uppercase text-gray-400">Secure Node Authorization</span>
          </div>

          {status === "idle" && (
            <>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-gray-900">
                Initialize <span className="text-blue-600 italic">Access</span>
              </h1>
              <p className="text-[14px] text-gray-500 tracking-wide mb-10 font-light">
                Plan: <span className="text-gray-900 font-bold uppercase tracking-widest">{planName}</span> &mdash; ${amount}/Month
              </p>

              <div className="space-y-5 mb-12">
                <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl">
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] mb-2 font-bold">Authorized Operator</p>
                  <p className="text-[15px] font-mono text-gray-700 tracking-tight">{user?.email || "Guest"}</p>
                </div>
                <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold">Total Transaction</span>
                  <span className="text-2xl font-bold text-blue-600">${amount}.00</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-6 bg-blue-600 text-white text-[11px] font-black tracking-[0.4em] uppercase hover:bg-blue-700 transition-all duration-500 rounded-2xl shadow-xl shadow-blue-600/10 active:scale-[0.98]"
              >
                {loading ? "Processing..." : "Confirm Protocol"}
              </button>
            </>
          )}

          {status === "processing" && (
            <div className="py-24 text-center">
              <div className="w-14 h-14 border-[3px] border-blue-600/10 border-t-blue-600 rounded-full animate-spin mx-auto mb-10 shadow-lg shadow-blue-600/5"></div>
              <p className="text-[11px] tracking-[0.5em] text-blue-600 uppercase font-black animate-pulse">
                Encrypting Access Tunnel...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="py-14 text-center animate-in fade-in zoom-in duration-700">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-10 border border-blue-100 shadow-xl shadow-blue-600/5">
                <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-3 text-blue-600">
                Access Granted
              </h2>
              <p className="text-[11px] text-gray-400 tracking-[0.3em] uppercase mb-10 font-bold">
                Assigning unique Node ID...
              </p>
              <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl mb-10">
                <p className="text-[9px] text-blue-600/60 uppercase tracking-[0.3em] mb-3 font-bold">New Auth Signature Verified</p>
                <div className="h-5 bg-blue-100 rounded-lg overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] font-bold">
                Relaying to Control Hub
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function MockCheckout() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black flex items-center justify-center p-6"><div className="w-14 h-14 border-[3px] border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div></main>}>
      <CheckoutContent />
    </Suspense>
  );
}
