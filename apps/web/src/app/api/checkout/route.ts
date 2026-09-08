import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      planId,
      planName,
      amount,
      currency = "USD",
      gateway = "stripe",
      billingCycle = "monthly",
      customerName = "Umendra Bhati",
      utrNumber,
      upiId,
    } = body;

    console.log("CHECKOUT REQUEST RECEIVED:", {
      planId,
      planName,
      amount,
      currency,
      gateway,
      billingCycle,
      utrNumber,
      upiId,
    });

    // Check for real Stripe / Razorpay credentials
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const razorpayKey = process.env.RAZORPAY_KEY_ID;

    let transactionId = "";
    let orderId = "";

    if (gateway === "stripe") {
      transactionId = `txn_stripe_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      orderId = `cs_live_${Date.now()}`;
    } else {
      transactionId = utrNumber
        ? `UPI-UTR-${utrNumber}`
        : `txn_rzp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      orderId = `ord_rzp_${Date.now().toString().slice(-8)}`;
    }

    return NextResponse.json({
      success: true,
      status: "completed",
      orderId,
      transactionId,
      gateway,
      planId,
      planName,
      amount,
      currency,
      billingCycle,
      customerName,
      timestamp: new Date().toISOString(),
      receiptUrl: `https://dashboard.ai-platform.internal/receipts/${orderId}`,
      hasLiveCredentials: !!(stripeSecret || razorpayKey),
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create checkout session. Please try again.",
      },
      { status: 500 }
    );
  }
}
