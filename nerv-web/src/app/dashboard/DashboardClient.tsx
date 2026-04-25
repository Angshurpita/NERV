"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

interface Profile {
  id: string;
  full_name: string | null;
  plan: string;
}

export function DashboardClient({
  user,
  initialProfile,
}: {
  user: User;
  initialProfile: Profile | null;
}) {
  const [fullName, setFullName] = useState(initialProfile?.full_name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const saved = localStorage.getItem(`sub_${user.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSubscriptions(Array.isArray(parsed) ? parsed : [parsed]);
      } catch (e) {
        console.error("Failed to parse subscriptions from storage", e);
      }
    }
  }, [user.id, supabase]);

  const activePaidSubs = subscriptions.filter(s => s.plan?.toLowerCase() !== "free");
  const hasPaidPlan = activePaidSubs.length > 0;
  const displaySubs = hasPaidPlan ? activePaidSubs : subscriptions;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Update in profiles table
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName,
        plan: initialProfile?.plan || "free", // preserve existing plan or default
      });

    if (error) {
      setMessage(`Update failed: ${error.message}`);
    } else {
      setMessage("Operator designation updated successfully.");
    }
    setLoading(false);
  };


  return (
    <div className="flex flex-col gap-12">
      {/* User Details & Identity */}
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-8 rounded-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.03] blur-[100px] pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full border-2 border-emerald-500/30 p-1 relative">
              <div className="w-full h-full bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 font-black text-xl">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-4 border-black animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white uppercase italic">
                {fullName || "Anonymous Operator"}
              </h1>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/20 tracking-widest uppercase">Rank:</span>
                    <span className="text-[10px] text-emerald-400 font-black tracking-widest uppercase italic">
                      {hasPaidPlan ? (activePaidSubs.length > 2 ? "COMMANDER" : "OPERATOR") : "CANDIDATE"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/20 tracking-widest uppercase">ID:</span>
                    <span className="text-[11px] text-white/60 font-mono">{user.id.substring(0, 12).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                    <span className="text-[10px] text-white/20 tracking-widest uppercase">Status:</span>
                    <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">
                      Clearance Level {hasPaidPlan ? activePaidSubs.length + 1 : 1}
                    </span>
                  </div>
                </div>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col gap-2">
             <label className="text-[9px] text-white/30 tracking-[0.2em] uppercase font-bold">
                Unique Auth Token
              </label>
              <div className="flex items-center gap-3">
                <div className="flex flex-wrap gap-2 max-w-md">
                  {mounted && (displaySubs.length > 0) ? (
                    displaySubs.map((sub, idx) => (
                      <div 
                        key={idx}
                        className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded font-mono text-[10px] text-emerald-400 group/token cursor-pointer flex items-center gap-2"
                        onClick={() => {
                          navigator.clipboard.writeText(sub.token);
                          setMessage(`Token for ${sub.plan} copied.`);
                          setTimeout(() => setMessage(""), 2000);
                        }}
                      >
                        <span className="opacity-40">{sub.plan.substring(0, 2)}:</span>
                        {sub.token}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded font-mono text-xs text-white/20">
                      NV-PENDING-UNASSIGNED
                    </div>
                  )}
                </div>
              </div>
              {message && <p className="text-[9px] text-emerald-400 tracking-widest uppercase animate-fade-in">{message}</p>}
          </div>
        </div>
      </div>

      {/* Access Section: All Active Plans */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
          <h2 className="text-sm font-black tracking-[0.3em] uppercase text-white/90">
            System Access Control
          </h2>
          <span className="text-[10px] text-white/30 tracking-widest uppercase italic">Select and activate available clusters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { id: "free", name: "Free Plan", limit: "5 AI Scans/Mo", color: "border-white/20" },
            { id: "starter", name: "Starter Plan", limit: "2 AI Scans/Day", color: "border-blue-500/30" },
            { id: "pro", name: "Pro Plan", limit: "10 AI Scans/Day", color: "border-emerald-500/30" },
            { id: "elite", name: "Elite Plan", limit: "20 AI Scans/Day", color: "border-purple-500/30" },
            { id: "team black", name: "Team Black", limit: "Unlimited Usage", color: "border-red-500/30", special: true },
          ].map((plan) => {
            const hasPaidPlan = subscriptions.some(s => s.plan?.toLowerCase() !== "free");
            const sub = subscriptions.find(s => s.plan?.toLowerCase() === plan.id);
            const isActive = mounted && (
              !!sub || 
              (subscriptions.length === 0 && initialProfile?.plan?.toLowerCase() === plan.id) ||
              (subscriptions.length === 0 && !initialProfile?.plan && plan.id === "free")
            ) && !(plan.id === "free" && hasPaidPlan);
            
            return (
              <div 
                key={plan.id}
                className={`relative p-6 border rounded-lg transition-all duration-500 group overflow-hidden ${
                  isActive 
                    ? `bg-emerald-500/10 ${plan.color.replace('30', '50')} shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]` 
                    : 'bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 right-0 px-2 py-1 bg-emerald-500 text-black text-[8px] font-black tracking-widest uppercase rounded-bl">
                    ACTIVE
                  </div>
                )}
                
                <h3 className={`text-[10px] font-black tracking-widest uppercase mb-4 ${isActive ? 'text-emerald-400' : 'text-white/40'}`}>
                  {plan.name}
                </h3>
                
                <p className="text-[11px] font-mono text-white/60 mb-6 leading-relaxed">
                  {plan.limit}
                </p>

                <button
                  disabled={isActive}
                  onClick={() => window.location.href = "/access"}
                  className={`w-full py-2.5 rounded text-[9px] font-black tracking-widest uppercase transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 cursor-default border border-emerald-500/30'
                      : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white hover:text-black'
                  }`}
                >
                  {isActive ? "DEPLOYED" : "INITIATE"}
                </button>

                {isActive && (
                  <div className="mt-4 pt-4 border-t border-emerald-500/10 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[8px] text-emerald-400/60 tracking-widest font-mono uppercase italic">Orchestration Active</span>
                    </div>
                    {sub?.token && (
                      <div className="flex flex-col gap-1">
                        <span className="text-[7px] text-white/20 tracking-widest uppercase font-bold">Node Token:</span>
                        <div className="flex items-center justify-between gap-2 bg-black/40 p-2 rounded border border-white/5">
                          <code className="text-[9px] text-emerald-400/80 font-mono truncate">{sub.token}</code>
                          <button 
                             onClick={() => {
                               navigator.clipboard.writeText(sub.token);
                               setMessage(`${plan.name} token copied.`);
                               setTimeout(() => setMessage(""), 2000);
                             }}
                             className="text-white/20 hover:text-emerald-400 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
