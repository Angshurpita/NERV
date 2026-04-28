import { NextResponse } from "next/server";
import crypto from "crypto";

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

    // FIX G011: Use timing-safe comparison to prevent timing attacks
    // Hash both the expected signature and received signature using sha256 to ensure exact same fixed length
    const expectedHash = crypto.createHash('sha256').update(expectedSignature).digest();
    const receivedHash = crypto.createHash('sha256').update(razorpay_signature).digest();

    const isAuthentic = crypto.timingSafeEqual(expectedHash, receivedHash);

    if (isAuthentic) {
      // FIX G007: In production, you should fetch the order from Razorpay's API
      // to verify the amount hasn't been tampered with:
      //   const order = await razorpay.orders.fetch(razorpay_order_id);
      //   if (order.amount !== expectedAmountFromDB) { reject }
      // For now, we return verified status with server-known data only
      return NextResponse.json({
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      return NextResponse.json(
        { verified: false, error: "Payment signature verification failed" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Razorpay verification failed:", error);
    return NextResponse.json(
      { verified: false, error: "Verification error" },
      { status: 500 }
    );
  }
}
