"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function OTPForm() {
  return (
    <section className="relative flex items-center justify-center bg-slate-950 px-6 py-12">

      <div className="absolute h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
      >

        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-cyan-500 p-5">
            <ShieldCheck size={40} className="text-white" />
          </div>
        </div>

        <h2 className="mb-2 text-center text-4xl font-bold">
          Verify OTP
        </h2>

        <p className="mb-8 text-center text-slate-400">
          Enter the 6-digit verification code sent to your email.
        </p>

        <div className="mb-8 flex justify-between gap-3">

          <input maxLength={1} className="h-14 w-14 rounded-xl border border-white/10 bg-slate-900 text-center text-xl outline-none focus:border-cyan-400" />

          <input maxLength={1} className="h-14 w-14 rounded-xl border border-white/10 bg-slate-900 text-center text-xl outline-none focus:border-cyan-400" />

          <input maxLength={1} className="h-14 w-14 rounded-xl border border-white/10 bg-slate-900 text-center text-xl outline-none focus:border-cyan-400" />

          <input maxLength={1} className="h-14 w-14 rounded-xl border border-white/10 bg-slate-900 text-center text-xl outline-none focus:border-cyan-400" />

          <input maxLength={1} className="h-14 w-14 rounded-xl border border-white/10 bg-slate-900 text-center text-xl outline-none focus:border-cyan-400" />

          <input maxLength={1} className="h-14 w-14 rounded-xl border border-white/10 bg-slate-900 text-center text-xl outline-none focus:border-cyan-400" />

        </div>

        <button className="mb-6 w-full rounded-xl bg-cyan-500 py-3 font-semibold text-white hover:bg-cyan-600">
          Verify OTP
        </button>

        <p className="text-center text-slate-400">
          Didn&apos;t receive the code?

          <span className="ml-2 cursor-pointer text-cyan-400 hover:underline">
            Resend
          </span>

        </p>

      </motion.div>

    </section>
  );
}