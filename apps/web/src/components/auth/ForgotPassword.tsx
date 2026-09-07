"use client";

import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  return (
    <section className="relative flex items-center justify-center bg-slate-950 px-6 py-12">

      <div className="absolute h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
      >

        <h2 className="mb-2 text-4xl font-bold text-white">
          Forgot Password
        </h2>

        <p className="mb-8 text-slate-400">
          Enter your email and we&apos;ll send you a password reset link.
        </p>

        <label className="mb-2 block text-sm text-slate-300">
          Email
        </label>

        <div className="mb-8 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900 px-4 py-3">

          <Mail size={20} className="text-cyan-400" />

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full bg-transparent outline-none placeholder:text-slate-500"
          />

        </div>

        <button
          className="mb-6 w-full rounded-xl bg-cyan-500 py-3 font-semibold text-white transition-all duration-300 hover:bg-cyan-600"
        >
          Send Reset Link
        </button>

        <a
          href="/login"
          className="flex items-center justify-center gap-2 text-cyan-400 hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Login
        </a>

      </motion.div>

    </section>
  );
}