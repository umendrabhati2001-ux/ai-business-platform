"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

export default function LoginForm() {
  const router = useRouter();

  // --- States ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Login Handler ---
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-12">
      {/* Background Glow */}
      <div className="absolute h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
      >
        <h2 className="mb-2 text-4xl font-bold text-white">Welcome Back</h2>
        <p className="mb-8 text-slate-400">
          Login to access your AI Business Platform dashboard.
        </p>

        {/* Email Field */}
        <div className="mb-5">
          <label className="mb-2 block text-sm text-slate-300">Email</label>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 transition-colors focus-within:border-cyan-500">
            <Mail size={20} className="text-cyan-400" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="mb-2 block text-sm text-slate-300">Password</label>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 transition-colors focus-within:border-cyan-500">
            <Lock size={20} className="text-cyan-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 transition-colors hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
          {!loading && <ArrowRight size={18} />}
        </button>

        {/* Register Link */}
        <p className="mt-8 text-center text-slate-400">Don&apos;t have an account?
          <a href="/register" className="ml-2 text-cyan-400 hover:underline">
            Create Account
          </a>
        </p>
      </motion.div>
    </section>
  );
}