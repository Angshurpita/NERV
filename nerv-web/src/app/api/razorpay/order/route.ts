import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/utils/supabase/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// FIX G002-ORDER: Server-side canonical prices in paise — client NEVER sets the amount.
// This is the single source of truth. The verify route uses the same map.
const PLAN_AMOUNTS: Record<string, number> = {
  STARTER:    49900,   // ₹499
  PRO:       149900,   // ₹1499
  ELITE:     499900,   // ₹4999
  "TEAM BLACK": 999900, // ₹9999
};

// FIX G008-ORDER: IP-based rate limiter — max 10 order attempts per minute per IP
const orderRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const ORDER_RATE_WINDOW_MS = 60_000;
const ORDER_RATE_MAX = 10;

function isOrderRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = orderRateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    orderRateLimitMap.set(ip, { count: 1, resetTime: now + ORDER_RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > ORDER_RATE_MAX;
}

export async function POST(req: Request) {
  try {
    // Rate-limit by IP before any processing
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isOrderRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many order requests. Please try again later." },
        { status: 429 }
      );
    }

    // FIX G013: Extract user identity from the validated Supabase session
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { plan } = await req.json();

    // Validate plan and look up the canonical server-side amount.
    // The client NEVER controls the price — only the plan name.
    const normalizedPlan = String(plan || "").toUpperCase();
    const amountInPaise = PLAN_AMOUNTS[normalizedPlan];

    if (!amountInPaise) {
      return NextResponse.json(
        { error: "Invalid or unsupported plan" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `nerv_${normalizedPlan.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
      notes: {
        plan: normalizedPlan,
        email: user.email || "unknown", // Verified from Supabase session
        user_id: user.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,   // Echo server-computed amount back
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
