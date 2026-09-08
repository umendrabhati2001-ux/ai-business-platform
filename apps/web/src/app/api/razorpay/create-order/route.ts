import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, planId, planName, customerName } = body;

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Razorpay API Keys are missing on the server. Please provide the Key ID and Key Secret.",
        },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const parsedAmount = Math.max(100, Math.round(Number(amount) * 100)); // amount in paise (minimum 100 paise = ₹1)

    const order = await razorpay.orders.create({
      amount: parsedAmount,
      currency: "INR",
      receipt: `rcpt_${Date.now().toString().slice(-8)}`,
      notes: {
        planId: planId || "starter",
        planName: planName || "Starter Plan",
        customerName: customerName || "Umendra Bhati",
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.error?.description || error?.message || "Failed to create Razorpay order",
      },
      { status: 500 }
    );
  }
}
