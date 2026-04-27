"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

// ✅ Plans (complete + stable)
const plans = [
  {
    id: "free",
    name: "Free Tier",
    price: "₹0",
    amount: 0,
    features: ["2 Rule scans/day", "5 AI scans total (monthly limit)"],
  },
  {
    id: "starter",
    name: "Starter Tier",
    price: "₹149",
    amount: 149,
    features: ["2 AI scans/day", "5 Rule scans/day"],
  },
  {
    id: "pro",
    name: "Pro Tier",
    price: "₹399",
    amount: 399,
    features: ["10 AI scans/day", "20 Rule scans/day"],
  },
  {
    id: "elite",
    name: "Elite Tier",
    price: "₹699",
    amount: 699,
    features: ["20 AI scans/day", "30 Rule scans/day"],
  },
  {
    id: "team black",
    name: "Team Black",
    price: "₹999",
    amount: 999,
    features: ["Unlimited access"],
  },
];

export default function Pricing() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement | null>(null);

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  // ✅ Create ONCE (important)
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);

    // ✅ Intersection observer (safe)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);

    // ✅ Fetch user + data
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        // profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(profileData);

        // subscriptions from DB
        const { data: dbSubs } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id);

        let merged: any[] = dbSubs || [];

        // ✅ Safe localStorage usage
        if (typeof window !== "undefined") {
          try {
            const saved = localStorage.getItem(`sub_${user.id}`);
            if (saved) {
              const parsed = JSON.parse(saved);
              const localSubs = Array.isArray(parsed) ? parsed : [parsed];

              localSubs.forEach((ls: any) => {
                if (
                  !merged.some(
                    (ds) =>
                      ds.plan?.toLowerCase() ===
                      ls.plan?.toLowerCase()
                  )
                ) {
                  merged.push(ls);
                }
              });
            }
          } catch (err) {
            console.error("LocalStorage parse error:", err);
          }
        }

        // ✅ Filter expired subs
        const now = new Date();
        const activeSubs = merged.filter((s) => {
          if (!s?.plan) return false;
          const isFree = s.plan.toLowerCase() === "free";
          return (
            isFree ||
            !s.expires_at ||
            new Date(s.expires_at) > now
          );
        });

        setSubscriptions(activeSubs);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();

    return () => {
      if (el) observer.unobserve(el);
      observer.disconnect();
    };
  }, []);

  // ✅ Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="py-20 px-6 bg-gray-50"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {plans.map((plan) => {
          const hasPaidPlan = subscriptions.some(
            (s) => s.plan?.toLowerCase() !== "free"
          );

          const isActive =
            subscriptions.some(
              (s) =>
                s.plan?.toLowerCase() === plan.id
            ) ||
            (!subscriptions.length &&
              profile?.plan?.toLowerCase() === plan.id) ||
            (!subscriptions.length &&
              !profile?.plan &&
              plan.id === "free");

          const finalActive =
            isActive &&
            !(plan.id === "free" && hasPaidPlan);

          return (
            <div
              key={plan.id}
              className={`p-4 border rounded-xl transition ${finalActive
                ? "border-blue-600 bg-blue-50"
                : "bg-white"
                }`}
            >
              <h3 className="text-sm font-bold mb-2">
                {plan.name}
              </h3>

              <p className="text-xl font-semibold mb-4">
                {plan.price}<span className="text-sm text-gray-500 font-normal">/month</span>
              </p>

              <ul className="mb-6 space-y-2 text-xs text-gray-600 min-h-[60px]">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                disabled={finalActive}
                onClick={() => {
                  router.push(
                    `/checkout?plan=${plan.id}&amount=${plan.amount}`
                  );
                }}
                className={`w-full py-2 rounded-md text-xs font-bold ${finalActive
                  ? "bg-blue-100 text-blue-600 cursor-default"
                  : "bg-black text-white hover:opacity-80"
                  }`}
              >
                {finalActive
                  ? "ACTIVE"
                  : plan.amount === 0
                    ? "CURRENT"
                    : "UPGRADE"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}