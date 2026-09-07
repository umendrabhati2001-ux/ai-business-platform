"use client";

import { useState } from "react";
import {
  X,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  ArrowRight,
  IndianRupee,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { playClickSound, playSuccessSound } from "@/app/utils/soundEffects";

export type PlanDetails = {
  id: string;
  name: string;
  priceUsd: number;
  priceInr: number;
  billingCycle: "monthly" | "yearly";
  features: string[];
};

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanDetails | null;
  currency: "USD" | "INR";
  onSuccess: (planId: string, planName: string) => void;
};

export default function PaymentModal({
  isOpen,
  onClose,
  plan,
  currency,
  onSuccess,
}: PaymentModalProps) {
  const [gateway, setGateway] = useState<"stripe" | "razorpay">(
    currency === "INR" ? "razorpay" : "stripe"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Card Form state (Stripe)
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");
  const [cardName, setCardName] = useState("Umendra Bhati");

  // UPI Form state (Razorpay)
  const [upiId, setUpiId] = useState("umendra@upi");
  const [showQr, setShowQr] = useState(false);

  if (!isOpen || !plan) return null;

  const displayPrice =
    currency === "USD"
      ? `$${plan.billingCycle === "yearly" ? Math.round(plan.priceUsd * 0.8) : plan.priceUsd}`
      : `₹${plan.billingCycle === "yearly" ? Math.round(plan.priceInr * 0.8).toLocaleString("en-IN") : plan.priceInr.toLocaleString("en-IN")}`;

  const handleProcessPayment = async () => {
    playClickSound();
    setIsProcessing(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          planName: plan.name,
          amount: currency === "USD" ? plan.priceUsd : plan.priceInr,
          currency,
          gateway,
          billingCycle: plan.billingCycle,
          customerName: cardName,
        }),
      });

      const data = await response.json();

      // Simulate realistic bank settlement delay (1.5s)
      setTimeout(() => {
        setIsProcessing(false);
        setIsCompleted(true);
        playSuccessSound();

        // Persist active subscription plan
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "active_subscription_plan",
            JSON.stringify({
              id: plan.id,
              name: plan.name,
              currency,
              activatedAt: new Date().toISOString(),
              gateway,
              orderId: data.orderId || `ord_${Date.now()}`,
            })
          );
        }

        setTimeout(() => {
          onSuccess(plan.id, plan.name);
          setIsCompleted(false);
          onClose();
        }, 1800);
      }, 1500);
    } catch (err) {
      console.error("Payment error:", err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-cyan-500/40 bg-slate-950 shadow-2xl shadow-cyan-500/20">
        
        {/* MODAL HEADER */}
        <div className="relative border-b border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 rounded-full bg-slate-800/80 p-1.5 text-slate-400 hover:text-white transition"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
            <Sparkles size={14} />
            Secure Enterprise Checkout
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
              <p className="text-xs text-slate-400 capitalize">
                Billed {plan.billingCycle} • Cancel anytime
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-cyan-400">
                {displayPrice}
              </span>
              <span className="text-xs text-slate-400">
                /{plan.billingCycle === "yearly" ? "mo" : "mo"}
              </span>
            </div>
          </div>

          {/* GATEWAY TABS */}
          <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-slate-900/90 p-1">
            <button
              type="button"
              onClick={() => {
                setGateway("stripe");
                playClickSound();
              }}
              className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition ${
                gateway === "stripe"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <CreditCard size={14} />
              <span>Stripe (Global Cards)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setGateway("razorpay");
                playClickSound();
              }}
              className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition ${
                gateway === "razorpay"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-cyan-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <QrCode size={14} />
              <span>Razorpay (UPI / Cards)</span>
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-4">
          {isCompleted ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-300">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Your subscription to <strong>{plan.name}</strong> is now live! All enterprise calling channels and AI features are fully unlocked.
              </p>
            </div>
          ) : (
            <>
              {/* STRIPE CARD FORM */}
              {gateway === "stripe" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 pl-9 text-xs font-mono text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                      <CreditCard
                        size={14}
                        className="absolute left-3 top-2.5 text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        value={cardCvc}
                        maxLength={4}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* RAZORPAY UPI / QR FORM */}
              {gateway === "razorpay" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Virtual Payment Address (UPI ID)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@paytm or name@okaxis"
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Supported: Google Pay, PhonePe, Paytm, BHIM, Amazon Pay
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <QrCode size={20} className="text-cyan-400" />
                      <div>
                        <p className="text-xs font-semibold text-white">Scan UPI QR Code</p>
                        <p className="text-[10px] text-slate-400">Instant camera scan checkout</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowQr(!showQr)}
                      className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-300 hover:bg-cyan-500/20"
                    >
                      {showQr ? "Hide QR" : "Show QR"}
                    </button>
                  </div>

                  {showQr && (
                    <div className="rounded-xl border border-cyan-500/30 bg-slate-900 p-4 text-center animate-in fade-in duration-200">
                      <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-xl bg-white p-2">
                        <div className="grid grid-cols-6 gap-1 h-full w-full bg-slate-950 p-2 rounded">
                          {[...Array(36)].map((_, i) => (
                            <div
                              key={i}
                              className={`rounded-xs ${
                                (i % 2 === 0 && i % 3 !== 0) || i < 8 || i > 28
                                  ? "bg-cyan-400"
                                  : "bg-transparent"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300 font-mono mt-2">
                        Scan with any UPI App • {displayPrice}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* SECURITY & GUARANTEE BADGE */}
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/40 px-3.5 py-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Lock size={12} className="text-emerald-400" />
                  256-bit TLS Encrypted
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-cyan-400" />
                  14-Day Money Back Guarantee
                </span>
              </div>
            </>
          )}
        </div>

        {/* MODAL FOOTER */}
        {!isCompleted && (
          <div className="border-t border-white/10 bg-slate-900/90 p-5 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              <Zap size={14} className={isProcessing ? "animate-spin" : "fill-white"} />
              {isProcessing ? "Authorizing Payment..." : `⚡ Pay ${displayPrice} & Activate`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
