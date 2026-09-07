"use client";

import { motion } from "framer-motion";
import { UserPlus, Bot, Rocket } from "lucide-react";

const steps = [
  {
    icon: <UserPlus size={34} />,
    title: "Create Account",
    description:
      "Sign up in seconds and access your AI Business Platform dashboard.",
  },
  {
    icon: <Bot size={34} />,
    title: "Connect AI & CRM",
    description:
      "Integrate Salesforce, AI Assistant and your business tools easily.",
  },
  {
    icon: <Rocket size={34} />,
    title: "Grow Your Business",
    description:
      "Automate tasks, analyze data and scale your business faster.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-slate-950 py-28">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-20 text-center">
          <p className="mb-3 font-semibold uppercase tracking-widest text-cyan-400">
            HOW IT WORKS
          </p>

          <h2 className="text-5xl font-extrabold text-white">
            Start In 3 Easy Steps
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
            Everything is designed to make your business smarter,
            faster and fully automated.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
              }}
              viewport={{ once: true }}
              className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                {step.icon}
              </div>

              <h3 className="mb-4 text-2xl font-bold text-white">
                {step.title}
              </h3>

              <p className="leading-7 text-slate-400">
                {step.description}
              </p>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}