"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const plans = [
  {
    id: "free",
    name: "Free Plan",
    price: "$0",
    period: "/month",
    features: [
      "5 AI scans / month",
      "20 Rule Based Scans / Month",
      "Reports Generation"
    ],
    delay: "100ms",
    highlight: false
  },
  {
    id: "starter",
    name: "Starter Plan",
    price: "$2",
    period: "/month",
    features: [
      "2 AI scan / Day",
      "5 Rule Based Scans / Day",
      "Report Generation"
    ],
    delay: "200ms",
    highlight: false
  },
  {
    id: "pro",
    name: "Pro Plan",
    price: "$5",
    period: "/month",
    features: [
      "10 AI scans / Day",
      "20 Rule Based Scans / Day",
      "Report Generation"
    ],
    delay: "300ms",
    highlight: true
  },
  {
    id: "elite",
    name: "Elite Plan",
    price: "$10",
    period: "/month",
    features: [
      "20 AI scans / Day",
      "50 Rule Based Scans / Day",
      "Report Generation"
    ],
    delay: "400ms",
    highlight: false
  },
  {
    id: "team black",
    name: "Team Black",
    price: "$20",
    period: "/month",
    features: [
      "Unlimited AI Usage / Month",
      "Unlimited Rule based scans / Month",
      "Report Generation"
    ],
    delay: "500ms",
    highlight: false,
    special: true
  }
];

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscriptions] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    const fetchData = async () => {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      if (supabaseUser) {
        setUser(supabaseUser);
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", supabaseUser.id)
          .single();
        setProfile(profile);

        const saved = localStorage.getItem(`sub_${supabaseUser.id}`);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setSubscriptions(Array.isArray(parsed) ? parsed : [parsed]);
          } catch (e) {
            console.error("Failed to parse subscriptions", e);
          }
        }
      }
    };
    fetchData();

    return () => observer.disconnect();
  }, [supabase]);

  return (
    <section ref={sectionRef} id="pricing" className="relative py-32 md:py-40 px-6 overflow-hidden bg-black">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`mb-24 text-center transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-emerald-400/50"></div>
            <span className="text-[10px] tracking-[0.5em] text-emerald-400 uppercase font-bold">
              Access Tiers
            </span>
            <div className="w-8 h-px bg-emerald-400/50"></div>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white uppercase italic">
            Deployment <span className="text-emerald-400">Scales</span>
          </h2>
          <p className="text-white/40 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium">
            Select your operational capacity. From independent security research to 
            enterprise-grade multi-agent orchestration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {plans.map((plan) => {
            const hasPaidPlan = subscription.some(s => s.plan?.toLowerCase() !== "free");
            const isActive = mounted && (
              (subscription.some(s => s.plan?.toLowerCase() === plan.id)) || 
              (subscription.length === 0 && profile?.plan?.toLowerCase() === plan.id) ||
              (subscription.length === 0 && !profile?.plan && plan.id === "free")
            ) && !(plan.id === "free" && hasPaidPlan);

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-700 hover:scale-[1.02] ${
                  isActive
                    ? "bg-emerald-500/[0.05] border-emerald-500/50 shadow-[0_0_50px_-12px_rgba(52,211,153,0.2)]"
                    : plan.highlight 
                    ? "bg-emerald-400/[0.03] border-emerald-400/30 shadow-[0_0_50px_-12px_rgba(52,211,153,0.1)]" 
                    : plan.special
                    ? "bg-white/[0.02] border-white/20 shadow-[0_0_50px_-12px_rgba(255,255,255,0.05)]"
                    : "bg-[#080808] border-white/5"
                } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: plan.delay }}
              >
              {(plan.highlight || isActive) && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-black text-[8px] tracking-widest font-black uppercase rounded-full ${isActive ? 'bg-white' : 'bg-emerald-400'}`}>
                  {isActive ? 'Active Tier' : 'Recommended'}
                </div>
              )}
              {plan.special && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-black text-[8px] tracking-widest font-black uppercase rounded-full whitespace-nowrap">
                  Premium Tier
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xs tracking-[0.2em] uppercase font-bold mb-6 ${plan.highlight ? "text-emerald-400" : "text-white/40"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tighter text-white">{plan.price}</span>
                  <span className="text-[10px] text-white/20 tracking-widest uppercase font-bold">{plan.period}</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className={`mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full ${plan.highlight ? "bg-emerald-400" : "bg-white/20"}`}></div>
                    <span className="text-[11px] leading-tight text-white/50 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={isActive}
                onClick={() => {
                  const amount = plan.price.replace('$', '');
                  router.push(`/checkout?plan=${plan.id}&amount=${amount}`);
                }}
                className={`w-full py-4 rounded-xl text-[10px] tracking-[0.2em] font-black uppercase transition-all duration-300 ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                    : plan.highlight
                    ? "bg-emerald-400 text-black hover:bg-white"
                    : plan.special
                    ? "bg-white text-black hover:bg-emerald-400"
                    : "bg-white/5 text-white/60 border border-white/10 hover:bg-white hover:text-black hover:border-white"
                }`}
              >
                {isActive ? "Deployed" : (plan.price === "$0" ? "Current Tier" : "Upgrade")}
              </button>
            </div>
              );
          })}
        </div>

        <div className={`mt-20 text-center transition-all duration-1000 delay-700 ${visible ? "opacity-100" : "opacity-0"}`}>
          <p className="text-[10px] tracking-[0.2em] text-white/20 uppercase font-bold mb-4">
            Custom operational requirements?
          </p>
          <a href="mailto:angshuganguly111@gmail.com" className="text-xs text-emerald-400/60 hover:text-emerald-400 underline underline-offset-8 transition-colors">
            Contact Mission Command
          </a>
        </div>
      </div>
    </section>
  );
}
