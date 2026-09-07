"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import {
  User,
  Mail,
  Shield,
  LogOut,
  ArrowLeft,
} from "lucide-react";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("User");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = "/login";
          return;
        }

        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.display_name ||
          user.email?.split("@")[0] ||
          "User";

        if (!mounted) return;

        setFullName(name);
        setEmail(user.email || "");
      } catch (error) {
        console.error("PROFILE ERROR:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020617] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="text-slate-400">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] p-6 text-white md:p-10">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <button
          type="button"
          onClick={() => {
            window.location.href = "/dashboard";
          }}
          className="mb-8 flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            My Profile
          </h1>

          <p className="mt-2 text-slate-400">
            Manage your account information and security.
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70">

          {/* Header */}
          <div className="border-b border-white/10 p-8">
            <div className="flex flex-col items-center gap-5 sm:flex-row">

              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-cyan-500 text-5xl font-bold text-white shadow-lg shadow-cyan-500/20">
                {fullName.charAt(0).toUpperCase()}
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-bold">
                  {fullName}
                </h2>

                <p className="mt-1 text-slate-400">
                  AI Business Platform User
                </p>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  Active
                </div>
              </div>

            </div>
          </div>

          {/* Details */}
          <div className="grid gap-5 p-8 md:grid-cols-2">

            {/* Name */}
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-cyan-500/10 p-3">
                  <User
                    size={22}
                    className="text-cyan-400"
                  />
                </div>

                <span className="text-sm uppercase tracking-wider text-slate-500">
                  Full Name
                </span>
              </div>

              <p className="text-xl font-semibold">
                {fullName}
              </p>
            </div>

            {/* Email */}
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-cyan-500/10 p-3">
                  <Mail
                    size={22}
                    className="text-cyan-400"
                  />
                </div>

                <span className="text-sm uppercase tracking-wider text-slate-500">
                  Email Address
                </span>
              </div>

              <p className="break-all text-xl font-semibold">
                {email}
              </p>
            </div>

            {/* Role */}
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-purple-500/10 p-3">
                  <Shield
                    size={22}
                    className="text-purple-400"
                  />
                </div>

                <span className="text-sm uppercase tracking-wider text-slate-500">
                  Role
                </span>
              </div>

              <p className="text-xl font-semibold">
                Admin
              </p>
            </div>

            {/* Status */}
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-green-500/10 p-3">
                  <Shield
                    size={22}
                    className="text-green-400"
                  />
                </div>

                <span className="text-sm uppercase tracking-wider text-slate-500">
                  Account Status
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-green-400 shadow-lg shadow-green-400/40" />

                <p className="text-xl font-semibold text-green-400">
                  Active
                </p>
              </div>
            </div>

          </div>

          {/* Logout */}
          <div className="border-t border-white/10 p-8">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-3 font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}