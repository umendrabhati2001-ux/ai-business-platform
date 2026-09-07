"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    console.log("Register button clicked");

    if (!fullName || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    console.log("Signup data:", data);
    console.log("Signup error:", error);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created successfully!");
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6">

      {/* Background Glow */}
      <div className="absolute h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
      >
        {/* Heading */}
        <h2 className="mb-2 text-4xl font-bold text-white">
          Create Account
        </h2>

        <p className="mb-8 text-slate-400">
          Create your AI Business Platform account.
        </p>

        {/* Full Name */}
        <div className="mb-5">
          <label className="mb-2 block text-sm text-slate-300">
            Full Name
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 transition-colors focus-within:border-cyan-500">
            <User size={20} className="text-cyan-400" />

            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="mb-2 block text-sm text-slate-300">
            Email
          </label>

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

        {/* Password */}
        <div className="mb-5">
          <label className="mb-2 block text-sm text-slate-300">
            Password
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 transition-colors focus-within:border-cyan-500">
            <Lock size={20} className="text-cyan-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 transition-colors hover:text-white"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="mb-2 block text-sm text-slate-300">
            Confirm Password
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 transition-colors focus-within:border-cyan-500">
            <Lock size={20} className="text-cyan-400" />

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="text-slate-400 transition-colors hover:text-white"
            >
              {showConfirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Terms */}
        <div className="mb-8">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              className="accent-cyan-500"
            />

            <span>I agree to the Terms & Conditions</span>
          </label>
        </div>

        {/* Register Button */}
        <button
          type="button"
          onClick={handleRegister}
          disabled={loading}
          className="mb-6 flex w-full items-center justify-center rounded-xl bg-cyan-500 py-3 font-semibold text-white transition-all duration-300 hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-white/10" />

          <span className="mx-4 text-sm text-slate-500">
            OR
          </span>

          <div className="h-px flex-1 bg-white/10" />
        </div>
        {/* Login */}
        <p className="mt-8 text-center text-slate-400">
          Already have an account?

          <a
            href="/login"
            className="ml-2 text-cyan-400 hover:underline"
          >
            Login
          </a>
        </p>
      </motion.div>
    </section>
  );
}