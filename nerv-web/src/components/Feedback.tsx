"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Feedback() {
  const [email, setEmail] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setEmail(session.user.email);
      }
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: any, session: any) => {
        if (session?.user?.email) {
          setEmail(session.user.email);
        } else {
          setEmail(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // AbortController ref for cleanup on unmount (FIX G018/G019)
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      // Cancel any in-flight fetch on unmount
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Abort any previous in-flight request
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Feedback transmitted successfully.");
        setDescription("");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return; // Silently ignore aborted requests
      setMessage("Transmission failed. System error.");
    } finally {
      setLoading(false);
    }
  }, [email, description]);

  return (
    <section
      ref={sectionRef}
      id="contribute"
      className="relative py-40 px-6 overflow-hidden bg-gray-50"
    >
      <div className="absolute inset-0 bg-dots opacity-[0.3]"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Section header */}
        <div
          className={`mb-16 text-center transition-all duration-[1200ms] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-px bg-blue-600/10"></div>
            <span className="text-[10px] tracking-[0.5em] text-blue-600 uppercase font-bold">
              Contribution
            </span>
            <div className="w-12 h-px bg-blue-600/10"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-gray-900">
            Structural Feedback
          </h2>
          <p className="text-gray-500 text-[15px] max-w-md mx-auto leading-relaxed font-medium">
            Submit anomalies or propose architectural enhancements.
            All reports are routed directly to the core team.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`p-10 md:p-12 rounded-3xl border border-black/5 bg-white shadow-premium flex flex-col gap-10 transition-all duration-[1200ms] delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          {/* Identity */}
          {email ? (
            <div className="flex items-center gap-4 px-5 py-4 rounded-xl bg-blue-50 border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-40"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <div className="flex flex-col">
                <span className="text-[9px] tracking-[0.2em] text-gray-400 uppercase font-bold">Authenticated User</span>
                <span className="text-[13px] text-gray-900 font-mono tracking-tight">{email}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 px-5 py-4 rounded-xl bg-red-50 border border-red-100">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-[10px] tracking-[0.2em] text-red-600 uppercase font-bold">
                Access Restricted — Please authenticate
              </span>
            </div>
          )}

          {/* Description */}
          <div className="flex flex-col gap-3">
            <label
              htmlFor="feedback-description"
              className="text-[10px] tracking-[0.4em] text-gray-400 uppercase font-bold px-1"
            >
              Briefing / Report
            </label>
            <textarea
              id="feedback-description"
              aria-label="Describe the anomaly or proposal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the anomaly or proposal..."
              className="w-full bg-gray-50 border border-black/5 rounded-xl p-5 text-[14px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-blue-600/20 transition-all duration-300 resize-none h-40 font-medium"
              required
              disabled={!email}
            />
          </div>

          {/* Status message */}
          {message && (
            <div
              className={`text-[11px] text-center tracking-[0.2em] uppercase px-5 py-4 rounded-xl font-bold ${message.includes("Error") || message.includes("failed")
                ? "text-red-600 bg-red-50 border border-red-100"
                : "text-blue-600 bg-blue-50 border border-blue-100"
                }`}
            >
              {message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !email}
            aria-label={!email ? 'Login required to submit feedback' : loading ? 'Submitting feedback' : 'Submit feedback report'}
            className="group w-full py-5 bg-gray-900 text-white text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-black disabled:opacity-20 disabled:hover:bg-gray-900 disabled:hover:text-white transition-all duration-500 rounded-xl flex items-center justify-center gap-3 shadow-premium"
          >
            {!email ? (
              "Login Required"
            ) : loading ? (
              "Transmitting Payload..."
            ) : (
              <>
                <span>Submit Report</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
