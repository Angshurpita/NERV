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
  dbSubscriptions = [],
}: {
  user: User;
  initialProfile: Profile | null;
  dbSubscriptions?: any[];
}) {
  const [fullName, setFullName] = useState(initialProfile?.full_name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [subscriptions, setSubscriptions] = useState<any[]>(dbSubscriptions);
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const localSaved = localStorage.getItem(`sub_${user.id}`);
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved);
        const localSubs = Array.isArray(parsed) ? parsed : [parsed];
        
        // Merge DB and Local, prioritizing uniqueness by plan
        const merged = [...dbSubscriptions];
        localSubs.forEach(ls => {
          if (!merged.some(ds => ds.plan.toUpperCase() === ls.plan.toUpperCase())) {
            merged.push(ls);
          }
        });
        setSubscriptions(merged);
      } catch (e) {
        console.error("Failed to parse local subscriptions", e);
      }
    }
  }, [user.id, dbSubscriptions]);

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
      <div className="bg-white border border-black/5 p-10 rounded-3xl relative overflow-hidden group shadow-premium">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/[0.03] blur-[120px] pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 relative z-10">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-2xl border border-blue-100 p-1.5 relative bg-gray-50">
              <div className="w-full h-full bg-blue-600/5 rounded-xl flex items-center justify-center text-blue-600 font-bold text-2xl tracking-tighter">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-3">
                {fullName || "Anonymous Operator"}
              </h1>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-400 tracking-[0.3em] uppercase font-bold">Rank:</span>
                  <span className="text-[10px] text-blue-600 font-bold tracking-[0.3em] uppercase italic">
                    {hasPaidPlan ? (activePaidSubs.length > 2 ? "COMMANDER" : "OPERATOR") : "CANDIDATE"}
                  </span>
                </div>
                <div className="flex items-center gap-3 border-l border-black/5 pl-6">
                  <span className="text-[10px] text-gray-400 tracking-[0.3em] uppercase font-bold">ID:</span>
                  <span className="text-[11px] text-gray-400 font-mono tracking-tight">{user.id.substring(0, 12).toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-3 border-l border-black/5 pl-6">
                  <span className="text-[10px] text-gray-400 tracking-[0.3em] uppercase font-bold">Status:</span>
                  <span className="text-[10px] text-blue-600/80 font-bold tracking-[0.3em] uppercase">
                    Clearance Lv. {hasPaidPlan ? activePaidSubs.length + 1 : 1}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col gap-4">
             <label className="text-[9px] text-gray-400 tracking-[0.4em] uppercase font-black">
                Assigned Access Keys
              </label>
              <div className="flex items-center gap-4">
                <div className="flex flex-wrap gap-3 max-w-md">
                  {mounted && (displaySubs.length > 0) ? (
                    displaySubs.map((sub, idx) => (
                      <div 
                        key={idx}
                        className="px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-xl font-mono text-[11px] text-blue-600 group/token cursor-pointer flex items-center gap-3 transition-all duration-300 hover:bg-blue-100/50"
                        onClick={() => {
                          navigator.clipboard.writeText(sub.token);
                          setMessage(`Token for ${sub.plan} copied.`);
                          setTimeout(() => setMessage(""), 2000);
                        }}
                      >
                        <span className="opacity-40 font-bold tracking-tighter uppercase">{sub.plan.substring(0, 2)}:</span>
                        {sub.token}
                      </div>
                    ))
                  ) : (
                    <div className="px-5 py-3 bg-gray-50 border border-black/5 rounded-xl font-mono text-[11px] text-gray-400 italic">
                      NV-PENDING-UNASSIGNED
                    </div>
                  )}
                </div>
              </div>
              {message && <p className="text-[10px] text-blue-500/60 tracking-[0.2em] uppercase font-bold animate-fade-in">{message}</p>}
          </div>
        </div>
      </div>

      {/* Access Section: All Active Plans */}
      <div className="space-y-8">
        <div className="flex items-center gap-6 border-b border-black/5 pb-6">
          <h2 className="text-[11px] font-black tracking-[0.4em] uppercase text-gray-400">
            System Access Control
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-100 to-transparent"></div>
          <span className="text-[10px] text-gray-300 tracking-[0.2em] uppercase font-medium italic">Active Node Orchestration</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { id: "free", name: "Free Tier", limit: "5 Scans / Mo", color: "border-white/10" },
            { id: "starter", name: "Starter Tier", limit: "2 Scans / Day", color: "border-blue-500/10" },
            { id: "pro", name: "Pro Tier", limit: "10 Scans / Day", color: "border-indigo-500/10" },
            { id: "elite", name: "Elite Tier", limit: "20 Scans / Day", color: "border-blue-600/10" },
            { id: "team black", name: "Team Black", limit: "Unlimited", color: "border-red-500/10", special: true },
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
                className={`relative p-8 border rounded-3xl transition-all duration-500 group overflow-hidden ${
                  isActive 
                    ? `bg-blue-50 border-blue-200 shadow-premium` 
                    : 'bg-white border-black/5 opacity-60 hover:opacity-100 hover:border-gray-200 hover:shadow-premium'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 right-0 px-3 py-1.5 bg-blue-500 text-white text-[9px] font-black tracking-[0.3em] uppercase rounded-bl-xl shadow-lg shadow-blue-500/20">
                    ACTIVE
                  </div>
                )}
                
                <h3 className={`text-[11px] font-black tracking-[0.3em] uppercase mb-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                  {plan.name}
                </h3>
                
                <p className="text-[13px] font-medium text-gray-500 mb-8 leading-relaxed">
                  {plan.limit}
                </p>

                <button
                  disabled={isActive}
                  onClick={() => window.location.href = "/access"}
                  className={`w-full py-3.5 rounded-xl text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-500 ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-600/60 cursor-default border border-blue-600/20 shadow-inner'
                      : 'bg-gray-900 text-white hover:bg-black hover:shadow-premium'
                  }`}
                >
                  {isActive ? "DEPLOYED" : "INITIATE"}
                </button>

                {isActive && (
                  <div className="mt-6 pt-6 border-t border-blue-600/10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse shadow-lg shadow-blue-600/30"></div>
                      <span className="text-[9px] text-blue-600/60 tracking-[0.2em] font-bold uppercase italic">Sync Active</span>
                    </div>
                    {sub?.token && (
                      <div className="flex flex-col gap-2">
                        <span className="text-[8px] text-gray-400 tracking-[0.3em] uppercase font-bold">Node Token</span>
                        <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-blue-100">
                          <code className="text-[10px] text-blue-600 font-mono truncate">{sub.token}</code>
                          <button 
                             onClick={() => {
                               navigator.clipboard.writeText(sub.token);
                               setMessage(`${plan.name} token copied.`);
                               setTimeout(() => setMessage(""), 2000);
                             }}
                             className="text-gray-300 hover:text-blue-600 transition-all duration-300"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
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
