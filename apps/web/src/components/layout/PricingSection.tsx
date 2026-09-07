"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

const plans = [
  {
    name: "Starter",
    inr: "₹0",
    usd: "$0",
    description: "Perfect for students and personal projects.",
    features: [
      "1 Project",
      "Basic Dashboard",
      "AI Assistant",
      "Community Support",
    ],
    popular: false,
  },
  {
    name: "Pro",
    inr: "₹999",
    usd: "$29",
    description: "Best for freelancers, startups and small businesses.",
    features: [
      "Unlimited Projects",
      "Salesforce CRM",
      "AI Automation",
      "Advanced Dashboard",
      "Analytics",
      "Priority Support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    inr: "Custom",
    usd: "Custom",
    description: "Built for enterprises with advanced security.",
    features: [
      "Unlimited Users",
      "Dedicated AI Models",
      "API Access",
      "Custom Integrations",
      "Dedicated Manager",
      "24×7 Premium Support",
    ],
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section className="bg-slate-950 py-28">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-20 text-center">
          <p className="mb-3 font-semibold uppercase tracking-widest text-cyan-400">
            PRICING
          </p>

          <h2 className="text-5xl font-extrabold text-white">
            Choose Your Plan
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
            Flexible pricing for students, startups and enterprises.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
              }}
              className={`relative rounded-3xl border p-10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 ${
                plan.popular
                  ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_40px_rgba(34,211,238,0.2)]"
                  : "border-white/10 bg-white/5"
              }`}
            >

              {plan.popular && (
                <span className="absolute right-6 top-6 rounded-full bg-cyan-400 px-4 py-1 text-xs font-bold text-slate-950">
                  MOST POPULAR
                </span>
              )}

              <h3 className="text-3xl font-bold text-white">
                {plan.name}
              </h3>

              <p className="mt-3 text-slate-400">
                {plan.description}
              </p>

              <div className="mt-8">
                <h2 className="text-5xl font-extrabold text-cyan-400">
                  {plan.inr}
                </h2>

                <p className="mt-2 text-lg text-slate-400">
                  {plan.usd} / month
                </p>
              </div>

              <ul className="mt-10 space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-slate-300"
                  >
                    ✅ {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Button
                  variant={plan.popular ? "primary" : "secondary"}
                >
                  Get Started
                </Button>
              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}