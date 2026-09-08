"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
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
  Copy,
  ExternalLink,
  Download,
  FileText,
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
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Card Form state (Stripe)
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");
  const [cardName, setCardName] = useState("Umendra Bhati");

  // UPI Form state (Razorpay)
  const [upiId, setUpiId] = useState("umendrabhati722@ptaxis");
  const [isTestMode, setIsTestMode] = useState(true);
  const [showQr, setShowQr] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [utrNumber, setUtrNumber] = useState<string>("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [paymentError, setPaymentError] = useState<string>("");

  // Load Razorpay Standard Checkout SDK
  useEffect(() => {
    if (typeof window !== "undefined" && !document.getElementById("razorpay-sdk")) {
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Compute actual price and live test mode amount
  const planAmount = plan
    ? plan.billingCycle === "yearly"
      ? Math.round(plan.priceInr * 0.8)
      : plan.priceInr
    : 2499;

  const effectiveAmount = isTestMode ? 1 : planAmount;
  const cleanUpi = (upiId || "umendrabhati722@ptaxis").trim();
  const formattedAmount = Number(effectiveAmount).toFixed(2);
  const cleanNote = isTestMode ? "TestDeposit" : "Subscription";

  // Strict NPCI/BHIM Compliant UPI URI
  const upiUrl = plan
    ? `upi://pay?pa=${cleanUpi}&pn=Umendra%20Bhati&am=${formattedAmount}&cu=INR&tn=${cleanNote}`
    : "";

  // Generate real standard ISO/IEC 18004 UPI QR Code in real time
  useEffect(() => {
    if (gateway === "razorpay" && upiUrl) {
      QRCode.toDataURL(upiUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: "#0a0f1d",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("UPI QR Generation Error:", err));
    }
  }, [upiUrl, gateway]);

  if (!isOpen || !plan) return null;

  const planDisplayPrice =
    currency === "USD"
      ? `$${plan.billingCycle === "yearly" ? Math.round(plan.priceUsd * 0.8) : plan.priceUsd}`
      : `₹${plan.billingCycle === "yearly" ? Math.round(plan.priceInr * 0.8).toLocaleString("en-IN") : plan.priceInr.toLocaleString("en-IN")}`;

  const currentDisplayPrice =
    gateway === "razorpay" && isTestMode ? "₹1" : planDisplayPrice;

  const handleProcessPayment = async () => {
    setPaymentError("");

    // Strict validation: UPI QR payment MUST have 12-digit UTR
    if (gateway === "razorpay") {
      const cleanUtr = utrNumber.trim();
      if (!cleanUtr) {
        setPaymentError(
          "⚠️ Pehle apne phone se QR scan karke pay kijiye, fir receipt se 12-digit UTR number yahan daal kar activate kijiye!"
        );
        return;
      }
      if (cleanUtr.length !== 12 || !/^\d{12}$/.test(cleanUtr)) {
        setPaymentError(
          "⚠️ Galat UTR number! Bank UTR hamesha 12 digits ka number hota hai (jaise: 424109823145) jo aapke BHIM/PhonePe/GPay receipt me aata hai."
        );
        return;
      }
    }

    playClickSound();
    setIsProcessing(true);

    try {
      const actualAmount =
        currency === "USD" ? plan.priceUsd : isTestMode ? 1 : plan.priceInr;

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          planName: plan.name,
          amount: actualAmount,
          currency,
          gateway,
          billingCycle: plan.billingCycle,
          customerName: cardName || "Umendra Bhati",
          utrNumber: utrNumber.trim(),
          upiId: cleanUpi,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setPaymentError(data.error || "Payment verification failed.");
        setIsProcessing(false);
        return;
      }

      // Bank verification & invoice generation
      setTimeout(() => {
        setIsProcessing(false);
        setIsCompleted(true);
        playSuccessSound();

        const orderInfo = {
          id: plan.id,
          name: plan.name,
          currency,
          activatedAt: new Date().toISOString(),
          gateway,
          orderId: data.orderId || `ORD_${Date.now().toString().slice(-8)}`,
          transactionId:
            data.transactionId || (utrNumber ? `UPI-${utrNumber}` : `TXN_${Date.now()}`),
          amount: currentDisplayPrice,
        };
        setCompletedOrder(orderInfo);

        // Persist active subscription plan in browser
        if (typeof window !== "undefined") {
          localStorage.setItem("active_subscription_plan", JSON.stringify(orderInfo));
        }
      }, 1200);
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentError("Network or server error verifying transaction.");
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
                {planDisplayPrice}
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
          {isCompleted && completedOrder ? (
            <div className="py-2 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="text-center space-y-1">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-bold text-white">Payment Verified & Subscription Active!</h3>
                <p className="text-xs text-slate-400">
                  Welcome to <strong>{plan.name}</strong>. All autonomous AI channels are fully unlocked!
                </p>
              </div>

              {/* TAX INVOICE CARD */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-4 text-xs font-mono space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Invoice No:</span>
                  <span className="font-bold text-cyan-400">{completedOrder.orderId}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Transaction ID:</span>
                  <span className="text-emerald-400">{completedOrder.transactionId}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Plan & Billing:</span>
                  <span className="text-white">{plan.name} ({plan.billingCycle})</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Total Paid:</span>
                  <span className="font-bold text-emerald-400 text-sm">{completedOrder.amount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                    <ShieldCheck size={13} /> 100% Verified & Live
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") window.print();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
                >
                  <Download size={14} />
                  Print / Save Invoice
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSuccess(plan.id, plan.name);
                    setIsCompleted(false);
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 hover:brightness-110 transition"
                >
                  Go to Dashboard
                </button>
              </div>
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
                  {/* LIVE ₹1 TEST vs FULL PLAN TOGGLE */}
                  <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-1 grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsTestMode(true);
                        playClickSound();
                      }}
                      className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition ${
                        isTestMode
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Zap size={13} className={isTestMode ? "fill-white" : ""} />
                      <span>🧪 Live ₹1 Test Deposit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsTestMode(false);
                        playClickSound();
                      }}
                      className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition ${
                        !isTestMode
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>⚡ Full Plan ({planDisplayPrice})</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Virtual Payment Address (UPI ID)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. umendrabhati722@ptaxis"
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs font-mono text-cyan-300 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Direct Deposit to: <strong className="text-emerald-400">Umendra Bhati</strong> (7850051826 / Axis Bank UPI)
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
                    <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-4 text-center animate-in fade-in duration-200 shadow-xl shadow-cyan-500/10">
                      <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-2xl bg-white p-3 shadow-inner ring-4 ring-cyan-500/20">
                        {qrDataUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={qrDataUrl}
                            alt="Real Scannable NPCI UPI QR Code"
                            className="h-full w-full object-contain rounded-lg"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-slate-700 font-mono animate-pulse">
                            Generating Standard UPI QR...
                          </div>
                        )}
                      </div>

                      <div className="mt-3 space-y-1">
                        <p className="text-xs font-bold text-white font-mono">
                          Scan with any UPI App • {currentDisplayPrice} {isTestMode && "(Live Test Deposit)"}
                        </p>
                        <p className="text-[11px] text-cyan-400 font-medium">
                          Payee: Umendra Bhati • UPI: {cleanUpi}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          100% Real NPCI QR: Scannable via PhonePe, GPay, Paytm, BHIM, Cred
                        </p>
                      </div>

                      {/* QUICK MOBILE UPI APP DEEP-LINK & COPY */}
                      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                        <a
                          href={upiUrl}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                          title="Open payment screen directly in your mobile UPI app"
                        >
                          <ExternalLink size={12} />
                          Open in UPI App
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            if (typeof navigator !== "undefined") {
                              navigator.clipboard.writeText(cleanUpi);
                              setCopiedUpi(true);
                              setTimeout(() => setCopiedUpi(false), 2000);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition"
                        >
                          <Copy size={12} />
                          {copiedUpi ? "✓ UPI ID Copied!" : "Copy UPI ID"}
                        </button>
                      </div>

                      {/* UTR TRANSACTION CONFIRMATION INPUT */}
                      <div className="mt-3 pt-3 border-t border-white/10 text-left">
                        <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                          After Payment: Enter 12-Digit UTR / Ref No. (From BHIM/GPay/PhonePe):
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={utrNumber}
                            onChange={(e) => {
                              setPaymentError("");
                              setUtrNumber(e.target.value.replace(/[^\d]/g, "").slice(0, 12));
                            }}
                            placeholder="e.g. 424109823145"
                            className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs font-mono text-cyan-300 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                          />
                          <span className="absolute right-3 top-2.5 text-[10px] font-mono text-slate-500">
                            {utrNumber.length}/12
                          </span>
                        </div>
                        <p className="text-[10px] mt-1.5 transition">
                          {utrNumber.length === 12 ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 size={12} /> 12-digit UTR ready! Click &quot;Verify & Activate&quot; below.
                            </span>
                          ) : (
                            <span className="text-amber-400/90 flex items-center gap-1">
                              <AlertCircle size={12} /> Pehle QR scan karke pay karein aur receipt se 12-digit UTR yahan dalein tabhi activate hoga.
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PAYMENT ERROR BANNER */}
              {paymentError && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300 flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 text-red-400 mt-0.5" />
                  <span>{paymentError}</span>
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
              disabled={
                isProcessing ||
                (gateway === "razorpay" && utrNumber.trim().length !== 12)
              }
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap size={14} className={isProcessing ? "animate-spin" : "fill-white"} />
              {isProcessing
                ? "Verifying Bank UTR..."
                : gateway === "razorpay" && utrNumber.trim().length !== 12
                ? `🔒 Enter 12-Digit UTR to Activate`
                : `⚡ Verify ${currentDisplayPrice} & Activate`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
