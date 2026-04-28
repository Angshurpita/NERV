import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Server-side expected amounts in paise per plan (source of truth)
const PLAN_AMOUNTS: Record<string, number> = {
  STARTER: 49900,   // ₹499
  PRO: 149900,      // ₹1499
  ELITE: 499900,    // ₹4999
  "TEAM BLACK": 999900, // ₹9999
};

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { verified: false, error: "Missing required payment fields" },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("RAZORPAY_KEY_SECRET is not configured");
      return NextResponse.json(
        { verified: false, error: "Payment verification unavailable" },
        { status: 500 }
      );
    }

    // Verify signature using HMAC SHA256
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    // FIX G009: SHA256 HMAC hex signatures are always exactly 64 characters.
    // Reject early if length doesn't match to prevent buffer-length leaks.
    if (razorpay_signature.length !== 64) {
      return NextResponse.json(
        { verified: false, error: "Invalid signature format" },
        { status: 400 }
      );
    }

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const receivedBuffer = Buffer.from(razorpay_signature, "utf8");
    const isAuthentic = crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!isAuthentic) {
      return NextResponse.json(
        { verified: false, error: "Payment signature verification failed" },
        { status: 400 }
      );
    }

    // FIX G002: Fetch the order from Razorpay to verify the amount hasn't been tampered with.
    // The order notes contain the plan name set during order creation.
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const plan = (order.notes as Record<string, string>)?.plan?.toUpperCase();
    const expectedAmount = plan ? PLAN_AMOUNTS[plan] : undefined;

    if (!expectedAmount || order.amount !== expectedAmount) {
      console.error(`Amount mismatch: order=${order.amount}, expected=${expectedAmount}, plan=${plan}`);
      return NextResponse.json(
        { verified: false, error: "Order amount verification failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error: any) {
    console.error("Razorpay verification failed:", error);
    return NextResponse.json(
      { verified: false, error: "Verification error" },
      { status: 500 }
    );
  }
}
