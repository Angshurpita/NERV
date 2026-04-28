"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { generateAuthToken, PlanType } from "@/utils/token";
import Image from "next/image";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planName = searchParams.get("plan") || "PRO";
  const amount = searchParams.get("amount") || "399";

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "verifying" | "success" | "failed">("idle");
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [razorpayReady, setRazorpayReady] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then((res: any) => setUser(res.data.user));
  }, [supabase]);

  // Amount is already in INR
  const amountNum = Number(amount);

  const activateSubscription = useCallback(async (paymentId: string) => {
    if (!user) return;

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
      paymentId: paymentId,
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
  }, [user, planName, supabase]);

  const handlePayment = async () => {
    if (!user) {
      alert("Please login to proceed.");
      return;
    }

    if (!razorpayReady) {
      setError("Payment system is loading. Please wait...");
      return;
    }

    setLoading(true);
    setStatus("processing");
    setError(null);

    try {
      // Step 1: Create Razorpay order on server
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          plan: planName.toUpperCase(),
          email: user.email,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // Step 2: Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "NERV-VIPER",
        description: `${planName.toUpperCase()} Plan — Monthly Subscription`,
        order_id: orderData.orderId,
        image: "/logo.png",
        prefill: {
          email: user.email,
          name: user.user_metadata?.full_name || "",
        },
        theme: {
          color: "#2563eb",
          backdrop_color: "rgba(0, 0, 0, 0.7)",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setStatus("idle");
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // Step 3: Verify payment on server
          setStatus("verifying");

          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.verified) {
              // Step 4: Activate subscription
              await activateSubscription(response.razorpay_payment_id);
              setStatus("success");
              setLoading(false);

              // Redirect to dashboard after delay
              setTimeout(() => {
                router.push("/dashboard");
              }, 2500);
            } else {
              throw new Error(verifyData.error || "Payment verification failed");
            }
          } catch (verifyErr: any) {
            setStatus("failed");
            setError(verifyErr.message || "Payment verification failed");
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response: any) => {
        setStatus("failed");
        setError(response.error?.description || "Payment failed. Please try again.");
        setLoading(false);
      });

      // Reset to idle before opening modal so the UI shows the order summary
      setStatus("idle");
      rzp.open();
    } catch (err: any) {
      setStatus("failed");
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayReady(true)}
        strategy="lazyOnload"
      />
      <main className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-dots opacity-[0.2] pointer-events-none"></div>

        <div className="w-full max-w-lg bg-white border border-gray-100 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden shadow-premium">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-500/[0.03] blur-[100px] pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-14">
              <Image src="/logo.png" alt="NERV" width={28} height={28} />
              <span className="text-[10px] tracking-[0.5em] font-bold uppercase text-gray-400">Secure Node Authorization</span>
            </div>

            {(status === "idle" || status === "processing") && (
              <>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-gray-900">
                  Initialize <span className="text-blue-600 italic">Access</span>
                </h1>
                <p className="text-[14px] text-gray-500 tracking-wide mb-10 font-light">
                  Plan: <span className="text-gray-900 font-bold uppercase tracking-widest">{planName}</span> &mdash; ₹{amount}/Month
                </p>

                <div className="space-y-5 mb-12">
                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl">
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] mb-2 font-bold">Authorized Operator</p>
                    <p className="text-[15px] font-mono text-gray-700 tracking-tight">{user?.email || "Guest"}</p>
                  </div>
                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold">Total Transaction</span>
                    <span className="text-2xl font-bold text-blue-600">₹{amountNum.toLocaleString("en-IN")}</span>
                  </div>

                  {/* Razorpay Badge */}
                  <div className="flex items-center justify-center gap-2 py-3 opacity-50">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    <span className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-bold">Secured by Razorpay</span>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium">
                    {error}
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={loading || !razorpayReady}
                  className="w-full py-6 bg-blue-600 text-white text-[11px] font-black tracking-[0.4em] uppercase hover:bg-blue-700 transition-all duration-500 rounded-2xl shadow-xl shadow-blue-600/10 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Processing...
                    </span>
                  ) : !razorpayReady ? (
                    "Loading Payment..."
                  ) : (
                    "Pay with Razorpay"
                  )}
                </button>
              </>
            )}

            {status === "verifying" && (
              <div className="py-24 text-center">
                <div className="w-14 h-14 border-[3px] border-blue-600/10 border-t-blue-600 rounded-full animate-spin mx-auto mb-10 shadow-lg shadow-blue-600/5"></div>
                <p className="text-[11px] tracking-[0.5em] text-blue-600 uppercase font-black animate-pulse">
                  Verifying Payment...
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
                  Payment Verified
                </h2>
                <p className="text-[11px] text-gray-400 tracking-[0.3em] uppercase mb-10 font-bold">
                  Access Granted — Assigning Node ID...
                </p>
                <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl mb-10">
                  <p className="text-[9px] text-blue-600/60 uppercase tracking-[0.3em] mb-3 font-bold">Auth Signature Verified via Razorpay</p>
                  <div className="h-5 bg-blue-100 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] font-bold">
                  Relaying to Control Hub
                </p>
              </div>
            )}

            {status === "failed" && (
              <div className="py-14 text-center">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-10 border border-red-100">
                  <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold tracking-tight mb-3 text-red-600">
                  Transaction Failed
                </h2>
                <p className="text-sm text-gray-500 mb-8">
                  {error || "Something went wrong. Please try again."}
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setError(null);
                    setLoading(false);
                  }}
                  className="px-8 py-4 bg-gray-900 text-white text-[11px] font-black tracking-[0.3em] uppercase hover:bg-gray-800 transition-all duration-300 rounded-xl"
                >
                  Retry Payment
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-gray-50 flex items-center justify-center p-6"><div className="w-14 h-14 border-[3px] border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div></main>}>
      <CheckoutContent />
    </Suspense>
  );
}
