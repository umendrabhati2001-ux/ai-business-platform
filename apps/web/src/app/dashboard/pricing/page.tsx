"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import PaymentModal, { PlanDetails } from "@/components/dashboard/PaymentModal";
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  Zap,
  Shield,
  Clock,
  Phone,
  Workflow,
  Mail,
  HelpCircle,
  Crown,
  Rocket,
  Check,
} from "lucide-react";
import { playClickSound, playSuccessSound } from "@/app/utils/soundEffects";

const PLANS: PlanDetails[] = [
  {
    id: "starter",
    name: "Starter AI",
    priceUsd: 29,
    priceInr: 2499,
    billingCycle: "monthly",
    features: [
      "100 Outbound AI Voice Calls / month",
      "Indian & US Accent Voices",
      "Standard Salesforce CRM Sync",
      "Lead Capture & Qualification",
      "Community & Discord Support",
    ],
  },
  {
    id: "growth_pro",
    name: "Growth Pro",
    priceUsd: 79,
    priceInr: 6499,
    billingCycle: "monthly",
    features: [
      "500 Outbound AI Voice Calls / month",
      "All 3 Accents: Indian, JARVIS & US Exec",
      "Call Intelligence & Waveform Analyzer",
      "1-Click Direct AI Email Shooter",
      "Autonomous Lead Workflow Builder",
      "Instant WhatsApp Summary Dispatches",
      "Priority API & Webhook Bandwidth",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Autonomous",
    priceUsd: 199,
    priceInr: 15999,
    billingCycle: "monthly",
    features: [
      "Unlimited Autonomous AI Voice Calls",
      "Custom Voice Clone Fine-Tuning",
      "Direct Telecom Cellular & Twilio Bridge",
      "Custom Salesforce Apex & Flow Automation",
      "Multi-Seat Agency Team Access",
      "Dedicated 24/7 Slack Channel & 99.9% SLA",
    ],
  },
];

export default function PricingPage() {
  const [currency, setCurrency] = useState<"USD" | "INR">("INR");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string>("growth_pro");
  const [toastMessage, setToastMessage] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("active_subscription_plan");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.id) setActivePlanId(parsed.id);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const handleOpenCheckout = (plan: PlanDetails) => {
    playClickSound();
    setSelectedPlan({ ...plan, billingCycle });
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (planId: string, planName: string) => {
    setActivePlanId(planId);
    setToastMessage(`🎉 Congratulations! You are now subscribed to ${planName}.`);
    playSuccessSound();
    setTimeout(() => setToastMessage(""), 5000);
  };

  return (
    <main className="relative flex min-h-screen bg-[#020617] text-white">
      <AnimatedBackground />
      <Sidebar />

      <div className="relative z-10 flex flex-1 flex-col overflow-x-hidden">
        <Topbar />

        <div className="flex-1 p-6 lg:p-10 max-w-6xl mx-auto w-full">
          
          {/* TOAST MESSAGE */}
          {toastMessage && (
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-sm font-semibold text-emerald-300 shadow-lg shadow-emerald-500/20 animate-in slide-in-from-top-4 duration-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={18} />
                {toastMessage}
              </span>
              <button
                type="button"
                onClick={() => setToastMessage("")}
                className="text-xs text-emerald-400 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* PAGE HEADER */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
              <Sparkles size={14} />
              Flexible Enterprise Plans
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Predictable Pricing for <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                Autonomous AI Operations
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-3">
              Scale your sales pipeline with automated voice discovery calls, CRM synchronization, and instant multi-channel workflows.
            </p>

            {/* CURRENCY & BILLING CONTROLS */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {/* Currency Switcher */}
              <div className="flex items-center rounded-2xl border border-white/10 bg-slate-900/90 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setCurrency("INR");
                    playClickSound();
                  }}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                    currency === "INR"
                      ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🇮🇳 INR (₹)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrency("USD");
                    playClickSound();
                  }}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                    currency === "USD"
                      ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🇺🇸 USD ($)
                </button>
              </div>

              {/* Billing Cycle Toggle */}
              <div className="flex items-center rounded-2xl border border-white/10 bg-slate-900/90 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setBillingCycle("monthly");
                    playClickSound();
                  }}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                    billingCycle === "monthly"
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBillingCycle("yearly");
                    playClickSound();
                  }}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                    billingCycle === "yearly"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>Yearly</span>
                  <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                    SAVE 20%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* PRICING CARDS GRID */}
          <div className="grid gap-6 lg:grid-cols-3 items-stretch mb-16">
            {PLANS.map((plan) => {
              const isPopular = plan.id === "growth_pro";
              const isCurrent = activePlanId === plan.id;

              const monthlyPrice =
                currency === "USD" ? plan.priceUsd : plan.priceInr;
              const effectivePrice =
                billingCycle === "yearly"
                  ? Math.round(monthlyPrice * 0.8)
                  : monthlyPrice;

              const displayFormatted =
                currency === "USD"
                  ? `$${effectivePrice}`
                  : `₹${effectivePrice.toLocaleString("en-IN")}`;

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between rounded-3xl p-7 transition-all duration-300 ${
                    isPopular
                      ? "border-2 border-cyan-400 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950 shadow-2xl shadow-cyan-500/25 lg:-translate-y-2"
                      : "border border-white/10 bg-slate-900/70 hover:border-white/20"
                  }`}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md shadow-cyan-500/40">
                      ⚡ Most Popular Choice
                    </div>
                  )}

                  <div>
                    {/* Tier Icon & Title */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {plan.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {plan.id === "starter" && "For solo founders & small teams"}
                          {plan.id === "growth_pro" && "For fast-scaling sales organizations"}
                          {plan.id === "enterprise" && "Custom high-volume telecom deployments"}
                        </p>
                      </div>
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                          isPopular
                            ? "bg-cyan-500/20 text-cyan-400"
                            : plan.id === "enterprise"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {plan.id === "starter" && <Rocket size={20} />}
                        {plan.id === "growth_pro" && <Zap size={20} />}
                        {plan.id === "enterprise" && <Crown size={20} />}
                      </div>
                    </div>

                    {/* Price Header */}
                    <div className="my-6 border-y border-white/10 py-5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-white">
                          {displayFormatted}
                        </span>
                        <span className="text-xs text-slate-400">
                          / month
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {billingCycle === "yearly"
                          ? "Billed annually (2 months free included)"
                          : "Billed monthly • Cancel anytime"}
                      </p>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3 mb-8 text-xs text-slate-300">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <CheckCircle2
                            size={16}
                            className={`shrink-0 mt-0.5 ${
                              isPopular ? "text-cyan-400" : "text-emerald-400"
                            }`}
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Checkout Button */}
                  <div>
                    {isCurrent ? (
                      <div className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 py-3 text-xs font-bold text-emerald-300">
                        <Check size={16} />
                        Active Subscription
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenCheckout(plan)}
                        className={`w-full rounded-2xl py-3 text-xs font-bold text-white transition active:scale-95 shadow-lg ${
                          isPopular
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/30 hover:brightness-110"
                            : "bg-slate-800 border border-white/10 hover:bg-slate-700"
                        }`}
                      >
                        ⚡ Upgrade to {plan.name}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAYMENT GUARANTEE BADGES */}
          <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-center">
            <div className="flex flex-col items-center">
              <Shield size={24} className="text-cyan-400 mb-2" />
              <h4 className="text-sm font-bold text-white">Bank-Grade Encryption</h4>
              <p className="text-xs text-slate-400 mt-0.5">256-bit TLS security via Stripe & Razorpay</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock size={24} className="text-emerald-400 mb-2" />
              <h4 className="text-sm font-bold text-white">14-Day Money Back</h4>
              <p className="text-xs text-slate-400 mt-0.5">100% unconditional refund if not satisfied</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle2 size={24} className="text-purple-400 mb-2" />
              <h4 className="text-sm font-bold text-white">Cancel Anytime</h4>
              <p className="text-xs text-slate-400 mt-0.5">Zero contracts or locked-in commitments</p>
            </div>
          </div>

        </div>
      </div>

      {/* PAYMENT MODAL */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        plan={selectedPlan}
        currency={currency}
        onSuccess={handlePaymentSuccess}
      />
    </main>
  );
}
