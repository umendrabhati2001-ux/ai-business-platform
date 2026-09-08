import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      planName,
      amount,
    } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return NextResponse.json(
        { success: false, error: "Razorpay Secret Key not configured on server" },
        { status: 500 }
      );
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Razorpay payment proof details (order_id, payment_id, or signature).",
        },
        { status: 400 }
      );
    }

    // Official Razorpay Cryptographic Verification:
    // generated_signature = hmac_sha256(order_id + "|" + payment_id, secret)
    const signPayload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(signPayload)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      console.error("Razorpay signature verification failed!", {
        expectedSignature,
        receivedSignature: razorpay_signature,
      });
      return NextResponse.json(
        {
          success: false,
          error: "Security Check Failed: Cryptographic signature mismatch. Payment not verified.",
        },
        { status: 400 }
      );
    }

    // 100% Cryptographically verified by bank gateway!
    return NextResponse.json({
      success: true,
      verified: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      planId,
      planName,
      amount,
      timestamp: new Date().toISOString(),
      message: "Payment successfully verified by Razorpay bank gateway!",
    });
  } catch (error: any) {
    console.error("Verification route error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error during verification" },
      { status: 500 }
    );
  }
}
