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
    <section ref={sectionRef} id="pricing" className="relative py-32 md:py-48 px-6 overflow-hidden bg-gray-50">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-mesh opacity-40"></div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`mb-24 text-center transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-[10px] tracking-[0.4em] text-blue-500 uppercase font-semibold">
              Deployment Scale
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
            Node <span className="text-blue-600">Access</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium">
            Select your operative tier and initialize the orchestration pipeline. 
            Flexible access for individuals and secure scale for enterprises.
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
                className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-700 bg-white shadow-premium hover:border-blue-600/20 ${
                  isActive
                    ? "ring-2 ring-blue-600 ring-offset-4 ring-offset-gray-50 shadow-lg shadow-blue-600/10"
                    : "border-black/5"
                } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: plan.delay }}
              >
              {(plan.highlight || isActive) && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-white text-[8px] tracking-widest font-bold uppercase rounded-full shadow-lg ${isActive ? 'bg-blue-700' : 'bg-blue-600'}`}>
                  {isActive ? 'Active Node' : 'Recommended'}
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-[10px] tracking-[0.2em] uppercase font-bold mb-6 ${plan.highlight ? "text-blue-600" : "text-gray-400"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">{plan.price}</span>
                  <span className="text-[10px] text-gray-400 tracking-widest uppercase font-bold">{plan.period}</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className={`mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full ${plan.highlight ? "bg-blue-600" : "bg-gray-200"}`}></div>
                    <span className="text-[11px] leading-tight text-gray-600 font-bold">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={isActive}
                onClick={() => {
                  const amount = plan.price.replace('$', '');
                  router.push(`/checkout?plan=${plan.id}&amount=${amount}`);
                }}
                className={`w-full py-4 rounded-xl text-[10px] tracking-[0.2em] font-bold uppercase transition-all duration-500 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border border-blue-100 cursor-default"
                    : plan.highlight
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                    : "bg-gray-50 text-gray-900 border border-black/5 hover:bg-gray-100"
                }`}
              >
                {isActive ? "ACTIVE" : (plan.price === "$0" ? "CURRENT" : "UPGRADE")}
              </button>
            </div>
              );
          })}
        </div>

        <div className={`mt-24 text-center transition-all duration-1000 delay-700 ${visible ? "opacity-100" : "opacity-0"}`}>
          <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-bold mb-4">
            Custom operational requirements?
          </p>
          <a href="mailto:angshuganguly111@gmail.com" className="text-xs text-blue-600 font-bold hover:text-blue-700 transition-colors">
            Contact Support →
          </a>
        </div>
      </div>
    </section>
  );
}
