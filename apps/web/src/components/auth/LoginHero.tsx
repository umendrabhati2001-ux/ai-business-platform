"use client";

import { motion } from "framer-motion";
import { Bot, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginHero() {
  return (
    <section className="relative hidden overflow-hidden bg-slate-950 lg:flex items-center justify-center">

      {/* Background Glow */}
      <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />
      <div className="absolute right-10 bottom-10 h-80 w-80 rounded-full bg-blue-500/20 blur-[150px]" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-xl px-12"
      >
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500">
          <Bot size={42} className="text-white" />
        </div>

        <h1 className="mb-6 text-6xl font-extrabold leading-tight text-white">
          Welcome
          <br />
          Back
        </h1>

        <p className="mb-12 text-lg leading-8 text-slate-300">
          Sign in to access your AI Business Platform dashboard,
          Salesforce CRM, Analytics, Automation and AI Assistant.
        </p>

        <div className="space-y-6">

          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <ShieldCheck className="text-cyan-400" size={30} />

            <div>
              <h3 className="font-semibold text-white">
                Enterprise Security
              </h3>

              <p className="text-sm text-slate-400">
                Bank-grade encryption & secure authentication.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <Sparkles className="text-cyan-400" size={30} />

            <div>
              <h3 className="font-semibold text-white">
                AI Powered
              </h3>

              <p className="text-sm text-slate-400">
                Experience next-generation AI productivity tools.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Stats */}

        <div className="mt-16 grid grid-cols-3 gap-6">

          <div>
            <h2 className="text-3xl font-bold text-cyan-400">
              50K+
            </h2>

            <p className="text-slate-400">
              Users
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-cyan-400">
              99.9%
            </h2>

            <p className="text-slate-400">
              Uptime
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-cyan-400">
              24/7
            </h2>

            <p className="text-slate-400">
              Support
            </p>
          </div>

        </div>

      </motion.div>

    </section>
  );
}