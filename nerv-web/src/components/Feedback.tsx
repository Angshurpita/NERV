"use client";

import { useState, useEffect, useRef } from "react";
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
      (_event, session) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, description }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Feedback transmitted successfully.");
        setDescription("");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage("Transmission failed. System error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contribute"
      className="relative py-32 md:py-40 px-6 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute inset-0 bg-grid opacity-20"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Section header */}
        <div
          className={`mb-16 text-center transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-emerald-400"></div>
            <span className="text-[10px] tracking-[0.4em] text-emerald-400 uppercase font-medium">
              Contribute
            </span>
            <div className="w-8 h-px bg-emerald-400"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 text-gradient">
            Structural Feedback
          </h2>
          <p className="text-white/40 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Submit anomalies or propose architectural enhancements.
            All reports are routed directly to the core team.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`p-8 md:p-10 rounded-xl border border-white/8 bg-[#050505] flex flex-col gap-8 transition-all duration-1000 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Identity */}
          {email ? (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-400/5 border border-emerald-400/15">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase">Authenticated as</span>
              <span className="text-xs text-emerald-400 font-mono tracking-wide">{email}</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-400/5 border border-red-400/15">
              <span className="w-2 h-2 rounded-full bg-red-400/60"></span>
              <span className="text-[10px] tracking-[0.2em] text-red-400/80 uppercase">
                Authentication required — Login to submit feedback
              </span>
            </div>
          )}

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] tracking-[0.3em] text-white/30 uppercase">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the anomaly or enhancement proposal..."
              className="w-full bg-white/[0.02] border border-white/8 rounded-lg p-4 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-emerald-400/30 transition-colors resize-none h-32"
              required
              disabled={!email}
            />
          </div>

          {/* Status message */}
          {message && (
            <div
              className={`text-xs text-center tracking-[0.2em] uppercase px-4 py-3 rounded-lg ${
                message.includes("Error") || message.includes("failed")
                  ? "text-red-400 bg-red-400/5 border border-red-400/15"
                  : "text-emerald-400 bg-emerald-400/5 border border-emerald-400/15"
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !email}
            className="group w-full py-4 bg-white text-black text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-emerald-400 disabled:opacity-30 disabled:hover:bg-white transition-all duration-300 rounded-lg flex items-center justify-center gap-3"
          >
            {!email ? (
              "Login Required"
            ) : loading ? (
              "Transmitting..."
            ) : (
              <>
                <span>Submit Report</span>
                <svg
                  className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
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
