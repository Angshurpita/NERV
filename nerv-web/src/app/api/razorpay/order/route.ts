import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/utils/supabase/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    // FIX G013: Extract user identity from the validated Supabase session,
    // never trust email from the request body for identity purposes
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { amount, plan } = await req.json();

    // Validate amount is a positive number
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Validate plan is one of the allowed values
    const allowedPlans = ['FREE', 'STARTER', 'PRO', 'ELITE', 'TEAM BLACK'];
    const normalizedPlan = String(plan || '').toUpperCase();
    if (!allowedPlans.includes(normalizedPlan)) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    // Amount is in INR — Razorpay expects paise (smallest currency unit)
    const amountInPaise = Math.round(parsedAmount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `nerv_${normalizedPlan.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
      notes: {
        plan: normalizedPlan,
        email: user.email || "unknown", // Use verified email from session
        user_id: user.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
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
